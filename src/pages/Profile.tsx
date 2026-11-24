import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useQALab } from '@/contexts/QALabContext';
import { useToast } from '@/hooks/use-toast';
import { getOrdersByUserId, seedSampleOrders, Order } from '@/data/orders';
import { User, Package, Settings, Clock, CheckCircle, Truck, XCircle } from 'lucide-react';

const Profile: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const { config, consumeForcedFailure } = useQALab();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(config.latencyMs > 0);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth?mode=login');
      return;
    }

    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: user.name || '',
        email: user.email || '',
      }));

      seedSampleOrders(user.id);

      if (config.latencyMs === 0) {
        setOrders(getOrdersByUserId(user.id));
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      const timer = setTimeout(() => {
        setOrders(getOrdersByUserId(user.id));
        setIsLoading(false);
      }, config.latencyMs);
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, user, navigate, config.latencyMs]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    if (config.latencyMs > 0 || config.authChaos) {
      const delay = config.latencyMs > 0 ? config.latencyMs : 650;
      await new Promise((resolve) => setTimeout(resolve, delay));
    }

    if (consumeForcedFailure('Profile.saveSettings') || (config.authChaos && Math.random() < 0.1)) {
      setIsSaving(false);
      toast({
        title: 'Error',
        description: 'Failed to save settings. Please try again.',
        variant: 'destructive',
      });
      return;
    }

    setIsSaving(false);
    toast({
      title: 'Settings saved',
      description: 'Your account settings have been updated.',
    });
  };

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-3.5 w-3.5" />;
      case 'processing':
        return <Package className="h-3.5 w-3.5" />;
      case 'shipped':
        return <Truck className="h-3.5 w-3.5" />;
      case 'delivered':
        return <CheckCircle className="h-3.5 w-3.5" />;
      case 'cancelled':
        return <XCircle className="h-3.5 w-3.5" />;
      default:
        return <Clock className="h-3.5 w-3.5" />;
    }
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-amber-500/10 text-amber-700 border-amber-500/25';
      case 'processing':
        return 'bg-secondary text-foreground border-border';
      case 'shipped':
        return 'bg-foreground/10 text-foreground border-foreground/20';
      case 'delivered':
        return 'bg-success/10 text-success border-success/25';
      case 'cancelled':
        return 'bg-destructive/10 text-destructive border-destructive/25';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <Layout>
      <div className="container py-8 md:py-10" data-testid="profile-page">
        <div className="mb-8">
          <p className="font-mono text-xs uppercase tracking-wider text-accent font-semibold mb-1">
            Authenticated Session
          </p>
          <h1 className="font-display text-3xl font-bold text-foreground" data-testid="profile-title">
            My Account
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage account preferences and inspect order history
          </p>
        </div>

        <Tabs defaultValue="orders" className="space-y-6" data-testid="profile-tabs">
          <TabsList className="grid w-full grid-cols-2 lg:w-[400px] bg-secondary">
            <TabsTrigger value="orders" data-testid="orders-tab">
              <Package className="h-4 w-4 mr-2" aria-hidden="true" />
              Order History
            </TabsTrigger>
            <TabsTrigger value="settings" data-testid="settings-tab">
              <Settings className="h-4 w-4 mr-2" aria-hidden="true" />
              Account Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="orders" className="space-y-4" data-testid="orders-content">
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2].map((i) => (
                  <Card key={i} className="animate-pulse">
                    <CardHeader>
                      <div className="h-4 bg-muted rounded w-1/4" />
                      <div className="h-3 bg-muted rounded w-1/3 mt-2" />
                    </CardHeader>
                    <CardContent>
                      <div className="h-16 bg-muted rounded" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : orders.length === 0 ? (
              <Card data-testid="no-orders" className="border-dashed shadow-none">
                <CardContent className="py-12 text-center">
                  <Package className="h-10 w-10 mx-auto text-muted-foreground mb-3" aria-hidden="true" />
                  <h3 className="text-base font-medium text-foreground mb-1">No orders yet</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Start shopping to see your order history here.
                  </p>
                  <Button onClick={() => navigate('/')} data-testid="start-shopping-button">
                    Start Shopping
                  </Button>
                </CardContent>
              </Card>
            ) : (
              orders.map((order) => (
                <Card key={order.id} data-testid={`order-card-${order.id}`} className="shadow-sm">
                  <CardHeader>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <div>
                        <CardTitle className="font-mono text-base" data-testid={`order-id-${order.id}`}>
                          {order.id}
                        </CardTitle>
                        <CardDescription data-testid={`order-date-${order.id}`}>
                          Placed on{' '}
                          {new Date(order.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </CardDescription>
                      </div>
                      <Badge
                        variant="outline"
                        className={`gap-1.5 font-mono text-xs capitalize ${getStatusColor(order.status)}`}
                        data-testid={`order-status-${order.id}`}
                      >
                        {getStatusIcon(order.status)}
                        {order.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {order.items.map((item, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-4"
                          data-testid={`order-item-${order.id}-${index}`}
                        >
                          <img
                            src={item.product.image}
                            alt={item.product.name}
                            className="h-14 w-14 rounded-md border border-border object-cover"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground truncate">
                              {item.product.name}
                            </p>
                            <p className="font-mono text-xs text-muted-foreground">
                              Qty: {item.quantity} × ${item.product.price.toFixed(2)}
                            </p>
                          </div>
                          <p className="font-mono text-sm font-medium text-foreground tabular-nums">
                            ${item.price.toFixed(2)}
                          </p>
                        </div>
                      ))}
                      <div className="border-t border-border pt-4 flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Total</span>
                        <span
                          className="font-mono text-lg font-bold text-foreground tabular-nums"
                          data-testid={`order-total-${order.id}`}
                        >
                          ${order.total.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="settings" data-testid="settings-content">
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <User className="h-4 w-4" aria-hidden="true" />
                  Account Information
                </CardTitle>
                <CardDescription>
                  Update your personal information and default shipping address
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSaveSettings} className="space-y-6" data-testid="settings-form">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Your full name"
                        data-testid="settings-name-input"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="your@email.com"
                        disabled
                        data-testid="settings-email-input"
                      />
                      <p className="text-xs text-muted-foreground">Email cannot be changed</p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="01XXXXXXXXX"
                        data-testid="settings-phone-input"
                      />
                    </div>
                  </div>

                  <div className="border-t border-border pt-6">
                    <h3 className="text-base font-semibold text-foreground mb-4">
                      Default Shipping Address
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="address">Street Address</Label>
                        <Input
                          id="address"
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          placeholder="123 Main St"
                          data-testid="settings-address-input"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="city">City</Label>
                        <Input
                          id="city"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          placeholder="New York"
                          data-testid="settings-city-input"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="state">State</Label>
                          <Input
                            id="state"
                            name="state"
                            value={formData.state}
                            onChange={handleInputChange}
                            placeholder="NY"
                            data-testid="settings-state-input"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="zipCode">ZIP Code</Label>
                          <Input
                            id="zipCode"
                            name="zipCode"
                            value={formData.zipCode}
                            onChange={handleInputChange}
                            placeholder="10001"
                            data-testid="settings-zip-input"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button
                      type="submit"
                      isLoading={isSaving}
                      data-testid="save-settings-button"
                    >
                      Save Changes
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Profile;
