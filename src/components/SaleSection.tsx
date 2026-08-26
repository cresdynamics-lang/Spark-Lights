import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { useSaleProducts } from '@/hooks/useSaleProducts';
import SaleCarousel from './SaleCarousel';

export default function SaleSection() {
  const { products, loading } = useSaleProducts();
  const trackRef = useRef<HTMLDivElement>(null);

  const scrollBy = (direction: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;
    const amount = Math.min(track.clientWidth * 0.85, 640);
    track.scrollBy({ left: direction * amount, behavior: 'smooth' });
  };

  if (loading || products.length === 0) return null;

  return (
    <section className="py-20 sm:py-28 bg-secondary-black">
      <div className="container mx-auto px-6">
        <div className="flex flex-row items-end justify-between gap-2 sm:gap-6 mb-8 sm:mb-14">
          <div className="min-w-0 flex-1">
            <span className="text-primary-gold uppercase tracking-[0.35em] sm:tracking-[0.5em] text-[8px] sm:text-[10px] font-black mb-2 sm:mb-4 block">
              Limited Time
            </span>
            <h2 className="text-2xl sm:text-4xl lg:text-6xl font-black uppercase tracking-tighter text-white leading-none">
              On Sale
            </h2>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 shrink-0 self-end">
            <button
              onClick={() => scrollBy(-1)}
              className="w-10 h-10 sm:w-12 sm:h-12 border border-white/15 flex items-center justify-center hover:bg-primary-gold hover:border-primary-gold transition-all text-white"
              aria-label="Previous sale item"
            >
              <FiChevronLeft size={20} />
            </button>
            <button
              onClick={() => scrollBy(1)}
              className="w-10 h-10 sm:w-12 sm:h-12 border border-white/15 flex items-center justify-center hover:bg-primary-gold hover:border-primary-gold transition-all text-white"
              aria-label="Next sale item"
            >
              <FiChevronRight size={20} />
            </button>
            <Link
              to="/shop"
              className="btn-secondary btn-compact text-[8px] sm:text-[10px] px-2 py-2 sm:px-5 sm:py-3 whitespace-nowrap ml-1 sm:ml-2"
            >
              <span className="sm:hidden">Sale →</span>
              <span className="hidden sm:inline">Shop the Sale →</span>
            </Link>
          </div>
        </div>

        <SaleCarousel products={products} trackRef={trackRef} />
      </div>
    </section>
  );
}
