import React, { useState } from 'react';
import { MarketingLayout } from '../../components/marketing/MarketingLayout';
import { Mail, Phone, MapPin, CheckCircle, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export const ContactPage: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <MarketingLayout>
      <div className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1 text-xs font-bold text-amber-300">
            <Sparkles size={14} />
            <span>CONNECT WITH HOSPITALITY ARCHITECTS</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-6xl font-extrabold text-white tracking-tight">
            Schedule a Demo or <br />
            <span className="emerald-gradient-text">Architecture Consultation</span>
          </h1>
          <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
            Discuss customized multi-unit rollouts, POS hardware integrations, or pilot programs tailored to your culinary workflow.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Inquiry Form */}
          <div className="glass-card p-8 sm:p-10 rounded-3xl border border-slate-800">
            {submitted ? (
              <div className="text-center py-12 space-y-4">
                <div className="h-16 w-16 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center">
                  <CheckCircle size={32} />
                </div>
                <h3 className="text-2xl font-bold text-white">Inquiry Received</h3>
                <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto">
                  Thank you for reaching out. A KRESTA hospitality technology specialist will review your operational requirements within 24 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Chef Alexander"
                      className="w-full rounded-xl bg-slate-900 border border-slate-800 px-4 py-3 text-sm text-white focus:border-amber-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                      Work Email
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="alex@restaurant.com"
                      className="w-full rounded-xl bg-slate-900 border border-slate-800 px-4 py-3 text-sm text-white focus:border-amber-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                      Restaurant Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="L'Etoile Dining"
                      className="w-full rounded-xl bg-slate-900 border border-slate-800 px-4 py-3 text-sm text-white focus:border-amber-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                      Number of Locations
                    </label>
                    <select className="w-full rounded-xl bg-slate-900 border border-slate-800 px-4 py-3 text-sm text-white focus:border-amber-400 focus:outline-none">
                      <option>1 Location (Single Flagship)</option>
                      <option>2 - 5 Locations</option>
                      <option>6 - 20 Locations</option>
                      <option>20+ Enterprise Units</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                    Primary Operational Interest
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Tell us about your current POS, kitchen bottlenecks, or forecasting objectives..."
                    className="w-full rounded-xl bg-slate-900 border border-slate-800 px-4 py-3 text-sm text-white focus:border-amber-400 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-lg shadow-amber-500/20 transition-all"
                >
                  Request Technical Consultation
                </button>
              </form>
            )}
          </div>

          {/* Quick Demo Access Box */}
          <div className="space-y-6">
            <div className="glass-card p-8 rounded-3xl border border-amber-500/30 space-y-4">
              <div className="flex items-center gap-2 text-amber-400">
                <ShieldCheck size={20} />
                <span className="text-xs font-bold uppercase tracking-wider">Instant Test Credentials</span>
              </div>

              <h3 className="text-xl font-bold text-white">
                Don't Want to Wait? Launch Now.
              </h3>

              <p className="text-xs text-slate-300 leading-relaxed">
                The KRESTA demonstration environment is pre-loaded with realistic restaurant orders, 90-day sales histories, recipe explosions, and trained ML models.
              </p>

              <div className="space-y-2.5 pt-2">
                {[
                  { role: 'Owner', email: 'owner@restaurantiq.com', desc: 'Full executive dashboards, analytics, and settings' },
                  { role: 'Manager', email: 'manager@restaurantiq.com', desc: 'Floor shift management and inventory procurement' },
                  { role: 'Chef', email: 'chef@restaurantiq.com', desc: 'Live kitchen KDS display and recipe waste monitoring' },
                ].map((item) => (
                  <div key={item.role} className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs flex items-center justify-between">
                    <div>
                      <span className="font-bold text-white">{item.role}: </span>
                      <span className="text-slate-400 font-mono text-[11px]">{item.email}</span>
                      <p className="text-[10px] text-slate-500 mt-0.5">{item.desc}</p>
                    </div>
                    <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded">
                      {item.role}@123
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-4">
                <Link
                  to="/login"
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-slate-800 hover:bg-slate-700 py-3 text-xs font-bold text-white transition-colors"
                >
                  <span>Go to 1-Click Login</span>
                  <ArrowRight size={14} className="text-emerald-400" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MarketingLayout>
  );
};
