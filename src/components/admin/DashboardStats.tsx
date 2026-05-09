import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, ShoppingBag, DollarSign, Users, ArrowUpRight, ArrowDownRight, Loader2 } from 'lucide-react';
import { getDashboardStats } from '@/api/analytics';

export const DashboardStats: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const response = await getDashboardStats();
      if (response.success) {
        setStats(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch stats', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const statsConfig = [
    {
      label: "Total Revenue",
      value: `KES ${Number(stats?.totalRevenue || 0).toLocaleString()}`,
      change: `${stats?.revenueChange || 0}%`,
      icon: DollarSign,
      color: "text-primary-gold",
      bg: "bg-primary-gold/10",
      trend: Number(stats?.revenueChange) >= 0 ? "up" : "down"
    },
    {
      label: "Active Orders",
      value: stats?.activeOrders?.toString() || "0",
      change: "+8.2%",
      icon: ShoppingBag,
      color: "text-primary-pink",
      bg: "bg-primary-pink/10",
      trend: "up"
    },
    {
      label: "Avg Order Value",
      value: `KES ${Number(stats?.avgOrderValue || 0).toLocaleString()}`,
      change: "-2.4%",
      icon: TrendingUp,
      color: "text-white",
      bg: "bg-white/10",
      trend: "down"
    },
    {
      label: "New Customers",
      value: stats?.newCustomers?.toString() || "0",
      change: "+18.3%",
      icon: Users,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
      trend: "up"
    }
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-8">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-secondary-black border border-white/5 p-6 rounded-[2rem] animate-pulse h-32" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-8">
      {statsConfig.map((stat, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="group"
        >
          <div className="bg-secondary-black border border-white/5 p-6 rounded-[2rem] hover:border-primary-gold/20 transition-all duration-500 shadow-xl relative overflow-hidden">
            {/* Background Glow */}
            <div className={`absolute -right-8 -top-8 h-32 w-32 rounded-full blur-[60px] opacity-20 ${stat.bg}`} />
            
            <div className="flex items-center justify-between mb-6 relative z-10">
              <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform duration-500`}>
                <stat.icon className="h-5 w-5" />
              </div>
              <div className={`flex items-center gap-1 text-[10px] font-black tracking-widest px-3 py-1 rounded-full border ${
                stat.trend === 'up' 
                  ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' 
                  : 'bg-red-500/10 text-red-500 border-red-500/20'
              }`}>
                {stat.trend === 'up' ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                {stat.change}
              </div>
            </div>
            
            <div className="relative z-10">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-2">
                {stat.label}
              </p>
              <h3 className="text-2xl font-black tracking-tight text-white uppercase group-hover:text-primary-gold transition-colors">
                {stat.value}
              </h3>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};
