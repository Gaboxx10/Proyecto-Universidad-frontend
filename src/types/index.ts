export interface User {
  id: string;
  username: string;
  name: string;
  role: string;
  companyName?: string;
  identityDoc?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  address?: string;
  email?: string;
  avatar?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => void;
  logout: () => void;
}

export interface CompanySettings {
  name: string;
  taxId: string;
  address: string;
  phone: string;
  email: string;
  logo?: string;
}

export interface Client {
  id: string;
  firstName: string;
  lastName: string;
  identityDoc: string;
  type: 'natural' | 'business';
  phone: string;
  address: string;
  email?: string;
}