import React, { useState, useMemo } from 'react';
import { Search, Share2, Video, ShoppingCart, Eye, MessageCircle, Check, Sparkles, Filter } from 'lucide-react';
import { Product, StoreSettings } from '../types';
import { shareProduct, shareToWhatsApp } from '../utils/shareUtils';

interface StorefrontProps {
  products: Product[];
  settings: StoreSettings;
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onOpenVideoFeed: (product: Product) => void;
}

export const Storefront: React.FC<StorefrontProps> = ({
  products,
  settings,
  onSelectProduct,
  onAddToCart,
  onOpenVideoFeed,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Extract unique categories
  const categories = useMemo(() => {
    const cats = products.map(p => p.category);
    return ['All', ...Array.from(new Set(cats))];
  }, [products]);

  // Filtered products
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            p.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchQuery, selectedCategory]);

  const handleCopyLink = (product: Product) => {
    const text = `${product.title} - ${settings.currency}${product.price.toFixed(2)} | Check it out at ${settings.storeName}!`;
    navigator.clipboard.writeText(text);
    setCopiedId(product.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="min-h-screen bg-neutral-50 pb-20">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-[#2A2421] via-[#4A3D36] to-[#735A4B] text-white py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden shadow-xl">
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:20px_20px]" />
        <div className="absolute -right-20 -top-20 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="max-w-7xl mx-auto relative z-10 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-8">
          <div className="max-w-2xl">
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-amber-500/20 to-emerald-500/20 border border-amber-400/30 text-amber-200 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-4 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>NS General Trading • Luxury Showcase</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-4 font-serif text-[#FAF7F2]">
              {settings.bannerTitle}
            </h1>
            <p className="text-stone-200 text-base sm:text-lg mb-6 leading-relaxed font-light">
              {settings.bannerSubtitle}
            </p>
            <div className="flex flex-wrap justify-center sm:justify-start gap-3">
              <a
                href={`https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent('Hi! I am interested in ordering products from your store.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold px-6 py-3 rounded-2xl transition-all shadow-xl shadow-emerald-900/30"
              >
                <MessageCircle className="w-5 h-5" />
                <span>Order via WhatsApp</span>
              </a>
            </div>
          </div>
          
          <div className="w-full sm:w-auto bg-white/10 backdrop-blur-xl p-6 rounded-3xl border border-white/20 max-w-sm text-center shadow-2xl">
            <span className="text-amber-300 font-bold text-xs uppercase tracking-widest">Collection Highlight</span>
            <h3 className="text-xl font-bold mt-1 mb-2 font-serif text-white">Video Reels & Multi-Images</h3>
            <p className="text-stone-200 text-xs mb-4 leading-relaxed">
              Explore immersive video reels, multiple photos, instant Apple Pay, Google Pay, Samsung Pay & COD!
            </p>
            <div className="inline-block bg-gradient-to-r from-amber-500 to-rose-500 text-white font-black px-4 py-1.5 rounded-xl text-sm shadow-md">
              {products.length} Exclusive Items
            </div>
          </div>
        </div>
      </div>

      {/* Search and Category Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pb-6 border-b border-neutral-200">
          {/* Search bar */}
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              placeholder="Search products or descriptions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all shadow-xs"
            />
          </div>

          {/* Categories */}
          <div className="flex items-center space-x-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
            <Filter className="w-4 h-4 text-neutral-400 shrink-0 ml-1 mr-1" />
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-neutral-900 text-white shadow-sm'
                    : 'bg-white text-neutral-600 border border-neutral-200 hover:bg-neutral-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-neutral-200 mt-8">
            <ShoppingCart className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-neutral-800">No products found</h3>
            <p className="text-neutral-500 text-sm mt-1">Try adjusting your search or category filter.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col group"
              >
                {/* Image & Video Badge container */}
                <div className="relative aspect-square bg-neutral-100 overflow-hidden cursor-pointer" onClick={() => onSelectProduct(product)}>
                  <img
                    src={product.images[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30'}
                    alt={product.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  
                  {/* Video Clip badge */}
                  {product.videoUrl && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenVideoFeed(product);
                      }}
                      className="absolute top-3 left-3 bg-neutral-900/80 backdrop-blur-md text-white text-xs font-medium px-2.5 py-1 rounded-lg flex items-center space-x-1.5 hover:bg-emerald-600 transition-colors shadow-md"
                      title="Watch video clip"
                    >
                      <Video className="w-3.5 h-3.5 text-emerald-400 group-hover:text-white" />
                      <span>Video Clip</span>
                    </button>
                  )}

                  {/* Stock badge */}
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md text-neutral-800 text-[11px] font-bold px-2.5 py-1 rounded-lg shadow-sm">
                    {product.stock > 0 ? `${product.stock} in stock` : 'Out of Stock'}
                  </div>

                  {/* Quick view overlay on hover */}
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                    <span className="bg-white/95 text-neutral-900 text-xs font-semibold px-3.5 py-2 rounded-xl shadow-lg flex items-center space-x-1.5">
                      <Eye className="w-3.5 h-3.5" />
                      <span>View Details</span>
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-xs text-neutral-500 mb-1">
                      <span className="font-medium uppercase tracking-wider text-emerald-600">{product.category}</span>
                    </div>
                    <h3 className="font-bold text-neutral-900 text-base line-clamp-1 mb-1 group-hover:text-emerald-600 transition-colors" onClick={() => onSelectProduct(product)} style={{ cursor: 'pointer' }}>
                      {product.title}
                    </h3>
                    <p className="text-neutral-500 text-xs line-clamp-2 mb-4 leading-relaxed">
                      {product.description}
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xl font-black text-neutral-900">
                        {settings.currency}{product.price.toFixed(2)}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => onAddToCart(product)}
                        className="w-full bg-neutral-900 hover:bg-emerald-600 text-white font-medium py-2.5 px-3 rounded-xl text-xs transition-colors flex items-center justify-center space-x-1.5 shadow-sm"
                      >
                        <ShoppingCart className="w-3.5 h-3.5" />
                        <span>Add to Cart</span>
                      </button>

                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => shareProduct(product, settings.currency)}
                          className="flex-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-medium py-2.5 px-2 rounded-xl text-xs transition-colors flex items-center justify-center space-x-1"
                          title="Share to WhatsApp"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>Share</span>
                        </button>
                        
                        <button
                          onClick={() => handleCopyLink(product)}
                          className="p-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-xl transition-colors"
                          title="Copy Link"
                        >
                          {copiedId === product.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
