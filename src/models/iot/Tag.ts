import mongoose from 'mongoose';

const TagSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true
  },
  storeId: {
    type: String,
    required: true,
    index: true
  },
  productId: {
    type: String,
    required: true,
    ref: 'IotProduct'
  },
  type: {
    type: String,
    required: true,
    enum: ['qr', 'nfc', 'ble'],
    index: true
  },
  serial: {
    type: String,
    required: true,
    unique: true
  },
  url: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true,
    enum: ['active', 'lost', 'error'],
    default: 'active',
    index: true
  },
  lastSeen: {
    type: Date,
    default: Date.now
  },
  health: {
    batteryPct: { type: Number, min: 0, max: 100, default: null },
    rssiAvg: { type: Number, default: null },
    errors: { type: Number, default: 0, min: 0 }
  },
  config: {
    txPower: { type: Number, default: null },
    beaconIntervalMs: { type: Number, default: null }
  }
}, {
  timestamps: true,
  collection: 'iot_tags'
});

// Índices para performance
TagSchema.index({ storeId: 1, type: 1 });
TagSchema.index({ storeId: 1, status: 1 });
TagSchema.index({ serial: 1 }, { unique: true });
TagSchema.index({ lastSeen: 1 });

export default mongoose.models.IotTag || mongoose.model('IotTag', TagSchema);
