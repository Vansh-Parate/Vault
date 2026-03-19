import React from 'react'
import clsx from 'clsx'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'sage' | 'warning' | 'danger'
  className?: string
}

const Badge: React.FC<BadgeProps> = ({ children, variant = 'default', className }) => {
  return <span className={clsx('badge', `badge--${variant}`, className)}>{children}</span>
}

export default Badge
