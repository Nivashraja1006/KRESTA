import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { Sparkles, Leaf, Clock, UtensilsCrossed, Check } from 'lucide-react';
import apiClient from '../../api/client';
import { useCart } from '../../context/CartContext';
import { MenuItem } from '../../types';

interface CuratedRole {
  label: string;
  dbId: number;
  fallbackName: string;
  fallbackDesc: string;
  fallbackPrice: number;
  fallbackImage: string;
  isVeg: boolean;
  prepTime: number;
}

// Exactly six Indian dishes corresponding to the six required merchandising roles
const INITIAL_CURATED_ROLES: CuratedRole[] = [
  {
    label: 'Restaurant Favourite',
    dbId: 4,
    fallbackName: 'Velvet Butter Chicken',
    fallbackDesc: 'Tender chicken simmered in a silky tomato, cashew cream, and fenugreek reduction.',
    fallbackPrice: 22.95,
    fallbackImage: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=800&auto=format&fit=crop&q=80',
    isVeg: false,
    prepTime: 18,
  },
  {
    label: 'Top Selling Dish',
    dbId: 1,
    fallbackName: 'Royal Dum Dum Chicken Biryani',
    fallbackDesc: 'Fragrant basmati layered with tender chicken, caramelized onions, and Kashmiri saffron.',
    fallbackPrice: 24.95,
    fallbackImage: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&auto=format&fit=crop&q=80',
    isVeg: false,
    prepTime: 25,
  },
  {
    label: 'Highest-Priced Dish',
    dbId: 3,
    fallbackName: 'Seafood Tiger Prawn Biryani',
    fallbackDesc: 'Succulent jumbo tiger prawns sautéed in coastal spices with fragrant cardamom basmati.',
    fallbackPrice: 28.95,
    fallbackImage: 'https://images.unsplash.com/photo-1559847844-5315695dadae?w=800&auto=format&fit=crop&q=80',
    isVeg: false,
    prepTime: 22,
  },
  {
    label: 'Lowest-Priced Dish',
    dbId: 10,
    fallbackName: 'Garlic & Cilantro Butter Naan',
    fallbackDesc: 'Clay-tandoor leavened flatbread brushed with fresh garlic butter and herbs.',
    fallbackPrice: 5.95,
    fallbackImage: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&auto=format&fit=crop&q=80',
    isVeg: true,
    prepTime: 6,
  },
  {
    label: 'Most Demanded Dish',
    dbId: 6,
    fallbackName: 'Kashmiri Rogan Josh',
    fallbackDesc: 'Slow-braised tender meat with ratan jot, crushed fennel, and rich Kashmiri chili jus.',
    fallbackPrice: 25.95,
    fallbackImage: 'https://images.unsplash.com/photo-1545247181-516773cae754?w=800&auto=format&fit=crop&q=80',
    isVeg: false,
    prepTime: 25,
  },
  {
    label: 'Most Popular / Most Ordered Dish',
    dbId: 8,
    fallbackName: 'Tandoori Chicken Skewers',
    fallbackDesc: 'Smoky roasted chicken skewers marinated in spiced hung curd and Kashmiri aromatics.',
    fallbackPrice: 16.95,
    fallbackImage: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=800&auto=format&fit=crop&q=80',
    isVeg: false,
    prepTime: 16,
  },
];

