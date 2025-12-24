import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { shippingAddressSchema, paymentSchema, ShippingAddressData, PaymentData } from '@/utils/validation';
import { CreditCard, Truck, Lock, ArrowLeft, AlertCircle } from 'lucide-react';

type PaymentMethod = 'credit_card' | 'paypal' | 'apple_pay';

interface FormErrors {
  [key: string]: string;
}

const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const { items, subtotal, total, clearCart } = useCart();
  const { isAuthenticated, user } = useAuth();
  const { toast } = useToast();

  const [step, setStep] = useState<'shipping' | 'payment'>('shipping');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('credit_card');
  const [errors, setErrors] = useState<FormErrors>({});
  const [serverError, setServerError] = useState<string | null>(null);

  const [shippingData, setShippingData] = useState<ShippingAddressData>({
    firstName: user?.name?.split(' ')[0] || '',
    lastName: user?.name?.split(' ').slice(1).join(' ') || '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    phone: '',
  });

  const [paymentData, setPaymentData] = useState<PaymentData>({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    nameOnCard: '',
  });

  // Redirect if cart is empty or not authenticated
  useEffect(() => {
    if (items.length === 0) {
      navigate('/cart');
    }
    if (!isAuthenticated) {
      navigate('/auth?mode=login&redirect=/checkout');
    }
  }, [items, isAuthenticated, navigate]);

  const SHIPPING_THRESHOLD = 100;
  const SHIPPING_COST = 9.99;
  const TAX_RATE = 0.08;
  const shipping = subtotal >= SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const tax = subtotal * TAX_RATE;

  const handleShippingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setShippingData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handlePaymentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Format card number with spaces
    if (name === 'cardNumber') {
      const formatted = value.replace(/\D/g, '').slice(0, 16);
      setPaymentData(prev => ({ ...prev, [name]: formatted }));
    } 
    // Format expiry date
    else if (name === 'expiryDate') {
      let formatted = value.replace(/\D/g, '').slice(0, 4);
      if (formatted.length >= 2) {
        formatted = formatted.slice(0, 2) + '/' + formatted.slice(2);
      }
      setPaymentData(prev => ({ ...prev, [name]: formatted }));
    }
    // Format CVV
    else if (name === 'cvv') {
      const formatted = value.replace(/\D/g, '').slice(0, 4);
      setPaymentData(prev => ({ ...prev, [name]: formatted }));
    }
    else {
      setPaymentData(prev => ({ ...prev, [name]: value }));
    }

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateShipping = (): boolean => {
    const result = shippingAddressSchema.safeParse(shippingData);
    if (!result.success) {
      const newErrors: FormErrors = {};
      result.error.errors.forEach(err => {
        const field = err.path[0] as string;
        newErrors[field] = err.message;
      });
      setErrors(newErrors);
      return false;
    }
    setErrors({});
    return true;
  };

  const validatePayment = (): boolean => {
    if (paymentMethod !== 'credit_card') return true;

    const result = paymentSchema.safeParse(paymentData);
    if (!result.success) {
      const newErrors: FormErrors = {};
      result.error.errors.forEach(err => {
        const field = err.path[0] as string;
        newErrors[field] = err.message;
      });
      setErrors(newErrors);
      return false;
    }
    setErrors({});
    return true;
  };

  const handleContinueToPayment = () => {
    if (validateShipping()) {
      setStep('payment');
      setErrors({});
    }
  };

  const handlePlaceOrder = async () => {
    if (!validatePayment()) return;

    setIsSubmitting(true);
    setServerError(null);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));

    // Simulate occasional failure (15% chance)
    if (Math.random() < 0.15) {
      setIsSubmitting(false);
      setServerError('Payment processing failed. Please try again.');
      return;
    }

    // Generate order ID
    const orderId = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    // Clear cart and navigate to confirmation
    clearCart();

    toast({
      title: 'Order placed successfully!',
      description: `Your order ${orderId} has been confirmed.`,
    });

    navigate(`/order-confirmation/${orderId}`, {
      state: {
        orderId,
        items,
        subtotal,
        shipping,
        tax,
        total,
        shippingAddress: shippingData,
      },
    });
  };

  if (items.length === 0) {
    return null;
  }

  return (
    <Layout>
      <div className="container py-8" data-testid="checkout-page">
        <h1 
          className="font-display text-3xl font-bold text-foreground mb-8"
          data-testid="checkout-title"
        >
          Checkout
        </h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-2">
            {/* Progress Steps */}
            <div 
              className="flex items-center gap-4 mb-8"
              data-testid="checkout-steps"
            >
              <div className={`flex items-center gap-2 ${step === 'shipping' ? 'text-primary' : 'text-muted-foreground'}`}>
                <div className={`flex h-8 w-8 items-center justify-center rounded-full ${step === 'shipping' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                  <Truck className="h-4 w-4" />
                </div>
                <span className="font-medium">Shipping</span>
              </div>
              <div className="flex-1 h-px bg-border" />
              <div className={`flex items-center gap-2 ${step === 'payment' ? 'text-primary' : 'text-muted-foreground'}`}>
                <div className={`flex h-8 w-8 items-center justify-center rounded-full ${step === 'payment' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                  <CreditCard className="h-4 w-4" />
                </div>
                <span className="font-medium">Payment</span>
              </div>
            </div>

            {/* Server Error */}
            {serverError && (
              <div 
                className="mb-6 flex items-center gap-3 rounded-lg bg-destructive/10 p-4 text-sm text-destructive animate-shake"
                data-testid="checkout-error"
              >
                <AlertCircle className="h-5 w-5 flex-shrink-0" />
                <span>{serverError}</span>
              </div>
            )}

            {/* Shipping Form */}
            {step === 'shipping' && (
              <div 
                className="rounded-xl border border-border bg-card p-6 animate-fadeIn"
                data-testid="shipping-form"
              >
                <h2 className="font-display text-xl font-semibold mb-6">Shipping Address</h2>
                
                <div className="grid gap-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        value={shippingData.firstName}
                        onChange={handleShippingChange}
                        className={errors.firstName ? 'border-destructive' : ''}
                        data-testid="shipping-first-name"
                      />
                      {errors.firstName && (
                        <p className="text-sm text-destructive" data-testid="first-name-error">{errors.firstName}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        value={shippingData.lastName}
                        onChange={handleShippingChange}
                        className={errors.lastName ? 'border-destructive' : ''}
                        data-testid="shipping-last-name"
                      />
                      {errors.lastName && (
                        <p className="text-sm text-destructive" data-testid="last-name-error">{errors.lastName}</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Street Address</Label>
                    <Input
                      id="address"
                      name="address"
                      value={shippingData.address}
                      onChange={handleShippingChange}
                      placeholder="123 Main Street"
                      className={errors.address ? 'border-destructive' : ''}
                      data-testid="shipping-address"
                    />
                    {errors.address && (
                      <p className="text-sm text-destructive" data-testid="address-error">{errors.address}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        name="city"
                        value={shippingData.city}
                        onChange={handleShippingChange}
                        className={errors.city ? 'border-destructive' : ''}
                        data-testid="shipping-city"
                      />
                      {errors.city && (
                        <p className="text-sm text-destructive" data-testid="city-error">{errors.city}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state">State</Label>
                      <Input
                        id="state"
                        name="state"
                        value={shippingData.state}
                        onChange={handleShippingChange}
                        className={errors.state ? 'border-destructive' : ''}
                        data-testid="shipping-state"
                      />
                      {errors.state && (
                        <p className="text-sm text-destructive" data-testid="state-error">{errors.state}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="zipCode">ZIP Code</Label>
                      <Input
                        id="zipCode"
                        name="zipCode"
                        value={shippingData.zipCode}
                        onChange={handleShippingChange}
                        placeholder="12345"
                        className={errors.zipCode ? 'border-destructive' : ''}
                        data-testid="shipping-zip"
                      />
                      {errors.zipCode && (
                        <p className="text-sm text-destructive" data-testid="zip-error">{errors.zipCode}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        name="phone"
                        value={shippingData.phone}
                        onChange={handleShippingChange}
                        placeholder="555-555-5555"
                        className={errors.phone ? 'border-destructive' : ''}
                        data-testid="shipping-phone"
                      />
                      {errors.phone && (
                        <p className="text-sm text-destructive" data-testid="phone-error">{errors.phone}</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex justify-between mt-8">
                  <Button
                    variant="ghost"
                    onClick={() => navigate('/cart')}
                    data-testid="back-to-cart-button"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Cart
                  </Button>
                  <Button
                    onClick={handleContinueToPayment}
                    data-testid="continue-to-payment-button"
                  >
                    Continue to Payment
                  </Button>
                </div>
              </div>
            )}

            {/* Payment Form */}
            {step === 'payment' && (
              <div 
                className="rounded-xl border border-border bg-card p-6 animate-fadeIn"
                data-testid="payment-form"
              >
                <h2 className="font-display text-xl font-semibold mb-6">Payment Method</h2>

                {/* Payment Method Selection */}
                <div className="grid grid-cols-3 gap-3 mb-6">
                  {[
                    { id: 'credit_card', label: 'Credit Card', icon: CreditCard },
                    { id: 'paypal', label: 'PayPal', icon: CreditCard },
                    { id: 'apple_pay', label: 'Apple Pay', icon: CreditCard },
                  ].map(({ id, label, icon: Icon }) => (
                    <button
                      key={id}
                      onClick={() => setPaymentMethod(id as PaymentMethod)}
                      className={`flex flex-col items-center gap-2 rounded-lg border p-4 transition-all ${
                        paymentMethod === id
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50'
                      }`}
                      data-testid={`payment-method-${id}`}
                    >
                      <Icon className="h-6 w-6" />
                      <span className="text-sm font-medium">{label}</span>
                    </button>
                  ))}
                </div>

                {/* Credit Card Form */}
                {paymentMethod === 'credit_card' && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="cardNumber">Card Number</Label>
                      <Input
                        id="cardNumber"
                        name="cardNumber"
                        value={paymentData.cardNumber}
                        onChange={handlePaymentChange}
                        placeholder="1234 5678 9012 3456"
                        className={errors.cardNumber ? 'border-destructive' : ''}
                        data-testid="card-number"
                      />
                      {errors.cardNumber && (
                        <p className="text-sm text-destructive" data-testid="card-number-error">{errors.cardNumber}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="nameOnCard">Name on Card</Label>
                      <Input
                        id="nameOnCard"
                        name="nameOnCard"
                        value={paymentData.nameOnCard}
                        onChange={handlePaymentChange}
                        placeholder="John Doe"
                        className={errors.nameOnCard ? 'border-destructive' : ''}
                        data-testid="name-on-card"
                      />
                      {errors.nameOnCard && (
                        <p className="text-sm text-destructive" data-testid="name-on-card-error">{errors.nameOnCard}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="expiryDate">Expiry Date</Label>
                        <Input
                          id="expiryDate"
                          name="expiryDate"
                          value={paymentData.expiryDate}
                          onChange={handlePaymentChange}
                          placeholder="MM/YY"
                          className={errors.expiryDate ? 'border-destructive' : ''}
                          data-testid="expiry-date"
                        />
                        {errors.expiryDate && (
                          <p className="text-sm text-destructive" data-testid="expiry-error">{errors.expiryDate}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cvv">CVV</Label>
                        <Input
                          id="cvv"
                          name="cvv"
                          value={paymentData.cvv}
                          onChange={handlePaymentChange}
                          placeholder="123"
                          className={errors.cvv ? 'border-destructive' : ''}
                          data-testid="cvv"
                        />
                        {errors.cvv && (
                          <p className="text-sm text-destructive" data-testid="cvv-error">{errors.cvv}</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod !== 'credit_card' && (
                  <p 
                    className="text-center text-muted-foreground py-8"
                    data-testid="mock-payment-message"
                  >
                    {paymentMethod === 'paypal' 
                      ? 'You will be redirected to PayPal to complete payment (mocked).'
                      : 'You will be prompted to authenticate with Apple Pay (mocked).'}
                  </p>
                )}

                <div className="flex justify-between mt-8">
                  <Button
                    variant="ghost"
                    onClick={() => setStep('shipping')}
                    data-testid="back-to-shipping-button"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Shipping
                  </Button>
                  <Button
                    variant="accent"
                    onClick={handlePlaceOrder}
                    isLoading={isSubmitting}
                    data-testid="place-order-button"
                  >
                    <Lock className="h-4 w-4 mr-2" />
                    Place Order
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div 
              className="rounded-xl border border-border bg-card p-6 sticky top-24"
              data-testid="checkout-summary"
            >
              <h2 className="font-display text-lg font-bold mb-4">Order Summary</h2>

              {/* Items */}
              <div className="space-y-3 mb-6">
                {items.map((item) => (
                  <div 
                    key={item.product.id}
                    className="flex gap-3"
                    data-testid={`checkout-item-${item.product.id}`}
                  >
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="h-16 w-16 rounded-md object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{item.product.name}</p>
                      <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-sm font-medium">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="space-y-2 text-sm border-t border-border pt-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span data-testid="checkout-subtotal">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span data-testid="checkout-shipping">{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tax</span>
                  <span data-testid="checkout-tax">${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-display font-bold text-lg pt-2 border-t border-border">
                  <span>Total</span>
                  <span data-testid="checkout-total">${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Checkout;
