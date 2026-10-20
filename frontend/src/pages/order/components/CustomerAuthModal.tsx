import React, { useState } from 'react';
import { X, Mail, Lock, User as UserIcon, Phone, Sparkles, ArrowRight, CheckCircle2, Award } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { User } from '../../../types';

interface CustomerAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User | null;
}

export const CustomerAuthModal: React.FC<CustomerAuthModalProps> = ({
  isOpen,
  onClose,
  currentUser
}) => {
  if (!isOpen) return null;

  const { login, registerCustomer, logout } = useAuth();
  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState<string>('customer@restaurantiq.com');
  const [password, setPassword] = useState<string>('Customer@123');
  const [fullName, setFullName] = useState<string>('Elena Rostova');
  const [phone, setPhone] = useState<string>('+1 (555) 789-0123');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');
    try {
      await login(email, password);
      onClose();
    } catch (err: any) {
      setErrorMsg(err.response?.data?.detail || 'Incorrect customer credentials. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');
    try {
      await registerCustomer({
        email,
        password,
        full_name: fullName,
        phone
      });
      onClose();
    } catch (err: any) {
      setErrorMsg(err.response?.data?.detail || 'Registration failed. Email may already be in use.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickDemoCustomer = async () => {
    setEmail('customer@restaurantiq.com');
    setPassword('Customer@123');
    setIsLoading(true);
    setErrorMsg('');
    try {
      await login('customer@restaurantiq.com', 'Customer@123');
      onClose();
    } catch (err: any) {
      setErrorMsg(err.response?.data?.detail || 'Could not sign in with demo customer account.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900/95 p-6 sm:p-8 shadow-2xl backdrop-blur-2xl">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
        >
          <X size={18} />
        </button>

        {currentUser ? (
          /* Profile Card if Logged In */
          <div className="space-y-6 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-amber-500/20 to-emerald-500/20 border border-amber-500/30 text-amber-300">
              <Award size={32} />
            </div>

            <div>
              <span className="text-[10px] font-mono uppercase font-bold text-emerald-400 tracking-wider">
                KRESTA Patron Member
              </span>
              <h3 className="font-serif text-2xl font-bold text-white mt-1">
                {currentUser.full_name}
              </h3>
              <p className="text-xs text-slate-400">{currentUser.email}</p>
            </div>

            {/* Loyalty Points Pill */}
            <div className="rounded-2xl bg-slate-950/80 border border-slate-800 p-4 space-y-1">
              <span className="text-[10px] text-slate-400 uppercase font-semibold">
                Available Loyalty Balance
              </span>
              <p className="text-2xl font-mono font-black text-amber-300">
                180 Points
              </p>
              <span className="text-[10px] text-emerald-400">
                Redeemable for 10% off next order
              </span>
            </div>

            <button
              type="button"
              onClick={logout}
              className="w-full rounded-xl border border-slate-700 bg-slate-800 py-2.5 text-xs font-semibold text-slate-300 hover:text-white hover:border-slate-600 transition-colors"
            >
              Sign Out of Customer Account
            </button>
          </div>
        ) : (
          /* Login / Register Forms */
          <div className="space-y-5">
            <div className="text-center space-y-1">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-[11px] font-bold text-amber-300">
                <Sparkles size={13} />
                <span>KRESTA REWARDS CLUB</span>
              </div>
              <h3 className="font-serif text-2xl font-bold text-white">
                {tab === 'login' ? 'Customer Sign In' : 'Create Customer Account'}
              </h3>
              <p className="text-xs text-slate-400">
                Earn loyalty points on every order and track real-time delivery status.
              </p>
            </div>

            {/* Tab Switcher */}
            <div className="grid grid-cols-2 gap-2 rounded-2xl bg-slate-950 p-1 border border-slate-800">
              <button
                type="button"
                onClick={() => setTab('login')}
                className={`py-2 text-xs font-bold rounded-xl transition-all ${
                  tab === 'login'
                    ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => setTab('register')}
                className={`py-2 text-xs font-bold rounded-xl transition-all ${
                  tab === 'register'
                    ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Register
              </button>
            </div>

            {errorMsg && (
              <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-300">
                {errorMsg}
              </div>
            )}

            {tab === 'login' ? (
              <form onSubmit={handleLogin} className="space-y-3.5">
                <div>
                  <span className="text-[11px] text-slate-400 mb-1 block">Email</span>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3.5 top-2.5 text-slate-500" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-xl bg-slate-950 border border-slate-800 pl-10 pr-3 py-2 text-xs text-white focus:outline-none focus:border-brand-500"
                    />
                  </div>
                </div>

                <div>
                  <span className="text-[11px] text-slate-400 mb-1 block">Password</span>
                  <div className="relative">
                    <Lock size={16} className="absolute left-3.5 top-2.5 text-slate-500" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full rounded-xl bg-slate-950 border border-slate-800 pl-10 pr-3 py-2 text-xs text-white focus:outline-none focus:border-brand-500"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 py-3 text-xs font-extrabold text-slate-950 hover:from-emerald-400 hover:to-emerald-500 transition-all shadow-lg shadow-emerald-500/20"
                >
                  {isLoading ? 'Signing In...' : 'Sign In as Customer'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleRegister} className="space-y-3.5">
                <div>
                  <span className="text-[11px] text-slate-400 mb-1 block">Full Name</span>
                  <div className="relative">
                    <UserIcon size={16} className="absolute left-3.5 top-2.5 text-slate-500" />
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full rounded-xl bg-slate-950 border border-slate-800 pl-10 pr-3 py-2 text-xs text-white focus:outline-none focus:border-brand-500"
                    />
                  </div>
                </div>

                <div>
                  <span className="text-[11px] text-slate-400 mb-1 block">Email</span>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3.5 top-2.5 text-slate-500" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-xl bg-slate-950 border border-slate-800 pl-10 pr-3 py-2 text-xs text-white focus:outline-none focus:border-brand-500"
                    />
                  </div>
                </div>

                <div>
                  <span className="text-[11px] text-slate-400 mb-1 block">Mobile Phone</span>
                  <div className="relative">
                    <Phone size={16} className="absolute left-3.5 top-2.5 text-slate-500" />
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full rounded-xl bg-slate-950 border border-slate-800 pl-10 pr-3 py-2 text-xs text-white focus:outline-none focus:border-brand-500"
                    />
                  </div>
                </div>

                <div>
                  <span className="text-[11px] text-slate-400 mb-1 block">Password</span>
                  <div className="relative">
                    <Lock size={16} className="absolute left-3.5 top-2.5 text-slate-500" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full rounded-xl bg-slate-950 border border-slate-800 pl-10 pr-3 py-2 text-xs text-white focus:outline-none focus:border-brand-500"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 py-3 text-xs font-extrabold text-slate-950 hover:from-emerald-400 hover:to-emerald-500 transition-all shadow-lg shadow-emerald-500/20"
                >
                  {isLoading ? 'Creating Account...' : 'Create Account & Claim 50 Pts'}
                </button>
              </form>
            )}

            {/* 1-Click Demo Customer Account */}
            <div className="pt-4 border-t border-slate-800">
              <span className="text-[11px] text-slate-500 block mb-2 text-center font-medium">
                Interview & Demo Shortcut:
              </span>
              <button
                type="button"
                onClick={handleQuickDemoCustomer}
                className="w-full rounded-xl border border-amber-500/30 bg-amber-500/10 p-2.5 text-xs font-bold text-amber-300 hover:bg-amber-500/20 transition-colors flex items-center justify-center gap-2"
              >
                <span>🍽️ 1-Click Demo Customer (Elena Rostova)</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

