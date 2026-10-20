import React, { useState } from 'react';
import {
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Line,
  ComposedChart
} from 'recharts';
import { Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface DataPoint {
  date: string;
  revenue: number;
  orders: number;
  forecast: number;
}

export const AnalyticsPreviewSection: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'7D' | '30D' | '90D'>('7D');

  const dataSets: Record<'7D' | '30D' | '90D', DataPoint[]> = {
    '7D': [
      { date: 'Mon', revenue: 4200, orders: 64, forecast: 4100 },
      { date: 'Tue', revenue: 4800, orders: 72, forecast: 4650 },
      { date: 'Wed', revenue: 5100, orders: 79, forecast: 5000 },
      { date: 'Thu', revenue: 6400, orders: 98, forecast: 6200 },
      { date: 'Fri', revenue: 9200, orders: 142, forecast: 8900 },
      { date: 'Sat', revenue: 11400, orders: 178, forecast: 11200 },
      { date: 'Sun', revenue: 8600, orders: 130, forecast: 8800 },
    ],
    '30D': [
      { date: 'Wk 1', revenue: 34200, orders: 510, forecast: 33800 },
      { date: 'Wk 2', revenue: 38900, orders: 590, forecast: 37500 },
      { date: 'Wk 3', revenue: 42100, orders: 640, forecast: 41900 },
      { date: 'Wk 4', revenue: 46872, orders: 711, forecast: 46200 },
    ],
    '90D': [
      { date: 'Month 1', revenue: 124000, orders: 1920, forecast: 122000 },
      { date: 'Month 2', revenue: 148500, orders: 2280, forecast: 145000 },
      { date: 'Month 3', revenue: 168900, orders: 2540, forecast: 166000 },
    ],
  };

  const activeData = dataSets[timeRange];

  return (
    <section id="analytics-preview" className="py-20 sm:py-28 lg:py-32 relative bg-[#070a14] border-t border-white/[0.06] overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/3 left-1/4 w-[350px] sm:w-[500px] h-[350px] sm:h-[500px] bg-emerald-500/5 rounded-full blur-[100px] sm:blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5 sm:gap-6 mb-8 sm:mb-12 lg:mb-16">
          <div className="space-y-3 sm:space-y-4 max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-navy-950/80 px-3.5 py-1.5 text-[11px] sm:text-xs font-bold text-amber-300">
              <Sparkles size={13} />
              <span>PREDICTIVE ACCURACY</span>
            </div>
            <h2 className="font-serif fluid-section-headline font-bold text-white tracking-tight">
              See Your Restaurant <br />
              <span className="emerald-gradient-text">Before the Shift Starts.</span>
            </h2>
            <p className="fluid-subheadline text-slate-300 leading-relaxed font-normal">
              Eliminate guesswork with dual-horizon machine learning forecasting. Anticipate guest covers, schedule kitchen stations accurately, and procure raw ingredients just-in-time.
            </p>
          </div>

          {/* Time Filter Pills */}
          <div className="flex items-center gap-1.5 sm:gap-2 rounded-2xl bg-navy-900/90 border border-white/[0.08] p-1.5 self-start lg:self-end">
            {(['7D', '30D', '90D'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all touch-target ${
                  timeRange === range
                    ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20'
                    : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                {range === '7D' ? '7 Days' : range === '30D' ? '30 Days' : '90 Days'}
              </button>
            ))}
          </div>
        </div>

        {/* Main Chart Canvas + Algorithmic Insight Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
          {/* Chart Canvas (8 cols) */}
          <div className="lg:col-span-8 glass-panel p-4 sm:p-6 lg:p-8 rounded-2xl sm:rounded-3xl border-white/[0.08] relative overflow-hidden space-y-4 sm:space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
              <div>
                <h3 className="text-sm sm:text-lg font-bold text-white font-serif flex items-center gap-2">
                  <span>Actual Revenue vs. ML Forecast</span>
                </h3>
                <p className="text-[11px] sm:text-xs text-slate-400">
                  GBR confidence interval &plusmn;3.8% &bull; <span className="text-amber-300 font-mono">Demo Data</span>
                </p>
              </div>

              <div className="flex items-center gap-3 sm:gap-4 text-[11px] sm:text-xs font-mono">
                <div className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full bg-emerald-400" />
                  <span className="text-slate-300">Actual</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full bg-amber-400" />
                  <span className="text-slate-300">AI Forecast</span>
                </div>
              </div>
            </div>

            {/* Recharts Chart Container - responsive height */}
            <div className="h-60 xs:h-72 sm:h-80 lg:h-84 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={activeData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="actualSalesGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#141d33" opacity={0.6} />
                  <XAxis dataKey="date" stroke="#64748b" fontSize={10} tickLine={false} />
                  <YAxis
                    stroke="#64748b"
                    fontSize={10}
                    tickFormatter={(val) => `$${val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val}`}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#070b16',
                      borderColor: 'rgba(255,255,255,0.1)',
                      borderRadius: '0.75rem',
                      boxShadow: '0 20px 30px -5px rgba(0, 0, 0, 0.8)',
                      fontSize: '11px',
                    }}
                    labelStyle={{ color: '#f8fafc', fontWeight: 'bold' }}
                    formatter={(val: any, name: any) => [
                      `$${Number(val).toLocaleString()}`,
                      name === 'revenue' ? 'Actual Revenue' : 'AI Forecast',
                    ]}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#10b981"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#actualSalesGrad)"
                  />
                  <Line
                    type="monotone"
                    dataKey="forecast"
                    stroke="#d4af37"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={{ r: 3, fill: '#d4af37' }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>

            {/* Bottom 4 Mini KPIs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 pt-3.5 sm:pt-4 border-t border-white/[0.06]">
              <div className="p-2.5 sm:p-3 rounded-xl bg-navy-900/40 border border-white/[0.05]">
                <p className="text-[9px] sm:text-[10px] uppercase font-bold text-slate-400">Model Accuracy</p>
                <p className="text-sm sm:text-base font-extrabold text-white font-mono mt-0.5">94.2%</p>
                <span className="text-[9px] sm:text-[10px] text-emerald-400 font-semibold">&plusmn;3.8% band</span>
              </div>
              <div className="p-2.5 sm:p-3 rounded-xl bg-navy-900/40 border border-white/[0.05]">
                <p className="text-[9px] sm:text-[10px] uppercase font-bold text-slate-400">Gross Margin</p>
                <p className="text-sm sm:text-base font-extrabold text-emerald-400 font-mono mt-0.5">71.6%</p>
                <span className="text-[9px] sm:text-[10px] text-emerald-400 font-semibold">+4.2% MoM</span>
              </div>
              <div className="p-2.5 sm:p-3 rounded-xl bg-navy-900/40 border border-white/[0.05]">
                <p className="text-[9px] sm:text-[10px] uppercase font-bold text-slate-400">Food Cost %</p>
                <p className="text-sm sm:text-base font-extrabold text-amber-300 font-mono mt-0.5">28.4%</p>
                <span className="text-[9px] sm:text-[10px] text-amber-400 font-semibold">Optimal target</span>
              </div>
              <div className="p-2.5 sm:p-3 rounded-xl bg-navy-900/40 border border-white/[0.05]">
                <p className="text-[9px] sm:text-[10px] uppercase font-bold text-slate-400">Ticket Pacing</p>
                <p className="text-sm sm:text-base font-extrabold text-white font-mono mt-0.5">11.4 min</p>
                <span className="text-[9px] sm:text-[10px] text-blue-400 font-semibold">Kitchen synced</span>
              </div>
            </div>
          </div>

          {/* Right Column: Algorithmic Insight Cards (4 cols) */}
          <div className="lg:col-span-4 space-y-4 sm:space-y-5">
            <div className="glass-panel-gold p-5 sm:p-7 rounded-2xl sm:rounded-3xl border-amber-500/30 space-y-3 sm:space-y-4 shadow-xl">
              <div className="flex items-center gap-2 text-amber-300">
                <Sparkles size={16} />
                <span className="text-xs font-bold uppercase tracking-wider font-mono">Algorithmic Advisory</span>
              </div>

              <h4 className="text-base sm:text-lg font-bold text-white font-serif leading-snug">
                Weekend dinner demand is projected to increase by <span className="text-amber-300">+18%</span>.
              </h4>

              <p className="text-xs text-slate-300 leading-relaxed">
                Correlated against historical Friday-Sunday reservations, local temperature (+3°C), and pay-week cycles. Automated inventory safety buffers are queued for chef sign-off.
              </p>

              <div className="pt-2.5 sm:pt-3 border-t border-white/[0.08] space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Target Shift:</span>
                  <span className="font-semibold text-white font-mono">Fri 18:00 - Sun 22:30</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Inventory Readiness:</span>
                  <span className="font-semibold text-emerald-400 font-mono">100% Prepared</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Projected Extra Yield:</span>
                  <span className="font-semibold text-amber-300 font-mono">+$4,250 Gross</span>
                </div>
              </div>
            </div>

            <div className="glass-panel p-5 sm:p-6 rounded-2xl sm:rounded-3xl border-white/[0.08] space-y-2.5 sm:space-y-3">
              <div className="flex items-center gap-2 text-emerald-400">
                <CheckCircle2 size={15} />
                <span className="text-xs font-bold uppercase tracking-wider font-mono">Continuous Feedback</span>
              </div>
              <h5 className="text-sm font-bold text-white font-serif">Self-Calibrating Decision Loop</h5>
              <p className="text-xs text-slate-300 leading-relaxed">
                As guest checks close, KRESTA recalculates mean absolute percentage error (MAPE) every midnight, tuning your restaurant’s forecasting weights automatically.
              </p>
              <div className="pt-1">
                <Link
                  to="/analytics"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 hover:text-emerald-300 touch-target"
                >
                  <span>Open Full Analytics View</span>
                  <ArrowRight size={13} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
