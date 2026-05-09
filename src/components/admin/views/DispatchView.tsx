import React, { useEffect, useState } from 'react';
import { 
  Truck, 
  MapPin, 
  Phone, 
  Camera, 
  CheckCircle2, 
  Clock, 
  Navigation,
  Loader2,
  Package,
  ChevronRight
} from 'lucide-react';
import apiClient from '@/api/client';
import { getOrders } from '@/api/orders';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';

export const DispatchView: React.FC = () => {
  const [deliveries, setDeliveries] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [uploading, setUploading] = useState(false);

  const fetchDeliveries = async () => {
    setIsLoading(true);
    try {
      // In a real app, we would filter by assigned driver ID in the backend
      const response = await getOrders({ status: 'READY,OUT_FOR_DELIVERY' });
      if (response.success) {
        setDeliveries(response.data);
      }
    } catch (error) {
      toast.error("Failed to load dispatch board");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDeliveries();
  }, []);

  const handleStatusUpdate = async (orderId: string, status: string) => {
    try {
      const response = await apiClient.patch(`/orders/${orderId}/status`, { status });
      if (response.data.success) {
        toast.success(`Order marked as ${status.toLowerCase()}`);
        fetchDeliveries();
        if (status === 'DELIVERED') setSelectedOrder(null);
      }
    } catch (error) {
      toast.error("Status update failed");
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    setUploading(true);
    // Mocking upload
    setTimeout(() => {
      setUploading(false);
      toast.success("Delivery photo attached successfully");
    }, 1500);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-4">
        <Loader2 className="h-10 w-10 text-primary-gold animate-spin" />
        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Optimizing Routes...</p>
      </div>
    );
  }

  return (
    <div className="px-8 space-y-8 pb-12 max-w-4xl mx-auto">
      
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-white uppercase tracking-tight flex items-center gap-3">
            <Truck className="text-primary-gold" />
            Active Dispatch Board
          </h2>
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-1">Live tracking for assigned deliveries</p>
        </div>
        <div className="h-12 w-12 rounded-2xl bg-secondary-black border border-white/5 flex items-center justify-center text-primary-gold font-black">
          {deliveries.length}
        </div>
      </div>

      <div className="space-y-4">
        {deliveries.length > 0 ? deliveries.map((order, i) => (
          <motion.div
            key={order.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            onClick={() => setSelectedOrder(order)}
            className={`bg-secondary-black border ${selectedOrder?.id === order.id ? 'border-primary-gold' : 'border-white/5'} p-6 rounded-[2.5rem] cursor-pointer hover:border-primary-gold/30 transition-all group`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className={`p-4 rounded-2xl ${order.status === 'OUT_FOR_DELIVERY' ? 'bg-primary-gold/10 text-primary-gold' : 'bg-white/5 text-slate-500'}`}>
                  <Package size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-black text-white tracking-tight uppercase">#{order.orderNumber}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{order.recipientName}</span>
                    <div className="h-1 w-1 rounded-full bg-slate-800" />
                    <span className="text-[10px] font-black text-primary-pink uppercase tracking-widest">{order.deliveryArea}</span>
                  </div>
                </div>
              </div>
              <div className={`px-4 py-1.5 rounded-full border text-[9px] font-black uppercase tracking-widest ${
                order.status === 'OUT_FOR_DELIVERY' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-amber-500/10 text-amber-500 border-amber-500/20'
              }`}>
                {order.status}
              </div>
            </div>

            <div className="mt-8 flex items-center gap-8">
              <div className="flex items-center gap-2">
                <Clock size={14} className="text-slate-600" />
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Target: {order.deliverySlot || 'AM Session'}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin size={14} className="text-slate-600" />
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{order.shippingAddress?.split(',')[0]}</span>
              </div>
            </div>

            {selectedOrder?.id === order.id && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-8 pt-8 border-t border-white/5 space-y-6"
              >
                <div className="grid grid-cols-2 gap-4">
                  <a 
                    href={`tel:${order.recipientPhone}`}
                    className="flex items-center justify-center gap-3 bg-white/5 hover:bg-white/10 text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all"
                  >
                    <Phone size={14} className="text-primary-pink" /> Call Recipient
                  </a>
                  <button 
                    onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(order.shippingAddress)}`)}
                    className="flex items-center justify-center gap-3 bg-white/5 hover:bg-white/10 text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all"
                  >
                    <Navigation size={14} className="text-primary-gold" /> Open Maps
                  </button>
                </div>

                <div className="space-y-4">
                  <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-white/10 rounded-[2rem] hover:border-primary-gold/30 hover:bg-primary-gold/5 cursor-pointer transition-all">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      {uploading ? (
                        <Loader2 className="h-10 w-10 text-primary-gold animate-spin" />
                      ) : (
                        <>
                          <Camera className="w-10 h-10 text-slate-700 mb-3" />
                          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Attach Delivery Photo</p>
                        </>
                      )}
                    </div>
                    <input type="file" className="hidden" accept="image/*" capture="environment" onChange={handlePhotoUpload} />
                  </label>

                  <div className="flex items-center gap-4">
                    {order.status === 'READY' ? (
                      <button 
                        onClick={() => handleStatusUpdate(order.id, 'OUT_FOR_DELIVERY')}
                        className="flex-1 bg-primary-gold text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-primary-gold/20 flex items-center justify-center gap-2"
                      >
                        Start Delivery Run <ChevronRight size={14} />
                      </button>
                    ) : (
                      <button 
                        onClick={() => handleStatusUpdate(order.id, 'DELIVERED')}
                        className="flex-1 bg-emerald-500 text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-2"
                      >
                        Confirm Delivery <CheckCircle2 size={14} />
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        )) : (
          <div className="bg-secondary-black border border-white/5 rounded-[3rem] py-20 flex flex-col items-center justify-center text-center px-10">
            <div className="h-20 w-20 bg-white/5 rounded-full flex items-center justify-center mb-6">
              <CheckCircle2 size={32} className="text-slate-800" />
            </div>
            <h3 className="text-lg font-black text-white uppercase tracking-tight">All Clear</h3>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-2 max-w-xs leading-relaxed">
              No pending deliveries assigned to your queue at this moment.
            </p>
          </div>
        )}
      </div>

    </div>
  );
};
