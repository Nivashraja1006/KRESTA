import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  CheckCircle2,
  Clock,
  MapPin,
  UtensilsCrossed,
  Truck,
  CreditCard,
  ArrowRight,
  ShoppingBag,
  Sparkles,
  ShieldCheck,
  Receipt
} from 'lucide-react';
import apiClient from '../../api/client';
import { OrderTrackingData } from '../../types';
import { CustomerNavbar } from '../../components/customer/CustomerNavbar';
import { CustomerFooter } from '../../components/customer/CustomerFooter';

export const OrderConfirmationPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();

  const [trackingData, setTrackingData] = useState<OrderTrackingData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!orderId) return;
      setIsLoading(true);
      try {
        const resp = await apiClient.get<OrderTrackingData>(`/orders/customer/track/${orderId}`);
        setTrackingData(resp.data);
      } catch (err: any) {
        console.error('Failed to load confirmed order:', err);
        setError('Order details could not be retrieved.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrderDetails();
  }, [orderId]);

  return (
    <div className="min-h-screen flex flex-col bg-[#05070d] text-slate-100 font-sans selection:bg-amber-500 selection:text-slate-950">
      <CustomerNavbar />

      <main className="flex-1 max-w-3xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10">
        {isLoading ? (
          <div className="bg-[#0c101d] rounded-3xl p-12 text-center border border-white/10 shadow-xl animate-pulse space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 mx-auto border border-emerald-500/30" />
            <div className="h-6 bg-white/10 rounded w-1/2 mx-auto" />
            <div className="h-4 bg-white/5 rounded w-3/4 mx-auto" />
          </div>
        ) : error || !trackingData ? (
          <div className="bg-[#0c101d] rounded-3xl p-8 text-center border border-white/10 shadow-xl space-y-4">
            <p className="text-rose-400 font-bold text-sm">{error || 'Order not found.'}</p>
            <Link
              to="/order"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-colors"
            >
              Back to Menu
            </Link>
          </div>
        ) : (
          <div className="bg-[#0c101d] rounded-3xl border border-white/10 p-6 sm:p-10 shadow-xl space-y-8 animate-in fade-in duration-300">
            {/* Success Header */}
            <div className="text-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-emerald-500/15 text-emerald-400 flex items-center justify-center mx-auto border-2 border-emerald-500/40 shadow-lg shadow-emerald-950/40">
                <CheckCircle2 size={36} />
              </div>

              <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 text-xs font-black uppercase tracking-wider mb-2">
                  <Sparkles size={12} /> Confirmed by KRESTA Kitchen
                </span>
                <h1 className="font-serif font-black text-2xl sm:text-3xl text-white tracking-tight">
                  Thank You for Your Order!
                </h1>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">
                  Your meal is registered in our live Kitchen Display System. Chefs are preparing your recipe.
                </p>
              </div>

              {/* Order Reference Badge */}
              <div className="inline-flex items-center gap-2 p-2 px-4 rounded-xl bg-[#080b14] border border-white/10 text-xs font-mono font-bold text-amber-300">
                <Receipt size={14} className="text-slate-400" />
                <span>Order Reference: {trackingData.order.order_number}</span>
              </div>
            </div>

            {/* Estimated Time Card */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-5 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 text-xs">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 shadow-xs">
                  <Clock size={20} />
                </div>
                <div>
                  <p className="text-slate-400 font-medium">Estimated Delivery Time</p>
                  <p className="text-lg font-black text-emerald-300 font-serif">
                    {trackingData.estimated_time_minutes} Minutes
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 sm:border-l sm:border-white/10 sm:pl-4">
                <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 shadow-xs">
                  <Truck size={20} />
                </div>
                <div>
                  <p className="text-slate-400 font-medium">Fulfilment Method</p>
                  <p className="text-sm font-bold text-white">
                    {trackingData.fulfillment_label}
                  </p>
                </div>
              </div>
            </div>

            {/* Ordered Items Table */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Purchased Dishes ({trackingData.order.items?.length || 0})
              </h3>
              <div className="divide-y divide-white/[0.08] border border-white/10 rounded-2xl overflow-hidden bg-[#080b14]">
                {trackingData.order.items?.map((item) => (
                  <div
                    key={item.id}
                    className="p-3.5 sm:p-4 flex items-center justify-between text-xs hover:bg-white/[0.02] transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-bold flex items-center justify-center text-[11px]">
                        {item.quantity}x
                      </span>
                      <div>
                        <p className="font-bold text-white">
                          {item.menu_item?.name || 'Artisanal Dish'}
                        </p>
                        {item.special_instructions && (
                          <p className="text-[10px] text-slate-400 italic">
                            {item.special_instructions}
                          </p>
                        )}
                      </div>
                    </div>
                    <span className="font-black text-white">
                      ${item.subtotal.toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Financial Summary */}
            <div className="p-4 rounded-2xl bg-[#080b14] border border-white/10 space-y-2 text-xs text-slate-400">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-bold text-white">${trackingData.order.subtotal.toFixed(2)}</span>
              </div>
              {trackingData.order.discount > 0 && (
                <div className="flex justify-between text-emerald-400 font-semibold">
                  <span>Discount Applied</span>
                  <span>-${trackingData.order.discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Taxes & Fees</span>
                <span className="font-bold text-white">${trackingData.order.tax.toFixed(2)}</span>
              </div>
              <div className="pt-2 border-t border-white/10 flex justify-between font-bold text-sm text-white">
                <span>Total Paid</span>
                <span className="text-amber-400 font-serif font-black text-base">
                  ${trackingData.order.total_amount.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Actions: Track Live Order & Continue Shopping */}
            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <Link
                to={`/order/track/${trackingData.order.order_number}`}
                className="flex-1 flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-slate-950 font-black text-sm shadow-xl shadow-emerald-900/30 transition-all"
              >
                <span>Track Live Order Status</span>
                <ArrowRight size={16} />
              </Link>

              <Link
                to="/order"
                className="px-6 py-3.5 rounded-2xl border border-white/15 bg-[#080b14] text-slate-300 hover:bg-white/5 font-bold text-sm text-center transition-colors"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        )}
      </main>

      <CustomerFooter />
    </div>
  );
};

