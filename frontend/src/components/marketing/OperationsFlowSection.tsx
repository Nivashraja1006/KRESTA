import React, { useState, useEffect } from 'react';
import {
  Users,
  ShoppingBag,
  ChefHat,
  Package,
  Cpu,
  LineChart,
  ArrowRight
} from 'lucide-react';

interface Step {
  id: number;
  label: string;
  sublabel: string;
  detail: string;
  icon: any;
  color: string;
}

export const OperationsFlowSection: React.FC = () => {
  const steps: Step[] = [
    {
      id: 1,
      label: 'CUSTOMER',
      sublabel: 'Table & Online',
      detail: 'Guest seated, order placed via digital table ordering or floor waiter POS.',
      icon: Users,
      color: 'from-blue-500 to-cyan-500',
    },
    {
      id: 2,
      label: 'POS',
      sublabel: 'Instant Ticket',
      detail: 'Calculates dynamic tax, applies guest modifiers, and logs live transaction.',
      icon: ShoppingBag,
      color: 'from-cyan-500 to-emerald-500',
    },
    {
      id: 3,
      label: 'KITCHEN',
      sublabel: 'WebSocket KDS',
      detail: 'Stations receive sequenced tickets with preparation timers and course sync.',
      icon: ChefHat,
      color: 'from-emerald-500 to-amber-500',
    },
    {
      id: 4,
      label: 'INVENTORY',
      sublabel: 'Recipe Explosion',
      detail: 'Depletes exact gram-level raw ingredients from warehouse in real-time.',
      icon: Package,
      color: 'from-amber-500 to-orange-500',
    },
    {
      id: 5,
      label: 'AI ENGINE',
      sublabel: 'ML Retraining',
      detail: 'GBR recalculates hourly demand curves and flags abnormal variance.',
      icon: Cpu,
      color: 'from-orange-500 to-purple-500',
    },
    {
      id: 6,
      label: 'BUSINESS INSIGHT',
      sublabel: 'Executive Command',
      detail: 'Live margin alerts, supplier purchase triggers, and executive telemetry.',
      icon: LineChart,
      color: 'from-purple-500 to-emerald-400',
    },
  ];

  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, 2400);
    return () => clearInterval(interval);
  }, [steps.length]);

  return (
    <section className="py-24 relative bg-slate-950 overflow-hidden">
      {/* Background ambient particle grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <p className="font-serif text-xs font-bold tracking-widest text-amber-400 uppercase">
            UNIFIED DATA TOPOLOGY
          </p>
          <h2 className="font-serif text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            CLOSED-LOOP OPERATION
          </h2>
          <p className="text-sm sm:text-base text-slate-400">
            From the moment a table is seated to midnight supplier reordering, data propagates seamlessly across six coordinated stages without manual re-entry.
          </p>
        </div>

        {/* Horizontal Pipeline Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 relative">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            const isActive = activeStep === idx;

            return (
              <div
                key={step.id}
                onClick={() => setActiveStep(idx)}
                className={`cursor-pointer rounded-2xl p-5 border transition-all duration-300 relative flex flex-col justify-between ${
                  isActive
                    ? 'bg-slate-900 border-amber-400 shadow-xl shadow-amber-500/10 scale-105 z-10'
                    : 'bg-slate-950/80 border-slate-800/80 hover:border-slate-700 opacity-80 hover:opacity-100'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[11px] font-mono font-bold text-slate-500">
                      0{step.id}
                    </span>
                    <div
                      className={`h-8 w-8 rounded-xl flex items-center justify-center text-white bg-gradient-to-tr ${step.color} shadow-md`}
                    >
                      <Icon size={16} />
                    </div>
                  </div>

                  <h3 className="text-sm font-extrabold tracking-wide text-white mb-0.5">
                    {step.label}
                  </h3>
                  <p className="text-[11px] font-semibold text-amber-400/90 mb-2">
                    {step.sublabel}
                  </p>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    {step.detail}
                  </p>
                </div>

                {/* Active Indicator Pulse */}
                <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-[10px] text-slate-500">
                    {isActive ? 'Processing...' : 'Ready'}
                  </span>
                  <div className={`h-2 w-2 rounded-full ${isActive ? 'bg-amber-400 animate-ping' : 'bg-slate-700'}`} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Data Stream Progress Line */}
        <div className="mt-12 rounded-2xl bg-slate-900/60 border border-slate-800 p-4 max-w-3xl mx-auto flex items-center justify-between text-xs text-slate-300">
          <span className="font-mono text-amber-400 font-bold flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            Live Data Velocity:
          </span>
          <span className="text-slate-400 font-mono text-[11px]">
            {steps[activeStep].label} &rarr; Sync latency &lt; 28ms &bull; Immutable PostgreSQL Ledger
          </span>
        </div>
      </div>
    </section>
  );
};
