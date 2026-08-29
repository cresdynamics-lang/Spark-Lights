type MetaParams = Record<string, unknown>;

function fbq(): ((...args: any[]) => void) | undefined {
  return (window as any).fbq;
}

function parsePrice(price?: string | number): number {
  if (typeof price === 'number') return price;
  return parseInt(String(price ?? '').replace(/,/g, ''), 10) || 0;
}

export function trackMetaEvent(event: string, params?: MetaParams) {
  const f = fbq();
  if (typeof f === 'function') f('track', event, params ?? {});
}

export function trackMetaCustom(event: string, params?: MetaParams) {
  const f = fbq();
  if (typeof f === 'function') f('trackCustom', event, params ?? {});
}

export function trackPageView() {
  trackMetaEvent('PageView');
}

export function trackViewContent(p: { id: string | number; name: string; price?: string; slug?: string }) {
  trackMetaEvent('ViewContent', {
    content_ids: [String(p.id)],
    content_name: p.name,
    content_type: 'product',
    value: parsePrice(p.price),
    currency: 'KES',
  });
}

export function trackAddToCart(p: { id: string | number; name: string; price?: string }) {
  trackMetaEvent('AddToCart', {
    content_ids: [String(p.id)],
    content_name: p.name,
    value: parsePrice(p.price),
    currency: 'KES',
  });
}

export function trackPurchase(value: number, ids: (string | number)[], name?: string) {
  trackMetaEvent('Purchase', {
    value,
    currency: 'KES',
    content_ids: ids.map(String),
    content_type: 'product',
    content_name: name,
  });
}

export function trackWhatsAppOrder(p: { name: string; price?: string; slug?: string }) {
  trackMetaCustom('WhatsAppOrder', {
    content_name: p.name,
    value: parsePrice(p.price),
    currency: 'KES',
    content_ids: p.slug ? [p.slug] : undefined,
  });
}
