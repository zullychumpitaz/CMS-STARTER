"use client"

import { useSidebar, SidebarGroup, SidebarGroupLabel, SidebarMenu } from "@/components/ui/sidebar"
import { useState } from "react"

import { PermissionedMenuItem } from "./PermissionedMenuItem";

import { LucideIcon } from "lucide-react";

export function NavMain({
  items, title, userRole
}: {
  title: string,
  userRole: string,
  items: {
    title: string
    url: string
    icon?: LucideIcon
    requiredPermissions?: string[]
    items?: {
      title: string
      url: string
      requiredPermissions?: string[]
    }[]
  }[]
}) {
  const { state } = useSidebar();
  const [activeItem, setActiveItem] = useState<string | null>(null)

  return (
    <SidebarGroup>
      <SidebarGroupLabel>{title}</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <PermissionedMenuItem
            key={item.title}
            item={item}
            state={state}
            userRole= { userRole }
            activeItem={activeItem}
            setActiveItem={setActiveItem}
          />
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
