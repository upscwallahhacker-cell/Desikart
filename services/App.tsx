import React, { useState, useEffect, useRef } from 'react';
import { AuthProvider, CartProvider, DataProvider, useAuth, useData, useCart } from './store';
import { Navbar, BottomNav, AuthModal } from './Layout';
import { Button, useToast, Input, Modal } from '../UI';
import { Product, OrderStatus, Order } from '../types';
import { Trash2, Plus, Minus, Settings, Package, Grid, Check, X, Copy, Tag, ShoppingBag, LogOut, ShieldCheck, Home as HomeIcon, Smartphone, ShoppingCart as CartIcon, ClipboardList, User, ChevronLeft, ChevronRight, ArrowLeft, Truck, RotateCcw, Headphones, Wallet, CreditCard, MapPin, WifiOff, Wifi, Banknote, CheckCircle2, PackageCheck, AlertCircle, Share2, IndianRupee, Phone, Calendar, Clock, Youtube, Instagram, FileText, Shield, Mail, ArrowRight } from 'lucide-react';

// --- SHARED COMPONENTS ---

const ProductCard: React.FC<{ product: Product; onClick: () => void }> = ({ product, onClick }) => {
  const discount = product.old_price 
    ? Math.round(((product.old_price - product.price) / product.old_price) * 100)
    : 0;

  // Safe image handling to prevent crash
  const imageSrc = product.img && product.img.length > 0 ? product.img[0] : 'https://via.placeholder.com/400x400?text=No+Image';

  return (
    <div 
      onClick={onClick} 
      className="bg-white rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.05)] overflow-hidden flex flex-col cursor-pointer border border-gray-100 group transition-all duration-300 active:scale-[0.98] h-full"
    >
      <div className="relative aspect-square bg-gray-50 overflow-hidden w-full">
        <img 
          src={imageSrc} 
          alt={product.name} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x400?text=No+Image';
          }} 
        />
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
            <div className="flex items-center gap-1.5 bg-green-50 text-green-700 text-[10px] font-bold py-1.5 px-2 rounded-lg w-fit">
              <Banknote size={14} className="flex-shrink-0" />
              <span>Cash on Delivery</span>
            </div>
          ) : (
             <div className="flex items-center gap-1.5 bg-orange-50 text-orange-700 text-[10px] font-bold py-1.5 px-2 rounded-lg w-fit">
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
    if (settings.banners.length > 0) {
      setBannerIndex((prev) => (prev + 1) % settings.banners.length);
    }
  };

  const prevBanner = () => {
    if (settings.banners.length > 0) {
      setBannerIndex((prev) => (prev - 1 + settings.banners.length) % settings.banners.length);
    }
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
      {settings.banners.length > 0 && (
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
      )}

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

// 3. PRODUCT DETAILS PAGE
const ProductDetail = ({ id }: { id: string }) => {
    const { products, settings } = useData(); 
    const { addToCart } = useCart();
    const { user } = useAuth(); 
    const { showToast, ToastComponent } = useToast();
    const [currentImgIndex, setCurrentImgIndex] = useState(0);
    const [authOpen, setAuthOpen] = useState(false); 
    
    // Swipe State
    const [touchStart, setTouchStart] = useState<number | null>(null);
    const [touchEnd, setTouchEnd] = useState<number | null>(null);

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

    const nextImage = () => setCurrentImgIndex((prev) => (prev + 1) % images.length);
    const prevImage = () => setCurrentImgIndex((prev) => (prev - 1 + images.length) % images.length);

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

    const handleShare = async () => {
        // Robust Share Logic
        try {
            if (navigator.share) {
                await navigator.share({
                    title: product.name,
                    text: `Check out ${product.name} on DeshiKart!`,
                    url: window.location.href,
                });
            } else {
                throw new Error("Web Share not supported");
            }
        } catch (err: any) {
            // Fallback to clipboard if share fails (or user cancels, though usually we don't want to copy on cancel, but it's safer for "not working" complaints)
            if (err.name !== 'AbortError') {
                try {
                    await navigator.clipboard.writeText(window.location.href);
                    showToast("Link copied to clipboard!", "success");
                } catch (clipboardErr) {
                    showToast("Failed to share", "error");
                }
            }
        }
    };

    return (
        <div className="min-h-screen bg-white pb-24 animate-in slide-in-from-right duration-300">
            <ToastComponent />
            
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
                    
                    {images.length > 1 && (
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                            {images.map((_, idx) => (
                                <div key={idx} className={`h-1.5 rounded-full transition-all shadow-sm ${idx === currentImgIndex ? 'bg-primary w-4' : 'bg-white/80 w-1.5'}`} />
                            ))}
                        </div>
                    )}
                </div>

                <div className="px-5 py-6 space-y-6">
                    <div>
                        <div className="text-xs font-bold text-accent uppercase tracking-wider mb-2">{product.cat}</div>
                        <h1 className="text-2xl font-bold text-gray-900 leading-tight mb-2">{product.name}</h1>
                        <div className="flex items-baseline gap-3">
                            <span className="text-3xl font-bold text-primary">₹{product.price}</span>
                            {product.old_price && <span className="text-lg text-gray-400 line-through">₹{product.old_price}</span>}
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                         <div className={`flex items-center gap-2 text-xs font-bold px-3 py-2 rounded-lg border w-fit ${product.inStock ? 'border-green-200 bg-green-50 text-green-700' : 'border-red-200 bg-red-50 text-red-700'}`}>
                            {product.inStock ? <CheckCircle2 size={16}/> : <X size={16}/>}
                            {product.inStock ? 'In Stock & Ready to Ship' : 'Currently Out of Stock'}
                         </div>
                         
                         <div className={`flex items-center gap-2 text-xs font-bold px-3 py-2 rounded-lg border w-fit ${product.cod ? 'border-blue-200 bg-blue-50 text-blue-800' : 'border-orange-200 bg-orange-50 text-orange-800'}`}>
                            {product.cod ? <Banknote size={16}/> : <CreditCard size={16}/>}
                            {product.cod ? 'Cash on Delivery Available' : 'Online Payment Only'}
                         </div>

                         <div className="flex items-center gap-2 text-xs font-bold px-3 py-2 rounded-lg border w-fit border-purple-200 bg-purple-50 text-purple-800">
                            <IndianRupee size={16}/>
                            {settings.payment.deliveryCharge > 0 
                                ? `Delivery Charges: ₹${settings.payment.deliveryCharge}` 
                                : 'Free Delivery'}
                         </div>
                    </div>

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
                            <span className="text-[10px] font-medium text-gray-600">
                                {product.returnPeriod !== undefined ? `${product.returnPeriod} Days Return` : '7 Days Return'}
                            </span>
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

// 4. CART
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

// 5. ORDERS
const Orders = () => {
    const { user } = useAuth();
    const { orders, refreshOrders, updateOrderStatus } = useData();
    const { showToast, ToastComponent } = useToast();
    const [authOpen, setAuthOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(false);
    const [showRefundModal, setShowRefundModal] = useState(false);
    const [refundUpi, setRefundUpi] = useState('');
    const [actionType, setActionType] = useState<'cancel' | 'return'>('cancel');
    
    useEffect(() => {
        refreshOrders();
    }, []);

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

    const myOrders = orders.filter(o => o.userId === user.uid);

    if (myOrders.length === 0) {
        return renderEmptyState(
            "No Orders Yet", 
            "When you place orders, they will appear here. Start shopping to place your first order!",
            () => window.location.hash = '#/',
            "Start Shopping",
            ClipboardList
        );
    }

    const getStatusStyle = (status: OrderStatus) => {
        switch (status) {
            case OrderStatus.PENDING: return 'bg-yellow-50 text-yellow-700';
            case OrderStatus.CONFIRMED: return 'bg-green-50 text-green-700';
            case OrderStatus.SHIPPED: return 'bg-red-50 text-red-700';
            case OrderStatus.DELIVERED: return 'bg-blue-50 text-blue-700';
            case OrderStatus.CANCELLED: return 'bg-gray-100 text-gray-500';
            case OrderStatus.RETURNED: return 'bg-purple-100 text-purple-700';
            case OrderStatus.RETURN_REQUESTED: return 'bg-orange-100 text-orange-700';
            case OrderStatus.REFUNDED: return 'bg-teal-100 text-teal-700';
            default: return 'bg-gray-100 text-gray-600';
        }
    };

    const getStatusIcon = (status: OrderStatus) => {
        switch (status) {
            case OrderStatus.PENDING: return <Clock size={16} />;
            case OrderStatus.CONFIRMED: return <CheckCircle2 size={16} />;
            case OrderStatus.SHIPPED: return <Truck size={16} />;
            case OrderStatus.DELIVERED: return <PackageCheck size={16} />;
            case OrderStatus.CANCELLED: return <X size={16} />;
            case OrderStatus.RETURNED: return <RotateCcw size={16} />;
            case OrderStatus.RETURN_REQUESTED: return <RotateCcw size={16} />;
            case OrderStatus.REFUNDED: return <CheckCircle2 size={16} />;
            default: return <AlertCircle size={16} />;
        }
    };
    
    const getStatusText = (status: OrderStatus) => {
         if (status === OrderStatus.RETURN_REQUESTED) return "Refund Pending";
         if (status === OrderStatus.REFUNDED) return "Refund Complete ✅";
         return status;
    };

    // --- RETURN LOGIC ---
    // Calculate if return window is open based on deliveredAt or fallback to timestamp
    // Return period is based on the first item in the order (assuming mostly uniform policy or taking min)
    const isReturnWindowOpen = (order: Order) => {
        const returnDays = order.items[0].returnPeriod !== undefined ? order.items[0].returnPeriod : 7;
        const deliveryTime = order.deliveredAt || order.timestamp; // Fallback to order time if delivery not set (for demo)
        const deadline = deliveryTime + (returnDays * 24 * 60 * 60 * 1000);
        return Date.now() < deadline;
    };

    // NEW Helper
    const getRemainingDays = (order: Order) => {
        const returnDays = order.items[0].returnPeriod !== undefined ? order.items[0].returnPeriod : 7;
        const deliveryTime = order.deliveredAt || order.timestamp;
        const deadline = deliveryTime + (returnDays * 24 * 60 * 60 * 1000);
        const diff = deadline - Date.now();
        return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
    };

    const handleActionClick = (type: 'cancel' | 'return') => {
        if (!selectedOrder) return;
        
        if (type === 'return') {
             if (selectedOrder.status !== OrderStatus.DELIVERED) {
                 showToast("Wait for delivery to return order", "error");
                 return;
             }
             if (!isReturnWindowOpen(selectedOrder)) {
                 showToast("Return period has expired", "error");
                 return;
             }
        }

        setActionType(type);

        if (selectedOrder.paymentMethod === 'ONLINE') {
             setRefundUpi('');
             setShowRefundModal(true);
        } else {
            processStatusUpdate(type === 'cancel' ? OrderStatus.CANCELLED : OrderStatus.RETURN_REQUESTED);
        }
    };

    const submitRefund = async () => {
        if (!refundUpi || refundUpi.length < 3) {
            showToast("Please enter a valid UPI ID", "error");
            return;
        }
        await processStatusUpdate(actionType === 'cancel' ? OrderStatus.CANCELLED : OrderStatus.RETURN_REQUESTED, refundUpi);
        setShowRefundModal(false);
    };

    const processStatusUpdate = async (newStatus: OrderStatus, refundUpiString?: string) => {
         if (!selectedOrder) return;
         setLoading(true);
         try {
             await updateOrderStatus(selectedOrder.id, newStatus, refundUpiString);
             setSelectedOrder(null);
             showToast(newStatus === OrderStatus.CANCELLED ? "Order Cancelled" : "Return Requested", "success");
         } catch (err) {
             showToast("Failed to update order", "error");
         } finally {
             setLoading(false);
         }
    };

    // Helper to render timeline steps
    const renderTimeline = (order: Order) => {
        const steps = [
            { status: OrderStatus.PENDING, label: 'Ordered', icon: ClipboardList },
            { status: OrderStatus.SHIPPED, label: 'Shipped', icon: Truck },
            { status: OrderStatus.DELIVERED, label: 'Delivered', icon: PackageCheck },
        ];
        
        // Simple logic: if Delivered, all previous are done. If Shipped, Ordered is done.
        const isCompleted = (stepStatus: OrderStatus) => {
            if (order.status === stepStatus) return true;
            if (order.status === OrderStatus.DELIVERED) return true;
            if (order.status === OrderStatus.SHIPPED && stepStatus === OrderStatus.PENDING) return true;
            return false;
        };

        if (order.status === OrderStatus.CANCELLED || order.status === OrderStatus.RETURNED || order.status === OrderStatus.REFUNDED) {
            return (
                <div className={`p-3 rounded-lg flex items-center gap-3 ${getStatusStyle(order.status)}`}>
                    {getStatusIcon(order.status)}
                    <span className="font-bold">{getStatusText(order.status)}</span>
                </div>
            )
        }

        return (
            <div className="flex justify-between items-center relative my-6 px-2">
                {/* Connecting Line */}
                <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-gray-200 -z-10" />
                
                {steps.map((step, index) => {
                    const completed = isCompleted(step.status);
                    return (
                        <div key={index} className="flex flex-col items-center bg-white px-2">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${completed ? 'bg-green-500 border-green-500 text-white' : 'bg-white border-gray-300 text-gray-400'}`}>
                                <step.icon size={14} />
                            </div>
                            <span className={`text-[10px] font-bold mt-1 ${completed ? 'text-green-600' : 'text-gray-400'}`}>{step.label}</span>
                        </div>
                    );
                })}
            </div>
        );
    }

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
                                    <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wide flex items-center gap-1 ${getStatusStyle(order.status)}`}>
                                        {getStatusIcon(order.status)}
                                        {getStatusText(order.status)}
                                    </span>
                                </div>
                            </div>
                            <div className="space-y-2 mb-4">
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

            {/* Order Detail Modal - COMPACT VERSION */}
            <Modal isOpen={!!selectedOrder} onClose={() => setSelectedOrder(null)} title="Order Details">
                {selectedOrder && (
                    <div className="space-y-3 max-h-[75vh] overflow-y-auto pr-1 pb-4">
                        
                        {/* Status Timeline */}
                        {renderTimeline(selectedOrder)}

                        {/* Order Info Card - Compact */}
                        <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                             <div className="flex justify-between items-center mb-2">
                                <span className="text-xs text-gray-500">Order ID</span>
                                <span className="font-mono text-sm font-bold text-gray-700">#{selectedOrder.id.slice(-6).toUpperCase()}</span>
                             </div>
                             
                             {selectedOrder.expectedDeliveryDate && selectedOrder.status !== OrderStatus.DELIVERED && (
                                <div className="flex justify-between items-center bg-white p-2 rounded-lg border border-blue-100 shadow-sm">
                                    <span className="text-xs font-bold text-blue-700 flex items-center gap-1"><Truck size={14}/> Expected</span>
                                    <span className="text-sm font-bold text-gray-800">{new Date(selectedOrder.expectedDeliveryDate).toLocaleDateString()}</span>
                                </div>
                             )}

                             {selectedOrder.status === OrderStatus.DELIVERED && (
                                <div className="flex justify-between items-center bg-white p-2 rounded-lg border border-green-100 shadow-sm">
                                    <span className="text-xs font-bold text-green-700 flex items-center gap-1"><CheckCircle2 size={14}/> Delivered</span>
                                    <span className="text-sm font-bold text-gray-800">
                                        {selectedOrder.deliveredAt ? new Date(selectedOrder.deliveredAt).toLocaleDateString() : 'Recently'}
                                    </span>
                                </div>
                             )}
                        </div>

                        {/* Items List - Compact */}
                        <div>
                            <h3 className="text-[10px] font-bold text-gray-900 uppercase tracking-wider mb-2 flex items-center gap-2">
                                <Package size={12} className="text-gray-400" /> Items
                            </h3>
                            <div className="space-y-2">
                                {selectedOrder.items.map((item, idx) => (
                                    <div key={idx} className="flex gap-3 border border-gray-100 rounded-lg p-2 bg-white shadow-sm">
                                        <div className="w-12 h-12 rounded-lg bg-gray-50 overflow-hidden flex-shrink-0 border border-gray-100">
                                            <img src={item.img[0]} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex-grow flex flex-col justify-between">
                                            <div>
                                                <div className="text-sm font-semibold text-gray-800 line-clamp-1">{item.name}</div>
                                                <div className="text-[10px] text-gray-500">Qty: {item.qty}</div>
                                            </div>
                                            <div className="text-sm font-bold text-primary text-right">₹{item.price * item.qty}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Payment & Total - Compact */}
                        <div className="bg-white border border-gray-100 rounded-xl p-3 shadow-sm">
                             <h3 className="text-[10px] font-bold text-gray-900 uppercase tracking-wider mb-2 flex items-center gap-2">
                                <CreditCard size={12} className="text-gray-400" /> Payment
                            </h3>
                            <div className="space-y-1 text-sm">
                                <div className="flex justify-between text-gray-600">
                                    <span className="text-xs">Method</span>
                                    <span className="font-medium text-gray-800 text-xs">{selectedOrder.paymentMethod === 'COD' ? 'Cash on Delivery' : 'Online Payment'}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span className="text-xs">Delivery</span>
                                    <span className="font-medium text-green-600 text-xs">
                                        {selectedOrder.deliveryCharge === 0 ? 'Free' : `₹${selectedOrder.deliveryCharge}`}
                                    </span>
                                </div>
                                <div className="border-t border-dashed border-gray-200 my-2 pt-2 flex justify-between items-center">
                                    <span className="font-bold text-gray-800 text-xs">Total</span>
                                    <span className="font-bold text-lg text-primary">₹{selectedOrder.totalAmount}</span>
                                </div>
                                {selectedOrder.refundUpi && (
                                    <div className="mt-2 p-2 bg-purple-50 rounded border border-purple-100 text-xs">
                                        <span className="font-bold text-purple-700">Refund UPI:</span> {selectedOrder.refundUpi}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Shipping Info - Compact */}
                        <div className="bg-white border border-gray-100 rounded-xl p-3 shadow-sm">
                             <h3 className="text-[10px] font-bold text-gray-900 uppercase tracking-wider mb-2 flex items-center gap-2">
                                <Truck size={12} className="text-gray-400" /> Address
                            </h3>
                            <div className="flex gap-3">
                                <div className="w-6 h-6 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                                    <MapPin size={12} />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-800 leading-snug">{selectedOrder.address_details}</p>
                                </div>
                            </div>
                        </div>

                        <div className="pt-1">
                             {/* Cancel Button - Visible if Pending/Confirmed */}
                            {(selectedOrder.status === OrderStatus.PENDING || selectedOrder.status === OrderStatus.CONFIRMED) && (
                                <Button 
                                    variant="danger" 
                                    fullWidth 
                                    onClick={() => handleActionClick('cancel')}
                                    loading={loading}
                                    className="shadow-md py-2"
                                >
                                    Cancel Order
                                </Button>
                            )}
                            
                            {/* Return Button - Logic based on Return Days */}
                            {selectedOrder.status === OrderStatus.DELIVERED && isReturnWindowOpen(selectedOrder) && (
                                <div className="space-y-2 pt-1">
                                    <div className="flex justify-center">
                                        <div className="text-[10px] font-bold text-orange-600 bg-orange-50 px-3 py-1 rounded-full border border-orange-100 flex items-center gap-1">
                                            <Clock size={12} />
                                            {getRemainingDays(selectedOrder)} days left to return
                                        </div>
                                    </div>
                                    <Button 
                                        fullWidth 
                                        variant="outline"
                                        onClick={() => handleActionClick('return')}
                                        className="border-gray-300 text-gray-600 hover:bg-gray-50 hover:text-gray-900 py-2"
                                    >
                                        <div className="flex items-center gap-2">
                                            <RotateCcw size={16} />
                                            Return Order
                                        </div>
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </Modal>
            
            {/* Refund UPI Modal */}
            <Modal isOpen={showRefundModal} onClose={() => setShowRefundModal(false)} title="Refund Details">
                <div className="space-y-4">
                    <div className="bg-blue-50 text-blue-800 p-3 rounded-lg text-sm">
                        Since you paid online, please provide your UPI ID for the refund.
                    </div>
                    <Input 
                        label="UPI ID / VPA" 
                        placeholder="e.g. mobile@upi" 
                        value={refundUpi} 
                        onChange={e => setRefundUpi(e.target.value)} 
                    />
                    <Button fullWidth onClick={submitRefund} loading={loading}>
                        Submit & {actionType === 'cancel' ? 'Cancel Order' : 'Return Order'}
                    </Button>
                </div>
            </Modal>

            <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
            <BottomNav />
        </div>
    );
};

// 6. PROFILE (Redesigned for Professional Look)
const Profile = () => {
    const { user, logout, updateProfile } = useAuth();
    const { settings } = useData();
    const [authOpen, setAuthOpen] = useState(false);
    const [isAddressOpen, setIsAddressOpen] = useState(false);
    const { showToast, ToastComponent } = useToast();
    const [policyModal, setPolicyModal] = useState<'privacy' | 'refund' | null>(null);
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

    const handleAddressSave = async () => {
        if (editPhone.length !== 10) {
            showToast("Phone number must be 10 digits", "error");
            return;
        }
        await updateProfile({ address: editAddress, pin: editPin, phone: editPhone });
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
                    <Button onClick={() => setAuthOpen(true)} className="bg-accent hover:bg-accent/90 shadow-lg shadow-gray-200 text-white px-10">Sign In</Button>
                 </div>
                 <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
                 <BottomNav />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-24">
            <ToastComponent />
            
            {/* Header */}
            <div className="bg-gradient-to-b from-primary to-[#0f3457] text-white pt-10 pb-16 px-6 rounded-b-[3rem] shadow-xl relative">
                <div className="flex flex-col items-center text-center">
                    <div className="w-24 h-24 bg-white p-1 rounded-full shadow-2xl mb-4 border-4 border-white/10">
                         <div className="w-full h-full bg-gray-100 rounded-full flex items-center justify-center text-4xl font-bold text-primary">
                            {user.name.charAt(0)}
                         </div>
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight">{user.name}</h1>
                    <p className="opacity-80 text-sm mt-1">{user.email}</p>
                    <div className="mt-3 flex items-center gap-2 text-xs bg-white/10 px-3 py-1 rounded-full backdrop-blur-sm border border-white/20">
                        <Phone size={12} />
                        {user.phone || 'Add Phone Number'}
                    </div>
                </div>
            </div>

            <div className="px-4 max-w-lg mx-auto -mt-8 relative z-10 space-y-6">
                
                {/* Account Section */}
                <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.05)] p-2">
                    <h3 className="px-4 pt-4 pb-2 text-xs font-bold text-gray-400 uppercase tracking-widest">My Account</h3>
                    <div className="grid grid-cols-1 divide-y divide-gray-50">
                        <button onClick={() => window.location.hash = '#/orders'} className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors text-left">
                            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center"><ClipboardList size={20}/></div>
                            <div className="flex-grow">
                                <div className="font-semibold text-gray-800">My Orders</div>
                                <div className="text-xs text-gray-400">Track current & past orders</div>
                            </div>
                            <ChevronRight size={18} className="text-gray-300" />
                        </button>
                        <button onClick={() => setIsAddressOpen(true)} className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors text-left">
                             <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center"><MapPin size={20}/></div>
                             <div className="flex-grow">
                                <div className="font-semibold text-gray-800">Delivery Address</div>
                                <div className="text-xs text-gray-400">Manage shipping details</div>
                             </div>
                             <ChevronRight size={18} className="text-gray-300" />
                        </button>
                    </div>
                </div>

                {/* Support & Legal */}
                <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.05)] p-4">
                     <h3 className="mb-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Support & Legal</h3>
                     
                     {/* Socials Row */}
                     <div className="flex gap-3 mb-6">
                        {settings.social_links?.instagram && (
                            <a href={settings.social_links.instagram} target="_blank" rel="noreferrer" className="flex-1 flex items-center justify-center gap-2 p-3 rounded-xl bg-pink-50 text-pink-700 hover:bg-pink-100 transition-colors border border-pink-100">
                                <Instagram size={18} />
                                <span className="text-xs font-bold">Instagram</span>
                            </a>
                        )}
                        {settings.social_links?.youtube && (
                            <a href={settings.social_links.youtube} target="_blank" rel="noreferrer" className="flex-1 flex items-center justify-center gap-2 p-3 rounded-xl bg-red-50 text-red-700 hover:bg-red-100 transition-colors border border-red-100">
                                <Youtube size={18} />
                                <span className="text-xs font-bold">YouTube</span>
                            </a>
                        )}
                     </div>

                     {/* Policy Links */}
                     <div className="space-y-3">
                        <button onClick={() => setPolicyModal('privacy')} className="w-full flex justify-between items-center text-sm font-medium text-gray-600 hover:text-primary p-2 rounded-lg hover:bg-gray-50">
                            <span className="flex items-center gap-2"><Shield size={16}/> Privacy Policy</span>
                            <ArrowRight size={14} className="opacity-50" />
                        </button>
                        <button onClick={() => setPolicyModal('refund')} className="w-full flex justify-between items-center text-sm font-medium text-gray-600 hover:text-primary p-2 rounded-lg hover:bg-gray-50">
                            <span className="flex items-center gap-2"><FileText size={16}/> Refund Policy</span>
                            <ArrowRight size={14} className="opacity-50" />
                        </button>
                     </div>

                     {/* Contact Email Box */}
                     <div className="mt-6 bg-gray-50 rounded-xl p-3 flex items-center gap-3 border border-gray-100">
                         <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm text-gray-600">
                             <Mail size={16} />
                         </div>
                         <div>
                             <div className="text-[10px] font-bold text-gray-400 uppercase">Support Email</div>
                             <div className="text-xs font-semibold text-gray-800">DeshiKartsupport@gmail.com</div>
                         </div>
                     </div>
                </div>

                <button onClick={logout} className="w-full bg-white rounded-xl shadow-sm p-4 text-red-500 font-bold flex items-center justify-center gap-2 hover:bg-red-50 transition-colors">
                    <LogOut size={18}/>
                    Log Out
                </button>
                
                <div className="text-center text-[10px] text-gray-300 pb-4">
                    App Version 1.2.0
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

            {/* Privacy Policy Modal */}
            <Modal isOpen={policyModal === 'privacy'} onClose={() => setPolicyModal(null)} title="Privacy Policy">
                <div className="max-h-[60vh] overflow-y-auto p-1 text-sm text-gray-600 leading-relaxed space-y-4">
                    <p>
                        {settings.privacyPolicy || "Loading policy..."}
                    </p>
                </div>
                <div className="mt-4">
                    <Button fullWidth onClick={() => setPolicyModal(null)} variant="outline">Close</Button>
                </div>
            </Modal>

            {/* Refund Policy Modal */}
            <Modal isOpen={policyModal === 'refund'} onClose={() => setPolicyModal(null)} title="Refund Policy">
                <div className="max-h-[60vh] overflow-y-auto p-1 text-sm text-gray-600 leading-relaxed space-y-4">
                    <p>
                        {settings.refundPolicy || "Loading policy..."}
                    </p>
                    <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 mt-4">
                        <p className="font-semibold text-blue-800 mb-1">Contact Support:</p>
                        <p>Instagram DM</p>
                        <p>Email: DeshiKartsupport@gmail.com</p>
                    </div>
                </div>
                <div className="mt-4">
                    <Button fullWidth onClick={() => setPolicyModal(null)} variant="outline">Close</Button>
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
        try {
            if (address !== user?.address) await updateProfile({ address, pin, phone });

            // Create Order Object (spread UTR conditionally to avoid undefined)
            const order: Order = {
                id: 'ord_' + Math.random().toString(36).substr(2, 9),
                userId: user!.uid,
                userName: user!.name,
                items: cart,
                totalAmount: total,
                deliveryCharge: settings.payment.deliveryCharge,
                status: OrderStatus.PENDING,
                paymentMethod,
                timestamp: Date.now(),
                address_details: `${address} - ${pin}`,
                phone,
                ...(paymentMethod === 'ONLINE' ? { utr } : {})
            };

            await placeOrder(order);
            clearCart();
            setIsSuccessOpen(true); // Show success modal
        } catch (error: any) {
            console.error("Order Error:", error);
            showToast(error.message || "Failed to place order. Please try again.", "error");
        } finally {
            setLoading(false);
        }
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