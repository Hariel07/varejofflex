import mongoose, { Schema, Document } from 'mongoose';

export interface IStockMovement extends Document {
  _id: string;
  userId: string;
  ingredientId: mongoose.Types.ObjectId;
  type: 'entrada' | 'saida';
  quantity: number;
  reason: string;
  observations?: string;
  performedBy: string; // ID do usuário que fez a movimentação
  performedByName: string; // Nome do usuário para facilitar consultas
  userRole: 'owner' | 'logista'; // Papel do usuário
  createdAt: Date;
  updatedAt: Date;
}

const StockMovementSchema = new Schema<IStockMovement>({
  userId: {
    type: String,
    required: true,
    index: true
  },
  ingredientId: {
    type: Schema.Types.ObjectId,
    ref: 'Ingredient',
    required: true,
    index: true
  },
  type: {
    type: String,
    enum: ['entrada', 'saida'],
    required: true,
    index: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 0
  },
  reason: {
    type: String,
    required: true,
    maxlength: 200
  },
  observations: {
    type: String,
    maxlength: 500
  },
  performedBy: {
    type: String,
    required: true,
    index: true
  },
  performedByName: {
    type: String,
    required: true
  },
  userRole: {
    type: String,
    enum: ['owner', 'logista'],
    required: true,
    index: true
  }
}, {
  timestamps: true
});

// Índices compostos para consultas otimizadas
StockMovementSchema.index({ userId: 1, createdAt: -1 });
StockMovementSchema.index({ userId: 1, ingredientId: 1, createdAt: -1 });
StockMovementSchema.index({ userId: 1, type: 1, createdAt: -1 });
StockMovementSchema.index({ performedBy: 1, createdAt: -1 });

const StockMovement = mongoose.models.StockMovement || mongoose.model<IStockMovement>('StockMovement', StockMovementSchema);

export default StockMovement;