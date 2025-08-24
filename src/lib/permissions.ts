import type { Role, TenantContext, UserType } from "@/types/auth";

/**
 * Sistema de Permissões Multi-Tenant
 * Define permissões granulares para diferentes tipos de usuário
 */

// Permissões base do sistema
export const PERMISSIONS = {
  // Permissões de SaaS Owner
  SAAS_ADMIN: "saas:admin",
  SAAS_VIEW_ALL_COMPANIES: "saas:view_all_companies",
  SAAS_MANAGE_COMPANIES: "saas:manage_companies",
  SAAS_VIEW_ANALYTICS: "saas:view_analytics",
  SAAS_MANAGE_PLANS: "saas:manage_plans",
  SAAS_MANAGE_USERS: "saas:manage_users",
  
  // Permissões de Company/Loja
  COMPANY_ADMIN: "company:admin",
  COMPANY_VIEW: "company:view",
  COMPANY_EDIT: "company:edit",
  COMPANY_MANAGE_USERS: "company:manage_users",
  
  // Permissões de Produtos
  PRODUCTS_VIEW: "products:view",
  PRODUCTS_CREATE: "products:create",
  PRODUCTS_EDIT: "products:edit",
  PRODUCTS_DELETE: "products:delete",
  PRODUCTS_MANAGE_STOCK: "products:manage_stock",
  
  // Permissões de Vendas/PDV
  SALES_VIEW: "sales:view",
  SALES_CREATE: "sales:create",
  SALES_CANCEL: "sales:cancel",
  SALES_REFUND: "sales:refund",
  SALES_REPORTS: "sales:reports",
  
  // Permissões de Relatórios
  REPORTS_BASIC: "reports:basic",
  REPORTS_ADVANCED: "reports:advanced",
  REPORTS_FINANCIAL: "reports:financial",
  
  // Permissões de Configurações
  SETTINGS_VIEW: "settings:view",
  SETTINGS_EDIT: "settings:edit",
  SETTINGS_INTEGRATIONS: "settings:integrations",
} as const;

// Mapeamento de permissões por role
export const ROLE_PERMISSIONS: Record<Role, string[]> = {
  owner_saas: [
    PERMISSIONS.SAAS_ADMIN,
    PERMISSIONS.SAAS_VIEW_ALL_COMPANIES,
    PERMISSIONS.SAAS_MANAGE_COMPANIES,
    PERMISSIONS.SAAS_VIEW_ANALYTICS,
    PERMISSIONS.SAAS_MANAGE_PLANS,
    PERMISSIONS.SAAS_MANAGE_USERS,
    // Owner SaaS tem acesso total
    ...Object.values(PERMISSIONS),
  ],
  
  admin_company: [
    PERMISSIONS.COMPANY_ADMIN,
    PERMISSIONS.COMPANY_VIEW,
    PERMISSIONS.COMPANY_EDIT,
    PERMISSIONS.COMPANY_MANAGE_USERS,
    PERMISSIONS.PRODUCTS_VIEW,
    PERMISSIONS.PRODUCTS_CREATE,
    PERMISSIONS.PRODUCTS_EDIT,
    PERMISSIONS.PRODUCTS_DELETE,
    PERMISSIONS.PRODUCTS_MANAGE_STOCK,
    PERMISSIONS.SALES_VIEW,
    PERMISSIONS.SALES_CREATE,
    PERMISSIONS.SALES_CANCEL,
    PERMISSIONS.SALES_REFUND,
    PERMISSIONS.SALES_REPORTS,
    PERMISSIONS.REPORTS_BASIC,
    PERMISSIONS.REPORTS_ADVANCED,
    PERMISSIONS.REPORTS_FINANCIAL,
    PERMISSIONS.SETTINGS_VIEW,
    PERMISSIONS.SETTINGS_EDIT,
    PERMISSIONS.SETTINGS_INTEGRATIONS,
  ],
  
  manager: [
    PERMISSIONS.COMPANY_VIEW,
    PERMISSIONS.PRODUCTS_VIEW,
    PERMISSIONS.PRODUCTS_EDIT,
    PERMISSIONS.PRODUCTS_MANAGE_STOCK,
    PERMISSIONS.SALES_VIEW,
    PERMISSIONS.SALES_CREATE,
    PERMISSIONS.SALES_CANCEL,
    PERMISSIONS.SALES_REPORTS,
    PERMISSIONS.REPORTS_BASIC,
    PERMISSIONS.REPORTS_ADVANCED,
    PERMISSIONS.SETTINGS_VIEW,
  ],
  
  cashier: [
    PERMISSIONS.PRODUCTS_VIEW,
    PERMISSIONS.SALES_VIEW,
    PERMISSIONS.SALES_CREATE,
    PERMISSIONS.REPORTS_BASIC,
  ],
  
  attendant: [
    PERMISSIONS.PRODUCTS_VIEW,
    PERMISSIONS.SALES_VIEW,
    PERMISSIONS.SALES_CREATE,
  ],
  
  kitchen: [
    PERMISSIONS.PRODUCTS_VIEW,
    PERMISSIONS.SALES_VIEW,
  ],
  
  courier: [
    PERMISSIONS.SALES_VIEW,
  ],
};

