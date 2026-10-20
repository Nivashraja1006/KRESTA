import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  LayoutDashboard,
  ChefHat,
  TrendingUp,
  Package,
  DollarSign,
  ShoppingBag,
  ExternalLink,
  Sparkles,
  AlertTriangle,
  ArrowRight,
  Users
} from 'lucide-react';

export const LiveIntelligenceSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'kds' | 'forecast' | 'inventory'>('overview');

  const tabs = [
    { id: 'overview', label: 'Executive Command', icon: LayoutDashboard },
    { id: 'kds', label: 'Kitchen Telemetry', icon: ChefHat },
    { id: 'forecast', label: 'AI Demand Wave', icon: TrendingUp },
    { id: 'inventory', label: 'Smart Inventory', icon: Package },
  ];

  return (
    <section id="restaurant-intelligence" className="py-20 sm:py-28 lg:py-32 relative bg-[#070a14] border-t border-white/[0.06] overflow-hidden">
      {/* Subtle Background Glow */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[350px] sm:w-[500px] h-[350px] sm:h-[500px] bg-emerald-500/5 rounded-full blur-[100px] sm:blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 right-4 sm:right-10 w-[300px] sm:w-[450px] h-[300px] sm:h-[450px] bg-amber-500/5 rounded-full blur-[100px] sm:blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 sm:gap-6 mb-8 sm:mb-12 lg:mb-16">
          <div className="space-y-3 sm:space-y-4 max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-navy-950/80 px-3.5 py-1.5 text-[11px] sm:text-xs font-bold text-amber-300">
              <Sparkles size={13} />
              <span>LIVE RESTAURANT INTELLIGENCE</span>
            </div>
            <h2 className="font-serif fluid-section-headline font-bold text-white tracking-tight">
              A Unified Mission Control, <br />
              <span className="emerald-gradient-text">Streamed in Real Time.</span>
            </h2>
            <p className="fluid-subheadline text-slate-300 leading-relaxed font-normal">
              Eliminate disconnected POS devices, messy paper tickets, and uncoordinated inventory logs. KRESTA delivers sub-second operational telemetry across dining floor, kitchen pass, and executive ledger.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/dashboard"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 px-5 sm:px-6 py-3.5 text-xs sm:text-sm font-bold text-slate-950 shadow-lg shadow-emerald-500/20 hover:from-emerald-400 hover:to-emerald-500 transition-all duration-300 active:scale-95 touch-target"
            >
              <span>Explore Live Dashboard</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>

        {/* Tab Switcher - Horizontally scrollable on mobile */}
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-3 mb-6 sm:mb-8 border-b border-white/[0.08] -mx-4 px-4 sm:mx-0 sm:px-0">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-300 touch-target ${
                  isActive
                    ? 'bg-amber-400 text-slate-950 shadow-lg shadow-amber-400/25'
                    : 'text-slate-300 hover:text-white bg-navy-900/60 border border-white/[0.06] hover:bg-navy-850'
                }`}
              >
                <Icon size={15} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Live Dashboard Frame */}
        <div className="rounded-2xl sm:rounded-3xl border border-white/[0.08] bg-navy-950/90 shadow-[0_25px_70px_rgba(0,0,0,0.8)] overflow-hidden p-3.5 sm:p-6 lg:p-7 backdrop-blur-2xl">
          {/* Top Frame Control Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 sm:pb-5 border-b border-white/[0.08] mb-5 sm:mb-6">
            <div className="flex items-center gap-2.5 sm:gap-3">
              <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl bg-navy-900 border border-amber-500/30 p-1 flex items-center justify-center flex-shrink-0">
                <img src="/kresta-logo-mark.png" alt="KRESTA" className="h-full w-full object-contain" />
              </div>
              <div>
                <p className="text-xs sm:text-sm font-bold text-white font-serif">KRESTA Command Console</p>
                <p className="text-[10px] sm:text-[11px] text-slate-400">Downtown Flagship &bull; Shift 18:00 - 23:30</p>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <span className="text-[9px] sm:text-[10px] font-mono text-amber-300 bg-amber-500/10 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md border border-amber-500/20">
                Demo Data
              </span>
              <Link
                to="/dashboard"
                className="text-[11px] sm:text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 bg-emerald-500/10 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg border border-emerald-500/25 transition-colors touch-target"
              >
                <span>Launch View</span>
                <ExternalLink size={12} />
              </Link>
            </div>
          </div>

          {/* Tab 1: Executive Overview */}
          {activeTab === 'overview' && (
            <div className="space-y-5 sm:space-y-6">
              {/* 5 High-Impact Metric Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 sm:gap-3.5">
                <div className="glass-panel p-3 sm:p-4 rounded-xl sm:rounded-2xl border-white/[0.07]">
                  <div className="flex items-center justify-between text-slate-400 mb-1">
                    <span className="text-[9px] sm:text-[10px] uppercase font-bold tracking-wider">Gross Sales</span>
                    <DollarSign size={14} className="text-emerald-400" />
                  </div>
                  <p className="text-base sm:text-xl lg:text-2xl font-mono font-extrabold text-white">$46,872</p>
                  <p className="text-[10px] text-emerald-400 font-semibold mt-0.5">+14.2% MoM</p>
                </div>

                <div className="glass-panel p-3 sm:p-4 rounded-xl sm:rounded-2xl border-white/[0.07]">
                  <div className="flex items-center justify-between text-slate-400 mb-1">
                    <span className="text-[9px] sm:text-[10px] uppercase font-bold tracking-wider">Orders</span>
                    <ShoppingBag size={14} className="text-blue-400" />
                  </div>
                  <p className="text-base sm:text-xl lg:text-2xl font-mono font-extrabold text-white">711 Tickets</p>
                  <p className="text-[10px] text-blue-400 font-semibold mt-0.5">100% on time</p>
                </div>

                <div className="glass-panel p-3 sm:p-4 rounded-xl sm:rounded-2xl border-white/[0.07]">
                  <div className="flex items-center justify-between text-slate-400 mb-1">
                    <span className="text-[9px] sm:text-[10px] uppercase font-bold tracking-wider">Avg Check</span>
                    <TrendingUp size={14} className="text-amber-400" />
                  </div>
                  <p className="text-base sm:text-xl lg:text-2xl font-mono font-extrabold text-amber-300">$65.93</p>
                  <p className="text-[10px] text-amber-400 font-semibold mt-0.5">+$7.73 vs Q2</p>
                </div>

                <div className="glass-panel p-3 sm:p-4 rounded-xl sm:rounded-2xl border-white/[0.07]">
                  <div className="flex items-center justify-between text-slate-400 mb-1">
                    <span className="text-[9px] sm:text-[10px] uppercase font-bold tracking-wider">Food Waste</span>
                    <AlertTriangle size={14} className="text-rose-400" />
                  </div>
                  <p className="text-base sm:text-xl lg:text-2xl font-mono font-extrabold text-rose-400">$342.10</p>
                  <p className="text-[10px] text-rose-400 font-semibold mt-0.5">-28% scrap</p>
                </div>

                <div className="glass-panel p-3 sm:p-4 rounded-xl sm:rounded-2xl border-white/[0.07] col-span-2 sm:col-span-1">
                  <div className="flex items-center justify-between text-slate-400 mb-1">
                    <span className="text-[9px] sm:text-[10px] uppercase font-bold tracking-wider">VIP Guests</span>
                    <Users size={14} className="text-purple-400" />
                  </div>
                  <p className="text-base sm:text-xl lg:text-2xl font-mono font-extrabold text-purple-300">1,420 RFM</p>
                  <p className="text-[10px] text-purple-400 font-semibold mt-0.5">3.8x repeats</p>
                </div>
              </div>

              {/* Graphical Layout: Velocity Curves & Top Revenue Dishes */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5">
                <div className="lg:col-span-2 glass-panel p-4 sm:p-5 rounded-2xl border-white/[0.07] space-y-3 sm:space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-white">Daily Run Rate & Predictive Velocity</h4>
                      <p className="text-[11px] text-slate-400">Comparing actual table spend against AI baseline</p>
                    </div>
                    <span className="text-[10px] sm:text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded border border-emerald-500/20 self-start sm:self-auto">
                      Surge: Friday Evening
                    </span>
                  </div>

                  {/* 14 Bar Visualization */}
                  <div className="h-36 sm:h-48 lg:h-52 w-full flex items-end gap-1.5 sm:gap-2.5 pt-4 px-1">
                    {[42, 54, 60, 48, 72, 86, 94, 82, 90, 104, 118, 130, 138, 148].map((v, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center gap-1 sm:gap-1.5 h-full justify-end group">
                        <div
                          style={{ height: `${(v / 155) * 100}%` }}
                          className={`w-full rounded-t-sm sm:rounded-t-md transition-all duration-300 ${
                            i >= 10
                              ? 'bg-gradient-to-t from-emerald-600 to-emerald-400 shadow-md shadow-emerald-500/30'
                              : 'bg-navy-800 hover:bg-slate-700'
                          }`}
                        />
                        <span className="text-[8px] sm:text-[9px] font-mono text-slate-500">
                          D{i + 1}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Top Velocity Dishes */}
                <div className="glass-panel p-4 sm:p-5 rounded-2xl border-white/[0.07] space-y-3">
                  <h4 className="text-xs sm:text-sm font-bold text-white">Top Velocity Dishes (Live)</h4>
                  <div className="space-y-2">
                    {[
                      { name: 'Truffle Tagliolini', orders: '184 sold', rev: '$4,416', margin: '78%' },
                      { name: 'Wagyu Ribeye 250g', orders: '142 sold', rev: '$9,656', margin: '68%' },
                      { name: 'Hamachi Crudo', orders: '129 sold', rev: '$2,838', margin: '74%' },
                      { name: 'Burrata Pizza', orders: '116 sold', rev: '$2,552', margin: '82%' },
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2 rounded-xl bg-navy-900/60 border border-white/[0.05] text-xs">
                        <div>
                          <p className="text-slate-200 font-bold truncate max-w-[120px] sm:max-w-none">{item.name}</p>
                          <span className="text-[10px] text-slate-400 font-mono">{item.orders}</span>
                        </div>
                        <div className="text-right">
                          <p className="text-emerald-400 font-mono font-bold">{item.rev}</p>
                          <span className="text-[9px] sm:text-[10px] text-amber-300 font-mono">{item.margin}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Kitchen Telemetry (KDS) */}
          {activeTab === 'kds' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
              {[
                { ticket: '#1042', table: 'Table 4', elapsed: '04:12', status: 'IN PREPARATION', badge: 'bg-amber-500/10 text-amber-300 border-amber-500/30', items: ['2x Wagyu Ribeye 250g (Med-Rare)', '1x Truffle Parmesan Fries'] },
                { ticket: '#1043', table: 'Table 12', elapsed: '08:45', status: 'COOKING - PASS SOON', badge: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30', items: ['1x Hamachi Crudo', '2x Lobster Saffron Risotto', '1x Burrata Salad'] },
                { ticket: '#1044', table: 'Online Delivery', elapsed: '01:20', status: 'NEW TICKET DISPATCHED', badge: 'bg-blue-500/10 text-blue-300 border-blue-500/30', items: ['1x Margherita D.O.P', '1x Tiramisu Al Mascarpone'] },
              ].map((card, i) => (
                <div key={i} className="glass-panel p-4 sm:p-5 rounded-2xl border-white/[0.08] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-white">{card.ticket}</span>
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${card.badge}`}>
                      {card.elapsed}
                    </span>
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-bold text-white font-serif">{card.table}</p>
                    <p className="text-[10px] font-mono text-slate-400">{card.status}</p>
                  </div>
                  <ul className="text-xs text-slate-300 space-y-1 pt-2 border-t border-white/[0.06]">
                    {card.items.map((it, idx) => (
                      <li key={idx} className="flex items-center gap-1.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 flex-shrink-0" />
                        <span className="truncate">{it}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}

          {/* Tab 3: AI Demand Wave */}
          {activeTab === 'forecast' && (
            <div className="p-5 sm:p-8 text-center space-y-3 sm:space-y-4 bg-navy-900/50 rounded-2xl border border-white/[0.07]">
              <Sparkles className="mx-auto text-amber-400" size={28} />
              <h4 className="text-base sm:text-lg font-bold text-white font-serif">Gradient Boosting Regressor Forecaster</h4>
              <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
                Evaluates cyclical day-of-week trends, weather precipitation probability, local footfall vectors, and holiday harmonics to project item-level portions across all 42 menu recipes with 94.2% accuracy.
              </p>
              <div className="pt-2 flex flex-wrap justify-center gap-2 sm:gap-3">
                <span className="text-[11px] sm:text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2.5 sm:px-3 py-1 rounded-lg border border-emerald-500/20">
                  Confidence Score: 94.2%
                </span>
                <span className="text-[11px] sm:text-xs font-mono text-amber-300 bg-amber-500/10 px-2.5 sm:px-3 py-1 rounded-lg border border-amber-500/20">
                  Expected Covers Tonight: 184 Guests
                </span>
              </div>
            </div>
          )}

          {/* Tab 4: Smart Inventory & Alerts */}
          {activeTab === 'inventory' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
              <div className="glass-panel p-4 sm:p-5 rounded-2xl border-white/[0.08] space-y-2 sm:space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs sm:text-sm font-bold text-white">Gram-Level Deductions</span>
                  <span className="text-[10px] sm:text-xs font-mono text-emerald-400">Zero Stockouts</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Every order cooked in the kitchen decrements raw inventory down to the gram. No manual end-of-night counting errors.
                </p>
                <div className="pt-1 text-[11px] sm:text-xs font-mono text-emerald-400">All 38 core stock items maintained within safety margins.</div>
              </div>

              <div className="glass-panel p-4 sm:p-5 rounded-2xl border-white/[0.08] space-y-2 sm:space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs sm:text-sm font-bold text-white">Direct Supplier Dispatch</span>
                  <span className="text-[10px] sm:text-xs font-mono text-amber-300">Auto PO Ready</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Pre-fills purchase orders with supplier lead-time buffers. One click to dispatch via WhatsApp or EDI.
                </p>
                <div className="pt-1 text-[11px] sm:text-xs font-mono text-amber-300">Deliveries scheduled for Thursday 06:00.</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
