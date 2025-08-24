import mongoose from 'mongoose';

const KitCatalogSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  items: [{
    sku: { type: String, required: true },
    name: { type: String, required: true },
    qty: { type: Number, required: true, min: 1 },
    unitCost: { type: Number, required: true, min: 0 }
  }],
  suggestedPrice: {
    type: Number,
    required: true,
    min: 0
  },
  segments: [{
    type: String,
    enum: ['moda', 'mercado', 'farmacia', 'conveniencia', 'lanchonete', 'pizzaria', 'petshop', 'salao']
  }],
  type: {
    type: String,
    required: true,
    enum: ['starter', 'pro', 'nonfiscal', 'fiscal', 'reposition'],
    index: true
  },
  active: {
    type: Boolean,
    default: true,
    index: true
  },
  tutorial: {
    steps: [{
      title: { type: String, required: true },
      description: { type: String, required: true },
      videoUrl: { type: String, default: "" },
      imageUrl: { type: String, default: "" }
    }],
    estimatedTimeMin: { type: Number, default: 30 }
  },
  features: [{
    type: String
  }],
  requirements: [{
    type: String
  }]
}, {
  timestamps: true,
  collection: 'iot_kit_catalog'
});

// Índices para marketplace
KitCatalogSchema.index({ type: 1, active: 1 });
KitCatalogSchema.index({ segments: 1, active: 1 });

export default mongoose.models.IotKitCatalog || mongoose.model('IotKitCatalog', KitCatalogSchema);