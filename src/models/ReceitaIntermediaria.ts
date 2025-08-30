import mongoose, { Schema, Document } from 'mongoose';

export interface IReceitaIntermediaria extends Document {
  name: string;
  description?: string;
  unit: 'kg' | 'g' | 'l' | 'ml' | 'un' | 'dz' | 'm' | 'cm';
  yieldQuantity: number; // Quantidade que rende (ex: 1kg de massa)
  cost: number; // Custo total calculado automaticamente
  costPerUnit: number; // Custo por unidade (ex: R$ 5,00 por kg)
  
  // Ingredientes necessários
  ingredients: Array<{
    ingredientId: string;
    ingredientName: string;
    quantity: number;
    unit: string;
    cost: number; // Custo deste ingrediente na receita
  }>;
  
  // Instruções de preparo
  instructions?: string;
  preparationTime?: number; // Em minutos
  difficulty?: 'facil' | 'medio' | 'dificil';
  
  // Categorização
  category?: string;
  tags?: string[];
  
  // Status e controle
  status: 'ativo' | 'inativo' | 'rascunho';
  isActive: boolean;
  
  // Controle de produção
  canBeProduced: boolean; // Se tem ingredientes suficientes
  lastProduced?: Date;
  totalProduced: number; // Quantidade total já produzida
  
  // Multitenancy
  userId: string;
  companyId?: string;
  
  // Auditoria
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  lastModifiedBy: string;
}

const ReceitaIntermediariaSchema = new Schema<IReceitaIntermediaria>({
  name: {
    type: String,
    required: [true, 'Nome da receita é obrigatório'],
    trim: true,
    maxlength: [100, 'Nome deve ter no máximo 100 caracteres']
  },
  
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Descrição deve ter no máximo 500 caracteres']
  },
  
  unit: {
    type: String,
    required: [true, 'Unidade é obrigatória'],
    enum: {
      values: ['kg', 'g', 'l', 'ml', 'un', 'dz', 'm', 'cm'],
      message: 'Unidade deve ser: kg, g, l, ml, un, dz, m ou cm'
    }
  },
  
  yieldQuantity: {
    type: Number,
    required: [true, 'Quantidade de rendimento é obrigatória'],
    min: [0.001, 'Rendimento deve ser maior que zero']
  },
  
  cost: {
    type: Number,
    default: 0,
    min: [0, 'Custo não pode ser negativo']
  },
  
  costPerUnit: {
    type: Number,
    default: 0,
    min: [0, 'Custo por unidade não pode ser negativo']
  },
  
  ingredients: [{
    ingredientId: {
      type: String,
      required: [true, 'ID do ingrediente é obrigatório']
    },
    ingredientName: {
      type: String,
      required: [true, 'Nome do ingrediente é obrigatório'],
      trim: true
    },
    quantity: {
      type: Number,
      required: [true, 'Quantidade é obrigatória'],
      min: [0.001, 'Quantidade deve ser maior que zero']
    },
    unit: {
      type: String,
      required: [true, 'Unidade é obrigatória'],
      trim: true
    },
    cost: {
      type: Number,
      required: [true, 'Custo é obrigatório'],
      min: [0, 'Custo não pode ser negativo']
    }
  }],
  
  instructions: {
    type: String,
    trim: true,
    maxlength: [2000, 'Instruções devem ter no máximo 2000 caracteres']
  },
  
  preparationTime: {
    type: Number,
    min: [1, 'Tempo de preparo deve ser pelo menos 1 minuto']
  },
  
  difficulty: {
    type: String,
    enum: {
      values: ['facil', 'medio', 'dificil'],
      message: 'Dificuldade deve ser: facil, medio ou dificil'
    },
    default: 'medio'
  },
  
  category: {
    type: String,
    trim: true,
    maxlength: [50, 'Categoria deve ter no máximo 50 caracteres']
  },
  
  tags: [{
    type: String,
    trim: true,
    maxlength: [30, 'Tag deve ter no máximo 30 caracteres']
  }],
  
  status: {
    type: String,
    enum: {
      values: ['ativo', 'inativo', 'rascunho'],
      message: 'Status deve ser: ativo, inativo ou rascunho'
    },
    default: 'rascunho'
  },
  
  isActive: {
    type: Boolean,
    default: true
  },
  
  canBeProduced: {
    type: Boolean,
    default: false
  },
  
  lastProduced: {
    type: Date
  },
  
  totalProduced: {
    type: Number,
    default: 0,
    min: [0, 'Total produzido não pode ser negativo']
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
  collection: 'receitas_intermediarias'
});

