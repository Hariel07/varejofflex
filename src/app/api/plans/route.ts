import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { dbConnect } from '@/lib/db';
import Plan from '@/models/Plan';
import User from '@/models/User';

export async function GET() {
  try {
    await dbConnect();
    
    // Buscar planos ativos ordenados
    const plans = await Plan.find({ enabled: true })
      .sort({ order: 1, planId: 1 })
      .lean();
    
    return NextResponse.json({ 
      success: true, 
      plans 
    });
  } catch (error) {
    console.error('Erro ao buscar planos:', error);
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
        { success: false, error: 'Acesso negado. Apenas owners podem gerenciar planos.' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { planId, name, description, features, pricing, color, popular, enabled, trialDays, order } = body;

    // Validações básicas
    if (!planId || !name || !description || !features || !pricing) {
      return NextResponse.json(
        { success: false, error: 'Dados obrigatórios não fornecidos' },
        { status: 400 }
      );
    }

    // Verificar se já existe um plano com este planId
    const existingPlan = await Plan.findOne({ planId });
    
    if (existingPlan) {
      // Atualizar plano existente
      const updatedPlan = await Plan.findOneAndUpdate(
        { planId },
        {
          name,
          description,
          features,
          pricing,
          color: color || '#0d6efd',
          popular: popular || false,
          enabled: enabled !== undefined ? enabled : true,
          trialDays: trialDays || 14,
          order: order || 0,
          updatedBy: user._id
        },
        { new: true }
      );

      return NextResponse.json({ 
        success: true, 
        plan: updatedPlan,
        message: 'Plano atualizado com sucesso'
      });
    } else {
      // Criar novo plano
      const newPlan = new Plan({
        planId,
        name,
        description,
        features,
        pricing,
        color: color || '#0d6efd',
        popular: popular || false,
        enabled: enabled !== undefined ? enabled : true,
        trialDays: trialDays || 14,
        order: order || 0,
        updatedBy: user._id
      });

      await newPlan.save();

      return NextResponse.json({ 
        success: true, 
        plan: newPlan,
        message: 'Plano criado com sucesso'
      });
    }
  } catch (error) {
    console.error('Erro ao salvar plano:', error);
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
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
        { success: false, error: 'Acesso negado. Apenas owners podem gerenciar planos.' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const planId = searchParams.get('planId');

    if (!planId) {
      return NextResponse.json(
        { success: false, error: 'ID do plano não fornecido' },
        { status: 400 }
      );
    }

    // Em vez de deletar, apenas desabilitar o plano
    const updatedPlan = await Plan.findOneAndUpdate(
      { planId },
      { 
        enabled: false,
        updatedBy: user._id
      },
      { new: true }
    );

    if (!updatedPlan) {
      return NextResponse.json(
        { success: false, error: 'Plano não encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Plano desabilitado com sucesso'
    });
  } catch (error) {
    console.error('Erro ao deletar plano:', error);
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}