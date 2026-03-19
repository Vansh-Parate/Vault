import React from 'react'
import { ChevronRight } from 'lucide-react'
import type { Credential } from '../types'
import { getCategoryIcon } from './CategoryIcon'
import StatusBadge from './StatusBadge'

interface CredentialCardProps {
  credential: Credential
  onClick: () => void
}

const CredentialCard: React.FC<CredentialCardProps> = ({ credential, onClick }) => {
  const issuerText = credential.issuer || 'Unknown issuer'
  const dateText = credential.issuedDate
    ? new Date(credential.issuedDate).toLocaleDateString('en-IN', {
        month: 'short',
        year: 'numeric',
      })
    : 'Permanent'

  return (
    <button className="credential-card" onClick={onClick}>
      <div className="credential-card__icon">
        {getCategoryIcon(credential.category, 20)}
      </div>
      <div className="credential-card__info">
        <div className="credential-card__top">
          <span className="credential-card__title">{credential.title}</span>
          <StatusBadge status={credential.status} />
        </div>
        <span className="credential-card__sub">
          {issuerText} · {dateText}
        </span>
      </div>
      <ChevronRight size={16} className="credential-card__arrow" />
    </button>
  )
}

export default CredentialCard
