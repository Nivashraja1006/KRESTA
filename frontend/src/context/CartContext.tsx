import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import apiClient from '../api/client';
import { MenuItem, CartItem, CartValidation } from '../types';

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: MenuItem, quantity?: number, spiceLevel?: string, specialInstructions?: string) => void;
  updateQuantity: (menuItemId: number, delta: number, spiceLevel?: string) => void;
  removeFromCart: (menuItemId: number, spiceLevel?: string) => void;
  clearCart: () => void;
  totalCartCount: number;
  subtotal: number;
  tax: number;
  deliveryFee: number;
  discount: number;
  total: number;
  couponCode: string;
  appliedCouponMessage: string | null;
  applyCoupon: (code: string) => Promise<{ success: boolean; message: string }>;
  removeCoupon: () => void;
  orderType: 'DELIVERY' | 'TAKEAWAY' | 'DINE_IN';
  setOrderType: (type: 'DELIVERY' | 'TAKEAWAY' | 'DINE_IN') => void;
  deliveryAddress: string;
  setDeliveryAddress: (address: string) => void;
  tableNumber: string;
  setTableNumber: (table: string) => void;
  orderNotes: string;
  setOrderNotes: (notes: string) => void;
  isValidating: boolean;
  validationErrors: string[];
  isCartDrawerOpen: boolean;
  setIsCartDrawerOpen: (open: boolean) => void;
  refreshValidation: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('kresta_cart');
      if (!saved) return [];
      const parsed = JSON.parse(saved);
      if (!Array.isArray(parsed)) return [];
      return parsed.filter(
        (item: any) =>
          item &&
          item.menuItem &&
          typeof item.menuItem.id === 'number' &&
          typeof item.quantity === 'number' &&
          item.quantity > 0
      );
    } catch {
      return [];
    }
  });

  const [orderType, setOrderType] = useState<'DELIVERY' | 'TAKEAWAY' | 'DINE_IN'>('DELIVERY');
  const [deliveryAddress, setDeliveryAddress] = useState<string>('');
  const [tableNumber, setTableNumber] = useState<string>('Table 4');
  const [orderNotes, setOrderNotes] = useState<string>('');
  const [couponCode, setCouponCode] = useState<string>('');
  const [appliedCouponMessage, setAppliedCouponMessage] = useState<string | null>(null);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState<boolean>(false);

  // Cross-tab synchronization
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'kresta_cart') {
        try {
          const updated = e.newValue ? JSON.parse(e.newValue) : [];
          if (Array.isArray(updated)) {
            setCartItems(
              updated.filter(
                (item: any) =>
                  item &&
                  item.menuItem &&
                  typeof item.menuItem.id === 'number' &&
                  typeof item.quantity === 'number' &&
                  item.quantity > 0
              )
            );
          } else {
            setCartItems([]);
          }
        } catch {
          setCartItems([]);
        }
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Server-side calculation state
  const [subtotal, setSubtotal] = useState<number>(0);
  const [tax, setTax] = useState<number>(0);
  const [deliveryFee, setDeliveryFee] = useState<number>(0);
  const [discount, setDiscount] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);
  const [isValidating, setIsValidating] = useState<boolean>(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  // Persist cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('kresta_cart', JSON.stringify(cartItems));
    } catch (e) {
      console.error('Failed to persist cart:', e);
    }
  }, [cartItems]);

  // Synchronize cart with backend validation
  const validateCartWithBackend = async () => {
    if (cartItems.length === 0) {
      setSubtotal(0);
      setTax(0);
      setDeliveryFee(0);
      setDiscount(0);
      setTotal(0);
      setValidationErrors([]);
      return;
    }

    setIsValidating(true);
    try {
      const payload = {
        branch_id: 1,
        order_type: orderType,
        items: cartItems.map((c) => ({
          menu_item_id: c.menuItem.id,
          quantity: c.quantity,
          spice_level: c.spiceLevel,
          special_instructions: c.specialInstructions,
        })),
        coupon_code: couponCode.trim() || undefined,
      };

      const resp = await apiClient.post<CartValidation>('/orders/customer/validate-cart', payload);
      const data = resp.data;

      setSubtotal(data.subtotal);
      setTax(data.tax);
      setDeliveryFee(data.delivery_fee);
      setDiscount(data.discount);
      setTotal(data.total);
      setAppliedCouponMessage(data.coupon_message || (data.coupon_applied ? `Coupon ${data.coupon_applied} applied` : null));
      setValidationErrors(data.errors || []);
    } catch (e: any) {
      console.warn('Backend cart validation fallback to client computation:', e);
      // Client fallback computation
      const rawSub = cartItems.reduce((acc, i) => acc + i.menuItem.price * i.quantity, 0);
      const sub = Math.round(rawSub * 100) / 100;
      const t = Math.round(sub * 0.05 * 100) / 100;
      const dFee = orderType === 'DELIVERY' ? (sub >= 50.0 ? 0.0 : 3.99) : 0.0;
      setSubtotal(sub);
      setTax(t);
      setDeliveryFee(dFee);
      setTotal(Math.max(0, Math.round((sub + t + dFee - discount) * 100) / 100));
    } finally {
      setIsValidating(false);
    }
  };

  useEffect(() => {
    validateCartWithBackend();
  }, [cartItems, orderType, couponCode]);

  const addToCart = (
    item: MenuItem,
    quantity: number = 1,
    spiceLevel?: string,
    specialInstructions?: string
  ) => {
    setCartItems((prev) => {
      const existingIdx = prev.findIndex(
        (i) => i.menuItem.id === item.id && (i.spiceLevel || '') === (spiceLevel || '')
      );

      if (existingIdx >= 0) {
        const updated = [...prev];
        updated[existingIdx].quantity += quantity;
        if (specialInstructions) {
          updated[existingIdx].specialInstructions = specialInstructions;
        }
        return updated;
      }

      return [
        ...prev,
        {
          menuItem: item,
          quantity: Math.max(1, quantity),
          spiceLevel: spiceLevel || 'Medium',
          specialInstructions: specialInstructions || '',
        },
      ];
    });
  };

  const updateQuantity = (menuItemId: number, delta: number, spiceLevel?: string) => {
    setCartItems((prev) =>
      prev
        .map((i) => {
          if (i.menuItem.id === menuItemId && (i.spiceLevel || '') === (spiceLevel || '')) {
            const newQty = i.quantity + delta;
            return newQty > 0 ? { ...i, quantity: newQty } : null;
          }
          return i;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const removeFromCart = (menuItemId: number, spiceLevel?: string) => {
    setCartItems((prev) =>
      prev.filter(
        (i) => !(i.menuItem.id === menuItemId && (i.spiceLevel || '') === (spiceLevel || ''))
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
    setCouponCode('');
    setAppliedCouponMessage(null);
    setValidationErrors([]);
  };

  const applyCoupon = async (code: string): Promise<{ success: boolean; message: string }> => {
    const cleanCode = code.trim().toUpperCase();
    if (!cleanCode) {
      return { success: false, message: 'Please enter a coupon code.' };
    }

    try {
      const payload = {
        branch_id: 1,
        order_type: orderType,
        items: cartItems.map((c) => ({
          menu_item_id: c.menuItem.id,
          quantity: c.quantity,
          spice_level: c.spiceLevel,
        })),
        coupon_code: cleanCode,
      };

      const resp = await apiClient.post<CartValidation>('/orders/customer/validate-cart', payload);
      const data = resp.data;

      if (data.discount > 0) {
        setCouponCode(cleanCode);
        setAppliedCouponMessage(data.coupon_message || `Promo code ${cleanCode} applied!`);
        setDiscount(data.discount);
        setTotal(data.total);
        return { success: true, message: `Promo code ${cleanCode} applied!` };
      } else {
        const errorMsg = data.errors?.[0] || `Coupon '${cleanCode}' could not be applied.`;
        return { success: false, message: errorMsg };
      }
    } catch (e: any) {
      return { success: false, message: e.response?.data?.detail || 'Invalid or expired coupon code.' };
    }
  };

  const removeCoupon = () => {
    setCouponCode('');
    setAppliedCouponMessage(null);
    setDiscount(0);
  };

  const totalCartCount = useMemo(() => {
    return cartItems.reduce(
      (acc, item) => acc + (typeof item.quantity === 'number' && item.quantity > 0 ? item.quantity : 0),
      0
    );
  }, [cartItems]);

  return (
    <CartContext.Provider
      value={{
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
        couponCode,
        appliedCouponMessage,
        applyCoupon,
        removeCoupon,
        orderType,
        setOrderType,
        deliveryAddress,
        setDeliveryAddress,
        tableNumber,
        setTableNumber,
        orderNotes,
        setOrderNotes,
        isValidating,
        validationErrors,
        isCartDrawerOpen,
        setIsCartDrawerOpen,
        refreshValidation: validateCartWithBackend,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

