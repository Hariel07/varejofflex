import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { dbConnect } from '@/lib/db';
import User from '@/models/User';
import Ingredient from '@/models/Ingredient';
import Recipe from '@/models/Recipe';
import ProductPrice from '@/models/ProductPrice';

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

// GET - Buscar ingrediente específico
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    await dbConnect();
    
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });
    }

    const ingredient = await Ingredient.findOne({
      _id: id,
      userId: user._id.toString()
    });

    if (!ingredient) {
      return NextResponse.json({ error: 'Ingrediente não encontrado' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      ingredient
    });

  } catch (error) {
    console.error('Erro ao buscar ingrediente:', error);
    return NextResponse.json({ 
      error: 'Erro interno do servidor' 
    }, { status: 500 });
  }
}

// PUT - Atualizar ingrediente
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const body = await request.json();
    const { name, price, quantity, unit, supplier } = body;

    // Validações
    if (!name || !price || !quantity || !unit) {
      return NextResponse.json({ 
        error: 'Nome, preço, quantidade e unidade são obrigatórios' 
      }, { status: 400 });
    }

    if (price <= 0 || quantity <= 0) {
      return NextResponse.json({ 
        error: 'Preço e quantidade devem ser maiores que zero' 
      }, { status: 400 });
    }

    await dbConnect();
    
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });
    }

    // Verificar se o ingrediente existe e pertence ao usuário
    const ingredient = await Ingredient.findOne({
      _id: id,
      userId: user._id.toString()
    });

    if (!ingredient) {
      return NextResponse.json({ error: 'Ingrediente não encontrado' }, { status: 404 });
    }

    // Verificar se outro ingrediente já tem esse nome
    const existingIngredient = await Ingredient.findOne({
      userId: user._id.toString(),
      name: { $regex: `^${name}$`, $options: 'i' },
      _id: { $ne: id }
    });

    if (existingIngredient) {
      return NextResponse.json({ 
        error: 'Já existe outro ingrediente com este nome' 
      }, { status: 409 });
    }

    // Atualizar ingrediente
    ingredient.name = name.trim();
    ingredient.price = parseFloat(price);
    ingredient.quantity = parseFloat(quantity);
    ingredient.unit = unit;
    ingredient.supplier = supplier?.trim();

    await ingredient.save();

    return NextResponse.json({
      success: true,
      message: 'Ingrediente atualizado com sucesso',
      ingredient
    });

  } catch (error) {
    console.error('Erro ao atualizar ingrediente:', error);
    return NextResponse.json({ 
      error: 'Erro interno do servidor' 
    }, { status: 500 });
  }
}

// DELETE - Excluir ingrediente
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    await dbConnect();
    
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });
    }

    // Verificar se o ingrediente existe
    const ingredient = await Ingredient.findOne({
      _id: id,
      userId: user._id.toString()
    });

    if (!ingredient) {
      return NextResponse.json({ error: 'Ingrediente não encontrado' }, { status: 404 });
    }

    // Verificar se o ingrediente está sendo usado em receitas
    const recipesUsingIngredient = await Recipe.find({
      userId: user._id.toString(),
      'ingredients.ingredientId': id
    });

    if (recipesUsingIngredient.length > 0) {
      return NextResponse.json({ 
        error: 'Este ingrediente está sendo usado em receitas e não pode ser excluído' 
      }, { status: 409 });
    }

    // Verificar se o ingrediente está sendo usado em produtos
    const productsUsingIngredient = await ProductPrice.find({
      userId: user._id.toString(),
      'components.type': 'ingredient',
      'components.id': id
    });

    if (productsUsingIngredient.length > 0) {
      return NextResponse.json({ 
        error: 'Este ingrediente está sendo usado em produtos e não pode ser excluído' 
      }, { status: 409 });
    }

    // Excluir ingrediente
    await Ingredient.deleteOne({ _id: id });

    return NextResponse.json({
      success: true,
      message: 'Ingrediente excluído com sucesso'
    });

  } catch (error) {
    console.error('Erro ao excluir ingrediente:', error);
    return NextResponse.json({ 
      error: 'Erro interno do servidor' 
    }, { status: 500 });
  }
}