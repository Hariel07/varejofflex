import { Schema, model, models } from "mongoose";

const CouponSchema = new Schema(
  {
    tenantId: { type: String, required: true }, // loja/empresa
    code: { type: String, required: true, uppercase: true, index: true, unique: false },
    
    // Tipos expandidos para incluir cupons de assinatura
    type: { 
      type: String, 
      enum: ["percent", "amount", "free_trial", "subscription_discount"], 
      required: true 
    },
    
    // Categoria do cupom
    category: {
      type: String,
      enum: ["order", "subscription"], // order = para pedidos, subscription = para assinaturas
      default: "order"
    },
    
    value: { type: Number, required: true }, // ex.: 10 (percent) ou 5.00 (amount BRL)
    
    // Para cupons de assinatura
    subscriptionPlan: {
      type: String,
      enum: ["basic", "pro", "ultra"],
      required: false // só obrigatório se category = "subscription"
    },
    
    // Duração do desconto para assinaturas (em meses)
    discountDuration: {
      type: Number,
      default: 1 // quantos meses o desconto será aplicado
    },
    
    // Período gratuito (em dias) para free_trial
    freeTrialDays: {
      type: Number,
      default: 0
    },
    
    startsAt: { type: Date, required: true },
    endsAt: { type: Date, required: true },
    maxUses: { type: Number, default: 0 }, // 0 = ilimitado
    usedCount: { type: Number, default: 0 },
    minOrderTotal: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
    
    // Informações adicionais para o dashboard
    title: { type: String, required: true }, // Nome da promoção
    description: { type: String, required: true }, // Descrição da promoção
    
    // Criado por (owner)
    createdBy: { type: String, required: true }, // ID do owner que criou
  },
  { timestamps: true }
);

CouponSchema.index({ tenantId: 1, code: 1 }, { unique: true });
export type CouponDoc = {
  tenantId: string; 
  code: string; 
  type: "percent" | "amount" | "free_trial" | "subscription_discount"; 
  category: "order" | "subscription";
  value: number;
  subscriptionPlan?: "basic" | "pro" | "ultra";
  discountDuration: number;
  freeTrialDays: number;
  startsAt: Date; 
  endsAt: Date; 
  maxUses: number; 
  usedCount: number;
  minOrderTotal: number; 
  active: boolean;
  title: string;
  description: string;
  createdBy: string;
};
export default models.Coupon || model("Coupon", CouponSchema);
