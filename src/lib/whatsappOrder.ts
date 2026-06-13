import { BRAND } from '@/data/brand';
import type { CartItem } from '@/store/useCartStore';

export interface CheckoutDetails {
  firstName: string;
  lastName: string;
  phone: string;
  email?: string;
  area: string;
  address: string;
  landmark?: string;
  notes?: string;
}

function parsePrice(price: string): number {
  return parseInt(price.replace(/,/g, ''), 10) || 0;
}

export function buildOrderWhatsAppMessage(
  items: CartItem[],
  details: CheckoutDetails,
  shipping: number
): string {
  const subtotal = items.reduce(
    (sum, item) => sum + parsePrice(item.price) * item.quantity,
    0
  );
  const grandTotal = subtotal + shipping;
  const customerName = `${details.firstName.trim()} ${details.lastName.trim()}`.trim();

  const lines = [
    `*NEW ORDER — ${BRAND.name}*`,
    '',
    `*Customer*`,
    `Name: ${customerName}`,
    `Phone: ${details.phone.trim()}`,
  ];

  if (details.email?.trim()) {
    lines.push(`Email: ${details.email.trim()}`);
  }

  lines.push(
    '',
    `*Delivery Location*`,
    `Area: ${details.area.trim()}`,
    `Address: ${details.address.trim()}`,
    `City: Nairobi`
  );

  if (details.landmark?.trim()) {
    lines.push(`Landmark: ${details.landmark.trim()}`);
  }

  lines.push('', `*Order Items*`);
  items.forEach((item, index) => {
    const lineTotal = parsePrice(item.price) * item.quantity;
    lines.push(
      `${index + 1}. ${item.name}`,
      `   KES ${item.price} × ${item.quantity} = KES ${lineTotal.toLocaleString()}`
    );
  });

  lines.push(
    '',
    `Subtotal: KES ${subtotal.toLocaleString()}`,
    `Delivery: KES ${shipping.toLocaleString()}`,
    `*Total: KES ${grandTotal.toLocaleString()}*`
  );

  if (details.notes?.trim()) {
    lines.push('', `*Notes*`, details.notes.trim());
  }

  lines.push('', `Sent from ${BRAND.domain}`);

  return lines.join('\n');
}

export function getOrderWhatsAppUrl(message: string): string {
  return `${BRAND.whatsappUrl}?text=${encodeURIComponent(message)}`;
}

export function sendOrderToWhatsApp(message: string): void {
  window.open(getOrderWhatsAppUrl(message), '_blank', 'noopener,noreferrer');
}
