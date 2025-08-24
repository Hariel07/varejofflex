import mongoose from 'mongoose';

export interface IPlan {
  _id?: string;
  planId: string; // 'basico', 'profissional', 'empresarial'
  name: string;
  description: string;
  features: string[];
  pricing: {
    weekly: {
      price: number;
      enabled: boolean;
      discount?: number;
    };
    monthly: {
      price: number;
      enabled: boolean;
      discount?: number;
    };
    annual: {
      price: number;
      enabled: boolean;
      discount?: number;
    };
  };
  color: string;
  popular: boolean;
  enabled: boolean;
  trialDays: number;
  order: number; // para ordenação na exibição
  updatedAt: Date;
  updatedBy?: string; // ID do usuário que fez a última alteração
}

const PlanSchema = new mongoose.Schema<IPlan>({
  planId: {
    type: String,
    required: true,
    unique: true,
    enum: ['basico', 'profissional', 'empresarial']
  },
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  features: [{
    type: String,
    required: true
  }],
  pricing: {
    weekly: {
      price: {
        type: Number,
        required: true,
        min: 0
      },
      enabled: {
        type: Boolean,
        default: true
      },
      discount: {
        type: Number,
        min: 0,
        max: 100
      }
    },
    monthly: {
      price: {
        type: Number,
        required: true,
        min: 0
      },
      enabled: {
        type: Boolean,
        default: true
      },
      discount: {
        type: Number,
        min: 0,
        max: 100
      }
    },
    annual: {
      price: {
        type: Number,
        required: true,
        min: 0
      },
      enabled: {
        type: Boolean,
        default: true
      },
      discount: {
        type: Number,
        min: 0,
        max: 100
      }
    }
  },
  color: {
    type: String,
    required: true,
    default: '#0d6efd'
  },
  popular: {
    type: Boolean,
    default: false
  },
  enabled: {
    type: Boolean,
    default: true
  },
  trialDays: {
    type: Number,
    default: 14,
    min: 0
  },
  order: {
    type: Number,
    required: true,
    default: 0
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  updatedBy: {
    type: String,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Middleware para atualizar updatedAt automaticamente
PlanSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Índices para performance
PlanSchema.index({ planId: 1 });
PlanSchema.index({ enabled: 1, order: 1 });

export default mongoose.models.Plan || mongoose.model<IPlan>('Plan', PlanSchema);