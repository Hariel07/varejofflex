"use client";

import { ReactNode } from "react";
import { useAuthUser, usePermissions, useCompanyAccess } from "@/hooks/useAuth";

/**
 * Componente para proteger conteúdo baseado em permissões
 */
interface ProtectedContentProps {
  children: ReactNode;
  permission?: string;
  permissions?: string[];
  requireAll?: boolean;
  fallback?: ReactNode;
  companyId?: string;
  ownerSaasOnly?: boolean;
  lojistaOnly?: boolean;
}

export function ProtectedContent({
  children,
  permission,
  permissions = [],
  requireAll = false,
  fallback = null,
  companyId,
  ownerSaasOnly = false,
  lojistaOnly = false,
}: ProtectedContentProps) {
  const { isOwnerSaas, isLojista, isLoading } = useAuthUser();
  const { hasPermission, hasAnyPermission, hasAllPermissions } = usePermissions();
  const { canAccessCompany } = useCompanyAccess();

  // Loading state
  if (isLoading) {
    return (
      <div className="d-flex justify-content-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  // Verificação de tipo de usuário
  if (ownerSaasOnly && !isOwnerSaas) {
    return <>{fallback}</>;
  }

  if (lojistaOnly && !isLojista) {
    return <>{fallback}</>;
  }

  // Verificação de acesso à company
  if (companyId && !canAccessCompany(companyId)) {
    return <>{fallback}</>;
  }

  // Verificação de permissão única
  if (permission && !hasPermission(permission)) {
    return <>{fallback}</>;
  }

  // Verificação de múltiplas permissões
  if (permissions.length > 0) {
    const hasAccess = requireAll 
      ? hasAllPermissions(permissions)
      : hasAnyPermission(permissions);
    
    if (!hasAccess) {
      return <>{fallback}</>;
    }
  }

  return <>{children}</>;
}

/**
 * Componente para mostrar conteúdo apenas para Owner SaaS
 */
interface OwnerSaasOnlyProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export function OwnerSaasOnly({ children, fallback = null }: OwnerSaasOnlyProps) {
  return (
    <ProtectedContent ownerSaasOnly fallback={fallback}>
      {children}
    </ProtectedContent>
  );
}

/**
 * Componente para mostrar conteúdo apenas para Lojistas
 */
interface LojistaOnlyProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export function LojistaOnly({ children, fallback = null }: LojistaOnlyProps) {
  return (
    <ProtectedContent lojistaOnly fallback={fallback}>
      {children}
    </ProtectedContent>
  );
}

/**
 * Componente para mostrar informações do tenant
 */
export function TenantInfo() {
  const { user, tenantContext, isOwnerSaas, isLojista } = useAuthUser();

  if (!user || !tenantContext) return null;

  return (
    <div className="card border-info">
      <div className="card-header bg-info text-white">
        <h6 className="mb-0">
          <i className="bi bi-info-circle me-2"></i>
          Informações do Tenant
        </h6>
      </div>
      <div className="card-body">
        <div className="row">
          <div className="col-md-6">
            <small className="text-muted">Usuário:</small>
            <div className="fw-bold">{user.name}</div>
          </div>
          <div className="col-md-6">
            <small className="text-muted">Email:</small>
            <div className="fw-bold">{user.email}</div>
          </div>
          <div className="col-md-6">
            <small className="text-muted">Tipo:</small>
            <div className="fw-bold">
              {isOwnerSaas && <span className="badge bg-danger">Owner SaaS</span>}
              {isLojista && <span className="badge bg-success">Lojista</span>}
            </div>
          </div>
          <div className="col-md-6">
            <small className="text-muted">Role:</small>
            <div className="fw-bold">
              <span className="badge bg-secondary">{user.role}</span>
            </div>
          </div>
          <div className="col-md-6">
            <small className="text-muted">Tenant:</small>
            <div className="fw-bold">{tenantContext.tenantType}</div>
          </div>
          <div className="col-md-6">
            <small className="text-muted">Company ID:</small>
            <div className="fw-bold">{user.companyId || "N/A"}</div>
          </div>
          <div className="col-12">
            <small className="text-muted">Permissões:</small>
            <div className="mt-1">
              {tenantContext.permissions.slice(0, 5).map((permission) => (
                <span key={permission} className="badge bg-light text-dark me-1 mb-1">
                  {permission}
                </span>
              ))}
              {tenantContext.permissions.length > 5 && (
                <span className="badge bg-secondary">
                  +{tenantContext.permissions.length - 5} mais
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Componente para navegação baseada no tipo de usuário
 */
export function UserTypeNavigation() {
  const { isOwnerSaas, isLojista } = useAuthUser();

  return (
    <div className="nav nav-pills">
      <OwnerSaasOnly>
        <a href="/admin" className="nav-link">
          <i className="bi bi-speedometer2 me-2"></i>
          Dashboard SaaS
        </a>
      </OwnerSaasOnly>
      
      <LojistaOnly>
        <a href="/dashboard" className="nav-link">
          <i className="bi bi-shop me-2"></i>
          Minha Loja
        </a>
      </LojistaOnly>
    </div>
  );
}

/**
 * Componente para mostrar status do plano (apenas lojistas)
 */
export function PlanStatus() {
  const { user, isLojista } = useAuthUser();

  if (!isLojista) return null;

  return (
    <LojistaOnly>
      <div className="alert alert-info">
        <h6 className="alert-heading">
          <i className="bi bi-star me-2"></i>
          Plano Atual
        </h6>
        <p className="mb-0">
          Você está no plano <strong>Free</strong>.
          <a href="/dashboard/billing" className="alert-link ms-2">
            Fazer upgrade
          </a>
        </p>
      </div>
    </LojistaOnly>
  );
}