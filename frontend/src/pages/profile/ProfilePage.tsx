import React, { useState } from 'react';
import { User, Mail, Phone, Lock, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import apiClient from '../../api/client';
import { Button } from '../../components/common/Button';

export const ProfilePage: React.FC = () => {
  const { user, refreshUser } = useAuth();

  const [fullName, setFullName] = useState(user?.full_name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [password, setPassword] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload: any = { full_name: fullName, phone };
      if (password) payload.password = password;

      await apiClient.put('/auth/profile', payload);
      await refreshUser();
      setIsSaved(true);
      setPassword('');
      setTimeout(() => setIsSaved(false), 4000);
    } catch (e) {
      alert('Failed to update profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight">User Account Profile</h1>
        <p className="text-sm text-slate-400 mt-1">Manage personal account details and authentication credentials.</p>
      </div>

      {isSaved && (
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs text-emerald-400 flex items-center gap-2">
          <CheckCircle2 size={16} />
          <span>Profile updated successfully.</span>
        </div>
      )}

      <form onSubmit={handleUpdate} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4">
        <div>
          <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 block">
            Full Name
          </label>
          <input
            type="text"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full rounded-xl bg-slate-800 border border-slate-700 p-2.5 text-sm text-white focus:border-brand-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 block">
            Email (Immutable)
          </label>
          <input
            type="email"
            disabled
            value={user?.email || ''}
            className="w-full rounded-xl bg-slate-800/50 border border-slate-800 p-2.5 text-sm text-slate-400 cursor-not-allowed"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 block">
            Role Permission
          </label>
          <div className="w-full rounded-xl bg-slate-800/50 border border-slate-800 p-2.5 text-sm font-bold uppercase text-brand-400">
            {user?.role?.name || 'Staff'}
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 block">
            Phone Number
          </label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full rounded-xl bg-slate-800 border border-slate-700 p-2.5 text-sm text-white focus:border-brand-500 focus:outline-none"
          />
        </div>

        <div className="pt-3 border-t border-slate-800">
          <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 block">
            Change Password (Leave blank to keep current)
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full rounded-xl bg-slate-800 border border-slate-700 p-2.5 text-sm text-white focus:border-brand-500 focus:outline-none"
          />
        </div>

        <Button
          type="submit"
          variant="primary"
          size="md"
          className="mt-4"
          isLoading={isSubmitting}
        >
          Update Profile
        </Button>
      </form>
    </div>
  );
};
