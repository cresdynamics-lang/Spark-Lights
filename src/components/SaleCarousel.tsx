import { type RefObject } from 'react';
import ProductCard from './ProductCard';
import type { StoreProduct } from '@/types/product';

interface SaleCarouselProps {
  products: StoreProduct[];
  trackRef: RefObject<HTMLDivElement | null>;
}

export default function SaleCarousel({ products, trackRef }: SaleCarouselProps) {
  return (
    <div
      ref={trackRef}
      className="flex gap-4 sm:gap-8 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-4 -mx-6 px-6 sm:mx-0 sm:px-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      {products.map((prod) => (
        <div key={prod.id} className="min-w-[68%] sm:min-w-[44%] md:min-w-[30%] lg:min-w-[23%] snap-start">
          <ProductCard product={prod} />
        </div>
      ))}
    </div>
  );
}
