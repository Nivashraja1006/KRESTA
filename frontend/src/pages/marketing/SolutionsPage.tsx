import React from 'react';
import { MarketingLayout } from '../../components/marketing/MarketingLayout';
import {
  UtensilsCrossed,
  Building2,
  Coffee,
  Flame,
  CheckCircle,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const SolutionsPage: React.FC = () => {
  const segments = [
    {
      title: 'Fine Dining & Gastronomy',
      icon: UtensilsCrossed,
      tag: 'Precision & Margin Control',
      description: 'Preserve high ingredient integrity, manage multi-course table pacing, and track exact gram-level waste across luxury cuts and rare vintages.',
      points: [
        'Table course sequencing and hold times',
        'High-value ingredient batching and yield ratios',
        'VIP diner preferences and spend history',
      ],
    },
    {
      title: 'Multi-Unit Restaurant Groups',
      icon: Building2,
      tag: 'Enterprise Scalability',
      description: 'Standardize recipes, aggregate purchasing leverage, and monitor store-by-store sales variance across regions from a single dashboard.',
      points: [
        'Consolidated group executive analytics',
        'Bulk purchase order dispatches',
        'Cross-branch menu pricing and recipe syncing',
      ],
    },
    {
      title: 'Modern Bistros & Casual Dining',
      icon: Coffee,
      tag: 'High Table Turnover',
      description: 'Accelerate order-to-kitchen velocity, eliminate table order confusion during peak hours, and keep inventory reorders completely hands-free.',
      points: [
        'Touch-optimized POS with floor table mapping',
        'Real-time delayed ticket warnings',
        'Automated low-stock supplier triggers',
      ],
    },
    {
      title: 'Ghost & Cloud Kitchens',
      icon: Flame,
      tag: 'Virtual Brands & Delivery',
      description: 'Maximize kitchen square-footage output, balance multiple brand tickets on a single KDS screen, and dynamically adjust prep based on delivery demand.',
      points: [
        'Multi-concept menu isolation on one line',
        'Delivery courier handoff tracking',
        'Hourly sales pacing by delivery platform',
      ],
    },
  ];

  return (
    <MarketingLayout>
      <div className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1 text-xs font-bold text-amber-300">
            <Sparkles size={14} />
            <span>TAILORED INDUSTRY SOLUTIONS</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-6xl font-extrabold text-white tracking-tight">
            Engineered for the Reality of <br />
            <span className="emerald-gradient-text">Every Kitchen Format</span>
          </h1>
          <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
            Whether running an intimate Michelin-starred dining room or a 50-location hospitality enterprise, KRESTA adapts to your operational rhythm.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {segments.map((seg) => {
            const Icon = seg.icon;
            return (
              <div key={seg.title} className="glass-card-hover p-8 rounded-3xl border border-slate-800 space-y-5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="h-12 w-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-300">
                      <Icon size={24} />
                    </div>
                    <span className="text-[10px] uppercase font-bold tracking-wider px-3 py-1 rounded-full bg-slate-900 text-emerald-400 border border-emerald-500/20">
                      {seg.tag}
                    </span>
                  </div>

                  <h3 className="text-2xl font-bold text-white mb-2">{seg.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6">
                    {seg.description}
                  </p>

                  <ul className="space-y-2.5">
                    {seg.points.map((pt, i) => (
                      <li key={i} className="flex items-center gap-2 text-xs text-slate-300">
                        <CheckCircle size={14} className="text-emerald-400 flex-shrink-0" />
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-6 border-t border-slate-800/80">
                  <Link
                    to="/contact"
                    className="inline-flex items-center gap-2 text-xs font-bold text-amber-400 hover:text-amber-300 group"
                  >
                    <span>Schedule Custom Demo</span>
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </MarketingLayout>
  );
};
