import React from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  MapPin,
  Tag,
  Clock,
  ShoppingBag,
  User as UserIcon,
  ChevronDown,
  Sparkles,
  ArrowLeft,
  X
} from 'lucide-react';
import { User } from '../../../types';

interface OrderHeaderProps {
  branches: Array<{ id: number; name: string; address?: string }>;
  selectedBranchId: number;
  onSelectBranch: (id: number) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  cartItemCount: number;
  onOpenCart: () => void;
  onOpenOffers: () => void;
  onOpenMyOrders: () => void;
  onOpenAuth: () => void;
  user: User | null;
  onLogout: () => void;
}

export const OrderHeader: React.FC<OrderHeaderProps> = ({
  branches,
  selectedBranchId,
  onSelectBranch,
  searchQuery,
  onSearchChange,
  cartItemCount,
  onOpenCart,
  onOpenOffers,
  onOpenMyOrders,
  onOpenAuth,
  user,
  onLogout
}) => {
  const selectedBranch = branches.find((b) => b.id === selectedBranchId) || branches[0] || {
    id: 1,
    name: 'Downtown Flagship',
    address: '450 Mission Street, Financial District'
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-950/95 backdrop-blur-xl border-b border-slate-800/80 shadow-2xl transition-all">
      {/* Top Banner Notice */}
      <div className="bg-gradient-to-r from-emerald-950/80 via-slate-900 to-amber-950/80 border-b border-slate-800/60 px-4 py-1.5 text-center text-[11px] text-slate-300 flex items-center justify-center gap-2">
        <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
        <span className="font-medium">
          Free Doorstep Delivery on orders over $50 &bull; Use code <strong className="text-amber-300 font-mono">KRESTA10</strong> for 10% off
        </span>
        <Link
          to="/"
          className="hidden md:inline-flex items-center gap-1 text-[11px] text-emerald-400 hover:text-emerald-300 ml-3 underline"
        >
          <span>Return to KRESTA SaaS Platform</span>
          <ArrowLeft size={10} className="rotate-180" />
        </Link>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between gap-3 sm:gap-6">
          {/* Brand Logo & Tagline */}
          <Link to="/" className="flex items-center gap-2.5 sm:gap-3 group shrink-0">
            <div className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-xl bg-slate-900 border border-amber-500/30 p-1.5 shadow-md shadow-amber-500/10 group-hover:border-amber-400/60 transition-colors">
              <img
                src="/kresta-logo-mark.png"
                alt="KRESTA"
                className="h-full w-full object-contain"
              />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-serif font-extrabold text-lg sm:text-xl tracking-wider text-white">
                  KRESTA
                </span>
                <span className="text-[9px] uppercase font-bold tracking-widest text-amber-300 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20 hidden sm:inline">
                  Gourmet
                </span>
              </div>
              <span className="text-[10px] uppercase font-semibold tracking-wider text-slate-400 hidden xs:inline">
                Good Food. Great Moments.
              </span>
            </div>
          </Link>

          {/* Location & Branch Selector */}
          <div className="hidden lg:flex items-center gap-2 rounded-xl bg-slate-900/80 border border-slate-800 px-3 py-2 text-xs">
            <MapPin size={15} className="text-amber-400 shrink-0" />
            <div className="flex flex-col text-left">
              <span className="text-[10px] text-slate-400 font-medium">Ordering From</span>
              <select
                value={selectedBranchId}
                onChange={(e) => onSelectBranch(Number(e.target.value))}
                className="bg-transparent text-white font-semibold focus:outline-none cursor-pointer pr-1"
              >
                {branches.map((b) => (
                  <option key={b.id} value={b.id} className="bg-slate-900 text-white">
                    {b.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Real-time Search Input */}
          <div className="flex-1 max-w-md relative hidden sm:block">
            <Search className="absolute left-3.5 top-2.5 text-slate-500" size={16} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search dishes, biryani, pizzas, burgers..."
              className="w-full rounded-xl bg-slate-900/90 border border-slate-800 pl-10 pr-9 py-2 text-xs sm:text-sm text-white placeholder-slate-500 focus:border-brand-500 focus:bg-slate-900 focus:outline-none transition-all shadow-inner"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-white"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Offers Button */}
            <button
              onClick={onOpenOffers}
              className="hidden md:inline-flex items-center gap-1.5 rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs font-bold text-amber-300 hover:bg-amber-500/20 transition-colors shadow-sm"
            >
              <Tag size={14} />
              <span>Offers</span>
            </button>

            {/* My Orders Button */}
            <button
              onClick={onOpenMyOrders}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900/80 hover:bg-slate-800 px-3 py-2 text-xs font-medium text-slate-200 transition-colors"
            >
              <Clock size={14} className="text-slate-400" />
              <span className="hidden sm:inline">My Orders</span>
            </button>

            {/* User / Login Button */}
            {user ? (
              <div className="relative group">
                <button
                  onClick={onOpenAuth}
                  className="flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-xs font-semibold text-emerald-300 hover:bg-emerald-500/20 transition-colors"
                >
                  <div className="h-5 w-5 rounded-full bg-emerald-500/20 flex items-center justify-center text-[10px] font-bold text-emerald-300">
                    {user.full_name?.charAt(0) || 'C'}
                  </div>
                  <span className="max-w-[80px] sm:max-w-[110px] truncate hidden sm:inline">
                    {user.full_name?.split(' ')[0]}
                  </span>
                  <ChevronDown size={12} />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-xs font-semibold text-white hover:border-amber-400/50 transition-colors"
              >
                <UserIcon size={14} className="text-amber-400" />
                <span>Sign In</span>
              </button>
            )}

            {/* Cart Trigger Button */}
            <button
              onClick={onOpenCart}
              className="relative inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 px-3.5 py-2 text-xs font-extrabold text-slate-950 shadow-lg shadow-emerald-500/25 hover:from-emerald-400 hover:to-emerald-500 transition-all duration-200"
              aria-label="View Cart"
            >
              <ShoppingBag size={16} />
              <span className="hidden xs:inline">Cart</span>
              {cartItemCount > 0 && (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-slate-950 px-1.5 text-[10px] font-mono font-black text-amber-300 shadow">
                  {cartItemCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="mt-2.5 sm:hidden relative">
          <Search className="absolute left-3 top-2.5 text-slate-500" size={14} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search dishes, biryani, pizza..."
            className="w-full rounded-xl bg-slate-900 border border-slate-800 pl-9 pr-8 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-2.5 text-slate-400"
            >
              <X size={12} />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

