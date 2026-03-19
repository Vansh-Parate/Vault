import React from 'react'
import { FolderOpen } from 'lucide-react'

interface EmptyStateProps {
  icon?: React.ReactNode
  title: string
  subtitle?: string
  action?: React.ReactNode
}

const EmptyState: React.FC<EmptyStateProps> = ({ icon, title, subtitle, action }) => {
  return (
    <div className="empty-state">
      <div className="empty-state__icon">{icon || <FolderOpen size={40} />}</div>
      <h3 className="empty-state__title">{title}</h3>
      {subtitle && <p className="empty-state__subtitle">{subtitle}</p>}
      {action && <div className="empty-state__action">{action}</div>}
    </div>
  )
}

export default EmptyState
