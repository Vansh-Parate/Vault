import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Check, X, ExternalLink, Trash2 } from 'lucide-react'
import type { Settings } from '../../types'
import { DEFAULT_SETTINGS } from '../../types'
import { getSettings, saveSettings, clearCache } from '../../lib/storage'
import { api } from '../../lib/api'
import Toggle from '../../components/Toggle'

interface SettingsViewProps {
  onNavigate: (view: string, data?: any) => void
}

const pageTransition = {
  initial: { opacity: 0, y: 6 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -6 },
  transition: { duration: 0.15, ease: 'easeOut' },
}

const SettingsView: React.FC<SettingsViewProps> = ({ onNavigate }) => {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS)
  const [testStatus, setTestStatus] = useState<'idle' | 'success' | 'fail'>('idle')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    const s = await getSettings()
    setSettings(s)
    setLoading(false)
  }

  const updateSetting = async <K extends keyof Settings>(key: K, value: Settings[K]) => {
    const updated = { ...settings, [key]: value }
    setSettings(updated)
    await saveSettings({ [key]: value })

    if (key === 'autofillEnabled') {
      if (!value) {
        await chrome.action.setBadgeText({ text: '' })
      }
      const tabs = await chrome.tabs.query({})
      for (const tab of tabs) {
        if (!tab.id) continue
        chrome.tabs
          .sendMessage(tab.id, {
            type: 'AUTOFILL_TOGGLE',
            payload: { enabled: value },
            source: 'popup',
          })
          .catch(() => {})
      }
    }
  }

  const testConnection = async () => {
    setTestStatus('idle')
    try {
      await api.testConnection()
      setTestStatus('success')
    } catch {
      setTestStatus('fail')
    }
  }

  const handleClearCache = async () => {
    await clearCache()
    alert('Cache cleared!')
  }

  const openDashboard = () => {
    chrome.tabs.create({ url: 'http://localhost:5173' })
  }

  return (
    <motion.div className="view-content" {...pageTransition}>
      {/* Connection */}
      <div className="settings-section">
        <h3 className="settings-section__title">Connection</h3>
        <div className="settings-field">
          <label className="settings-field__label">API Endpoint</label>
          <div className="settings-field__row">
            <input
              type="text"
              value={settings.apiEndpoint}
              onChange={(e) => updateSetting('apiEndpoint', e.target.value)}
              className="settings-field__input"
            />
            <button className="vault-btn vault-btn--ghost" onClick={testConnection}>
              Test
            </button>
          </div>
          {testStatus === 'success' && (
            <div className="settings-field__status settings-field__status--ok">
              <Check size={12} /> Connected
            </div>
          )}
          {testStatus === 'fail' && (
            <div className="settings-field__status settings-field__status--fail">
              <X size={12} /> Failed
            </div>
          )}
        </div>
      </div>

      {/* Auto-fill */}
      <div className="settings-section">
        <h3 className="settings-section__title">Auto-fill</h3>
        <div className="toggle-row">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2, paddingRight: 10 }}>
            <span className="toggle-row__label" style={{ marginBottom: 0 }}>
              Fill with Vault
            </span>
            <span style={{ fontSize: 11, color: 'var(--dark-muted)', lineHeight: 1.4 }}>
              Detect form fields and offer to fill them using your credentials
            </span>
          </div>
          <Toggle
            checked={settings.autofillEnabled}
            onChange={(v) => updateSetting('autofillEnabled', v)}
            ariaLabel="Fill with Vault"
          />
        </div>

        <div className="toggle-row">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2, paddingRight: 10 }}>
            <span className="toggle-row__label" style={{ marginBottom: 0 }}>
              Ask before filling (recommended)
            </span>
            <span style={{ fontSize: 11, color: 'var(--dark-muted)', lineHeight: 1.4 }}>
              Show approval prompt before filling any field
            </span>
          </div>
          <Toggle
            checked={settings.askBeforeFill}
            onChange={(v) => updateSetting('askBeforeFill', v)}
            ariaLabel="Ask before filling"
          />
        </div>
      </div>

      {/* Notifications */}
      <div className="settings-section">
        <h3 className="settings-section__title">Notifications</h3>
        <ToggleRow
          label="Permission request notifications"
          checked={settings.permissionNotifications}
          onChange={(v) => updateSetting('permissionNotifications', v)}
        />
        <ToggleRow
          label="Credential expiry alerts"
          checked={settings.expiryAlerts}
          onChange={(v) => updateSetting('expiryAlerts', v)}
        />
      </div>

      {/* Data */}
      <div className="settings-section">
        <h3 className="settings-section__title">Data</h3>
        <button
          className="vault-btn vault-btn--ghost vault-btn--danger-text vault-btn--full"
          onClick={handleClearCache}
        >
          <Trash2 size={13} /> Clear cached credentials
        </button>
        <button
          className="vault-btn vault-btn--primary vault-btn--full"
          onClick={openDashboard}
          style={{ marginTop: 8 }}
        >
          <ExternalLink size={13} /> Open full dashboard
        </button>
      </div>
    </motion.div>
  )
}

export default SettingsView

const ToggleRow: React.FC<{
  label: string
  checked: boolean
  onChange: (v: boolean) => void
}> = ({ label, checked, onChange }) => (
  <div className="toggle-row" style={{ cursor: 'default' }}>
    <span className="toggle-row__label">{label}</span>
    <Toggle checked={checked} onChange={onChange} ariaLabel={label} />
  </div>
)
