import React from 'react'
import type { Status } from '../types'
import clsx from 'clsx'

interface StatusBadgeProps {
  status: Status
}

const STATUS_MAP: Record<Status, { label: string; className: string }> = {
  VERIFIED: { label: 'Verified', className: 'status-badge--verified' },
  PENDING: { label: 'Pending', className: 'status-badge--pending' },
  REJECTED: { label: 'Rejected', className: 'status-badge--rejected' },
  EXPIRED: { label: 'Expired', className: 'status-badge--expired' },
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const config = STATUS_MAP[status]
  return <span className={clsx('status-badge', config.className)}>{config.label}</span>
}

export default StatusBadge
