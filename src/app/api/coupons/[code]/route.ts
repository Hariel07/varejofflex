import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Coupon from "@/models/Coupon";

export async function GET(req: NextRequest, { params }: { params: { code: string } }) {
  try {
    await dbConnect();
    
    const coupon = await Coupon.findOne({ 
      tenantId: "varejoflex",
      code: params.code.toUpperCase()
    });

    if (!coupon) {
      return NextResponse.json({ 
        success: false,
        error: "Cupom não encontrado" 
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      coupon: {
        id: coupon._id,
        code: coupon.code,
        title: coupon.title,
        description: coupon.description,
        type: coupon.type,
        category: coupon.category,
        value: coupon.value,
        subscriptionPlan: coupon.subscriptionPlan,
        discountDuration: coupon.discountDuration,
        freeTrialDays: coupon.freeTrialDays,
        startsAt: coupon.startsAt,
        endsAt: coupon.endsAt,
        maxUses: coupon.maxUses,
        usedCount: coupon.usedCount,
        active: coupon.active,
        createdAt: coupon.createdAt
      }
    });

  } catch (error: any) {
    console.error("Erro ao buscar cupom:", error);
    return NextResponse.json({
      success: false,
      error: "Erro interno do servidor"
    }, { status: 500 });
  }
}