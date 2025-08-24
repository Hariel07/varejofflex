import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db';
import IotGateway from '@/models/iot/Gateway';
import IotEvent from '@/models/iot/Event';
import IotLog from '@/models/iot/Log';

// Finalizar e salvar calibração
export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    const { 
      storeId, 
      gatewayId, 
      portalThreshold = -60,
      hysteresisDb = 6,
      smoothingWindow = 5,
      userId, 
      userRole 
    } = await request.json();
    
    if (!storeId || !gatewayId) {
      return NextResponse.json({
        success: false,
        error: "storeId e gatewayId são obrigatórios"
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

    // Validar se todas as zonas foram calibradas
    const uncalibratedZones = gateway.calib.zones.filter((zone: any) => 
      !zone.rssiRef || zone.rssiRef.length === 0
    );

    if (uncalibratedZones.length > 0) {
      return NextResponse.json({
        success: false,
        error: `Zonas não calibradas: ${uncalibratedZones.map((z: any) => z.name).join(', ')}`
      }, { status: 400 });
    }

    // Atualizar configurações finais
    gateway.calib.portalThreshold = portalThreshold;
    gateway.calib.hysteresisDb = Math.max(1, hysteresisDb);
    gateway.calib.smoothing.window = Math.max(1, smoothingWindow);
    
    await gateway.save();

    // Criar evento de calibração completa
    await new IotEvent({
      ts: new Date(),
      storeId,
      type: 'calibration_complete',
      severity: 'info',
      context: {
        gatewayId,
        zonesCalibrated: gateway.calib.zones.length,
        portalThreshold,
        hysteresisDb,
        smoothingWindow
      }
    }).save();

    // Log da ação
    await new IotLog({
      storeId,
      actor: { userId: userId || 'system', role: userRole || 'admin' },
      action: 'calibrate',
      entity: 'gateway',
      entityId: gatewayId,
      after: gateway.calib,
      notes: `Calibração finalizada com ${gateway.calib.zones.length} zonas`,
      ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '',
      userAgent: request.headers.get('user-agent') || ''
    }).save();

    // Calcular estatísticas da calibração
    const calibrationStats = gateway.calib.zones.map((zone: any) => {
      const ref = zone.rssiRef[0];
      return {
        zoneId: zone.zoneId,
        name: zone.name,
        avgRssi: ref.avg,
        stability: ref.std < 4 ? 'Alta' : ref.std < 8 ? 'Média' : 'Baixa',
        range: `${ref.avg - ref.std * 2} a ${ref.avg + ref.std * 2} dBm`
      };
    });

    return NextResponse.json({
      success: true,
      data: {
        gatewayId,
        calibrationComplete: true,
        config: {
          portalThreshold,
          hysteresisDb,
          smoothingWindow
        },
        zones: calibrationStats,
        recommendations: generateRecommendations(gateway.calib.zones, portalThreshold)
      }
    });

  } catch (error) {
    console.error('Erro ao finalizar calibração:', error);
    return NextResponse.json({
      success: false,
      error: "Erro interno do servidor"
    }, { status: 500 });
  }
}

function generateRecommendations(zones: any[], portalThreshold: number): string[] {
  const recommendations = [];
  
  // Verificar zona portal
  const portalZone = zones.find(z => z.zoneId.includes('portal'));
  if (portalZone) {
    const portalRssi = portalZone.rssiRef[0]?.avg;
    if (portalRssi && portalRssi < portalThreshold - 10) {
      recommendations.push('Gateway muito distante do portal - considere reposicionar');
    }
    if (portalRssi && portalRssi > portalThreshold + 10) {
      recommendations.push('Gateway muito próximo do portal - ajuste threshold');
    }
  }

  // Verificar estabilidade geral
  const unstableZones = zones.filter(z => z.rssiRef[0]?.std > 6);
  if (unstableZones.length > 0) {
    recommendations.push(`Zonas com sinal instável: ${unstableZones.map(z => z.name).join(', ')}`);
  }

  // Verificar sobreposição de zonas
  const zoneRanges = zones.map(z => ({
    name: z.name,
    min: z.rssiRef[0].avg - z.rssiRef[0].std * 2,
    max: z.rssiRef[0].avg + z.rssiRef[0].std * 2
  }));

  for (let i = 0; i < zoneRanges.length; i++) {
    for (let j = i + 1; j < zoneRanges.length; j++) {
      const zone1 = zoneRanges[i];
      const zone2 = zoneRanges[j];
      
      if ((zone1.min <= zone2.max && zone1.max >= zone2.min)) {
        recommendations.push(`Sobreposição entre ${zone1.name} e ${zone2.name} - considere ajustar posições`);
      }
    }
  }

  if (recommendations.length === 0) {
    recommendations.push('Calibração adequada - sistema pronto para uso');
  }

  return recommendations;
}
