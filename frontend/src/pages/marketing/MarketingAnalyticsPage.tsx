import React from 'react';
import { MarketingLayout } from '../../components/marketing/MarketingLayout';
import {
  LineChart,
  BarChart,
  TrendingUp,
  DollarSign,
  ShoppingBag,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const MarketingAnalyticsPage: React.FC = () => {
  return (
    <MarketingLayout>
      <div className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1 text-xs font-bold text-amber-300">
            <LineChart size={14} />
            <span>EXECUTIVE TELEMETRY</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-6xl font-extrabold text-white tracking-tight">
            Clear Visibility into <br />
            <span className="emerald-gradient-text">Every Dollar & Minute</span>
          </h1>
          <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
            Unify revenue velocity, table turns, food waste scrap, and channel margins into real-time executive reporting designed for hospitality decision-makers.
          </p>
        </div>

        {/* 3 Analytics Feature Spotlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-card-hover p-6 rounded-3xl space-y-3">
            <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <DollarSign size={20} />
            </div>
            <h3 className="text-lg font-bold text-white">Gross Margin Analysis</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Calculates real-time plate margins by contrasting live supplier invoice prices against dish menu pricing.
            </p>
          </div>

          <div className="glass-card-hover p-6 rounded-3xl space-y-3">
            <div className="h-10 w-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <TrendingUp size={20} />
            </div>
            <h3 className="text-lg font-bold text-white">Hourly Sales Velocity</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Detects bottlenecks between 19:00 and 21:00, mapping kitchen turnaround delays against check sizes.
            </p>
          </div>

          <div className="glass-card-hover p-6 rounded-3xl space-y-3">
            <div className="h-10 w-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <ShoppingBag size={20} />
            </div>
            <h3 className="text-lg font-bold text-white">Category Mix Matrix</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Ranks menu items by volume and profitability into Stars, Workhorses, Puzzles, and Dogs.
            </p>
          </div>
        </div>

        {/* Banner with CTA */}
        <div className="glass-card p-8 sm:p-10 rounded-3xl border border-amber-500/30 text-center space-y-6 max-w-4xl mx-auto">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white">
            Audit Your Own Restaurant's Numbers Live
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto">
            Log into the KRESTA command center to interact with live charts, CSV report exports, and anomaly scanners.
          </p>
          <div>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 px-6 py-3 text-xs font-bold text-slate-950 shadow-lg shadow-emerald-500/20"
            >
              <span>Access In-App Analytics</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    </MarketingLayout>
  );
};
