import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { dbConnect } from '@/lib/db';
import User from '@/models/User';
import IngredienteSecao from '@/models/IngredienteSecao';

// GET - Buscar ingrediente-seção específico
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
    const ingredienteSecao = await IngredienteSecao.findOne({
      _id: params.id,
      userId: user._id.toString()
    });

    if (!ingredienteSecao) {
      return NextResponse.json({ 
        error: 'Ingrediente-seção não encontrado' 
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      ingredienteSecao
    });

  } catch (error) {
    console.error('Erro ao buscar ingrediente-seção:', error);
    return NextResponse.json({ 
      error: 'Erro interno do servidor' 
    }, { status: 500 });
  }
}

// PUT - Atualizar ingrediente-seção
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
    const { 
      displayOrder,
      isVisible,
      isFeatured,
      customName,
      customDescription,
      customPrice,
      markup,
      status
    } = body;

    await dbConnect();
    
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });
    }

    const params = await context.params;
    const ingredienteSecao = await IngredienteSecao.findOne({
      _id: params.id,
      userId: user._id.toString()
    });

    if (!ingredienteSecao) {
      return NextResponse.json({ 
        error: 'Ingrediente-seção não encontrado' 
      }, { status: 404 });
    }

    // Atualizar campos
    if (displayOrder !== undefined) ingredienteSecao.displayOrder = displayOrder;
    if (isVisible !== undefined) ingredienteSecao.isVisible = isVisible;
    if (isFeatured !== undefined) ingredienteSecao.isFeatured = isFeatured;
    if (customName !== undefined) ingredienteSecao.customName = customName;
    if (customDescription !== undefined) ingredienteSecao.customDescription = customDescription;
    if (customPrice !== undefined) ingredienteSecao.customPrice = customPrice;
    if (markup !== undefined) ingredienteSecao.markup = markup;
    if (status !== undefined) ingredienteSecao.status = status;
    
    ingredienteSecao.lastModifiedBy = user._id.toString();

    await ingredienteSecao.save();

    return NextResponse.json({
      success: true,
      message: 'Ingrediente-seção atualizado com sucesso',
      ingredienteSecao
    });

  } catch (error) {
    console.error('Erro ao atualizar ingrediente-seção:', error);
    return NextResponse.json({ 
      error: 'Erro interno do servidor' 
    }, { status: 500 });
  }
}

// DELETE - Deletar ingrediente-seção
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
    const result = await IngredienteSecao.findOneAndDelete({
      _id: params.id,
      userId: user._id.toString()
    });

    if (!result) {
      return NextResponse.json({ 
        error: 'Ingrediente-seção não encontrado' 
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Ingrediente-seção removido com sucesso'
    });

  } catch (error) {
    console.error('Erro ao deletar ingrediente-seção:', error);
    return NextResponse.json({ 
      error: 'Erro interno do servidor' 
    }, { status: 500 });
  }
}