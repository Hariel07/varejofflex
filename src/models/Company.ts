import { Schema, model, models, Types } from "mongoose";
import type { PersonType, DocType } from "@/types/auth";

export interface IAddress {
  zip?: string; street?: string; number?: string; district?: string;
  city?: string; state?: string; complement?: string;
}
export interface ICompany {
  _id: Types.ObjectId;
  name: string;
  personType: PersonType;          // PF/PJ
  documentType: DocType;           // CPF/CNPJ
  documentNumber: string;          // só dígitos
  email?: string;
  phone?: string;
  address?: IAddress;
  createdAt: Date;
  updatedAt: Date;
}

const AddressSchema = new Schema<IAddress>({
  zip: String, street: String, number: String, district: String,
  city: String, state: String, complement: String,
}, { _id: false });

const CompanySchema = new Schema<ICompany>({
  name: { type: String, required: true, trim: true },
  personType: { type: String, enum: ["PF", "PJ"], required: true },
  documentType: { type: String, enum: ["CPF", "CNPJ"], required: true },
  documentNumber: { type: String, required: true, index: true }, // normalizado (só dígitos)
  email: { type: String, trim: true },
  phone: { type: String, trim: true },
  address: { type: AddressSchema },
}, { timestamps: true });

CompanySchema.index({ documentNumber: 1 }, { unique: true });
CompanySchema.index({ name: 1 });

export default models.Company || model<ICompany>("Company", CompanySchema);
