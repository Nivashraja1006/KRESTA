import React, { useState } from 'react';
import { X, Flame, Plus, Minus, Check, SlidersHorizontal, Sparkles } from 'lucide-react';
import { MenuItem } from '../../../types';
import { getMenuImageUrl, handleMenuImageError } from '../menuImages';

interface CustomizeModalProps {
  item: MenuItem | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (item: MenuItem, quantity: number, spiceLevel: 'Mild' | 'Medium' | 'Hot' | 'Extra Hot', notes: string) => void;
}

export const CustomizeModal: React.FC<CustomizeModalProps> = ({
  item,
  isOpen,
  onClose,
  onConfirm
}) => {
  if (!isOpen || !item) return null;

  const [quantity, setQuantity] = useState<number>(1);
  const [spiceLevel, setSpiceLevel] = useState<'Mild' | 'Medium' | 'Hot' | 'Extra Hot'>('Medium');
  const [instructions, setInstructions] = useState<string>('');

  const spiceOptions: Array<{ level: 'Mild' | 'Medium' | 'Hot' | 'Extra Hot'; desc: string; iconCount: number }> = [
    { level: 'Mild', desc: 'Delicate aroma, gentle warmth', iconCount: 1 },
    { level: 'Medium', desc: 'Authentic chef signature spice', iconCount: 2 },
    { level: 'Hot', desc: 'Bold Kashmiri chili heat', iconCount: 3 },
    { level: 'Extra Hot', desc: 'Fiery roasted ghost pepper notes', iconCount: 4 },
  ];

  const handleAdd = () => {
    onConfirm(item, quantity, spiceLevel, instructions.trim());
    onClose();
  };

  const totalPrice = (item.price * quantity).toFixed(2);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-3xl border border-slate-800 bg-slate-900/95 p-5 sm:p-7 shadow-2xl backdrop-blur-2xl">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X size={18} />
        </button>

        {/* Header with Dish Thumbnail */}
        <div className="flex items-center gap-3.5 pb-4 border-b border-slate-800">
          <img
            src={getMenuImageUrl(item)}
            alt={item.name}
            onError={(event) => handleMenuImageError(event, item)}
            className="h-16 w-16 rounded-2xl object-cover border border-slate-700"
          />
          <div>
            <span className="text-[10px] uppercase font-bold text-amber-300 font-mono tracking-wider">
              Culinary Customization
            </span>
            <h3 className="font-serif text-lg font-bold text-white line-clamp-1">{item.name}</h3>
            <span className="text-sm font-bold font-mono text-emerald-400">${item.price.toFixed(2)}</span>
          </div>
        </div>

        {/* Customization Options */}
        <div className="py-5 space-y-5">
          {/* 1. Spice Preference */}
          <div>
            <label className="flex items-center gap-1.5 text-xs font-bold text-slate-300 uppercase tracking-wider mb-2.5">
              <Flame size={14} className="text-amber-400" />
              <span>1. Choose Spice Profile</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              {spiceOptions.map((opt) => (
                <button
                  key={opt.level}
                  type="button"
                  onClick={() => setSpiceLevel(opt.level)}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    spiceLevel === opt.level
                      ? 'border-amber-400 bg-amber-500/15 text-white shadow-md shadow-amber-500/10'
                      : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold">{opt.level}</span>
                    <span className="text-amber-400 text-xs">{'🌶️'.repeat(opt.iconCount)}</span>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">{opt.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* 2. Chef Instructions */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              2. Special Preparation Notes
            </label>
            <textarea
              rows={2}
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="e.g. Less oil, extra cilantro, sauce packaged separately, allergy notes..."
              className="w-full rounded-xl bg-slate-950 border border-slate-800 p-3 text-xs text-white placeholder-slate-500 focus:border-brand-500 focus:outline-none resize-none"
            />
          </div>

          {/* 3. Quantity Controls */}
          <div className="flex items-center justify-between pt-2">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Quantity</span>
            <div className="flex items-center rounded-xl bg-slate-950 border border-slate-700 p-1">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="h-8 w-8 flex items-center justify-center rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white"
              >
                <Minus size={14} />
              </button>
              <span className="w-10 text-center font-mono font-bold text-sm text-white">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity((q) => q + 1)}
                className="h-8 w-8 flex items-center justify-center rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white"
              >
                <Plus size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* Confirm Footer */}
        <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-3">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-bold text-slate-400">Total Price</span>
            <span className="text-lg font-bold font-mono text-emerald-400">${totalPrice}</span>
          </div>

          <button
            type="button"
            onClick={handleAdd}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 px-6 py-3 text-xs font-extrabold text-slate-950 shadow-lg shadow-emerald-500/20 hover:from-emerald-400 hover:to-emerald-500 transition-all active:scale-95"
          >
            <span>Add Custom Dish to Cart</span>
          </button>
        </div>
      </div>
    </div>
  );
};
