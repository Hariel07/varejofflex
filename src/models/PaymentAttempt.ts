import { Schema, model, models } from "mongoose";

const PaymentAttemptSchema = new Schema(
  {
    tenantId: { type: String, required: true },
    email: { type: String, required: true },
    planId: { type: String, required: true },
    billingCycle: { type: String, required: true },
    amount: { type: Number, required: true },
    discountAmount: { type: Number, default: 0 },
    finalAmount: { type: Number, required: true },
    
    // Dados do cupom aplicado
    couponCode: String,
    couponDiscount: Number,
    
    // Método de pagamento
    paymentMethod: {
      type: String,
      enum: ["pix", "credit_card", "debit_card"],
      required: true
    },
    
    // Status da tentativa
    status: {
      type: String,
      enum: ["pending", "processing", "success", "failed", "cancelled"],
      default: "pending"
    },
    
    // Dados do PIX (se aplicável)
    pixData: {
      qrCode: String,
      qrCodeImage: String,
      pixKey: String,
      expiresAt: Date
    },
    
    // Dados do cartão (mascarados por segurança)
    cardData: {
      lastFourDigits: String,
      brand: String,
      holderName: String
    },
    
    // Resposta do gateway de pagamento
    gatewayResponse: {
      transactionId: String,
      authorizationCode: String,
      errorCode: String,
      errorMessage: String,
      rawResponse: Schema.Types.Mixed
    },
    
    // Métricas para análise
    userAgent: String,
    ipAddress: String,
    processingTime: Number, // em milissegundos
    
    // Controle de tentativas
    attemptNumber: { type: Number, default: 1 },
    previousAttempts: [{
      timestamp: Date,
      errorCode: String,
      errorMessage: String
    }],
    
    // Data de confirmação do pagamento
    confirmedAt: Date,
    
    // Dados da assinatura criada (se sucesso)
    subscriptionId: String
  },
  { timestamps: true }
);

PaymentAttemptSchema.index({ email: 1, tenantId: 1 });
PaymentAttemptSchema.index({ status: 1, createdAt: -1 });
PaymentAttemptSchema.index({ paymentMethod: 1, createdAt: -1 });

export default models.PaymentAttempt || model("PaymentAttempt", PaymentAttemptSchema);