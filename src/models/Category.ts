import mongoose from 'mongoose';

export interface ICategory {
  _id?: string;
  name: string;
  description?: string;
  userId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const CategorySchema = new mongoose.Schema<ICategory>({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
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

// Índices
CategorySchema.index({ userId: 1, name: 1 });

const Category = mongoose.models.Category || mongoose.model<ICategory>('Category', CategorySchema);

export default Category;