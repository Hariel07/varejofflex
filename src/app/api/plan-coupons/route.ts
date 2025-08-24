import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { dbConnect } from '@/lib/db';
import PlanCoupon from '@/models/PlanCoupon';
import User from '@/models/User';

export async function GET() {
  try {
    await dbConnect();
    
    // Buscar cupons ativos ordenados
    const coupons = await PlanCoupon.find({ isActive: true })
      .sort({ createdAt: -1 })
      .lean();
    
    return NextResponse.json({ 
      success: true, 
      coupons 
    });
  } catch (error) {
    console.error('Erro ao buscar cupons:', error);
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: 'Não autorizado' },
        { status: 401 }
      );
    }

    await dbConnect();
    
    // Verificar se é owner
    const user = await User.findOne({ email: session.user.email });
    if (!user || (user.role !== 'owner' && user.role !== 'owner_saas')) {
      return NextResponse.json(
        { success: false, error: 'Acesso negado. Apenas owners podem gerenciar cupons.' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { 
      code, 
      name, 
      description, 
      discountType, 
      discountValue, 
      minAmount, 
      maxDiscount, 
      applicablePlans, 
      usageLimit, 
      validFrom, 
      validUntil, 
      isActive 
    } = body;

    // Validações básicas
    if (!code || !name || !discountType || !discountValue || !validFrom || !validUntil || !applicablePlans) {
      return NextResponse.json(
        { success: false, error: 'Dados obrigatórios não fornecidos' },
        { status: 400 }
      );
    }

    // Verificar se já existe um cupom com este código
    const existingCoupon = await PlanCoupon.findOne({ code: code.toUpperCase() });
    
    if (existingCoupon) {
      return NextResponse.json(
        { success: false, error: 'Já existe um cupom com este código' },
        { status: 400 }
      );
    }

    // Criar novo cupom
    const newCoupon = new PlanCoupon({
      code: code.toUpperCase(),
      name,
      description,
      discountType,
      discountValue,
      minAmount,
      maxDiscount,
      applicablePlans,
      usageLimit,
      validFrom: new Date(validFrom),
      validUntil: new Date(validUntil),
      isActive: isActive !== undefined ? isActive : true,
      createdBy: user._id
    });

    await newCoupon.save();

    return NextResponse.json({ 
      success: true, 
      coupon: newCoupon,
      message: 'Cupom criado com sucesso'
    });
  } catch (error) {
    console.error('Erro ao criar cupom:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: 'Não autorizado' },
        { status: 401 }
      );
    }

    await dbConnect();
    
    // Verificar se é owner
    const user = await User.findOne({ email: session.user.email });
    if (!user || (user.role !== 'owner' && user.role !== 'owner_saas')) {
      return NextResponse.json(
        { success: false, error: 'Acesso negado. Apenas owners podem gerenciar cupons.' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { 
      id,
      name, 
      description, 
      discountType, 
      discountValue, 
      minAmount, 
      maxDiscount, 
      applicablePlans, 
      usageLimit, 
      validFrom, 
      validUntil, 
      isActive 
    } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID do cupom não fornecido' },
        { status: 400 }
      );
    }

    // Atualizar cupom existente
    const updatedCoupon = await PlanCoupon.findByIdAndUpdate(
      id,
      {
        name,
        description,
        discountType,
        discountValue,
        minAmount,
        maxDiscount,
        applicablePlans,
        usageLimit,
        validFrom: validFrom ? new Date(validFrom) : undefined,
        validUntil: validUntil ? new Date(validUntil) : undefined,
        isActive
      },
      { new: true, runValidators: true }
    );

    if (!updatedCoupon) {
      return NextResponse.json(
        { success: false, error: 'Cupom não encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      coupon: updatedCoupon,
      message: 'Cupom atualizado com sucesso'
    });
  } catch (error) {
    console.error('Erro ao atualizar cupom:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: 'Não autorizado' },
        { status: 401 }
      );
    }

    await dbConnect();
    
    // Verificar se é owner
    const user = await User.findOne({ email: session.user.email });
    if (!user || (user.role !== 'owner' && user.role !== 'owner_saas')) {
      return NextResponse.json(
        { success: false, error: 'Acesso negado. Apenas owners podem gerenciar cupons.' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const couponId = searchParams.get('id');

    if (!couponId) {
      return NextResponse.json(
        { success: false, error: 'ID do cupom não fornecido' },
        { status: 400 }
      );
    }

    // Em vez de deletar, apenas desabilitar o cupom
    const updatedCoupon = await PlanCoupon.findByIdAndUpdate(
      couponId,
      { isActive: false },
      { new: true }
    );

    if (!updatedCoupon) {
      return NextResponse.json(
        { success: false, error: 'Cupom não encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Cupom desabilitado com sucesso'
    });
  } catch (error) {
    console.error('Erro ao deletar cupom:', error);
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}