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
    title: category ? `${category.seoTitle} | ${BRAND.name}` : `Lighting Categories | ${BRAND.name}`,
    description: category
      ? `Shop ${category.name.toLowerCase()} in Nairobi. ${category.description} Same-day delivery. Order on WhatsApp — ${BRAND.name}, Nyamakima.`
      : `Browse lighting categories at ${BRAND.name}, Nairobi.`,
    path: slug ? `/category/${slug}` : '/shop',
    keywords: category ? `${category.name} Nairobi, ${category.slug} Kenya, lighting shop Nyamakima` : undefined,
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
            <FiArrowLeft size={14} /> All Products
          </Link>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="text-primary-gold uppercase tracking-[0.6em] text-[10px] font-black mb-6 block">
              Category
            </span>
            <h1 className="text-5xl sm:text-8xl font-black uppercase leading-none tracking-tighter mb-8">
              {category.name}
            </h1>
            <p className="text-gray-500 text-lg font-medium max-w-2xl leading-relaxed">
              {category.description}
            </p>
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-600 mt-6">
              {products.length} product{products.length === 1 ? '' : 's'}
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12">
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
                  <div className="aspect-[3/4] overflow-hidden bg-tertiary-black border border-white/5 relative mb-8">
                    <img
                      src={product.img}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110"
                    />
                    <div className="absolute top-6 left-6 z-10 flex flex-col gap-2">
                      {product.badge && (
                        <span className="bg-primary-gold text-white text-[9px] font-black px-4 py-1 uppercase tracking-widest">
                          {product.badge}
                        </span>
                      )}
                      <span className="bg-black text-white text-[9px] font-black px-4 py-1 uppercase tracking-widest border border-white/5">
                        KES {product.price}
                      </span>
                    </div>
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
                          className="btn-secondary w-full py-4 text-[10px] flex items-center justify-center"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  </div>
                  <div className="text-center px-4">
                    <h3 className="text-xl font-black uppercase tracking-tighter text-white group-hover:text-primary-pink transition-colors mb-2">
                      {product.name}
                    </h3>
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
        </div>
      </section>
    </div>
  );
}
