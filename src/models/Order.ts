import { Schema, model, models, Types } from "mongoose";

export interface IOrderItem {
  productId: string;
  name: string;
  qty: number;
  unitPrice: number;
  total: number;
}

export interface IOrder {
  _id: Types.ObjectId;
  companyId: Types.ObjectId;    // referência para Company
  tenantId?: string;            // mantido para compatibilidade
  customer: {
    name?: string;
    email?: string;
    phone?: string;
    cpf?: string;
  };
  address?: {
    street?: string;
    number?: string;
    district?: string;
    city?: string;
    zip?: string;
    complement?: string;
    lat?: number;
    lng?: number;
  };
  items: IOrderItem[];
  subtotal: number;
  discount: number;
  couponCode?: string;
  deliveryFee: number;
  total: number;
  payment: {
    method: "pix" | "debit" | "credit" | "cash";
    changeFor?: number;
    status: "pending" | "paid" | "failed" | "refunded";
    txId?: string;
  };
  status: "received" | "preparing" | "ready" | "dispatched" | "delivered" | "cancelled";
  createdAt: Date;
  updatedAt: Date;
}

const OrderItem = new Schema<IOrderItem>({
  productId: String,
  name: String,
  qty: Number,
  unitPrice: Number,
  total: Number,
});

const OrderSchema = new Schema<IOrder>(
  {
    companyId: { type: Schema.Types.ObjectId, ref: "Company", required: true },
    tenantId: { type: String }, // mantido para compatibilidade
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

OrderSchema.index({ companyId: 1, createdAt: -1 });
OrderSchema.index({ tenantId: 1, createdAt: -1 }); // mantido para compatibilidade
OrderSchema.index({ status: 1 });
OrderSchema.index({ "payment.status": 1 });

export default models.Order || model<IOrder>("Order", OrderSchema);
