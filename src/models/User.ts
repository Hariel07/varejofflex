import { Schema, model, models, Types } from "mongoose";
import type { Role } from "@/types/auth";

export interface IUser {
  _id: Types.ObjectId;
  name: string;
  email: string;                // unique
  passwordHash: string;
  role: Role;
  companyId?: Types.ObjectId;   // vazio para owner_saas
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true },
  role: { type: String, required: true, enum: ["owner_saas","admin_company","manager","cashier","attendant","kitchen","courier"] },
  companyId: { type: Schema.Types.ObjectId, ref: "Company" },
}, { timestamps: true });

UserSchema.index({ email: 1 }, { unique: true });
UserSchema.index({ role: 1 });
UserSchema.index({ companyId: 1 });

export default models.User || model<IUser>("User", UserSchema);
