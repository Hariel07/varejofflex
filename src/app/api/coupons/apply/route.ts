import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Coupon from "@/models/Coupon";
import CouponUsage from "@/models/CouponUsage";

export async function POST(req: NextRequest) {
  try {
    const {
      couponId,
      userId,
      userEmail,
      tenantId = "varejoflex",
      originalPrice,
      discountAmount,
      finalPrice,
      subscriptionPlan,
      subscriptionType = "monthly",
      category = "order"
    } = await req.json();

    if (!couponId || !userId || !userEmail || originalPrice === undefined || discountAmount === undefined || finalPrice === undefined) {
      return NextResponse.json({
        success: false,
        error: "Dados obrigatórios não fornecidos"
      }, { status: 400 });
    }

    await dbConnect();

    // Buscar o cupom
    const coupon = await Coupon.findById(couponId);
    if (!coupon) {
      return NextResponse.json({
        success: false,
        error: "Cupom não encontrado"
      }, { status: 404 });
    }

    // Verificar se o cupom ainda está válido
    const now = new Date();
    if (now < coupon.startsAt || now > coupon.endsAt || !coupon.active) {
      return NextResponse.json({
        success: false,
        error: "Cupom não está mais válido"
      }, { status: 400 });
    }

    // Para cupons de assinatura, verificar se o usuário já usou
    if (category === "subscription") {
      const existingUsage = await CouponUsage.findOne({
        couponId,
        userEmail,
        status: "active"
      });

      if (existingUsage) {
        return NextResponse.json({
          success: false,
          error: "Cupom já foi utilizado por este usuário"
        }, { status: 409 });
      }
    }

    // Calcular data de expiração do desconto
    let expiresAt = null;
    if (category === "subscription" && coupon.discountDuration > 0) {
      expiresAt = new Date();
      expiresAt.setMonth(expiresAt.getMonth() + coupon.discountDuration);
    }

    // Registrar o uso do cupom
    const couponUsage = new CouponUsage({
      couponId,
      userId,
      userEmail,
      tenantId,
      originalPrice,
      discountAmount,
      finalPrice,
      subscriptionPlan,
      subscriptionType,
      status: "active",
      appliedAt: now,
      expiresAt,
      metadata: {
        couponCode: coupon.code,
        couponTitle: coupon.title,
        category: category
      }
    });

    await couponUsage.save();

    // Incrementar contador de uso do cupom
    await Coupon.findByIdAndUpdate(couponId, {
      $inc: { usedCount: 1 }
    });

    // Se atingiu o limite máximo, desativar o cupom
    if (coupon.maxUses > 0 && (coupon.usedCount + 1) >= coupon.maxUses) {
      await Coupon.findByIdAndUpdate(couponId, {
        active: false
      });
    }

    return NextResponse.json({
      success: true,
      message: "Cupom aplicado com sucesso!",
      usage: {
        id: couponUsage._id,
        discountAmount,
        finalPrice,
        expiresAt,
        appliedAt: now
      }
    });

  } catch (error: any) {
    console.error("Erro ao aplicar cupom:", error);
    return NextResponse.json({
      success: false,
      error: "Erro interno do servidor"
    }, { status: 500 });
  }
}