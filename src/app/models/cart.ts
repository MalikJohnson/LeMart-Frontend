export interface CartItem {
  id?: number; 
  productId: number;
  quantity: number;
  priceAtAddition: number; 
  addedAt?: Date;
}

export interface Cart {
  id?: number;
  userId: number;
  items: CartItem[];
  createdAt?: Date;
}

// API Response Types
export interface CartResponse {
  id: number;
  items: CartItem[];
  total: number;
}

// Request DTOs
export interface AddCartItemRequest {
  productId: number;
  quantity: number;
  price: number; // Current price when added
}

export interface UpdateCartItemRequest {
  quantity: number;
}