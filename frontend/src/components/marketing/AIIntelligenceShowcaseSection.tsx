import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  TrendingUp,
  Package,
  Trash2,
  MessageSquareHeart,
  LineChart,
  Bot,
  ArrowRight,
  Database,
  Cpu,
  Layers,
  HelpCircle
} from 'lucide-react';

export const AIIntelligenceShowcaseSection: React.FC = () => {
  const [selectedQuestion, setSelectedQuestion] = useState<string>('Why did food waste increase?');
  const [assistantOutput, setAssistantOutput] = useState<string>(
    'Food waste increased by 12.4%, mainly due to higher weekend prep waste in Wagyu trimmings and excess prep on fresh pasta dough. Recommended action: tighten prep station batching from 25 to 15 portions.'
  );

  const presetResponses: Record<string, string> = {
    'Why did food waste increase?':
      'Food waste increased by 12.4%, mainly due to higher weekend prep waste in Wagyu trimmings and excess prep on fresh pasta dough. Recommended action: tighten prep station batching from 25 to 15 portions.',
    'Why are sales down on Tuesday?':
      'Tuesday sales dipped 6.8% primarily during the lunch shift due to heavy rain (-18% walking covers). Dinner revenue remained robust (+4.2%), led by wine pairing upsells.',
    'What should I reorder today?':
      'Recommended reorder: 15kg Truffle Butter and 20kg Fior Di Latte Mozzarella. Both will breach safety threshold in 48 hours based on projected Friday demand.',
    'Which dish is trending this week?':
      'Hamachi Crudo velocity jumped by +34% over the last 14 days with 99% positive review sentiment. It is currently your highest margin appetizer at 74.2% gross profit.',
  };

  const handleSelectQuestion = (q: string) => {
    setSelectedQuestion(q);
    setAssistantOutput(presetResponses[q] || 'Calculating operational feature weights for your query...');
  };

  const engines = [
    {
      id: 'forecast',
      title: 'Demand Prediction',
      badge: 'Gradient Boosting',
      desc: 'Anticipates guest covers and item-level portion demand 7 days ahead with day-of-week cyclic harmonics and weather adjustments.',
      metric: '94.2% Accuracy',
      icon: TrendingUp,
      route: '/forecast',
    },
    {
      id: 'stock',
      title: 'Stock Shortage Warnings',
      badge: 'Lead-Time Detection',
      desc: 'Monitors consumption burn velocity against supplier shipping latency, alerting chefs 48 hours before critical stockouts.',
      metric: 'Zero Rush Stockouts',
      icon: Package,
      route: '/recommendations',
    },
    {
      id: 'waste',
      title: 'Food-Waste Diagnostics',
      badge: 'Scrap Isolation',
      desc: 'Isolates prep scrap from customer plate returns to pinpoint recipe portion creep and salvage gross kitchen margins.',
      metric: '-28% Waste in 60d',
      icon: Trash2,
      route: '/waste',
    },
    {
      id: 'reviews',
      title: 'Review Sentiment NLP',
      badge: 'Aspect-Based NLP',
      desc: 'Classifies customer reviews across Food, Service, Ambience, and Value, highlighting sentiment shifts instantly.',
      metric: '98% Positive Sentiment',
      icon: MessageSquareHeart,
      route: '/reviews',
    },
    {
      id: 'trends',
      title: 'Sales Trends & Margin Guard',
      badge: 'Price Elasticity',
      desc: 'Identifies high-velocity, high-margin signature dishes and recommends optimal menu positioning to lift guest checks.',
      metric: '+4.8% EBITDA Uplift',
      icon: LineChart,
      route: '/executive-analytics',
    },
  ];

  return (
    <section id="ai-intelligence" className="py-20 sm:py-28 lg:py-32 relative bg-[#05070d] border-t border-white/[0.06] overflow-hidden">
      {/* Background Ambient Lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[350px] sm:w-[700px] h-[350px] sm:h-[500px] bg-emerald-500/5 rounded-full blur-[100px] sm:blur-[160px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-amber-500/5 rounded-full blur-[90px] sm:blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 lg:mb-20 space-y-3 sm:space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-navy-950/80 px-3.5 py-1.5 text-[11px] sm:text-xs font-bold text-amber-300">
            <Sparkles size={13} />
            <span>AI INTELLIGENCE & MACHINE LEARNING</span>
          </div>

          <h2 className="font-serif fluid-section-headline font-bold text-white tracking-tight">
            Your Restaurant <br />
            <span className="emerald-gradient-text">Has a Second Brain.</span>
          </h2>

          <p className="fluid-subheadline text-slate-300 leading-relaxed font-normal">
            Five specialized algorithmic pipelines continuously ingest operational telemetry to automate decisions, protect margins, and eliminate kitchen waste before it happens.
          </p>
        </div>

        {/* Prediction Flow Visualizer Banner */}
        <div className="mb-10 sm:mb-14 glass-panel p-4 sm:p-7 lg:p-8 rounded-2xl sm:rounded-3xl border-white/[0.08] relative overflow-hidden">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3 sm:gap-6 pb-4 sm:pb-6 border-b border-white/[0.08]">
            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-wider text-amber-300 font-bold">
                Telemetry Pipeline Topology
              </span>
              <h3 className="text-base sm:text-lg font-bold text-white font-serif">
                How KRESTA AI Translates Raw Data into Culinary Action
              </h3>
            </div>
            <span className="text-[10px] sm:text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2.5 sm:px-3 py-1 rounded-lg border border-emerald-500/25 self-start lg:self-auto">
              Automated Re-training Every Midnight
            </span>
          </div>

          {/* 4 Pipeline Stages */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 pt-4 sm:pt-6">
            <div className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-navy-900/60 border border-white/[0.06] space-y-1.5 sm:space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-slate-400 font-bold">STAGE 01</span>
                <Database size={15} className="text-cyan-400" />
              </div>
              <h4 className="text-xs sm:text-sm font-bold text-white">Raw POS Telemetry</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Ingests orders, weather APIs, bookings, inventory decrements, and supplier lead times.
              </p>
            </div>

            <div className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-navy-900/60 border border-white/[0.06] space-y-1.5 sm:space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-slate-400 font-bold">STAGE 02</span>
                <Layers size={15} className="text-amber-400" />
              </div>
              <h4 className="text-xs sm:text-sm font-bold text-white">Feature Engineering</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Encodes day-of-week harmonics, holiday coefficients, weather deltas, and dining velocity.
              </p>
            </div>

            <div className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-navy-900/60 border border-white/[0.06] space-y-1.5 sm:space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-slate-400 font-bold">STAGE 03</span>
                <Cpu size={15} className="text-emerald-400" />
              </div>
              <h4 className="text-xs sm:text-sm font-bold text-white">GBR & NLP Inference</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Gradient Boosting Regressor calculates portion curves; Aspect NLP categorizes reviews.
              </p>
            </div>

            <div className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-navy-900/60 border border-white/[0.06] space-y-1.5 sm:space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-slate-400 font-bold">STAGE 04</span>
                <Sparkles size={15} className="text-purple-400" />
              </div>
              <h4 className="text-xs sm:text-sm font-bold text-white">Culinary Directives</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Generates chef prep quantities, automated supplier POs, and dynamic margin alerts.
              </p>
            </div>
          </div>
        </div>

        {/* 5 AI Engines Grid + Grounded Assistant Simulator */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
          {/* Left Column: 5 AI Engines (7 cols) */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
            {engines.map((item, idx) => {
              const Icon = item.icon;
              const isWide = idx === 4;
              return (
                <div
                  key={item.id}
                  className={`glass-panel p-4 sm:p-5 rounded-2xl sm:rounded-3xl border-white/[0.07] hover:border-emerald-500/40 transition-all duration-300 flex flex-col justify-between group ${
                    isWide ? 'sm:col-span-2' : ''
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="p-2 sm:p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                        <Icon size={18} />
                      </div>
                      <span className="text-[9px] sm:text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-navy-900 text-slate-300 border border-white/[0.08]">
                        {item.badge}
                      </span>
                    </div>

                    <h4 className="text-sm sm:text-base font-bold text-white font-serif mb-1 group-hover:text-amber-200 transition-colors">
                      {item.title}
                    </h4>

                    <p className="text-xs text-slate-300 leading-relaxed mb-3">
                      {item.desc}
                    </p>
                  </div>

                  <div className="pt-2.5 border-t border-white/[0.06] flex items-center justify-between">
                    <span className="text-[11px] sm:text-xs font-mono font-bold text-emerald-400">
                      {item.metric}
                    </span>
                    <Link
                      to={item.route}
                      className="text-xs font-bold text-amber-400 group-hover:text-amber-300 flex items-center gap-1 touch-target"
                    >
                      <span>Explore</span>
                      <ArrowRight size={13} />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: Grounded AI Assistant Simulator (5 cols) */}
          <div className="lg:col-span-5 glass-panel p-4 sm:p-6 lg:p-7 rounded-2xl sm:rounded-3xl border-white/[0.08] space-y-4 sm:space-y-5">
            <div className="flex items-center justify-between pb-3.5 border-b border-white/[0.08]">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-300 flex-shrink-0">
                  <Bot size={17} />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-white font-serif">KRESTA Natural Query</h4>
                  <span className="text-[9px] sm:text-[10px] text-emerald-400 font-mono">Grounded to Active DB</span>
                </div>
              </div>
              <span className="text-[9px] sm:text-[10px] font-mono text-slate-400 bg-navy-900 px-2 py-0.5 rounded border border-white/[0.08]">
                Simulator
              </span>
            </div>

            {/* Conversation Feed */}
            <div className="space-y-3">
              <div className="flex justify-end">
                <div className="p-3 sm:p-3.5 rounded-2xl rounded-tr-none bg-gradient-to-r from-emerald-600 to-emerald-500 text-slate-950 font-bold text-xs max-w-xs sm:max-w-sm">
                  {selectedQuestion}
                </div>
              </div>

              <div className="flex items-start gap-2">
                <div className="h-6 w-6 sm:h-7 sm:w-7 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-300 flex-shrink-0 mt-0.5">
                  <Bot size={13} />
                </div>
                <div className="p-3.5 sm:p-4 rounded-2xl rounded-tl-none bg-navy-900/90 border border-white/[0.08] text-xs text-slate-200 leading-relaxed">
                  {assistantOutput}
                </div>
              </div>
            </div>

            {/* Question Chips - touch friendly */}
            <div className="pt-3 border-t border-white/[0.08] space-y-2">
              <div className="flex items-center gap-1.5 text-[11px] sm:text-xs text-slate-400">
                <HelpCircle size={12} className="text-amber-400 flex-shrink-0" />
                <span>Test realistic operational queries:</span>
              </div>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {[
                  'Why did food waste increase?',
                  'Why are sales down on Tuesday?',
                  'What should I reorder today?',
                  'Which dish is trending this week?',
                ].map((chip) => (
                  <button
                    key={chip}
                    onClick={() => handleSelectQuestion(chip)}
                    className={`px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl text-xs transition-all touch-target ${
                      selectedQuestion === chip
                        ? 'bg-amber-400 text-slate-950 font-bold shadow-md shadow-amber-400/20'
                        : 'bg-navy-900/80 text-slate-300 hover:text-white hover:bg-navy-850 border border-white/[0.06]'
                    }`}
                  >
                    {chip}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-1">
              <Link
                to="/ai-assistant"
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 px-4 py-3 text-xs font-bold text-slate-950 shadow-md shadow-emerald-500/20 hover:from-emerald-400 hover:to-emerald-500 transition-all touch-target active:scale-98"
              >
                <span>Launch Full Grounded Assistant</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
