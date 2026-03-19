import React, { useState, useEffect } from 'react'
import type { DetectedField } from './FormDetector'
import { fillDetectedFields } from './fillFields'

interface Credential {
  id: string
  title: string
  issuer: string | null
  category: string
  metadata: Record<string, any>
}

interface OverlayProps {
  detectedFields: DetectedField[]
}

const Overlay: React.FC<OverlayProps> = ({ detectedFields }) => {
  const [expanded, setExpanded] = useState(false)
  const [credentials, setCredentials] = useState<Credential[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [filled, setFilled] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [askBeforeFill, setAskBeforeFill] = useState(true)

  useEffect(() => {
    chrome.storage.local.get('settings', (result) => {
      const settings = result.settings || {}
      setAskBeforeFill(settings.askBeforeFill !== false)
    })
  }, [])

  useEffect(() => {
    if (expanded) {
      loadCredentials()
    }
  }, [expanded])

  const loadCredentials = async () => {
    setLoading(true)
    try {
      const categories = [...new Set(detectedFields.map((f) => f.category))]
      const response = await chrome.runtime.sendMessage({
        type: 'FETCH_CREDENTIALS',
        source: 'content' as const,
        payload: { category: categories[0] },
      })
      if (response?.data) {
        setCredentials(response.data)
        if (response.data.length > 0) {
          setSelectedId(response.data[0].id)
        }
      }
    } catch {
      // ignore
    }
    setLoading(false)
  }

  const showPageToast = (message: string) => {
    try {
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
        box-shadow: 0 4px 16px rgba(46, 74, 68, 0.25);
      `
      document.body.appendChild(toast)
      setTimeout(() => toast.remove(), 3000)
    } catch {
      // ignore
    }
  }

  const fillFields = () => {
    const selected = credentials.find((c) => c.id === selectedId)
    if (!selected) return

    const { filledCount } = fillDetectedFields({
      detectedFields,
      credentials: [selected],
    })

    setFilled(true)
    showPageToast(`✓ Vault filled ${filledCount} field${filledCount === 1 ? '' : 's'}`)
    setTimeout(() => {
      setHidden(true)
    }, 2000)
  }

  if (hidden) return null

  const fieldNames = detectedFields.map((f) => f.fieldName).slice(0, 5)

  const getCategoryEmoji = (cat: string) => {
    const map: Record<string, string> = {
      IDENTITY: '🪪',
      EDUCATION: '🎓',
      EMPLOYMENT: '💼',
      FINANCIAL: '🏦',
      HEALTHCARE: '❤️',
      SKILLS: '🏅',
      GOVERNMENT: '🏛️',
    }
    return map[cat] || '📄'
  }

  if (!expanded) {
    return (
      <button className="vault-pill" onClick={() => setExpanded(true)}>
        <span className="vault-pill__icon">◈</span>
        <span>Fill with Vault</span>
      </button>
    )
  }

  return (
    <div className="vault-panel">
      <div className="vault-panel__header">
        <div className="vault-panel__header-left">
          <span className="vault-panel__icon">◈</span>
          <span className="vault-panel__title">Vault</span>
        </div>
        <button className="vault-panel__close" onClick={() => setExpanded(false)}>
          ×
        </button>
      </div>

      <div className="vault-panel__body">
        <p className="vault-panel__label">Fields detected on this page:</p>
        <p className="vault-panel__fields">
          {fieldNames.map((f) => f.charAt(0).toUpperCase() + f.slice(1)).join(' · ')}
        </p>

        <p className="vault-panel__label" style={{ marginTop: 12 }}>
          Fill using:
        </p>

        {loading ? (
          <p className="vault-panel__loading">Loading credentials...</p>
        ) : credentials.length === 0 ? (
          <p className="vault-panel__loading">No matching credentials found</p>
        ) : (
          <div className="vault-panel__list">
            {credentials.slice(0, 4).map((cred) => (
              <button
                key={cred.id}
                className={`vault-panel__cred ${selectedId === cred.id ? 'vault-panel__cred--selected' : ''}`}
                onClick={() => setSelectedId(cred.id)}
              >
                <span className="vault-panel__cred-emoji">
                  {getCategoryEmoji(cred.category)}
                </span>
                <div className="vault-panel__cred-info">
                  <span className="vault-panel__cred-title">{cred.title}</span>
                  <span className="vault-panel__cred-issuer">{cred.issuer}</span>
                </div>
              </button>
            ))}
          </div>
        )}

        {filled ? (
          <div className="vault-panel__success">✓ Fields filled successfully</div>
        ) : (
          <button
            className="vault-panel__fill-btn"
            onClick={fillFields}
            disabled={!selectedId || credentials.length === 0}
          >
            Fill Selected Fields
          </button>
        )}
      </div>
    </div>
  )
}

export default Overlay
