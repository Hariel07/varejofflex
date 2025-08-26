import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import PlanCoupon from "@/models/PlanCoupon";

export async function POST(req: NextRequest) {
  try {
    const { code, planId, billingCycle, amount } = await req.json();

    if (!code) {
      return NextResponse.json({ 
        success: false,
        error: "Código do cupom é obrigatório" 
      }, { status: 400 });
    }

    await dbConnect();
    
    const now = new Date();
    const coupon = await PlanCoupon.findOne({ 
      code: code.toUpperCase(), 
      isActive: true
    });

    console.log("Debug plan-coupon encontrado:", {
      code: code.toUpperCase(),
      couponFound: !!coupon,
      couponData: coupon ? {
        code: coupon.code,
        applicablePlans: coupon.applicablePlans,
        isActive: coupon.isActive,
        validFrom: coupon.validFrom,
        validUntil: coupon.validUntil
      } : null
    });

    if (!coupon) {
      return NextResponse.json({ 
        success: false,
        valid: false, 
        error: "Cupom não encontrado" 
      });
    }

    // Validações temporais
    if (now < coupon.validFrom || now > coupon.validUntil) {
      return NextResponse.json({ 
        success: false,
        valid: false, 
        error: "Cupom expirado ou ainda não ativo" 
      });
    }

    // Validação de limite de usos
    if (coupon.usageLimit && coupon.usageLimit > 0 && coupon.usedCount >= coupon.usageLimit) {
      return NextResponse.json({ 
        success: false,
        valid: false, 
        error: "Limite de usos do cupom atingido" 
      });
    }

    // Verificar se o plano é aplicável (se não for '*' para todos os planos)
    if (!coupon.applicablePlans.includes('*') && !coupon.applicablePlans.includes(planId)) {
      return NextResponse.json({
        success: false,
        valid: false,
        error: `Este cupom não é válido para o plano ${planId}`
      });
    }

    // Verificar valor mínimo
    if (coupon.minAmount && amount < coupon.minAmount) {
      return NextResponse.json({ 
        success: false,
        valid: false, 
        error: `Valor mínimo: R$ ${coupon.minAmount.toFixed(2)}` 
      });
    }

    // Calcular desconto
    let discount = 0;
    let finalPrice = amount;

    if (coupon.discountType === 'percentage') {
      discount = Number((amount * (coupon.discountValue / 100)).toFixed(2));
      if (coupon.maxDiscount && discount > coupon.maxDiscount) {
        discount = coupon.maxDiscount;
      }
    } else {
      discount = Number(coupon.discountValue.toFixed(2));
    }

    finalPrice = Math.max(0, amount - discount);

    return NextResponse.json({ 
      success: true,
      valid: true, 
      coupon: {
        id: coupon._id,
        code: coupon.code,
        name: coupon.name,
        description: coupon.description,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue
      },
      discount, 
      finalPrice,
      originalPrice: amount
    });

  } catch (error: any) {
    console.error("Erro ao validar cupom plan-coupon:", error);
    return NextResponse.json({ 
      success: false,
      error: "Erro interno do servidor" 
    }, { status: 500 });
  }
}