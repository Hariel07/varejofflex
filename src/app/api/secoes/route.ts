import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { dbConnect } from '@/lib/db';
import User from '@/models/User';
import Secao from '@/models/Secao';

// GET - Listar seções do usuário
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

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const segment = searchParams.get('segment') || '';
    const isActive = searchParams.get('isActive');

    let query: any = { userId: user._id.toString() };
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    if (segment && segment !== 'all') {
      query.segment = segment;
    }

    if (isActive !== null && isActive !== undefined) {
      query.isActive = isActive === 'true';
    }

    const secoes = await Secao.find(query)
      .sort({ order: 1, name: 1 })
      .lean();

    return NextResponse.json({
      success: true,
      secoes
    });

  } catch (error) {
    console.error('Erro ao buscar seções:', error);
    return NextResponse.json({ 
      error: 'Erro interno do servidor' 
    }, { status: 500 });
  }
}

// POST - Criar nova seção
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const body = await request.json();
    const { 
      name, 
      description,
      icon,
      color,
      order,
      segment
    } = body;

    // Validações básicas
    if (!name) {
      return NextResponse.json({ 
        error: 'Nome é obrigatório' 
      }, { status: 400 });
    }

    await dbConnect();
    
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });
    }

    // Verificar se já existe seção com o mesmo nome
    const existingSecao = await Secao.findOne({
      userId: user._id.toString(),
      name: { $regex: `^${name}$`, $options: 'i' }
    });

    if (existingSecao) {
      return NextResponse.json({ 
        error: 'Já existe uma seção com este nome' 
      }, { status: 409 });
    }

    // Preparar dados da seção
    const secaoData: any = {
      name: name.trim(),
      description: description?.trim(),
      icon: icon?.trim() || '📂',
      color: color || '#6B7280',
      segment: segment || 'geral',
      userId: user._id.toString()
    };

    // Definir ordem se especificada
    if (order && order > 0) {
      secaoData.order = order;
    }

    // Adicionar companyId se o usuário tiver
    if ((user as any).companyId) {
      secaoData.companyId = (user as any).companyId.toString();
    }

    const secao = new Secao(secaoData);
    await secao.save();

    return NextResponse.json({
      success: true,
      message: 'Seção criada com sucesso',
      secao
    });

  } catch (error) {
    console.error('Erro ao criar seção:', error);
    
    // Verificar se é erro de índice único (nome duplicado)
    if ((error as any).code === 11000) {
      return NextResponse.json({ 
        error: 'Já existe uma seção com este nome' 
      }, { status: 409 });
    }

    return NextResponse.json({ 
      error: 'Erro interno do servidor' 
    }, { status: 500 });
  }
}

// PUT - Reordenar seções
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const body = await request.json();
    const { secoes } = body; // Array com [{ id, order }]

    if (!Array.isArray(secoes)) {
      return NextResponse.json({ 
        error: 'Array de seções é obrigatório' 
      }, { status: 400 });
    }

    await dbConnect();
    
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });
    }

    // Atualizar ordem de cada seção
    const updatePromises = secoes.map(({ id, order }) => 
      Secao.updateOne(
        { _id: id, userId: user._id.toString() },
        { order: order }
      )
    );

    await Promise.all(updatePromises);

    return NextResponse.json({
      success: true,
      message: 'Ordem das seções atualizada com sucesso'
    });

  } catch (error) {
    console.error('Erro ao reordenar seções:', error);
    return NextResponse.json({ 
      error: 'Erro interno do servidor' 
    }, { status: 500 });
  }
}