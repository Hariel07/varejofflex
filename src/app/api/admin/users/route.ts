import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { dbConnect } from '@/lib/db';
import User from '@/models/User';
import Company from '@/models/Company';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    // Verificar se é owner/admin
    if ((session.user as any).role !== 'owner_saas' && (session.user as any).role !== 'admin') {
      return NextResponse.json({ error: 'Acesso negado' }, { status: 403 });
    }

    await dbConnect();

    // Buscar parâmetros de query
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const role = searchParams.get('role') || '';
    const status = searchParams.get('status') || '';

    // Construir filtros
    const filters: any = {};
    
    if (search) {
      filters.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (role) {
      filters.role = role;
    }
    
    if (status) {
      filters.isActive = status === 'active';
    }

    // Buscar usuários com paginação
    const skip = (page - 1) * limit;
    
    const users = await User.find(filters)
      .select('-passwordHash')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const totalUsers = await User.countDocuments(filters);

    // Buscar empresas dos usuários
    const userIds = users.map(user => user._id);
    const companies = await Company.find({ userId: { $in: userIds } }).lean();
    
    // Mapear empresas por usuário
    const companiesByUser = companies.reduce((acc: any, company: any) => {
      acc[company.userId.toString()] = company;
      return acc;
    }, {});

    // Enriquecer dados dos usuários
    const enrichedUsers = users.map((user: any) => ({
      ...user,
      company: companiesByUser[user._id.toString()] || null,
      lastLogin: user.lastLogin || null,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    }));

    // Estatísticas gerais
    const stats = {
      totalUsers: await User.countDocuments(),
      activeUsers: await User.countDocuments({ isActive: true }),
      logistas: await User.countDocuments({ role: 'logista' }),
      clientes: await User.countDocuments({ role: 'cliente' }),
      newUsersThisMonth: await User.countDocuments({
        createdAt: {
          $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
        }
      })
    };

    return NextResponse.json({
      success: true,
      users: enrichedUsers,
      pagination: {
        page,
        limit,
        total: totalUsers,
        totalPages: Math.ceil(totalUsers / limit)
      },
      stats
    });

  } catch (error: any) {
    console.error('Erro ao buscar usuários:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    if ((session.user as any).role !== 'owner_saas' && (session.user as any).role !== 'admin') {
      return NextResponse.json({ error: 'Acesso negado' }, { status: 403 });
    }

    const { userId, action, data } = await request.json();

    if (!userId || !action) {
      return NextResponse.json({ error: 'Dados inválidos' }, { status: 400 });
    }

    await dbConnect();

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });
    }

    switch (action) {
      case 'toggle-status':
        user.isActive = !user.isActive;
        await user.save();
        break;
        
      case 'update-role':
        if (data.role) {
          user.role = data.role;
          await user.save();
        }
        break;
        
      case 'reset-password':
        // Implementar reset de senha se necessário
        break;
        
      default:
        return NextResponse.json({ error: 'Ação inválida' }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: 'Usuário atualizado com sucesso',
      user: {
        ...user.toObject(),
        passwordHash: undefined
      }
    });

  } catch (error: any) {
    console.error('Erro ao atualizar usuário:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    // Apenas owner_saas pode excluir usuários
    if ((session.user as any).role !== 'owner_saas') {
      return NextResponse.json({ error: 'Acesso negado - apenas owners podem excluir usuários' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'ID do usuário é obrigatório' }, { status: 400 });
    }

    // Verificar se não está tentando excluir a si mesmo
    if (userId === (session.user as any).id) {
      return NextResponse.json({ error: 'Você não pode excluir sua própria conta' }, { status: 400 });
    }

    await dbConnect();

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });
    }

    // Verificar se não está tentando excluir outro owner_saas
    if (user.role === 'owner_saas') {
      return NextResponse.json({ error: 'Não é possível excluir outros owners' }, { status: 400 });
    }

    // Buscar e excluir dados relacionados
    const userObjectId = user._id;

    // Excluir empresa relacionada
    await Company.deleteMany({ userId: userObjectId });

    // Excluir códigos de verificação
    const VerificationCode = (await import('@/models/VerificationCode')).default;
    await VerificationCode.deleteMany({ 
      $or: [
        { email: user.email },
        { 'userData.email': user.email }
      ]
    });

    // Excluir tentativas de pagamento
    const PaymentAttempt = (await import('@/models/PaymentAttempt')).default;
    await PaymentAttempt.deleteMany({ email: user.email });

    // Excluir tokens de reset de senha
    const PasswordResetToken = (await import('@/models/PasswordResetToken')).default;
    await PasswordResetToken.deleteMany({ userId: userObjectId });

    // Por último, excluir o usuário
    await User.findByIdAndDelete(userId);

    console.log(`[ADMIN DELETE] Usuário ${user.email} (${userId}) excluído por ${(session.user as any).email}`);

    return NextResponse.json({
      success: true,
      message: `Usuário ${user.email} excluído com sucesso`,
      deletedUser: {
        id: userId,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });

  } catch (error: any) {
    console.error('Erro ao excluir usuário:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}