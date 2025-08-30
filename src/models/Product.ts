import { Schema, model, models, Types } from "mongoose";

export interface IProductoIngrediente {
  tipo: 'ingrediente_secao' | 'receita_intermediaria';
  itemId: Types.ObjectId; // ID do IngredienteSecao ou ReceitaIntermediaria
  quantidade: number;
  unidade: string;
  custoUnitario?: number;
  observacoes?: string;
}

export interface IProduct {
  _id: Types.ObjectId;
  companyId: Types.ObjectId;
  tenantId?: string; // mantido para compatibilidade
  
  // Dados básicos do produto final
  nome: string;
  descricao?: string;
  secaoId?: Types.ObjectId; // Seção principal do produto
  
  // Composição do produto
  ingredientes: IProductoIngrediente[]; // Ingredientes diretos
  receitas: IProductoIngrediente[]; // Receitas intermediárias
  
  // Preços e custos
  custoTotal?: number; // Custo calculado dos ingredientes/receitas
  margemDesejada?: number; // Margem de lucro desejada (%)
  precoSugerido?: number; // Preço calculado com margem
  precoVenda: number; // Preço final de venda
  
  // Informações do produto
  categoria?: string;
  tags?: string[];
  imagem?: string;
  
  // Informações nutricionais (opcional)
  calorias?: number;
  peso?: number;
  porcoes?: number;
  
  // Informações de preparo
  tempoPreparo?: number;
  tempoEntrega?: number;
  disponibilidade?: {
    segunda?: boolean;
    terca?: boolean;
    quarta?: boolean;
    quinta?: boolean;
    sexta?: boolean;
    sabado?: boolean;
    domingo?: boolean;
    horarios?: string; // Ex: "08:00-22:00"
  };
  
  // Status e controles
  ativo: boolean;
  status: 'draft' | 'published' | 'archived';
  destaque?: boolean; // Se é produto em destaque
  promocao?: {
    ativa: boolean;
    precoPromocional?: number;
    dataInicio?: Date;
    dataFim?: Date;
  };
  
  createdAt: Date;
  updatedAt: Date;
}

const ProductoIngredienteSchema = new Schema({
  tipo: { 
    type: String, 
    required: true,
    enum: ['ingrediente_secao', 'receita_intermediaria']
  },
  itemId: { type: Schema.Types.ObjectId, required: true, refPath: 'ingredientes.tipo' },
  quantidade: { type: Number, required: true, min: 0 },
  unidade: { type: String, required: true, trim: true },
  custoUnitario: { type: Number, min: 0 },
  observacoes: { type: String, trim: true }
}, { _id: false });

const ProductSchema = new Schema<IProduct>(
  {
    companyId: { type: Schema.Types.ObjectId, ref: "Company", required: true },
    tenantId: { type: String }, // mantido para compatibilidade
    
    nome: { type: String, required: true, trim: true },
    descricao: { type: String, trim: true },
    secaoId: { type: Schema.Types.ObjectId, ref: "Secao" },
    
    ingredientes: [ProductoIngredienteSchema],
    receitas: [ProductoIngredienteSchema],
    
    custoTotal: { type: Number, min: 0, default: 0 },
    margemDesejada: { type: Number, min: 0, max: 100 },
    precoSugerido: { type: Number, min: 0 },
    precoVenda: { type: Number, required: true, min: 0 },
    
    categoria: { type: String, trim: true },
    tags: [{ type: String, trim: true }],
    imagem: { type: String, trim: true },
    
    calorias: { type: Number, min: 0 },
    peso: { type: Number, min: 0 },
    porcoes: { type: Number, min: 1, default: 1 },
    
    tempoPreparo: { type: Number, min: 0 },
    tempoEntrega: { type: Number, min: 0 },
    
    disponibilidade: {
      segunda: { type: Boolean, default: true },
      terca: { type: Boolean, default: true },
      quarta: { type: Boolean, default: true },
      quinta: { type: Boolean, default: true },
      sexta: { type: Boolean, default: true },
      sabado: { type: Boolean, default: true },
      domingo: { type: Boolean, default: true },
      horarios: { type: String, trim: true, default: "08:00-22:00" }
    },
    
    ativo: { type: Boolean, default: true },
    status: { 
      type: String, 
      enum: ['draft', 'published', 'archived'], 
      default: 'draft' 
    },
    destaque: { type: Boolean, default: false },
    
    promocao: {
      ativa: { type: Boolean, default: false },
      precoPromocional: { type: Number, min: 0 },
      dataInicio: { type: Date },
      dataFim: { type: Date }
    }
  },
  { timestamps: true }
);

ProductSchema.index({ companyId: 1, nome: 1 });
ProductSchema.index({ tenantId: 1, nome: 1 }); // mantido para compatibilidade
ProductSchema.index({ companyId: 1, secaoId: 1 });
ProductSchema.index({ companyId: 1, categoria: 1 });
ProductSchema.index({ companyId: 1, status: 1 });
ProductSchema.index({ companyId: 1, ativo: 1 });

export default models.Product || model<IProduct>("Product", ProductSchema);
