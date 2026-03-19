import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import type { AccessLog } from '../../types'
import { api } from '../../lib/api'
import { getCategoryIcon } from '../../components/CategoryIcon'
import EmptyState from '../../components/EmptyState'
import Skeleton from '../../components/Skeleton'
import clsx from 'clsx'

interface AccessLogViewProps {
  onNavigate: (view: string, data?: any) => void
}

const pageTransition = {
  initial: { opacity: 0, y: 6 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -6 },
  transition: { duration: 0.15, ease: 'easeOut' },
}

type FilterType = 'all' | 'shared' | 'viewed' | 'exported'

const AccessLogView: React.FC<AccessLogViewProps> = ({ onNavigate }) => {
  const [logs, setLogs] = useState<AccessLog[]>([])
  const [filter, setFilter] = useState<FilterType>('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadLogs()
  }, [])

  const loadLogs = async () => {
    setLoading(true)
    try {
      const res = await api.getLogs()
      setLogs(res.data.slice(0, 20))
    } catch {
      setLogs([])
    }
    setLoading(false)
  }

  const filteredLogs = filter === 'all' ? logs : logs.filter((l) => l.action === filter)

  // Group by date
  const grouped: Record<string, AccessLog[]> = {}
  filteredLogs.forEach((log) => {
    const date = new Date(log.timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    })
    if (!grouped[date]) grouped[date] = []
    grouped[date].push(log)
  })

  const filters: { label: string; value: FilterType }[] = [
    { label: 'All', value: 'all' },
    { label: 'Shared', value: 'shared' },
    { label: 'Viewed', value: 'viewed' },
    { label: 'Exported', value: 'exported' },
  ]

  return (
    <motion.div className="view-content" {...pageTransition}>
      {/* Filter pills */}
      <div className="filter-tabs">
        {filters.map((f) => (
          <button
            key={f.value}
            className={clsx('filter-tab', filter === f.value && 'filter-tab--active')}
            onClick={() => setFilter(f.value)}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Log entries */}
      <div className="log-list">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} style={{ padding: '8px 0' }}>
              <Skeleton width="60px" height="11px" />
              <Skeleton width="100%" height="14px" />
            </div>
          ))
        ) : filteredLogs.length === 0 ? (
          <EmptyState title="No log entries" subtitle="Your activity will appear here" />
        ) : (
          Object.entries(grouped).map(([date, entries]) => (
            <div key={date} className="log-group">
              <div className="log-group__date">{date}</div>
              {entries.map((log) => (
                <div key={log.id} className="log-entry">
                  <div className="log-entry__left">
                    {log.credential && getCategoryIcon(log.credential.category, 14)}
                    <span className="log-entry__title">
                      {log.credential?.title || 'Unknown'}
                    </span>
                  </div>
                  <span className={clsx('log-entry__action', `log-entry__action--${log.action}`)}>
                    {log.action.charAt(0).toUpperCase() + log.action.slice(1)}
                  </span>
                  <span className="log-entry__accessor">{log.accessedBy}</span>
                </div>
              ))}
            </div>
          ))
        )}
      </div>
    </motion.div>
  )
}

export default AccessLogView
