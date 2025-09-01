"use client"

import {
  ChevronsUpDown,
  LogOut,
} from "lucide-react"
import { signOut } from "next-auth/react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
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
import { getInitials } from "@/lib/utils"
import { profileMenuUser, profileMenuSuperAdmin } from "@/modules/shared/menu"

export function NavUser({
  user,
  isAdmin
}: {
  user: {
    name: string
    email: string
    avatar: string
  },
  isAdmin: boolean
}) {
  const { isMobile } = useSidebar();


  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="rounded-lg">{ getInitials( user.name ) }</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user.name}</span>
                <span className="truncate text-xs">{user.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="rounded-lg">{ getInitials( user.name ) }</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{user.name}</span>
                  <span className="truncate text-xs">{user.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {
              !isAdmin ?
                profileMenuUser.map((item) => (
                  <DropdownMenuItem key={item.title} onSelect={() => {
                    if (item.url) {
                      window.location.href = item.url;
                    }
                  }}>
                    {item.icon && <item.icon className="mr-2 size-4" />}
                    {item.title}
                  </DropdownMenuItem>
                ))
                :
                profileMenuSuperAdmin.map((item) => (
                  <DropdownMenuItem key={item.title} onSelect={() => {
                    if (item.url) {
                      window.location.href = item.url;
                    }
                  }}>
                    {item.icon && <item.icon className="mr-2 size-4" />}
                    {item.title}
                  </DropdownMenuItem>
                ))
            }
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={() => signOut({ callbackUrl: "/", redirect: true })} className="cursor-pointer">
              <LogOut className="mr-2 size-4" />
              Cerrar sesión
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
