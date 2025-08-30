import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import ReceitaIntermediaria from '@/models/ReceitaIntermediaria';
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

    const receita = await ReceitaIntermediaria.findOne({
      _id: params.id,
      companyId: session.user.companyId
    })
      .populate({
        path: 'ingredientes.ingrediente',
        populate: [
          { path: 'secao', select: 'nome cor icone' },
          { path: 'itemBase', select: 'nome unidadeMedida categoria precoMedioCompra' }
        ]
      });

    if (!receita) {
      return NextResponse.json(
        { error: 'Receita não encontrada' },
        { status: 404 }
      );
    }

    return NextResponse.json(receita);
  } catch (error) {
    console.error('Erro ao buscar receita:', error);
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

    // Verificar se a receita existe
    const receitaExistente = await ReceitaIntermediaria.findOne({
      _id: params.id,
      companyId: session.user.companyId
    });

    if (!receitaExistente) {
      return NextResponse.json(
        { error: 'Receita não encontrada' },
        { status: 404 }
      );
    }

    // Verificar se o novo nome já existe em outra receita
    if (data.nome && data.nome.trim() !== receitaExistente.nome) {
      const nomeJaExiste = await ReceitaIntermediaria.findOne({
        companyId: session.user.companyId,
        nome: data.nome.trim(),
        _id: { $ne: params.id }
      });

      if (nomeJaExiste) {
        return NextResponse.json(
          { error: 'Já existe uma receita com este nome' },
          { status: 400 }
        );
      }
    }

    // Validar ingredientes se fornecidos
    if (data.ingredientes && Array.isArray(data.ingredientes)) {
      for (const ing of data.ingredientes) {
        if (!ing.ingrediente || !ing.quantidade || ing.quantidade <= 0) {
          return NextResponse.json(
            { error: 'Todos os ingredientes devem ter ID e quantidade válida' },
            { status: 400 }
          );
        }
        
        // Verificar se o ingrediente existe
        const ingrediente = await IngredienteSecao.findOne({
          _id: ing.ingrediente,
          companyId: session.user.companyId
        });
        
        if (!ingrediente) {
          return NextResponse.json(
            { error: `Ingrediente ${ing.ingrediente} não encontrado` },
            { status: 400 }
          );
        }
      }
    }

    // Preparar dados para atualização
    const dadosAtualizacao = { ...data };
    if (data.nome) {
      dadosAtualizacao.nome = data.nome.trim();
    }
    if (data.categoria) {
      dadosAtualizacao.categoria = data.categoria.trim();
    }

    // Recalcular custo se ingredientes ou rendimento mudaram
    if ((data.ingredientes || data.rendimento) && !data.custoPorUnidade) {
      const ingredientes = data.ingredientes || receitaExistente.ingredientes;
      const rendimento = data.rendimento || receitaExistente.rendimento;
      
      let custoTotal = 0;
      
      for (const ing of ingredientes) {
        const ingredienteSecao = await IngredienteSecao.findById(ing.ingrediente)
          .populate('itemBase', 'precoMedioCompra');
        
        if (ingredienteSecao?.itemBase?.precoMedioCompra) {
          custoTotal += ingredienteSecao.itemBase.precoMedioCompra * ing.quantidade;
        }
      }
      
      if (custoTotal > 0) {
        dadosAtualizacao.custoPorUnidade = custoTotal / rendimento;
      }
    }

    const receitaAtualizada = await ReceitaIntermediaria.findByIdAndUpdate(
      params.id,
      dadosAtualizacao,
      { new: true, runValidators: true }
    )
      .populate({
        path: 'ingredientes.ingrediente',
        populate: [
          { path: 'secao', select: 'nome cor icone' },
          { path: 'itemBase', select: 'nome unidadeMedida categoria precoMedioCompra' }
        ]
      });

    return NextResponse.json(receitaAtualizada);
  } catch (error) {
    console.error('Erro ao atualizar receita:', error);
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

    // Verificar se a receita existe
    const receita = await ReceitaIntermediaria.findOne({
      _id: params.id,
      companyId: session.user.companyId
    });

    if (!receita) {
      return NextResponse.json(
        { error: 'Receita não encontrada' },
        { status: 404 }
      );
    }

    // TODO: Verificar se esta receita é usada em algum produto final
    // const Product = require('@/models/Product');
    // const produtosUsando = await Product.find({
    //   'receitasIntermediarias.receita': params.id
    // });
    // if (produtosUsando.length > 0) {
    //   return NextResponse.json(
    //     { error: 'Não é possível excluir esta receita pois ela é usada em produtos' },
    //     { status: 400 }
    //   );
    // }

    await ReceitaIntermediaria.findByIdAndDelete(params.id);

    return NextResponse.json({ message: 'Receita excluída com sucesso' });
  } catch (error) {
    console.error('Erro ao excluir receita:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}