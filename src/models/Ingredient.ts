import mongoose from 'mongoose';

export interface IIngredientBatch {
  batch?: string;
  quantity: number;
  expirationDate?: Date;
  purchaseDate: Date;
  unitCost: number;
}

export interface IIngredient {
  _id?: string;
  name: string;
  price: number; // Preço médio de compra
  quantity: number; // Quantidade em estoque total
  unit: 'g' | 'kg' | 'ml' | 'l' | 'un'; // Unidade
  supplier?: string; // Fornecedor principal
  minimumStock?: number; // Estoque mínimo para alerta
  batches?: IIngredientBatch[]; // Lotes em estoque
  userId: string; // ID do usuário proprietário
  createdAt?: Date;
  updatedAt?: Date;
}

const IngredientBatchSchema = new mongoose.Schema({
  batch: {
    type: String,
    trim: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 0
  },
  expirationDate: {
    type: Date
  },
  purchaseDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  unitCost: {
    type: Number,
    required: true,
    min: 0
  }
}, { _id: false });

const IngredientSchema = new mongoose.Schema<IIngredient>({
  name: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  quantity: {
    type: Number,
    required: true,
    min: 0
  },
  unit: {
    type: String,
    required: true,
    enum: ['g', 'kg', 'ml', 'l', 'un']
  },
  supplier: {
    type: String,
    trim: true
  },
  minimumStock: {
    type: Number,
    min: 0,
    default: 0
  },
  batches: [IngredientBatchSchema],
  userId: {
    type: String,
    required: true,
    index: true
  }
}, {
  timestamps: true
});

// Índices compostos para performance
IngredientSchema.index({ userId: 1, name: 1 });

const Ingredient = mongoose.models.Ingredient || mongoose.model<IIngredient>('Ingredient', IngredientSchema);

export default Ingredient;