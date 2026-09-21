import React, { useState } from 'react';
import { X, ShoppingCart, MessageCircle, Share2, Video, Check, ShieldCheck, Truck, Package } from 'lucide-react';
import { Product, StoreSettings } from '../types';
import { shareProduct, shareToWhatsApp } from '../utils/shareUtils';

interface ProductModalProps {
  product: Product;
  settings: StoreSettings;
  onClose: () => void;
  onAddToCart: (product: Product, qty: number) => void;
  onOpenVideoFeed: (product: Product) => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  product,
  settings,
  onClose,
  onAddToCart,
  onOpenVideoFeed
}) => {
  const [selectedImage, setSelectedImage] = useState(product.images[0] || '');
  const [quantity, setQuantity] = useState(1);
  const [copied, setCopied] = useState(false);

  const getEmbedUrl = (url: string) => {
    if (!url) return '';
    if (url.includes('youtube.com/embed/')) return url;
    if (url.includes('watch?v=')) {
      const vidId = url.split('watch?v=')[1]?.split('&')[0];
      return `https://www.youtube.com/embed/${vidId}`;
    }
    if (url.includes('youtu.be/')) {
      const vidId = url.split('youtu.be/')[1]?.split('?')[0];
      return `https://www.youtube.com/embed/${vidId}`;
    }
    return url;
  };

  const handleWhatsAppOrder = () => {
    const text = `Hi! I would like to order this product:\n\n*${product.title}*\nQuantity: ${quantity}\nPrice: ${settings.currency}${(product.price * quantity).toFixed(2)}\n\nPlease confirm availability and delivery details!`;
    shareToWhatsApp(text, settings.whatsappNumber);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-4xl w-full overflow-hidden shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left Column: Images & Video */}
          <div className="p-6 bg-neutral-50 flex flex-col justify-between border-r border-neutral-100">
            <div>
              <div className="aspect-square rounded-2xl overflow-hidden bg-white border border-neutral-200 shadow-sm mb-4">
                <img src={selectedImage} alt={product.title} className="w-full h-full object-cover" />
              </div>

              {/* Thumbnails */}
              {product.images.length > 1 && (
                <div className="flex space-x-2 overflow-x-auto pb-2">
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(img)}
                      className={`w-16 h-16 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                        selectedImage === img ? 'border-emerald-600 scale-105' : 'border-neutral-200 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Video preview trigger if video available */}
            {product.videoUrl && (
              <div className="mt-6 bg-white p-4 rounded-2xl border border-neutral-200 shadow-xs">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <Video className="w-4 h-4 text-emerald-600" />
                    <span className="text-xs font-bold text-neutral-800 uppercase tracking-wider">Product Video Clip</span>
                  </div>
                  <button
                    onClick={() => onOpenVideoFeed(product)}
                    className="text-xs font-semibold text-emerald-600 hover:underline flex items-center space-x-1"
                  >
                    <span>Open Full Reel</span>
                  </button>
                </div>
                
                <div className="aspect-video rounded-xl overflow-hidden bg-neutral-900">
                  {product.videoUrl.includes('youtube.com') || product.videoUrl.includes('youtu.be') ? (
                    <iframe
                      src={getEmbedUrl(product.videoUrl)}
                      title={product.videoTitle || product.title}
                      className="w-full h-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <video src={product.videoUrl} controls className="w-full h-full object-cover" />
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Product details & Actions */}
          <div className="p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-extrabold text-emerald-600 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full">
                  {product.category}
                </span>
                <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                  product.stock > 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
                }`}>
                  {product.stock > 0 ? `${product.stock} items in stock` : 'Out of Stock'}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-black text-neutral-900 mb-2">
                {product.title}
              </h1>

              <div className="text-3xl font-black text-neutral-900 mb-6">
                {settings.currency}{product.price.toFixed(2)}
              </div>

              <div className="border-t border-neutral-200 pt-4 mb-6">
                <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2">Description</h3>
                <p className="text-neutral-600 text-sm leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Perks */}
              <div className="grid grid-cols-2 gap-3 mb-6 text-xs text-neutral-600">
                <div className="flex items-center space-x-2 bg-neutral-50 p-3 rounded-xl border border-neutral-200">
                  <Truck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Fast WhatsApp Order & Delivery</span>
                </div>
                <div className="flex items-center space-x-2 bg-neutral-50 p-3 rounded-xl border border-neutral-200">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Quality Guaranteed</span>
                </div>
              </div>
            </div>

            <div>
              {/* Quantity selector */}
              <div className="flex items-center space-x-4 mb-6">
                <span className="text-sm font-semibold text-neutral-700">Quantity:</span>
                <div className="flex items-center border border-neutral-300 rounded-xl overflow-hidden bg-white">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3.5 py-2 text-neutral-600 hover:bg-neutral-100 font-bold transition-colors"
                  >
                    -
                  </button>
                  <span className="px-4 py-2 font-bold text-sm text-neutral-900">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3.5 py-2 text-neutral-600 hover:bg-neutral-100 font-bold transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={() => {
                    onAddToCart(product, quantity);
                    onClose();
                  }}
                  className="w-full bg-neutral-900 hover:bg-neutral-800 text-white font-semibold py-3.5 px-4 rounded-xl text-sm transition-all shadow-md flex items-center justify-center space-x-2"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>Add to Cart ({quantity})</span>
                </button>

                <button
                  onClick={handleWhatsAppOrder}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3.5 px-4 rounded-xl text-sm transition-all shadow-lg shadow-emerald-600/30 flex items-center justify-center space-x-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Instant Order via WhatsApp</span>
                </button>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => shareProduct(product, settings.currency)}
                    className="bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-medium py-2.5 px-3 rounded-xl text-xs transition-colors flex items-center justify-center space-x-1.5"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Share to Apps</span>
                  </button>

                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(`${product.title} - ${settings.currency}${product.price} | Order now!`);
                      setCopied(true);
                      setTimeout(() => setCopied(false), 2000);
                    }}
                    className="bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-medium py-2.5 px-3 rounded-xl text-xs transition-colors flex items-center justify-center space-x-1.5"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Package className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied Link!' : 'Copy Link'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
