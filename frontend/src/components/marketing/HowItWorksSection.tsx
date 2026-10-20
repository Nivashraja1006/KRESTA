import React from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import {
  Sparkles,
  PlugZap,
  Activity,
  Cpu,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';

export const HowItWorksSection: React.FC = () => {
  const shouldReduceMotion = useReducedMotion();

  const steps = [
    {
      num: '01',
      title: 'Connect Operations',
      subtitle: 'POS, Tablets & Suppliers',
      description:
        'Connect your point-of-sale terminals, kitchen displays, and raw ingredient inventories in minutes. KRESTA maps recipes, station routings, and stock units without disrupting ongoing dinner service.',
      icon: PlugZap,
      highlight: '15-Min Zero-Downtime Setup',
      badgeColor: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    },
    {
      num: '02',
      title: 'Analyze Business Data',
      subtitle: 'Continuous Live Telemetry',
      description:
        'Every dish fired and paid streams into an immutable real-time ledger. Monitor kitchen cook durations, ingredient depletion, table turn velocity, and customer frequency as it happens on the floor.',
      icon: Activity,
      highlight: 'Sub-28ms Sync Latency',
      badgeColor: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
    },
    {
      num: '03',
      title: 'Decide with AI',
      subtitle: 'Demand & Margin Sourcing',
      description:
        'Machine learning models anticipate weekend dining rushes, dynamic safety buffers eliminate 86-ing key items, and food waste scrap analysis salvages critical gross profit margins.',
      icon: Cpu,
      highlight: '+4.8% EBITDA Expansion',
      badgeColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    },
  ];

  return (
    <section id="how-it-works" className="py-20 sm:py-28 lg:py-32 relative bg-[#05070d] border-t border-white/[0.06] overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] sm:w-[700px] h-[350px] sm:h-[500px] bg-gradient-to-r from-emerald-500/5 to-amber-500/5 blur-[100px] sm:blur-[160px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 lg:mb-20 space-y-3 sm:space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-navy-950/80 px-3.5 py-1.5 text-[11px] sm:text-xs font-bold text-amber-300">
            <Sparkles size={13} />
            <span>STREAMLINED ONBOARDING</span>
          </div>

          <h2 className="font-serif fluid-section-headline font-bold text-white tracking-tight">
            How KRESTA Works. <br />
            <span className="emerald-gradient-text">Three Steps to Total Intelligence.</span>
          </h2>

          <p className="fluid-subheadline text-slate-300 leading-relaxed font-normal">
            Transition from intuition and chaotic paper tickets to algorithmic precision without interrupting kitchen service or dining guests.
          </p>
        </div>

        {/* 3 Process Steps Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-7 lg:gap-8 relative">
          {steps.map((s, idx) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={s.num}
                initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.5, delay: shouldReduceMotion ? 0 : idx * 0.1 }}
                className="glass-panel p-6 sm:p-8 rounded-2xl sm:rounded-3xl border-white/[0.08] relative flex flex-col justify-between group hover:border-amber-500/40 hover:-translate-y-1 transition-all duration-300 shadow-2xl"
              >
                <div>
                  {/* Step Header */}
                  <div className="flex items-center justify-between mb-4 sm:mb-6">
                    <span className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold gold-gradient-text tracking-wider">
                      {s.num}
                    </span>
                    <div className={`p-2.5 sm:p-3 rounded-xl sm:rounded-2xl border ${s.badgeColor}`}>
                      <Icon size={20} className="sm:w-[22px] sm:h-[22px]" />
                    </div>
                  </div>

                  <h3 className="text-lg sm:text-xl font-bold font-serif text-white mb-1.5 group-hover:text-amber-200 transition-colors">
                    {s.title}
                  </h3>

                  <p className="text-xs font-mono text-amber-300/90 font-semibold mb-2.5">
                    {s.subtitle}
                  </p>

                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-5 sm:mb-6">
                    {s.description}
                  </p>
                </div>

                <div className="pt-3.5 sm:pt-4 border-t border-white/[0.06] flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-[11px] sm:text-xs text-emerald-400 font-mono font-semibold">
                    <CheckCircle2 size={13} />
                    <span>{s.highlight}</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-500 uppercase">
                    Step {idx + 1} of 3
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom Banner */}
        <div className="mt-10 sm:mt-14 glass-panel p-5 sm:p-6 rounded-2xl border-white/[0.06] max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-white">Ready to deploy in your restaurant?</h4>
            <p className="text-xs text-slate-400">Our engineering team assists with recipe configuration and staff terminal pairing.</p>
          </div>
          <Link
            to="/contact"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-navy-900 border border-white/10 px-5 py-3 text-xs font-bold text-slate-200 hover:text-white hover:border-amber-400/50 transition-colors flex-shrink-0 touch-target"
          >
            <span>Schedule Guided Walkthrough</span>
            <ArrowRight size={14} className="text-amber-400" />
          </Link>
        </div>
      </div>
    </section>
  );
};
