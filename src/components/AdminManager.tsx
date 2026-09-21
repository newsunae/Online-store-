import React, { useState } from 'react';
import { Settings, Package, Plus, Edit, Trash2, Video, Store, Save, Check, MessageCircle, ExternalLink } from 'lucide-react';
import { Product, StoreSettings, Order } from '../types';
import { shareToWhatsApp } from '../utils/shareUtils';

interface AdminManagerProps {
  settings: StoreSettings;
  onUpdateSettings: (newSettings: StoreSettings) => void;
  products: Product[];
  onEditProduct: (product: Product) => void;
  onDeleteProduct: (id: string) => void;
  onOpenAddModal: () => void;
  orders: Order[];
  onUpdateOrderStatus: (orderId: string, status: Order['status']) => void;
  onDeleteOrder: (orderId: string) => void;
}

export const AdminManager: React.FC<AdminManagerProps> = ({
  settings,
  onUpdateSettings,
  products,
  onEditProduct,
  onDeleteProduct,
  onOpenAddModal,
  orders,
  onUpdateOrderStatus,
  onDeleteOrder
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'products' | 'settings' | 'orders'>('products');
  
  // Settings form state
  const [storeName, setStoreName] = useState(settings.storeName);
  const [currency, setCurrency] = useState(settings.currency);
  const [whatsappNumber, setWhatsappNumber] = useState(settings.whatsappNumber);
  const [bannerTitle, setBannerTitle] = useState(settings.bannerTitle);
  const [bannerSubtitle, setBannerSubtitle] = useState(settings.bannerSubtitle);
  const [logoUrl, setLogoUrl] = useState(settings.logoUrl || '');
  const [savedSettings, setSavedSettings] = useState(false);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSettings({
      storeName,
      currency,
      whatsappNumber,
      bannerTitle,
      bannerSubtitle,
      logoUrl
    });
    setSavedSettings(true);
    setTimeout(() => setSavedSettings(false), 2500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-[85vh]">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-extrabold text-neutral-900">Store Management & Dashboard</h1>
          <p className="text-neutral-500 text-sm">Manage your products, video clips, orders, and WhatsApp integration settings.</p>
        </div>

        <div className="flex items-center space-x-2 bg-white border border-neutral-200 p-1 rounded-2xl shadow-xs">
          <button
            onClick={() => setActiveSubTab('products')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
              activeSubTab === 'products' ? 'bg-neutral-900 text-white' : 'text-neutral-600 hover:bg-neutral-100'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>Products ({products.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('orders')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
              activeSubTab === 'orders' ? 'bg-neutral-900 text-white' : 'text-neutral-600 hover:bg-neutral-100'
            }`}
          >
            <Store className="w-3.5 h-3.5" />
            <span>Orders ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('settings')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
              activeSubTab === 'settings' ? 'bg-neutral-900 text-white' : 'text-neutral-600 hover:bg-neutral-100'
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Settings</span>
          </button>
        </div>
      </div>

      {/* Products Management Tab */}
      {activeSubTab === 'products' && (
        <div className="bg-white rounded-3xl border border-neutral-200 shadow-xs overflow-hidden">
          <div className="p-6 border-b border-neutral-200 flex items-center justify-between bg-neutral-50">
            <div>
              <h2 className="text-lg font-bold text-neutral-900">Store Products & Video Clips</h2>
              <p className="text-xs text-neutral-500">Add products with YouTube or video clip URLs for instant WhatsApp sharing.</p>
            </div>
            <button
              onClick={onOpenAddModal}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs transition-all shadow-sm flex items-center space-x-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Product</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-neutral-200 text-xs font-bold text-neutral-400 uppercase tracking-wider bg-neutral-50/50">
                  <th className="py-3 px-6">Product</th>
                  <th className="py-3 px-6">Category</th>
                  <th className="py-3 px-6">Price</th>
                  <th className="py-3 px-6">Stock</th>
                  <th className="py-3 px-6">Video Clip</th>
                  <th className="py-3 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 text-sm">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-neutral-50/80 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-3">
                        <img
                          src={product.images[0]}
                          alt=""
                          className="w-12 h-12 rounded-xl object-cover border border-neutral-200 shrink-0 bg-neutral-100"
                        />
                        <div>
                          <span className="font-bold text-neutral-900 block line-clamp-1">{product.title}</span>
                          <span className="text-xs text-neutral-400 line-clamp-1">{product.description}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="bg-emerald-50 text-emerald-700 text-xs font-semibold px-2.5 py-1 rounded-lg">
                        {product.category}
                      </span>
                    </td>
                    <td className="py-4 px-6 font-black text-neutral-900">
                      {settings.currency}{product.price.toFixed(2)}
                    </td>
                    <td className="py-4 px-6">
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${
                        product.stock > 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
                      }`}>
                        {product.stock} in stock
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      {product.videoUrl ? (
                        <span className="inline-flex items-center space-x-1 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg">
                          <Video className="w-3.5 h-3.5" />
                          <span>Linked Clip</span>
                        </span>
                      ) : (
                        <span className="text-xs text-neutral-400">No video</span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-right space-x-2">
                      <button
                        onClick={() => onEditProduct(product)}
                        className="p-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-xl transition-colors inline-flex items-center"
                        title="Edit Product"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDeleteProduct(product.id)}
                        className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl transition-colors inline-flex items-center"
                        title="Delete Product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Orders Management Tab */}
      {activeSubTab === 'orders' && (
        <div className="bg-white rounded-3xl border border-neutral-200 shadow-xs overflow-hidden">
          <div className="p-6 border-b border-neutral-200 bg-neutral-50">
            <h2 className="text-lg font-bold text-neutral-900">Customer Orders Received</h2>
            <p className="text-xs text-neutral-500">Orders placed by customers via WhatsApp or direct checkout.</p>
          </div>

          {orders.length === 0 ? (
            <div className="text-center py-20">
              <Package className="w-16 h-16 text-neutral-300 mx-auto mb-3" />
              <h3 className="font-bold text-neutral-800 text-lg">No orders yet</h3>
              <p className="text-neutral-500 text-xs mt-1">When customers order via WhatsApp, they will appear here.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-neutral-200 text-xs font-bold text-neutral-400 uppercase tracking-wider bg-neutral-50/50">
                    <th className="py-3 px-6">Order ID</th>
                    <th className="py-3 px-6">Customer</th>
                    <th className="py-3 px-6">Items</th>
                    <th className="py-3 px-6">Total</th>
                    <th className="py-3 px-6">Status</th>
                    <th className="py-3 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200 text-sm">
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-neutral-50/80 transition-colors">
                      <td className="py-4 px-6 font-bold text-neutral-900">#{order.id}</td>
                      <td className="py-4 px-6">
                        <div className="font-bold text-neutral-900">{order.customerName}</div>
                        <div className="text-xs text-neutral-500">{order.customerPhone}</div>
                        <div className="text-xs text-neutral-400 truncate max-w-xs">{order.customerAddress}</div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="text-xs space-y-1">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="text-neutral-700">
                              • {item.product.title} x{item.quantity}
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="py-4 px-6 font-black text-neutral-900">
                        {settings.currency}{order.total.toFixed(2)}
                      </td>
                      <td className="py-4 px-6">
                        <select
                          value={order.status}
                          onChange={(e) => onUpdateOrderStatus(order.id, e.target.value as Order['status'])}
                          className="bg-emerald-50 border border-emerald-200 text-emerald-800 font-semibold text-xs rounded-xl px-3 py-1.5 focus:outline-none"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Confirmed">Confirmed</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Completed">Completed</option>
                        </select>
                      </td>
                      <td className="py-4 px-6 text-right space-x-2">
                        <a
                          href={`https://wa.me/${order.customerPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hi ${order.customerName}, regarding your order #${order.id}...`)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl transition-colors inline-flex items-center"
                          title="Chat on WhatsApp"
                        >
                          <MessageCircle className="w-4 h-4" />
                        </a>
                        <button
                          onClick={() => onDeleteOrder(order.id)}
                          className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl transition-colors inline-flex items-center"
                          title="Delete Order"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Settings Tab */}
      {activeSubTab === 'settings' && (
        <div className="bg-white rounded-3xl border border-neutral-200 shadow-xs p-6 sm:p-8 max-w-3xl">
          <h2 className="text-lg font-bold text-neutral-900 mb-1">Store & WhatsApp Settings</h2>
          <p className="text-xs text-neutral-500 mb-6">Configure your store name, WhatsApp contact number, currency, and hero banner.</p>

          <form onSubmit={handleSaveSettings} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">Store Name</label>
                <input
                  type="text"
                  required
                  value={storeName}
                  onChange={e => setStoreName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">Currency Symbol</label>
                <input
                  type="text"
                  required
                  value={currency}
                  onChange={e => setCurrency(e.target.value)}
                  className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">Store Logo URL</label>
              <div className="flex space-x-2">
                <input
                  type="url"
                  value={logoUrl}
                  onChange={e => setLogoUrl(e.target.value)}
                  placeholder="https://... or image link"
                  className="flex-1 px-4 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <span className="text-[11px] text-neutral-400 mt-1 block">Provide an image URL for your FSE store logo to display in the header and navigation.</span>
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">Hero Banner Title</label>
              <input
                type="text"
                required
                value={bannerTitle}
                onChange={e => setBannerTitle(e.target.value)}
                className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">Hero Banner Subtitle</label>
              <textarea
                rows={2}
                required
                value={bannerSubtitle}
                onChange={e => setBannerSubtitle(e.target.value)}
                className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
              />
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-neutral-200">
              {savedSettings && (
                <span className="text-xs font-bold text-emerald-600 flex items-center space-x-1">
                  <Check className="w-4 h-4" />
                  <span>Settings saved successfully!</span>
                </span>
              )}
              <div className="ml-auto">
                <button
                  type="submit"
                  className="bg-neutral-900 hover:bg-emerald-600 text-white font-bold px-6 py-2.5 rounded-xl text-sm transition-all shadow-md flex items-center space-x-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Settings</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
