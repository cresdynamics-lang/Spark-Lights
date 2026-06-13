import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { FlowerIcon, BellIcon, AlertTriangleIcon, TruckIcon } from "lucide-react"

export function SiteHeader() {
  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 bg-white/60 dark:bg-slate-950/60 backdrop-blur-xl sticky top-4 z-50 mx-8 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 shadow-sm">
      <div className="flex w-full items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <SidebarTrigger className="-ml-1 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 text-emerald-600 transition-colors" />
          <Separator
            orientation="vertical"
            className="mx-1 h-4 bg-slate-200 dark:bg-slate-800"
          />
          <div className="flex items-center gap-2">
            <div className="p-1 rounded-md bg-emerald-100 dark:bg-emerald-900/30">
              <FlowerIcon className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h1 className="text-sm font-black uppercase tracking-widest text-slate-900 dark:text-slate-100">
              Spark Lights <span className="text-emerald-500">Admin</span>
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Badge variant="outline" className="hidden md:flex gap-1.5 border-emerald-500/20 bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 px-3 py-1 font-bold rounded-full">
            <BellIcon className="h-3 w-3" /> 12 new orders
          </Badge>
          <Badge variant="outline" className="hidden md:flex gap-1.5 border-amber-500/20 bg-amber-500/10 text-amber-600 hover:bg-amber-500/20 px-3 py-1 font-bold rounded-full">
            <AlertTriangleIcon className="h-3 w-3" /> 3 low stock
          </Badge>
          <Badge variant="outline" className="hidden sm:flex gap-1.5 border-blue-500/20 bg-blue-500/10 text-blue-600 hover:bg-blue-500/20 px-3 py-1 font-bold rounded-full">
            <TruckIcon className="h-3 w-3" /> Delivery active
          </Badge>
        </div>
      </div>
    </header>
  )
}
