import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { dbConnect } from '@/lib/db';
import User from '@/models/User';
import ItemBase from '@/models/ItemBase';

// GET - Listar itens base do usuário
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
    const category = searchParams.get('category');
    const search = searchParams.get('search') || '';
    const activeOnly = searchParams.get('activeOnly') === 'true';

    let query: any = { userId: user._id.toString() };
    
    if (category && category !== 'all') {
      query.category = category;
    }
    
    if (activeOnly) {
      query.isActive = true;
    }
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } }
      ];
    }

    const itensBase = await ItemBase.find(query)
      .sort({ name: 1 })
      .lean();

    return NextResponse.json({
      success: true,
      itensBase
    });

  } catch (error) {
    console.error('Erro ao buscar itens base:', error);
    return NextResponse.json({ 
      error: 'Erro interno do servidor' 
    }, { status: 500 });
  }
}

// POST - Criar novo item base
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
      category,
      unit,
      basePrice,
      tags
    } = body;

    if (!name?.trim()) {
      return NextResponse.json({ 
        error: 'Nome é obrigatório' 
      }, { status: 400 });
    }

    await dbConnect();
    
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });
    }

    // Verificar se nome já existe
    const existing = await ItemBase.findOne({
      userId: user._id.toString(),
      name: name.trim()
    });
    if (existing) {
      return NextResponse.json({ 
        error: 'Já existe um item base com este nome' 
      }, { status: 409 });
    }

    // Criar item base
    const itemBaseData: any = {
      name: name.trim(),
      description: description?.trim(),
      category: category?.trim() || 'Geral',
      unit: unit?.trim() || 'un',
      basePrice: basePrice ? parseFloat(basePrice) : 0,
      tags: tags || [],
      userId: user._id.toString()
    };

    if ((user as any).companyId) {
      itemBaseData.companyId = (user as any).companyId.toString();
    }

    const itemBase = new ItemBase(itemBaseData);
    await itemBase.save();

    return NextResponse.json({
      success: true,
      message: 'Item base criado com sucesso',
      itemBase
    });

  } catch (error) {
    console.error('Erro ao criar item base:', error);
    return NextResponse.json({ 
      error: 'Erro interno do servidor' 
    }, { status: 500 });
  }
}