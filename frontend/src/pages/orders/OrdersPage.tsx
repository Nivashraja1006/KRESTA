import React, { useState, useEffect } from 'react';
import {
  ShoppingBag,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Trash2,
  Receipt,
  CreditCard,
  User,
  Utensils
} from 'lucide-react';
import apiClient from '../../api/client';
import { useBranch } from '../../context/BranchContext';
import { Order, MenuItem, Customer, OrderStatus } from '../../types';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Modal } from '../../components/common/Modal';
import { Button } from '../../components/common/Button';

export const OrdersPage: React.FC = () => {
  const { selectedBranchId } = useBranch();

  const [orders, setOrders] = useState<Order[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // POS Order Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cart, setCart] = useState<{ menuItem: MenuItem; quantity: number; notes: string }[]>([]);
  const [selectedTable, setSelectedTable] = useState<number | undefined>(1);
  const [selectedCustomer, setSelectedCustomer] = useState<number | undefined>(undefined);
  const [orderType, setOrderType] = useState<'DINE_IN' | 'TAKEAWAY' | 'DELIVERY'>('DINE_IN');
  const [discount, setDiscount] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<string>('CARD');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      let url = `/orders/?branch_id=${selectedBranchId}&limit=50`;
      if (statusFilter) url += `&status=${statusFilter}`;
      if (searchQuery) url += `&search=${searchQuery}`;
      const resp = await apiClient.get<Order[]>(url);
      setOrders(resp.data);
    } catch (e) {
      console.error('Failed to fetch orders:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMenuAndCustomers = async () => {
    try {
      const [menuResp, custResp] = await Promise.all([
        apiClient.get<MenuItem[]>('/menu/items?available_only=true'),
        apiClient.get<Customer[]>('/customers/?limit=50')
      ]);
      setMenuItems(menuResp.data);
      setCustomers(custResp.data);
    } catch (e) {
      console.error('Failed to fetch catalog:', e);
    }
  };

  useEffect(() => {
    fetchOrders();
    fetchMenuAndCustomers();
  }, [selectedBranchId, statusFilter]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchOrders();
  };

  const addToCart = (item: MenuItem) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.menuItem.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.menuItem.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { menuItem: item, quantity: 1, notes: '' }];
    });
  };

  const removeFromCart = (itemId: number) => {
    setCart((prev) => prev.filter((i) => i.menuItem.id !== itemId));
  };

  const updateQuantity = (itemId: number, delta: number) => {
    setCart((prev) =>
      prev
        .map((i) => {
          if (i.menuItem.id === itemId) {
            const newQty = i.quantity + delta;
            return newQty > 0 ? { ...i, quantity: newQty } : null;
          }
          return i;
        })
        .filter(Boolean) as { menuItem: MenuItem; quantity: number; notes: string }[]
    );
  };

  const subtotal = cart.reduce((sum, i) => sum + i.menuItem.price * i.quantity, 0);
  const tax = subtotal * 0.085;
  const total = Math.max(0, subtotal + tax - discount);

  const handleCreateOrder = async () => {
    if (cart.length === 0) return;
    setIsSubmitting(true);
    try {
      await apiClient.post('/orders/', {
        branch_id: selectedBranchId,
        customer_id: selectedCustomer,
        table_id: orderType === 'DINE_IN' ? selectedTable : null,
        order_type: orderType,
        items: cart.map((i) => ({
          menu_item_id: i.menuItem.id,
          quantity: i.quantity,
          special_instructions: i.notes || null,
        })),
        discount,
        payment_method: paymentMethod,
      });

      setIsModalOpen(false);
      setCart([]);
      fetchOrders();
    } catch (e: any) {
      alert(e.response?.data?.detail || 'Failed to place order.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateStatus = async (orderId: number, nextStatus: OrderStatus) => {
    try {
      await apiClient.patch(`/orders/${orderId}/status`, { status: nextStatus });
      fetchOrders();
    } catch (e) {
      console.error('Failed to update status:', e);
    }
  };

  return (
    <div className="space-y-6">
      {/* Title & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Point of Sale & Orders</h1>
          <p className="text-sm text-slate-400 mt-1">Manage dining tickets, order status progression, and automated inventory sync.</p>
        </div>
        <Button
          variant="primary"
          leftIcon={<Plus size={16} />}
          onClick={() => setIsModalOpen(true)}
        >
          New Ticket (POS)
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <form onSubmit={handleSearch} className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-3 text-slate-500" size={16} />
          <input
            type="text"
            placeholder="Search by order number (e.g. ORD-0922-1002)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl bg-slate-900 border border-slate-800 pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-brand-500 focus:outline-none"
          />
        </form>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full sm:w-auto rounded-xl bg-slate-900 border border-slate-800 px-3 py-2.5 text-sm text-slate-200 outline-none"
          >
            <option value="">All Statuses</option>
            <option value="NEW">New</option>
            <option value="PREPARING">Preparing</option>
            <option value="READY">Ready</option>
            <option value="SERVED">Served</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-800/60 text-xs uppercase text-slate-400 font-semibold border-b border-slate-800">
              <tr>
                <th className="px-5 py-3.5">Order #</th>
                <th className="px-5 py-3.5">Type & Table</th>
                <th className="px-5 py-3.5">Items</th>
                <th className="px-5 py-3.5">Total</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5">Timestamp</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-slate-500">
                    Loading orders...
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-slate-500">
                    No matching orders found.
                  </td>
                </tr>
              ) : (
                orders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-5 py-4 font-mono font-bold text-white text-xs">
                      {ord.order_number}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-semibold text-slate-200">
                          {ord.table_id ? `Table #${ord.table_id}` : ord.order_type}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-500">{ord.order_type}</span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="text-xs font-medium text-slate-300">
                        {ord.items.map((i) => `${i.quantity}x ${i.menu_item?.name || 'Dish'}`).join(', ')}
                      </div>
                    </td>
                    <td className="px-5 py-4 font-bold text-white">
                      ${ord.total_amount.toFixed(2)}
                    </td>
                    <td className="px-5 py-4">
                      <StatusBadge status={ord.status} size="sm" />
                    </td>
                    <td className="px-5 py-4 text-xs text-slate-400">
                      {new Date(ord.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="px-5 py-4 text-right">
                      {ord.status === 'NEW' && (
                        <button
                          onClick={() => handleUpdateStatus(ord.id, 'PREPARING')}
                          className="text-xs font-semibold text-amber-400 hover:text-amber-300 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20"
                        >
                          Send to Kitchen
                        </button>
                      )}
                      {ord.status === 'READY' && (
                        <button
                          onClick={() => handleUpdateStatus(ord.id, 'SERVED')}
                          className="text-xs font-semibold text-teal-400 hover:text-teal-300 bg-teal-500/10 px-2.5 py-1 rounded-lg border border-teal-500/20"
                        >
                          Mark Served
                        </button>
                      )}
                      {ord.status === 'SERVED' && (
                        <button
                          onClick={() => handleUpdateStatus(ord.id, 'COMPLETED')}
                          className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20"
                        >
                          Complete
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* POS New Order Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Point of Sale & Ticket Dispatch"
        subtitle="Select dishes, specify table, calculate payment, and dispatch directly to Kitchen Display System"
        maxWidth="2xl"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Menu Catalog Picker */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Select Menu Items</h4>
            <div className="max-h-72 overflow-y-auto space-y-2 pr-1">
              {menuItems.map((item) => (
                <div
                  key={item.id}
                  onClick={() => addToCart(item)}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-800/50 hover:bg-slate-800 border border-slate-700/60 cursor-pointer transition-all"
                >
                  <div>
                    <p className="text-sm font-semibold text-white">{item.name}</p>
                    <p className="text-xs text-brand-400 font-bold">${item.price.toFixed(2)}</p>
                  </div>
                  <Plus size={16} className="text-slate-400" />
                </div>
              ))}
            </div>
          </div>

          {/* Cart & Billing Checkout */}
          <div className="space-y-4 bg-slate-800/30 p-4 rounded-xl border border-slate-800 flex flex-col">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Order Summary</h4>

            {/* Cart Items */}
            <div className="flex-1 max-h-44 overflow-y-auto space-y-2 pr-1">
              {cart.length === 0 ? (
                <p className="text-xs text-slate-500 text-center py-6">No items in cart</p>
              ) : (
                cart.map((i) => (
                  <div key={i.menuItem.id} className="flex items-center justify-between text-xs bg-slate-900/60 p-2 rounded-lg">
                    <span className="font-semibold text-white truncate max-w-[120px]">{i.menuItem.name}</span>
                    <div className="flex items-center gap-2">
                      <button onClick={() => updateQuantity(i.menuItem.id, -1)} className="px-1.5 bg-slate-800 rounded text-slate-300">-</button>
                      <span className="font-bold text-white">{i.quantity}</span>
                      <button onClick={() => updateQuantity(i.menuItem.id, 1)} className="px-1.5 bg-slate-800 rounded text-slate-300">+</button>
                      <span className="font-mono text-emerald-400 font-bold ml-1">${(i.menuItem.price * i.quantity).toFixed(2)}</span>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Settings */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <label className="text-slate-400 font-semibold mb-1 block">Order Type</label>
                <select
                  value={orderType}
                  onChange={(e: any) => setOrderType(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-1.5 text-white"
                >
                  <option value="DINE_IN">Dine In</option>
                  <option value="TAKEAWAY">Takeaway</option>
                  <option value="DELIVERY">Delivery</option>
                </select>
              </div>
              {orderType === 'DINE_IN' && (
                <div>
                  <label className="text-slate-400 font-semibold mb-1 block">Table</label>
                  <select
                    value={selectedTable}
                    onChange={(e) => setSelectedTable(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-1.5 text-white"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((t) => (
                      <option key={t} value={t}>Table #{t}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* Price breakdown */}
            <div className="border-t border-slate-800 pt-2 space-y-1 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Tax (8.5%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-white text-sm pt-1 border-t border-slate-800">
                <span>Total Amount</span>
                <span className="text-emerald-400">${total.toFixed(2)}</span>
              </div>
            </div>

            <Button
              variant="primary"
              size="md"
              className="w-full mt-2"
              disabled={cart.length === 0}
              isLoading={isSubmitting}
              onClick={handleCreateOrder}
            >
              Dispatch Ticket (${total.toFixed(2)})
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