/**
 * Cria o contexto de tenant baseado no usuário
 */
export function createTenantContext(
  role: Role,
  userType: UserType,
  companyId?: string
): TenantContext {
  const permissions = ROLE_PERMISSIONS[role] || [];
  
  if (userType === "owner_saas") {
    return {
      tenantType: "global",
      tenantId: undefined,
      userType,
      role,
      permissions,
    };
  }
  
  return {
    tenantType: "company",
    tenantId: companyId,
    userType,
    role,
    permissions,
  };
}

/**
 * Verifica se o usuário tem uma permissão específica
 */
export function hasPermission(
  tenantContext: TenantContext,
  permission: string
): boolean {
  return tenantContext.permissions.includes(permission);
}

/**
 * Verifica se o usuário pode acessar um recurso de uma company específica
 */
export function canAccessCompany(
  tenantContext: TenantContext,
  companyId: string
): boolean {
  // Owner SaaS pode acessar qualquer company
  if (tenantContext.userType === "owner_saas") {
    return true;
  }
  
  // Lojistas só podem acessar sua própria company
  return tenantContext.tenantId === companyId;
}

/**
 * Filtra dados baseado no contexto do tenant
 */
export function filterByTenant<T extends { companyId?: string }>(
  tenantContext: TenantContext,
  data: T[]
): T[] {
  // Owner SaaS vê tudo
  if (tenantContext.userType === "owner_saas") {
    return data;
  }
  
  // Lojistas veem apenas dados da sua company
  return data.filter(item => item.companyId === tenantContext.tenantId);
}

/**
 * Middleware de autorização para APIs
 */
export function requirePermission(permission: string) {
  return (tenantContext: TenantContext) => {
    if (!hasPermission(tenantContext, permission)) {
      throw new Error(`Permission denied: ${permission}`);
    }
  };
}

/**
 * Middleware de autorização para company
 */
export function requireCompanyAccess(companyId: string) {
  return (tenantContext: TenantContext) => {
    if (!canAccessCompany(tenantContext, companyId)) {
      throw new Error(`Access denied to company: ${companyId}`);
    }
  };
}

/**
 * Utilitário para verificar se é Owner SaaS
 */
export function isOwnerSaas(tenantContext: TenantContext): boolean {
  return tenantContext.userType === "owner_saas";
}

/**
 * Utilitário para verificar se é Lojista
 */
export function isLojista(tenantContext: TenantContext): boolean {
  return tenantContext.userType === "lojista";
}

/**
 * Utilitário para obter permissões por segmento
 */
export function getSegmentPermissions(segment: string): string[] {
  const basePermissions = [
    PERMISSIONS.PRODUCTS_VIEW,
    PERMISSIONS.SALES_VIEW,
    PERMISSIONS.SALES_CREATE,
    PERMISSIONS.REPORTS_BASIC,
  ];
  
  // Permissões específicas por segmento
  const segmentSpecific: Record<string, string[]> = {
    farmacia: [
      PERMISSIONS.PRODUCTS_MANAGE_STOCK, // Controle rigoroso de estoque
      PERMISSIONS.REPORTS_ADVANCED,      // Relatórios ANVISA
    ],
    mercado: [
      PERMISSIONS.PRODUCTS_MANAGE_STOCK, // Controle de lote/validade
    ],
    salao: [
      PERMISSIONS.REPORTS_ADVANCED,      // Relatórios de comissão
    ],
    petshop: [
      PERMISSIONS.REPORTS_ADVANCED,      // Relatórios de agendamento
    ],
  };
  
  return [...basePermissions, ...(segmentSpecific[segment] || [])];
}
