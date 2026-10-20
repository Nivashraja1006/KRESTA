import React from 'react';
import { MarketingLayout } from '../../components/marketing/MarketingLayout';
import {
  TrendingUp,
  Package,
  Trash2,
  Users,
  MessageSquareHeart,
  Sparkles,
  ArrowRight,
  BrainCircuit,
  CheckCircle2
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const AIIntelligencePage: React.FC = () => {
  const models = [
    {
      title: 'Gradient Boosting Demand Forecaster',
      algorithm: 'Scikit-Learn GradientBoostingRegressor',
      category: 'Demand & Revenue',
      icon: TrendingUp,
      features: ['Lag-1, Lag-7 sales vectors', 'Cyclic day-of-week harmonics', 'Rolling 14-day mean & std', 'Holiday and weather indicators'],
      benefit: 'Prevents under-prepping during peak surges while eliminating over-purchasing on slow days.',
    },
    {
      title: 'Dynamic Safety Stock & EOQ Optimizer',
      algorithm: 'Probabilistic Lead-Time Consumption Modeling',
      category: 'Supply Chain & Inventory',
      icon: Package,
      features: ['Lead-time variability buffers', 'Supplier minimum order quantities', 'Portion-level recipe explosion', 'Shelf-life expiration tracking'],
      benefit: 'Automatically recommends optimal reorder dates before stock breaches critical thresholds.',
    },
    {
      title: 'Isolation Forest Anomaly Detection',
      algorithm: 'Scikit-Learn IsolationForest (Contamination: 0.08)',
      category: 'Fraud & Waste Prevention',
      icon: Trash2,
      features: ['Multi-dimensional variance scoring', 'Scrap cost deviation', 'Abnormal discount volume', 'High-severity automated alerts'],
      benefit: 'Flags unrecorded scrap, employee theft, or sudden operational bottlenecks without manual review.',
    },
    {
      title: 'Customer RFM Segmentation',
      algorithm: 'K-Means Clustering with StandardScaler (k=4)',
      category: 'Guest Loyalty & CRM',
      icon: Users,
      features: ['Recency score (days since visit)', 'Frequency score (total visit count)', 'Monetary score (lifetime gross spend)', 'Automated cluster label assignment'],
      benefit: 'Empowers marketing teams to trigger VIP perks and re-engage at-risk regulars before churn.',
    },
    {
      title: 'Aspect-Based Review Sentiment Analyzer',
      algorithm: 'Multi-Dimension Lexical Polarity Classification',
      category: 'Guest Experience & Quality',
      icon: MessageSquareHeart,
      features: ['Food taste & temperature aspect', 'Service speed & friendliness', 'Ambience & noise metrics', 'Price-to-value perception ratio'],
      benefit: 'Pinpoints whether guest satisfaction dips stem from the kitchen, floor staff, or pricing.',
    },
  ];

  return (
    <MarketingLayout>
      <div className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1 text-xs font-bold text-amber-300">
            <BrainCircuit size={14} />
            <span>MACHINE LEARNING ENGINE</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-6xl font-extrabold text-white tracking-tight">
            Algorithmic Intelligence <br />
            <span className="emerald-gradient-text">Trained on Culinary Reality</span>
          </h1>
          <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
            KRESTA does not rely on vague generative heuristics. Our platform deploys specialized, verifiable mathematical models solving the most critical operational challenges in foodservice.
          </p>
        </div>

        {/* 5 Model Detailed Showcase */}
        <div className="space-y-6">
          {models.map((model, idx) => {
            const Icon = model.icon;
            return (
              <div
                key={model.title}
                className="glass-card-hover p-7 sm:p-8 rounded-3xl border border-slate-800 flex flex-col lg:flex-row lg:items-center justify-between gap-6"
              >
                <div className="space-y-3 max-w-2xl">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300">
                      <Icon size={20} />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">
                        {model.category}
                      </span>
                      <h3 className="text-xl font-bold text-white">{model.title}</h3>
                    </div>
                  </div>

                  <p className="text-xs font-mono text-emerald-400">
                    Algorithm: {model.algorithm}
                  </p>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    {model.benefit}
                  </p>

                  <div className="pt-2 flex flex-wrap gap-2">
                    {model.features.map((feat, i) => (
                      <span
                        key={i}
                        className="text-[10px] font-medium bg-slate-900 border border-slate-800 text-slate-300 px-2.5 py-1 rounded-lg"
                      >
                        &bull; {feat}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="self-start lg:self-center">
                  <Link
                    to="/login"
                    className="inline-flex items-center gap-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 px-5 py-2.5 text-xs font-bold text-white transition-colors"
                  >
                    <span>View Model Output</span>
                    <ArrowRight size={14} className="text-amber-400" />
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
