import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiFilter, FiSearch, FiArrowRight, FiPlus } from 'react-icons/fi';
import { useSearchParams, Link } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import { LIGHT_CATEGORIES } from '../data/categories';
import { filterByCategory, searchProducts } from '../lib/searchProducts';
import { getCategoryName } from '../data/categories';
import { useCartStore } from '../store/useCartStore';
import { usePageSEO } from '../hooks/usePageSEO';
import { BRAND } from '../data/brand';

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
  const addItem = useCartStore((state) => state.addItem);
  const { products } = useProducts();

  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) setActiveCategory(cat);
  }, [searchParams]);

  const filteredProducts = useMemo(() => {
    let list = filterByCategory(products, activeCategory);
    list = searchProducts(list, searchQuery);

    return list.filter((product) => {
      const priceValue = parseInt(product.price.replace(/,/g, ''));
      if (activePrice === 'under-5k') return priceValue < 5000;
      if (activePrice === '5k-10k') return priceValue >= 5000 && priceValue <= 10000;
      if (activePrice === 'over-10k') return priceValue > 10000;
      return true;
    });
  }, [activeCategory, activePrice, searchQuery, products]);

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
                  <div className="product-image-frame mb-3 sm:mb-8">
                    <img src={product.img} alt={product.name} />
                    <div className="absolute top-2 left-2 sm:top-6 sm:left-6 z-10 flex flex-col gap-1.5 sm:gap-2">
                      {product.badge && <span className="bg-primary-gold text-white text-[8px] sm:text-[9px] font-black px-2 py-0.5 sm:px-4 sm:py-1 uppercase tracking-widest shadow-xl">{product.badge}</span>}
                    </div>
                    <span className="product-price-badge">KES {product.price}</span>
                    
                    {/* Desktop hover overlay */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-500 hidden sm:flex flex-col justify-center items-center p-6 lg:p-12 text-center gap-4 lg:gap-6">
                      <p className="text-gray-300 text-sm font-medium leading-relaxed line-clamp-4">{product.shortDesc}</p>
                      <div className="flex flex-col gap-3 w-full max-w-xs">
                        <button 
                          onClick={() => addItem(product)}
                          className="btn-primary w-full text-[10px] flex items-center justify-center gap-2"
                        >
                          <FiPlus /> Add to Cart
                        </button>
                        <Link 
                          to={`/product/${product.slug}`}
                          className="btn-secondary w-full text-[10px] flex items-center justify-center hover:border-primary-pink hover:text-primary-pink transition-all"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  </div>

                  {/* Mobile actions — always visible on touch */}
                  <div className="flex flex-col gap-2 sm:hidden mb-3">
                    <button
                      onClick={() => addItem(product)}
                      className="btn-primary w-full text-[9px] flex items-center justify-center gap-1.5"
                    >
                      <FiPlus size={12} /> Add to Cart
                    </button>
                    <Link
                      to={`/product/${product.slug}`}
                      className="btn-secondary w-full text-[9px] text-center"
                    >
                      View Details
                    </Link>
                  </div>

                  <div className="text-center px-1 sm:px-4">
                    <h3 className="text-sm sm:text-xl font-black uppercase tracking-tighter text-white group-hover:text-primary-pink transition-colors mb-1 sm:mb-2 leading-tight line-clamp-2">{product.name}</h3>
                    <p className="product-price-label">KES {product.price}</p>
                    <span className="text-[8px] sm:text-[10px] font-bold uppercase tracking-[0.2em] sm:tracking-[0.3em] text-gray-600 block line-clamp-1 mt-1">
                      {(product.categories ?? []).map(getCategoryName).join(' · ')}
                    </span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {filteredProducts.length === 0 && (
            <div className="py-48 text-center">
              <span className="text-gray-700 font-black uppercase tracking-[0.5em] text-[10px] block mb-6">No matches found</span>
              <h2 className="text-4xl font-black uppercase tracking-tighter text-white mb-10">We couldn't find your selection.</h2>
              <button 
                onClick={() => { setActiveCategory('all'); setActivePrice('all'); setSearchQuery(''); }}
                className="btn-primary"
              >
                Reset All Filters
              </button>
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
