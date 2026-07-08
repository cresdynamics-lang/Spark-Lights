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
  ShieldCheckIcon,
  TruckIcon,
  BoxesIcon,
  TagsIcon,
  PercentIcon,
  BarChart3Icon,
  RepeatIcon,
} from "lucide-react"
import { useAuthStore } from "@/store/authStore"

const navItems = [
  { title: "Dashboard", icon: <LayoutDashboardIcon /> },
  { title: "Orders", icon: <ShoppingCartIcon /> },
  { title: "Dispatch", icon: <TruckIcon /> },
  { title: "Products", icon: <PackageIcon /> },
  { title: "Inventory", icon: <BoxesIcon /> },
  { title: "Categories", icon: <TagsIcon /> },
  { title: "Discounts", icon: <PercentIcon /> },
  { title: "Customers", icon: <UsersIcon /> },
  { title: "Subscriptions", icon: <RepeatIcon /> },
  { title: "Blog & SEO", icon: <FileTextIcon /> },
  { title: "Analytics", icon: <BarChart3Icon /> },
]

const secondaryItems = [
  { title: "Settings", url: "/admin/settings", icon: <Settings2Icon /> },
  { title: "Staff", url: "/admin/staff", icon: <ShieldCheckIcon /> },
]

export function AppSidebar({
  onNavigate,
  activeView,
  ...props
}: React.ComponentProps<typeof Sidebar> & {
  onNavigate?: (view: string) => void
  activeView?: string
}) {
  const { user } = useAuthStore()
  const role = user?.role || "FLORIST"

  const isVisible = (title: string) => {
    if (["Dashboard"].includes(title)) return true

    if (role === "DRIVER") {
      return ["Dispatch"].includes(title)
    }

    if (role === "FLORIST") {
      const restricted = ["Analytics", "Settings", "Staff", "Discounts"]
      return !restricted.includes(title)
    }

    if (role === "MANAGER") {
      const restricted = ["Settings", "Staff"]
      return !restricted.includes(title)
    }

    return true
  }

  const filteredNav = navItems.filter((item) => isVisible(item.title))
  const filteredSecondary = secondaryItems.filter((item) => isVisible(item.title))

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-1.5!"
            >
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  onNavigate?.("Dashboard")
                }}
              >
                <CommandIcon className="size-5!" />
                <span className="text-base font-black tracking-tight text-slate-900 dark:text-slate-100">
                  Spark Lights Admin
                </span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="overflow-y-auto">
        <NavMain items={filteredNav} onNavigate={onNavigate} activeView={activeView} />
        <NavSecondary
          items={filteredSecondary}
          className="mt-auto"
          onNavigate={onNavigate}
          activeView={activeView}
        />
      </SidebarContent>
      <SidebarFooter>
        <NavUser
          user={{
            name: user?.name || "Staff Member",
            email: user?.email || "staff@sparklights.co.ke",
            avatar: user?.avatarUrl || "",
          }}
        />
      </SidebarFooter>
    </Sidebar>
  )
}
