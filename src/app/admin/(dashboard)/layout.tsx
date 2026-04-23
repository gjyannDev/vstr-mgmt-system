"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import AppSidebar from "@/my-components/admin/app-sidebar";
import {
  MAIN_ADMIN_NAV_ITEMS,
  SECONDARY_ADMIN_NAV_ITEMS,
} from "@/my-components/admin/admin-navigation.constants";

function getPageTitle(pathname: string): string {
  // Search in main navigation items
  for (const item of MAIN_ADMIN_NAV_ITEMS) {
    if (item.url && pathname === item.url) {
      return item.title;
    }
    if (item.children) {
      const child = item.children.find((c) => pathname === c.url);
      if (child) return child.title;
    }
  }

  // Search in secondary navigation items
  for (const item of SECONDARY_ADMIN_NAV_ITEMS) {
    if (item.url && pathname === item.url) {
      return item.title;
    }
  }

  return "Admin Console";
}

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  return (
    <TooltipProvider>
      <SidebarProvider
        style={
          {
            "--sidebar-width": "16rem",
            "--sidebar-width-icon": "3.5rem",
          } as React.CSSProperties
        }
        className="flex min-h-screen w-full md:[&_[data-slot=sidebar-gap]]:w-0"
      >
        <AppSidebar />

        <SidebarInset className="flex min-w-0 flex-1 flex-col md:ml-[var(--sidebar-width)] md:peer-data-[state=collapsed]:ml-[var(--sidebar-width-icon)] transition-[margin-left] duration-200 ease-linear">
          <header className="sticky top-0 z-10 flex h-14 items-center gap-3 border-b bg-background px-4 shadow-xs md:h-16 md:px-6">
            <SidebarTrigger />
            <p className="font-display text-xl text-black-secondary">
              {getPageTitle(pathname)}
            </p>
          </header>

          <div className="p-4 md:p-6">{children}</div>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
}
