import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { dbConnect } from '@/lib/db';
import User from '@/models/User';
import Purchase from '@/models/Purchase';
import Ingredient from '@/models/Ingredient';

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

// PUT - Receber compra (dar entrada no estoque)
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    await dbConnect();
    
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });
    }

    // Buscar compra
    const purchase = await Purchase.findOne({
      _id: id,
      userId: user._id.toString()
    });

    if (!purchase) {
      return NextResponse.json({ error: 'Compra não encontrada' }, { status: 404 });
    }

    if (purchase.status === 'received') {
      return NextResponse.json({ 
        error: 'Esta compra já foi recebida' 
      }, { status: 400 });
    }

    if (purchase.status === 'cancelled') {
      return NextResponse.json({ 
        error: 'Não é possível receber uma compra cancelada' 
      }, { status: 400 });
    }

    // Dar entrada no estoque para cada item
    for (const item of purchase.items) {
      const ingredient = await Ingredient.findOne({
        _id: item.ingredientId,
        userId: user._id.toString()
      });

      if (ingredient) {
        // Calcular novo preço médio ponderado
        const currentStockValue = ingredient.quantity * ingredient.price;
        const newStockValue = item.quantity * item.unitCost;
        const totalQuantity = ingredient.quantity + item.quantity;
        const newAveragePrice = totalQuantity > 0 ? (currentStockValue + newStockValue) / totalQuantity : item.unitCost;

        // Atualizar ingrediente
        ingredient.quantity += item.quantity;
        ingredient.price = newAveragePrice;

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

    // Atualizar status da compra
    purchase.status = 'received';
    await purchase.save();

    return NextResponse.json({
      success: true,
      message: 'Compra recebida e estoque atualizado com sucesso',
      purchase
    });

  } catch (error) {
    console.error('Erro ao receber compra:', error);
    return NextResponse.json({ 
      error: 'Erro interno do servidor' 
    }, { status: 500 });
  }
}

// DELETE - Cancelar compra
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    await dbConnect();
    
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });
    }

    // Buscar compra
    const purchase = await Purchase.findOne({
      _id: id,
      userId: user._id.toString()
    });

    if (!purchase) {
      return NextResponse.json({ error: 'Compra não encontrada' }, { status: 404 });
    }

    if (purchase.status === 'received') {
      return NextResponse.json({ 
        error: 'Não é possível cancelar uma compra já recebida' 
      }, { status: 400 });
    }

    // Cancelar compra
    purchase.status = 'cancelled';
    await purchase.save();

    return NextResponse.json({
      success: true,
      message: 'Compra cancelada com sucesso',
      purchase
    });

  } catch (error) {
    console.error('Erro ao cancelar compra:', error);
    return NextResponse.json({ 
      error: 'Erro interno do servidor' 
    }, { status: 500 });
  }
}