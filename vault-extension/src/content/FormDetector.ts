import { FIELD_PATTERNS } from './fillFields'

export interface DetectedField {
  element: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
  category: string
  fieldName: string
}

export function detectFormFields(): DetectedField[] {
  const fields: DetectedField[] = []
  const inputs = document.querySelectorAll<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>(
    'input, textarea, select'
  )

  inputs.forEach((input) => {
    const attrs = [
      input.name,
      input.id,
      input.getAttribute('autocomplete'),
      input.getAttribute('placeholder'),
      input.getAttribute('aria-label'),
    ]
      .filter(Boolean)
      .join(' ')

    for (const [category, byKey] of Object.entries(FIELD_PATTERNS as any)) {
      for (const [key, patterns] of Object.entries(byKey as any)) {
        for (const pattern of patterns as RegExp[]) {
          if (pattern.test(attrs)) {
            fields.push({
              element: input,
              category,
              fieldName: key,
            })
            return // found a match for this input, move to next
          }
        }
      }
    }
  })

  return fields
}

export class FormDetector {
  private observer: MutationObserver | null = null
  private onDetect: (fields: DetectedField[]) => void

  constructor(onDetect: (fields: DetectedField[]) => void) {
    this.onDetect = onDetect
  }

  start() {
    // Initial scan
    this.scan()

    // Watch for DOM changes (SPAs)
    this.observer = new MutationObserver(() => {
      this.scan()
    })

    this.observer.observe(document.body, {
      childList: true,
      subtree: true,
    })
  }

  stop() {
    this.observer?.disconnect()
    this.observer = null
  }

  private scan() {
    const fields = detectFormFields()
    if (fields.length >= 2) {
      this.onDetect(fields)
    }
  }
}
