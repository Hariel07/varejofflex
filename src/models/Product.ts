import { Schema, model, models } from "mongoose";

const ProductSchema = new Schema(
  {
    tenantId: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true }, // BRL para MVP
    image: { type: String },
    category: { type: String }, // ex.: "Burgers"
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

ProductSchema.index({ tenantId: 1, name: 1 });
export default models.Product || model("Product", ProductSchema);
