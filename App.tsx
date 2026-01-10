import React, { useState, useEffect, useRef } from 'react';
import { AuthProvider, CartProvider, DataProvider, useAuth, useData, useCart } from './services/store';
import { Navbar, BottomNav, AuthModal } from './components/Layout';
import { Button, useToast, Input, Modal } from './components/UI';
import { Product, OrderStatus, Order } from './types';
import { Trash2, Plus, Minus, Settings, Package, Grid, Check, X, Copy, Tag, ShoppingBag, LogOut, ShieldCheck, Home as HomeIcon, Smartphone, ShoppingCart as CartIcon, ClipboardList, User, ChevronLeft, ChevronRight, ArrowLeft, Truck, RotateCcw, Headphones, Wallet, CreditCard, MapPin, WifiOff, Wifi, Banknote, CheckCircle2, PackageCheck, AlertCircle, Share2, IndianRupee, Phone, Calendar, Clock } from 'lucide-react';

// --- SHARED COMPONENTS ---

const ProductCard: React.FC<{ product: Product; onClick: () => void }> = ({ product, onClick }) => {
  const discount = product.old_price 
    ? Math.round(((product.old_price - product.price) / product.old_price) * 100)
    : 0;

  // Safe image handling to prevent crash
  const imageSrc = product.img && product.img.length > 0 ? product.img[0] : 'https://via.placeholder.com/150';

  return (
    <div 
      onClick={onClick} 
      className="bg-white rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.05)] overflow-hidden flex flex-col cursor-pointer border border-gray-100 group transition-all duration-300 active:scale-[0.98]"
    >
      <div className="relative aspect-square bg-gray-50 overflow-hidden">
        <img src={imageSrc} alt={product.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" loading="lazy" />
        {discount > 0 && (
          <span className="absolute top-2 left-2 bg-accent text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-sm">
            -{discount}%
          </span>
        )}
        {!product.inStock && (
          <div className="absolute inset-0 bg-white/70 flex items-center justify-center font-bold text-gray-500 text-sm backdrop-blur-[2px]">
            Out of Stock
          </div>
        )}
      </div>
      <div className="p-3 flex flex-col flex-grow">
        <h3 className="font-medium text-gray-800 text-sm line-clamp-2 leading-tight mb-2 min-h-[2.5rem]">{product.name}</h3>
        
        <div className="mt-auto">
          <div className="flex items-baseline gap-2 mb-2">
            <span className="font-bold text-lg text-primary">₹{product.price}</span>
            {product.old_price && (
              <span className="text-gray-400 text-xs line-through">₹{product.old_price}</span>
            )}
          </div>
          
          {product.cod ? (
            <div className="flex items-center gap-1.5 bg-green-50 text-green-700 text-[10px] font-bold py-1.5 px-2 rounded-lg">
              <Banknote size={14} className="flex-shrink-0" />
              <span>Cash on Delivery</span>
            </div>
          ) : (
             <div className="flex items-center gap-1.5 bg-orange-50 text-orange-700 text-[10px] font-bold py-1.5 px-2 rounded-lg">
              <CreditCard size={14} className="flex-shrink-0" />
              <span>Online Only</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// --- PAGES ---

// 1. HOME PAGE
const Home = () => {
  const { settings, products } = useData();
  const [search, setSearch] = useState('');
  const [bannerIndex, setBannerIndex] = useState(0);

  // Safe filter logic
  const filtered = products.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase())
  ).slice(0, 8); // Limit to 8 items on Home for performance

  // Banner Logic
  const nextBanner = () => {
    setBannerIndex((prev) => (prev + 1) % settings.banners.length);
  };

  const prevBanner = () => {
    setBannerIndex((prev) => (prev - 1 + settings.banners.length) % settings.banners.length);
  };

  useEffect(() => {
    const timer = setInterval(nextBanner, 5000);
    return () => clearInterval(timer);
  }, [settings.banners.length]);

  const getCatIcon = (name: string) => {
    switch(name) {
        case 'All': return <HomeIcon size={16} className="mb-0.5"/>;
        case 'Groceries': return <CartIcon size={16} className="mb-0.5"/>;
        case 'Electronics': return <Smartphone size={16} className="mb-0.5"/>;
        default: return <Tag size={16} className="mb-0.5"/>;
    }
  }

  return (
    <div className="pb-24 min-h-screen bg-background">
      <Navbar onSearch={setSearch} />
      
      {/* Banner Slider */}
      <div className="px-4 pt-4 pb-2 max-w-5xl mx-auto">
        <div className="w-full h-48 md:h-64 rounded-2xl overflow-hidden shadow-sm relative group bg-gray-200">
            {settings.banners.map((url, index) => (
                <div 
                    key={index}
                    className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${index === bannerIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
                >
                    <img src={url} alt={`Banner ${index + 1}`} className="w-full h-full object-cover" loading="lazy" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                </div>
            ))}
            
            {/* Arrows */}
            <button 
                onClick={(e) => { e.stopPropagation(); prevBanner(); }}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center shadow-md text-primary hover:bg-white z-20 active:scale-95 transition-all"
            >
                <ChevronLeft size={20} />
            </button>
            <button 
                onClick={(e) => { e.stopPropagation(); nextBanner(); }}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center shadow-md text-primary hover:bg-white z-20 active:scale-95 transition-all"
            >
                <ChevronRight size={20} />
            </button>

            {/* Dots */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
                {settings.banners.map((_, idx) => (
                    <div 
                        key={idx} 
                        className={`h-1.5 rounded-full transition-all duration-300 ${idx === bannerIndex ? 'bg-accent w-5' : 'bg-white/60 w-1.5'}`}
                    ></div>
                ))}
            </div>
        </div>
      </div>

      {/* Categories */}
      <div className="bg-background pt-2 pb-2">
          <div className="px-4 flex gap-3 overflow-x-auto no-scrollbar max-w-5xl mx-auto">
            {settings.categories.map((cat) => (
                <button 
                    key={cat}
                    onClick={() => window.location.hash = `#/products?cat=${cat}`}
                    className={`flex-shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-full border bg-white shadow-sm border-gray-100 text-sm font-bold text-primary active:scale-95 transition-transform`}
                >
                    {getCatIcon(cat)}
                    {cat}
                </button>
            ))}
          </div>
      </div>

      <div className="px-4 mt-4 max-w-5xl mx-auto">
        <div className="flex justify-between items-end mb-4">
             <div>
                <h2 className="text-xl font-bold text-primary">Featured Products</h2>
                <p className="text-gray-500 text-sm">{products.length} products available</p>
             </div>
             <button onClick={() => window.location.hash = '#/products'} className="text-accent text-sm font-bold px-2 py-1">See All</button>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 animate-in fade-in duration-500">
          {filtered.map(p => (
            <ProductCard key={p.id} product={p} onClick={() => window.location.hash = `#/product/${p.id}`} />
          ))}
        </div>
      </div>
      <BottomNav />
    </div>
  );
};

// 2. PRODUCTS PAGE
const Products = () => {
  const { products, settings } = useData();
  const [search, setSearch] = useState('');
  
  // Use derived state from URL to prevent sync issues and loops
  const hash = window.location.hash;
  const urlCat = hash.includes('?cat=') ? decodeURIComponent(hash.split('?cat=')[1]) : 'All';
  const [cat, setCat] = useState(urlCat);

  // Sync internal state with URL changes
  useEffect(() => {
    setCat(urlCat);
  }, [urlCat]);

  const filtered = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchesCat = cat === 'All' || p.cat === cat;
    return matchesSearch && matchesCat;
  });

  const getCatIcon = (name: string) => {
    switch(name) {
        case 'All': return <HomeIcon size={16}/>;
        case 'Groceries': return <CartIcon size={16}/>;
        case 'Electronics': return <Smartphone size={16}/>;
        default: return <Tag size={16}/>;
    }
  }

  const handleCatChange = (newCat: string) => {
    setCat(newCat);
    window.location.hash = `#/products?cat=${newCat}`;
  };

  return (
    <div className="pb-24 min-h-screen bg-background">
      <Navbar onSearch={setSearch} />
      
      {/* Category Filter */}
      <div className="bg-background pt-2 pb-2 px-4 shadow-sm overflow-x-auto flex gap-2 no-scrollbar">
        {settings.categories.map(c => (
          <button 
            key={c} 
            onClick={() => handleCatChange(c)}
            className={`whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-medium transition-colors flex items-center gap-2 ${cat === c ? 'bg-primary text-white shadow-md' : 'bg-white text-gray-600 border border-gray-200'}`}
          >
             {cat !== c && getCatIcon(c)}
            {c}
          </button>
        ))}
      </div>

      <div className="px-4 py-4 max-w-6xl mx-auto">
        <h2 className="text-xl font-bold text-primary mb-1">Products</h2>
        <p className="text-gray-500 text-sm mb-4">{filtered.length} products available</p>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3 animate-in fade-in duration-500">
          {filtered.map(p => (
             <ProductCard key={p.id} product={p} onClick={() => window.location.hash = `#/product/${p.id}`} />
          ))}
        </div>
        
        {filtered.length === 0 && (
            <div className="text-center py-20 text-gray-400 flex flex-col items-center animate-in fade-in">
                <Package size={48} className="mb-4 opacity-50"/>
                <p>No products found in {cat}</p>
                <Button variant="outline" className="mt-4" onClick={() => handleCatChange('All')}>Show All</Button>
            </div>
        )}
      </div>
      <BottomNav />
    </div>
  );
};

// 3. PRODUCT DETAILS PAGE (Updated with Auth Check and Share Button)
const ProductDetail = ({ id }: { id: string }) => {
    const { products, settings } = useData(); // Added settings for Delivery Charge
    const { addToCart } = useCart();
    const { user } = useAuth(); // Auth Check
    const { showToast, ToastComponent } = useToast();
    const [currentImgIndex, setCurrentImgIndex] = useState(0);
    const [authOpen, setAuthOpen] = useState(false); // Auth Modal State
    
    // Swipe State
    const [touchStart, setTouchStart] = useState<number | null>(null);
    const [touchEnd, setTouchEnd] = useState<number | null>(null);

    // Clean ID from potential query params
    const cleanId = id ? id.split('?')[0] : '';
    const product = products.find(p => p.id === cleanId);

    if (!product) {
        return (
            <div className="min-h-screen flex items-center justify-center flex-col p-4 bg-background">
                <Package size={64} className="text-gray-300 mb-4"/>
                <p className="text-lg font-bold text-gray-600">Product not found</p>
                <Button className="mt-4" onClick={() => window.location.hash = '#/products'}>Go Back</Button>
            </div>
        );
    }

    const images = product.img.length > 0 ? product.img : ['https://via.placeholder.com/300'];
    const discount = product.old_price 
        ? Math.round(((product.old_price - product.price) / product.old_price) * 100)
        : 0;

    // Image Slider Logic
    const nextImage = () => setCurrentImgIndex((prev) => (prev + 1) % images.length);
    const prevImage = () => setCurrentImgIndex((prev) => (prev - 1 + images.length) % images.length);

    // Swipe Handlers
    const onTouchStart = (e: React.TouchEvent) => setTouchStart(e.targetTouches[0].clientX);
    const onTouchMove = (e: React.TouchEvent) => setTouchEnd(e.targetTouches[0].clientX);
    const onTouchEnd = () => {
        if (!touchStart || !touchEnd) return;
        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > 50;
        const isRightSwipe = distance < -50;
        
        if (isLeftSwipe) nextImage();
        if (isRightSwipe) prevImage();
        
        setTouchStart(null);
        setTouchEnd(null);
    }

    // Share Handler - Robust Implementation
    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: product.name,
                    text: `Check out ${product.name} on DeshiKart!`,
                    url: window.location.href,
                });
            } catch (err) {
                // User cancelled or share failed, silently handle or log
                console.log("Share skipped or cancelled");
            }
        } else {
            // Fallback for Desktop/Unsupported browsers
            try {
                await navigator.clipboard.writeText(window.location.href);
                showToast("Link copied to clipboard!");
            } catch (err) {
                showToast("Failed to copy link", "error");
            }
        }
    };

    return (
        <div className="min-h-screen bg-white pb-24 animate-in slide-in-from-right duration-300">
            <ToastComponent />
            
            {/* Header with Back Button */}
            <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-md px-4 py-3 flex justify-between items-center shadow-sm">
                <button onClick={() => window.location.hash = '#/products'} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <ArrowLeft size={24} className="text-gray-700"/>
                </button>
                <span className="font-bold text-gray-800 text-sm uppercase tracking-wide truncate max-w-[160px]">{product.name}</span>
                <div className="flex items-center gap-1">
                    <button onClick={handleShare} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-700">
                        <Share2 size={22} />
                    </button>
                    <button onClick={() => window.location.hash = '#/cart'} className="p-2 hover:bg-gray-100 rounded-full relative transition-colors">
                        <CartIcon size={24} className="text-gray-700"/>
                    </button>
                </div>
            </div>

            <div className="max-w-3xl mx-auto">
                {/* Image Slider - Arrows Removed */}
                <div 
                    className="w-full aspect-square bg-gray-50 relative overflow-hidden group"
                    onTouchStart={onTouchStart}
                    onTouchMove={onTouchMove}
                    onTouchEnd={onTouchEnd}
                >
                    <div className="w-full h-full flex transition-transform duration-300 ease-out" style={{ transform: `translateX(-${currentImgIndex * 100}%)` }}>
                         {images.map((src, idx) => (
                             <img key={idx} src={src} className="w-full h-full object-cover flex-shrink-0" alt={`${product.name} - ${idx}`} />
                         ))}
                    </div>

                    {discount > 0 && (
                        <div className="absolute top-4 left-4 bg-accent text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg z-10">
                            {discount}% OFF
                        </div>
                    )}
                    
                    {/* Dots Only (Visible if Multiple Images) */}
                    {images.length > 1 && (
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                            {images.map((_, idx) => (
                                <div key={idx} className={`h-1.5 rounded-full transition-all shadow-sm ${idx === currentImgIndex ? 'bg-primary w-4' : 'bg-white/80 w-1.5'}`} />
                            ))}
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="px-5 py-6 space-y-6">
                    <div>
                        <div className="text-xs font-bold text-accent uppercase tracking-wider mb-2">{product.cat}</div>
                        <h1 className="text-2xl font-bold text-gray-900 leading-tight mb-2">{product.name}</h1>
                        <div className="flex items-baseline gap-3">
                            <span className="text-3xl font-bold text-primary">₹{product.price}</span>
                            {product.old_price && <span className="text-lg text-gray-400 line-through">₹{product.old_price}</span>}
                        </div>
                    </div>

                    {/* Stock, COD, Delivery Info */}
                    <div className="flex flex-col gap-2">
                         <div className={`flex items-center gap-2 text-xs font-bold px-3 py-2 rounded-lg border w-fit ${product.inStock ? 'border-green-200 bg-green-50 text-green-700' : 'border-red-200 bg-red-50 text-red-700'}`}>
                            {product.inStock ? <CheckCircle2 size={16}/> : <X size={16}/>}
                            {product.inStock ? 'In Stock & Ready to Ship' : 'Currently Out of Stock'}
                         </div>
                         
                         <div className={`flex items-center gap-2 text-xs font-bold px-3 py-2 rounded-lg border w-fit ${product.cod ? 'border-blue-200 bg-blue-50 text-blue-800' : 'border-orange-200 bg-orange-50 text-orange-800'}`}>
                            {product.cod ? <Banknote size={16}/> : <CreditCard size={16}/>}
                            {product.cod ? 'Cash on Delivery Available' : 'Online Payment Only'}
                         </div>

                         {/* Explicit Delivery Charge Display */}
                         <div className="flex items-center gap-2 text-xs font-bold px-3 py-2 rounded-lg border w-fit border-purple-200 bg-purple-50 text-purple-800">
                            <IndianRupee size={16}/>
                            {settings.payment.deliveryCharge > 0 
                                ? `Delivery Charges: ₹${settings.payment.deliveryCharge}` 
                                : 'Free Delivery'}
                         </div>
                    </div>

                     {/* Delivery & Support Icons */}
                    <div className="grid grid-cols-3 gap-2 py-4 border-t border-b border-gray-100 my-2">
                        <div className="flex flex-col items-center justify-center text-center gap-1">
                            <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
                                <Truck size={20} />
                            </div>
                            <span className="text-[10px] font-medium text-gray-600">6-7 Days Delivery</span>
                        </div>
                        <div className="flex flex-col items-center justify-center text-center gap-1">
                            <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center">
                                <RotateCcw size={20} />
                            </div>
                            <span className="text-[10px] font-medium text-gray-600">7 Days Return</span>
                        </div>
                        <div className="flex flex-col items-center justify-center text-center gap-1">
                            <div className="w-10 h-10 bg-green-50 text-green-600 rounded-full flex items-center justify-center">
                                <Headphones size={20} />
                            </div>
                            <span className="text-[10px] font-medium text-gray-600">24/7 Support</span>
                        </div>
                    </div>

                    <div>
                        <h3 className="font-bold text-gray-900 mb-2 text-sm">Description</h3>
                        <p className="text-gray-600 text-sm leading-relaxed">{product.desc}</p>
                    </div>
                </div>
            </div>

            {/* Bottom Action Bar */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 shadow-[0_-4px_10px_rgba(0,0,0,0.05)] z-30">
                <div className="max-w-3xl mx-auto flex gap-3">
                    <Button 
                        variant="outline" 
                        className="flex-1" 
                        onClick={() => {
                            if (!user) {
                                setAuthOpen(true);
                                return;
                            }
                            addToCart(product);
                            showToast("Added to Cart");
                        }}
                        disabled={!product.inStock}
                    >
                        Add to Cart
                    </Button>
                    <Button 
                        className="flex-1" 
                        onClick={() => {
                            if (!user) {
                                setAuthOpen(true);
                                return;
                            }
                            addToCart(product);
                            window.location.hash = '#/checkout';
                        }}
                        disabled={!product.inStock}
                    >
                        Buy Now
                    </Button>
                </div>
            </div>
            
            <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
        </div>
    );
};

// 4. CART (Unchanged but included for context)
const Cart = () => {
    const { cart, removeFromCart, cartTotal } = useCart();
    const { user } = useAuth();
    const { settings } = useData();
    const [authOpen, setAuthOpen] = useState(false);

    if (cart.length === 0) {
        return (
            <div className="min-h-screen bg-white flex flex-col">
                <div className="p-4 flex justify-between items-center shadow-sm z-10">
                    <div className="flex items-center gap-2">
                         <h1 className="text-xl font-bold text-primary">Your Cart <span className="text-gray-400 font-normal text-base">(0 items)</span></h1>
                    </div>
                    <button onClick={() => window.location.hash = '#/'}><X size={24} className="text-gray-600" /></button>
                </div>
                
                <div className="flex-grow flex flex-col items-center justify-center p-6 text-center -mt-20">
                    <div className="relative mb-6">
                        <CartIcon size={120} className="text-blue-100" strokeWidth={1} />
                        <div className="absolute top-0 right-0 w-6 h-6 bg-accent rounded-full border-4 border-white"></div>
                    </div>
                    <h2 className="text-2xl font-bold text-primary mb-2">Your cart is empty</h2>
                    <p className="text-gray-500 mb-8 max-w-xs">Add some products to get started!</p>
                    <Button onClick={() => window.location.hash = '#/'} className="px-10 py-3 bg-primary text-white rounded-xl font-semibold shadow-lg shadow-primary/30">
                        Continue Shopping
                    </Button>
                </div>
            </div>
        )
    }

    const checkout = () => {
        if (!user) {
            setAuthOpen(true);
        } else {
            window.location.hash = '#/checkout';
        }
    };

    return (
        <div className="min-h-screen bg-background pb-32">
            <div className="bg-white p-4 shadow-sm sticky top-0 z-10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <h1 className="text-lg font-bold">Your Cart ({cart.length})</h1>
                </div>
                <button onClick={() => window.location.hash = '#/'}><X size={24} /></button>
            </div>
            
            <div className="p-4 space-y-4 max-w-3xl mx-auto">
                {cart.map(item => (
                    <div key={item.id} className="bg-white p-3 rounded-xl shadow-sm flex gap-3 animate-in slide-in-from-bottom-2">
                        <img src={item.img && item.img[0]} className="w-[70px] h-[70px] object-cover rounded-lg bg-gray-100 flex-shrink-0" alt={item.name} />
                        <div className="flex-grow flex flex-col justify-between">
                            <div className="flex justify-between items-start">
                                <h3 className="font-medium text-sm line-clamp-2 pr-4">{item.name}</h3>
                                <button onClick={() => removeFromCart(item.id)} className="text-red-400 p-1"><Trash2 size={16} /></button>
                            </div>
                            <div className="flex justify-between items-end">
                                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">Qty: {item.qty}</span>
                                <span className="font-bold text-primary">₹{item.price * item.qty}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="fixed bottom-[65px] left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-20">
                <div className="max-w-3xl mx-auto">
                    <div className="flex justify-between mb-4 text-sm">
                        <span className="text-gray-500">Subtotal</span>
                        <span className="font-bold">₹{cartTotal}</span>
                    </div>
                    <Button fullWidth onClick={checkout}>Proceed to Checkout</Button>
                </div>
            </div>
            
            <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
            <BottomNav />
        </div>
    );
};

// 5. ORDERS (Updated with Status Logic and Detail Modal)
const Orders = () => {
    const { user } = useAuth();
    const { orders, refreshOrders, updateOrderStatus } = useData();
    const { showToast, ToastComponent } = useToast();
    const [authOpen, setAuthOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    
    useEffect(() => {
        refreshOrders();
    }, []);

    // Helper for Empty State
    const renderEmptyState = (title: string, desc: string, action: () => void, btnText: string, icon: any) => {
        const Icon = icon;
        return (
            <div className="min-h-screen bg-background flex flex-col pb-20">
                <Navbar />
                <div className="flex-grow flex flex-col items-center justify-center p-6 text-center -mt-10">
                    <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm">
                        <Icon size={40} className="text-primary/80" strokeWidth={1.5} />
                    </div>
                    <h2 className="text-xl font-bold text-primary mb-2">{title}</h2>
                    <p className="text-gray-500 mb-8 max-w-xs text-sm leading-relaxed">{desc}</p>
                    <Button onClick={action} className="px-8 bg-primary">{btnText}</Button>
                </div>
                <BottomNav />
            </div>
        );
    };

    if (!user) {
        return (
            <>
                {renderEmptyState(
                    "Login to view orders", 
                    "Please sign in to access your order history and track shipments.",
                    () => setAuthOpen(true),
                    "Login Now",
                    ClipboardList
                )}
                <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
            </>
        );
    }

    const myOrders = orders.filter(o => o.userId === user.uid).sort((a,b) => b.timestamp - a.timestamp);

    if (myOrders.length === 0) {
        return renderEmptyState(
            "No Orders Yet", 
            "When you place orders, they will appear here. Start shopping to place your first order!",
            () => window.location.hash = '#/',
            "Start Shopping",
            ClipboardList
        );
    }

    // Status Styling Helper
    const getStatusStyle = (status: OrderStatus) => {
        switch (status) {
            case OrderStatus.PENDING: return 'bg-yellow-50 text-yellow-700'; // Yellow
            case OrderStatus.CONFIRMED: return 'bg-green-50 text-green-700'; // Green
            case OrderStatus.SHIPPED: return 'bg-red-50 text-red-700'; // Red
            case OrderStatus.DELIVERED: return 'bg-blue-50 text-blue-700';
            case OrderStatus.CANCELLED: return 'bg-gray-100 text-gray-500';
            default: return 'bg-gray-100 text-gray-600';
        }
    };

    // Helper to get Status Icon
    const getStatusIcon = (status: OrderStatus) => {
        switch (status) {
            case OrderStatus.PENDING: return <Clock size={16} />;
            case OrderStatus.CONFIRMED: return <CheckCircle2 size={16} />;
            case OrderStatus.SHIPPED: return <Truck size={16} />;
            case OrderStatus.DELIVERED: return <PackageCheck size={16} />;
            case OrderStatus.CANCELLED: return <X size={16} />;
            default: return <AlertCircle size={16} />;
        }
    };

    const handleCancel = (orderId: string) => {
        if(window.confirm("Are you sure you want to cancel this order?")) {
            updateOrderStatus(orderId, OrderStatus.CANCELLED);
            setSelectedOrder(null);
            showToast("Order Cancelled Successfully", "success");
        }
    }

    const handleReturn = () => {
        if (!selectedOrder) return;
        
        if (selectedOrder.status === OrderStatus.SHIPPED) {
            showToast("Order not Delivered yet", "error");
        } else if (selectedOrder.status === OrderStatus.DELIVERED) {
            showToast("Return Request Initiated", "success");
        }
    };

    return (
        <div className="min-h-screen bg-background pb-24">
            <ToastComponent />
            <Navbar />
            <div className="px-4 py-4 max-w-4xl mx-auto">
                <h2 className="text-xl font-bold text-primary mb-4">My Orders</h2>
                <div className="space-y-4">
                    {myOrders.map(order => (
                        <div 
                            key={order.id} 
                            onClick={() => setSelectedOrder(order)}
                            className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 active:scale-[0.99] transition-transform cursor-pointer"
                        >
                            <div className="flex justify-between items-center mb-3 border-b border-gray-50 pb-2">
                                <span className="text-xs font-mono text-gray-500">Order #{order.id.slice(-6).toUpperCase()}</span>
                                <div className="flex items-center gap-1.5">
                                    <div className={`w-2 h-2 rounded-full ${
                                        order.status === OrderStatus.PENDING ? 'bg-yellow-500' : 
                                        order.status === OrderStatus.CONFIRMED ? 'bg-green-500' :
                                        order.status === OrderStatus.SHIPPED ? 'bg-red-500' : 'bg-gray-400'
                                    }`}></div>
                                    <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wide ${getStatusStyle(order.status)}`}>
                                        {order.status}
                                    </span>
                                </div>
                            </div>
                            <div className="space-y-2 mb-4">
                                {/* Show only first item preview */}
                                <div className="flex gap-3">
                                    <div className="w-12 h-12 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                                        <img src={order.items[0].img && order.items[0].img[0]} className="w-full h-full object-cover" alt={order.items[0].name} />
                                    </div>
                                    <div className="flex-grow">
                                        <div className="flex justify-between items-start">
                                            <span className="text-sm font-medium text-gray-800 line-clamp-2">{order.items[0].name}</span>
                                            <span className="text-sm font-semibold text-gray-900">₹{order.items[0].price * order.items[0].qty}</span>
                                        </div>
                                        <span className="text-xs text-gray-500">
                                            {order.items.length > 1 ? `+ ${order.items.length - 1} more items` : `Qty: ${order.items[0].qty}`}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-between items-center text-sm pt-2 border-t border-gray-50">
                                <div className="text-xs text-gray-500">
                                    Placed on {new Date(order.timestamp).toLocaleDateString()}
                                </div>
                                <div className="font-bold text-primary">
                                    Total: ₹{order.totalAmount}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Completely Redesigned Order Detail Modal */}
            <Modal isOpen={!!selectedOrder} onClose={() => setSelectedOrder(null)} title="Order Details">
                {selectedOrder && (
                    <div className="space-y-5 max-h-[75vh] overflow-y-auto pr-1 pb-4">
                        {/* Status Header */}
                        <div className="bg-gray-50 rounded-xl p-4 flex justify-between items-center border border-gray-100">
                             <div>
                                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-1">Status</p>
                                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold w-fit ${getStatusStyle(selectedOrder.status)}`}>
                                    {getStatusIcon(selectedOrder.status)}
                                    {selectedOrder.status}
                                </div>
                             </div>
                             <div className="text-right">
                                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-1">Order ID</p>
                                <p className="font-mono text-sm font-bold text-gray-700">#{selectedOrder.id.slice(-6).toUpperCase()}</p>
                             </div>
                        </div>

                        {/* Items List */}
                        <div>
                            <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-3 flex items-center gap-2">
                                <Package size={14} className="text-gray-400" /> Items in Order
                            </h3>
                            <div className="space-y-3">
                                {selectedOrder.items.map((item, idx) => (
                                    <div key={idx} className="flex gap-4 border border-gray-100 rounded-xl p-3 bg-white shadow-sm">
                                        <div className="w-16 h-16 rounded-lg bg-gray-50 overflow-hidden flex-shrink-0 border border-gray-100">
                                            <img src={item.img[0]} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex-grow flex flex-col justify-between">
                                            <div>
                                                <div className="text-sm font-semibold text-gray-800 line-clamp-2">{item.name}</div>
                                                <div className="text-xs text-gray-500 mt-1">Qty: {item.qty}</div>
                                            </div>
                                            <div className="text-sm font-bold text-primary text-right">₹{item.price * item.qty}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Payment & Total */}
                        <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
                             <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-3 flex items-center gap-2">
                                <CreditCard size={14} className="text-gray-400" /> Payment Details
                            </h3>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between text-gray-600">
                                    <span>Method</span>
                                    <span className="font-medium text-gray-800">{selectedOrder.paymentMethod === 'COD' ? 'Cash on Delivery' : 'Online Payment'}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Delivery Charge</span>
                                    <span className="font-medium text-green-600">
                                        {selectedOrder.deliveryCharge === 0 ? 'Free' : `₹${selectedOrder.deliveryCharge}`}
                                    </span>
                                </div>
                                <div className="border-t border-dashed border-gray-200 my-2 pt-2 flex justify-between items-center">
                                    <span className="font-bold text-gray-800">Total Amount</span>
                                    <span className="font-bold text-lg text-primary">₹{selectedOrder.totalAmount}</span>
                                </div>
                            </div>
                        </div>

                        {/* Shipping Info */}
                        <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
                             <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-3 flex items-center gap-2">
                                <Truck size={14} className="text-gray-400" /> Shipping Details
                            </h3>
                            <div className="flex gap-3 mb-2">
                                <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                                    <MapPin size={16} />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-gray-500">Delivery Address</p>
                                    <p className="text-sm text-gray-800 leading-snug">{selectedOrder.address_details}</p>
                                </div>
                            </div>
                             <div className="flex gap-3 mt-3">
                                <div className="w-8 h-8 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center flex-shrink-0">
                                    <Phone size={16} />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-gray-500">Contact Number</p>
                                    <p className="text-sm text-gray-800 font-mono">{selectedOrder.phone}</p>
                                </div>
                            </div>
                        </div>

                        <div className="pt-2">
                             {/* Cancel Button */}
                            {(selectedOrder.status === OrderStatus.PENDING || selectedOrder.status === OrderStatus.CONFIRMED) && (
                                <Button 
                                    variant="danger" 
                                    fullWidth 
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleCancel(selectedOrder.id);
                                    }}
                                    className="shadow-md"
                                >
                                    Cancel Order
                                </Button>
                            )}
                            
                            {/* Return Button */}
                            {(selectedOrder.status === OrderStatus.SHIPPED || selectedOrder.status === OrderStatus.DELIVERED) && (
                                <Button 
                                    fullWidth 
                                    variant="outline"
                                    onClick={handleReturn}
                                    className="border-gray-300 text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                >
                                    <div className="flex items-center gap-2">
                                        <RotateCcw size={18} />
                                        Return Order
                                    </div>
                                </Button>
                            )}
                        </div>
                    </div>
                )}
            </Modal>

            <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
            <BottomNav />
        </div>
    );
};

// 6. PROFILE & ADMIN (Unchanged)
const Profile = () => {
    const { user, logout, updateProfile } = useAuth();
    const [authOpen, setAuthOpen] = useState(false);
    const [isAddressOpen, setIsAddressOpen] = useState(false);
    const { showToast, ToastComponent } = useToast();
    
    // Address State
    const [editAddress, setEditAddress] = useState('');
    const [editPin, setEditPin] = useState('');
    const [editPhone, setEditPhone] = useState('');

    useEffect(() => {
        if (user) {
            setEditAddress(user.address || '');
            setEditPin(user.pin || '');
            setEditPhone(user.phone || '');
        }
    }, [user]);

    const handleAddressSave = () => {
        if (editPhone.length !== 10) {
            showToast("Phone number must be 10 digits", "error");
            return;
        }
        if (editPin.length !== 6) {
             showToast("Pincode must be 6 digits", "error");
             return;
        }
        updateProfile({ address: editAddress, pin: editPin, phone: editPhone });
        setIsAddressOpen(false);
        showToast("Address Updated Successfully");
    };
    
    if (!user) {
        return (
            <div className="min-h-screen bg-background flex flex-col pb-20">
                 <Navbar />
                 <div className="flex-grow flex flex-col items-center justify-center p-6 text-center -mt-10">
                    <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                        <User size={48} className="text-primary opacity-50" strokeWidth={1.5} />
                    </div>
                    <h2 className="text-xl font-bold text-primary mb-2">Welcome to DeshiKart</h2>
                    <p className="text-gray-500 mb-8 max-w-xs text-sm leading-relaxed">
                        Sign in to view your profile, track orders, and manage your account.
                    </p>
                    {/* Fixed button style - removed colored shadow */}
                    <Button onClick={() => setAuthOpen(true)} className="bg-accent hover:bg-accent/90 shadow-lg shadow-gray-200 text-white px-10">Sign In</Button>
                 </div>
                 <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
                 <BottomNav />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background pb-24">
            <ToastComponent />
            <div className="bg-primary text-white pt-8 pb-12 px-6 rounded-b-[2rem] shadow-lg relative mb-8">
                <div className="flex flex-col items-center text-center">
                    <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-3 text-2xl font-bold shadow-inner">
                        {user.name.charAt(0)}
                    </div>
                    <h1 className="text-xl font-bold">{user.name}</h1>
                    <p className="opacity-80 text-sm">{user.email}</p>
                    <p className="text-xs opacity-60 mt-1">{user.phone || 'No phone added'}</p>
                </div>
            </div>

            <div className="px-4 max-w-md mx-auto space-y-3">
                <div className="bg-white rounded-xl shadow-sm p-2 overflow-hidden">
                    <button onClick={() => window.location.hash = '#/orders'} className="w-full flex items-center gap-3 p-4 hover:bg-gray-50 transition-colors rounded-lg group">
                        <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform"><ClipboardList size={20}/></div>
                        <span className="font-medium text-gray-700 flex-grow text-left">My Orders</span>
                    </button>
                    {user.role === 'ADMIN' && (
                        <button onClick={() => window.location.hash = '#/admin'} className="w-full flex items-center gap-3 p-4 hover:bg-gray-50 transition-colors rounded-lg group">
                            <div className="w-10 h-10 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform"><ShieldCheck size={20}/></div>
                            <span className="font-medium text-gray-700 flex-grow text-left">Admin Panel</span>
                        </button>
                    )}
                    <button onClick={() => setIsAddressOpen(true)} className="w-full flex items-center gap-3 p-4 hover:bg-gray-50 transition-colors rounded-lg group">
                         <div className="w-10 h-10 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center group-hover:scale-110 transition-transform"><Settings size={20}/></div>
                         <span className="font-medium text-gray-700 flex-grow text-left">Edit Address</span>
                    </button>
                    <button onClick={logout} className="w-full flex items-center gap-3 p-4 hover:bg-red-50 transition-colors rounded-lg text-red-600 group">
                        <div className="w-10 h-10 rounded-full bg-red-50 text-red-500 flex items-center justify-center group-hover:scale-110 transition-transform"><LogOut size={20}/></div>
                        <span className="font-medium flex-grow text-left">Logout</span>
                    </button>
                </div>
                
                <div className="text-center text-xs text-gray-400 mt-8">
                    Version 1.0.0
                </div>
            </div>
            
            <Modal isOpen={isAddressOpen} onClose={() => setIsAddressOpen(false)} title="Update Address">
                <div className="space-y-4">
                     <Input label="Phone Number" value={editPhone} onChange={e => setEditPhone(e.target.value)} placeholder="10-digit Mobile" type="tel" maxLength={10} />
                     <Input label="Address" value={editAddress} onChange={e => setEditAddress(e.target.value)} placeholder="Full Address" />
                     <Input label="Pincode" value={editPin} onChange={e => setEditPin(e.target.value)} placeholder="6-digit Pincode" type="tel" maxLength={6} />
                     <Button fullWidth onClick={handleAddressSave}>Save Changes</Button>
                </div>
            </Modal>

            <BottomNav />
        </div>
    );
};

// 7. CHECKOUT (Added Success Modal)
const Checkout = () => {
    const { user, updateProfile } = useAuth();
    const { cart, cartTotal, clearCart } = useCart();
    const { settings, placeOrder } = useData();
    const { showToast, ToastComponent } = useToast();
    
    // Auto-fill if user has data, otherwise empty
    const [address, setAddress] = useState(user?.address || '');
    const [pin, setPin] = useState(user?.pin || '');
    const [phone, setPhone] = useState(user?.phone || '');
    const [paymentMethod, setPaymentMethod] = useState<'COD' | 'ONLINE'>('COD');
    const [utr, setUtr] = useState('');
    const [loading, setLoading] = useState(false);
    const [isSuccessOpen, setIsSuccessOpen] = useState(false);

    if (cart.length === 0 && !isSuccessOpen) {
        window.location.hash = '#/';
        return null;
    }

    const total = cartTotal + settings.payment.deliveryCharge;
    const canCod = settings.payment.codEnabled && cart.every(i => i.cod);

    const handleOrder = async () => {
        // Strict Validation
        if (!phone || phone.length !== 10) {
            showToast("Please enter a valid 10-digit mobile number", "error");
            return;
        }
        if (!address) {
             showToast("Please enter your full address", "error");
             return;
        }
        if (!pin || pin.length !== 6) {
             showToast("Please enter a valid 6-digit pincode", "error");
             return;
        }
        if (paymentMethod === 'ONLINE') {
            if(!utr || utr.length !== 12) {
                showToast("Please enter a valid 12-digit UTR/Reference ID", "error");
                return;
            }
        }

        setLoading(true);
        if (address !== user?.address) updateProfile({ address, pin, phone });

        const order: Order = {
            id: 'ord_' + Math.random().toString(36).substr(2, 9),
            userId: user!.uid,
            userName: user!.name,
            items: cart,
            totalAmount: total,
            deliveryCharge: settings.payment.deliveryCharge,
            status: OrderStatus.PENDING,
            paymentMethod,
            utr: paymentMethod === 'ONLINE' ? utr : undefined,
            timestamp: Date.now(),
            address_details: `${address} - ${pin}`,
            phone
        };

        await placeOrder(order);
        clearCart();
        setIsSuccessOpen(true); // Show success modal
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-32">
            <ToastComponent />
            <div className="bg-white p-4 shadow-sm sticky top-0 z-10 flex items-center gap-3 border-b border-gray-100">
                <button onClick={() => window.location.hash = '#/cart'} className="p-1 hover:bg-gray-50 rounded-full"><ArrowLeft size={24} className="text-gray-700"/></button>
                <h1 className="text-lg font-bold text-gray-800">Checkout</h1>
            </div>

            <div className="p-4 max-w-2xl mx-auto space-y-5 mt-2">
                {/* 1. Address Section */}
                <div className="bg-white p-5 rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-gray-100">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                            <MapPin size={18} />
                        </div>
                        <h2 className="font-bold text-gray-800 text-sm uppercase tracking-wide">Delivery Details</h2>
                    </div>
                    <div className="space-y-4">
                        <Input label="Phone Number" value={phone} onChange={e => setPhone(e.target.value)} placeholder="e.g. 9876543210" type="tel" maxLength={10} />
                        <Input label="Full Address" value={address} onChange={e => setAddress(e.target.value)} placeholder="House No, Street, Area" />
                        <Input label="Pincode" value={pin} onChange={e => setPin(e.target.value)} placeholder="e.g. 110001" maxLength={6} type="number" />
                    </div>
                </div>

                {/* 2. Payment Section */}
                <div className="bg-white p-5 rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-gray-100">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-8 h-8 rounded-full bg-green-50 text-green-600 flex items-center justify-center">
                            <Wallet size={18} />
                        </div>
                        <h2 className="font-bold text-gray-800 text-sm uppercase tracking-wide">Payment Method</h2>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                        {canCod && (
                            <button 
                                onClick={() => setPaymentMethod('COD')}
                                className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all duration-200 text-left ${paymentMethod === 'COD' ? 'border-primary bg-primary/5 shadow-sm' : 'border-gray-100 hover:border-gray-200'}`}
                            >
                                <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${paymentMethod === 'COD' ? 'border-primary' : 'border-gray-300'}`}>
                                    {paymentMethod === 'COD' && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
                                </div>
                                <div>
                                    <div className="font-bold text-gray-800 text-sm">Cash on Delivery</div>
                                    <div className="text-xs text-gray-500">Pay when you receive</div>
                                </div>
                            </button>
                        )}
                        <button 
                            onClick={() => setPaymentMethod('ONLINE')}
                            className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all duration-200 text-left ${paymentMethod === 'ONLINE' ? 'border-primary bg-primary/5 shadow-sm' : 'border-gray-100 hover:border-gray-200'}`}
                        >
                            <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${paymentMethod === 'ONLINE' ? 'border-primary' : 'border-gray-300'}`}>
                                {paymentMethod === 'ONLINE' && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
                            </div>
                            <div>
                                <div className="font-bold text-gray-800 text-sm">Online / UPI</div>
                                <div className="text-xs text-gray-500">Scan QR to pay</div>
                            </div>
                        </button>
                    </div>

                    {paymentMethod === 'ONLINE' && (
                        <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 flex flex-col items-center animate-in fade-in slide-in-from-top-2">
                            <p className="text-sm font-medium text-gray-800 mb-3">Scan QR to pay <span className="text-primary font-bold">₹{total}</span></p>
                            <div className="bg-white p-3 rounded-lg shadow-sm mb-5">
                                <img src={settings.payment.qr_url} className="w-48 h-48 object-contain" alt="Payment QR" />
                            </div>
                            <div className="w-full max-w-xs">
                                <Input label="Transaction ID / UTR" placeholder="Enter 12-digit UTR Number" value={utr} onChange={e => setUtr(e.target.value)} className="text-center tracking-widest" maxLength={12} />
                            </div>
                        </div>
                    )}
                </div>

                {/* 3. Summary Section */}
                <div className="bg-white p-5 rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-gray-100">
                     <div className="flex items-center gap-2 mb-4">
                        <div className="w-8 h-8 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center">
                            <CreditCard size={18} />
                        </div>
                        <h2 className="font-bold text-gray-800 text-sm uppercase tracking-wide">Order Summary</h2>
                    </div>
                    <div className="space-y-2 text-sm text-gray-600 pb-4 border-b border-dashed border-gray-200">
                        <div className="flex justify-between">
                            <span>Item Total</span>
                            <span>₹{cartTotal}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Delivery Charges</span>
                            <span className="text-green-600 font-medium">₹{settings.payment.deliveryCharge}</span>
                        </div>
                    </div>
                     <div className="flex justify-between items-center pt-4">
                        <span className="font-bold text-lg text-gray-800">Total Payable</span>
                        <span className="font-bold text-xl text-primary">₹{total}</span>
                    </div>
                </div>

                <div className="pt-2">
                    <Button fullWidth onClick={handleOrder} loading={loading} variant="primary" className="py-4 text-lg shadow-xl shadow-primary/20">
                        Confirm Order
                    </Button>
                </div>
            </div>

            {/* Success Modal */}
            <Modal isOpen={isSuccessOpen} onClose={() => {}} title="">
                <div className="flex flex-col items-center text-center p-4">
                    <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
                        <CheckCircle2 size={40} strokeWidth={2.5} />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Confirmed!</h2>
                    <p className="text-gray-500 mb-6">Thank you for shopping with DeshiKart. Your order has been placed successfully.</p>
                    <div className="w-full space-y-3">
                        <Button 
                            fullWidth 
                            onClick={() => window.location.hash = '#/orders'}
                        >
                            View Orders
                        </Button>
                        <Button 
                            fullWidth 
                            variant="outline"
                            onClick={() => window.location.hash = '#/'}
                        >
                            Continue Shopping
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

// 8. ADMIN (Unchanged)
const Admin = () => {
    const { user } = useAuth();
    const { products, orders, settings, updateOrderStatus, addProduct, deleteProduct, updateProduct } = useData();
    const { showToast, ToastComponent } = useToast();
    const [tab, setTab] = useState<'dashboard' | 'products' | 'orders'>('dashboard');
    const [newProduct, setNewProduct] = useState<Partial<Product>>({ cat: 'Electronics', cod: true, inStock: true, img: ['https://picsum.photos/400'] });
    const [isAddOpen, setIsAddOpen] = useState(false);

    if (user?.role !== 'ADMIN') {
        window.location.hash = '#/';
        return null;
    }

    const pendingOrders = orders.filter(o => o.status === OrderStatus.PENDING);
    const totalSales = orders.filter(o => o.status !== OrderStatus.CANCELLED).reduce((acc, o) => acc + o.totalAmount, 0);

    const handleAddProduct = () => {
        if (!newProduct.name || !newProduct.price) {
            showToast("Fill required fields", "error");
            return;
        }
        const p: Product = {
            id: 'p_' + Date.now(),
            name: newProduct.name,
            price: Number(newProduct.price),
            cat: newProduct.cat || 'General',
            img: newProduct.img || [],
            desc: newProduct.desc || '',
            cod: !!newProduct.cod,
            inStock: !!newProduct.inStock
        };
        addProduct(p);
        setIsAddOpen(false);
        showToast("Product Added");
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        showToast("Copied to clipboard");
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <ToastComponent />
            <div className="bg-primary text-white p-4 sticky top-0 z-20 flex justify-between items-center shadow-md">
                <div className="flex items-center gap-2">
                    <button onClick={() => window.location.hash = '#/profile'}><X size={20}/></button>
                    <h1 className="font-bold">Admin Panel</h1>
                </div>
                <div className="flex text-xs font-bold gap-2">
                    <button className={`px-3 py-1 rounded-full ${tab === 'dashboard' ? 'bg-accent' : 'bg-white/10'}`} onClick={() => setTab('dashboard')}>Dash</button>
                    <button className={`px-3 py-1 rounded-full ${tab === 'products' ? 'bg-accent' : 'bg-white/10'}`} onClick={() => setTab('products')}>Prod</button>
                    <button className={`px-3 py-1 rounded-full ${tab === 'orders' ? 'bg-accent' : 'bg-white/10'}`} onClick={() => setTab('orders')}>Ord</button>
                </div>
            </div>

            <div className="p-4 max-w-5xl mx-auto">
                {/* DASHBOARD */}
                {tab === 'dashboard' && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-in fade-in">
                        <div className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-blue-500">
                            <h3 className="text-gray-500 text-xs uppercase font-bold">Total Orders</h3>
                            <p className="text-2xl font-bold text-gray-800">{orders.length}</p>
                        </div>
                        <div className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-yellow-500">
                            <h3 className="text-gray-500 text-xs uppercase font-bold">Pending</h3>
                            <p className="text-2xl font-bold text-gray-800">{pendingOrders.length}</p>
                        </div>
                        <div className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-green-500">
                            <h3 className="text-gray-500 text-xs uppercase font-bold">Revenue</h3>
                            <p className="text-2xl font-bold text-gray-800">₹{totalSales.toLocaleString()}</p>
                        </div>
                    </div>
                )}

                {/* PRODUCTS */}
                {tab === 'products' && (
                    <div className="animate-in slide-in-from-right-4">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="font-bold text-gray-700">Manage Products</h2>
                            <button onClick={() => setIsAddOpen(true)} className="bg-primary text-white px-3 py-2 rounded-lg text-sm flex items-center gap-1 hover:bg-primary/90"><Plus size={16}/> Add New</button>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {products.map(p => (
                                <div key={p.id} className="bg-white p-3 rounded-xl shadow-sm flex gap-3">
                                    <img src={p.img && p.img[0]} className="w-16 h-16 rounded object-cover bg-gray-100" />
                                    <div className="flex-grow">
                                        <div className="flex justify-between items-start">
                                            <h4 className="font-bold text-gray-800 text-sm line-clamp-1">{p.name}</h4>
                                            <button onClick={() => {if(confirm('Delete?')) deleteProduct(p.id)}} className="text-red-400"><Trash2 size={16}/></button>
                                        </div>
                                        <p className="text-xs text-gray-500">₹{p.price}</p>
                                        <div className="flex gap-2 mt-2">
                                            <button onClick={() => updateProduct({...p, inStock: !p.inStock})} className={`text-[10px] px-2 py-0.5 rounded border ${p.inStock ? 'border-green-300 text-green-600' : 'border-red-300 text-red-600'}`}>
                                                {p.inStock ? 'In Stock' : 'Out of Stock'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* ORDERS */}
                {tab === 'orders' && (
                    <div className="space-y-4 animate-in slide-in-from-right-4">
                        {orders.length === 0 && <p className="text-center text-gray-400">No orders found</p>}
                        {orders.map(order => (
                            <div key={order.id} className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
                                <div className="bg-gray-50 px-4 py-2 border-b border-gray-100 flex justify-between items-center">
                                    <div className="flex flex-col">
                                        <span className="text-xs font-bold text-gray-600">{order.userName}</span>
                                        <span className="text-[10px] text-gray-400">{new Date(order.timestamp).toLocaleString()}</span>
                                    </div>
                                    <span className={`text-[10px] font-bold px-2 py-1 rounded ${
                                        order.status === 'Pending' ? 'bg-yellow-200 text-yellow-800' :
                                        order.status === 'Confirmed' ? 'bg-green-200 text-green-800' :
                                        order.status === 'Shipped' ? 'bg-red-200 text-red-800' :
                                        order.status === 'Delivered' ? 'bg-blue-200 text-blue-800' : 'bg-gray-200 text-gray-800'
                                    }`}>{order.status}</span>
                                </div>
                                <div className="p-4">
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="text-xs text-gray-600 max-w-[70%]">
                                            <p className="font-semibold flex items-center gap-1">
                                                {order.address_details} 
                                                <button onClick={() => copyToClipboard(order.address_details + "\nPhone: " + order.phone)} className="text-primary"><Copy size={12}/></button>
                                            </p>
                                            <p>Ph: {order.phone}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-primary">₹{order.totalAmount}</p>
                                            <p className="text-[10px] text-gray-500">{order.paymentMethod}</p>
                                            {order.utr && <p className="text-[10px] font-mono bg-gray-100 px-1 rounded">UTR: {order.utr}</p>}
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-1 mb-4 bg-gray-50 p-2 rounded">
                                        {order.items.map(item => (
                                            <div key={item.id} className="flex justify-between text-xs">
                                                <span>{item.name} x {item.qty}</span>
                                                <span className="font-medium">₹{item.price * item.qty}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="flex gap-2 overflow-x-auto">
                                        {order.status === 'Pending' && (
                                            <button onClick={() => updateOrderStatus(order.id, OrderStatus.CONFIRMED)} className="flex-1 bg-green-600 text-white py-2 rounded text-xs font-bold hover:bg-green-700">Confirm</button>
                                        )}
                                        {order.status === 'Confirmed' && (
                                            <button onClick={() => updateOrderStatus(order.id, OrderStatus.SHIPPED)} className="flex-1 bg-red-600 text-white py-2 rounded text-xs font-bold hover:bg-red-700">Ship Order</button>
                                        )}
                                        {order.status === 'Shipped' && (
                                            <button onClick={() => updateOrderStatus(order.id, OrderStatus.DELIVERED)} className="flex-1 bg-blue-600 text-white py-2 rounded text-xs font-bold hover:bg-blue-700">Mark Delivered</button>
                                        )}
                                        {order.status !== 'Cancelled' && order.status !== 'Delivered' && (
                                            <button onClick={() => updateOrderStatus(order.id, OrderStatus.CANCELLED)} className="px-4 border border-red-200 text-red-500 py-2 rounded text-xs font-bold hover:bg-red-50">Cancel</button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Add Product Modal */}
                <Modal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} title="Add Product">
                    <div className="space-y-3">
                        <Input label="Name" value={newProduct.name || ''} onChange={e => setNewProduct({...newProduct, name: e.target.value})} />
                        <Input label="Price" type="number" value={newProduct.price || ''} onChange={e => setNewProduct({...newProduct, price: Number(e.target.value)})} />
                        <Input label="Category" value={newProduct.cat || ''} onChange={e => setNewProduct({...newProduct, cat: e.target.value})} />
                        <Input label="Description" value={newProduct.desc || ''} onChange={e => setNewProduct({...newProduct, desc: e.target.value})} />
                        <label className="flex items-center gap-2">
                            <input type="checkbox" checked={newProduct.cod} onChange={e => setNewProduct({...newProduct, cod: e.target.checked})} />
                            <span className="text-sm">COD Available</span>
                        </label>
                        <Button onClick={handleAddProduct} fullWidth>Add Product</Button>
                    </div>
                </Modal>
            </div>
        </div>
    );
};


// --- ROUTER ---
const Router = () => {
  const [route, setRoute] = useState(window.location.hash || '#/');
  const { showToast, ToastComponent } = useToast();

  // --- GLOBAL NETWORK LISTENER ---
  useEffect(() => {
    const handleOnline = () => showToast("Back Online", "success");
    const handleOffline = () => showToast("No Internet Connection", "error");

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
    }
  }, []);
  
  useEffect(() => {
    const handleHashChange = () => setRoute(window.location.hash || '#/');
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Render Routes
  const renderRoute = () => {
    if (route.startsWith('#/cart')) return <Cart />;
    if (route.startsWith('#/profile')) return <Profile />;
    if (route.startsWith('#/checkout')) return <Checkout />;
    if (route.startsWith('#/admin')) return <Admin />;
    if (route.startsWith('#/product/')) {
        const id = route.split('/')[2]?.split('?')[0]; 
        return <ProductDetail id={id} />;
    }
    if (route.startsWith('#/products')) return <Products />;
    if (route.startsWith('#/orders')) return <Orders />;
    return <Home />;
  }

  return (
    <>
        <ToastComponent /> {/* Global Toast for Network/System Events */}
        {renderRoute()}
    </>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <DataProvider>
        <CartProvider>
           <Router />
        </CartProvider>
      </DataProvider>
    </AuthProvider>
  );
};

export default App;