// Índices compostos para melhor performance
ReceitaIntermediariaSchema.index({ userId: 1, name: 1 }, { unique: true });
ReceitaIntermediariaSchema.index({ userId: 1, status: 1 });
ReceitaIntermediariaSchema.index({ userId: 1, isActive: 1 });
ReceitaIntermediariaSchema.index({ userId: 1, category: 1 });
ReceitaIntermediariaSchema.index({ companyId: 1, status: 1 });

// Middleware para calcular custos automaticamente
ReceitaIntermediariaSchema.pre('save', function(next) {
  if (this.isModified('ingredients') || this.isModified('yieldQuantity')) {
    // Calcular custo total
    this.cost = this.ingredients.reduce((total, ingredient) => total + ingredient.cost, 0);
    
    // Calcular custo por unidade
    if (this.yieldQuantity > 0) {
      this.costPerUnit = this.cost / this.yieldQuantity;
    }
  }
  
  next();
});

// Método para verificar se pode ser produzida
ReceitaIntermediariaSchema.methods.checkCanBeProduced = async function() {
  const Ingredient = mongoose.model('Ingredient');
  
  let canProduce = true;
  
  for (const ingredient of this.ingredients) {
    const ingredientDoc = await Ingredient.findOne({
      _id: ingredient.ingredientId,
      userId: this.userId
    });
    
    if (!ingredientDoc || ingredientDoc.quantity < ingredient.quantity) {
      canProduce = false;
      break;
    }
  }
  
  this.canBeProduced = canProduce;
  return canProduce;
};

// Método para simular produção (verificar custos e disponibilidade)
ReceitaIntermediariaSchema.methods.simulateProduction = async function(quantityToProduce: number = 1) {
  const Ingredient = mongoose.model('Ingredient');
  
  const simulation = {
    possible: true,
    totalCost: this.cost * quantityToProduce,
    totalYield: this.yieldQuantity * quantityToProduce,
    ingredients: [] as any[],
    missingIngredients: [] as any[]
  };
  
  for (const ingredient of this.ingredients) {
    const requiredQuantity = ingredient.quantity * quantityToProduce;
    
    const ingredientDoc = await Ingredient.findOne({
      _id: ingredient.ingredientId,
      userId: this.userId
    });
    
    const ingredientInfo = {
      name: ingredient.ingredientName,
      required: requiredQuantity,
      available: ingredientDoc?.quantity || 0,
      unit: ingredient.unit,
      cost: ingredient.cost * quantityToProduce
    };
    
    if (!ingredientDoc || ingredientDoc.quantity < requiredQuantity) {
      simulation.possible = false;
      simulation.missingIngredients.push({
        ...ingredientInfo,
        missing: requiredQuantity - (ingredientDoc?.quantity || 0)
      });
    }
    
    simulation.ingredients.push(ingredientInfo);
  }
  
  return simulation;
};

// Método estático para buscar receitas por ingrediente
ReceitaIntermediariaSchema.statics.findByIngredient = function(ingredientId: string, userId: string) {
  return this.find({
    userId,
    'ingredients.ingredientId': ingredientId,
    isActive: true
  });
};

export default mongoose.models.ReceitaIntermediaria || mongoose.model<IReceitaIntermediaria>('ReceitaIntermediaria', ReceitaIntermediariaSchema);