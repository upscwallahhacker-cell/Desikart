import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { UserProfile, Product, Order, AppSettings, CartItem, UserRole, OrderStatus } from '../types';
import { INITIAL_PRODUCTS, INITIAL_SETTINGS } from './mockData';
import { auth, db, googleProvider } from './firebase';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updateProfile as updateAuthProfile,
  signInWithPopup
} from 'firebase/auth';
import { 
  collection, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  onSnapshot, 
  deleteDoc,
  query,
  orderBy
} from 'firebase/firestore';

// --- HELPER ---
const handleError = (error: any) => {
  console.error("Firebase Error:", error);
  // Custom user-friendly messages
  if (error.code === 'auth/invalid-credential') return 'Invalid Email or Password. If you are new, please Sign Up first.';
  if (error.code === 'auth/user-not-found') return 'User not registered. Please Sign Up first.';
  if (error.code === 'auth/wrong-password') return 'Invalid password.';
  if (error.code === 'auth/email-already-in-use') return 'Email is already registered.';
  if (error.code === 'auth/popup-closed-by-user') return 'Sign in cancelled.';
  if (error.code === 'auth/cancelled-popup-request') return 'Another sign-in popup is already open. Please close it and try again.';
  if (error.code === 'auth/popup-blocked') return 'Sign-in popup was blocked by your browser. Please allow popups for this site.';
  if (error.code === 'auth/unauthorized-domain') {
    return 'App domain is not authorized for Google Sign-In.';
  }
  return error.message || 'An unexpected error occurred.';
};

