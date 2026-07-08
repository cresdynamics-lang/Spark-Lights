import * as React from "react"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export type FlatNavItem = {
  title: string
  url?: string
  icon?: React.ReactNode
}

export function NavMain({
  items,
  onNavigate,
  activeView,
}: {
  items: FlatNavItem[]
  onNavigate?: (view: string) => void
  activeView?: string
}) {
  return (
    <SidebarGroup className="px-0">
      <SidebarGroupLabel className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-2 px-4">
        Admin
      </SidebarGroupLabel>
      <SidebarMenu className="gap-1 px-2">
        {items.map((item) => {
          const isActive = activeView === item.title
          return (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                tooltip={item.title}
                isActive={isActive}
                className={`py-5 transition-all duration-200 ${
                  isActive
                    ? 'bg-primary-gold/15 text-primary-gold hover:bg-primary-gold/20 hover:text-primary-gold'
                    : 'hover:bg-primary-gold/10 hover:text-primary-gold'
                }`}
                onClick={() => onNavigate?.(item.title)}
              >
                {item.icon && <span className="[&>svg]:size-4">{item.icon}</span>}
                <span className="font-bold tracking-tight text-sm">{item.title}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}
