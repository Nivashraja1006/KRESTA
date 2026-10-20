import React from 'react';
import { Link } from 'react-router-dom';
import {
  UtensilsCrossed,
  ShieldCheck,
  Clock,
  MapPin,
  Phone,
  Leaf
} from 'lucide-react';

export const CustomerFooter: React.FC = () => {
  return (
    <footer className="bg-[#05070d] text-slate-300 border-t border-white/10 font-sans mt-auto">
      {/* Brand & Guarantee Banner */}
      <div className="border-b border-white/[0.08] py-8 px-4 sm:px-6 lg:px-10 xl:px-12">
        <div className="max-w-[1720px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-[#0c101d] border border-white/10 shadow-md">
            <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Leaf size={22} />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Farm-Fresh Ingredients</h4>
              <p className="text-xs text-slate-400 mt-0.5">100% organic herbs, cold-pressed oils, and certified butcher cuts.</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-2xl bg-[#0c101d] border border-white/10 shadow-md">
            <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Clock size={22} />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">AI Kitchen Timing</h4>
              <p className="text-xs text-slate-400 mt-0.5">Real-time KDS dispatch ensures meals arrive sizzling and fresh.</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-2xl bg-[#0c101d] border border-white/10 shadow-md">
            <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <ShieldCheck size={22} />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Culinary Authenticity</h4>
              <p className="text-xs text-slate-400 mt-0.5">Artisanal wood-fired pizzas, 12-hour dum biryanis, hand-rolled pasta.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0c101d] border border-amber-500/40 text-amber-400 shadow-md">
                <UtensilsCrossed size={18} />
              </div>
              <div>
                <span className="font-serif font-black tracking-widest text-xl text-white">
                  KRESTA
                </span>
                <p className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">
                  Good Food. Great Moments.
                </p>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              KRESTA delivers exceptional dining, combining high-craft gastronomy with real-time AI kitchen precision and doorstep delivery.
            </p>
            <div className="pt-2 text-xs text-slate-400 space-y-1">
              <p className="flex items-center gap-2">
                <MapPin size={13} className="text-amber-400" />
                <span>450 Mission St, Financial District</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone size={13} className="text-emerald-400" />
                <span>+1 (800) 573-7821</span>
              </p>
            </div>
          </div>

          {/* Col 2: Customer Ordering Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Customer Experience
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <Link to="/order" className="hover:text-amber-300 transition-colors">
                  Browse Full Menu
                </Link>
              </li>
              <li>
                <Link to="/order/cart" className="hover:text-amber-300 transition-colors">
                  My Cart & Checkout
                </Link>
              </li>
              <li>
                <Link to="/order/account" className="hover:text-amber-300 transition-colors">
                  Order Tracking
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-amber-300 transition-colors">
                  Table Reservations
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Signature Specialties */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Signature Specialties
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <Link to="/order?category=Biryani" className="hover:text-amber-300 transition-colors">
                  Royal Dum Biryani Handi
                </Link>
              </li>
              <li>
                <Link to="/order?category=Pizza" className="hover:text-amber-300 transition-colors">
                  Wood-Fired Truffle Pizza
                </Link>
              </li>
              <li>
                <Link to="/order?category=Starters" className="hover:text-amber-300 transition-colors">
                  Tandoori Spiced Chicken
                </Link>
              </li>
              <li>
                <Link to="/order?category=Desserts" className="hover:text-amber-300 transition-colors">
                  Artisanal Gelato & Sweets
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Operations & Hours */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Kitchen Dispatch
            </h4>
            <div className="space-y-2 text-xs text-slate-400">
              <p className="flex items-center justify-between">
                <span>Mon – Thu:</span>
                <span className="font-semibold text-slate-200">11:00 AM – 10:30 PM</span>
              </p>
              <p className="flex items-center justify-between">
                <span>Fri – Sat:</span>
                <span className="font-semibold text-amber-300">11:00 AM – 11:30 PM</span>
              </p>
              <p className="flex items-center justify-between">
                <span>Sunday:</span>
                <span className="font-semibold text-slate-200">12:00 PM – 10:00 PM</span>
              </p>
              <div className="pt-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/60 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Taking Delivery & Pickup Orders
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="mt-12 pt-6 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} KRESTA Restaurant IQ. All culinary rights reserved.</p>
          <div className="flex items-center gap-6 text-slate-400">
            <Link to="/contact" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/contact" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link to="/contact" className="hover:text-white transition-colors">Contact Support</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
