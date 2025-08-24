import mongoose from 'mongoose';

const LogSchema = new mongoose.Schema({
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
  actor: {
    userId: { type: String, required: true },
    role: { type: String, required: true }
  },
  action: {
    type: String,
    required: true,
    enum: ['create', 'update', 'delete', 'import', 'export', 'calibrate', 'provision'],
    index: true
  },
  entity: {
    type: String,
    required: true,
    enum: ['product', 'tag', 'gateway', 'config', 'event', 'kit'],
    index: true
  },
  entityId: {
    type: String,
    required: true
  },
  before: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  after: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  notes: {
    type: String,
    default: ""
  },
  ip: {
    type: String,
    default: ""
  },
  userAgent: {
    type: String,
    default: ""
  }
}, {
  timestamps: false, // Usando ts customizado
  collection: 'iot_logs'
});

// Índices para auditoria
LogSchema.index({ storeId: 1, ts: -1 });
LogSchema.index({ storeId: 1, "actor.userId": 1, ts: -1 });
LogSchema.index({ storeId: 1, action: 1, ts: -1 });
LogSchema.index({ storeId: 1, entity: 1, entityId: 1, ts: -1 });

export default mongoose.models.IotLog || mongoose.model('IotLog', LogSchema);
