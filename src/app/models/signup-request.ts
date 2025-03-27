export interface SignupRequest {
    username: string;
    email: string;
    password: string;
    streetAddress?: string;
    city: string;
    state: string;
    zipCode: string;
  }