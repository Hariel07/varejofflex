export type Role =
  | "owner_saas"      // único dono do SaaS (você) - acesso global
  | "admin_company"   // admin da empresa/loja - acesso à sua company
  | "manager"         // gerente da loja
  | "cashier"         // operador de caixa
  | "attendant"       // atendente
  | "kitchen"         // cozinha/produção
  | "courier"         // entregador
  | "logista"         // lojista/proprietário da loja
  | "cliente";        // cliente do sistema

export type UserType = 
  | 'owner_saas'      // Único dono do SaaS (você) - nível mais alto
  | 'lojista'         // Dono/proprietário de uma loja
  | 'cliente';        // Cliente do sistema

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
  segment?: string;
  companyName?: string;
  tenantContext: TenantContext;
}
