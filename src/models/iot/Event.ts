import mongoose from 'mongoose';

const EventSchema = new mongoose.Schema({
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
  type: {
    type: String,
    required: true,
    enum: [
      'theft_suspect',
      'temp_alert', 
      'tag_health',
      'checkout_pass',
      'gateway_offline',
      'nonfiscal_label_printed',
      'battery_low',
      'tag_lost',
      'calibration_complete'
    ],
    index: true
  },
  severity: {
    type: String,
    required: true,
    enum: ['info', 'warn', 'critical'],
    default: 'info',
    index: true
  },
  context: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  resolved: {
    type: Boolean,
    default: false,
    index: true
  },
  resolvedAt: {
    type: Date,
    default: null
  },
  resolvedBy: {
    type: String,
    default: null
  }
}, {
  timestamps: false, // Usando ts customizado
  collection: 'iot_events'
});

// Índices compostos para dashboard e alertas
EventSchema.index({ storeId: 1, ts: -1 });
EventSchema.index({ storeId: 1, type: 1, ts: -1 });
EventSchema.index({ storeId: 1, severity: 1, resolved: 1 });
EventSchema.index({ ts: 1 }, { expireAfterSeconds: 60 * 60 * 24 * 90 }); // TTL 90 dias

export default mongoose.models.IotEvent || mongoose.model('IotEvent', EventSchema);