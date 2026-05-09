import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiFilter, FiSearch, FiArrowRight, FiPlus } from 'react-icons/fi';
import { PRODUCTS, OCCASIONS } from '../data/content';
import { useCartStore } from '../store/useCartStore';

const CATEGORIES = [
  { id: 'all', name: 'All Collections' },
  ...OCCASIONS.map(occ => ({ id: occ.id, name: occ.name }))
];

const PRICE_RANGES = [
  { id: 'all', name: 'All Prices' },
  { id: 'under-5k', name: 'Under KES 5,000' },
  { id: '5k-10k', name: 'KES 5,000 – 10,000' },
  { id: 'over-10k', name: 'Over KES 10,000' },
];

export default function Shop() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [activePrice, setActivePrice] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const addItem = useCartStore((state) => state.addItem);

  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter(product => {
      const matchesCategory = activeCategory === 'all' || (product as any).categories?.includes(activeCategory) || (product as any).tag === activeCategory;
      const priceValue = parseInt(product.price.replace(/,/g, ''));
      
      let matchesPrice = true;
      if (activePrice === 'under-5k') matchesPrice = priceValue < 5000;
      else if (activePrice === '5k-10k') matchesPrice = priceValue >= 5000 && priceValue <= 10000;
      else if (activePrice === 'over-10k') matchesPrice = priceValue > 10000;

      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesCategory && matchesPrice && matchesSearch;
    });
  }, [activeCategory, activePrice, searchQuery]);

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
              <span className="text-primary-pink uppercase tracking-[0.6em] text-[10px] font-black mb-6 block">The Gallery</span>
              <h1 className="text-6xl sm:text-8xl font-black uppercase leading-none tracking-tighter mb-8">Elevated <br/> Bloom Curation</h1>
              <p className="text-gray-500 text-lg font-medium max-w-2xl leading-relaxed">
                Explore our meticulously curated selection of seasonal masterpieces, each artisanally crafted to define your most precious moments.
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
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-colors ${
                  activeCategory === cat.id ? 'text-primary-pink border-b border-primary-pink' : 'text-gray-600 hover:text-white'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-80">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={16} />
            <input 
              type="text" 
              placeholder="Search Curation..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-full py-3 pl-12 pr-6 text-[11px] font-black uppercase tracking-widest focus:outline-none focus:border-primary-pink transition-colors text-white"
            />
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12">
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
                  <div className="aspect-[3/4] overflow-hidden bg-tertiary-black border border-white/5 relative mb-8">
                    <img src={product.img} alt={product.name} className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110" />
                    <div className="absolute top-6 left-6 z-10 flex flex-col gap-2">
                      {product.badge && <span className="bg-primary-gold text-white text-[9px] font-black px-4 py-1 uppercase tracking-widest shadow-xl">{product.badge}</span>}
                      <span className="bg-black text-white text-[9px] font-black px-4 py-1 uppercase tracking-widest shadow-xl border border-white/5">KES {product.price}</span>
                    </div>
                    
                    {/* Action Overlay */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-center items-center p-12 text-center gap-6">
                      <p className="text-gray-300 text-sm font-medium leading-relaxed">{product.shortDesc}</p>
                      <div className="flex flex-col gap-4 w-full">
                        <button 
                          onClick={() => addItem(product)}
                          className="btn-primary w-full py-4 text-[10px] flex items-center justify-center gap-2"
                        >
                          <FiPlus /> Add to Cart
                        </button>
                        <Link 
                          to={`/product/${product.slug}`}
                          className="btn-secondary w-full py-4 text-[10px] flex items-center justify-center hover:border-primary-pink hover:text-primary-pink transition-all"
                        >
                          View Masterpiece
                        </Link>
                      </div>
                    </div>
                  </div>
                  <div className="text-center px-4">
                    <h3 className="text-xl font-black uppercase tracking-tighter text-white group-hover:text-primary-pink transition-colors mb-2 leading-none">{product.name}</h3>
                    <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-600 block">{(product as any).tag || ''}</span>
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
            <h2 className="text-4xl sm:text-6xl font-black uppercase tracking-tighter text-white leading-none mb-8">Corporate <br/> & Large Scale</h2>
            <p className="text-gray-500 font-medium leading-relaxed">Elevate your office, hotel, or gala event with our exclusive artisan partnerships. Custom subscriptions and volume pricing available.</p>
          </div>
          <button className="btn-primary py-6 px-16 flex items-center gap-4 group">
            Request Proposal <FiArrowRight className="group-hover:translate-x-2 transition-transform" />
          </button>
        </div>
      </section>
    </div>
  );
}
