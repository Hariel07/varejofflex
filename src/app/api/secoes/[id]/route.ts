import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { dbConnect } from '@/lib/db';
import User from '@/models/User';
import Secao from '@/models/Secao';

// GET - Buscar seção específica
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

    const secao = await Secao.findOne({
      _id: params.id,
      userId: user._id.toString()
    });

    if (!secao) {
      return NextResponse.json({ 
        error: 'Seção não encontrada' 
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      secao
    });

  } catch (error) {
    console.error('Erro ao buscar seção:', error);
    return NextResponse.json({ 
      error: 'Erro interno do servidor' 
    }, { status: 500 });
  }
}

// PUT - Atualizar seção
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
    const { name, description, icon, color, order, segment, isActive } = body;

    if (!name?.trim()) {
      return NextResponse.json({ 
        error: 'Nome é obrigatório' 
      }, { status: 400 });
    }

    await dbConnect();
    
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });
    }

    const secao = await Secao.findOne({
      _id: params.id,
      userId: user._id.toString()
    });

    if (!secao) {
      return NextResponse.json({ 
        error: 'Seção não encontrada' 
      }, { status: 404 });
    }

    // Verificar se nome já existe (exceto para esta seção)
    if (name.trim() !== secao.name) {
      const existing = await Secao.findOne({
        userId: user._id.toString(),
        name: name.trim(),
        _id: { $ne: params.id }
      });
      if (existing) {
        return NextResponse.json({ 
          error: 'Já existe uma seção com este nome' 
        }, { status: 409 });
      }
    }

    // Atualizar campos
    secao.name = name.trim();
    if (description !== undefined) secao.description = description?.trim();
    if (icon !== undefined) secao.icon = icon?.trim();
    if (color !== undefined) secao.color = color?.trim();
    if (order !== undefined) secao.order = order;
    if (segment !== undefined) secao.segment = segment?.trim();
    if (isActive !== undefined) secao.isActive = isActive;

    await secao.save();

    return NextResponse.json({
      success: true,
      message: 'Seção atualizada com sucesso',
      secao
    });

  } catch (error) {
    console.error('Erro ao atualizar seção:', error);
    return NextResponse.json({ 
      error: 'Erro interno do servidor' 
    }, { status: 500 });
  }
}

// DELETE - Deletar seção
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

    const result = await Secao.findOneAndDelete({
      _id: params.id,
      userId: user._id.toString()
    });

    if (!result) {
      return NextResponse.json({ 
        error: 'Seção não encontrada' 
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Seção deletada com sucesso'
    });

  } catch (error) {
    console.error('Erro ao deletar seção:', error);
    return NextResponse.json({ 
      error: 'Erro interno do servidor' 
    }, { status: 500 });
  }
}
