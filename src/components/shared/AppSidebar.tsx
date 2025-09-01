'use client';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  useSidebar,
} from "@/components/ui/sidebar"

import Image from "next/image";
import logoIcon from "/public/images/logos/logo-icon.svg"
import { NavMain } from "../ui/nav-main";
import { NavUser } from "../ui/nav-user";
import { useSession } from "next-auth/react"
import { navMenuSuperAdmin, navMenuUser } from "@/modules/shared/menu";
import { LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export function AppSidebar() {
  const { state } = useSidebar();
  const { data: session } = useSession()
  const role = session?.user?.rol
  
  const user = {
      name: session?.user?.name || '',
      email: session?.user?.email || '',
      avatar: session?.user?.image || ''
  }

  return (
    <Sidebar collapsible="icon" className="opacity-100 bg-background">
      <SidebarHeader className="bg-background">
        {
          state === "collapsed" ? (
            <Image src={logoIcon} alt={"CMS Starter"} />
          ) : (
            <div className="flex items-center justify-center gap-2">
              <Image src={logoIcon} alt={"CMS Starter"} />
              <h1 className="text-lg font-bold">CMS Starter</h1>
            </div>
          )
        }
      </SidebarHeader>
      <SidebarContent className="bg-background pt-2">
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip={"Dashboard"} className="cursor-pointer
                  hover:bg-primary hover:text-primary-foreground
                  group-data-[state=open]/collapsible:bg-primary 
                  group-data-[state=open]/collapsible:text-primary-foreground
                  group-data-[state=open]/collapsible:hover:bg-primary!
                  group-data-[state=open]/collapsible:hover:text-primary-foreground!"
                >
                  <Link href={"/dashboard"}>
                    <LayoutDashboard />
                    <span>Dashboard</span>
                  </Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
        <NavMain items={navMenuUser} userRole={ role! } title={"Módulos"} />
        <SidebarSeparator />
        <NavMain items={navMenuSuperAdmin} userRole={ role! } title={"Configuración"} />
      </SidebarContent>
      <SidebarFooter className="bg-background">
        <NavUser user={user} isAdmin={ role === "Super Administrador"} />
      </SidebarFooter>
    </Sidebar>
  )
}