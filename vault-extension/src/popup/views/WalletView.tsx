import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import type { Credential, Category } from '../../types'
import { api } from '../../lib/api'
import CredentialCard from '../../components/CredentialCard'
import SearchInput from '../../components/SearchInput'
import EmptyState from '../../components/EmptyState'
import Skeleton from '../../components/Skeleton'
import { ALL_CATEGORIES, CATEGORY_CONFIG } from '../../lib/constants'
import clsx from 'clsx'

interface WalletViewProps {
  onNavigate: (view: string, data?: any) => void
  initialCategory?: Category
}

const pageTransition = {
  initial: { opacity: 0, y: 6 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -6 },
  transition: { duration: 0.15, ease: 'easeOut' },
}

const WalletView: React.FC<WalletViewProps> = ({ onNavigate, initialCategory }) => {
  const [credentials, setCredentials] = useState<Credential[]>([])
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState<Category | 'ALL'>(initialCategory || 'ALL')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadCredentials()
  }, [activeCategory, search])

  const loadCredentials = async () => {
    setLoading(true)
    try {
      const params: any = {}
      if (activeCategory !== 'ALL') params.category = activeCategory
      if (search) params.search = search
      const res = await api.getCredentials(params)
      setCredentials(res.data)
    } catch {
      setCredentials([])
    }
    setLoading(false)
  }

  return (
    <motion.div className="view-content" {...pageTransition}>
      <SearchInput value={search} onChange={setSearch} />

      {/* Category filter tabs */}
      <div className="filter-tabs">
        <button
          className={clsx('filter-tab', activeCategory === 'ALL' && 'filter-tab--active')}
          onClick={() => setActiveCategory('ALL')}
        >
          All
        </button>
        {ALL_CATEGORIES.map((cat) => (
          <button
            key={cat}
            className={clsx('filter-tab', activeCategory === cat && 'filter-tab--active')}
            onClick={() => setActiveCategory(cat)}
          >
            {CATEGORY_CONFIG[cat].label}
          </button>
        ))}
      </div>

      {/* Credential List */}
      <div className="credential-list">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="credential-card credential-card--skeleton">
              <Skeleton width="36px" height="36px" rounded />
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
                <Skeleton width="70%" height="14px" />
                <Skeleton width="50%" height="11px" />
              </div>
            </div>
          ))
        ) : credentials.length === 0 ? (
          <EmptyState
            title="No credentials found"
            subtitle="Open Dashboard to add credentials"
            action={
              <button
                className="vault-btn vault-btn--primary"
                onClick={() => chrome.tabs.create({ url: 'http://localhost:5173' })}
              >
                Open Dashboard
              </button>
            }
          />
        ) : (
          credentials.map((cred) => (
            <CredentialCard
              key={cred.id}
              credential={cred}
              onClick={() => onNavigate('credential-detail', { id: cred.id })}
            />
          ))
        )}
      </div>
    </motion.div>
  )
}

export default WalletView
