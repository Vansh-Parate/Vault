import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle } from 'lucide-react'
import type { PermissionRequest } from '../../types'
import { getPendingRequests, removePendingRequest } from '../../lib/storage'
import PermissionCard from '../../components/PermissionCard'

interface PermissionRequestViewProps {
  onNavigate: (view: string, data?: any) => void
}

const pageTransition = {
  initial: { opacity: 0, y: 6 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -6 },
  transition: { duration: 0.15, ease: 'easeOut' },
}

const PermissionRequestView: React.FC<PermissionRequestViewProps> = ({ onNavigate }) => {
  const [requests, setRequests] = useState<PermissionRequest[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadRequests()
  }, [])

  const loadRequests = async () => {
    const pending = await getPendingRequests()
    setRequests(pending)
    setLoading(false)
  }

  const handleApprove = async (requestId: string) => {
    // Send approval message to background
    try {
      await chrome.runtime.sendMessage({
        type: 'PERMISSION_RESPONSE',
        source: 'popup',
        payload: { requestId, approved: true },
      })
    } catch {
      // ignore
    }
    await removePendingRequest(requestId)
    const updated = requests.filter((r) => r.requestId !== requestId)
    setRequests(updated)
    if (currentIndex >= updated.length && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
    }
  }

  const handleDeny = async (requestId: string) => {
    try {
      await chrome.runtime.sendMessage({
        type: 'PERMISSION_RESPONSE',
        source: 'popup',
        payload: { requestId, approved: false },
      })
    } catch {
      // ignore
    }
    await removePendingRequest(requestId)
    const updated = requests.filter((r) => r.requestId !== requestId)
    setRequests(updated)
    if (currentIndex >= updated.length && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
    }
  }

  if (loading) {
    return (
      <motion.div className="view-content" {...pageTransition}>
        <div style={{ padding: 24, textAlign: 'center', color: 'var(--dark-muted)' }}>
          Loading...
        </div>
      </motion.div>
    )
  }

  if (requests.length === 0) {
    return (
      <motion.div className="view-content" {...pageTransition}>
        <div className="empty-permission">
          <CheckCircle size={40} className="empty-permission__icon" />
          <h3 className="empty-permission__title">No pending requests</h3>
          <p className="empty-permission__text">
            Websites will ask for permission before accessing your data.
          </p>
        </div>
      </motion.div>
    )
  }

  const currentRequest = requests[currentIndex]

  return (
    <motion.div className="view-content" {...pageTransition}>
      {requests.length > 1 && (
        <div className="permission-pagination">
          {currentIndex + 1} of {requests.length} requests
        </div>
      )}

      {currentRequest && (
        <PermissionCard
          request={currentRequest}
          onApprove={() => handleApprove(currentRequest.requestId)}
          onDeny={() => handleDeny(currentRequest.requestId)}
        />
      )}

      {requests.length > 1 && (
        <div className="permission-nav">
          <button
            className="vault-btn vault-btn--ghost"
            disabled={currentIndex === 0}
            onClick={() => setCurrentIndex(currentIndex - 1)}
          >
            Previous
          </button>
          <button
            className="vault-btn vault-btn--ghost"
            disabled={currentIndex === requests.length - 1}
            onClick={() => setCurrentIndex(currentIndex + 1)}
          >
            Next
          </button>
        </div>
      )}
    </motion.div>
  )
}

export default PermissionRequestView
