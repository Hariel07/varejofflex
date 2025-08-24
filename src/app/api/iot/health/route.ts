import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db';
import IotGateway from '@/models/iot/Gateway';
import IotTag from '@/models/iot/Tag';
import IotEvent from '@/models/iot/Event';
import IotProduct from '@/models/iot/Product';

// Retorna status de tags/gateways e estatísticas
export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    const url = new URL(request.url);
    const storeId = url.searchParams.get('storeId');
    
    if (!storeId) {
      return NextResponse.json({
        success: false,
        error: "storeId é obrigatório"
      }, { status: 400 });
    }

    // Buscar estatísticas em paralelo
    const [
      gateways,
      tags,
      products,
      todayEvents,
      unresolvedEvents,
      criticalEvents
    ] = await Promise.all([
      // Gateways
      IotGateway.find({ storeId }),
      
      // Tags
      IotTag.find({ storeId }),
      
      // Produtos
      IotProduct.find({ storeId }),
      
      // Eventos de hoje
      IotEvent.countDocuments({
        storeId,
        ts: { 
          $gte: new Date(new Date().setHours(0, 0, 0, 0)) 
        }
      }),
      
      // Eventos não resolvidos
      IotEvent.countDocuments({
        storeId,
        resolved: false
      }),
      
      // Eventos críticos não resolvidos
      IotEvent.countDocuments({
        storeId,
        severity: 'critical',
        resolved: false
      })
    ]);

    // Processar estatísticas de gateways
    const gatewayStats = {
      total: gateways.length,
      online: gateways.filter(g => g.status === 'online').length,
      offline: gateways.filter(g => g.status === 'offline').length
    };

    // Processar estatísticas de tags
    const tagStats = {
      total: tags.length,
      active: tags.filter(t => t.status === 'active').length,
      lowBattery: tags.filter(t => 
        t.health.batteryPct !== null && 
        t.health.batteryPct < 20
      ).length
    };

    // Processar estatísticas de produtos
    const trackedProducts = tags.length; // Produtos com tag = rastreados
    const productStats = {
      total: products.length,
      tracked: trackedProducts
    };

    // Estatísticas de eventos
    const eventStats = {
      today: todayEvents,
      unresolved: unresolvedEvents,
      critical: criticalEvents
    };

    // Buscar últimos eventos para timeline
    const recentEvents = await IotEvent
      .find({ storeId })
      .sort({ ts: -1 })
      .limit(10)
      .lean();

    // Verificar tags com problemas de saúde
    const healthIssues = [];
    
    // Tags com bateria baixa
    const lowBatteryTags = tags.filter(t => 
      t.health.batteryPct !== null && 
      t.health.batteryPct < 20
    );
    
    if (lowBatteryTags.length > 0) {
      healthIssues.push({
        type: 'battery_low',
        count: lowBatteryTags.length,
        message: `${lowBatteryTags.length} tags com bateria baixa`,
        severity: 'warn'
      });
    }

    // Tags não vistas recentemente (> 24h)
    const staleThreshold = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const staleTags = tags.filter(t => 
      t.status === 'active' && 
      t.lastSeen < staleThreshold
    );
    
    if (staleTags.length > 0) {
      healthIssues.push({
        type: 'tags_stale',
        count: staleTags.length,
        message: `${staleTags.length} tags não vistas há mais de 24h`,
        severity: 'warn'
      });
    }

    // Gateways offline
    const offlineGateways = gateways.filter(g => g.status === 'offline');
    if (offlineGateways.length > 0) {
      healthIssues.push({
        type: 'gateways_offline',
        count: offlineGateways.length,
        message: `${offlineGateways.length} gateways offline`,
        severity: 'critical'
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        gateways: gatewayStats,
        tags: tagStats,
        events: eventStats,
        products: productStats,
        recentEvents: recentEvents.map(event => ({
          id: event._id,
          type: event.type,
          severity: event.severity,
          ts: event.ts,
          context: event.context
        })),
        healthIssues,
        lastUpdated: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Erro ao buscar health status:', error);
    return NextResponse.json({
      success: false,
      error: "Erro interno do servidor"
    }, { status: 500 });
  }
}
