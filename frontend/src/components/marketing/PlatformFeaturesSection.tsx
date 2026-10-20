import React from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import {
  ShoppingBag,
  ChefHat,
  Package,
  TrendingUp,
  Users,
  LineChart,
  ArrowRight,
  Sparkles
} from 'lucide-react';

interface FeaturePillar {
  id: string;
  title: string;
  category: string;
  description: string;
  metricLabel: string;
  metricValue: string;
  icon: any;
  route: string;
  accent: string;
  glowColor: string;
}

export const PlatformFeaturesSection: React.FC = () => {
  const shouldReduceMotion = useReducedMotion();

  const pillars: FeaturePillar[] = [
    {
      id: 'pos',
      title: 'POS & Order Management',
      category: 'Front of House Commerce',
      description: 'Lightning-fast cloud POS with split checks, modifiers, tableside digital QR ordering, and offline resiliency.',
      metricLabel: 'Transaction Speed',
      metricValue: '< 1.2s Ticket Punch',
      icon: ShoppingBag,
      route: '/orders',
      accent: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
      glowColor: 'hover:border-amber-500/40',
    },
    {
      id: 'kds',
      title: 'Kitchen Display System',
      category: 'Back of House Telemetry',
      description: 'Dynamic station load balancing, multi-course sequencing, allergy callouts, and cook-time synchronization.',
      metricLabel: 'Expedite Pacing',
      metricValue: '11.4m Average Turn',
      icon: ChefHat,
      route: '/kitchen',
      accent: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
      glowColor: 'hover:border-emerald-500/40',
    },
    {
      id: 'inventory',
      title: 'Inventory Intelligence',
      category: 'Supply Chain & Cost Control',
      description: 'Automated recipe explosion decrements raw grams on every order. Predictive reorder thresholds prevent stockouts.',
      metricLabel: 'Food Waste Avoided',
      metricValue: '$2,480 / Month Saved',
      icon: Package,
      route: '/inventory',
      accent: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
      glowColor: 'hover:border-cyan-500/40',
    },
    {
      id: 'forecast',
      title: 'AI Demand Forecasting',
      category: 'Machine Learning Engine',
      description: 'Gradient boosting regressor computes covers and portion demand 7 days out using local weather and holiday harmonics.',
      metricLabel: 'Predictive Accuracy',
      metricValue: '94.2% Covers Match',
      icon: TrendingUp,
      route: '/forecast',
      accent: 'text-emerald-300 bg-emerald-500/15 border-emerald-500/30',
      glowColor: 'hover:border-emerald-400/50',
    },
    {
      id: 'customers',
      title: 'Customer Insights & RFM',
      category: 'Guest Loyalty & Retention',
      description: 'K-Means clustering segments diners into VIPs, Consistent Regulars, and At-Risk guests based on spend velocity.',
      metricLabel: 'VIP Repeat Factor',
      metricValue: '3.8x Retention Rate',
      icon: Users,
      route: '/customers',
      accent: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
      glowColor: 'hover:border-purple-500/40',
    },
    {
      id: 'analytics',
      title: 'Executive Business Analytics',
      category: 'Profitability & Margin Guard',
      description: 'Real-time contribution margin analysis, dish-level profitability matrices, labor efficiency, and P&L summaries.',
      metricLabel: 'Gross Margin Impact',
      metricValue: '+4.8% EBITDA Uplift',
      icon: LineChart,
      route: '/executive-analytics',
      accent: 'text-amber-300 bg-amber-500/15 border-amber-500/30',
      glowColor: 'hover:border-amber-400/50',
    },
  ];

  return (
    <section id="platform-features" className="py-20 sm:py-28 lg:py-32 relative bg-[#05070d] border-t border-white/[0.06] overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-1/4 right-0 w-[350px] sm:w-[550px] h-[350px] sm:h-[550px] bg-amber-500/5 rounded-full blur-[100px] sm:blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 left-0 w-[320px] sm:w-[500px] h-[320px] sm:h-[500px] bg-emerald-500/5 rounded-full blur-[100px] sm:blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 lg:mb-20 space-y-3 sm:space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-navy-950/80 px-3.5 py-1.5 text-[11px] sm:text-xs font-bold text-amber-300">
            <Sparkles size={13} />
            <span>EVERYTHING IN ONE PLATFORM</span>
          </div>

          <h2 className="font-serif fluid-section-headline font-bold text-white tracking-tight">
            Built for Culinary Excellence, <br />
            <span className="emerald-gradient-text">Engineered for Maximum Margin.</span>
          </h2>

          <p className="fluid-subheadline text-slate-300 leading-relaxed font-normal">
            Replace disjointed SaaS subscriptions with one synchronized restaurant OS. Every operational station shares immutable data in real time.
          </p>
        </div>

        {/* 6 Core Pillars Grid with Staggered Scroll Reveal */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-7">
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <motion.div
                key={pillar.id}
                initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.5, delay: shouldReduceMotion ? 0 : idx * 0.08 }}
                className={`glass-panel p-5 sm:p-7 rounded-2xl sm:rounded-3xl transition-all duration-300 flex flex-col justify-between group border-white/[0.07] ${pillar.glowColor} hover:-translate-y-1 hover:shadow-2xl active:scale-[0.99]`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4 sm:mb-5">
                    <div className={`p-2.5 sm:p-3 rounded-xl sm:rounded-2xl border ${pillar.accent} shadow-inner`}>
                      <Icon size={20} className="sm:w-[22px] sm:h-[22px]" />
                    </div>
                    <span className="text-[9px] sm:text-[10px] uppercase font-bold tracking-wider px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full bg-navy-900/80 text-slate-300 border border-white/[0.08]">
                      {pillar.category}
                    </span>
                  </div>

                  <h3 className="text-lg sm:text-xl font-bold font-serif text-white mb-2 group-hover:text-amber-200 transition-colors">
                    {pillar.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-5 sm:mb-6">
                    {pillar.description}
                  </p>
                </div>

                <div className="pt-3.5 sm:pt-4 border-t border-white/[0.06] flex items-center justify-between">
                  <div>
                    <p className="text-[9px] sm:text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                      {pillar.metricLabel}
                    </p>
                    <p className="text-xs sm:text-sm font-extrabold text-white font-mono mt-0.5">
                      {pillar.metricValue}
                    </p>
                  </div>

                  <Link
                    to={pillar.route}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 group-hover:text-amber-300 group-hover:translate-x-1 transition-all touch-target"
                  >
                    <span>Open Module</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
