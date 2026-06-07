export interface User {
    id: string;
    name: string;
    email: string;
    role: 'admin' | 'merchant' | 'client';
    storeId: string | null;
    createdAt: string;
  }
  
  export interface CreateUserDto {
    name: string;
    email: string;
    role: string;
    storeId?: string | null;
  }