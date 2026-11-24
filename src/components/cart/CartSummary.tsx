import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';

const SHIPPING_THRESHOLD = 100;
const SHIPPING_COST = 9.99;
const TAX_RATE = 0.08;

export const CartSummary: React.FC = () => {
  const { subtotal, itemCount } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const shipping = subtotal >= SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const tax = subtotal * TAX_RATE;
  const total = subtotal + shipping + tax;
  const amountToFreeShipping = SHIPPING_THRESHOLD - subtotal;

  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate('/auth?mode=login&redirect=/checkout');
    } else {
      navigate('/checkout');
    }
  };

  return (
    <div
      className="rounded-lg border border-border bg-card p-6 shadow-sm sticky top-24"
      data-testid="cart-summary"
    >
      <h2 className="font-display text-lg font-bold mb-4">Order Summary</h2>

      {subtotal < SHIPPING_THRESHOLD && subtotal > 0 && (
        <div
          className="mb-4 rounded-md border border-border bg-secondary/60 p-3"
          data-testid="free-shipping-message"
        >
          <div className="flex items-center gap-2 text-xs text-foreground">
            <Truck className="h-4 w-4 text-accent shrink-0" aria-hidden="true" />
            <span>
              Add <strong className="font-mono">${amountToFreeShipping.toFixed(2)}</strong> more for free shipping
            </span>
          </div>
          <div className="mt-2 h-1.5 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full bg-foreground rounded-full transition-all duration-500"
              style={{ width: `${(subtotal / SHIPPING_THRESHOLD) * 100}%` }}
              data-testid="shipping-progress-bar"
            />
          </div>
        </div>
      )}

      {subtotal >= SHIPPING_THRESHOLD && (
        <div
          className="mb-4 rounded-md border border-success/30 bg-success/10 p-3 flex items-center gap-2 text-xs font-medium text-success"
          data-testid="free-shipping-eligible"
        >
          <Truck className="h-4 w-4 shrink-0" aria-hidden="true" />
          <span>Qualified for complimentary shipping</span>
        </div>
      )}

      <div className="space-y-3 text-sm">
        <div className="flex justify-between" data-testid="cart-subtotal">
          <span className="text-muted-foreground">Subtotal ({itemCount} items)</span>
          <span className="font-mono tabular-nums">${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between" data-testid="cart-shipping">
          <span className="text-muted-foreground">Shipping</span>
          <span className="font-mono tabular-nums">
            {shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}
          </span>
        </div>
        <div className="flex justify-between" data-testid="cart-tax">
          <span className="text-muted-foreground">Estimated Tax (8%)</span>
          <span className="font-mono tabular-nums">${tax.toFixed(2)}</span>
        </div>
        <div className="border-t border-border pt-3">
          <div
            className="flex justify-between font-display font-bold text-lg"
            data-testid="cart-total"
          >
            <span>Total</span>
            <span className="font-mono tabular-nums">${total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <Button
        variant="default"
        size="lg"
        className="w-full mt-6"
        onClick={handleCheckout}
        disabled={itemCount === 0}
        data-testid="checkout-button"
      >
        <ShoppingBag className="h-4 w-4" aria-hidden="true" />
        {isAuthenticated ? 'Proceed to Checkout' : 'Login to Checkout'}
      </Button>

      {!isAuthenticated && itemCount > 0 && (
        <p className="mt-3 text-center text-xs text-muted-foreground" data-testid="login-prompt">
          Sign in required before checkout
        </p>
      )}
    </div>
  );
};
