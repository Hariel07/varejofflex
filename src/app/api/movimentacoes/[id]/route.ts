import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Movimentacao from '@/models/Movimentacao';
import ItemBase from '@/models/ItemBase';
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

    const movimentacao = await Movimentacao.findOne({
      _id: params.id,
      companyId: session.user.companyId
    })
      .populate('fornecedor', 'nome tipo')
      .populate('itens.item', 'nome unidadeMedida categoria');

    if (!movimentacao) {
      return NextResponse.json(
        { error: 'Movimentação não encontrada' },
        { status: 404 }
      );
    }

    return NextResponse.json(movimentacao);
  } catch (error) {
    console.error('Erro ao buscar movimentação:', error);
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

    // Buscar movimentação atual
    const movimentacaoAtual = await Movimentacao.findOne({
      _id: params.id,
      companyId: session.user.companyId
    });

    if (!movimentacaoAtual) {
      return NextResponse.json(
        { error: 'Movimentação não encontrada' },
        { status: 404 }
      );
    }

    // Reverter estoque da movimentação anterior (se necessário)
    if (movimentacaoAtual.tipo === 'entrada') {
      for (const item of movimentacaoAtual.itens) {
        const itemBase = await ItemBase.findById(item.item);
        if (itemBase && itemBase.controleEstoque) {
          itemBase.estoqueAtual = Math.max(0, (itemBase.estoqueAtual || 0) - item.quantidade);
          await itemBase.save();
        }
      }
    } else if (movimentacaoAtual.tipo === 'saida') {
      for (const item of movimentacaoAtual.itens) {
        const itemBase = await ItemBase.findById(item.item);
        if (itemBase && itemBase.controleEstoque) {
          itemBase.estoqueAtual = (itemBase.estoqueAtual || 0) + item.quantidade;
          await itemBase.save();
        }
      }
    }

    // Calcular valor total se não informado
    let valorTotal = data.valorTotal || 0;
    if (!valorTotal && data.itens && data.itens.some((item: any) => item.valorUnitario)) {
      valorTotal = data.itens.reduce((total: number, item: any) => {
        return total + (item.quantidade * (item.valorUnitario || 0));
      }, 0);
    }

    // Atualizar movimentação
    const movimentacaoAtualizada = await Movimentacao.findByIdAndUpdate(
      params.id,
      { ...data, valorTotal },
      { new: true, runValidators: true }
    );

    // Aplicar novo estoque
    if (data.itens && data.tipo) {
      if (data.tipo === 'entrada') {
        for (const item of data.itens) {
          const itemBase = await ItemBase.findById(item.item);
          if (itemBase && itemBase.controleEstoque) {
            itemBase.estoqueAtual = (itemBase.estoqueAtual || 0) + item.quantidade;
            
            // Atualizar preço médio se informado
            if (item.valorUnitario) {
              const estoqueAnterior = itemBase.estoqueAtual - item.quantidade;
              if (estoqueAnterior > 0) {
                const valorAnterior = (itemBase.precoMedioCompra || 0) * estoqueAnterior;
                const valorNovo = item.valorUnitario * item.quantidade;
                const novoPrecoMedio = (valorAnterior + valorNovo) / itemBase.estoqueAtual;
                itemBase.precoMedioCompra = novoPrecoMedio;
              } else {
                itemBase.precoMedioCompra = item.valorUnitario;
              }
            }
            
            await itemBase.save();
          }
        }
      } else if (data.tipo === 'saida') {
        for (const item of data.itens) {
          const itemBase = await ItemBase.findById(item.item);
          if (itemBase && itemBase.controleEstoque) {
            itemBase.estoqueAtual = Math.max(0, (itemBase.estoqueAtual || 0) - item.quantidade);
            await itemBase.save();
          }
        }
      }
    }

    // Buscar movimentação atualizada com dados populados
    const movimentacaoFinal = await Movimentacao.findById(params.id)
      .populate('fornecedor', 'nome tipo')
      .populate('itens.item', 'nome unidadeMedida categoria');

    return NextResponse.json(movimentacaoFinal);
  } catch (error) {
    console.error('Erro ao atualizar movimentação:', error);
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

    // Buscar movimentação atual
    const movimentacao = await Movimentacao.findOne({
      _id: params.id,
      companyId: session.user.companyId
    });

    if (!movimentacao) {
      return NextResponse.json(
        { error: 'Movimentação não encontrada' },
        { status: 404 }
      );
    }

    // Reverter estoque da movimentação
    if (movimentacao.tipo === 'entrada') {
      for (const item of movimentacao.itens) {
        const itemBase = await ItemBase.findById(item.item);
        if (itemBase && itemBase.controleEstoque) {
          itemBase.estoqueAtual = Math.max(0, (itemBase.estoqueAtual || 0) - item.quantidade);
          await itemBase.save();
        }
      }
    } else if (movimentacao.tipo === 'saida') {
      for (const item of movimentacao.itens) {
        const itemBase = await ItemBase.findById(item.item);
        if (itemBase && itemBase.controleEstoque) {
          itemBase.estoqueAtual = (itemBase.estoqueAtual || 0) + item.quantidade;
          await itemBase.save();
        }
      }
    }

    // Excluir movimentação
    await Movimentacao.findByIdAndDelete(params.id);

    return NextResponse.json({ message: 'Movimentação excluída com sucesso' });
  } catch (error) {
    console.error('Erro ao excluir movimentação:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}