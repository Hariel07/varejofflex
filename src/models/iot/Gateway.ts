import mongoose from 'mongoose';

const GatewaySchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true
  },
  storeId: {
    type: String,
    required: true,
    index: true
  },
  kind: {
    type: String,
    required: true,
    enum: ['esp32', 'rpi'],
    default: 'esp32'
  },
  pos: {
    x: { type: Number, required: true },
    y: { type: Number, required: true },
    zone: { type: String, required: true }
  },
  status: {
    type: String,
    required: true,
    enum: ['online', 'offline'],
    default: 'offline',
    index: true
  },
  lastSeen: {
    type: Date,
    default: Date.now
  },
  token: {
    type: String,
    required: true,
    unique: true
  },
  notes: {
    type: String,
    default: ""
  },
  calib: {
    zones: [{
      zoneId: { type: String, required: true },
      name: { type: String, required: true },
      rssiRef: [{
        gatewayId: { type: String, required: true },
        avg: { type: Number, required: true },
        std: { type: Number, required: true, min: 0 },
        weight: { type: Number, required: true, min: 0, max: 1 }
      }]
    }],
    portalThreshold: { type: Number, default: -60 },
    hysteresisDb: { type: Number, default: 6, min: 0 },
    smoothing: {
      window: { type: Number, default: 5, min: 1 }
    }
  }
}, {
  timestamps: true,
  collection: 'iot_gateways'
});

// Índices para performance
GatewaySchema.index({ storeId: 1, status: 1 });
GatewaySchema.index({ token: 1 }, { unique: true });
GatewaySchema.index({ lastSeen: 1 });

export default mongoose.models.IotGateway || mongoose.model('IotGateway', GatewaySchema);
