import { Router } from 'express'
import fs from 'fs'
import path from 'path'
import prisma from '../lib/prisma'
import { isSandboxConfigured, sandboxRequest } from '../lib/sandboxAuth'
import { parseDigiLockerXML, type DigiLockerDocType } from '../lib/parseDigiLockerXML'

const router = Router()
const getUserId = () => process.env.MOCK_USER_ID!

const redirectUrl = () => process.env.DIGILOCKER_REDIRECT_URL || 'http://localhost:5173/digilocker/callback'
const uploadRoot = () => path.join(process.cwd(), process.env.UPLOAD_DIR || './uploads')
const digilockerDir = () => path.join(uploadRoot(), 'digilocker')

const ensureDigiLockerDir = () => {
  const dir = digilockerDir()
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
  return dir
}

type SandboxInitResponse = {
  data: { session_id: string; authorization_url: string }
}

type SandboxStatusResponse = {
  data: { status: 'created' | 'succeeded' | 'failed' | 'expired' }
}

type SandboxProfileResponse = {
  data: {
    name?: string
    date_of_birth?: string
    mobile?: string
    gender?: string
    email?: string
    eaadhaar?: boolean
  }
}

type SandboxDocumentsResponse = {
  data?: {
    files?: Array<{
      url: string
      size?: number
      metadata?: {
        ContentType?: string
        issuer_id?: string
        issuer?: string
        description?: string
      }
    }>
  }
}

const isConfiguredGuard = (res: any) => {
  if (!isSandboxConfigured()) {
    res.status(501).json({ error: 'DigiLocker is not configured on server', configured: false })
    return false
  }
  return true
}

// POST /api/digilocker/session/init
router.post('/session/init', async (_req, res) => {
  try {
    if (!isConfiguredGuard(res)) return
    const userId = getUserId()

    const initRes = await sandboxRequest<SandboxInitResponse>('/kyc/digilocker/sessions/init', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        '@entity': 'in.co.sandbox.kyc.digilocker.session.request',
        flow: 'signin',
        doc_types: ['aadhaar', 'pan', 'driving_license'],
        redirect_url: redirectUrl(),
      }),
    })

    const sessionId = initRes.data.session_id

    await prisma.digiLockerSession.create({
      data: {
        userId,
        sessionId,
        status: 'created',
        docTypes: ['aadhaar', 'pan', 'driving_license'],
      },
    })

    res.json({ session_id: sessionId, authorization_url: initRes.data.authorization_url })
  } catch (error: any) {
    console.error('DigiLocker init error:', error?.message || error)
    res.status(500).json({ error: 'Failed to initiate DigiLocker session' })
  }
})

// GET /api/digilocker/session/:id/status
router.get('/session/:id/status', async (req, res) => {
  try {
    if (!isConfiguredGuard(res)) return
    const sessionId = req.params.id

    const statusRes = await sandboxRequest<SandboxStatusResponse>(`/kyc/digilocker/sessions/${sessionId}/status`, {
      method: 'GET',
    })

    await prisma.digiLockerSession.updateMany({
      where: { sessionId },
      data: { status: statusRes.data.status },
    })

    res.json({ status: statusRes.data.status })
  } catch (error: any) {
    console.error('DigiLocker status error:', error?.message || error)
    res.status(500).json({ error: 'Failed to fetch DigiLocker status' })
  }
})

// GET /api/digilocker/session/:id/profile
router.get('/session/:id/profile', async (req, res) => {
  try {
    if (!isConfiguredGuard(res)) return
    const sessionId = req.params.id

    const profile = await sandboxRequest<SandboxProfileResponse>(
      `/kyc/digilocker/sessions/${sessionId}/user/profile`,
      { method: 'GET', headers: { 'x-api-version': '2.0' } }
    )

    res.json(profile.data)
  } catch (error: any) {
    console.error('DigiLocker profile error:', error?.message || error)
    res.status(500).json({ error: 'Failed to fetch DigiLocker profile' })
  }
})

const fetchXml = async (url: string) => {
  const res = await fetch(url)
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`Failed to fetch XML (${res.status}): ${text || res.statusText}`)
  }
  return await res.text()
}

