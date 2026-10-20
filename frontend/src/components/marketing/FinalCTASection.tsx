import React from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  UtensilsCrossed,
  ChevronRight
} from 'lucide-react';

export const FinalCTASection: React.FC = () => {
  const demoRoles = [
    { label: '👑 Owner', desc: 'Full P&L and Multi-Branch' },
    { label: '📋 Manager', desc: 'Floor & Staff Schedules' },
    { label: '👨‍🍳 Chef', desc: 'KDS & Prep Batches' },
    { label: '🛎️ Staff', desc: 'Table POS & Order Punch' },
    { label: '🍽️ Customer', desc: 'Direct Food Ordering' },
    { label: '🛡️ Super Admin', desc: 'Audit Logs & RBAC' },
  ];

  return (
    <section className="py-20 sm:py-28 lg:py-32 relative bg-[#05070d] border-t border-white/[0.08] overflow-hidden">
      {/* Background Culinary Photography Layer with Deep Vignette */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
        <img
          src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1600&auto=format&fit=crop&q=85"
          alt="Luxury Culinary Dining Spread"
          className="w-full h-full object-cover object-center filter grayscale contrast-125"
          loading="lazy"
          decoding="async"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/85 to-navy-950" />
      </div>

      {/* Ambient Lighting Gradients */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] sm:w-[700px] h-[350px] sm:h-[500px] bg-gradient-to-tr from-amber-500/10 via-emerald-500/10 to-transparent blur-[100px] sm:blur-[160px] pointer-events-none rounded-full" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-6 sm:space-y-8">
        {/* Eyebrow Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-navy-950/80 px-3.5 py-1.5 text-[11px] sm:text-xs font-bold text-amber-300 backdrop-blur-xl">
          <Sparkles size={13} />
          <span>EXPERIENCE THE DIFFERENCE</span>
        </div>

        {/* Main Dramatic Headline */}
        <h2 className="font-serif fluid-section-headline font-bold text-white tracking-tight">
          YOUR RESTAURANT. <br />
          <span className="emerald-gradient-text drop-shadow-[0_0_40px_rgba(16,185,129,0.35)]">
            ONE INTELLIGENT PLATFORM.
          </span>
        </h2>

        {/* Subtitle */}
        <p className="fluid-subheadline text-slate-300 max-w-2xl mx-auto font-normal px-2">
          Log in directly with our pre-loaded enterprise roles, explore direct customer food ordering, or launch the interactive live operations dashboard.
        </p>

        {/* CTA Buttons - full width on mobile */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4 pt-2 max-w-md sm:max-w-none mx-auto">
          <Link
            to="/login"
            className="inline-flex items-center justify-center gap-2.5 rounded-xl bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-600 px-6 sm:px-8 py-3.5 sm:py-4 text-xs sm:text-sm font-bold text-slate-950 shadow-xl shadow-emerald-500/25 hover:from-emerald-400 hover:to-teal-500 transition-all duration-300 active:scale-95 touch-target"
          >
            <span>Launch KRESTA</span>
            <ArrowRight size={16} />
          </Link>

          <Link
            to="/order"
            className="inline-flex items-center justify-center gap-2.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 px-6 sm:px-8 py-3.5 sm:py-4 text-xs sm:text-sm font-bold text-slate-950 shadow-xl shadow-amber-500/25 hover:from-amber-300 hover:to-amber-500 transition-all duration-300 active:scale-95 touch-target"
          >
            <UtensilsCrossed size={16} />
            <span>Order Food Online</span>
          </Link>

          <Link
            to="/features"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-navy-900/80 hover:bg-navy-850 px-6 sm:px-8 py-3.5 sm:py-4 text-xs sm:text-sm font-semibold text-white transition-all duration-300 active:scale-95 touch-target"
          >
            <span>Explore Features</span>
            <ChevronRight size={16} className="text-amber-400" />
          </Link>
        </div>

        {/* 1-Click Instant Demo Role Chips */}
        <div className="pt-8 sm:pt-10 border-t border-white/[0.08] space-y-3">
          <p className="text-[11px] sm:text-xs text-slate-400 font-mono">
            1-Click Instant Demo Authentication Profiles:
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5">
            {demoRoles.map((role) => (
              <Link
                key={role.label}
                to="/login"
                className="px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl bg-navy-900/90 border border-white/[0.08] hover:border-amber-400/50 text-[11px] sm:text-xs font-mono text-slate-200 hover:text-white transition-all duration-200 touch-target"
                title={role.desc}
              >
                <span>{role.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
