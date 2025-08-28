import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { dbConnect } from '@/lib/db';
import User from '@/models/User';

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    await dbConnect();
    
    const currentUser = await User.findOne({ email: session.user.email });
    if (!currentUser) {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });
    }

    // Apenas owners podem buscar dados de outros usuários
    if (currentUser.role !== 'owner_saas' && currentUser.userType !== 'owner_saas') {
      return NextResponse.json({ error: 'Acesso negado' }, { status: 403 });
    }

    const targetUser = await User.findById(id)
      .select('_id name email role userType segment isActive companyId lastLoginAt createdAt');

    if (!targetUser) {
      return NextResponse.json({ error: 'Usuário alvo não encontrado' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      user: targetUser
    });

  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}