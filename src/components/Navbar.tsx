import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiSearch, FiShoppingCart, FiChevronDown, FiMenu, FiX } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { LIGHT_CATEGORIES } from '../data/categories';
import { useCartStore } from '../store/useCartStore';
import CartOverlay from './CartOverlay';
import SearchOverlay from './SearchOverlay';
import BrandLogo from './BrandLogo';

export default function Navbar() {
  const [isShopOpen, setIsShopOpen] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  
  const getItemCount = useCartStore((state) => state.getItemCount());

  useEffect(() => {
    if (!isMobileMenuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isMobileMenuOpen]);

  const dropdownVariants = {
    hidden: { opacity: 0, y: 15, pointerEvents: 'none' as const },
    visible: { 
      opacity: 1, 
      y: 0, 
      pointerEvents: 'auto' as const,
      transition: { duration: 0.3, ease: "easeOut" as const } 
    }
  };

  return (
    <>
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="fixed top-0 left-0 right-0 z-[100] bg-black/80 border-b border-white/5 backdrop-blur-2xl transition-all duration-500"
      >
        <div className="container mx-auto px-6 h-20 sm:h-24 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden text-white hover:text-primary-gold transition-colors"
            >
              {isMobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
            <BrandLogo size="md" />
          </div>

          <ul className="hidden lg:flex items-center gap-12 h-full">
            <li className="h-full flex items-center">
              <Link to="/" className="text-[11px] font-black uppercase tracking-[0.2em] hover:text-primary-pink transition-colors relative group">
                Home
                <span className="absolute -bottom-1 left-0 w-0 h-[1.5px] bg-primary-pink transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </li>

            {/* Shop Dropdown */}
            <li 
              className="h-full flex items-center relative"
              onMouseEnter={() => setIsShopOpen(true)}
              onMouseLeave={() => setIsShopOpen(false)}
            >
              <Link to="/shop" className="text-[11px] font-black uppercase tracking-[0.2em] hover:text-primary-pink transition-colors flex items-center gap-2 group">
                Shop
                <FiChevronDown className={`transition-transform duration-300 ${isShopOpen ? 'rotate-180' : ''}`} />
                <span className="absolute -bottom-1 left-0 w-0 h-[1.5px] bg-primary-pink transition-all duration-300 group-hover:w-full"></span>
              </Link>
              
              <AnimatePresence>
                {isShopOpen && (
                  <motion.div 
                    variants={dropdownVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    className="absolute top-full left-0 w-64 bg-secondary-black border border-white/5 p-6 shadow-2xl"
                  >
                    <ul className="space-y-4">
                      <li>
                        <Link to="/shop" className="text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-primary-gold transition-colors block">
                          All Products
                        </Link>
                      </li>
                      {LIGHT_CATEGORIES.slice(0, 5).map((cat) => (
                        <li key={cat.slug}>
                          <Link to={`/category/${cat.slug}`} className="text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-primary-gold transition-colors block">
                            {cat.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>
            </li>

            {/* Categories Dropdown */}
            <li 
              className="h-full flex items-center relative"
              onMouseEnter={() => setIsCategoriesOpen(true)}
              onMouseLeave={() => setIsCategoriesOpen(false)}
            >
              <span className="text-[11px] font-black uppercase tracking-[0.2em] hover:text-primary-pink transition-colors flex items-center gap-2 group cursor-default">
                Categories
                <FiChevronDown className={`transition-transform duration-300 ${isCategoriesOpen ? 'rotate-180' : ''}`} />
              </span>
              
              <AnimatePresence>
                {isCategoriesOpen && (
                  <motion.div 
                    variants={dropdownVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    className="absolute top-full left-0 w-72 bg-secondary-black border border-white/5 p-6 shadow-2xl"
                  >
                    <div className="grid grid-cols-1 gap-4">
                      {LIGHT_CATEGORIES.map((cat) => (
                        <Link key={cat.slug} to={`/category/${cat.slug}`} className="text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-primary-gold transition-colors flex items-center gap-3">
                          <span className="w-1.5 h-1.5 bg-primary-gold/30 rounded-full"></span>
                          {cat.name}
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </li>

            <li className="h-full flex items-center">
              <Link to="/installation" className="text-[11px] font-black uppercase tracking-[0.2em] hover:text-primary-gold transition-colors relative group">
                Install
                <span className="absolute -bottom-1 left-0 w-0 h-[1.5px] bg-primary-gold transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </li>

            <li className="h-full flex items-center">
              <Link to="/light-guide" className="text-[11px] font-black uppercase tracking-[0.2em] hover:text-primary-gold transition-colors relative group">
                Light Guide
                <span className="absolute -bottom-1 left-0 w-0 h-[1.5px] bg-primary-gold transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </li>

            <li className="h-full flex items-center">
              <Link to="/about" className="text-[11px] font-black uppercase tracking-[0.2em] hover:text-primary-gold transition-colors relative group">
                About
                <span className="absolute -bottom-1 left-0 w-0 h-[1.5px] bg-primary-gold transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </li>

            <li className="h-full flex items-center">
              <Link to="/contact" className="text-[11px] font-black uppercase tracking-[0.2em] hover:text-primary-gold transition-colors relative group">
                Contact
                <span className="absolute -bottom-1 left-0 w-0 h-[1.5px] bg-primary-gold transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </li>
          </ul>

          <div className="flex items-center gap-4 sm:gap-8">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="hover:text-primary-gold transition-all hover:scale-110"
              aria-label="Search products"
            >
              <FiSearch size={20} />
            </button>
            <button 
              onClick={() => setIsCartOpen(true)}
              className="hover:text-primary-gold transition-all hover:scale-110 relative"
            >
              <FiShoppingCart size={20} />
              {getItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary-pink text-white text-[9px] w-5 h-5 rounded-full flex items-center justify-center font-black shadow-lg shadow-primary-pink/20">
                  {getItemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </motion.nav>

      <CartOverlay isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      {/* Mobile Menu — scrollable when categories overflow */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className="fixed inset-0 z-[90] bg-primary-black lg:hidden flex flex-col"
          >
            <div className="h-20 sm:h-24 shrink-0" aria-hidden />
            <div className="flex-1 min-h-0 overflow-y-auto overscroll-y-contain px-6 sm:px-10 pb-10 [-webkit-overflow-scrolling:touch]">
              <ul className="space-y-6 sm:space-y-8 pb-6">
                {[
                  { label: 'Home', to: '/' },
                  { label: 'Shop', to: '/shop' },
                  { label: 'Install', to: '/installation' },
                  { label: 'Blog', to: '/blog' },
                  { label: 'Light Guide', to: '/light-guide' },
                  { label: 'About', to: '/about' },
                  { label: 'Contact', to: '/contact' },
                ].map((item) => (
                  <li key={item.label}>
                    <Link
                      to={item.to}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="text-3xl sm:text-4xl font-black uppercase italic tracking-tighter text-white hover:text-primary-gold transition-colors"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
                <li className="pt-4 border-t border-white/10">
                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-600 block mb-4">Categories</span>
                  <ul className="space-y-3 max-h-none">
                    {LIGHT_CATEGORIES.map((cat) => (
                      <li key={cat.slug}>
                        <Link
                          to={`/category/${cat.slug}`}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="text-base sm:text-lg font-black uppercase tracking-tight text-gray-400 hover:text-primary-gold transition-colors block py-0.5"
                        >
                          {cat.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </li>
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
