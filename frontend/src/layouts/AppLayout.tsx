import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  UtensilsCrossed,
  ChefHat,
  ShoppingBag,
  Package,
  Truck,
  Users,
  MessageSquareHeart,
  Trash2,
  TrendingUp,
  LineChart,
  Lightbulb,
  AlertTriangle,
  Bot,
  FileText,
  Bell,
  Settings,
  User,
  ShieldCheck,
  LogOut,
  Menu as MenuIcon,
  X,
  ChevronDown,
  Building2,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useBranch } from '../context/BranchContext';
import apiClient from '../api/client';
import { Notification } from '../types';

interface NavItem {
  name: string;
  path: string;
  icon: any;
  roles: string[];
  highlight?: boolean;
  badge?: number;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

export const AppLayout: React.FC = () => {
  const { user, logout, hasAnyRole } = useAuth();
  const { branches, selectedBranchId, setSelectedBranchId } = useBranch();
  const location = useLocation();
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [unreadNotifications, setUnreadNotifications] = useState<number>(0);

  useEffect(() => {
    // Fetch unread notifications count
    const fetchUnread = async () => {
      try {
        const resp = await apiClient.get<Notification[]>('/notifications/?limit=20');
        const count = resp.data.filter((n) => !n.is_read).length;
        setUnreadNotifications(count);
      } catch (e) {
        // quiet error
      }
    };
    fetchUnread();
    const interval = setInterval(fetchUnread, 30000);
    return () => clearInterval(interval);
  }, []);

  // Close mobile sidebar on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const navSections: NavSection[] = [
    {
      title: 'OPERATIONS',
      items: [
        { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, roles: ['super_admin', 'owner', 'manager', 'chef', 'staff'] },
        { name: 'Customer Ordering', path: '/order', icon: UtensilsCrossed, roles: ['super_admin', 'owner', 'manager', 'chef', 'staff'] },
        { name: 'POS & Orders', path: '/orders', icon: ShoppingBag, roles: ['super_admin', 'owner', 'manager', 'staff'] },
        { name: 'Kitchen KDS', path: '/kitchen', icon: ChefHat, roles: ['super_admin', 'owner', 'manager', 'chef'] },
        { name: 'Menu & Recipes', path: '/menu', icon: UtensilsCrossed, roles: ['super_admin', 'owner', 'manager', 'chef'] },
      ],
    },
    {
      title: 'AI & INTELLIGENCE',
      items: [
        { name: 'Executive Analytics', path: '/executive-analytics', icon: LineChart, roles: ['super_admin', 'owner', 'manager'] },
        { name: 'AI Demand Forecast', path: '/forecast', icon: TrendingUp, roles: ['super_admin', 'owner', 'manager', 'chef'] },
        { name: 'AI Inventory Optimizer', path: '/recommendations', icon: Lightbulb, roles: ['super_admin', 'owner', 'manager', 'chef'] },
        { name: 'Food Waste Intel', path: '/waste', icon: Trash2, roles: ['super_admin', 'owner', 'manager', 'chef'] },
        { name: 'Customer RFM Intel', path: '/customers', icon: Users, roles: ['super_admin', 'owner', 'manager'] },
        { name: 'Review Sentiments', path: '/reviews', icon: MessageSquareHeart, roles: ['super_admin', 'owner', 'manager'] },
        { name: 'Anomaly Detection', path: '/anomalies', icon: AlertTriangle, roles: ['super_admin', 'owner', 'manager'] },
        { name: 'AI Business Assistant', path: '/ai-assistant', icon: Bot, highlight: true, roles: ['super_admin', 'owner', 'manager', 'chef', 'staff'] },
      ],
    },
    {
      title: 'MANAGEMENT',
      items: [
        { name: 'Inventory Health', path: '/inventory', icon: Package, roles: ['super_admin', 'owner', 'manager', 'chef'] },
        { name: 'Suppliers', path: '/suppliers', icon: Truck, roles: ['super_admin', 'owner', 'manager'] },
        { name: 'Reports & Exports', path: '/reports', icon: FileText, roles: ['super_admin', 'owner', 'manager'] },
        { name: 'Notifications', path: '/notifications', icon: Bell, badge: unreadNotifications, roles: ['super_admin', 'owner', 'manager', 'chef', 'staff'] },
      ],
    },
    {
      title: 'ADMINISTRATION',
      items: [
        { name: 'Staff & Roles', path: '/admin/users', icon: ShieldCheck, roles: ['super_admin', 'owner', 'manager'] },
        { name: 'Audit Logs', path: '/admin/audit-logs', icon: FileText, roles: ['super_admin', 'owner'] },
        { name: 'Branch Settings', path: '/settings', icon: Settings, roles: ['super_admin', 'owner'] },
        { name: 'Profile', path: '/profile', icon: User, roles: ['super_admin', 'owner', 'manager', 'chef', 'staff'] },
      ],
    },
  ];

