import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { dbConnect } from '@/lib/db';
import User from '@/models/User';
import Movimentacao from '@/models/Movimentacao';
import Product from '@/models/Product';
import Ingredient from '@/models/Ingredient';
import Fornecedor from '@/models/Fornecedor';

// GET - Listar movimentações do usuário
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
    const type = searchParams.get('type'); // entrada/saida
    const productType = searchParams.get('productType'); // ingredient/product
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const fornecedorId = searchParams.get('fornecedorId');
    const documentType = searchParams.get('documentType');
    const status = searchParams.get('status');
    const search = searchParams.get('search') || '';
    const limit = parseInt(searchParams.get('limit') || '50');
    const page = parseInt(searchParams.get('page') || '1');

    let query: any = { userId: user._id.toString() };
    
    if (type && type !== 'all') {
      query.type = type;
    }

    if (productType && productType !== 'all') {
      query.productType = productType;
    }

    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    if (fornecedorId && fornecedorId !== 'all') {
      query.fornecedorId = fornecedorId;
    }

    if (documentType && documentType !== 'all') {
      query.documentType = documentType;
    }

    if (status && status !== 'all') {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { productName: { $regex: search, $options: 'i' } },
        { fornecedorName: { $regex: search, $options: 'i' } },
        { reason: { $regex: search, $options: 'i' } },
        { documentNumber: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (page - 1) * limit;
    
    const [movimentacoes, total] = await Promise.all([
      Movimentacao.find(query)
        .sort({ date: -1, createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Movimentacao.countDocuments(query)
    ]);

    // Calcular estatísticas básicas
    const stats = await Movimentacao.aggregate([
      { $match: query },
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 },
          totalValue: { $sum: { $ifNull: ['$totalCost', '$totalValue'] } }
        }
      }
    ]);

    return NextResponse.json({
      success: true,
      movimentacoes,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      },
      stats: {
        entradas: stats.find(s => s._id === 'entrada') || { count: 0, totalValue: 0 },
        saidas: stats.find(s => s._id === 'saida') || { count: 0, totalValue: 0 }
      }
    });

  } catch (error) {
    console.error('Erro ao buscar movimentações:', error);
    return NextResponse.json({ 
      error: 'Erro interno do servidor' 
    }, { status: 500 });
  }
}

