import React from 'react';
import type { LucideIcon } from 'lucide-react';
import { cn } from "@/lib/utils";
import { motion } from 'framer-motion';

interface FieldProps {
  icon?: LucideIcon;
  label: string;
  value?: string;
  className?: string;
}

export const ModuleField: React.FC<FieldProps> = ({ icon: Icon, label, value, className }) => (
  <div className={cn("flex items-start gap-4 py-3 border-b border-white/5 last:border-0 group/field", className)}>
    {Icon && (
      <div className="mt-1 p-1.5 rounded-lg bg-white/5 text-slate-500 group-hover/field:text-primary-gold group-hover/field:bg-primary-gold/10 transition-all">
        <Icon className="h-3 w-3" />
      </div>
    )}
    <div className="flex flex-col gap-0.5">
      <span className="font-black text-slate-500 text-[9px] uppercase tracking-[0.15em]">{label}</span>
      <span className="text-slate-300 font-bold text-xs leading-tight">{value}</span>
    </div>
  </div>
);

interface ModuleCardProps {
  title: string;
  icon: LucideIcon;
  badge?: string;
  badgeVariant?: string;
  children: React.ReactNode;
  className?: string;
}

export const ModuleCard: React.FC<ModuleCardProps> = ({ 
  title, 
  icon: Icon, 
  badge, 
  children, 
  className 
}) => {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className={cn(
        "bg-secondary-black rounded-[2rem] border border-white/5 overflow-hidden shadow-2xl group",
        className
      )}
    >
      <div className="p-6 pb-2 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-2.5 rounded-xl bg-white/5 text-primary-gold group-hover:bg-primary-gold group-hover:text-white transition-all duration-500">
            <Icon className="h-4 w-4" />
          </div>
          <h3 className="text-sm font-black text-white uppercase tracking-tight">{title}</h3>
        </div>
        {badge && (
          <span className="text-[8px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full bg-primary-gold/10 text-primary-gold border border-primary-gold/20 shadow-lg">
            {badge}
          </span>
        )}
      </div>
      <div className="px-8 pb-6 pt-2">
        <div className="space-y-1">
          {children}
        </div>
      </div>
    </motion.div>
  );
};
