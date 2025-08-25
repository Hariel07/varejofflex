import mongoose from 'mongoose';

export interface IPurchaseItem {
  ingredientId: string;
  ingredientName: string;
  quantity: number;
  unit: 'g' | 'kg' | 'ml' | 'l' | 'un';
  unitCost: number; // Custo por unidade
  totalCost: number; // quantity * unitCost
  batch?: string; // Lote (opcional)
  expirationDate?: Date; // Data de validade (opcional)
}

export interface IPurchase {
  _id?: string;
  purchaseNumber: string; // Número da compra
  supplier?: string; // Fornecedor
  purchaseDate: Date;
  items: IPurchaseItem[];
  totalAmount: number; // Valor total da compra
  status: 'pending' | 'received' | 'cancelled';
  notes?: string;
  invoice?: string; // Número da nota fiscal
  userId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const PurchaseItemSchema = new mongoose.Schema({
  ingredientId: {
    type: String,
    required: true
  },
  ingredientName: {
    type: String,
    required: true
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
  unitCost: {
    type: Number,
    required: true,
    min: 0
  },
  totalCost: {
    type: Number,
    required: true,
    min: 0
  },
  batch: {
    type: String,
    trim: true
  },
  expirationDate: {
    type: Date
  }
}, { _id: false });

const PurchaseSchema = new mongoose.Schema<IPurchase>({
  purchaseNumber: {
    type: String,
    required: true,
    trim: true
  },
  supplier: {
    type: String,
    trim: true
  },
  purchaseDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  items: [PurchaseItemSchema],
  totalAmount: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    required: true,
    enum: ['pending', 'received', 'cancelled'],
    default: 'pending'
  },
  notes: {
    type: String,
    trim: true
  },
  invoice: {
    type: String,
    trim: true
  },
  userId: {
    type: String,
    required: true,
    index: true
  }
}, {
  timestamps: true
});

// Índices para performance
PurchaseSchema.index({ userId: 1, purchaseDate: -1 });
PurchaseSchema.index({ userId: 1, status: 1 });
PurchaseSchema.index({ userId: 1, purchaseNumber: 1 });

const Purchase = mongoose.models.Purchase || mongoose.model<IPurchase>('Purchase', PurchaseSchema);

export default Purchase;