// POST - Criar nova movimentação
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const body = await request.json();
    const { 
      type,
      date,
      productId,
      productType,
      quantity,
      unit,
      unitCost,
      unitPrice,
      fornecedorId,
      customerId,
      documentType,
      documentNumber,
      documentDate,
      reason,
      observations,
      batch,
      expirationDate,
      location,
      autoUpdateStock = true // Se deve atualizar estoque automaticamente
    } = body;

    // Validações básicas
    if (!type || !productId || !quantity || !reason) {
      return NextResponse.json({ 
        error: 'Tipo, produto, quantidade e motivo são obrigatórios' 
      }, { status: 400 });
    }

    if (!['entrada', 'saida'].includes(type)) {
      return NextResponse.json({ 
        error: 'Tipo deve ser "entrada" ou "saida"' 
      }, { status: 400 });
    }

    if (quantity <= 0) {
      return NextResponse.json({ 
        error: 'Quantidade deve ser maior que zero' 
      }, { status: 400 });
    }

    await dbConnect();
    
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });
    }

    // Buscar dados do produto
    let product: any = null;
    let productName = '';
    let productUnit = unit || 'un';
    
    if (productType === 'ingredient') {
      product = await Ingredient.findOne({
        _id: productId,
        userId: user._id.toString()
      });
      if (product) {
        productName = product.name;
        productUnit = product.unit || productUnit;
      }
    } else if (productType === 'product') {
      product = await Product.findOne({
        _id: productId,
        $or: [
          { userId: user._id.toString() },
          { companyId: (user as any).companyId }
        ]
      });
      if (product) {
        productName = product.name;
      }
    }

    if (!product) {
      return NextResponse.json({ 
        error: 'Produto não encontrado' 
      }, { status: 404 });
    }

    // Buscar dados do fornecedor se especificado
    let fornecedorName = '';
    if (fornecedorId) {
      const fornecedor = await Fornecedor.findOne({
        _id: fornecedorId,
        userId: user._id.toString()
      });
      if (fornecedor) {
        fornecedorName = fornecedor.name;
      }
    }

    // Preparar dados da movimentação
    const movimentacaoData: any = {
      type,
      date: date ? new Date(date) : new Date(),
      productId,
      productName,
      productType: productType || 'ingredient',
      quantity: parseFloat(quantity),
      unit: productUnit,
      reason: reason.trim(),
      observations: observations?.trim(),
      batch: batch?.trim(),
      expirationDate: expirationDate ? new Date(expirationDate) : undefined,
      location: location?.trim() || 'Estoque Principal',
      documentType: documentType || 'interno',
      documentNumber: documentNumber?.trim(),
      documentDate: documentDate ? new Date(documentDate) : undefined,
      userId: user._id.toString(),
      performedBy: user._id.toString(),
      performedByName: (user as any).name || session.user.name || 'Usuário'
    };

    // Adicionar dados específicos por tipo
    if (type === 'entrada') {
      if (unitCost && unitCost > 0) {
        movimentacaoData.unitCost = parseFloat(unitCost);
        movimentacaoData.totalCost = movimentacaoData.quantity * movimentacaoData.unitCost;
      }
      if (fornecedorId) {
        movimentacaoData.fornecedorId = fornecedorId;
        movimentacaoData.fornecedorName = fornecedorName;
      }
    } else if (type === 'saida') {
      if (unitPrice && unitPrice > 0) {
        movimentacaoData.unitPrice = parseFloat(unitPrice);
        movimentacaoData.totalValue = movimentacaoData.quantity * movimentacaoData.unitPrice;
      }
      if (customerId) {
        movimentacaoData.customerId = customerId;
      }
    }

    // Adicionar companyId se o usuário tiver
    if ((user as any).companyId) {
      movimentacaoData.companyId = (user as any).companyId.toString();
    }

    // Verificar estoque para saídas
    if (type === 'saida' && autoUpdateStock && productType === 'ingredient') {
      if (product.quantity < movimentacaoData.quantity) {
        return NextResponse.json({ 
          error: `Estoque insuficiente. Disponível: ${product.quantity} ${productUnit}` 
        }, { status: 400 });
      }
    }

    // Criar movimentação
    const movimentacao = new Movimentacao(movimentacaoData);
    await movimentacao.save();

    // Atualizar estoque automaticamente se solicitado
    if (autoUpdateStock && productType === 'ingredient') {
      if (type === 'entrada') {
        product.quantity += movimentacaoData.quantity;
        
        // Atualizar preço médio se fornecido custo
        if (movimentacaoData.unitCost) {
          const totalCostOld = (product.quantity - movimentacaoData.quantity) * product.price;
          const totalCostNew = totalCostOld + movimentacaoData.totalCost;
          product.price = totalCostNew / product.quantity;
        }
        
        // Adicionar lote se especificado
        if (batch || expirationDate) {
          if (!product.batches) product.batches = [];
          product.batches.push({
            batch: batch,
            quantity: movimentacaoData.quantity,
            expirationDate: expirationDate ? new Date(expirationDate) : undefined,
            purchaseDate: movimentacaoData.date,
            unitCost: movimentacaoData.unitCost || product.price
          });
        }
      } else if (type === 'saida') {
        product.quantity -= movimentacaoData.quantity;
      }
      
      await product.save();
    }

    return NextResponse.json({
      success: true,
      message: 'Movimentação criada com sucesso',
      movimentacao,
      stockUpdated: autoUpdateStock && productType === 'ingredient'
    });

  } catch (error) {
    console.error('Erro ao criar movimentação:', error);
    return NextResponse.json({ 
      error: 'Erro interno do servidor' 
    }, { status: 500 });
  }
}
