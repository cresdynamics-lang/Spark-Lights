"use client"

import * as React from "react"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroupLabel,
} from "@/components/ui/sidebar"

export function NavSecondary({
  items,
  onNavigate,
  activeView,
  ...props
}: {
  items: {
    title: string
    url: string
    icon: React.ReactNode
  }[]
  onNavigate?: (view: string) => void
  activeView?: string
} & React.ComponentPropsWithoutRef<typeof SidebarGroup>) {
  return (
    <SidebarGroup {...props}>
      <SidebarGroupLabel className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 mb-2 px-4">System</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton 
                asChild 
                className={`hover:bg-emerald-500/10 hover:text-emerald-600 dark:hover:text-emerald-400 py-4 ${activeView === item.title ? 'bg-emerald-500/5 text-emerald-600' : ''}`}
                onClick={() => onNavigate?.(item.title)}
              >
                <a href="#" onClick={(e) => e.preventDefault()}>
                  <span className="[&>svg]:size-4">{item.icon}</span>
                  <span className="font-bold tracking-tight text-sm">{item.title}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
