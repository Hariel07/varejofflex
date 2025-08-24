"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import type { AuthUser, TenantContext } from "@/types/auth";

/**
 * Hook para acessar informações do usuário autenticado
 * Versão SSR-safe
 */
export function useAuthUser(): {
  user: AuthUser | null;
  isLoading: boolean;
  isOwnerSaas: boolean;
  isLojista: boolean;
  tenantContext: TenantContext | null;
} {
  const [mounted, setMounted] = useState(false);
  const session = useSession();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Durante SSR ou antes do mount, retorna valores padrão
  if (!mounted) {
    return {
      user: null,
      isLoading: true,
      isOwnerSaas: false,
      isLojista: false,
      tenantContext: null,
    };
  }

  // Proteção contra destructuring undefined
  const sessionData = session?.data;
  const status = session?.status || "loading";
  
  const user = sessionData?.user as AuthUser | null;
  const isLoading = status === "loading";
  
  return {
    user,
    isLoading,
    isOwnerSaas: user?.userType === "owner_saas",
    isLojista: user?.userType === "lojista",
    tenantContext: user?.tenantContext || null,
  };
}

/**
 * Hook para verificar permissões
 */
export function usePermissions() {
  const { tenantContext } = useAuthUser();
  
  const hasPermission = (permission: string): boolean => {
    if (!tenantContext) return false;
    return tenantContext.permissions.includes(permission);
  };
  
  const hasAnyPermission = (permissions: string[]): boolean => {
    if (!tenantContext) return false;
    return permissions.some(permission => tenantContext.permissions.includes(permission));
  };
  
  const hasAllPermissions = (permissions: string[]): boolean => {
    if (!tenantContext) return false;
    return permissions.every(permission => tenantContext.permissions.includes(permission));
  };
  
  return {
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    permissions: tenantContext?.permissions || [],
  };
}

/**
 * Hook para verificar acesso à company
 */
export function useCompanyAccess() {
  const { user, tenantContext } = useAuthUser();
  
  const canAccessCompany = (companyId: string): boolean => {
    if (!tenantContext) return false;
    
    // Owner SaaS pode acessar qualquer company
    if (tenantContext.userType === "owner_saas") {
      return true;
    }
    
    // Lojistas só podem acessar sua própria company
    return tenantContext.tenantId === companyId;
  };
  
  const getCurrentCompanyId = (): string | null => {
    return user?.companyId || null;
  };
  
  return {
    canAccessCompany,
    getCurrentCompanyId,
    isOwnerSaas: tenantContext?.userType === "owner_saas",
  };
}

/**
 * Hook para navegação baseada no tipo de usuário
 */
export function useUserNavigation() {
  const { isOwnerSaas, isLojista } = useAuthUser();
  
  const getDashboardUrl = (): string => {
    if (isOwnerSaas) return "/admin";
    if (isLojista) return "/dashboard";
    return "/login";
  };
  
  const getSettingsUrl = (): string => {
    if (isOwnerSaas) return "/admin/settings";
    if (isLojista) return "/dashboard/settings";
    return "/login";
  };
  
  const getProfileUrl = (): string => {
    if (isOwnerSaas) return "/admin/profile";
    if (isLojista) return "/dashboard/profile";
    return "/login";
  };
  
  return {
    getDashboardUrl,
    getSettingsUrl,
    getProfileUrl,
  };
}

/**
 * Hook para APIs com contexto de tenant
 */
export function useTenantApi() {
  const { user } = useAuthUser();
  
  const makeRequest = async (
    url: string,
    options: RequestInit = {}
  ): Promise<Response> => {
    const headers = new Headers(options.headers);
    
    // Adiciona headers de autenticação se disponível
    if (user) {
      headers.set("Content-Type", "application/json");
    }
    
    return fetch(url, {
      ...options,
      headers,
    });
  };
  
  const get = (url: string) => makeRequest(url, { method: "GET" });
  const post = (url: string, data: any) => 
    makeRequest(url, {
      method: "POST",
      body: JSON.stringify(data),
    });
  const put = (url: string, data: any) => 
    makeRequest(url, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  const del = (url: string) => makeRequest(url, { method: "DELETE" });
  
  return {
    makeRequest,
    get,
    post,
    put,
    delete: del,
  };
}

/**
 * Hook para gerenciar estado do tenant
 */
export function useTenantState() {
  const { user, tenantContext } = useAuthUser();
  
  const getCurrentTenant = () => ({
    type: tenantContext?.tenantType || null,
    id: tenantContext?.tenantId || null,
    companyId: user?.companyId || null,
  });
  
  const isGlobalTenant = () => tenantContext?.tenantType === "global";
  const isCompanyTenant = () => tenantContext?.tenantType === "company";
  
  return {
    getCurrentTenant,
    isGlobalTenant,
    isCompanyTenant,
    tenantContext,
  };
}
