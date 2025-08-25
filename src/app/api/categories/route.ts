import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { dbConnect } from '@/lib/db';
import User from '@/models/User';
import Category from '@/models/Category';

// GET - Listar categorias do usuário
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

    const categories = await Category.find({ 
      userId: user._id.toString() 
    }).sort({ name: 1 });

    return NextResponse.json({
      success: true,
      categories
    });

  } catch (error) {
    console.error('Erro ao buscar categorias:', error);
    return NextResponse.json({ 
      error: 'Erro interno do servidor' 
    }, { status: 500 });
  }
}

// POST - Criar nova categoria
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const body = await request.json();
    const { name, description } = body;

    if (!name || name.trim().length === 0) {
      return NextResponse.json({ 
        error: 'Nome da categoria é obrigatório' 
      }, { status: 400 });
    }

    await dbConnect();
    
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });
    }

    // Verificar se já existe categoria com o mesmo nome
    const existingCategory = await Category.findOne({
      userId: user._id.toString(),
      name: { $regex: `^${name}$`, $options: 'i' }
    });

    if (existingCategory) {
      return NextResponse.json({ 
        error: 'Já existe uma categoria com este nome' 
      }, { status: 409 });
    }

    const category = new Category({
      name: name.trim(),
      description: description?.trim(),
      userId: user._id.toString()
    });

    await category.save();

    return NextResponse.json({
      success: true,
      message: 'Categoria criada com sucesso',
      category
    });

  } catch (error) {
    console.error('Erro ao criar categoria:', error);
    return NextResponse.json({ 
      error: 'Erro interno do servidor' 
    }, { status: 500 });
  }
}