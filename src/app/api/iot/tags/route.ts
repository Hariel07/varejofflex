import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db';
import IotTag from '@/models/iot/Tag';
import IotProduct from '@/models/iot/Product';
import IotLog from '@/models/iot/Log';

// Criar tag
export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    const { 
      storeId, 
      productSku, 
      type, 
      serial,
      userId, 
      userRole 
    } = await request.json();
    
    // Validação básica
    if (!storeId || !productSku || !type || !serial) {
      return NextResponse.json({
        success: false,
        error: "storeId, productSku, type e serial são obrigatórios"
      }, { status: 400 });
    }

    // Verificar se produto existe
    const product = await IotProduct.findOne({ storeId, sku: productSku });
    if (!product) {
      return NextResponse.json({
        success: false,
        error: "Produto não encontrado"
      }, { status: 404 });
    }

    // Verificar se serial já existe
    const existingTag = await IotTag.findOne({ serial });
    if (existingTag) {
      return NextResponse.json({
        success: false,
        error: "Serial já existe"
      }, { status: 400 });
    }

    // Gerar ID único
    const tagId = `tag_${type}_${Date.now()}`;
    
    // Gerar URL do deep-link
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://varejoflex.com';
    const deepLinkUrl = `${baseUrl}/p/${storeId}/${productSku}?tag=${tagId}`;

    // Criar tag
    const tag = new IotTag({
      _id: tagId,
      storeId,
      productId: product._id,
      type,
      serial,
      url: deepLinkUrl,
      status: 'active',
      lastSeen: new Date(),
      health: {
        batteryPct: type === 'ble' ? 100 : null,
        rssiAvg: null,
        errors: 0
      },
      config: {
        txPower: type === 'ble' ? 0 : null,
        beaconIntervalMs: type === 'ble' ? 1000 : null
      }
    });

    await tag.save();

    // Log da ação
    await new IotLog({
      storeId,
      actor: { userId: userId || 'system', role: userRole || 'user' },
      action: 'create',
      entity: 'tag',
      entityId: tagId,
      after: tag.toObject(),
      notes: `Tag ${type} criada para produto ${productSku}`,
      ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '',
      userAgent: request.headers.get('user-agent') || ''
    }).save();

    return NextResponse.json({
      success: true,
      data: {
        tag,
        product: {
          sku: product.sku,
          name: product.name
        },
        deepLink: deepLinkUrl
      }
    });

  } catch (error) {
    console.error('Erro ao criar tag:', error);
    return NextResponse.json({
      success: false,
      error: "Erro interno do servidor"
    }, { status: 500 });
  }
}

// Listar tags
export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    const url = new URL(request.url);
    const storeId = url.searchParams.get('storeId');
    const type = url.searchParams.get('type');
    const status = url.searchParams.get('status');
    const productSku = url.searchParams.get('productSku');
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
    
    if (type) filters.type = type;
    if (status) filters.status = status;
    
    // Se buscar por SKU, primeiro encontrar o produto
    if (productSku) {
      const product = await IotProduct.findOne({ storeId, sku: productSku });
      if (product) {
        filters.productId = product._id;
      } else {
        return NextResponse.json({
          success: true,
          data: { tags: [], pagination: { page, limit, total: 0, pages: 0 } }
        });
      }
    }

    // Buscar tags com paginação
    const [tags, total] = await Promise.all([
      IotTag
        .find(filters)
        .populate('productId', 'sku name price')
        .sort({ lastSeen: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      IotTag.countDocuments(filters)
    ]);

    return NextResponse.json({
      success: true,
      data: {
        tags,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });

  } catch (error) {
    console.error('Erro ao listar tags:', error);
    return NextResponse.json({
      success: false,
      error: "Erro interno do servidor"
    }, { status: 500 });
  }
}
