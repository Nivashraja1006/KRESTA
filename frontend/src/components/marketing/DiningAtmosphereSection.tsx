import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Calendar, ArrowRight } from 'lucide-react';

export const DiningAtmosphereSection: React.FC = () => {
  const [activeSpaceIndex, setActiveSpaceIndex] = useState(0);

  const spaces = [
    {
      title: 'The Grand Dining Hall',
      tagline: 'Ambient Elegance & Warm Amber Glow',
      capacity: 'Seating for up to 90 guests',
      description: 'Under soaring ceilings adorned with hand-beaten copper chandeliers, the Grand Dining Hall offers intimate booths and communal banquet tables crafted from reclaimed cedar. An ambiance curated for meaningful celebrations.',
      image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&auto=format&fit=crop&q=85',
      features: ['Velvet Banquette Seating', 'Acoustic Soundproofing', 'Sommelier Pairing Service']
    },
    {
      title: 'The Private Saffron Room',
      tagline: 'Exclusive Dining & Bespoke Tasting Menus',
      capacity: '8 to 16 guests',
      description: 'An intimate dining salon secluded behind carved brass screens. Featuring a single slab live-edge walnut dining table, dedicated waitstaff, and custom multi-course tasting menus prepared personally by the Executive Chef.',
      image: 'https://images.unsplash.com/photo-1578474846511-04ba529f0b88?w=1200&auto=format&fit=crop&q=85',
      features: ['Dedicated Chef & Service Team', 'Bespoke Wine Pairings', 'Personalized Menu Cards']
    },
    {
      title: 'The Hearth & Chef Counter',
      tagline: 'Front-Row View to Open Fire & Clay Ovens',
      capacity: '12 counter seats',
      description: 'Perch along the marble chef counter with direct sightlines to the 850° volcanic stone oven and roaring charcoal tandoors. Engage directly with our culinary masters as each course is plated before your eyes.',
      image: 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?w=1200&auto=format&fit=crop&q=85',
      features: ['Omakase-Style Plating', 'Direct Chef Engagement', 'Warm Bread from Hearth']
    },
    {
      title: 'The Botanical Cocktail Lounge',
      tagline: 'Handcrafted Elixirs & Late-Night Bites',
      capacity: '40 lounge seats',
      description: 'A seductive retreat featuring low marble cocktail tables, soft jazz, and an innovative beverage program showcasing Alfonso mango shrubs, damask rose reductions, and rare aged spirits.',
      image: 'https://images.unsplash.com/photo-1572116469696-31de0f17cc34?w=1200&auto=format&fit=crop&q=85',
      features: ['Signature Botanical Mixology', 'Small Bites & Sliders', 'Vinyl Record Soundscape']
    }
  ];

  const currentSpace = spaces[activeSpaceIndex];

  return (
    <section id="atmosphere" className="py-20 sm:py-28 lg:py-32 relative bg-[#060810] border-t border-amber-500/15 overflow-hidden">
      {/* Background radial lighting */}
      <div className="absolute top-1/2 right-10 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-[#0a0d18]/90 px-3.5 py-1.5 text-[11px] sm:text-xs font-bold text-amber-300">
            <Sparkles size={13} />
            <span>THE DINING EXPERIENCE</span>
          </div>

          <h2 className="font-serif fluid-section-headline font-bold text-white tracking-tight">
            Atmosphere Designed For <br />
            <span className="emerald-gradient-text">Connection &amp; Conversation.</span>
          </h2>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl mx-auto">
            From the warmth of our main dining hall to the seclusion of the Saffron Room, every corner of KRESTA is crafted to elevate your senses.
          </p>
        </div>

        {/* Space Selector Tabs */}
        <div className="flex items-center justify-center gap-2 sm:gap-3 overflow-x-auto pb-4 mb-8 sm:mb-10 scrollbar-none">
          {spaces.map((space, idx) => {
            const active = activeSpaceIndex === idx;
            return (
              <button
                key={space.title}
                onClick={() => setActiveSpaceIndex(idx)}
                className={`px-4 sm:px-6 py-2.5 sm:py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap border ${
                  active
                    ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-lg shadow-amber-500/20'
                    : 'bg-white/[0.03] text-slate-300 hover:text-white hover:bg-white/[0.07] border-white/[0.08]'
                }`}
              >
                {space.title}
              </button>
            );
          })}
        </div>

        {/* Space Showcase Card */}
        <div className="rounded-3xl bg-[#090c17] border border-amber-500/20 overflow-hidden shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
            {/* Visual Column */}
            <div className="lg:col-span-7 relative min-h-[300px] sm:min-h-[420px] overflow-hidden">
              <img
                src={currentSpace.image}
                alt={currentSpace.title}
                className="w-full h-full object-cover transition-all duration-700 ease-out"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#090c17] via-transparent to-transparent opacity-80 lg:hidden" />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#090c17] opacity-90 hidden lg:block" />

              <div className="absolute top-4 left-4 px-3 py-1 rounded-xl bg-black/60 backdrop-blur-md text-amber-300 text-xs font-bold border border-white/10">
                {currentSpace.capacity}
              </div>
            </div>

            {/* Content Column */}
            <div className="lg:col-span-5 p-6 sm:p-10 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <span className="text-xs font-mono text-emerald-400 font-bold uppercase tracking-wider block">
                  {currentSpace.tagline}
                </span>

                <h3 className="font-serif font-black text-2xl sm:text-3xl text-white">
                  {currentSpace.title}
                </h3>

                <p className="text-sm text-slate-300 leading-relaxed">
                  {currentSpace.description}
                </p>

                {/* Features Bullet List */}
                <div className="space-y-2 pt-2">
                  {currentSpace.features.map((feat) => (
                    <div key={feat} className="flex items-center gap-2.5 text-xs text-slate-300">
                      <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-6 border-t border-white/[0.08] flex flex-wrap items-center gap-3">
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm px-5 py-3 shadow-md shadow-amber-500/20 transition-all active:scale-95"
                >
                  <Calendar size={15} />
                  <span>Reserve Table or Space</span>
                </Link>

                <Link
                  to="/order"
                  className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] text-white text-xs sm:text-sm font-semibold px-4 py-3 transition-colors"
                >
                  <span>Order Dining at Home</span>
                  <ArrowRight size={14} className="text-amber-400" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
