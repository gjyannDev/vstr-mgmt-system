import {
  LayoutDashboard,
  type LucideIcon,
  Settings,
  UserPlus,
  Users,
} from "lucide-react";
import type { User } from "@/features/auth/types/auth.type";

export type AdminNavRole = User["role"];

export type AdminNavChildItem = {
  key: string;
  title: string;
  url: string;
  roles?: AdminNavRole[];
};

export type AdminNavItem = {
  key: string;
  title: string;
  icon: LucideIcon;
  url?: string;
  roles?: AdminNavRole[];
  children?: AdminNavChildItem[];
};

export const MAIN_ADMIN_NAV_ITEMS: AdminNavItem[] = [
  {
    key: "dashboard",
    title: "Dashboard",
    icon: LayoutDashboard,
    url: "/admin",
    roles: ["admin", "super_admin"],
  },
  {
    key: "visitors",
    title: "Visitors",
    icon: Users,
    children: [
      {
        key: "visits",
        title: "Visits",
        url: "/admin/visits",
      },
      {
        key: "visit-logs",
        title: "Visit Logs",
        url: "/admin/visit-logs",
      },
    ],
    roles: ["admin", "super_admin"],
  },
  {
    key: "staffs",
    title: "Staffs",
    icon: UserPlus,
    url: "/admin/staff",
    roles: ["admin", "super_admin"],
  },
];

export const SECONDARY_ADMIN_NAV_ITEMS: AdminNavItem[] = [
  {
    key: "settings",
    title: "Settings",
    icon: Settings,
    url: "/admin/settings",
    roles: ["admin", "super_admin"],
  },
];
