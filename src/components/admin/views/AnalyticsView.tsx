import React, { useEffect, useState } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  Calendar, 
  Download, 
  Filter, 
  RefreshCcw,
  Loader2,
  DollarSign,
  ShoppingBag,
  Users
} from 'lucide-react';
import { getDashboardStats } from '@/api/analytics';
import { motion } from 'framer-motion';

export const AnalyticsView: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('7d');

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await getDashboardStats();
      if (response.success) {
        setData(response.data);
      }
    } catch (error) {
      console.error("Analytics failure", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [timeRange]);

  // Mock chart data for week overview (Days vs Orders)
  // In a real app, this would come from the backend response.data.chartData
  const chartData = [
    { name: 'Mon', orders: 12, revenue: 45000 },
    { name: 'Tue', orders: 18, revenue: 52000 },
    { name: 'Wed', orders: 15, revenue: 48000 },
    { name: 'Thu', orders: 25, revenue: 85000 },
    { name: 'Fri', orders: 32, revenue: 110000 },
    { name: 'Sat', orders: 45, revenue: 165000 },
    { name: 'Sun', orders: 28, revenue: 95000 },
  ];

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-6">
        <Loader2 className="h-12 w-12 text-primary-gold animate-spin" />
        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Compiling Neural Analytics...</p>
      </div>
    );
  }

  return (
    <div className="px-8 space-y-8 max-w-7xl mx-auto pb-12">
      
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4 bg-secondary-black p-1.5 rounded-2xl border border-white/5 w-fit">
          {['24h', '7d', '30d', '90d'].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                timeRange === range ? 'bg-primary-gold text-white shadow-lg shadow-primary-gold/20' : 'text-slate-500 hover:text-white'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black text-white uppercase tracking-widest hover:bg-white/10 transition-all">
            <Download size={14} className="text-primary-gold" /> Export Report
          </button>
          <button onClick={fetchData} className="p-3 bg-secondary-black border border-white/5 rounded-2xl text-slate-400 hover:text-white transition-all">
            <RefreshCcw size={18} />
          </button>
        </div>
      </div>

      {/* Main KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard title="Gross Revenue" value={`KES ${Number(data?.totalRevenue || 0).toLocaleString()}`} change="+12.5%" trend="up" icon={DollarSign} color="gold" />
        <KPICard title="Total Orders" value={data?.activeOrders || "0"} change="+8.2%" trend="up" icon={ShoppingBag} color="pink" />
        <KPICard title="Active Customers" value={data?.newCustomers || "0"} change="+14.1%" trend="up" icon={Users} color="emerald" />
        <KPICard title="Avg Order Value" value={`KES ${Number(data?.avgOrderValue || 0).toLocaleString()}`} change="-2.4%" trend="down" icon={TrendingUp} color="white" />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Weekly Volume Bar Chart */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2 bg-secondary-black border border-white/5 rounded-[2.5rem] p-8"
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-sm font-black text-white uppercase tracking-tight">Order Distribution</h3>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Weekly volume by day of the week</p>
            </div>
            <Calendar className="text-slate-700" size={20} />
          </div>
          
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#64748b', fontSize: 10, fontWeight: 900 }} 
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#64748b', fontSize: 10, fontWeight: 900 }} 
                />
                <Tooltip 
                  cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-primary-black border border-white/10 p-4 rounded-2xl shadow-2xl backdrop-blur-xl">
                          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{payload[0].payload.name}</p>
                          <p className="text-sm font-black text-primary-gold">{payload[0].value} Orders</p>
                          <p className="text-[10px] font-bold text-white/50 mt-1">Revenue: KES {Number(payload[0].payload.revenue).toLocaleString()}</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar 
                  dataKey="orders" 
                  radius={[8, 8, 0, 0]} 
                  barSize={40}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 5 ? '#D4AF37' : '#1e293b'} stroke={index === 5 ? '#D4AF37' : '#334155'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Channel Distribution */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-secondary-black border border-white/5 rounded-[2.5rem] p-8"
        >
          <div className="mb-8">
            <h3 className="text-sm font-black text-white uppercase tracking-tight">Sales Channels</h3>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Acquisition source breakdown</p>
          </div>
          
          <div className="space-y-6">
            <ChannelRow label="Website Store" value={64} color="bg-primary-gold" />
            <ChannelRow label="WhatsApp Direct" value={22} color="bg-emerald-500" />
            <ChannelRow label="Phone / Concierge" value={10} color="bg-primary-pink" />
            <ChannelRow label="Walk-in / POS" value={4} color="bg-slate-700" />
          </div>

          <div className="mt-12 p-6 bg-white/[0.02] border border-white/5 rounded-3xl">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Top Region</h4>
            <div className="flex items-center justify-between">
              <span className="text-sm font-black text-white uppercase">Westlands</span>
              <span className="text-xs font-bold text-primary-gold">34% of volume</span>
            </div>
          </div>
        </motion.div>

      </div>

    </div>
  );
};

const KPICard = ({ title, value, change, trend, icon: Icon, color }: any) => {
  const colorMap: any = {
    gold: "text-primary-gold bg-primary-gold/10",
    pink: "text-primary-pink bg-primary-pink/10",
    emerald: "text-emerald-500 bg-emerald-500/10",
    white: "text-white bg-white/10"
  };

  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="bg-secondary-black border border-white/5 p-6 rounded-[2rem] relative overflow-hidden"
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-2xl ${colorMap[color]}`}>
          <Icon size={18} />
        </div>
        <div className={`flex items-center gap-1 text-[9px] font-black tracking-widest px-2 py-1 rounded-full border ${
          trend === 'up' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20'
        }`}>
          {trend === 'up' ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
          {change}
        </div>
      </div>
      <div>
        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{title}</p>
        <h3 className="text-xl font-black text-white tracking-tight uppercase">{value}</h3>
      </div>
    </motion.div>
  );
};

const ChannelRow = ({ label, value, color }: any) => (
  <div className="space-y-2">
    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
      <span className="text-slate-400">{label}</span>
      <span className="text-white">{value}%</span>
    </div>
    <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
      <motion.div 
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ duration: 1, ease: "easeOut" }}
        className={`h-full ${color} rounded-full`} 
      />
    </div>
  </div>
);
