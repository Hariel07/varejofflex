import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { dbConnect } from '@/lib/db';
import User from '@/models/User';
import ProductPrice from '@/models/ProductPrice';
import Category from '@/models/Category';
import Ingredient from '@/models/Ingredient';
import Recipe from '@/models/Recipe';
import AdditionalCost from '@/models/AdditionalCost';

// GET - Listar produtos do usuário
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
    const categoryId = searchParams.get('categoryId');

    let query: any = { userId: user._id.toString() };
    
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    if (categoryId) {
      query.categoryId = categoryId;
    }

    const products = await ProductPrice.find(query).sort({ name: 1 });

    return NextResponse.json({
      success: true,
      products
    });

  } catch (error) {
    console.error('Erro ao buscar produtos:', error);
    return NextResponse.json({ 
      error: 'Erro interno do servidor' 
    }, { status: 500 });
  }
}

// POST - Criar novo produto
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const body = await request.json();
    const { name, categoryId, components, salePrice, description, image } = body;

    // Validações básicas
    if (!name || !categoryId || !components || !Array.isArray(components) || components.length === 0) {
      return NextResponse.json({ 
        error: 'Nome, categoria e componentes são obrigatórios' 
      }, { status: 400 });
    }

    if (salePrice <= 0) {
      return NextResponse.json({ 
        error: 'Preço de venda deve ser maior que zero' 
      }, { status: 400 });
    }

    await dbConnect();
    
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });
    }

    // Verificar se a categoria existe
    const category = await Category.findOne({
      _id: categoryId,
      userId: user._id.toString()
    });

    if (!category) {
      return NextResponse.json({ 
        error: 'Categoria não encontrada' 
      }, { status: 404 });
    }

    // Verificar se já existe produto com o mesmo nome
    const existingProduct = await ProductPrice.findOne({
      userId: user._id.toString(),
      name: { $regex: `^${name}$`, $options: 'i' }
    });

    if (existingProduct) {
      return NextResponse.json({ 
        error: 'Já existe um produto com este nome' 
      }, { status: 409 });
    }

    // Validar componentes
    for (const component of components) {
      if (!component.type || !component.id || !component.quantity || component.quantity <= 0) {
        return NextResponse.json({ 
          error: 'Todos os componentes devem ter tipo, ID e quantidade válidos' 
        }, { status: 400 });
      }

      // Verificar se o componente existe baseado no tipo
      if (component.type === 'ingredient') {
        const ingredient = await Ingredient.findOne({
          _id: component.id,
          userId: user._id.toString()
        });
        if (!ingredient) {
          return NextResponse.json({ 
            error: `Ingrediente ${component.id} não encontrado` 
          }, { status: 404 });
        }
      } else if (component.type === 'recipe') {
        const recipe = await Recipe.findOne({
          _id: component.id,
          userId: user._id.toString()
        });
        if (!recipe) {
          return NextResponse.json({ 
            error: `Receita ${component.id} não encontrada` 
          }, { status: 404 });
        }
      } else if (component.type === 'additionalCost') {
        const additionalCost = await AdditionalCost.findOne({
          _id: component.id,
          userId: user._id.toString()
        });
        if (!additionalCost) {
          return NextResponse.json({ 
            error: `Custo adicional ${component.id} não encontrado` 
          }, { status: 404 });
        }
      }
    }

    const product = new ProductPrice({
      name: name.trim(),
      categoryId,
      components,
      salePrice: parseFloat(salePrice),
      description: description?.trim(),
      image: image?.trim(),
      available: true,
      userId: user._id.toString()
    });

    await product.save();

    return NextResponse.json({
      success: true,
      message: 'Produto criado com sucesso',
      product
    });

  } catch (error) {
    console.error('Erro ao criar produto:', error);
    return NextResponse.json({ 
      error: 'Erro interno do servidor' 
    }, { status: 500 });
  }
}