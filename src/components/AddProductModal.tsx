import React, { useState, useEffect, useRef } from 'react';
import { X, Plus, Video, Image as ImageIcon, Sparkles, Check, FolderOpen, Upload, Smartphone } from 'lucide-react';
import { Product } from '../types';
import { sampleGalleryImages } from '../data/initialProducts';

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveProduct: (product: Product) => void;
  productToEdit?: Product | null;
}

export const AddProductModal: React.FC<AddProductModalProps> = ({
  isOpen,
  onClose,
  onSaveProduct,
  productToEdit
}) => {
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('Electronics');
  const [description, setDescription] = useState('');
  
  // Minimum 4 product images
  const [image1, setImage1] = useState('');
  const [image2, setImage2] = useState('');
  const [image3, setImage3] = useState('');
  const [image4, setImage4] = useState('');

  // Single YouTube link
  const [videoUrl, setVideoUrl] = useState('');
  const [videoTitle, setVideoTitle] = useState('');
  
  const [stock, setStock] = useState('10');
  const [featured, setFeatured] = useState(false);

  // Gallery picker modal state
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [activeImageSlot, setActiveImageSlot] = useState<1 | 2 | 3 | 4>(1);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (productToEdit) {
      setTitle(productToEdit.title);
      setPrice(productToEdit.price.toString());
      setCategory(productToEdit.category);
      setDescription(productToEdit.description);
      setImage1(productToEdit.images[0] || '');
      setImage2(productToEdit.images[1] || '');
      setImage3(productToEdit.images[2] || '');
      setImage4(productToEdit.images[3] || '');
      setVideoUrl(productToEdit.videoUrl || '');
      setVideoTitle(productToEdit.videoTitle || '');
      setStock(productToEdit.stock.toString());
      setFeatured(productToEdit.featured || false);
    } else {
      setTitle('');
      setPrice('');
      setCategory('Electronics');
      setDescription('');
      setImage1('https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80');
      setImage2('https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?auto=format&fit=crop&w=800&q=80');
      setImage3('https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80');
      setImage4('https://images.unsplash.com/photo-1526738549149-8e07eca6c147?auto=format&fit=crop&w=800&q=80');
      setVideoUrl('https://www.youtube.com/embed/dQw4w9WgXcQ');
      setVideoTitle('Product Review & Demo');
      setStock('10');
      setFeatured(false);
    }
  }, [productToEdit, isOpen]);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, slot: 1 | 2 | 3 | 4) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // Helper to process image to compressed data URL
    const processFile = (file: File, targetSlot: 1 | 2 | 3 | 4) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          const maxDim = 800; // Small size optimized for product catalog
          if (width > height && width > maxDim) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else if (height > maxDim) {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
            if (targetSlot === 1) setImage1(dataUrl);
            if (targetSlot === 2) setImage2(dataUrl);
            if (targetSlot === 3) setImage3(dataUrl);
            if (targetSlot === 4) setImage4(dataUrl);
          }
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    };

    if (files.length === 1) {
      processFile(files[0], slot);
    } else {
      // If multiple files selected, fill available slots sequentially starting from slot
      const selectedFiles = Array.from(files).slice(0, 4);
      selectedFiles.forEach((file, index) => {
        const targetSlot = Math.min(slot + index, 4) as 1 | 2 | 3 | 4;
        processFile(file, targetSlot);
      });
    }
    // reset input
    e.target.value = '';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !price) return;

    const imagesList = [image1, image2, image3, image4].filter(img => img && img.trim().length > 0);
    const finalImages = imagesList.length > 0 ? imagesList : ['https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80'];

    const newProduct: Product = {
      id: productToEdit ? productToEdit.id : `prod-${Date.now()}`,
      title,
      price: parseFloat(price) || 0,
      category: category || 'General',
      description,
      images: finalImages,
      videoUrl: videoUrl.trim() ? videoUrl.trim() : undefined,
      videoTitle: videoTitle.trim() ? videoTitle.trim() : undefined,
      stock: parseInt(stock, 10) || 10,
      featured,
      createdAt: productToEdit ? productToEdit.createdAt : new Date().toISOString()
    };

    onSaveProduct(newProduct);
    onClose();
  };

  const handleFillSample = () => {
    setTitle("Wireless Gaming Headset Pro");
    setPrice("89.99");
    setCategory("Electronics");
    setDescription("Ultra-low latency wireless gaming headset with 7.1 surround sound, RGB lighting, and breathable memory foam ear cushions.");
    setImage1("https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80");
    setImage2("https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=800&q=80");
    setImage3("https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80");
    setImage4("https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80");
    setVideoUrl("https://www.youtube.com/embed/dQw4w9WgXcQ");
    setVideoTitle("RGB Headset Unboxing & Audio Test");
    setStock("20");
    setFeatured(true);
  };

  const openGalleryForSlot = (slot: 1 | 2 | 3 | 4) => {
    setActiveImageSlot(slot);
    setIsGalleryOpen(true);
  };

  const selectGalleryImage = (url: string) => {
    if (activeImageSlot === 1) setImage1(url);
    if (activeImageSlot === 2) setImage2(url);
    if (activeImageSlot === 3) setImage3(url);
    if (activeImageSlot === 4) setImage4(url);
    setIsGalleryOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
        <div className="bg-gradient-to-r from-neutral-900 to-emerald-950 p-6 text-white flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold">{productToEdit ? 'Edit Product & Images' : 'Add New Product (Min 4 Images & YouTube Link)'}</h2>
            <p className="text-xs text-neutral-300 mt-1">Store Owner Panel: Upload phone gallery images & 1 YouTube demo link</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-5 max-h-[75vh] overflow-y-auto">
          <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 p-3.5 rounded-2xl">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span className="text-xs font-semibold text-emerald-900">Need sample data?</span>
            </div>
            <button
              type="button"
              onClick={handleFillSample}
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-1.5 rounded-xl transition-all shadow-xs"
            >
              Fill Sample Data
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">Product Title *</label>
              <input
                type="text"
                required
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="e.g. Pro Wireless Earbuds"
                className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">Price ($) *</label>
              <input
                type="number"
                step="0.01"
                required
                value={price}
                onChange={e => setPrice(e.target.value)}
                placeholder="e.g. 79.99"
                className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">Category</label>
              <input
                type="text"
                value={category}
                onChange={e => setCategory(e.target.value)}
                placeholder="e.g. Electronics, Wearables"
                className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">Stock Quantity</label>
              <input
                type="number"
                value={stock}
                onChange={e => setStock(e.target.value)}
                placeholder="10"
                className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">Description</label>
            <textarea
              rows={3}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Describe product features, specs, and benefits..."
              className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
            />
          </div>

          {/* Minimum 4 Product Images with Phone/Device Gallery Access */}
          <div className="bg-neutral-50 p-4 rounded-2xl border border-neutral-200 space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <label className="block text-xs font-bold text-neutral-800 uppercase tracking-wider flex items-center space-x-1.5">
                <ImageIcon className="w-4 h-4 text-emerald-600" />
                <span>Product Images (Minimum 4 Required)</span>
              </label>
              <div className="flex items-center space-x-2">
                <label className="cursor-pointer bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-1.5 rounded-xl transition-all flex items-center space-x-1.5 shadow-xs">
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>Upload from Phone Gallery</span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={(e) => handleFileUpload(e, 1)}
                  />
                </label>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Image 1 */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[11px] font-bold text-neutral-600">
                  <span>Image 1 (Main)</span>
                  <div className="space-x-2">
                    <label className="cursor-pointer text-emerald-600 hover:underline font-semibold text-[11px]">
                      Upload
                      <input type="file" accept="image/*" className="hidden" onChange={e => handleFileUpload(e, 1)} />
                    </label>
                    <button
                      type="button"
                      onClick={() => openGalleryForSlot(1)}
                      className="text-emerald-600 hover:underline font-semibold"
                    >
                      Presets
                    </button>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <input
                    type="url"
                    value={image1}
                    onChange={e => setImage1(e.target.value)}
                    placeholder="Image URL or upload..."
                    className="flex-1 px-3 py-2 bg-white border border-neutral-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 truncate"
                  />
                  {image1 && (
                    <img src={image1} alt="" className="w-9 h-9 rounded-lg object-cover border border-neutral-300 shrink-0" />
                  )}
                </div>
              </div>

              {/* Image 2 */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[11px] font-bold text-neutral-600">
                  <span>Image 2</span>
                  <div className="space-x-2">
                    <label className="cursor-pointer text-emerald-600 hover:underline font-semibold text-[11px]">
                      Upload
                      <input type="file" accept="image/*" className="hidden" onChange={e => handleFileUpload(e, 2)} />
                    </label>
                    <button
                      type="button"
                      onClick={() => openGalleryForSlot(2)}
                      className="text-emerald-600 hover:underline font-semibold"
                    >
                      Presets
                    </button>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <input
                    type="url"
                    value={image2}
                    onChange={e => setImage2(e.target.value)}
                    placeholder="Image URL or upload..."
                    className="flex-1 px-3 py-2 bg-white border border-neutral-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 truncate"
                  />
                  {image2 && (
                    <img src={image2} alt="" className="w-9 h-9 rounded-lg object-cover border border-neutral-300 shrink-0" />
                  )}
                </div>
              </div>

              {/* Image 3 */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[11px] font-bold text-neutral-600">
                  <span>Image 3</span>
                  <div className="space-x-2">
                    <label className="cursor-pointer text-emerald-600 hover:underline font-semibold text-[11px]">
                      Upload
                      <input type="file" accept="image/*" className="hidden" onChange={e => handleFileUpload(e, 3)} />
                    </label>
                    <button
                      type="button"
                      onClick={() => openGalleryForSlot(3)}
                      className="text-emerald-600 hover:underline font-semibold"
                    >
                      Presets
                    </button>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <input
                    type="url"
                    value={image3}
                    onChange={e => setImage3(e.target.value)}
                    placeholder="Image URL or upload..."
                    className="flex-1 px-3 py-2 bg-white border border-neutral-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 truncate"
                  />
                  {image3 && (
                    <img src={image3} alt="" className="w-9 h-9 rounded-lg object-cover border border-neutral-300 shrink-0" />
                  )}
                </div>
              </div>

              {/* Image 4 */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[11px] font-bold text-neutral-600">
                  <span>Image 4</span>
                  <div className="space-x-2">
                    <label className="cursor-pointer text-emerald-600 hover:underline font-semibold text-[11px]">
                      Upload
                      <input type="file" accept="image/*" className="hidden" onChange={e => handleFileUpload(e, 4)} />
                    </label>
                    <button
                      type="button"
                      onClick={() => openGalleryForSlot(4)}
                      className="text-emerald-600 hover:underline font-semibold"
                    >
                      Presets
                    </button>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <input
                    type="url"
                    value={image4}
                    onChange={e => setImage4(e.target.value)}
                    placeholder="Image URL or upload..."
                    className="flex-1 px-3 py-2 bg-white border border-neutral-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 truncate"
                  />
                  {image4 && (
                    <img src={image4} alt="" className="w-9 h-9 rounded-lg object-cover border border-neutral-300 shrink-0" />
                  )}
                </div>
              </div>
            </div>
            <p className="text-[11px] text-neutral-500 italic">Tip: You can select multiple images at once from your phone or device gallery to fill slots 1-4 automatically.</p>
          </div>

          {/* Single YouTube Link Section */}
          <div className="bg-neutral-50 p-4 rounded-2xl border border-neutral-200 space-y-3">
            <label className="block text-xs font-bold text-neutral-800 uppercase tracking-wider flex items-center space-x-1.5">
              <Video className="w-4 h-4 text-emerald-600" />
              <span>YouTube Video Link (Only 1 Link Required)</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <input
                  type="text"
                  value={videoUrl}
                  onChange={e => setVideoUrl(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=... or embed link"
                  className="w-full px-4 py-2.5 bg-white border border-neutral-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <input
                  type="text"
                  value={videoTitle}
                  onChange={e => setVideoTitle(e.target.value)}
                  placeholder="Video Title (e.g. Unboxing & Review)"
                  className="w-full px-4 py-2.5 bg-white border border-neutral-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="featured"
              checked={featured}
              onChange={e => setFeatured(e.target.checked)}
              className="w-4 h-4 text-emerald-600 rounded border-neutral-300 focus:ring-emerald-500"
            />
            <label htmlFor="featured" className="text-sm font-medium text-neutral-800">
              Feature this product on store home banner / top list
            </label>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-neutral-200">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 border border-neutral-300 text-neutral-700 rounded-xl text-sm font-semibold hover:bg-neutral-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-neutral-900 hover:bg-emerald-600 text-white rounded-xl text-sm font-bold shadow-md transition-all flex items-center space-x-1.5"
            >
              <Check className="w-4 h-4" />
              <span>{productToEdit ? 'Save Changes' : 'Publish Product'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Gallery Picker Modal */}
      {isGalleryOpen && (
        <div className="fixed inset-0 z-60 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
              <div>
                <h3 className="text-lg font-bold text-neutral-900">Select Image from Gallery (Slot {activeImageSlot})</h3>
                <p className="text-xs text-neutral-500">Choose from professional product photos for your store</p>
              </div>
              <button
                onClick={() => setIsGalleryOpen(false)}
                className="p-2 bg-neutral-100 hover:bg-neutral-200 rounded-full text-neutral-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {sampleGalleryImages.map((imgUrl, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => selectGalleryImage(imgUrl)}
                  className="aspect-square rounded-xl overflow-hidden border-2 border-neutral-200 hover:border-emerald-600 transition-all shadow-xs group relative"
                >
                  <img src={imgUrl} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold">
                    Select
                  </div>
                </button>
              ))}
            </div>

            <div className="pt-3 border-t border-neutral-200 text-center">
              <button
                type="button"
                onClick={() => setIsGalleryOpen(false)}
                className="px-5 py-2 bg-neutral-900 text-white rounded-xl text-xs font-bold hover:bg-neutral-800"
              >
                Close Gallery
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
