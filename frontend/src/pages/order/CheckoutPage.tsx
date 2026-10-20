import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Check,
  CheckCircle2,
  AlertCircle,
  Truck,
  Store,
  Utensils,
  CreditCard,
  QrCode,
  Banknote,
  ShieldCheck,
  Lock,
  Sparkles,
  ShoppingBag,
  ChevronRight,
  Clock,
  User,
  Phone,
  Mail,
  FileText
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import apiClient from '../../api/client';
import { CustomerNavbar } from '../../components/customer/CustomerNavbar';
import { CustomerFooter } from '../../components/customer/CustomerFooter';

export const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    cartItems,
    clearCart,
    subtotal,
    tax,
    deliveryFee,
    discount,
    total,
    couponCode,
    orderType,
    setOrderType,
    deliveryAddress,
    setDeliveryAddress,
    tableNumber,
    setTableNumber,
    orderNotes,
    setOrderNotes
  } = useCart();

  // Redirect if cart is empty
  useEffect(() => {
    if (cartItems.length === 0) {
      navigate('/order');
    }
  }, [cartItems, navigate]);

  // Step Management: 1: Fulfilment, 2: Customer Details, 3: Payment & Review
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  // STEP 1 State: Fulfilment
  const [street, setStreet] = useState('');
  const [apt, setApt] = useState('');
  const [city, setCity] = useState('San Francisco');
  const [postalCode, setPostalCode] = useState('94105');
  const [deliveryInstructions, setDeliveryInstructions] = useState('Ring the bell upon arrival');
  const [pickupSlot, setPickupSlot] = useState('Standard (15-20 mins)');

  // STEP 2 State: Customer Details
  const [fullName, setFullName] = useState(user?.full_name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState('+1 (555) 019-2831');
  const [kitchenNotes, setKitchenNotes] = useState('');

  // STEP 3 State: Payment
  const [paymentMethod, setPaymentMethod] = useState<'CARD' | 'UPI' | 'CASH'>('CARD');
  const [cardHolderName, setCardHolderName] = useState(user?.full_name || 'Valued Guest');
  const [upiId, setUpiId] = useState('elena@okhdfcbank');

  // Submission & Validation States
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState('');

  // Auto-fill from user profile when logged in
  useEffect(() => {
    if (user) {
      if (!fullName) setFullName(user.full_name);
      if (!email) setEmail(user.email);
    }
  }, [user]);

  // Validate Step 1
  const validateStep1 = () => {
    const errors: Record<string, string> = {};
    if (orderType === 'DELIVERY') {
      if (!street.trim()) errors.street = 'Street address is required for delivery.';
      if (!city.trim()) errors.city = 'City is required.';
      if (!postalCode.trim()) errors.postalCode = 'Postal code is required.';
    }
    if (orderType === 'DINE_IN') {
      if (!tableNumber.trim()) errors.tableNumber = 'Please specify your table number.';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Validate Step 2
  const validateStep2 = () => {
    const errors: Record<string, string> = {};
    if (!fullName.trim()) errors.fullName = 'Please enter your full name.';
    if (!email.trim() || !email.includes('@')) errors.email = 'Valid email required for receipt & tracking.';
    if (!phone.trim() || phone.length < 8) errors.phone = 'Valid contact phone number is required.';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Navigation handlers
  const handleProceedToStep2 = () => {
    if (validateStep1()) {
      // Assemble delivery address string
      if (orderType === 'DELIVERY') {
        const fullAddr = `${street}${apt ? `, Apt/Ste ${apt}` : ''}, ${city}, ${postalCode}`;
        setDeliveryAddress(fullAddr);
      }
      setCurrentStep(2);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleProceedToStep3 = () => {
    if (validateStep2()) {
      setCurrentStep(3);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Final Order Submission
  const handlePlaceOrder = async () => {
    setIsSubmitting(true);
    setApiError('');

    try {
      const fullAddressString =
        orderType === 'DELIVERY'
          ? `${street}${apt ? `, Apt ${apt}` : ''}, ${city}, ${postalCode} (${deliveryInstructions})`
          : undefined;

      const payload = {
        branch_id: 1,
        customer_name: fullName.trim(),
        customer_email: email.trim(),
        customer_phone: phone.trim(),
        order_type: orderType,
        delivery_address: fullAddressString,
        table_number: orderType === 'DINE_IN' ? tableNumber.trim() : undefined,
        items: cartItems.map((c) => ({
          menu_item_id: c.menuItem.id,
          quantity: c.quantity,
          spice_level: c.spiceLevel,
          special_instructions: c.specialInstructions || undefined,
        })),
        coupon_code: couponCode.trim() || undefined,
        notes: [kitchenNotes.trim(), orderNotes.trim()].filter(Boolean).join(' | ') || undefined,
        payment_method: paymentMethod,
        idempotency_key: `IDEMP-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      };

      const resp = await apiClient.post('/orders/customer/checkout', payload);
      const createdOrder = resp.data;

      // Clear cart
      clearCart();

      // Navigate to Order Confirmation Page (Page 6)
      navigate(`/order/confirmation/${createdOrder.order_number}`);
    } catch (err: any) {
      console.error('Checkout submission error:', err);
      setApiError(
        err.response?.data?.detail ||
          'Failed to authorize order with server. Please check availability and items.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#05070d] text-slate-100 font-sans selection:bg-amber-500 selection:text-slate-950">
      <CustomerNavbar />

      <main className="flex-1 max-w-[1720px] mx-auto w-full px-4 sm:px-6 lg:px-10 xl:px-12 py-8">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between mb-8">
          <Link
            to="/order/cart"
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-amber-300 transition-colors"
          >
            <ArrowLeft size={16} />
            <span>Return to Cart</span>
          </Link>

          {/* Stepper Header Indicator */}
          <div className="hidden sm:flex items-center gap-3 text-xs font-bold">
            <span
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full border transition-all ${
                currentStep >= 1
                  ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                  : 'text-slate-500 bg-[#0c101d] border-white/5'
              }`}
            >
              <span className="w-5 h-5 rounded-full bg-emerald-500 text-slate-950 font-black flex items-center justify-center text-[10px]">
                1
              </span>
              Fulfilment
            </span>
            <ChevronRight size={14} className="text-slate-600" />
            <span
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full border transition-all ${
                currentStep >= 2
                  ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                  : 'text-slate-500 bg-[#0c101d] border-white/5'
              }`}
            >
              <span
                className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${
                  currentStep >= 2 ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                }`}
              >
                2
              </span>
              Customer Details
            </span>
            <ChevronRight size={14} className="text-slate-600" />
            <span
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full border transition-all ${
                currentStep === 3
                  ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                  : 'text-slate-500 bg-[#0c101d] border-white/5'
              }`}
            >
              <span
                className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${
                  currentStep === 3 ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                }`}
              >
                3
              </span>
              Payment & Review
            </span>
          </div>
        </div>

        {/* API Error Notification */}
        {apiError && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs font-semibold flex items-center gap-3">
            <AlertCircle size={18} className="text-rose-400 flex-shrink-0" />
            <span>{apiError}</span>
          </div>
        )}

        {/* Desktop 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Form on Left (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            {/* STEP 1: FULFILMENT */}
            {currentStep === 1 && (
              <div className="bg-[#0c101d] rounded-3xl border border-white/10 p-6 sm:p-8 shadow-xl space-y-6 animate-in fade-in duration-200">
                <div>
                  <h2 className="font-serif font-black text-2xl text-white">
                    Step 1: Choose Fulfilment
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Select how you would like to receive your artisanal dishes from the kitchen.
                  </p>
                </div>

                {/* Fulfilment Type Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => setOrderType('DELIVERY')}
                    className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                      orderType === 'DELIVERY'
                        ? 'border-emerald-500/60 bg-emerald-950/20 text-white font-bold shadow-lg shadow-emerald-950/30 ring-1 ring-emerald-500/40'
                        : 'border-white/10 bg-[#080b14] hover:border-white/20 text-slate-300'
                    }`}
                  >
                    <div className={`p-2.5 rounded-xl w-fit border mb-3 shadow-xs ${
                      orderType === 'DELIVERY'
                        ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
                        : 'bg-white/5 border-white/10 text-slate-400'
                    }`}>
                      <Truck size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">Doorstep Delivery</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">Contactless courier delivery</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setOrderType('TAKEAWAY')}
                    className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                      orderType === 'TAKEAWAY'
                        ? 'border-emerald-500/60 bg-emerald-950/20 text-white font-bold shadow-lg shadow-emerald-950/30 ring-1 ring-emerald-500/40'
                        : 'border-white/10 bg-[#080b14] hover:border-white/20 text-slate-300'
                    }`}
                  >
                    <div className={`p-2.5 rounded-xl w-fit border mb-3 shadow-xs ${
                      orderType === 'TAKEAWAY'
                        ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
                        : 'bg-white/5 border-white/10 text-slate-400'
                    }`}>
                      <Store size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">Takeaway Pickup</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">Collect at express counter</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setOrderType('DINE_IN')}
                    className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                      orderType === 'DINE_IN'
                        ? 'border-emerald-500/60 bg-emerald-950/20 text-white font-bold shadow-lg shadow-emerald-950/30 ring-1 ring-emerald-500/40'
                        : 'border-white/10 bg-[#080b14] hover:border-white/20 text-slate-300'
                    }`}
                  >
                    <div className={`p-2.5 rounded-xl w-fit border mb-3 shadow-xs ${
                      orderType === 'DINE_IN'
                        ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
                        : 'bg-white/5 border-white/10 text-slate-400'
                    }`}>
                      <Utensils size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">Dine-In Table</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">Served straight to table</p>
                    </div>
                  </button>
                </div>

                {/* Conditional Fields based on Fulfilment */}
                {orderType === 'DELIVERY' && (
                  <div className="space-y-4 pt-4 border-t border-white/10">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Delivery Destination Address
                    </h3>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-300">Street Address *</label>
                      <input
                        type="text"
                        placeholder="e.g. 742 Evergreen Terrace, Sector 4"
                        value={street}
                        onChange={(e) => setStreet(e.target.value)}
                        className={`w-full px-3.5 py-2.5 rounded-xl border text-xs text-white placeholder-slate-500 bg-[#080b14] focus:outline-none focus:ring-1 focus:ring-amber-400/40 ${
                          formErrors.street ? 'border-rose-500/80 bg-rose-950/20' : 'border-white/15 focus:border-amber-400/80'
                        }`}
                      />
                      {formErrors.street && <p className="text-[11px] text-rose-400">{formErrors.street}</p>}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-300">Apt / Suite (Optional)</label>
                        <input
                          type="text"
                          placeholder="Apt 4B"
                          value={apt}
                          onChange={(e) => setApt(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-white/15 bg-[#080b14] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400/80 focus:ring-1 focus:ring-amber-400/40"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-300">City *</label>
                        <input
                          type="text"
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-white/15 bg-[#080b14] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400/80 focus:ring-1 focus:ring-amber-400/40"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-300">Postal Code *</label>
                        <input
                          type="text"
                          value={postalCode}
                          onChange={(e) => setPostalCode(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-white/15 bg-[#080b14] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400/80 focus:ring-1 focus:ring-amber-400/40"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-300">Courier Delivery Notes</label>
                      <input
                        type="text"
                        placeholder="e.g. Leave with security, gate code #4210"
                        value={deliveryInstructions}
                        onChange={(e) => setDeliveryInstructions(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-white/15 bg-[#080b14] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400/80 focus:ring-1 focus:ring-amber-400/40"
                      />
                    </div>
                  </div>
                )}

                {orderType === 'TAKEAWAY' && (
                  <div className="space-y-4 pt-4 border-t border-white/10">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Express Counter Pickup Details
                    </h3>
                    <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-500/30 text-amber-200 text-xs space-y-1">
                      <p className="font-bold flex items-center gap-1.5 text-amber-300">
                        <Store size={14} /> Pickup Location: Downtown Flagship Counter
                      </p>
                      <p className="text-[11px] text-amber-200/80">450 Mission Street, Financial District • Estimated readiness: 15–20 minutes</p>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-300">Pickup Timing Window</label>
                      <select
                        value={pickupSlot}
                        onChange={(e) => setPickupSlot(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-white/15 text-xs text-white bg-[#080b14] focus:outline-none focus:border-amber-400/80"
                      >
                        <option value="Standard (15-20 mins)" className="bg-[#0c101d] text-white">Immediate / Standard (15–20 mins)</option>
                        <option value="In 30 minutes" className="bg-[#0c101d] text-white">In 30 minutes</option>
                        <option value="In 45 minutes" className="bg-[#0c101d] text-white">In 45 minutes</option>
                        <option value="In 60 minutes" className="bg-[#0c101d] text-white">In 60 minutes</option>
                      </select>
                    </div>
                  </div>
                )}

                {orderType === 'DINE_IN' && (
                  <div className="space-y-4 pt-4 border-t border-white/10">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Table Identification
                    </h3>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-300">Your Table Number *</label>
                      <select
                        value={tableNumber}
                        onChange={(e) => setTableNumber(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-white/15 text-xs text-white bg-[#080b14] focus:outline-none focus:border-amber-400/80"
                      >
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((num) => (
                          <option key={num} value={`Table ${num}`} className="bg-[#0c101d] text-white">
                            Table {num} (Main Dining Hall)
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}

                {/* Continue to Step 2 Button */}
                <div className="pt-4 flex justify-end">
                  <button
                    type="button"
                    onClick={handleProceedToStep2}
                    className="flex items-center gap-2 py-3 px-8 rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-slate-950 font-black text-sm shadow-lg shadow-emerald-900/30 transition-all active:scale-[0.98]"
                  >
                    <span>Continue to Customer Details</span>
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: CUSTOMER DETAILS */}
            {currentStep === 2 && (
              <div className="bg-[#0c101d] rounded-3xl border border-white/10 p-6 sm:p-8 shadow-xl space-y-6 animate-in fade-in duration-200">
                <div>
                  <h2 className="font-serif font-black text-2xl text-white">
                    Step 2: Customer Contact & Receipt
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Enter your contact information for order confirmation, digital SMS receipt, and courier updates.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                      <User size={13} className="text-amber-400" /> Full Name *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Elena Rostova"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className={`w-full px-3.5 py-2.5 rounded-xl border text-xs text-white placeholder-slate-500 bg-[#080b14] focus:outline-none focus:ring-1 focus:ring-amber-400/40 ${
                        formErrors.fullName ? 'border-rose-500/80 bg-rose-950/20' : 'border-white/15 focus:border-amber-400/80'
                      }`}
                    />
                    {formErrors.fullName && <p className="text-[11px] text-rose-400">{formErrors.fullName}</p>}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                        <Mail size={13} className="text-amber-400" /> Email for Receipt *
                      </label>
                      <input
                        type="email"
                        placeholder="elena@restaurantiq.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={`w-full px-3.5 py-2.5 rounded-xl border text-xs text-white placeholder-slate-500 bg-[#080b14] focus:outline-none focus:ring-1 focus:ring-amber-400/40 ${
                          formErrors.email ? 'border-rose-500/80 bg-rose-950/20' : 'border-white/15 focus:border-amber-400/80'
                        }`}
                      />
                      {formErrors.email && <p className="text-[11px] text-rose-400">{formErrors.email}</p>}
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                        <Phone size={13} className="text-amber-400" /> Phone Number (Live Updates) *
                      </label>
                      <input
                        type="tel"
                        placeholder="+1 (555) 019-2831"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className={`w-full px-3.5 py-2.5 rounded-xl border text-xs text-white placeholder-slate-500 bg-[#080b14] focus:outline-none focus:ring-1 focus:ring-amber-400/40 ${
                          formErrors.phone ? 'border-rose-500/80 bg-rose-950/20' : 'border-white/15 focus:border-amber-400/80'
                        }`}
                      />
                      {formErrors.phone && <p className="text-[11px] text-rose-400">{formErrors.phone}</p>}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                      <FileText size={13} className="text-amber-400" /> Special Kitchen Requests / Allergies
                    </label>
                    <textarea
                      placeholder="e.g. Extra napkins, please keep condiments separate..."
                      value={kitchenNotes}
                      onChange={(e) => setKitchenNotes(e.target.value)}
                      rows={3}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-white/15 bg-[#080b14] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400/80 focus:ring-1 focus:ring-amber-400/40 resize-none"
                    />
                  </div>
                </div>

                {/* Back / Next Buttons */}
                <div className="pt-4 flex items-center justify-between border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="px-5 py-2.5 rounded-xl border border-white/10 text-xs font-bold text-slate-300 hover:bg-white/5 transition-colors"
                  >
                    Back to Fulfilment
                  </button>

                  <button
                    type="button"
                    onClick={handleProceedToStep3}
                    className="flex items-center gap-2 py-3 px-8 rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-slate-950 font-black text-sm shadow-lg shadow-emerald-900/30 transition-all active:scale-[0.98]"
                  >
                    <span>Continue to Payment</span>
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: PAYMENT & REVIEW */}
            {currentStep === 3 && (
              <div className="bg-[#0c101d] rounded-3xl border border-white/10 p-6 sm:p-8 shadow-xl space-y-6 animate-in fade-in duration-200">
                <div>
                  <h2 className="font-serif font-black text-2xl text-white">
                    Step 3: Secure Payment & Authorization
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Select your preferred payment method. Transactions are protected by PCI-DSS tokenized encryption.
                  </p>
                </div>

                {/* Payment Method Selector */}
                <div className="space-y-3">
                  {/* Credit / Debit Card (Tokenized Simulator) */}
                  <label
                    className={`block p-4 rounded-2xl border cursor-pointer transition-all ${
                      paymentMethod === 'CARD'
                        ? 'border-emerald-500/60 bg-emerald-950/20 text-white shadow-lg shadow-emerald-950/30 ring-1 ring-emerald-500/40'
                        : 'border-white/10 bg-[#080b14] hover:border-white/20 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="payment"
                          checked={paymentMethod === 'CARD'}
                          onChange={() => setPaymentMethod('CARD')}
                          className="accent-emerald-500 focus:ring-emerald-500"
                        />
                        <div className="flex items-center gap-2 font-bold text-white text-sm">
                          <CreditCard size={18} className="text-emerald-400" />
                          <span>Credit / Debit Card (Secure Hosted Checkout)</span>
                        </div>
                      </div>
                      <span className="text-[11px] font-bold text-emerald-300 bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                        Recommended
                      </span>
                    </div>

                    {paymentMethod === 'CARD' && (
                      <div className="mt-3 pt-3 border-t border-white/10 space-y-3 text-xs">
                        <div className="flex items-center gap-2 text-slate-400">
                          <Lock size={13} className="text-emerald-400" />
                          <span>256-Bit TLS Tokenized Card Processing • Verified by Stripe / PCI-DSS Level 1</span>
                        </div>
                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-slate-300">Cardholder Name</label>
                          <input
                            type="text"
                            value={cardHolderName}
                            onChange={(e) => setCardHolderName(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl border border-white/15 bg-[#05070d] text-xs font-semibold text-white focus:outline-none focus:border-amber-400/80"
                          />
                        </div>
                        <div className="p-3 rounded-xl bg-[#05070d] border border-white/10 flex items-center justify-between text-slate-300 font-mono text-xs">
                          <span>•••• •••• •••• 4242</span>
                          <span className="text-[10px] uppercase font-bold text-slate-500">Mock Tokenized</span>
                        </div>
                      </div>
                    )}
                  </label>

                  {/* Instant UPI QR */}
                  <label
                    className={`block p-4 rounded-2xl border cursor-pointer transition-all ${
                      paymentMethod === 'UPI'
                        ? 'border-emerald-500/60 bg-emerald-950/20 text-white shadow-lg shadow-emerald-950/30 ring-1 ring-emerald-500/40'
                        : 'border-white/10 bg-[#080b14] hover:border-white/20 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="payment"
                          checked={paymentMethod === 'UPI'}
                          onChange={() => setPaymentMethod('UPI')}
                          className="accent-emerald-500 focus:ring-emerald-500"
                        />
                        <div className="flex items-center gap-2 font-bold text-white text-sm">
                          <QrCode size={18} className="text-purple-400" />
                          <span>Instant UPI / QR Code Payment</span>
                        </div>
                      </div>
                      <span className="text-[10px] font-semibold text-purple-300 bg-purple-500/15 px-2 py-0.5 rounded-full border border-purple-500/30">
                        Zero Fee
                      </span>
                    </div>

                    {paymentMethod === 'UPI' && (
                      <div className="mt-3 pt-3 border-white/10 space-y-2 text-xs">
                        <label className="text-[11px] font-bold text-slate-300">Your Virtual Payment Address (VPA)</label>
                        <input
                          type="text"
                          value={upiId}
                          onChange={(e) => setUpiId(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-white/15 bg-[#05070d] text-xs font-semibold text-white focus:outline-none focus:border-amber-400/80"
                        />
                      </div>
                    )}
                  </label>

                  {/* Cash on Delivery / Counter */}
                  <label
                    className={`block p-4 rounded-2xl border cursor-pointer transition-all ${
                      paymentMethod === 'CASH'
                        ? 'border-emerald-500/60 bg-emerald-950/20 text-white shadow-lg shadow-emerald-950/30 ring-1 ring-emerald-500/40'
                        : 'border-white/10 bg-[#080b14] hover:border-white/20 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="payment"
                          checked={paymentMethod === 'CASH'}
                          onChange={() => setPaymentMethod('CASH')}
                          className="accent-emerald-500 focus:ring-emerald-500"
                        />
                        <div className="flex items-center gap-2 font-bold text-white text-sm">
                          <Banknote size={18} className="text-amber-400" />
                          <span>
                            {orderType === 'DELIVERY' ? 'Cash on Delivery (COD)' : 'Pay Cash at Counter'}
                          </span>
                        </div>
                      </div>
                      <span className="text-[10px] font-semibold text-amber-300 bg-amber-500/15 px-2 py-0.5 rounded-full border border-amber-500/30">
                        Verified at Doorstep
                      </span>
                    </div>
                  </label>
                </div>

                {/* Back / Place Order Actions */}
                <div className="pt-4 flex items-center justify-between border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    className="px-5 py-2.5 rounded-xl border border-white/10 text-xs font-bold text-slate-300 hover:bg-white/5 transition-colors"
                  >
                    Back to Details
                  </button>

                  <button
                    type="button"
                    onClick={handlePlaceOrder}
                    disabled={isSubmitting}
                    className="flex items-center gap-2 py-3.5 px-8 rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-slate-950 font-black text-sm shadow-xl shadow-emerald-900/30 transition-all transform active:scale-[0.98] disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <span>Authorizing Order with Kitchen...</span>
                    ) : (
                      <>
                        <ShieldCheck size={18} />
                        <span>Place & Authorize Order • ${total.toFixed(2)}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Sticky Order Summary on Right (4 cols) */}
          <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-4">
            <div className="bg-[#0c101d] rounded-3xl border border-white/10 p-6 shadow-xl space-y-5">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h3 className="font-serif font-black text-lg text-white">
                  Order Breakdown
                </h3>
                <span className="text-xs font-bold text-emerald-400 bg-emerald-500/15 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                  {cartItems.length} Dishes
                </span>
              </div>

              {/* Items preview */}
              <div className="max-h-52 overflow-y-auto divide-y divide-white/[0.08] text-xs pr-1">
                {cartItems.map((c, i) => (
                  <div key={i} className="py-2.5 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 truncate">
                      <span className="w-5 h-5 rounded-md bg-[#080b14] border border-white/10 text-amber-300 font-bold flex items-center justify-center text-[10px]">
                        {c.quantity}x
                      </span>
                      <span className="font-semibold text-slate-200 truncate">{c.menuItem.name}</span>
                    </div>
                    <span className="font-bold text-white text-right">
                      ${(c.menuItem.price * c.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="space-y-2 pt-2 border-t border-white/10 text-xs text-slate-400">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-bold text-white">${subtotal.toFixed(2)}</span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-emerald-400 font-semibold">
                    <span>Discount ({couponCode})</span>
                    <span>-${discount.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Taxes (5%)</span>
                  <span className="font-bold text-white">${tax.toFixed(2)}</span>
                </div>

                <div className="flex justify-between">
                  <span>Delivery Charge</span>
                  <span className="font-bold text-white">
                    {deliveryFee === 0 ? <span className="text-emerald-400 font-bold">FREE</span> : `$${deliveryFee.toFixed(2)}`}
                  </span>
                </div>

                <div className="pt-3 border-t border-white/10 flex justify-between items-baseline">
                  <div>
                    <span className="text-sm font-black text-white font-serif">Final Total</span>
                    <p className="text-[10px] text-slate-500">All prices verified by DB</p>
                  </div>
                  <span className="text-2xl font-black text-amber-400 font-serif">
                    ${total.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Fulfilment badge preview */}
              <div className="p-3 rounded-2xl bg-[#080b14] border border-white/10 text-xs text-slate-300 space-y-1">
                <p className="font-bold text-white flex items-center gap-1.5">
                  <Clock size={13} className="text-emerald-400" />
                  Estimated Time: {orderType === 'DELIVERY' ? '30–35 mins' : '15–20 mins'}
                </p>
                <p className="text-[11px] text-slate-400">
                  Fulfilment: <strong className="text-slate-200">{orderType === 'DELIVERY' ? 'Doorstep Delivery' : orderType === 'TAKEAWAY' ? 'Takeaway Pickup' : tableNumber}</strong>
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <CustomerFooter />
    </div>
  );
};

