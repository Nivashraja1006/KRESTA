import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { RoleName } from '../../types';
import { ShieldAlert } from 'lucide-react';

interface ProtectedRouteProps {
  allowedRoles?: RoleName[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
  const { isAuthenticated, isLoading, user, hasAnyRole } = useAuth();

  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-slate-950 text-slate-200">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-slate-900 border border-amber-500/30 p-2 shadow-xl shadow-amber-500/10 animate-pulse">
            <img src="/kresta-logo-mark.png" alt="KRESTA" className="h-full w-full object-contain" />
          </div>
          <p className="text-xs font-serif font-bold uppercase tracking-widest text-amber-300">Loading KRESTA...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const defaultStaffRoles: RoleName[] = ['super_admin', 'owner', 'manager', 'chef', 'staff'];
  const effectiveRoles = allowedRoles && allowedRoles.length > 0 ? allowedRoles : defaultStaffRoles;

  if (!hasAnyRole(effectiveRoles)) {
    const isCustomer = user?.role?.name === 'customer';
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-slate-950 p-4 text-slate-100">
        <div className="max-w-md text-center bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-2xl">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10 text-red-400 mb-4">
            <ShieldAlert size={32} />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Access Denied (403)</h2>
          <p className="text-sm text-slate-400 mb-6">
            Your current account (<span className="text-brand-400 font-semibold uppercase">{user?.role?.name || 'Customer'}</span>) does not have authorization to view internal operations or kitchen systems.
          </p>
          <button
            onClick={() => window.location.href = isCustomer ? '/order' : '/dashboard'}
            className="w-full rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-500 transition-colors"
          >
            {isCustomer ? 'Go to Food Ordering (/order)' : 'Return to Authorized Dashboard'}
          </button>
        </div>
      </div>
    );
  }

  return <Outlet />;
};
