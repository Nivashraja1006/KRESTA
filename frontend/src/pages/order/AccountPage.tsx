import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  User,
  ShoppingBag,
  MapPin,
  Heart,
  Clock,
  Sparkles,
  LogOut,
  RefreshCw,
  ArrowRight,
  ShieldCheck,
  Phone,
  Mail,
  ChevronRight,
  Plus,
  Trash2
} from 'lucide-react';
import apiClient from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { Order, MenuItem } from '../../types';
import { CustomerNavbar } from '../../components/customer/CustomerNavbar';
import { getMenuImageUrl, handleMenuImageError } from './menuImages';
import { CustomerFooter } from '../../components/customer/CustomerFooter';

export const AccountPage: React.FC = () => {
  const { user, logout } = useAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'ORDERS' | 'ADDRESSES' | 'FAVORITES' | 'SETTINGS'>('ORDERS');
  const [orders, setOrders] = useState<Order[]>([]);
  const [favoriteItems, setFavoriteItems] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Saved addresses state (persisted in localStorage)
  const [addresses, setAddresses] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('kresta_saved_addresses');
      return saved ? JSON.parse(saved) : ['742 Evergreen Terrace, Sector 4, Financial District, SF'];
    } catch {
      return ['742 Evergreen Terrace, Sector 4, Financial District, SF'];
    }
  });
  const [newAddress, setNewAddress] = useState('');
  const [isAddingAddress, setIsAddingAddress] = useState(false);

  // Fetch customer orders
  const fetchMyOrders = async () => {
    setIsLoading(true);
    try {
      const email = user?.email || 'elena@restaurantiq.com';
      const resp = await apiClient.get<Order[]>(`/orders/customer/my-orders?email=${encodeURIComponent(email)}`);
      setOrders(resp.data);
    } catch (e) {
      console.error('Failed to load my orders:', e);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch favorite menu items
  const fetchFavorites = async () => {
    try {
      const savedFavIds: number[] = JSON.parse(localStorage.getItem('kresta_favorites') || '[]');
      if (savedFavIds.length > 0) {
        const resp = await apiClient.get<MenuItem[]>('/menu/items');
        setFavoriteItems(resp.data.filter((i) => savedFavIds.includes(i.id)));
      }
    } catch (e) {
      console.error('Failed to load favorites:', e);
    }
  };

  useEffect(() => {
    fetchMyOrders();
    fetchFavorites();
  }, [user]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleReorder = (order: Order) => {
    if (!order.items || order.items.length === 0) return;
    order.items.forEach((it) => {
      if (it.menu_item) {
        addToCart(it.menu_item, it.quantity, 'Medium', it.special_instructions || undefined);
      }
    });
    showToast(`Reordered ${order.items.length} items to your cart!`);
    navigate('/order/cart');
  };

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddress.trim()) return;
    const updated = [...addresses, newAddress.trim()];
    setAddresses(updated);
    localStorage.setItem('kresta_saved_addresses', JSON.stringify(updated));
    setNewAddress('');
    setIsAddingAddress(false);
    showToast('Delivery address saved successfully!');
  };

  const handleRemoveAddress = (idx: number) => {
    const updated = addresses.filter((_, i) => i !== idx);
    setAddresses(updated);
    localStorage.setItem('kresta_saved_addresses', JSON.stringify(updated));
    showToast('Address removed.');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      <CustomerNavbar />

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-2xl bg-slate-900 text-white px-4 py-3 text-xs font-bold shadow-2xl border border-slate-700 animate-in slide-in-from-bottom-5">
          <Sparkles size={16} className="text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Banner */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold text-2xl font-serif shadow-md">
              {user?.full_name?.charAt(0) || 'E'}
            </div>
            <div>
              <h1 className="font-serif font-black text-2xl text-slate-950">
                {user?.full_name || 'Elena Rostova'}
              </h1>
              <div className="flex items-center gap-3 text-xs text-slate-500 mt-1 flex-wrap">
                <span className="flex items-center gap-1">
                  <Mail size={12} /> {user?.email || 'elena@restaurantiq.com'}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Phone size={12} /> +1 (555) 019-2831
                </span>
              </div>
            </div>
          </div>

          {/* Loyalty Points Pill */}
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-right sm:text-right">
            <p className="text-[11px] font-bold uppercase tracking-wider text-amber-800">
              KRESTA Loyalty Balance
            </p>
            <p className="text-2xl font-black text-amber-950 font-serif mt-0.5">
              150 Points
            </p>
            <p className="text-[10px] text-amber-700 font-semibold mt-0.5">
              Redeemable for $15.00 off next dine-in or delivery
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-4 mb-6 overflow-x-auto">
          {[
            { id: 'ORDERS', label: 'My Orders & History', icon: ShoppingBag },
            { id: 'ADDRESSES', label: 'Saved Addresses', icon: MapPin },
            { id: 'FAVORITES', label: 'Favorite Dishes', icon: Heart },
            { id: 'SETTINGS', label: 'Account Settings', icon: User }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <tab.icon size={15} />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* TAB 1: MY ORDERS */}
        {activeTab === 'ORDERS' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-serif font-black text-lg text-slate-900">
                Past Culinary Orders ({orders.length})
              </h2>
              <button
                onClick={fetchMyOrders}
                className="text-xs font-semibold text-slate-600 hover:text-emerald-700 flex items-center gap-1"
              >
                <RefreshCw size={12} className={isLoading ? 'animate-spin' : ''} /> Refresh History
              </button>
            </div>

            {orders.length === 0 ? (
              <div className="bg-white rounded-3xl border border-slate-200 p-8 text-center text-slate-500">
                <ShoppingBag size={32} className="mx-auto text-slate-300 mb-2" />
                <p className="text-sm font-semibold">No order history found for this account.</p>
                <Link
                  to="/order"
                  className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs"
                >
                  Order Food Now
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((ord) => (
                  <div
                    key={ord.id}
                    className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-sm text-slate-900">
                            {ord.order_number}
                          </span>
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                              ord.status === 'COMPLETED'
                                ? 'bg-emerald-100 text-emerald-800'
                                : ord.status === 'PREPARING'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-blue-100 text-blue-800'
                            }`}
                          >
                            {ord.status}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">
                          Placed on {new Date(ord.created_at).toLocaleDateString()} at{' '}
                          {new Date(ord.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {ord.order_type}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <Link
                          to={`/order/track/${ord.order_number}`}
                          className="px-3 py-1.5 rounded-xl border border-slate-200 hover:border-slate-300 text-xs font-bold text-slate-800 transition-colors"
                        >
                          Track Live
                        </Link>
                        <button
                          onClick={() => handleReorder(ord)}
                          className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors shadow-xs"
                        >
                          Reorder
                        </button>
                      </div>
                    </div>

                    {/* Ordered items preview */}
                    <div className="py-3 divide-y divide-slate-50 text-xs text-slate-700">
                      {ord.items?.map((it) => (
                        <div key={it.id} className="py-1.5 flex justify-between items-center">
                          <span>
                            <strong>{it.quantity}x</strong> {it.menu_item?.name || 'Dish'}
                          </span>
                          <span className="font-bold text-slate-900">${it.subtotal.toFixed(2)}</span>
                        </div>
                      ))}
                    </div>

                    {/* Order total */}
                    <div className="pt-3 border-t border-slate-100 flex justify-between items-center text-xs">
                      <span className="text-slate-500 font-medium">Grand Total</span>
                      <span className="font-serif font-black text-sm text-slate-950">
                        ${ord.total_amount.toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: SAVED ADDRESSES */}
        {activeTab === 'ADDRESSES' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-serif font-black text-lg text-slate-900">
                Delivery Addresses
              </h2>
              <button
                onClick={() => setIsAddingAddress(!isAddingAddress)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors"
              >
                <Plus size={14} /> Add New Address
              </button>
            </div>

            {isAddingAddress && (
              <form onSubmit={handleAddAddress} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                <label className="text-xs font-bold text-slate-700">New Delivery Address</label>
                <input
                  type="text"
                  placeholder="Street, Apt, City, Postal Code"
                  value={newAddress}
                  onChange={(e) => setNewAddress(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-emerald-500"
                />
                <div className="flex gap-2 justify-end">
                  <button
                    type="button"
                    onClick={() => setIsAddingAddress(false)}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-600"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-lg bg-emerald-600 text-white font-bold text-xs"
                  >
                    Save Address
                  </button>
                </div>
              </form>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {addresses.map((addr, idx) => (
                <div key={idx} className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-sm flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex-shrink-0">
                      <MapPin size={18} />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        {idx === 0 ? 'Default Primary' : `Address #${idx + 1}`}
                      </span>
                      <p className="text-xs font-semibold text-slate-800 mt-2 leading-relaxed">
                        {addr}
                      </p>
                    </div>
                  </div>
                  {addresses.length > 1 && (
                    <button
                      onClick={() => handleRemoveAddress(idx)}
                      className="text-slate-400 hover:text-rose-600 p-1"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: FAVORITE DISHES */}
        {activeTab === 'FAVORITES' && (
          <div className="space-y-4">
            <h2 className="font-serif font-black text-lg text-slate-900">
              Your Bookmarked Specialties
            </h2>

            {favoriteItems.length === 0 ? (
              <div className="bg-white rounded-3xl border border-slate-200 p-8 text-center text-slate-500">
                <Heart size={32} className="mx-auto text-slate-300 mb-2" />
                <p className="text-sm font-semibold">You have not bookmarked any dishes yet.</p>
                <Link
                  to="/order"
                  className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs"
                >
                  Browse Menu & Favorite Dishes
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {favoriteItems.map((item) => (
                  <div key={item.id} className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm flex flex-col justify-between">
                    <img
                      src={getMenuImageUrl(item)}
                      alt={item.name}
                      onError={(event) => handleMenuImageError(event, item)}
                      className="h-44 w-full object-cover"
                    />
                    <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className="font-serif font-black text-base text-slate-900">{item.name}</h4>
                        <p className="text-xs text-slate-500 line-clamp-2 mt-1">{item.description}</p>
                      </div>
                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                        <span className="font-serif font-black text-emerald-700 text-base">
                          ${item.price.toFixed(2)}
                        </span>
                        <button
                          onClick={() => {
                            addToCart(item);
                            showToast(`Added ${item.name} to cart!`);
                          }}
                          className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-xs"
                        >
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: SETTINGS */}
        {activeTab === 'SETTINGS' && (
          <div className="max-w-xl bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm space-y-6">
            <h2 className="font-serif font-black text-xl text-slate-900">
              Account Preferences
            </h2>

            <div className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Display Name</label>
                <input
                  type="text"
                  defaultValue={user?.full_name || 'Elena Rostova'}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-slate-900"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Registered Email</label>
                <input
                  type="email"
                  defaultValue={user?.email || 'elena@restaurantiq.com'}
                  disabled
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-100 text-slate-500 cursor-not-allowed"
                />
              </div>

              <div className="pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    logout();
                    navigate('/login');
                  }}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100 font-bold text-xs transition-colors"
                >
                  <LogOut size={14} /> Sign Out of KRESTA Account
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      <CustomerFooter />
    </div>
  );
};
