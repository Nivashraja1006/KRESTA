import React from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { Sparkles, UtensilsCrossed, Calendar, ArrowRight, Clock, MapPin } from 'lucide-react';

export const CustomerCTASection: React.FC = () => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="relative py-20 sm:py-28 overflow-hidden border-t border-amber-500/15">
      {/* 1. Full-Width Background Image */}
      <div
        className="absolute inset-0 w-full h-full bg-cover bg-center filter brightness-[0.52] contrast-[1.08] pointer-events-none"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=2000&auto=format&fit=crop&q=85')`,
        }}
      />

      {/* 2. Layered Vignette & Ambient Glows */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/92 via-black/75 to-black/92 pointer-events-none z-10" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#060810] via-transparent to-[#060810]/70 pointer-events-none z-10" />

      {/* Floating Ambient Particles & Soft Light */}
      {!shouldReduceMotion && (
        <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
          <motion.div
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.6, 0.2],
            }}
            transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-1/3 left-1/4 w-2 h-2 rounded-full bg-amber-400/80 shadow-[0_0_10px_#fbbf24]"
          />
          <motion.div
            animate={{
              y: [15, -25, 15],
              opacity: [0.15, 0.5, 0.15],
            }}
            transition={{ duration: 8.5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
            className="absolute top-1/2 right-1/4 w-1.5 h-1.5 rounded-full bg-amber-300 shadow-[0_0_8px_#fbbf24]"
          />
        </div>
      )}

      {/* 3. Centered Table Booking Call-to-Action */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 text-center space-y-6">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/35 bg-[#0a0d18]/90 px-3.5 py-1 text-[11px] font-bold text-amber-300">
          <Sparkles size={12} />
          <span>TABLE RESERVATIONS</span>
        </div>

        {/* Short, Readable Heading */}
        <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight leading-tight">
          Reserve Your Table
        </h2>

        {/* One Short Supporting Sentence */}
        <p className="text-sm sm:text-base text-slate-200 max-w-xl mx-auto font-normal leading-relaxed">
          Join us for an unforgettable dining experience in our main hall or private salon.
        </p>

        {/* Action Buttons: Book a Table & Order Online */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2 max-w-sm sm:max-w-none mx-auto">
          {/* Functional "Book a Table" Button connected to /contact reservation flow */}
          <Link
            to="/contact"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 px-7 py-3.5 text-xs sm:text-sm font-bold text-slate-950 shadow-[0_10px_30px_rgba(212,175,55,0.35)] hover:from-amber-300 hover:to-amber-500 transition-all active:scale-95 touch-target"
          >
            <Calendar size={16} />
            <span>Book a Table</span>
            <ArrowRight size={14} />
          </Link>

          {/* Delivery Order Button */}
          <Link
            to="/order"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-black/45 backdrop-blur-xl px-6 py-3.5 text-xs sm:text-sm font-semibold text-white hover:border-amber-400/50 hover:bg-black/60 shadow-lg transition-all active:scale-95 touch-target"
          >
            <UtensilsCrossed size={15} className="text-amber-400" />
            <span>Order Online</span>
          </Link>
        </div>

        {/* Operating Hours Bar */}
        <div className="pt-4 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-300">
          <span className="flex items-center gap-1.5">
            <Clock size={13} className="text-emerald-400" />
            <span>Open daily: 10:00 AM – 11:30 PM</span>
          </span>
          <span className="flex items-center gap-1.5">
            <MapPin size={13} className="text-amber-400" />
            <span>Downtown, Uptown &amp; SFO Flagships</span>
          </span>
        </div>
      </div>
    </section>
  );
};
