import React, { useState, useEffect } from 'react';
import {
  Users,
  BrainCircuit,
  Search,
  Sparkles,
  Award,
  TrendingUp,
  DollarSign,
  Calendar,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';
import apiClient from '../../api/client';
import { Customer } from '../../types';
import { Button } from '../../components/common/Button';

export const CustomersPage: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [segmentsSummary, setSegmentsSummary] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isClustering, setIsClustering] = useState(false);
  const [clusterMessage, setClusterMessage] = useState('');

  const fetchCustomerData = async () => {
    setIsLoading(true);
    try {
      const [custList, segList] = await Promise.all([
        apiClient.get<Customer[]>('/customers/?limit=60'),
        apiClient.get<any[]>('/customers/segments/summary')
      ]);
      setCustomers(custList.data);
      setSegmentsSummary(segList.data);
    } catch (e) {
      console.error('Failed to load customer profiles:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomerData();
  }, []);

  const handleRunSegmentation = async () => {
    setIsClustering(true);
    setClusterMessage('');
    try {
      const resp = await apiClient.post('/customers/segmentation/run');
      setClusterMessage(resp.data.message);
      fetchCustomerData();
    } catch (e) {
      setClusterMessage('Failed to execute K-Means clustering.');
    } finally {
      setIsClustering(false);
    }
  };

  const getSegmentColor = (segment?: string) => {
    if (!segment) return 'bg-slate-800 text-slate-400 border-slate-700';
    if (segment.includes('VIP')) return 'bg-amber-500/10 text-amber-400 border-amber-500/30 font-bold';
    if (segment.includes('Loyal')) return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
    if (segment.includes('Promising')) return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
    return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
  };

  const filtered = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      (c.email && c.email.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full border border-brand-500/30 bg-brand-500/10 px-3 py-0.5 text-xs font-semibold text-brand-400 mb-1">
            <BrainCircuit size={14} />
            <span>K-Means RFM Machine Learning</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Customer Intelligence & Segmentation</h1>
          <p className="text-sm text-slate-400 mt-0.5">
            Behavioral clustering based on Recency, Frequency, and Monetary (RFM) spending patterns.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={handleRunSegmentation}
          isLoading={isClustering}
          leftIcon={<Sparkles size={16} />}
        >
          Run K-Means Clustering
        </Button>
      </div>

      {clusterMessage && (
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs text-emerald-400 flex items-center gap-2">
          <CheckCircle2 size={16} />
          <span>{clusterMessage}</span>
        </div>
      )}

      {/* Segment Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {segmentsSummary.map((seg, idx) => (
          <div
            key={idx}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm hover:border-slate-700 transition-all"
          >
            <div className="flex items-center justify-between mb-3">
              <span className={`text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${getSegmentColor(seg.segment_name)}`}>
                {seg.segment_name}
              </span>
              <Users size={16} className="text-slate-500" />
            </div>
            <h3 className="text-2xl font-extrabold text-white">{seg.count} <span className="text-xs text-slate-400 font-normal">guests</span></h3>
            <div className="mt-3 text-xs space-y-1 text-slate-400 border-t border-slate-800 pt-3">
              <div className="flex justify-between">
                <span>Total Spend:</span>
                <span className="font-bold text-white font-mono">${seg.total_spend.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Avg Frequency:</span>
                <span className="font-semibold text-slate-200">{seg.avg_orders} visits</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Customers Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between gap-4">
          <h3 className="text-sm font-bold text-white tracking-tight">Customer Directory & Spending History</h3>
          <div className="relative w-72">
            <Search className="absolute left-3.5 top-2.5 text-slate-500" size={15} />
            <input
              type="text"
              placeholder="Search customers..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 outline-none focus:border-brand-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-800/60 text-xs uppercase text-slate-400 font-semibold border-b border-slate-800">
              <tr>
                <th className="px-5 py-3.5">Guest Name</th>
                <th className="px-5 py-3.5">RFM Cluster Segment</th>
                <th className="px-5 py-3.5">Total Spend (LTV)</th>
                <th className="px-5 py-3.5">Order Frequency</th>
                <th className="px-5 py-3.5">Average Ticket</th>
                <th className="px-5 py-3.5">Last Visit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filtered.map((c) => {
                const aov = c.total_orders > 0 ? c.total_spent / c.total_orders : 0;
                return (
                  <tr key={c.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-5 py-4 font-semibold text-white">
                      <div>{c.name}</div>
                      <span className="text-xs text-slate-400 font-normal">{c.email || c.phone || 'Walk-in'}</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full border ${getSegmentColor(c.segment_name)}`}>
                        {c.segment_name || 'Processing'}
                      </span>
                    </td>
                    <td className="px-5 py-4 font-bold text-white font-mono">
                      ${c.total_spent.toFixed(2)}
                    </td>
                    <td className="px-5 py-4 text-xs font-semibold text-slate-200">
                      {c.total_orders} lifetime orders
                    </td>
                    <td className="px-5 py-4 text-xs font-mono text-emerald-400">
                      ${aov.toFixed(2)}
                    </td>
                    <td className="px-5 py-4 text-xs text-slate-400">
                      {c.last_visit_date ? new Date(c.last_visit_date).toLocaleDateString() : 'N/A'}
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
