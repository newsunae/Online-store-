import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Storefront } from './components/Storefront';
import { VideoFeed } from './components/VideoFeed';
import { ProductModal } from './components/ProductModal';
import { AddProductModal } from './components/AddProductModal';
import { CartDrawer } from './components/CartDrawer';
import { WhatsAppCheckoutModal } from './components/WhatsAppCheckoutModal';
import { AdminManager } from './components/AdminManager';
import { initialProducts, initialSettings } from './data/initialProducts';
import { Product, CartItem, StoreSettings, Order } from './types';
import { Lock, KeyRound, ShieldCheck, X } from 'lucide-react';

export default function App() {
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('store_products');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* fallback */ }
    }
    return initialProducts;
  });

  const [settings, setSettings] = useState<StoreSettings>(() => {
    const saved = localStorage.getItem('store_settings');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* fallback */ }
    }
    return initialSettings;
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('store_cart');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* fallback */ }
    }
    return [];
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('store_orders');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* fallback */ }
    }
    return [];
  });

  const [activeTab, setActiveTab] = useState<'store' | 'videos' | 'admin' | 'orders'>('store');
  
  // Admin Authentication State (Password: 1561)
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('fse_admin_auth') === 'true';
  });
  const [showAdminLogin, setShowAdminLogin] = useState<boolean>(false);
  const [adminPasswordInput, setAdminPasswordInput] = useState<string>('');
  const [loginError, setLoginError] = useState<string>('');
  const [pendingTabAction, setPendingTabAction] = useState<'admin' | 'orders' | 'add_product' | null>(null);

  // Modals
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWhatsAppCheckoutOpen, setIsWhatsAppCheckoutOpen] = useState(false);
  const [initialVideoId, setInitialVideoId] = useState<string | undefined>(undefined);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('store_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('store_settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('store_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('store_orders', JSON.stringify(orders));
  }, [orders]);

  // Handle protected tab or action access
  const requestAdminAccess = (action: 'admin' | 'orders' | 'add_product') => {
    if (isAdminAuthenticated) {
      executeAdminAction(action);
    } else {
      setPendingTabAction(action);
      setAdminPasswordInput('');
      setLoginError('');
      setShowAdminLogin(true);
    }
  };

  const executeAdminAction = (action: 'admin' | 'orders' | 'add_product') => {
    if (action === 'admin') setActiveTab('admin');
    if (action === 'orders') setActiveTab('orders');
    if (action === 'add_product') {
      setProductToEdit(null);
      setIsAddProductOpen(true);
    }
  };

  const handleAdminLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPasswordInput === '1561') {
      setIsAdminAuthenticated(true);
      sessionStorage.setItem('fse_admin_auth', 'true');
      setShowAdminLogin(false);
      if (pendingTabAction) {
        executeAdminAction(pendingTabAction);
        setPendingTabAction(null);
      }
    } else {
      setLoginError('Incorrect password. Correct admin password is required (1561).');
    }
  };

  // Cart operations
  const handleAddToCart = (product: Product, quantity = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
    setIsCartOpen(true);
  };

  const handleUpdateCartQty = (productId: string, qty: number) => {
    if (qty <= 0) {
      handleRemoveCartItem(productId);
      return;
    }
    setCart(prev => prev.map(item => item.product.id === productId ? { ...item, quantity: qty } : item));
  };

  const handleRemoveCartItem = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  // Product operations
  const handleSaveProduct = (newProd: Product) => {
    setProducts(prev => {
      const exists = prev.some(p => p.id === newProd.id);
      if (exists) {
        return prev.map(p => p.id === newProd.id ? newProd : p);
      }
      return [newProd, ...prev];
    });
  };

  const handleDeleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const handleOpenVideoFeedForProduct = (product: Product) => {
    setInitialVideoId(product.id);
    setActiveTab('videos');
  };

  const handleOrderComplete = (newOrder: Order) => {
    setOrders(prev => [newOrder, ...prev]);
    setCart([]);
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col font-sans selection:bg-emerald-500 selection:text-white">
      <Navbar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          if (tab === 'admin') {
            requestAdminAccess('admin');
          } else if (tab === 'orders') {
            requestAdminAccess('orders');
          } else {
            setActiveTab(tab);
          }
        }}
        cartCount={cart.reduce((s, i) => s + i.quantity, 0)}
        onOpenCart={() => setIsCartOpen(true)}
        settings={settings}
        onOpenAddProduct={() => requestAdminAccess('add_product')}
        ordersCount={orders.length}
      />

      <main className="flex-1">
        {activeTab === 'store' && (
          <Storefront
            products={products}
            settings={settings}
            onSelectProduct={(p) => setSelectedProduct(p)}
            onAddToCart={handleAddToCart}
            onOpenVideoFeed={handleOpenVideoFeedForProduct}
          />
        )}

        {activeTab === 'videos' && (
          <VideoFeed
            products={products}
            settings={settings}
            onAddToCart={handleAddToCart}
            onSelectProduct={(p) => setSelectedProduct(p)}
            initialProductId={initialVideoId}
          />
        )}

        {(activeTab === 'admin' || activeTab === 'orders') && (
          isAdminAuthenticated ? (
            <AdminManager
              settings={settings}
              onUpdateSettings={setSettings}
              products={products}
              onEditProduct={(p) => {
                setProductToEdit(p);
                setIsAddProductOpen(true);
              }}
              onDeleteProduct={handleDeleteProduct}
              onOpenAddModal={() => {
                setProductToEdit(null);
                setIsAddProductOpen(true);
              }}
              orders={orders}
              onUpdateOrderStatus={(id, status) => {
                setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
              }}
              onDeleteOrder={(id) => {
                setOrders(prev => prev.filter(o => o.id !== id));
              }}
            />
          ) : (
            <div className="max-w-md mx-auto my-20 p-8 bg-white rounded-3xl shadow-xl border border-neutral-200 text-center space-y-4">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto">
                <Lock className="w-7 h-7" />
              </div>
              <h2 className="text-xl font-bold text-neutral-900">Admin Authentication Required</h2>
              <p className="text-xs text-neutral-500">Please enter the secure admin password to manage store products, images, and orders.</p>
              <button
                onClick={() => requestAdminAccess(activeTab)}
                className="w-full py-3 bg-neutral-900 hover:bg-emerald-600 text-white font-bold rounded-xl text-sm transition-all shadow-md"
              >
                Enter Admin Password
              </button>
            </div>
          )
        )}
      </main>

      {/* Admin Login Modal (Password: 1561) */}
      {showAdminLogin && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200 space-y-5">
            <div className="flex items-center justify-between border-b border-neutral-200 pb-4">
              <div className="flex items-center space-x-2.5">
                <div className="w-10 h-10 bg-emerald-100 text-emerald-700 rounded-xl flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-neutral-900">Store Owner Login</h3>
                  <p className="text-xs text-neutral-500">Enter password to unlock management</p>
                </div>
              </div>
              <button
                onClick={() => setShowAdminLogin(false)}
                className="p-2 bg-neutral-100 hover:bg-neutral-200 rounded-full text-neutral-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAdminLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-2">
                  Admin Password (PIN)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
                    <KeyRound className="w-4 h-4" />
                  </div>
                  <input
                    type="password"
                    required
                    autoFocus
                    value={adminPasswordInput}
                    onChange={e => setAdminPasswordInput(e.target.value)}
                    placeholder="Enter password (1561)"
                    className="w-full pl-10 pr-4 py-3 bg-neutral-50 border border-neutral-300 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500 tracking-widest"
                  />
                </div>
                {loginError && (
                  <p className="text-xs text-rose-600 font-medium mt-2">{loginError}</p>
                )}
              </div>

              <div className="flex space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAdminLogin(false)}
                  className="flex-1 py-3 border border-neutral-300 text-neutral-700 rounded-xl text-sm font-semibold hover:bg-neutral-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-neutral-900 hover:bg-emerald-600 text-white rounded-xl text-sm font-bold shadow-md transition-all"
                >
                  Unlock Access
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Product Detail Modal */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          settings={settings}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={handleAddToCart}
          onOpenVideoFeed={(p) => {
            setSelectedProduct(null);
            handleOpenVideoFeedForProduct(p);
          }}
        />
      )}

      {/* Add / Edit Product Modal */}
      <AddProductModal
        isOpen={isAddProductOpen}
        onClose={() => {
          setIsAddProductOpen(false);
          setProductToEdit(null);
        }}
        onSaveProduct={handleSaveProduct}
        productToEdit={productToEdit}
      />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQuantity={handleUpdateCartQty}
        onRemoveItem={handleRemoveCartItem}
        settings={settings}
        onProceedCheckout={() => {
          setIsCartOpen(false);
          setIsWhatsAppCheckoutOpen(true);
        }}
      />

      {/* WhatsApp Checkout Modal */}
      <WhatsAppCheckoutModal
        isOpen={isWhatsAppCheckoutOpen}
        onClose={() => setIsWhatsAppCheckoutOpen(false)}
        cart={cart}
        settings={settings}
        onOrderComplete={handleOrderComplete}
      />

      {/* Footer */}
      <footer className="bg-neutral-900 text-neutral-400 py-8 px-4 text-center text-xs border-t border-neutral-800">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} {settings.storeName}. All rights reserved.</p>
          <div className="flex space-x-6">
            <button onClick={() => setActiveTab('store')} className="hover:text-white transition-colors">Store</button>
            <button onClick={() => setActiveTab('videos')} className="hover:text-white transition-colors">Video Clips</button>
            <button onClick={() => requestAdminAccess('admin')} className="hover:text-white transition-colors">Admin Dashboard</button>
          </div>
        </div>
      </footer>
    </div>
  );
}