const parseDateMaybe = (raw?: string): Date | null => {
  if (!raw) return null
  const s = raw.trim()
  if (!s) return null
  const normalized = s.replace(/\./g, '-').replace(/\//g, '-')
  const isoLike = /^\d{4}-\d{2}-\d{2}$/.test(normalized) ? normalized : null
  if (isoLike) {
    const d = new Date(isoLike)
    return isNaN(d.getTime()) ? null : d
  }
  const d = new Date(s)
  return isNaN(d.getTime()) ? null : d
}

async function upsertDigiLockerCredential(args: {
  userId: string
  title: string
  issuer?: string
  issuedDate?: Date | null
  expiryDate?: Date | null
  documentUrl: string
  documentName: string
  metadata: Record<string, any>
}) {
  const existing = await prisma.credential.findFirst({
    where: { userId: args.userId, source: 'DIGILOCKER', title: args.title },
  })

  if (existing) {
    return prisma.credential.update({
      where: { id: existing.id },
      data: {
        issuer: args.issuer,
        issuedDate: args.issuedDate ?? null,
        expiryDate: args.expiryDate ?? null,
        status: 'VERIFIED',
        source: 'DIGILOCKER',
        visibility: 'PRIVATE',
        documentUrl: args.documentUrl,
        documentName: args.documentName,
        metadata: args.metadata,
      },
    })
  }

  return prisma.credential.create({
    data: {
      userId: args.userId,
      category: 'IDENTITY',
      title: args.title,
      issuer: args.issuer,
      issuedDate: args.issuedDate ?? undefined,
      expiryDate: args.expiryDate ?? undefined,
      status: 'VERIFIED',
      visibility: 'PRIVATE',
      source: 'DIGILOCKER',
      documentUrl: args.documentUrl,
      documentName: args.documentName,
      metadata: args.metadata,
    },
  })
}

// POST /api/digilocker/session/:id/import
router.post('/session/:id/import', async (req, res) => {
  try {
    if (!isConfiguredGuard(res)) return
    const userId = getUserId()
    const sessionId = req.params.id
    const docTypes: DigiLockerDocType[] = ['aadhaar', 'pan', 'driving_license']

    ensureDigiLockerDir()

    const statusRes = await sandboxRequest<SandboxStatusResponse>(`/kyc/digilocker/sessions/${sessionId}/status`, { method: 'GET' })
    if (statusRes.data.status !== 'succeeded') {
      return res.status(400).json({ error: 'Session is not authorized yet', status: statusRes.data.status })
    }

    const results: Array<{ title: string; id: string }> = []

    for (const docType of docTypes) {
      const docsRes = await sandboxRequest<SandboxDocumentsResponse>(
        `/kyc/digilocker/sessions/${sessionId}/documents/${docType}`,
        { method: 'GET' }
      )

      const file = docsRes.data?.files?.[0]
      if (!file?.url) continue

      const xml = await fetchXml(file.url)
      const parsed = parseDigiLockerXML(xml, docType)

      const filename = `${docType}_${sessionId}.xml`
      const absPath = path.join(digilockerDir(), filename)
      fs.writeFileSync(absPath, xml, 'utf8')

      if (docType === 'aadhaar') {
        const cred = await upsertDigiLockerCredential({
          userId,
          title: 'Aadhaar Card',
          issuer: file.metadata?.issuer || 'Unique Identification Authority of India (UIDAI)',
          issuedDate: null,
          expiryDate: null,
          documentUrl: `/uploads/digilocker/${filename}`,
          documentName: 'Aadhaar_Card.xml',
          metadata: {
            ...parsed,
          },
        })
        results.push({ title: cred.title, id: cred.id })
      } else if (docType === 'pan') {
        const cred = await upsertDigiLockerCredential({
          userId,
          title: 'PAN Card',
          issuer: 'Income Tax Department, Government of India',
          issuedDate: null,
          expiryDate: null,
          documentUrl: `/uploads/digilocker/${filename}`,
          documentName: 'PAN_Card.xml',
          metadata: { ...parsed },
        })
        results.push({ title: cred.title, id: cred.id })
      } else {
        const issued = parseDateMaybe(parsed.issuedDateRaw)
        const expiry = parseDateMaybe(parsed.expiryDateRaw)
        const { issuedDateRaw, expiryDateRaw, ...meta } = parsed
        const cred = await upsertDigiLockerCredential({
          userId,
          title: 'Driving License',
          issuer: 'Regional Transport Authority',
          issuedDate: issued,
          expiryDate: expiry,
          documentUrl: `/uploads/digilocker/${filename}`,
          documentName: 'Driving_License.xml',
          metadata: meta,
        })
        results.push({ title: cred.title, id: cred.id })
      }
    }

    await prisma.digiLockerSession.updateMany({
      where: { sessionId },
      data: { status: 'succeeded', importedAt: new Date() },
    })

    res.json({ imported: results })
  } catch (error: any) {
    console.error('DigiLocker import error:', error?.message || error)
    res.status(500).json({ error: 'Failed to import DigiLocker documents' })
  }
})

// GET /api/digilocker/status
router.get('/status', async (_req, res) => {
  try {
    const userId = getUserId()

    const lastSession = await prisma.digiLockerSession.findFirst({
      where: { userId, importedAt: { not: null } },
      orderBy: { importedAt: 'desc' },
    })

    const importedCount = await prisma.credential.count({
      where: { userId, source: 'DIGILOCKER' },
    })

    res.json({
      configured: isSandboxConfigured(),
      connected: Boolean(lastSession),
      lastSynced: lastSession?.importedAt || null,
      importedCount,
    })
  } catch (error: any) {
    console.error('DigiLocker status summary error:', error?.message || error)
    res.status(500).json({ error: 'Failed to fetch DigiLocker connection status' })
  }
})

export default router

