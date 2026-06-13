import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiPlus, FiMinus, FiTrash2, FiShoppingBag } from 'react-icons/fi';
import { useCartStore } from '../store/useCartStore';
import { Link } from 'react-router-dom';
import ProductImage from './ProductImage';

interface CartOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartOverlay({ isOpen, onClose }: CartOverlayProps) {
  const { items, removeItem, updateQuantity, getTotal, getItemCount } = useCartStore();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[150]"
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full sm:w-[500px] bg-secondary-black border-l border-white/10 z-[160] flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="p-8 border-b border-white/5 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-black uppercase tracking-tighter text-white">Your Selection</h2>
                <p className="text-[10px] text-primary-gold font-black uppercase tracking-widest mt-1">{getItemCount()} Artisan Pieces</p>
              </div>
              <button onClick={onClose} className="w-12 h-12 flex items-center justify-center hover:bg-white/5 transition-colors border border-white/10 rounded-full">
                <FiX size={20} />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-8 no-scrollbar">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <FiShoppingBag size={48} className="text-gray-800 mb-6" />
                  <p className="text-gray-500 font-medium italic mb-8">Your gallery is currently empty.</p>
                  <button onClick={onClose} className="btn-primary py-4 px-10 text-[10px]">Begin Selection</button>
                </div>
              ) : (
                <div className="space-y-8">
                  {items.map((item) => (
                    <motion.div layout key={item.id} className="flex gap-6 group">
                      <div className="w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 bg-tertiary-black border border-white/5 flex items-center justify-center p-1">
                        <ProductImage src={item.img} alt={item.name} className="max-w-full max-h-full object-contain" />
                      </div>
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="text-lg font-black uppercase tracking-tighter text-white leading-tight">{item.name}</h3>
                            <button onClick={() => removeItem(item.id)} className="text-gray-600 hover:text-primary-gold transition-colors">
                              <FiTrash2 size={16} />
                            </button>
                          </div>
                          <p className="text-primary-gold text-sm font-black uppercase">KES {item.price}</p>
                        </div>
                        
                        <div className="flex items-center gap-4 border border-white/10 w-fit p-1 rounded-full">
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-8 h-8 flex items-center justify-center hover:bg-white/5 rounded-full transition-colors"
                          >
                            <FiMinus size={12} />
                          </button>
                          <span className="text-[11px] font-black w-4 text-center">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-8 h-8 flex items-center justify-center hover:bg-white/5 rounded-full transition-colors"
                          >
                            <FiPlus size={12} />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-8 border-t border-white/5 bg-tertiary-black/50">
                <div className="flex justify-between items-center mb-8">
                  <span className="text-gray-500 font-black uppercase tracking-[0.3em] text-[10px]">Subtotal</span>
                  <span className="text-2xl font-black uppercase tracking-tighter text-white">KES {getTotal().toLocaleString()}</span>
                </div>
                <div className="space-y-4">
                  <Link 
                    to="/checkout" 
                    onClick={onClose}
                    className="btn-primary w-full py-6 flex items-center justify-center gap-4 shadow-xl shadow-primary-gold/10"
                  >
                    Complete Order Details
                  </Link>
                  <button onClick={onClose} className="w-full text-[9px] font-black uppercase tracking-[0.4em] text-gray-500 hover:text-white transition-colors py-2">
                    Continue Selection
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
