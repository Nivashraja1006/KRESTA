import React, { useState, useEffect } from 'react';
import {
  FileText,
  Download,
  Table as TableIcon,
  DollarSign,
  Calendar,
  Sparkles,
  TrendingUp,
  Package,
  ShoppingBag,
  ArrowUpDown,
  RefreshCw,
  Printer,
  ChevronDown
} from 'lucide-react';
import apiClient from '../../api/client';
import { useBranch } from '../../context/BranchContext';
import { Button } from '../../components/common/Button';
import { Order, MenuItem, InventoryHealthItem } from '../../types';

export const ReportsPage: React.FC = () => {
  const { selectedBranchId, selectedBranch } = useBranch();

  const [activeTab, setActiveTab] = useState<'SALES' | 'DISHES' | 'INVENTORY'>('SALES');
  const [orders, setOrders] = useState<Order[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [inventoryItems, setInventoryItems] = useState<InventoryHealthItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchReportData = async () => {
    setIsLoading(true);
    try {
      const [ordersResp, menuResp, invResp] = await Promise.all([
        apiClient.get<Order[]>(`/orders/?branch_id=${selectedBranchId}&limit=50`),
        apiClient.get<MenuItem[]>('/menu/items'),
        apiClient.get<InventoryHealthItem[]>('/inventory/health')
      ]);
      setOrders(ordersResp.data);
      setMenuItems(menuResp.data);
      setInventoryItems(invResp.data);
    } catch (e) {
      console.error('Failed to load report metrics:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReportData();
  }, [selectedBranchId]);

  const handleDownloadSalesCsv = () => {
    const url = `/api/v1/reports/sales/csv?branch_id=${selectedBranchId}`;
    window.open(url, '_blank');
  };

  const handleDownloadInventoryCsv = () => {
    const url = `/api/v1/reports/inventory/csv`;
    window.open(url, '_blank');
  };

  // Aggregated KPI calculations
  const totalSales = orders.reduce((sum, o) => sum + (o.total_amount || 0), 0);
  const avgOrderValue = orders.length > 0 ? totalSales / orders.length : 0;
  const totalInvValue = inventoryItems.reduce((sum, i) => sum + i.current_stock * i.cost_per_unit, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <span>Executive Reports & Audit Ledger</span>
            <span className="p-1 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-mono">
              v2.4
            </span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Grounded operational summaries, sales journals, and inventory valuations for{' '}
            <span className="text-brand-400 font-semibold">{selectedBranch?.name || 'Downtown Flagship'}</span>.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchReportData}
            isLoading={isLoading}
            leftIcon={<RefreshCw size={14} />}
          >
            Refresh
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={handleDownloadSalesCsv}
            leftIcon={<Download size={14} />}
          >
            Export Sales CSV
          </Button>
        </div>
      </div>

      {/* KPI Overview Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium mb-1">
            <span>Ledger Net Revenue</span>
            <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
              <DollarSign size={14} />
            </span>
          </div>
          <p className="text-2xl font-black text-white font-serif tracking-tight">
            ${totalSales.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <span className="text-[11px] text-emerald-400 font-semibold mt-1 inline-block">
            Across {orders.length} recent orders
          </span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium mb-1">
            <span>Average Ticket Value</span>
            <span className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400">
              <TrendingUp size={14} />
            </span>
          </div>
          <p className="text-2xl font-black text-white font-serif tracking-tight">
            ${avgOrderValue.toFixed(2)}
          </p>
          <span className="text-[11px] text-slate-400 mt-1 inline-block">
            Per guest transaction
          </span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium mb-1">
            <span>Inventory Asset Valuation</span>
            <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400">
              <Package size={14} />
            </span>
          </div>
          <p className="text-2xl font-black text-white font-serif tracking-tight">
            ${totalInvValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <span className="text-[11px] text-amber-400 font-semibold mt-1 inline-block">
            {inventoryItems.length} pantry ingredients
          </span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium mb-1">
            <span>Active Menu Portfolio</span>
            <span className="p-1.5 rounded-lg bg-purple-500/10 text-purple-400">
              <ShoppingBag size={14} />
            </span>
          </div>
          <p className="text-2xl font-black text-white font-serif tracking-tight">
            {menuItems.length} Dishes
          </p>
          <span className="text-[11px] text-slate-400 mt-1 inline-block">
            8 distinct culinary categories
          </span>
        </div>
      </div>

      {/* Report Tab Selector */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          {[
            { id: 'SALES', label: 'Detailed Sales & Order Ledger', icon: DollarSign },
            { id: 'DISHES', label: 'Dish Performance & Profitability', icon: ShoppingBag },
            { id: 'INVENTORY', label: 'Inventory Valuation & Audit', icon: Package }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === tab.id
                  ? 'bg-brand-500 text-slate-950 font-black shadow-md'
                  : 'bg-slate-850 text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <tab.icon size={14} />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          {activeTab === 'INVENTORY' ? (
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownloadInventoryCsv}
              leftIcon={<Download size={13} />}
            >
              Export Inventory CSV
            </Button>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownloadSalesCsv}
              leftIcon={<Download size={13} />}
            >
              Export Sales CSV
            </Button>
          )}
        </div>
      </div>

      {/* TAB 1: DETAILED SALES LEDGER */}
      {activeTab === 'SALES' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-sm">
          <div className="p-5 border-b border-slate-800 flex items-center justify-between">
            <h3 className="font-bold text-white text-sm">
              Live Order Transactions ({orders.length} Records)
            </h3>
            <span className="text-xs text-slate-400">Auto-logged from Kitchen Display & POS</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 text-[11px] font-bold uppercase tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Order Number</th>
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4">Fulfilment</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Subtotal</th>
                  <th className="py-3 px-4 text-right">Tax (5%)</th>
                  <th className="py-3 px-4 text-right">Discount</th>
                  <th className="py-3 px-4 text-right">Grand Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {orders.map((o) => (
                  <tr key={o.id} className="hover:bg-slate-850/60 transition-colors">
                    <td className="py-3 px-4 font-bold text-white font-sans">{o.order_number}</td>
                    <td className="py-3 px-4 text-slate-400">
                      {new Date(o.created_at).toLocaleDateString()} {new Date(o.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 font-sans text-[11px] font-semibold">
                        {o.order_type}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-sans font-bold uppercase ${
                          o.status === 'COMPLETED'
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : o.status === 'PREPARING'
                            ? 'bg-amber-500/20 text-amber-400'
                            : 'bg-blue-500/20 text-blue-400'
                        }`}
                      >
                        {o.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">${o.subtotal.toFixed(2)}</td>
                    <td className="py-3 px-4 text-right text-slate-400">${o.tax.toFixed(2)}</td>
                    <td className="py-3 px-4 text-right text-emerald-400">
                      {o.discount > 0 ? `-$${o.discount.toFixed(2)}` : '$0.00'}
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-white">${o.total_amount.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: DISH PERFORMANCE */}
      {activeTab === 'DISHES' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-sm">
          <div className="p-5 border-b border-slate-800 flex items-center justify-between">
            <h3 className="font-bold text-white text-sm">
              Menu Item Economics & Preparation ({menuItems.length} Dishes)
            </h3>
            <span className="text-xs text-slate-400">Pricing vs Estimated Food Cost</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 text-[11px] font-bold uppercase tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Dish Name</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4 text-right">Selling Price</th>
                  <th className="py-3 px-4 text-right">Target Food Cost</th>
                  <th className="py-3 px-4 text-right">Gross Margin</th>
                  <th className="py-3 px-4 text-center">Prep Window</th>
                  <th className="py-3 px-4 text-center">Availability</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {menuItems.map((item) => {
                  const estCost = Math.round(item.price * 0.28 * 100) / 100;
                  const marginPercent = Math.round(((item.price - estCost) / item.price) * 100);
                  return (
                    <tr key={item.id} className="hover:bg-slate-850/60 transition-colors">
                      <td className="py-3 px-4 font-bold text-white font-sans flex items-center gap-2">
                        <img
                          src={item.image_url}
                          alt={item.name}
                          className="w-8 h-8 rounded-lg object-cover border border-slate-700"
                        />
                        <span>{item.name}</span>
                      </td>
                      <td className="py-3 px-4 font-sans text-slate-400">{item.category?.name || 'Main Course'}</td>
                      <td className="py-3 px-4 text-right font-bold text-white">${item.price.toFixed(2)}</td>
                      <td className="py-3 px-4 text-right text-slate-400">${estCost.toFixed(2)}</td>
                      <td className="py-3 px-4 text-right text-emerald-400 font-bold">{marginPercent}%</td>
                      <td className="py-3 px-4 text-center text-slate-400 font-sans">
                        {item.preparation_time_minutes || 20} mins
                      </td>
                      <td className="py-3 px-4 text-center font-sans">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          item.is_available ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                        }`}>
                          {item.is_available ? 'Available' : 'Sold Out'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: INVENTORY VALUATION */}
      {activeTab === 'INVENTORY' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-sm">
          <div className="p-5 border-b border-slate-800 flex items-center justify-between">
            <h3 className="font-bold text-white text-sm">
              Raw Ingredients Asset Valuation ({inventoryItems.length} Items)
            </h3>
            <span className="text-xs text-slate-400">Total Asset Worth: ${totalInvValue.toFixed(2)}</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 text-[11px] font-bold uppercase tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Ingredient Name</th>
                  <th className="py-3 px-4 text-right">Current Stock</th>
                  <th className="py-3 px-4 text-right">Minimum Buffer</th>
                  <th className="py-3 px-4 text-right">Unit Cost</th>
                  <th className="py-3 px-4 text-right">Asset Valuation</th>
                  <th className="py-3 px-4 text-center">Stock Health</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {inventoryItems.map((ing) => {
                  const val = ing.current_stock * ing.cost_per_unit;
                  return (
                    <tr key={ing.id} className="hover:bg-slate-850/60 transition-colors">
                      <td className="py-3 px-4 font-bold text-white font-sans">{ing.name}</td>
                      <td className="py-3 px-4 text-right font-bold text-white">
                        {ing.current_stock.toFixed(1)} {ing.unit}
                      </td>
                      <td className="py-3 px-4 text-right text-slate-400">
                        {ing.minimum_stock.toFixed(1)} {ing.unit}
                      </td>
                      <td className="py-3 px-4 text-right text-slate-400">${ing.cost_per_unit.toFixed(2)}</td>
                      <td className="py-3 px-4 text-right font-bold text-emerald-400">${val.toFixed(2)}</td>
                      <td className="py-3 px-4 text-center font-sans">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            ing.status === 'HEALTHY'
                              ? 'bg-emerald-500/20 text-emerald-400'
                              : ing.status === 'LOW'
                              ? 'bg-amber-500/20 text-amber-400'
                              : 'bg-rose-500/20 text-rose-400'
                          }`}
                        >
                          {ing.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
