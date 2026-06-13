import type { StoreProduct } from '@/types/product';
import { getCategoryBySlug } from '@/data/categories';

export function buildProductSeoTitle(product: StoreProduct): string {
  return `${product.name} Price in Nairobi | Spark Lights 254`;
}

export function buildProductSeoDescription(product: StoreProduct): string {
  const cats = (product.categories ?? [])
    .map((slug) => getCategoryBySlug(slug)?.name)
    .filter(Boolean)
    .join(', ');

  return `Buy ${product.name} in Nairobi — KES ${product.price}. ${product.shortDesc} Same-day delivery${cats ? ` · ${cats}` : ''}. Order on WhatsApp at Spark Lights 254, Nyamakima.`;
}

export function buildProductSeoKeywords(product: StoreProduct): string {
  const categoryKeywords = (product.categories ?? [])
    .map((slug) => getCategoryBySlug(slug)?.seoKeywords)
    .filter(Boolean)
    .join(', ');

  return [
    `${product.name} Nairobi`,
    `KES ${product.price}`,
    'chandeliers Nairobi price',
    'lighting shop Nyamakima',
    categoryKeywords,
  ]
    .filter(Boolean)
    .join(', ');
}

export const SITE_KEYWORDS =
  'chandeliers Nairobi price, modern ceiling lights Nairobi, pendant lights Kenya, gypsum board lighting fixtures, wall brackets shop Nairobi, lighting shops Nyamakima, chandelier installation services Nairobi, solar security lights Nairobi, outdoor wall lights waterproof, wholesale electrical shops Nairobi, LED power-saving bulbs price, Spark Lights 254';