  const roleBadgeColors: Record<string, string> = {
    super_admin: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
    owner: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    manager: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
    chef: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
    staff: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
  };

  const userRole = user?.role?.name || 'staff';

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 overflow-hidden font-sans">
      {/* Sidebar - Desktop */}
      <aside
        className={`hidden md:flex flex-col border-r border-slate-800 bg-slate-900 transition-all duration-300 z-30 ${
          sidebarOpen ? 'w-64' : 'w-20'
        }`}
      >
        {/* Logo & Brand */}
        <div className="flex h-16 items-center justify-between border-b border-slate-800 px-4">
          <Link to="/dashboard" className="flex items-center gap-3 overflow-hidden">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-slate-900 border border-amber-500/30 p-1.5 shadow-md shadow-amber-500/10">
              <img src="/kresta-logo-mark.png" alt="KRESTA" className="h-full w-full object-contain" />
            </div>
            {sidebarOpen && (
              <div className="flex flex-col">
                <span className="font-serif font-extrabold text-lg tracking-wider text-white">
                  KRESTA
                </span>
                <span className="text-[9px] uppercase font-bold text-amber-300/80 tracking-widest">
                  Restaurant Intelligence
                </span>
              </div>
            )}
          </Link>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <MenuIcon size={18} />
          </button>
        </div>

