import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import ReceitaIntermediaria from '@/models/ReceitaIntermediaria';
import IngredienteSecao from '@/models/IngredienteSecao';
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
    const categoria = searchParams.get('categoria');

    // Construir filtros
    const filtros: any = { companyId: session.user.companyId };
    
    if (categoria) {
      filtros.categoria = categoria;
    }

    const receitas = await ReceitaIntermediaria.find(filtros)
      .populate({
        path: 'ingredientes.ingrediente',
        populate: [
          { path: 'secao', select: 'nome cor icone' },
          { path: 'itemBase', select: 'nome unidadeMedida categoria precoMedioCompra' }
        ]
      })
      .sort({ categoria: 1, nome: 1 });

    return NextResponse.json(receitas);
  } catch (error) {
    console.error('Erro ao buscar receitas intermediárias:', error);
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
    if (!data.nome || data.nome.trim().length === 0) {
      return NextResponse.json(
        { error: 'Nome da receita é obrigatório' },
        { status: 400 }
      );
    }

    if (!data.categoria || data.categoria.trim().length === 0) {
      return NextResponse.json(
        { error: 'Categoria é obrigatória' },
        { status: 400 }
      );
    }

    if (!data.ingredientes || !Array.isArray(data.ingredientes) || data.ingredientes.length === 0) {
      return NextResponse.json(
        { error: 'É necessário informar pelo menos um ingrediente' },
        { status: 400 }
      );
    }

    if (!data.rendimento || data.rendimento <= 0) {
      return NextResponse.json(
        { error: 'Rendimento deve ser maior que zero' },
        { status: 400 }
      );
    }

    if (!data.unidadeRendimento) {
      return NextResponse.json(
        { error: 'Unidade de rendimento é obrigatória' },
        { status: 400 }
      );
    }

    // Validar ingredientes
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

    // Verificar se já existe uma receita com o mesmo nome
    const receitaExistente = await ReceitaIntermediaria.findOne({
      companyId: session.user.companyId,
      nome: data.nome.trim()
    });

    if (receitaExistente) {
      return NextResponse.json(
        { error: 'Já existe uma receita com este nome' },
        { status: 400 }
      );
    }

    // Calcular custo se não informado
    let custoPorUnidade = data.custoPorUnidade;
    if (!custoPorUnidade) {
      let custoTotal = 0;
      
      for (const ing of data.ingredientes) {
        const ingredienteSecao = await IngredienteSecao.findById(ing.ingrediente)
          .populate('itemBase', 'precoMedioCompra');
        
        if (ingredienteSecao?.itemBase?.precoMedioCompra) {
          custoTotal += ingredienteSecao.itemBase.precoMedioCompra * ing.quantidade;
        }
      }
      
      if (custoTotal > 0) {
        custoPorUnidade = custoTotal / data.rendimento;
      }
    }

    // Criar receita intermediária
    const receita = new ReceitaIntermediaria({
      ...data,
      companyId: session.user.companyId,
      nome: data.nome.trim(),
      categoria: data.categoria.trim(),
      custoPorUnidade
    });

    await receita.save();

    // Buscar receita criada com dados populados
    const receitaCriada = await ReceitaIntermediaria.findById(receita._id)
      .populate({
        path: 'ingredientes.ingrediente',
        populate: [
          { path: 'secao', select: 'nome cor icone' },
          { path: 'itemBase', select: 'nome unidadeMedida categoria precoMedioCompra' }
        ]
      });

    return NextResponse.json(receitaCriada, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar receita intermediária:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}