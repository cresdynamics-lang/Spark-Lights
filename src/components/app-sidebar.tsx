import * as React from "react"

import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { 
  LayoutDashboardIcon, 
  ShoppingCartIcon, 
  UsersIcon, 
  FileTextIcon, 
  Settings2Icon, 
  CommandIcon,
  PackageIcon,
  ShieldCheckIcon
} from "lucide-react"

const data = {
  user: {
    name: "Admin User",
    email: "admin@marigold.com",
    avatar: "https://i.pravatar.cc/150?u=40",
  },
  navMain: [
    {
      title: "Overview",
      url: "/admin",
      icon: <LayoutDashboardIcon />,
      isActive: true,
      items: [
        {
          title: "Main Dashboard",
          url: "/admin",
        },
        {
          title: "Analytics Hub",
          url: "/admin/analytics",
        },
      ],
    },
    {
      title: "Order Flow",
      url: "#",
      icon: <ShoppingCartIcon />,
      items: [
        {
          title: "Live Orders",
          url: "/admin/orders",
        },
        {
          title: "Dispatch Board",
          url: "/admin/deliveries",
        },
        {
          title: "Order History",
          url: "/admin/orders/history",
        },
      ],
    },
    {
      title: "Store Management",
      url: "#",
      icon: <PackageIcon />,
      items: [
        {
          title: "Product Catalog",
          url: "/admin/products",
        },
        {
          title: "Inventory Tracking",
          url: "/admin/inventory",
        },
        {
          title: "Categories",
          url: "/admin/categories",
        },
        {
          title: "Discounts & Promo",
          url: "/admin/discounts",
        },
      ],
    },
    {
      title: "CRM & Social",
      url: "#",
      icon: <UsersIcon />,
      items: [
        {
          title: "Customer List",
          url: "/admin/customers",
        },
        {
          title: "Subscriptions",
          url: "/admin/subscriptions",
        },
        {
          title: "Reviews & Feedback",
          url: "/admin/reviews",
        },
        {
          title: "WhatsApp Logs",
          url: "/admin/whatsapp",
        },
      ],
    },
    {
      title: "Business Content",
      url: "#",
      icon: <FileTextIcon />,
      items: [
        {
          title: "Media Library",
          url: "/admin/media",
        },
        {
          title: "Blog & SEO",
          url: "/admin/blog",
        },
        {
          title: "Email Templates",
          url: "/admin/emails",
        },
        {
          title: "Financial Reports",
          url: "/admin/reports",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "System Settings",
      url: "/admin/settings",
      icon: <Settings2Icon />,
    },
    {
      title: "Staff & Permissions",
      url: "/admin/staff",
      icon: <ShieldCheckIcon />,
    },
  ],
}

import { useAuthStore } from "@/store/authStore"

export function AppSidebar({ 
  onNavigate, 
  activeView, 
  ...props 
}: React.ComponentProps<typeof Sidebar> & { 
  onNavigate?: (view: string) => void,
  activeView?: string
}) {
  const { user } = useAuthStore()
  const role = user?.role || 'FLORIST'

  // Helper to check if a navigation item or sub-item should be visible
  const isVisible = (title: string) => {
    // Universal access
    if (["Main Dashboard", "Dashboard"].includes(title)) return true;

    // Driver specific
    if (role === 'DRIVER') {
      return ["Dispatch Board"].includes(title);
    }

    // Florist/Staff specific
    if (role === 'FLORIST') {
      const restricted = ["Analytics Hub", "Financial Reports", "System Settings", "Staff & Permissions", "Discounts & Promo", "WhatsApp Logs"];
      return !restricted.includes(title);
    }

    // Manager specific
    if (role === 'MANAGER') {
      const restricted = ["System Settings", "Staff & Permissions"];
      return !restricted.includes(title);
    }

    // Owner sees everything
    return true;
  }

  // Filter main navigation
  const filteredNavMain = data.navMain.map(section => {
    // If the section title itself isn't allowed (e.g. Driver shouldn't see Store Management)
    const items = section.items?.filter(item => isVisible(item.title)) || [];
    return { ...section, items };
  }).filter(section => {
    if (role === 'DRIVER') {
      return section.title === 'Overview' || section.title === 'Order Flow';
    }
    return section.items && section.items.length > 0;
  });

  // Filter secondary navigation
  const filteredNavSecondary = data.navSecondary.filter(item => isVisible(item.title))

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-1.5!"
            >
              <a href="#" onClick={(e) => { e.preventDefault(); onNavigate?.("Dashboard") }}>
                <CommandIcon className="size-5!" />
                <span className="text-base font-black tracking-tight text-slate-900 dark:text-slate-100">Marigold Admin</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={filteredNavMain} onNavigate={onNavigate} activeView={activeView} />
        <NavSecondary items={filteredNavSecondary} className="mt-auto" onNavigate={onNavigate} activeView={activeView} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={{
          name: user?.name || "Staff Member",
          email: user?.email || "staff@marigold.co.ke",
          avatar: user?.avatarUrl || `https://i.pravatar.cc/150?u=${user?.id || 'default'}`
        }} />
      </SidebarFooter>
    </Sidebar>
  )
}
