import { PUBLIC_CATALOG } from '../data/publicCatalog';
import type { StoreProduct } from '../types/product';
import { resolveProductPrice } from './productPrice';

function imageKey(img: string): string {
  const decoded = decodeURIComponent(img).toLowerCase();
  const file = decoded.split('/').pop() || decoded;
  // Collapse /3500.jpeg, /3500..jpeg, /3500...jpeg into one storefront listing
  const stem = file.replace(/\.[^.]+$/, '').replace(/\.+/g, '');
  if (/^\d{3,5}$/.test(stem)) return `price:${stem}`;
  return decoded;
}

/** One product per image URL — keeps API/public duplicates from repeating in All Products. */
function dedupeByImage(products: StoreProduct[]): StoreProduct[] {
  const seen = new Set<string>();
  const out: StoreProduct[] = [];
  for (const product of products) {
    const key = imageKey(product.img);
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(product);
  }
  return out;
}

/** Storefront merges /public catalog with API products; new API uploads appear first. */
export function mergePublicCatalogWithApi(apiProducts: StoreProduct[]): StoreProduct[] {
  const bySlug = new Map(apiProducts.map((p) => [p.slug, p]));
  const byImg = new Map(apiProducts.map((p) => [imageKey(p.img), p]));
  const byId = new Map(apiProducts.map((p) => [p.id, p]));
  const matchedApiIds = new Set<string>();

  const merged = PUBLIC_CATALOG.map((pub) => {
    const api = bySlug.get(pub.slug) ?? byImg.get(imageKey(pub.img)) ?? byId.get(pub.id);
    if (!api) return pub;
    matchedApiIds.add(api.id);

    return {
      ...pub,
      id: api.id,
      name: api.name,
      price: resolveProductPrice(api.price, pub.price),
      shortDesc: api.shortDesc || pub.shortDesc,
      longDesc: api.longDesc || pub.longDesc,
      categories: api.categories?.length ? api.categories : pub.categories,
      sizes: api.sizes?.some((s) => parseInt(s.price.replace(/,/g, ''), 10) > 0)
        ? api.sizes
        : pub.sizes,
      badge: api.badge ?? pub.badge,
      img: api.img || pub.img,
    };
  });

  const apiOnly = apiProducts.filter((p) => !matchedApiIds.has(p.id));
  return dedupeByImage([...apiOnly, ...merged]);
}
