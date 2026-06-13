import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiSearch, FiX } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { useProducts } from '../context/ProductContext';
import { searchProducts } from '../lib/searchProducts';
import { getCategoryName } from '../data/categories';

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const { products } = useProducts();
  const results = useMemo(() => searchProducts(products, query), [products, query]);
  const isHighlightMode = query.trim().length === 0;

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[250] bg-black/90 backdrop-blur-xl"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="container mx-auto px-6 pt-28 pb-12 max-h-screen overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="relative flex-1">
                <FiSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-primary-gold" size={20} />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search lights, categories..."
                  className="w-full bg-white/5 border-2 border-primary-gold/40 rounded-2xl py-5 pl-14 pr-6 text-white text-sm font-medium focus:outline-none focus:border-primary-gold transition-colors"
                />
              </div>
              <button
                onClick={onClose}
                className="p-4 rounded-2xl border border-white/10 text-gray-400 hover:text-white hover:border-white/30 transition-colors"
                aria-label="Close search"
              >
                <FiX size={22} />
              </button>
            </div>

            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 mb-6">
              {isHighlightMode
                ? `${results.length} products — start typing to filter`
                : `${results.length} result${results.length === 1 ? '' : 's'} for "${query}"`}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {results.map((product) => (
                <Link
                  key={product.id}
                  to={`/product/${product.slug}`}
                  onClick={onClose}
                  className={`group flex gap-4 p-4 rounded-2xl border bg-secondary-black transition-all duration-300 ${
                    isHighlightMode
                      ? 'border-primary-gold/60 shadow-[0_0_24px_rgba(212,175,55,0.25)] ring-1 ring-primary-gold/30'
                      : 'border-white/10 hover:border-primary-pink/50'
                  }`}
                >
                  <img
                    src={product.img}
                    alt={product.name}
                    className="w-20 h-20 object-cover rounded-xl flex-shrink-0"
                  />
                  <div className="min-w-0">
                    <h3 className="text-sm font-black uppercase tracking-tight text-white group-hover:text-primary-gold transition-colors truncate">
                      {product.name}
                    </h3>
                    <p className="text-primary-gold text-xs font-bold mt-1">KES {product.price}</p>
                    <p className="text-[10px] text-gray-500 mt-1 line-clamp-2">{product.shortDesc}</p>
                    <p className="text-[9px] text-gray-600 uppercase tracking-widest mt-2 truncate">
                      {(product.categories ?? []).map(getCategoryName).join(' · ')}
                    </p>
                  </div>
                </Link>
              ))}
            </div>

            {results.length === 0 && (
              <div className="py-24 text-center">
                <p className="text-gray-500 font-medium">No products match your search.</p>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
