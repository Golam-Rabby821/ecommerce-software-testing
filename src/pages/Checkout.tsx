import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useQALab } from "@/contexts/QALabContext";
import { useToast } from "@/hooks/use-toast";
import {
  shippingAddressSchema,
  paymentSchema,
  ShippingAddressData,
  PaymentData,
} from "@/utils/validation";
import { CreditCard, Truck, Lock, ArrowLeft, AlertCircle, Wallet, Smartphone } from "lucide-react";

type PaymentMethod = "credit_card" | "paypal" | "apple_pay";

interface FormErrors {
  [key: string]: string;
}

const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const { items, subtotal, total, clearCart } = useCart();
  const { isAuthenticated, user } = useAuth();
  const { config, consumeForcedFailure, logEvent } = useQALab();
  const { toast } = useToast();

  const [step, setStep] = useState<"shipping" | "payment">("shipping");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("credit_card");
  const [errors, setErrors] = useState<FormErrors>({});
  const [serverError, setServerError] = useState<string | null>(null);

  const [shippingData, setShippingData] = useState<ShippingAddressData>({
    firstName: user?.name?.split(" ")[0] || "",
    lastName: user?.name?.split(" ").slice(1).join(" ") || "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    phone: "",
  });

  const [paymentData, setPaymentData] = useState<PaymentData>({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    nameOnCard: "",
  });

  // Enforce authentication access control BEFORE empty-cart redirect
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/auth?mode=login&redirect=/checkout");
      return;
    }
    if (items.length === 0) {
      navigate("/cart");
    }
  }, [isAuthenticated, items.length, navigate]);

  const SHIPPING_THRESHOLD = 100;
  const SHIPPING_COST = 9.99;
  const TAX_RATE = 0.08;
  const shipping = subtotal >= SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const tax = subtotal * TAX_RATE;

  const handleShippingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setShippingData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handlePaymentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "cardNumber") {
      const formatted = value.replace(/\D/g, "").slice(0, 16);
      setPaymentData((prev) => ({ ...prev, [name]: formatted }));
    } else if (name === "expiryDate") {
      let formatted = value.replace(/\D/g, "").slice(0, 4);
      if (formatted.length >= 2) {
        formatted = formatted.slice(0, 2) + "/" + formatted.slice(2);
      }
      setPaymentData((prev) => ({ ...prev, [name]: formatted }));
    } else if (name === "cvv") {
      const formatted = value.replace(/\D/g, "").slice(0, 4);
      setPaymentData((prev) => ({ ...prev, [name]: formatted }));
    } else {
      setPaymentData((prev) => ({ ...prev, [name]: value }));
    }

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateShipping = (): boolean => {
    const result = shippingAddressSchema.safeParse(shippingData);
    if (!result.success) {
      const newErrors: FormErrors = {};
      result.error.errors.forEach((err) => {
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
    if (paymentMethod !== "credit_card") return true;

    const result = paymentSchema.safeParse(paymentData);
    if (!result.success) {
      const newErrors: FormErrors = {};
      result.error.errors.forEach((err) => {
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
      setStep("payment");
      setErrors({});
    }
  };

  const handlePlaceOrder = async () => {
    if (!validatePayment()) return;

    setIsSubmitting(true);
    setServerError(null);

    if (config.checkoutChaos || config.networkLatency) {
      await new Promise((resolve) => setTimeout(resolve, 1200 + Math.random() * 800));
    }

    if (
      consumeForcedFailure("Checkout.placeOrder") ||
      (config.checkoutChaos && Math.random() < 0.15)
    ) {
      setIsSubmitting(false);
      setServerError("Payment processing failed. Please try again.");
      logEvent("CHAOS", "CHECKOUT_PAYMENT_DECLINED", "Simulated payment gateway failure");
      return;
    }

    const orderId = `ORD-${Date.now()}-${Math.random()
      .toString(36)
      .substr(2, 9)
      .toUpperCase()}`;

    const orderSnapshot = {
      orderId,
      items,
      subtotal,
      shipping,
      tax,
      total,
      shippingAddress: shippingData,
    };

    clearCart();
    logEvent("CHECKOUT", "ORDER_PLACED", `Confirmed ${orderId} ($${total.toFixed(2)})`);

    toast({
      title: "Order placed successfully!",
      description: `Your order ${orderId} has been confirmed.`,
    });

    navigate(`/order-confirmation/${orderId}`, { state: orderSnapshot });
  };

  if (!isAuthenticated || items.length === 0) {
    return null;
  }

  return (
    <Layout>
      <div className="container py-8 md:py-10" data-testid="checkout-page">
        <div className="mb-8">
          <p className="font-mono text-xs uppercase tracking-wider text-accent font-semibold mb-1">
            Secure Flow (Mocked)
          </p>
          <h1
            className="font-display text-3xl font-bold text-foreground"
            data-testid="checkout-title"
          >
            Checkout
          </h1>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {/* Progress Steps */}
            <div className="flex items-center gap-4 mb-6" data-testid="checkout-steps">
              <div
                className={`flex items-center gap-2 ${
                  step === "shipping" ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full font-mono text-xs ${
                    step === "shipping"
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-foreground"
                  }`}
                >
                  <Truck className="h-4 w-4" aria-hidden="true" />
                </div>
                <span className="text-sm font-semibold">01 · Shipping</span>
              </div>
              <div className="flex-1 h-px bg-border" />
              <div
                className={`flex items-center gap-2 ${
                  step === "payment" ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full font-mono text-xs ${
                    step === "payment"
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-muted-foreground"
                  }`}
                >
                  <CreditCard className="h-4 w-4" aria-hidden="true" />
                </div>
                <span className="text-sm font-semibold">02 · Payment</span>
              </div>
            </div>

            {serverError && (
              <div
                role="alert"
                className="mb-6 flex items-center gap-3 rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive animate-shake"
                data-testid="checkout-error"
              >
                <AlertCircle className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
                <span>{serverError}</span>
              </div>
            )}

            {step === "shipping" && (
              <div
                className="rounded-lg border border-border bg-card p-6 shadow-sm animate-fadeIn"
                data-testid="shipping-form"
              >
                <h2 className="font-display text-lg font-semibold mb-6">
                  Shipping Address
                </h2>

                <div className="grid gap-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        value={shippingData.firstName}
                        onChange={handleShippingChange}
                        className={errors.firstName ? "border-destructive" : ""}
                        data-testid="shipping-first-name"
                      />
                      {errors.firstName && (
                        <p className="text-xs text-destructive" data-testid="first-name-error">
                          {errors.firstName}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        value={shippingData.lastName}
                        onChange={handleShippingChange}
                        className={errors.lastName ? "border-destructive" : ""}
                        data-testid="shipping-last-name"
                      />
                      {errors.lastName && (
                        <p className="text-xs text-destructive" data-testid="last-name-error">
                          {errors.lastName}
                        </p>
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
                      className={errors.address ? "border-destructive" : ""}
                      data-testid="shipping-address"
                    />
                    {errors.address && (
                      <p className="text-xs text-destructive" data-testid="address-error">
                        {errors.address}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        name="city"
                        value={shippingData.city}
                        onChange={handleShippingChange}
                        className={errors.city ? "border-destructive" : ""}
                        data-testid="shipping-city"
                      />
                      {errors.city && (
                        <p className="text-xs text-destructive" data-testid="city-error">
                          {errors.city}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state">State</Label>
                      <Input
                        id="state"
                        name="state"
                        value={shippingData.state}
                        onChange={handleShippingChange}
                        className={errors.state ? "border-destructive" : ""}
                        data-testid="shipping-state"
                      />
                      {errors.state && (
                        <p className="text-xs text-destructive" data-testid="state-error">
                          {errors.state}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="zipCode">ZIP Code</Label>
                      <Input
                        id="zipCode"
                        name="zipCode"
                        value={shippingData.zipCode}
                        onChange={handleShippingChange}
                        placeholder="12345"
                        className={errors.zipCode ? "border-destructive" : ""}
                        data-testid="shipping-zip"
                      />
                      {errors.zipCode && (
                        <p className="text-xs text-destructive" data-testid="zip-error">
                          {errors.zipCode}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        name="phone"
                        value={shippingData.phone}
                        onChange={handleShippingChange}
                        placeholder="01XXXXXXXXX"
                        className={errors.phone ? "border-destructive" : ""}
                        data-testid="shipping-phone"
                      />
                      {errors.phone && (
                        <p className="text-xs text-destructive" data-testid="phone-error">
                          {errors.phone}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex justify-between mt-8 pt-6 border-t border-border">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => navigate("/cart")}
                    data-testid="back-to-cart-button"
                  >
                    <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                    Back to Cart
                  </Button>
                  <Button
                    type="button"
                    onClick={handleContinueToPayment}
                    data-testid="continue-to-payment-button"
                  >
                    Continue to Payment
                  </Button>
                </div>
              </div>
            )}

            {step === "payment" && (
              <div
                className="rounded-lg border border-border bg-card p-6 shadow-sm animate-fadeIn"
                data-testid="payment-form"
              >
                <h2 className="font-display text-lg font-semibold mb-6">
                  Payment Method
                </h2>

                <div className="grid grid-cols-3 gap-3 mb-6">
                  {[
                    { id: "credit_card", label: "Credit Card", icon: CreditCard },
                    { id: "paypal", label: "PayPal", icon: Wallet },
                    { id: "apple_pay", label: "Apple Pay", icon: Smartphone },
                  ].map(({ id, label, icon: Icon }) => (
                    <button
                      type="button"
                      key={id}
                      onClick={() => setPaymentMethod(id as PaymentMethod)}
                      className={`flex flex-col items-center gap-2 rounded-md border p-4 transition-all ${
                        paymentMethod === id
                          ? "border-foreground bg-secondary/70 text-foreground"
                          : "border-border text-muted-foreground hover:border-foreground/40 hover:text-foreground"
                      }`}
                      data-testid={`payment-method-${id}`}
                    >
                      <Icon className="h-5 w-5" aria-hidden="true" />
                      <span className="text-xs font-semibold">{label}</span>
                    </button>
                  ))}
                </div>

                {paymentMethod === "credit_card" && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="cardNumber">Card Number</Label>
                      <Input
                        id="cardNumber"
                        name="cardNumber"
                        value={paymentData.cardNumber}
                        onChange={handlePaymentChange}
                        placeholder="1234 5678 9012 3456"
                        className={`font-mono ${errors.cardNumber ? "border-destructive" : ""}`}
                        data-testid="card-number"
                      />
                      {errors.cardNumber && (
                        <p className="text-xs text-destructive" data-testid="card-number-error">
                          {errors.cardNumber}
                        </p>
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
                        className={errors.nameOnCard ? "border-destructive" : ""}
                        data-testid="name-on-card"
                      />
                      {errors.nameOnCard && (
                        <p className="text-xs text-destructive" data-testid="name-on-card-error">
                          {errors.nameOnCard}
                        </p>
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
                          className={`font-mono ${errors.expiryDate ? "border-destructive" : ""}`}
                          data-testid="expiry-date"
                        />
                        {errors.expiryDate && (
                          <p className="text-xs text-destructive" data-testid="expiry-error">
                            {errors.expiryDate}
                          </p>
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
                          className={`font-mono ${errors.cvv ? "border-destructive" : ""}`}
                          data-testid="cvv"
                        />
                        {errors.cvv && (
                          <p className="text-xs text-destructive" data-testid="cvv-error">
                            {errors.cvv}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod !== "credit_card" && (
                  <p
                    className="rounded-md border border-dashed border-border bg-secondary/40 text-center text-sm text-muted-foreground py-8 px-4"
                    data-testid="mock-payment-message"
                  >
                    {paymentMethod === "paypal"
                      ? "You will be redirected to PayPal to complete payment (mocked)."
                      : "You will be prompted to authenticate with Apple Pay (mocked)."}
                  </p>
                )}

                <div className="flex justify-between mt-8 pt-6 border-t border-border">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setStep("shipping")}
                    data-testid="back-to-shipping-button"
                  >
                    <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                    Back to Shipping
                  </Button>
                  <Button
                    type="button"
                    variant="default"
                    onClick={handlePlaceOrder}
                    isLoading={isSubmitting}
                    data-testid="place-order-button"
                  >
                    <Lock className="h-4 w-4" aria-hidden="true" />
                    Place Order
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div
              className="rounded-lg border border-border bg-card p-6 shadow-sm sticky top-24"
              data-testid="checkout-summary"
            >
              <h2 className="font-display text-lg font-bold mb-4">Order Summary</h2>

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
                  <span className="font-mono tabular-nums" data-testid="checkout-subtotal">
                    ${subtotal.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="font-mono tabular-nums" data-testid="checkout-shipping">
                    {shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tax (8%)</span>
                  <span className="font-mono tabular-nums" data-testid="checkout-tax">
                    ${tax.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between font-display font-bold text-lg pt-3 border-t border-border">
                  <span>Total</span>
                  <span className="font-mono tabular-nums" data-testid="checkout-total">
                    ${total.toFixed(2)}
                  </span>
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
