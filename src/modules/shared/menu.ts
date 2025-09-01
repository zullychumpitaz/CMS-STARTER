import { Bell, CreditCard, Gem, ScrollText, Shield, SquareUserRound, Users } from "lucide-react";

export const navMenuUser = [
  {
    title: "Usuarios",
    url: "/users",
    icon: Users,
    isActive: true,
    requiredPermissions: ["users:view"]
  },
];

export const navMenuSuperAdmin = [
  {
    title: "Autorización",
    url: "/roles",
    icon: Shield,
    requiredPermissions: ["roles:view", "permissions:view"], // Parent item requires view permissions for its children
    items: [
      { title: "Roles", url: "/roles", requiredPermissions: ["roles:view"] },
      { title: "Permisos", url: "/permissions", requiredPermissions: ["permissions:view"] }
    ],
  },
  {
    title: "Monitoreo",
    url: "/logs",
    icon: ScrollText,
    requiredPermissions: ["logs:view"], // Parent item requires view permission for its children
    items: [
      { title: "Logs", url: "/logs", requiredPermissions: ["logs:view"] },
    ],
  },
];

export const profileMenuUser = [
  { title: "My Profile", icon: SquareUserRound, url: "/profile" },
  { title: "Billing", url: "/billing", icon:CreditCard },
  { title: "Notifications", url: "/notifications", icon:Bell },
  { title: "Upgrade to Pro", url: "/upgrade", icon:Gem }
];

export const profileMenuSuperAdmin = [
  { title: "My Profile", icon: SquareUserRound, url: "/profile" },
  { title: "Notifications", url: "/notifications", icon:Bell }
]