import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ADMIN_TOKEN_KEY, TOKEN_KEY } from "./store/ApiServices/config";
import { ROUTES } from "./constant/appRoutes";

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const shopToken = req.cookies.get(TOKEN_KEY)?.value;
  const adminToken = req.cookies.get(ADMIN_TOKEN_KEY)?.value;

  /* ---------------- PUBLIC PAGES ---------------- */
  // Already logged in? Skip the login page.
  if (pathname === ROUTES.SHOP.LOGIN && shopToken)
    return NextResponse.redirect(new URL(ROUTES.SHOP.DASHBOARD, req.url));
  if (pathname === ROUTES.ADMIN.SIGNIN && adminToken)
    return NextResponse.redirect(new URL(ROUTES.ADMIN.DASHBOARD, req.url));

  const publicPaths = [
    ROUTES.HOME.INDEX,
    ROUTES.ADMIN.SIGNIN,
    ROUTES.SHOP.LOGIN,
    ROUTES.SHOP.SIGNUP,
  ];
  if (publicPaths.includes(pathname)) return NextResponse.next();

  /* ---------------- AUTH GUARD ---------------- */
  if (pathname.startsWith("/admin") && !adminToken)
    return NextResponse.redirect(new URL(ROUTES.ADMIN.SIGNIN, req.url));
  if (pathname.startsWith("/shop") && !shopToken)
    return NextResponse.redirect(new URL(ROUTES.SHOP.LOGIN, req.url));

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|images|assets|.*\\.(?:png|jpg|jpeg|gif|svg|webp|ico)).*)",
  ],
};
