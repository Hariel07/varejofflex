import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true
  },
  storeId: {
    type: String,
    required: true,
    index: true
  },
  sku: {
    type: String,
    required: true,
    index: true
  },
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  batch: {
    type: String,
    default: ""
  },
  expiry: {
    type: Date,
    default: null
  },
  qty: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  attrs: {
    brand: { type: String, default: "" },
    category: { type: String, default: "" },
    weight: { type: Number, default: null },
    unit: { type: String, default: "un" }
  }
}, {
  timestamps: true,
  collection: 'iot_products'
});

// Índices compostos para performance
ProductSchema.index({ storeId: 1, sku: 1 }, { unique: true });
ProductSchema.index({ storeId: 1, "attrs.category": 1 });
ProductSchema.index({ expiry: 1 }, { sparse: true });

export default mongoose.models.IotProduct || mongoose.model('IotProduct', ProductSchema);