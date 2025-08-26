// src/models/PasswordResetToken.ts
import mongoose, { Schema, models, model } from "mongoose";

const PasswordResetTokenSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    token: { type: String, required: true, unique: true },
    expiresAt: { type: Date, required: true },
    usedAt: { type: Date },
  },
  { timestamps: true }
);

// Índices explícitos para evitar duplicação
PasswordResetTokenSchema.index({ token: 1 });
PasswordResetTokenSchema.index({ userId: 1 });
PasswordResetTokenSchema.index({ expiresAt: 1 });

export default models.PasswordResetToken ||
  model("PasswordResetToken", PasswordResetTokenSchema);

