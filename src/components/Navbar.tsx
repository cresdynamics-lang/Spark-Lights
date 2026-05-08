import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiSearch, FiShoppingCart, FiMessageCircle, FiChevronDown, FiMenu, FiX } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { OCCASIONS } from '../data/content';
import { useCartStore } from '../store/useCartStore';
import CartOverlay from './CartOverlay';

export default function Navbar() {
  const [isShopOpen, setIsShopOpen] = useState(false);
  const [isOccasionsOpen, setIsOccasionsOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const getItemCount = useCartStore((state) => state.getItemCount());

  const dropdownVariants = {
    hidden: { opacity: 0, y: 15, pointerEvents: 'none' as const },
    visible: { 
      opacity: 1, 
      y: 0, 
      pointerEvents: 'all' as const,
      transition: { duration: 0.3, ease: "easeOut" } 
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
              className="lg:hidden text-white hover:text-primary-pink transition-colors"
            >
              {isMobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
            <Link to="/" className="text-2xl sm:text-4xl font-black text-primary-pink tracking-tighter hover:scale-105 transition-transform duration-300">
              MARIGOLD
            </Link>
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
                      {['New Arrivals', 'Best Sellers', 'Gift Sets', 'Subscription', 'Bespoke'].map(item => (
                        <li key={item}>
                          <Link to={`/shop?filter=${item.toLowerCase().replace(' ', '-')}`} className="text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-primary-pink transition-colors block">
                            {item}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>
            </li>

            {/* Occasions Dropdown */}
            <li 
              className="h-full flex items-center relative"
              onMouseEnter={() => setIsOccasionsOpen(true)}
              onMouseLeave={() => setIsOccasionsOpen(false)}
            >
              <Link to="/occasions" className="text-[11px] font-black uppercase tracking-[0.2em] hover:text-primary-pink transition-colors flex items-center gap-2 group">
                Occasions
                <FiChevronDown className={`transition-transform duration-300 ${isOccasionsOpen ? 'rotate-180' : ''}`} />
                <span className="absolute -bottom-1 left-0 w-0 h-[1.5px] bg-primary-pink transition-all duration-300 group-hover:w-full"></span>
              </Link>
              
              <AnimatePresence>
                {isOccasionsOpen && (
                  <motion.div 
                    variants={dropdownVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    className="absolute top-full left-0 w-72 bg-secondary-black border border-white/5 p-6 shadow-2xl"
                  >
                    <div className="grid grid-cols-1 gap-4">
                      {OCCASIONS.slice(0, 6).map(occ => (
                        <Link key={occ.id} to={`/shop?category=${occ.id}`} className="text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-primary-pink transition-colors flex items-center gap-3">
                          <span className="w-1.5 h-1.5 bg-primary-pink/30 rounded-full"></span>
                          {occ.name}
                        </Link>
                      ))}
                      <Link to="/occasions" className="text-[9px] font-black uppercase tracking-widest text-primary-pink mt-4 border-t border-white/5 pt-4 inline-block">
                        View All Occasions →
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </li>

            <li className="h-full flex items-center">
              <Link to="/about" className="text-[11px] font-black uppercase tracking-[0.2em] hover:text-primary-pink transition-colors relative group">
                Our Story
                <span className="absolute -bottom-1 left-0 w-0 h-[1.5px] bg-primary-pink transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </li>

            <li className="h-full flex items-center">
              <Link to="/contact" className="text-[11px] font-black uppercase tracking-[0.2em] hover:text-primary-pink transition-colors relative group">
                Contact
                <span className="absolute -bottom-1 left-0 w-0 h-[1.5px] bg-primary-pink transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </li>
          </ul>

          <div className="flex items-center gap-4 sm:gap-8">
            <button className="hover:text-primary-pink transition-all hover:scale-110 hidden sm:block"><FiSearch size={20} /></button>
            <button 
              onClick={() => setIsCartOpen(true)}
              className="hover:text-primary-pink transition-all hover:scale-110 relative"
            >
              <FiShoppingCart size={20} />
              {getItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary-pink text-white text-[9px] w-5 h-5 rounded-full flex items-center justify-center font-black shadow-lg shadow-primary-pink/20">
                  {getItemCount}
                </span>
              )}
            </button>
            <motion.a 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href="https://wa.me/254700000000" 
              className="bg-[#25D366] hover:bg-[#128C7E] text-white px-5 sm:px-7 py-2.5 sm:py-3 rounded-none font-black text-[10px] sm:text-[11px] uppercase tracking-widest flex items-center gap-2 transition-all shadow-xl shadow-green-500/20"
            >
              <FiMessageCircle size={18} /> <span className="hidden md:inline">WhatsApp Order</span>
            </motion.a>
          </div>
        </div>
      </motion.nav>

      {/* Cart Overlay */}
      <CartOverlay isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className="fixed inset-0 z-[90] bg-primary-black pt-32 px-10 lg:hidden"
          >
            <ul className="space-y-8">
              {['Home', 'Shop', 'Occasions', 'Our Story', 'Contact'].map((item) => (
                <li key={item}>
                  <Link 
                    to={item === 'Home' ? '/' : item === 'Our Story' ? '/about' : `/${item.toLowerCase()}`}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-4xl font-black uppercase italic tracking-tighter text-white hover:text-primary-pink transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
