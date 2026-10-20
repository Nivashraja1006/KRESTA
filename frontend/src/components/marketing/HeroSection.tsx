import React from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { UtensilsCrossed, ArrowRight, ChevronRight, Star, Clock, MapPin } from 'lucide-react';

export const HeroSection: React.FC = () => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-[#05070d]">
      {/* 1. Full-Bleed Royal Biryani Background — COMPLETELY STATIONARY: No movement, zooming, panning, or parallax */}
      <div
        className="absolute inset-0 w-full h-full bg-cover bg-center lg:bg-[center_right] filter brightness-[0.88] contrast-[1.05] pointer-events-none"
        style={{
          backgroundImage: `url('/kresta-hero-biryani-split.jpg')`,
        }}
      />

      {/* 2. Carefully Balanced Dark Overlays for Text Legibility while Biryani stays Bright & Dominant */}
      {/* Left text shadow gradient on desktop */}
      <div className="absolute inset-y-0 left-0 w-full lg:w-[62%] bg-gradient-to-r from-[#05070d] via-[#05070d]/85 to-transparent pointer-events-none z-10" />
      {/* Mobile darkening radial overlay */}
      <div className="lg:hidden absolute inset-0 bg-[#05070d]/65 backdrop-blur-[1px] pointer-events-none z-10" />
      {/* Top navbar blend gradient */}
      <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-[#05070d]/95 via-[#05070d]/50 to-transparent pointer-events-none z-10" />
      {/* Bottom section blend gradient */}
      <div className="absolute bottom-0 inset-x-0 h-36 bg-gradient-to-t from-[#05070d] via-[#05070d]/70 to-transparent pointer-events-none z-10" />

      {/* 3. ONLY REALISTIC STEAM RISING GENTLY FROM THE HOT BIRYANI (NO other food or particle animations) */}
      {!shouldReduceMotion && (
        <div className="absolute inset-0 pointer-events-none z-15 overflow-hidden">
          {/* Wisp 1 — Core Plume rising from the center surface of the biryani */}
          <motion.div
            animate={{
              y: [15, -75, -165],
              x: [0, 10, -8, 2],
              opacity: [0, 0.38, 0.2, 0],
              scaleX: [0.85, 1.25, 1.65],
              scaleY: [0.85, 1.35, 1.8],
            }}
            transition={{
              duration: 7.4,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 0,
            }}
            className="absolute bottom-[38%] right-[23%] lg:right-[26%] w-28 sm:w-36 h-60 sm:h-72 bg-gradient-to-t from-slate-200/25 via-slate-100/12 to-transparent rounded-full filter blur-2xl sm:blur-3xl"
          />

          {/* Wisp 2 — Left curl rising softly from the left crest of the rice */}
          <motion.div
            animate={{
              y: [18, -85, -180],
              x: [0, -12, 6, -2],
              opacity: [0, 0.34, 0.16, 0],
              scaleX: [0.8, 1.2, 1.55],
              scaleY: [0.85, 1.4, 1.85],
            }}
            transition={{
              duration: 8.2,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 2.2,
            }}
            className="absolute bottom-[40%] right-[28%] lg:right-[31%] w-24 sm:w-32 h-56 sm:h-68 bg-gradient-to-t from-slate-200/22 via-slate-100/10 to-transparent rounded-full filter blur-2xl sm:blur-3xl"
          />

          {/* Wisp 3 — Right curl rising gently from the right crest of the rice */}
          <motion.div
            animate={{
              y: [20, -68, -150],
              x: [0, 14, -8, 3],
              opacity: [0, 0.3, 0.14, 0],
              scaleX: [0.75, 1.15, 1.5],
              scaleY: [0.8, 1.25, 1.65],
            }}
            transition={{
              duration: 7.0,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 4.5,
            }}
            className="absolute bottom-[39%] right-[17%] lg:right-[20%] w-22 sm:w-28 h-52 sm:h-64 bg-gradient-to-t from-slate-200/20 via-slate-100/08 to-transparent rounded-full filter blur-2xl sm:blur-3xl"
          />

          {/* Wisp 4 — Delicate atmospheric vapor drifting slowly upward */}
          <motion.div
            animate={{
              y: [22, -60, -135],
              x: [0, -6, 8, 0],
              opacity: [0, 0.24, 0.1, 0],
              scaleX: [0.85, 1.2, 1.5],
              scaleY: [0.85, 1.3, 1.6],
            }}
            transition={{
              duration: 9.0,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 1.2,
            }}
            className="absolute bottom-[41%] right-[25%] lg:right-[28%] w-32 sm:w-40 h-48 sm:h-60 bg-gradient-to-t from-white/18 via-slate-200/08 to-transparent rounded-full filter blur-3xl"
          />
        </div>
      )}

      {/* 4. MAIN HERO CONTENT: DESKTOP SPLIT LAYOUT (LEFT TEXT, RIGHT FOOD CLEARANCE) */}
      <div className="relative z-20 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 w-full pt-32 pb-20 sm:pt-40 sm:pb-28 lg:pt-36 lg:pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-center gap-8 lg:gap-12">
          
          {/* LEFT SIDE — TEXT CONTENT */}
          <div className="lg:col-span-7 flex flex-col items-start text-left space-y-6 sm:space-y-7">
            
            {/* Small Gold-Outlined Pill: "AUTHENTIC INDIAN FLAVOURS" */}
            <motion.div
              initial={shouldReduceMotion ? false : { opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="inline-flex items-center gap-2.5 rounded-full border border-amber-400/60 bg-[#0a0d18]/90 px-4 py-1.5 shadow-[0_0_20px_rgba(212,175,55,0.2)] backdrop-blur-xl"
            >
              <span className="flex h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse flex-shrink-0" />
              <span className="font-serif text-[11px] sm:text-xs font-bold tracking-[0.24em] text-amber-200 uppercase">
                AUTHENTIC INDIAN FLAVOURS
              </span>
            </motion.div>

            {/* Large Elegant Serif Heading on Two Lines */}
            <motion.div
              initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-1"
            >
              <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-[66px] xl:text-[74px] font-bold tracking-tight leading-[1.08] drop-shadow-[0_4px_24px_rgba(0,0,0,0.9)]">
                <span className="text-[#fdfbf7]">Royal Flavours.</span>
                <br />
                <span className="bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 bg-clip-text text-transparent drop-shadow-[0_0_35px_rgba(212,175,55,0.45)]">
                  Freshly Crafted.
                </span>
              </h1>
            </motion.div>

            {/* Supporting Text */}
            <motion.p
              initial={shouldReduceMotion ? false : { opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="text-base sm:text-lg text-slate-200/90 max-w-xl font-normal leading-relaxed drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]"
            >
              Freshly prepared favourites, served with care.
            </motion.p>

            {/* Two Buttons Side by Side */}
            <motion.div
              initial={shouldReduceMotion ? false : { opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-1 w-full sm:w-auto"
            >
              {/* "Order Online" — Glowing Gold Gradient, Dining Icon and Arrow */}
              <Link
                to="/order"
                className="group relative inline-flex items-center justify-center gap-2.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 px-8 py-4 text-sm font-bold text-slate-950 shadow-[0_12px_35px_rgba(212,175,55,0.4)] hover:from-amber-300 hover:to-amber-500 hover:shadow-[0_16px_45px_rgba(212,175,55,0.58)] transition-all duration-300 active:scale-95 touch-target"
              >
                <UtensilsCrossed size={17} className="text-slate-950 group-hover:rotate-12 transition-transform" />
                <span>Order Online</span>
                <ArrowRight size={16} className="text-slate-950 group-hover:translate-x-1 transition-transform" />
              </Link>

              {/* "Explore Menu" — Dark Transparent Background, Subtle Gold Border and Arrow */}
              <a
                href="#featured-dishes"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-amber-500/40 bg-black/45 backdrop-blur-xl px-7 py-4 text-sm font-semibold text-slate-100 hover:text-white hover:border-amber-400 hover:bg-black/65 shadow-xl transition-all duration-300 active:scale-95 touch-target"
              >
                <span>Explore Menu</span>
                <ChevronRight size={16} className="text-amber-400" />
              </a>
            </motion.div>

            {/* Bottom Information Row with Gold Stars, Reviews, Prep Time, Locations */}
            <motion.div
              initial={shouldReduceMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.65, delay: 0.4 }}
              className="flex flex-wrap items-center gap-3 sm:gap-5 pt-3 text-xs text-slate-300/85 drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]"
            >
              {/* Star Rating & Accolades */}
              <div className="flex items-center gap-1.5">
                <span className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={13} fill="currentColor" />
                  ))}
                </span>
                <span className="font-bold text-white">4.8 / 5</span>
                <span className="text-slate-400">(1,840+ reviews)</span>
              </div>

              <span className="hidden sm:inline-block h-3.5 w-px bg-white/20" />

              {/* Fresh Preparation Time */}
              <div className="flex items-center gap-1.5">
                <Clock size={13} className="text-emerald-400" />
                <span>15–25 min fresh preparation</span>
              </div>

              <span className="hidden sm:inline-block h-3.5 w-px bg-white/20" />

              {/* SF Locations */}
              <div className="flex items-center gap-1.5">
                <MapPin size={13} className="text-amber-400" />
                <span>3 SF locations</span>
              </div>
            </motion.div>

          </div>

          {/* RIGHT SIDE — Negative Clearance for Dominant Food Composition */}
          <div className="lg:col-span-5 hidden lg:flex items-center justify-center pointer-events-none min-h-[420px]" />

        </div>
      </div>
    </section>
  );
};

