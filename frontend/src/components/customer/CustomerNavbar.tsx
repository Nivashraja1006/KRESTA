import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  UtensilsCrossed,
  ShoppingBag,
  MapPin,
  Search,
  User as UserIcon,
  ChevronDown,
  Sparkles,
  LogOut,
  LayoutDashboard
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

interface CustomerNavbarProps {
  searchQuery?: string;
  onSearchChange?: (q: string) => void;
  branches?: Array<{ id: number; name: string; address?: string }>;
  selectedBranchId?: number;
  onSelectBranch?: (id: number) => void;
  onOpenAuthModal?: () => void;
}

export const CustomerNavbar: React.FC<CustomerNavbarProps> = ({
  searchQuery = '',
  onSearchChange,
  branches = [
    { id: 1, name: 'Downtown Flagship', address: '450 Mission Street, Financial District' },
    { id: 2, name: 'Uptown Bistro', address: '1200 Pacific Heights Blvd' },
    { id: 3, name: 'Airport Express', address: 'Terminal 2 Concourse C' }
  ],
  selectedBranchId = 1,
  onSelectBranch,
  onOpenAuthModal
}) => {
  const { user, logout, hasAnyRole } = useAuth();
  const { totalCartCount, setIsCartDrawerOpen } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const [isBranchDropdownOpen, setIsBranchDropdownOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  const currentBranch = branches.find((b) => b.id === selectedBranchId) || branches[0];
  const isStaff = hasAnyRole(['owner', 'manager', 'chef', 'staff', 'super_admin']);

  return (
    <header className="sticky top-0 z-40 bg-[#070913]/95 backdrop-blur-xl border-b border-white/[0.08] shadow-lg shadow-black/50 transition-all">
      {/* Top micro banner */}
      <div className="bg-[#05070d] text-slate-400 text-[11px] font-medium py-1.5 px-4 sm:px-6 border-b border-white/[0.04]">
        <div className="max-w-[1720px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-white font-semibold tracking-wide">KRESTA KITCHEN IS LIVE</span>
            <span className="hidden sm:inline text-slate-500">• Real-Time Culinary Excellence & AI Precision</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span className="hidden md:inline">Use code <strong className="text-amber-400 font-bold">KRESTA10</strong> for 10% off</span>
            {isStaff && (
              <Link
                to="/dashboard"
                className="flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 font-semibold transition-colors"
              >
                <LayoutDashboard size={12} />
                <span>Restaurant Dashboard</span>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-10">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group flex-shrink-0">
            <div className="relative flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-xl bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-amber-400 border border-amber-500/40 shadow-md group-hover:border-amber-400 transition-all">
              <UtensilsCrossed size={20} className="transform group-hover:scale-110 transition-transform text-amber-400" />
              <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
            </div>
            <div className="flex flex-col">
              <span className="font-serif font-black tracking-widest text-xl sm:text-2xl text-white group-hover:text-amber-300 transition-colors">
                KRESTA
              </span>
              <span className="text-[10px] tracking-wider uppercase font-semibold text-amber-400/80">
                Good Food. Great Moments.
              </span>
            </div>
          </Link>

          {/* Branch Selector (Desktop) */}
          <div className="relative hidden md:block">
            <button
              onClick={() => setIsBranchDropdownOpen(!isBranchDropdownOpen)}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-white/10 bg-[#0d1222] hover:bg-[#12192d] text-xs font-semibold text-slate-200 transition-all"
            >
              <MapPin size={15} className="text-emerald-400 flex-shrink-0" />
              <div className="text-left">
                <p className="font-bold text-white leading-tight">{currentBranch.name}</p>
                <p className="text-[10px] text-slate-400 truncate max-w-[170px]">{currentBranch.address}</p>
              </div>
              <ChevronDown size={14} className="text-slate-400 ml-1" />
            </button>

            {isBranchDropdownOpen && (
              <div className="absolute top-full mt-2 left-0 w-72 rounded-2xl bg-[#0d1222] border border-white/10 p-2 shadow-2xl z-50 animate-in fade-in slide-in-from-top-2">
                <p className="text-[10px] uppercase font-bold text-slate-400 px-3 py-1.5 tracking-wider">
                  Select Restaurant Branch
                </p>
                {branches.map((b) => (
                  <button
                    key={b.id}
                    onClick={() => {
                      if (onSelectBranch) onSelectBranch(b.id);
                      setIsBranchDropdownOpen(false);
                    }}
                    className={`w-full text-left p-2.5 rounded-xl text-xs transition-colors flex items-start gap-2.5 ${
                      b.id === selectedBranchId
                        ? 'bg-emerald-950/60 text-emerald-300 font-bold border border-emerald-500/30'
                        : 'hover:bg-white/[0.05] text-slate-300'
                    }`}
                  >
                    <MapPin size={14} className={b.id === selectedBranchId ? 'text-emerald-400' : 'text-slate-500'} />
                    <div>
                      <p className="font-semibold text-white">{b.name}</p>
                      <p className="text-[11px] text-slate-400">{b.address}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Search Bar (When on /order or provided) */}
          {onSearchChange && (
            <div className="hidden lg:flex flex-1 max-w-md relative">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search Biryani, Artisan Pizza, Truffle Burgers..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#0d1222] border border-white/10 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400/60 focus:ring-2 focus:ring-amber-400/10 transition-all"
              />
            </div>
          )}

          {/* Nav Links */}
          <nav className="flex items-center gap-2 sm:gap-3">
            <Link
              to="/order"
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-colors ${
                location.pathname === '/order'
                  ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-white/[0.06]'
              }`}
            >
              Explore Menu
            </Link>

            {/* Note: Redundant standalone "Cart" text link removed as requested. Only the single Cart button with live item-count badge below is kept. */}

            <Link
              to="/order/account"
              className={`hidden sm:inline-flex px-3 py-2 rounded-xl text-xs font-bold transition-colors ${
                location.pathname === '/order/account'
                  ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-white/[0.06]'
              }`}
            >
              My Orders
            </Link>

            {/* Single Cart Button with live item count badge */}
            <button
              onClick={() => {
                if (location.pathname === '/order') {
                  setIsCartDrawerOpen(true);
                } else {
                  navigate('/order/cart');
                }
              }}
              className="relative flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-slate-950 font-bold text-xs shadow-md shadow-emerald-950/40 transition-all transform active:scale-95"
              aria-label={`View cart with ${totalCartCount} items`}
            >
              <ShoppingBag size={16} className="text-slate-950" />
              <span className="hidden sm:inline">Cart</span>
              {totalCartCount > 0 && (
                <span className="flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-amber-400 text-slate-950 text-[11px] font-black shadow-xs">
                  {totalCartCount}
                </span>
              )}
            </button>

            {/* Customer Profile / Login */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-2 rounded-xl border border-white/10 bg-[#0d1222] hover:bg-[#12192d] text-xs font-semibold text-slate-200 transition-colors"
                >
                  <div className="w-7 h-7 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center justify-center font-bold text-xs">
                    {user.full_name?.charAt(0) || 'U'}
                  </div>
                  <span className="hidden md:inline font-bold text-white truncate max-w-[100px]">
                    {user.full_name?.split(' ')[0]}
                  </span>
                  <ChevronDown size={14} className="text-slate-400" />
                </button>

                {isProfileDropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 rounded-2xl bg-[#0d1222] border border-white/10 p-2 shadow-2xl z-50 animate-in fade-in slide-in-from-top-2">
                    <div className="px-3 py-2 border-b border-white/[0.08] mb-1">
                      <p className="text-xs font-bold text-white">{user.full_name}</p>
                      <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                      <span className="mt-1 inline-flex items-center gap-1 text-[10px] font-bold text-amber-400 bg-amber-950/50 px-2 py-0.5 rounded-full border border-amber-500/30">
                        <Sparkles size={10} /> 150 Loyalty Points
                      </span>
                    </div>

                    <Link
                      to="/order/account"
                      onClick={() => setIsProfileDropdownOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 text-xs text-slate-300 hover:bg-white/[0.05] hover:text-white rounded-xl font-medium"
                    >
                      <UserIcon size={14} /> My Profile & Orders
                    </Link>

                    {isStaff && (
                      <Link
                        to="/dashboard"
                        onClick={() => setIsProfileDropdownOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 text-xs text-emerald-400 bg-emerald-950/40 hover:bg-emerald-950/60 rounded-xl font-semibold border border-emerald-500/20"
                      >
                        <LayoutDashboard size={14} /> Staff Dashboard
                      </Link>
                    )}

                    <button
                      onClick={() => {
                        logout();
                        setIsProfileDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs text-rose-400 hover:bg-rose-950/40 rounded-xl font-medium transition-colors"
                    >
                      <LogOut size={14} /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={onOpenAuthModal ? onOpenAuthModal : () => navigate('/login')}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-white/10 bg-[#0d1222] hover:bg-[#12192d] text-xs font-bold text-slate-200 transition-colors"
              >
                <UserIcon size={14} />
                <span>Sign In</span>
              </button>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};
