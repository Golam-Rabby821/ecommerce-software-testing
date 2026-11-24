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

  if (!state) {
    return (
      <Layout>
        <div
          className="container py-16 text-center"
          data-testid="order-confirmation-minimal"
        >
          <div className="max-w-md mx-auto rounded-lg border border-border bg-card p-8 shadow-sm">
            <div className="mb-5 inline-flex items-center justify-center rounded-full bg-success/10 p-4">
              <CheckCircle className="h-10 w-10 text-success" aria-hidden="true" />
            </div>
            <h1 className="font-display text-2xl font-bold mb-2">Order Confirmed</h1>
            <p className="text-sm text-muted-foreground mb-4">
              Your order has been placed successfully.
            </p>
            <p
              className="rounded bg-secondary px-3 py-2 font-mono text-sm font-medium mb-6"
              data-testid="order-id"
            >
              {orderId}
            </p>
            <Link to="/">
              <Button size="lg" className="w-full" data-testid="continue-shopping-button">
                Continue Shopping
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
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
        className="container py-10 md:py-12"
        data-testid="order-confirmation-page"
      >
        <div className="text-center mb-10 animate-scaleIn">
          <div className="mb-4 inline-flex items-center justify-center rounded-full bg-success/10 p-4">
            <CheckCircle className="h-10 w-10 text-success" aria-hidden="true" />
          </div>
          <h1 className="font-display text-3xl font-bold mb-2">Order Confirmed</h1>
          <p className="text-muted-foreground mb-3">
            Your order has been placed successfully and is queued for fulfillment.
          </p>
          <p
            className="inline-block rounded-md border border-border bg-card px-4 py-1.5 font-mono text-sm font-medium"
            data-testid="confirmation-order-id"
          >
            Order ID: {state.orderId}
          </p>
        </div>

        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-6">
          <div
            className="rounded-lg border border-border bg-card p-6 shadow-sm"
            data-testid="order-items-summary"
          >
            <h2 className="font-display text-lg font-semibold mb-4 flex items-center gap-2">
              <Package className="h-4 w-4 text-foreground" aria-hidden="true" />
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
                    className="h-14 w-14 rounded-md border border-border object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{item.product.name}</p>
                    <p className="font-mono text-xs text-muted-foreground">
                      Qty: {item.quantity}
                    </p>
                  </div>
                  <p className="font-mono text-sm font-medium tabular-nums">
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>

            <div className="space-y-2 text-sm border-t border-border pt-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-mono tabular-nums" data-testid="confirmation-subtotal">
                  ${state.subtotal.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span className="font-mono tabular-nums" data-testid="confirmation-shipping">
                  {state.shipping === 0 ? 'Free' : `$${state.shipping.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tax</span>
                <span className="font-mono tabular-nums" data-testid="confirmation-tax">
                  ${state.tax.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between font-display font-bold text-lg pt-3 border-t border-border">
                <span>Total</span>
                <span className="font-mono tabular-nums" data-testid="confirmation-total">
                  ${state.total.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div
              className="rounded-lg border border-border bg-card p-6 shadow-sm"
              data-testid="shipping-address-summary"
            >
              <h2 className="font-display text-lg font-semibold mb-3 flex items-center gap-2">
                <Truck className="h-4 w-4 text-foreground" aria-hidden="true" />
                Shipping Destination
              </h2>
              <div className="text-sm text-muted-foreground space-y-0.5">
                <p className="font-medium text-foreground">
                  {state.shippingAddress.firstName} {state.shippingAddress.lastName}
                </p>
                <p>{state.shippingAddress.address}</p>
                <p>
                  {state.shippingAddress.city}, {state.shippingAddress.state}{' '}
                  {state.shippingAddress.zipCode}
                </p>
                <p className="font-mono text-xs pt-1">{state.shippingAddress.phone}</p>
              </div>
            </div>

            <div
              className="rounded-lg border border-border bg-card p-6 shadow-sm"
              data-testid="whats-next"
            >
              <h2 className="font-display text-lg font-semibold mb-3 flex items-center gap-2">
                <Mail className="h-4 w-4 text-foreground" aria-hidden="true" />
                Fulfillment Pipeline (Mocked)
              </h2>
              <ul className="space-y-2.5 text-sm text-muted-foreground">
                <li className="flex items-start gap-2.5">
                  <span className="font-mono text-xs font-semibold text-foreground mt-0.5">01</span>
                  <span>Email receipt dispatched (mocked)</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="font-mono text-xs font-semibold text-foreground mt-0.5">02</span>
                  <span>Tracking notification prepared (mocked)</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="font-mono text-xs font-semibold text-foreground mt-0.5">03</span>
                  <span>Estimated delivery window: 3–5 business days</span>
                </li>
              </ul>
            </div>

            <Link to="/" className="block">
              <Button size="lg" className="w-full" data-testid="continue-shopping-button">
                Continue Shopping
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default OrderConfirmation;
