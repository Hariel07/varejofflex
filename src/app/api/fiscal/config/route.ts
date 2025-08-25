import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { dbConnect } from '@/lib/db';
import User from '@/models/User';

// Modelo para configurações fiscais
interface FiscalSettings {
  userId: string;
  cnpj: string;
  razaoSocial: string;
  nomeFantasia?: string;
  endereco: string;
  telefone?: string;
  email?: string;
  printerType: 'SAT' | 'ECF' | 'NFCE' | 'ESC_POS';
  printerPort?: string;
  printerModel?: string;
  satCertificate?: string;
  autoPrint: boolean;
  enabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// GET - Buscar configurações fiscais do usuário
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    await dbConnect();
    
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });
    }

    // Buscar configurações fiscais no banco
    // Por simplicidade, vou armazenar no próprio User model
    const fiscalSettings = user.fiscalSettings || {
      enabled: false,
      autoprint: false,
      printerType: 'ESC_POS'
    };

    return NextResponse.json({
      success: true,
      settings: fiscalSettings
    });

  } catch (error) {
    console.error('Erro ao buscar configurações fiscais:', error);
    return NextResponse.json({ 
      error: 'Erro interno do servidor' 
    }, { status: 500 });
  }
}

// POST - Salvar configurações fiscais
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const body = await request.json();
    const {
      cnpj,
      razaoSocial,
      nomeFantasia,
      endereco,
      telefone,
      email,
      printerType,
      printerPort,
      printerModel,
      satCertificate,
      autoprint,
      enabled
    } = body;

    // Validações básicas
    if (!cnpj || !razaoSocial || !endereco) {
      return NextResponse.json({ 
        error: 'CNPJ, Razão Social e Endereço são obrigatórios' 
      }, { status: 400 });
    }

    // Validar CNPJ (básico)
    const cnpjClean = cnpj.replace(/[^\d]/g, '');
    if (cnpjClean.length !== 14) {
      return NextResponse.json({ 
        error: 'CNPJ inválido' 
      }, { status: 400 });
    }

    await dbConnect();
    
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });
    }

    // Salvar configurações fiscais
    const fiscalSettings = {
      cnpj: cnpjClean,
      razaoSocial,
      nomeFantasia,
      endereco,
      telefone,
      email: email || session.user.email,
      printerType: printerType || 'ESC_POS',
      printerPort,
      printerModel,
      satCertificate,
      autoprint: autoprint || false,
      enabled: enabled || false,
      updatedAt: new Date()
    };

    user.fiscalSettings = fiscalSettings;
    await user.save();

    return NextResponse.json({
      success: true,
      message: 'Configurações fiscais salvas com sucesso',
      settings: fiscalSettings
    });

  } catch (error) {
    console.error('Erro ao salvar configurações fiscais:', error);
    return NextResponse.json({ 
      error: 'Erro interno do servidor' 
    }, { status: 500 });
  }
}

// PUT - Testar impressora fiscal
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    await dbConnect();
    
    const user = await User.findOne({ email: session.user.email });
    if (!user || !user.fiscalSettings) {
      return NextResponse.json({ 
        error: 'Configurações fiscais não encontradas' 
      }, { status: 404 });
    }

    // Aqui você faria o teste real da impressora
    // Por agora, vou simular
    const { FiscalPrinter } = await import('@/lib/fiscal-printer');
    
    const printer = new FiscalPrinter({
      type: user.fiscalSettings.printerType,
      cnpj: user.fiscalSettings.cnpj,
      razaoSocial: user.fiscalSettings.razaoSocial,
      nomeFantasia: user.fiscalSettings.nomeFantasia,
      endereco: user.fiscalSettings.endereco,
      telefone: user.fiscalSettings.telefone,
      email: user.fiscalSettings.email,
      printerPort: user.fiscalSettings.printerPort,
      printerModel: user.fiscalSettings.printerModel,
      satCertificate: user.fiscalSettings.satCertificate
    });

    const testResult = await printer.testPrint();

    return NextResponse.json({
      success: testResult,
      message: testResult ? 'Teste de impressão realizado com sucesso!' : 'Falha no teste de impressão'
    });

  } catch (error) {
    console.error('Erro ao testar impressora:', error);
    return NextResponse.json({ 
      error: 'Erro ao testar impressora fiscal' 
    }, { status: 500 });
  }
}