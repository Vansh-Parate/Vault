import React, { useState, useCallback, useEffect } from 'react'
import { AnimatePresence } from 'framer-motion'
import PopupHeader from '../components/PopupHeader'
import BottomNav from '../components/BottomNav'
import HomeView from './views/HomeView'
import WalletView from './views/WalletView'
import CredentialDetailView from './views/CredentialDetailView'
import PermissionRequestView from './views/PermissionRequestView'
import AccessLogView from './views/AccessLogView'
import SettingsView from './views/SettingsView'
import type { ViewName } from '../types'
import { getPendingRequests } from '../lib/storage'

interface ViewState {
  name: ViewName
  data?: any
}

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>({ name: 'home' })
  const [history, setHistory] = useState<ViewState[]>([])
  const [pendingCount, setPendingCount] = useState(0)

  useEffect(() => {
    loadPendingCount()
  }, [currentView])

  const loadPendingCount = async () => {
    try {
      const pending = await getPendingRequests()
      setPendingCount(pending.length)
    } catch {
      setPendingCount(0)
    }
  }

  const navigate = useCallback(
    (view: string, data?: any) => {
      setHistory((prev) => [...prev, currentView])
      setCurrentView({ name: view as ViewName, data })
    },
    [currentView]
  )

  const goBack = useCallback(() => {
    if (history.length > 0) {
      const prev = history[history.length - 1]
      setHistory((h) => h.slice(0, -1))
      setCurrentView(prev)
    }
  }, [history])

  const switchTab = useCallback((tab: ViewName) => {
    setHistory([])
    setCurrentView({ name: tab })
  }, [])

  const canGoBack = history.length > 0

  const activeTab: ViewName =
    currentView.name === 'credential-detail' || currentView.name === 'share'
      ? 'wallet'
      : currentView.name === 'permission'
        ? 'home'
        : currentView.name

  const renderView = () => {
    switch (currentView.name) {
      case 'home':
        return <HomeView onNavigate={navigate} />
      case 'wallet':
        return (
          <WalletView
            onNavigate={navigate}
            initialCategory={currentView.data?.category}
          />
        )
      case 'credential-detail':
        return (
          <CredentialDetailView
            credentialId={currentView.data?.id}
            onNavigate={navigate}
          />
        )
      case 'permission':
        return <PermissionRequestView onNavigate={navigate} />
      case 'log':
        return <AccessLogView onNavigate={navigate} />
      case 'settings':
        return <SettingsView onNavigate={navigate} />
      default:
        return <HomeView onNavigate={navigate} />
    }
  }

  return (
    <div className="popup-shell">
      <PopupHeader
        canGoBack={canGoBack}
        onBack={goBack}
        pendingCount={pendingCount}
        onNotificationClick={() => navigate('permission')}
        userInitials="AS"
      />
      <main className="popup-main">
        <AnimatePresence mode="wait">{renderView()}</AnimatePresence>
      </main>
      <BottomNav activeTab={activeTab} onTabChange={switchTab} />
    </div>
  )
}

export default App
