import {
  LayoutDashboard,
  type LucideIcon,
  MapPin,
  Monitor,
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
    roles: ["admin"],
  },
  {
    key: "my-locations",
    title: "My Locations",
    icon: MapPin,
    url: "/admin/my-locations",
    roles: ["admin"],
  },
  {
    key: "visit-logs",
    title: "Visit Logs",
    icon: UserPlus,
    url: "/admin/visit-logs",
    roles: ["admin"],
  },
  {
    key: "locations",
    title: "Locations",
    icon: MapPin,
    url: "/admin/locations",
    roles: ["super_admin"],
  },
  {
    key: "users",
    title: "Admins",
    icon: UserPlus,
    url: "/admin/users",
    roles: ["super_admin"],
  },
  {
    key: "kiosk-management",
    title: "Kiosks",
    icon: Monitor,
    url: "/admin/kiosks",
    roles: ["super_admin"],
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
