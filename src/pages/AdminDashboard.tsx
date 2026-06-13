import { useState } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { DashboardStats } from "@/components/admin/DashboardStats"
import { ModuleOverview } from "@/components/admin/ModuleOverview"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { TooltipProvider } from "@/components/ui/tooltip"
import { motion } from "framer-motion"

import { OrdersView } from "@/components/admin/views/OrdersView"
import { ProductsView } from "@/components/admin/views/ProductsView"
import { CustomersView } from "@/components/admin/views/CustomersView"
import { StaffView } from "@/components/admin/views/StaffView"
import { LogisticsView } from "@/components/admin/views/LogisticsView"
import { AnalyticsView } from "@/components/admin/views/AnalyticsView"
import { InventoryView } from "@/components/admin/views/InventoryView"
import { DiscountsView } from "@/components/admin/views/DiscountsView"
import { SubscriptionsView } from "@/components/admin/views/SubscriptionsView"
import { SettingsView } from "@/components/admin/views/SettingsView"
import { CategoriesView } from "@/components/admin/views/CategoriesView"
import { BlogView } from "@/components/admin/views/BlogView"
import { DispatchView } from "@/components/admin/views/DispatchView"

import { useAuthStore } from "@/store/authStore"
import { ShieldAlertIcon, FlowerIcon } from "lucide-react"
import AvatarInitials from "@/components/AvatarInitials"
import { AdminErrorBoundary } from "@/components/admin/AdminErrorBoundary"

export default function AdminDashboard() {
  const [activeView, setActiveView] = useState("Dashboard")
  const { user } = useAuthStore()
  const role = user?.role || 'FLORIST'

  const AccessDenied = () => (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center py-32 px-8 text-center"
    >
      <div className="p-6 rounded-full bg-red-500/10 mb-6">
        <ShieldAlertIcon className="h-12 w-12 text-red-500" />
      </div>
      <h2 className="text-2xl font-black tracking-tight text-white uppercase">Access Restricted</h2>
      <p className="text-slate-500 mt-2 font-bold uppercase tracking-widest text-[10px] max-w-sm mx-auto">
        Your account role ({role}) does not have clearance for this module. Please contact the store owner.
      </p>
    </motion.div>
  )

  const renderContent = () => {
    switch (activeView) {
      case "Main Dashboard":
      case "Dashboard":
        return (
          <>
            {['OWNER', 'MANAGER'].includes(role) && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <DashboardStats />
              </motion.div>
            )}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <ModuleOverview />
            </motion.div>
          </>
        )
      case "Live Orders":
      case "Order List & Details":
      case "Order History":
        return <OrdersView />
      case "Dispatch Board":
        return <DispatchView />
      case "Delivery Logistics":
        return <LogisticsView />
      case "Product Catalog":
      case "Flower Management":
        return <ProductsView />
      case "Inventory Tracking":
        return <InventoryView />
      case "Categories":
        return <CategoriesView />
      case "Blog & SEO":
        return <BlogView />
      case "Customer List":
      case "CRM Dashboard":
        return <CustomersView />
      case "Analytics Hub":
      case "Financial Reports":
      case "Analytics Dashboard":
        return ['OWNER', 'MANAGER'].includes(role) ? <AnalyticsView /> : <AccessDenied />
      case "Staff & Permissions":
      case "Team Management":
        return role === 'OWNER' ? <StaffView /> : <AccessDenied />
      case "Discounts & Promo":
        return <DiscountsView />
      case "Subscriptions":
        return <SubscriptionsView />
      case "System Settings":
        return role === 'OWNER' ? <SettingsView /> : <AccessDenied />
      default:
        return (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center min-h-[400px] text-center px-8"
          >
            <div className="p-6 rounded-full bg-primary-gold/10 mb-6">
              <FlowerIcon className="h-12 w-12 text-primary-gold animate-pulse" />
            </div>
            <h2 className="text-2xl font-black tracking-tight text-white uppercase">
              {activeView}
            </h2>
            <p className="text-slate-500 mt-2 font-bold uppercase tracking-[0.2em] text-[10px] opacity-60">
              System is synchronizing real-time {activeView.toLowerCase()} data...
            </p>
          </motion.div>
        )
    }
  }

  return (
    <AdminErrorBoundary>
    <TooltipProvider>
      <SidebarProvider className="font-sans antialiased dark bg-primary-black text-white min-h-screen">
        <AppSidebar variant="floating" onNavigate={setActiveView} activeView={activeView} />
        <SidebarInset className="!bg-primary-black min-h-screen overflow-hidden text-white">
          <SiteHeader />
          <div className="flex flex-1 flex-col gap-12 pb-24">

            {/* Dashboard Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="px-8 pt-8 pb-0"
            >
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                  <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-3">
                    <div className="h-7 w-1.5 bg-primary-pink rounded-full shadow-[0_0_15px_rgba(219,39,119,0.3)]" />
                    {activeView === "Dashboard" ? "Control Centre" : activeView}
                  </h1>
                  <p className="text-slate-400 mt-1 font-bold text-xs tracking-widest uppercase opacity-60">
                    Spark Lights 254 · {activeView === "Dashboard" ? "Administration" : "Module Management"}
                  </p>
                </div>
                <div className="flex items-center gap-3 bg-secondary-black backdrop-blur-md p-1.5 px-3 rounded-xl border border-white/5">
                  <div className="flex -space-x-2">
                    {['JK', 'GM', 'PO'].map((initials) => (
                      <div key={initials} className="h-8 w-8 rounded-full border-2 border-secondary-black bg-secondary-black flex items-center justify-center overflow-hidden shadow-sm">
                        <AvatarInitials name={initials} className="h-full w-full text-[10px] rounded-full" />
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-white">3 Staff Online</span>
                    <span className="text-[8px] font-bold text-primary-gold uppercase tracking-widest flex items-center gap-1">
                      <div className="h-1 w-1 rounded-full bg-primary-gold animate-pulse" /> Live
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>

            {renderContent()}

          </div>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
    </AdminErrorBoundary>
  )
}
