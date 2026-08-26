import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiFilter, FiSearch, FiArrowRight } from 'react-icons/fi';
import { useSearchParams, Link } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import { LIGHT_CATEGORIES } from '../data/categories';
import { filterByCategory, searchProducts } from '../lib/searchProducts';
import { getCategoryName } from '../data/categories';
import { usePageSEO } from '../hooks/usePageSEO';
import { BRAND } from '../data/brand';
import ProductCard from '../components/ProductCard';
import SaleSection from '../components/SaleSection';

const CATEGORIES = [
  { id: 'all', name: 'All Lights' },
  ...LIGHT_CATEGORIES.map((cat) => ({ id: cat.slug, name: cat.name })),
];

const PRICE_RANGES = [
  { id: 'all', name: 'All Prices' },
  { id: 'under-5k', name: 'Under KES 5,000' },
  { id: '5k-10k', name: 'KES 5,000 – 10,000' },
  { id: 'over-10k', name: 'Over KES 10,000' },
];

export default function Shop() {
  usePageSEO({
    title: 'Chandeliers in Nairobi Price | Shop All Lighting | Spark Lights 254',
    description:
      'Browse chandeliers in Nairobi price listings, modern ceiling lights, pendant lights Kenya & outdoor solar lighting. Every product shows KES price. Nyamakima shop · same-day delivery.',
    path: '/shop',
    keywords: 'chandeliers in Nairobi price, modern ceiling lights Nairobi, pendant lights Kenya, buy lights Nairobi, lighting shop Nyamakima',
  });

  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') ?? 'all';
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [activePrice, setActivePrice] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const { products, loading } = useProducts();

  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) setActiveCategory(cat);
  }, [searchParams]);

  const filteredProducts = useMemo(() => {
    let list = filterByCategory(products, activeCategory);
    list = searchProducts(list, searchQuery);

    return list.filter((product) => {
      const priceValue = parseInt(product.price.replace(/,/g, ''), 10);
      if (activePrice === 'under-5k') return priceValue < 5000;
      if (activePrice === '5k-10k') return priceValue >= 5000 && priceValue <= 10000;
      if (activePrice === 'over-10k') return priceValue > 10000;
      return true;
    });
  }, [activeCategory, activePrice, searchQuery, products]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">Loading products…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-32">
      {/* Editorial Header */}
      <section className="py-24 sm:py-32 border-b border-white/5 bg-secondary-black">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1 }}
            >
              <span className="text-primary-pink uppercase tracking-[0.6em] text-[10px] font-black mb-6 block">Shop</span>
              <h1 className="text-5xl sm:text-7xl font-black uppercase leading-none tracking-tighter mb-8 text-white">
                Chandeliers in Nairobi <br /> Price &amp; Catalog
              </h1>
              <p className="text-gray-500 text-lg font-medium max-w-2xl leading-relaxed">
                Modern ceiling lights Nairobi, pendant lights Kenya, gypsum board lighting fixtures, wall brackets,
                and outdoor solar security lights — every listing shows the KES price. Filter by category or search.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      <SaleSection />

      {/* Filters Bar */}
      <section className="sticky top-[80px] sm:top-[96px] z-50 bg-black/95 border-b border-white/5 backdrop-blur-xl">
        <div className="container mx-auto px-6 py-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-12 overflow-x-auto no-scrollbar w-full md:w-auto">
            <div className="flex items-center gap-4 text-gray-500 flex-shrink-0">
              <FiFilter size={14} />
              <span className="text-[10px] font-black uppercase tracking-widest">Filter</span>
            </div>
            {CATEGORIES.map(cat => (
              cat.id === 'all' ? (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory('all')}
                  className={`text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-colors ${
                    activeCategory === 'all' ? 'text-primary-pink border-b border-primary-pink' : 'text-gray-600 hover:text-white'
                  }`}
                >
                  {cat.name}
                </button>
              ) : (
                <Link
                  key={cat.id}
                  to={`/category/${cat.id}`}
                  className={`text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-colors ${
                    activeCategory === cat.id ? 'text-primary-pink border-b border-primary-pink' : 'text-gray-600 hover:text-white'
                  }`}
                >
                  {cat.name}
                </Link>
              )
            ))}
          </div>

          <div className="relative w-full md:w-80">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={16} />
            <input 
              type="text" 
              placeholder="Search lights..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-full py-3 pl-12 pr-6 text-[11px] font-black uppercase tracking-widest focus:outline-none focus:border-primary-pink transition-colors text-white"
            />
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-12 sm:py-24">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-8 lg:gap-12">
            <AnimatePresence mode="popLayout">
              {filteredProducts.map((product) => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.5 }}
                  className="group"
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {filteredProducts.length === 0 && (
            <div className="py-48 text-center">
              <span className="text-gray-700 font-black uppercase tracking-[0.5em] text-[10px] block mb-6">No matches found</span>
              <h2 className="text-4xl font-black uppercase tracking-tighter text-white mb-10">
                {products.length === 0
                  ? 'No products in the database yet.'
                  : "We couldn't find your selection."}
              </h2>
              {products.length > 0 ? (
                <button 
                  onClick={() => { setActiveCategory('all'); setActivePrice('all'); setSearchQuery(''); }}
                  className="btn-primary"
                >
                  Reset All Filters
                </button>
              ) : (
                <Link to="/" className="btn-primary">Back Home</Link>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Corporate Inquiry Banner */}
      <section className="py-24 container mx-auto px-6">
        <div className="bg-secondary-black border border-white/5 p-16 sm:p-24 flex flex-col lg:flex-row justify-between items-center gap-12 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-primary-gold/5 blur-[120px] -z-10 group-hover:bg-primary-gold/10 transition-all duration-1000"></div>
          <div className="max-w-2xl text-center lg:text-left">
            <span className="text-primary-gold uppercase tracking-[0.5em] text-[10px] font-black mb-6 block">Bespoke Curation</span>
            <h2 className="text-4xl sm:text-6xl font-black uppercase tracking-tighter text-white leading-none mb-8">Commercial <br/> &amp; Bulk Orders</h2>
            <p className="text-gray-500 font-medium leading-relaxed">Wholesale electrical shops Nairobi — offices, hotels, restaurants, and developers. Volume pricing on chandeliers, gypsum LED profiles &amp; corridor panels.</p>
          </div>
          <Link to="/wholesale" className="btn-primary w-full sm:w-auto py-4 sm:py-6 px-8 sm:px-16 flex items-center justify-center gap-3 sm:gap-4 group text-center">
            Wholesale Quote <FiArrowRight className="group-hover:translate-x-2 transition-transform" />
          </Link>
        </div>
      </section>
    </div>
  );
}
