export interface User {
  id: number;
  username: string;
  email: string;
  streetAddress?: string;
  city: string;
  state: string;
  zipCode: string;
  isAdmin: boolean;
}

export interface CreateUserRequest {
  username: string;
  email: string;
  password: string;
  streetAddress?: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface UpdateUserRequest {
  username?: string;
  email?: string;
  streetAddress?: string | null;
  city?: string;
  state?: string;
  zipCode?: string;
}