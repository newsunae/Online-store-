import React, { useState } from 'react';
import { Video, ShoppingCart, MessageCircle, Share2, ChevronLeft, ChevronRight, Check, Heart, ExternalLink } from 'lucide-react';
import { Product, StoreSettings } from '../types';
import { shareVideoClip, shareToWhatsApp } from '../utils/shareUtils';

interface VideoFeedProps {
  products: Product[];
  settings: StoreSettings;
  onAddToCart: (product: Product) => void;
  onSelectProduct: (product: Product) => void;
  initialProductId?: string;
}

export const VideoFeed: React.FC<VideoFeedProps> = ({
  products,
  settings,
  onAddToCart,
  onSelectProduct,
  initialProductId
}) => {
  // Filter products that have video clips
  const videoProducts = products.filter(p => p.videoUrl && p.videoUrl.trim().length > 0);
  
  const [currentIndex, setCurrentIndex] = useState(() => {
    if (initialProductId) {
      const idx = videoProducts.findIndex(p => p.id === initialProductId);
      return idx >= 0 ? idx : 0;
    }
    return 0;
  });

  const [liked, setLiked] = useState<Record<string, boolean>>({});
  const [copied, setCopied] = useState(false);

  if (videoProducts.length === 0) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 bg-neutral-900 text-white text-center">
        <Video className="w-16 h-16 text-emerald-400 mb-4 animate-bounce" />
        <h2 className="text-2xl font-bold mb-2">No Video Clips Available</h2>
        <p className="text-neutral-400 max-w-md text-sm mb-6">
          Add video clips (YouTube links or video URLs) to your products in the product manager to showcase them in the video feed!
        </p>
      </div>
    );
  }

  const currentProduct = videoProducts[currentIndex];

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % videoProducts.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + videoProducts.length) % videoProducts.length);
  };

  const toggleLike = (id: string) => {
    setLiked(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Convert regular youtube watch URL or embed URL to playable embed if needed
  const getEmbedUrl = (url: string) => {
    if (!url) return '';
    if (url.includes('youtube.com/embed/')) return url;
    if (url.includes('watch?v=')) {
      const vidId = url.split('watch?v=')[1]?.split('&')[0];
      return `https://www.youtube.com/embed/${vidId}?autoplay=1&mute=0`;
    }
    if (url.includes('youtu.be/')) {
      const vidId = url.split('youtu.be/')[1]?.split('?')[0];
      return `https://www.youtube.com/embed/${vidId}?autoplay=1&mute=0`;
    }
    return url;
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-neutral-950 text-white flex flex-col items-center justify-center py-6 px-4">
      {/* Header Info */}
      <div className="w-full max-w-md flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-red-500 animate-ping" />
          <span className="text-sm font-bold tracking-wider uppercase text-neutral-300">Product Video Reels</span>
        </div>
        <span className="text-xs font-semibold px-3 py-1 bg-white/10 rounded-full text-neutral-300">
          {currentIndex + 1} of {videoProducts.length}
        </span>
      </div>

      {/* Main Video Reel Container */}
      <div className="relative w-full max-w-md h-[560px] bg-neutral-900 rounded-3xl overflow-hidden shadow-2xl border border-neutral-800 flex flex-col">
        {/* Video Player or Frame */}
        <div className="absolute inset-0 bg-neutral-900">
          {currentProduct.videoUrl?.includes('youtube.com') || currentProduct.videoUrl?.includes('youtu.be') ? (
            <iframe
              src={getEmbedUrl(currentProduct.videoUrl)}
              title={currentProduct.videoTitle || currentProduct.title}
              className="w-full h-full object-cover border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <video
              src={currentProduct.videoUrl}
              controls
              autoPlay
              loop
              className="w-full h-full object-cover"
            />
          )}
        </div>

        {/* Gradient overlay for bottom readable text */}
        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none" />

        {/* Top controls / Navigation buttons inside card */}
        <div className="absolute top-4 inset-x-4 flex items-center justify-between z-20">
          <button
            onClick={handlePrev}
            className="p-2 bg-black/40 hover:bg-black/70 backdrop-blur-md rounded-full text-white transition-colors"
            title="Previous Video"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={handleNext}
            className="p-2 bg-black/40 hover:bg-black/70 backdrop-blur-md rounded-full text-white transition-colors"
            title="Next Video"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Right floating action buttons */}
        <div className="absolute right-4 bottom-28 flex flex-col items-center space-y-4 z-20">
          <button
            onClick={() => toggleLike(currentProduct.id)}
            className="p-3 bg-neutral-900/80 backdrop-blur-md rounded-full text-white hover:bg-red-500 transition-colors shadow-lg group"
            title="Like Video"
          >
            <Heart className={`w-5 h-5 ${liked[currentProduct.id] ? 'fill-red-500 text-red-500' : 'text-white'}`} />
          </button>

          <button
            onClick={() => shareVideoClip(currentProduct)}
            className="p-3 bg-emerald-600/90 hover:bg-emerald-600 backdrop-blur-md rounded-full text-white transition-colors shadow-lg flex flex-col items-center"
            title="Share Clip on WhatsApp"
          >
            <MessageCircle className="w-5 h-5" />
          </button>

          <button
            onClick={() => {
              navigator.clipboard.writeText(currentProduct.videoUrl || window.location.href);
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            }}
            className="p-3 bg-neutral-900/80 backdrop-blur-md rounded-full text-white hover:bg-neutral-800 transition-colors shadow-lg"
            title="Copy Link"
          >
            {copied ? <Check className="w-5 h-5 text-emerald-400" /> : <Share2 className="w-5 h-5" />}
          </button>
        </div>

        {/* Bottom Product Info Overlay */}
        <div className="absolute bottom-4 left-4 right-20 z-20">
          <div className="flex items-center space-x-2 mb-1.5">
            <span className="bg-emerald-500 text-neutral-950 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              {currentProduct.category}
            </span>
            <span className="text-xs text-neutral-300 font-medium">
              {currentProduct.videoTitle || 'Product Clip'}
            </span>
          </div>

          <h2 className="text-lg font-bold text-white mb-1 leading-snug line-clamp-1">
            {currentProduct.title}
          </h2>

          <div className="flex items-center justify-between mt-2">
            <span className="text-2xl font-black text-emerald-400">
              {settings.currency}{currentProduct.price.toFixed(2)}
            </span>

            <div className="flex space-x-2">
              <button
                onClick={() => onSelectProduct(currentProduct)}
                className="bg-white/20 hover:bg-white/30 backdrop-blur-md text-white px-3 py-2 rounded-xl text-xs font-semibold transition-all flex items-center space-x-1"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Details</span>
              </button>

              <button
                onClick={() => onAddToCart(currentProduct)}
                className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-lg shadow-emerald-600/40 flex items-center space-x-1.5"
              >
                <ShoppingCart className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Reel selector thumbnails */}
      <div className="flex items-center space-x-2 mt-4 overflow-x-auto max-w-md w-full pb-2">
        {videoProducts.map((p, idx) => (
          <button
            key={p.id}
            onClick={() => setCurrentIndex(idx)}
            className={`relative w-14 h-14 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
              idx === currentIndex ? 'border-emerald-500 scale-105 shadow-md' : 'border-neutral-800 opacity-60 hover:opacity-100'
            }`}
          >
            <img src={p.images[0]} alt={p.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
              <Video className="w-4 h-4 text-white" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
