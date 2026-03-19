import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ExternalLink, Bell, ChevronRight } from 'lucide-react'
import type { Stats, Credential, PermissionRequest, Category } from '../../types'
import { api } from '../../lib/api'
import { getPendingRequests, getSettings, saveSettings } from '../../lib/storage'
import { getCategoryIcon } from '../../components/CategoryIcon'
import StatusBadge from '../../components/StatusBadge'
import { CATEGORY_CONFIG, ALL_CATEGORIES } from '../../lib/constants'
import Skeleton from '../../components/Skeleton'
import Toggle from '../../components/Toggle'

interface HomeViewProps {
  onNavigate: (view: string, data?: any) => void
}

const pageTransition = {
  initial: { opacity: 0, y: 6 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -6 },
  transition: { duration: 0.15, ease: 'easeOut' },
}

const HomeView: React.FC<HomeViewProps> = ({ onNavigate }) => {
  const [stats, setStats] = useState<Stats | null>(null)
  const [recentCredentials, setRecentCredentials] = useState<Credential[]>([])
  const [pendingRequests, setPendingRequests] = useState<PermissionRequest[]>([])
  const [connected, setConnected] = useState<boolean | null>(null)
  const [autofillEnabled, setAutofillEnabled] = useState<boolean>(true)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [statsRes, credRes] = await Promise.all([
        api.getStats(),
        api.getCredentials(),
      ])
      setStats(statsRes.data)
      setRecentCredentials(credRes.data.slice(0, 3))
      setConnected(true)
    } catch {
      setConnected(false)
    }

    try {
      const pending = await getPendingRequests()
      setPendingRequests(pending)
    } catch {
      // ignore
    }

    try {
      const s = await getSettings()
      setAutofillEnabled(s.autofillEnabled)
    } catch {
      // ignore
    }

    setLoading(false)
  }

  const setAutofill = async (enabled: boolean) => {
    setAutofillEnabled(enabled)
    await saveSettings({ autofillEnabled: enabled })
    if (!enabled) {
      await chrome.action.setBadgeText({ text: '' })
    }
    const tabs = await chrome.tabs.query({})
    for (const tab of tabs) {
      if (!tab.id) continue
      chrome.tabs
        .sendMessage(tab.id, {
          type: 'AUTOFILL_TOGGLE',
          payload: { enabled },
          source: 'popup',
        })
        .catch(() => {})
    }
  }

  const openDashboard = () => {
    chrome.tabs.create({ url: 'http://localhost:5173' })
  }

  return (
    <motion.div className="view-content" {...pageTransition}>
      {/* Connection Status */}
      <div className="connection-strip">
        <div className="connection-strip__left">
          <span
            className={`connection-strip__dot ${connected ? 'connection-strip__dot--ok' : 'connection-strip__dot--fail'}`}
          />
          <span className="connection-strip__text">
            {connected === null
              ? 'Checking...'
              : connected
                ? 'Connected to Vault'
                : 'Connection failed'}
          </span>
          <span className="connection-strip__endpoint">· localhost:3001</span>
        </div>
        <button className="connection-strip__link" onClick={openDashboard}>
          Open Dashboard <ExternalLink size={10} />
        </button>
      </div>

      {/* Fill with Vault Toggle Strip */}
      <div
        className="toggle-row"
        style={{ marginBottom: 10, cursor: 'default' }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2, paddingRight: 10 }}>
          <span className="toggle-row__label" style={{ marginBottom: 0 }}>
            Fill with Vault
          </span>
          <span style={{ fontSize: 11, color: 'var(--dark-muted)', lineHeight: 1.4 }}>
            Auto-fill forms on websites
          </span>
        </div>
        <Toggle checked={autofillEnabled} onChange={setAutofill} ariaLabel="Fill with Vault" />
      </div>

      {/* Pending Requests Banner */}
      {pendingRequests.length > 0 && (
        <div className="pending-banner">
          <div className="pending-banner__content">
            <Bell size={14} className="pending-banner__icon" />
            <div className="pending-banner__text">
              <strong>{pendingRequests.length} permission request{pendingRequests.length > 1 ? 's' : ''} pending</strong>
              {pendingRequests[0] && (
                <span>
                  {pendingRequests[0].domain} is requesting your{' '}
                  {pendingRequests[0].category.charAt(0) + pendingRequests[0].category.slice(1).toLowerCase()}{' '}
                  credentials
                </span>
              )}
            </div>
          </div>
          <button
            className="pending-banner__btn"
            onClick={() => onNavigate('permission')}
          >
            View
          </button>
        </div>
      )}

      {/* Stats Row */}
      {loading ? (
        <div className="stats-row">
          {[1, 2, 3].map((i) => (
            <div key={i} className="stat-tile">
              <Skeleton width="32px" height="24px" />
              <Skeleton width="48px" height="12px" />
            </div>
          ))}
        </div>
      ) : stats ? (
        <div className="stats-row">
          <div className="stat-tile" onClick={() => onNavigate('wallet')}>
            <span className="stat-tile__number">{stats.totalCredentials}</span>
            <span className="stat-tile__label">Total</span>
          </div>
          <div className="stat-tile">
            <span className="stat-tile__number">{stats.verifiedCount}</span>
            <span className="stat-tile__label">Verified</span>
          </div>
          <div className="stat-tile">
            <span className="stat-tile__number">{stats.totalShared}</span>
            <span className="stat-tile__label">Shared</span>
          </div>
        </div>
      ) : null}

      {/* Quick Access Grid */}
      <div className="section">
        <h3 className="section__title">Quick Access</h3>
        <div className="category-grid">
          {ALL_CATEGORIES.map((cat) => {
            const config = CATEGORY_CONFIG[cat]
            const count = stats?.categories.find((c) => c.category === cat)?.count || 0
            return (
              <button
                key={cat}
                className="category-tile"
                onClick={() => onNavigate('wallet', { category: cat })}
              >
                {getCategoryIcon(cat, 20)}
                <span className="category-tile__label">{config.label}</span>
                {count > 0 && <span className="category-tile__count">{count}</span>}
              </button>
            )
          })}
        </div>
      </div>

      {/* Recent Credentials */}
      {recentCredentials.length > 0 && (
        <div className="section">
          <h3 className="section__title">Recent</h3>
          <div className="recent-list">
            {recentCredentials.map((cred) => (
              <button
                key={cred.id}
                className="recent-item"
                onClick={() => onNavigate('credential-detail', { id: cred.id })}
              >
                <div className="recent-item__icon">
                  {getCategoryIcon(cred.category, 16)}
                </div>
                <span className="recent-item__title">{cred.title}</span>
                <StatusBadge status={cred.status} />
                <ChevronRight size={14} className="recent-item__arrow" />
              </button>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  )
}

export default HomeView
