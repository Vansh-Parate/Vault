import React from 'react';

interface TopBarProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export default function TopBar({ title, subtitle, action }: TopBarProps) {
  return (
    <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between mb-6 lg:mb-8">
      <div className="min-w-0">
        {title ? (
          <h1 className="font-display text-2xl lg:text-[28px] leading-tight text-dark truncate">
            {title}
          </h1>
        ) : (
          <div className="h-9" />
        )}
        {subtitle && (
          <p className="text-sm text-dark-muted font-sans mt-1">
            {subtitle}
          </p>
        )}
      </div>

      {action && (
        <div className="shrink-0 flex items-center justify-start sm:justify-end">
          {action}
        </div>
      )}
    </header>
  );
}
