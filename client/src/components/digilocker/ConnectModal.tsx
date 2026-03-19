import { useEffect, useMemo, useState } from 'react'
import { CheckCircle2, Loader2, XCircle } from 'lucide-react'
import Modal from '../ui/Modal'
import Button from '../ui/Button'
import api from '../../lib/api'

type Status = 'created' | 'succeeded' | 'failed' | 'expired'

interface Props {
  isOpen: boolean
  onClose: () => void
  sessionId: string | null
  onImported: (result: { imported: Array<{ title: string; id: string }> }) => void
}

export default function ConnectModal({ isOpen, onClose, sessionId, onImported }: Props) {
  const [status, setStatus] = useState<Status | null>(null)
  const [importing, setImporting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const canPoll = useMemo(() => isOpen && Boolean(sessionId), [isOpen, sessionId])

  useEffect(() => {
    if (!isOpen) {
      setStatus(null)
      setImporting(false)
      setError(null)
      return
    }
  }, [isOpen])

  useEffect(() => {
    if (!canPoll || !sessionId) return

    let cancelled = false
    let timer: number | null = null

    const tick = async () => {
      try {
        const res = await api.get(`/digilocker/session/${sessionId}/status`)
        const s = res.data?.status as Status
        if (cancelled) return
        setStatus(s)

        if (s === 'succeeded') {
          if (!importing) {
            setImporting(true)
            const importRes = await api.post(`/digilocker/session/${sessionId}/import`)
            if (cancelled) return
            onImported(importRes.data)
          }
          return
        }

        if (s === 'failed' || s === 'expired') return

        timer = window.setTimeout(tick, 3000)
      } catch (e: any) {
        if (cancelled) return
        setError('Failed to check DigiLocker status.')
      }
    }

    tick()

    return () => {
      cancelled = true
      if (timer) window.clearTimeout(timer)
    }
  }, [canPoll, sessionId, importing, onImported])

  const content = (() => {
    if (error) {
      return (
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <XCircle size={18} className="text-danger mt-0.5" />
            <p className="text-sm text-dark-muted font-sans">{error}</p>
          </div>
          <Button variant="ghost" fullWidth onClick={onClose}>
            Close
          </Button>
        </div>
      )
    }

    if (status === 'failed' || status === 'expired') {
      return (
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <XCircle size={18} className="text-danger mt-0.5" />
            <div>
              <p className="text-sm text-dark font-sans font-medium">Authorization {status === 'expired' ? 'expired' : 'failed'}</p>
              <p className="text-sm text-dark-muted font-sans">Please retry the connect flow.</p>
            </div>
          </div>
          <Button variant="ghost" fullWidth onClick={onClose}>
            Close
          </Button>
        </div>
      )
    }

    if (status === 'succeeded' && importing) {
      return (
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <Loader2 size={18} className="text-sage mt-0.5 animate-spin" />
            <div>
              <p className="text-sm text-dark font-sans font-medium">Importing documents…</p>
              <p className="text-sm text-dark-muted font-sans">Saving verified credentials to your wallet.</p>
            </div>
          </div>
        </div>
      )
    }

    return (
      <div className="space-y-4">
        <div className="flex items-start gap-3">
          {status === 'succeeded' ? (
            <CheckCircle2 size={18} className="text-sage mt-0.5" />
          ) : (
            <Loader2 size={18} className="text-sage mt-0.5 animate-spin" />
          )}
          <div>
            <p className="text-sm text-dark font-sans font-medium">Waiting for DigiLocker authorization</p>
            <p className="text-sm text-dark-muted font-sans">
              We opened DigiLocker in a new tab. Complete verification there, then come back here.
            </p>
            <p className="text-xs text-dark-muted font-sans mt-2">Checking status every 3 seconds…</p>
          </div>
        </div>
        <Button variant="ghost" fullWidth onClick={onClose}>
          Cancel
        </Button>
      </div>
    )
  })()

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="DigiLocker">
      {content}
    </Modal>
  )
}

