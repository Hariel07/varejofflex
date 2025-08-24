import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db';
import IotGateway from '@/models/iot/Gateway';
import IotTelemetry from '@/models/iot/Telemetry';

// Coletar amostras de uma zona
export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    const { 
      storeId, 
      gatewayId, 
      zoneId, 
      tagId, 
      durationSeconds = 30 
    } = await request.json();
    
    if (!storeId || !gatewayId || !zoneId || !tagId) {
      return NextResponse.json({
        success: false,
        error: "storeId, gatewayId, zoneId e tagId são obrigatórios"
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

    // Coletar amostras RSSI dos últimos X segundos
    const timeWindow = new Date(Date.now() - durationSeconds * 1000);
    
    const samples = await IotTelemetry.find({
      storeId,
      source: gatewayId,
      tagId,
      metric: 'rssi',
      ts: { $gte: timeWindow }
    }).sort({ ts: -1 });

    if (samples.length < 5) {
      return NextResponse.json({
        success: false,
        error: `Amostras insuficientes. Encontradas ${samples.length}, mínimo 5 necessárias`
      }, { status: 400 });
    }

    // Calcular estatísticas
    const rssiValues = samples.map(s => s.value);
    const avg = rssiValues.reduce((a, b) => a + b, 0) / rssiValues.length;
    const variance = rssiValues.reduce((acc, val) => acc + Math.pow(val - avg, 2), 0) / rssiValues.length;
    const std = Math.sqrt(variance);

    // Atualizar calibração da zona
    const zoneIndex = gateway.calib.zones.findIndex((z: any) => z.zoneId === zoneId);
    
    if (zoneIndex === -1) {
      return NextResponse.json({
        success: false,
        error: "Zona não encontrada na calibração"
      }, { status: 404 });
    }

    // Atualizar referência RSSI da zona
    gateway.calib.zones[zoneIndex].rssiRef = [{
      gatewayId,
      avg: Math.round(avg * 100) / 100,
      std: Math.round(std * 100) / 100,
      weight: 1.0
    }];

    await gateway.save();

    return NextResponse.json({
      success: true,
      data: {
        zoneId,
        samples: samples.length,
        statistics: {
          avg: Math.round(avg * 100) / 100,
          std: Math.round(std * 100) / 100,
          min: Math.min(...rssiValues),
          max: Math.max(...rssiValues),
          range: Math.max(...rssiValues) - Math.min(...rssiValues)
        },
        quality: getSignalQuality(std, samples.length),
        recommendation: getRecommendation(avg, std)
      }
    });

  } catch (error) {
    console.error('Erro ao coletar amostras:', error);
    return NextResponse.json({
      success: false,
      error: "Erro interno do servidor"
    }, { status: 500 });
  }
}

function getSignalQuality(std: number, sampleCount: number): string {
  if (sampleCount < 10) return 'Baixa - Poucas amostras';
  if (std > 8) return 'Baixa - Sinal instável';
  if (std > 4) return 'Média - Sinal moderado';
  return 'Alta - Sinal estável';
}

function getRecommendation(avg: number, std: number): string {
  if (avg > -40) return 'Muito próximo - considere afastar gateway';
  if (avg < -80) return 'Muito distante - considere aproximar gateway';
  if (std > 8) return 'Sinal instável - verifique interferências';
  return 'Configuração adequada';
}
