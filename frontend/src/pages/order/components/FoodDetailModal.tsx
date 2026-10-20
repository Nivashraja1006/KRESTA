import React, { useState } from 'react';
import {
  X,
  Clock,
  Flame,
  Leaf,
  Plus,
  Minus,
  ShoppingBag,
  ShieldCheck,
  Heart,
  AlertCircle
} from 'lucide-react';
import { MenuItem } from '../../../types';
import { useCart } from '../../../context/CartContext';
import { getMenuImageUrl, handleMenuImageError } from '../menuImages';

interface FoodDetailModalProps {
  item: MenuItem | null;
  onClose: () => void;
  isFavorite?: boolean;
  onToggleFavorite?: (id: number) => void;
  onAddedToCart?: (dishName: string) => void;
}

export const FoodDetailModal: React.FC<FoodDetailModalProps> = ({
  item,
  onClose,
  isFavorite = false,
  onToggleFavorite,
  onAddedToCart
}) => {
  const { addToCart } = useCart();

  const [portion, setPortion] = useState<'REGULAR' | 'LARGE' | 'FAMILY'>('REGULAR');
  const [spiceLevel, setSpiceLevel] = useState<string>('Medium');
  const [specialInstructions, setSpecialInstructions] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);

  if (!item) return null;

  // Portion price modifiers
  const portionModifier = portion === 'LARGE' ? 4.50 : portion === 'FAMILY' ? 9.00 : 0.00;
  const unitPrice = item.price + portionModifier;
  const totalPrice = Math.round(unitPrice * quantity * 100) / 100;

  const isVeg = item.is_vegetarian ?? (
    item.name.toLowerCase().includes('paneer') ||
    item.name.toLowerCase().includes('dal') ||
    item.name.toLowerCase().includes('margherita') ||
    item.name.toLowerCase().includes('veggie') ||
    item.name.toLowerCase().includes('gulab') ||
    item.name.toLowerCase().includes('truffle fries') ||
    item.name.toLowerCase().includes('masala chai') ||
    item.name.toLowerCase().includes('mojito') ||
    item.name.toLowerCase().includes('naan')
  );

  const allergens = [
    item.name.toLowerCase().includes('paneer') || item.name.toLowerCase().includes('pizza') || item.name.toLowerCase().includes('burger') ? 'Dairy' : null,
    item.name.toLowerCase().includes('bread') || item.name.toLowerCase().includes('pizza') || item.name.toLowerCase().includes('burger') || item.name.toLowerCase().includes('naan') ? 'Gluten' : null,
    item.name.toLowerCase().includes('biryani') || item.name.toLowerCase().includes('dessert') ? 'Tree Nuts (Garnish)' : null
  ].filter(Boolean);

  const handleAddToCart = () => {
    const fullNotes = [
      portion !== 'REGULAR' ? `Portion: ${portion}` : null,
      specialInstructions.trim() ? specialInstructions.trim() : null
    ].filter(Boolean).join(' | ');

    addToCart(item, quantity, spiceLevel, fullNotes);
    if (onAddedToCart) onAddedToCart(item.name);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#0c101d] rounded-3xl shadow-2xl overflow-hidden border border-white/10 text-slate-100 max-h-[90vh] flex flex-col">
        {/* Header Image */}
        <div className="relative h-60 sm:h-72 w-full flex-shrink-0 bg-slate-900">
          <img
            src={getMenuImageUrl(item)}
            alt={item.name}
            onError={(event) => handleMenuImageError(event, item)}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0c101d] via-[#0c101d]/30 to-black/40" />

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/60 text-slate-300 hover:bg-black/90 hover:text-white border border-white/15 shadow-md transition-all"
            aria-label="Close dialog"
          >
            <X size={18} />
          </button>

          {/* Favorite Toggle */}
          {onToggleFavorite && (
            <button
              onClick={() => onToggleFavorite(item.id)}
              className={`absolute top-4 left-4 p-2 rounded-full shadow-md backdrop-blur-md transition-all border border-white/15 ${
                isFavorite
                  ? 'bg-rose-950/80 text-rose-400'
                  : 'bg-black/60 text-slate-300 hover:text-rose-400'
              }`}
              aria-label="Toggle Favorite"
            >
              <Heart size={18} fill={isFavorite ? 'currentColor' : 'none'} />
            </button>
          )}

          {/* Badges on Image */}
          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white">
            <div className="flex items-center gap-2">
              <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                isVeg ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
              }`}>
                <Leaf size={12} />
                {isVeg ? 'Pure Vegetarian' : 'Non-Vegetarian'}
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-black/70 backdrop-blur-md text-amber-300 border border-amber-400/30">
                <Clock size={12} />
                {item.preparation_time_minutes || 20} mins prep
              </span>
            </div>
            <span className="text-xl sm:text-2xl font-black text-amber-300 font-serif">
              ${item.price.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1 scrollbar-thin">
          {/* Dish Name & Description */}
          <div>
            <h2 className="text-2xl font-black text-white tracking-tight font-serif">
              {item.name}
            </h2>
            <p className="text-sm text-slate-300 mt-2 leading-relaxed">
              {item.description || 'Artfully prepared by KRESTA master chefs using authentic heritage spices and premium locally-sourced produce.'}
            </p>
          </div>

          {/* Portion Size Selection */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Select Portion Size
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              <button
                type="button"
                onClick={() => setPortion('REGULAR')}
                className={`p-3 rounded-2xl border text-center transition-all ${
                  portion === 'REGULAR'
                    ? 'border-amber-400/80 bg-amber-500/15 text-amber-200 font-bold shadow-sm'
                    : 'border-white/10 bg-[#080b14] hover:border-white/20 text-slate-300'
                }`}
              >
                <p className="text-xs font-bold">Standard</p>
                <p className="text-[11px] text-slate-400 mt-0.5">${item.price.toFixed(2)}</p>
              </button>

              <button
                type="button"
                onClick={() => setPortion('LARGE')}
                className={`p-3 rounded-2xl border text-center transition-all ${
                  portion === 'LARGE'
                    ? 'border-amber-400/80 bg-amber-500/15 text-amber-200 font-bold shadow-sm'
                    : 'border-white/10 bg-[#080b14] hover:border-white/20 text-slate-300'
                }`}
              >
                <p className="text-xs font-bold">Large (+40%)</p>
                <p className="text-[11px] text-slate-400 mt-0.5">+${4.50.toFixed(2)}</p>
              </button>

              <button
                type="button"
                onClick={() => setPortion('FAMILY')}
                className={`p-3 rounded-2xl border text-center transition-all ${
                  portion === 'FAMILY'
                    ? 'border-amber-400/80 bg-amber-500/15 text-amber-200 font-bold shadow-sm'
                    : 'border-white/10 bg-[#080b14] hover:border-white/20 text-slate-300'
                }`}
              >
                <p className="text-xs font-bold">Family Feast</p>
                <p className="text-[11px] text-slate-400 mt-0.5">+${9.00.toFixed(2)}</p>
              </button>
            </div>
          </div>

          {/* Spice Level Profile */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
              <span>Spice Profile</span>
              <span className="text-emerald-400 font-bold text-xs">{spiceLevel}</span>
            </label>
            <div className="grid grid-cols-4 gap-2">
              {['Mild', 'Medium', 'Hot', 'Extra Hot'].map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => setSpiceLevel(level)}
                  className={`py-2 px-3 rounded-xl border text-xs font-semibold transition-all flex items-center justify-center gap-1 ${
                    spiceLevel === level
                      ? 'border-emerald-500 bg-emerald-600 text-slate-950 font-bold shadow-sm'
                      : 'border-white/10 bg-[#080b14] text-slate-300 hover:bg-white/[0.04]'
                  }`}
                >
                  <Flame size={12} className={spiceLevel === level ? 'text-slate-950' : 'text-slate-500'} />
                  <span>{level}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Ingredients & Allergen Declaration */}
          <div className="bg-[#080b14] border border-white/10 rounded-2xl p-4 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-white">
              <ShieldCheck size={16} className="text-emerald-400" />
              <span>Verified Kitchen Preparation & Allergens</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {item.recipes && item.recipes.length > 0 ? (
                <span>
                  <strong>Fresh Ingredients:</strong> {item.recipes.map((r) => r.ingredient?.name).filter(Boolean).join(', ')}.
                </span>
              ) : (
                <span>
                  Made fresh to order with certified authentic pantry spices, cold-pressed oils, and farm herbs.
                </span>
              )}
            </p>
            {allergens.length > 0 && (
              <div className="flex items-center gap-1.5 pt-1 text-[11px] text-amber-300">
                <AlertCircle size={13} className="text-amber-400 flex-shrink-0" />
                <span>Contains: <strong>{allergens.join(', ')}</strong>. Please let the kitchen know of severe sensitivities.</span>
              </div>
            )}
          </div>

          {/* Kitchen Instructions */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Chef Instructions (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Less oil, extra cilantro, dressing on the side..."
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-[#080b14] text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400/60 focus:ring-1 focus:ring-amber-400/20"
              maxLength={150}
            />
          </div>
        </div>

        {/* Modal Footer with Quantity & Add to Cart */}
        <div className="p-4 sm:p-6 bg-[#080b14] border-t border-white/10 flex items-center justify-between gap-4">
          {/* Quantity Controls */}
          <div className="flex items-center border border-white/15 bg-[#0c101d] rounded-2xl p-1 shadow-sm">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="p-2 text-slate-400 hover:text-white hover:bg-white/[0.08] rounded-xl transition-colors disabled:opacity-40"
              disabled={quantity <= 1}
            >
              <Minus size={16} />
            </button>
            <span className="w-10 text-center font-bold text-white text-sm">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="p-2 text-slate-400 hover:text-white hover:bg-white/[0.08] rounded-xl transition-colors"
            >
              <Plus size={16} />
            </button>
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            className="flex-1 flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-slate-950 font-black text-sm shadow-lg shadow-emerald-950/50 transition-all transform active:scale-[0.98]"
          >
            <ShoppingBag size={18} />
            <span>Add to Cart • ${totalPrice.toFixed(2)}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
