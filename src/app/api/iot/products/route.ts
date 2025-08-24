import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import IotProduct from '@/models/iot/Product';
import IotLog from '@/models/iot/Log';
import { v4 as uuidv4 } from 'uuid';

// Criar produto
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const { 
      storeId, 
      sku, 
      name, 
      price, 
      batch, 
      expiry, 
      qty, 
      category, 
      brand,
      userId, 
      userRole 
    } = await request.json();
    
    // Validação básica
    if (!storeId || !sku || !name || typeof price !== 'number') {
      return NextResponse.json({
        success: false,
        error: "storeId, sku, name e price são obrigatórios"
      }, { status: 400 });
    }

    // Verificar se SKU já existe
    const existingProduct = await IotProduct.findOne({ storeId, sku });
    if (existingProduct) {
      return NextResponse.json({
        success: false,
        error: "SKU já existe nesta loja"
      }, { status: 400 });
    }

    // Gerar ID único
    const productId = `prod_${sku}_${Date.now()}`;

    // Criar produto
    const product = new IotProduct({
      _id: productId,
      storeId,
      sku,
      name,
      price,
      batch: batch || "",
      expiry: expiry ? new Date(expiry) : null,
      qty: qty || 0,
      attrs: {
        brand: brand || "",
        category: category || "",
        weight: null,
        unit: "un"
      }
    });

    await product.save();

    // Log da ação
    await new IotLog({
      storeId,
      actor: { userId: userId || 'system', role: userRole || 'user' },
      action: 'create',
      entity: 'product',
      entityId: productId,
      after: product.toObject(),
      notes: `Produto ${sku} criado`,
      ip: request.ip || '',
      userAgent: request.headers.get('user-agent') || ''
    }).save();

    return NextResponse.json({
      success: true,
      data: product
    });

  } catch (error) {
    console.error('Erro ao criar produto:', error);
    return NextResponse.json({
      success: false,
      error: "Erro interno do servidor"
    }, { status: 500 });
  }
}

// Listar produtos
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const url = new URL(request.url);
    const storeId = url.searchParams.get('storeId');
    const category = url.searchParams.get('category');
    const search = url.searchParams.get('search');
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = Math.min(parseInt(url.searchParams.get('limit') || '20'), 100);
    
    if (!storeId) {
      return NextResponse.json({
        success: false,
        error: "storeId é obrigatório"
      }, { status: 400 });
    }

    // Construir filtros
    const filters: any = { storeId };
    
    if (category) {
      filters['attrs.category'] = category;
    }
    
    if (search) {
      filters.$or = [
        { sku: { $regex: search, $options: 'i' } },
        { name: { $regex: search, $options: 'i' } },
        { 'attrs.brand': { $regex: search, $options: 'i' } }
      ];
    }

    // Buscar produtos com paginação
    const [products, total] = await Promise.all([
      IotProduct
        .find(filters)
        .sort({ updatedAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      IotProduct.countDocuments(filters)
    ]);

    return NextResponse.json({
      success: true,
      data: {
        products,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });

  } catch (error) {
    console.error('Erro ao listar produtos:', error);
    return NextResponse.json({
      success: false,
      error: "Erro interno do servidor"
    }, { status: 500 });
  }
}