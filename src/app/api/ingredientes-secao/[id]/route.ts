import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import IngredienteSecao from '@/models/IngredienteSecao';
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

    const ingrediente = await IngredienteSecao.findOne({
      _id: params.id,
      companyId: session.user.companyId
    })
      .populate('secao', 'nome cor icone')
      .populate('itemBase', 'nome unidadeMedida categoria precoMedioCompra estoqueAtual controleEstoque');

    if (!ingrediente) {
      return NextResponse.json(
        { error: 'Ingrediente não encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json(ingrediente);
  } catch (error) {
    console.error('Erro ao buscar ingrediente:', error);
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

    // Verificar se o ingrediente existe
    const ingredienteExistente = await IngredienteSecao.findOne({
      _id: params.id,
      companyId: session.user.companyId
    });

    if (!ingredienteExistente) {
      return NextResponse.json(
        { error: 'Ingrediente não encontrado' },
        { status: 404 }
      );
    }

    // Se está mudando o item base ou seção, verificar duplicatas
    if ((data.itemBase && data.itemBase !== ingredienteExistente.itemBase.toString()) ||
        (data.secao && data.secao !== ingredienteExistente.secao.toString())) {
      
      const secaoId = data.secao || ingredienteExistente.secao;
      const itemBaseId = data.itemBase || ingredienteExistente.itemBase;
      
      const duplicata = await IngredienteSecao.findOne({
        companyId: session.user.companyId,
        secao: secaoId,
        itemBase: itemBaseId,
        _id: { $ne: params.id }
      });

      if (duplicata) {
        return NextResponse.json(
          { error: 'Este item já está cadastrado como ingrediente nesta seção' },
          { status: 400 }
        );
      }
    }

    // Preparar dados para atualização
    const dadosAtualizacao = { ...data };
    if (data.nomeIngrediente) {
      dadosAtualizacao.nomeIngrediente = data.nomeIngrediente.trim();
    }

    const ingredienteAtualizado = await IngredienteSecao.findByIdAndUpdate(
      params.id,
      dadosAtualizacao,
      { new: true, runValidators: true }
    )
      .populate('secao', 'nome cor icone')
      .populate('itemBase', 'nome unidadeMedida categoria precoMedioCompra estoqueAtual controleEstoque');

    return NextResponse.json(ingredienteAtualizado);
  } catch (error) {
    console.error('Erro ao atualizar ingrediente:', error);
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

    // Verificar se o ingrediente existe
    const ingrediente = await IngredienteSecao.findOne({
      _id: params.id,
      companyId: session.user.companyId
    });

    if (!ingrediente) {
      return NextResponse.json(
        { error: 'Ingrediente não encontrado' },
        { status: 404 }
      );
    }

    // TODO: Verificar se este ingrediente é usado em alguma receita intermediária
    // const ReceitaIntermediaria = require('@/models/ReceitaIntermediaria');
    // const receitasUsando = await ReceitaIntermediaria.find({
    //   'ingredientes.ingrediente': params.id
    // });
    // if (receitasUsando.length > 0) {
    //   return NextResponse.json(
    //     { error: 'Não é possível excluir este ingrediente pois ele é usado em receitas' },
    //     { status: 400 }
    //   );
    // }

    await IngredienteSecao.findByIdAndDelete(params.id);

    return NextResponse.json({ message: 'Ingrediente excluído com sucesso' });
  } catch (error) {
    console.error('Erro ao excluir ingrediente:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}