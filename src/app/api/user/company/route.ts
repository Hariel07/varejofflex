import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { dbConnect } from '@/lib/db';
import User from '@/models/User';
import Company from '@/models/Company';

// PUT - Atualizar dados da empresa
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
    
    const body = await request.json();
    const { name, businessType, phone, address, city, state, zipCode } = body;

    // Validações básicas
    if (!name || name.trim().length < 2) {
      return NextResponse.json(
        { success: false, error: 'Nome da empresa deve ter pelo menos 2 caracteres' },
        { status: 400 }
      );
    }

    // Buscar usuário
    const user = await User.findOne({ email: session.user.email });
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Usuário não encontrado' },
        { status: 404 }
      );
    }

    // Verificar se o usuário pode gerenciar empresa
    if (user.role !== 'logista' && user.role !== 'owner' && user.role !== 'owner_saas') {
      return NextResponse.json(
        { success: false, error: 'Apenas lojistas e proprietários podem gerenciar dados da empresa' },
        { status: 403 }
      );
    }

    let company;

    if (user.companyId) {
      // Atualizar empresa existente
      company = await Company.findById(user.companyId);
      
      if (!company) {
        return NextResponse.json(
          { success: false, error: 'Empresa não encontrada' },
          { status: 404 }
        );
      }
    } else {
      // Criar nova empresa
      company = new Company({
        userId: user._id,
        createdAt: new Date()
      });
    }

    // Atualizar dados da empresa
    company.name = name.trim();
    if (businessType) company.businessType = businessType.trim();
    if (phone) company.phone = phone.trim();
    if (address) company.address = address.trim();
    if (city) company.city = city.trim();
    if (state) company.state = state.trim().toUpperCase();
    if (zipCode) company.zipCode = zipCode.trim();
    
    company.updatedAt = new Date();

    await company.save();

    // Atualizar referência no usuário se for uma nova empresa
    if (!user.companyId) {
      user.companyId = company._id;
      await user.save();
    }

    console.log(`✅ Dados da empresa atualizados: ${company.name} (usuário: ${user.email})`);

    return NextResponse.json({
      success: true,
      message: 'Dados da empresa atualizados com sucesso',
      company: {
        _id: company._id,
        name: company.name,
        businessType: company.businessType,
        phone: company.phone,
        address: company.address,
        city: company.city,
        state: company.state,
        zipCode: company.zipCode
      }
    });

  } catch (error) {
    console.error('Erro ao atualizar empresa:', error);
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}