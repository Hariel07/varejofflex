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
}, { timestamps: true });

UserSchema.index({ email: 1 }, { unique: true });
UserSchema.index({ role: 1 });
UserSchema.index({ userType: 1 });
UserSchema.index({ companyId: 1 });
UserSchema.index({ segment: 1 });
UserSchema.index({ isActive: 1 });

export default models.User || model<IUser>("User", UserSchema);
