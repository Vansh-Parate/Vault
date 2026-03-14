import React from 'react';

interface PageWrapperProps {
  children: React.ReactNode;
}

export default function PageWrapper({ children }: PageWrapperProps) {
  return (
    <div className="ml-[240px] min-h-screen bg-cream">
      <div className="max-w-[1200px] mx-auto px-8 py-8">
        {children}
      </div>
    </div>
  );
}
