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
  returnPeriod?: number; // Days for return policy
}

export interface CartItem extends Product {
  qty: number;
}

export enum OrderStatus {
  PENDING = 'Order Placed',
  CONFIRMED = 'Confirmed',
  SHIPPED = 'Shipped',
  DELIVERED = 'Delivered',
  CANCELLED = 'Cancelled',
  RETURN_REQUESTED = 'Return Requested', // Refunds Pending
  RETURNED = 'Returned',
  REFUNDED = 'Refunded' // Refunds Complete
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
  refundUpi?: string; // New field for Refund UPI
  timestamp: number;
  address_details: string;
  phone: string;
  expectedDeliveryDate?: number; // Admin can update this
  deliveredAt?: number; // To calculate return window
}

export interface AppSettings {
  payment: {
    codEnabled: boolean;
    deliveryCharge: number;
    qr_url: string;
  };
  banners: string[];
  categories: string[];
  social_links?: {
    youtube: string;
    instagram: string;
  };
  privacyPolicy?: string; // Dynamic Policy
  refundPolicy?: string;  // Dynamic Policy
}