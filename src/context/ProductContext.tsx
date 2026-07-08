import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { getProducts } from '../api/products';
import { mapApiProduct } from '../lib/mapApiProduct';
import { dedupeStoreProducts } from '../lib/mergeCatalog';
import type { StoreProduct } from '../types/product';

interface ProductContextValue {
  products: StoreProduct[];
  loading: boolean;
  source: 'api' | 'none';
  refresh: () => void;
}

const ProductContext = createContext<ProductContextValue>({
  products: [],
  loading: true,
  source: 'none',
  refresh: () => {},
});

export function ProductProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<StoreProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [source, setSource] = useState<'api' | 'none'>('none');

  const load = async () => {
    setLoading(true);
    try {
      const res = await getProducts({ limit: 200 });
      const apiProducts = (res.success && Array.isArray(res.data) ? res.data : [])
        .map((p: Record<string, unknown>) => mapApiProduct(p))
        .filter((p: StoreProduct | null): p is StoreProduct => p !== null);

      // Storefront shows database products only — no static public catalog merge.
      setProducts(dedupeStoreProducts(apiProducts));
      setSource(apiProducts.length > 0 ? 'api' : 'none');
    } catch {
      setProducts([]);
      setSource('none');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <ProductContext.Provider value={{ products, loading, source, refresh: load }}>
      {children}
    </ProductContext.Provider>
  );
}

export function useProducts() {
  return useContext(ProductContext);
}
