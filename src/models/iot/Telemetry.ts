import mongoose from 'mongoose';

const TelemetrySchema = new mongoose.Schema({
  ts: {
    type: Date,
    required: true,
    default: Date.now,
    index: true
  },
  storeId: {
    type: String,
    required: true,
    index: true
  },
  source: {
    type: String,
    required: true,
    ref: 'IotGateway'
  },
  tagId: {
    type: String,
    required: true,
    ref: 'IotTag'
  },
  metric: {
    type: String,
    required: true,
    enum: ['rssi', 'temp', 'gps', 'weight', 'battery'],
    index: true
  },
  value: {
    type: Number,
    required: true
  },
  unit: {
    type: String,
    required: true,
    enum: ['dBm', 'C', 'F', 'deg', 'kg', 'g', 'pct', 'V']
  },
  extra: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
}, {
  timestamps: false, // Usando ts customizado
  collection: 'iot_telemetry'
});

// Índices compostos para queries eficientes
TelemetrySchema.index({ storeId: 1, ts: -1 });
TelemetrySchema.index({ storeId: 1, tagId: 1, ts: -1 });
TelemetrySchema.index({ storeId: 1, metric: 1, ts: -1 });
TelemetrySchema.index({ ts: 1 }, { expireAfterSeconds: 60 * 60 * 24 * 30 }); // TTL 30 dias

export default mongoose.models.IotTelemetry || mongoose.model('IotTelemetry', TelemetrySchema);
