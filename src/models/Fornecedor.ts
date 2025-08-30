import mongoose from 'mongoose';

export interface IFornecedor {
  _id?: string;
  name: string;
  type: 'completo' | 'simples'; // Completo = NF, Simples = Nota Branca
  
  // Dados básicos (sempre obrigatórios)
  email?: string;
  phone?: string;
  
  // Dados completos (apenas para type = 'completo')
  cnpjCpf?: string;
  razaoSocial?: string;
  inscricaoEstadual?: string;
  inscricaoMunicipal?: string;
  
  // Endereço (apenas para type = 'completo')
  address?: {
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
  };
  
  // Dados bancários (opcionais)
  bankInfo?: {
    bank: string;
    agency: string;
    account: string;
    accountType: 'corrente' | 'poupanca';
    pix?: string;
  };
  
  // Informações comerciais
  category?: string; // Categoria do fornecedor (ex: Carnes, Verduras, Embalagens)
  observations?: string;
  isActive: boolean;
  
  // Dados de controle
  userId: string;
  companyId?: string; // Para multi-tenancy
  createdAt?: Date;
  updatedAt?: Date;
}

const AddressSchema = new mongoose.Schema({
  street: { type: String, required: true, trim: true },
  number: { type: String, required: true, trim: true },
  complement: { type: String, trim: true },
  neighborhood: { type: String, required: true, trim: true },
  city: { type: String, required: true, trim: true },
  state: { type: String, required: true, trim: true, maxlength: 2 },
  zipCode: { type: String, required: true, trim: true }
}, { _id: false });

const BankInfoSchema = new mongoose.Schema({
  bank: { type: String, required: true, trim: true },
  agency: { type: String, required: true, trim: true },
  account: { type: String, required: true, trim: true },
  accountType: { type: String, enum: ['corrente', 'poupanca'], required: true },
  pix: { type: String, trim: true }
}, { _id: false });

const FornecedorSchema = new mongoose.Schema<IFornecedor>({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  type: {
    type: String,
    enum: ['completo', 'simples'],
    required: true,
    default: 'simples'
  },
  email: {
    type: String,
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    trim: true
  },
  cnpjCpf: {
    type: String,
    trim: true,
    validate: {
      validator: function(this: any, value: string) {
        // Se type = 'completo', CNPJ/CPF é obrigatório
        if (this.type === 'completo') {
          return !!(value && value.length >= 11);
        }
        return true;
      },
      message: 'CNPJ/CPF é obrigatório para fornecedores completos'
    }
  },
  razaoSocial: {
    type: String,
    trim: true
  },
  inscricaoEstadual: {
    type: String,
    trim: true
  },
  inscricaoMunicipal: {
    type: String,
    trim: true
  },
  address: {
    type: AddressSchema,
    validate: {
      validator: function(this: any, value: any) {
        // Se type = 'completo', endereço é obrigatório
        if (this.type === 'completo') {
          return !!(value && value.street && value.city);
        }
        return true;
      },
      message: 'Endereço é obrigatório para fornecedores completos'
    }
  },
  bankInfo: BankInfoSchema,
  category: {
    type: String,
    trim: true,
    default: 'Geral'
  },
  observations: {
    type: String,
    trim: true,
    maxlength: 1000
  },
  isActive: {
    type: Boolean,
    default: true
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
FornecedorSchema.index({ userId: 1, name: 1 });
FornecedorSchema.index({ userId: 1, type: 1 });
FornecedorSchema.index({ userId: 1, category: 1 });
FornecedorSchema.index({ userId: 1, isActive: 1 });
FornecedorSchema.index({ companyId: 1, isActive: 1 });

// Índice único para CNPJ/CPF por usuário (apenas se preenchido)
FornecedorSchema.index(
  { userId: 1, cnpjCpf: 1 },
  { 
    unique: true,
    sparse: true // Permite múltiplos documentos com cnpjCpf vazio
  }
);

const Fornecedor = mongoose.models.Fornecedor || mongoose.model<IFornecedor>('Fornecedor', FornecedorSchema);

export default Fornecedor;