import { Link } from 'react-router-dom';
import { useSaleProducts } from '@/hooks/useSaleProducts';
import SaleCarousel from './SaleCarousel';

export default function SaleSection() {
  const { products, loading } = useSaleProducts();

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
          <Link
            to="/shop"
            className="btn-secondary btn-compact shrink-0 self-end text-[8px] sm:text-[10px] px-2 py-1.5 sm:px-5 sm:py-3 whitespace-nowrap"
          >
            <span className="sm:hidden">Shop Sale →</span>
            <span className="hidden sm:inline">Shop the Sale →</span>
          </Link>
        </div>

        <SaleCarousel products={products} />
      </div>
    </section>
  );
}
