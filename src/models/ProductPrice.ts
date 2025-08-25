import mongoose from 'mongoose';

export interface IProductComponent {
  type: 'ingredient' | 'recipe' | 'additionalCost';
  id: string; // ID do ingrediente, receita ou custo adicional
  quantity: number;
  unit: 'g' | 'ml' | 'un';
}

export interface IProductPrice {
  _id?: string;
  name: string;
  categoryId: string;
  components: IProductComponent[];
  salePrice: number; // Preço de venda
  description?: string;
  image?: string;
  available: boolean;
  userId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const ProductComponentSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['ingredient', 'recipe', 'additionalCost']
  },
  id: {
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
    enum: ['g', 'ml', 'un']
  }
}, { _id: false });

const ProductPriceSchema = new mongoose.Schema<IProductPrice>({
  name: {
    type: String,
    required: true,
    trim: true
  },
  categoryId: {
    type: String,
    required: true
  },
  components: [ProductComponentSchema],
  salePrice: {
    type: Number,
    required: true,
    min: 0
  },
  description: {
    type: String,
    trim: true
  },
  image: {
    type: String,
    trim: true
  },
  available: {
    type: Boolean,
    default: true
  },
  userId: {
    type: String,
    required: true,
    index: true
  }
}, {
  timestamps: true
});

// Índices
ProductPriceSchema.index({ userId: 1, name: 1 });
ProductPriceSchema.index({ userId: 1, categoryId: 1 });

const ProductPrice = mongoose.models.ProductPrice || mongoose.model<IProductPrice>('ProductPrice', ProductPriceSchema);

export default ProductPrice;