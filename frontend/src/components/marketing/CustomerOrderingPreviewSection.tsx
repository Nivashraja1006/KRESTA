import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ShoppingBag,
  Sparkles,
  ArrowRight,
  Clock,
  CheckCircle2,
  Flame,
  Star,
  Tag,
  ChefHat,
  Truck,
  Plus
} from 'lucide-react';

export const CustomerOrderingPreviewSection: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number>(2); // 0: placed, 1: confirmed, 2: preparing, 3: ready, 4: delivered
  const [selectedCategory, setSelectedCategory] = useState<string>('Biryani');

  const sampleDishes = [
    {
      name: 'Royal Dum Dum Chicken Biryani',
      category: 'Biryani',
      price: '$24.95',
      time: '25 mins',
      cal: '750 kcal',
      isVeg: false,
      rating: '4.9',
      image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&auto=format&fit=crop&q=80',
      description: 'Slow-cooked dum basmati layered with tender spiced chicken, caramelized onions, and Kashmiri saffron.'
    },
    {
      name: 'Truffle Burrata & Forest Mushroom Pizza',
      category: 'Pizza',
      price: '$22.95',
      time: '18 mins',
      cal: '780 kcal',
      isVeg: true,
      rating: '4.9',
      image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&auto=format&fit=crop&q=80',
      description: 'Crisp Neapolitan wood-fired crust, black truffle puree, roasted wild mushrooms, and creamy burrata.'
    },
    {
      name: 'Royal Saffron Wagyu Burger',
      category: 'Burgers',
      price: '$21.95',
      time: '16 mins',
      cal: '820 kcal',
      isVeg: false,
      rating: '4.8',
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=80',
      description: 'Prime Wagyu patty seared medium-rare, aged cheddar, caramelized shallots, saffron aioli on toasted brioche.'
    }
  ];

  const timelineSteps = [
    { label: 'Order Placed', time: '19:42', icon: CheckCircle2 },
    { label: 'Kitchen Accepted', time: '19:43', icon: ChefHat },
    { label: 'Chef Preparing', time: '19:48', icon: Flame },
    { label: 'Quality Packed', time: '20:04', icon: ShoppingBag },
    { label: 'Courier Dispatched', time: '20:18', icon: Truck },
  ];

  return (
    <section className="py-24 relative bg-slate-950 border-t border-slate-800/80 overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1.5 text-xs font-bold text-amber-300">
            <Sparkles size={14} />
            <span>DIRECT CUSTOMER COMMERCE</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Seamless Guest Food Ordering, <br />
            <span className="emerald-gradient-text">Synchronized Directly to Your Kitchen.</span>
          </h2>
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Eliminate high third-party aggregator commissions. KRESTA delivers a branded, mobile-first ordering experience with real-time cooking telemetry, automated recipe deductions, and instant payment validation.
          </p>
        </div>

        {/* Interactive Dual-Panel Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Customer Food Menu Browser Simulation (7 cols) */}
          <div className="lg:col-span-7 rounded-3xl border border-slate-800 bg-slate-900/80 p-5 sm:p-6 shadow-2xl backdrop-blur-xl space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
              <div>
                <span className="text-xs font-mono text-amber-400 uppercase tracking-wider font-semibold">
                  Customer Route: /order (Demo Data)
                </span>
                <h3 className="text-lg font-bold text-white font-serif">The Royal Saffron Gourmet &bull; Downtown Flagship</h3>
              </div>
              <div className="flex items-center gap-2">
                <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-xs font-semibold text-emerald-400">Open &bull; 25-35 min delivery</span>
              </div>
            </div>

            {/* Category Chips */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              {['All', 'Starters', 'Main Course', 'Biryani', 'Pizza', 'Burgers', 'Desserts', 'Beverages'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                    selectedCategory === cat
                      ? 'bg-amber-400 text-slate-950 font-bold shadow-md shadow-amber-400/20'
                      : 'bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-700'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Sample Dish Grid */}
            <div className="space-y-3.5">
              {sampleDishes.map((dish) => (
                <div
                  key={dish.name}
                  className="rounded-2xl border border-slate-800 bg-slate-950/60 p-3.5 sm:p-4 hover:border-slate-700 transition-all flex flex-col sm:flex-row gap-4 items-center justify-between group"
                >
                  <div className="flex items-center gap-3.5 w-full sm:w-auto">
                    <img
                      src={dish.image}
                      alt={dish.name}
                      className="h-16 w-16 sm:h-20 sm:w-20 rounded-xl object-cover border border-slate-700 group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={`h-2.5 w-2.5 rounded-full ${
                            dish.isVeg ? 'bg-emerald-400' : 'bg-rose-500'
                          }`}
                          title={dish.isVeg ? 'Vegetarian' : 'Non-Vegetarian'}
                        />
                        <h4 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
                          {dish.name}
                        </h4>
                      </div>
                      <p className="text-xs text-slate-400 line-clamp-1 max-w-sm">
                        {dish.description}
                      </p>
                      <div className="flex items-center gap-3 text-[11px] text-slate-400 font-mono">
                        <span className="flex items-center gap-1 text-amber-300">
                          <Star size={11} className="fill-amber-300" />
                          {dish.rating}
                        </span>
                        <span>&bull;</span>
                        <span className="flex items-center gap-1">
                          <Clock size={11} />
                          {dish.time}
                        </span>
                        <span>&bull;</span>
                        <span>{dish.cal}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800">
                    <span className="text-base font-extrabold text-white font-mono">{dish.price}</span>
                    <Link
                      to="/order"
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md shadow-emerald-500/20 transition-all"
                    >
                      <Plus size={14} />
                      <span>Add</span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2 text-center">
              <Link
                to="/order"
                className="inline-flex items-center gap-2 text-xs font-bold text-amber-300 hover:text-amber-200 transition-colors"
              >
                <span>Launch Full 22+ Item Ordering Catalog</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>

          {/* Right: Live Order Status Tracking Simulation (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Live Tracking Card */}
            <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-5 sm:p-6 shadow-2xl backdrop-blur-xl space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div>
                  <span className="text-[10px] font-mono text-emerald-400 uppercase font-semibold">
                    Live Tracking &bull; ORD-1015-84A9
                  </span>
                  <h3 className="text-base font-bold text-white">Estimated Arrival in 18 Mins</h3>
                </div>
                <div className="h-9 w-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-300">
                  <Flame size={18} className="animate-pulse" />
                </div>
              </div>

              {/* Status Timeline */}
              <div className="space-y-4">
                {timelineSteps.map((step, idx) => {
                  const Icon = step.icon;
                  const isDone = idx < activeStep;
                  const isCurrent = idx === activeStep;
                  return (
                    <div
                      key={step.label}
                      onClick={() => setActiveStep(idx)}
                      className={`flex items-center gap-3.5 p-2 rounded-xl cursor-pointer transition-all ${
                        isCurrent
                          ? 'bg-emerald-500/10 border border-emerald-500/30'
                          : 'opacity-70 hover:opacity-100'
                      }`}
                    >
                      <div
                        className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                          isDone
                            ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/30'
                            : isCurrent
                            ? 'bg-amber-400 text-slate-950 animate-pulse shadow-md shadow-amber-400/30'
                            : 'bg-slate-800 text-slate-500'
                        }`}
                      >
                        <Icon size={14} />
                      </div>
                      <div className="flex-1 flex items-center justify-between">
                        <span
                          className={`text-xs font-semibold ${
                            isCurrent ? 'text-amber-300 font-bold' : isDone ? 'text-white' : 'text-slate-400'
                          }`}
                        >
                          {step.label}
                        </span>
                        <span className="text-[11px] font-mono text-slate-400">{step.time}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Order Cart Breakdown Sample */}
              <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs space-y-2">
                <div className="flex items-center justify-between font-medium text-slate-300">
                  <span>1x Royal Dum Dum Chicken Biryani</span>
                  <span className="font-mono text-white">$24.95</span>
                </div>
                <div className="flex items-center justify-between font-medium text-slate-300">
                  <span>1x Truffle Burrata Pizza</span>
                  <span className="font-mono text-white">$22.95</span>
                </div>
                <div className="flex items-center justify-between text-emerald-400 font-medium">
                  <span className="flex items-center gap-1">
                    <Tag size={12} />
                    <span>Coupon KRESTA10 (10% Off)</span>
                  </span>
                  <span className="font-mono">-$4.79</span>
                </div>
                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between font-bold text-white text-sm">
                  <span>Total Paid</span>
                  <span className="font-mono text-emerald-400">$45.47</span>
                </div>
              </div>
            </div>

            {/* Direct CTA */}
            <div className="p-5 rounded-3xl bg-gradient-to-r from-emerald-500/20 via-slate-900 to-amber-500/20 border border-emerald-500/30 text-center space-y-3">
              <h4 className="text-sm font-bold text-white">Experience Direct Guest Ordering</h4>
              <p className="text-xs text-slate-300">
                Place test orders with live WebSocket dispatching to the kitchen queue.
              </p>
              <Link
                to="/order"
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 px-5 py-3 text-xs font-bold text-slate-950 shadow-xl shadow-emerald-500/20 hover:from-emerald-400 hover:to-emerald-500 transition-all"
              >
                <span>Launch Food Ordering Platform</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

