import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import type { AuthUser } from "@/types/auth";

/**
 * Middleware de autenticação e autorização multi-tenant
 * Protege rotas baseado no tipo de usuário e permissões
 */

// Rotas que requerem autenticação
const PROTECTED_ROUTES = [
  "/admin",
  "/dashboard",
  "/dashboard/owner",
  "/dashboard/lojista",
  "/api/orders",
  "/api/products",
  "/api/auth/change-password",
];

// Rotas exclusivas do Owner SaaS
const OWNER_SAAS_ROUTES = [
  "/admin",
  "/dashboard/owner",
  "/api/platform",
];

// Rotas exclusivas de Lojistas
const LOJISTA_ROUTES = [
  "/dashboard",
  "/dashboard/lojista",
  "/cardapio",
  "/checkout",
];

// Rotas públicas que não precisam de auth
const PUBLIC_ROUTES = [
  "/",
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/demo",
  "/api/auth",
  "/api/debug", // Adicionar rota de debug
];

/**
 * Verifica se a rota é pública
 */
function isPublicRoute(pathname: string): boolean {
  return PUBLIC_ROUTES.some(route => {
    if (route === "/") return pathname === "/";
    return pathname.startsWith(route);
  });
}

/**
 * Verifica se a rota é protegida
 */
function isProtectedRoute(pathname: string): boolean {
  return PROTECTED_ROUTES.some(route => pathname.startsWith(route));
}

/**
 * Verifica se a rota é exclusiva do Owner SaaS
 */
function isOwnerSaasRoute(pathname: string): boolean {
  return OWNER_SAAS_ROUTES.some(route => pathname.startsWith(route));
}

/**
 * Verifica se a rota é exclusiva de Lojistas
 */
function isLojistaRoute(pathname: string): boolean {
  return LOJISTA_ROUTES.some(route => pathname.startsWith(route));
}

/**
 * Middleware principal
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Permite rotas públicas
  if (isPublicRoute(pathname)) {
    return NextResponse.next();
  }

  try {
    // Verifica autenticação
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token) {
      // Redireciona para login se não autenticado
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    const user = token as any as AuthUser;

    // Verifica se o usuário está ativo
    // tenantContext pode ainda estar sendo construído; usamos userType do token para decisões básicas
    if (!user.userType) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("error", "invalid_session");
      return NextResponse.redirect(loginUrl);
    }

    // Controle de acesso por tipo de usuário
    if (isOwnerSaasRoute(pathname) && user.userType !== "owner_saas") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    if (isLojistaRoute(pathname) && user.userType !== "lojista") {
      return NextResponse.redirect(new URL("/admin", request.url));
    }

    // Para rotas de API, adiciona headers com informações do tenant
    if (pathname.startsWith("/api/")) {
      const requestHeaders = new Headers(request.headers);
      requestHeaders.set("x-user-id", user.id);
      requestHeaders.set("x-user-type", user.userType || "");
      requestHeaders.set("x-user-role", user.role || "");
      if (user.tenantContext?.tenantType) {
        requestHeaders.set("x-tenant-type", user.tenantContext.tenantType);
      }
      
      if (user.companyId) {
        requestHeaders.set("x-company-id", user.companyId);
      }
      
      if (user.tenantContext?.tenantId) {
        requestHeaders.set("x-tenant-id", user.tenantContext.tenantId);
      }

      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });
    }

    return NextResponse.next();
  } catch (error) {
    console.error("Middleware error:", error);
    
    // Em caso de erro, redireciona para login
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("error", "session_error");
    return NextResponse.redirect(loginUrl);
  }
}

/**
 * Configuração do matcher do middleware
 */
export const config = {
  matcher: [
    /*
     * Executa o middleware em todas as rotas exceto:
     * - /api/auth/* (rotas do NextAuth)
     * - /_next/static (arquivos estáticos)
     * - /_next/image (otimização de imagens)
     * - /favicon.ico (favicon)
     * - Arquivos com extensão
     */
    "/((?!api/auth|_next/static|_next/image|favicon.ico|.*\\.).*)",
  ],
};
