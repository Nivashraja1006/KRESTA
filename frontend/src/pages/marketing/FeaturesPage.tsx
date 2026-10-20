import React, { useState } from 'react';
import { MarketingLayout } from '../../components/marketing/MarketingLayout';
import {
  ShoppingBag,
  ChefHat,
  Package,
  TrendingUp,
  Users,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const FeaturesPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'All Features' },
    { id: 'pos', label: 'Point of Sale (POS)', icon: ShoppingBag },
    { id: 'kds', label: 'Kitchen KDS', icon: ChefHat },
    { id: 'inventory', label: 'Inventory & Recipes', icon: Package },
    { id: 'ai', label: 'Machine Learning', icon: TrendingUp },
    { id: 'crm', label: 'Customer RFM', icon: Users },
  ];

  const features = [
    {
      category: 'pos',
      title: 'Touch Table Ordering',
      desc: 'Visual table management with split checks, modifier selection, and instant kitchen transmission.',
    },
    {
      category: 'pos',
      title: 'Automatic Tax & Discount Matrix',
      desc: 'Branch-specific dynamic tax calculation and authorized manager discount controls.',
    },
    {
      category: 'kds',
      title: 'Real-Time WebSocket Queue',
      desc: 'Duplex communication ensuring orders appear on line cook displays in under 20 milliseconds.',
    },
    {
      category: 'kds',
      title: 'Delayed Ticket Color Alerts',
      desc: 'Visual timers changing from emerald to amber to flashing rose when tickets exceed target prep time.',
    },
    {
      category: 'inventory',
      title: 'Gram-Level Recipe Explosion',
      desc: 'Cooking an order automatically deducts calibrated portions of raw ingredients from storage.',
    },
    {
      category: 'inventory',
      title: 'Low-Stock & Safety Buffers',
      desc: 'Automated warnings and purchase order drafts when ingredients cross minimum thresholds.',
    },
    {
      category: 'ai',
      title: '7-Day Demand Forecaster',
      desc: 'Gradient Boosting ML anticipating plate counts per dish based on historical trends and weather.',
    },
    {
      category: 'ai',
      title: 'Isolation Forest Anomaly Detector',
      desc: 'Flags suspicious discounts, revenue drops, or abnormal waste spikes across all branches.',
    },
    {
      category: 'crm',
      title: 'K-Means Customer Segmentation',
      desc: 'Groups diners into VIPs, Loyal Regulars, and Churn Risks to maximize lifetime revenue.',
    },
    {
      category: 'crm',
      title: 'Aspect Review Sentiment',
      desc: 'Extracts real-time guest sentiment across Food Quality, Service Speed, and Ambience.',
    },
  ];

  const filtered = activeCategory === 'all'
    ? features
    : features.filter((f) => f.category === activeCategory);

  return (
    <MarketingLayout>
      <div className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1 text-xs font-bold text-amber-300">
            <Sparkles size={14} />
            <span>COMPLETE CAPABILITY MATRIX</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-6xl font-extrabold text-white tracking-tight">
            Comprehensive Capabilities for <br />
            <span className="emerald-gradient-text">World-Class Restaurants</span>
          </h1>
          <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
            Explore the specialized operational, culinary, and algorithmic features built into KRESTA Restaurant Intelligence.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeCategory === cat.id
                  ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20'
                  : 'bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((item, idx) => (
            <div key={idx} className="glass-card-hover p-6 rounded-3xl border border-slate-800 space-y-3">
              <div className="flex items-center gap-2 text-emerald-400">
                <CheckCircle2 size={18} />
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                  {item.category.toUpperCase()}
                </span>
              </div>
              <h3 className="text-base font-bold text-white">{item.title}</h3>
              <p className="text-xs text-slate-300 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="text-center pt-8">
          <Link
            to="/login"
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 px-6 py-3.5 text-xs font-bold text-slate-950 shadow-lg shadow-emerald-500/20"
          >
            <span>Launch Live Experience</span>
            <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </MarketingLayout>
  );
};
