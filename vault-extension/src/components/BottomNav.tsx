import React from 'react'
import { Home, Wallet, List, Settings } from 'lucide-react'
import type { ViewName } from '../types'
import clsx from 'clsx'

interface BottomNavProps {
  activeTab: ViewName
  onTabChange: (tab: ViewName) => void
}

const tabs: { id: ViewName; label: string; Icon: React.FC<any> }[] = [
  { id: 'home', label: 'Home', Icon: Home },
  { id: 'wallet', label: 'Wallet', Icon: Wallet },
  { id: 'log', label: 'Log', Icon: List },
  { id: 'settings', label: 'Settings', Icon: Settings },
]

const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange }) => {
  return (
    <nav className="bottom-nav">
      {tabs.map(({ id, label, Icon }) => (
        <button
          key={id}
          onClick={() => onTabChange(id)}
          className={clsx('bottom-nav__tab', activeTab === id && 'bottom-nav__tab--active')}
        >
          <Icon size={18} />
          <span>{label}</span>
        </button>
      ))}
    </nav>
  )
}

export default BottomNav
