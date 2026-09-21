import React from 'react';
import { ShoppingBag, Video, Store, Settings, MessageCircle, PlusCircle, Package } from 'lucide-react';
import { StoreSettings } from '../types';

interface NavbarProps {
  activeTab: 'store' | 'videos' | 'admin' | 'orders';
  setActiveTab: (tab: 'store' | 'videos' | 'admin' | 'orders') => void;
  cartCount: number;
  onOpenCart: () => void;
  settings: StoreSettings;
  onOpenAddProduct: () => void;
  ordersCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  cartCount,
  onOpenCart,
  settings,
  onOpenAddProduct,
  ordersCount
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-neutral-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Store Title */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('store')}>
            {settings.logoUrl ? (
              <div className="w-10 h-10 rounded-xl overflow-hidden bg-neutral-900 border border-neutral-200 shadow-sm flex items-center justify-center shrink-0">
                <img src={settings.logoUrl} alt={settings.storeName} className="w-full h-full object-cover" />
              </div>
            ) : (
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-neutral-900 to-emerald-900 flex items-center justify-center text-white font-black text-sm shadow-md shadow-neutral-900/20 shrink-0">
                FSE
              </div>
            )}
            <div>
              <span className="font-bold text-lg text-neutral-900 tracking-tight">{settings.storeName}</span>
              <span className="block text-xs text-neutral-500 font-medium">Online Store & Video Showcase</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1">
            <button
              onClick={() => setActiveTab('store')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2 ${
                activeTab === 'store'
                  ? 'bg-emerald-50 text-emerald-700'
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
              }`}
            >
              <Store className="w-4 h-4" />
              <span>Products Store</span>
            </button>

            <button
              onClick={() => setActiveTab('videos')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2 ${
                activeTab === 'videos'
                  ? 'bg-emerald-50 text-emerald-700'
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
              }`}
            >
              <Video className="w-4 h-4" />
              <span>Video Clips Reels</span>
            </button>

            <button
              onClick={() => setActiveTab('admin')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2 ${
                activeTab === 'admin'
                  ? 'bg-emerald-50 text-emerald-700'
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Manage Store</span>
            </button>

            <button
              onClick={() => setActiveTab('orders')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2 relative ${
                activeTab === 'orders'
                  ? 'bg-emerald-50 text-emerald-700'
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
              }`}
            >
              <Package className="w-4 h-4" />
              <span>Orders</span>
              {ordersCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                  {ordersCount}
                </span>
              )}
            </button>
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center space-x-3">
            <button
              onClick={onOpenAddProduct}
              className="hidden sm:flex items-center space-x-1.5 bg-neutral-900 hover:bg-neutral-800 text-white px-3.5 py-2 rounded-xl text-sm font-medium shadow-sm transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Add Product</span>
            </button>

            <a
              href={`https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent('Hi! I am visiting your store and want to inquire about products.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden lg:flex items-center space-x-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-2 rounded-xl text-sm font-medium shadow-sm transition-all"
              title="Chat on WhatsApp"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp Chat</span>
            </a>

            <button
              onClick={onOpenCart}
              className="relative p-2.5 rounded-xl border border-neutral-200 hover:bg-neutral-100 text-neutral-700 transition-colors"
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-emerald-600 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-xs">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="flex md:hidden items-center justify-around py-2.5 border-t border-neutral-100">
          <button
            onClick={() => setActiveTab('store')}
            className={`flex flex-col items-center space-y-1 text-xs font-medium ${
              activeTab === 'store' ? 'text-emerald-600' : 'text-neutral-500'
            }`}
          >
            <Store className="w-4 h-4" />
            <span>Store</span>
          </button>
          <button
            onClick={() => setActiveTab('videos')}
            className={`flex flex-col items-center space-y-1 text-xs font-medium ${
              activeTab === 'videos' ? 'text-emerald-600' : 'text-neutral-500'
            }`}
          >
            <Video className="w-4 h-4" />
            <span>Videos</span>
          </button>
          <button
            onClick={() => setActiveTab('admin')}
            className={`flex flex-col items-center space-y-1 text-xs font-medium ${
              activeTab === 'admin' ? 'text-emerald-600' : 'text-neutral-500'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Manage</span>
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`flex flex-col items-center space-y-1 text-xs font-medium relative ${
              activeTab === 'orders' ? 'text-emerald-600' : 'text-neutral-500'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Orders</span>
            {ordersCount > 0 && (
              <span className="absolute -top-1 right-2 bg-amber-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                {ordersCount}
              </span>
            )}
          </button>
          <button
            onClick={onOpenAddProduct}
            className="flex flex-col items-center space-y-1 text-xs font-medium text-emerald-600"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Item</span>
          </button>
        </div>
      </div>
    </header>
  );
};
