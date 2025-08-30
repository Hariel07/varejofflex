import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { dbConnect } from '@/lib/db';
import User from '@/models/User';
import IngredienteSecao from '@/models/IngredienteSecao';
import Ingredient from '@/models/Ingredient';
import Secao from '@/models/Secao';

// GET - Listar ingredientes-seção do usuário
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
    const secaoId = searchParams.get('secaoId');
    const ingredientId = searchParams.get('ingredientId');
    const visibleOnly = searchParams.get('visibleOnly') === 'true';
    const featuredOnly = searchParams.get('featuredOnly') === 'true';

    let query: any = { userId: user._id.toString() };
    
    if (secaoId) {
      query.secaoId = secaoId;
    }
    
    if (ingredientId) {
      query.ingredientId = ingredientId;
    }
    
    if (visibleOnly) {
      query.isVisible = true;
    }
    
    if (featuredOnly) {
      query.isFeatured = true;
    }

    const ingredientesSecoes = await IngredienteSecao.find(query)
      .sort({ displayOrder: 1, createdAt: 1 })
      .lean();

    return NextResponse.json({
      success: true,
      ingredientesSecoes
    });

  } catch (error) {
    console.error('Erro ao buscar ingredientes-seções:', error);
    return NextResponse.json({ 
      error: 'Erro interno do servidor' 
    }, { status: 500 });
  }
}

// POST - Criar nova ligação ingrediente-seção
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const body = await request.json();
    const { 
      ingredientId,
      secaoId,
      displayOrder,
      isVisible = true,
      isFeatured = false,
      customName,
      customDescription,
      customPrice,
      markup
    } = body;

    if (!ingredientId || !secaoId) {
      return NextResponse.json({ 
        error: 'ID do ingrediente e da seção são obrigatórios' 
      }, { status: 400 });
    }

    await dbConnect();
    
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });
    }

    // Verificar se ingrediente existe
    const ingredient = await Ingredient.findOne({
      _id: ingredientId,
      userId: user._id.toString()
    });
    if (!ingredient) {
      return NextResponse.json({ 
        error: 'Ingrediente não encontrado' 
      }, { status: 404 });
    }

    // Verificar se seção existe
    const secao = await Secao.findOne({
      _id: secaoId,
      userId: user._id.toString()
    });
    if (!secao) {
      return NextResponse.json({ 
        error: 'Seção não encontrada' 
      }, { status: 404 });
    }

    // Verificar se já existe a ligação
    const existing = await IngredienteSecao.findOne({
      userId: user._id.toString(),
      ingredientId,
      secaoId
    });
    if (existing) {
      return NextResponse.json({ 
        error: 'Ingrediente já está vinculado a esta seção' 
      }, { status: 409 });
    }

    // Criar ligação
    const ingredienteSecaoData: any = {
      ingredientId,
      ingredientName: ingredient.name,
      secaoId,
      secaoName: secao.name,
      displayOrder: displayOrder || 0,
      isVisible,
      isFeatured,
      userId: user._id.toString(),
      createdBy: user._id.toString(),
      lastModifiedBy: user._id.toString()
    };

    if (customName) ingredienteSecaoData.customName = customName;
    if (customDescription) ingredienteSecaoData.customDescription = customDescription;
    if (customPrice && customPrice > 0) ingredienteSecaoData.customPrice = customPrice;
    if (markup && markup > 0) ingredienteSecaoData.markup = markup;

    if ((user as any).companyId) {
      ingredienteSecaoData.companyId = (user as any).companyId.toString();
    }

    const ingredienteSecao = new IngredienteSecao(ingredienteSecaoData);
    await ingredienteSecao.save();

    return NextResponse.json({
      success: true,
      message: 'Ingrediente vinculado à seção com sucesso',
      ingredienteSecao
    });

  } catch (error) {
    console.error('Erro ao criar ingrediente-seção:', error);
    return NextResponse.json({ 
      error: 'Erro interno do servidor' 
    }, { status: 500 });
  }
}