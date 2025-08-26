import { Schema, model, models } from "mongoose";

const VerificationCodeSchema = new Schema(
  {
    tenantId: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    emailCode: { type: String, required: true },
    whatsappCode: { type: String, required: true },
    emailVerified: { type: Boolean, default: false },
    whatsappVerified: { type: Boolean, default: false },
    expiresAt: { type: Date, required: true },
    attempts: { type: Number, default: 0 },
    maxAttempts: { type: Number, default: 3 },
    userData: {
      nome: String,
      empresa: String,
      cpfCnpj: String,
      endereco: String,
      cidade: String,
      estado: String,
      planId: String,
      billingCycle: String
    },
    status: {
      type: String,
      enum: ["pending", "verified", "expired", "blocked"],
      default: "pending"
    }
  },
  { timestamps: true }
);

VerificationCodeSchema.index({ email: 1, tenantId: 1 });
VerificationCodeSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default models.VerificationCode || model("VerificationCode", VerificationCodeSchema);