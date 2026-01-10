import React, { useState } from 'react';
import { Home, ShoppingBag, User, LayoutGrid, ClipboardList, Search, ShoppingCart } from 'lucide-react';
import { useAuth } from '../services/store';
import { useCart } from '../services/store';
import { useToast, Modal, Input, Button } from './UI';

export const Navbar: React.FC<{ onSearch?: (q: string) => void }> = ({ onSearch }) => {
  const { cart } = useCart();
  const [showSearch, setShowSearch] = useState(false);
  
  return (
    <div className="sticky top-0 z-40 bg-primary text-white shadow-md transition-all duration-300">
      <div className="flex justify-between items-center px-4 py-3 max-w-5xl mx-auto">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.location.hash = '#/'}>
          {/* Logo Image - Replace src with your actual image path */}
          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center overflow-hidden shadow-sm">
             <img 
                src="https://cdn-icons-png.flaticon.com/512/3081/3081986.png" 
                alt="DeshiKart Logo" 
                className="w-full h-full object-cover p-1" 
             />
          </div>
          <h1 className="font-bold text-xl tracking-tight select-none">DeshiKart</h1>
        </div>
        <div className="flex items-center gap-4">
            <button onClick={() => setShowSearch(!showSearch)} className="p-1 hover:bg-white/10 rounded-full transition-colors">
                <Search size={22} />
            </button>
            <div className="relative cursor-pointer p-1 hover:bg-white/10 rounded-full transition-colors" onClick={() => window.location.hash = '#/cart'}>
              <ShoppingCart size={22} />
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-accent text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full shadow-sm">
                  {cart.length}
                </span>
              )}
            </div>
        </div>
      </div>
      {(onSearch || showSearch) && (
        <div className={`overflow-hidden transition-all duration-300 ease-in-out ${showSearch ? 'max-h-16 pb-3 opacity-100' : 'max-h-0 opacity-0'}`}>
            <div className="px-4 max-w-5xl mx-auto">
                <input
                type="text"
                placeholder="Search products..."
                className="w-full bg-white text-gray-800 rounded-lg px-4 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent shadow-inner"
                onChange={(e) => onSearch && onSearch(e.target.value)}
                autoFocus={showSearch}
                />
            </div>
        </div>
      )}
    </div>
  );
};

export const BottomNav: React.FC = () => {
  const hash = window.location.hash || '#/';
  
  // Helper to determine active state including query params
  const isActive = (path: string) => {
    if (path === '#/' && hash === '#/') return true;
    if (path !== '#/' && hash.startsWith(path)) return true;
    return false;
  };

  const navItemClass = (path: string) => 
    `flex flex-col items-center gap-1 p-2 flex-1 cursor-pointer transition-colors duration-200 select-none ${isActive(path) ? 'text-primary font-bold' : 'text-gray-400 hover:text-gray-600'}`;

  const navigate = (path: string) => {
    window.location.hash = path;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-2 py-2 flex justify-between items-center z-40 pb-safe shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
      <div onClick={() => navigate('#/')} className={navItemClass('#/')}>
        <Home size={22} strokeWidth={isActive('#/') ? 2.5 : 2} />
        <span className="text-[10px]">Home</span>
      </div>
      <div onClick={() => navigate('#/products')} className={navItemClass('#/products')}>
        <LayoutGrid size={22} strokeWidth={isActive('#/products') ? 2.5 : 2} />
        <span className="text-[10px]">Products</span>
      </div>
      <div onClick={() => navigate('#/orders')} className={navItemClass('#/orders')}>
        <ClipboardList size={22} strokeWidth={isActive('#/orders') ? 2.5 : 2} />
        <span className="text-[10px]">Orders</span>
      </div>
      <div onClick={() => navigate('#/profile')} className={navItemClass('#/profile')}>
        <User size={22} strokeWidth={isActive('#/profile') ? 2.5 : 2} />
        <span className="text-[10px]">Profile</span>
      </div>
    </div>
  );
};

export const AuthModal: React.FC<{ isOpen: boolean, onClose: () => void }> = ({ isOpen, onClose }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();
  const { showToast, ToastComponent } = useToast();

  const validateEmail = (email: string) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!validateEmail(email)) {
      showToast("Invalid Email Format", "error");
      return;
    }
    if (password.length < 6) {
      showToast("Password must be at least 6 digits", "error");
      return;
    }

    setLoading(true);
    try {
      if (isRegister) {
        if (!name) throw new Error("Name is required");
        await register(name, email, password);
        showToast("Welcome to DeshiKart!");
      } else {
        await login(email, password);
        showToast("Welcome back!");
      }
      onClose();
    } catch (err: any) {
      showToast(err.message || "Something went wrong", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isRegister ? "Create Account" : "Login"}>
      <ToastComponent />
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-2">
        {isRegister && (
          <Input 
            label="Full Name" 
            value={name} 
            onChange={e => setName(e.target.value)} 
            placeholder="John Doe" 
            required 
          />
        )}
        <Input 
          label="Email Address" 
          type="email" 
          value={email} 
          onChange={e => setEmail(e.target.value)} 
          placeholder="user@example.com" 
          required 
        />
        <Input 
          label="Password" 
          type="password" 
          value={password} 
          onChange={e => setPassword(e.target.value)} 
          placeholder="****** (Min 6 digits)" 
          required 
        />
        <div className="mt-2">
          <Button type="submit" fullWidth loading={loading} variant="primary">
            {isRegister ? "Sign Up" : "Sign In"}
          </Button>
        </div>
        <p className="text-center text-sm text-gray-500 mt-2">
          {isRegister ? "Already have an account?" : "New to DeshiKart?"}
          <button 
            type="button"
            className="text-primary font-bold ml-1 hover:underline focus:outline-none" 
            onClick={() => setIsRegister(!isRegister)}
          >
            {isRegister ? "Login" : "Sign Up"}
          </button>
        </p>
      </form>
    </Modal>
  );
};