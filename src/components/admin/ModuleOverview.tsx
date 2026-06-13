import React, { useEffect, useState } from 'react';
import { 
  ShoppingCart, 
  Truck, 
  Package, 
  ArrowUpRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Plus
} from "lucide-react";
import { getOrders } from '@/api/orders';
import { getProducts } from '@/api/products';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { useAuthStore } from '@/store/authStore';
import PublicImage from '@/components/PublicImage';
import { isPublicImageUrl } from '@/lib/publicImages';
import { ImageIcon } from 'lucide-react';

export const ModuleOverview: React.FC = () => {
  const { user } = useAuthStore();
  const role = user?.role || 'FLORIST';
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [topProducts, setTopProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const orderParams: any = { limit: 5 };
        if (role === 'DRIVER') {
          orderParams.status = 'READY,OUT_FOR_DELIVERY';
        }

        const [ordersRes, productsRes] = await Promise.all([
          getOrders(orderParams),
          getProducts({ limit: 4 })
        ]);
        if (ordersRes.success) setRecentOrders(ordersRes.data);
        if (productsRes.success) setTopProducts(productsRes.data);
      } catch (error) {
        console.error("Failed to load dashboard overview data", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="px-8 grid grid-cols-1 lg:grid-cols-3 gap-8 pb-12">
        <div className="lg:col-span-2 space-y-6">
          <div className="h-64 bg-secondary-black border border-white/5 rounded-[2.5rem] animate-pulse" />
        </div>
        <div className="space-y-6">
          <div className="h-64 bg-secondary-black border border-white/5 rounded-[2.5rem] animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="px-8 grid grid-cols-1 lg:grid-cols-3 gap-8 pb-12">
      
      {/* 1. Live Orders Feed */}
      <section className="lg:col-span-2 space-y-6">
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-3">
            <ShoppingCart className="h-5 w-5 text-primary-gold" />
            <h2 className="text-sm font-black text-white uppercase tracking-tight">Live Order Feed</h2>
          </div>
          <button className="text-[10px] font-black text-primary-gold uppercase tracking-widest flex items-center gap-1 hover:underline">
            View All <ArrowUpRight size={12} />
          </button>
        </div>

        <div className="bg-secondary-black border border-white/5 rounded-[2.5rem] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="px-6 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">Order</th>
                  <th className="px-6 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">Customer</th>
                  <th className="px-6 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">Status</th>
                  <th className="px-6 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {recentOrders.length > 0 ? recentOrders.map((order, i) => (
                  <motion.tr 
                    key={order.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="hover:bg-white/[0.02] transition-colors group cursor-pointer"
                  >
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-black text-white group-hover:text-primary-gold transition-colors">#{order.orderNumber}</span>
                        <span className="text-[10px] font-medium text-slate-500">{format(new Date(order.createdAt), 'MMM d, HH:mm')}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-slate-300">{order.recipientName}</span>
                        <span className="text-[10px] font-medium text-slate-500">{order.deliveryArea}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[9px] font-black uppercase tracking-widest ${
                        order.status === 'DELIVERED' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' :
                        order.status === 'PENDING' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' :
                        'bg-primary-pink/10 text-primary-pink border-primary-pink/20'
                      }`}>
                        {order.status === 'DELIVERED' ? <CheckCircle2 size={10} /> : <Clock size={10} />}
                        {order.status}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-sm font-black text-white">KES {Number(order.totalKes).toLocaleString()}</span>
                    </td>
                  </motion.tr>
                )) : (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-[10px] font-black text-slate-500 uppercase tracking-widest">
                      No recent orders found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 2. Top Products & Quick Actions */}
      {role !== 'DRIVER' && (
        <section className="space-y-6">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-3">
              <Package className="h-5 w-5 text-primary-pink" />
              <h2 className="text-sm font-black text-white uppercase tracking-tight">Active Inventory</h2>
            </div>
            <button className="text-[10px] font-black text-primary-pink uppercase tracking-widest flex items-center gap-1 hover:underline">
              Manage <ExternalLink size={12} />
            </button>
          </div>

          <div className="space-y-4">
            {topProducts.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + (i * 0.1) }}
                className="bg-secondary-black border border-white/5 p-4 rounded-3xl flex items-center gap-4 hover:border-white/10 transition-all group"
              >
                <div className="h-12 w-12 rounded-2xl overflow-hidden bg-primary-black flex-shrink-0 border border-white/5 flex items-center justify-center text-slate-700">
                  <PublicImage
                    src={product.images?.[0]?.url}
                    className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500"
                    alt={product.name}
                  />
                  {!isPublicImageUrl(product.images?.[0]?.url) && <ImageIcon size={18} />}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-xs font-black text-white uppercase truncate tracking-tight">{product.name}</h3>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{product.variants?.[0]?.stockQty || 0} In Stock</span>
                    <div className="h-1 w-1 rounded-full bg-slate-700" />
                    <span className="text-[10px] font-black text-primary-gold">KES {Number(product.variants?.[0]?.priceKes).toLocaleString()}</span>
                  </div>
                </div>
                {Number(product.variants?.[0]?.stockQty) < 5 && (
                  <AlertCircle className="h-4 w-4 text-amber-500 animate-pulse" />
                )}
              </motion.div>
            ))}

            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="w-full bg-primary-pink/10 border border-primary-pink/20 text-primary-pink font-black py-4 rounded-3xl text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-primary-pink/20 transition-all"
            >
              <Plus size={14} /> Add New Product
            </motion.button>
          </div>

          {/* Dispatch Quick Glance */}
          <div className="bg-gradient-to-br from-primary-gold/10 to-transparent border border-primary-gold/20 p-8 rounded-[2.5rem] mt-8">
            <div className="flex items-center gap-3 mb-4">
              <Truck className="h-5 w-5 text-primary-gold" />
              <h3 className="text-xs font-black text-white uppercase tracking-widest">Fleet Status</h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">In Transit</span>
                <span className="text-xs font-black text-white">4 Orders</span>
              </div>
              <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                <div className="w-2/3 h-full bg-primary-gold" />
              </div>
              <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest leading-relaxed">
                3 Drivers actively delivering across Nairobi Central & Westlands.
              </p>
            </div>
          </div>
        </section>
      )}

    </div>
  );
};
