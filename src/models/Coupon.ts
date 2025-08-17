import { Schema, model, models } from "mongoose";

const CouponSchema = new Schema(
  {
    tenantId: { type: String, required: true }, // loja/empresa
    code: { type: String, required: true, uppercase: true, index: true, unique: false },
    type: { type: String, enum: ["percent", "amount"], required: true },
    value: { type: Number, required: true }, // ex.: 10 (percent) ou 5.00 (amount BRL)
    startsAt: { type: Date, required: true },
    endsAt: { type: Date, required: true },
    maxUses: { type: Number, default: 0 }, // 0 = ilimitado
    usedCount: { type: Number, default: 0 },
    minOrderTotal: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

CouponSchema.index({ tenantId: 1, code: 1 }, { unique: true });
export type CouponDoc = {
  tenantId: string; code: string; type: "percent" | "amount"; value: number;
  startsAt: Date; endsAt: Date; maxUses: number; usedCount: number;
  minOrderTotal: number; active: boolean;
};
export default models.Coupon || model("Coupon", CouponSchema);
