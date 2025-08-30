import mongoose, { Schema, Document } from 'mongoose';

export interface IItemBase extends Document {
  name: string;
  description?: string;
  category: string;
  unit: string;
  basePrice: number;
  tags: string[];
  
  // Status e controle
  isActive: boolean;
  
  // Multitenancy
  userId: string;
  companyId?: string;
  
  // Auditoria
  createdAt: Date;
  updatedAt: Date;
}

const ItemBaseSchema = new Schema<IItemBase>({
  name: {
    type: String,
    required: [true, 'Nome é obrigatório'],
    trim: true,
    maxlength: [100, 'Nome deve ter no máximo 100 caracteres']
  },
  
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Descrição deve ter no máximo 500 caracteres']
  },
  
  category: {
    type: String,
    required: [true, 'Categoria é obrigatória'],
    trim: true,
    default: 'Geral'
  },
  
  unit: {
    type: String,
    required: [true, 'Unidade é obrigatória'],
    trim: true,
    default: 'un'
  },
  
  basePrice: {
    type: Number,
    default: 0,
    min: [0, 'Preço base não pode ser negativo']
  },
  
  tags: [{
    type: String,
    trim: true,
    maxlength: [30, 'Tag deve ter no máximo 30 caracteres']
  }],
  
  isActive: {
    type: Boolean,
    default: true
  },
  
  userId: {
    type: String,
    required: [true, 'ID do usuário é obrigatório'],
    index: true
  },
  
  companyId: {
    type: String,
    index: true
  }
}, {
  timestamps: true,
  collection: 'itens_base'
});

// Índices compostos para melhor performance
ItemBaseSchema.index({ userId: 1, name: 1 }, { unique: true });
ItemBaseSchema.index({ userId: 1, category: 1 });
ItemBaseSchema.index({ userId: 1, isActive: 1 });
ItemBaseSchema.index({ companyId: 1, isActive: 1 });

export default mongoose.models.ItemBase || mongoose.model<IItemBase>('ItemBase', ItemBaseSchema);