import React from 'react';
import { X, Tag, Sparkles, Check, ArrowRight, Percent } from 'lucide-react';

interface OffersModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyCoupon: (code: string) => void;
  appliedCoupon: string | null;
}

export const OffersModal: React.FC<OffersModalProps> = ({
  isOpen,
  onClose,
  onApplyCoupon,
  appliedCoupon
}) => {
  if (!isOpen) return null;

  const offers = [
    {
      code: 'KRESTA10',
      title: '10% Off Everything',
      desc: 'Valid on any order size across all 22+ artisan dishes.',
      minOrder: '$0',
      tag: 'Chef Special'
    },
    {
      code: 'KRESTA20',
      title: '20% Weekend Feast Discount',
      desc: 'Save 20% when your order subtotal reaches $40 or more.',
      minOrder: '$40',
      tag: 'Popular'
    },
    {
      code: 'WELCOME50',
      title: '$5.00 Welcome Credit',
      desc: 'Exclusive first-order patron incentive for orders over $25.',
      minOrder: '$25',
      tag: 'New Patrons'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-3xl border border-slate-800 bg-slate-900/95 p-6 sm:p-7 shadow-2xl backdrop-blur-2xl">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
        >
          <X size={18} />
        </button>

        <div className="mb-6 space-y-1">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-[11px] font-bold text-amber-300">
            <Sparkles size={13} />
            <span>AUTHENTIC DISCOUNTS</span>
          </div>
          <h3 className="font-serif text-2xl font-bold text-white">
            Available Culinary Promotions
          </h3>
          <p className="text-xs text-slate-400">
            Click any code below to automatically apply it to your current order.
          </p>
        </div>

        <div className="space-y-3.5">
          {offers.map((offer) => {
            const isApplied = appliedCoupon === offer.code;
            return (
              <div
                key={offer.code}
                className={`p-4 rounded-2xl border transition-all ${
                  isApplied
                    ? 'border-emerald-500 bg-emerald-500/10 shadow-lg shadow-emerald-500/10'
                    : 'border-slate-800 bg-slate-950/70 hover:border-slate-700'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-black text-sm text-amber-300 tracking-wider bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                        {offer.code}
                      </span>
                      <span className="text-[10px] uppercase font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                        {offer.tag}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-white">{offer.title}</h4>
                    <p className="text-xs text-slate-400">{offer.desc}</p>
                    <span className="text-[10px] text-slate-500 block pt-1">
                      Minimum Subtotal: {offer.minOrder}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      onApplyCoupon(offer.code);
                      onClose();
                    }}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                      isApplied
                        ? 'bg-emerald-500 text-slate-950 shadow-md'
                        : 'border border-amber-500/40 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300'
                    }`}
                  >
                    {isApplied ? 'Applied' : 'Apply Code'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

