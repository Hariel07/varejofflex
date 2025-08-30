import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { dbConnect } from '@/lib/db';
import User from '@/models/User';
import ReceitaIntermediaria from '@/models/ReceitaIntermediaria';

// GET - Buscar receita intermediária específica
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
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

    const params = await context.params;
    const receita = await ReceitaIntermediaria.findOne({
      _id: params.id,
      userId: user._id.toString()
    });

    if (!receita) {
      return NextResponse.json({ 
        error: 'Receita não encontrada' 
      }, { status: 404 });
    }

    // Verificar se pode ser produzida (atualizar status)
    await receita.checkCanBeProduced();
    await receita.save();

    return NextResponse.json({
      success: true,
      receita
    });

  } catch (error) {
    console.error('Erro ao buscar receita:', error);
    return NextResponse.json({ 
      error: 'Erro interno do servidor' 
    }, { status: 500 });
  }
}

// PUT - Atualizar receita intermediária
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const body = await request.json();

    await dbConnect();
    
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });
    }

    const params = await context.params;
    const receita = await ReceitaIntermediaria.findOne({
      _id: params.id,
      userId: user._id.toString()
    });

    if (!receita) {
      return NextResponse.json({ 
        error: 'Receita não encontrada' 
      }, { status: 404 });
    }

    // Atualizar campos básicos
    if (body.name) receita.name = body.name.trim();
    if (body.description !== undefined) receita.description = body.description?.trim();
    if (body.instructions !== undefined) receita.instructions = body.instructions?.trim();
    if (body.preparationTime !== undefined) receita.preparationTime = body.preparationTime;
    if (body.difficulty) receita.difficulty = body.difficulty;
    if (body.category !== undefined) receita.category = body.category?.trim();
    if (body.tags !== undefined) receita.tags = body.tags;
    if (body.status) receita.status = body.status;

    receita.lastModifiedBy = user._id.toString();

    await receita.save();

    return NextResponse.json({
      success: true,
      message: 'Receita atualizada com sucesso',
      receita
    });

  } catch (error) {
    console.error('Erro ao atualizar receita:', error);
    return NextResponse.json({ 
      error: 'Erro interno do servidor' 
    }, { status: 500 });
  }
}

// DELETE - Deletar receita intermediária
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
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

    const params = await context.params;
    const result = await ReceitaIntermediaria.findOneAndDelete({
      _id: params.id,
      userId: user._id.toString()
    });

    if (!result) {
      return NextResponse.json({ 
        error: 'Receita não encontrada' 
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Receita deletada com sucesso'
    });

  } catch (error) {
    console.error('Erro ao deletar receita:', error);
    return NextResponse.json({ 
      error: 'Erro interno do servidor' 
    }, { status: 500 });
  }
}
