import React, { useState, useEffect } from 'react';
import {
  UtensilsCrossed,
  Plus,
  Search,
  Check,
  X,
  Clock,
  Sparkles,
  Flame,
  Leaf,
  Layers,
  Edit2,
  Trash2,
  ChevronDown
} from 'lucide-react';
import apiClient from '../../api/client';
import { MenuItem, Category, Ingredient } from '../../types';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';

export const MenuPage: React.FC = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | 'ALL'>('ALL');
  const [vegOnly, setVegOnly] = useState<boolean>(false);
  const [search, setSearch] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // New Item Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState<number>(1);
  const [price, setPrice] = useState<number>(18.0);
  const [costPrice, setCostPrice] = useState<number>(5.5);
  const [prepTime, setPrepTime] = useState<number>(15);
  const [isVeg, setIsVeg] = useState<boolean>(false);
  const [selectedRecipes, setSelectedRecipes] = useState<{ ingredient_id: number; quantity_required: number; unit: string }[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [itemsResp, catResp, ingResp] = await Promise.all([
        apiClient.get<MenuItem[]>('/menu/items'),
        apiClient.get<Category[]>('/menu/categories'),
        apiClient.get<Ingredient[]>('/menu/ingredients')
      ]);
      setMenuItems(itemsResp.data);
      setCategories(catResp.data);
      setIngredients(ingResp.data);
      if (catResp.data.length > 0) setCategoryId(catResp.data[0].id);
    } catch (e) {
      console.error('Failed to load menu catalog:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleToggleAvailability = async (item: MenuItem) => {
    try {
      const resp = await apiClient.patch<MenuItem>(`/menu/items/${item.id}/toggle-availability`);
      setMenuItems((prev) =>
        prev.map((i) => (i.id === item.id ? { ...i, is_available: resp.data.is_available } : i))
      );
    } catch (e) {
      console.error('Failed to toggle availability:', e);
    }
  };

  const handleAddRecipeIngredient = (ingredientId: number) => {
    const ing = ingredients.find((i) => i.id === ingredientId);
    if (!ing) return;
    if (selectedRecipes.some((r) => r.ingredient_id === ingredientId)) return;

    setSelectedRecipes((prev) => [
      ...prev,
      { ingredient_id: ingredientId, quantity_required: 0.2, unit: ing.unit }
    ]);
  };

  const handleRemoveRecipe = (ingredientId: number) => {
    setSelectedRecipes((prev) => prev.filter((r) => r.ingredient_id !== ingredientId));
  };

  const handleCreateMenuItem = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await apiClient.post('/menu/items', {
        category_id: categoryId,
        name,
        description,
        price,
        cost_price: costPrice,
        preparation_time_minutes: prepTime,
        is_vegetarian: isVeg,
        recipes: selectedRecipes,
      });

      setIsModalOpen(false);
      setName('');
      setDescription('');
      setSelectedRecipes([]);
      fetchData();
    } catch (e: any) {
      alert(e.response?.data?.detail || 'Failed to create menu item');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredItems = menuItems.filter((item) => {
    if (selectedCategory !== 'ALL' && item.category_id !== selectedCategory) return false;
    if (vegOnly && !item.is_vegetarian) return false;
    if (search && !item.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Menu & Culinary Recipes</h1>
          <p className="text-sm text-slate-400 mt-1">Configure dishes, ingredient usage mapping, live floor availability, and prep standards.</p>
        </div>
        <Button
          variant="primary"
          leftIcon={<Plus size={16} />}
          onClick={() => setIsModalOpen(true)}
        >
          Add Menu Item
        </Button>
      </div>

      {/* Filter and Category Tabs */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-3">
          <button
            onClick={() => setSelectedCategory('ALL')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              selectedCategory === 'ALL'
                ? 'bg-brand-600 text-white shadow-sm shadow-brand-600/20'
                : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            All Items ({menuItems.length})
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                selectedCategory === cat.id
                  ? 'bg-brand-600 text-white shadow-sm shadow-brand-600/20'
                  : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative flex-1 w-full sm:max-w-md">
            <Search className="absolute left-3.5 top-3 text-slate-500" size={16} />
            <input
              type="text"
              placeholder="Search dishes by title..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl bg-slate-900 border border-slate-800 pl-10 pr-4 py-2 text-sm text-white placeholder-slate-500 focus:border-brand-500 focus:outline-none"
            />
          </div>

          <label className="flex items-center gap-2 text-xs font-semibold text-slate-300 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={vegOnly}
              onChange={(e) => setVegOnly(e.target.checked)}
              className="rounded bg-slate-800 border-slate-700 text-brand-500 focus:ring-0"
            />
            <Leaf size={14} className="text-emerald-400" />
            <span>Vegetarian Only</span>
          </label>
        </div>
      </div>

      {/* Grid of Dishes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((dish) => (
          <div
            key={dish.id}
            className={`rounded-2xl border p-5 flex flex-col justify-between transition-all ${
              dish.is_available
                ? 'bg-slate-900 border-slate-800 hover:border-slate-700/80 shadow-sm'
                : 'bg-slate-950/60 border-slate-900 opacity-60'
            }`}
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-white tracking-tight">{dish.name}</h3>
                  {dish.is_vegetarian && (
                    <span className="flex-shrink-0 flex h-4 w-4 items-center justify-center rounded border border-emerald-500/40 text-emerald-400 text-[10px]" title="Vegetarian">
                      &bull;
                    </span>
                  )}
                </div>
                <span className="text-base font-extrabold text-brand-400 font-mono">
                  ${dish.price.toFixed(2)}
                </span>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed line-clamp-2 mb-4">
                {dish.description}
              </p>

              {/* Recipe Ingredients Pill list */}
              {dish.recipes && dish.recipes.length > 0 && (
                <div className="mb-4 bg-slate-800/40 p-2.5 rounded-xl border border-slate-800/80">
                  <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block mb-1.5">
                    Recipe Breakdown:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {dish.recipes.map((r) => (
                      <span
                        key={r.id}
                        className="text-[11px] bg-slate-900 text-slate-300 px-2 py-0.5 rounded-md border border-slate-800"
                      >
                        {r.ingredient?.name || 'Ingredient'}: {r.quantity_required} {r.unit}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Meta & Availability Toggle */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-800/60 text-xs">
              <div className="flex items-center gap-3 text-slate-500">
                <span className="flex items-center gap-1">
                  <Clock size={13} />
                  {dish.preparation_time_minutes} min
                </span>
                <span>Margin: {Math.round(((dish.price - dish.cost_price) / dish.price) * 100)}%</span>
              </div>

              {/* Availability Toggle */}
              <button
                onClick={() => handleToggleAvailability(dish)}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold border transition-all ${
                  dish.is_available
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20'
                    : 'bg-rose-500/10 text-rose-400 border-rose-500/30 hover:bg-rose-500/20'
                }`}
              >
                {dish.is_available ? <Check size={12} /> : <X size={12} />}
                <span>{dish.is_available ? 'Available' : '86ed / Off'}</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* New Menu Item Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New Menu Item"
        subtitle="Specify pricing, preparation time, and link raw ingredients for automated inventory deduction"
        maxWidth="lg"
      >
        <form onSubmit={handleCreateMenuItem} className="space-y-4 text-xs">
          <div>
            <label className="text-slate-300 font-semibold mb-1 block">Dish Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Saffron Rogan Josh"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-slate-300 font-semibold mb-1 block">Category</label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(Number(e.target.value))}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-slate-300 font-semibold mb-1 block">Prep Time (Mins)</label>
              <input
                type="number"
                value={prepTime}
                onChange={(e) => setPrepTime(Number(e.target.value))}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-slate-300 font-semibold mb-1 block">Menu Price ($)</label>
              <input
                type="number"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
              />
            </div>
            <div>
              <label className="text-slate-300 font-semibold mb-1 block">Cost Price ($)</label>
              <input
                type="number"
                step="0.01"
                value={costPrice}
                onChange={(e) => setCostPrice(Number(e.target.value))}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
              />
            </div>
          </div>

          <div>
            <label className="text-slate-300 font-semibold mb-1 block">Description</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Sensory culinary description for guest menus..."
              className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
            />
          </div>

          {/* Recipe Ingredient Picker */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-slate-300 font-semibold">Recipe Ingredients (Auto-Deducted on Order)</label>
              <select
                onChange={(e) => {
                  if (e.target.value) handleAddRecipeIngredient(Number(e.target.value));
                  e.target.value = '';
                }}
                className="bg-slate-800 border border-slate-700 rounded-lg p-1 text-[11px] text-brand-400"
              >
                <option value="">+ Add Ingredient</option>
                {ingredients.map((ing) => (
                  <option key={ing.id} value={ing.id}>{ing.name} ({ing.unit})</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5 max-h-36 overflow-y-auto">
              {selectedRecipes.map((r) => {
                const ing = ingredients.find((i) => i.id === r.ingredient_id);
                return (
                  <div key={r.ingredient_id} className="flex items-center justify-between bg-slate-800/80 p-2 rounded-lg">
                    <span className="text-white font-medium">{ing?.name}</span>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        step="0.01"
                        value={r.quantity_required}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          setSelectedRecipes((prev) =>
                            prev.map((rec) => rec.ingredient_id === r.ingredient_id ? { ...rec, quantity_required: val } : rec)
                          );
                        }}
                        className="w-20 bg-slate-900 border border-slate-700 rounded p-1 text-white text-right"
                      />
                      <span className="text-slate-400">{r.unit}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveRecipe(r.ingredient_id)}
                        className="text-slate-400 hover:text-red-400 p-1"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="md"
            className="w-full mt-3"
            isLoading={isSubmitting}
          >
            Create Dish
          </Button>
        </form>
      </Modal>
    </div>
  );
};
