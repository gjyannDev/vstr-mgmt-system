"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ChevronRight, LogOut } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
  SidebarSeparator,
  useSidebar,
} from "@/components/ui/sidebar";
import { useLogout } from "@/features/auth/queries/auth.queries";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { useMutationCallbacks } from "@/hooks/use-mutation-callbacks";
import { cn } from "@/lib/utils";
import {
  MAIN_ADMIN_NAV_ITEMS,
  SECONDARY_ADMIN_NAV_ITEMS,
  type AdminNavItem,
  type AdminNavRole,
} from "@/my-components/admin/admin-navigation.constants";

function isPathActive(pathname: string, url?: string) {
  if (!url) {
    return false;
  }

  if (url === "/admin") {
    return pathname === url;
  }

  return pathname === url || pathname.startsWith(`${url}/`);
}

function hasVisibleChildren(item: AdminNavItem, role: AdminNavRole) {
  return item.children?.some(
    (child) => !child.roles || child.roles.includes(role),
  );
}

export default function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { state } = useSidebar();
  const logoutMutation = useLogout();
  const user = useAuthStore((store) => store.user);
  const { buildCallbacks } = useMutationCallbacks({ entityName: "Session" });
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});
  const hydrated = useAuthStore((store) => store.hydrated);

  useEffect(() => {
    useAuthStore.setState({ hydrated: true });
  }, []);

  const userRole: AdminNavRole = user?.role ?? "admin";
  const isCollapsed = state === "collapsed";

  const filteredMainItems = useMemo(
    () =>
      MAIN_ADMIN_NAV_ITEMS.filter(
        (item) =>
          (!item.roles || item.roles.includes(userRole)) &&
          (!item.children || hasVisibleChildren(item, userRole)),
      ),
    [userRole],
  );

  const filteredSecondaryItems = useMemo(
    () =>
      SECONDARY_ADMIN_NAV_ITEMS.filter(
        (item) => !item.roles || item.roles.includes(userRole),
      ),
    [userRole],
  );

  const handleSignOut = () => {
    logoutMutation.mutate(
      undefined,
      buildCallbacks("change", "Session", {
        successMessage: "Signed out successfully.",
        errorMessage: "Sign out failed. Please try again.",
        onSuccess: () => {
          router.replace("/admin/signin");
        },
      }),
    );
  };

  return (
    <Sidebar
      collapsible="icon"
      className="h-full w-(--sidebar-width) min-w-(--sidebar-width) max-w-(--sidebar-width) group-data-[collapsible=icon]:w-(--sidebar-width-icon) group-data-[collapsible=icon]:min-w-(--sidebar-width-icon) group-data-[collapsible=icon]:max-w-(--sidebar-width-icon)"
    >
      <SidebarContent className="flex h-full w-full max-w-full flex-col overflow-x-hidden bg-background text-black">
        <SidebarHeader className="px-3 py-4">
          {isCollapsed ? (
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-white/10 font-display text-sm tracking-wide">
              V
            </div>
          ) : (
            <div className="font-display text-3xl tracking-wide text-primary italic">
              VisitNa!
            </div>
          )}
        </SidebarHeader>

        <SidebarSeparator className="opacity-20" />

        {!hydrated ? (
          <div className="flex min-h-0 flex-1 flex-col overflow-y-auto" />
        ) : (
          <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu className="gap-1">
                  {filteredMainItems.map((item) => {
                    const Icon = item.icon;

                    if (item.children && item.children.length > 0) {
                      const visibleChildren = item.children.filter(
                        (child) =>
                          !child.roles || child.roles.includes(userRole),
                      );
                      const isChildActive = visibleChildren.some((child) =>
                        isPathActive(pathname, child.url),
                      );
                      const isOpen = openGroups[item.key] ?? isChildActive;

                      return (
                        <SidebarMenuItem key={item.key}>
                          <SidebarMenuButton
                            size="lg"
                            tooltip={item.title}
                            isActive={isChildActive}
                            onClick={() =>
                              setOpenGroups((prev) => ({
                                ...prev,
                                [item.key]: !isOpen,
                              }))
                            }
                          >
                            <Icon className="h-5 w-5 shrink-0" />
                            <span className="truncate group-data-[collapsible=icon]:hidden">
                              {item.title}
                            </span>
                            <ChevronRight
                              className={cn(
                                "ml-auto h-4 w-4 transition-transform group-data-[collapsible=icon]:hidden",
                                isOpen && "rotate-90",
                              )}
                            />
                          </SidebarMenuButton>

                          {isOpen && (
                            <SidebarMenuSub>
                              {visibleChildren.map((child) => (
                                <SidebarMenuSubItem key={child.key}>
                                  <SidebarMenuSubButton
                                    asChild
                                    isActive={isPathActive(pathname, child.url)}
                                    className="text-sm text-black"
                                  >
                                    <Link href={child.url}>{child.title}</Link>
                                  </SidebarMenuSubButton>
                                </SidebarMenuSubItem>
                              ))}
                            </SidebarMenuSub>
                          )}
                        </SidebarMenuItem>
                      );
                    }

                    return (
                      <SidebarMenuItem key={item.key}>
                        <SidebarMenuButton
                          asChild
                          size="lg"
                          tooltip={item.title}
                          isActive={isPathActive(pathname, item.url)}
                        >
                          <Link href={item.url ?? "#"}>
                            <Icon className="h-5 w-5 shrink-0" />
                            <span className="group-data-[collapsible=icon]:hidden">
                              {item.title}
                            </span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>

                <SidebarSeparator className="my-5 opacity-25 group-data-[collapsible=icon]:hidden" />

                <SidebarMenu className="gap-1">
                  {filteredSecondaryItems.map((item) => {
                    const Icon = item.icon;

                    return (
                      <SidebarMenuItem key={item.key}>
                        <SidebarMenuButton
                          asChild
                          size="lg"
                          tooltip={item.title}
                          isActive={isPathActive(pathname, item.url)}
                        >
                          <Link href={item.url ?? "#"}>
                            <Icon className="h-4 w-4 shrink-0" />
                            <span className="group-data-[collapsible=icon]:hidden">
                              {item.title}
                            </span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </div>
        )}

        <SidebarFooter className="w-full max-w-full px-3 pb-5">
          {!hydrated ? (
            <div className="w-full" />
          ) : (
            <>
              <SidebarMenu className="gap-1">
                <SidebarMenuItem>
                  <SidebarMenuButton
                    size="lg"
                    tooltip="Sign out"
                    className="cursor-pointer text-red-300/90 hover:bg-red-500/10 hover:text-red-300"
                    onClick={handleSignOut}
                    disabled={logoutMutation.isPending}
                  >
                    <LogOut className="h-4 w-4 shrink-0" />
                    <span className="truncate group-data-[collapsible=icon]:hidden">
                      {logoutMutation.isPending ? "Signing out..." : "Sign out"}
                    </span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>

              <SidebarSeparator className="my-3 opacity-25 group-data-[collapsible=icon]:hidden" />
              {!isCollapsed && (
                <div className="flex w-full min-w-0 max-w-full items-center gap-3 overflow-hidden rounded-lg px-2 py-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-600 text-sm font-semibold uppercase">
                    {user?.name?.charAt(0) ?? "A"}
                  </div>

                  <div className="min-w-0 flex-1 overflow-hidden">
                    <p className="truncate whitespace-nowrap text-sm text-black">
                      {user?.name ?? "Admin User"}
                    </p>
                    <p className="truncate whitespace-nowrap text-xs text-placeholder-subtle">
                      {user?.email ?? "admin@visitna.local"}
                    </p>
                  </div>
                </div>
              )}
            </>
          )}
        </SidebarFooter>
      </SidebarContent>

      <SidebarRail />
    </Sidebar>
  );
}
