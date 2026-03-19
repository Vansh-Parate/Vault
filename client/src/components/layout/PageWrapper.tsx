import React from 'react';

interface PageWrapperProps {
  children: React.ReactNode;
}

export default function PageWrapper({ children }: PageWrapperProps) {
  return (
    <main className="ml-[72px] lg:ml-64 min-h-dvh bg-cream transition-[margin] duration-300 overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-6 lg:py-8">
        {children}
      </div>
    </main>
  );
}
