import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  DollarSign,
  ShoppingBag,
  TrendingUp,
  Users,
  Trash2,
  AlertTriangle,
  Lightbulb,
  ArrowRight,
  Package,
  Calendar,
  Sparkles,
  RefreshCw,
  Utensils
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend
} from 'recharts';
import { useAuth } from '../../context/AuthContext';
import { useBranch } from '../../context/BranchContext';
import apiClient from '../../api/client';
import { DashboardOverview } from '../../types';
import { StatCard } from '../../components/common/StatCard';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Button } from '../../components/common/Button';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { selectedBranchId, selectedBranch } = useBranch();
  const navigate = useNavigate();

  const [data, setData] = useState<DashboardOverview | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  const fetchDashboardData = async () => {
    setIsLoading(true);
    setError('');
    try {
      const resp = await apiClient.get<DashboardOverview>(
        `/analytics/dashboard?branch_id=${selectedBranchId}`
      );
      setData(resp.data);
    } catch (err: any) {
      console.error('Failed to load dashboard:', err);
      setError('Failed to fetch live restaurant metrics.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [selectedBranchId]);

  const getTimeGreeting = () => {
    const hr = new Date().getHours();
    if (hr < 12) return 'Good Morning';
    if (hr < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <div className="space-y-6">
      {/* Header Greeting */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <span>{getTimeGreeting()}, {user?.full_name?.split(' ')[0] || 'Chef'}</span>
            <span className="text-xl">👋</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Real-time intelligence and operations command for <span className="text-brand-400 font-semibold">{selectedBranch?.name || 'Downtown Flagship'}</span>
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchDashboardData}
            isLoading={isLoading}
            leftIcon={<RefreshCw size={14} />}
          >
            Refresh Data
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate('/orders')}
            leftIcon={<ShoppingBag size={14} />}
          >
            New Order (POS)
          </Button>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-400">
          {error}
        </div>
      )}

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          title="Total Revenue"
          value={`$${(data?.total_revenue || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          change={data?.revenue_growth_pct || 12.4}
          changeText="vs last month"
          icon={DollarSign}
          iconColor="text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
        />
        <StatCard
          title="Total Orders"
          value={(data?.total_orders || 0).toLocaleString()}
          change={data?.orders_growth_pct || 8.1}
          changeText="volume growth"
          icon={ShoppingBag}
          iconColor="text-blue-400 bg-blue-500/10 border-blue-500/20"
        />
        <StatCard
          title="Average Order Value"
          value={`$${(data?.average_order_value || 0).toFixed(2)}`}
          change={4.2}
          changeText="per ticket"
          icon={TrendingUp}
          iconColor="text-purple-400 bg-purple-500/10 border-purple-500/20"
        />
        <StatCard
          title="Active Customers"
          value={(data?.total_customers || 0).toLocaleString()}
          subtitle="Profiled in database"
          icon={Users}
          iconColor="text-cyan-400 bg-cyan-500/10 border-cyan-500/20"
        />
        <StatCard
          title="Food Waste Cost"
          value={`$${(data?.total_food_waste_cost || 0).toFixed(2)}`}
          subtitle="Estimated scrap & plate"
          icon={Trash2}
          iconColor="text-rose-400 bg-rose-500/10 border-rose-500/20"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Trend Area Chart */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">Revenue & Orders Performance</h2>
              <p className="text-xs text-slate-400">14-day chronological sales trend</p>
            </div>
            <Link to="/analytics" className="text-xs font-semibold text-brand-400 hover:text-brand-300 flex items-center gap-1">
              <span>Deep Analytics</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="h-64 sm:h-72 w-full">
            {data?.revenue_trends && data.revenue_trends.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.revenue_trends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22c55e" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                  <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} tickFormatter={(val) => val.slice(5)} />
                  <YAxis stroke="#94a3b8" fontSize={11} tickFormatter={(val) => `$${val}`} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem' }}
                    labelStyle={{ color: '#cbd5e1', fontWeight: 600 }}
                    formatter={(value: any) => [`$${Number(value).toFixed(2)}`, 'Revenue']}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="#22c55e" strokeWidth={2.5} fillOpacity={1} fill="url(#colorRevenue)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-xs text-slate-500">
                Loading revenue trend...
              </div>
            )}
          </div>
        </div>

        {/* Top Selling Menu Items */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">Top Velocity Dishes</h2>
              <p className="text-xs text-slate-400">Ranked by volume ordered</p>
            </div>
            <Link to="/menu" className="text-xs font-semibold text-brand-400 hover:text-brand-300">
              Menu
            </Link>
          </div>

          <div className="flex-1 space-y-3">
            {data?.top_selling_items && data.top_selling_items.length > 0 ? (
              data.top_selling_items.map((item, idx) => (
                <div key={item.id} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-800/40 border border-slate-800">
                  <div className="flex items-center gap-3">
                    <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-slate-800 text-xs font-bold text-slate-300">
                      {idx + 1}
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-white truncate max-w-[140px] sm:max-w-[180px]">{item.name}</p>
                      <p className="text-xs text-slate-400">${item.price.toFixed(2)} each</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-emerald-400">{item.sold_qty} sold</p>
                    <p className="text-[11px] text-slate-500">${item.gross_sales.toFixed(0)}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-500 text-center py-6">No sales recorded yet</p>
            )}
          </div>
        </div>
      </div>

      {/* Operational Highlights Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* AI Generated Business Insights */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Sparkles size={18} className="text-brand-400" />
              <h2 className="text-base font-bold text-white tracking-tight">AI Executive Insights</h2>
            </div>
            <Link to="/ai-assistant" className="text-xs font-semibold text-brand-400 hover:text-brand-300">
              Ask AI &rarr;
            </Link>
          </div>

          <div className="space-y-3">
            {data?.ai_insights && data.ai_insights.length > 0 ? (
              data.ai_insights.map((insight) => (
                <div
                  key={insight.id}
                  className="p-3.5 rounded-xl border border-slate-800 bg-slate-800/30 hover:border-slate-700 transition-colors"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-brand-400 bg-brand-500/10 px-2 py-0.5 rounded-md">
                      {insight.category}
                    </span>
                    <span className={`text-[10px] font-semibold ${
                      insight.impact_level === 'ACTION_REQUIRED' ? 'text-rose-400' : 'text-amber-400'
                    }`}>
                      {insight.impact_level.replace('_', ' ')}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-200 mt-1">{insight.title}</h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">{insight.insight_text}</p>
                  {insight.recommended_action && (
                    <div className="mt-2 text-[11px] text-slate-300 bg-slate-900/60 p-2 rounded-lg border border-slate-800/80">
                      <span className="font-semibold text-brand-400">Action: </span>
                      {insight.recommended_action}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-500 text-center py-6">All systems optimal.</p>
            )}
          </div>
        </div>

        {/* Low Inventory Warnings */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Package size={18} className="text-amber-400" />
              <h2 className="text-base font-bold text-white tracking-tight">Stock Reorder Alerts</h2>
            </div>
            <Link to="/recommendations" className="text-xs font-semibold text-brand-400 hover:text-brand-300">
              AI Optimizer &rarr;
            </Link>
          </div>

          <div className="space-y-2.5">
            {data?.low_stock_items && data.low_stock_items.length > 0 ? (
              data.low_stock_items.map((ing) => (
                <div
                  key={ing.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-800/30 border border-slate-800"
                >
                  <div>
                    <p className="text-sm font-semibold text-white">{ing.name}</p>
                    <p className="text-xs text-slate-400">
                      Current: <span className="text-amber-400 font-bold">{ing.current_stock} {ing.unit}</span> / Min: {ing.minimum_stock} {ing.unit}
                    </p>
                  </div>
                  <StatusBadge status={ing.current_stock <= 0 ? 'CRITICAL' : 'LOW'} size="sm" />
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-500 text-center py-6">All ingredient stocks healthy.</p>
            )}
          </div>
        </div>

        {/* Recent Kitchen & POS Orders */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <ShoppingBag size={18} className="text-blue-400" />
              <h2 className="text-base font-bold text-white tracking-tight">Recent Orders</h2>
            </div>
            <Link to="/orders" className="text-xs font-semibold text-brand-400 hover:text-brand-300">
              View All &rarr;
            </Link>
          </div>

          <div className="space-y-2.5">
            {data?.recent_orders && data.recent_orders.length > 0 ? (
              data.recent_orders.map((ord) => (
                <div
                  key={ord.id}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-800/30 border border-slate-800"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">{ord.order_number}</span>
                      <span className="text-[10px] text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">
                        {ord.table_number ? `Tbl ${ord.table_number}` : ord.order_type}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-500">{ord.time}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-white mb-0.5">${ord.total_amount.toFixed(2)}</p>
                    <StatusBadge status={ord.status} size="sm" />
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-500 text-center py-6">No active tickets.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
