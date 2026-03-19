import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Download, Copy, Check, Paperclip, Share2 } from 'lucide-react'
import type { Credential } from '../../types'
import { api } from '../../lib/api'
import { getCategoryIcon } from '../../components/CategoryIcon'
import StatusBadge from '../../components/StatusBadge'
import Skeleton from '../../components/Skeleton'
import { EXPIRY_OPTIONS } from '../../lib/constants'

interface CredentialDetailViewProps {
  credentialId: string
  onNavigate: (view: string, data?: any) => void
}

const pageTransition = {
  initial: { opacity: 0, y: 6 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -6 },
  transition: { duration: 0.15, ease: 'easeOut' },
}

const CredentialDetailView: React.FC<CredentialDetailViewProps> = ({
  credentialId,
  onNavigate,
}) => {
  const [credential, setCredential] = useState<Credential | null>(null)
  const [loading, setLoading] = useState(true)
  const [showShare, setShowShare] = useState(false)
  const [expiresIn, setExpiresIn] = useState('24h')
  const [shareLink, setShareLink] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [generating, setGenerating] = useState(false)

  useEffect(() => {
    loadCredential()
  }, [credentialId])

  const loadCredential = async () => {
    setLoading(true)
    try {
      const res = await api.getCredential(credentialId)
      setCredential(res.data)
    } catch {
      setCredential(null)
    }
    setLoading(false)
  }

  const generateLink = async () => {
    if (!credential) return
    setGenerating(true)
    try {
      const res = await api.generateShareLink(credential.id, expiresIn)
      const link = `http://localhost:5173/share/${res.data.token}`
      setShareLink(link)
    } catch {
      // error
    }
    setGenerating(false)
  }

  const copyLink = async () => {
    if (!shareLink) return
    await navigator.clipboard.writeText(shareLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (loading) {
    return (
      <motion.div className="view-content detail-view" {...pageTransition}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: 16 }}>
          <Skeleton width="48px" height="48px" rounded />
          <Skeleton width="60%" height="18px" />
          <Skeleton width="80%" height="13px" />
          <Skeleton width="100%" height="1px" />
          <Skeleton width="100%" height="80px" />
        </div>
      </motion.div>
    )
  }

  if (!credential) {
    return (
      <motion.div className="view-content detail-view" {...pageTransition}>
        <div className="empty-state">
          <h3 className="empty-state__title">Credential not found</h3>
        </div>
      </motion.div>
    )
  }

  const metadata = credential.metadata || {}
  const metadataEntries = Object.entries(metadata).filter(
    ([, v]) => v !== null && v !== undefined && v !== ''
  )

  return (
    <motion.div className="view-content detail-view" {...pageTransition}>
      {/* Header area */}
      <div className="detail-view__header">
        <div className="detail-view__icon-wrap">
          {getCategoryIcon(credential.category, 28)}
        </div>
        <StatusBadge status={credential.status} />
      </div>

      <h2 className="detail-view__title">{credential.title}</h2>
      <p className="detail-view__subtitle">
        {credential.issuer || 'Unknown issuer'} ·{' '}
        {credential.issuedDate
          ? new Date(credential.issuedDate).toLocaleDateString('en-IN', {
              month: 'short',
              year: 'numeric',
            })
          : 'Permanent'}
      </p>

      {/* Divider */}
      <div className="detail-view__divider" />

      {/* Details */}
      {metadataEntries.length > 0 && (
        <>
          <h3 className="detail-view__section-title">Details</h3>
          <div className="detail-view__metadata">
            {metadataEntries.map(([key, value]) => (
              <div key={key} className="detail-view__row">
                <span className="detail-view__label">
                  {key.replace(/([A-Z])/g, ' $1').replace(/^./, (s) => s.toUpperCase())}
                </span>
                <span className="detail-view__value">{String(value)}</span>
              </div>
            ))}
          </div>
          <div className="detail-view__divider" />
        </>
      )}

      {/* Document */}
      {credential.documentUrl && (
        <>
          <div className="detail-view__document">
            <div className="detail-view__doc-info">
              <Paperclip size={14} />
              <span>{credential.documentName || 'Document attached'}</span>
            </div>
            <button
              className="vault-btn vault-btn--ghost"
              onClick={() =>
                window.open(`http://localhost:3001${credential.documentUrl}`, '_blank')
              }
            >
              <Download size={14} /> Download
            </button>
          </div>
          <div className="detail-view__divider" />
        </>
      )}

      {/* Share Button */}
      <button
        className="vault-btn vault-btn--primary vault-btn--full"
        onClick={() => setShowShare(!showShare)}
      >
        <Share2 size={14} /> Share This Credential
      </button>

      {/* Share Flow (inline expand) */}
      {showShare && (
        <motion.div
          className="share-flow"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ duration: 0.15 }}
        >
          <label className="share-flow__label">Expires in:</label>
          <select
            value={expiresIn}
            onChange={(e) => setExpiresIn(e.target.value)}
            className="share-flow__select"
          >
            {EXPIRY_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          <button
            className="vault-btn vault-btn--primary vault-btn--full"
            onClick={generateLink}
            disabled={generating}
          >
            {generating ? 'Generating...' : 'Generate Link'}
          </button>

          {shareLink && (
            <div className="share-flow__link">
              <input
                type="text"
                value={shareLink}
                readOnly
                className="share-flow__link-input"
              />
              <button className="share-flow__copy-btn" onClick={copyLink}>
                {copied ? <Check size={14} /> : <Copy size={14} />}
              </button>
            </div>
          )}

          <div className="share-flow__divider">
            <span>OR</span>
          </div>

          <p className="share-flow__note">
            When a website requests this credential, you'll get a notification to approve or
            deny.
          </p>
        </motion.div>
      )}
    </motion.div>
  )
}

export default CredentialDetailView
