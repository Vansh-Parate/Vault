import React from 'react'
import ReactDOM from 'react-dom/client'
import { FormDetector, detectFormFields } from './FormDetector'
import type { DetectedField } from './FormDetector'
import Overlay from './Overlay'
import { fillDetectedFields } from './fillFields'
// @ts-ignore
import overlayCSSRaw from './overlay.css?raw'

let overlayRoot: HTMLDivElement | null = null

function injectOverlay(detectedFields: DetectedField[]) {
  // Check settings first
  chrome.storage.local.get('settings', (result) => {
    const settings = result.settings || {}
    if (settings.showOverlay === false || settings.autofillEnabled === false) {
      return
    }

    if (overlayRoot) return

    // Create shadow DOM host
    const host = document.createElement('div')
    host.id = 'vault-extension-root'
    document.body.appendChild(host)
    overlayRoot = host

    const shadow = host.attachShadow({ mode: 'open' })
    const mountPoint = document.createElement('div')

    // Inject styles into shadow root
    const style = document.createElement('style')
    style.textContent = overlayCSSRaw
    shadow.appendChild(style)
    shadow.appendChild(mountPoint)

    // Mount React overlay
    ReactDOM.createRoot(mountPoint).render(
      <Overlay detectedFields={detectedFields} />
    )
  })
}

function destroyOverlay() {
  const existing = document.getElementById('vault-extension-root')
  if (existing) existing.remove()
  overlayRoot = null
}

function reinitOverlay() {
  destroyOverlay()
  const detected = detectFormFields()
  if (detected.length > 0) {
    injectOverlay(detected)
  }
}

function showPageToast(message: string) {
  const existing = document.getElementById('vault-page-toast')
  if (existing) existing.remove()

  const toast = document.createElement('div')
  toast.id = 'vault-page-toast'
  toast.textContent = message
  toast.style.cssText = `
    position: fixed;
    bottom: 80px;
    right: 24px;
    background: #2E4A44;
    color: #E7E2D3;
    font-family: 'Instrument Sans', sans-serif;
    font-size: 13px;
    padding: 10px 16px;
    border-radius: 8px;
    z-index: 2147483647;
    animation: vaultToastIn 0.2s ease forwards;
  `

  const style = document.createElement('style')
  style.textContent = `
    @keyframes vaultToastIn {
      from { opacity: 0; transform: translateY(8px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `
  document.head.appendChild(style)

  document.body.appendChild(toast)
  setTimeout(() => {
    toast.remove()
    style.remove()
  }, 3000)
}

async function getSettings(): Promise<any> {
  const result = await chrome.storage.local.get('settings')
  return result.settings || {}
}

async function maybeAutoFill(fields: DetectedField[]): Promise<boolean> {
  const settings = await getSettings()
  if (settings.autofillEnabled === false) return false
  if (settings.askBeforeFill !== false) return false

  const categories = [...new Set(fields.map((f) => f.category))]
  const category = categories[0]

  const response = await chrome.runtime.sendMessage({
    type: 'FETCH_CREDENTIALS',
    source: 'content' as const,
    payload: { category },
  })

  const creds = response?.data || []
  if (creds.length !== 1) return false

  const { filledCount } = fillDetectedFields({
    detectedFields: fields,
    credentials: creds,
  })

  showPageToast(`✓ Vault filled ${filledCount} field${filledCount === 1 ? '' : 's'}`)
  return true
}

// Start form detection
const detector = new FormDetector((fields) => {
  ;(async () => {
    try {
      const didAuto = await maybeAutoFill(fields)
      if (didAuto) return
    } catch {
      // ignore
    }
    injectOverlay(fields)
  })()
})

// Wait for DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => detector.start())
} else {
  detector.start()
}

// Listen for messages from background
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.type === 'AUTOFILL_DATA' && message.payload?.fields) {
    // Auto-fill fields from background
    const inputs = document.querySelectorAll<HTMLInputElement>('input, textarea')
    const data = message.payload.fields as Record<string, string>

    inputs.forEach((input) => {
      const name = input.name || input.id || ''
      for (const [key, value] of Object.entries(data)) {
        if (name.toLowerCase().includes(key.toLowerCase())) {
          input.value = value
          input.dispatchEvent(new Event('input', { bubbles: true }))
          input.dispatchEvent(new Event('change', { bubbles: true }))
        }
      }
    })

    sendResponse({ success: true })
  }
  if (message.type === 'AUTOFILL_TOGGLE') {
    const enabled = Boolean(message.payload?.enabled)
    if (enabled) {
      reinitOverlay()
    } else {
      destroyOverlay()
    }
    sendResponse({ success: true })
  }
  return true
})
