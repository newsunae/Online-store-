import { Product, StoreSettings } from '../types';

export const initialSettings: StoreSettings = {
  storeName: "Farruk Sahi Electronics",
  currency: "$",
  whatsappNumber: "+1234567890",
  bannerTitle: "Farruk Sahi Electronics - Premium Products & Video Showcase",
  bannerSubtitle: "Shop high-quality electronics with video reviews, minimum 4 product images, and instant WhatsApp ordering!",
  logoUrl: "/logo.jpg"
};

export const sampleGalleryImages = [
  "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1526738549149-8e07eca6c147?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1546938576-6e6a64f317cc?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1563770660941-20978e870e26?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=800&q=80"
];

export const initialProducts: Product[] = [
  {
    id: "prod-1",
    title: "Pro Wireless Noise-Canceling Earbuds",
    description: "Immersive sound, active noise cancellation, 36-hour battery life with charging case, and IPX5 water resistance.",
    price: 79.99,
    category: "Electronics",
    images: [
      "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1526738549149-8e07eca6c147?auto=format&fit=crop&w=800&q=80"
    ],
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    videoTitle: "Unboxing & Sound Test Review",
    stock: 25,
    featured: true,
    createdAt: new Date().toISOString()
  },
  {
    id: "prod-2",
    title: "Ultra-Slim Smart Fitness Watch",
    description: "Track heart rate, blood oxygen, sleep quality, and 100+ workout modes with a vibrant AMOLED touchscreen.",
    price: 129.50,
    category: "Wearables",
    images: [
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=800&q=80"
    ],
    videoUrl: "https://www.youtube.com/embed/kJQP7kiw5Fk",
    videoTitle: "Smartwatch Features Walkthrough",
    stock: 14,
    featured: true,
    createdAt: new Date().toISOString()
  },
  {
    id: "prod-3",
    title: "Minimalist Leather Travel Backpack",
    description: "Crafted from full-grain genuine leather with a padded 16-inch laptop compartment and hidden anti-theft pocket.",
    price: 149.00,
    category: "Fashion",
    images: [
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1546938576-6e6a64f317cc?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80"
    ],
    videoUrl: "https://www.youtube.com/embed/3JZ_D3ELwOQ",
    videoTitle: "Waterproof & Capacity Stress Test",
    stock: 8,
    featured: false,
    createdAt: new Date().toISOString()
  },
  {
    id: "prod-4",
    title: "Portable RGB LED Ambient Light Bar",
    description: "Syncs with music and games. 16 million colors, app control, and customizable dynamic lighting effects.",
    price: 45.99,
    category: "Home & Office",
    images: [
      "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1563770660941-20978e870e26?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=800&q=80"
    ],
    videoUrl: "https://www.youtube.com/embed/L_LUpnjgPso",
    videoTitle: "RGB Setup & Light Show Demo",
    stock: 40,
    featured: true,
    createdAt: new Date().toISOString()
  }
];
