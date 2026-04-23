import { NextResponse, type NextRequest } from "next/server";

const ADMIN_SIGN_IN_PATH = "/admin/signin";
const ADMIN_HOME_PATH = "/admin";
const ALLOWED_ADMIN_ROLES = ["admin", "super_admin"] as const;
const KIOSK_SUCCESS_PATH = "/activate/success";
const KIOSK_ACTIVATE_PATH = "/activate";
const KIOSK_VERIFY_PATH = "/activate/verify";
const KIOSK_VERIFY_MANUAL_PATH = "/activate/verify-manual";
const ALLOWED_KIOSK_ROLES = ["kiosk"] as const;

type AdminRole = (typeof ALLOWED_ADMIN_ROLES)[number];
type KioskRole = (typeof ALLOWED_KIOSK_ROLES)[number];

function isAdminRole(role: string | undefined): role is AdminRole {
  if (!role) {
    return false;
  }

  return ALLOWED_ADMIN_ROLES.includes(role as AdminRole);
}

function isKioskRole(role: string | undefined): role is KioskRole {
  if (!role) {
    return false;
  }

  return ALLOWED_KIOSK_ROLES.includes(role as KioskRole);
}

export default function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  const token = request.cookies.get("auth_token")?.value;
  const role = request.cookies.get("auth_role")?.value;
  const hasKioskSession = Boolean(token) && isKioskRole(role);

  if (
    (pathname === KIOSK_ACTIVATE_PATH ||
      pathname === KIOSK_VERIFY_PATH ||
      pathname === KIOSK_VERIFY_MANUAL_PATH) &&
    hasKioskSession
  ) {
    return NextResponse.redirect(new URL(KIOSK_SUCCESS_PATH, request.url));
  }

  if (pathname === KIOSK_SUCCESS_PATH) {
    if (!hasKioskSession) {
      return NextResponse.redirect(new URL(KIOSK_ACTIVATE_PATH, request.url));
    }

    return NextResponse.next();
  }

  // Protect kiosk routes: require kiosk session for any /kiosk* paths
  if (pathname.startsWith("/kiosk")) {
    if (!token) {
      return NextResponse.redirect(new URL(KIOSK_ACTIVATE_PATH, request.url));
    }

    if (!isKioskRole(role)) {
      const activateUrl = new URL(KIOSK_ACTIVATE_PATH, request.url);
      activateUrl.searchParams.set("reason", "forbidden");
      return NextResponse.redirect(activateUrl);
    }

    return NextResponse.next();
  }

  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }
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
  matcher: [
    "/admin/:path*",
    "/activate",
    "/activate/verify",
    "/activate/verify-manual",
    "/activate/success",
    "/kiosk",
    "/kiosk/:path*",
  ],
};
