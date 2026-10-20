import React, { useState, useEffect } from 'react';
import { Settings, Building2, Clock, DollarSign, CheckCircle2 } from 'lucide-react';
import apiClient from '../../api/client';
import { useBranch } from '../../context/BranchContext';
import { Button } from '../../components/common/Button';

export const SettingsPage: React.FC = () => {
  const { selectedBranch } = useBranch();

  const [restaurantName, setRestaurantName] = useState('The Royal Saffron Gourmet');
  const [currency, setCurrency] = useState('$');
  const [taxRate, setTaxRate] = useState(8.5);
  const [openingTime, setOpeningTime] = useState('10:00');
  const [closingTime, setClosingTime] = useState('23:30');
  const [isSaved, setIsSaved] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await apiClient.put('/restaurants/1', {
        name: restaurantName,
        currency,
        tax_rate: taxRate,
      });
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 4000);
    } catch (e) {
      alert('Failed to save settings');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight">Restaurant & Branch Settings</h1>
        <p className="text-sm text-slate-400 mt-1">Configure global business profile, local tax rates, and operating branch hours.</p>
      </div>

      {isSaved && (
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs text-emerald-400 flex items-center gap-2">
          <CheckCircle2 size={16} />
          <span>Settings saved successfully.</span>
        </div>
      )}

      <form onSubmit={handleSave} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-5">
        <div>
          <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 block">
            Restaurant Legal Name
          </label>
          <input
            type="text"
            value={restaurantName}
            onChange={(e) => setRestaurantName(e.target.value)}
            className="w-full rounded-xl bg-slate-800 border border-slate-700 p-2.5 text-sm text-white focus:border-brand-500 focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 block">
              Currency Symbol
            </label>
            <input
              type="text"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="w-full rounded-xl bg-slate-800 border border-slate-700 p-2.5 text-sm text-white focus:border-brand-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 block">
              Default Sales Tax Rate (%)
            </label>
            <input
              type="number"
              step="0.1"
              value={taxRate}
              onChange={(e) => setTaxRate(Number(e.target.value))}
              className="w-full rounded-xl bg-slate-800 border border-slate-700 p-2.5 text-sm text-white focus:border-brand-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-3 border-t border-slate-800">
          <div>
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 block">
              Branch Opening Time
            </label>
            <input
              type="text"
              value={openingTime}
              onChange={(e) => setOpeningTime(e.target.value)}
              className="w-full rounded-xl bg-slate-800 border border-slate-700 p-2.5 text-sm text-white focus:border-brand-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 block">
              Branch Closing Time
            </label>
            <input
              type="text"
              value={closingTime}
              onChange={(e) => setClosingTime(e.target.value)}
              className="w-full rounded-xl bg-slate-800 border border-slate-700 p-2.5 text-sm text-white focus:border-brand-500 focus:outline-none"
            />
          </div>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="md"
          className="mt-4"
          isLoading={isSubmitting}
        >
          Save Configuration
        </Button>
      </form>
    </div>
  );
};
