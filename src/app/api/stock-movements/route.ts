import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { dbConnect } from '@/lib/db';
import User from '@/models/User';
import Ingredient from '@/models/Ingredient';
import StockMovement from '@/models/StockMovement';

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
    const type = searchParams.get('type') || '';
    const ingredientId = searchParams.get('ingredientId') || '';
    const startDate = searchParams.get('startDate') || '';
    const endDate = searchParams.get('endDate') || '';
    const performedBy = searchParams.get('performedBy') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');

    let query: any = { userId: user._id.toString() };

    if (type && type !== 'all') {
      query.type = type;
    }

    if (ingredientId && ingredientId !== 'all') {
      query.ingredientId = ingredientId;
    }

    if (startDate) {
      query.createdAt = { ...query.createdAt, $gte: new Date(startDate) };
    }

    if (endDate) {
      query.createdAt = { ...query.createdAt, $lte: new Date(endDate) };
    }

    if (performedBy && performedBy !== 'all') {
      query.performedBy = performedBy;
    }

    // Se é logista, só pode ver suas próprias movimentações
    if (user.role !== 'owner_saas' && user.userType !== 'owner_saas') {
      query.performedBy = user._id.toString();
    }

    const skip = (page - 1) * limit;

    const [movements, total] = await Promise.all([
      StockMovement.find(query)
        .populate('ingredientId', 'name unit category')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      StockMovement.countDocuments(query)
    ]);

    return NextResponse.json({
      success: true,
      movements,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Erro ao buscar movimentações:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const body = await request.json();
    const { ingredientId, type, quantity, reason, observations } = body;

    // Validações
    if (!ingredientId || !type || !quantity || !reason) {
      return NextResponse.json(
        { error: 'Ingrediente, tipo, quantidade e motivo são obrigatórios' },
        { status: 400 }
      );
    }

    if (!['entrada', 'saida'].includes(type)) {
      return NextResponse.json(
        { error: 'Tipo deve ser "entrada" ou "saida"' },
        { status: 400 }
      );
    }

    if (quantity <= 0) {
      return NextResponse.json(
        { error: 'Quantidade deve ser maior que zero' },
        { status: 400 }
      );
    }

    await dbConnect();
    
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });
    }

    // Verificar se o ingrediente existe e pertence ao usuário
    const ingredient = await Ingredient.findOne({
      _id: ingredientId,
      userId: user._id.toString()
    });

    if (!ingredient) {
      return NextResponse.json(
        { error: 'Ingrediente não encontrado' },
        { status: 404 }
      );
    }

    // Para saída, verificar se há estoque suficiente
    if (type === 'saida' && (ingredient.currentStock || 0) < quantity) {
      return NextResponse.json(
        { error: 'Estoque insuficiente para esta saída' },
        { status: 400 }
      );
    }

    // Criar a movimentação
    const movement = new StockMovement({
      userId: user._id.toString(),
      ingredientId,
      type,
      quantity: parseFloat(quantity),
      reason: reason.trim(),
      observations: observations?.trim(),
      performedBy: user._id.toString(),
      performedByName: user.name || user.email,
      userRole: user.role || 'owner'
    });

    await movement.save();

    // Atualizar o estoque do ingrediente
    const stockChange = type === 'entrada' ? quantity : -quantity;
    await Ingredient.findByIdAndUpdate(
      ingredientId,
      { 
        $inc: { currentStock: stockChange },
        updatedAt: new Date()
      }
    );

    // Popular com dados do ingrediente para retorno
    await movement.populate('ingredientId', 'name unit category');

    return NextResponse.json({
      success: true,
      message: `${type === 'entrada' ? 'Entrada' : 'Saída'} registrada com sucesso`,
      movement
    });

  } catch (error) {
    console.error('Erro ao criar movimentação:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}