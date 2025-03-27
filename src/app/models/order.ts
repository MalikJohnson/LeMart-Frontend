export interface Order {
  id: number;
  userId: number;
  totalAmount: number;
  status: 'PENDING' | 'COMPLETED' | 'CANCELLED';
  createdAt?: Date;
}

// Order Item Interface
export interface OrderItem {
  id: number;
  orderId: number;
  productId: number;
  quantity: number;
  priceAtPurchase: number; 
}

// Request DTOs
export interface CreateOrderRequest {
  userId: number;
  totalAmount: number;
  status?: 'PENDING' | 'COMPLETED' | 'CANCELLED';
}

export interface AddOrderItemRequest {
  orderId: number;
  productId: number;
  quantity: number;
  priceAtPurchase: number;
}

// Response Types
export interface OrderWithItems extends Order {
  items: OrderItem[];
}