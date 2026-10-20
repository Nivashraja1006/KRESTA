import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  ArrowLeft,
  Trash2,
  Plus,
  Minus,
  TicketPercent,
  CheckCircle2,
  AlertCircle,
  Truck,
  ShieldCheck,
  ArrowRight,
  UtensilsCrossed,
  ChefHat
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { CustomerNavbar } from '../../components/customer/CustomerNavbar';
import { CustomerFooter } from '../../components/customer/CustomerFooter';

export const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    cartItems,
    updateQuantity,
    removeFromCart,
    clearCart,
    totalCartCount,
    subtotal,
    tax,
    deliveryFee,
    discount,
    total,
    couponCode,
    appliedCouponMessage,
    applyCoupon,
    removeCoupon,
    orderType,
    setOrderType,
    isValidating
  } = useCart();

  const [inputCoupon, setInputCoupon] = useState('');
  const [couponError, setCouponError] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);

  const freeDeliveryThreshold = 50.0;
  const progressToFreeDelivery = Math.min(100, Math.round((subtotal / freeDeliveryThreshold) * 100));
  const amountNeededForFree = Math.max(0, Math.round((freeDeliveryThreshold - subtotal) * 100) / 100);

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCoupon.trim()) return;
    setCouponLoading(true);
    setCouponError('');
    const res = await applyCoupon(inputCoupon);
    if (!res.success) {
      setCouponError(res.message);
    } else {
      setInputCoupon('');
    }
    setCouponLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#05070d] text-slate-100 font-sans selection:bg-amber-500 selection:text-slate-950">
      <CustomerNavbar />

      <main className="flex-1 max-w-[1720px] mx-auto w-full px-4 sm:px-6 lg:px-10 xl:px-12 py-8">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between mb-6">
          <Link
            to="/order"
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-amber-300 transition-colors"
          >
            <ArrowLeft size={16} />
            <span>Continue Browsing Menu</span>
          </Link>
          <span className="text-xs font-semibold text-slate-400">
            Step 1 of 3: Cart Review
          </span>
        </div>

        {cartItems.length === 0 ? (
          /* Empty Cart State */
          <div className="bg-[#0c101d] rounded-3xl border border-white/10 p-12 text-center max-w-lg mx-auto shadow-2xl my-8">
            <div className="w-20 h-20 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto mb-4 border border-emerald-500/20">
              <ShoppingBag size={36} />
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight font-serif">
              Your Feast Awaits
            </h2>
            <p className="text-sm text-slate-400 mt-2 mb-6">
              You haven't added any delicacies yet. Explore our royal biryanis, wood-fired pizzas, and chef specials.
            </p>
            <Link
              to="/order"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-slate-950 font-bold text-sm shadow-md transition-all active:scale-95"
            >
              <UtensilsCrossed size={16} />
              <span>Explore Restaurant Menu</span>
            </Link>
          </div>
        ) : (
          /* Populated Cart Layout */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left 8 Columns: Cart Items and Fulfilment */}
            <div className="lg:col-span-8 space-y-6">
              {/* Free Delivery Bar (Delivery only) */}
              {orderType === 'DELIVERY' && (
                <div className="bg-[#0c101d] rounded-2xl border border-white/10 p-4 shadow-md">
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="font-bold flex items-center gap-1.5 text-slate-200">
                      <Truck size={14} className="text-emerald-400" />
                      {amountNeededForFree > 0 ? (
                        <span>
                          Add <strong className="text-amber-300 font-mono">${amountNeededForFree.toFixed(2)}</strong> more for <strong className="text-emerald-400">FREE Doorstep Delivery</strong>!
                        </span>
                      ) : (
                        <span className="text-emerald-400 font-bold flex items-center gap-1">
                          <CheckCircle2 size={13} /> You unlocked FREE Delivery!
                        </span>
                      )}
                    </span>
                    <span className="text-slate-400 font-semibold">{progressToFreeDelivery}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-amber-400 to-emerald-400 rounded-full transition-all duration-500"
                      style={{ width: `${progressToFreeDelivery}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Fulfilment Method Pill Selector */}
              <div className="bg-[#0c101d] rounded-2xl border border-white/10 p-4 shadow-md flex items-center justify-between gap-2 flex-wrap">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Fulfilment Method:
                </span>
                <div className="flex items-center gap-1.5 bg-[#080b14] p-1 rounded-xl border border-white/10">
                  {(['DELIVERY', 'TAKEAWAY', 'DINE_IN'] as const).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setOrderType(type)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        orderType === type
                          ? 'bg-emerald-600 text-white shadow-sm'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {type === 'DELIVERY' ? 'Doorstep Delivery' : type === 'TAKEAWAY' ? 'Takeaway Pickup' : 'Dine-In Table'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Items Card List */}
              <div className="bg-[#0c101d] rounded-3xl border border-white/10 shadow-md overflow-hidden">
                <div className="p-4 sm:p-6 border-b border-white/[0.08] flex items-center justify-between">
                  <h3 className="font-serif font-black text-lg text-white">
                    Order Items ({totalCartCount})
                  </h3>
                  <button
                    onClick={clearCart}
                    className="text-xs font-semibold text-rose-400 hover:text-rose-300 flex items-center gap-1 transition-colors"
                  >
                    <Trash2 size={13} /> Clear Entire Cart
                  </button>
                </div>

                <div className="divide-y divide-white/[0.08]">
                  {cartItems.map((item, idx) => {
                    const itemSubtotal = Math.round(item.menuItem.price * item.quantity * 100) / 100;
                    return (
                      <div
                        key={`${item.menuItem.id}-${item.spiceLevel || 'default'}-${idx}`}
                        className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-white/[0.02] transition-colors"
                      >
                        {/* Item Photo & Details */}
                        <div className="flex items-center gap-4">
                          <img
                            src={item.menuItem.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300&auto=format&fit=crop&q=80'}
                            alt={item.menuItem.name}
                            className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border border-white/10 flex-shrink-0"
                          />
                          <div>
                            <h4 className="font-bold text-white text-sm sm:text-base">
                              {item.menuItem.name}
                            </h4>
                            <div className="flex items-center gap-2 mt-1 text-xs text-slate-400 flex-wrap">
                              {item.spiceLevel && (
                                <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-amber-950/60 text-amber-300 text-[11px] font-semibold border border-amber-500/30">
                                  🌶️ {item.spiceLevel}
                                </span>
                              )}
                              <span>${item.menuItem.price.toFixed(2)} each</span>
                            </div>
                            {item.specialInstructions && (
                              <p className="text-[11px] text-slate-400 italic mt-1 max-w-md">
                                Note: {item.specialInstructions}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Quantity and Price */}
                        <div className="flex items-center justify-between sm:justify-end gap-5">
                          {/* Stepper */}
                          <div className="flex items-center border border-white/15 bg-[#080b14] rounded-xl p-0.5 shadow-sm">
                            <button
                              onClick={() => updateQuantity(item.menuItem.id, -1, item.spiceLevel)}
                              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/[0.08] transition-colors"
                              aria-label="Decrease quantity"
                            >
                              <Minus size={14} />
                            </button>
                            <span className="w-8 text-center font-bold text-xs text-white">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.menuItem.id, 1, item.spiceLevel)}
                              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/[0.08] transition-colors"
                              aria-label="Increase quantity"
                            >
                              <Plus size={14} />
                            </button>
                          </div>

                          {/* Item Subtotal */}
                          <span className="font-black text-amber-300 text-sm sm:text-base w-16 text-right font-serif">
                            ${itemSubtotal.toFixed(2)}
                          </span>

                          {/* Remove button */}
                          <button
                            onClick={() => removeFromCart(item.menuItem.id, item.spiceLevel)}
                            className="p-1.5 text-slate-500 hover:text-rose-400 transition-colors"
                            aria-label="Remove item"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Promo Code Input Card */}
              <div className="bg-[#0c101d] rounded-2xl border border-white/10 p-4 sm:p-5 shadow-md space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                    <TicketPercent size={15} className="text-amber-400" />
                    Apply Restaurant Promo Coupon
                  </span>
                  <div className="flex items-center gap-2">
                    <span
                      onClick={() => setInputCoupon('KRESTA10')}
                      className="cursor-pointer text-[10px] font-bold text-amber-300 bg-amber-950/60 hover:bg-amber-950 px-2 py-0.5 rounded-full border border-amber-500/30"
                    >
                      KRESTA10 (10% off)
                    </span>
                    <span
                      onClick={() => setInputCoupon('WELCOME50')}
                      className="cursor-pointer text-[10px] font-bold text-emerald-300 bg-emerald-950/60 hover:bg-emerald-950 px-2 py-0.5 rounded-full border border-emerald-500/30"
                    >
                      WELCOME50 ($5 off)
                    </span>
                  </div>
                </div>

                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter code (e.g. KRESTA10)"
                    value={inputCoupon}
                    onChange={(e) => {
                      setInputCoupon(e.target.value.toUpperCase());
                      setCouponError('');
                    }}
                    className="flex-1 px-3.5 py-2 rounded-xl border border-white/10 bg-[#080b14] text-xs text-white font-bold uppercase tracking-wider placeholder:text-slate-500 focus:outline-none focus:border-amber-400/60"
                  />
                  <button
                    type="submit"
                    disabled={couponLoading || !inputCoupon.trim()}
                    className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors disabled:opacity-50"
                  >
                    {couponLoading ? 'Checking...' : 'Apply Code'}
                  </button>
                </form>

                {couponError && (
                  <p className="text-xs text-rose-400 font-medium flex items-center gap-1">
                    <AlertCircle size={13} /> {couponError}
                  </p>
                )}

                {appliedCouponMessage && (
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-950/50 border border-emerald-500/30 text-xs font-semibold text-emerald-300">
                    <span className="flex items-center gap-1.5">
                      <CheckCircle2 size={14} className="text-emerald-400" />
                      {appliedCouponMessage}
                    </span>
                    <button
                      onClick={removeCoupon}
                      className="text-xs text-slate-400 hover:text-rose-400 underline"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Right 4 Columns: Sticky Summary Card */}
            <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-4">
              <div className="bg-[#0c101d] rounded-3xl border border-white/10 p-6 shadow-xl space-y-5">
                <h3 className="font-serif font-black text-xl text-white border-b border-white/[0.08] pb-3">
                  Bill Summary
                </h3>

                <div className="space-y-3 text-xs text-slate-300">
                  <div className="flex justify-between">
                    <span>Items Subtotal</span>
                    <span className="font-bold text-white font-mono">${subtotal.toFixed(2)}</span>
                  </div>

                  {discount > 0 && (
                    <div className="flex justify-between text-emerald-400 font-semibold">
                      <span>Promo Discount ({couponCode})</span>
                      <span className="font-mono">-${discount.toFixed(2)}</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span>Estimated Taxes (5%)</span>
                    <span className="font-bold text-white font-mono">${tax.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>
                      Delivery Fee {orderType !== 'DELIVERY' && '(Pickup)'}
                    </span>
                    <span className="font-bold text-white font-mono">
                      {deliveryFee === 0 ? (
                        <strong className="text-emerald-400">FREE</strong>
                      ) : (
                        `$${deliveryFee.toFixed(2)}`
                      )}
                    </span>
                  </div>

                  <div className="pt-3 border-t border-white/[0.08] flex justify-between items-baseline">
                    <div>
                      <p className="text-base font-black text-white font-serif">Grand Total</p>
                      <p className="text-[10px] text-slate-500">All taxes and fees verified by server</p>
                    </div>
                    <span className="text-2xl font-black text-emerald-400 font-serif">
                      ${total.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Checkout CTA */}
                <button
                  onClick={() => navigate('/order/checkout')}
                  disabled={isValidating || cartItems.length === 0}
                  className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-slate-950 font-black text-sm shadow-md shadow-emerald-950/50 transition-all transform active:scale-[0.98] disabled:opacity-50"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight size={16} />
                </button>

                <div className="pt-2 text-[11px] text-slate-400 space-y-1.5 border-t border-white/[0.08]">
                  <p className="flex items-center gap-1.5">
                    <ShieldCheck size={13} className="text-emerald-400 flex-shrink-0" />
                    <span>Server-validated menu pricing & recipes</span>
                  </p>
                  <p className="flex items-center gap-1.5">
                    <ChefHat size={13} className="text-emerald-400 flex-shrink-0" />
                    <span>Real-time kitchen order dispatch</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <CustomerFooter />
    </div>
  );
};
