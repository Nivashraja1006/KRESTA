import React, { useState, useEffect } from 'react';
import {
  ChefHat,
  Clock,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  Flame,
  UtensilsCrossed,
  BellRing
} from 'lucide-react';
import apiClient from '../../api/client';
import { useBranch } from '../../context/BranchContext';
import { Button } from '../../components/common/Button';

interface KitchenItem {
  id: number;
  dish_name: string;
  quantity: number;
  special_instructions?: string;
  status: string;
}

interface KitchenOrder {
  id: number;
  order_number: string;
  order_type: string;
  status: string;
  table_number: string;
  elapsed_minutes: number;
  target_prep_time: number;
  is_delayed: boolean;
  items: KitchenItem[];
  notes?: string;
  created_at: string;
}

interface KitchenQueueResponse {
  new_orders: KitchenOrder[];
  preparing_orders: KitchenOrder[];
  ready_orders: KitchenOrder[];
  workload_metrics: {
    total_active_orders: number;
    items_in_prep: number;
    delayed_orders_count: number;
  };
}

export const KitchenPage: React.FC = () => {
  const { selectedBranchId, selectedBranch } = useBranch();

  const [queue, setQueue] = useState<KitchenQueueResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchKitchenQueue = async () => {
    try {
      const resp = await apiClient.get<KitchenQueueResponse>(
        `/kitchen/queue?branch_id=${selectedBranchId}`
      );
      setQueue(resp.data);
    } catch (e) {
      console.error('Failed to load kitchen queue:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchKitchenQueue();
    // Auto refresh every 8 seconds for live kitchen dispatch
    const timer = setInterval(fetchKitchenQueue, 8000);
    return () => clearInterval(timer);
  }, [selectedBranchId]);

  const handleProgressOrder = async (orderId: number) => {
    try {
      await apiClient.post(`/kitchen/orders/${orderId}/progress`);
      fetchKitchenQueue();
    } catch (e) {
      console.error('Failed to progress order:', e);
    }
  };

  const renderOrderCard = (order: KitchenOrder, currentColumn: 'new' | 'preparing' | 'ready') => {
    return (
      <div
        key={order.id}
        className={`rounded-2xl border p-4 shadow-lg flex flex-col justify-between transition-all ${
          order.is_delayed
            ? 'bg-rose-950/20 border-rose-500/50 shadow-rose-900/10'
            : currentColumn === 'preparing'
            ? 'bg-amber-950/20 border-amber-500/30'
            : currentColumn === 'ready'
            ? 'bg-emerald-950/20 border-emerald-500/30'
            : 'bg-slate-900 border-slate-800'
        }`}
      >
        {/* Ticket Header */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-800/80 mb-3">
          <div>
            <span className="font-mono text-sm font-bold text-white tracking-tight">{order.order_number}</span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-xs font-semibold text-brand-400">
                {order.table_number.startsWith('T-') ? `Table ${order.table_number}` : order.table_number}
              </span>
              <span className="text-[10px] text-slate-400">&bull; {order.order_type}</span>
            </div>
          </div>

          {/* Prep Timer Badge */}
          <div className="text-right">
            <div
              className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-lg border ${
                order.is_delayed
                  ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse'
                  : order.elapsed_minutes > order.target_prep_time * 0.7
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  : 'bg-slate-800 text-slate-300 border-slate-700'
              }`}
            >
              <Clock size={12} />
              <span>{order.elapsed_minutes}m</span>
            </div>
            <p className="text-[10px] text-slate-500 mt-0.5">Target: {order.target_prep_time}m</p>
          </div>
        </div>

        {/* Item Line list */}
        <div className="space-y-2 flex-1 my-2">
          {order.items.map((item) => (
            <div key={item.id} className="flex items-start justify-between text-xs">
              <div className="flex items-start gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-md bg-slate-800 text-[11px] font-bold text-white flex-shrink-0">
                  {item.quantity}
                </span>
                <div>
                  <span className="font-semibold text-slate-200">{item.dish_name}</span>
                  {item.special_instructions && (
                    <p className="text-[11px] text-amber-300/90 italic mt-0.5">
                      ⚠️ Note: {item.special_instructions}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}

          {order.notes && (
            <p className="text-[11px] text-slate-400 bg-slate-800/40 p-2 rounded-lg mt-2 border border-slate-800">
              Kitchen Note: {order.notes}
            </p>
          )}
        </div>

        {/* 1-Click Action Progression Button */}
        <div className="mt-4 pt-3 border-t border-slate-800/60">
          {currentColumn === 'new' && (
            <Button
              variant="primary"
              size="sm"
              className="w-full bg-amber-600 hover:bg-amber-500 border-amber-500 text-white font-bold"
              leftIcon={<Flame size={16} />}
              onClick={() => handleProgressOrder(order.id)}
            >
              Start Cooking (Prep)
            </Button>
          )}

          {currentColumn === 'preparing' && (
            <Button
              variant="primary"
              size="sm"
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold"
              leftIcon={<CheckCircle2 size={16} />}
              onClick={() => handleProgressOrder(order.id)}
            >
              Mark Plated & Ready
            </Button>
          )}

          {currentColumn === 'ready' && (
            <Button
              variant="secondary"
              size="sm"
              className="w-full bg-teal-600 hover:bg-teal-500 text-white font-bold"
              leftIcon={<UtensilsCrossed size={16} />}
              onClick={() => handleProgressOrder(order.id)}
            >
              Confirm Served to Floor
            </Button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header & Workload Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <ChefHat size={28} className="text-amber-400" />
            <span>Kitchen Display System (KDS)</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Real-time kitchen line workflow dispatch for <span className="text-brand-400 font-semibold">{selectedBranch?.name}</span>
          </p>
        </div>

        {/* Workload Metric Counters */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-3.5 py-2 rounded-xl text-xs">
            <Flame size={16} className="text-amber-400" />
            <span className="text-slate-400">Items Cooking:</span>
            <span className="font-bold text-white text-sm">
              {queue?.workload_metrics.items_in_prep || 0}
            </span>
          </div>

          <div className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs border ${
            (queue?.workload_metrics.delayed_orders_count || 0) > 0
              ? 'bg-rose-500/10 border-rose-500/30 text-rose-300'
              : 'bg-slate-900 border-slate-800 text-slate-400'
          }`}>
            <AlertTriangle size={16} className={(queue?.workload_metrics.delayed_orders_count || 0) > 0 ? 'text-rose-400 animate-bounce' : 'text-slate-500'} />
            <span>Delayed:</span>
            <span className="font-bold text-sm">
              {queue?.workload_metrics.delayed_orders_count || 0}
            </span>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={fetchKitchenQueue}
            isLoading={isLoading}
            leftIcon={<RefreshCw size={14} />}
          >
            Sync
          </Button>
        </div>
      </div>

      {/* Kanban 3-Column Display */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Column 1: NEW ORDERS */}
        <div className="bg-slate-950/60 rounded-2xl border border-slate-800/80 p-4 flex flex-col">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className="flex h-3 w-3 rounded-full bg-blue-500 animate-ping"></span>
              <h3 className="font-bold text-sm uppercase tracking-wider text-slate-200">
                New Tickets ({queue?.new_orders.length || 0})
              </h3>
            </div>
            <span className="text-xs text-slate-500">Incoming from POS</span>
          </div>

          <div className="space-y-4 flex-1 overflow-y-auto max-h-[calc(100vh-280px)] pr-1">
            {queue?.new_orders.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-slate-600">
                <UtensilsCrossed size={36} className="mb-2 opacity-40" />
                <p className="text-xs font-medium">No incoming tickets</p>
              </div>
            ) : (
              queue?.new_orders.map((ord) => renderOrderCard(ord, 'new'))
            )}
          </div>
        </div>

        {/* Column 2: PREPARING (COOKING) */}
        <div className="bg-slate-950/60 rounded-2xl border border-slate-800/80 p-4 flex flex-col">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className="flex h-3 w-3 rounded-full bg-amber-500"></span>
              <h3 className="font-bold text-sm uppercase tracking-wider text-slate-200">
                Cooking In Kitchen ({queue?.preparing_orders.length || 0})
              </h3>
            </div>
            <span className="text-xs text-slate-500">On Fire</span>
          </div>

          <div className="space-y-4 flex-1 overflow-y-auto max-h-[calc(100vh-280px)] pr-1">
            {queue?.preparing_orders.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-slate-600">
                <Flame size={36} className="mb-2 opacity-40" />
                <p className="text-xs font-medium">Kitchen line idle</p>
              </div>
            ) : (
              queue?.preparing_orders.map((ord) => renderOrderCard(ord, 'preparing'))
            )}
          </div>
        </div>

        {/* Column 3: READY TO SERVE */}
        <div className="bg-slate-950/60 rounded-2xl border border-slate-800/80 p-4 flex flex-col">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className="flex h-3 w-3 rounded-full bg-emerald-500"></span>
              <h3 className="font-bold text-sm uppercase tracking-wider text-slate-200">
                Ready For Pass ({queue?.ready_orders.length || 0})
              </h3>
            </div>
            <span className="text-xs text-slate-500">Call Waiter</span>
          </div>

          <div className="space-y-4 flex-1 overflow-y-auto max-h-[calc(100vh-280px)] pr-1">
            {queue?.ready_orders.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-slate-600">
                <CheckCircle2 size={36} className="mb-2 opacity-40" />
                <p className="text-xs font-medium">No plated tickets pending</p>
              </div>
            ) : (
              queue?.ready_orders.map((ord) => renderOrderCard(ord, 'ready'))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
