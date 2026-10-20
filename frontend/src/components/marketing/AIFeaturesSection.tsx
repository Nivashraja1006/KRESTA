import React from 'react';
import { Link } from 'react-router-dom';
import {
  TrendingUp,
  Package,
  Trash2,
  Users,
  MessageSquareHeart,
  ArrowRight,
  Sparkles
} from 'lucide-react';

interface FeatureCard {
  title: string;
  badge: string;
  description: string;
  metricLabel: string;
  metricValue: string;
  icon: any;
  link: string;
  accentColor: string;
  borderColor: string;
}

export const AIFeaturesSection: React.FC = () => {
  const features: FeatureCard[] = [
    {
      title: 'AI Demand Forecast',
      badge: 'Gradient Boosting Regressor',
      description: 'Anticipates guest covers and item-level portion demand 7 days ahead with day-of-week cyclic harmonics.',
      metricLabel: 'Model Accuracy',
      metricValue: '94.2% Forecast Match',
      icon: TrendingUp,
      link: '/forecast',
      accentColor: 'text-emerald-400 bg-emerald-500/10',
      borderColor: 'hover:border-emerald-500/50',
    },
    {
      title: 'AI Inventory Optimizer',
      badge: 'Dynamic Safety Buffers',
      description: 'Automatically calculates economic order quantities, lead-time thresholds, and stockout probability curves.',
      metricLabel: 'Monthly Waste Prevented',
      metricValue: '$2,480 Average',
      icon: Package,
      link: '/recommendations',
      accentColor: 'text-amber-400 bg-amber-500/10',
      borderColor: 'hover:border-amber-500/50',
    },
    {
      title: 'Food Waste Intelligence',
      badge: 'Scrap & Portion Analytics',
      description: 'Isolates kitchen preparation scrap vs. table discards to pinpoint recipe inflation and gross margin leaks.',
      metricLabel: 'Waste Reduction',
      metricValue: '-28% in 60 Days',
      icon: Trash2,
      link: '/waste',
      accentColor: 'text-rose-400 bg-rose-500/10',
      borderColor: 'hover:border-rose-500/50',
    },
    {
      title: 'Customer RFM Intelligence',
      badge: 'K-Means Clustering',
      description: 'Segments diner base into VIPs, Consistent Regulars, and At-Risk guests based on recency, frequency, and spend.',
      metricLabel: 'VIP Guest Retention',
      metricValue: '3.8x Repeat Visits',
      icon: Users,
      link: '/customers',
      accentColor: 'text-blue-400 bg-blue-500/10',
      borderColor: 'hover:border-blue-500/50',
    },
    {
      title: 'Review Sentiment Intelligence',
      badge: 'Aspect-Based NLP',
      description: 'Classifies customer reviews across Food, Service, Ambience, and Value, highlighting sentiment shifts instantly.',
      metricLabel: 'Positive Sentiment',
      metricValue: '98% Positive Rating',
      icon: MessageSquareHeart,
      link: '/reviews',
      accentColor: 'text-purple-400 bg-purple-500/10',
      borderColor: 'hover:border-purple-500/50',
    },
  ];

  return (
    <section id="ai-features" className="py-24 relative bg-slate-900/40 border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-slate-900/80 px-4 py-1 text-xs font-bold text-amber-300">
            <Sparkles size={14} />
            <span>ALGORITHMIC COMMAND</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            YOUR RESTAURANT <br />
            <span className="emerald-gradient-text">HAS A SECOND BRAIN.</span>
          </h2>

          <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
            Five specialized machine-learning pipelines constantly ingest operational telemetry to automate decisions, protect margins, and elevate dining experiences.
          </p>
        </div>

        {/* 5 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((item, idx) => {
            const Icon = item.icon;
            const isWide = idx === 4;

            return (
              <div
                key={item.title}
                className={`glass-card p-7 rounded-3xl transition-all duration-300 flex flex-col justify-between group ${item.borderColor} hover:-translate-y-1.5 hover:shadow-2xl ${
                  isWide ? 'md:col-span-2 lg:col-span-1' : ''
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className={`p-3 rounded-2xl ${item.accentColor} border border-white/5`}>
                      <Icon size={22} />
                    </div>
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full bg-slate-800/80 text-slate-300 border border-slate-700/80">
                      {item.badge}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-2.5 group-hover:text-amber-300 transition-colors">
                    {item.title}
                  </h3>

                  <p className="text-xs text-slate-400 leading-relaxed mb-6">
                    {item.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider">{item.metricLabel}</p>
                    <p className="text-xs font-extrabold text-white font-mono mt-0.5">{item.metricValue}</p>
                  </div>

                  <Link
                    to={item.link}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 group-hover:text-amber-300 group-hover:translate-x-1 transition-all"
                  >
                    <span>Explore</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
