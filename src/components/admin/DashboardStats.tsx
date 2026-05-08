import React from 'react';
import { TrendingUp, ShoppingBag, DollarSign, Users } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";

const stats = [
  {
    label: "Total Revenue",
    value: "KES 1.2M",
    change: "+12.5%",
    icon: DollarSign,
    color: "text-emerald-600",
    bg: "bg-emerald-100/50"
  },
  {
    label: "Active Orders",
    value: "142",
    change: "+8.2%",
    icon: ShoppingBag,
    color: "text-blue-600",
    bg: "bg-blue-100/50"
  },
  {
    label: "Avg Order Value",
    value: "KES 4,500",
    change: "-2.4%",
    icon: TrendingUp,
    color: "text-amber-600",
    bg: "bg-amber-100/50"
  },
  {
    label: "New Customers",
    value: "28",
    change: "+18.3%",
    icon: Users,
    color: "text-purple-600",
    bg: "bg-purple-100/50"
  }
];

export const DashboardStats: React.FC = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 px-8">
      {stats.map((stat, i) => (
        <Card key={i} className="border-slate-200/50 dark:border-slate-800/50 bg-white/40 dark:bg-slate-950/40 backdrop-blur-xl rounded-2xl hover:shadow-sm transition-all duration-300 group">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <div className={`p-2 rounded-xl ${stat.bg} ${stat.color} group-hover:scale-105 transition-transform duration-300`}>
                <stat.icon className="h-4 w-4" />
              </div>
              <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${stat.change.startsWith('+') ? 'bg-emerald-500/10 text-emerald-600' : 'bg-red-500/10 text-red-600'}`}>
                {stat.change}
              </span>
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-500 dark:text-slate-400 mb-1">
                {stat.label}
              </p>
              <h3 className="text-xl font-black tracking-tight text-slate-900 dark:text-slate-100">
                {stat.value}
              </h3>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
