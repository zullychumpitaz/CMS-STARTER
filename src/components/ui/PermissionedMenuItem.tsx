"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, type LucideIcon } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { getRoleByName, havePermission } from "@/modules/roles/roles-actions";
import { useSession } from "next-auth/react";

interface NavItem {
  title: string;
  url: string;
  icon?: LucideIcon;
  requiredPermissions?: string[];
  items?: {
    title: string;
    url: string;
    requiredPermissions?: string[];
  }[];
}

interface PermissionedMenuItemProps {
  item: NavItem;
  state: "expanded" | "collapsed";
  activeItem: string | null;
  setActiveItem: (item: string | null) => void;
  userRole: string
}

export function PermissionedMenuItem({
  item,
  state,
  activeItem,
  setActiveItem,
  userRole
}: PermissionedMenuItemProps) {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(false);
  const [roleId, setRoleId] = useState('');
  const [subItemsVisibility, setSubItemsVisibility] = useState<{
    [key: string]: boolean;
  }>({});

   useEffect(() => {
      async function fetchUserRoleDetails() {
        if(userRole){
          try {
              const role = await getRoleByName(userRole);
              setRoleId(role!.id)
            } catch (err) {
              console.error("Failed to fetch role details:", err);
            }
          }
    
        }
        fetchUserRoleDetails();
    }, [userRole]);

  useEffect(() => {
    const checkVisibility = async () => {
      if (item.requiredPermissions && item.requiredPermissions.length > 0) {
        const hasPerm = await havePermission(
          roleId,
          item.requiredPermissions[0], // Assuming havePermission checks for one permission at a time
        );
        setIsVisible(hasPerm);
      } else {
        setIsVisible(true); // No required permissions, so always visible
      }

      if (item.items) {
        const newSubItemsVisibility: { [key: string]: boolean } = {};
        for (const subItem of item.items) {
          if (subItem.requiredPermissions && subItem.requiredPermissions.length > 0) {
            const hasSubPerm = await havePermission(
              roleId,
              subItem.requiredPermissions[0],
            );
            newSubItemsVisibility[subItem.title] = hasSubPerm;
          } else {
            newSubItemsVisibility[subItem.title] = true;
          }
        }
        setSubItemsVisibility(newSubItemsVisibility);
      }
    };

    checkVisibility();
  }, [item, roleId]);

  const isParentActive = item.items?.some(
    (subItem) => pathname.startsWith(subItem.url) && subItemsVisibility[subItem.title],
  );

  if (!isVisible && (!item.items || Object.values(subItemsVisibility).every(v => !v))) {
    return null; // Don't render if parent is not visible and no visible sub-items
  }

  if (item.items) {
    return (
      <Collapsible
        asChild
        className="group/collapsible"
        open={activeItem === item.title || isParentActive}
        onOpenChange={(open) => {
          if (open) setActiveItem(item.title);
          else setActiveItem(null);
        }}
      >
        <SidebarMenuItem>
          <CollapsibleTrigger asChild>
            <SidebarMenuButton
              tooltip={item.title}
              className={cn(
                "cursor-pointer hover:bg-primary! hover:text-primary-foreground!",
                isParentActive && "bg-primary text-primary-foreground",
              )}
              onClick={() => {
                if (state === "collapsed") {
                  document.getElementById("collapsible-menu")?.click();
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
              {item.items.map((subItem) => {
                const isActive = pathname.startsWith(subItem.url);
                if (!subItemsVisibility[subItem.title]) {
                  return null;
                }
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
                );
              })}
            </SidebarMenuSub>
          </CollapsibleContent>
        </SidebarMenuItem>
      </Collapsible>
    );
  }

  return (
    <Link
      key={item.url}
      href={item.url}
      className={cn(
        "flex items-center text-sm font-medium hover:text-foreground/80",
        item.url === pathname && "text-foreground", // Highlight active link
        item.url !== pathname && "text-muted-foreground", // Dim inactive links
      )}
    >
      {item.icon && <item.icon className="mr-2 h-4 w-4" />}
      {item.title}
    </Link>
  );
}