export const SignatureDishesSection: React.FC = () => {
  const shouldReduceMotion = useReducedMotion();
  const { addToCart, setIsCartDrawerOpen } = useCart();

  const [dbItems, setDbItems] = useState<Record<number, MenuItem>>({});
  const [curatedDishes, setCuratedDishes] = useState<CuratedRole[]>(INITIAL_CURATED_ROLES);
  const [currentIndex, setCurrentIndex] = useState(INITIAL_CURATED_ROLES.length); // Start in middle duplicated set
  const [isResetting, setIsResetting] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [addedDishId, setAddedDishId] = useState<number | null>(null);

  // Fetch real menu items from backend API to dynamically populate and compute stats
  useEffect(() => {
    let isMounted = true;
    const fetchCatalogData = async () => {
      try {
        const resp = await apiClient.get<MenuItem[]>('/menu/items');
        if (!isMounted) return;
        const items = Array.isArray(resp.data) ? resp.data : (resp.data as any)?.items || [];
        if (items.length > 0) {
          const map: Record<number, MenuItem> = {};
          items.forEach((item: MenuItem) => {
            map[item.id] = item;
          });
          setDbItems(map);

          // Calculate actual highest and lowest priced available dishes dynamically
          const sortedByPrice = [...items].sort((a, b) => b.price - a.price);
          const highestItem = sortedByPrice[0];
          const lowestItem = sortedByPrice[sortedByPrice.length - 1];

          setCuratedDishes((prev) =>
            prev.map((role) => {
              if (role.label === 'Highest-Priced Dish' && highestItem) {
                return {
                  ...role,
                  dbId: highestItem.id,
                  fallbackName: highestItem.name,
                  fallbackDesc: highestItem.description || role.fallbackDesc,
                  fallbackPrice: highestItem.price,
                  fallbackImage: highestItem.image_url || role.fallbackImage,
                  isVeg: highestItem.is_vegetarian,
                  prepTime: highestItem.preparation_time_minutes || 20,
                };
              }
              if (role.label === 'Lowest-Priced Dish' && lowestItem) {
                return {
                  ...role,
                  dbId: lowestItem.id,
                  fallbackName: lowestItem.name,
                  fallbackDesc: lowestItem.description || role.fallbackDesc,
                  fallbackPrice: lowestItem.price,
                  fallbackImage: lowestItem.image_url || role.fallbackImage,
                  isVeg: lowestItem.is_vegetarian,
                  prepTime: lowestItem.preparation_time_minutes || 6,
                };
              }
              return role;
            })
          );
        }
      } catch (err) {
        console.warn('Featured dishes: using verified database role values.', err);
      }
    };
    fetchCatalogData();
    return () => {
      isMounted = false;
    };
  }, []);

  const totalDishes = curatedDishes.length;

  // Triplicate the array for seamless infinite looping without sudden jumps
  const loopingDishes = [...curatedDishes, ...curatedDishes, ...curatedDishes];

  // Automatic left-to-right looping carousel: moves cards one at a time every 2.5 seconds
  useEffect(() => {
    if (isHovered || shouldReduceMotion) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => prev + 1);
    }, 2500);

    return () => clearInterval(interval);
  }, [isHovered, shouldReduceMotion]);

  // Seamless wrap-around after transitioning past the second set
  const handleAnimationComplete = () => {
    if (currentIndex >= totalDishes * 2) {
      setIsResetting(true);
      setCurrentIndex(totalDishes);
      requestAnimationFrame(() => {
        setIsResetting(false);
      });
    }
  };

  const handleOrderDish = (dish: CuratedRole, e: React.MouseEvent) => {
    e.stopPropagation();
    const liveItem = dbItems[dish.dbId];

    if (liveItem) {
      addToCart(liveItem, 1);
    } else {
      addToCart({
        id: dish.dbId,
        name: dish.fallbackName,
        description: dish.fallbackDesc,
        price: dish.fallbackPrice,
        cost_price: dish.fallbackPrice * 0.3,
        preparation_time_minutes: dish.prepTime,
        image_url: dish.fallbackImage,
        is_available: true,
        is_vegetarian: dish.isVeg,
        calories: 550,
        category_id: 1,
        recipes: [],
      } as unknown as MenuItem, 1);
    }

    setAddedDishId(dish.dbId);
    setIsCartDrawerOpen(true);
    setTimeout(() => setAddedDishId(null), 2500);
  };

  return (
    <section
      id="featured-dishes"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="py-16 sm:py-24 relative bg-[#060810] border-t border-amber-500/15 overflow-hidden"
    >
      {/* Background Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] sm:w-[950px] h-[350px] sm:h-[450px] bg-gradient-to-r from-amber-500/10 via-emerald-600/10 to-transparent blur-[140px] pointer-events-none rounded-full" />

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 relative z-10 w-full">
        {/* Concise Section Header */}
        <div className="text-center space-y-2.5 mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-[#0a0d18]/90 px-3.5 py-1 text-[11px] font-bold text-amber-300">
            <Sparkles size={12} />
            <span>CHEF SIGNATURES</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
            Our Signature Dishes
          </h2>

          <p className="text-sm sm:text-base text-slate-300 max-w-lg mx-auto font-normal">
            Six handpicked culinary favourites, crafted with traditional spices and wood-fired heat.
          </p>
        </div>

        {/* Automatic Looping Left-to-Right Carousel Track — NO visible dots, arrows, or controls */}
        <div className="relative w-full overflow-hidden">
          {/* Edge shadow fades */}
          <div className="absolute left-0 top-0 bottom-0 w-8 sm:w-16 bg-gradient-to-r from-[#060810] to-transparent z-20 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-8 sm:w-16 bg-gradient-to-l from-[#060810] to-transparent z-20 pointer-events-none" />

          <motion.div
            className="flex gap-5 sm:gap-6 items-stretch"
            animate={{
              x: `calc(-${currentIndex} * (340px + 1.25rem))`,
            }}
            onAnimationComplete={handleAnimationComplete}
            transition={
              isResetting
                ? { duration: 0 }
                : {
                    type: 'tween',
                    ease: [0.25, 1, 0.5, 1],
                    duration: 0.85,
                  }
            }
            style={{
              width: 'max-content',
            }}
          >
            {loopingDishes.map((dish, idx) => {
              const live = dbItems[dish.dbId];
              const name = live?.name || dish.fallbackName;
              const price = live ? live.price : dish.fallbackPrice;
              const desc = live?.description || dish.fallbackDesc;
              const prep = live?.preparation_time_minutes || dish.prepTime;
              const isVeg = live?.is_vegetarian ?? dish.isVeg;
              const img = live?.image_url || dish.fallbackImage;
              const isJustAdded = addedDishId === dish.dbId;

              return (
                <div
                  key={`${dish.dbId}-${idx}`}
                  className="w-[290px] xs:w-[320px] sm:w-[340px] flex-shrink-0 flex flex-col justify-between rounded-2xl bg-[#090c17]/95 border border-amber-500/25 shadow-[0_15px_45px_rgba(0,0,0,0.85)] hover:border-amber-400/60 transition-all duration-300 overflow-hidden group"
                >
                  {/* Dish Image Container */}
                  <div className="relative h-52 sm:h-56 w-full overflow-hidden bg-slate-900">
                    <img
                      src={img}
                      alt={name}
                      className="w-full h-full object-cover object-center filter brightness-[0.95] group-hover:scale-105 transition-transform duration-700 ease-out"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#090c17] via-transparent to-black/30 pointer-events-none" />

                    {/* Merchandising Role Badge */}
                    <div className="absolute top-3 left-3 flex items-center gap-1.5 rounded-full bg-[#080b14]/90 border border-amber-500/40 px-2.5 py-0.5 backdrop-blur-md shadow-md">
                      <span className="flex h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-200 font-mono">
                        {dish.label}
                      </span>
                    </div>

                    {/* Dietary Tag */}
                    <div className="absolute top-3 right-3">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold shadow-md ${
                          isVeg ? 'bg-emerald-600/90 text-white' : 'bg-rose-600/90 text-white'
                        }`}
                      >
                        <Leaf size={9} />
                        {isVeg ? 'Veg' : 'Non-Veg'}
                      </span>
                    </div>

                    {/* Price Tag */}
                    <div className="absolute bottom-2.5 right-2.5 rounded-lg bg-slate-950/85 border border-white/10 px-2.5 py-0.5 backdrop-blur-md shadow-lg">
                      <span className="font-serif font-black text-emerald-400 text-base">
                        ${price.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Card Content & Action Button */}
                  <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3.5">
                    <div className="space-y-1">
                      <h3 className="font-serif font-bold text-white text-base sm:text-lg line-clamp-1 group-hover:text-amber-200 transition-colors">
                        {name}
                      </h3>
                      <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed font-normal">
                        {desc}
                      </p>
                    </div>

                    <div className="pt-2.5 border-t border-white/[0.08] flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1 text-slate-400 text-xs">
                        <Clock size={12} className="text-emerald-400" />
                        <span>{prep} mins</span>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => handleOrderDish(dish, e)}
                        className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all duration-200 active:scale-95 touch-target ${
                          isJustAdded
                            ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/30'
                            : 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 hover:from-amber-300 hover:to-amber-400 shadow-md shadow-amber-500/20'
                        }`}
                      >
                        {isJustAdded ? (
                          <>
                            <Check size={12} />
                            <span>Added</span>
                          </>
                        ) : (
                          <>
                            <UtensilsCrossed size={12} />
                            <span>Order Dish</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </motion.div>
        </div>

        {/* Explore Full Menu Link */}
        <div className="mt-8 text-center">
          <Link
            to="/order"
            className="text-xs font-bold text-amber-300 hover:text-amber-200 transition-colors uppercase tracking-wider font-mono inline-flex items-center gap-1.5"
          >
            <span>Explore All Kitchen Dishes On Menu</span>
            <span>&rarr;</span>
          </Link>
        </div>
      </div>
    </section>
  );
};
