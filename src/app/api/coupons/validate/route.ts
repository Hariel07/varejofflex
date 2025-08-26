import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Coupon from "@/models/Coupon";
import CouponUsage from "@/models/CouponUsage";

export async function POST(req: NextRequest) {
  try {
    const { 
      tenantId = "varejoflex", 
      code, 
      orderSubtotal, 
      category = "order",
      subscriptionPlan,
      subscriptionType = "monthly",
      userEmail,
      userId 
    } = await req.json();

    if (!code) {
      return NextResponse.json({ 
        success: false,
        error: "Código do cupom é obrigatório" 
      }, { status: 400 });
    }

    // Para cupons de assinatura, precisamos de mais informações
    if (category === "subscription" && (!subscriptionPlan || !userEmail)) {
      return NextResponse.json({
        success: false,
        error: "Para cupons de assinatura, plano e email são obrigatórios"
      }, { status: 400 });
    }

    await dbConnect();
    
    const now = new Date();
    const coupon = await Coupon.findOne({ 
      tenantId, 
      code: code.toUpperCase(), 
      active: true,
      category: category 
    });

    console.log("Debug cupom encontrado:", {
      code: code.toUpperCase(),
      category,
      couponFound: !!coupon,
      couponData: coupon ? {
        code: coupon.code,
        category: coupon.category,
        subscriptionPlan: coupon.subscriptionPlan,
        active: coupon.active
      } : null
    });

    if (!coupon) {
      return NextResponse.json({ 
        success: false,
        valid: false, 
        error: "Cupom não encontrado ou inválido para esta categoria" 
      });
    }

    // Validações temporais
    if (now < coupon.startsAt || now > coupon.endsAt) {
      return NextResponse.json({ 
        success: false,
        valid: false, 
        error: "Cupom expirado ou ainda não ativo" 
      });
    }

    // Validação de limite de usos
    if (coupon.maxUses > 0 && coupon.usedCount >= coupon.maxUses) {
      return NextResponse.json({ 
        success: false,
        valid: false, 
        error: "Limite de usos do cupom atingido" 
      });
    }

    // Para cupons de assinatura, verificar se o plano corresponde
    // Se coupon.subscriptionPlan é null/undefined, o cupom é válido para todos os planos
    if (category === "subscription" && coupon.subscriptionPlan && coupon.subscriptionPlan !== subscriptionPlan) {
      console.log("Debug validação de plano:", {
        couponPlan: coupon.subscriptionPlan,
        requestedPlan: subscriptionPlan,
        match: coupon.subscriptionPlan === subscriptionPlan,
        isForAllPlans: !coupon.subscriptionPlan
      });
      return NextResponse.json({
        success: false,
        valid: false,
        error: `Este cupom é válido apenas para o plano ${coupon.subscriptionPlan.toUpperCase()}`
      });
    }

    // Para cupons de pedido, validar valor mínimo
    if (category === "order" && orderSubtotal && orderSubtotal < coupon.minOrderTotal) {
      return NextResponse.json({ 
        success: false,
        valid: false, 
        error: `Valor mínimo do pedido: R$ ${coupon.minOrderTotal.toFixed(2)}` 
      });
    }

    // Verificar se o usuário já usou este cupom (apenas para cupons de assinatura)
    if (category === "subscription" && userEmail) {
      const existingUsage = await CouponUsage.findOne({
        couponId: coupon._id,
        userEmail,
        status: "active"
      });

      if (existingUsage) {
        return NextResponse.json({
          success: false,
          valid: false,
          error: "Você já utilizou este cupom"
        });
      }
    }

    // Calcular desconto baseado no tipo de cupom
    let discount = 0;
    let finalPrice = 0;
    let trialDays = 0;

    if (category === "order" && orderSubtotal) {
      // Cupons para pedidos
      discount = coupon.type === "percent"
        ? Number((orderSubtotal * (coupon.value / 100)).toFixed(2))
        : Number(coupon.value.toFixed(2));
      
      finalPrice = Math.max(0, orderSubtotal - discount);
    }
    else if (category === "subscription") {
      // Cupons para assinaturas
      const subscriptionPrices = {
        basic: { monthly: 49, annual: 490, weekly: 15 },
        pro: { monthly: 149, annual: 1490, weekly: 45 },
        ultra: { monthly: 299, annual: 2990, weekly: 85 }
      };

      const originalPrice = subscriptionPrices[subscriptionPlan as keyof typeof subscriptionPrices]?.[subscriptionType as keyof typeof subscriptionPrices.basic] || 0;

      if (coupon.type === "free_trial") {
        discount = originalPrice;
        finalPrice = 0;
        trialDays = coupon.freeTrialDays;
      } else if (coupon.type === "percent") {
        discount = Number((originalPrice * (coupon.value / 100)).toFixed(2));
        finalPrice = Math.max(0, originalPrice - discount);
      } else if (coupon.type === "amount") {
        discount = Number(coupon.value.toFixed(2));
        finalPrice = Math.max(0, originalPrice - discount);
      } else if (coupon.type === "subscription_discount") {
        discount = Number((originalPrice * (coupon.value / 100)).toFixed(2));
        finalPrice = Math.max(0, originalPrice - discount);
      }

      return NextResponse.json({ 
        success: true,
        valid: true, 
        coupon: {
          id: coupon._id,
          code: coupon.code,
          title: coupon.title,
          description: coupon.description,
          type: coupon.type,
          category: coupon.category,
          value: coupon.value,
          discountDuration: coupon.discountDuration,
          freeTrialDays: coupon.freeTrialDays
        },
        discount, 
        finalPrice,
        trialDays,
        originalPrice
      });
    }  } catch (error: any) {
    console.error("Erro ao validar cupom:", error);
    return NextResponse.json({ 
      success: false,
      error: "Erro interno do servidor" 
    }, { status: 500 });
  }
}
