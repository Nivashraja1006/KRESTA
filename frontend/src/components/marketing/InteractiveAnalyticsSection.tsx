import React, { useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Line,
  ComposedChart
} from 'recharts';
import { TrendingUp, Sparkles, Calendar, ArrowUpRight, CheckCircle2 } from 'lucide-react';

interface DataPoint {
  date: string;
  revenue: number;
  orders: number;
  forecast: number;
}

export const InteractiveAnalyticsSection: React.FC = () => {
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
    <section className="py-24 relative bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3.5 py-1 text-xs font-bold text-amber-300">
              <Sparkles size={14} />
              <span>PREDICTIVE PRECISION</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              SEE YOUR RESTAURANT <br />
              <span className="emerald-gradient-text">BEFORE IT HAPPENS.</span>
            </h2>
            <p className="text-sm sm:text-base text-slate-400 max-w-xl">
              Eliminate guesswork with dual-horizon machine learning forecasting. Anticipate guest demand, schedule staff accurately, and procure raw ingredients just-in-time.
            </p>
          </div>

          {/* Time Filter Pills */}
          <div className="flex items-center gap-2 rounded-2xl bg-slate-900 border border-slate-800 p-1.5 self-start lg:self-end">
            {(['7D', '30D', '90D'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  timeRange === range
                    ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                {range === '7D' ? '7 Days' : range === '30D' ? '30 Days' : '90 Days'}
              </button>
            ))}
          </div>
        </div>

        {/* Main Chart Card + AI Insight Callout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Interactive Recharts Canvas */}
          <div className="lg:col-span-2 glass-card p-6 sm:p-8 rounded-3xl relative overflow-hidden">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                  <span>Actual Sales vs. Machine Learning Forecast</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Gradient Boosting Regressor confidence interval &plusmn;3.8%
                </p>
              </div>

              <div className="flex items-center gap-4 text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="h-3 w-3 rounded-full bg-emerald-400" />
                  <span className="text-slate-300 font-medium">Actual Sales</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="h-3 w-3 rounded-full bg-amber-400" />
                  <span className="text-slate-300 font-medium">AI Forecast</span>
                </div>
              </div>
            </div>

            <div className="h-72 sm:h-84 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={activeData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                  <defs>
                    <linearGradient id="actualSalesGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22c55e" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#22c55e" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.6} />
                  <XAxis dataKey="date" stroke="#64748b" fontSize={11} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={11} tickFormatter={(val) => `$${val >= 1000 ? `${(val/1000).toFixed(0)}k` : val}`} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#090d16',
                      borderColor: '#334155',
                      borderRadius: '1rem',
                      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)',
                    }}
                    labelStyle={{ color: '#f8fafc', fontWeight: 'bold' }}
                    formatter={(val: any, name: any) => [
                      `$${Number(val).toLocaleString()}`,
                      name === 'revenue' ? 'Actual Revenue' : 'AI Predicted Demand',
                    ]}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#22c55e"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#actualSalesGrad)"
                  />
                  <Line
                    type="monotone"
                    dataKey="forecast"
                    stroke="#f59e0b"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={{ r: 4, fill: '#f59e0b' }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Prominent AI Insight Card */}
          <div className="space-y-6">
            <div className="rounded-3xl border border-amber-500/30 bg-gradient-to-br from-amber-500/10 via-slate-900 to-slate-900 p-6 sm:p-7 relative overflow-hidden shadow-xl">
              <div className="flex items-center gap-2 text-amber-400 mb-3">
                <Sparkles size={18} />
                <span className="text-xs font-bold uppercase tracking-wider">Algorithmic Insight</span>
              </div>

              <h4 className="text-xl font-extrabold text-white leading-snug">
                Weekend demand is projected to increase by <span className="text-amber-300">18%</span>.
              </h4>

              <p className="text-xs text-slate-300 mt-3 leading-relaxed">
                Correlated against historical Friday–Sunday velocity and local footfall vectors. Automated inventory safety buffers have been queued for chef sign-off.
              </p>

              <div className="mt-5 space-y-2.5 pt-4 border-t border-slate-800">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Target Shift:</span>
                  <span className="font-semibold text-white">Friday 18:00 – Sunday 22:30</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Inventory Preparedness:</span>
                  <span className="font-semibold text-emerald-400">100% Ready</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Estimated Extra Yield:</span>
                  <span className="font-semibold text-amber-300">+$4,250 Revenue</span>
                </div>
              </div>
            </div>

            {/* Quick action card */}
            <div className="glass-card p-6 rounded-3xl space-y-3">
              <div className="flex items-center gap-2 text-emerald-400">
                <CheckCircle2 size={16} />
                <span className="text-xs font-bold uppercase tracking-wider">Automated Workflows</span>
              </div>
              <h5 className="text-sm font-bold text-white">Continuous Self-Learning Loop</h5>
              <p className="text-xs text-slate-400 leading-relaxed">
                As orders close in the POS, KRESTA recalculates mean absolute error (MAE) each midnight, perpetually tuning your restaurant's forecasting weights.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
