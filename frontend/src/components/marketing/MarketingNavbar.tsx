import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, LogIn, LogOut, ShieldCheck, ShoppingBag, Bell } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

export const MarketingNavbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { isAuthenticated, user, logout } = useAuth();
  const { totalCartCount } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') setMobileMenuOpen(false);
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = '';
        window.removeEventListener('keydown', handleKeyDown);
      };
    } else {
      document.body.style.overflow = '';
    }
  }, [mobileMenuOpen]);

  // Exactly four customer navigation links
  const navLinks = [
    { name: 'Menu', href: '/order' },
    { name: 'Our Story', href: '/#story' },
    { name: 'Locations', href: '/#locations' },
    { name: 'Contact', href: '/contact' },
  ];

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#05070d]/95 backdrop-blur-2xl border-b border-amber-500/15 shadow-[0_10px_35px_rgba(0,0,0,0.7)] py-3'
          : 'bg-transparent py-4 sm:py-6'
      }`}
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10">
        <div className="grid grid-cols-[auto_1fr] lg:grid-cols-[1fr_auto_1fr] items-center gap-4">
          
          {/* Far Left: KRESTA Logo & Brand Name */}
          <div className="flex items-center justify-start">
            <Link
              to="/"
              className="flex items-center gap-2.5 sm:gap-3.5 group focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 rounded-xl"
            >
              <div className="relative flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-xl bg-gradient-to-br from-amber-950/70 via-slate-900 to-slate-950 border border-amber-500/40 p-1.5 shadow-md shadow-amber-500/10 group-hover:border-amber-400/80 transition-all duration-300 flex-shrink-0">
                <img
                  src="/kresta-logo-mark.png"
                  alt="KRESTA Crown Emblem"
                  className="h-full w-full object-contain filter drop-shadow-[0_2px_8px_rgba(212,175,55,0.4)]"
                  loading="eager"
                  decoding="async"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-serif font-extrabold text-xl sm:text-2xl tracking-widest text-white flex items-center gap-1 group-hover:text-amber-200 transition-colors leading-tight">
                  KRESTA
                </span>
                <span className="text-[8px] sm:text-[9px] uppercase font-bold tracking-[0.24em] text-amber-300/80 leading-tight">
                  Restaurant &bull; Est. 2024
                </span>
              </div>
            </Link>
          </div>

          {/* Center Navigation: Menu, Our Story, Locations, Contact */}
          <nav className="hidden lg:flex items-center justify-center gap-1.5 rounded-full border border-white/[0.08] bg-[#0a0d18]/70 backdrop-blur-xl px-5 py-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
            {navLinks.map((link) => {
              const isCurrent = location.pathname === link.href;
              const isAnchor = link.href.startsWith('/#');

              return isAnchor ? (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-xs font-semibold px-4 py-2 rounded-full text-slate-300 hover:text-white hover:bg-white/[0.06] transition-all duration-200 focus:outline-none focus-visible:ring-1 focus-visible:ring-amber-400"
                >
                  {link.name}
                </a>
              ) : (
                <Link
                  key={link.name}
                  to={link.href}
                  className={`text-xs font-semibold px-4 py-2 rounded-full transition-all duration-200 focus:outline-none focus-visible:ring-1 focus-visible:ring-amber-400 ${
                    isCurrent
                      ? 'text-amber-200 bg-white/[0.08] border border-amber-500/20 shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-white/[0.06]'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Far Right: Notifications, Cart, Login / Dashboard / Logout */}
          <div className="flex items-center justify-end gap-3">
            <div className="hidden sm:flex items-center gap-2.5">
              {/* Notification icon with a small badge */}
              <button
                type="button"
                className="relative inline-flex items-center justify-center p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/[0.06] border border-white/10 transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-amber-400"
                aria-label="Notifications"
                title="Notifications"
              >
                <Bell size={17} />
                <span className="absolute top-1.5 right-1.5 flex h-2 w-2 rounded-full bg-amber-400 ring-2 ring-[#05070d]" />
              </button>

              {/* Shopping Cart Indicator with Live Count from CartContext */}
              <Link
                to="/order"
                className="relative inline-flex items-center justify-center p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/[0.06] border border-white/10 transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-amber-400"
                aria-label={`Shopping cart with ${totalCartCount} items`}
                title="View Online Order Cart"
              >
                <ShoppingBag size={17} />
                {totalCartCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-amber-500 text-[10px] font-black text-slate-950 shadow-md">
                    {totalCartCount}
                  </span>
                )}
              </Link>

              {/* Dashboard and Logout when authenticated / Login when unauthenticated */}
              {isAuthenticated ? (
                <div className="flex items-center gap-2">
                  <Link
                    to="/dashboard"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-300 hover:text-amber-200 bg-amber-950/40 border border-amber-500/30 px-3.5 py-1.5 rounded-xl transition-colors shadow-sm focus:outline-none focus-visible:ring-1 focus-visible:ring-amber-400"
                    title="Access Operations Dashboard"
                  >
                    <ShieldCheck size={14} className="text-amber-400" />
                    <span>Dashboard</span>
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-rose-500/30 bg-rose-950/30 px-3 py-1.5 text-xs font-bold text-rose-300 hover:bg-rose-950/60 hover:border-rose-400 transition-all duration-200 active:scale-95 touch-target focus:outline-none focus-visible:ring-1 focus-visible:ring-rose-400"
                  >
                    <LogOut size={13} />
                    <span>Logout</span>
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 rounded-xl border border-amber-500/40 bg-gradient-to-r from-amber-500/15 via-amber-500/20 to-amber-600/25 px-4.5 py-2 text-xs font-bold text-amber-300 shadow-sm shadow-amber-500/10 hover:border-amber-400 hover:bg-amber-500/25 transition-all duration-200 active:scale-95 touch-target"
                >
                  <LogIn size={14} className="text-amber-400" />
                  <span>Login</span>
                </Link>
              )}
            </div>

            {/* Mobile Menu Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-300 hover:text-white hover:bg-navy-900 border border-white/10 transition-colors touch-target"
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Animated Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 top-[65px] bg-black/80 backdrop-blur-sm z-40 lg:hidden"
            />

            <motion.div
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="fixed top-[65px] left-0 right-0 z-50 lg:hidden border-b border-amber-500/20 bg-[#080b14]/98 backdrop-blur-2xl px-5 py-6 space-y-4 shadow-2xl max-h-[calc(100vh-70px)] overflow-y-auto"
            >
              {/* 4 Navigation Links */}
              <nav className="flex flex-col space-y-1.5">
                {navLinks.map((link) => {
                  const isAnchor = link.href.startsWith('/#');
                  return isAnchor ? (
                    <a
                      key={link.name}
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-sm font-semibold py-3 px-3.5 rounded-xl transition-colors flex items-center justify-between text-slate-200 hover:text-white hover:bg-white/[0.05] touch-target"
                    >
                      <span>{link.name}</span>
                    </a>
                  ) : (
                    <Link
                      key={link.name}
                      to={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-sm font-semibold py-3 px-3.5 rounded-xl transition-colors flex items-center justify-between text-slate-200 hover:text-white hover:bg-white/[0.05] touch-target"
                    >
                      <span>{link.name}</span>
                    </Link>
                  );
                })}
              </nav>

              {/* Login / Logout in Mobile Drawer */}
              <div className="pt-4 border-t border-white/[0.08] flex flex-col gap-2.5">
                <Link
                  to="/order"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 rounded-xl border border-amber-500/40 bg-gradient-to-r from-amber-500/20 to-amber-600/30 py-3.5 text-sm font-bold text-amber-200 shadow-sm"
                >
                  <ShoppingBag size={15} />
                  <span>View Cart ({totalCartCount} items)</span>
                </Link>

                {isAuthenticated ? (
                  <>
                    <Link
                      to="/dashboard"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-center gap-2 rounded-xl border border-amber-500/30 bg-amber-950/40 py-3 text-xs font-bold text-amber-300"
                    >
                      <ShieldCheck size={14} className="text-amber-400" />
                      <span>Dashboard</span>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center justify-center gap-2 rounded-xl border border-rose-500/30 bg-rose-950/40 py-3 text-xs font-bold text-rose-300 hover:bg-rose-950/60 transition-colors"
                    >
                      <LogOut size={14} />
                      <span>Logout ({user?.email})</span>
                    </button>
                  </>
                ) : (
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.05] py-3 text-xs font-bold text-slate-200 hover:text-white"
                  >
                    <LogIn size={14} />
                    <span>Login to Your Account</span>
                  </Link>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
};
