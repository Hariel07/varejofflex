import mongoose from 'mongoose';

export interface IAdditionalCost {
  _id?: string;
  name: string;
  price?: number; // Para custos fixos como embalagens
  quantity?: number; // Quantidade no pacote
  unit?: 'un' | 'dia' | 'kg' | 'g' | 'ml' | 'l';
  
  // Para taxas percentuais ou fixas
  type?: 'fixo' | 'percentual';
  value?: number; // Valor da taxa
  application?: 'individual' | 'global';
  productIds?: string[]; // IDs dos produtos onde a taxa se aplica
  
  userId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const AdditionalCostSchema = new mongoose.Schema<IAdditionalCost>({
  name: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: Number,
    min: 0
  },
  quantity: {
    type: Number,
    min: 0
  },
  unit: {
    type: String,
    enum: ['un', 'dia', 'kg', 'g', 'ml', 'l']
  },
  type: {
    type: String,
    enum: ['fixo', 'percentual']
  },
  value: {
    type: Number,
    min: 0
  },
  application: {
    type: String,
    enum: ['individual', 'global']
  },
  productIds: [{
    type: String
  }],
  userId: {
    type: String,
    required: true,
    index: true
  }
}, {
  timestamps: true
});

// Índices
AdditionalCostSchema.index({ userId: 1, name: 1 });

const AdditionalCost = mongoose.models.AdditionalCost || mongoose.model<IAdditionalCost>('AdditionalCost', AdditionalCostSchema);

export default AdditionalCost;