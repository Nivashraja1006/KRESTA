import React, { useState, useEffect } from 'react';
import { Bell, CheckCircle2, AlertTriangle, Sparkles, Clock, Check } from 'lucide-react';
import apiClient from '../../api/client';
import { Notification } from '../../types';
import { Button } from '../../components/common/Button';

export const NotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchNotifications = async () => {
    setIsLoading(true);
    try {
      const resp = await apiClient.get<Notification[]>('/notifications/?limit=50');
      setNotifications(resp.data);
    } catch (e) {
      console.error('Failed to load notifications:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkAllRead = async () => {
    try {
      await apiClient.post('/notifications/read-all');
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    } catch (e) {
      console.error('Failed to mark all read:', e);
    }
  };

  const handleMarkOneRead = async (id: number) => {
    try {
      await apiClient.patch(`/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
      );
    } catch (e) {
      console.error('Failed to mark read:', e);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Bell size={24} className="text-brand-400" />
            <span>Operational Notification Center</span>
          </h1>
          <p className="text-sm text-slate-400 mt-0.5">
            Real-time critical alerts across low inventory, expiring ingredients, demand surges, and anomalies.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={handleMarkAllRead}
          leftIcon={<Check size={14} />}
        >
          Mark All as Read
        </Button>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {notifications.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-500">
            <CheckCircle2 size={36} className="mx-auto mb-2 text-emerald-400 opacity-60" />
            <p className="text-sm font-semibold text-slate-300">No unread notifications</p>
            <p className="text-xs text-slate-500 mt-1">All operational systems are operating normally.</p>
          </div>
        ) : (
          notifications.map((notif) => (
            <div
              key={notif.id}
              className={`p-4 rounded-2xl border transition-all flex items-start justify-between gap-4 ${
                notif.is_read
                  ? 'bg-slate-900/40 border-slate-800/60 opacity-70'
                  : 'bg-slate-900 border-slate-700 shadow-md'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-xl flex-shrink-0 mt-0.5 ${
                  notif.notification_type.includes('LOW') || notif.notification_type.includes('ANOMALY')
                    ? 'bg-amber-500/10 text-amber-400'
                    : notif.notification_type.includes('SPIKE')
                    ? 'bg-brand-500/10 text-brand-400'
                    : 'bg-blue-500/10 text-blue-400'
                }`}>
                  <AlertTriangle size={18} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-white">{notif.title}</h4>
                    {!notif.is_read && (
                      <span className="flex h-2 w-2 rounded-full bg-brand-500"></span>
                    )}
                  </div>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">{notif.message}</p>
                  <span className="text-[11px] text-slate-500 mt-2 block">
                    {new Date(notif.created_at).toLocaleString()}
                  </span>
                </div>
              </div>

              {!notif.is_read && (
                <button
                  onClick={() => handleMarkOneRead(notif.id)}
                  className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors flex-shrink-0"
                  title="Mark as read"
                >
                  <Check size={16} />
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
