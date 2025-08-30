import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { dbConnect } from '@/lib/db';
import User from '@/models/User';
import Movimentacao from '@/models/Movimentacao';

// GET - Buscar movimentação específica
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
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

    const movimentacao = await Movimentacao.findOne({
      _id: params.id,
      userId: user._id.toString()
    });

    if (!movimentacao) {
      return NextResponse.json({ 
        error: 'Movimentação não encontrada' 
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      movimentacao
    });

  } catch (error) {
    console.error('Erro ao buscar movimentação:', error);
    return NextResponse.json({ 
      error: 'Erro interno do servidor' 
    }, { status: 500 });
  }
}

// PUT - Atualizar movimentação
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
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

    const movimentacao = await Movimentacao.findOne({
      _id: params.id,
      userId: user._id.toString()
    });

    if (!movimentacao) {
      return NextResponse.json({ 
        error: 'Movimentação não encontrada' 
      }, { status: 404 });
    }

    // Atualizar campos permitidos
    if (body.observations !== undefined) movimentacao.observations = body.observations;
    if (body.status !== undefined) movimentacao.status = body.status;
    if (body.reason !== undefined) movimentacao.reason = body.reason;

    await movimentacao.save();

    return NextResponse.json({
      success: true,
      message: 'Movimentação atualizada com sucesso',
      movimentacao
    });

  } catch (error) {
    console.error('Erro ao atualizar movimentação:', error);
    return NextResponse.json({ 
      error: 'Erro interno do servidor' 
    }, { status: 500 });
  }
}

// DELETE - Deletar movimentação
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
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

    const result = await Movimentacao.findOneAndDelete({
      _id: params.id,
      userId: user._id.toString()
    });

    if (!result) {
      return NextResponse.json({ 
        error: 'Movimentação não encontrada' 
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Movimentação deletada com sucesso'
    });

  } catch (error) {
    console.error('Erro ao deletar movimentação:', error);
    return NextResponse.json({ 
      error: 'Erro interno do servidor' 
    }, { status: 500 });
  }
}
