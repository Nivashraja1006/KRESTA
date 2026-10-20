import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Lock, Mail, ArrowRight, UserCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/common/Button';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState<string>('owner@restaurantiq.com');
  const [password, setPassword] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const submitLogin = async (loginEmail: string, loginPassword: string) => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      const loggedUser = await login(loginEmail, loginPassword);
      if (loggedUser?.role?.name === 'customer') {
        navigate('/order');
      } else {
        navigate('/dashboard');
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const detail = err.response?.data?.detail;
        const message = typeof detail === 'string' ? detail : detail ? JSON.stringify(detail) : err.message;
        console.error('Authentication request failed', {
          status: err.response?.status ?? null,
          message,
          url: `${err.config?.baseURL ?? ''}${err.config?.url ?? ''}`,
        });
        setErrorMessage(
          err.response
            ? `Sign-in failed (${err.response.status}): ${message}`
            : `Unable to reach the authentication service: ${message}. Check the API URL and CORS configuration.`
        );
      } else {
        const message = err instanceof Error ? err.message : String(err);
        console.error('Authentication failed before receiving an API response', {
          status: null,
          message,
        });
        setErrorMessage(`Unable to sign in: ${message}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    void submitLogin(email, password);
  };

  const handleRoleSelect = (roleEmail: string) => {
    setEmail(roleEmail);
    setPassword('');
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 selection:bg-brand-500 selection:text-white">
      <div className="w-full max-w-md">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-900 border border-amber-500/30 p-2 shadow-xl shadow-amber-500/10">
              <img src="/kresta-logo-mark.png" alt="KRESTA" className="h-full w-full object-contain" />
            </div>
          </Link>
          <h2 className="mt-4 font-serif text-3xl sm:text-4xl font-extrabold text-white tracking-wide">
            KRESTA
          </h2>
          <p className="mt-1 text-xs uppercase font-bold tracking-widest text-amber-300">
            Restaurant Intelligence
          </p>
        </div>

        {/* Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
          {errorMessage && (
            <div className="mb-5 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-400">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Work Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 text-slate-500" size={18} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@restaurant.com"
                  className="w-full rounded-xl bg-slate-800/80 border border-slate-700/80 pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-brand-500 focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Password
                </label>
                <Link to="/forgot-password" className="text-xs text-brand-400 hover:text-brand-300">
                  Forgot?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 text-slate-500" size={18} />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl bg-slate-800/80 border border-slate-700/80 pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-brand-500 focus:outline-none transition-colors"
                />
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full mt-2"
              isLoading={isLoading}
              rightIcon={<ArrowRight size={18} />}
            >
              Sign In to Platform
            </Button>
          </form>

          {/* Role email shortcuts; passwords are configured on the server. */}
          <div className="mt-6 pt-6 border-t border-slate-800">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
              <UserCheck size={14} className="text-brand-400" />
              <span>Demo Role Email Shortcuts</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                disabled={isLoading}
                onClick={() => handleRoleSelect('owner@restaurantiq.com')}
                className="p-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 text-left font-medium transition-all"
              >
                👑 Owner
              </button>
              <button
                type="button"
                disabled={isLoading}
                onClick={() => handleRoleSelect('manager@restaurantiq.com')}
                className="p-2 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/30 text-left font-medium transition-all"
              >
                📋 Manager
              </button>
              <button
                type="button"
                disabled={isLoading}
                onClick={() => handleRoleSelect('chef@restaurantiq.com')}
                className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-left font-medium transition-all"
              >
                👨‍🍳 Chef
              </button>
              <button
                type="button"
                disabled={isLoading}
                onClick={() => handleRoleSelect('staff@restaurantiq.com')}
                className="p-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-left font-medium transition-all"
              >
                🛎️ Staff
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-2">
              <button
                type="button"
                disabled={isLoading}
                onClick={() => handleRoleSelect('customer@restaurantiq.com')}
                className="p-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-left font-medium text-xs transition-all flex items-center gap-1.5"
              >
                <span>🍽️ Customer (Elena)</span>
              </button>
              <button
                type="button"
                disabled={isLoading}
                onClick={() => handleRoleSelect('admin@restaurantiq.com')}
                className="p-2 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 border border-purple-500/30 text-left font-medium text-xs transition-all flex items-center gap-1.5"
              >
                <span>🛡️ Super Admin</span>
              </button>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800/80 text-center">
              <Link
                to="/order"
                className="inline-flex items-center gap-1.5 text-xs text-amber-300 hover:text-amber-200 font-semibold"
              >
                <span>Just hungry? Browse menu & order as guest →</span>
              </Link>
            </div>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-slate-500">
          Need a new restaurant account?{' '}
          <Link to="/register" className="text-brand-400 font-semibold hover:underline">
            Register restaurant
          </Link>
        </p>
      </div>
    </div>
  );
};
