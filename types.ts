export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN'
}

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  pin?: string;
  role: UserRole;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  old_price?: number;
  cat: string;
  img: string[];
  desc: string;
  cod: boolean;
  inStock: boolean;
}

export interface CartItem extends Product {
  qty: number;
}

export enum OrderStatus {
  PENDING = 'Pending',
  CONFIRMED = 'Confirmed',
  SHIPPED = 'Shipped',
  DELIVERED = 'Delivered',
  CANCELLED = 'Cancelled'
}

export interface Order {
  id: string;
  userId: string;
  userName: string; // Snapshot
  items: CartItem[];
  totalAmount: number;
  deliveryCharge: number;
  status: OrderStatus;
  paymentMethod: 'COD' | 'ONLINE';
  utr?: string;
  timestamp: number;
  address_details: string;
  phone: string;
}

export interface AppSettings {
  payment: {
    codEnabled: boolean;
    deliveryCharge: number;
    qr_url: string;
  };
  banners: string[];
  categories: string[];
}