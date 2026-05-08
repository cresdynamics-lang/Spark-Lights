import React from 'react';
import type { LucideIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface FieldProps {
  icon?: LucideIcon;
  label: string;
  value?: string;
  className?: string;
}

export const ModuleField: React.FC<FieldProps> = ({ icon: Icon, label, value, className }) => (
  <div className={cn("flex items-start gap-2.5 text-sm leading-relaxed py-1.5 border-b border-slate-100/50 dark:border-slate-900/50 last:border-0 group/field", className)}>
    {Icon && <Icon className="h-3.5 w-3.5 mt-1 text-emerald-500/60 shrink-0 group-hover/field:text-emerald-500 transition-colors" />}
    <div className="flex flex-col gap-0">
      <span className="font-black text-slate-900 dark:text-slate-100 text-[10px] uppercase tracking-wider opacity-60">{label}</span>
      <span className="text-slate-600 dark:text-slate-400 font-medium">{value}</span>
    </div>
  </div>
);

interface ModuleCardProps {
  title: string;
  icon: LucideIcon;
  badge?: string;
  badgeVariant?: "default" | "secondary" | "destructive" | "outline" | "success" | "warning";
  children: React.ReactNode;
  className?: string;
}

export const ModuleCard: React.FC<ModuleCardProps> = ({ 
  title, 
  icon: Icon, 
  badge, 
  badgeVariant = "default", 
  children, 
  className 
}) => {
  return (
    <Card className={cn(
      "overflow-hidden border-slate-200/50 dark:border-slate-800/50 bg-white/40 dark:bg-slate-950/40 backdrop-blur-2xl hover:shadow-md transition-all duration-300 group rounded-2xl",
      className
    )}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4 pb-2">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-300 shadow-xs">
            <Icon className="h-4 w-4" />
          </div>
          <CardTitle className="text-sm font-black tracking-tight text-slate-900 dark:text-slate-100">{title}</CardTitle>
        </div>
        {badge && (
          <Badge variant={badgeVariant as any} className="font-black text-[8px] uppercase tracking-wider px-2 py-0.5 rounded-full shadow-xs">
            {badge}
          </Badge>
        )}
      </CardHeader>
      <CardContent className="pt-0 pb-4 px-6">
        <div className="space-y-0.5">
          {children}
        </div>
      </CardContent>
    </Card>
  );
};
