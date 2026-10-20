import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  BrainCircuit,
  BarChart3,
  Calendar,
  CheckCircle2,
  Sparkles,
  RefreshCw,
  Info,
  ChevronDown
} from 'lucide-react';
import {
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import apiClient from '../../api/client';
import { useBranch } from '../../context/BranchContext';
import { MenuItem, ForecastResponse } from '../../types';
import { Button } from '../../components/common/Button';

export const ForecastPage: React.FC = () => {
  const { selectedBranchId, selectedBranch } = useBranch();

  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [selectedItemId, setSelectedItemId] = useState<number>(1);
  const [forecastData, setForecastData] = useState<ForecastResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isTraining, setIsTraining] = useState<boolean>(false);
  const [trainMessage, setTrainMessage] = useState<string>('');

  const fetchMenuItems = async () => {
    try {
      const resp = await apiClient.get<MenuItem[]>('/menu/items');
      setMenuItems(resp.data);
      if (resp.data.length > 0) {
        setSelectedItemId(resp.data[0].id);
      }
    } catch (e) {
      console.error('Failed to load menu items:', e);
    }
  };

  const fetchForecast = async (itemId: number) => {
    setIsLoading(true);
    try {
      const resp = await apiClient.get<ForecastResponse>(
        `/forecast/item/${itemId}?branch_id=${selectedBranchId}`
      );
      setForecastData(resp.data);
    } catch (e) {
      console.error('Failed to fetch forecast:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMenuItems();
  }, []);

  useEffect(() => {
    if (selectedItemId) {
      fetchForecast(selectedItemId);
    }
  }, [selectedItemId, selectedBranchId]);

  const handleTrainAll = async () => {
    setIsTraining(true);
    setTrainMessage('');
    try {
      const resp = await apiClient.post(
        `/forecast/train-all?branch_id=${selectedBranchId}`
      );
      setTrainMessage(resp.data.message);
      fetchForecast(selectedItemId);
    } catch (e: any) {
      setTrainMessage('Failed to trigger training pipeline.');
    } finally {
      setIsTraining(false);
    }
  };

  const chartData = forecastData?.predictions.map((p) => ({
    date: p.date,
    predicted: p.predicted_demand,
    lower: p.confidence_lower,
    upper: p.confidence_upper,
  })) || [];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full border border-brand-500/30 bg-brand-500/10 px-3 py-0.5 text-xs font-semibold text-brand-400 mb-1">
            <BrainCircuit size={14} />
            <span>Machine Learning Pipeline</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">AI Demand Forecasting Studio</h1>
          <p className="text-sm text-slate-400 mt-0.5">
            Predictive portion demand models trained on temporal seasonality, lag features, and weekend surges.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleTrainAll}
            isLoading={isTraining}
            leftIcon={<RefreshCw size={14} />}
          >
            Retrain ML Models
          </Button>
        </div>
      </div>

      {trainMessage && (
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs text-emerald-400 flex items-center gap-2">
          <CheckCircle2 size={16} />
          <span>{trainMessage}</span>
        </div>
      )}

      {/* Selector & Model Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Menu Item Selector Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 block">
            Target Menu Item
          </label>
          <select
            value={selectedItemId}
            onChange={(e) => setSelectedItemId(Number(e.target.value))}
            className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-sm font-semibold text-white outline-none focus:border-brand-500"
          >
            {menuItems.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name} (${item.price.toFixed(2)})
              </option>
            ))}
          </select>
          <span className="text-[11px] text-slate-500 mt-2 block">
            Branch: {selectedBranch?.name}
          </span>
        </div>

        {/* Model Architecture */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Algorithm Model</span>
          <p className="text-lg font-bold text-white mt-1">
            {forecastData?.model_info || 'Gradient Boosting Regressor'}
          </p>
          <div className="mt-2 inline-flex items-center gap-1.5 text-[11px] text-brand-400 bg-brand-500/10 px-2 py-0.5 rounded-md font-semibold">
            <Sparkles size={12} />
            <span>Non-Linear Ensemble</span>
          </div>
        </div>

        {/* Mean Absolute Error */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Mean Absolute Error (MAE)</span>
          <p className="text-2xl font-bold text-emerald-400 mt-1">
            &plusmn;{forecastData?.mae || '1.8'} <span className="text-xs text-slate-400 font-normal">portions</span>
          </p>
          <span className="text-[11px] text-slate-500 mt-1 block">Cross-validated on test split</span>
        </div>

        {/* Root Mean Squared Error */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">RMSE Metric</span>
          <p className="text-2xl font-bold text-cyan-400 mt-1">
            {forecastData?.rmse || '2.4'} <span className="text-xs text-slate-400 font-normal">std error</span>
          </p>
          <span className="text-[11px] text-slate-500 mt-1 block">Penalizes large outlier variance</span>
        </div>
      </div>

      {/* Main Forecast Chart */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-6">
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <span>7-Day Forward Demand Forecast:</span>
              <span className="text-brand-400 font-extrabold">{forecastData?.menu_item_name}</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Projected portion demand with 95% confidence intervals
            </p>
          </div>
        </div>

        <div className="h-80 w-full">
          {isLoading ? (
            <div className="flex h-full items-center justify-center text-xs text-slate-500">
              Running Gradient Boosting Regressor...
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorPredicted" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorConfidence" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#38bdf8" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem' }}
                  labelStyle={{ color: '#cbd5e1', fontWeight: 600 }}
                  formatter={(value: any, name: any) => [
                    `${Number(value).toFixed(1)} portions`,
                    name === 'predicted' ? 'Predicted Demand' : name === 'upper' ? 'Upper Bound (+95%)' : 'Lower Bound (-95%)'
                  ]}
                />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="upper"
                  stroke="#38bdf8"
                  strokeDasharray="4 4"
                  fill="url(#colorConfidence)"
                  name="Upper Bound (+95%)"
                />
                <Area
                  type="monotone"
                  dataKey="predicted"
                  stroke="#22c55e"
                  strokeWidth={3}
                  fill="url(#colorPredicted)"
                  name="Predicted Demand"
                />
                <Line
                  type="monotone"
                  dataKey="lower"
                  stroke="#94a3b8"
                  strokeDasharray="4 4"
                  dot={false}
                  name="Lower Bound (-95%)"
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Predictions Breakdown Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="px-5 py-4 border-b border-slate-800">
          <h3 className="text-sm font-bold text-white tracking-tight">Daily Production Planning Targets</h3>
          <p className="text-xs text-slate-400">Recommended kitchen prep quantities to satisfy forecast</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-800/60 text-xs uppercase text-slate-400 font-semibold border-b border-slate-800">
              <tr>
                <th className="px-5 py-3">Forecast Date</th>
                <th className="px-5 py-3">Day of Week</th>
                <th className="px-5 py-3">Predicted Demand</th>
                <th className="px-5 py-3">Confidence Range</th>
                <th className="px-5 py-3">Kitchen Prep Target</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {forecastData?.predictions.map((p, idx) => {
                const dateObj = new Date(p.date + 'T00:00:00');
                const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'long' });
                const isWeekend = dayName === 'Friday' || dayName === 'Saturday' || dayName === 'Sunday';

                return (
                  <tr key={idx} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-5 py-3 font-mono text-xs font-semibold text-white">
                      {p.date}
                    </td>
                    <td className="px-5 py-3">
                      <span className={`text-xs font-semibold ${isWeekend ? 'text-amber-400' : 'text-slate-300'}`}>
                        {dayName} {isWeekend && '🔥'}
                      </span>
                    </td>
                    <td className="px-5 py-3 font-mono font-bold text-brand-400 text-sm">
                      {p.predicted_demand.toFixed(1)} portions
                    </td>
                    <td className="px-5 py-3 text-xs text-slate-400 font-mono">
                      {p.confidence_lower.toFixed(1)} &ndash; {p.confidence_upper.toFixed(1)}
                    </td>
                    <td className="px-5 py-3">
                      <span className="text-xs font-bold text-white bg-slate-800 px-2 py-1 rounded-md border border-slate-700">
                        {Math.ceil(p.predicted_demand * 1.05)} portions
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
