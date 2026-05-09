import * as React from "react"
import { ChevronRight } from "lucide-react"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"

export function NavMain({
  items,
  onNavigate,
  activeView
}: {
  items: {
    title: string
    url: string
    icon?: React.ReactNode
    isActive?: boolean
    items?: {
      title: string
      url: string
    }[]
  }[]
  onNavigate?: (view: string) => void
  activeView?: string
}) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-2 px-4">Management</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <Collapsible
            key={item.title}
            asChild
            defaultOpen={item.isActive || item.items?.some(sub => sub.title === activeView)}
            className="group/collapsible"
          >
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton 
                  tooltip={item.title} 
                  className={`hover:bg-primary-gold/10 hover:text-primary-gold transition-all duration-300 py-5 ${activeView === item.title ? 'bg-primary-gold/5 text-primary-gold' : ''}`}
                  onClick={() => !item.items && onNavigate?.(item.title)}
                >
                  {item.icon && <span className="[&>svg]:size-4">{item.icon}</span>}
                  <span className="font-bold tracking-tight text-sm">{item.title}</span>
                  {item.items && <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90 size-4 opacity-50" />}
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub className="border-primary-gold/10 ml-4">
                  {item.items?.map((subItem) => (
                    <SidebarMenuSubItem key={subItem.title}>
                      <SidebarMenuSubButton 
                        asChild 
                        className={`hover:text-primary-pink py-3 ${activeView === subItem.title ? 'text-primary-pink font-bold' : ''}`}
                      >
                        <a href="#" onClick={(e) => { e.preventDefault(); onNavigate?.(subItem.title) }}>
                          <span className="font-medium text-xs tracking-tight">{subItem.title}</span>
                        </a>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
