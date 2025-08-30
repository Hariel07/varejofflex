import mongoose from 'mongoose';

export interface IMovimentacao {
  _id?: string;
  
  // Dados básicos da movimentação
  type: 'entrada' | 'saida';
  date: Date;
  
  // Produto/Item movimentado
  productId: string; // ID do produto (pode ser ingrediente, produto acabado, etc)
  productName: string; // Nome do produto para histórico
  productType: 'ingredient' | 'product' | 'other'; // Tipo do item
  
  // Quantidade
  quantity: number;
  unit: string; // g, kg, ml, l, un, pacote, etc
  
  // Valores financeiros
  unitCost?: number; // Custo unitário (para entradas)
  totalCost?: number; // Custo total (quantity * unitCost)
  unitPrice?: number; // Preço unitário (para saídas/vendas)
  totalValue?: number; // Valor total
  
  // Informações da origem/destino
  fornecedorId?: string; // ID do fornecedor (para entradas)
  fornecedorName?: string; // Nome do fornecedor para histórico
  customerId?: string; // ID do cliente (para saídas/vendas)
  customerName?: string; // Nome do cliente
  
  // Documentação
  documentType: 'nota_simples' | 'nf' | 'cupom' | 'interno' | 'perda' | 'ajuste';
  documentNumber?: string; // Número da nota/cupom
  documentDate?: Date; // Data do documento
  
  // Motivo/Observações
  reason: string; // Motivo da movimentação
  observations?: string; // Observações adicionais
  
  // Lote e validade (para ingredientes)
  batch?: string;
  expirationDate?: Date;
  
  // Localização
  location?: string; // Estoque, cozinha, balcão, etc
  
  // Dados de controle
  userId: string;
  companyId?: string;
  performedBy: string; // ID do usuário que fez a movimentação
  performedByName: string; // Nome do usuário
  
  // Status
  status: 'pending' | 'confirmed' | 'cancelled';
  
  createdAt?: Date;
  updatedAt?: Date;
}

const MovimentacaoSchema = new mongoose.Schema<IMovimentacao>({
  type: {
    type: String,
    enum: ['entrada', 'saida'],
    required: true
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  productId: {
    type: String,
    required: true,
    index: true
  },
  productName: {
    type: String,
    required: true,
    trim: true
  },
  productType: {
    type: String,
    enum: ['ingredient', 'product', 'other'],
    required: true,
    default: 'ingredient'
  },
  quantity: {
    type: Number,
    required: true,
    min: 0
  },
  unit: {
    type: String,
    required: true,
    trim: true
  },
  unitCost: {
    type: Number,
    min: 0
  },
  totalCost: {
    type: Number,
    min: 0
  },
  unitPrice: {
    type: Number,
    min: 0
  },
  totalValue: {
    type: Number,
    min: 0
  },
  fornecedorId: {
    type: String,
    index: true
  },
  fornecedorName: {
    type: String,
    trim: true
  },
  customerId: {
    type: String,
    index: true
  },
  customerName: {
    type: String,
    trim: true
  },
  documentType: {
    type: String,
    enum: ['nota_simples', 'nf', 'cupom', 'interno', 'perda', 'ajuste'],
    required: true,
    default: 'interno'
  },
  documentNumber: {
    type: String,
    trim: true
  },
  documentDate: {
    type: Date
  },
  reason: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  observations: {
    type: String,
    trim: true,
    maxlength: 1000
  },
  batch: {
    type: String,
    trim: true
  },
  expirationDate: {
    type: Date
  },
  location: {
    type: String,
    trim: true,
    default: 'Estoque Principal'
  },
  userId: {
    type: String,
    required: true,
    index: true
  },
  companyId: {
    type: String,
    index: true
  },
  performedBy: {
    type: String,
    required: true,
    index: true
  },
  performedByName: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled'],
    default: 'confirmed'
  }
}, {
  timestamps: true
});

// Índices compostos para performance
MovimentacaoSchema.index({ userId: 1, date: -1 });
MovimentacaoSchema.index({ userId: 1, productId: 1, date: -1 });
MovimentacaoSchema.index({ userId: 1, type: 1, date: -1 });
MovimentacaoSchema.index({ userId: 1, fornecedorId: 1, date: -1 });
MovimentacaoSchema.index({ userId: 1, status: 1, date: -1 });
MovimentacaoSchema.index({ companyId: 1, date: -1 });
MovimentacaoSchema.index({ performedBy: 1, date: -1 });

// Middleware para calcular valores automaticamente
MovimentacaoSchema.pre('save', function(next) {
  // Calcular totalCost se não foi fornecido
  if (this.unitCost && this.quantity && !this.totalCost) {
    this.totalCost = this.unitCost * this.quantity;
  }
  
  // Calcular totalValue se não foi fornecido
  if (this.unitPrice && this.quantity && !this.totalValue) {
    this.totalValue = this.unitPrice * this.quantity;
  }
  
  next();
});

const Movimentacao = mongoose.models.Movimentacao || mongoose.model<IMovimentacao>('Movimentacao', MovimentacaoSchema);

export default Movimentacao;