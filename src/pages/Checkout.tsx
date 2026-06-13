import { motion } from 'framer-motion';
import { useCartStore } from '../store/useCartStore';
import { FiLock, FiTruck, FiCreditCard, FiArrowLeft } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function Checkout() {
  const { items, getTotal, clearCart } = useCartStore();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);

  const total = getTotal();
  const shipping = 500; // Fixed shipping for Nairobi
  const grandTotal = total + shipping;

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      alert('Order Placed Successfully! Thank you for choosing Spark Lights 254.');
      clearCart();
      navigate('/');
    }, 3000);
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-6">
        <h2 className="text-4xl font-black uppercase tracking-tighter mb-8">Your selection is empty</h2>
        <Link to="/shop" className="btn-primary py-4 px-12">Return to Gallery</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-32">
      <section className="py-24 sm:py-32 bg-secondary-black border-b border-white/5">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <span className="text-primary-gold uppercase tracking-[0.6em] text-[10px] font-black mb-6 block">Secure Checkout</span>
            <h1 className="text-5xl sm:text-7xl font-black uppercase leading-none tracking-tighter mb-8">Complete Your Selection</h1>
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-20">
            {/* Checkout Form */}
            <div className="lg:w-2/3">
              <form onSubmit={handleCheckout} className="space-y-16">
                {/* Shipping Details */}
                <div>
                  <h3 className="text-2xl font-black uppercase tracking-tighter text-white mb-10 flex items-center gap-4">
                    <FiTruck className="text-primary-gold" /> 1. Shipping Details
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    <div className="flex flex-col gap-4">
                      <label className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-500">First Name</label>
                      <input type="text" className="bg-transparent border-b border-white/10 py-4 focus:outline-none focus:border-primary-gold transition-colors text-white font-medium" required />
                    </div>
                    <div className="flex flex-col gap-4">
                      <label className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-500">Last Name</label>
                      <input type="text" className="bg-transparent border-b border-white/10 py-4 focus:outline-none focus:border-primary-gold transition-colors text-white font-medium" required />
                    </div>
                    <div className="flex flex-col gap-4 sm:col-span-2">
                      <label className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-500">Full Delivery Address</label>
                      <input type="text" placeholder="Apartment, Street, Area" className="bg-transparent border-b border-white/10 py-4 focus:outline-none focus:border-primary-gold transition-colors text-white font-medium" required />
                    </div>
                    <div className="flex flex-col gap-4">
                      <label className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-500">Contact Phone</label>
                      <input type="tel" placeholder="+254 7..." className="bg-transparent border-b border-white/10 py-4 focus:outline-none focus:border-primary-gold transition-colors text-white font-medium" required />
                    </div>
                    <div className="flex flex-col gap-4">
                      <label className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-500">City</label>
                      <input type="text" value="Nairobi" disabled className="bg-transparent border-b border-white/5 py-4 text-gray-600 font-medium" />
                    </div>
                  </div>
                </div>

                {/* Payment Method */}
                <div>
                  <h3 className="text-2xl font-black uppercase tracking-tighter text-white mb-10 flex items-center gap-4">
                    <FiCreditCard className="text-primary-gold" /> 2. Payment Method
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="p-8 border-2 border-primary-gold bg-primary-gold/5 relative group cursor-pointer">
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-lg font-black uppercase tracking-tighter text-white">M-Pesa Express</span>
                        <div className="w-6 h-6 rounded-full border-4 border-primary-gold flex items-center justify-center">
                          <div className="w-2 h-2 rounded-full bg-primary-gold"></div>
                        </div>
                      </div>
                      <p className="text-[10px] text-gray-400 font-medium leading-relaxed">Push notification will be sent to your phone for secure payment.</p>
                    </div>
                    <div className="p-8 border border-white/10 bg-tertiary-black opacity-50 relative group cursor-not-allowed">
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-lg font-black uppercase tracking-tighter text-white">Credit Card</span>
                        <div className="w-6 h-6 rounded-full border-2 border-white/10"></div>
                      </div>
                      <p className="text-[10px] text-gray-500 font-medium leading-relaxed">Temporarily unavailable for artisan selection.</p>
                    </div>
                  </div>
                </div>

                <div className="pt-10">
                  <button 
                    type="submit" 
                    disabled={isProcessing}
                    className="btn-primary w-full py-6 text-sm flex items-center justify-center gap-4 relative overflow-hidden"
                  >
                    {isProcessing ? (
                      <span className="flex items-center gap-4">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                          className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full"
                        />
                        Processing Artisan Order...
                      </span>
                    ) : (
                      <span className="flex items-center gap-4">
                        <FiLock /> Secure Order Placement — KES {grandTotal.toLocaleString()}
                      </span>
                    )}
                  </button>
                  <p className="text-center text-[9px] text-gray-600 font-black uppercase tracking-[0.4em] mt-6 flex items-center justify-center gap-2">
                    <FiLock size={10} /> Fully Encrypted & Secure Selection
                  </p>
                </div>
              </form>
            </div>

            {/* Summary Sidebar */}
            <div className="lg:w-1/3">
              <div className="bg-tertiary-black border border-white/10 p-10 sticky top-[150px]">
                <h3 className="text-xl font-black uppercase tracking-tighter text-white mb-10 pb-6 border-b border-white/5">Order Summary</h3>
                <div className="space-y-6 mb-10 max-h-[400px] overflow-y-auto no-scrollbar">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-4">
                      <div className="w-16 h-20 bg-black overflow-hidden border border-white/5 flex-shrink-0">
                        <img src={item.img} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-[11px] font-black uppercase tracking-tighter text-white leading-tight mb-1">{item.name}</h4>
                        <p className="text-[10px] text-gray-500 font-bold">Qty: {item.quantity}</p>
                        <p className="text-[11px] text-primary-gold font-black mt-1">KES {item.price}</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="space-y-4 pt-10 border-t border-white/5">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 font-black uppercase tracking-widest text-[9px]">Subtotal</span>
                    <span className="text-white font-black">KES {total.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 font-black uppercase tracking-widest text-[9px]">Artisan Shipping</span>
                    <span className="text-white font-black">KES {shipping.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center pt-6 border-t border-white/5">
                    <span className="text-lg font-black uppercase tracking-tighter text-white">Total Amount</span>
                    <span className="text-2xl font-black uppercase tracking-tighter text-primary-gold">KES {grandTotal.toLocaleString()}</span>
                  </div>
                </div>

                <div className="mt-12">
                   <Link to="/shop" className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-600 hover:text-white flex items-center justify-center gap-2 transition-colors">
                      <FiArrowLeft /> Back to Gallery
                   </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
