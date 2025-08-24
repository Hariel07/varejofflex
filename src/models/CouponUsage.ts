import { Schema, model, models } from "mongoose";

const CouponUsageSchema = new Schema(
  {
    couponId: { type: Schema.Types.ObjectId, ref: 'Coupon', required: true },
    userId: { type: String, required: true }, // ID do usuário que usou
    userEmail: { type: String, required: true },
    tenantId: { type: String, required: true },
    
    // Dados do uso
    originalPrice: { type: Number, required: true },
    discountAmount: { type: Number, required: true },
    finalPrice: { type: Number, required: true },
    
    // Para assinaturas
    subscriptionPlan: { type: String, enum: ["basic", "pro", "ultra"] },
    subscriptionType: { type: String, enum: ["monthly", "annual", "weekly"] },
    
    // Status do cupom aplicado
    status: {
      type: String,
      enum: ["active", "expired", "cancelled"],
      default: "active"
    },
    
    // Datas importantes
    appliedAt: { type: Date, default: Date.now },
    expiresAt: { type: Date }, // quando o desconto expira para este usuário
    
    // Metadados
    metadata: {
      type: Schema.Types.Mixed,
      default: {}
    }
  },
  { timestamps: true }
);

// Índices para performance
CouponUsageSchema.index({ couponId: 1 });
CouponUsageSchema.index({ userId: 1 });
CouponUsageSchema.index({ userEmail: 1 });
CouponUsageSchema.index({ tenantId: 1 });
CouponUsageSchema.index({ status: 1 });

export type CouponUsageDoc = {
  couponId: string;
  userId: string;
  userEmail: string;
  tenantId: string;
  originalPrice: number;
  discountAmount: number;
  finalPrice: number;
  subscriptionPlan?: "basic" | "pro" | "ultra";
  subscriptionType?: "monthly" | "annual" | "weekly";
  status: "active" | "expired" | "cancelled";
  appliedAt: Date;
  expiresAt?: Date;
  metadata: any;
};

export default models.CouponUsage || model("CouponUsage", CouponUsageSchema);
