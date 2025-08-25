/**
 * Utilitários para impressão automática de pedidos
 */

export interface OrderToPrint {
  id: string;
  number: string;
  customer?: {
    name?: string;
    document?: string;
    phone?: string;
    address?: string;
  };
  items: Array<{
    id: string;
    name: string;
    description?: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    code?: string;
    unit?: string;
  }>;
  totalAmount: number;
  paymentMethod?: 'DINHEIRO' | 'CARTAO_CREDITO' | 'CARTAO_DEBITO' | 'PIX' | 'OUTROS';
  notes?: string;
  createdAt: Date;
}

/**
 * Imprime um pedido automaticamente se a impressão automática estiver ativada
 */
export async function printOrderAutomatically(order: OrderToPrint): Promise<{
  printed: boolean;
  cupomFiscal?: string;
  error?: string;
}> {
  try {
    // Verificar se a impressão automática está ativada
    const statusResponse = await fetch('/api/fiscal/print');
    const statusData = await statusResponse.json();
    
    if (!statusData.success || !statusData.status.enabled || !statusData.status.autoprint) {
      return { printed: false, error: 'Impressão automática não está ativada' };
    }

    // Preparar dados do pedido para impressão
    const printData = {
      orderId: order.number || order.id,
      items: order.items.map(item => ({
        code: item.code || item.id,
        name: item.name,
        description: item.description || item.name,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        price: item.unitPrice, // Para compatibilidade
        unit: item.unit || 'UN'
      })),
      total: order.totalAmount,
      customer: order.customer ? {
        name: order.customer.name,
        document: order.customer.document,
        address: order.customer.address
      } : undefined,
      paymentMethod: order.paymentMethod || 'OUTROS',
      observations: order.notes
    };

    // Enviar para impressão
    const printResponse = await fetch('/api/fiscal/print', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(printData)
    });

    const printResult = await printResponse.json();

    if (printResult.success) {
      return {
        printed: true,
        cupomFiscal: printResult.cupomFiscal
      };
    } else {
      return {
        printed: false,
        error: printResult.error || 'Erro ao imprimir cupom fiscal'
      };
    }

  } catch (error) {
    console.error('Erro na impressão automática:', error);
    return {
      printed: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido na impressão'
    };
  }
}

/**
 * Imprime um pedido manualmente (botão de ação)
 */
export async function printOrderManually(order: OrderToPrint): Promise<{
  success: boolean;
  cupomFiscal?: string;
  message: string;
}> {
  try {
    const result = await printOrderAutomatically(order);
    
    if (result.printed) {
      return {
        success: true,
        cupomFiscal: result.cupomFiscal,
        message: 'Cupom fiscal impresso com sucesso!'
      };
    } else {
      return {
        success: false,
        message: result.error || 'Não foi possível imprimir o cupom fiscal'
      };
    }
  } catch (error) {
    return {
      success: false,
      message: 'Erro ao tentar imprimir cupom fiscal'
    };
  }
}

/**
 * Verifica se a impressora está configurada e funcionando
 */
export async function checkPrinterHealth(): Promise<{
  configured: boolean;
  enabled: boolean;
  online: boolean;
  issues: string[];
}> {
  try {
    const response = await fetch('/api/fiscal/print');
    const data = await response.json();
    
    if (!data.success) {
      return {
        configured: false,
        enabled: false,
        online: false,
        issues: ['Impressora fiscal não configurada']
      };
    }

    const issues: string[] = [];
    
    if (!data.status.enabled) {
      issues.push('Impressora fiscal está desabilitada');
    }
    
    if (!data.status.printer.online) {
      issues.push('Impressora não está conectada');
    }
    
    if (!data.status.printer.paper) {
      issues.push('Impressora sem papel');
    }
    
    if (data.status.printer.error) {
      issues.push(`Erro na impressora: ${data.status.printer.error}`);
    }

    return {
      configured: true,
      enabled: data.status.enabled,
      online: data.status.printer.online,
      issues
    };

  } catch (error) {
    return {
      configured: false,
      enabled: false,
      online: false,
      issues: ['Erro ao verificar status da impressora']
    };
  }
}

/**
 * Hook React para usar as funções de impressão
 */
export function useFiscalPrinter() {
  const printOrder = async (order: OrderToPrint) => {
    return await printOrderManually(order);
  };

  const checkHealth = async () => {
    return await checkPrinterHealth();
  };

  return {
    printOrder,
    checkHealth,
    printOrderAutomatically
  };
}

/**
 * Formata os dados de um pedido genérico para o formato esperado pela impressora
 */
export function formatOrderForPrinting(orderData: any): OrderToPrint {
  return {
    id: orderData.id || orderData._id,
    number: orderData.number || orderData.orderNumber || `PED-${Date.now()}`,
    customer: orderData.customer ? {
      name: orderData.customer.name || orderData.customerName,
      document: orderData.customer.document || orderData.customer.cpf || orderData.customer.cnpj,
      phone: orderData.customer.phone || orderData.customerPhone,
      address: orderData.customer.address || orderData.customerAddress
    } : undefined,
    items: (orderData.items || []).map((item: any) => ({
      id: item.id || item._id,
      name: item.name || item.product?.name || item.productName,
      description: item.description || item.product?.description,
      quantity: item.quantity || 1,
      unitPrice: item.unitPrice || item.price || item.product?.price || 0,
      totalPrice: (item.quantity || 1) * (item.unitPrice || item.price || item.product?.price || 0),
      code: item.code || item.product?.code || item.sku,
      unit: item.unit || 'UN'
    })),
    totalAmount: orderData.total || orderData.totalAmount || 0,
    paymentMethod: orderData.paymentMethod || 'OUTROS',
    notes: orderData.notes || orderData.observations || orderData.comments,
    createdAt: orderData.createdAt ? new Date(orderData.createdAt) : new Date()
  };
}