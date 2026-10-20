import React from 'react';
import { MarketingLayout } from '../../components/marketing/MarketingLayout';
import {
  Layers,
  Cpu,
  Database,
  ShieldCheck,
  Zap,
  Globe,
  Lock,
  ArrowRight,
  Server
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const PlatformPage: React.FC = () => {
  return (
    <MarketingLayout>
      <div className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1 text-xs font-bold text-amber-300">
            <Layers size={14} />
            <span>ENTERPRISE INFRASTRUCTURE</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-6xl font-extrabold text-white tracking-tight">
            The Operating System for <br />
            <span className="emerald-gradient-text">Modern Hospitality</span>
          </h1>
          <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
            Engineered for high concurrency, zero latency, and fault-tolerant multi-branch synchronization. Discover the architecture behind KRESTA.
          </p>
        </div>

        {/* 4 Architectural Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              title: 'Multi-Branch Sync',
              desc: 'Seamless branch routing allowing headquarters to audit store performance while stores operate autonomously.',
              icon: Globe,
              stat: 'Multi-Tenant',
            },
            {
              title: 'Millisecond WebSockets',
              desc: 'Kitchen tickets and floor notifications synchronize instantaneously over duplex socket channels.',
              icon: Zap,
              stat: '< 20ms Latency',
            },
            {
              title: 'PostgreSQL Ledger',
              desc: 'Double-entry recipe explosion guaranteeing every gram of inventory connects to a verified order ID.',
              icon: Database,
              stat: 'ACID Compliant',
            },
            {
              title: 'Enterprise RBAC',
              desc: 'Granular permissions restricting financial exports, recipe editing, and refund approvals to authorized roles.',
              icon: ShieldCheck,
              stat: '5 Built-in Roles',
            },
          ].map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div key={pillar.title} className="glass-card-hover p-6 rounded-3xl space-y-4">
                <div className="h-12 w-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-300">
                  <Icon size={24} />
                </div>
                <div>
                  <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-wider">{pillar.stat}</span>
                  <h3 className="text-lg font-bold text-white mt-1">{pillar.title}</h3>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">{pillar.desc}</p>
              </div>
            );
          })}
        </div>

        {/* Topology Breakdown Diagram */}
        <div className="glass-card p-8 rounded-3xl border border-slate-800 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
            <div>
              <h3 className="text-xl font-bold text-white">Full-Stack Architecture Topology</h3>
              <p className="text-xs text-slate-400">High availability decoupled backend with real-time reactive frontend</p>
            </div>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 text-xs font-bold text-amber-400 hover:text-amber-300"
            >
              <span>Explore Live Instance</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-300">
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <span className="font-bold text-white uppercase text-[11px] text-amber-400">Layer 1: Presentation</span>
              <p className="leading-relaxed text-slate-400">
                React 19, TypeScript, Tailwind CSS, Recharts, and WebSockets deliver responsive 60fps operator interfaces across iPad, desktop, and handheld devices.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <span className="font-bold text-white uppercase text-[11px] text-emerald-400">Layer 2: API & Machine Learning</span>
              <p className="leading-relaxed text-slate-400">
                FastAPI (Python 3.11) with Scikit-learn pipelines. Handles authentication, live event dispatching, and background ML demand prediction retraining.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <span className="font-bold text-white uppercase text-[11px] text-blue-400">Layer 3: Relational Persistence</span>
              <p className="leading-relaxed text-slate-400">
                PostgreSQL with SQLAlchemy 2.0 and Alembic migrations. Maintains relational integrity across multi-branch tables, orders, recipes, and audit logs.
              </p>
            </div>
          </div>
        </div>
      </div>
    </MarketingLayout>
  );
};
