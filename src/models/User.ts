import { Schema, model, models, Types } from "mongoose";
import type { Role, UserType } from "@/types/auth";

export interface IUser {
  _id: Types.ObjectId;
  name: string;
  email: string;                // unique
  passwordHash: string;
  role: Role;
  userType: UserType;           // owner_saas ou lojista
  companyId?: Types.ObjectId;   // vazio para owner_saas
  isActive: boolean;            // controle de usuários ativos
  lastLoginAt?: Date;           // último login
  permissions: string[];        // permissões específicas
  segment?: string;             // segmento de negócio do lojista
  fiscalSettings?: {            // configurações da impressora fiscal
    cnpj: string;
    razaoSocial: string;
    nomeFantasia?: string;
    endereco: string;
    telefone?: string;
    email?: string;
    printerType: 'SAT' | 'ECF' | 'NFCE' | 'ESC_POS';
    printerPort?: string;
    printerModel?: string;
    satCertificate?: string;
    autoprint: boolean;
    enabled: boolean;
    updatedAt: Date;
  };
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true },
  role: { type: String, required: true, enum: ["owner_saas","admin_company","manager","cashier","attendant","kitchen","courier"] },
  userType: { type: String, required: true, enum: ["owner_saas", "lojista"] },
  companyId: { type: Schema.Types.ObjectId, ref: "Company" },
  isActive: { type: Boolean, default: true },
  lastLoginAt: { type: Date },
  permissions: [{ type: String }],
  segment: { type: String, enum: ["lanchonete", "pizzaria", "moda", "mercado", "petshop", "salao", "farmacia", "conveniencia"] },
  fiscalSettings: {
    cnpj: { type: String },
    razaoSocial: { type: String },
    nomeFantasia: { type: String },
    endereco: { type: String },
    telefone: { type: String },
    email: { type: String },
    printerType: { type: String, enum: ['SAT', 'ECF', 'NFCE', 'ESC_POS'], default: 'ESC_POS' },
    printerPort: { type: String },
    printerModel: { type: String },
    satCertificate: { type: String },
    autoprint: { type: Boolean, default: false },
    enabled: { type: Boolean, default: false },
    updatedAt: { type: Date, default: Date.now }
  }
}, { timestamps: true });

UserSchema.index({ email: 1 }, { unique: true });
UserSchema.index({ role: 1 });
UserSchema.index({ userType: 1 });
UserSchema.index({ companyId: 1 });
UserSchema.index({ segment: 1 });
UserSchema.index({ isActive: 1 });

export default models.User || model<IUser>("User", UserSchema);
