import React, { useState } from 'react';
import { X, MessageCircle, Check, User, Phone, MapPin, FileText, CreditCard } from 'lucide-react';
import { CartItem, StoreSettings, Order } from '../types';
import { formatOrderWhatsAppMessage, shareToWhatsApp } from '../utils/shareUtils';

interface WhatsAppCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  settings: StoreSettings;
  onOrderComplete: (order: Order) => void;
}

export const WhatsAppCheckoutModal: React.FC<WhatsAppCheckoutModalProps> = ({
  isOpen,
  onClose,
  cart,
  settings,
  onOrderComplete
}) => {
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'Cash on Delivery' | 'Google Pay' | 'Apple Pay' | 'Samsung Pay'>('Cash on Delivery');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const totalAmount = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const handleSendOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerPhone || !customerAddress) return;

    const newOrder: Order = {
      id: Math.floor(100000 + Math.random() * 900000).toString(),
      items: [...cart],
      total: totalAmount,
      customerName,
      customerPhone,
      customerAddress,
      paymentMethod,
      notes,
      createdAt: new Date().toISOString(),
      status: 'Pending'
    };

    onOrderComplete(newOrder);

    // Format WhatsApp message
    const msg = formatOrderWhatsAppMessage(newOrder, settings.currency);
    shareToWhatsApp(msg, settings.whatsappNumber);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
        <div className="bg-emerald-600 p-6 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold">WhatsApp Order Checkout</h2>
              <p className="text-xs text-emerald-100 mt-0.5">Send your order directly to the store via WhatsApp</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSendOrder} className="p-6 sm:p-8 space-y-4">
          <div className="bg-neutral-50 p-4 rounded-2xl border border-neutral-200 mb-4">
            <div className="flex justify-between text-xs text-neutral-500 mb-1">
              <span>Items in Order</span>
              <span>{cart.reduce((s, i) => s + i.quantity, 0)} items</span>
            </div>
            <div className="text-lg font-black text-neutral-900">
              Total: {settings.currency}{totalAmount.toFixed(2)}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5 flex items-center space-x-1.5">
              <User className="w-4 h-4 text-emerald-600" />
              <span>Full Name *</span>
            </label>
            <input
              type="text"
              required
              value={customerName}
              onChange={e => setCustomerName(e.target.value)}
              placeholder="e.g. John Smith"
              className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5 flex items-center space-x-1.5">
              <Phone className="w-4 h-4 text-emerald-600" />
              <span>WhatsApp Phone Number *</span>
            </label>
            <input
              type="tel"
              required
              value={customerPhone}
              onChange={e => setCustomerPhone(e.target.value)}
              placeholder="e.g. +1 555-0199"
              className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5 flex items-center space-x-1.5">
              <MapPin className="w-4 h-4 text-emerald-600" />
              <span>Delivery Address *</span>
            </label>
            <textarea
              required
              rows={2}
              value={customerAddress}
              onChange={e => setCustomerAddress(e.target.value)}
              placeholder="Street address, city, postal code..."
              className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-2 flex items-center space-x-1.5">
              <CreditCard className="w-4 h-4 text-emerald-600" />
              <span>Select Payment Method *</span>
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              {(['Cash on Delivery', 'Google Pay', 'Apple Pay', 'Samsung Pay'] as const).map(method => (
                <button
                  key={method}
                  type="button"
                  onClick={() => setPaymentMethod(method)}
                  className={`p-3 rounded-xl border text-left text-xs font-bold transition-all flex items-center justify-between ${
                    paymentMethod === method
                      ? 'border-emerald-600 bg-emerald-50/70 text-emerald-900 shadow-xs ring-1 ring-emerald-500'
                      : 'border-neutral-200 bg-neutral-50 text-neutral-700 hover:bg-neutral-100'
                  }`}
                >
                  <span>{method}</span>
                  {paymentMethod === method && <Check className="w-4 h-4 text-emerald-600 shrink-0" />}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5 flex items-center space-x-1.5">
              <FileText className="w-4 h-4 text-emerald-600" />
              <span>Special Notes (Optional)</span>
            </label>
            <input
              type="text"
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="e.g. Deliver in the evening"
              className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
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
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-bold shadow-lg shadow-emerald-600/30 transition-all flex items-center space-x-2"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Send Order to WhatsApp</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
