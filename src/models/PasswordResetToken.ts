// src/models/PasswordResetToken.ts
import mongoose, { Schema, models, model } from "mongoose";

const PasswordResetTokenSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    token: { type: String, required: true, unique: true },
    expiresAt: { type: Date, required: true, index: true },
    usedAt: { type: Date },
  },
  { timestamps: true }
);

export default models.PasswordResetToken ||
  model("PasswordResetToken", PasswordResetTokenSchema);

