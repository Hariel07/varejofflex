import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { dbConnect } from '@/lib/db';
import User from '@/models/User';
import ReceitaIntermediaria from '@/models/ReceitaIntermediaria';
import Ingredient from '@/models/Ingredient';

// GET - Listar receitas intermediárias do usuário
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
    const status = searchParams.get('status');
    const category = searchParams.get('category');
    const search = searchParams.get('search') || '';
    const canProduce = searchParams.get('canProduce') === 'true';

    let query: any = { userId: user._id.toString() };
    
    if (status && status !== 'all') {
      query.status = status;
    }
    
    if (category && category !== 'all') {
      query.category = category;
    }
    
    if (canProduce) {
      query.canBeProduced = true;
    }
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } }
      ];
    }

    const receitas = await ReceitaIntermediaria.find(query)
      .sort({ name: 1 })
      .lean();

    return NextResponse.json({
      success: true,
      receitas
    });

  } catch (error) {
    console.error('Erro ao buscar receitas intermediárias:', error);
    return NextResponse.json({ 
      error: 'Erro interno do servidor' 
    }, { status: 500 });
  }
}

// POST - Criar nova receita intermediária
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
      unit,
      yieldQuantity,
      ingredients,
      instructions,
      preparationTime,
      difficulty,
      category,
      tags
    } = body;

    if (!name || !unit || !yieldQuantity || !ingredients?.length) {
      return NextResponse.json({ 
        error: 'Nome, unidade, rendimento e ingredientes são obrigatórios' 
      }, { status: 400 });
    }

    await dbConnect();
    
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });
    }

    // Verificar se nome já existe
    const existing = await ReceitaIntermediaria.findOne({
      userId: user._id.toString(),
      name: name.trim()
    });
    if (existing) {
      return NextResponse.json({ 
        error: 'Já existe uma receita com este nome' 
      }, { status: 409 });
    }

    // Validar e calcular custos dos ingredientes
    let totalCost = 0;
    const processedIngredients = [];

    for (const ing of ingredients) {
      if (!ing.ingredientId || !ing.quantity || ing.quantity <= 0) {
        return NextResponse.json({ 
          error: 'Todos os ingredientes devem ter ID e quantidade válida' 
        }, { status: 400 });
      }

      // Buscar ingrediente para validar e obter dados
      const ingredient = await Ingredient.findOne({
        _id: ing.ingredientId,
        userId: user._id.toString()
      });
      
      if (!ingredient) {
        return NextResponse.json({ 
          error: `Ingrediente não encontrado: ${ing.ingredientId}` 
        }, { status: 404 });
      }

      const ingredientCost = ing.quantity * ingredient.price;
      totalCost += ingredientCost;

      processedIngredients.push({
        ingredientId: ing.ingredientId,
        ingredientName: ingredient.name,
        quantity: ing.quantity,
        unit: ingredient.unit,
        cost: ingredientCost
      });
    }

    // Criar receita
    const receitaData: any = {
      name: name.trim(),
      description: description?.trim(),
      unit,
      yieldQuantity: parseFloat(yieldQuantity),
      cost: totalCost,
      costPerUnit: totalCost / parseFloat(yieldQuantity),
      ingredients: processedIngredients,
      instructions: instructions?.trim(),
      preparationTime: preparationTime ? parseInt(preparationTime) : undefined,
      difficulty: difficulty || 'medio',
      category: category?.trim() || 'Geral',
      tags: tags || [],
      status: 'rascunho',
      userId: user._id.toString(),
      createdBy: user._id.toString(),
      lastModifiedBy: user._id.toString()
    };

    if ((user as any).companyId) {
      receitaData.companyId = (user as any).companyId.toString();
    }

    const receita = new ReceitaIntermediaria(receitaData);
    await receita.save();

    // Verificar se pode ser produzida
    await receita.checkCanBeProduced();
    await receita.save();

    return NextResponse.json({
      success: true,
      message: 'Receita intermediária criada com sucesso',
      receita
    });

  } catch (error) {
    console.error('Erro ao criar receita intermediária:', error);
    return NextResponse.json({ 
      error: 'Erro interno do servidor' 
    }, { status: 500 });
  }
}
