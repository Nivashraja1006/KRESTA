import React, { useState, useEffect } from 'react';
import {
  LineChart as LineChartIcon,
  TrendingUp,
  DollarSign,
  Calendar,
  Building2,
  Clock,
  PieChart as PieIcon,
  Download
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import apiClient from '../../api/client';
import { useBranch } from '../../context/BranchContext';
import { DashboardOverview } from '../../types';

const CATEGORY_COLORS = ['#22c55e', '#3b82f6', '#f59e0b', '#ec4899', '#8b5cf6'];

export const AnalyticsPage: React.FC = () => {
  const { selectedBranchId, selectedBranch } = useBranch();
  const [data, setData] = useState<DashboardOverview | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      setIsLoading(true);
      try {
        const resp = await apiClient.get<DashboardOverview>(
          `/analytics/dashboard?branch_id=${selectedBranchId}`
        );
        setData(resp.data);
      } catch (e) {
        console.error('Failed to load analytics:', e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAnalytics();
  }, [selectedBranchId]);

  // Simulated Peak Hours Distribution based on typical dining pattern
  const hourlyData = [
    { hour: '11:00', orders: 4, sales: 85 },
    { hour: '12:00', orders: 18, sales: 420 },
    { hour: '13:00', orders: 26, sales: 650 },
    { hour: '14:00', orders: 14, sales: 310 },
    { hour: '15:00', orders: 6, sales: 120 },
    { hour: '16:00', orders: 5, sales: 95 },
    { hour: '17:00', orders: 11, sales: 240 },
    { hour: '18:00', orders: 22, sales: 540 },
    { hour: '19:00', orders: 34, sales: 890 },
    { hour: '20:00', orders: 38, sales: 980 },
    { hour: '21:00', orders: 24, sales: 610 },
    { hour: '22:00', orders: 10, sales: 220 },
  ];

  const categoryShare = [
    { name: 'Royal Biryanis', value: 42 },
    { name: 'Signature Curries', value: 28 },
    { name: 'Starters & Tapas', value: 16 },
    { name: 'Desserts & Drinks', value: 9 },
    { name: 'Artisan Breads', value: 5 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-0.5 text-xs font-semibold text-blue-400 mb-1">
            <LineChartIcon size={14} />
            <span>Operational Business Intelligence</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Executive Business Analytics</h1>
          <p className="text-sm text-slate-400 mt-0.5">
            Hourly dining traffic, category revenue shares, ticket size distribution for {selectedBranch?.name}.
          </p>
        </div>
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Hourly Dining Peak Heatmap Bar */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                <Clock size={16} className="text-brand-400" />
                <span>Peak Dining Hours & Revenue Distribution</span>
              </h2>
              <p className="text-xs text-slate-400">Lunch vs Dinner dining velocity</p>
            </div>
          </div>

          <div className="h-64 sm:h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={hourlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                <XAxis dataKey="hour" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} tickFormatter={(val) => `$${val}`} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem' }}
                  formatter={(value: any, name: any) => [
                    name === 'sales' ? `$${value}` : `${value} tickets`,
                    name === 'sales' ? 'Gross Sales' : 'Orders Count'
                  ]}
                />
                <Bar dataKey="sales" fill="#22c55e" radius={[6, 6, 0, 0]} name="sales" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Menu Category Share Donut */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2 mb-1">
              <PieIcon size={16} className="text-cyan-400" />
              <span>Category Revenue Share</span>
            </h2>
            <p className="text-xs text-slate-400 mb-4">Percentage of total gross sales</p>

            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryShare}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {categoryShare.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem' }}
                    formatter={(val: any) => [`${val}%`, 'Share']}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="space-y-1.5 pt-2 border-t border-slate-800">
            {categoryShare.map((cat, i) => (
              <div key={i} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: CATEGORY_COLORS[i] }}></span>
                  <span className="text-slate-300">{cat.name}</span>
                </div>
                <span className="font-bold text-white">{cat.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
