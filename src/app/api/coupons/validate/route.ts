import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Coupon from "@/models/Coupon";

export async function POST(req: NextRequest) {
  try {
    const { tenantId = "demo", code, orderSubtotal } = await req.json();
    if (!code || typeof orderSubtotal !== "number") {
      return NextResponse.json({ error: "Parâmetros inválidos" }, { status: 400 });
    }
    await dbConnect();
    const now = new Date();
    const coupon = await Coupon.findOne({ tenantId, code: code.toUpperCase(), active: true });
    if (!coupon) return NextResponse.json({ valid: false, reason: "not_found" });
    if (now < coupon.startsAt || now > coupon.endsAt) return NextResponse.json({ valid: false, reason: "expired" });
    if (coupon.maxUses > 0 && coupon.usedCount >= coupon.maxUses) return NextResponse.json({ valid: false, reason: "limit_reached" });
    if (orderSubtotal < coupon.minOrderTotal) return NextResponse.json({ valid: false, reason: "min_total" });

    const discount =
      coupon.type === "percent"
        ? Number((orderSubtotal * (coupon.value / 100)).toFixed(2))
        : Number(coupon.value.toFixed(2));

    return NextResponse.json({ valid: true, discount, type: coupon.type, value: coupon.value, code: coupon.code });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
