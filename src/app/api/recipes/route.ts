import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { dbConnect } from '@/lib/db';
import User from '@/models/User';
import Recipe from '@/models/Recipe';
import Ingredient from '@/models/Ingredient';

// GET - Listar receitas do usuário
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
    const category = searchParams.get('category') || '';
    const difficulty = searchParams.get('difficulty') || '';

    let query: any = { userId: user._id.toString() };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    if (category && category !== 'all') {
      query.category = category;
    }

    if (difficulty && difficulty !== 'all') {
      query.difficulty = difficulty;
    }

    const recipes = await Recipe.find(query)
      .populate('ingredients.ingredientId', 'name unit price')
      .sort({ name: 1 });

    return NextResponse.json({
      success: true,
      recipes
    });

  } catch (error) {
    console.error('Erro ao buscar receitas:', error);
    return NextResponse.json({ 
      error: 'Erro interno do servidor' 
    }, { status: 500 });
  }
}

// POST - Criar nova receita
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
      difficulty,
      prepTime,
      cookTime,
      servings,
      ingredients, 
      instructions,
      tips,
      tags,
      yield: recipeYield, 
      yieldUnit 
    } = body;

    // Validações
    if (!name || !ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
      return NextResponse.json({ 
        error: 'Nome e ingredientes são obrigatórios' 
      }, { status: 400 });
    }

    const finalServings = servings || recipeYield || 1;
    if (finalServings <= 0) {
      return NextResponse.json({ 
        error: 'Número de porções deve ser maior que zero' 
      }, { status: 400 });
    }

    await dbConnect();
    
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });
    }

    // Verificar se já existe receita com o mesmo nome
    const existingRecipe = await Recipe.findOne({
      userId: user._id.toString(),
      name: { $regex: `^${name}$`, $options: 'i' }
    });

    if (existingRecipe) {
      return NextResponse.json({ 
        error: 'Já existe uma receita com este nome' 
      }, { status: 409 });
    }

    // Validar ingredientes
    const ingredientIds = ingredients.map((ing: any) => ing.ingredientId);
    const validIngredients = await Ingredient.find({
      _id: { $in: ingredientIds },
      userId: user._id.toString()
    });

    if (validIngredients.length !== ingredientIds.length) {
      return NextResponse.json({ 
        error: 'Um ou mais ingredientes não são válidos' 
      }, { status: 400 });
    }

    // Validar quantidades dos ingredientes
    for (const ing of ingredients) {
      if (!ing.ingredientId || !ing.quantity || ing.quantity <= 0) {
        return NextResponse.json({ 
          error: 'Todos os ingredientes devem ter ID e quantidade válidos' 
        }, { status: 400 });
      }
    }

    // Calcular custo total
    let totalCost = 0;
    for (const ing of ingredients) {
      const ingredient = validIngredients.find(vi => vi._id.toString() === ing.ingredientId);
      if (ingredient) {
        totalCost += (ingredient.costPerUnit || ingredient.price) * ing.quantity;
      }
    }

    const costPerServing = totalCost / finalServings;

    const recipe = new Recipe({
      name: name.trim(),
      description: description?.trim(),
      category: category || 'outros',
      difficulty: difficulty || 'facil',
      prepTime: prepTime || 0,
      cookTime: cookTime || 0,
      servings: parseInt(finalServings),
      ingredients: ingredients.map((ing: any) => ({
        ingredientId: ing.ingredientId,
        quantity: parseFloat(ing.quantity),
        unit: ing.unit || 'un',
        notes: ing.notes?.trim()
      })),
      instructions: Array.isArray(instructions) ? instructions : (instructions ? [instructions] : []),
      tips: tips?.trim(),
      tags: tags || [],
      totalCost,
      costPerServing,
      yield: recipeYield ? parseFloat(recipeYield) : finalServings,
      yieldUnit: yieldUnit || 'porções',
      userId: user._id.toString()
    });

    await recipe.save();

    // Popular com dados dos ingredientes para retorno
    await recipe.populate('ingredients.ingredientId', 'name unit price');

    return NextResponse.json({
      success: true,
      message: 'Receita criada com sucesso',
      recipe
    });

  } catch (error) {
    console.error('Erro ao criar receita:', error);
    return NextResponse.json({ 
      error: 'Erro interno do servidor' 
    }, { status: 500 });
  }
}