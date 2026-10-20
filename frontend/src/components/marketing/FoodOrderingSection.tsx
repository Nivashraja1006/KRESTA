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
  Plus,
  UtensilsCrossed
} from 'lucide-react';

export const FoodOrderingSection: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number>(2);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const allDishes = [
    {
      name: 'Royal Dum Dum Chicken Biryani',
      category: 'Biryani',
      price: '$24.95',
      time: '25 mins',
      cal: '750 kcal',
      isVeg: false,
      rating: '4.9',
      image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&auto=format&fit=crop&q=85',
      description: 'Slow-cooked dum basmati layered with tender spiced chicken, caramelized onions, saffron milk, and fresh mint.',
    },
    {
      name: 'Truffle Burrata & Forest Mushroom Pizza',
      category: 'Pizza',
      price: '$22.95',
      time: '18 mins',
      cal: '780 kcal',
      isVeg: true,
      rating: '4.9',
      image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&auto=format&fit=crop&q=85',
      description: 'Crisp Neapolitan wood-fired crust, black truffle paste, roasted wild chanterelles, and creamy Pugliese burrata.',
    },
    {
      name: 'Royal Saffron Wagyu Burger',
      category: 'Burgers',
      price: '$21.95',
      time: '16 mins',
      cal: '820 kcal',
      isVeg: false,
      rating: '4.8',
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&auto=format&fit=crop&q=85',
      description: 'Prime Wagyu patty seared medium-rare, aged farmhouse cheddar, caramelized shallots, and saffron aioli on toasted brioche.',
    },
    {
      name: 'Hamachi Crudo & Yuzu Pearls',
      category: 'Starters',
      price: '$18.50',
      time: '12 mins',
      cal: '380 kcal',
      isVeg: false,
      rating: '4.9',
      image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=800&auto=format&fit=crop&q=85',
      description: 'Thinly sliced yellowtail kingfish, yuzu kosho vinaigrette, finger lime caviar, and cold-pressed extra virgin olive oil.',
    },
  ];

  const filteredDishes =
    selectedCategory === 'All'
      ? allDishes
      : allDishes.filter((d) => d.category === selectedCategory);

  const timelineSteps = [
    { label: 'Order Placed', time: '19:42', icon: CheckCircle2 },
    { label: 'Kitchen Accepted', time: '19:43', icon: ChefHat },
    { label: 'Chef Preparing', time: '19:48', icon: Flame },
    { label: 'Quality Packed', time: '20:04', icon: ShoppingBag },
    { label: 'Courier Dispatched', time: '20:18', icon: Truck },
  ];

  return (
    <section id="food-ordering" className="py-20 sm:py-28 lg:py-32 relative bg-[#070a14] border-t border-white/[0.06] overflow-hidden">
      {/* Background Lighting */}
      <div className="absolute top-1/2 right-1/4 w-[350px] sm:w-[500px] h-[350px] sm:h-[500px] bg-amber-500/5 rounded-full blur-[100px] sm:blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-[350px] sm:w-[500px] h-[350px] sm:h-[500px] bg-emerald-500/5 rounded-full blur-[100px] sm:blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 sm:space-y-4 mb-12 sm:mb-16 lg:mb-20">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-navy-950/80 px-3.5 py-1.5 text-[11px] sm:text-xs font-bold text-amber-300">
            <Sparkles size={13} />
            <span>DIRECT CUSTOMER COMMERCE</span>
          </div>

          <h2 className="font-serif fluid-section-headline font-bold text-white tracking-tight">
            Seamless Guest Ordering, <br />
            <span className="emerald-gradient-text">Directly Synchronized to Your Kitchen.</span>
          </h2>

          <p className="fluid-subheadline text-slate-300 leading-relaxed font-normal">
            Eliminate high 30% third-party aggregator commissions. KRESTA delivers a branded, mobile-first ordering experience with real-time cooking telemetry, automated recipe deductions, and instant payment validation.
          </p>
        </div>

        {/* Dual-Panel Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
          {/* Left Column: Customer Food Menu Browser (7 cols) */}
          <div className="lg:col-span-7 glass-panel p-4 sm:p-6 lg:p-7 rounded-2xl sm:rounded-3xl border-white/[0.08] space-y-5 sm:space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 pb-4 border-b border-white/[0.08]">
              <div>
                <span className="text-[10px] font-mono text-amber-300 uppercase tracking-wider font-semibold">
                  Customer Experience &bull; /order
                </span>
                <h3 className="text-base sm:text-lg font-bold text-white font-serif">
                  The Royal Saffron Gourmet &bull; Downtown Flagship
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-ping flex-shrink-0" />
                <span className="text-xs font-semibold text-emerald-400 font-mono">Kitchen Open &bull; 25-35 min delivery</span>
              </div>
            </div>

            {/* Category Filter Chips - smooth horizontal touch scroll */}
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
              {['All', 'Biryani', 'Pizza', 'Burgers', 'Starters'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all touch-target ${
                    selectedCategory === cat
                      ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20'
                      : 'bg-navy-900/80 text-slate-300 hover:text-white hover:bg-navy-850 border border-white/[0.06]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Dish Cards List */}
            <div className="space-y-3">
              {filteredDishes.map((dish) => (
                <div
                  key={dish.name}
                  className="rounded-2xl border border-white/[0.07] bg-navy-900/40 p-3 sm:p-4 hover:border-amber-500/30 transition-all flex flex-col sm:flex-row gap-3.5 sm:gap-4 items-start sm:items-center justify-between group"
                >
                  <div className="flex items-start sm:items-center gap-3 sm:gap-4 w-full sm:w-auto">
                    <img
                      src={dish.image}
                      alt={dish.name}
                      className="h-16 w-16 sm:h-20 sm:w-20 rounded-xl object-cover border border-white/[0.08] group-hover:scale-105 transition-transform duration-500 flex-shrink-0"
                      loading="lazy"
                      decoding="async"
                    />
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span
                          className={`h-2 w-2 rounded-full flex-shrink-0 ${
                            dish.isVeg ? 'bg-emerald-400' : 'bg-rose-500'
                          }`}
                          title={dish.isVeg ? 'Vegetarian' : 'Non-Vegetarian'}
                        />
                        <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-amber-200 transition-colors font-serif truncate">
                          {dish.name}
                        </h4>
                      </div>
                      <p className="text-[11px] sm:text-xs text-slate-300 line-clamp-1 max-w-sm">
                        {dish.description}
                      </p>
                      <div className="flex items-center gap-2.5 text-[10px] sm:text-[11px] text-slate-400 font-mono">
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

                  <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-white/[0.06]">
                    <span className="text-sm sm:text-base font-extrabold text-white font-mono">{dish.price}</span>
                    <Link
                      to="/order"
                      className="inline-flex items-center gap-1 px-3.5 sm:px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 font-bold text-xs shadow-md shadow-emerald-500/20 transition-all active:scale-95 touch-target"
                    >
                      <Plus size={14} />
                      <span>Order</span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-1 text-center">
              <Link
                to="/order"
                className="inline-flex items-center gap-2 text-xs font-bold text-amber-300 hover:text-amber-200 transition-colors touch-target"
              >
                <span>Launch Full 22+ Item Ordering Catalog</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>

          {/* Right Column: Live Order Status Tracking Simulation (5 cols) */}
          <div className="lg:col-span-5 space-y-5 sm:space-y-6">
            <div className="glass-panel p-4 sm:p-6 lg:p-7 rounded-2xl sm:rounded-3xl border-white/[0.08] space-y-4 sm:space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
                <div>
                  <span className="text-[9px] sm:text-[10px] font-mono text-emerald-400 uppercase font-semibold">
                    Live Telemetry &bull; ORD-1015-84A9
                  </span>
                  <h3 className="text-sm sm:text-base font-bold text-white font-serif">Estimated Arrival in 18 Mins</h3>
                </div>
                <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-300 flex-shrink-0">
                  <Flame size={17} className="animate-pulse" />
                </div>
              </div>

              {/* Status Timeline */}
              <div className="space-y-2.5 sm:space-y-3">
                {timelineSteps.map((step, idx) => {
                  const Icon = step.icon;
                  const isDone = idx < activeStep;
                  const isCurrent = idx === activeStep;
                  return (
                    <div
                      key={step.label}
                      onClick={() => setActiveStep(idx)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') setActiveStep(idx);
                      }}
                      className={`flex items-center gap-3 p-2 rounded-xl cursor-pointer transition-all touch-target focus:outline-none focus-visible:ring-1 focus-visible:ring-amber-400 ${
                        isCurrent
                          ? 'bg-emerald-500/10 border border-emerald-500/30'
                          : 'opacity-70 hover:opacity-100'
                      }`}
                    >
                      <div
                        className={`h-7 w-7 sm:h-8 sm:w-8 rounded-full flex items-center justify-center text-xs font-bold transition-all flex-shrink-0 ${
                          isDone
                            ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/30'
                            : isCurrent
                            ? 'bg-amber-400 text-slate-950 animate-pulse shadow-md shadow-amber-400/30'
                            : 'bg-navy-900 text-slate-500 border border-white/[0.08]'
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
                        <span className="text-[10px] sm:text-[11px] font-mono text-slate-400">{step.time}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Sample Cart Breakdown */}
              <div className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-navy-900/60 border border-white/[0.06] text-xs space-y-2">
                <div className="flex items-center justify-between font-medium text-slate-300">
                  <span className="truncate max-w-[200px] sm:max-w-none">1x Royal Dum Dum Chicken Biryani</span>
                  <span className="font-mono text-white">$24.95</span>
                </div>
                <div className="flex items-center justify-between font-medium text-slate-300">
                  <span className="truncate max-w-[200px] sm:max-w-none">1x Truffle Burrata Pizza</span>
                  <span className="font-mono text-white">$22.95</span>
                </div>
                <div className="flex items-center justify-between text-emerald-400 font-medium">
                  <span className="flex items-center gap-1">
                    <Tag size={12} />
                    <span>Coupon KRESTA10 (10% Off)</span>
                  </span>
                  <span className="font-mono">-$4.79</span>
                </div>
                <div className="pt-2 border-t border-white/[0.08] flex items-center justify-between font-bold text-white text-xs sm:text-sm">
                  <span>Total Paid</span>
                  <span className="font-mono text-emerald-400">$45.47</span>
                </div>
              </div>
            </div>

            {/* Direct CTA Card */}
            <div className="p-5 sm:p-6 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-emerald-500/15 via-navy-950 to-amber-500/15 border border-emerald-500/30 text-center space-y-3">
              <h4 className="text-sm sm:text-base font-bold text-white font-serif">Order Direct &amp; Experience the Quality</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Experience guest ordering with instant live WebSocket notifications sent straight to the chef display.
              </p>
              <Link
                to="/order"
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 px-5 sm:px-6 py-3.5 text-xs sm:text-sm font-bold text-slate-950 shadow-xl shadow-amber-500/25 hover:from-amber-300 hover:to-amber-500 transition-all active:scale-95 touch-target"
              >
                <UtensilsCrossed size={16} />
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
