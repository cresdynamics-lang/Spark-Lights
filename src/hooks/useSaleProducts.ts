import { useEffect, useState } from 'react';
import { getSaleProducts } from '@/api/products';
import { mapApiProduct } from '@/lib/mapApiProduct';
import type { StoreProduct } from '@/types/product';

export function useSaleProducts() {
  const [products, setProducts] = useState<StoreProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    (async () => {
      try {
        const res = await getSaleProducts();
        const list = (res.success && Array.isArray(res.data) ? res.data : [])
          .map((p: Record<string, unknown>) => mapApiProduct(p))
          .filter((p: StoreProduct | null): p is StoreProduct => p !== null);

        if (active) setProducts(list);
      } catch {
        if (active) setProducts([]);
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, []);

  return { products, loading };
}
