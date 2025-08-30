import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Secao from '@/models/Secao';
import { auth } from '@/lib/auth';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    
    const session = await auth();
    if (!session?.user?.companyId) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const secao = await Secao.findOne({
      _id: params.id,
      companyId: session.user.companyId
    });

    if (!secao) {
      return NextResponse.json(
        { error: 'Seção não encontrada' },
        { status: 404 }
      );
    }

    return NextResponse.json(secao);
  } catch (error) {
    console.error('Erro ao buscar seção:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    
    const session = await auth();
    if (!session?.user?.companyId) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const data = await req.json();

    // Verificar se a seção existe
    const secaoExistente = await Secao.findOne({
      _id: params.id,
      companyId: session.user.companyId
    });

    if (!secaoExistente) {
      return NextResponse.json(
        { error: 'Seção não encontrada' },
        { status: 404 }
      );
    }

    // Verificar se o novo nome já existe em outra seção
    if (data.nome && data.nome.trim() !== secaoExistente.nome) {
      const nomeJaExiste = await Secao.findOne({
        companyId: session.user.companyId,
        nome: data.nome.trim(),
        _id: { $ne: params.id }
      });

      if (nomeJaExiste) {
        return NextResponse.json(
          { error: 'Já existe uma seção com este nome' },
          { status: 400 }
        );
      }
    }

    // Preparar dados para atualização
    const dadosAtualizacao = { ...data };
    if (data.nome) {
      dadosAtualizacao.nome = data.nome.trim();
    }

    const secaoAtualizada = await Secao.findByIdAndUpdate(
      params.id,
      dadosAtualizacao,
      { new: true, runValidators: true }
    );

    return NextResponse.json(secaoAtualizada);
  } catch (error) {
    console.error('Erro ao atualizar seção:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    
    const session = await auth();
    if (!session?.user?.companyId) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    // Verificar se a seção existe
    const secao = await Secao.findOne({
      _id: params.id,
      companyId: session.user.companyId
    });

    if (!secao) {
      return NextResponse.json(
        { error: 'Seção não encontrada' },
        { status: 404 }
      );
    }

    // TODO: Verificar se existem ingredientes vinculados a esta seção
    // const IngredienteSecao = require('@/models/IngredienteSecao');
    // const ingredientesVinculados = await IngredienteSecao.find({ secao: params.id });
    // if (ingredientesVinculados.length > 0) {
    //   return NextResponse.json(
    //     { error: 'Não é possível excluir esta seção pois existem ingredientes vinculados' },
    //     { status: 400 }
    //   );
    // }

    await Secao.findByIdAndDelete(params.id);

    return NextResponse.json({ message: 'Seção excluída com sucesso' });
  } catch (error) {
    console.error('Erro ao excluir seção:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}