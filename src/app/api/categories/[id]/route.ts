import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { dbConnect } from '@/lib/db';
import User from '@/models/User';
import Category from '@/models/Category';

// GET - Buscar categoria específica
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
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

    const category = await Category.findOne({ 
      _id: id,
      userId: user._id.toString() 
    });

    if (!category) {
      return NextResponse.json({ error: 'Categoria não encontrada' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      category
    });

  } catch (error) {
    console.error('Erro ao buscar categoria:', error);
    return NextResponse.json({ 
      error: 'Erro interno do servidor' 
    }, { status: 500 });
  }
}

// PATCH - Atualizar categoria
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
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

    // Verificar se a categoria existe e pertence ao usuário
    const existingCategory = await Category.findOne({
      _id: id,
      userId: user._id.toString()
    });

    if (!existingCategory) {
      return NextResponse.json({ error: 'Categoria não encontrada' }, { status: 404 });
    }

    // Verificar se já existe outra categoria com o mesmo nome
    const duplicateCategory = await Category.findOne({
      userId: user._id.toString(),
      name: { $regex: `^${name}$`, $options: 'i' },
      _id: { $ne: id }
    });

    if (duplicateCategory) {
      return NextResponse.json({ 
        error: 'Já existe uma categoria com este nome' 
      }, { status: 409 });
    }

    // Atualizar categoria
    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      {
        name: name.trim(),
        description: description?.trim()
      },
      { new: true }
    );

    return NextResponse.json({
      success: true,
      message: 'Categoria atualizada com sucesso',
      category: updatedCategory
    });

  } catch (error) {
    console.error('Erro ao atualizar categoria:', error);
    return NextResponse.json({ 
      error: 'Erro interno do servidor' 
    }, { status: 500 });
  }
}

// DELETE - Excluir categoria
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
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

    // Verificar se a categoria existe e pertence ao usuário
    const category = await Category.findOne({
      _id: id,
      userId: user._id.toString()
    });

    if (!category) {
      return NextResponse.json({ error: 'Categoria não encontrada' }, { status: 404 });
    }

    // TODO: Verificar se há produtos usando esta categoria
    // Aqui você pode adicionar uma verificação para impedir a exclusão 
    // se houver produtos vinculados a esta categoria

    await Category.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: 'Categoria excluída com sucesso'
    });

  } catch (error) {
    console.error('Erro ao excluir categoria:', error);
    return NextResponse.json({ 
      error: 'Erro interno do servidor' 
    }, { status: 500 });
  }
}