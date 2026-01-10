import { Product, AppSettings } from '../types';

export const INITIAL_SETTINGS: AppSettings = {
  payment: {
    codEnabled: true,
    deliveryCharge: 50,
    qr_url: "https://picsum.photos/id/20/300/300" // Placeholder QR
  },
  banners: [
    "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=2070&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070&auto=format&fit=crop"
  ],
  categories: ["All", "Groceries", "Electronics", "Fashion"]
};

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: "Organic Basmati Rice",
    price: 299,
    old_price: 399,
    cat: "Groceries",
    img: [
        "https://images.unsplash.com/photo-1586201375761-83865001e31c?q=80&w=2070&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?q=80&w=2000&auto=format&fit=crop"
    ],
    desc: "Premium quality organic basmati rice, aged for 2 years.",
    cod: true,
    inStock: true
  },
  {
    id: 'p2',
    name: "Wireless Earbuds Pro",
    price: 1999,
    old_price: 2999,
    cat: "Electronics",
    img: [
        "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?q=80&w=1932&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1572569028738-411a56103324?q=80&w=2000&auto=format&fit=crop"
    ],
    desc: "Active Noise Cancellation, Transparency mode, and spatial audio.",
    cod: true,
    inStock: true
  },
  {
    id: 'p3',
    name: "Men's Cotton T-Shirt",
    price: 499,
    old_price: 799,
    cat: "Fashion",
    img: [
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=2080&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1581655353564-df123a1eb820?q=80&w=2000&auto=format&fit=crop"
    ],
    desc: "100% Cotton breathable fabric, perfect for summer.",
    cod: true,
    inStock: true
  },
  {
    id: 'p4',
    name: "Smart Watch Series 5",
    price: 4999,
    old_price: 6999,
    cat: "Electronics",
    img: [
        "https://images.unsplash.com/photo-1546868871-7041f2a55e12?q=80&w=1964&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?q=80&w=2000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?q=80&w=2000&auto=format&fit=crop"
    ],
    desc: "Always-On Retina display, ECG app, and fall detection.",
    cod: false,
    inStock: true
  },
  {
    id: 'p5',
    name: "Organic Green Tea",
    price: 199,
    old_price: 299,
    cat: "Groceries",
    img: [
        "https://images.unsplash.com/photo-1556679343-c7306c1976bc?q=80&w=1964&auto=format&fit=crop"
    ],
    desc: "Rich in antioxidants, aids in weight loss.",
    cod: true,
    inStock: true
  },
  {
    id: 'p6',
    name: "Running Shoes",
    price: 1299,
    old_price: 1999,
    cat: "Fashion",
    img: [
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=2070&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1608231387042-66d1773070a5?q=80&w=2000&auto=format&fit=crop"
    ],
    desc: "Lightweight running shoes with extra grip.",
    cod: true,
    inStock: false
  }
];