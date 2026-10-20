import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, UtensilsCrossed } from 'lucide-react';

export const CulinaryStorySection: React.FC = () => {
  return (
    <section id="story" className="py-16 sm:py-24 relative bg-[#05070e] border-t border-amber-500/15 overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-1/2 left-1/4 w-[400px] h-[400px] bg-amber-500/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left: Chef / Kitchen Photo */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden border border-amber-500/20 shadow-2xl bg-[#090c16]">
              <img
                src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1000&auto=format&fit=crop&q=85"
                alt="KRESTA Master Chef preparing hand-crafted cuisine"
                className="w-full h-[360px] sm:h-[420px] object-cover filter brightness-[0.92]"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#05070e] via-transparent to-transparent opacity-80" />

              {/* Floating Credo Overlay */}
              <div className="absolute bottom-5 left-5 right-5 p-4 rounded-2xl bg-[#080b15]/90 border border-amber-500/30 backdrop-blur-xl shadow-xl">
                <p className="font-serif italic text-xs sm:text-sm text-white leading-relaxed">
                  &ldquo;Patience over low embers, the fragrance of Super Negin saffron, and the quiet dignity of timeless recipes.&rdquo;
                </p>
                <p className="text-[10px] text-amber-300 mt-1 font-mono uppercase tracking-wider">
                  &mdash; Executive Chef, KRESTA
                </p>
              </div>
            </div>
          </div>

          {/* Right: Concise Story Narrative */}
          <div className="lg:col-span-7 space-y-5">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-[#0a0d18]/90 px-3.5 py-1 text-[11px] font-bold text-amber-300">
              <Sparkles size={12} />
              <span>OUR HERITAGE</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight leading-tight">
              Crafted With Passion. <br />
              <span className="emerald-gradient-text">Served With Soul.</span>
            </h2>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
              KRESTA honors time-tested cooking methods: slow-steaming basmati in dough-sealed clay handis, roasting skewered meats in fiery charcoal tandoors, and infusing dishes with pure Kashmiri saffron.
            </p>

            {/* Three Heritage Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-3 border-t border-white/[0.08]">
              <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                <span className="text-xl mb-1.5 block">🌾</span>
                <h4 className="font-serif font-bold text-sm text-white">Aged Basmati</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">24-month aged grains for delicate fragrance.</p>
              </div>

              <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                <span className="text-xl mb-1.5 block">🔥</span>
                <h4 className="font-serif font-bold text-sm text-white">Clay Tandoor</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">Natural charcoal embers for deep smoke flavor.</p>
              </div>

              <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                <span className="text-xl mb-1.5 block">🌿</span>
                <h4 className="font-serif font-bold text-sm text-white">Pure Saffron</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">Single-origin Kashmiri saffron threads.</p>
              </div>
            </div>

            {/* Action */}
            <div className="pt-2">
              <Link
                to="/order"
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold text-xs sm:text-sm px-6 py-3 shadow-md shadow-amber-500/20 transition-all active:scale-95"
              >
                <UtensilsCrossed size={14} />
                <span>Explore Full Menu</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
