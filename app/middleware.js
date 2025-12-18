import { NextResponse, type NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const empresaToken = request.cookies.get("asmel_empresa_token")?.value;
  const staffToken = request.cookies.get("asmel_staff_token")?.value;
  const adminToken = request.cookies.get("asmel_admin_token")?.value;
  const superAdminToken = request.cookies.get("asmel_superadmin_token")?.value;

  // 🔓 Permitir acceso libre a todas las pantallas de login
  if (
    pathname.startsWith("/empresa-login") ||
    pathname.startsWith("/staff-login") ||
    pathname.startsWith("/admin-login") ||
    pathname.startsWith("/superadmin-login")
  ) {
    return;
  }

  // 🔒 Rutas protegidas EMPRESA
  if (pathname.startsWith("/empresa") && !empresaToken) {
    return NextResponse.redirect(new URL("/empresa-login", request.url));
  }

  // 🔒 Rutas protegidas STAFF
  if (pathname.startsWith("/staff") && !staffToken) {
    return NextResponse.redirect(new URL("/staff-login", request.url));
  }

  // 🔒 Rutas protegidas ADMIN
  if (pathname.startsWith("/admin") && !adminToken) {
    return NextResponse.redirect(new URL("/admin-login", request.url));
  }

  // 🔒 Rutas protegidas SUPERADMIN
  if (pathname.startsWith("/superadmin") && !superAdminToken) {
    return NextResponse.redirect(new URL("/superadmin-login", request.url));
  }

  // continuar normalmente
  return;
}
