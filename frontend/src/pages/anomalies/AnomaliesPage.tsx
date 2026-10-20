import React, { useState, useEffect } from 'react';
import {
  AlertTriangle,
  BrainCircuit,
  CheckCircle2,
  TrendingDown,
  TrendingUp,
  ShieldCheck,
  RefreshCw,
  Search,
  Check
} from 'lucide-react';
import apiClient from '../../api/client';
import { useBranch } from '../../context/BranchContext';
import { AnomalyRecord } from '../../types';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Button } from '../../components/common/Button';

export const AnomaliesPage: React.FC = () => {
  const { selectedBranchId, selectedBranch } = useBranch();

  const [anomalies, setAnomalies] = useState<AnomalyRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isScanning, setIsScanning] = useState(false);
  const [scanMessage, setScanMessage] = useState('');

  const fetchAnomalies = async () => {
    setIsLoading(true);
    try {
      const resp = await apiClient.get<AnomalyRecord[]>(
        `/anomalies/?branch_id=${selectedBranchId}`
      );
      setAnomalies(resp.data);
    } catch (e) {
      console.error('Failed to load anomalies:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAnomalies();
  }, [selectedBranchId]);

  const handleRunScan = async () => {
    setIsScanning(true);
    setScanMessage('');
    try {
      const resp = await apiClient.post(`/anomalies/scan?branch_id=${selectedBranchId}`);
      setScanMessage(resp.data.message);
      fetchAnomalies();
    } catch (e) {
      setScanMessage('Failed to execute Isolation Forest scan.');
    } finally {
      setIsScanning(false);
    }
  };

  const handleResolve = async (anomalyId: number) => {
    try {
      await apiClient.patch(`/anomalies/${anomalyId}/resolve`);
      fetchAnomalies();
    } catch (e) {
      console.error('Failed to resolve anomaly:', e);
    }
  };

  const unresolved = anomalies.filter((a) => !a.is_resolved);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-0.5 text-xs font-semibold text-amber-400 mb-1">
            <BrainCircuit size={14} />
            <span>Unsupervised Outlier Detection</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Operational Anomaly Detection</h1>
          <p className="text-sm text-slate-400 mt-0.5">
            Isolation Forest time-series monitoring across daily revenue spikes, suspicious discount rates, and food waste.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={handleRunScan}
          isLoading={isScanning}
          leftIcon={<RefreshCw size={16} />}
        >
          Run Isolation Forest Scan
        </Button>
      </div>

      {scanMessage && (
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs text-emerald-400 flex items-center gap-2">
          <CheckCircle2 size={16} />
          <span>{scanMessage}</span>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
          <span className="text-xs font-semibold text-slate-400 uppercase">Active Anomalies</span>
          <p className="text-3xl font-extrabold text-amber-400 mt-1">{unresolved.length}</p>
          <span className="text-xs text-slate-500 mt-1 block">Awaiting manager acknowledgment</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
          <span className="text-xs font-semibold text-slate-400 uppercase">Detection Algorithm</span>
          <p className="text-lg font-bold text-white mt-1">Isolation Forest (iForest)</p>
          <span className="text-xs text-brand-400 mt-1 block">Contamination Factor = 0.08</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
          <span className="text-xs font-semibold text-slate-400 uppercase">Total Lifetime Events</span>
          <p className="text-3xl font-extrabold text-white mt-1">{anomalies.length}</p>
          <span className="text-xs text-slate-500 mt-1 block">Audited for {selectedBranch?.name}</span>
        </div>
      </div>

      {/* Anomalies Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="px-5 py-4 border-b border-slate-800">
          <h3 className="text-sm font-bold text-white tracking-tight">Detected Outliers & Explanations</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-800/60 text-xs uppercase text-slate-400 font-semibold border-b border-slate-800">
              <tr>
                <th className="px-5 py-3.5">Metric</th>
                <th className="px-5 py-3.5">Date</th>
                <th className="px-5 py-3.5">Severity</th>
                <th className="px-5 py-3.5">Operational Explanation</th>
                <th className="px-5 py-3.5">Observed vs Baseline</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {anomalies.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-slate-500">
                    No anomalies recorded. Run a scan to evaluate metrics.
                  </td>
                </tr>
              ) : (
                anomalies.map((ano) => (
                  <tr key={ano.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-5 py-4 font-bold text-white text-xs">
                      {ano.metric_name.replace('_', ' ')}
                    </td>
                    <td className="px-5 py-4 text-xs text-slate-400">
                      {new Date(ano.anomaly_date).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-4">
                      <StatusBadge status={ano.severity} size="sm" />
                    </td>
                    <td className="px-5 py-4 text-xs text-slate-200 max-w-md">
                      {ano.explanation}
                    </td>
                    <td className="px-5 py-4 font-mono text-xs">
                      {ano.actual_value !== null ? (
                        <span>
                          <span className="text-white font-bold">${ano.actual_value?.toFixed(0)}</span>
                          <span className="text-slate-500"> (avg ~${ano.expected_value?.toFixed(0)})</span>
                        </span>
                      ) : (
                        'N/A'
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-md ${
                        ano.is_resolved ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
                      }`}>
                        {ano.is_resolved ? 'Resolved' : 'Unreviewed'}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      {!ano.is_resolved && (
                        <button
                          onClick={() => handleResolve(ano.id)}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-brand-400 hover:text-brand-300 bg-brand-500/10 px-2.5 py-1 rounded-lg border border-brand-500/30"
                        >
                          <Check size={13} />
                          <span>Acknowledge</span>
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
