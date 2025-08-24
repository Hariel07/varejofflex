import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Coupon from "@/models/Coupon";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const {
      code,
      type,
      category,
      value,
      subscriptionPlan,
      discountDuration,
      freeTrialDays,
      startsAt,
      endsAt,
      maxUses,
      minOrderTotal,
      title,
      description,
      createdBy,
      tenantId = "varejoflex"
    } = data;

    // Validações básicas
    if (!code || !type || !category || !title || !description || !createdBy) {
      return NextResponse.json({
        success: false,
        error: "Campos obrigatórios não preenchidos"
      }, { status: 400 });
    }

    // Validações específicas para cupons de assinatura
    if (category === "subscription" && !subscriptionPlan) {
      return NextResponse.json({
        success: false,
        error: "Plano de assinatura é obrigatório para cupons de assinatura"
      }, { status: 400 });
    }

    // Validação de tipo free_trial
    if (type === "free_trial" && (!freeTrialDays || freeTrialDays <= 0)) {
      return NextResponse.json({
        success: false,
        error: "Dias de trial gratuito devem ser especificados para cupons de trial"
      }, { status: 400 });
    }

    await dbConnect();

    // Verificar se já existe um cupom com este código
    const existingCoupon = await Coupon.findOne({
      tenantId,
      code: code.toUpperCase()
    });

    if (existingCoupon) {
      return NextResponse.json({
        success: false,
        error: "Já existe um cupom com este código"
      }, { status: 409 });
    }

    // Criar o cupom
    const coupon = new Coupon({
      tenantId,
      code: code.toUpperCase(),
      type,
      category,
      value: parseFloat(value),
      subscriptionPlan: category === "subscription" ? subscriptionPlan : undefined,
      discountDuration: discountDuration || 1,
      freeTrialDays: freeTrialDays || 0,
      startsAt: new Date(startsAt),
      endsAt: new Date(endsAt),
      maxUses: parseInt(maxUses) || 0,
      minOrderTotal: parseFloat(minOrderTotal) || 0,
      title,
      description,
      createdBy,
      active: true
    });

    await coupon.save();

    return NextResponse.json({
      success: true,
      message: "Cupom criado com sucesso!",
      coupon: {
        id: coupon._id,
        code: coupon.code,
        title: coupon.title,
        type: coupon.type,
        category: coupon.category,
        value: coupon.value
      }
    });

  } catch (error: any) {
    console.error("Erro ao criar cupom:", error);
    return NextResponse.json({
      success: false,
      error: "Erro interno do servidor"
    }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const tenantId = searchParams.get("tenantId") || "varejoflex";
    const category = searchParams.get("category");
    const active = searchParams.get("active");

    await dbConnect();

    // Construir filtros
    const filters: any = { tenantId };
    
    if (category) {
      filters.category = category;
    }
    
    if (active !== null && active !== undefined) {
      filters.active = active === "true";
    }

    const coupons = await Coupon.find(filters)
      .sort({ createdAt: -1 })
      .select('-__v');

    return NextResponse.json({
      success: true,
      coupons: coupons.map(coupon => ({
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
      }))
    });

  } catch (error: any) {
    console.error("Erro ao buscar cupons:", error);
    return NextResponse.json({
      success: false,
      error: "Erro interno do servidor"
    }, { status: 500 });
  }
}
