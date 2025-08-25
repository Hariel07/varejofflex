import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { dbConnect } from '@/lib/db';
import User from '@/models/User';
import Purchase from '@/models/Purchase';
import Ingredient from '@/models/Ingredient';

// GET - Listar compras do usuário
export async function GET(request: NextRequest) {
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

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const supplier = searchParams.get('supplier');

    let query: any = { userId: user._id.toString() };
    
    if (status) {
      query.status = status;
    }

    if (startDate && endDate) {
      query.purchaseDate = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    if (supplier) {
      query.supplier = { $regex: supplier, $options: 'i' };
    }

    const purchases = await Purchase.find(query)
      .sort({ purchaseDate: -1 })
      .limit(100);

    return NextResponse.json({
      success: true,
      purchases
    });

  } catch (error) {
    console.error('Erro ao buscar compras:', error);
    return NextResponse.json({ 
      error: 'Erro interno do servidor' 
    }, { status: 500 });
  }
}

// POST - Criar nova compra
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const body = await request.json();
    const { 
      purchaseNumber, 
      supplier, 
      purchaseDate, 
      items, 
      notes, 
      invoice,
      autoReceive = false // Se deve dar entrada automática no estoque
    } = body;

    // Validações
    if (!purchaseNumber || !items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ 
        error: 'Número da compra e itens são obrigatórios' 
      }, { status: 400 });
    }

    // Validar itens
    for (const item of items) {
      if (!item.ingredientId || !item.quantity || item.quantity <= 0 || !item.unitCost || item.unitCost <= 0) {
        return NextResponse.json({ 
          error: 'Todos os itens devem ter ingrediente, quantidade e custo válidos' 
        }, { status: 400 });
      }
    }

    await dbConnect();
    
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });
    }

    // Verificar se já existe compra com o mesmo número
    const existingPurchase = await Purchase.findOne({
      userId: user._id.toString(),
      purchaseNumber: { $regex: `^${purchaseNumber}$`, $options: 'i' }
    });

    if (existingPurchase) {
      return NextResponse.json({ 
        error: 'Já existe uma compra com este número' 
      }, { status: 409 });
    }

    // Verificar se todos os ingredientes existem
    const ingredientIds = items.map((item: any) => item.ingredientId);
    const validIngredients = await Ingredient.find({
      _id: { $in: ingredientIds },
      userId: user._id.toString()
    });

    if (validIngredients.length !== ingredientIds.length) {
      return NextResponse.json({ 
        error: 'Um ou mais ingredientes não são válidos' 
      }, { status: 400 });
    }

    // Criar mapa de ingredientes para validação
    const ingredientMap = new Map(validIngredients.map(ing => [ing._id!.toString(), ing]));

    // Processar itens e calcular totais
    const processedItems = items.map((item: any) => {
      const ingredient = ingredientMap.get(item.ingredientId);
      const totalCost = item.quantity * item.unitCost;
      
      return {
        ingredientId: item.ingredientId,
        ingredientName: ingredient?.name || 'Ingrediente não encontrado',
        quantity: parseFloat(item.quantity),
        unit: item.unit || ingredient?.unit || 'un',
        unitCost: parseFloat(item.unitCost),
        totalCost,
        batch: item.batch?.trim(),
        expirationDate: item.expirationDate ? new Date(item.expirationDate) : undefined
      };
    });

    const totalAmount = processedItems.reduce((sum, item) => sum + item.totalCost, 0);

    // Criar compra
    const purchase = new Purchase({
      purchaseNumber: purchaseNumber.trim(),
      supplier: supplier?.trim(),
      purchaseDate: purchaseDate ? new Date(purchaseDate) : new Date(),
      items: processedItems,
      totalAmount,
      status: autoReceive ? 'received' : 'pending',
      notes: notes?.trim(),
      invoice: invoice?.trim(),
      userId: user._id.toString()
    });

    await purchase.save();

    // Se autoReceive = true, dar entrada no estoque automaticamente
    if (autoReceive) {
      for (const item of processedItems) {
        const ingredient = await Ingredient.findById(item.ingredientId);
        if (ingredient) {
          // Adicionar ao estoque total
          ingredient.quantity += item.quantity;
          
          // Atualizar preço médio (média ponderada)
          const totalCostOld = (ingredient.quantity - item.quantity) * ingredient.price;
          const totalCostNew = totalCostOld + item.totalCost;
          ingredient.price = totalCostNew / ingredient.quantity;

          // Adicionar lote se especificado
          if (item.batch || item.expirationDate) {
            if (!ingredient.batches) ingredient.batches = [];
            ingredient.batches.push({
              batch: item.batch,
              quantity: item.quantity,
              expirationDate: item.expirationDate,
              purchaseDate: purchase.purchaseDate,
              unitCost: item.unitCost
            });
          }

          await ingredient.save();
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: `Compra ${autoReceive ? 'criada e recebida' : 'criada'} com sucesso`,
      purchase
    });

  } catch (error) {
    console.error('Erro ao criar compra:', error);
    return NextResponse.json({ 
      error: 'Erro interno do servidor' 
    }, { status: 500 });
  }
}