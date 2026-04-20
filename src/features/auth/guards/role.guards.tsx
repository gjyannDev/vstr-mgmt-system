"use client";

import { useEffect, useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/features/auth/store/auth.store";
import type { User } from "@/features/auth/types/auth.type";

type Role = User["role"];

export type RoleGuardParams = {
  requiredRole: Role | Role[];
  signInPath?: string;
  unauthorizedPath?: string;
  children: React.ReactNode;
};

function resolveAllowedRoles(requiredRole: Role | Role[]) {
  return Array.isArray(requiredRole) ? requiredRole : [requiredRole];
}

export default function RoleGuard({
  requiredRole,
  signInPath = "/signin",
  unauthorizedPath = "/unauthorized",
  children,
}: RoleGuardParams) {
  const router = useRouter();
  const pathname = usePathname();
  const user = useAuthStore((state) => state.user);
  const hydrated = useAuthStore((state) => state.hydrated);

  const allowedRoles = useMemo(
    () => resolveAllowedRoles(requiredRole),
    [requiredRole],
  );

  const status = useMemo(() => {
    if (!hydrated) {
      return "loading";
    }

    if (!user) {
      return "unauthenticated";
    }

    if (!allowedRoles.includes(user.role)) {
      return "unauthorized";
    }

    return "authorized";
  }, [allowedRoles, hydrated, user]);

  useEffect(() => {
    if (status === "unauthenticated") {
      const redirectUrl = encodeURIComponent(pathname ?? "/");
      router.replace(`${signInPath}?redirectUrl=${redirectUrl}`);
    }

    if (status === "unauthorized") {
      router.replace(unauthorizedPath);
    }
  }, [pathname, router, signInPath, status, unauthorizedPath]);

  if (status !== "authorized") {
    return null;
  }

  return <>{children}</>;
}
