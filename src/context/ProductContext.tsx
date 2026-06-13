import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { getProducts } from '../api/products';
import { PUBLIC_CATALOG } from '../data/publicCatalog';
import { mapApiProduct } from '../lib/mapApiProduct';
import { mergePublicCatalogWithApi } from '../lib/mergeCatalog';
import type { StoreProduct } from '../types/product';

interface ProductContextValue {
  products: StoreProduct[];
  loading: boolean;
  source: 'api' | 'public';
  refresh: () => void;
}

const ProductContext = createContext<ProductContextValue>({
  products: PUBLIC_CATALOG,
  loading: true,
  source: 'public',
  refresh: () => {},
});

export function ProductProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<StoreProduct[]>(PUBLIC_CATALOG);
  const [loading, setLoading] = useState(true);
  const [source, setSource] = useState<'api' | 'public'>('public');

  const load = async () => {
    setLoading(true);
    try {
      const res = await getProducts({ limit: 100 });
      const apiProducts = (res.success && Array.isArray(res.data) ? res.data : [])
        .map((p: Record<string, unknown>) => mapApiProduct(p))
        .filter((p: StoreProduct | null): p is StoreProduct => p !== null);

      if (apiProducts.length > 0) {
        setProducts(mergePublicCatalogWithApi(apiProducts));
        setSource('api');
      } else {
        setProducts(PUBLIC_CATALOG);
        setSource('public');
      }
    } catch {
      setProducts(PUBLIC_CATALOG);
      setSource('public');
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
