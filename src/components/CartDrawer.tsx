import React from 'react';
import { X, ShoppingBag, Trash2, ArrowRight, MessageCircle } from 'lucide-react';
import { CartItem, StoreSettings } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQuantity: (productId: string, qty: number) => void;
  onRemoveItem: (productId: string) => void;
  settings: StoreSettings;
  onProceedCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onRemoveItem,
  settings,
  onProceedCheckout
}) => {
  if (!isOpen) return null;

  const totalAmount = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity" onClick={onClose} />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-neutral-200 flex items-center justify-between bg-neutral-50">
            <div className="flex items-center space-x-2">
              <ShoppingBag className="w-5 h-5 text-emerald-600" />
              <h2 className="text-lg font-bold text-neutral-900">Your Shopping Cart</h2>
              <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-0.5 rounded-full">
                {cart.reduce((s, i) => s + i.quantity, 0)}
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-neutral-400 hover:text-neutral-700 rounded-full hover:bg-neutral-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart items list */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cart.length === 0 ? (
              <div className="text-center py-20">
                <ShoppingBag className="w-16 h-16 text-neutral-300 mx-auto mb-3 animate-pulse" />
                <h3 className="font-bold text-neutral-800 text-lg">Your cart is empty</h3>
                <p className="text-neutral-500 text-xs mt-1">Explore our store and add items with videos to cart.</p>
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.product.id} className="flex space-x-4 p-4 rounded-2xl border border-neutral-200 bg-white shadow-xs">
                  <img
                    src={item.product.images[0]}
                    alt={item.product.title}
                    className="w-20 h-20 object-cover rounded-xl shrink-0 bg-neutral-100"
                  />
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <h4 className="font-bold text-neutral-900 text-sm line-clamp-1">{item.product.title}</h4>
                        <button
                          onClick={() => onRemoveItem(item.product.id)}
                          className="text-neutral-400 hover:text-red-500 transition-colors"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <span className="text-xs font-semibold text-emerald-600">{settings.currency}{item.product.price.toFixed(2)}</span>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border border-neutral-200 rounded-lg overflow-hidden bg-neutral-50">
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                          className="px-2.5 py-1 text-neutral-600 hover:bg-neutral-200 font-bold text-xs"
                        >
                          -
                        </button>
                        <span className="px-3 py-1 font-bold text-xs text-neutral-900">{item.quantity}</span>
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                          className="px-2.5 py-1 text-neutral-600 hover:bg-neutral-200 font-bold text-xs"
                        >
                          +
                        </button>
                      </div>
                      <span className="font-extrabold text-neutral-900 text-sm">
                        {settings.currency}{(item.product.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout */}
          {cart.length > 0 && (
            <div className="p-6 border-t border-neutral-200 bg-neutral-50">
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm text-neutral-500">
                  <span>Subtotal</span>
                  <span className="font-bold text-neutral-900">{settings.currency}{totalAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-neutral-500">
                  <span>Delivery / Shipping</span>
                  <span className="font-bold text-emerald-600">Calculated on WhatsApp</span>
                </div>
                <div className="flex justify-between text-base font-black text-neutral-900 border-t border-neutral-200 pt-2">
                  <span>Total</span>
                  <span className="text-xl text-emerald-600">{settings.currency}{totalAmount.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={onProceedCheckout}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 px-4 rounded-xl text-sm transition-all shadow-lg shadow-emerald-600/30 flex items-center justify-center space-x-2"
              >
                <MessageCircle className="w-5 h-5" />
                <span>Checkout via WhatsApp</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
