import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  LayoutDashboard,
  ChefHat,
  TrendingUp,
  Package,
  Trash2,
  Users,
  ArrowRight,
  ExternalLink,
  Sparkles,
  DollarSign,
  ShoppingBag
} from 'lucide-react';

export const DashboardPreviewSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'kds' | 'forecast' | 'inventory'>('overview');

  return (
    <section className="py-24 relative bg-slate-900/40 border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-3">
            <p className="font-serif text-xs font-bold tracking-widest text-amber-400 uppercase">
              OPERATIONAL HUB
            </p>
            <h2 className="font-serif text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
              ONE COMMAND CENTER. <br />
              <span className="emerald-gradient-text">EVERYTHING CONNECTED.</span>
            </h2>
            <p className="text-sm sm:text-base text-slate-400 max-w-xl">
              An integrated mission control replacing disjointed point solutions. Monitor ticket backlogs, recipe yield variance, and customer lifetime metrics on one screen.
            </p>
          </div>

          <Link
            to="/login"
            className="self-start md:self-end inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 px-6 py-3 text-xs font-bold text-slate-950 shadow-lg shadow-emerald-500/20 hover:from-emerald-400 hover:to-emerald-500 transition-all"
          >
            <span>Explore Platform</span>
            <ArrowRight size={15} />
          </Link>
        </div>

        {/* Tab Controls */}
        <div className="flex flex-wrap items-center gap-2 mb-6 border-b border-slate-800 pb-3">
          {[
            { id: 'overview', label: 'Executive Overview', icon: LayoutDashboard },
            { id: 'kds', label: 'Kitchen Display (KDS)', icon: ChefHat },
            { id: 'forecast', label: 'AI Demand Forecast', icon: TrendingUp },
            { id: 'inventory', label: 'Smart Inventory', icon: Package },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Icon size={14} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Dashboard Preview Frame */}
        <div className="rounded-3xl border border-slate-800 bg-slate-950 shadow-2xl overflow-hidden p-4 sm:p-6 relative">
          {/* Top Bar inside mockup */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-800/80 mb-6">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-slate-900 border border-amber-500/30 p-1 flex items-center justify-center">
                <img src="/kresta-logo-mark.png" alt="KRESTA" className="h-full w-full object-contain" />
              </div>
              <div>
                <p className="text-xs font-extrabold text-white">KRESTA Command Center</p>
                <p className="text-[10px] text-slate-400">Downtown Flagship &bull; Chef Session Active</p>
              </div>
            </div>

            <Link
              to="/login"
              className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1.5 bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20"
            >
              <span>Launch Live View</span>
              <ExternalLink size={12} />
            </Link>
          </div>

          {/* Conditional Content by Active Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* 5 Mockup Metric Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
                <div className="glass-card p-3.5 rounded-2xl">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Total Revenue</p>
                  <p className="text-lg font-mono font-extrabold text-white mt-1">$46,872.00</p>
                  <p className="text-[10px] text-emerald-400 font-semibold mt-0.5">+14.2% MoM</p>
                </div>

                <div className="glass-card p-3.5 rounded-2xl">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Orders</p>
                  <p className="text-lg font-mono font-extrabold text-white mt-1">711 Tickets</p>
                  <p className="text-[10px] text-blue-400 font-semibold mt-0.5">8.1% Volume</p>
                </div>

                <div className="glass-card p-3.5 rounded-2xl">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">AI Forecast</p>
                  <p className="text-lg font-mono font-extrabold text-amber-300 mt-1">+18% Peak</p>
                  <p className="text-[10px] text-amber-400 font-semibold mt-0.5">Confidence 94%</p>
                </div>

                <div className="glass-card p-3.5 rounded-2xl">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Food Waste</p>
                  <p className="text-lg font-mono font-extrabold text-rose-400 mt-1">$342.10</p>
                  <p className="text-[10px] text-rose-400 font-semibold mt-0.5">-28% vs baseline</p>
                </div>

                <div className="glass-card p-3.5 rounded-2xl col-span-2 sm:col-span-1">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Customer RFM</p>
                  <p className="text-lg font-mono font-extrabold text-purple-400 mt-1">1,420 VIPs</p>
                  <p className="text-[10px] text-purple-400 font-semibold mt-0.5">3.8x Retention</p>
                </div>
              </div>

              {/* Graphic Split */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="lg:col-span-2 rounded-2xl bg-slate-900/80 border border-slate-800 p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-white">Daily Velocity Comparison</span>
                    <span className="text-[10px] text-slate-400">14-Day Trajectory</span>
                  </div>
                  <div className="h-44 w-full flex items-end gap-2 px-2">
                    {[38, 52, 60, 48, 70, 85, 92, 78, 88, 95, 110, 125, 130, 142].map((v, i) => (
                      <div key={i} className="flex-1 bg-slate-800 hover:bg-emerald-500 rounded-t-md transition-all duration-300" style={{ height: `${(v / 150) * 100}%` }} />
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-4 space-y-3">
                  <span className="text-xs font-bold text-white">Top Velocity Dishes</span>
                  <div className="space-y-2">
                    {[
                      { name: 'Truffle Tagliolini', orders: 184, rev: '$4,416' },
                      { name: 'Wagyu Ribeye 250g', orders: 142, rev: '$7,810' },
                      { name: 'Hamachi Crudo', orders: 129, rev: '$2,838' },
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs">
                        <span className="text-slate-200 font-medium">{item.name}</span>
                        <div className="text-right">
                          <span className="text-emerald-400 font-bold font-mono">{item.orders}</span>
                          <span className="text-[10px] text-slate-500 block">{item.rev}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'kds' && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { ticket: '#1042', table: 'Table 4', elapsed: '04:12', status: 'IN PREPARATION', items: ['2x Wagyu Ribeye', '1x Truffle Fries'] },
                { ticket: '#1043', table: 'Table 12', elapsed: '08:45', status: 'COOKING', items: ['1x Hamachi Crudo', '2x Lobster Risotto'] },
                { ticket: '#1044', table: 'Delivery', elapsed: '01:20', status: 'NEW TICKET', items: ['1x Margherita D.O.P', '1x Tiramisu'] },
              ].map((card, i) => (
                <div key={i} className="rounded-2xl bg-slate-900 border border-slate-800 p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold font-mono text-white">{card.ticket}</span>
                    <span className="text-[10px] font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded">
                      {card.elapsed}
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-slate-300">{card.table}</p>
                  <ul className="text-xs text-slate-400 space-y-1">
                    {card.items.map((it, idx) => (
                      <li key={idx} className="flex items-center gap-1.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                        <span>{it}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'forecast' && (
            <div className="p-6 text-center space-y-3 bg-slate-900/60 rounded-2xl border border-slate-800">
              <Sparkles className="mx-auto text-amber-400" size={28} />
              <h4 className="text-base font-bold text-white">Gradient Boosting ML Forecaster</h4>
              <p className="text-xs text-slate-400 max-w-lg mx-auto">
                Machine learning model calculates demand probability distributions across all 42 menu items, accounting for local rain probability, holidays, and past sales velocity.
              </p>
            </div>
          )}

          {activeTab === 'inventory' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="rounded-2xl bg-slate-900 border border-slate-800 p-4 space-y-2">
                <span className="text-xs font-bold text-white">Automated Reorder Alerts</span>
                <p className="text-xs text-slate-400">Zero manual counts required. Every dish cooked decrements raw gram inventory.</p>
                <div className="pt-2 text-xs font-mono text-emerald-400">All 38 core stock items within safety margins.</div>
              </div>
              <div className="rounded-2xl bg-slate-900 border border-slate-800 p-4 space-y-2">
                <span className="text-xs font-bold text-white">Direct Supplier Dispatch</span>
                <p className="text-xs text-slate-400">Generates ready-to-send purchase orders with supplier lead-time buffers.</p>
                <div className="pt-2 text-xs font-mono text-amber-300">Supplier deliveries scheduled for Thursday 06:00.</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
