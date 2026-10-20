import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, MapPin, Clock, Phone, ArrowRight, UtensilsCrossed, Calendar } from 'lucide-react';
import apiClient from '../../api/client';

interface Branch {
  id: number;
  name: string;
  code: string;
  address?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  phone?: string;
  opening_time?: string;
  closing_time?: string;
  is_active: boolean;
}

function isBranch(value: unknown): value is Branch {
  if (typeof value !== 'object' || value === null) return false;

  const branch = value as Record<string, unknown>;
  return (
    typeof branch.id === 'number' &&
    typeof branch.name === 'string' &&
    typeof branch.code === 'string' &&
    typeof branch.is_active === 'boolean'
  );
}

export const LocationsHoursSection: React.FC = () => {
  const [branches, setBranches] = useState<Branch[]>([
    {
      id: 1,
      name: 'Downtown Flagship',
      code: 'BR-DOWNTOWN',
      address: '450 Grand Avenue',
      city: 'San Francisco',
      state: 'CA',
      postal_code: '94102',
      phone: '+1 (555) 839-2041',
      opening_time: '10:00',
      closing_time: '23:30',
      is_active: true
    },
    {
      id: 2,
      name: 'Uptown Bistro & Lounge',
      code: 'BR-UPTOWN',
      address: '1200 Pacific Heights Blvd',
      city: 'San Francisco',
      state: 'CA',
      postal_code: '94115',
      phone: '+1 (555) 912-3849',
      opening_time: '11:00',
      closing_time: '22:30',
      is_active: true
    },
    {
      id: 3,
      name: 'Airport Express Concourse',
      code: 'BR-AIRPORT',
      address: 'Terminal 2 Concourse C',
      city: 'San Francisco',
      state: 'CA',
      postal_code: '94128',
      phone: '+1 (555) 743-1120',
      opening_time: '06:00',
      closing_time: '23:00',
      is_active: true
    }
  ]);

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const resp = await apiClient.get<unknown>('/restaurants/public/branches');
        if (!Array.isArray(resp.data) || !resp.data.every(isBranch)) {
          console.warn('Unexpected branch response; using seeded branch fallback.');
          return;
        }
        if (resp.data.length > 0) {
          setBranches(resp.data);
        }
      } catch (err) {
        console.warn('Using seeded branch fallback for public location view:', err);
      }
    };
    fetchBranches();
  }, []);

  return (
    <section id="locations" className="py-20 sm:py-28 lg:py-32 relative bg-[#05070d] border-t border-amber-500/15 overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/3 w-[450px] h-[450px] bg-amber-500/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2.5 mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-[#0a0d18]/90 px-3.5 py-1 text-[11px] font-bold text-amber-300">
            <Sparkles size={12} />
            <span>FIND US</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
            Locations &amp; Hours
          </h2>

          <p className="text-sm sm:text-base text-slate-300 font-normal">
            Visit us in person or select your nearest San Francisco kitchen for swift pickup and delivery.
          </p>
        </div>

        {/* Locations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {branches.map((branch, index) => {
            const isFlagship = index === 0;

            return (
              <div
                key={branch.id}
                className={`rounded-3xl p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 bg-[#090c17] border shadow-xl ${
                  isFlagship
                    ? 'border-amber-500/40 shadow-amber-500/10'
                    : 'border-white/[0.08] hover:border-white/20'
                }`}
              >
                <div className="space-y-4">
                  {/* Badge */}
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full ${
                      isFlagship
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        : 'bg-white/[0.05] text-slate-300 border border-white/10'
                    }`}>
                      {isFlagship ? 'Flagship Dining Room' : 'Bistro & Express'}
                    </span>

                    <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold font-mono">
                      <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span>Open Today</span>
                    </span>
                  </div>

                  {/* Branch Name */}
                  <h3 className="font-serif font-black text-xl sm:text-2xl text-white">
                    {branch.name}
                  </h3>

                  {/* Details List */}
                  <div className="space-y-3 pt-2 text-xs sm:text-sm text-slate-300">
                    <div className="flex items-start gap-2.5">
                      <MapPin size={16} className="text-amber-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-white">{branch.address}</p>
                        <p className="text-slate-400 text-xs">
                          {branch.city}, {branch.state} {branch.postal_code}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <Clock size={16} className="text-emerald-400 flex-shrink-0" />
                      <span>{branch.opening_time || '10:00'} – {branch.closing_time || '23:30'} daily</span>
                    </div>

                    {branch.phone && (
                      <div className="flex items-center gap-2.5">
                        <Phone size={16} className="text-amber-400 flex-shrink-0" />
                        <a href={`tel:${branch.phone}`} className="hover:text-amber-300 transition-colors">
                          {branch.phone}
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                {/* CTAs */}
                <div className="pt-6 mt-6 border-t border-white/[0.08] space-y-2.5">
                  <Link
                    to="/order"
                    className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold text-xs sm:text-sm py-3 shadow-md shadow-amber-500/20 transition-all active:scale-95"
                  >
                    <UtensilsCrossed size={14} />
                    <span>Order From This Location</span>
                  </Link>

                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      to="/contact"
                      className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 text-xs font-semibold py-2.5 transition-colors"
                    >
                      <Calendar size={13} className="text-amber-400" />
                      <span>Reserve Table</span>
                    </Link>

                    <a
                      href={`https://maps.google.com/?q=${encodeURIComponent(`${branch.address}, ${branch.city}, ${branch.state}`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 text-xs font-semibold py-2.5 transition-colors"
                    >
                      <span>Directions</span>
                      <ArrowRight size={13} />
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
