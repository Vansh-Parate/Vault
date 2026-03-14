import React from 'react';

interface TopBarProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export default function TopBar({ title, subtitle, action }: TopBarProps) {
  return (
    <div className="flex items-center justify-between mb-8">
      <div>
        <h1 className="font-display text-2xl text-dark">{title}</h1>
        {subtitle && (
          <p className="text-sm text-dark-muted font-sans mt-1">{subtitle}</p>
        )}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}
