import { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { FiSearch, FiShoppingCart, FiChevronDown, FiMenu, FiX } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { LIGHT_CATEGORIES } from '../data/categories';
import { useCartStore } from '../store/useCartStore';
import CartOverlay from './CartOverlay';
import SearchOverlay from './SearchOverlay';
import BrandLogo from './BrandLogo';

const NAV_LINK =
  'text-[11px] font-black uppercase tracking-[0.2em] transition-colors relative group';
const NAV_UNDERLINE =
  'absolute -bottom-1 left-0 h-[1.5px] bg-primary-gold transition-all duration-300';

export default function Navbar() {
  const [isShopOpen, setIsShopOpen] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const { pathname } = useLocation();

  const isCartOpen = useCartStore((state) => state.isOpen);
  const openCart = useCartStore((state) => state.openCart);
  const closeCart = useCartStore((state) => state.closeCart);
  const getItemCount = useCartStore((state) => state.getItemCount());

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!isMobileMenuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isMobileMenuOpen]);

  const isShopActive =
    pathname.startsWith('/shop') ||
    pathname.startsWith('/category') ||
    pathname.startsWith('/product');
  const isCatActive = pathname.startsWith('/category');

  const dropdownVariants = {
    hidden: { opacity: 0, y: 12, pointerEvents: 'none' as const },
    visible: {
      opacity: 1,
      y: 0,
      pointerEvents: 'auto' as const,
      transition: { duration: 0.25, ease: 'easeOut' as const },
    },
  };

  const linkClass = (active: boolean) =>
    `${NAV_LINK} ${active ? 'text-primary-gold' : 'text-white hover:text-primary-gold'}`;
  const underlineClass = (active: boolean) =>
    `${NAV_UNDERLINE} ${active ? 'w-full' : 'w-0 group-hover:w-full'}`;

  return (
    <>
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className={`bg-black/85 border-b backdrop-blur-2xl transition-all duration-500 ${
          scrolled
            ? 'border-white/10 shadow-lg shadow-black/40'
            : 'border-white/5'
        }`}
      >
        <div className="container mx-auto px-6 h-20 sm:h-24 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden text-white hover:text-primary-gold transition-colors"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
            <BrandLogo size="md" />
          </div>

          <ul className="hidden lg:flex items-center gap-10 h-full">
            <li className="h-full flex items-center">
              <NavLink to="/" className={({ isActive }) => linkClass(isActive)}>
                Home
                <span className={underlineClass(pathname === '/')} />
              </NavLink>
            </li>

            {/* Shop Dropdown */}
            <li
              className="h-full flex items-center relative"
              onMouseEnter={() => setIsShopOpen(true)}
              onMouseLeave={() => setIsShopOpen(false)}
            >
              <NavLink
                to="/shop"
                className={linkClass(isShopActive)}
                onMouseEnter={() => setIsShopOpen(true)}
              >
                <span className="flex items-center gap-2">
                  Shop
                  <FiChevronDown
                    className={`transition-transform duration-300 ${isShopOpen ? 'rotate-180' : ''}`}
                  />
                </span>
                <span className={underlineClass(isShopActive)} />
              </NavLink>

              <AnimatePresence>
                {isShopOpen && (
                  <motion.div
                    variants={dropdownVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    className="absolute top-full left-0 w-64 bg-secondary-black border border-white/10 border-t-2 border-t-primary-gold rounded-b-2xl p-3 shadow-2xl"
                  >
                    <Link
                      to="/shop"
                      className="block px-3 py-2.5 text-[10px] font-bold uppercase tracking-widest text-white hover:text-primary-gold hover:bg-white/5 rounded-lg transition-colors"
                    >
                      All Products
                    </Link>
                    <div className="my-1 h-px bg-white/5" />
                    {LIGHT_CATEGORIES.slice(0, 6).map((cat) => (
                      <Link
                        key={cat.slug}
                        to={`/category/${cat.slug}`}
                        className="block px-3 py-2.5 text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-primary-gold hover:bg-white/5 rounded-lg transition-colors"
                      >
                        {cat.name}
                      </Link>
                    ))}
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
              <span
                className={`${linkClass(isCatActive)} cursor-default flex items-center gap-2`}
              >
                Categories
                <FiChevronDown
                  className={`transition-transform duration-300 ${isCategoriesOpen ? 'rotate-180' : ''}`}
                />
                <span className={underlineClass(isCatActive)} />
              </span>

              <AnimatePresence>
                {isCategoriesOpen && (
                  <motion.div
                    variants={dropdownVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    className="absolute top-full left-0 w-72 bg-secondary-black border border-white/10 border-t-2 border-t-primary-gold rounded-b-2xl p-3 shadow-2xl"
                  >
                    <div className="grid grid-cols-1 gap-0.5">
                      {LIGHT_CATEGORIES.map((cat) => (
                        <Link
                          key={cat.slug}
                          to={`/category/${cat.slug}`}
                          className="flex items-center gap-3 px-3 py-2.5 text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-primary-gold hover:bg-white/5 rounded-lg transition-colors"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-primary-gold/40" />
                          {cat.name}
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </li>

            <li className="h-full flex items-center">
              <NavLink to="/installation" className={({ isActive }) => linkClass(isActive)}>
                Install
                <span className={underlineClass(pathname.startsWith('/installation'))} />
              </NavLink>
            </li>

            <li className="h-full flex items-center">
              <NavLink to="/light-guide" className={({ isActive }) => linkClass(isActive)}>
                Light Guide
                <span className={underlineClass(pathname.startsWith('/light-guide'))} />
              </NavLink>
            </li>

            <li className="h-full flex items-center">
              <NavLink to="/blog" className={({ isActive }) => linkClass(isActive)}>
                Blog
                <span className={underlineClass(pathname.startsWith('/blog'))} />
              </NavLink>
            </li>

            <li className="h-full flex items-center">
              <NavLink to="/about" className={({ isActive }) => linkClass(isActive)}>
                About
                <span className={underlineClass(pathname.startsWith('/about'))} />
              </NavLink>
            </li>

            <li className="h-full flex items-center">
              <NavLink to="/contact" className={({ isActive }) => linkClass(isActive)}>
                Contact
                <span className={underlineClass(pathname.startsWith('/contact'))} />
              </NavLink>
            </li>
          </ul>

          <div className="flex items-center gap-4 sm:gap-7">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="text-white/80 hover:text-primary-gold transition-all hover:scale-110"
              aria-label="Search products"
            >
              <FiSearch size={20} />
            </button>
            <button
              onClick={openCart}
              className="text-white/80 hover:text-primary-gold transition-all hover:scale-110 relative"
              aria-label="Open cart"
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

      <CartOverlay isOpen={isCartOpen} onClose={closeCart} />
      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className="fixed inset-0 z-[90] bg-primary-black lg:hidden flex flex-col"
          >
            <div className="h-28 sm:h-32 shrink-0" aria-hidden />
            <div className="flex-1 min-h-0 overflow-y-auto overscroll-y-contain px-6 sm:px-10 pb-10 [-webkit-overflow-scrolling:touch]">
              <ul className="space-y-5 sm:space-y-7 pb-6">
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
                    <NavLink
                      to={item.to}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={({ isActive }) =>
                        `text-3xl sm:text-4xl font-black uppercase italic tracking-tighter transition-colors ${
                          isActive ? 'text-primary-gold' : 'text-white hover:text-primary-gold'
                        }`
                      }
                    >
                      {item.label}
                    </NavLink>
                  </li>
                ))}
                <li className="pt-4 border-t border-white/10">
                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-600 block mb-4">
                    Categories
                  </span>
                  <ul className="space-y-2.5">
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
