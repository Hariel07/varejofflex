import mongoose, { Schema, Document } from 'mongoose';

export interface ICoupon extends Document {
  _id: string;
  code: string;
  name: string;
  description?: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minAmount?: number;
  maxDiscount?: number;
  applicablePlans: string[]; // Array de planIds ou '*' para todos
  usageLimit?: number;
  usedCount: number;
  validFrom: Date;
  validUntil: Date;
  isActive: boolean;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

const CouponSchema = new Schema<ICoupon>({
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true,
    minlength: 3,
    maxlength: 20
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  discountType: {
    type: String,
    enum: ['percentage', 'fixed'],
    required: true
  },
  discountValue: {
    type: Number,
    required: true,
    min: 0
  },
  minAmount: {
    type: Number,
    min: 0
  },
  maxDiscount: {
    type: Number,
    min: 0
  },
  applicablePlans: [{
    type: String,
    required: true
  }],
  usageLimit: {
    type: Number,
    min: 1
  },
  usedCount: {
    type: Number,
    default: 0,
    min: 0
  },
  validFrom: {
    type: Date,
    required: true
  },
  validUntil: {
    type: Date,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

// Validações personalizadas
CouponSchema.pre('save', function(next) {
  // Validar se a data de fim é maior que a de início
  if (this.validUntil <= this.validFrom) {
    next(new Error('A data de validade deve ser posterior à data de início'));
    return;
  }

  // Validar desconto percentual
  if (this.discountType === 'percentage' && this.discountValue > 100) {
    next(new Error('Desconto percentual não pode ser maior que 100%'));
    return;
  }

  // Validar desconto fixo
  if (this.discountType === 'fixed' && this.discountValue <= 0) {
    next(new Error('Desconto fixo deve ser maior que zero'));
    return;
  }

  next();
});

// Índices para performance
CouponSchema.index({ code: 1 });
CouponSchema.index({ validFrom: 1, validUntil: 1 });
CouponSchema.index({ isActive: 1 });
CouponSchema.index({ applicablePlans: 1 });
CouponSchema.index({ planId: 1 }); // Para compatibilidade com warning

export default mongoose.models.Coupon || mongoose.model<ICoupon>('Coupon', CouponSchema);