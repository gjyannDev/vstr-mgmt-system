import { NextResponse, type NextRequest } from "next/server";

const ADMIN_SIGN_IN_PATH = "/admin/signin";
const ADMIN_HOME_PATH = "/admin";
const ALLOWED_ADMIN_ROLES = ["admin", "super_admin"] as const;

type AdminRole = (typeof ALLOWED_ADMIN_ROLES)[number];

function isAdminRole(role: string | undefined): role is AdminRole {
  if (!role) {
    return false;
  }

  return ALLOWED_ADMIN_ROLES.includes(role as AdminRole);
}

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  const token = request.cookies.get("auth_token")?.value;
  const role = request.cookies.get("auth_role")?.value;
  const onSignInPage = pathname === ADMIN_SIGN_IN_PATH;
  const hasAllowedRole = isAdminRole(role);

  if (onSignInPage) {
    if (token && hasAllowedRole) {
      const redirectTarget = request.nextUrl.searchParams.get("redirectUrl");
      const safeRedirect =
        redirectTarget && redirectTarget.startsWith("/admin")
          ? redirectTarget
          : ADMIN_HOME_PATH;

      return NextResponse.redirect(new URL(safeRedirect, request.url));
    }

    return NextResponse.next();
  }

  if (!token) {
    const signInUrl = new URL(ADMIN_SIGN_IN_PATH, request.url);
    signInUrl.searchParams.set("redirectUrl", `${pathname}${search}`);

    return NextResponse.redirect(signInUrl);
  }

  if (!hasAllowedRole) {
    const signInUrl = new URL(ADMIN_SIGN_IN_PATH, request.url);
    signInUrl.searchParams.set("reason", "forbidden");

    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
