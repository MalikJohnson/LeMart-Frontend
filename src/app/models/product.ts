export interface Product {
  id: number;
  name: string;
  description?: string;
  price: number;
  categoryId: number;
  imageUrl?: string;
  stockQuantity: number;
  rating: number;
  createdAt?: Date;
}

export interface ProductWithCategory extends Product {
  categoryName?: string;
}

export interface CreateProductRequest {
  name: string;
  description?: string;
  price: number;
  categoryId: number;
  stockQuantity: number;
}

export interface UpdateProductRequest {
  name?: string;
  description?: string | null;
  price?: number;
  categoryId?: number;
  stockQuantity?: number;
}