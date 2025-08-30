import mongoose, { Schema, Document } from 'mongoose';

export interface IIngredienteSecao extends Document {
  ingredientId: string;
  ingredientName: string;
  secaoId: string;
  secaoName: string;
  
  // Configurações específicas na seção
  displayOrder: number; // Ordem de exibição na seção
  isVisible: boolean; // Se deve aparecer na seção
  isFeatured: boolean; // Se é destaque na seção
  
  // Configurações de exibição
  customName?: string; // Nome customizado para esta seção
  customDescription?: string; // Descrição customizada
  customImage?: string; // Imagem customizada
  
  // Configurações de preço/custo específicas da seção
  customPrice?: number; // Preço específico para esta seção
  markup?: number; // Margem específica para esta seção
  
  // Configurações de estoque por seção
  minStock?: number; // Estoque mínimo específico da seção
  maxStock?: number; // Estoque máximo específico da seção
  alertThreshold?: number; // Limite de alerta específico
  
  // Status e controle
  status: 'ativo' | 'inativo' | 'pausado';
  isActive: boolean;
  
  // Dados da última venda nesta seção
  lastSoldAt?: Date;
  totalSold: number; // Quantidade total vendida nesta seção
  totalRevenue: number; // Receita total gerada nesta seção
  
  // Configurações de promoção específicas
  hasPromotion: boolean;
  promotionPrice?: number;
  promotionStartDate?: Date;
  promotionEndDate?: Date;
  promotionDescription?: string;
  
  // Multitenancy
  userId: string;
  companyId?: string;
  
  // Auditoria
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  lastModifiedBy: string;
}

const IngredienteSecaoSchema = new Schema<IIngredienteSecao>({
  ingredientId: {
    type: String,
    required: [true, 'ID do ingrediente é obrigatório'],
    index: true
  },
  
  ingredientName: {
    type: String,
    required: [true, 'Nome do ingrediente é obrigatório'],
    trim: true
  },
  
  secaoId: {
    type: String,
    required: [true, 'ID da seção é obrigatório'],
    index: true
  },
  
  secaoName: {
    type: String,
    required: [true, 'Nome da seção é obrigatório'],
    trim: true
  },
  
  displayOrder: {
    type: Number,
    default: 0,
    min: [0, 'Ordem não pode ser negativa']
  },
  
  isVisible: {
    type: Boolean,
    default: true
  },
  
  isFeatured: {
    type: Boolean,
    default: false
  },
  
  customName: {
    type: String,
    trim: true,
    maxlength: [100, 'Nome customizado deve ter no máximo 100 caracteres']
  },
  
  customDescription: {
    type: String,
    trim: true,
    maxlength: [500, 'Descrição customizada deve ter no máximo 500 caracteres']
  },
  
  customImage: {
    type: String,
    trim: true
  },
  
  customPrice: {
    type: Number,
    min: [0, 'Preço customizado não pode ser negativo']
  },
  
  markup: {
    type: Number,
    min: [0, 'Margem não pode ser negativa'],
    max: [1000, 'Margem não pode ser maior que 1000%']
  },
  
  minStock: {
    type: Number,
    min: [0, 'Estoque mínimo não pode ser negativo']
  },
  
  maxStock: {
    type: Number,
    min: [0, 'Estoque máximo não pode ser negativo']
  },
  
  alertThreshold: {
    type: Number,
    min: [0, 'Limite de alerta não pode ser negativo']
  },
  
  status: {
    type: String,
    enum: {
      values: ['ativo', 'inativo', 'pausado'],
      message: 'Status deve ser: ativo, inativo ou pausado'
    },
    default: 'ativo'
  },
  
  isActive: {
    type: Boolean,
    default: true
  },
  
  lastSoldAt: {
    type: Date
  },
  
  totalSold: {
    type: Number,
    default: 0,
    min: [0, 'Total vendido não pode ser negativo']
  },
  
  totalRevenue: {
    type: Number,
    default: 0,
    min: [0, 'Receita total não pode ser negativa']
  },
  
  hasPromotion: {
    type: Boolean,
    default: false
  },
  
  promotionPrice: {
    type: Number,
    min: [0, 'Preço promocional não pode ser negativo']
  },
  
  promotionStartDate: {
    type: Date
  },
  
  promotionEndDate: {
    type: Date
  },
  
  promotionDescription: {
    type: String,
    trim: true,
    maxlength: [200, 'Descrição da promoção deve ter no máximo 200 caracteres']
  },
  
  userId: {
    type: String,
    required: [true, 'ID do usuário é obrigatório'],
    index: true
  },
  
  companyId: {
    type: String,
    index: true
  },
  
  createdBy: {
    type: String,
    required: [true, 'Criador é obrigatório']
  },
  
  lastModifiedBy: {
    type: String,
    required: [true, 'Modificador é obrigatório']
  }
}, {
  timestamps: true,
  collection: 'ingredientes_secoes'
});

