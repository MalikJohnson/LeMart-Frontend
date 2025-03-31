export interface Order {
  id: number;
  userId: number;
  totalAmount: number;
  status: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'COMPLETED' | 'CANCELLED';
  createdAt?: Date;
  items: OrderItem[];
}

export interface OrderItem {
  id: number;
  orderId: number;
  productId: number;
  quantity: number;
  priceAtPurchase: number;  
}

export interface CreateOrderRequest {
  userId: number;
  orderItems: {
    productId: number;
    quantity: number;
    priceAtPurchase: number;
  }[];
  status?: 'PENDING' | 'PROCESSING'; // Only allow initial statuses
}

export interface UpdateOrderStatusRequest {
  status: 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'COMPLETED' | 'CANCELLED';
}

// Helper types and constants
export const ORDER_STATUSES = [
  'PENDING',
  'PROCESSING',
  'SHIPPED',
  'DELIVERED',
  'COMPLETED',
  'CANCELLED'
] as const;

export type OrderStatus = typeof ORDER_STATUSES[number];

// Response types
export interface OrderSummary {
  id: number;
  totalAmount: number;
  status: OrderStatus;
  createdAt: Date;
  itemCount: number;
}