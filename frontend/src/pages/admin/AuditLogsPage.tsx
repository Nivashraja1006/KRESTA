import React, { useState, useEffect } from 'react';
import { ShieldCheck, FileText, Search, Clock } from 'lucide-react';
import apiClient from '../../api/client';

export const AuditLogsPage: React.FC = () => {
  const [logs, setLogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchLogs = async () => {
      setIsLoading(true);
      try {
        const resp = await apiClient.get('/reports/audit-logs?limit=80');
        setLogs(resp.data);
      } catch (e) {
        console.error('Failed to load audit logs:', e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchLogs();
  }, []);

  const filtered = logs.filter(
    (l) =>
      l.action.toLowerCase().includes(search.toLowerCase()) ||
      l.resource_type.toLowerCase().includes(search.toLowerCase()) ||
      (l.details_json && l.details_json.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <ShieldCheck size={26} className="text-purple-400" />
          <span>System Security & Audit Trail</span>
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Immutable ledger of operational mutations, pricing changes, role updates, and authentication events.
        </p>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-2.5 text-slate-500" size={15} />
        <input
          type="text"
          placeholder="Filter audit events..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 outline-none focus:border-brand-500"
        />
      </div>

      {/* Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-800/60 text-xs uppercase text-slate-400 font-semibold border-b border-slate-800">
              <tr>
                <th className="px-5 py-3.5">Action</th>
                <th className="px-5 py-3.5">Resource</th>
                <th className="px-5 py-3.5">Target ID</th>
                <th className="px-5 py-3.5">Details</th>
                <th className="px-5 py-3.5">User ID</th>
                <th className="px-5 py-3.5">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filtered.map((log) => (
                <tr key={log.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="px-5 py-4 font-mono font-bold text-brand-400 text-xs">
                    {log.action}
                  </td>
                  <td className="px-5 py-4 font-semibold text-white text-xs">
                    {log.resource_type}
                  </td>
                  <td className="px-5 py-4 font-mono text-xs text-slate-400">
                    #{log.resource_id || '-'}
                  </td>
                  <td className="px-5 py-4 text-xs text-slate-300 max-w-sm truncate">
                    {log.details_json || 'System action executed successfully'}
                  </td>
                  <td className="px-5 py-4 text-xs font-mono text-slate-400">
                    User #{log.user_id || 'System'}
                  </td>
                  <td className="px-5 py-4 text-xs text-slate-400">
                    {new Date(log.created_at).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
