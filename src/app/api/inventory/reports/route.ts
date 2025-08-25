import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { dbConnect } from '@/lib/db';
import User from '@/models/User';
import Ingredient from '@/models/Ingredient';
import Purchase from '@/models/Purchase';

interface IIngredientBatch {
  quantity: number;
  unitCost: number;
  batch?: string;
  expirationDate?: Date;
  receivedDate: Date;
  supplier?: string;
}

// GET - Relatório de estoque
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
    const reportType = searchParams.get('type') || 'current'; // current, low-stock, expiring, batches

    const userId = user._id.toString();

    if (reportType === 'current') {
      // Estoque atual
      const ingredients = await Ingredient.find({ userId }).sort({ name: 1 });
      
      const stockReport = ingredients.map(ingredient => {
        const totalValue = ingredient.quantity * ingredient.price;
        const isLowStock = ingredient.minimumStock && ingredient.quantity <= ingredient.minimumStock;
        
        return {
          _id: ingredient._id,
          name: ingredient.name,
          currentStock: ingredient.quantity,
          unit: ingredient.unit,
          averagePrice: ingredient.price,
          totalValue,
          minimumStock: ingredient.minimumStock || 0,
          isLowStock,
          supplier: ingredient.supplier,
          batchCount: ingredient.batches?.length || 0
        };
      });

      const totalInventoryValue = stockReport.reduce((sum, item) => sum + item.totalValue, 0);
      const lowStockItems = stockReport.filter(item => item.isLowStock);

      return NextResponse.json({
        success: true,
        data: {
          summary: {
            totalItems: stockReport.length,
            totalValue: totalInventoryValue,
            lowStockItemsCount: lowStockItems.length
          },
          items: stockReport,
          lowStockItems
        }
      });

    } else if (reportType === 'low-stock') {
      // Apenas itens com estoque baixo
      const ingredients = await Ingredient.find({
        userId,
        $expr: { $lte: ['$quantity', { $ifNull: ['$minimumStock', 0] }] }
      }).sort({ name: 1 });

      const lowStockReport = ingredients.map(ingredient => ({
        _id: ingredient._id,
        name: ingredient.name,
        currentStock: ingredient.quantity,
        minimumStock: ingredient.minimumStock || 0,
        unit: ingredient.unit,
        shortage: (ingredient.minimumStock || 0) - ingredient.quantity,
        supplier: ingredient.supplier
      }));

      return NextResponse.json({
        success: true,
        data: {
          items: lowStockReport,
          totalItemsWithLowStock: lowStockReport.length
        }
      });

    } else if (reportType === 'expiring') {
      // Itens próximos ao vencimento
      const daysAhead = parseInt(searchParams.get('days') || '30');
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() + daysAhead);

      const ingredients = await Ingredient.find({
        userId,
        'batches.expirationDate': { $lte: cutoffDate, $exists: true }
      }).sort({ name: 1 });

      const expiringItems = ingredients.flatMap(ingredient => 
        ingredient.batches
          ?.filter((batch: IIngredientBatch) => batch.expirationDate && batch.expirationDate <= cutoffDate)
          .map((batch: IIngredientBatch) => ({
            ingredientId: ingredient._id,
            ingredientName: ingredient.name,
            batch: batch.batch,
            quantity: batch.quantity,
            unit: ingredient.unit,
            expirationDate: batch.expirationDate,
            daysUntilExpiration: Math.ceil((batch.expirationDate!.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)),
            unitCost: batch.unitCost,
            totalValue: batch.quantity * batch.unitCost
          })) || []
      );

      return NextResponse.json({
        success: true,
        data: {
          items: expiringItems,
          totalExpiringItems: expiringItems.length,
          totalExpiringValue: expiringItems.reduce((sum, item) => sum + item.totalValue, 0)
        }
      });

    } else if (reportType === 'batches') {
      // Relatório detalhado de lotes
      const ingredients = await Ingredient.find({
        userId,
        batches: { $exists: true, $ne: [] }
      }).sort({ name: 1 });

      const batchReport = ingredients.flatMap(ingredient =>
        ingredient.batches?.map((batch: IIngredientBatch) => ({
          ingredientId: ingredient._id,
          ingredientName: ingredient.name,
          batch: batch.batch || 'Sem lote',
          quantity: batch.quantity,
          unit: ingredient.unit,
          unitCost: batch.unitCost,
          totalValue: batch.quantity * batch.unitCost,
          receivedDate: batch.receivedDate,
          expirationDate: batch.expirationDate,
          daysUntilExpiration: batch.expirationDate 
            ? Math.ceil((batch.expirationDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
            : null
        })) || []
      );

      return NextResponse.json({
        success: true,
        data: {
          items: batchReport,
          totalBatches: batchReport.length,
          totalBatchValue: batchReport.reduce((sum, item) => sum + item.totalValue, 0)
        }
      });

    } else if (reportType === 'purchases-summary') {
      // Resumo de compras por período
      const startDate = searchParams.get('startDate');
      const endDate = searchParams.get('endDate');
      
      let dateFilter: any = {};
      if (startDate && endDate) {
        dateFilter.purchaseDate = {
          $gte: new Date(startDate),
          $lte: new Date(endDate)
        };
      }

      const purchases = await Purchase.find({
        userId,
        status: 'received',
        ...dateFilter
      });

      const totalPurchases = purchases.length;
      const totalAmount = purchases.reduce((sum, purchase) => sum + purchase.totalAmount, 0);
      
      // Agrupar por fornecedor
      const supplierSummary = purchases.reduce((acc: any, purchase) => {
        const supplier = purchase.supplier || 'Sem fornecedor';
        if (!acc[supplier]) {
          acc[supplier] = { count: 0, totalAmount: 0 };
        }
        acc[supplier].count++;
        acc[supplier].totalAmount += purchase.totalAmount;
        return acc;
      }, {});

      return NextResponse.json({
        success: true,
        data: {
          summary: {
            totalPurchases,
            totalAmount,
            averagePurchaseValue: totalPurchases > 0 ? totalAmount / totalPurchases : 0
          },
          supplierSummary: Object.entries(supplierSummary).map(([supplier, data]: [string, any]) => ({
            supplier,
            purchaseCount: data.count,
            totalAmount: data.totalAmount,
            averageAmount: data.totalAmount / data.count
          }))
        }
      });

    } else {
      return NextResponse.json({ 
        error: 'Tipo de relatório inválido' 
      }, { status: 400 });
    }

  } catch (error) {
    console.error('Erro ao gerar relatório de estoque:', error);
    return NextResponse.json({ 
      error: 'Erro interno do servidor' 
    }, { status: 500 });
  }
}