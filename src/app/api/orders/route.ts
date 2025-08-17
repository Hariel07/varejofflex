import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Order from "@/models/Order";
import Coupon from "@/models/Coupon";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const body = await req.json();
    const { tenantId = "demo", items, customer, address, payment, couponCode, deliveryFee = 0 } = body;

    const subtotal = Number(items.reduce((s: number, it: any) => s + it.unitPrice * it.qty, 0).toFixed(2));
    let discount = 0;

    if (couponCode) {
      const c = await Coupon.findOne({ tenantId, code: couponCode.toUpperCase(), active: true });
      const now = new Date();
      if (c && now >= c.startsAt && now <= c.endsAt && (c.maxUses === 0 || c.usedCount < c.maxUses) && subtotal >= (c.minOrderTotal || 0)) {
        discount = c.type === "percent" ? Number((subtotal * (c.value / 100)).toFixed(2)) : Number(c.value.toFixed(2));
        // incremento otimista de uso (MVP). Futuro: transação/lock otimista
        await Coupon.updateOne({ _id: c._id }, { $inc: { usedCount: 1 } });
      }
    }

    const total = Number((subtotal - discount + deliveryFee).toFixed(2));
    const order = await Order.create({
      tenantId, items, customer, address,
      subtotal, discount, couponCode, deliveryFee, total,
      payment, status: "received",
    });

    return NextResponse.json({ id: order._id, total }, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
