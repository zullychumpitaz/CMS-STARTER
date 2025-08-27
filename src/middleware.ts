
import { NextResponse } from "next/server";
import { auth } from "./modules/auth/auth";

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  const PUBLIC_PATHS = ["/", "/register", "/favicon.ico"];
  const isPublic = PUBLIC_PATHS.some((path) => nextUrl.pathname === path);

  // Ruta privada: usuario no logueado → redirige al login
  if (!isLoggedIn && !isPublic) {
    console.log("Redirecting to login from:", nextUrl.pathname);
    return NextResponse.redirect(new URL("/", nextUrl));
  }

  // Ruta pública: usuario logueado → redirige al dashboard
  if (
    isLoggedIn &&
    (nextUrl.pathname === "/" || nextUrl.pathname === "/register")
  ) {
    console.log("Redirecting to dashboard from:", nextUrl.pathname);
    return NextResponse.redirect(new URL("/dashboard", nextUrl));
  }

  // Deja pasar cualquier otra ruta
  return NextResponse.next();
});

export const config = {
  matcher: [
    /**
     * Aplica el middleware a todas las rutas EXCEPTO:
     * - /api/auth (rutas internas de autenticación)
     * - /_next/static (archivos estáticos de Next)
     * - /_next/image (optimizador de imágenes de Next)
     * - /favicon.ico
     * - cualquier archivo con extensión (.*)
     */
    "/((?!api/auth|_next/static|_next/image|favicon.ico|.*\\..*).*)",
  ],
};
