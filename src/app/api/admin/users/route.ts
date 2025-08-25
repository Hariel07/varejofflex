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