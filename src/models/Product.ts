import { Schema, model, models, Types } from "mongoose";

export interface IProduct {
  _id: Types.ObjectId;
  companyId: Types.ObjectId;    // referência para Company
  tenantId?: string;            // mantido para compatibilidade
  name: string;
  description?: string;
  price: number;                // valor em BRL
  image?: string;
  category?: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    companyId: { type: Schema.Types.ObjectId, ref: "Company", required: true },
    tenantId: { type: String }, // mantido para compatibilidade
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true }, // BRL para MVP
    image: { type: String },
    category: { type: String }, // ex.: "Burgers"
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

ProductSchema.index({ companyId: 1, name: 1 });
ProductSchema.index({ tenantId: 1, name: 1 }); // mantido para compatibilidade
ProductSchema.index({ category: 1 });
ProductSchema.index({ active: 1 });

export default models.Product || model<IProduct>("Product", ProductSchema);
