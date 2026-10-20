import React, { useState } from 'react';
import {
  X,
  MapPin,
  UtensilsCrossed,
  ShoppingBag,
  CreditCard,
  QrCode,
  DollarSign,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles
} from 'lucide-react';
import { CartItem, CustomerOrderPayload, User } from '../../../types';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  subtotal: number;
  tax: number;
  deliveryFee: number;
  discount: number;
  total: number;
  appliedCoupon: string | null;
  selectedBranchId: number;
  user: User | null;
  onSubmitOrder: (payload: CustomerOrderPayload) => Promise<void>;
  isSubmitting: boolean;
  orderError: string | null;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  subtotal,
  tax,
  deliveryFee,
  discount,
  total,
  appliedCoupon,
  selectedBranchId,
  user,
  onSubmitOrder,
  isSubmitting,
  orderError
}) => {
  const [orderType, setOrderType] = useState<'DELIVERY' | 'TAKEAWAY' | 'DINE_IN'>('DELIVERY');
  const [customerName, setCustomerName] = useState<string>(user?.full_name || '');
  const [customerEmail, setCustomerEmail] = useState<string>(user?.email || '');
  const [customerPhone, setCustomerPhone] = useState<string>(user?.phone || '+1 (555) 789-0123');
  const [deliveryAddress, setDeliveryAddress] = useState<string>('742 Evergreen Terrace, Apt 4B, San Francisco, CA');
  const [tableNumber, setTableNumber] = useState<string>('T-04');
  const [orderNotes, setOrderNotes] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<'CARD' | 'UPI' | 'CASH' | 'ONLINE'>('CARD');

  // Card details state
  const [cardNumber, setCardNumber] = useState<string>('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState<string>('12/28');
  const [cardCvc, setCardCvc] = useState<string>('888');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const orderPayload: CustomerOrderPayload = {
      branch_id: selectedBranchId,
      customer_name: customerName.trim() || 'Valued Guest',
      customer_email: customerEmail.trim() || undefined,
      customer_phone: customerPhone.trim() || undefined,
      order_type: orderType,
      delivery_address: orderType === 'DELIVERY' ? deliveryAddress.trim() : undefined,
      table_number: orderType === 'DINE_IN' ? tableNumber.trim() : undefined,
      items: items.map((it) => ({
        menu_item_id: it.menuItem.id,
        quantity: it.quantity,
        special_instructions: it.specialInstructions,
        spice_level: it.spiceLevel
      })),
      coupon_code: appliedCoupon || undefined,
      notes: orderNotes.trim() || undefined,
      payment_method: paymentMethod,
      idempotency_key: `IDEMP-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`
    };

    await onSubmitOrder(orderPayload);
  };

  const calculatedDeliveryFee = orderType === 'DELIVERY' ? deliveryFee : 0;
  const calculatedTotal = Math.max(0, subtotal + tax + calculatedDeliveryFee - discount);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-xl overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl rounded-3xl border border-slate-800 bg-slate-900/95 p-5 sm:p-8 shadow-2xl backdrop-blur-2xl my-8">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          disabled={isSubmitting}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X size={20} />
        </button>

        {/* Modal Header */}
        <div className="mb-6 space-y-1">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-[11px] font-bold text-emerald-300">
            <Sparkles size={13} />
            <span>KRESTA INSTANT CHECKOUT</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-white">
            Complete Your Feast
          </h2>
          <p className="text-xs text-slate-400">
            Validated server-side against live kitchen queue and recipe inventory.
          </p>
        </div>

        {orderError && (
          <div className="mb-5 rounded-2xl border border-red-500/40 bg-red-500/10 p-3.5 text-xs text-red-300 flex items-center gap-2.5">
            <AlertCircle size={16} className="shrink-0 text-red-400" />
            <span>{orderError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Step 1: Fulfillment Type */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              1. Fulfillment Method
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              <button
                type="button"
                onClick={() => setOrderType('DELIVERY')}
                className={`flex flex-col items-center justify-center gap-1.5 p-3 rounded-2xl border text-center transition-all ${
                  orderType === 'DELIVERY'
                    ? 'border-emerald-500 bg-emerald-500/15 text-emerald-300 font-bold shadow-lg shadow-emerald-500/10'
                    : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:border-slate-700 hover:text-white'
                }`}
              >
                <MapPin size={18} />
                <span className="text-xs">Doorstep Delivery</span>
              </button>

              <button
                type="button"
                onClick={() => setOrderType('TAKEAWAY')}
                className={`flex flex-col items-center justify-center gap-1.5 p-3 rounded-2xl border text-center transition-all ${
                  orderType === 'TAKEAWAY'
                    ? 'border-emerald-500 bg-emerald-500/15 text-emerald-300 font-bold shadow-lg shadow-emerald-500/10'
                    : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:border-slate-700 hover:text-white'
                }`}
              >
                <ShoppingBag size={18} />
                <span className="text-xs">Takeaway Pickup</span>
              </button>

              <button
                type="button"
                onClick={() => setOrderType('DINE_IN')}
                className={`flex flex-col items-center justify-center gap-1.5 p-3 rounded-2xl border text-center transition-all ${
                  orderType === 'DINE_IN'
                    ? 'border-emerald-500 bg-emerald-500/15 text-emerald-300 font-bold shadow-lg shadow-emerald-500/10'
                    : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:border-slate-700 hover:text-white'
                }`}
              >
                <UtensilsCrossed size={18} />
                <span className="text-xs">Dine-In Table</span>
              </button>
            </div>
          </div>

          {/* Conditional Address or Table Input */}
          {orderType === 'DELIVERY' && (
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300">
                Delivery Street Address & Apt
              </label>
              <input
                type="text"
                required
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                placeholder="Street address, building, apt, or landmark"
                className="w-full rounded-xl bg-slate-950 border border-slate-700/80 px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-brand-500 focus:outline-none"
              />
            </div>
          )}

          {orderType === 'DINE_IN' && (
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300">
                Select Your Dining Table
              </label>
              <select
                value={tableNumber}
                onChange={(e) => setTableNumber(e.target.value)}
                className="w-full rounded-xl bg-slate-950 border border-slate-700/80 px-3.5 py-2.5 text-xs text-white focus:border-brand-500 focus:outline-none"
              >
                {Array.from({ length: 15 }, (_, i) => `T-${String(i + 1).padStart(2, '0')}`).map((t) => (
                  <option key={t} value={t} className="bg-slate-900 text-white">
                    Table {t}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Step 2: Customer Contact Information */}
          <div className="space-y-3">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
              2. Contact Information
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <span className="text-[11px] text-slate-400 mb-1 block">Full Name *</span>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Elena Rostova"
                  className="w-full rounded-xl bg-slate-950 border border-slate-700/80 px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-brand-500 focus:outline-none"
                />
              </div>
              <div>
                <span className="text-[11px] text-slate-400 mb-1 block">Email (Receipt)</span>
                <input
                  type="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="elena@example.com"
                  className="w-full rounded-xl bg-slate-950 border border-slate-700/80 px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-brand-500 focus:outline-none"
                />
              </div>
              <div>
                <span className="text-[11px] text-slate-400 mb-1 block">Mobile Phone *</span>
                <input
                  type="tel"
                  required
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="+1 (555) 789-0123"
                  className="w-full rounded-xl bg-slate-950 border border-slate-700/80 px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-brand-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Special Cooking & Delivery Instructions */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">
              Order Notes & Special Instructions (Optional)
            </label>
            <input
              type="text"
              value={orderNotes}
              onChange={(e) => setOrderNotes(e.target.value)}
              placeholder="e.g. Ring doorbell, extra spicy, sauce on the side, allergies..."
              className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:border-brand-500 focus:outline-none"
            />
          </div>

          {/* Step 3: Payment Method Selection */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              3. Payment Method
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <button
                type="button"
                onClick={() => setPaymentMethod('CARD')}
                className={`p-3 rounded-2xl border text-left transition-all flex items-center gap-2.5 ${
                  paymentMethod === 'CARD'
                    ? 'border-emerald-500 bg-emerald-500/15 text-white shadow-md'
                    : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:text-white'
                }`}
              >
                <CreditCard size={18} className="text-emerald-400" />
                <div className="flex flex-col">
                  <span className="text-xs font-bold">Credit / Debit Card</span>
                  <span className="text-[10px] text-slate-400">Encrypted instant checkout</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('UPI')}
                className={`p-3 rounded-2xl border text-left transition-all flex items-center gap-2.5 ${
                  paymentMethod === 'UPI'
                    ? 'border-emerald-500 bg-emerald-500/15 text-white shadow-md'
                    : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:text-white'
                }`}
              >
                <QrCode size={18} className="text-amber-400" />
                <div className="flex flex-col">
                  <span className="text-xs font-bold">Instant UPI / QR</span>
                  <span className="text-[10px] text-slate-400">Zero surcharge mobile pay</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('CASH')}
                className={`p-3 rounded-2xl border text-left transition-all flex items-center gap-2.5 ${
                  paymentMethod === 'CASH'
                    ? 'border-emerald-500 bg-emerald-500/15 text-white shadow-md'
                    : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:text-white'
                }`}
              >
                <DollarSign size={18} className="text-blue-400" />
                <div className="flex flex-col">
                  <span className="text-xs font-bold">Cash on Delivery</span>
                  <span className="text-[10px] text-slate-400">Pay courier or counter</span>
                </div>
              </button>
            </div>

            {/* Simulated Card / UPI Inputs */}
            {paymentMethod === 'CARD' && (
              <div className="mt-3 p-3.5 rounded-2xl bg-slate-950 border border-slate-800/80 grid grid-cols-3 gap-2.5 text-xs">
                <div className="col-span-3 sm:col-span-2">
                  <span className="text-[10px] text-slate-400 mb-1 block">Card Number</span>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full rounded-xl bg-slate-900 border border-slate-700 px-3 py-1.5 font-mono text-white text-xs"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 mb-1 block">Expiry / CVV</span>
                  <div className="flex gap-1.5">
                    <input
                      type="text"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      className="w-1/2 rounded-xl bg-slate-900 border border-slate-700 px-2 py-1.5 font-mono text-white text-xs text-center"
                    />
                    <input
                      type="text"
                      value={cardCvc}
                      onChange={(e) => setCardCvc(e.target.value)}
                      className="w-1/2 rounded-xl bg-slate-900 border border-slate-700 px-2 py-1.5 font-mono text-white text-xs text-center"
                    />
                  </div>
                </div>
              </div>
            )}

            {paymentMethod === 'UPI' && (
              <div className="mt-3 p-3.5 rounded-2xl bg-slate-950 border border-slate-800/80 flex items-center justify-between gap-4 text-xs">
                <div>
                  <span className="font-bold text-white">Direct Merchant UPI ID:</span>
                  <p className="font-mono text-amber-300 text-xs mt-0.5">kresta.gourmet@icici</p>
                  <p className="text-[10px] text-slate-400">
                    Scan via Google Pay, PhonePe, or Apple Pay upon confirmation.
                  </p>
                </div>
                <div className="h-12 w-12 rounded-xl bg-white p-1 flex items-center justify-center shrink-0">
                  <QrCode size={40} className="text-slate-950" />
                </div>
              </div>
            )}
          </div>

          {/* Order Summary & Final Total Bar */}
          <div className="rounded-2xl bg-slate-950 p-4 border border-slate-800 space-y-2 text-xs">
            <div className="flex justify-between text-slate-300">
              <span>Items Total ({items.reduce((s, it) => s + it.quantity, 0)} items)</span>
              <span className="font-mono font-bold text-white">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Taxes (5%)</span>
              <span className="font-mono text-white">${tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Delivery Charges</span>
              <span className="font-mono text-white">
                {calculatedDeliveryFee === 0 ? (
                  <span className="text-emerald-400 font-bold uppercase">FREE</span>
                ) : (
                  `$${calculatedDeliveryFee.toFixed(2)}`
                )}
              </span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-emerald-400 font-medium">
                <span>Coupon Discount ({appliedCoupon})</span>
                <span className="font-mono">-${discount.toFixed(2)}</span>
              </div>
            )}
            <div className="pt-2.5 border-t border-slate-800 flex justify-between items-center text-sm font-extrabold text-white">
              <span className="font-serif">Total Payable</span>
              <span className="text-xl font-mono text-emerald-400">${calculatedTotal.toFixed(2)}</span>
            </div>
          </div>

          {/* Submission Button */}
          <button
            type="submit"
            disabled={isSubmitting || items.length === 0}
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 px-6 py-4 text-sm font-black text-slate-950 shadow-xl shadow-emerald-500/25 hover:from-emerald-400 hover:to-emerald-500 disabled:opacity-50 transition-all active:scale-[0.99]"
          >
            {isSubmitting ? (
              <span className="animate-pulse">Submitting to Kitchen Dispatch...</span>
            ) : (
              <>
                <ShieldCheck size={18} />
                <span>Authorize & Place Order (${calculatedTotal.toFixed(2)})</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

