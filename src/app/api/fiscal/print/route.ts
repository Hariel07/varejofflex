import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { dbConnect } from '@/lib/db';
import User from '@/models/User';
import { FiscalPrinter, FiscalOrder } from '@/lib/fiscal-printer';

// POST - Imprimir pedido
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const body = await request.json();
    const { orderId, items, total, customer, paymentMethod, observations } = body;

    // Validações básicas
    if (!orderId || !items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ 
        error: 'Dados do pedido incompletos' 
      }, { status: 400 });
    }

    await dbConnect();
    
    const user = await User.findOne({ email: session.user.email });
    if (!user || !user.fiscalSettings || !user.fiscalSettings.enabled) {
      return NextResponse.json({ 
        error: 'Impressora fiscal não configurada ou desabilitada' 
      }, { status: 400 });
    }

    // Criar objeto de pedido fiscal
    const fiscalOrder: FiscalOrder = {
      numeroVenda: orderId,
      dataVenda: new Date(),
      cliente: customer ? {
        nome: customer.name,
        cpfCnpj: customer.document,
        endereco: customer.address
      } : undefined,
      items: items.map((item: any, index: number) => ({
        codigo: item.code || `ITEM${index + 1}`,
        descricao: item.name || item.description,
        quantidade: item.quantity || 1,
        valorUnitario: item.unitPrice || item.price || 0,
        valorTotal: (item.quantity || 1) * (item.unitPrice || item.price || 0),
        unidade: item.unit || 'UN',
        cfop: item.cfop || '5102',
        ncm: item.ncm,
        cst: item.cst || '00'
      })),
      valorTotal: total || items.reduce((sum: number, item: any) => 
        sum + ((item.quantity || 1) * (item.unitPrice || item.price || 0)), 0
      ),
      formaPagamento: paymentMethod || 'OUTROS',
      observacoes: observations
    };

    // Criar instância da impressora
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

    // Imprimir pedido
    const printResult = await printer.printOrder(fiscalOrder);

    if (printResult.success) {
      // Salvar registro do cupom fiscal (opcional)
      // Aqui você pode salvar o número do cupom fiscal no pedido
      
      return NextResponse.json({
        success: true,
        message: 'Cupom fiscal impresso com sucesso',
        cupomFiscal: printResult.cupomFiscal,
        orderId: orderId
      });
    } else {
      return NextResponse.json({
        success: false,
        error: printResult.error || 'Erro ao imprimir cupom fiscal'
      }, { status: 500 });
    }

  } catch (error) {
    console.error('Erro ao imprimir pedido:', error);
    return NextResponse.json({ 
      error: 'Erro interno do servidor ao imprimir pedido' 
    }, { status: 500 });
  }
}

// GET - Verificar status da impressora
export async function GET(request: NextRequest) {
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

    // Criar instância da impressora
    const printer = new FiscalPrinter({
      type: user.fiscalSettings.printerType,
      cnpj: user.fiscalSettings.cnpj,
      razaoSocial: user.fiscalSettings.razaoSocial,
      endereco: user.fiscalSettings.endereco,
      printerPort: user.fiscalSettings.printerPort,
      printerModel: user.fiscalSettings.printerModel
    });

    // Verificar status
    const status = await printer.getStatus();

    return NextResponse.json({
      success: true,
      status: {
        enabled: user.fiscalSettings.enabled,
        autoprint: user.fiscalSettings.autoprint,
        printer: status
      }
    });

  } catch (error) {
    console.error('Erro ao verificar status da impressora:', error);
    return NextResponse.json({ 
      error: 'Erro ao verificar status da impressora' 
    }, { status: 500 });
  }
}