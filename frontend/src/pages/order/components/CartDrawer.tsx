import React, { useState } from 'react';
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  Tag,
  CheckCircle2,
  X,
  Truck,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { CartItem, CartValidation } from '../../../types';

interface CartDrawerProps {
  items: CartItem[];
  subtotal: number;
  tax: number;
  deliveryFee: number;
  discount: number;
  total: number;
  appliedCoupon: string | null;
  couponMessage: string | null;
  couponError: string | null;
  onApplyCoupon: (code: string) => void;
  onRemoveCoupon: () => void;
  onUpdateQuantity: (itemId: number, delta: number) => void;
  onRemoveItem: (itemId: number) => void;
  onClearCart: () => void;
  onCheckout: () => void;
  onCloseMobile?: () => void;
  isMobileDrawer?: boolean;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  items,
  subtotal,
  tax,
  deliveryFee,
  discount,
  total,
  appliedCoupon,
  couponMessage,
  couponError,
  onApplyCoupon,
  onRemoveCoupon,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onCheckout,
  onCloseMobile,
  isMobileDrawer = false
}) => {
  const [couponInput, setCouponInput] = useState<string>('');

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    if (couponInput.trim()) {
      onApplyCoupon(couponInput.trim());
      setCouponInput('');
    }
  };

  const freeDeliveryThreshold = 50.0;
  const amountToFreeDelivery = Math.max(0, freeDeliveryThreshold - subtotal);
  const freeDeliveryProgress = Math.min(100, (subtotal / freeDeliveryThreshold) * 100);

  const content = (
    <div className="flex flex-col h-full justify-between">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <ShoppingBag size={18} />
            </div>
            <div>
              <h3 className="font-serif text-base font-bold text-white">Your Feast Cart</h3>
              <p className="text-[11px] text-slate-400">
                {items.length === 0 ? 'Cart is currently empty' : `${items.length} unique ${items.length === 1 ? 'dish' : 'dishes'}`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {items.length > 0 && (
              <button
                type="button"
                onClick={onClearCart}
                className="text-xs text-slate-400 hover:text-red-400 transition-colors p-1"
                title="Clear all cart items"
              >
                Clear
              </button>
            )}
            {isMobileDrawer && onCloseMobile && (
              <button
                type="button"
                onClick={onCloseMobile}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X size={18} />
              </button>
            )}
          </div>
        </div>

        {/* Free Delivery Bar */}
        {subtotal > 0 && (
          <div className="mt-3.5 p-3 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-1.5 text-slate-300 font-medium">
                <Truck size={13} className="text-amber-400" />
                {amountToFreeDelivery === 0 ? (
                  <span className="text-emerald-400 font-bold">Free Delivery Unlocked!</span>
                ) : (
                  <span>
                    Add <strong className="text-amber-300 font-mono">${amountToFreeDelivery.toFixed(2)}</strong> for Free Delivery
                  </span>
                )}
              </span>
              <span className="font-mono text-[10px] text-slate-400">
                {freeDeliveryProgress.toFixed(0)}%
              </span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
              <div
                style={{ width: `${freeDeliveryProgress}%` }}
                className="h-full bg-gradient-to-r from-amber-400 to-emerald-400 rounded-full transition-all duration-300"
              />
            </div>
          </div>
        )}
      </div>

      {/* Cart Items List */}
      <div className="flex-1 overflow-y-auto py-4 space-y-3.5 my-2 max-h-[380px] scrollbar-thin">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center space-y-3">
            <div className="h-16 w-16 rounded-2xl bg-slate-800/40 border border-slate-800 flex items-center justify-center text-slate-500">
              <ShoppingBag size={28} />
            </div>
            <p className="text-sm font-semibold text-slate-300">Your basket is waiting</p>
            <p className="text-xs text-slate-500 max-w-xs">
              Explore our chef's royal menu cards and add your favorite dishes to begin.
            </p>
          </div>
        ) : (
          items.map((cartItem) => {
            const item = cartItem.menuItem;
            const itemTotal = (item.price * cartItem.quantity).toFixed(2);
            return (
              <div
                key={item.id}
                className="flex items-start justify-between gap-3 p-3 rounded-2xl bg-slate-950/80 border border-slate-800/80 hover:border-slate-700/80 transition-all group"
              >
                <img
                  src={item.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=120&auto=format&fit=crop&q=80'}
                  alt={item.name}
                  className="h-12 w-12 rounded-xl object-cover border border-slate-800 shrink-0 mt-0.5"
                />

                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-white truncate group-hover:text-amber-300 transition-colors">
                    {item.name}
                  </h4>
                  <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-400 mt-0.5">
                    <span>${item.price.toFixed(2)} ea</span>
                    {cartItem.spiceLevel && (
                      <>
                        <span>&bull;</span>
                        <span className="text-amber-300">{cartItem.spiceLevel}</span>
                      </>
                    )}
                  </div>
                  {cartItem.specialInstructions && (
                    <p className="text-[10px] text-slate-500 truncate italic">
                      "{cartItem.specialInstructions}"
                    </p>
                  )}
                </div>

                {/* Quantity and Line Total */}
                <div className="flex flex-col items-end gap-1.5 shrink-0">
                  <span className="text-xs font-bold text-white font-mono">
                    ${itemTotal}
                  </span>
                  <div className="flex items-center rounded-lg bg-slate-900 border border-slate-800 p-0.5 shadow-inner">
                    <button
                      type="button"
                      onClick={() => onUpdateQuantity(item.id, -1)}
                      className="h-5 w-5 flex items-center justify-center rounded text-slate-400 hover:text-white hover:bg-slate-800"
                      aria-label="Decrease quantity"
                    >
                      <Minus size={11} />
                    </button>
                    <span className="w-5 text-center text-xs font-mono font-bold text-amber-300">
                      {cartItem.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => onUpdateQuantity(item.id, 1)}
                      className="h-5 w-5 flex items-center justify-center rounded text-slate-400 hover:text-white hover:bg-slate-800"
                      aria-label="Increase quantity"
                    >
                      <Plus size={11} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Bill Breakdown & Coupon Footer */}
      {items.length > 0 && (
        <div className="space-y-3.5 pt-3 border-t border-slate-800">
          {/* Coupon Code Box */}
          <div>
            {appliedCoupon ? (
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={15} className="text-emerald-400 shrink-0" />
                  <div>
                    <span className="font-mono font-bold text-emerald-300 uppercase tracking-wide">
                      {appliedCoupon}
                    </span>
                    {couponMessage && (
                      <p className="text-[10px] text-emerald-400/80">{couponMessage}</p>
                    )}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={onRemoveCoupon}
                  className="text-[11px] font-semibold text-slate-400 hover:text-red-400 underline ml-2"
                >
                  Remove
                </button>
              </div>
            ) : (
              <form onSubmit={handleApply} className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="absolute left-3 top-2.5 text-slate-500" size={14} />
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                    placeholder="Enter coupon (e.g. KRESTA10)"
                    className="w-full rounded-xl bg-slate-950/80 border border-slate-800 pl-8 pr-3 py-2 text-xs font-mono uppercase text-white placeholder-slate-500 focus:border-brand-500 focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  disabled={!couponInput.trim()}
                  className="rounded-xl border border-amber-500/40 bg-amber-500/10 hover:bg-amber-500/20 px-3.5 py-2 text-xs font-bold text-amber-300 disabled:opacity-40 transition-colors"
                >
                  Apply
                </button>
              </form>
            )}
            {couponError && (
              <div className="flex items-center gap-1.5 mt-1.5 text-[11px] text-red-400">
                <AlertCircle size={12} className="shrink-0" />
                <span>{couponError}</span>
              </div>
            )}
          </div>

          {/* Breakdown Lines */}
          <div className="space-y-1.5 text-xs text-slate-300">
            <div className="flex items-center justify-between">
              <span>Subtotal</span>
              <span className="font-mono font-medium text-white">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Estimated Taxes (5%)</span>
              <span className="font-mono text-white">${tax.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Doorstep Delivery</span>
              <span className="font-mono text-white">
                {deliveryFee === 0 ? (
                  <span className="text-emerald-400 font-bold uppercase">FREE</span>
                ) : (
                  `$${deliveryFee.toFixed(2)}`
                )}
              </span>
            </div>
            {discount > 0 && (
              <div className="flex items-center justify-between text-emerald-400 font-medium">
                <span>Coupon Discount</span>
                <span className="font-mono">-${discount.toFixed(2)}</span>
              </div>
            )}
            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-sm font-extrabold text-white">
              <span className="font-serif">Final Total</span>
              <span className="text-lg font-mono text-emerald-400">${total.toFixed(2)}</span>
            </div>
          </div>

          {/* Checkout CTA */}
          <button
            type="button"
            onClick={onCheckout}
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 px-5 py-3.5 text-sm font-black text-slate-950 shadow-xl shadow-emerald-500/25 hover:from-emerald-400 hover:to-emerald-500 transition-all active:scale-[0.98]"
          >
            <span>Proceed to Checkout</span>
            <ArrowRight size={16} />
          </button>
        </div>
      )}
    </div>
  );

  if (isMobileDrawer) {
    return content;
  }

  // Desktop Sticky Sidebar Card
  return (
    <div className="sticky top-28 rounded-3xl border border-slate-800 bg-slate-900/90 p-5 shadow-2xl backdrop-blur-xl">
      {content}
    </div>
  );
};

