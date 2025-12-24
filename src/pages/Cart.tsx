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
      <div className="container py-8" data-testid="cart-page">
        <h1 
          className="font-display text-3xl font-bold text-foreground mb-8"
          data-testid="cart-title"
        >
          Shopping Cart
        </h1>

        {isEmpty ? (
          <div 
            className="flex flex-col items-center justify-center py-16 text-center"
            data-testid="empty-cart"
          >
            <div className="mb-6 rounded-full bg-muted p-8">
              <ShoppingBag className="h-16 w-16 text-muted-foreground" />
            </div>
            <h2 className="font-display text-2xl font-semibold mb-2">
              Your cart is empty
            </h2>
            <p className="text-muted-foreground mb-8 max-w-md">
              Looks like you haven't added any products to your cart yet. 
              Start shopping to fill it up!
            </p>
            <Link to="/">
              <Button size="lg" data-testid="start-shopping-button">
                <ArrowLeft className="h-5 w-5 mr-2" />
                Start Shopping
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              <div 
                className="flex items-center justify-between mb-4"
                data-testid="cart-header"
              >
                <span className="text-sm text-muted-foreground">
                  {items.length} {items.length === 1 ? 'item' : 'items'}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearCart}
                  className="text-muted-foreground hover:text-destructive"
                  data-testid="clear-cart-button"
                >
                  Clear Cart
                </Button>
              </div>

              <div 
                className="space-y-4"
                data-testid="cart-items-list"
              >
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
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mt-6"
                data-testid="continue-shopping-link"
              >
                <ArrowLeft className="h-4 w-4" />
                Continue Shopping
              </Link>
            </div>

            {/* Cart Summary */}
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
