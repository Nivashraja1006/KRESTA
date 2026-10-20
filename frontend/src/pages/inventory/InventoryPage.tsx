import React, { useState, useEffect } from 'react';
import {
  Package,
  Plus,
  ArrowUpDown,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Truck,
  DollarSign,
  FileCheck,
  Search
} from 'lucide-react';
import apiClient from '../../api/client';
import { useBranch } from '../../context/BranchContext';
import { InventoryHealthItem } from '../../types';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';

export const InventoryPage: React.FC = () => {
  const { selectedBranchId } = useBranch();

  const [items, setItems] = useState<InventoryHealthItem[]>([]);
  const [purchaseOrders, setPurchaseOrders] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'STOCK' | 'PURCHASE_ORDERS'>('STOCK');
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Stock Adjustment Modal
  const [isAdjustModalOpen, setIsAdjustModalOpen] = useState(false);
  const [selectedIngredientId, setSelectedIngredientId] = useState<number>(1);
  const [txnType, setTxnType] = useState<'PURCHASE' | 'USAGE' | 'WASTE' | 'ADJUSTMENT'>('PURCHASE');
  const [adjustQty, setAdjustQty] = useState<number>(10);
  const [adjustNotes, setAdjustNotes] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchInventory = async () => {
    setIsLoading(true);
    try {
      const [healthResp, poResp] = await Promise.all([
        apiClient.get<InventoryHealthItem[]>('/inventory/health'),
        apiClient.get<any[]>(`/inventory/purchase-orders?branch_id=${selectedBranchId}`)
      ]);
      setItems(healthResp.data);
      setPurchaseOrders(poResp.data);
    } catch (e) {
      console.error('Failed to load inventory data:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, [selectedBranchId]);

  const handleAdjustStock = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const signedQty = txnType === 'USAGE' || txnType === 'WASTE' ? -Math.abs(adjustQty) : Math.abs(adjustQty);
      await apiClient.post('/inventory/transactions', {
        ingredient_id: selectedIngredientId,
        branch_id: selectedBranchId,
        transaction_type: txnType,
        quantity: signedQty,
        notes: adjustNotes || 'Manual stock update from inventory desk'
      });
      setIsAdjustModalOpen(false);
      setAdjustQty(10);
      setAdjustNotes('');
      fetchInventory();
    } catch (e: any) {
      alert(e.response?.data?.detail || 'Failed to adjust stock');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReceivePO = async (poId: number) => {
    try {
      await apiClient.patch(`/inventory/purchase-orders/${poId}/receive`);
      fetchInventory();
    } catch (e) {
      console.error('Failed to receive PO:', e);
    }
  };

  const counts = {
    healthy: items.filter((i) => i.status === 'HEALTHY').length,
    low: items.filter((i) => i.status === 'LOW').length,
    critical: items.filter((i) => i.status === 'CRITICAL').length,
    expired: items.filter((i) => i.status === 'EXPIRED').length,
  };

  const filteredItems = items.filter((i) =>
    i.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Inventory & Procurement</h1>
          <p className="text-sm text-slate-400 mt-1">
            Real-time stock monitoring, automated recipe consumption, expiry risk, and purchase orders.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="primary"
            leftIcon={<ArrowUpDown size={16} />}
            onClick={() => setIsAdjustModalOpen(true)}
          >
            Adjust Stock
          </Button>
        </div>
      </div>

      {/* Health Status Metric Counters */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center gap-3.5">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 size={20} />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase">Healthy Stock</span>
            <p className="text-xl font-bold text-white mt-0.5">{counts.healthy}</p>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center gap-3.5">
          <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <AlertTriangle size={20} />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase">Low Stock</span>
            <p className="text-xl font-bold text-amber-400 mt-0.5">{counts.low}</p>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center gap-3.5">
          <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <AlertTriangle size={20} />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase">Critical Empty</span>
            <p className="text-xl font-bold text-rose-400 mt-0.5">{counts.critical}</p>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center gap-3.5">
          <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <Clock size={20} />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase">Expired / Risk</span>
            <p className="text-xl font-bold text-purple-400 mt-0.5">{counts.expired}</p>
          </div>
        </div>
      </div>

      {/* Tab Switcher & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('STOCK')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'STOCK'
                ? 'bg-brand-600 text-white shadow-sm shadow-brand-600/20'
                : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            Ingredients Ledger ({items.length})
          </button>
          <button
            onClick={() => setActiveTab('PURCHASE_ORDERS')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'PURCHASE_ORDERS'
                ? 'bg-brand-600 text-white shadow-sm shadow-brand-600/20'
                : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            Purchase Orders ({purchaseOrders.length})
          </button>
        </div>

        {activeTab === 'STOCK' && (
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3.5 top-2.5 text-slate-500" size={15} />
            <input
              type="text"
              placeholder="Search ingredients..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 outline-none focus:border-brand-500"
            />
          </div>
        )}
      </div>

      {/* Main Tab Content */}
      {activeTab === 'STOCK' ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-800/60 text-xs uppercase text-slate-400 font-semibold border-b border-slate-800">
                <tr>
                  <th className="px-5 py-3.5">Ingredient Name</th>
                  <th className="px-5 py-3.5">Current Stock</th>
                  <th className="px-5 py-3.5">Safety Buffer (Min/Max)</th>
                  <th className="px-5 py-3.5">Unit Valuation</th>
                  <th className="px-5 py-3.5">Total Valuation</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5">Expiry Window</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredItems.map((ing) => (
                  <tr key={ing.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-5 py-4 font-semibold text-white">
                      {ing.name}
                    </td>
                    <td className="px-5 py-4">
                      <span className="font-mono font-bold text-slate-100 text-sm">
                        {ing.current_stock.toFixed(1)} {ing.unit}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-xs text-slate-400">
                      Min: {ing.minimum_stock} &bull; Max: {ing.maximum_stock} {ing.unit}
                    </td>
                    <td className="px-5 py-4 text-xs font-mono text-slate-300">
                      ${ing.cost_per_unit.toFixed(2)} / {ing.unit}
                    </td>
                    <td className="px-5 py-4 text-xs font-bold text-brand-400 font-mono">
                      ${(ing.current_stock * ing.cost_per_unit).toFixed(2)}
                    </td>
                    <td className="px-5 py-4">
                      <StatusBadge status={ing.status} size="sm" />
                    </td>
                    <td className="px-5 py-4 text-xs text-slate-400">
                      {ing.days_until_expiry !== null && ing.days_until_expiry !== undefined ? (
                        <span className={ing.days_until_expiry <= 5 ? 'text-rose-400 font-bold' : ''}>
                          {ing.days_until_expiry < 0 ? 'Expired' : `${ing.days_until_expiry} days left`}
                        </span>
                      ) : (
                        'Shelf Stable'
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Purchase Orders Tab */
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-800/60 text-xs uppercase text-slate-400 font-semibold border-b border-slate-800">
                <tr>
                  <th className="px-5 py-3.5">PO Number</th>
                  <th className="px-5 py-3.5">Supplier</th>
                  <th className="px-5 py-3.5">Amount</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5">Created Date</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {purchaseOrders.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-5 py-12 text-center text-slate-500">
                      No purchase orders recorded yet.
                    </td>
                  </tr>
                ) : (
                  purchaseOrders.map((po) => (
                    <tr key={po.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="px-5 py-4 font-mono font-bold text-white text-xs">
                        {po.order_number}
                      </td>
                      <td className="px-5 py-4 text-xs font-semibold text-slate-200">
                        {po.supplier?.name || 'Vendor'}
                      </td>
                      <td className="px-5 py-4 font-bold text-emerald-400">
                        ${po.total_amount.toFixed(2)}
                      </td>
                      <td className="px-5 py-4">
                        <StatusBadge status={po.status} size="sm" />
                      </td>
                      <td className="px-5 py-4 text-xs text-slate-400">
                        {new Date(po.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-5 py-4 text-right">
                        {po.status === 'ORDERED' && (
                          <button
                            onClick={() => handleReceivePO(po.id)}
                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 hover:text-emerald-300 bg-emerald-500/10 px-3 py-1 rounded-lg border border-emerald-500/30"
                          >
                            <FileCheck size={14} />
                            <span>Receive & Stock In</span>
                          </button>
                        )}
                        {po.status === 'RECEIVED' && (
                          <span className="text-xs text-slate-500">Stocked In</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Adjust Stock Modal */}
      <Modal
        isOpen={isAdjustModalOpen}
        onClose={() => setIsAdjustModalOpen(false)}
        title="Adjust Inventory Stock"
        subtitle="Log manual purchases, physical count adjustments, or spoilage write-offs"
      >
        <form onSubmit={handleAdjustStock} className="space-y-4 text-xs">
          <div>
            <label className="text-slate-300 font-semibold mb-1 block">Ingredient</label>
            <select
              value={selectedIngredientId}
              onChange={(e) => setSelectedIngredientId(Number(e.target.value))}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
            >
              {items.map((ing) => (
                <option key={ing.id} value={ing.id}>
                  {ing.name} (Current: {ing.current_stock} {ing.unit})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-slate-300 font-semibold mb-1 block">Transaction Type</label>
            <select
              value={txnType}
              onChange={(e: any) => setTxnType(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
            >
              <option value="PURCHASE">Stock Addition (Purchase / Delivery)</option>
              <option value="USAGE">Stock Consumption (Kitchen Usage)</option>
              <option value="WASTE">Spoilage / Waste Write-off</option>
              <option value="ADJUSTMENT">Inventory Audit Adjustment</option>
            </select>
          </div>

          <div>
            <label className="text-slate-300 font-semibold mb-1 block">Quantity</label>
            <input
              type="number"
              step="0.1"
              required
              value={adjustQty}
              onChange={(e) => setAdjustQty(Number(e.target.value))}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
            />
          </div>

          <div>
            <label className="text-slate-300 font-semibold mb-1 block">Notes / Reason</label>
            <input
              type="text"
              value={adjustNotes}
              onChange={(e) => setAdjustNotes(e.target.value)}
              placeholder="e.g. End of month physical audit correction"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            size="md"
            className="w-full mt-3"
            isLoading={isSubmitting}
          >
            Update Inventory Ledger
          </Button>
        </form>
      </Modal>
    </div>
  );
};
