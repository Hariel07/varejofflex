import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { dbConnect } from '@/lib/db';
import User from '@/models/User';
import Company from '@/models/Company';
import Plan from '@/models/Plan';
import Coupon from '@/models/Coupon';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    let results = {
      companies: 0,
      logistas: 0,
      clients: 0,
      plans: 0,
      coupons: 0
    };

    // 1. CRIAR SUA CONTA PROFISSIONAL (se não existir)
    const professionalEmail = 'hariel.developer@gmail.com';
    let professionalUser = await User.findOne({ email: professionalEmail });
    
    if (!professionalUser) {
      const passwordHash = await bcrypt.hash('minhasenha123', 12);
      professionalUser = await User.create({
        name: 'Hariel - Developer',
        email: professionalEmail,
        passwordHash,
        role: 'owner_saas',
        userType: 'owner_saas',
        isActive: true,
        permissions: ['*'], // Acesso total
        createdAt: new Date(),
      });
      console.log('✅ Conta profissional criada:', professionalEmail);
    } else {
      console.log('✅ Conta profissional já existe:', professionalEmail);
    }

    // 2. CRIAR PLANOS (se não existirem)
    const plansData = [
      {
        planId: 'basico',
        name: 'Plano Básico',
        description: 'Ideal para pequenos negócios',
        features: ['Até 100 produtos', 'PDV básico', 'Relatórios simples'],
        pricing: {
          weekly: { price: 19.90, enabled: true },
          monthly: { price: 59.90, enabled: true, discount: 10 },
          annual: { price: 599.90, enabled: true, discount: 25 }
        },
        color: '#28a745',
        popular: false,
        enabled: true,
        trialDays: 14,
        order: 1
      },
      {
        planId: 'profissional',
        name: 'Plano Profissional',
        description: 'Para negócios em crescimento',
        features: ['Produtos ilimitados', 'PDV avançado', 'Relatórios completos', 'Integração fiscal'],
        pricing: {
          weekly: { price: 39.90, enabled: true },
          monthly: { price: 119.90, enabled: true, discount: 15 },
          annual: { price: 1199.90, enabled: true, discount: 30 }
        },
        color: '#007bff',
        popular: true,
        enabled: true,
        trialDays: 14,
        order: 2
      },
      {
        planId: 'empresarial',
        name: 'Plano Empresarial',
        description: 'Para grandes operações',
        features: ['Tudo ilimitado', 'Multi-lojas', 'API completa', 'Suporte prioritário'],
        pricing: {
          weekly: { price: 79.90, enabled: true },
          monthly: { price: 239.90, enabled: true, discount: 20 },
          annual: { price: 2399.90, enabled: true, discount: 35 }
        },
        color: '#6f42c1',
        popular: false,
        enabled: true,
        trialDays: 14,
        order: 3
      }
    ];

    for (const planData of plansData) {
      const existingPlan = await Plan.findOne({ planId: planData.planId });
      if (!existingPlan) {
        await Plan.create(planData);
        results.plans++;
        console.log(`✅ Plano criado: ${planData.name}`);
      }
    }

    // 3. CRIAR CUPOM DE 100% PARA ACESSO GRÁTIS
    const freeCouponCode = 'TESTE100';
    let freeCoupon = await Coupon.findOne({ code: freeCouponCode, category: 'subscription' });
    
    if (!freeCoupon) {
      freeCoupon = await Coupon.create({
        tenantId: 'GLOBAL', // Cupom global
        code: freeCouponCode,
        type: 'percent',
        category: 'subscription',
        value: 100, // 100% de desconto
        title: 'Acesso Gratuito Completo',
        description: 'Cupom de teste para acesso gratuito completo a todos os planos',
        subscriptionPlan: 'pro', // Plano profissional
        discountDuration: 12, // 12 meses de desconto
        startsAt: new Date(),
        endsAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // Válido por 1 ano
        maxUses: 1000, // Limite alto para testes
        usedCount: 0,
        minOrderTotal: 0,
        active: true,
        createdBy: 'SYSTEM_SEED',
        createdAt: new Date()
      });
      results.coupons++;
      console.log(`✅ Cupom de 100% criado: ${freeCouponCode}`);
    }

    // 4. CRIAR EMPRESAS FICTÍCIAS COM LOGISTAS
    const companiesData = [
      {
        name: 'Lanchonete do João - TESTE',
        email: 'joao.lanchonete@teste.com',
        segment: 'lanchonete',
        planId: 'basico',
        logistName: 'João Silva - TESTE',
        logistEmail: 'joao.teste@varejoflex.com'
      },
      {
        name: 'Pizzaria Bella Vista - TESTE',
        email: 'bella.pizzaria@teste.com', 
        segment: 'pizzaria',
        planId: 'profissional',
        logistName: 'Maria Santos - TESTE',
        logistEmail: 'maria.teste@varejoflex.com'
      },
      {
        name: 'Mercado Central - TESTE',
        email: 'central.mercado@teste.com',
        segment: 'mercado', 
        planId: 'empresarial',
        logistName: 'Carlos Oliveira - TESTE',
        logistEmail: 'carlos.teste@varejoflex.com'
      }
    ];

    for (const companyData of companiesData) {
      // Verificar se empresa já existe
      let company = await Company.findOne({ email: companyData.email });
      
      if (!company) {
        // Criar empresa
        company = await Company.create({
          name: companyData.name,
          personType: 'PJ',
          documentType: 'CNPJ',
          documentNumber: `12345678000${results.companies + 10}`, // CNPJ fake único
          email: companyData.email,
          segment: companyData.segment,
          planType: 'premium', // Sempre premium para teste
          planExpiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 ano
          isActive: true,
          settings: {
            currency: 'BRL',
            timezone: 'America/Sao_Paulo',
            language: 'pt-BR',
            couponApplied: freeCouponCode
          },
          createdAt: new Date()
        });
        results.companies++;
        console.log(`✅ Empresa criada: ${company.name}`);
      }

      // Verificar se logista já existe
      let logist = await User.findOne({ email: companyData.logistEmail });
      
      if (!logist) {
        // Criar logista
        const passwordHash = await bcrypt.hash('senha123', 12);
        
        // Log para debug
        console.log(`Criando logista: ${companyData.logistName} - ${companyData.logistEmail}`);
        
        logist = await User.create({
          name: companyData.logistName,
          email: companyData.logistEmail,
          passwordHash,
          role: 'logista',
          userType: 'lojista',
          companyId: company._id,
          isActive: true,
          permissions: ['company_admin'],
          segment: companyData.segment,
          createdAt: new Date()
        });
        results.logistas++;
        console.log(`✅ Logista criado: ${logist.name} (${company.name}) - ID: ${logist._id}`);
      } else {
        console.log(`⚠️ Logista já existe: ${logist.email}`);
      }

      // Criar clientes para cada empresa
      for (let i = 1; i <= 3; i++) {
        const clientEmail = `cliente${i}.${companyData.segment}@teste.com`;
        let client = await User.findOne({ email: clientEmail });
        
        if (!client) {
          const passwordHash = await bcrypt.hash('cliente123', 12);
          client = await User.create({
            name: `Cliente ${i} - ${companyData.name}`,
            email: clientEmail,
            passwordHash,
            role: 'cliente',
            userType: 'cliente',
            companyId: company._id,
            isActive: true,
            permissions: ['basic_client'],
            createdAt: new Date()
          });
          results.clients++;
          console.log(`✅ Cliente criado: ${client.name}`);
        }
      }
    }

    // 5. CRIAR USUÁRIO EXTRA PARA TESTE DE EXCLUSÃO
    const deleteTestEmail = `usuario.exclusao.${Date.now()}@teste.com`;
    const passwordHash = await bcrypt.hash('exclusao123', 12);
    const deleteTestUser = await User.create({
      name: 'USUÁRIO PARA TESTAR EXCLUSÃO',
      email: deleteTestEmail,
      passwordHash,
      role: 'cliente',
      userType: 'cliente',
      isActive: true,
      permissions: ['test_deletion'],
      createdAt: new Date()
    });
    results.clients++;
    console.log(`✅ Usuário para teste de exclusão criado: ${deleteTestUser.email}`);

    return NextResponse.json({
      success: true,
      message: 'Dados de teste completos criados com sucesso!',
      data: results,
      details: {
        professionalAccount: professionalEmail,
        freeCoupon: freeCouponCode,
        testDeletionUser: deleteTestEmail,
        companies: companiesData.map(c => c.name),
        instructions: 'Use o cupom TESTE100 para acesso gratuito a todos os planos!'
      }
    });

  } catch (error: any) {
    console.error('[SEED-TEST-DATA] Error:', error);
    
    // Se for erro de duplicata, informar
    if (error.code === 11000) {
      return NextResponse.json({
        success: false,
        error: 'Alguns dados já existem no sistema',
        details: error.message
      }, { status: 400 });
    }

    return NextResponse.json({
      success: false,
      error: 'Erro interno do servidor',
      details: error.message
    }, { status: 500 });
  }
}