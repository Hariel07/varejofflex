import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db';
import IotGateway from '@/models/iot/Gateway';
import IotLog from '@/models/iot/Log';
import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';

// Provisionar gateway (gerar token)
export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    const { storeId, kind, pos, notes, userId, userRole } = await request.json();
    
    // Validação básica
    if (!storeId || !kind || !pos || !pos.zone) {
      return NextResponse.json({
        success: false,
        error: "storeId, kind, pos.zone são obrigatórios"
      }, { status: 400 });
    }

    // Gerar ID e token únicos
    const gatewayId = `gw_${storeId.replace(/[^a-zA-Z0-9]/g, '_')}_${Date.now()}`;
    const token = crypto.randomBytes(32).toString('hex');

    // Criar gateway
    const gateway = new IotGateway({
      _id: gatewayId,
      storeId,
      kind,
      pos: {
        x: pos.x || 0,
        y: pos.y || 0,
        zone: pos.zone
      },
      status: 'offline',
      token,
      notes: notes || "",
      calib: {
        zones: [],
        portalThreshold: -60,
        hysteresisDb: 6,
        smoothing: { window: 5 }
      }
    });

    await gateway.save();

    // Log da ação
    await new IotLog({
      storeId,
      actor: { userId: userId || 'system', role: userRole || 'admin' },
      action: 'provision',
      entity: 'gateway',
      entityId: gatewayId,
      after: gateway.toObject(),
      notes: `Gateway provisionado na zona ${pos.zone}`,
      ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '',
      userAgent: request.headers.get('user-agent') || ''
    }).save();

    return NextResponse.json({
      success: true,
      data: {
        gatewayId,
        token,
        mqttConfig: {
          host: process.env.HIVEMQ_HOST || 'your-cluster.s1.eu.hivemq.cloud',
          port: 8883,
          username: `gateway_${gatewayId}`,
          password: token,
          topics: {
            telemetry: `stores/${storeId}/gateways/${gatewayId}/telemetry`,
            tags: `stores/${storeId}/tags/+/evt`,
            broadcast: `stores/${storeId}/broadcast`
          }
        }
      }
    });

  } catch (error) {
    console.error('Erro ao provisionar gateway:', error);
    return NextResponse.json({
      success: false,
      error: "Erro interno do servidor"
    }, { status: 500 });
  }
}

// Listar gateways
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

    const gateways = await IotGateway
      .find({ storeId })
      .select('-token') // Não retornar token por segurança
      .sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      data: gateways
    });

  } catch (error) {
    console.error('Erro ao listar gateways:', error);
    return NextResponse.json({
      success: false,
      error: "Erro interno do servidor"
    }, { status: 500 });
  }
}

// Atualizar status/configuração
export async function PUT(request: NextRequest) {
  try {
    await dbConnect();
    
    const { gatewayId, updates, userId, userRole } = await request.json();
    
    if (!gatewayId) {
      return NextResponse.json({
        success: false,
        error: "gatewayId é obrigatório"
      }, { status: 400 });
    }

    const gateway = await IotGateway.findById(gatewayId);
    if (!gateway) {
      return NextResponse.json({
        success: false,
        error: "Gateway não encontrado"
      }, { status: 404 });
    }

    const before = gateway.toObject();
    
    // Atualizar campos permitidos
    const allowedFields = ['pos', 'notes', 'status', 'calib'];
    Object.keys(updates).forEach(key => {
      if (allowedFields.includes(key)) {
        gateway[key] = updates[key];
      }
    });

    gateway.lastSeen = new Date();
    await gateway.save();

    // Log da ação
    await new IotLog({
      storeId: gateway.storeId,
      actor: { userId: userId || 'system', role: userRole || 'admin' },
      action: 'update',
      entity: 'gateway',
      entityId: gatewayId,
      before,
      after: gateway.toObject(),
      notes: 'Gateway atualizado',
      ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '',
      userAgent: request.headers.get('user-agent') || ''
    }).save();

    return NextResponse.json({
      success: true,
      data: gateway
    });

  } catch (error) {
    console.error('Erro ao atualizar gateway:', error);
    return NextResponse.json({
      success: false,
      error: "Erro interno do servidor"
    }, { status: 500 });
  }
}
