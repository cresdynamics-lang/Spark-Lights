import type { StoreProduct } from '../types/product';

function imageKey(img: string): string {
  const decoded = decodeURIComponent(img).toLowerCase();
  const file = decoded.split('/').pop() || decoded;
  // Collapse /3500.jpeg, /3500..jpeg, /3500...jpeg into one listing key
  const stem = file.replace(/\.[^.]+$/, '').replace(/\.+/g, '');
  if (/^\d{3,5}$/.test(stem)) return `price:${stem}`;
  return decoded;
}

/** One product per image — removes repeated listings that share the same photo. */
export function dedupeStoreProducts(products: StoreProduct[]): StoreProduct[] {
  const seenImg = new Set<string>();
  const seenSlug = new Set<string>();
  const out: StoreProduct[] = [];

  for (const product of products) {
    const img = imageKey(product.img);
    const slug = product.slug.toLowerCase();
    if (seenImg.has(img) || seenSlug.has(slug)) continue;
    seenImg.add(img);
    seenSlug.add(slug);
    out.push(product);
  }

  return out;
}