// --- AUTH CONTEXT ---
interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  register: (name: string, email: string, pass: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen for Auth Changes
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Fetch extra user details from Firestore
        const userDocRef = doc(db, 'users', firebaseUser.uid);
        try {
            const userDoc = await getDoc(userDocRef);

            if (userDoc.exists()) {
              const userData = userDoc.data() as UserProfile;
              setUser({ ...userData, uid: firebaseUser.uid }); // Ensure UID matches
            } else {
              // Fallback if firestore doc missing (shouldn't happen on normal flow)
              setUser({
                uid: firebaseUser.uid,
                name: firebaseUser.displayName || 'User',
                email: firebaseUser.email || '',
                role: UserRole.USER
              });
            }
        } catch (e) {
            console.error("Error fetching user profile:", e);
            // Even if firestore fails, we have basic auth info
             setUser({
                uid: firebaseUser.uid,
                name: firebaseUser.displayName || 'User',
                email: firebaseUser.email || '',
                role: UserRole.USER
              });
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, pass: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, pass);
    } catch (error: any) {
      throw new Error(handleError(error));
    }
  };

  const register = async (name: string, email: string, pass: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
      const firebaseUser = userCredential.user;
      
      // Update Display Name
      await updateAuthProfile(firebaseUser, { displayName: name });

      // Create User Profile in Firestore
      // Simple Admin check: First user or specific email becomes admin
      const role = email === 'admin@deshikart.com' ? UserRole.ADMIN : UserRole.USER;
      
      const newProfile: UserProfile = {
        uid: firebaseUser.uid,
        name,
        email,
        role,
        phone: '',
        address: '',
        pin: ''
      };

      try {
        await setDoc(doc(db, 'users', firebaseUser.uid), newProfile);
      } catch (e) {
        console.error("Failed to create user profile in DB:", e);
      }
      setUser(newProfile); // Optimistic update
    } catch (error: any) {
      throw new Error(handleError(error));
    }
  };

  const loginWithGoogle = async () => {
    try {
      // Configure provider to force account selection if needed, or defaults
      googleProvider.setCustomParameters({
        prompt: 'select_account'
      });
      
      const result = await signInWithPopup(auth, googleProvider);
      const firebaseUser = result.user;

      // Check if user exists in Firestore, if not create them
      const userDocRef = doc(db, 'users', firebaseUser.uid);
      try {
        const userDoc = await getDoc(userDocRef);

        if (!userDoc.exists()) {
          const newProfile: UserProfile = {
            uid: firebaseUser.uid,
            name: firebaseUser.displayName || 'Google User',
            email: firebaseUser.email || '',
            role: UserRole.USER,
            phone: '',
            address: '',
            pin: ''
          };
          await setDoc(userDocRef, newProfile);
          setUser(newProfile);
        }
      } catch (e) {
          console.error("Firestore profile check failed:", e);
          // Allow login even if DB fails, using auth data
          setUser({
            uid: firebaseUser.uid,
            name: firebaseUser.displayName || 'Google User',
            email: firebaseUser.email || '',
            role: UserRole.USER
          });
      }
    } catch (error: any) {
      throw new Error(handleError(error));
    }
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
  };

  const updateProfile = async (data: Partial<UserProfile>) => {
    if (user) {
      try {
        await updateDoc(doc(db, 'users', user.uid), data);
        setUser({ ...user, ...data });
      } catch (error) {
        console.error("Profile Update Failed", error);
        throw new Error("Failed to update profile.");
      }
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, loginWithGoogle, logout, updateProfile }}>
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
  addProduct: (p: Product) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  updateProduct: (p: Product) => Promise<void>;
  placeOrder: (order: Order) => Promise<void>;
  updateOrderStatus: (id: string, status: OrderStatus, refundUpi?: string) => Promise<void>;
  refreshOrders: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [settings, setSettings] = useState<AppSettings>(INITIAL_SETTINGS);
  const [orders, setOrders] = useState<Order[]>([]);

  // 1. PRODUCTS LISTENER
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'products'), (snapshot) => {
      const prods: Product[] = [];
      snapshot.forEach((doc) => {
        prods.push(doc.data() as Product);
      });
      
      setProducts(prods);

      // AUTO-SEEDING: Check if INITIAL_PRODUCTS are missing in DB and add them
      // This ensures new mock products appear even if DB isn't empty
      if (prods.length > 0) {
          const existingIds = new Set(prods.map(p => p.id));
          const missingProducts = INITIAL_PRODUCTS.filter(p => !existingIds.has(p.id));

          if (missingProducts.length > 0) {
            console.log(`Seeding ${missingProducts.length} new products to Firestore...`);
            missingProducts.forEach(async (p) => {
              try {
                await setDoc(doc(db, 'products', p.id), p);
              } catch (e) {
                // Silently fail seeding if permission denied
              }
            });
          }
      }
    }, (error) => {
        // Log as warning to avoid cluttering console as error, since app functions with mock data
        console.warn("Firestore (Products) access denied. Using fallback data.", error.message);
        setProducts(INITIAL_PRODUCTS);
    });
    return () => unsubscribe();
  }, []);

  // 2. SETTINGS LISTENER
  useEffect(() => {
    const settingsRef = doc(db, 'settings', 'config');
    const unsubscribe = onSnapshot(settingsRef, (docSnap) => {
      if (docSnap.exists()) {
        setSettings({ ...INITIAL_SETTINGS, ...docSnap.data() } as AppSettings);
      } else {
        try {
            setDoc(settingsRef, INITIAL_SETTINGS);
        } catch (e) {
            // Ignore write error
        }
      }
    }, (error) => {
        console.warn("Firestore (Settings) access denied. Using fallback data.", error.message);
        setSettings(INITIAL_SETTINGS);
    });
    return () => unsubscribe();
  }, []);

  // 3. ORDERS LISTENER
  useEffect(() => {
    const q = query(collection(db, 'orders')); 
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const ords: Order[] = [];
      snapshot.forEach((doc) => {
        ords.push(doc.data() as Order);
      });
      setOrders(ords.sort((a,b) => b.timestamp - a.timestamp));
    }, (error) => {
        console.warn("Firestore (Orders) access denied.", error.message);
        setOrders([]);
    });
    return () => unsubscribe();
  }, []);


  const addProduct = async (p: Product) => {
    await setDoc(doc(db, 'products', p.id), p);
  };

  const deleteProduct = async (id: string) => {
    await deleteDoc(doc(db, 'products', id));
  };

  const updateProduct = async (p: Product) => {
    await updateDoc(doc(db, 'products', p.id), { ...p });
  };

  const placeOrder = async (order: Order) => {
    await setDoc(doc(db, 'orders', order.id), order);
  };

  const updateOrderStatus = async (id: string, status: OrderStatus, refundUpi?: string) => {
    const data: any = { status };
    if (refundUpi) {
      data.refundUpi = refundUpi;
    }
    await updateDoc(doc(db, 'orders', id), data);
  };

  const refreshOrders = () => {
    // No-op: handled by onSnapshot
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

// --- CART CONTEXT (Local Storage) ---
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