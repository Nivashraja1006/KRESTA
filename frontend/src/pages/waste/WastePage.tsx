import React, { useState, useEffect } from 'react';
import {
  Trash2,
  Plus,
  AlertTriangle,
  Sparkles,
  TrendingDown,
  DollarSign,
  PieChart as PieChartIcon,
  Search
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import apiClient from '../../api/client';
import { useBranch } from '../../context/BranchContext';
import { WasteRecord, MenuItem, Ingredient } from '../../types';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';

const COLORS = ['#ef4444', '#f97316', '#eab308', '#06b6d4', '#a855f7'];

export const WastePage: React.FC = () => {
  const { selectedBranchId } = useBranch();

  const [records, setRecords] = useState<WasteRecord[]>([]);
  const [insights, setInsights] = useState<any>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // New Waste Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [wasteType, setWasteType] = useState<'PREPARED_DISH' | 'INGREDIENT'>('PREPARED_DISH');
  const [selectedItemId, setSelectedItemId] = useState<number>(1);
  const [qty, setQty] = useState<number>(2.0);
  const [reason, setReason] = useState<string>('OVER_PREPARATION');
  const [cost, setCost] = useState<number>(15.0);
  const [notes, setNotes] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchWasteData = async () => {
    setIsLoading(true);
    try {
      const [recResp, insResp, menuResp, ingResp] = await Promise.all([
        apiClient.get<WasteRecord[]>(`/waste/?branch_id=${selectedBranchId}`),
        apiClient.get(`/waste/analytics/insights?branch_id=${selectedBranchId}`),
        apiClient.get<MenuItem[]>('/menu/items'),
        apiClient.get<Ingredient[]>('/menu/ingredients')
      ]);
      setRecords(recResp.data);
      setInsights(insResp.data);
      setMenuItems(menuResp.data);
      setIngredients(ingResp.data);
    } catch (e) {
      console.error('Failed to load waste data:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWasteData();
  }, [selectedBranchId]);

  const handleLogWaste = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await apiClient.post('/waste/', {
        branch_id: selectedBranchId,
        menu_item_id: wasteType === 'PREPARED_DISH' ? selectedItemId : null,
        ingredient_id: wasteType === 'INGREDIENT' ? selectedItemId : null,
        waste_type: wasteType,
        quantity: qty,
        unit: wasteType === 'PREPARED_DISH' ? 'portions' : 'kg',
        estimated_cost: cost,
        reason,
        notes
      });
      setIsModalOpen(false);
      setQty(2.0);
      setCost(15.0);
      setNotes('');
      fetchWasteData();
    } catch (e: any) {
      alert(e.response?.data?.detail || 'Failed to log waste incident');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full border border-rose-500/30 bg-rose-500/10 px-3 py-0.5 text-xs font-semibold text-rose-400 mb-1">
            <Trash2 size={14} />
            <span>Sustainability & Kitchen Cost Control</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Food Waste Intelligence</h1>
          <p className="text-sm text-slate-400 mt-0.5">
            Identify pattern losses across preparation batches, shelf spoilage, and customer plate waste.
          </p>
        </div>

        <Button
          variant="danger"
          size="sm"
          onClick={() => setIsModalOpen(true)}
          leftIcon={<Plus size={16} />}
        >
          Log Waste Incident
        </Button>
      </div>

      {/* AI Waste Pattern Warnings */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
        <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider mb-3">
          <Sparkles size={16} />
          <span>AI Waste Pattern Discoveries</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {insights?.ai_patterns?.map((pattern: string, idx: number) => (
            <div key={idx} className="bg-slate-800/40 border border-slate-800 p-3 rounded-xl text-xs text-slate-300 flex items-start gap-2.5">
              <AlertTriangle size={16} className="text-amber-400 flex-shrink-0 mt-0.5" />
              <span>{pattern}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Waste By Reason */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
          <h2 className="text-base font-bold text-white tracking-tight mb-1">Loss Breakdown by Reason</h2>
          <p className="text-xs text-slate-400 mb-4">Financial impact of over-prep vs spoilage</p>

          <div className="h-64 w-full">
            {insights?.waste_by_reason && insights.waste_by_reason.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={insights.waste_by_reason} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                  <XAxis dataKey="reason" stroke="#94a3b8" fontSize={10} />
                  <YAxis stroke="#94a3b8" fontSize={11} tickFormatter={(val) => `$${val}`} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem' }}
                    formatter={(value: any) => [`$${Number(value).toFixed(2)}`, 'Cost Lost']}
                  />
                  <Bar dataKey="cost" fill="#f43f5e" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-xs text-slate-500">No waste recorded</div>
            )}
          </div>
        </div>

        {/* Highest Waste Dishes */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold text-white tracking-tight mb-1">Highest Waste Cost Dishes</h2>
            <p className="text-xs text-slate-400 mb-4">Top contributors to preparation waste</p>

            <div className="space-y-3">
              {insights?.highest_waste_items?.map((item: any, idx: number) => (
                <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-slate-800/40 border border-slate-800">
                  <div className="flex items-center gap-3">
                    <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-rose-500/10 text-rose-400 font-bold text-xs">
                      {idx + 1}
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-white">{item.item_name}</p>
                      <p className="text-xs text-slate-400">{item.quantity} portions scrapped</p>
                    </div>
                  </div>
                  <span className="text-sm font-bold text-rose-400 font-mono">
                    -${item.cost.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Logged Incidents Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="px-5 py-4 border-b border-slate-800">
          <h3 className="text-sm font-bold text-white tracking-tight">Recent Food Waste Audit Log</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-800/60 text-xs uppercase text-slate-400 font-semibold border-b border-slate-800">
              <tr>
                <th className="px-5 py-3.5">Dish / Ingredient</th>
                <th className="px-5 py-3.5">Quantity</th>
                <th className="px-5 py-3.5">Cost Impact</th>
                <th className="px-5 py-3.5">Cause Reason</th>
                <th className="px-5 py-3.5">Audit Date</th>
                <th className="px-5 py-3.5">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {records.map((r) => (
                <tr key={r.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="px-5 py-4 font-semibold text-white">
                    {r.menu_item?.name || r.ingredient?.name || 'Item'}
                  </td>
                  <td className="px-5 py-4 font-mono text-xs text-slate-200">
                    {r.quantity} {r.unit}
                  </td>
                  <td className="px-5 py-4 font-mono font-bold text-rose-400 text-xs">
                    -${r.estimated_cost.toFixed(2)}
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-800 border border-slate-700 text-slate-300 uppercase">
                      {r.reason.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-xs text-slate-400">
                    {new Date(r.waste_date).toLocaleDateString()}
                  </td>
                  <td className="px-5 py-4 text-xs text-slate-500">
                    {r.notes || 'End of shift kitchen write-off'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Log Waste Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Log Food Waste Incident"
        subtitle="Record wasted dishes or spoiled raw ingredients to refine production batch sizing"
      >
        <form onSubmit={handleLogWaste} className="space-y-4 text-xs">
          <div>
            <label className="text-slate-300 font-semibold mb-1 block">Item Category</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setWasteType('PREPARED_DISH')}
                className={`p-2 rounded-xl border text-center font-semibold ${
                  wasteType === 'PREPARED_DISH' ? 'bg-brand-600 border-brand-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-300'
                }`}
              >
                Prepared Dish
              </button>
              <button
                type="button"
                onClick={() => setWasteType('INGREDIENT')}
                className={`p-2 rounded-xl border text-center font-semibold ${
                  wasteType === 'INGREDIENT' ? 'bg-brand-600 border-brand-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-300'
                }`}
              >
                Raw Ingredient
              </button>
            </div>
          </div>

          <div>
            <label className="text-slate-300 font-semibold mb-1 block">Select Item</label>
            <select
              value={selectedItemId}
              onChange={(e) => setSelectedItemId(Number(e.target.value))}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
            >
              {wasteType === 'PREPARED_DISH'
                ? menuItems.map((m) => (
                    <option key={m.id} value={m.id}>{m.name} (Cost ~${m.cost_price})</option>
                  ))
                : ingredients.map((ing) => (
                    <option key={ing.id} value={ing.id}>{ing.name} (${ing.cost_per_unit}/{ing.unit})</option>
                  ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-slate-300 font-semibold mb-1 block">Quantity</label>
              <input
                type="number"
                step="0.5"
                required
                value={qty}
                onChange={(e) => setQty(Number(e.target.value))}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
              />
            </div>
            <div>
              <label className="text-slate-300 font-semibold mb-1 block">Estimated Cost ($)</label>
              <input
                type="number"
                step="0.1"
                required
                value={cost}
                onChange={(e) => setCost(Number(e.target.value))}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
              />
            </div>
          </div>

          <div>
            <label className="text-slate-300 font-semibold mb-1 block">Primary Waste Reason</label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
            >
              <option value="OVER_PREPARATION">Over-Preparation (Unsold Batch)</option>
              <option value="SPOILAGE">Storage Spoilage (Temperature/Air)</option>
              <option value="PLATE_WASTE">Customer Plate Leftovers</option>
              <option value="OVERCOOKED">Burnt / Overcooked During Service</option>
              <option value="EXPIRED">Passed Vendor Expiry Date</option>
            </select>
          </div>

          <div>
            <label className="text-slate-300 font-semibold mb-1 block">Auditor Notes</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Fridge thermostat was set too high overnight"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
            />
          </div>

          <Button
            type="submit"
            variant="danger"
            size="md"
            className="w-full mt-3"
            isLoading={isSubmitting}
          >
            Confirm Waste Write-off
          </Button>
        </form>
      </Modal>
    </div>
  );
};
