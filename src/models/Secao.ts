import mongoose from 'mongoose';

export interface ISecao {
  _id?: string;
  name: string;
  description?: string;
  icon?: string; // Emoji ou classe CSS para ícone
  color?: string; // Cor hexadecimal para identificação visual
  order?: number; // Ordem de exibição
  isActive: boolean;
  
  // Configurações específicas por segmento
  segment?: string; // Ex: lanchonete, pizzaria, mercado
  
  // Dados de controle
  userId: string;
  companyId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const SecaoSchema = new mongoose.Schema<ISecao>({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    trim: true,
    maxlength: 500
  },
  icon: {
    type: String,
    trim: true,
    default: '📂'
  },
  color: {
    type: String,
    trim: true,
    default: '#6B7280',
    validate: {
      validator: function(value: string) {
        // Validar formato hexadecimal
        return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(value);
      },
      message: 'Cor deve estar no formato hexadecimal (#RRGGBB ou #RGB)'
    }
  },
  order: {
    type: Number,
    default: 0,
    min: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  segment: {
    type: String,
    trim: true,
    enum: [
      'lanchonete', 
      'pizzaria', 
      'mercado', 
      'farmacia', 
      'moda', 
      'petshop', 
      'salao', 
      'conveniencia',
      'geral'
    ],
    default: 'geral'
  },
  userId: {
    type: String,
    required: true,
    index: true
  },
  companyId: {
    type: String,
    index: true
  }
}, {
  timestamps: true
});

// Índices compostos para performance
SecaoSchema.index({ userId: 1, name: 1 }, { unique: true });
SecaoSchema.index({ userId: 1, segment: 1 });
SecaoSchema.index({ userId: 1, isActive: 1 });
SecaoSchema.index({ userId: 1, order: 1 });
SecaoSchema.index({ companyId: 1, isActive: 1 });

// Middleware para definir order automaticamente
SecaoSchema.pre('save', async function(next) {
  if (this.isNew && this.order === 0) {
    const lastSecao = await mongoose.model('Secao').findOne({ 
      userId: this.userId 
    }).sort({ order: -1 });
    
    if (lastSecao) {
      this.order = (lastSecao.order || 0) + 1;
    } else {
      this.order = 1;
    }
  }
  next();
});

const Secao = mongoose.models.Secao || mongoose.model<ISecao>('Secao', SecaoSchema);

export default Secao;