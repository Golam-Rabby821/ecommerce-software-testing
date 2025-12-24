import { Product } from './products';

export interface OrderItem {
  product: Product;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: {
    fullName: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
  };
  paymentMethod: string;
  createdAt: string;
}

const ORDERS_STORAGE_KEY = 'techstore_orders';

export const getOrders = (): Order[] => {
  try {
    const orders = localStorage.getItem(ORDERS_STORAGE_KEY);
    return orders ? JSON.parse(orders) : [];
  } catch {
    return [];
  }
};

export const getOrdersByUserId = (userId: string): Order[] => {
  const orders = getOrders();
  return orders.filter((order) => order.userId === userId);
};

export const getOrderById = (orderId: string): Order | undefined => {
  const orders = getOrders();
  return orders.find((order) => order.id === orderId);
};

export const createOrder = (order: Omit<Order, 'id' | 'createdAt' | 'status'>): Order => {
  const orders = getOrders();
  const newOrder: Order = {
    ...order,
    id: `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    status: 'pending',
    createdAt: new Date().toISOString(),
  };
  orders.push(newOrder);
  localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
  return newOrder;
};

export const updateOrderStatus = (orderId: string, status: Order['status']): boolean => {
  const orders = getOrders();
  const orderIndex = orders.findIndex((order) => order.id === orderId);
  if (orderIndex === -1) return false;
  orders[orderIndex].status = status;
  localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
  return true;
};

// Seed some sample orders for testing
export const seedSampleOrders = (userId: string): void => {
  const existingOrders = getOrdersByUserId(userId);
  if (existingOrders.length > 0) return;

  const sampleOrders: Order[] = [
    {
      id: 'ORD-sample-001',
      userId,
      items: [
        {
          product: {
            id: 'prod-001',
            name: 'Wireless Noise-Canceling Headphones',
            description: 'Premium headphones',
            price: 299.99,
            image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80',
            category: 'Audio',
            stock: 15,
            rating: 4.8,
            reviews: 234,
            specifications: [],
            features: [],
            inTheBox: [],
          },
          quantity: 1,
          price: 299.99,
        },
      ],
      total: 299.99,
      status: 'delivered',
      shippingAddress: {
        fullName: 'Test User',
        address: '123 Main St',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
      },
      paymentMethod: 'Credit Card',
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'ORD-sample-002',
      userId,
      items: [
        {
          product: {
            id: 'prod-003',
            name: 'Mechanical Gaming Keyboard',
            description: 'RGB keyboard',
            price: 159.99,
            image: 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=500&q=80',
            category: 'Gaming',
            stock: 25,
            rating: 4.7,
            reviews: 312,
            specifications: [],
            features: [],
            inTheBox: [],
          },
          quantity: 1,
          price: 159.99,
        },
        {
          product: {
            id: 'prod-007',
            name: 'Gaming Mouse Pro',
            description: 'Ergonomic mouse',
            price: 89.99,
            image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&q=80',
            category: 'Gaming',
            stock: 33,
            rating: 4.6,
            reviews: 421,
            specifications: [],
            features: [],
            inTheBox: [],
          },
          quantity: 2,
          price: 179.98,
        },
      ],
      total: 339.97,
      status: 'shipped',
      shippingAddress: {
        fullName: 'Test User',
        address: '123 Main St',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
      },
      paymentMethod: 'PayPal',
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ];

  const orders = getOrders();
  localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify([...orders, ...sampleOrders]));
};