// Índices compostos para melhor performance e integridade
IngredienteSecaoSchema.index({ userId: 1, ingredientId: 1, secaoId: 1 }, { unique: true });
IngredienteSecaoSchema.index({ userId: 1, secaoId: 1, displayOrder: 1 });
IngredienteSecaoSchema.index({ userId: 1, secaoId: 1, isVisible: 1 });
IngredienteSecaoSchema.index({ userId: 1, secaoId: 1, isFeatured: 1 });
IngredienteSecaoSchema.index({ userId: 1, status: 1 });
IngredienteSecaoSchema.index({ companyId: 1, secaoId: 1 });

// Validação customizada para datas de promoção
IngredienteSecaoSchema.pre('save', function(next) {
  // Se tem promoção, deve ter preço promocional
  if (this.hasPromotion && !this.promotionPrice) {
    return next(new Error('Preço promocional é obrigatório quando há promoção'));
  }
  
  // Validar datas de promoção
  if (this.promotionStartDate && this.promotionEndDate) {
    if (this.promotionStartDate >= this.promotionEndDate) {
      return next(new Error('Data de início deve ser anterior à data de fim da promoção'));
    }
  }
  
  // Se não tem promoção, limpar campos relacionados
  if (!this.hasPromotion) {
    this.promotionPrice = undefined;
    this.promotionStartDate = undefined;
    this.promotionEndDate = undefined;
    this.promotionDescription = undefined;
  }
  
  next();
});

// Middleware para auto-ordenação
IngredienteSecaoSchema.pre('save', async function(next) {
  if (this.isNew && this.displayOrder === 0) {
    // Encontrar a próxima ordem disponível
    const lastItem = await mongoose.model('IngredienteSecao').findOne({
      userId: this.userId,
      secaoId: this.secaoId
    }).sort({ displayOrder: -1 });
    
    this.displayOrder = lastItem ? lastItem.displayOrder + 1 : 1;
  }
  
  next();
});

// Método para verificar se a promoção está ativa
IngredienteSecaoSchema.methods.isPromotionActive = function() {
  if (!this.hasPromotion) return false;
  
  const now = new Date();
  
  if (this.promotionStartDate && now < this.promotionStartDate) return false;
  if (this.promotionEndDate && now > this.promotionEndDate) return false;
  
  return true;
};

// Método para obter preço efetivo (considerando promoção)
IngredienteSecaoSchema.methods.getEffectivePrice = function(basePrice: number) {
  // Se tem preço customizado, usar ele
  if (this.customPrice && this.customPrice > 0) {
    const price = this.customPrice;
    
    // Verificar se tem promoção ativa
    if (this.isPromotionActive() && this.promotionPrice && this.promotionPrice < price) {
      return this.promotionPrice;
    }
    
    return price;
  }
  
  // Se tem markup, aplicar sobre o preço base
  if (this.markup && this.markup > 0) {
    const price = basePrice * (1 + this.markup / 100);
    
    // Verificar se tem promoção ativa
    if (this.isPromotionActive() && this.promotionPrice && this.promotionPrice < price) {
      return this.promotionPrice;
    }
    
    return price;
  }
  
  // Verificar se tem promoção ativa sobre preço base
  if (this.isPromotionActive() && this.promotionPrice && this.promotionPrice < basePrice) {
    return this.promotionPrice;
  }
  
  return basePrice;
};

// Método para registrar venda
IngredienteSecaoSchema.methods.recordSale = async function(quantity: number, unitPrice: number) {
  this.totalSold += quantity;
  this.totalRevenue += quantity * unitPrice;
  this.lastSoldAt = new Date();
  
  await this.save();
};

// Método estático para reordenar itens em uma seção
IngredienteSecaoSchema.statics.reorderItems = async function(userId: string, secaoId: string, itemOrders: Array<{id: string, order: number}>) {
  const bulkOps = itemOrders.map(item => ({
    updateOne: {
      filter: { _id: item.id, userId, secaoId },
      update: { displayOrder: item.order }
    }
  }));
  
  return this.bulkWrite(bulkOps);
};

// Método estático para buscar ingredientes por seção
IngredienteSecaoSchema.statics.findBySecao = function(userId: string, secaoId: string, options: any = {}) {
  const query: any = { userId, secaoId };
  
  if (options.visibleOnly) {
    query.isVisible = true;
  }
  
  if (options.activeOnly) {
    query.status = 'ativo';
  }
  
  if (options.featuredOnly) {
    query.isFeatured = true;
  }
  
  return this.find(query).sort({ displayOrder: 1, createdAt: 1 });
};

export default mongoose.models.IngredienteSecao || mongoose.model<IIngredienteSecao>('IngredienteSecao', IngredienteSecaoSchema);