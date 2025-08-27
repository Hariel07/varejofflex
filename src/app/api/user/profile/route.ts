import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { dbConnect } from '@/lib/db';
import User from '@/models/User';
import Company from '@/models/Company';

// GET - Buscar dados do perfil do usuário
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: 'Não autorizado' },
        { status: 401 }
      );
    }

    await dbConnect();
    
    // Buscar usuário com dados da empresa
    const user = await User.findOne({ email: session.user.email }).lean() as any;
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Usuário não encontrado' },
        { status: 404 }
      );
    }

    // Buscar dados da empresa se o usuário for logista ou owner
    let company = null;
    if ((user.role === 'logista' || user.role === 'owner' || user.role === 'owner_saas') && user.companyId) {
      company = await Company.findById(user.companyId).lean();
    }

    // Remover dados sensíveis
    const { passwordHash, ...userDataSafe } = user;

    return NextResponse.json({
      success: true,
      user: {
        ...userDataSafe,
        company
      }
    });

  } catch (error) {
    console.error('Erro ao buscar perfil:', error);
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// PUT - Atualizar dados do perfil do usuário
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
    const { name, phone, address, city, state, zipCode } = body;

    // Validações básicas
    if (!name || name.trim().length < 2) {
      return NextResponse.json(
        { success: false, error: 'Nome deve ter pelo menos 2 caracteres' },
        { status: 400 }
      );
    }

    // Buscar e atualizar usuário
    const user = await User.findOne({ email: session.user.email });
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Usuário não encontrado' },
        { status: 404 }
      );
    }

    // Atualizar dados
    user.name = name.trim();
    if (phone) user.phone = phone.trim();
    if (address) user.address = address.trim();
    if (city) user.city = city.trim();
    if (state) user.state = state.trim().toUpperCase();
    if (zipCode) user.zipCode = zipCode.trim();
    
    user.updatedAt = new Date();

    await user.save();

    console.log(`✅ Perfil atualizado para usuário: ${user.email}`);

    return NextResponse.json({
      success: true,
      message: 'Perfil atualizado com sucesso'
    });

  } catch (error) {
    console.error('Erro ao atualizar perfil:', error);
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}