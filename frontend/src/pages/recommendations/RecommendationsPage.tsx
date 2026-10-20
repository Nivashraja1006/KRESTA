import React, { useState, useEffect } from 'react';
import {
  Lightbulb,
  Package,
  Truck,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  DollarSign,
  ShoppingCart,
  RefreshCw
} from 'lucide-react';
import apiClient from '../../api/client';
import { useBranch } from '../../context/BranchContext';
import { InventoryRecommendation } from '../../types';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Button } from '../../components/common/Button';

export const RecommendationsPage: React.FC = () => {
  const { selectedBranchId, selectedBranch } = useBranch();

  const [recommendations, setRecommendations] = useState<InventoryRecommendation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [poMessage, setPoMessage] = useState<string>('');

  const fetchRecommendations = async () => {
    setIsLoading(true);
    try {
      const resp = await apiClient.get<InventoryRecommendation[]>(
        `/recommendations/inventory?branch_id=${selectedBranchId}`
      );
      setRecommendations(resp.data);
    } catch (e) {
      console.error('Failed to load inventory recommendations:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, [selectedBranchId]);

  const handleCreatePO = async (rec: InventoryRecommendation) => {
    try {
      await apiClient.post('/inventory/purchase-orders', {
        branch_id: selectedBranchId,
        supplier_id: 1, // default or linked supplier
        notes: `AI Automated Replenishment Order for ${rec.ingredient_name}`,
        items: [
          {
            ingredient_id: rec.ingredient_id,
            quantity_ordered: rec.recommended_order_quantity,
            unit_price: rec.recommended_order_quantity > 0 ? rec.estimated_purchase_cost / rec.recommended_order_quantity : 5.0
          }
        ]
      });
      setPoMessage(`Purchase Order created successfully for ${rec.recommended_order_quantity} ${rec.unit} of ${rec.ingredient_name}.`);
      setTimeout(() => setPoMessage(''), 6000);
    } catch (e: any) {
      alert(e.response?.data?.detail || 'Failed to create PO');
    }
  };

  const totalReplenishmentCost = recommendations.reduce(
    (sum, r) => sum + r.estimated_purchase_cost,
    0
  );
  const itemsToReorder = recommendations.filter((r) => r.recommended_order_quantity > 0).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full border border-brand-500/30 bg-brand-500/10 px-3 py-0.5 text-xs font-semibold text-brand-400 mb-1">
            <Lightbulb size={14} />
            <span>AI Supply Chain Optimization</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">AI Inventory Replenishment</h1>
          <p className="text-sm text-slate-400 mt-0.5">
            Scientifically computed purchasing quantities balancing current stock, forecast consumption, safety buffer, and vendor lead times.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={fetchRecommendations}
          isLoading={isLoading}
          leftIcon={<RefreshCw size={14} />}
        >
          Recalculate
        </Button>
      </div>

      {poMessage && (
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs text-emerald-400 flex items-center gap-2">
          <CheckCircle2 size={16} />
          <span>{poMessage}</span>
        </div>
      )}

      {/* Formula Explanation Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
        <div className="flex items-center gap-2 text-brand-400 font-bold text-xs uppercase tracking-wider mb-2">
          <HelpCircle size={16} />
          <span>Optimization Math & Logic</span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          <strong className="text-white">Recommended Order Quantity</strong> =
          <code className="mx-1 px-1.5 py-0.5 bg-slate-800 rounded text-brand-300 font-mono">
            max(0, Predicted Demand + Safety Stock - Current Stock + (Daily Rate &times; Supplier Lead Time))
          </code>
        </p>
        <div className="mt-3 flex flex-wrap gap-4 text-xs text-slate-400 border-t border-slate-800/80 pt-3">
          <div><span className="font-semibold text-white">Items to Reorder:</span> <span className="text-amber-400 font-bold">{itemsToReorder}</span></div>
          <div><span className="font-semibold text-white">Total Estimated Spend:</span> <span className="text-emerald-400 font-bold font-mono">${totalReplenishmentCost.toFixed(2)}</span></div>
          <div><span className="font-semibold text-white">Branch Scope:</span> <span className="text-slate-300">{selectedBranch?.name}</span></div>
        </div>
      </div>

      {/* Recommendations Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-800/60 text-xs uppercase text-slate-400 font-semibold border-b border-slate-800">
              <tr>
                <th className="px-5 py-3.5">Ingredient</th>
                <th className="px-5 py-3.5">Current Stock</th>
                <th className="px-5 py-3.5">Forecast Usage</th>
                <th className="px-5 py-3.5">Safety Stock</th>
                <th className="px-5 py-3.5">Recommended Buy</th>
                <th className="px-5 py-3.5">Est. Cost</th>
                <th className="px-5 py-3.5">Vendor Lead Time</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {recommendations.map((rec) => (
                <tr key={rec.ingredient_id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="px-5 py-4">
                    <span className="font-semibold text-white block">{rec.ingredient_name}</span>
                    <span className="text-[11px] text-slate-500">{rec.explanation}</span>
                  </td>
                  <td className="px-5 py-4 font-mono text-xs text-slate-200">
                    {rec.current_stock.toFixed(1)} {rec.unit}
                  </td>
                  <td className="px-5 py-4 font-mono text-xs text-cyan-400">
                    {rec.predicted_usage.toFixed(1)} {rec.unit}
                  </td>
                  <td className="px-5 py-4 font-mono text-xs text-slate-400">
                    {rec.safety_stock.toFixed(1)} {rec.unit}
                  </td>
                  <td className="px-5 py-4">
                    {rec.recommended_order_quantity > 0 ? (
                      <span className="font-mono font-bold text-amber-400 text-sm">
                        +{rec.recommended_order_quantity.toFixed(1)} {rec.unit}
                      </span>
                    ) : (
                      <span className="text-xs text-emerald-400 font-medium">Sufficient</span>
                    )}
                  </td>
                  <td className="px-5 py-4 font-mono font-bold text-slate-200 text-xs">
                    ${rec.estimated_purchase_cost.toFixed(2)}
                  </td>
                  <td className="px-5 py-4 text-xs text-slate-400">
                    <span className="text-white font-medium">{rec.supplier_name}</span>
                    <span className="block text-[11px] text-slate-500">({rec.lead_time_days} days lead)</span>
                  </td>
                  <td className="px-5 py-4">
                    <StatusBadge status={rec.status} size="sm" />
                  </td>
                  <td className="px-5 py-4 text-right">
                    {rec.recommended_order_quantity > 0 ? (
                      <button
                        onClick={() => handleCreatePO(rec)}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-400 hover:text-brand-300 bg-brand-500/10 px-3 py-1.5 rounded-xl border border-brand-500/30 hover:bg-brand-500/20 transition-all"
                      >
                        <ShoppingCart size={13} />
                        <span>Order Now</span>
                      </button>
                    ) : (
                      <span className="text-xs text-slate-600">No Action</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
