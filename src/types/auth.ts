export type Role =
  | "owner_saas"      // único dono do SaaS (você)
  | "admin_company"   // admin da empresa/loja
  | "manager"
  | "cashier"
  | "attendant"
  | "kitchen"
  | "courier";

export type PersonType = "PF" | "PJ";
export type DocType = "CPF" | "CNPJ";
