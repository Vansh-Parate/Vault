import React from 'react'
import type { PermissionRequest } from '../types'

interface PermissionCardProps {
  request: PermissionRequest
  onApprove: () => void
  onDeny: () => void
}

const PermissionCard: React.FC<PermissionCardProps> = ({ request, onApprove, onDeny }) => {
  const faviconUrl = `https://www.google.com/s2/favicons?domain=${request.domain}&sz=32`

  return (
    <div className="permission-card">
      <div className="permission-card__header">
        <img
          src={faviconUrl}
          alt=""
          className="permission-card__favicon"
          width={20}
          height={20}
        />
        <div>
          <span className="permission-card__domain">{request.domain}</span>
          <span className="permission-card__sub">is requesting access to:</span>
        </div>
      </div>

      <div className="permission-card__fields">
        <div className="permission-card__field-box">
          <span className="permission-card__field-title">
            {request.category.charAt(0) + request.category.slice(1).toLowerCase()} Credentials
          </span>
          <span className="permission-card__field-list">{request.fields.join(', ')}</span>
        </div>
      </div>

      <p className="permission-card__note">
        Only the fields listed above will be shared. You can revoke anytime.
      </p>

      <div className="permission-card__actions">
        <button className="vault-btn vault-btn--ghost vault-btn--danger-text" onClick={onDeny}>
          Deny
        </button>
        <button className="vault-btn vault-btn--primary" onClick={onApprove}>
          Allow
        </button>
      </div>
    </div>
  )
}

export default PermissionCard
