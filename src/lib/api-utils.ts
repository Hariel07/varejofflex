import type { NextRequest } from "next/server";
import type { AuthUser, TenantContext } from "@/types/auth";
import { getToken } from "next-auth/jwt";

/**
 * Utilitários para APIs Multi-Tenant
 * Facilita a implementação de APIs que respeitam o contexto do tenant
 */

/**
 * Extrai informações do tenant dos headers da requisição
 */
export function getTenantFromHeaders(request: NextRequest): {
  userId?: string;
  userType?: string;
  userRole?: string;
  tenantType?: string;
  tenantId?: string;
  companyId?: string;
} {
  return {
    userId: request.headers.get("x-user-id") || undefined,
    userType: request.headers.get("x-user-type") || undefined,
    userRole: request.headers.get("x-user-role") || undefined,
    tenantType: request.headers.get("x-tenant-type") || undefined,
    tenantId: request.headers.get("x-tenant-id") || undefined,
    companyId: request.headers.get("x-company-id") || undefined,
  };
}

/**
 * Obtém o usuário autenticado da requisição
 */
export async function getAuthUserFromRequest(request: NextRequest): Promise<AuthUser | null> {
  try {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token) return null;
    return token as any as AuthUser;
  } catch {
    return null;
  }
}

/**
 * Middleware helper para validar autenticação
 */
export async function requireAuthUser(request: NextRequest): Promise<AuthUser> {
  const user = await getAuthUserFromRequest(request);
  if (!user) {
    throw new Error("Authentication required");
  }
  return user;
}

/**
 * Middleware helper para validar permissão
 */
export async function requirePermissionApi(
  request: NextRequest,
  permission: string
): Promise<AuthUser> {
  const user = await requireAuthUser(request);
  const { hasPermission } = await import("@/lib/permissions");
  
  if (!hasPermission(user.tenantContext, permission)) {
    throw new Error(`Permission denied: ${permission}`);
  }
  
  return user;
}

/**
 * Middleware helper para validar acesso à company
 */
export async function requireCompanyAccessApi(
  request: NextRequest,
  companyId: string
): Promise<AuthUser> {
  const user = await requireAuthUser(request);
  const { canAccessCompany } = await import("@/lib/permissions");
  
  if (!canAccessCompany(user.tenantContext, companyId)) {
    throw new Error(`Access denied to company: ${companyId}`);
  }
  
  return user;
}

/**
 * Filtro de dados baseado no tenant
 */
export function buildTenantFilter(tenantContext: TenantContext): Record<string, any> {
  // Owner SaaS vê tudo - sem filtro
  if (tenantContext.userType === "owner_saas") {
    return {};
  }
  
  // Lojistas veem apenas dados da sua company
  return {
    companyId: tenantContext.tenantId,
  };
}

/**
 * Adiciona contexto de tenant aos dados de criação
 */
export function addTenantContext<T extends Record<string, any>>(
  data: T,
  tenantContext: TenantContext
): T & { companyId?: string } {
  // Para Owner SaaS, não adiciona companyId automaticamente
  if (tenantContext.userType === "owner_saas") {
    return data;
  }
  
  // Para lojistas, sempre adiciona o companyId
  return {
    ...data,
    companyId: tenantContext.tenantId,
  };
}

/**
 * Response helper com tratamento de erros
 */
export function createApiResponse<T = any>(
  data?: T,
  options?: {
    status?: number;
    message?: string;
    error?: string;
  }
) {
  const { status = 200, message, error } = options || {};
  
  if (error) {
    return Response.json(
      { 
        success: false, 
        error,
        message: message || "An error occurred" 
      },
      { status: status >= 400 ? status : 400 }
    );
  }
  
  return Response.json(
    {
      success: true,
      data,
      message,
    },
    { status }
  );
}

/**
 * Error handler para APIs
 */
export function handleApiError(error: any) {
  console.error("API Error:", error);
  
  if (error.message === "Authentication required") {
    return createApiResponse(null, {
      status: 401,
      error: "UNAUTHORIZED",
      message: "Authentication required",
    });
  }
  
  if (error.message?.startsWith("Permission denied")) {
    return createApiResponse(null, {
      status: 403,
      error: "FORBIDDEN",
      message: error.message,
    });
  }
  
  if (error.message?.startsWith("Access denied")) {
    return createApiResponse(null, {
      status: 403,
      error: "FORBIDDEN",
      message: error.message,
    });
  }
  
  return createApiResponse(null, {
    status: 500,
    error: "INTERNAL_ERROR",
    message: "Internal server error",
  });
}

/**
 * Wrapper para APIs multi-tenant
 */
export function withTenantApi<T extends any[]>(
  handler: (user: AuthUser, ...args: T) => Promise<Response>
) {
  return async (request: NextRequest, ...args: T): Promise<Response> => {
    try {
      const user = await requireAuthUser(request);
      return await handler(user, ...args);
    } catch (error) {
      return handleApiError(error);
    }
  };
}

/**
 * Wrapper para APIs que requerem permissão específica
 */
export function withPermissionApi<T extends any[]>(
  permission: string,
  handler: (user: AuthUser, ...args: T) => Promise<Response>
) {
  return async (request: NextRequest, ...args: T): Promise<Response> => {
    try {
      const user = await requirePermissionApi(request, permission);
      return await handler(user, ...args);
    } catch (error) {
      return handleApiError(error);
    }
  };
}

/**
 * Wrapper para APIs que requerem acesso à company
 */
export function withCompanyAccessApi<T extends any[]>(
  getCompanyId: (request: NextRequest, ...args: T) => string,
  handler: (user: AuthUser, ...args: T) => Promise<Response>
) {
  return async (request: NextRequest, ...args: T): Promise<Response> => {
    try {
      const companyId = getCompanyId(request, ...args);
      const user = await requireCompanyAccessApi(request, companyId);
      return await handler(user, ...args);
    } catch (error) {
      return handleApiError(error);
    }
  };
}
