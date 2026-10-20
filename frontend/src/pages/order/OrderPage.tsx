import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Sparkles,
  Star,
  Clock,
  MapPin,
  ArrowUpDown,
  Search,
  CheckCircle2,
  AlertCircle,
  ShoppingBag,
  SlidersHorizontal,
  Award,
  Plus,
  Minus,
  Heart,
  ChevronRight,
  Leaf
} from 'lucide-react';
import apiClient from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { MenuItem, Category } from '../../types';

import { CustomerNavbar } from '../../components/customer/CustomerNavbar';
import { CustomerFooter } from '../../components/customer/CustomerFooter';
import { FoodDetailModal } from './components/FoodDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { CustomerAuthModal } from './components/CustomerAuthModal';
import { OffersModal } from './components/OffersModal';

export const OrderPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const {
    cartItems,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    totalCartCount,
    subtotal,
    tax,
    deliveryFee,
    discount,
    total,
    appliedCouponMessage,
    applyCoupon,
    removeCoupon,
    isCartDrawerOpen,
    setIsCartDrawerOpen
  } = useCart();

  // State
  const [categories, setCategories] = useState<Category[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [branches, setBranches] = useState<Array<{ id: number; name: string; address?: string }>>([
    { id: 1, name: 'Downtown Flagship', address: '450 Mission Street, Financial District' },
    { id: 2, name: 'Uptown Bistro', address: '1200 Pacific Heights Blvd' },
    { id: 3, name: 'Airport Express', address: 'Terminal 2 Concourse C' }
  ]);
  const [selectedBranchId, setSelectedBranchId] = useState<number>(1);
  const [selectedCategory, setSelectedCategory] = useState<string>(() => {
    return searchParams.get('category') || 'All';
  });
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [vegOnlyFilter, setVegOnlyFilter] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'featured' | 'price-low' | 'price-high' | 'time'>('featured');
  const [favorites, setFavorites] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem('kresta_favorites');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Modals state
  const [selectedDetailItem, setSelectedDetailItem] = useState<MenuItem | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isOffersOpen, setIsOffersOpen] = useState(false);
  const [isLoadingMenu, setIsLoadingMenu] = useState(true);
  const [catalogError, setCatalogError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync favorites with localStorage
  useEffect(() => {
    try {
      localStorage.setItem('kresta_favorites', JSON.stringify(favorites));
    } catch (e) {
      console.error(e);
    }
  }, [favorites]);

  // Fetch Categories, Menu Items & Public Branches
  const fetchCatalog = async () => {
    setIsLoadingMenu(true);
    setCatalogError(null);
    try {
      const [catResp, itemsResp, branchResp] = await Promise.allSettled([
        apiClient.get<Category[]>('/menu/categories'),
        apiClient.get<MenuItem[]>('/menu/items'),
        apiClient.get<Array<{ id: number; name: string; address?: string }>>('/restaurants/public/branches')
      ]);

      if (catResp.status === 'fulfilled') {
        const catData = Array.isArray(catResp.value.data) ? catResp.value.data : (catResp.value.data as any)?.items || [];
        setCategories(catData);
      }
      if (itemsResp.status === 'fulfilled') {
        const itemsData = Array.isArray(itemsResp.value.data) ? itemsResp.value.data : (itemsResp.value.data as any)?.items || [];
        setMenuItems(itemsData);
      }
      if (branchResp.status === 'fulfilled') {
        const branchData = Array.isArray(branchResp.value.data) ? branchResp.value.data : (branchResp.value.data as any)?.items || [];
        if (branchData.length > 0) {
          setBranches(branchData);
        }
      }

      if (itemsResp.status === 'rejected') {
        const reason = itemsResp.reason?.message || 'Could not connect to culinary database';
        setCatalogError(`Unable to load menu dishes (${reason}). Please check connection and retry.`);
      }
    } catch (err: any) {
      console.error('Failed to load menu data:', err);
      setCatalogError('Failed to load culinary catalog.');
    } finally {
      setIsLoadingMenu(false);
    }
  };

  useEffect(() => {
    fetchCatalog();
  }, [selectedBranchId]);

  const toggleFavorite = (id: number) => {
    setFavorites((prev) => {
      const isFav = prev.includes(id);
      const updated = isFav ? prev.filter((favId) => favId !== id) : [...prev, id];
      showToast(isFav ? 'Removed from favorites' : 'Added to favorites');
      return updated;
    });
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const categoryChips = useMemo(() => {
    const backendNames = categories.map((c) => c.name);
    const unique = Array.from(new Set(['All', ...backendNames]));
    return unique.length > 1 ? unique : ['All', 'Starters', 'Biryani', 'Main Course', 'Artisan Breads', 'Pizza', 'Desserts', 'Burgers', 'Beverages'];
  }, [categories]);

  // Filtered & Sorted items
  const filteredItems = useMemo(() => {
    return menuItems.filter((item) => {
      if (selectedCategory !== 'All' && item.category?.name !== selectedCategory) {
        return false;
      }
      if (vegOnlyFilter) {
        const isVeg = item.is_vegetarian ?? (
          item.name.toLowerCase().includes('paneer') ||
          item.name.toLowerCase().includes('dal') ||
          item.name.toLowerCase().includes('margherita') ||
          item.name.toLowerCase().includes('veggie') ||
          item.name.toLowerCase().includes('gulab') ||
          item.name.toLowerCase().includes('truffle fries') ||
          item.name.toLowerCase().includes('naan')
        );
        if (!isVeg) return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = item.name.toLowerCase().includes(q);
        const matchDesc = item.description?.toLowerCase().includes(q);
        const matchCat = item.category?.name.toLowerCase().includes(q);
        if (!matchName && !matchDesc && !matchCat) return false;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'time') return (a.preparation_time_minutes || 20) - (b.preparation_time_minutes || 20);
      return b.id - a.id;
    });
  }, [menuItems, selectedCategory, vegOnlyFilter, searchQuery, sortBy]);

  // AI recommendations
  const aiRecommendations = useMemo(() => {
    return menuItems.slice(0, 3);
  }, [menuItems]);

  return (
    <div className="min-h-screen flex flex-col bg-[#05070d] text-slate-100 font-sans selection:bg-amber-500 selection:text-slate-950">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-24 right-6 z-50 flex items-center gap-2 rounded-2xl bg-[#0c101d] text-white px-4 py-3 text-xs font-bold shadow-2xl border border-amber-500/40 animate-in slide-in-from-bottom-5">
          <CheckCircle2 size={16} className="text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Customer Header */}
      <CustomerNavbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        branches={branches}
        selectedBranchId={selectedBranchId}
        onSelectBranch={setSelectedBranchId}
        onOpenAuthModal={() => setIsAuthOpen(true)}
      />

      {/* Full-Width Main Ordering Container */}
      <main className="flex-1 max-w-[1720px] mx-auto w-full px-4 sm:px-6 lg:px-10 xl:px-12 py-6 sm:py-8 pb-32 sm:pb-36">
        {/* Restaurant Cover Banner */}
        <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-[#090d19] shadow-2xl mb-8">
          <div className="relative h-48 sm:h-64 w-full">
            <img
              src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1600&auto=format&fit=crop&q=80"
              alt="The Royal Saffron Gourmet"
              className="h-full w-full object-cover brightness-[0.40] filter"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#05070d] via-[#05070d]/60 to-transparent" />

            {/* Restaurant Info Card */}
            <div className="absolute bottom-5 left-5 right-5 sm:bottom-7 sm:left-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div className="space-y-1.5">
                <span className="font-serif font-black text-2xl sm:text-4xl text-white tracking-wide">
                  The Royal Saffron Gourmet
                </span>
                <p className="text-xs sm:text-sm text-slate-300">
                  Royal Dum Biryani • Wood-Fired Pizza • Artisanal Burgers • Fine Indian & Continental
                </p>
                <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-slate-300">
                  <span className="flex items-center gap-1 font-bold text-amber-300 bg-amber-950/70 px-2.5 py-0.5 rounded-lg border border-amber-500/40">
                    <Star size={13} fill="currentColor" className="text-amber-400" /> 4.9 (1,840+ verified reviews)
                  </span>
                  <span className="flex items-center gap-1 bg-black/60 px-2.5 py-0.5 rounded-lg border border-white/10">
                    <Clock size={13} className="text-emerald-400" /> 25–35 mins prep
                  </span>
                  <span className="hidden sm:flex items-center gap-1 bg-black/60 px-2.5 py-0.5 rounded-lg border border-white/10">
                    <MapPin size={13} className="text-amber-400" /> Downtown SF • 1.2 mi
                  </span>
                </div>
              </div>

              {/* Special Offer Pill */}
              <button
                onClick={() => setIsOffersOpen(true)}
                className="self-start sm:self-auto flex items-center gap-2 rounded-2xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-400/40 px-4 py-2 text-xs font-bold text-amber-200 shadow-lg backdrop-blur-md transition-all active:scale-95"
              >
                <Sparkles size={14} className="text-amber-400" />
                <span>Offers: 20% Off Code 'KRESTA20'</span>
              </button>
            </div>
          </div>
        </div>

        {/* AI Chef's Recommended Trio Banner */}
        {aiRecommendations.length > 0 && selectedCategory === 'All' && !searchQuery && (
          <div className="mb-8 rounded-3xl bg-gradient-to-r from-emerald-950/30 via-[#0a0f1d] to-[#070b14] p-5 sm:p-6 text-white border border-emerald-500/30 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  <Award size={16} />
                </span>
                <span className="font-serif font-black text-lg text-white">
                  Chef's Intelligence Recommendations
                </span>
                <span className="text-[10px] font-bold text-emerald-300 bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-600/50">
                  AI Trend Forecast
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {aiRecommendations.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setSelectedDetailItem(item)}
                  className="group cursor-pointer rounded-2xl bg-[#0d1222]/90 border border-white/10 p-3 flex items-center gap-3.5 hover:border-emerald-500/50 hover:bg-[#12182c] transition-all shadow-md"
                >
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="w-16 h-16 rounded-xl object-cover border border-white/10 flex-shrink-0 group-hover:scale-105 transition-transform"
                  />
                  <div className="flex-1 truncate">
                    <p className="font-bold text-white text-xs truncate group-hover:text-emerald-400 transition-colors">
                      {item.name}
                    </p>
                    <p className="text-[11px] text-slate-400 truncate mt-0.5">
                      ${item.price.toFixed(2)} • {item.preparation_time_minutes || 20}m prep
                    </p>
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 mt-1">
                      <Sparkles size={10} /> Highest rated today
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Filter and Category Controls */}
        <div className="space-y-4 mb-8">
          {/* Horizontally Scrollable Category Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {categoryChips.map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all whitespace-nowrap shadow-sm flex items-center gap-1.5 active:scale-95 ${
                    isActive
                      ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black shadow-lg shadow-amber-500/20'
                      : 'bg-[#0c101d] border border-white/10 text-slate-300 hover:text-white hover:border-amber-400/40 hover:bg-[#12182c]'
                  }`}
                >
                  {cat === 'All' && <SlidersHorizontal size={13} />}
                  {cat === 'Biryani' && <span>👑</span>}
                  {cat === 'Pizza' && <span>🍕</span>}
                  {cat === 'Burgers' && <span>🍔</span>}
                  <span>{cat}</span>
                </button>
              );
            })}
          </div>

          {/* Secondary Filter Bar: Veg Only + Sort By */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-[#0c101d] rounded-2xl border border-white/10 shadow-md">
            <div className="flex items-center gap-3">
              {/* Veg Toggle */}
              <button
                type="button"
                onClick={() => setVegOnlyFilter(!vegOnlyFilter)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  vegOnlyFilter
                    ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/40'
                    : 'bg-white/[0.04] text-slate-300 hover:text-white border border-white/10'
                }`}
              >
                <span className={`w-3 h-3 rounded-full border flex items-center justify-center ${
                  vegOnlyFilter ? 'border-emerald-500 bg-emerald-500' : 'border-slate-500'
                }`}>
                  {vegOnlyFilter && <span className="w-1.5 h-1.5 rounded-full bg-slate-950"></span>}
                </span>
                <span>Pure Veg Only</span>
              </button>

              <span className="text-xs text-slate-400 font-medium">
                {isLoadingMenu ? (
                  <span>Loading dishes...</span>
                ) : catalogError && menuItems.length === 0 ? (
                  <span className="text-rose-400 font-bold">Catalog unavailable</span>
                ) : (
                  <span>Showing <strong className="text-white">{filteredItems.length}</strong> {filteredItems.length === 1 ? 'dish' : 'dishes'}</span>
                )}
              </span>
            </div>

            {/* Sort Selector */}
            <div className="flex items-center gap-2">
              <ArrowUpDown size={14} className="text-slate-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                aria-label="Sort dishes"
                className="bg-[#070a14] border border-white/10 text-xs font-bold text-slate-200 rounded-xl px-3 py-1.5 focus:outline-none focus:border-amber-400/60"
              >
                <option value="featured">Featured / Best Sellers</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="time">Fastest Preparation</option>
              </select>
            </div>
          </div>
        </div>

        {/* Full-Width Menu Items Grid (Note: Persistent right-side cart panel removed to use the full viewport width) */}
        {isLoadingMenu ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-5 sm:gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
              <div key={n} className="bg-[#0c101d] rounded-3xl p-4 border border-white/10 shadow-md animate-pulse space-y-3">
                <div className="h-44 bg-slate-850 rounded-2xl" />
                <div className="h-4 bg-slate-800 rounded w-2/3" />
                <div className="h-3 bg-slate-800 rounded w-full" />
                <div className="h-8 bg-slate-800 rounded-xl" />
              </div>
            ))}
          </div>
        ) : catalogError && menuItems.length === 0 ? (
          <div className="bg-[#0c101d] rounded-3xl border border-rose-500/30 p-12 text-center text-slate-300 shadow-md">
            <AlertCircle size={36} className="mx-auto text-rose-400 mb-2" />
            <h3 className="font-bold text-white text-base">{catalogError}</h3>
            <p className="text-xs text-slate-400 mt-1 mb-4">We are having trouble contacting the kitchen database.</p>
            <button
              onClick={fetchCatalog}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-colors"
            >
              Retry Connection
            </button>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="bg-[#0c101d] rounded-3xl border border-white/10 p-12 text-center text-slate-400 shadow-md">
            <Search size={36} className="mx-auto text-slate-500 mb-2" />
            <h3 className="font-bold text-white text-base">No culinary dishes match your query</h3>
            <p className="text-xs text-slate-400 mt-1 mb-4">Try clearing your filters or searching another category.</p>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSearchQuery('');
                setVegOnlyFilter(false);
              }}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-5 sm:gap-6">
            {filteredItems.map((item) => {
              const existingInCart = cartItems.find((c) => c.menuItem.id === item.id);
              const isFav = favorites.includes(item.id);
              const isVeg = item.is_vegetarian ?? (
                item.name.toLowerCase().includes('paneer') ||
                item.name.toLowerCase().includes('dal') ||
                item.name.toLowerCase().includes('margherita') ||
                item.name.toLowerCase().includes('veggie') ||
                item.name.toLowerCase().includes('gulab') ||
                item.name.toLowerCase().includes('truffle fries') ||
                item.name.toLowerCase().includes('naan')
              );

              return (
                <div
                  key={item.id}
                  className="group bg-[#0c101d] rounded-2xl sm:rounded-3xl border border-white/[0.08] overflow-hidden shadow-lg shadow-black/40 hover:shadow-2xl hover:border-amber-500/40 hover:bg-[#101626] transition-all flex flex-col justify-between"
                >
                  {/* Image container */}
                  <div
                    onClick={() => setSelectedDetailItem(item)}
                    className="relative h-48 sm:h-52 w-full overflow-hidden bg-slate-900 cursor-pointer"
                  >
                    <img
                      src={item.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80'}
                      alt={item.name}
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0c101d] via-transparent to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />

                    {/* Top badges */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold shadow-xs ${
                        isVeg ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
                      }`}>
                        <Leaf size={10} />
                        {isVeg ? 'Veg' : 'Non-Veg'}
                      </span>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(item.id);
                        }}
                        className={`p-1.5 rounded-full shadow-md backdrop-blur-md transition-all border border-white/10 ${
                          isFav ? 'bg-rose-950/80 text-rose-400 border-rose-500/40' : 'bg-black/60 text-slate-300 hover:text-rose-400'
                        }`}
                        aria-label="Bookmark dish"
                      >
                        <Heart size={14} fill={isFav ? 'currentColor' : 'none'} />
                      </button>
                    </div>

                    {/* Prep time badge */}
                    <div className="absolute bottom-3 left-3 flex items-center gap-1 px-2 py-0.5 rounded-lg bg-black/75 backdrop-blur-md text-amber-300 text-[10px] font-bold border border-white/10">
                      <Clock size={11} />
                      <span>{item.preparation_time_minutes || 20}m prep</span>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div
                      onClick={() => setSelectedDetailItem(item)}
                      className="cursor-pointer space-y-1.5"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-serif font-black text-base text-white group-hover:text-amber-300 transition-colors line-clamp-1">
                          {item.name}
                        </h4>
                      </div>
                      <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                        {item.description || 'Heritage spices, chef curated recipe.'}
                      </p>
                    </div>

                    {/* Price and Cart Controls */}
                    <div className="pt-3 border-t border-white/[0.08] flex items-center justify-between">
                      <span className="font-serif font-black text-xl text-amber-300">
                        ${item.price.toFixed(2)}
                      </span>

                      {existingInCart ? (
                        <div className="flex items-center border border-emerald-500/40 bg-emerald-950/40 rounded-xl p-0.5">
                          <button
                            onClick={() => updateQuantity(item.id, -1, existingInCart.spiceLevel)}
                            className="p-1 text-emerald-400 hover:bg-emerald-900/60 rounded-lg transition-colors"
                            aria-label="Decrease quantity"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="w-7 text-center font-bold text-xs text-white">
                            {existingInCart.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, 1, existingInCart.spiceLevel)}
                            className="p-1 text-emerald-400 hover:bg-emerald-900/60 rounded-lg transition-colors"
                            aria-label="Increase quantity"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            addToCart(item, 1, 'Medium');
                            showToast(`Added ${item.name} to cart!`);
                          }}
                          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-slate-950 font-bold text-xs shadow-md shadow-emerald-950/40 transition-all transform active:scale-95"
                        >
                          <Plus size={14} />
                          <span>Add</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* COMPACT FLOATING BOTTOM CART SUMMARY (Replaces large desktop side panel) */}
      {totalCartCount > 0 && (
        <div className="fixed bottom-5 inset-x-4 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 z-40 max-w-xl w-[calc(100%-2rem)] sm:w-auto min-w-[340px] sm:min-w-[480px] bg-[#0c101d]/95 backdrop-blur-2xl border border-amber-500/35 rounded-2xl px-4 py-3 sm:px-5 sm:py-3.5 shadow-[0_15px_40px_rgba(0,0,0,0.85)] flex items-center justify-between gap-4 animate-in slide-in-from-bottom-5 duration-200">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex-shrink-0">
              <ShoppingBag size={18} />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-300 block">
                {totalCartCount} {totalCartCount === 1 ? 'item' : 'items'} in cart
              </span>
              <span className="font-serif font-black text-base sm:text-lg text-emerald-400 leading-tight">
                Total: ${total.toFixed(2)}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsCartDrawerOpen(true)}
              className="px-3.5 py-2.5 rounded-xl border border-white/15 bg-white/[0.05] hover:bg-white/[0.1] text-xs font-bold text-slate-200 transition-colors active:scale-95 touch-target"
              aria-label="View cart details"
            >
              View Cart
            </button>
            <button
              onClick={() => navigate('/order/checkout')}
              className="flex items-center gap-1.5 px-4 sm:px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-slate-950 font-black text-xs shadow-md transition-all active:scale-95 touch-target"
              aria-label="Proceed to checkout"
            >
              <span>Checkout</span>
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}

      {/* Food Details Modal */}
      <FoodDetailModal
        item={selectedDetailItem}
        onClose={() => setSelectedDetailItem(null)}
        isFavorite={selectedDetailItem ? favorites.includes(selectedDetailItem.id) : false}
        onToggleFavorite={toggleFavorite}
        onAddedToCart={(name) => showToast(`Added ${name} to cart!`)}
      />

      {/* Slide-out Cart Drawer Overlay (Opens on "View Cart" click) */}
      {isCartDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/75 backdrop-blur-xs animate-in fade-in duration-200">
          <div
            className="fixed inset-0"
            onClick={() => setIsCartDrawerOpen(false)}
            aria-label="Close cart drawer"
          />
          <div className="relative w-full max-w-md bg-[#0a0e1a] border-l border-white/10 shadow-2xl h-full flex flex-col p-6 z-10 animate-in slide-in-from-right duration-300">
            <CartDrawer
              items={cartItems}
              subtotal={subtotal}
              tax={tax}
              deliveryFee={deliveryFee}
              discount={discount}
              total={total}
              appliedCoupon={appliedCouponMessage}
              couponMessage={appliedCouponMessage}
              couponError={null}
              onApplyCoupon={applyCoupon}
              onRemoveCoupon={removeCoupon}
              onUpdateQuantity={updateQuantity}
              onRemoveItem={removeFromCart}
              onClearCart={clearCart}
              onCheckout={() => {
                setIsCartDrawerOpen(false);
                navigate('/order/checkout');
              }}
              onCloseMobile={() => setIsCartDrawerOpen(false)}
              isMobileDrawer={true}
            />
          </div>
        </div>
      )}

      {/* Customer Auth Modal */}
      <CustomerAuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        currentUser={user}
      />

      {/* Offers Modal */}
      <OffersModal
        isOpen={isOffersOpen}
        onClose={() => setIsOffersOpen(false)}
        onApplyCoupon={(_code) => {
          setIsOffersOpen(false);
          navigate('/order/cart');
        }}
        appliedCoupon={null}
      />

      <CustomerFooter />
    </div>
  );
};
