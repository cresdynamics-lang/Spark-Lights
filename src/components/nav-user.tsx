import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { LogOutIcon, CircleUserRoundIcon, CreditCardIcon, BellIcon, EllipsisVerticalIcon, Loader2 } from "lucide-react"
import { useAuthStore } from "@/store/authStore"
import { logout as logoutApi } from "@/api/auth"
import { useNavigate } from "react-router-dom"
import { useState } from "react"
import toast from "react-hot-toast"

export function NavUser({
  user,
}: {
  user: {
    name: string
    email: string
    avatar: string
  }
}) {
  const { isMobile } = useSidebar()
  const navigate = useNavigate()
  const { logout, refreshToken } = useAuthStore()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      if (refreshToken) {
        await logoutApi(refreshToken)
      }
    } catch (error) {
      console.error("Logout API failed:", error)
    } finally {
      logout()
      toast.success("Logged out successfully")
      navigate("/admin/login")
      setIsLoggingOut(false)
    }
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg grayscale">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="rounded-lg">{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user.name}</span>
                <span className="truncate text-xs text-muted-foreground">
                  {user.email}
                </span>
              </div>
              <EllipsisVerticalIcon className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg bg-secondary-black border-white/5 text-slate-300"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="rounded-lg">{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium text-white">{user.name}</span>
                  <span className="truncate text-xs text-slate-500">
                    {user.email}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-white/5" />
            <DropdownMenuGroup>
              <DropdownMenuItem className="focus:bg-white/5 focus:text-white cursor-pointer">
                <CircleUserRoundIcon className="size-4 mr-2" />
                Account
              </DropdownMenuItem>
              <DropdownMenuItem className="focus:bg-white/5 focus:text-white cursor-pointer">
                <CreditCardIcon className="size-4 mr-2" />
                Billing
              </DropdownMenuItem>
              <DropdownMenuItem className="focus:bg-white/5 focus:text-white cursor-pointer">
                <BellIcon className="size-4 mr-2" />
                Notifications
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator className="bg-white/5" />
            <DropdownMenuItem 
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="focus:bg-red-500/10 focus:text-red-500 text-red-500/80 cursor-pointer"
            >
              {isLoggingOut ? (
                <Loader2 className="size-4 mr-2 animate-spin" />
              ) : (
                <LogOutIcon className="size-4 mr-2" />
              )}
              {isLoggingOut ? "Signing out..." : "Log out"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
