import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import { Product } from '@/data/products';
import { useQALab } from '@/contexts/QALabContext';

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  total: number;
  isLoading: boolean;
  addToCart: (product: Product, quantity?: number) => Promise<{ success: boolean; error?: string }>;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
  children: ReactNode;
}

const SHIPPING_THRESHOLD = 100;
const SHIPPING_COST = 9.99;
const TAX_RATE = 0.08;

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    const savedCart = sessionStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });
  const [isLoading, setIsLoading] = useState(false);
  const { config, consumeForcedFailure, logEvent } = useQALab();

  // Persist cart to session storage
  useEffect(() => {
    sessionStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  const itemCount = items.reduce((count, item) => count + item.quantity, 0);

  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const shipping = subtotal >= SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const tax = subtotal * TAX_RATE;
  const total = subtotal + shipping + tax;

  const addToCart = useCallback(
    async (product: Product, quantity = 1): Promise<{ success: boolean; error?: string }> => {
      setIsLoading(true);

      if (config.latencyMs > 0 || config.cartChaos) {
        const delay = config.latencyMs > 0 ? config.latencyMs : 350 + Math.random() * 250;
        await new Promise((resolve) => setTimeout(resolve, delay));
      }

      if (consumeForcedFailure('Cart.addToCart') || (config.cartChaos && Math.random() < 0.05)) {
        setIsLoading(false);
        logEvent('CHAOS', 'CART_ADD_FAILED', `Injected failure adding ${product.id}`);
        return { success: false, error: 'Failed to add item to cart. Please try again.' };
      }

      if (product.stock === 0) {
        setIsLoading(false);
        return { success: false, error: 'This item is out of stock.' };
      }

      let stockExceeded = false;
      setItems((currentItems) => {
        const existingItem = currentItems.find((item) => item.product.id === product.id);

        if (existingItem) {
          const newQuantity = existingItem.quantity + quantity;
          if (newQuantity > product.stock) {
            stockExceeded = true;
            return currentItems;
          }
          return currentItems.map((item) =>
            item.product.id === product.id ? { ...item, quantity: newQuantity } : item
          );
        }

        const clampedQty = Math.min(quantity, product.stock);
        return [...currentItems, { product, quantity: clampedQty }];
      });

      setIsLoading(false);
      if (stockExceeded) {
        return { success: false, error: `Cannot exceed available stock (${product.stock}).` };
      }

      logEvent('CART', 'CART_ADD', `Added ${quantity}x ${product.name}`);
      return { success: true };
    },
    [config.cartChaos, config.latencyMs, consumeForcedFailure, logEvent]
  );

  const removeFromCart = useCallback(
    (productId: string) => {
      setItems((currentItems) => currentItems.filter((item) => item.product.id !== productId));
      logEvent('CART', 'CART_REMOVE', `Removed ${productId} from cart`);
    },
    [logEvent]
  );

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity < 1) return;

    setItems((currentItems) =>
      currentItems.map((item) => {
        if (item.product.id === productId) {
          const newQuantity = Math.min(quantity, item.product.stock);
          return { ...item, quantity: newQuantity };
        }
        return item;
      })
    );
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
    logEvent('CART', 'CART_CLEARED', 'Cart items cleared');
  }, [logEvent]);

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        subtotal,
        total,
        isLoading,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
