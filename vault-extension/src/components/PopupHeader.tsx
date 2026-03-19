import React from 'react'
import { ArrowLeft, Bell, User } from 'lucide-react'

interface PopupHeaderProps {
  canGoBack: boolean
  onBack: () => void
  pendingCount: number
  onNotificationClick: () => void
  userInitials: string
}

const PopupHeader: React.FC<PopupHeaderProps> = ({
  canGoBack,
  onBack,
  pendingCount,
  onNotificationClick,
  userInitials,
}) => {
  return (
    <header className="popup-header">
      <div className="popup-header__left">
        {canGoBack && (
          <button onClick={onBack} className="popup-header__back" aria-label="Go back">
            <ArrowLeft size={18} />
          </button>
        )}
      </div>
      <h1 className="popup-header__title">Vault</h1>
      <div className="popup-header__right">
        <button
          onClick={onNotificationClick}
          className="popup-header__icon-btn"
          aria-label="Notifications"
        >
          <Bell size={16} />
          {pendingCount > 0 && (
            <span className="popup-header__badge">{pendingCount}</span>
          )}
        </button>
        <div className="popup-header__avatar">{userInitials}</div>
      </div>
    </header>
  )
}

export default PopupHeader
