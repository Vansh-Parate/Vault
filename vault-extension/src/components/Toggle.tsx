import React from 'react'

export default function Toggle({
  checked,
  onChange,
  ariaLabel,
}: {
  checked: boolean
  onChange: (value: boolean) => void
  ariaLabel: string
}) {
  return (
    <button
      className={`vault-toggle ${checked ? 'active' : ''}`}
      onClick={() => onChange(!checked)}
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel}
      type="button"
    >
      <span className="vault-toggle-knob" />
    </button>
  )
}

