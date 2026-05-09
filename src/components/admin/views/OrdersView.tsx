import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Filter, 
  ChevronRight, 
  Printer, 
  Download,
  Package,
  Clock,
  Plus,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { getOrders } from '@/api/orders';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

const getStatusColor = (status: string) => {
  switch (status) {
    case 'PENDING': return 'bg-white/5 text-slate-400 border-white/10';
    case 'CONFIRMED': return 'bg-primary-pink/10 text-primary-pink border-primary-pink/20';
    case 'PROCESSING': return 'bg-primary-pink/10 text-primary-pink border-primary-pink/20';
    case 'DISPATCHED': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
    case 'DELIVERED': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
    case 'CANCELLED': return 'bg-red-500/10 text-red-500 border-red-500/20';
    default: return 'bg-white/5 text-slate-400 border-white/10';
  }
};

export const OrdersView: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const response = await getOrders({ search: searchQuery });
      if (response.success) {
        setOrders(response.data);
      } else {
        setError(response.error?.message || 'Failed to fetch orders');
      }
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'An error occurred while fetching orders');
      toast.error('Could not load orders');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [searchQuery]);

  return (
    <div className="space-y-8 px-8">
      {/* View Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="bg-secondary-black p-2 rounded-2xl border border-white/5 flex items-center gap-3 px-4 shadow-xl focus-within:border-primary-gold/30 transition-all">
            <Search className="h-4 w-4 text-slate-500" />
            <input 
              type="text" 
              placeholder="SEARCH ORDERS..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none outline-none text-[10px] font-black tracking-widest placeholder:text-slate-600 w-64 text-white uppercase"
            />
          </div>
          <button className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-secondary-black border border-white/5 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white transition-all">
            <Filter className="h-3.5 w-3.5" /> Filters
          </button>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-secondary-black border border-white/5 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white transition-all">
            <Download className="h-3.5 w-3.5" /> Export
          </button>
          <button className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-primary-gold text-white text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-lg shadow-primary-gold/20">
            <Plus className="h-3.5 w-3.5" /> Create Order
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-32 space-y-4">
          <Loader2 className="h-12 w-12 text-primary-gold animate-spin" />
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Loading Order Streams...</p>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-32 space-y-4">
          <AlertCircle className="h-12 w-12 text-red-500 opacity-50" />
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{error}</p>
          <button 
            onClick={fetchOrders}
            className="text-[9px] font-black text-primary-gold uppercase tracking-widest hover:underline"
          >
            Reconnect
          </button>
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-32">
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">No active orders found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {orders.map((order, i) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="group"
            >
              <div className="bg-secondary-black border border-white/5 p-6 rounded-3xl hover:border-primary-pink/30 transition-all duration-500 cursor-pointer relative overflow-hidden">
                {/* Highlight line on hover */}
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary-pink scale-y-0 group-hover:scale-y-100 transition-transform duration-500" />
                
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                  <div className="flex items-center gap-5">
                    <div className={`h-14 w-14 rounded-2xl flex items-center justify-center transition-all duration-500 ${
                      order.isExpress ? 'bg-primary-pink/10 text-primary-pink' : 'bg-primary-gold/10 text-primary-gold'
                    } group-hover:scale-110`}>
                      {order.isExpress ? <Clock className="h-6 w-6" /> : <Package className="h-6 w-6" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-3">
                        <span className="font-black text-lg tracking-tighter text-white">#{order.orderNumber}</span>
                        <span className={`text-[9px] uppercase tracking-[0.2em] font-black py-1 px-3 rounded-full border ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </div>
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1.5 flex items-center gap-2">
                        <span className="text-white">{order.customer?.name || order.recipientName}</span>
                        <span className="h-1 w-1 rounded-full bg-slate-800" />
                        <span>{format(new Date(order.createdAt), 'MMM dd, hh:mm a')}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-12 ml-auto md:ml-0">
                    <div className="text-right hidden sm:block">
                      <p className="text-[9px] font-black text-slate-600 uppercase tracking-[0.2em]">Items</p>
                      <p className="font-black text-sm text-white mt-1">{order.items?.length || 0} Products</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[9px] font-black text-slate-600 uppercase tracking-[0.2em]">Investment</p>
                      <p className="font-black text-lg text-primary-gold mt-0.5 tracking-tight">KES {Number(order.totalKes).toLocaleString()}</p>
                    </div>
                    <div className="p-3 rounded-full bg-white/5 text-slate-500 group-hover:text-white group-hover:bg-primary-pink transition-all">
                      <ChevronRight className="h-5 w-5" />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};
