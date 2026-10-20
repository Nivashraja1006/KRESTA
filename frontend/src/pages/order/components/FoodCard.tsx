import React from 'react';
import {
  Heart,
  Plus,
  Minus,
  Clock,
  Flame,
  SlidersHorizontal,
  Check
} from 'lucide-react';
import { MenuItem } from '../../../types';
import { getMenuImageUrl, handleMenuImageError } from '../menuImages';

interface FoodCardProps {
  item: MenuItem;
  cartQuantity: number;
  isFavorite: boolean;
  onToggleFavorite: (itemId: number) => void;
  onAddToCart: (item: MenuItem) => void;
  onUpdateQuantity: (itemId: number, delta: number) => void;
  onOpenCustomize: (item: MenuItem) => void;
}

export const FoodCard: React.FC<FoodCardProps> = ({
  item,
  cartQuantity,
  isFavorite,
  onToggleFavorite,
  onAddToCart,
  onUpdateQuantity,
  onOpenCustomize
}) => {
  const isAvailable = item.is_available;

  return (
    <div
      className={`group relative flex flex-col justify-between rounded-3xl border border-slate-800/80 bg-slate-900/60 p-4 transition-all duration-300 hover:border-slate-700/80 hover:bg-slate-900/90 hover:shadow-2xl hover:shadow-slate-950/60 backdrop-blur-md ${
        !isAvailable ? 'opacity-65 grayscale-[30%]' : ''
      }`}
    >
      <div>
        {/* Food Image Container */}
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-slate-950">
          <img
            src={getMenuImageUrl(item)}
            alt={item.name}
            onError={(event) => handleMenuImageError(event, item)}
            className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            loading="lazy"
          />

          {/* Top Badges Overlay */}
          <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
            {/* Veg / Non-Veg Indicator */}
            <div
              className={`flex items-center justify-center h-6 w-6 rounded-lg bg-slate-950/90 backdrop-blur-md border ${
                item.is_vegetarian ? 'border-emerald-500/50' : 'border-rose-500/50'
              }`}
              title={item.is_vegetarian ? 'Vegetarian' : 'Non-Vegetarian'}
            >
              <div
                className={`h-2.5 w-2.5 rounded-full ${
                  item.is_vegetarian ? 'bg-emerald-400' : 'bg-rose-500'
                }`}
              />
            </div>

            {/* Preparation Time Pill */}
            {item.preparation_time_minutes > 0 && (
              <span className="inline-flex items-center gap-1 rounded-lg bg-slate-950/85 backdrop-blur-md px-2 py-1 text-[10px] font-mono font-medium text-slate-300 border border-slate-800">
                <Clock size={11} className="text-amber-400" />
                <span>{item.preparation_time_minutes}m</span>
              </span>
            )}
          </div>

          {/* Favorite Toggle Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(item.id);
            }}
            className={`absolute top-2.5 right-2.5 flex h-8 w-8 items-center justify-center rounded-xl bg-slate-950/80 backdrop-blur-md border transition-all ${
              isFavorite
                ? 'border-rose-500/50 text-rose-400 bg-rose-500/10'
                : 'border-slate-800 text-slate-400 hover:text-rose-400 hover:border-slate-700'
            }`}
            aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Heart size={15} className={isFavorite ? 'fill-rose-500 text-rose-500' : ''} />
          </button>

          {/* Out of Stock Ribbon */}
          {!isAvailable && (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs">
              <span className="rounded-xl border border-red-500/40 bg-red-500/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-red-300">
                Currently Sold Out
              </span>
            </div>
          )}
        </div>

        {/* Content Info */}
        <div className="mt-4 space-y-1.5">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-serif text-base font-bold text-white group-hover:text-amber-300 transition-colors line-clamp-1">
              {item.name}
            </h3>
          </div>

          <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
            {item.description || 'Delicately crafted by our executive culinary masters using seasonal artisan ingredients.'}
          </p>

          {item.calories && (
            <div className="flex items-center gap-2 pt-0.5 text-[11px] text-slate-400 font-mono">
              <span className="flex items-center gap-1">
                <Flame size={11} className="text-amber-400" />
                <span>{item.calories} kcal</span>
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Footer: Price and Add / Quantity Controls */}
      <div className="mt-5 pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
        <div className="flex flex-col">
          <span className="text-[10px] uppercase font-bold text-slate-400">Price</span>
          <span className="text-lg font-black text-white font-mono tracking-tight">
            ${item.price.toFixed(2)}
          </span>
        </div>

        {/* Action Controls */}
        {isAvailable ? (
          cartQuantity > 0 ? (
            <div className="flex items-center gap-1.5">
              <div className="flex items-center rounded-xl bg-slate-950 border border-slate-700 p-0.5 shadow-inner">
                <button
                  type="button"
                  onClick={() => onUpdateQuantity(item.id, -1)}
                  className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                  aria-label="Decrease quantity"
                >
                  <Minus size={13} />
                </button>
                <span className="w-7 text-center font-mono text-xs font-bold text-amber-300">
                  {cartQuantity}
                </span>
                <button
                  type="button"
                  onClick={() => onUpdateQuantity(item.id, 1)}
                  className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                  aria-label="Increase quantity"
                >
                  <Plus size={13} />
                </button>
              </div>

              {/* Quick customize button */}
              <button
                type="button"
                onClick={() => onOpenCustomize(item)}
                className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-amber-300 border border-slate-700 transition-colors"
                title="Customize spice level and cooking notes"
              >
                <SlidersHorizontal size={13} />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => onOpenCustomize(item)}
                className="hidden sm:flex h-8 w-8 items-center justify-center rounded-xl bg-slate-800/60 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-700/60 transition-colors"
                title="Customize dish"
              >
                <SlidersHorizontal size={13} />
              </button>

              <button
                type="button"
                onClick={() => onAddToCart(item)}
                className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 px-3.5 py-2 text-xs font-extrabold text-slate-950 shadow-md shadow-emerald-500/20 hover:from-emerald-400 hover:to-emerald-500 transition-all duration-200 active:scale-95"
              >
                <Plus size={14} />
                <span>Add</span>
              </button>
            </div>
          )
        ) : (
          <span className="text-xs font-semibold text-slate-500">Unavailable</span>
        )}
      </div>
    </div>
  );
};
