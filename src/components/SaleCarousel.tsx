import { type RefObject } from 'react';
import { Link } from 'react-router-dom';
import { FiPlus } from 'react-icons/fi';
import ProductImage from './ProductImage';
import { useCartStore } from '@/store/useCartStore';
import type { StoreProduct } from '@/types/product';

interface SaleCarouselProps {
  products: StoreProduct[];
  trackRef: RefObject<HTMLDivElement | null>;
}

export default function SaleCarousel({ products, trackRef }: SaleCarouselProps) {
  const addItem = useCartStore((state) => state.addItem);

  return (
    <div
      ref={trackRef}
      className="flex gap-4 sm:gap-8 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-4 -mx-6 px-6 sm:mx-0 sm:px-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      {products.map((prod) => (
        <div
          key={prod.id}
          className="group min-w-[44%] sm:min-w-[30%] lg:min-w-[23%] snap-start"
        >
          <Link to={`/product/${prod.slug}`} className="block product-image-frame mb-3 sm:mb-5">
            <ProductImage src={prod.img} alt={prod.name} loading="lazy" />
            <span className="absolute top-2 left-2 sm:top-4 sm:left-4 bg-primary-gold text-black text-[8px] sm:text-[9px] font-black px-2 py-0.5 sm:px-3 sm:py-1 uppercase z-10">
              {prod.badge || 'Sale'}
            </span>
            <span className="product-price-badge">KES {prod.price}</span>
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity hidden sm:flex flex-col justify-center items-center gap-3 p-4">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  addItem(prod);
                }}
                className="btn-primary w-full text-[10px] flex items-center justify-center gap-2"
              >
                <FiPlus size={14} /> Add to Cart
              </button>
              <span className="btn-secondary w-full text-[10px] text-center">View Details</span>
            </div>
          </Link>
          <div className="flex flex-col gap-2 sm:hidden mb-2">
            <button
              onClick={() => addItem(prod)}
              className="btn-primary w-full text-[9px] flex items-center justify-center gap-1.5"
            >
              <FiPlus size={12} /> Add to Cart
            </button>
            <Link to={`/product/${prod.slug}`} className="btn-secondary w-full text-[9px] text-center">
              View Details
            </Link>
          </div>
          <h3 className="font-black uppercase text-white text-xs sm:text-sm line-clamp-2">{prod.name}</h3>
          <p className="product-price-label">KES {prod.price}</p>
        </div>
      ))}
    </div>
  );
}