        {/* Nav list */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {navSections.map((section, idx) => {
            const visibleItems = section.items.filter((item) =>
              item.roles.some((r) => r === userRole || user?.is_superuser)
            );
            if (visibleItems.length === 0) return null;

            return (
              <div key={idx}>
                {sidebarOpen && (
                  <h3 className="px-3 text-[11px] font-bold text-slate-500 tracking-wider uppercase mb-2">
                    {section.title}
                  </h3>
                )}
                <div className="space-y-1">
                  {visibleItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        title={!sidebarOpen ? item.name : undefined}
                        className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                          isActive
                            ? 'bg-brand-500 text-white shadow-md shadow-brand-500/20'
                            : item.highlight
                            ? 'text-brand-400 hover:bg-brand-500/10'
                            : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-100'
                        } ${!sidebarOpen ? 'justify-center' : ''}`}
                      >
                        <Icon size={18} className="flex-shrink-0" />
                        {sidebarOpen && <span className="truncate">{item.name}</span>}
                        {sidebarOpen && item.badge ? (
                          <span className="ml-auto rounded-full bg-brand-500/20 border border-brand-500/30 px-2 py-0.5 text-[10px] font-bold text-brand-300">
                            {item.badge}
                          </span>
                        ) : null}
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* User Card in Sidebar Footer */}
        <div className="border-t border-slate-800 p-3">
          <div className={`flex items-center gap-3 ${!sidebarOpen ? 'justify-center' : ''}`}>
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-slate-700 to-slate-800 flex items-center justify-center font-bold text-white border border-slate-700 flex-shrink-0">
              {user?.full_name ? user.full_name.charAt(0).toUpperCase() : 'U'}
            </div>
            {sidebarOpen && (
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-white truncate">{user?.full_name}</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className={`text-[10px] font-medium uppercase border px-1.5 py-0.2 rounded-md ${roleBadgeColors[userRole] || ''}`}>
                    {userRole.replace('_', ' ')}
                  </span>
                </div>
              </div>
            )}
            {sidebarOpen && (
              <button
                onClick={logout}
                title="Log Out"
                className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-lg transition-colors"
              >
                <LogOut size={16} />
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
          <div className="relative flex w-72 flex-col bg-slate-900 p-4 shadow-2xl border-r border-slate-800">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-slate-900 border border-amber-500/30 p-1 flex items-center justify-center">
                  <img src="/kresta-logo-mark.png" alt="KRESTA" className="h-full w-full object-contain" />
                </div>
                <div className="flex flex-col">
                  <span className="font-serif font-extrabold text-base text-white tracking-wider">
                    KRESTA
                  </span>
                  <span className="text-[8px] uppercase font-bold text-amber-300/80 tracking-widest">
                    Restaurant Intelligence
                  </span>
                </div>
              </div>
              <button onClick={() => setMobileMenuOpen(false)} className="text-slate-400 hover:text-white">
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto py-4 space-y-4">
              {navSections.map((sec, i) => (
                <div key={i}>
                  <h4 className="text-[11px] font-bold text-slate-500 uppercase px-2 mb-1">{sec.title}</h4>
                  <div className="space-y-1">
                    {sec.items.map((it) => (
                      <Link
                        key={it.path}
                        to={it.path}
                        className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium ${
                          location.pathname === it.path ? 'bg-brand-500 text-white' : 'text-slate-400 hover:bg-slate-800 text-slate-200'
                        }`}
                      >
                        <it.icon size={18} />
                        <span>{it.name}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={logout}
              className="flex items-center gap-2 p-3 text-sm text-red-400 hover:bg-slate-800 rounded-xl mt-auto"
            >
              <LogOut size={18} />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Navbar */}
        <header className="h-16 border-b border-slate-800 bg-slate-900/60 backdrop-blur-md px-4 md:px-6 flex items-center justify-between z-20">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden p-2 text-slate-400 hover:text-white rounded-lg"
            >
              <MenuIcon size={20} />
            </button>

            {/* Branch Switcher */}
            <div className="flex items-center gap-2 bg-slate-800/80 border border-slate-700/60 px-3 py-1.5 rounded-xl">
              <Building2 size={16} className="text-brand-400 flex-shrink-0" />
              <select
                value={selectedBranchId}
                onChange={(e) => setSelectedBranchId(Number(e.target.value))}
                className="bg-transparent text-sm font-medium text-slate-200 outline-none cursor-pointer pr-2"
              >
                {branches.map((b) => (
                  <option key={b.id} value={b.id} className="bg-slate-900 text-slate-100">
                    {b.name} ({b.code})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center gap-3">
            {/* Direct Link to Customer Ordering */}
            <Link
              to="/order"
              className="hidden sm:inline-flex items-center gap-1.5 rounded-xl border border-amber-500/40 bg-amber-500/10 hover:bg-amber-500/20 px-3 py-1.5 text-xs font-bold text-amber-300 transition-colors"
            >
              <UtensilsCrossed size={14} />
              <span>Customer /order</span>
            </Link>

            {/* Quick AI Assistant Button */}
            <button
              onClick={() => navigate('/ai-assistant')}
              className="hidden sm:flex items-center gap-2 bg-brand-500/10 hover:bg-brand-500/20 text-brand-400 border border-brand-500/30 px-3 py-1.5 rounded-xl text-sm font-medium transition-all shadow-sm"
            >
              <Bot size={16} />
              <span>Ask AI</span>
            </button>

            {/* Notification Bell */}
            <Link
              to="/notifications"
              className="relative p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
            >
              <Bell size={18} />
              {unreadNotifications > 0 && (
                <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-500"></span>
                </span>
              )}
            </Link>

            {/* Profile avatar link */}
            <Link
              to="/profile"
              className="flex items-center gap-2 pl-2 border-l border-slate-800 text-slate-300 hover:text-white"
            >
              <div className="h-8 w-8 rounded-lg bg-slate-800 flex items-center justify-center font-bold text-xs border border-slate-700 text-brand-400">
                {user?.full_name ? user.full_name.charAt(0) : 'U'}
              </div>
              <span className="hidden lg:inline text-xs font-semibold">{user?.full_name}</span>
            </Link>
          </div>
        </header>

        {/* Scrollable Page Body */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 bg-slate-950">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
