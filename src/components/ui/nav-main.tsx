"use client"

import { ChevronRight, type LucideIcon } from "lucide-react"
import { usePathname } from "next/navigation"
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
import Link from "next/link"
import { useSidebar } from "@/components/ui/sidebar"
import { useState, useEffect } from "react"

export function NavMain({
  items, title
}: {
  title: string,
  items: {
    title: string
    url: string
    icon?: LucideIcon
    items?: {
      title: string
      url: string
    }[]
  }[]
}) {

  const { state } = useSidebar();
  const pathname = usePathname()
  const [activeItem, setActiveItem] = useState<string | null>(null)

  useEffect(() => {
    // cuando cambie el pathname, abrir el grupo correcto
    const activeGroup = items.find(item =>
      item.items?.some(subItem => pathname.startsWith(subItem.url))
    )
    if (activeGroup) {
      setActiveItem(activeGroup.title)
    }
  }, [pathname, items])

  return (
    <SidebarGroup>
      <SidebarGroupLabel>{title}</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
  const isParentActive = item.items?.some((subItem) => pathname.startsWith(subItem.url))

  return (
    <Collapsible
      key={item.title}
      asChild
      className="group/collapsible"
      open={activeItem === item.title || isParentActive}
      onOpenChange={(open) => {
        if (open) setActiveItem(item.title)
        else setActiveItem(null)
      }}
    >
      <SidebarMenuItem>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton
            tooltip={item.title}
            className={`cursor-pointer 
              hover:bg-primary! hover:text-primary-foreground!
              ${isParentActive ? "bg-primary text-primary-foreground" : ""}
            `}
            onClick={(e) => {
              if (state === "collapsed") {
                document.getElementById("collapsible-menu")?.click()
              }
            }}
          >
            {item.icon && <item.icon />}
            <span>{item.title}</span>
            <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub>
            {item.items?.map((subItem) => {
              const isActive = pathname.startsWith(subItem.url)
              return (
                <SidebarMenuSubItem key={subItem.title}>
                  <SidebarMenuSubButton
                    asChild
                    className={isActive ? "bg-input text-foreground" : ""}
                  >
                    <Link href={subItem.url}>
                      <span>{subItem.title}</span>
                    </Link>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              )
            })}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  )
})}
      </SidebarMenu>
    </SidebarGroup>
  )
}
