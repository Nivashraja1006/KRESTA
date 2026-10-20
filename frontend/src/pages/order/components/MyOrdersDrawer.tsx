import React, { useState, useEffect } from 'react';
import { X, Clock, ShoppingBag, ArrowRight, ExternalLink, RefreshCw, CheckCircle2 } from 'lucide-react';
import apiClient from '../../../api/client';
import { Order, User } from '../../../types';

interface MyOrdersDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  onTrackOrder: (orderId: number | string) => void;
}

export const MyOrdersDrawer: React.FC<MyOrdersDrawerProps> = ({
  isOpen,
  onClose,
  user,
  onTrackOrder
}) => {
  if (!isOpen) return null;

  const [lookupEmail, setLookupEmail] = useState<string>(user?.email || 'customer@restaurantiq.com');
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchOrders = async (emailToFetch: string) => {
    if (!emailToFetch.trim()) return;
    setIsLoading(true);
    try {
      const resp = await apiClient.get<Order[]>(`/orders/customer/my-orders?email=${encodeURIComponent(emailToFetch.trim())}`);
      setOrders(resp.data);
    } catch (e) {
      console.error('Failed to fetch customer orders:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && lookupEmail) {
      void fetchOrders(lookupEmail);
    }
  }, [isOpen]);

  const handleLookupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    void fetchOrders(lookupEmail);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
      case 'SERVED':
        return 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10';
      case 'PREPARING':
        return 'text-amber-300 border-amber-500/30 bg-amber-500/10';
      case 'READY':
        return 'text-blue-300 border-blue-500/30 bg-blue-500/10';
      case 'CANCELLED':
        return 'text-red-400 border-red-500/30 bg-red-500/10';
      default:
        return 'text-slate-300 border-slate-700 bg-slate-800';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-slate-950/80 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="relative h-full w-full max-w-md bg-slate-900 border-l border-slate-800 p-6 flex flex-col justify-between shadow-2xl overflow-y-auto">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Clock size={18} className="text-amber-400" />
              <h3 className="font-serif text-lg font-bold text-white">Your Feast History</h3>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X size={18} />
            </button>
          </div>

          {/* Email Lookup Input */}
          <form onSubmit={handleLookupSubmit} className="mt-4 flex gap-2">
            <input
              type="email"
              value={lookupEmail}
              onChange={(e) => setLookupEmail(e.target.value)}
              placeholder="Enter order email"
              className="flex-1 rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-500"
            />
            <button
              type="submit"
              className="rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 px-3 py-2 text-xs font-semibold text-slate-200 transition-colors"
            >
              Search
            </button>
          </form>

          {/* Orders List */}
          <div className="mt-5 space-y-3.5">
            {isLoading ? (
              <div className="py-12 text-center text-xs text-slate-400">
                <RefreshCw size={20} className="mx-auto animate-spin mb-2 text-amber-400" />
                Loading your previous orders...
              </div>
            ) : orders.length === 0 ? (
              <div className="py-12 text-center space-y-2">
                <ShoppingBag size={28} className="mx-auto text-slate-600" />
                <p className="text-xs font-semibold text-slate-400">No past orders found for this email.</p>
                <p className="text-[11px] text-slate-500">
                  Place an order above to begin building your patron order timeline.
                </p>
              </div>
            ) : (
              orders.map((ord) => (
                <div
                  key={ord.id}
                  className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4 space-y-3 hover:border-slate-700 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-mono text-xs font-bold text-white">
                        {ord.order_number}
                      </span>
                      <p className="text-[10px] text-slate-500">
                        {new Date(ord.created_at).toLocaleString()}
                      </p>
                    </div>
                    <span
                      className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${getStatusColor(
                        ord.status
                      )}`}
                    >
                      {ord.status}
                    </span>
                  </div>

                  {/* Items summary */}
                  <div className="text-xs text-slate-400 space-y-0.5">
                    {ord.items.slice(0, 3).map((it) => (
                      <div key={it.id} className="flex justify-between">
                        <span className="truncate max-w-[200px]">
                          {it.quantity}x {it.menu_item?.name || 'Artisan Dish'}
                        </span>
                        <span className="font-mono">${it.subtotal.toFixed(2)}</span>
                      </div>
                    ))}
                    {ord.items.length > 3 && (
                      <p className="text-[10px] text-slate-500 italic">
                        +{ord.items.length - 3} more dishes...
                      </p>
                    )}
                  </div>

                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                    <span className="text-sm font-bold font-mono text-emerald-400">
                      ${ord.total_amount.toFixed(2)}
                    </span>

                    <button
                      type="button"
                      onClick={() => {
                        onTrackOrder(ord.order_number);
                        onClose();
                      }}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-amber-500/40 bg-amber-500/10 hover:bg-amber-500/20 px-3 py-1.5 text-xs font-bold text-amber-300 transition-colors"
                    >
                      <span>Track Order</span>
                      <ExternalLink size={12} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="pt-4 border-t border-slate-800 text-center">
          <p className="text-[11px] text-slate-500">
            Connected to KRESTA Kitchen Telemetry Engine.
          </p>
        </div>
      </div>
    </div>
  );
};

