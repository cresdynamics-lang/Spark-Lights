import { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiHeart, FiShoppingCart, FiChevronRight, FiCheckCircle, FiTruck } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa6';
import { useProducts } from '../context/ProductContext';
import { BRAND } from '../data/brand';
import { getCategoryName } from '../data/categories';
import { useCartStore } from '../store/useCartStore';
import { usePageSEO } from '../hooks/usePageSEO';
import {
  buildProductSeoTitle,
  buildProductSeoDescription,
  buildProductSeoKeywords,
} from '../lib/seo';
import DeliveryBanner from '../components/DeliveryBanner';
import ProductImage from '../components/ProductImage';

export default function ProductDetail() {
  const { slug } = useParams();
  const { products } = useProducts();
  const addItem = useCartStore((s) => s.addItem);
  const product = useMemo(() => products.find(p => p.slug === slug), [products, slug]);
  
  const [selectedSize, setSelectedSize] = useState(product?.sizes[0]?.label || '');
  const [quantity, setQuantity] = useState(1);

  usePageSEO({
    title: product ? buildProductSeoTitle(product) : 'Product | Spark Lights 254',
    description: product ? buildProductSeoDescription(product) : 'Lighting product at Spark Lights 254, Nairobi.',
    path: slug ? `/product/${slug}` : '/shop',
    keywords: product ? buildProductSeoKeywords(product) : undefined,
  });

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-4xl font-black uppercase mb-6">Product Not Found</h1>
        <Link to="/shop" className="btn-primary">Back to Shop</Link>
      </div>
    );
  }

  const currentPrice = product.sizes.find(s => s.label === selectedSize)?.price || product.price;

  return (
    <div className="min-h-screen pb-32">
      {/* Breadcrumbs */}
      <div className="bg-secondary-black/50 border-b border-white/5 py-4">
        <div className="container mx-auto px-6 flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-gray-500">
          <Link to="/" className="hover:text-primary-pink transition-colors">Home</Link>
          <FiChevronRight size={10} />
          <Link to="/shop" className="hover:text-primary-pink transition-colors">Shop</Link>
          <FiChevronRight size={10} />
          <span className="text-white">{product.name}</span>
        </div>
      </div>

      <div className="container mx-auto px-6 py-16 sm:py-24">
        <div className="flex flex-col lg:flex-row gap-16 xl:gap-24">
          {/* Image Gallery */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:w-1/2"
          >
            <div className="product-image-frame shadow-2xl">
              <ProductImage src={product.img} alt={product.name} loading="eager" fetchPriority="high" />
              {product.badge && (
                <div className="absolute top-4 left-4 sm:top-8 sm:left-8 bg-primary-gold text-white text-[9px] sm:text-[10px] font-black px-3 py-1.5 sm:px-4 sm:py-2 uppercase tracking-[0.2em] shadow-2xl">
                  {product.badge}
                </div>
              )}
            </div>
          </motion.div>

          {/* Product Info */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:w-1/2 flex flex-col"
          >
            <span className="text-primary-pink uppercase tracking-[0.4em] text-[10px] font-bold mb-4 block">{product.tag}</span>
            <div className="flex flex-wrap gap-2 mb-6">
              {(product.categories ?? []).map((slug) => (
                <Link
                  key={slug}
                  to={`/category/${slug}`}
                  className="text-[9px] font-black uppercase tracking-widest px-3 py-1 border border-primary-gold/30 text-primary-gold hover:bg-primary-gold/10 transition-colors"
                >
                  {getCategoryName(slug)}
                </Link>
              ))}
            </div>
            <h1 className="text-4xl sm:text-6xl font-serif mb-4 leading-tight">{product.name}</h1>
            <div className="flex items-center gap-6 mb-8">
              <span className="text-3xl font-bold text-primary-pink">KES {currentPrice}</span>
              {product.oldPrice && <span className="text-xl text-gray-600 line-through">KES {product.oldPrice}</span>}
            </div>
            <p className="text-[11px] font-black uppercase tracking-widest text-primary-gold mb-4">
              Public Nairobi price — no inbox quotes
            </p>
            <ul className="space-y-2 mb-8">
              {[
                'Same-day Nairobi delivery via Moto/Bolt from KES 500',
                'Supply & Fix: light + delivery + fundi install',
                'WhatsApp us to confirm stock before payment',
              ].map((line) => (
                <li key={line} className="flex gap-2 text-gray-500 text-xs">
                  <FiCheckCircle className="text-primary-gold shrink-0 mt-0.5" size={14} />
                  {line}
                </li>
              ))}
            </ul>

            <p className="text-gray-400 text-lg leading-relaxed mb-12 whitespace-pre-line italic font-serif">
              "{product.shortDesc}"
            </p>

            {/* Size Selector */}
            <div className="mb-12">
              <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-6">Select Option:</label>
              <div className="flex flex-wrap gap-2 sm:gap-4">
                {product.sizes.map((size) => (
                  <button 
                    key={size.label}
                    onClick={() => setSelectedSize(size.label)}
                    className={`px-4 py-2 sm:px-8 sm:py-4 border text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.15em] sm:tracking-[0.2em] transition-all ${selectedSize === size.label ? 'border-primary-pink bg-primary-pink text-white shadow-lg shadow-primary-pink/20' : 'border-white/10 text-gray-400 hover:border-white/30'}`}
                  >
                    {size.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity and Cart */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-6 mb-12 sm:mb-16">
              <div className="flex items-center border border-white/10 h-12 sm:h-16 sm:w-40">
                <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="flex-1 hover:text-primary-gold transition-colors text-lg sm:text-xl">-</button>
                <span className="flex-1 text-center font-bold text-sm sm:text-base">{quantity}</span>
                <button onClick={() => setQuantity(q => q + 1)} className="flex-1 hover:text-primary-gold transition-colors text-lg sm:text-xl">+</button>
              </div>
              <button
                type="button"
                onClick={() => product && addItem(product)}
                className="flex-[2] btn-primary h-12 sm:h-16 flex items-center justify-center gap-2 sm:gap-3 group text-[10px] sm:text-sm"
              >
                <FiShoppingCart size={18} className="group-hover:rotate-12 transition-transform sm:w-5 sm:h-5" />
                Add to Cart — KES {currentPrice}
              </button>
              <button className="hidden sm:flex w-16 h-16 border border-white/10 items-center justify-center hover:bg-white/5 transition-all text-gray-400 hover:text-primary-pink">
                <FiHeart size={20} />
              </button>
            </div>

            <a 
              href={`${BRAND.whatsappUrl}?text=${encodeURIComponent(`Hi Spark Lights 254! I'd like to order:\n${product.name}\nKES ${currentPrice}\nQty: ${quantity}\nOption: ${selectedSize}\n\nPlease confirm stock & delivery to my area.`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full border-2 border-[#25D366] bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366] hover:text-white transition-all py-4 sm:py-6 flex items-center justify-center gap-2 sm:gap-3 font-black uppercase tracking-widest text-[10px] sm:text-xs mb-6"
            >
              <FaWhatsapp size={20} className="sm:w-[22px] sm:h-[22px]" /> Chat on WhatsApp to Order
            </a>
            <p className="text-center text-[10px] text-gray-600 font-bold uppercase tracking-widest mb-8 flex items-center justify-center gap-2">
              <FiTruck size={12} /> Most Kenyans order via WhatsApp — ask about stock &amp; delivery first
            </p>
            <Link to="/installation" className="block text-center text-[10px] font-black uppercase tracking-widest text-primary-gold hover:underline mb-16">
              Bundle Supply &amp; Fix (light + install) →
            </Link>

            {/* Details Accordion Placeholder */}
            <div className="border-t border-white/5 py-10">
              <h3 className="text-sm font-black uppercase tracking-[0.2em] mb-6 flex items-center gap-3">
                <span className="w-8 h-[1px] bg-primary-gold"></span> Product Description
              </h3>
              <div className="text-gray-400 text-sm leading-relaxed space-y-4">
                {(product.longDesc ?? '').split('\n\n').map((p, i) => <p key={i}>{p}</p>)}
              </div>
            </div>

            {product.careInstructions && (
              <div className="border-t border-white/5 py-10">
                <h3 className="text-sm font-black uppercase tracking-[0.2em] mb-6 flex items-center gap-3">
                  <span className="w-8 h-[1px] bg-primary-gold"></span> Installation Notes
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">{product.careInstructions}</p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
      <DeliveryBanner />
    </div>
  );
}
