import { useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiHeart, FiShoppingCart, FiMessageCircle, FiChevronRight, FiCheckCircle } from 'react-icons/fi';
import { PRODUCTS } from '../data/content';

export default function ProductDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const product = useMemo(() => PRODUCTS.find(p => p.slug === slug), [slug]);
  
  const [selectedSize, setSelectedSize] = useState(product?.sizes[1]?.label || '');
  const [quantity, setQuantity] = useState(1);

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-4xl font-serif mb-6">Bouquet Not Found</h1>
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
            <div className="aspect-[4/5] overflow-hidden border border-white/5 shadow-2xl relative group">
              <img src={product.img} alt={product.name} className="w-full h-full object-cover" />
              {product.badge && (
                <div className="absolute top-8 left-8 bg-primary-gold text-white text-[10px] font-black px-4 py-2 uppercase tracking-[0.2em] shadow-2xl">
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
            <span className="text-primary-pink uppercase tracking-[0.4em] text-[10px] font-bold mb-6 block">{product.tag}</span>
            <h1 className="text-4xl sm:text-6xl font-serif mb-8 leading-tight">{product.name}</h1>
            
            <div className="flex items-center gap-6 mb-12">
              <span className="text-3xl font-bold text-primary-pink">KES {currentPrice}</span>
              {product.oldPrice && <span className="text-xl text-gray-600 line-through">KES {product.oldPrice}</span>}
            </div>

            <p className="text-gray-400 text-lg leading-relaxed mb-12 whitespace-pre-line italic font-serif">
              "{product.shortDesc}"
            </p>

            {/* Size Selector */}
            <div className="mb-12">
              <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-6">Select Arrangement Size:</label>
              <div className="flex flex-wrap gap-4">
                {product.sizes.map((size) => (
                  <button 
                    key={size.label}
                    onClick={() => setSelectedSize(size.label)}
                    className={`px-8 py-4 border text-[10px] font-bold uppercase tracking-[0.2em] transition-all ${selectedSize === size.label ? 'border-primary-pink bg-primary-pink text-white shadow-lg shadow-primary-pink/20' : 'border-white/10 text-gray-400 hover:border-white/30'}`}
                  >
                    {size.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity and Cart */}
            <div className="flex flex-col sm:flex-row gap-6 mb-16">
              <div className="flex items-center border border-white/10 h-16 sm:w-40">
                <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="flex-1 hover:text-primary-gold transition-colors text-xl">-</button>
                <span className="flex-1 text-center font-bold">{quantity}</span>
                <button onClick={() => setQuantity(q => q + 1)} className="flex-1 hover:text-primary-gold transition-colors text-xl">+</button>
              </div>
              <button className="flex-[2] btn-primary h-16 flex items-center justify-center gap-3 group">
                <FiShoppingCart size={20} className="group-hover:rotate-12 transition-transform" />
                Add to Cart
              </button>
              <button className="w-16 h-16 border border-white/10 flex items-center justify-center hover:bg-white/5 transition-all text-gray-400 hover:text-primary-pink">
                <FiHeart size={20} />
              </button>
            </div>

            <a 
              href={`https://wa.me/254700000000?text=I'd like to order the ${product.name} (${selectedSize})`}
              className="w-full border-2 border-[#25D366] text-[#25D366] hover:bg-[#25D366] hover:text-white transition-all py-5 flex items-center justify-center gap-3 font-bold uppercase tracking-widest text-xs mb-16"
            >
              <FiMessageCircle size={20} /> Order via WhatsApp
            </a>

            {/* Details Accordion Placeholder */}
            <div className="border-t border-white/5 py-10">
              <h3 className="text-sm font-black uppercase tracking-[0.2em] mb-6 flex items-center gap-3">
                <span className="w-8 h-[1px] bg-primary-gold"></span> Product Description
              </h3>
              <div className="text-gray-400 text-sm leading-relaxed space-y-4">
                {product.longDesc.split('\n\n').map((p, i) => <p key={i}>{p}</p>)}
              </div>
            </div>

            <div className="border-t border-white/5 py-10">
              <h3 className="text-sm font-black uppercase tracking-[0.2em] mb-6 flex items-center gap-3">
                <span className="w-8 h-[1px] bg-primary-gold"></span> Care Instructions
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">{product.careInstructions}</p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
