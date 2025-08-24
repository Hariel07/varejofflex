import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/db';
import Plan from '@/models/Plan';
import User from '@/models/User';

const DEFAULT_PLANS = [
  {
    planId: 'basico',
    name: 'Básico',
    description: 'Ideal para pequenos negócios que estão começando',
    features: [
      'Até 100 produtos',
      '1 usuário',
      'PDV básico',
      'Relatórios essenciais',
      'Suporte por email'
    ],
    pricing: {
      weekly: {
        price: 22,
        enabled: true,
        discount: 0
      },
      monthly: {
        price: 89,
        enabled: true,
        discount: 0
      },
      annual: {
        price: 890,
        enabled: true,
        discount: 17
      }
    },
    color: '#0d6efd',
    popular: false,
    enabled: true,
    trialDays: 14,
    order: 1
  },
  {
    planId: 'profissional',
    name: 'Profissional',
    description: 'Para negócios em crescimento que precisam de mais recursos',
    features: [
      'Até 1.000 produtos',
      '5 usuários',
      'PDV completo',
      'Relatórios avançados',
      'Gestão de estoque',
      'Suporte prioritário'
    ],
    pricing: {
      weekly: {
        price: 47,
        enabled: true,
        discount: 0
      },
      monthly: {
        price: 189,
        enabled: true,
        discount: 0
      },
      annual: {
        price: 1890,
        enabled: true,
        discount: 17
      }
    },
    color: '#0d6efd',
    popular: true,
    enabled: true,
    trialDays: 14,
    order: 2
  },
  {
    planId: 'empresarial',
    name: 'Empresarial',
    description: 'Solução completa para grandes empresas e redes',
    features: [
      'Produtos ilimitados',
      'Usuários ilimitados',
      'Multi-loja',
      'BI e Analytics',
      'API completa',
      'Suporte 24/7'
    ],
    pricing: {
      weekly: {
        price: 97,
        enabled: true,
        discount: 0
      },
      monthly: {
        price: 389,
        enabled: true,
        discount: 0
      },
      annual: {
        price: 3890,
        enabled: true,
        discount: 17
      }
    },
    color: '#198754',
    popular: false,
    enabled: true,
    trialDays: 14,
    order: 3
  }
];

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
    if (!user || user.role !== 'owner') {
      return NextResponse.json(
        { success: false, error: 'Acesso negado. Apenas owners podem inicializar planos.' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { force = false } = body;

    // Verificar se já existem planos (a menos que force seja true)
    if (!force) {
      const existingPlans = await Plan.countDocuments();
      if (existingPlans > 0) {
        return NextResponse.json({
          success: false,
          error: 'Planos já existem. Use force: true para recriar.'
        }, { status: 400 });
      }
    }

    // Se force for true, limpar planos existentes
    if (force) {
      await Plan.deleteMany({});
    }

    // Criar planos padrão
    const createdPlans = [];
    for (const planData of DEFAULT_PLANS) {
      const plan = new Plan({
        ...planData,
        updatedBy: user._id
      });
      await plan.save();
      createdPlans.push(plan);
    }

    return NextResponse.json({
      success: true,
      message: `${createdPlans.length} planos inicializados com sucesso`,
      plans: createdPlans
    });
  } catch (error) {
    console.error('Erro ao inicializar planos:', error);
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}