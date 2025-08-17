import { Schema, model, models } from "mongoose";

const OrderItem = new Schema({
  productId: String,
  name: String,
  qty: Number,
  unitPrice: Number,
  total: Number,
});

const OrderSchema = new Schema(
  {
    tenantId: { type: String, required: true },
    customer: {
      name: String,
      email: String,
      phone: String,
      cpf: String,
    },
    address: {
      street: String, number: String, district: String,
      city: String, zip: String, complement: String,
      lat: Number, lng: Number, // futuro: mapinha
    },
    items: [OrderItem],
    subtotal: Number,
    discount: Number,
    couponCode: String,
    deliveryFee: { type: Number, default: 0 },
    total: Number,
    payment: {
      method: { type: String, enum: ["pix","debit","credit","cash"], required: true },
      changeFor: Number, // dinheiro
      status: { type: String, enum: ["pending","paid","failed","refunded"], default: "pending" },
      txId: String,
    },
    status: { type: String, enum: ["received","preparing","ready","dispatched","delivered","cancelled"], default: "received" },
  },
  { timestamps: true }
);

OrderSchema.index({ tenantId: 1, createdAt: -1 });
export default models.Order || model("Order", OrderSchema);
