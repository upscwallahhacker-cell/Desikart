import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { UserProfile, Product, Order, AppSettings, CartItem, UserRole, OrderStatus } from '../types';
import { INITIAL_PRODUCTS, INITIAL_SETTINGS } from './mockData';

// --- HELPER ---
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// --- AUTH CONTEXT ---
interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  register: (name: string, email: string, pass: string) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
}

// Extend UserProfile to store password locally for this mock implementation
interface StoredUser extends UserProfile {
  password?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [userDB, setUserDB] = useState<StoredUser[]>([]);

  // Load User Session and User Database
  useEffect(() => {
    // Load DB
    const storedDB = localStorage.getItem('deshikart_users_db');
    if (storedDB) {
      setUserDB(JSON.parse(storedDB));
    }

    // Load Session
    const storedUser = localStorage.getItem('deshikart_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const saveDB = (newDB: StoredUser[]) => {
    setUserDB(newDB);
    localStorage.setItem('deshikart_users_db', JSON.stringify(newDB));
  };

  const login = async (email: string, pass: string) => {
    await delay(800);
    
    // Admin Check
    if (email === 'admin@deshikart.com' && pass === 'admin123') {
      const adminUser: UserProfile = {
        uid: 'admin1',
        name: 'Admin User',
        email,
        role: UserRole.ADMIN
      };
      setUser(adminUser);
      localStorage.setItem('deshikart_user', JSON.stringify(adminUser));
      return;
    }

    // Check DB
    const foundUser = userDB.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (!foundUser) {
      throw new Error("User not registered");
    }

    if (foundUser.password !== pass) {
      throw new Error("Wrong password");
    }
    
    // Login Success (Remove password from session object)
    const { password, ...sessionUser } = foundUser;
    setUser(sessionUser);
    localStorage.setItem('deshikart_user', JSON.stringify(sessionUser));
  };

  const register = async (name: string, email: string, pass: string) => {
    await delay(800);
    
    // Validation happens in UI, but double check DB
    const existing = userDB.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      throw new Error("User already registered");
    }

    const newUser: StoredUser = {
      uid: 'u_' + Math.random().toString(36).substr(2, 9),
      name,
      email,
      role: UserRole.USER,
      password: pass
    };

    const newDB = [...userDB, newUser];
    saveDB(newDB);

    // Auto login after register
    const { password, ...sessionUser } = newUser;
    setUser(sessionUser);
    localStorage.setItem('deshikart_user', JSON.stringify(sessionUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('deshikart_user');
  };

  const updateProfile = async (data: Partial<UserProfile>) => {
    await delay(500);
    if (user) {
      const updated = { ...user, ...data };
      setUser(updated);
      localStorage.setItem('deshikart_user', JSON.stringify(updated));

      // Update in DB as well
      const newDB = userDB.map(u => u.uid === user.uid ? { ...u, ...data } : u);
      saveDB(newDB);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};

// --- DATA CONTEXT (Products, Settings, Orders) ---
interface DataContextType {
  products: Product[];
  settings: AppSettings;
  orders: Order[];
  addProduct: (p: Product) => void;
  deleteProduct: (id: string) => void;
  updateProduct: (p: Product) => void;
  placeOrder: (order: Order) => Promise<void>;
  updateOrderStatus: (id: string, status: OrderStatus) => void;
  refreshOrders: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [settings, setSettings] = useState<AppSettings>(INITIAL_SETTINGS);
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const storedOrders = localStorage.getItem('deshikart_orders');
    if (storedOrders) setOrders(JSON.parse(storedOrders));
    
    // In real app, we fetch products from DB here
  }, []);

  const refreshOrders = () => {
    const storedOrders = localStorage.getItem('deshikart_orders');
    if (storedOrders) setOrders(JSON.parse(storedOrders));
  }

  const addProduct = (p: Product) => {
    setProducts(prev => [p, ...prev]);
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const updateProduct = (p: Product) => {
    setProducts(prev => prev.map(prod => prod.id === p.id ? p : prod));
  };

  const placeOrder = async (order: Order) => {
    await delay(1000);
    const newOrders = [order, ...orders];
    setOrders(newOrders);
    localStorage.setItem('deshikart_orders', JSON.stringify(newOrders));
  };

  const updateOrderStatus = (id: string, status: OrderStatus) => {
    const newOrders = orders.map(o => o.id === id ? { ...o, status } : o);
    setOrders(newOrders);
    localStorage.setItem('deshikart_orders', JSON.stringify(newOrders));
  };

  return (
    <DataContext.Provider value={{ products, settings, orders, addProduct, deleteProduct, updateProduct, placeOrder, updateOrderStatus, refreshOrders }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error("useData must be used within DataProvider");
  return context;
};

// --- CART CONTEXT ---
interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  cartTotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    const savedCart = localStorage.getItem('deshikart_cart');
    if (savedCart) setCart(JSON.parse(savedCart));
  }, []);

  useEffect(() => {
    localStorage.setItem('deshikart_cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, qty: item.qty + 1 } : item);
      }
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const clearCart = () => setCart([]);

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, cartTotal }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
};