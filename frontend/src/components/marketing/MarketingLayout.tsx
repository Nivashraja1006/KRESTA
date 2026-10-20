import React from 'react';
import { MarketingNavbar } from './MarketingNavbar';
import { MarketingFooter } from './MarketingFooter';

interface MarketingLayoutProps {
  children: React.ReactNode;
}

export const MarketingLayout: React.FC<MarketingLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-slate-975 text-slate-100 flex flex-col font-sans selection:bg-brand-500 selection:text-slate-950">
      <MarketingNavbar />
      <main className="flex-1 pt-20">
        {children}
      </main>
      <MarketingFooter />
    </div>
  );
};
