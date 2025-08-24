import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db';
import IotProduct from '@/models/iot/Product';
import IotEvent from '@/models/iot/Event';

// Deep-link de produto/tag
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ storeId: string; sku: string }> }
) {
  try {
    await dbConnect();
    
    const { storeId, sku } = await params;
    const url = new URL(request.url);
    const tagId = url.searchParams.get('tag');
    const action = url.searchParams.get('action') || 'view';

    // Buscar produto
    const product = await IotProduct.findOne({ storeId, sku });
    if (!product) {
      return NextResponse.json({
        success: false,
        error: "Produto não encontrado"
      }, { status: 404 });
    }

    // Se tem tag, registrar evento
    if (tagId) {
      const eventType = action === 'checkout' ? 'checkout_pass' : 'tag_scan';
      
      await new IotEvent({
        ts: new Date(),
        storeId,
        type: eventType,
        severity: 'info',
        context: {
          tagId,
          sku,
          productId: product._id,
          action,
          userAgent: request.headers.get('user-agent') || '',
          ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || ''
        }
      }).save();
    }

    // Verificar se é uma requisição de API ou browser
    const acceptHeader = request.headers.get('accept') || '';
    
    if (acceptHeader.includes('application/json')) {
      // API - retornar JSON
      return NextResponse.json({
        success: true,
        data: {
          product,
          tagId,
          action,
          timestamp: new Date().toISOString()
        }
      });
    } else {
      // Browser - redirecionar para página do produto
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://varejoflex.com';
      const productUrl = `${baseUrl}/produto/${storeId}/${sku}${tagId ? `?tag=${tagId}` : ''}`;
      
      return NextResponse.redirect(productUrl);
    }

  } catch (error) {
    console.error('Erro no deep-link:', error);
    return NextResponse.json({
      success: false,
      error: "Erro interno do servidor"
    }, { status: 500 });
  }
}