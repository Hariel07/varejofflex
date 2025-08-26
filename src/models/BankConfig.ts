import { Schema, model, models } from "mongoose";

const BankConfigSchema = new Schema(
  {
    tenantId: { type: String, required: true, unique: true },
    ownerId: { type: String, required: true },
    
    // Configurações PagBank
    pagbank: {
      email: { type: String, required: true },
      token: { type: String, required: true }, // Token da API PagBank
      appId: String,
      publicKey: String,
      environment: {
        type: String,
        enum: ["sandbox", "production"],
        default: "sandbox"
      },
      active: { type: Boolean, default: true }
    },
    
    // Configurações PIX
    pix: {
      pixKey: { type: String, required: true },
      pixKeyType: {
        type: String,
        enum: ["cpf", "cnpj", "email", "phone", "random"],
        required: true
      },
      bankName: { type: String, required: true },
      accountHolder: { type: String, required: true },
      active: { type: Boolean, default: true }
    },
    
    // Taxas e configurações
    fees: {
      pixFeePercent: { type: Number, default: 0 }, // Taxa PIX (geralmente 0%)
      creditCardFeePercent: { type: Number, default: 3.99 }, // Taxa cartão crédito
      debitCardFeePercent: { type: Number, default: 1.99 }, // Taxa cartão débito
      antifraudFee: { type: Number, default: 0.10 } // Taxa antifraude em reais
    },
    
    // Configurações de recebimento
    settlement: {
      pixDays: { type: Number, default: 0 }, // D+0 para PIX
      creditCardDays: { type: Number, default: 30 }, // D+30 para cartão
      debitCardDays: { type: Number, default: 1 } // D+1 para débito
    },
    
    // Status da conta
    status: {
      type: String,
      enum: ["pending", "active", "suspended", "blocked"],
      default: "pending"
    },
    
    // Verificação da conta
    verification: {
      documentsUploaded: { type: Boolean, default: false },
      bankAccountVerified: { type: Boolean, default: false },
      pixKeyVerified: { type: Boolean, default: false },
      verifiedAt: Date
    }
  },
  { timestamps: true }
);

export default models.BankConfig || model("BankConfig", BankConfigSchema);