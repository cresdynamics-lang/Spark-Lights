import { PUBLIC_CATALOG } from '../data/publicCatalog';
import type { StoreProduct } from '../types/product';
import { resolveProductPrice } from './productPrice';

/** Storefront always uses /public images; API only overlays editable fields (price, name, etc.). */
export function mergePublicCatalogWithApi(apiProducts: StoreProduct[]): StoreProduct[] {
  const bySlug = new Map(apiProducts.map((p) => [p.slug, p]));
  const byImg = new Map(apiProducts.map((p) => [p.img, p]));
  const byId = new Map(apiProducts.map((p) => [p.id, p]));

  return PUBLIC_CATALOG.map((pub) => {
    const api = bySlug.get(pub.slug) ?? byImg.get(pub.img) ?? byId.get(pub.id);
    if (!api) return pub;

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
    };
  });
}
