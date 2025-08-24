import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db';
import IotProduct from '@/models/iot/Product';
import IotTag from '@/models/iot/Tag';
import IotEvent from '@/models/iot/Event';
import IotLog from '@/models/iot/Log';

// Inventário rápido via QR/NFC scan
export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    const { storeId, scans, userId, userRole } = await request.json();
    
    if (!storeId || !Array.isArray(scans)) {
      return NextResponse.json({
        success: false,
        error: "storeId e scans são obrigatórios"
      }, { status: 400 });
    }

    const results = [];
    const events = [];

    for (const scan of scans) {
      try {
        const { tagId, sku, qty, location, notes } = scan;
        
        if (!tagId && !sku) {
          results.push({
            success: false,
            error: "tagId ou sku obrigatório",
            scan
          });
          continue;
        }

        let product;
        let tag;

        // Buscar por tag primeiro
        if (tagId) {
          tag = await IotTag.findOne({ _id: tagId, storeId });
          if (tag) {
            product = await IotProduct.findById(tag.productId);
          }
        }

        // Buscar por SKU se não encontrou por tag
        if (!product && sku) {
          product = await IotProduct.findOne({ storeId, sku });
        }

        if (!product) {
          results.push({
            success: false,
            error: "Produto não encontrado",
            scan
          });
          continue;
        }

        // Atualizar quantidade se fornecida
        if (typeof qty === 'number') {
          const oldQty = product.qty;
          product.qty = qty;
          product.updatedAt = new Date();
          await product.save();

          // Evento de atualização de estoque
          events.push({
            ts: new Date(),
            storeId,
            type: 'inventory_update',
            severity: 'info',
            context: {
              productId: product._id,
              sku: product.sku,
              oldQty,
              newQty: qty,
              location: location || 'unknown',
              tagId: tagId || null,
              method: 'scan'
            }
          });
        }

        // Atualizar tag se encontrada
        if (tag) {
          tag.lastSeen = new Date();
          tag.status = 'active';
          await tag.save();
        }

        results.push({
          success: true,
          product: {
            id: product._id,
            sku: product.sku,
            name: product.name,
            qty: product.qty,
            price: product.price
          },
          tag: tag ? {
            id: tag._id,
            type: tag.type,
            serial: tag.serial,
            lastSeen: tag.lastSeen
          } : null,
          scan
        });

      } catch (error) {
        console.error('Erro ao processar scan:', error);
        results.push({
          success: false,
          error: "Erro ao processar scan",
          scan
        });
      }
    }

    // Salvar eventos
    if (events.length > 0) {
      await IotEvent.insertMany(events);
    }

    // Log da operação
    await new IotLog({
      storeId,
      actor: { userId: userId || 'system', role: userRole || 'user' },
      action: 'import',
      entity: 'product',
      entityId: 'bulk_scan',
      after: { scansProcessed: results.length, successCount: results.filter(r => r.success).length },
      notes: `Inventário rápido: ${scans.length} scans processados`,
      ip: '',
      userAgent: request.headers.get('user-agent') || ''
    }).save();

    return NextResponse.json({
      success: true,
      data: {
        results,
        summary: {
          total: scans.length,
          success: results.filter(r => r.success).length,
          failed: results.filter(r => !r.success).length
        }
      }
    });

  } catch (error) {
    console.error('Erro no inventário rápido:', error);
    return NextResponse.json({
      success: false,
      error: "Erro interno do servidor"
    }, { status: 500 });
  }
}
