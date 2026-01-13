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
  categories: ["All", "Groceries", "Electronics", "Fashion"],
  social_links: {
    youtube: "https://youtube.com",
    instagram: "https://instagram.com"
  },
  privacyPolicy: "Hum aapka sirf wahi data use karte hain jo delivery ke liye zaroori hai (Naam, Pata, Phone). Hum aapka data kisi ko sell nahi karte aur ise poori tarah secure rakhte hain.",
  refundPolicy: "Refund order return complete hone ke 24hr ke ander ho jayega. Agar koi bhi samasya ho to kripya support team se sampark karein."
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
    inStock: true,
    returnPeriod: 2 // 2 Days return
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
    inStock: true,
    returnPeriod: 7
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
    inStock: true,
    returnPeriod: 15
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
    inStock: true,
    returnPeriod: 7
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
    inStock: true,
    returnPeriod: 0 // No return
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
    inStock: false,
    returnPeriod: 7
  },
  {
    id: 'p7',
    name: "Gaming Laptop 15.6\"",
    price: 64999,
    old_price: 74999,
    cat: "Electronics",
    img: [
        "https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&w=800&q=80"
    ],
    desc: "High-performance gaming laptop with dedicated graphics and 144Hz display.",
    cod: false,
    inStock: true,
    returnPeriod: 7
  },
  {
    id: 'p8',
    name: "Vintage Denim Jacket",
    price: 1499,
    old_price: 2499,
    cat: "Fashion",
    img: [
        "https://images.unsplash.com/photo-1551537482-f2075a1d41f2?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1576871337622-98d48d1cf531?auto=format&fit=crop&w=800&q=80"
    ],
    desc: "Classic fit blue denim jacket, suitable for all seasons.",
    cod: true,
    inStock: true,
    returnPeriod: 7
  },
  {
    id: 'p9',
    name: "RGB Mechanical Keyboard",
    price: 3499,
    old_price: 4999,
    cat: "Electronics",
    img: [
        "https://images.unsplash.com/photo-1587829741301-dc798b91a603?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=800&q=80"
    ],
    desc: "Mechanical switches with customizable RGB lighting.",
    cod: true,
    inStock: true,
    returnPeriod: 7
  },
  {
    id: 'p10',
    name: "Fresh Almond Milk (1L)",
    price: 249,
    old_price: 300,
    cat: "Groceries",
    img: [
        "https://images.unsplash.com/photo-1600718374662-0483d2b9da44?auto=format&fit=crop&w=800&q=80"
    ],
    desc: "Unsweetened, dairy-free almond milk. Perfect for vegans.",
    cod: true,
    inStock: true
  },
  {
    id: 'p11',
    name: "Organic Pure Honey 500g",
    price: 450,
    old_price: 600,
    cat: "Groceries",
    img: [
        "https://images.unsplash.com/photo-1587049359681-3676a82e35d6?auto=format&fit=crop&w=800&q=80"
    ],
    desc: "100% pure organic honey, sourced from the Himalayas.",
    cod: true,
    inStock: true
  },
  {
    id: 'p12',
    name: "Aviator Sunglasses",
    price: 999,
    old_price: 1999,
    cat: "Fashion",
    img: [
        "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=800&q=80"
    ],
    desc: "Classic aviator style sunglasses with UV protection.",
    cod: true,
    inStock: true
  },
  {
    id: 'p13',
    name: "DSLR Camera Kit",
    price: 45000,
    old_price: 52000,
    cat: "Electronics",
    img: [
        "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?auto=format&fit=crop&w=800&q=80"
    ],
    desc: "Professional DSLR with 18-55mm lens kit, perfect for beginners and enthusiasts.",
    cod: false,
    inStock: true
  },
  {
    id: 'p14',
    name: "Genuine Leather Belt",
    price: 899,
    old_price: 1499,
    cat: "Fashion",
    img: [
        "https://images.unsplash.com/photo-1624222247344-550fb60583dc?auto=format&fit=crop&w=800&q=80"
    ],
    desc: "Handcrafted genuine leather belt with durable metal buckle.",
    cod: true,
    inStock: true
  },
  {
    id: 'p15',
    name: "Extra Virgin Olive Oil (500ml)",
    price: 650,
    old_price: 800,
    cat: "Groceries",
    img: [
        "https://images.unsplash.com/photo-1474979266404-7cadd259d3cf?auto=format&fit=crop&w=800&q=80"
    ],
    desc: "Cold pressed extra virgin olive oil, imported from Spain.",
    cod: true,
    inStock: true
  },
  {
    id: 'p16',
    name: "Portable Bluetooth Speaker",
    price: 1499,
    old_price: 2499,
    cat: "Electronics",
    img: [
        "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=800&q=80"
    ],
    desc: "Waterproof portable speaker with 12-hour battery life and deep bass.",
    cod: true,
    inStock: true
  },
  {
    id: 'p17',
    name: "Premium Dark Chocolate (85%)",
    price: 350,
    old_price: 450,
    cat: "Groceries",
    img: [
        "https://images.unsplash.com/photo-1548907040-4baa42d10919?auto=format&fit=crop&w=800&q=80"
    ],
    desc: "Intense dark chocolate with 85% cocoa, rich in antioxidants.",
    cod: true,
    inStock: true
  },
  {
    id: 'p18',
    name: "Slim Leather Wallet",
    price: 799,
    old_price: 1299,
    cat: "Fashion",
    img: [
        "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=800&q=80"
    ],
    desc: "Minimalist genuine leather wallet with RFID protection.",
    cod: true,
    inStock: true
  }
];