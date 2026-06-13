import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Truck, 
  MapPin, 
  Navigation, 
  Clock, 
  PackageCheck,
  Search,
  Filter,
  ArrowUpRight,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { getDeliveryManifest } from '@/api/delivery';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

export const LogisticsView: React.FC = () => {
  const [deliveries, setDeliveries] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLogistics = async () => {
    setIsLoading(true);
    try {
      const response = await getDeliveryManifest();
      if (response.success) {
        setDeliveries(response.data);
      } else {
        setError(response.error?.message || 'Failed to fetch dispatch manifest');
      }
    } catch (err) {
      setError('Dispatch synchronization failed');
      toast.error('Logistics Sync Error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLogistics();
  }, []);

  return (
    <div className="space-y-8 px-8">
      {/* View Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-xl font-black text-white uppercase tracking-tight">Dispatch Control</h2>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">Real-time delivery tracking and fleet management</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="bg-secondary-black p-2 rounded-2xl border border-white/5 flex items-center gap-3 px-4 shadow-xl">
            <Search className="h-4 w-4 text-slate-500" />
            <input 
              type="text" 
              placeholder="SEARCH DELIVERIES..." 
              className="bg-transparent border-none outline-none text-[10px] font-black tracking-widest placeholder:text-slate-600 w-64 text-white uppercase"
            />
          </div>
          <button className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-secondary-black border border-white/5 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white transition-all">
            <Filter className="h-3.5 w-3.5" /> Fleet Status
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-32 space-y-4 bg-secondary-black rounded-[3rem] border border-white/5">
          <Loader2 className="h-12 w-12 text-primary-gold animate-spin" />
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Calibrating Delivery Routes...</p>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-32 space-y-4 bg-secondary-black rounded-[3rem] border border-white/5">
          <AlertCircle className="h-12 w-12 text-red-500 opacity-50" />
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{error}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Delivery List */}
          <div className="lg:col-span-2 space-y-4">
            {deliveries.length === 0 ? (
              <div className="bg-secondary-black p-20 rounded-[3rem] border border-white/5 text-center">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">No active deliveries for today.</p>
              </div>
            ) : deliveries.map((delivery, i) => (
              <motion.div
                key={delivery.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="group"
              >
                <div className="bg-secondary-black border border-white/5 p-6 rounded-3xl hover:border-primary-gold/30 transition-all duration-500 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative overflow-hidden">
                  <div className="flex items-center gap-5 relative z-10">
                    <div className={`h-14 w-14 rounded-2xl flex items-center justify-center transition-all duration-500 ${
                      delivery.status === 'OUT_FOR_DELIVERY' ? 'bg-primary-pink/10 text-primary-pink' : 
                      delivery.status === 'DELIVERED' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-white/5 text-slate-400'
                    } group-hover:scale-110`}>
                      {delivery.status === 'DELIVERED' ? <PackageCheck className="h-6 w-6" /> : <Truck className="h-6 w-6" />}
                    </div>
                    <div>
                      <h3 className="font-black text-white uppercase tracking-tight flex items-center gap-3">
                        {delivery.orderNumber}
                        <span className={`text-[8px] uppercase tracking-[0.2em] font-black py-0.5 px-2 rounded-full border ${
                          delivery.status === 'OUT_FOR_DELIVERY' ? 'bg-primary-pink/10 text-primary-pink border-primary-pink/20' : 
                          delivery.status === 'DELIVERED' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-white/5 text-slate-500 border-white/10'
                        }`}>
                          {delivery.status}
                        </span>
                      </h3>
                      <div className="flex items-center gap-4 mt-2">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                          <MapPin size={12} className="text-primary-gold" /> {delivery.deliveryArea}, {delivery.deliveryAddress}
                        </p>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                          <Clock size={12} /> {delivery.deliverySlot}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 border-t sm:border-t-0 sm:border-l border-white/5 pt-4 sm:pt-0 sm:pl-6 relative z-10">
                    <div className="text-right">
                      <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Courier</p>
                      <p className="text-[11px] font-black text-white mt-0.5 uppercase">{delivery.driver?.name || 'Unassigned'}</p>
                    </div>
                    <button className="p-3 rounded-full bg-white/5 text-slate-400 group-hover:text-white group-hover:bg-primary-gold transition-all">
                      <ArrowUpRight size={16} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Map / Stats Sidebar */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-secondary-black rounded-[2.5rem] border border-white/5 overflow-hidden aspect-square relative shadow-2xl"
            >
              <div className="absolute inset-0 bg-primary-black/60 backdrop-blur-md z-10 flex flex-col items-center justify-center text-center p-8">
                <div className="p-4 bg-primary-gold/20 rounded-3xl text-primary-gold mb-6 animate-pulse shadow-[0_0_20px_rgba(209,170,107,0.2)]">
                  <Navigation size={40} />
                </div>
                <h3 className="text-xl font-black text-white uppercase tracking-tight">Interactive Map</h3>
                <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-2 px-4 leading-relaxed">
                  Live satellite tracking of all active floral couriers
                </p>
                <button className="mt-8 px-8 py-3 bg-white/5 border border-white/10 rounded-2xl text-[9px] font-black uppercase tracking-widest text-white hover:bg-white/10 hover:border-primary-gold/30 transition-all">
                  Open Control View
                </button>
              </div>
              <div className="absolute inset-0 bg-gradient-to-br from-primary-black via-secondary-black to-primary-black opacity-80" />
            </motion.div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-secondary-black p-6 rounded-[2rem] border border-white/5 shadow-xl hover:border-primary-pink/20 transition-all">
                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Active Fleet</p>
                <h4 className="text-2xl font-black text-white mt-1">4/6</h4>
              </div>
              <div className="bg-secondary-black p-6 rounded-[2rem] border border-white/5 shadow-xl hover:border-primary-gold/20 transition-all">
                <p className="text-[9px] font-black text-primary-gold uppercase tracking-widest">Avg. Time</p>
                <h4 className="text-2xl font-black text-white mt-1">38m</h4>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
