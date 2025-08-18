export type Role =
  | "owner_saas"      // único dono do SaaS (você) - acesso global
  | "admin_company"   // admin da empresa/loja - acesso à sua company
  | "manager"         // gerente da loja
  | "cashier"         // operador de caixa
  | "attendant"       // atendente
  | "kitchen"         // cozinha/produção
  | "courier";        // entregador

export type UserType = "owner_saas" | "lojista";

export type TenantType = "global" | "company";

export type PersonType = "PF" | "PJ";
export type DocType = "CPF" | "CNPJ";

export interface TenantContext {
  tenantType: TenantType;
  tenantId?: string; // companyId para tenant company, undefined para global
  userType: UserType;
  role: Role;
  permissions: string[];
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  userType: UserType;
  companyId?: string;
  tenantContext: TenantContext;
}
