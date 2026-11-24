import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, ArrowLeft } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { CartItem } from '@/components/cart/CartItem';
import { CartSummary } from '@/components/cart/CartSummary';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';

const Cart: React.FC = () => {
  const { items, updateQuantity, removeFromCart, clearCart } = useCart();

  const isEmpty = items.length === 0;

  return (
    <Layout>
      <div className="container py-8 md:py-10" data-testid="cart-page">
        <div className="mb-8">
          <p className="font-mono text-xs uppercase tracking-wider text-accent font-semibold mb-1">
            Session Cart
          </p>
          <h1
            className="font-display text-3xl font-bold text-foreground"
            data-testid="cart-title"
          >
            Shopping Cart
          </h1>
        </div>

        {isEmpty ? (
          <div
            className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-card py-16 text-center"
            data-testid="empty-cart"
          >
            <div className="mb-5 rounded-full bg-secondary p-5">
              <ShoppingBag className="h-10 w-10 text-muted-foreground" aria-hidden="true" />
            </div>
            <h2 className="font-display text-xl font-semibold mb-2">
              Your cart is empty
            </h2>
            <p className="text-sm text-muted-foreground mb-6 max-w-md">
              Looks like you haven't added any hardware to your cart yet.
            </p>
            <Link to="/">
              <Button size="lg" data-testid="start-shopping-button">
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                Start Shopping
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              <div
                className="flex items-center justify-between pb-3 border-b border-border"
                data-testid="cart-header"
              >
                <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                  {items.length} {items.length === 1 ? 'line item' : 'line items'}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearCart}
                  className="text-xs text-muted-foreground hover:text-destructive"
                  data-testid="clear-cart-button"
                >
                  Clear Cart
                </Button>
              </div>

              <div className="space-y-3" data-testid="cart-items-list">
                {items.map((item) => (
                  <CartItem
                    key={item.product.id}
                    item={item}
                    onUpdateQuantity={updateQuantity}
                    onRemove={removeFromCart}
                  />
                ))}
              </div>

              <Link
                to="/"
                className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors pt-4"
                data-testid="continue-shopping-link"
              >
                <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
                Continue Shopping
              </Link>
            </div>

            <div className="lg:col-span-1">
              <CartSummary />
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Cart;
