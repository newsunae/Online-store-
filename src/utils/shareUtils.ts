import { Product, Order } from '../types';

export function shareToWhatsApp(text: string, phone?: string) {
  const encoded = encodeURIComponent(text);
  if (phone) {
    const cleanPhone = phone.replace(/[^0-9+]/g, '');
    window.open(`https://wa.me/${cleanPhone}?text=${encoded}`, '_blank');
  } else {
    window.open(`https://wa.me/?text=${encoded}`, '_blank');
  }
}

export function shareProduct(product: Product, currency: string = '$') {
  const text = `🛍️ *Check out this amazing product!*\n\n*${product.title}*\n💰 Price: ${currency}${product.price.toFixed(2)}\n📝 ${product.description}\n\n${product.videoUrl ? `🎬 Watch video clip: ${product.videoUrl}\n\n` : ''}👉 Order now from our store!`;
  
  if (navigator.share) {
    navigator.share({
      title: product.title,
      text: text,
      url: window.location.href,
    }).catch(() => {
      // fallback
      shareToWhatsApp(text);
    });
  } else {
    shareToWhatsApp(text);
  }
}

export function shareVideoClip(product: Product) {
  const text = `🎬 *Watch product video clip for ${product.title}!*\n\n${product.videoUrl || window.location.href}\n\n🛍️ Price: $${product.price}\nCheck it out!`;
  shareToWhatsApp(text);
}

export function formatOrderWhatsAppMessage(order: Order, currency: string = '$'): string {
  let msg = `🛒 *NEW ORDER #${order.id}*\n\n`;
  msg += `👤 *Customer:* ${order.customerName}\n`;
  msg += `📞 *Phone:* ${order.customerPhone}\n`;
  msg += `📍 *Address:* ${order.customerAddress}\n`;
  msg += `💳 *Payment Method:* ${order.paymentMethod}\n`;
  if (order.notes) {
    msg += `📝 *Notes:* ${order.notes}\n`;
  }
  msg += `\n📦 *Items Ordered:*\n`;
  order.items.forEach((item, idx) => {
    msg += `${idx + 1}. ${item.product.title} x${item.quantity} - ${currency}${(item.product.price * item.quantity).toFixed(2)}\n`;
  });
  msg += `\n💰 *Total Amount:* ${currency}${order.total.toFixed(2)}\n`;
  msg += `\n_Please confirm my order!_`;
  return msg;
}
