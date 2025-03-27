export interface Category {
  id: number;
  name: string;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CategoryWithProducts extends Category {
  productCount?: number;
  featuredProduct?: {
    id: number;
    name: string;
    imageUrl?: string;
  };
}

// Request DTOs
export interface CreateCategoryRequest {
  name: string;
  description?: string;
}

export interface UpdateCategoryRequest {
  name?: string;
  description?: string | null; 
}