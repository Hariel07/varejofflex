import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db';
import IotGateway from '@/models/iot/Gateway';
import IotLog from '@/models/iot/Log';

// Iniciar sessão de calibração BLE
export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    const { storeId, gatewayId, zones, userId, userRole } = await request.json();
    
    if (!storeId || !gatewayId || !Array.isArray(zones)) {
      return NextResponse.json({
        success: false,
        error: "storeId, gatewayId e zones são obrigatórios"
      }, { status: 400 });
    }

    // Verificar se gateway existe
    const gateway = await IotGateway.findOne({ _id: gatewayId, storeId });
    if (!gateway) {
      return NextResponse.json({
        success: false,
        error: "Gateway não encontrado"
      }, { status: 404 });
    }

    // Preparar estrutura de calibração
    const calibrationZones = zones.map((zone: any) => ({
      zoneId: zone.id || zone.name.toLowerCase().replace(/\s+/g, '_'),
      name: zone.name,
      rssiRef: [] // Será preenchido durante coleta
    }));

    // Atualizar gateway com zonas preparadas
    gateway.calib.zones = calibrationZones;
    gateway.calib.portalThreshold = -60; // Default
    gateway.calib.hysteresisDb = 6;
    gateway.calib.smoothing = { window: 5 };
    
    await gateway.save();

    // Log da ação
    await new IotLog({
      storeId,
      actor: { userId: userId || 'system', role: userRole || 'admin' },
      action: 'calibrate',
      entity: 'gateway',
      entityId: gatewayId,
      after: { zones: calibrationZones },
      notes: `Iniciada calibração para ${zones.length} zonas`,
      ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '',
      userAgent: request.headers.get('user-agent') || ''
    }).save();

    return NextResponse.json({
      success: true,
      data: {
        sessionId: `calib_${gatewayId}_${Date.now()}`,
        gatewayId,
        zones: calibrationZones,
        instructions: [
          "1. Pegue uma tag BLE de teste",
          "2. Vá para cada zona marcada",
          "3. Permaneça 30 segundos em cada zona",
          "4. Clique 'Coletar Amostras' em cada zona",
          "5. Finalize a calibração"
        ]
      }
    });

  } catch (error) {
    console.error('Erro ao iniciar calibração:', error);
    return NextResponse.json({
      success: false,
      error: "Erro interno do servidor"
    }, { status: 500 });
  }
}
