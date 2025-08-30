import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import IngredienteSecao from '@/models/IngredienteSecao';
import ItemBase from '@/models/ItemBase';
import Secao from '@/models/Secao';
import { auth } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    
    // Verificar autenticação
    const session = await auth();
    if (!session?.user?.companyId) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const secaoId = searchParams.get('secao');

    // Construir filtros
    const filtros: any = { companyId: session.user.companyId };
    
    if (secaoId) {
      filtros.secao = secaoId;
    }

    const ingredientes = await IngredienteSecao.find(filtros)
      .populate('secao', 'nome cor icone')
      .populate('itemBase', 'nome unidadeMedida categoria precoMedioCompra estoqueAtual controleEstoque')
      .sort({ 'secao.nome': 1, nomeIngrediente: 1 });

    return NextResponse.json(ingredientes);
  } catch (error) {
    console.error('Erro ao buscar ingredientes de seção:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    
    // Verificar autenticação
    const session = await auth();
    if (!session?.user?.companyId) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const data = await req.json();
    
    // Validações básicas
    if (!data.secao || !data.itemBase) {
      return NextResponse.json(
        { error: 'Seção e Item Base são obrigatórios' },
        { status: 400 }
      );
    }

    if (!data.nomeIngrediente || data.nomeIngrediente.trim().length === 0) {
      return NextResponse.json(
        { error: 'Nome do ingrediente é obrigatório' },
        { status: 400 }
      );
    }

    // Verificar se a seção existe
    const secao = await Secao.findOne({
      _id: data.secao,
      companyId: session.user.companyId
    });

    if (!secao) {
      return NextResponse.json(
        { error: 'Seção não encontrada' },
        { status: 400 }
      );
    }

    // Verificar se o item base existe
    const itemBase = await ItemBase.findOne({
      _id: data.itemBase,
      companyId: session.user.companyId
    });

    if (!itemBase) {
      return NextResponse.json(
        { error: 'Item base não encontrado' },
        { status: 400 }
      );
    }

    // Verificar se já existe um ingrediente com o mesmo item base na mesma seção
    const ingredienteExistente = await IngredienteSecao.findOne({
      companyId: session.user.companyId,
      secao: data.secao,
      itemBase: data.itemBase
    });

    if (ingredienteExistente) {
      return NextResponse.json(
        { error: 'Este item já está cadastrado como ingrediente nesta seção' },
        { status: 400 }
      );
    }

    // Criar ingrediente de seção
    const ingrediente = new IngredienteSecao({
      ...data,
      companyId: session.user.companyId,
      nomeIngrediente: data.nomeIngrediente.trim()
    });

    await ingrediente.save();

    // Buscar ingrediente criado com dados populados
    const ingredienteCriado = await IngredienteSecao.findById(ingrediente._id)
      .populate('secao', 'nome cor icone')
      .populate('itemBase', 'nome unidadeMedida categoria precoMedioCompra estoqueAtual controleEstoque');

    return NextResponse.json(ingredienteCriado, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar ingrediente de seção:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}