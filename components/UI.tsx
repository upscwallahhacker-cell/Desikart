import React, { useEffect, useState } from 'react';
import { X, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

// --- BUTTON ---
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  fullWidth?: boolean;
  loading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, variant = 'primary', fullWidth, loading, className = '', ...props 
}) => {
  const baseStyle = "px-4 py-3 rounded-xl font-semibold transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center";
  const variants = {
    primary: "bg-primary text-white shadow-lg shadow-primary/30",
    secondary: "bg-accent text-white shadow-lg shadow-accent/30",
    outline: "border-2 border-primary text-primary hover:bg-primary/5",
    danger: "bg-red-500 text-white"
  };

  return (
    <button 
      className={`${baseStyle} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : children}
    </button>
  );
};

// --- INPUT ---
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, className = '', ...props }) => (
  <div className="flex flex-col gap-1 mb-3">
    {label && <label className="text-xs font-semibold text-gray-500 uppercase">{label}</label>}
    <input 
      className={`px-4 py-3 rounded-lg bg-white text-gray-900 border ${error ? 'border-red-500' : 'border-gray-200'} focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all ${className}`}
      {...props}
    />
    {error && <span className="text-xs text-red-500">{error}</span>}
  </div>
);

// --- MODAL ---
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose} // Close when clicking the backdrop
    >
      <div 
        className="bg-white rounded-2xl w-full max-w-md shadow-2xl p-6 relative animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
      >
        <div className="flex justify-between items-center mb-4">
          {title && <h2 className="text-xl font-bold text-primary">{title}</h2>}
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <X size={20} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

// --- DRAWER (Bottom Sheet) ---
interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export const Drawer: React.FC<DrawerProps> = ({ isOpen, onClose, children }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setVisible(true);
      document.body.style.overflow = 'hidden';
    } else {
      setTimeout(() => setVisible(false), 300); // Wait for animation
      document.body.style.overflow = '';
    }
  }, [isOpen]);

  if (!isOpen && !visible) return null;

  return (
    <div className={`fixed inset-0 z-50 flex flex-col justify-end transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative bg-white rounded-t-[30px] w-full max-h-[90vh] overflow-y-auto shadow-2xl transition-transform duration-300 transform ${isOpen ? 'translate-y-0' : 'translate-y-full'}`}>
        <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto my-3" />
        <button onClick={onClose} className="absolute right-4 top-4 p-2 bg-gray-100 rounded-full z-10">
            <X size={20} className="text-gray-600" />
        </button>
        <div className="p-4 pb-8">
          {children}
        </div>
      </div>
    </div>
  );
};

// --- TOAST ---
export const useToast = () => {
  const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const ToastComponent = () => (
    toast ? (
      <div className={`fixed top-4 left-1/2 -translate-x-1/2 z-[60] px-6 py-3 rounded-full shadow-xl flex items-center gap-2 animate-in slide-in-from-top-4 fade-in duration-300 ${toast.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}>
        {toast.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
        <span className="font-medium text-sm">{toast.message}</span>
      </div>
    ) : null
  );

  return { showToast, ToastComponent };
};