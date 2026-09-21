export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  images: string[];
  videoUrl?: string; // YouTube watch/embed url or direct mp4 url
  videoTitle?: string;
  stock: number;
  featured?: boolean;
  createdAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  paymentMethod: string;
  notes?: string;
  createdAt: string;
  status: 'Pending' | 'Confirmed' | 'Shipped' | 'Completed';
}

export interface StoreSettings {
  storeName: string;
  currency: string;
  whatsappNumber: string;
  bannerTitle: string;
  bannerSubtitle: string;
  logoUrl?: string;
}
