import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import {
  Sparkles,
  ChefHat,
  ShoppingBag,
  Package,
  LineChart,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';

export const RestaurantOperationsSection: React.FC = () => {
  const [activeWorkflow, setActiveWorkflow] = useState<number>(0);
  const shouldReduceMotion = useReducedMotion();

  const workflows = [
    {
      step: '01',
      title: 'Order Capture & Pacing',
      tagline: 'Zero Disjointed Channels',
      desc: 'Whether an order arrives through tableside QR, the waiter handheld POS, or the branded online customer portal, tickets ingest into the KRESTA queue with verified payments and modifier specs.',
      icon: ShoppingBag,
      metric: '< 1.2s Sync',
    },
    {
      step: '02',
      title: 'Kitchen Flow Synchronization',
      tagline: 'Automated Course Timing',
      desc: 'Cook stations (Grill, Saute, Pastry) receive tickets prioritized by dish cook time. Appetizers and entrees are synchronized so a 4-top table receives hot food simultaneously without expediter chaos.',
      icon: ChefHat,
      metric: '11.4m Turnaround',
    },
    {
      step: '03',
      title: 'Recipe Ingredient Explosion',
      tagline: 'Gram-Level Precision',
      desc: 'As each dish is fired, the backend engine calculates the exact raw ingredient deductions—from 250g Wagyu ribeye to 5g black truffle butter—depleting inventory without manual end-of-day counts.',
      icon: Package,
      metric: '100% Automated',
    },
    {
      step: '04',
      title: 'Reporting & Auto-Replenishment',
      tagline: 'Executive Command',
      desc: 'Live P&L telemetry computes gross contribution margin per table. When ingredient safety buffers are triggered, purchase orders are automatically staged for approved supplier dispatch.',
      icon: LineChart,
      metric: '+4.8% EBITDA Uplift',
    },
  ];

  return (
    <section id="restaurant-operations" className="py-20 sm:py-28 lg:py-32 relative bg-[#070a14] border-t border-white/[0.06] overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/3 left-1/3 w-[350px] sm:w-[600px] h-[350px] sm:h-[600px] bg-emerald-500/5 rounded-full blur-[100px] sm:blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Editorial Split-Screen Composition */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 lg:gap-14 items-center">
          {/* Left Column: Layered Editorial Restaurant & Kitchen Photography (5 cols) */}
          <div className="lg:col-span-5 relative space-y-4">
            <motion.div
              initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.6 }}
              className="relative rounded-2xl sm:rounded-3xl overflow-hidden border border-white/[0.08] shadow-[0_25px_60px_rgba(0,0,0,0.8)] group"
            >
              <img
                src="https://images.unsplash.com/photo-1551218808-94e220e084d2?w=1200&auto=format&fit=crop&q=85"
                alt="Chef Plating Fine Dining Dish"
                className="w-full h-[260px] xs:h-[320px] sm:h-[420px] lg:h-[460px] object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                loading="lazy"
                decoding="async"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/20 to-transparent pointer-events-none" />

              {/* Floating Live Telemetry Badge 1 */}
              <div className="absolute bottom-3 left-3 right-3 sm:bottom-5 sm:left-5 sm:right-5 glass-panel p-3 sm:p-4 rounded-xl sm:rounded-2xl border-white/[0.08] backdrop-blur-xl">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="flex h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-emerald-400 animate-ping flex-shrink-0" />
                    <span className="text-[11px] sm:text-xs font-bold text-white font-mono">Kitchen Station Pass 01</span>
                  </div>
                  <span className="text-[9px] sm:text-[10px] font-mono text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                    Live Telemetry
                  </span>
                </div>
                <p className="text-[11px] sm:text-xs text-slate-300">
                  Course 2 (Entrees) dispatched &bull; 100% recipe compliance verified
                </p>
              </div>
            </motion.div>

            {/* Layered Accent Image (Atmospheric Dining Room) - safely positioned */}
            <div className="hidden sm:block absolute -bottom-6 -right-4 lg:-bottom-8 lg:-right-6 w-52 sm:w-60 rounded-2xl overflow-hidden border border-amber-500/30 shadow-2xl glass-panel p-1.5 backdrop-blur-xl z-20">
              <img
                src="https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?w=600&auto=format&fit=crop&q=85"
                alt="Luxury Dining Room Atmosphere"
                className="w-full h-28 sm:h-32 object-cover rounded-xl"
                loading="lazy"
                decoding="async"
              />
              <div className="p-2 text-center">
                <p className="text-[11px] font-bold text-white font-serif">The Royal Saffron Dining Room</p>
                <span className="text-[9px] font-mono text-emerald-400">96% Satisfaction Score</span>
              </div>
            </div>
          </div>

          {/* Right Column: Operational Benefits & Interactive Step Walkthrough (7 cols) */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-8">
            <div className="space-y-3 sm:space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-navy-950/80 px-3.5 py-1.5 text-[11px] sm:text-xs font-bold text-amber-300">
                <Sparkles size={13} />
                <span>CLOSED-LOOP RESTAURANT OPERATIONS</span>
              </div>

              <h2 className="font-serif fluid-section-headline font-bold text-white tracking-tight">
                From First Guest Order <br />
                <span className="emerald-gradient-text">To Final Supplier Reorder.</span>
              </h2>

              <p className="fluid-subheadline text-slate-300 leading-relaxed font-normal">
                Most restaurants suffer from severe friction between front-of-house staff, busy line cooks, and late-night inventory counting. KRESTA solves this by threading every operational transaction into an automated closed loop.
              </p>
            </div>

            {/* 4 Interactive Workflow Steps */}
            <div className="space-y-2.5 sm:space-y-3.5">
              {workflows.map((wf, idx) => {
                const Icon = wf.icon;
                const isActive = activeWorkflow === idx;
                return (
                  <div
                    key={wf.step}
                    onClick={() => setActiveWorkflow(idx)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') setActiveWorkflow(idx);
                    }}
                    className={`cursor-pointer rounded-2xl p-4 sm:p-5 border transition-all duration-300 touch-target focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 ${
                      isActive
                        ? 'bg-navy-900/95 border-amber-500/50 shadow-xl shadow-amber-500/5 -translate-y-0.5'
                        : 'bg-navy-950/60 border-white/[0.06] hover:border-white/10 hover:bg-navy-900/40'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3 sm:gap-4">
                      <div className="flex items-start gap-3 sm:gap-4">
                        <div
                          className={`flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-xl border flex-shrink-0 transition-colors ${
                            isActive
                              ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                              : 'bg-navy-900 border-white/[0.08] text-slate-400'
                          }`}
                        >
                          <Icon size={18} className="sm:w-5 sm:h-5" />
                        </div>
                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2.5">
                            <span className="text-xs font-mono font-bold text-amber-400/90">
                              {wf.step}
                            </span>
                            <h3 className="text-sm sm:text-base font-bold text-white font-serif">
                              {wf.title}
                            </h3>
                            <span className="text-[10px] text-slate-400 hidden xs:inline">
                              &bull; {wf.tagline}
                            </span>
                          </div>
                          <p className="text-xs text-slate-300 leading-relaxed">
                            {wf.desc}
                          </p>
                        </div>
                      </div>

                      <div className="text-right flex-shrink-0">
                        <span className="text-[10px] sm:text-[11px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                          {wf.metric}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom Proof Note */}
            <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-t border-white/[0.06] text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={15} className="text-emerald-400 flex-shrink-0" />
                <span>Zero manual spreadsheet entry. Fully compliant PostgreSQL audit log.</span>
              </div>
              <Link
                to="/platform"
                className="inline-flex items-center gap-1 font-bold text-amber-300 hover:text-amber-200 touch-target"
              >
                <span>Read Full Operations Guide</span>
                <ArrowRight size={13} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
