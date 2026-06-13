import { getCategoryName } from '../data/categories';
import type { StoreProduct } from '../types/product';

export function searchProducts<T extends StoreProduct>(
  products: T[],
  query: string
): T[] {
  const q = query.trim().toLowerCase();
  if (!q) return products;

  return products.filter((product) => {
    const categoryText = (product.categories ?? [])
      .map((slug) => getCategoryName(slug))
      .join(' ')
      .toLowerCase();

    return (
      product.name.toLowerCase().includes(q) ||
      (product.shortDesc?.toLowerCase().includes(q) ?? false) ||
      (product.tag?.toLowerCase().includes(q) ?? false) ||
      categoryText.includes(q) ||
      (product.categories ?? []).some((slug) => slug.includes(q))
    );
  });
}

export function filterByCategory<T extends StoreProduct>(
  products: T[],
  categorySlug: string
): T[] {
  if (!categorySlug || categorySlug === 'all') return products;
  return products.filter((p) => p.categories?.includes(categorySlug));
}
