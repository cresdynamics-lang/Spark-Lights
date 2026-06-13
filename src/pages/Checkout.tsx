import { motion } from 'framer-motion';
import { useCartStore } from '../store/useCartStore';
import { FiTruck, FiArrowLeft, FiMessageCircle } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa6';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { DELIVERY_AREAS } from '../data/content';
import { BRAND } from '../data/brand';
import {
  buildOrderWhatsAppMessage,
  sendOrderToWhatsApp,
  type CheckoutDetails,
} from '../lib/whatsappOrder';

const SHIPPING_FEE = 500;

const emptyDetails: CheckoutDetails = {
  firstName: '',
  lastName: '',
  phone: '',
  email: '',
  area: '',
  address: '',
  landmark: '',
  notes: '',
};

export default function Checkout() {
  const { items, getTotal, clearCart } = useCartStore();
  const navigate = useNavigate();
  const [details, setDetails] = useState<CheckoutDetails>(emptyDetails);
  const [isSending, setIsSending] = useState(false);

  const total = getTotal();
  const grandTotal = total + SHIPPING_FEE;

  const updateField = (field: keyof CheckoutDetails, value: string) => {
    setDetails((prev) => ({ ...prev, [field]: value }));
  };

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);

    const message = buildOrderWhatsAppMessage(items, details, SHIPPING_FEE);
    sendOrderToWhatsApp(message);
    clearCart();

    setTimeout(() => {
      setIsSending(false);
      navigate('/?order=sent');
    }, 600);
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
            <span className="text-primary-gold uppercase tracking-[0.6em] text-[10px] font-black mb-6 block">WhatsApp Checkout</span>
            <h1 className="text-5xl sm:text-7xl font-black uppercase leading-none tracking-tighter mb-8">Complete Your Order</h1>
            <p className="text-gray-400 text-sm max-w-xl mx-auto">
              Fill in your delivery details below. Your full order will be sent directly to{' '}
              <span className="text-white font-semibold">{BRAND.phone}</span> on WhatsApp.
            </p>
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-20">
            <div className="lg:w-2/3">
              <form onSubmit={handleCheckout} className="space-y-16">
                <div>
                  <h3 className="text-2xl font-black uppercase tracking-tighter text-white mb-10 flex items-center gap-4">
                    <FiTruck className="text-primary-gold" /> 1. Your Details & Location
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    <div className="flex flex-col gap-4">
                      <label className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-500">First Name</label>
                      <input
                        type="text"
                        value={details.firstName}
                        onChange={(e) => updateField('firstName', e.target.value)}
                        className="bg-transparent border-b border-white/10 py-4 focus:outline-none focus:border-primary-gold transition-colors text-white font-medium"
                        required
                      />
                    </div>
                    <div className="flex flex-col gap-4">
                      <label className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-500">Last Name</label>
                      <input
                        type="text"
                        value={details.lastName}
                        onChange={(e) => updateField('lastName', e.target.value)}
                        className="bg-transparent border-b border-white/10 py-4 focus:outline-none focus:border-primary-gold transition-colors text-white font-medium"
                        required
                      />
                    </div>
                    <div className="flex flex-col gap-4">
                      <label className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-500">WhatsApp / Phone</label>
                      <input
                        type="tel"
                        placeholder="+254 7..."
                        value={details.phone}
                        onChange={(e) => updateField('phone', e.target.value)}
                        className="bg-transparent border-b border-white/10 py-4 focus:outline-none focus:border-primary-gold transition-colors text-white font-medium"
                        required
                      />
                    </div>
                    <div className="flex flex-col gap-4">
                      <label className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-500">Email (optional)</label>
                      <input
                        type="email"
                        placeholder="you@email.com"
                        value={details.email}
                        onChange={(e) => updateField('email', e.target.value)}
                        className="bg-transparent border-b border-white/10 py-4 focus:outline-none focus:border-primary-gold transition-colors text-white font-medium"
                      />
                    </div>
                    <div className="flex flex-col gap-4 sm:col-span-2">
                      <label className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-500">Delivery Area</label>
                      <select
                        value={details.area}
                        onChange={(e) => updateField('area', e.target.value)}
                        className="bg-transparent border-b border-white/10 py-4 focus:outline-none focus:border-primary-gold transition-colors text-white font-medium"
                        required
                      >
                        <option value="" className="bg-secondary-black">Select your area</option>
                        {DELIVERY_AREAS.map((area) => (
                          <option key={area} value={area} className="bg-secondary-black">{area}</option>
                        ))}
                        <option value="Other" className="bg-secondary-black">Other (Nairobi)</option>
                      </select>
                    </div>
                    <div className="flex flex-col gap-4 sm:col-span-2">
                      <label className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-500">Full Delivery Address</label>
                      <input
                        type="text"
                        placeholder="Building, street, estate"
                        value={details.address}
                        onChange={(e) => updateField('address', e.target.value)}
                        className="bg-transparent border-b border-white/10 py-4 focus:outline-none focus:border-primary-gold transition-colors text-white font-medium"
                        required
                      />
                    </div>
                    <div className="flex flex-col gap-4 sm:col-span-2">
                      <label className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-500">Landmark (optional)</label>
                      <input
                        type="text"
                        placeholder="Near mall, stage, or known place"
                        value={details.landmark}
                        onChange={(e) => updateField('landmark', e.target.value)}
                        className="bg-transparent border-b border-white/10 py-4 focus:outline-none focus:border-primary-gold transition-colors text-white font-medium"
                      />
                    </div>
                    <div className="flex flex-col gap-4 sm:col-span-2">
                      <label className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-500">Order Notes (optional)</label>
                      <textarea
                        placeholder="Installation needed, preferred delivery time, M-Pesa number, etc."
                        value={details.notes}
                        onChange={(e) => updateField('notes', e.target.value)}
                        rows={3}
                        className="bg-transparent border border-white/10 p-4 focus:outline-none focus:border-primary-gold transition-colors text-white font-medium resize-none"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-2xl font-black uppercase tracking-tighter text-white mb-10 flex items-center gap-4">
                    <FiMessageCircle className="text-primary-gold" /> 2. Confirm on WhatsApp
                  </h3>
                  <div className="p-8 border-2 border-[#25D366]/40 bg-[#25D366]/5">
                    <div className="flex items-start gap-4">
                      <FaWhatsapp className="text-[#25D366] shrink-0 mt-1" size={28} />
                      <div>
                        <p className="text-lg font-black uppercase tracking-tighter text-white mb-3">
                          Order goes to {BRAND.phone}
                        </p>
                        <p className="text-[11px] text-gray-400 font-medium leading-relaxed">
                          Tap the button below to open WhatsApp with your full order — items, location, and total.
                          Our team will confirm availability, delivery fee, and M-Pesa / cash payment details.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-10">
                  <button
                    type="submit"
                    disabled={isSending}
                    className="btn-primary w-full py-6 text-sm flex items-center justify-center gap-4 relative overflow-hidden bg-[#25D366] hover:bg-[#20bd5a] border-[#25D366]"
                  >
                    {isSending ? (
                      <span className="flex items-center gap-4">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                          className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full"
                        />
                        Opening WhatsApp...
                      </span>
                    ) : (
                      <span className="flex items-center gap-4">
                        <FaWhatsapp size={18} />
                        Send Order on WhatsApp — KES {grandTotal.toLocaleString()}
                      </span>
                    )}
                  </button>
                  <p className="text-center text-[9px] text-gray-600 font-black uppercase tracking-[0.4em] mt-6">
                    Delivered to Spark Lights 254 business WhatsApp
                  </p>
                </div>
              </form>
            </div>

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
                    <span className="text-gray-500 font-black uppercase tracking-widest text-[9px]">Est. Delivery</span>
                    <span className="text-white font-black">KES {SHIPPING_FEE.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center pt-6 border-t border-white/5">
                    <span className="text-lg font-black uppercase tracking-tighter text-white">Total</span>
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
