import { NextResponse } from "next/server";

export function middleware(request) {
  const { pathname } = request.nextUrl;

  const empresaToken = request.cookies.get("asmel_empresa_token")?.value;
  const staffToken = request.cookies.get("asmel_staff_token")?.value;
  const adminToken = request.cookies.get("asmel_admin_token")?.value;
  const superAdminToken = request.cookies.get("asmel_superadmin_token")?.value;

  // 🔓 RUTAS PÚBLICAS
  if (
    pathname === "/" ||
    pathname.startsWith("/empresa-login") ||
    pathname.startsWith("/staff-login") ||
    pathname.startsWith("/admin-login") ||
    pathname.startsWith("/superadmin-login") ||
    pathname.startsWith("/contacto") ||
    pathname.startsWith("/servicios")
  ) {
    return NextResponse.next();
  }

  // 🟡 Permitir primer ingreso post-login
  if (pathname === "/empresa/dashboard") {
    return NextResponse.next();
  }

  // 🔒 EMPRESA
  if (pathname.startsWith("/empresa") && !empresaToken) {
    return NextResponse.redirect(new URL("/empresa-login", request.url));
  }

  // 🔒 STAFF
  if (pathname.startsWith("/staff") && !staffToken) {
    return NextResponse.redirect(new URL("/staff-login", request.url));
  }

  // 🔒 ADMIN
  if (pathname.startsWith("/admin") && !adminToken) {
    return NextResponse.redirect(new URL("/admin-login", request.url));
  }

  // 🔒 SUPERADMIN
  if (pathname.startsWith("/superadmin") && !superAdminToken) {
    return NextResponse.redirect(new URL("/superadmin-login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/empresa/:path*",
    "/staff/:path*",
    "/admin/:path*",
    "/superadmin/:path*",
  ],
};
