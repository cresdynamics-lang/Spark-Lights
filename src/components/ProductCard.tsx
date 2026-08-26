import { Link } from 'react-router-dom';
import { FiPlus, FiMessageCircle } from 'react-icons/fi';
import ProductImage from './ProductImage';
import { useCartStore } from '@/store/useCartStore';
import { BRAND } from '@/data/brand';
import { productPageUrl } from '@/lib/whatsappOrder';
import type { StoreProduct } from '@/types/product';

/** Short, rotating-style business highlights shown on hover. */
const HOVER_MESSAGES = [
  'Visit our shop in Nyamakima, Duruma Road',
  'We do installations & supply',
  'Order via WhatsApp for same-day Nairobi delivery',
];

export default function ProductCard({ product }: { product: StoreProduct }) {
  const addItem = useCartStore((state) => state.addItem);

  const waHref = `${BRAND.whatsappUrl}?text=${encodeURIComponent(
    `Hi ${BRAND.name}, I'm interested in ${product.name} (KES ${product.price}). ${productPageUrl(product.slug)}`
  )}`;

  return (
    <div className="group flex flex-col h-full">
      <Link
        to={`/product/${product.slug}`}
        className="block product-image-frame mb-3 sm:mb-4 relative"
        aria-label={product.name}
      >
        <ProductImage
          src={product.img}
          alt={`${product.name} — KES ${product.price} Nairobi`}
          loading="lazy"
        />
        {product.badge && (
          <span className="absolute top-2 left-2 sm:top-3 sm:left-3 z-10 bg-primary-gold text-black text-[8px] sm:text-[9px] font-black px-2 py-0.5 sm:px-3 sm:py-1 uppercase tracking-widest">
            {product.badge}
          </span>
        )}
        <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity duration-500 hidden sm:flex flex-col items-center justify-center gap-2 p-4 text-center">
          {HOVER_MESSAGES.map((msg) => (
            <p
              key={msg}
              className="text-white text-[10px] font-bold uppercase tracking-widest leading-snug"
            >
              {msg}
            </p>
          ))}
        </div>
      </Link>

      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className="font-black uppercase text-white text-xs sm:text-sm leading-tight line-clamp-2 group-hover:text-primary-gold transition-colors">
          <Link to={`/product/${product.slug}`}>{product.name}</Link>
        </h3>
        <span className="product-price-label shrink-0">KES {product.price}</span>
      </div>

      <div className="flex items-center gap-1.5 sm:gap-2 mt-auto">
        <button
          onClick={() => addItem(product)}
          className="flex-1 bg-primary-gold text-black text-[9px] sm:text-[10px] font-black uppercase tracking-widest py-1.5 sm:py-2 px-2 hover:bg-white transition-colors"
        >
          Add to Cart
        </button>
        <a
          href={waHref}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 bg-white/10 text-white text-[9px] sm:text-[10px] font-black uppercase tracking-widest py-1.5 sm:py-2 px-2 hover:bg-primary-pink hover:text-white transition-colors text-center flex items-center justify-center gap-1"
        >
          <FiMessageCircle size={11} className="sm:hidden" />
          Order via WhatsApp
        </a>
      </div>
    </div>
  );
}
