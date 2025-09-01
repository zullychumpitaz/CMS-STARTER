import { Bell, BookOpen, Bot, CreditCard, Gem, ScrollText, Settings2, Shield, SquareTerminal, SquareUserRound } from "lucide-react";

export const navMenuUser = [
    {
      title: "Playground",
      url: "#",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "History",
          url: "#",
        },
        {
          title: "Starred",
          url: "#",
        },
        {
          title: "Settings",
          url: "#",
        },
      ],
    },
    {
      title: "Models",
      url: "#",
      icon: Bot,
      items: [
        {
          title: "Genesis",
          url: "#",
        },
        {
          title: "Explorer",
          url: "#",
        },
        {
          title: "Quantum",
          url: "#",
        },
      ],
    },
    {
      title: "Documentation",
      url: "#",
      icon: BookOpen,
      items: [
        {
          title: "Introduction",
          url: "#",
        },
        {
          title: "Get Started",
          url: "#",
        },
        {
          title: "Tutorials",
          url: "#",
        },
        {
          title: "Changelog",
          url: "#",
        },
      ],
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "General",
          url: "#",
        },
        {
          title: "Team",
          url: "#",
        },
        {
          title: "Billing",
          url: "#",
        },
        {
          title: "Limits",
          url: "#",
        },
      ],
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