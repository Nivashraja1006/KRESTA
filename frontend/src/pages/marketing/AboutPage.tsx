import React from 'react';
import { MarketingLayout } from '../../components/marketing/MarketingLayout';
import { Sparkles, Heart, Shield, Award, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AboutPage: React.FC = () => {
  return (
    <MarketingLayout>
      <div className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1 text-xs font-bold text-amber-300">
            <Sparkles size={14} />
            <span>OUR MISSION & VALUES</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-6xl font-extrabold text-white tracking-tight">
            Elevating Hospitality Through <br />
            <span className="emerald-gradient-text">Algorithmic Precision</span>
          </h1>
          <p className="font-serif text-sm font-semibold tracking-widest text-amber-400 uppercase pt-2">
            GOOD FOOD • GREAT MOMENTS
          </p>
          <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto">
            At KRESTA, we believe that the artistry of food should never be constrained by chaotic back-of-house operations.
          </p>
        </div>

        {/* Narrative Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="glass-card-hover p-8 rounded-3xl space-y-4">
            <div className="h-12 w-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-300">
              <Award size={24} />
            </div>
            <h3 className="text-xl font-bold text-white">Culinary Integrity</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              We design software that honors the kitchen line. Chefs shouldn't spend two hours counting tomatoes at midnight; our automated recipe bridge handles it in real time.
            </p>
          </div>

          <div className="glass-card-hover p-8 rounded-3xl space-y-4">
            <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Shield size={24} />
            </div>
            <h3 className="text-xl font-bold text-white">Zero Guesswork</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Foodservice operates on single-digit margins. KRESTA applies proven mathematical models—Gradient Boosting, Isolation Forests, and K-Means—to eliminate waste and protect profitability.
            </p>
          </div>

          <div className="glass-card-hover p-8 rounded-3xl space-y-4">
            <div className="h-12 w-12 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Heart size={24} />
            </div>
            <h3 className="text-xl font-bold text-white">Great Moments</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              When ticket pacing is steady and stations are properly prepped, servers smile and diners savor every bite. That is our ultimate metric of success.
            </p>
          </div>
        </div>

        {/* Brand Banner */}
        <div className="glass-card p-8 sm:p-12 rounded-3xl border border-amber-500/30 text-center max-w-4xl mx-auto space-y-6">
          <img
            src="/kresta-logo-master.png"
            alt="KRESTA Master Logo"
            className="h-16 w-auto mx-auto object-contain"
          />
          <h2 className="font-serif text-2xl sm:text-4xl font-extrabold text-white">
            Designed for Operators Who Care About Every Detail
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
            Experience the KRESTA command center in action today. Jump into live simulated shifts across five distinct restaurant roles.
          </p>
          <div className="pt-2">
            <Link
              to="/login"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 px-7 py-3 text-xs font-bold text-slate-950 shadow-lg shadow-amber-500/20"
            >
              <span>Launch Live System</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    </MarketingLayout>
  );
};
