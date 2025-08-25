import mongoose from 'mongoose';

export interface IRecipeIngredient {
  ingredientId: string;
  quantity: number;
  unit: 'g' | 'ml' | 'un';
}

export interface IRecipe {
  _id?: string;
  name: string;
  ingredients: IRecipeIngredient[];
  yield: number; // Rendimento total da receita
  yieldUnit: 'g' | 'ml' | 'un'; // Unidade do rendimento
  instructions?: string;
  userId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const RecipeIngredientSchema = new mongoose.Schema({
  ingredientId: {
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

const RecipeSchema = new mongoose.Schema<IRecipe>({
  name: {
    type: String,
    required: true,
    trim: true
  },
  ingredients: [RecipeIngredientSchema],
  yield: {
    type: Number,
    required: true,
    min: 0
  },
  yieldUnit: {
    type: String,
    required: true,
    enum: ['g', 'ml', 'un']
  },
  instructions: {
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
RecipeSchema.index({ userId: 1, name: 1 });

const Recipe = mongoose.models.Recipe || mongoose.model<IRecipe>('Recipe', RecipeSchema);

export default Recipe;