import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PlanType, getAddOnLimit, checkAddOnQuota, ADD_ON_INFO } from '@/lib/planMatrix';

// Simulação de dados de uso de add-ons (em produção, viria do banco de dados)
const mockAddOnUsage: Record<string, number> = {
  'pdv_extra': 2,
  'kds': 1,
  'sensor_movimento': 5,
  'chatbot_whatsapp': 1,
  'armazenamento_extra': 3,
  'relatorio_avancado': 1
};

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const addOnId = searchParams.get('addOnId');
    
    // Para demonstração, vamos simular que o usuário tem plano "profissional"
    // Em produção, isso viria do banco de dados baseado no usuário da sessão
    const userPlan: PlanType = 'profissional';

    if (addOnId) {
      // Retornar informações específicas de um add-on
      const usage = mockAddOnUsage[addOnId] || 0;
      const limit = getAddOnLimit(userPlan, addOnId);
      const quotaCheck = checkAddOnQuota(userPlan, addOnId, usage);
      
      // Verificar se add-on existe
      const addOnKeys = Object.keys(ADD_ON_INFO);
      const addOnExists = addOnKeys.some(key => key.replace('-', '_') === addOnId);

      if (!addOnExists) {
        return NextResponse.json({ error: 'Add-on não encontrado' }, { status: 404 });
      }

      return NextResponse.json({
        addOnId,
        userPlan,
        usage,
        limit,
        quotaCheck,
        canSubscribe: quotaCheck.canAdd && (limit?.available || false)
      });
    } else {
      // Retornar informações de todos os add-ons
      const allAddOns = Object.keys(ADD_ON_INFO).map(addOnKey => {
        const addOnId = addOnKey.replace('-', '_'); // Converter para formato usado no mock
        const usage = mockAddOnUsage[addOnId] || 0;
        const limit = getAddOnLimit(userPlan, addOnKey);
        const quotaCheck = checkAddOnQuota(userPlan, addOnKey, usage);

        return {
          addOnId: addOnKey,
          usage,
          limit,
          quotaCheck,
          canSubscribe: quotaCheck.canAdd && (limit?.available || false)
        };
      });

      return NextResponse.json({
        userPlan,
        addOns: allAddOns
      });
    }
  } catch (error) {
    console.error('Erro ao validar add-ons:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const { addOnId, action } = await request.json();

    if (!addOnId || !action) {
      return NextResponse.json(
        { error: 'addOnId e action são obrigatórios' },
        { status: 400 }
      );
    }

    // Para demonstração, vamos simular que o usuário tem plano "profissional"
    const userPlan: PlanType = 'profissional';
    const currentUsage = mockAddOnUsage[addOnId] || 0;

    if (action === 'subscribe') {
      // Validar se o usuário pode contratar o add-on
      const limit = getAddOnLimit(userPlan, addOnId);
      const quotaCheck = checkAddOnQuota(userPlan, addOnId, currentUsage);

      if (!limit || !limit.available) {
        return NextResponse.json({
          success: false,
          error: 'Add-on não disponível no seu plano',
          upgradeRequired: limit?.upgradeRequired
        }, { status: 403 });
      }

      if (!quotaCheck.canAdd) {
        return NextResponse.json({
          success: false,
          error: quotaCheck.message || 'Limite atingido para este add-on',
          limit: limit.maxQuantity,
          currentUsage
        }, { status: 403 });
      }

      // Simular contratação bem-sucedida
      // Em produção, aqui criaria registro no banco de dados
      
      return NextResponse.json({
        success: true,
        message: 'Add-on contratado com sucesso!',
        addOnId,
        newUsage: currentUsage + 1
      });

    } else if (action === 'unsubscribe') {
      // Simular cancelamento
      if (currentUsage <= 0) {
        return NextResponse.json({
          success: false,
          error: 'Este add-on não está ativo'
        }, { status: 400 });
      }

      return NextResponse.json({
        success: true,
        message: 'Add-on cancelado com sucesso!',
        addOnId,
        newUsage: Math.max(0, currentUsage - 1)
      });

    } else {
      return NextResponse.json(
        { error: 'Ação inválida. Use "subscribe" ou "unsubscribe"' },
        { status: 400 }
      );
    }

  } catch (error) {
    console.error('Erro ao processar add-on:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}