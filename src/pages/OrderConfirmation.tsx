import React from 'react';
import { useLocation, useParams, Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { CheckCircle, Package, Truck, Mail, ArrowRight } from 'lucide-react';
import { CartItem } from '@/contexts/CartContext';
import { ShippingAddressData } from '@/utils/validation';

interface OrderState {
  orderId: string;
  items: CartItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  shippingAddress: ShippingAddressData;
}

const OrderConfirmation: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const location = useLocation();
  const state = location.state as OrderState | null;

  // If no state (direct access), show minimal confirmation
  if (!state) {
    return (
      <Layout>
        <div 
          className="container py-16 text-center"
          data-testid="order-confirmation-minimal"
        >
          <div className="max-w-md mx-auto">
            <div className="mb-6 inline-flex items-center justify-center rounded-full bg-success/10 p-6">
              <CheckCircle className="h-16 w-16 text-success" />
            </div>
            <h1 className="font-display text-3xl font-bold mb-4">Order Confirmed!</h1>
            <p className="text-muted-foreground mb-2">
              Your order has been placed successfully.
            </p>
            <p 
              className="font-mono text-lg font-medium mb-8"
              data-testid="order-id"
            >
              Order ID: {orderId}
            </p>
            <Link to="/">
              <Button size="lg" data-testid="continue-shopping-button">
                Continue Shopping
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div 
        className="container py-12"
        data-testid="order-confirmation-page"
      >
        {/* Success Header */}
        <div className="text-center mb-12 animate-scaleIn">
          <div className="mb-6 inline-flex items-center justify-center rounded-full bg-success/10 p-6">
            <CheckCircle className="h-16 w-16 text-success" />
          </div>
          <h1 className="font-display text-3xl font-bold mb-4">Thank You for Your Order!</h1>
          <p className="text-muted-foreground mb-2">
            Your order has been placed successfully and is being processed.
          </p>
          <p 
            className="font-mono text-lg font-medium"
            data-testid="confirmation-order-id"
          >
            Order ID: {state.orderId}
          </p>
        </div>

        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
          {/* Order Details */}
          <div 
            className="rounded-xl border border-border bg-card p-6"
            data-testid="order-items-summary"
          >
            <h2 className="font-display text-xl font-semibold mb-4 flex items-center gap-2">
              <Package className="h-5 w-5 text-primary" />
              Order Items
            </h2>
            
            <div className="space-y-4 mb-6">
              {state.items.map((item) => (
                <div 
                  key={item.product.id}
                  className="flex gap-3"
                  data-testid={`confirmation-item-${item.product.id}`}
                >
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="h-16 w-16 rounded-md object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{item.product.name}</p>
                    <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                  </div>
                  <p className="font-medium">
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>

            <div className="space-y-2 text-sm border-t border-border pt-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span data-testid="confirmation-subtotal">${state.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span data-testid="confirmation-shipping">
                  {state.shipping === 0 ? 'Free' : `$${state.shipping.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tax</span>
                <span data-testid="confirmation-tax">${state.tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-display font-bold text-lg pt-2 border-t border-border">
                <span>Total</span>
                <span data-testid="confirmation-total">${state.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Shipping & Next Steps */}
          <div className="space-y-6">
            {/* Shipping Address */}
            <div 
              className="rounded-xl border border-border bg-card p-6"
              data-testid="shipping-address-summary"
            >
              <h2 className="font-display text-xl font-semibold mb-4 flex items-center gap-2">
                <Truck className="h-5 w-5 text-primary" />
                Shipping Address
              </h2>
              <div className="text-muted-foreground">
                <p className="font-medium text-foreground">
                  {state.shippingAddress.firstName} {state.shippingAddress.lastName}
                </p>
                <p>{state.shippingAddress.address}</p>
                <p>
                  {state.shippingAddress.city}, {state.shippingAddress.state} {state.shippingAddress.zipCode}
                </p>
                <p>{state.shippingAddress.phone}</p>
              </div>
            </div>

            {/* What's Next */}
            <div 
              className="rounded-xl border border-border bg-card p-6"
              data-testid="whats-next"
            >
              <h2 className="font-display text-xl font-semibold mb-4 flex items-center gap-2">
                <Mail className="h-5 w-5 text-primary" />
                What's Next?
              </h2>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold">1</span>
                  <span>You'll receive an email confirmation shortly (mocked)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold">2</span>
                  <span>We'll notify you when your order ships (mocked)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold">3</span>
                  <span>Estimated delivery: 3-5 business days (mocked)</span>
                </li>
              </ul>
            </div>

            {/* Continue Shopping */}
            <Link to="/" className="block">
              <Button 
                size="lg" 
                className="w-full"
                data-testid="continue-shopping-button"
              >
                Continue Shopping
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default OrderConfirmation;
