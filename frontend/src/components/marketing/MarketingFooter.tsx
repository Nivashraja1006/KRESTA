import React from 'react';
import { Link } from 'react-router-dom';
import { UtensilsCrossed, MapPin, Phone, ShieldCheck, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const MarketingFooter: React.FC = () => {
  const { isAuthenticated, hasAnyRole } = useAuth();
  const isStaff = hasAnyRole(['owner', 'manager', 'chef', 'staff', 'super_admin']);

  return (
    <footer className="border-t border-amber-500/20 bg-[#03050a] text-slate-400 pt-16 sm:pt-20 pb-12 w-full">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
        {/* Top Feature CTA Banner */}
        <div className="rounded-3xl bg-gradient-to-r from-amber-950/40 via-slate-900 to-emerald-950/30 border border-amber-500/30 p-6 sm:p-10 mb-14 sm:mb-16 flex flex-col lg:flex-row items-center justify-between gap-6 shadow-[0_20px_50px_rgba(0,0,0,0.7)]">
          <div className="space-y-1.5 text-center lg:text-left">
            <span className="text-[10px] sm:text-xs font-mono font-bold text-amber-300 uppercase tracking-widest">
              FINE DINING &bull; TAKEAWAY &bull; EVENT RESERVATIONS
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Ready to Savor the KRESTA Experience?
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              Order fresh direct delivery to your home or reserve an intimate table at any of our three San Francisco locations.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3.5 flex-shrink-0">
            <Link
              to="/order"
              className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 px-6 sm:px-8 py-3.5 text-xs sm:text-sm font-bold text-slate-950 shadow-lg shadow-amber-500/30 hover:from-amber-300 hover:to-amber-500 transition-all active:scale-95 touch-target"
            >
              <UtensilsCrossed size={16} />
              <span>Order Online Now</span>
              <ArrowRight size={15} />
            </Link>

            <Link
              to="/contact"
              className="inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/[0.05] hover:bg-white/[0.1] px-6 sm:px-7 py-3.5 text-xs sm:text-sm font-semibold text-slate-200 hover:text-white transition-all active:scale-95 touch-target"
            >
              <span>Reserve a Table</span>
            </Link>
          </div>
        </div>

        {/* 5-Column Spacious Restaurant Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12 pb-14 border-b border-white/[0.08]">
          {/* Col 1: Brand & Credo (4 cols on lg) */}
          <div className="lg:col-span-4 space-y-4">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-950/70 to-slate-950 border border-amber-500/40 p-2 shadow-md shadow-amber-500/15 group-hover:border-amber-400 transition-colors flex-shrink-0">
                <img
                  src="/kresta-logo-mark.png"
                  alt="KRESTA Crown Emblem"
                  className="h-full w-full object-contain filter drop-shadow-[0_2px_8px_rgba(212,175,55,0.4)]"
                  loading="lazy"
                />
              </div>
              <div>
                <span className="font-serif font-extrabold text-2xl tracking-widest text-white block">
                  KRESTA
                </span>
                <p className="text-[9px] uppercase font-bold tracking-[0.22em] text-amber-300">
                  Restaurant &bull; Fine Dining
                </p>
              </div>
            </Link>

            <p className="font-serif text-xs font-bold tracking-[0.2em] text-amber-300 uppercase">
              GOOD FOOD &bull; GREAT MOMENTS
            </p>

            <p className="text-xs sm:text-sm text-slate-400 max-w-sm leading-relaxed">
              Celebrating royal culinary heritage through wood-fired clay oven mastery, single-origin saffron, and aged long-grain basmati. Prepared fresh with reverence for flavor.
            </p>

            <div className="pt-2 flex items-center gap-2 text-xs text-slate-300">
              <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Kitchen open daily &bull; 10:00 AM – 11:30 PM</span>
            </div>
          </div>

          {/* Col 2: Culinary Menu (2 cols on lg) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">Culinary Menu</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/order?category=Biryani" className="hover:text-amber-300 transition-colors block py-0.5">Royal Dum Biryanis</Link></li>
              <li><Link to="/order?category=Main%20Course" className="hover:text-amber-300 transition-colors block py-0.5">Velvet Curries & Gravies</Link></li>
              <li><Link to="/order?category=Starters" className="hover:text-amber-300 transition-colors block py-0.5">Tandoori Clay Skewers</Link></li>
              <li><Link to="/order?category=Artisan%20Breads" className="hover:text-amber-300 transition-colors block py-0.5">Clay Oven Naans & Roti</Link></li>
              <li><Link to="/order?category=Pizza" className="hover:text-amber-300 transition-colors block py-0.5">Wood-Fired Hearth Pizzas</Link></li>
              <li><Link to="/order?category=Desserts" className="hover:text-amber-300 transition-colors block py-0.5">Handcrafted Gelato & Sweets</Link></li>
            </ul>
          </div>

          {/* Col 3: Actual San Francisco Locations (3 cols on lg) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">Our Flagships</h4>
            <div className="space-y-3.5 text-xs text-slate-300">
              <div className="space-y-0.5">
                <p className="font-bold text-white flex items-center gap-1.5">
                  <MapPin size={12} className="text-amber-400" />
                  Downtown Flagship
                </p>
                <p className="text-slate-400 pl-4.5">450 Grand Avenue, San Francisco, CA 94102</p>
                <p className="text-slate-400 pl-4.5 flex items-center gap-1 text-[11px]">
                  <Phone size={10} className="text-slate-500" /> +1 (555) 839-2041
                </p>
              </div>

              <div className="space-y-0.5">
                <p className="font-bold text-white flex items-center gap-1.5">
                  <MapPin size={12} className="text-amber-400" />
                  Uptown Bistro & Lounge
                </p>
                <p className="text-slate-400 pl-4.5">1200 Pacific Heights Blvd, San Francisco, CA 94115</p>
                <p className="text-slate-400 pl-4.5 flex items-center gap-1 text-[11px]">
                  <Phone size={10} className="text-slate-500" /> +1 (555) 912-3849
                </p>
              </div>

              <div className="space-y-0.5">
                <p className="font-bold text-white flex items-center gap-1.5">
                  <MapPin size={12} className="text-amber-400" />
                  Airport Express (SFO)
                </p>
                <p className="text-slate-400 pl-4.5">Terminal 2 Concourse C, San Francisco, CA 94128</p>
                <p className="text-slate-400 pl-4.5 flex items-center gap-1 text-[11px]">
                  <Phone size={10} className="text-slate-500" /> +1 (555) 743-1120
                </p>
              </div>
            </div>
          </div>

          {/* Col 4: Hospitality & Portals (3 cols on lg) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">Hospitality & Service</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/contact" className="hover:text-white transition-colors block py-0.5">Table Reservations & Events</Link></li>
              <li><Link to="/order" className="hover:text-white transition-colors block py-0.5">Online Ordering for Delivery / Pickup</Link></li>
              <li><Link to="/order/track/live" className="hover:text-white transition-colors block py-0.5">Live Order Tracker</Link></li>
              <li><Link to="/order/account" className="hover:text-white transition-colors block py-0.5">Guest Account & Past Orders</Link></li>

              <li className="pt-4 border-t border-white/10 mt-3">
                {isAuthenticated && isStaff ? (
                  <Link
                    to="/dashboard"
                    className="inline-flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 font-bold"
                  >
                    <ShieldCheck size={13} />
                    <span>Restaurant Operations Dashboard</span>
                  </Link>
                ) : (
                  <Link
                    to="/login"
                    className="inline-flex items-center gap-1.5 text-slate-400 hover:text-slate-200"
                  >
                    <ShieldCheck size={13} className="text-slate-500" />
                    <span>Staff & Management Portal</span>
                  </Link>
                )}
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Credentials */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3 text-center sm:text-left">
          <p>&copy; {new Date().getFullYear()} KRESTA Restaurant. All rights reserved. Savor the craft.</p>
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
            <span>San Francisco, California</span>
            <span className="text-slate-700 hidden sm:inline">&bull;</span>
            <span className="text-amber-300/80 font-serif font-semibold">GOOD FOOD &bull; GREAT MOMENTS</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
