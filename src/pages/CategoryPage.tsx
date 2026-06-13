import { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiArrowLeft, FiPlus } from 'react-icons/fi';
import { useProducts } from '../context/ProductContext';
import { getCategoryBySlug } from '../data/categories';
import { filterByCategory } from '../lib/searchProducts';
import { useCartStore } from '../store/useCartStore';
import { usePageSEO } from '../hooks/usePageSEO';
import { BRAND } from '../data/brand';

export default function CategoryPage() {
  const { slug } = useParams<{ slug: string }>();
  const category = slug ? getCategoryBySlug(slug) : undefined;
  const addItem = useCartStore((state) => state.addItem);
  const { products: allProducts } = useProducts();

  const products = useMemo(
    () => (slug ? filterByCategory(allProducts, slug) : []),
    [slug, allProducts]
  );

  usePageSEO({
    title: category ? category.seoTitle : `Lighting Categories | ${BRAND.name}`,
    description: category?.metaDescription ?? `Browse lighting categories at ${BRAND.name}, Nairobi.`,
    path: slug ? `/category/${slug}` : '/shop',
    keywords: category?.seoKeywords,
  });

  if (!category) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 px-6">
        <h1 className="text-4xl font-black uppercase text-white">Category not found</h1>
        <Link to="/shop" className="btn-primary">Back to Shop</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-32">
      <section className="py-24 sm:py-32 border-b border-white/5 bg-secondary-black">
        <div className="container mx-auto px-6">
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-primary-gold transition-colors mb-10"
          >
            <FiArrowLeft size={14} /> All Products — Chandeliers Nairobi Price
          </Link>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="text-primary-gold uppercase tracking-[0.6em] text-[10px] font-black mb-6 block">
              {category.name}
            </span>
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black uppercase leading-none tracking-tighter mb-8 text-white">
              {category.seoH1}
            </h1>
            <p className="text-gray-400 text-lg font-medium max-w-3xl leading-relaxed mb-6">
              {category.seoIntro}
            </p>
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-600">
              {products.length} product{products.length === 1 ? '' : 's'} · prices shown on each listing · same-day Nairobi delivery
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-12 sm:py-24">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-8 lg:gap-12">
            <AnimatePresence mode="popLayout">
              {products.map((product) => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="group"
                >
                  <div className="product-image-frame mb-3 sm:mb-8">
                    <img
                      src={product.img}
                      alt={`${product.name} — KES ${product.price} Nairobi`}
                    />
                    <div className="absolute top-2 left-2 sm:top-6 sm:left-6 z-10 flex flex-col gap-1.5 sm:gap-2">
                      {product.badge && (
                        <span className="bg-primary-gold text-white text-[8px] sm:text-[9px] font-black px-2 py-0.5 sm:px-4 sm:py-1 uppercase tracking-widest">
                          {product.badge}
                        </span>
                      )}
                    </div>
                    <span className="product-price-badge">KES {product.price}</span>
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
                          className="btn-secondary w-full text-[10px] flex items-center justify-center"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  </div>

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
                    <h2 className="text-sm sm:text-xl font-black uppercase tracking-tighter text-white group-hover:text-primary-pink transition-colors mb-1 sm:mb-2 line-clamp-2">
                      {product.name}
                    </h2>
                    <p className="product-price-label">KES {product.price}</p>
                    <p className="text-[8px] sm:text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-0.5">
                      Nairobi · same-day delivery
                    </p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {products.length === 0 && (
            <div className="py-48 text-center">
              <h2 className="text-4xl font-black uppercase tracking-tighter text-white mb-6">
                No products in this category yet.
              </h2>
              <Link to="/shop" className="btn-primary">Browse All Lights</Link>
            </div>
          )}

          {category.relatedSlugs.length > 0 && (
            <div className="mt-20 pt-12 border-t border-white/5">
              <h2 className="text-sm font-black uppercase tracking-widest text-gray-500 mb-6">Related Categories</h2>
              <div className="flex flex-wrap gap-3">
                {category.relatedSlugs.map((related) => {
                  const rel = getCategoryBySlug(related);
                  if (!rel) return null;
                  return (
                    <Link
                      key={related}
                      to={`/category/${related}`}
                      className="text-[10px] font-black uppercase tracking-widest px-4 py-2 border border-white/10 text-gray-400 hover:border-primary-gold hover:text-primary-gold transition-colors"
                    >
                      {rel.seoH1}
                    </Link>
                  );
                })}
                <Link
                  to="/installation"
                  className="text-[10px] font-black uppercase tracking-widest px-4 py-2 border border-primary-gold/30 text-primary-gold hover:bg-primary-gold/10 transition-colors"
                >
                  Installation Services Nairobi
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
