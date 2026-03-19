import React from 'react'
import clsx from 'clsx'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost' | 'danger'
  fullWidth?: boolean
  children: React.ReactNode
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  fullWidth = false,
  children,
  className,
  ...props
}) => {
  return (
    <button
      className={clsx(
        'vault-btn',
        `vault-btn--${variant}`,
        fullWidth && 'vault-btn--full',
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}

export default Button
