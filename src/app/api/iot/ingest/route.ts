import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db';
import IotTelemetry from '@/models/iot/Telemetry';
import IotEvent from '@/models/iot/Event';
import IotTag from '@/models/iot/Tag';
import IotGateway from '@/models/iot/Gateway';

// Ingestão HTTP de telemetria
export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({
        success: false,
        error: "Token de autorização necessário"
      }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    
    // Verificar se o token é válido
    const gateway = await IotGateway.findOne({ token });
    if (!gateway) {
      return NextResponse.json({
        success: false,
        error: "Token inválido"
      }, { status: 401 });
    }

    const readings = await request.json();
    
    // Validar formato
    if (!Array.isArray(readings)) {
      return NextResponse.json({
        success: false,
        error: "Payload deve ser um array de readings"
      }, { status: 400 });
    }

    const processedReadings = [];
    const events = [];

    for (const reading of readings) {
      try {
        // Validar campos obrigatórios
        if (!reading.tagId || !reading.metric || typeof reading.value !== 'number') {
          continue; // Pular reading inválido
        }

        // Verificar se tag existe
        const tag = await IotTag.findById(reading.tagId);
        if (!tag || tag.storeId !== gateway.storeId) {
          continue; // Pular tag inexistente ou de outra loja
        }

        // Criar telemetria
        const telemetry = new IotTelemetry({
          ts: reading.ts ? new Date(reading.ts) : new Date(),
          storeId: gateway.storeId,
          source: gateway._id,
          tagId: reading.tagId,
          metric: reading.metric,
          value: reading.value,
          unit: reading.unit || getDefaultUnit(reading.metric),
          extra: reading.extra || {}
        });

        await telemetry.save();
        processedReadings.push(telemetry);

        // Atualizar lastSeen da tag
        tag.lastSeen = telemetry.ts;
        
        // Atualizar health da tag
        if (reading.metric === 'battery') {
          tag.health.batteryPct = reading.value;
          
          // Alerta de bateria baixa
          if (reading.value < 20) {
            events.push({
              ts: telemetry.ts,
              storeId: gateway.storeId,
              type: 'battery_low',
              severity: 'warn',
              context: {
                tagId: reading.tagId,
                batteryPct: reading.value,
                gatewayId: gateway._id
              }
            });
          }
        } else if (reading.metric === 'rssi') {
          tag.health.rssiAvg = reading.value;
          
          // Lógica de detecção de roubo simplificada
          if (gateway.calib.portalThreshold && reading.value > gateway.calib.portalThreshold) {
            // Tag forte no portal - verificar se saiu sem checkout
            const recentCheckout = await IotEvent.findOne({
              storeId: gateway.storeId,
              type: 'checkout_pass',
              'context.tagId': reading.tagId,
              ts: { $gte: new Date(Date.now() - 5 * 60 * 1000) } // Últimos 5min
            });

            if (!recentCheckout) {
              events.push({
                ts: telemetry.ts,
                storeId: gateway.storeId,
                type: 'theft_suspect',
                severity: 'critical',
                context: {
                  tagId: reading.tagId,
                  rssi: reading.value,
                  gatewayId: gateway._id,
                  reason: 'exit_without_checkout'
                }
              });
            }
          }
        }

        await tag.save();

      } catch (error) {
        console.error('Erro ao processar reading:', error);
        // Continuar processando outros readings
      }
    }

    // Salvar eventos em batch
    if (events.length > 0) {
      await IotEvent.insertMany(events);
    }

    // Atualizar status do gateway
    gateway.status = 'online';
    gateway.lastSeen = new Date();
    await gateway.save();

    return NextResponse.json({
      success: true,
      data: {
        processed: processedReadings.length,
        events: events.length,
        gatewayId: gateway._id
      }
    });

  } catch (error) {
    console.error('Erro na ingestão:', error);
    return NextResponse.json({
      success: false,
      error: "Erro interno do servidor"
    }, { status: 500 });
  }
}

function getDefaultUnit(metric: string): string {
  const units: Record<string, string> = {
    rssi: 'dBm',
    temp: 'C',
    weight: 'kg',
    battery: 'pct',
    gps: 'deg'
  };
  return units[metric] || '';
}
