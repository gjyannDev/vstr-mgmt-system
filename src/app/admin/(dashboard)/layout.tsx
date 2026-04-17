import type { ReactNode } from "react";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import AppSidebar from "@/my-components/admin/app-sidebar";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <TooltipProvider>
      <SidebarProvider
        style={
          {
            "--sidebar-width": "220px",
            "--sidebar-width-icon": "3.5rem",
          } as React.CSSProperties
        }
        className="flex min-h-screen w-full md:[&_[data-slot=sidebar-gap]]:w-0"
      >
        <AppSidebar />

        <SidebarInset className="flex min-w-0 flex-1 flex-col md:ml-[var(--sidebar-width)] md:peer-data-[state=collapsed]:ml-[var(--sidebar-width-icon)] transition-[margin-left] duration-200 ease-linear">
          <header className="sticky top-0 z-10 flex h-14 items-center gap-3 border-b bg-background/95 px-4 shadow-xs md:h-16 md:px-6">
            <SidebarTrigger />
            <p className="font-display text-sm text-black-secondary">
              Admin Console
            </p>
          </header>

          <div className="p-4 md:p-6">{children}</div>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
}
