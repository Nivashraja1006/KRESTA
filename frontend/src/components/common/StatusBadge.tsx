import React from 'react';

interface StatusBadgeProps {
  status: string;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const normalized = (status || '').toUpperCase();

  let styles = 'bg-slate-800 text-slate-300 border-slate-700';

  // Orders
  if (normalized === 'NEW') styles = 'bg-blue-500/10 text-blue-400 border-blue-500/30';
  else if (normalized === 'CONFIRMED') styles = 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30';
  else if (normalized === 'PREPARING') styles = 'bg-amber-500/10 text-amber-400 border-amber-500/30 animate-pulse';
  else if (normalized === 'READY') styles = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
  else if (normalized === 'SERVED') styles = 'bg-teal-500/10 text-teal-400 border-teal-500/30';
  else if (normalized === 'COMPLETED') styles = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
  else if (normalized === 'CANCELLED') styles = 'bg-rose-500/10 text-rose-400 border-rose-500/30';

  // Inventory
  else if (normalized === 'HEALTHY') styles = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
  else if (normalized === 'LOW') styles = 'bg-amber-500/10 text-amber-400 border-amber-500/30';
  else if (normalized === 'CRITICAL') styles = 'bg-rose-500/10 text-rose-400 border-rose-500/30 font-bold';
  else if (normalized === 'EXPIRED') styles = 'bg-purple-500/10 text-purple-400 border-purple-500/30';

  // Sentiment
  else if (normalized === 'POSITIVE') styles = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
  else if (normalized === 'NEUTRAL') styles = 'bg-slate-500/10 text-slate-400 border-slate-500/30';
  else if (normalized === 'NEGATIVE') styles = 'bg-rose-500/10 text-rose-400 border-rose-500/30';

  // Anomalies
  else if (normalized === 'HIGH') styles = 'bg-rose-500/10 text-rose-400 border-rose-500/30';
  else if (normalized === 'MEDIUM') styles = 'bg-amber-500/10 text-amber-400 border-amber-500/30';
  else if (normalized === 'LOW') styles = 'bg-blue-500/10 text-blue-400 border-blue-500/30';

  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs';

  return (
    <span className={`inline-flex items-center rounded-full border font-medium uppercase tracking-wider ${sizeClasses} ${styles}`}>
      {normalized.replace('_', ' ')}
    </span>
  );
};
