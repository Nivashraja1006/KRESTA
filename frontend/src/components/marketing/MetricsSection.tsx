import React, { useState, useEffect, useRef } from 'react';
import { DollarSign, ShoppingBag, TrendingUp, Gauge, Info } from 'lucide-react';

interface MetricItem {
  id: string;
  label: string;
  prefix?: string;
  suffix?: string;
  target: number;
  decimals: number;
  subtext: string;
  icon: any;
  colorClass: string;
}

export const MetricsSection: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  const metrics: MetricItem[] = [
    {
      id: 'revenue',
      label: 'Gross Revenue Processed',
      prefix: '$',
      target: 46872,
      decimals: 0,
      subtext: '+14.2% Month-over-Month',
      icon: DollarSign,
      colorClass: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    },
    {
      id: 'orders',
      label: 'Completed Orders',
      target: 711,
      decimals: 0,
      subtext: '0% Ticket Drop Rate',
      icon: ShoppingBag,
      colorClass: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    },
    {
      id: 'aov',
      label: 'Average Order Value',
      prefix: '$',
      target: 65.93,
      decimals: 2,
      subtext: 'Up from $58.20 last quarter',
      icon: TrendingUp,
      colorClass: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    },
    {
      id: 'efficiency',
      label: 'Kitchen Efficiency',
      suffix: '%',
      target: 94.8,
      decimals: 1,
      subtext: 'Average Prep: 11.2 mins',
      icon: Gauge,
      colorClass: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
    },
  ];

  const [counts, setCounts] = useState<{ [key: string]: number }>({
    revenue: 0,
    orders: 0,
    aov: 0,
    efficiency: 0,
  });

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    const duration = 1800; // ms
    const frameRate = 30; // updates per sec
    const totalFrames = Math.round((duration / 1000) * frameRate);
    let frame = 0;

    const timer = setInterval(() => {
      frame++;
      const progress = easeOutExpo(frame / totalFrames);

      const nextCounts: { [key: string]: number } = {};
      metrics.forEach((m) => {
        nextCounts[m.id] = m.target * progress;
      });

      setCounts(nextCounts);

      if (frame >= totalFrames) {
        clearInterval(timer);
        // lock exact
        const finalCounts: { [key: string]: number } = {};
        metrics.forEach((m) => {
          finalCounts[m.id] = m.target;
        });
        setCounts(finalCounts);
      }
    }, 1000 / frameRate);

    return () => clearInterval(timer);
  }, [isVisible]);

  // Easing function for smooth organic decelerating count
  const easeOutExpo = (x: number): number => {
    return x === 1 ? 1 : 1 - Math.pow(2, -10 * x);
  };

  return (
    <section ref={sectionRef} className="py-20 relative bg-slate-900/60 border-y border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <p className="font-serif text-xs font-bold tracking-widest text-amber-400 uppercase">
            RESTAURANT PERFORMANCE, IN MOTION
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            High Velocity Telemetry Across Every Station
          </h2>
          <p className="text-sm text-slate-400">
            Real-time operational execution powered by synchronized point-of-sale and kitchen intelligence.
          </p>
        </div>

        {/* Counter Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.map((metric) => {
            const Icon = metric.icon;
            const currentVal = counts[metric.id] || 0;
            const formatted =
              metric.decimals > 0
                ? currentVal.toFixed(metric.decimals)
                : Math.round(currentVal).toLocaleString();

            return (
              <div
                key={metric.id}
                className="glass-card-hover p-6 rounded-2xl relative overflow-hidden group"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold text-slate-400 tracking-wide">
                    {metric.label}
                  </span>
                  <div className={`p-2 rounded-xl border ${metric.colorClass}`}>
                    <Icon size={18} />
                  </div>
                </div>

                <div className="text-3xl sm:text-4xl font-extrabold text-white font-mono tracking-tight my-2">
                  <span>{metric.prefix}</span>
                  <span>{formatted}</span>
                  <span>{metric.suffix}</span>
                </div>

                <p className="text-xs text-slate-400 font-medium mt-1">
                  {metric.subtext}
                </p>
              </div>
            );
          })}
        </div>

        {/* Illustrative data note */}
        <div className="mt-8 flex items-center justify-center gap-1.5 text-xs text-slate-500">
          <Info size={14} />
          <span>Live illustrative performance telemetry aggregated across high-volume flagship deployment.</span>
        </div>
      </div>
    </section>
  );
};
