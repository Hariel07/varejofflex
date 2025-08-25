import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { dbConnect } from '@/lib/db';
import User from '@/models/User';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    await dbConnect();
    
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });
    }

    // Apenas owners podem listar usuários
    if (user.role !== 'owner_saas' && user.userType !== 'owner_saas') {
      return NextResponse.json({ error: 'Acesso negado' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const role = searchParams.get('role') || '';

    let query: any = { isActive: true };

    // Se especificar role, filtrar por ele
    if (role && role !== 'all') {
      query.role = role;
    }

    const users = await User.find(query)
      .select('_id name email role userType segment isActive lastLoginAt createdAt')
      .sort({ name: 1 });

    return NextResponse.json({
      success: true,
      users
    });

  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}