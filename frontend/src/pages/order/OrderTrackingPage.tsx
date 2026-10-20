import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Clock,
  CheckCircle2,
  ChefHat,
  Flame,
  Truck,
  ShoppingBag,
  ArrowLeft,
  MapPin,
  UtensilsCrossed,
  ShieldCheck,
  RefreshCw,
  Phone,
  Sparkles,
  AlertCircle,
  Receipt,
  Store,
  HelpCircle
} from 'lucide-react';
import apiClient from '../../api/client';
import { OrderTrackingData, OrderTimelineStep } from '../../types';
import { CustomerNavbar } from '../../components/customer/CustomerNavbar';
import { CustomerFooter } from '../../components/customer/CustomerFooter';

export const OrderTrackingPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();

  const [trackingData, setTrackingData] = useState<OrderTrackingData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());
  const [wsConnected, setWsConnected] = useState<boolean>(false);

  const fetchTracking = async (silent = false) => {
    if (!orderId) return;
    if (!silent) setIsLoading(true);
    try {
      const resp = await apiClient.get<OrderTrackingData>(`/orders/customer/track/${encodeURIComponent(orderId)}`);
      setTrackingData(resp.data);
      setLastRefreshed(new Date());
      setErrorMsg('');
    } catch (err: any) {
      console.error('Tracking fetch error:', err);
      if (!silent) {
        setErrorMsg(err.response?.data?.detail || `Order #${orderId} could not be located.`);
      }
    } finally {
      if (!silent) setIsLoading(false);
    }
  };

  // Initial fetch and 5-second polling fallback
  useEffect(() => {
    void fetchTracking(false);

    const interval = setInterval(() => {
      void fetchTracking(true);
    }, 5000);

    return () => clearInterval(interval);
  }, [orderId]);

  // Real-time WebSocket connection to Kitchen Room
  useEffect(() => {
    if (!orderId) return;

    let ws: WebSocket | null = null;
    try {
      const loc = window.location;
      const wsProtocol = loc.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsHost = loc.hostname;
      const wsPort = '8080';
      const wsUrl = `${wsProtocol}//${wsHost}:${wsPort}/ws/kitchen`;

      ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        setWsConnected(true);
      };

      ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);
          if (
            msg.event === 'KITCHEN_ORDER_PROGRESSED' ||
            msg.event === 'ORDER_STATUS_CHANGED' ||
            msg.event === 'NEW_ORDER'
          ) {
            void fetchTracking(true);
          }
        } catch (e) {
          console.warn('Failed to parse WebSocket message:', e);
        }
      };

      ws.onerror = () => {
        setWsConnected(false);
      };

      ws.onclose = () => {
        setWsConnected(false);
      };
    } catch (e) {
      console.warn('WebSocket fallback to fast polling:', e);
    }

    return () => {
      if (ws) ws.close();
    };
  }, [orderId]);

  const getStepIcon = (key: string) => {
    switch (key) {
      case 'ORDER_PLACED':
        return CheckCircle2;
      case 'KITCHEN_PREP':
        return Flame;
      case 'PACKED':
      case 'READY':
      case 'READY_FOR_PICKUP':
        return ChefHat;
      case 'ON_THE_WAY':
      case 'SERVED':
        return Truck;
      case 'DELIVERED':
      case 'PICKED_UP':
      case 'COMPLETED':
        return CheckCircle2;
      default:
        return ShoppingBag;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#05070d] text-slate-100 font-sans selection:bg-amber-500 selection:text-slate-950">
      <CustomerNavbar />

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between mb-6">
          <Link
            to="/order"
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-amber-300 transition-colors"
          >
            <ArrowLeft size={16} />
            <span>Return to Menu</span>
          </Link>

          {/* Sync Status Badge */}
          <div className="flex items-center gap-2 text-[11px] font-semibold text-slate-400">
            <span className={`w-2 h-2 rounded-full ${wsConnected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
            <span>{wsConnected ? 'Live Kitchen WebSocket' : 'Live Auto-Polling (5s)'}</span>
            <button
              onClick={() => fetchTracking(false)}
              className="p-1 hover:text-white transition-colors"
              title="Refresh"
            >
              <RefreshCw size={12} />
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="bg-[#0c101d] rounded-3xl p-12 text-center border border-white/10 shadow-xl animate-pulse space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 mx-auto border border-emerald-500/30" />
            <div className="h-6 bg-white/10 rounded w-1/3 mx-auto" />
            <div className="h-4 bg-white/5 rounded w-1/2 mx-auto" />
          </div>
        ) : errorMsg || !trackingData ? (
          <div className="bg-[#0c101d] rounded-3xl p-10 text-center border border-white/10 shadow-xl space-y-4">
            <AlertCircle size={36} className="mx-auto text-rose-400" />
            <h2 className="font-serif font-black text-xl text-white">Order Not Found</h2>
            <p className="text-xs text-slate-400 max-w-md mx-auto">{errorMsg || 'We could not locate this order reference.'}</p>
            <Link
              to="/order"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 text-slate-950 font-black text-xs shadow-md"
            >
              Back to Menu
            </Link>
          </div>
        ) : (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Status Hero Card */}
            <div className="bg-[#0c101d] rounded-3xl border border-white/10 p-6 sm:p-8 shadow-xl relative overflow-hidden">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-serif font-black text-2xl sm:text-3xl text-white">
                      Order #{trackingData.order.order_number}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-black uppercase tracking-wider">
                      {trackingData.order.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1 flex items-center gap-2">
                    <span>{trackingData.fulfillment_label}</span>
                    <span>•</span>
                    <span>Placed at {new Date(trackingData.order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </p>
                </div>

                {/* Remaining Estimated Prep Time */}
                <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 text-left sm:text-right">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
                    Estimated Arrival
                  </p>
                  <p className="font-serif font-black text-2xl text-emerald-300">
                    {trackingData.estimated_time_minutes > 0 ? `${trackingData.estimated_time_minutes} Mins` : 'Ready / Arrived'}
                  </p>
                </div>
              </div>

              {/* Animated Progress Timeline */}
              <div className="py-8">
                <div className="relative">
                  <div className="space-y-8 relative before:absolute before:inset-0 before:left-[19px] sm:before:left-[23px] before:w-0.5 before:bg-white/10">
                    {trackingData.timeline.map((step, idx) => {
                      const IconComp = getStepIcon(step.key);
                      const isCompleted = step.status === 'COMPLETED';
                      const isCurrent = step.status === 'CURRENT';

                      return (
                        <div key={step.key} className="relative flex items-start gap-4 sm:gap-6">
                          {/* Timeline node */}
                          <div
                            className={`w-10 h-10 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center flex-shrink-0 transition-all z-10 ${
                              isCompleted
                                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/30'
                                : isCurrent
                                ? 'bg-emerald-500/20 text-emerald-300 border-2 border-emerald-400 shadow-lg shadow-emerald-500/20 ring-4 ring-emerald-500/10 animate-pulse'
                                : 'bg-[#080b14] text-slate-500 border border-white/10'
                            }`}
                          >
                            <IconComp size={isCurrent ? 22 : 18} />
                          </div>

                          {/* Node description */}
                          <div className="pt-1.5 flex-1">
                            <div className="flex items-center gap-2">
                              <h4
                                className={`text-sm sm:text-base font-bold ${
                                  isCurrent
                                    ? 'text-emerald-300 font-extrabold'
                                    : isCompleted
                                    ? 'text-white'
                                    : 'text-slate-500'
                                }`}
                              >
                                {step.label}
                              </h4>
                              {isCurrent && (
                                <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-emerald-300 bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                                  <Sparkles size={10} /> Active Stage
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-slate-400 mt-0.5">
                              {isCompleted
                                ? 'Stage completed and logged by kitchen.'
                                : isCurrent
                                ? 'Chefs & dispatch are currently executing this task.'
                                : 'Upcoming stage in fulfilment pipeline.'}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Order Items Breakdown Card */}
            <div className="bg-[#0c101d] rounded-3xl border border-white/10 p-6 shadow-xl space-y-4">
              <h3 className="font-serif font-black text-lg text-white">
                Purchased Delicacies ({trackingData.order.items?.length || 0})
              </h3>

              <div className="divide-y divide-white/[0.08]">
                {trackingData.order.items?.map((item) => (
                  <div key={item.id} className="py-3 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-bold flex items-center justify-center text-[11px]">
                        {item.quantity}x
                      </span>
                      <div>
                        <p className="font-bold text-white">
                          {item.menu_item?.name || 'Chef Dish'}
                        </p>
                        {item.special_instructions && (
                          <p className="text-[10px] text-slate-400 italic">
                            {item.special_instructions}
                          </p>
                        )}
                      </div>
                    </div>
                    <span className="font-bold text-white">
                      ${item.subtotal.toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="pt-3 border-t border-white/10 flex justify-between items-center text-xs">
                <span className="text-slate-400 font-medium">Grand Total Paid</span>
                <span className="font-serif font-black text-base text-amber-400">
                  ${trackingData.order.total_amount.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Assistance / Support Hotline */}
            <div className="p-4 rounded-2xl bg-[#080b14] border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <Phone size={16} className="text-emerald-400" />
                <span>Need immediate culinary assistance or address updates?</span>
              </div>
              <a
                href="tel:18005737821"
                className="font-bold text-amber-300 hover:text-amber-200 transition-colors"
              >
                Call Chef Hotline: +1 (800) 573-7821
              </a>
            </div>
          </div>
        )}
      </main>

      <CustomerFooter />
    </div>
  );
};
