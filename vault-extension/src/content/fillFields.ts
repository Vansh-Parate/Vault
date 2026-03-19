import type { DetectedField } from './FormDetector'

export const FIELD_PATTERNS = {
  IDENTITY: {
    fullName: [/full.?name/i, /your.?name/i, /applicant.?name/i, /name/i],
    dateOfBirth: [/dob/i, /date.?of.?birth/i, /birth.?date/i],
    gender: [/gender/i, /sex/i],
    aadhaarLast4: [/aadhaar/i, /aadhar/i, /uid/i],
    panNumber: [/pan/i, /permanent.?account/i],
    dlNumber: [/driving.?license/i, /dl.?no/i, /licence/i],
    address: [/address/i, /street/i, /residence/i],
    idType: [/id.?type/i, /document.?type/i],
  },
  EDUCATION: {
    institution: [/institution/i, /university/i, /college/i, /school/i],
    degree: [/degree/i, /qualification/i, /certificate/i],
    fieldOfStudy: [/field/i, /major/i, /branch/i, /stream/i],
    graduationDate: [/graduation/i, /passing/i, /grad.?year/i],
    grade: [/grade/i, /percentage/i, /cgpa/i, /gpa/i],
  },
} as const

const CREDENTIAL_PRIORITY: Record<string, Array<'aadhaar' | 'pan' | 'driving_license'>> = {
  fullName: ['aadhaar', 'pan', 'driving_license'],
  dateOfBirth: ['aadhaar', 'driving_license', 'pan'],
  address: ['aadhaar', 'driving_license'],
  panNumber: ['pan'],
  aadhaarLast4: ['aadhaar'],
  dlNumber: ['driving_license'],
}

type CredentialLike = {
  title: string
  metadata: Record<string, any>
}

const getFieldText = (el: HTMLElement) => {
  const label = el.getAttribute('aria-label') || ''
  const placeholder = (el as HTMLInputElement).placeholder || ''
  const name = (el as HTMLInputElement).name || ''
  const id = (el as HTMLInputElement).id || ''
  const autocomplete = el.getAttribute('autocomplete') || ''
  return `${label} ${placeholder} ${name} ${id} ${autocomplete}`.trim()
}

const docKindFromCredential = (c: CredentialLike): 'aadhaar' | 'pan' | 'driving_license' | 'unknown' => {
  const t = (c.title || '').toLowerCase()
  if (t.includes('aadhaar')) return 'aadhaar'
  if (t.includes('pan')) return 'pan'
  if (t.includes('driving')) return 'driving_license'
  const idType = (c.metadata?.idType || '').toLowerCase()
  if (idType.includes('aadhaar')) return 'aadhaar'
  if (idType === 'pan') return 'pan'
  if (idType.includes('driving')) return 'driving_license'
  return 'unknown'
}

const matchKey = (category: string, text: string): string | null => {
  const patternsByKey: Record<string, Record<string, RegExp[]>> = FIELD_PATTERNS as any
  const group = patternsByKey[category]
  if (!group) return null

  for (const [key, patterns] of Object.entries(group)) {
    if (patterns.some((p) => p.test(text))) return key
  }
  return null
}

function setElementValue(el: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement, value: string) {
  const tag = el.tagName
  const proto =
    tag === 'TEXTAREA'
      ? window.HTMLTextAreaElement.prototype
      : tag === 'SELECT'
        ? window.HTMLSelectElement.prototype
        : window.HTMLInputElement.prototype
  const setter = Object.getOwnPropertyDescriptor(proto, 'value')?.set
  if (setter) setter.call(el, value)
  else (el as any).value = value
  el.dispatchEvent(new Event('input', { bubbles: true }))
  el.dispatchEvent(new Event('change', { bubbles: true }))
}

export function fillDetectedFields(args: {
  detectedFields: DetectedField[]
  credentials: CredentialLike[]
}): { filledCount: number } {
  const { detectedFields, credentials } = args
  if (credentials.length === 0) return { filledCount: 0 }

  let filledCount = 0

  for (const field of detectedFields) {
    const text = getFieldText(field.element)
    const key = matchKey(field.category, text)
    if (!key) continue

    const priority = CREDENTIAL_PRIORITY[key]
    let chosen: CredentialLike | null = null

    if (priority) {
      for (const kind of priority) {
        const found = credentials.find((c) => docKindFromCredential(c) === kind && c.metadata?.[key] != null)
        if (found) {
          chosen = found
          break
        }
      }
    }

    if (!chosen) {
      chosen = credentials.find((c) => c.metadata?.[key] != null) || null
    }

    const value = chosen?.metadata?.[key]
    if (value == null) continue

    setElementValue(field.element as any, String(value))
    filledCount += 1
  }

  return { filledCount }
}

