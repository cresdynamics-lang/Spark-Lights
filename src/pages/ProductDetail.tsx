import { useState, useMemo, useRef, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiHeart, FiShoppingCart, FiChevronRight, FiCheckCircle, FiTruck } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa6';
import { useProducts } from '../context/ProductContext';
import { getProductBySlug } from '../api/products';
import { mapApiProduct } from '@/lib/mapApiProduct';
import type { StoreProduct } from '@/types/product';
import { BRAND } from '../data/brand';
import { getCategoryName } from '../data/categories';
import { useCartStore } from '../store/useCartStore';
import { usePageSEO } from '../hooks/usePageSEO';
import {
  buildProductSeoTitle,
  buildProductSeoDescription,
  buildProductSeoKeywords,
} from '../lib/seo';
import { productPageUrl } from '@/lib/whatsappOrder';
import { trackViewContent, trackWhatsAppOrder } from '@/lib/metaPixel';
import DeliveryBanner from '../components/DeliveryBanner';
import ProductImage from '../components/ProductImage';
import ProductCard from '@/components/ProductCard';

export default function ProductDetail() {
  const { slug } = useParams();
  const { products, loading: productsLoading } = useProducts();
  const addItem = useCartStore((s) => s.addItem);

  // Resolve by current slug first, then by legacy/stripped slug (e.g. when the
  // shared link says "1001033867-chandelier" but the real slug has changed).
  // This way deep links from Instagram, WhatsApp, etc. still find the product.
  const [fallbackProduct, setFallbackProduct] = useState<StoreProduct | null>(null);
  const [fallbackLoading, setFallbackLoading] = useState(false);
  const [fallbackError, setFallbackError] = useState<Error | null>(null);

  // The global product list is preferred, but deep-link browsers (Instagram,
  // WhatsApp in-app) may boot the SPA faster than the initial fetch resolves.
  // We therefore start a fallback direct-by-slug fetch after a short grace
  // period — either when the global list has resolved and missed, or after a
  // timeout if the global list is still pending (mobile browsers sometimes
  // throttle/delay the first network request).
  const productsResolved = !productsLoading;
  const [directFetchTriggered, setDirectFetchTriggered] = useState(false);

  const cachedProduct = useMemo(() => {
    if (!slug) return undefined;
    const direct = products.find((p) => p.slug === slug);
    if (direct) return direct;
    const base = slug.replace(/-?\d+$/, '');
    return products.find((p) => p.slug && p.slug.startsWith(base));
  }, [products, slug]);

  // Trigger the direct slug fetch IMMEDIATELY when products haven't loaded yet.
  // This handles deep-link / direct-URL access on mobile where the global
  // getProducts({ limit: 200 }) call can be very slow or stall entirely.
  // On client-side navigation the product is usually in cachedProduct already
  // so the direct fetch is never needed.
  useEffect(() => {
    if (directFetchTriggered) return;
    if (!slug) return;

    // If products have loaded and we found the product, no direct fetch needed.
    if (productsResolved && cachedProduct) return;

    // If products have loaded but the product is missing, fetch directly.
    if (productsResolved && !cachedProduct) {
      setDirectFetchTriggered(true);
      return;
    }

    // Products haven't loaded yet — start the direct fetch right away so
    // deep-link visitors aren't blocked by the slow global list fetch.
    setDirectFetchTriggered(true);
  }, [productsResolved, cachedProduct, slug, directFetchTriggered]);

  // Perform the actual direct-by-slug fetch when triggered.
  useEffect(() => {
    if (!directFetchTriggered) return;
    if (!slug || fallbackProduct) return;

    let active = true;
    setFallbackLoading(true);
    setFallbackError(null);

    const timeoutId = setTimeout(() => {
      if (active) {
        setFallbackError(new Error('Product lookup timed out'));
        setFallbackLoading(false);
      }
    }, 15000);

    (async () => {
      try {
        const res = await getProductBySlug(slug);
        if (!active) return;
        if (res.success && res.data) {
          const mapped = mapApiProduct(res.data as Record<string, unknown>);
          if (mapped) setFallbackProduct(mapped);
          else setFallbackError(new Error('Could not map product data'));
        } else {
          setFallbackError(new Error(res.error?.message || 'Product not found'));
        }
      } catch (err) {
        if (active) {
          console.error('[ProductDetail] fallback fetch failed:', err);
          setFallbackError(err instanceof Error ? err : new Error('Network error'));
        }
      } finally {
        if (active) {
          clearTimeout(timeoutId);
          setFallbackLoading(false);
        }
      }
    })();

    return () => {
      active = false;
      clearTimeout(timeoutId);
    };
  }, [directFetchTriggered, slug, fallbackProduct]);

  const product = cachedProduct ?? fallbackProduct ?? undefined;

  const [selectedSize, setSelectedSize] = useState(product?.sizes[0]?.label || '');
  const [quantity, setQuantity] = useState(1);

  usePageSEO({
    title: product ? buildProductSeoTitle(product) : 'Product | Spark Lights 254',
    description: product ? buildProductSeoDescription(product) : 'Lighting product at Spark Lights 254, Nairobi.',
    path: slug ? `/product/${slug}` : '/shop',
    keywords: product ? buildProductSeoKeywords(product) : undefined,
  });

  const currentPrice = product?.sizes.find(s => s.label === selectedSize)?.price || product?.price || '';
  const hasSizeOptions = (product?.sizes.length ?? 0) > 1 && !!selectedSize;

  const handleAddToCart = () => {
    if (!product) return;
    addItem(
      {
        ...product,
        id: hasSizeOptions ? `${product.id}-${selectedSize}` : product.id,
        name: hasSizeOptions ? `${product.name} (${selectedSize})` : product.name,
        price: currentPrice,
      },
      quantity
    );
  };

  const waHref = product
    ? `${BRAND.whatsappUrl}?text=${encodeURIComponent(
        `Hi ${BRAND.name}, I'm interested in ${product.name} (KES ${currentPrice}). ${productPageUrl(product.slug)}`
      )}`
    : '';

  // Meta Pixel — ViewContent when a product page is viewed.
  useEffect(() => {
    if (product) {
      trackViewContent({ id: product.id, name: product.name, price: currentPrice, slug: product.slug });
    }
  }, [product?.id]);

  // Sticky action bar — appears once the main product view is scrolled past.
  const stickSentinelRef = useRef<HTMLDivElement>(null);
  const [showSticky, setShowSticky] = useState(false);
  useEffect(() => {
    const el = stickSentinelRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => setShowSticky(entry.boundingClientRect.bottom < 0),
      { threshold: [0] }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [product?.id]);

  // "You may also like" — same category first, then any other products.
  const related = useMemo(() => {
    if (!product) return [];
    const others = products.filter((p) => p.id !== product.id);
    const sameCat = others.filter((p) =>
      (p.categories ?? []).some((c) => (product.categories ?? []).includes(c))
    );
    return (sameCat.length ? sameCat : others).slice(0, 8);
  }, [products, product]);

  if (!product) {
    const stillLoading =
      (productsLoading && !directFetchTriggered) || fallbackLoading;
    if (stillLoading) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
          <span className="w-10 h-10 border-2 border-primary-gold/30 border-t-primary-gold rounded-full animate-spin" />
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mt-4">Loading product…</p>
          {fallbackError && (
            <p className="text-[8px] uppercase tracking-widest text-red-500/70 mt-2">
              {fallbackError.message}
            </p>
          )}
        </div>
      );
    }
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-4xl font-black uppercase mb-6">Product Not Found</h1>
        <Link to="/shop" className="btn-primary">Back to Shop</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-32">
      {/* Breadcrumbs */}
      <div className="bg-secondary-black/50 border-b border-white/5 py-4">
        <div className="container mx-auto px-6 flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-gray-500">
          <Link to="/" className="hover:text-primary-pink transition-colors">Home</Link>
          <FiChevronRight size={10} />
          <Link to="/shop" className="hover:text-primary-pink transition-colors">Shop</Link>
          <FiChevronRight size={10} />
          <span className="text-white">{product.name}</span>
        </div>
      </div>

      <div className="container mx-auto px-6 py-16 sm:py-24">
        <div className="flex flex-col lg:flex-row gap-16 xl:gap-24">
          {/* Image Gallery */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:w-1/2"
          >
            <div className="product-image-frame shadow-2xl">
              <ProductImage src={product.img} alt={product.name} loading="eager" fetchPriority="high" />
              {product.badge && (
                <div className="absolute top-4 left-4 sm:top-8 sm:left-8 bg-primary-gold text-white text-[9px] sm:text-[10px] font-black px-3 py-1.5 sm:px-4 sm:py-2 uppercase tracking-[0.2em] shadow-2xl">
                  {product.badge}
                </div>
              )}
            </div>
          </motion.div>

          {/* Product Info */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:w-1/2 flex flex-col"
          >
            <span className="text-primary-pink uppercase tracking-[0.4em] text-[10px] font-bold mb-4 block">{product.tag}</span>
            <div className="flex flex-wrap gap-2 mb-6">
              {(product.categories ?? []).map((slug) => (
                <Link
                  key={slug}
                  to={`/category/${slug}`}
                  className="text-[9px] font-black uppercase tracking-widest px-3 py-1 border border-primary-gold/30 text-primary-gold hover:bg-primary-gold/10 transition-colors"
                >
                  {getCategoryName(slug)}
                </Link>
              ))}
            </div>
            <h1 className="text-4xl sm:text-6xl font-serif mb-4 leading-tight">{product.name}</h1>
            <div className="flex items-center gap-6 mb-8">
              <span className="text-3xl font-bold text-primary-pink">KES {currentPrice}</span>
              {product.oldPrice && <span className="text-xl text-gray-600 line-through">KES {product.oldPrice}</span>}
            </div>
            <p className="text-[11px] font-black uppercase tracking-widest text-primary-gold mb-4">
              Public Nairobi price — no inbox quotes
            </p>
            <ul className="space-y-2 mb-8">
              {[
                'Same-day Nairobi delivery via Moto/Bolt from KES 500',
                'Supply & Fix: light + delivery + fundi install',
                'WhatsApp us to confirm stock before payment',
              ].map((line) => (
                <li key={line} className="flex gap-2 text-gray-500 text-xs">
                  <FiCheckCircle className="text-primary-gold shrink-0 mt-0.5" size={14} />
                  {line}
                </li>
              ))}
            </ul>

            <p className="text-gray-400 text-lg leading-relaxed mb-12 whitespace-pre-line italic font-serif">
              "{product.shortDesc}"
            </p>

            {/* Size Selector */}
            <div className="mb-12">
              <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-6">Select Option:</label>
              <div className="flex flex-wrap gap-2 sm:gap-4">
                {product.sizes.map((size) => (
                  <button 
                    key={size.label}
                    onClick={() => setSelectedSize(size.label)}
                    className={`px-4 py-2 sm:px-8 sm:py-4 border text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.15em] sm:tracking-[0.2em] transition-all ${selectedSize === size.label ? 'border-primary-pink bg-primary-pink text-white shadow-lg shadow-primary-pink/20' : 'border-white/10 text-gray-400 hover:border-white/30'}`}
                  >
                    {size.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity and Cart */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-6 mb-12 sm:mb-16">
              <div className="flex items-center border border-white/10 h-12 sm:h-16 sm:w-40">
                <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="flex-1 hover:text-primary-gold transition-colors text-lg sm:text-xl">-</button>
                <span className="flex-1 text-center font-bold text-sm sm:text-base">{quantity}</span>
                <button onClick={() => setQuantity(q => q + 1)} className="flex-1 hover:text-primary-gold transition-colors text-lg sm:text-xl">+</button>
              </div>
              <button
                type="button"
                onClick={handleAddToCart}
                className="flex-[2] btn-primary h-12 sm:h-16 flex items-center justify-center gap-2 sm:gap-3 group text-[10px] sm:text-sm"
              >
                <FiShoppingCart size={18} className="group-hover:rotate-12 transition-transform sm:w-5 sm:h-5" />
                Add to Cart — KES {currentPrice}
              </button>
              <button className="hidden sm:flex w-16 h-16 border border-white/10 items-center justify-center hover:bg-white/5 transition-all text-gray-400 hover:text-primary-pink">
                <FiHeart size={20} />
              </button>
            </div>

            <a 
              href={`${BRAND.whatsappUrl}?text=${encodeURIComponent(`Hi Spark Lights 254! I'd like to order:\n${product.name}\nKES ${currentPrice}\nQty: ${quantity}\nOption: ${selectedSize}\n\nPlease confirm stock & delivery to my area.`)}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackWhatsAppOrder({ name: product.name, price: currentPrice, slug: product.slug })}
              className="w-full border-2 border-[#25D366] bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366] hover:text-white transition-all py-4 sm:py-6 flex items-center justify-center gap-2 sm:gap-3 font-black uppercase tracking-widest text-[10px] sm:text-xs mb-6"
            >
              <FaWhatsapp size={20} className="sm:w-[22px] sm:h-[22px]" /> Chat on WhatsApp to Order
            </a>
            <p className="text-center text-[10px] text-gray-600 font-bold uppercase tracking-widest mb-8 flex items-center justify-center gap-2">
              <FiTruck size={12} /> Most Kenyans order via WhatsApp — ask about stock &amp; delivery first
            </p>
            <div ref={stickSentinelRef} aria-hidden />
            <Link to="/installation" className="block text-center text-[10px] font-black uppercase tracking-widest text-primary-gold hover:underline mb-16">
              Bundle Supply &amp; Fix (light + install) →
            </Link>

            {/* Details Accordion Placeholder */}
            <div className="border-t border-white/5 py-10">
              <h3 className="text-sm font-black uppercase tracking-[0.2em] mb-6 flex items-center gap-3">
                <span className="w-8 h-[1px] bg-primary-gold"></span> Product Description
              </h3>
              <div className="text-gray-400 text-sm leading-relaxed space-y-4">
                {(product.longDesc ?? '').split('\n\n').map((p, i) => <p key={i}>{p}</p>)}
              </div>
            </div>

            {product.careInstructions && (
              <div className="border-t border-white/5 py-10">
                <h3 className="text-sm font-black uppercase tracking-[0.2em] mb-6 flex items-center gap-3">
                  <span className="w-8 h-[1px] bg-primary-gold"></span> Installation Notes
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">{product.careInstructions}</p>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* You May Also Like */}
      {related.length > 0 && (
        <section className="py-20 sm:py-28 bg-secondary-black border-t border-white/5">
          <div className="container mx-auto px-6">
            <div className="flex items-end justify-between gap-6 mb-10 sm:mb-16">
              <div>
                <span className="text-primary-gold uppercase tracking-[0.4em] text-[9px] sm:text-[10px] font-black mb-3 block">
                  You May Also Like
                </span>
                <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tighter text-white leading-none">
                  Other People Also Bought
                </h2>
              </div>
              <Link
                to="/shop"
                className="btn-secondary btn-compact text-[9px] sm:text-[10px] px-3 py-2 sm:px-5 sm:py-3 whitespace-nowrap"
              >
                View All
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-8">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      <DeliveryBanner />

      {/* Sticky action bar — appears once the main product view is scrolled past */}
      {showSticky && (
        <div className="fixed bottom-0 inset-x-0 z-[80] bg-secondary-black/95 backdrop-blur-xl border-t border-white/10 px-4 sm:px-6 py-3 sm:py-4">
          <div className="container mx-auto flex items-center gap-3 sm:gap-5">
            <div className="hidden sm:block w-12 h-12 shrink-0 rounded-md overflow-hidden bg-primary-black">
              <ProductImage src={product.img} alt={product.name} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-white font-black uppercase text-xs sm:text-sm truncate">{product.name}</p>
              <p className="text-primary-gold font-black text-[11px] sm:text-sm">KES {currentPrice}</p>
            </div>
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              <button
                onClick={handleAddToCart}
                className="bg-primary-gold text-black text-[9px] sm:text-[10px] font-black uppercase tracking-widest px-3 sm:px-6 py-2 sm:py-3 hover:bg-white transition-colors"
              >
                Add to Cart
              </button>
              <a
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackWhatsAppOrder({ name: product.name, price: currentPrice, slug: product.slug })}
                className="bg-[#25D366] text-white text-[9px] sm:text-[10px] font-black uppercase tracking-widest px-3 sm:px-6 py-2 sm:py-3 hover:bg-[#20bd5a] transition-colors flex items-center gap-1"
              >
                <FaWhatsapp size={14} className="sm:w-4 sm:h-4" /> WhatsApp
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
