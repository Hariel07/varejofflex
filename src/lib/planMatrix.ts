// Matriz de disponibilidade de add-ons por plano
export type PlanType = 'basico' | 'profissional' | 'empresarial';

export interface AddOnLimit {
  available: boolean;
  maxQuantity?: number; // undefined = ilimitado
  tooltip?: string;
  upgradeRequired?: PlanType;
}

export interface PlanLimits {
  [addOnId: string]: AddOnLimit;
}

export interface PlanMatrix {
  basico: PlanLimits;
  profissional: PlanLimits;
  empresarial: PlanLimits;
}

// Configuração da matriz de add-ons por plano
export const PLAN_MATRIX: PlanMatrix = {
  basico: {
    // Operação & PDV - Todos disponíveis
    'pdv-extra': { available: true },
    'kds': { available: true },
    'delivery-pro': { available: true },
    'loja-extra': { available: true },
    
    // IoT & Automação - Bloqueados (sem IoT no básico)
    'gateway-ble-extra': { 
      available: false, 
      tooltip: 'Este add-on faz parte do pacote IoT. Disponível a partir do plano Profissional.',
      upgradeRequired: 'profissional'
    },
    'tags-ble-100': { 
      available: false, 
      tooltip: 'Este add-on faz parte do pacote IoT. Disponível a partir do plano Profissional.',
      upgradeRequired: 'profissional'
    },
    'sensor-temp-umid': { 
      available: false, 
      tooltip: 'Este add-on faz parte do pacote IoT. Disponível a partir do plano Profissional.',
      upgradeRequired: 'profissional'
    },
    'balanca-nao-fiscal': { 
      available: false, 
      tooltip: 'Este add-on faz parte do pacote IoT. Disponível a partir do plano Profissional.',
      upgradeRequired: 'profissional'
    },
    'balanca-fiscal': { 
      available: false, 
      tooltip: 'Funcionalidade exclusiva para operações maiores. Disponível no plano Empresarial.',
      upgradeRequired: 'empresarial'
    },
    'rastreador-m2m': { 
      available: false, 
      tooltip: 'Funcionalidade exclusiva para operações maiores. Disponível no plano Empresarial.',
      upgradeRequired: 'empresarial'
    },
    
    // Inteligência Artificial
    'canal-ia-extra': { available: true },
    'interacoes-ia-1000': { available: true },
    'copiloto-adm-extra': { 
      available: false, 
      tooltip: 'Funcionalidade avançada disponível a partir do plano Profissional.',
      upgradeRequired: 'profissional'
    },
    
    // Dados & Integrações
    'retencao-180': { 
      available: false, 
      tooltip: 'Retenção estendida disponível a partir do plano Profissional.',
      upgradeRequired: 'profissional'
    },
    'retencao-365': { 
      available: false, 
      tooltip: 'Funcionalidade exclusiva para operações maiores. Disponível no plano Empresarial.',
      upgradeRequired: 'empresarial'
    },
    'api-erp-connector': { 
      available: false, 
      tooltip: 'Funcionalidade exclusiva para operações maiores. Disponível no plano Empresarial.',
      upgradeRequired: 'empresarial'
    },
    'webhooks-premium': { 
      available: false, 
      tooltip: 'Webhooks avançados disponíveis a partir do plano Profissional.',
      upgradeRequired: 'profissional'
    },
    'backup-automatico': { available: true },
    'bi-personalizado': { 
      available: false, 
      tooltip: 'BI avançado disponível a partir do plano Profissional.',
      upgradeRequired: 'profissional'
    },
    'sla-24-7': { available: true }, // Para upgrade de suporte no básico
  },
  
  profissional: {
    // Operação & PDV - Todos disponíveis
    'pdv-extra': { available: true },
    'kds': { available: true },
    'delivery-pro': { available: true },
    'loja-extra': { available: true },
    
    // IoT & Automação - Disponíveis com limites
    'gateway-ble-extra': { 
      available: true, 
      maxQuantity: 2, // +2 além do 1 incluso = máx 3 total
      tooltip: 'Máximo 2 gateways extras (3 no total). Upgrade para Empresarial para expandir.'
    },
    'tags-ble-100': { 
      available: true, 
      maxQuantity: 3, // +300 tags além das 50 inclusas = máx 350 total
      tooltip: 'Máximo 300 tags extras (350 no total). Upgrade para Empresarial para expandir.'
    },
    'sensor-temp-umid': { 
      available: true, 
      maxQuantity: 8, // +8 além de 2 inclusos = máx 10 total
      tooltip: 'Máximo 8 sensores extras (10 no total). Upgrade para Empresarial para expandir.'
    },
    'balanca-nao-fiscal': { 
      available: true, 
      maxQuantity: 2, // +2 além da 1 inclusa = máx 3 total
      tooltip: 'Máximo 2 balanças extras (3 no total). Upgrade para Empresarial para expandir.'
    },
    'balanca-fiscal': { 
      available: false, 
      tooltip: 'Funcionalidade exclusiva para operações maiores. Disponível no plano Empresarial.',
      upgradeRequired: 'empresarial'
    },
    'rastreador-m2m': { 
      available: false, 
      tooltip: 'Funcionalidade exclusiva para operações maiores. Disponível no plano Empresarial.',
      upgradeRequired: 'empresarial'
    },
    
    // Inteligência Artificial
    'canal-ia-extra': { available: true },
    'interacoes-ia-1000': { available: true },
    'copiloto-adm-extra': { 
      available: true, 
      maxQuantity: 2, // +2 além do 1 incluso = máx 3 total
      tooltip: 'Máximo 2 assentos extras (3 no total). Upgrade para Empresarial para expandir.'
    },
    
    // Dados & Integrações
    'retencao-180': { available: true },
    'retencao-365': { 
      available: false, 
      tooltip: 'Funcionalidade exclusiva para operações maiores. Disponível no plano Empresarial.',
      upgradeRequired: 'empresarial'
    },
    'api-erp-connector': { 
      available: false, 
      tooltip: 'Funcionalidade exclusiva para operações maiores. Disponível no plano Empresarial.',
      upgradeRequired: 'empresarial'
    },
    'webhooks-premium': { available: true },
    'backup-automatico': { available: true },
    'bi-personalizado': { available: true },
    'sla-24-7': { available: true }, // Para upgrade de suporte no profissional
  },
  
  empresarial: {
    // Operação & PDV - Todos disponíveis
    'pdv-extra': { available: true },
    'kds': { available: true },
    'delivery-pro': { available: true },
    'loja-extra': { available: true },
    
    // IoT & Automação - Todos disponíveis (alguns já inclusos)
    'gateway-ble-extra': { 
      available: true,
      tooltip: 'Recomendação: até 10 gateways extras por loja para cobertura ideal.'
    },
    'tags-ble-100': { 
      available: true,
      tooltip: 'Sugestão: adicione em lotes de 100 conforme necessário.'
    },
    'sensor-temp-umid': { available: true },
    'balanca-nao-fiscal': { available: true },
    'balanca-fiscal': { available: true },
    'rastreador-m2m': { available: true },
    
    // Inteligência Artificial
    'canal-ia-extra': { available: true },
    'interacoes-ia-1000': { available: true },
    'copiloto-adm-extra': { 
      available: true,
      maxQuantity: 10, // +10 além dos 10 inclusos = máx 20 total
      tooltip: 'Máximo 10 assentos extras (20 no total). Contate vendas para necessidades maiores.'
    },
    
    // Dados & Integrações
    'retencao-180': { available: true },
    'retencao-365': { available: true },
    'api-erp-connector': { available: true },
    'webhooks-premium': { available: true },
    'backup-automatico': { available: true },
    'bi-personalizado': { available: true },
    'sla-24-7': { 
      available: false, // Redundante - já tem 24/7 incluso
      tooltip: 'Suporte 24/7 já está incluído no seu plano Empresarial.'
    },
  }
};

// Informações dos planos
export const PLAN_INFO = {
  basico: {
    name: 'Básico',
    price: 99,
    annualPrice: 75,
    features: {
      products: 150,
      users: 1,
      iot: false,
      aiInteractions: 1000,
      support: 'email'
    }
  },
  profissional: {
    name: 'Profissional',
    price: 199,
    annualPrice: 149,
    features: {
      products: 2000,
      users: 5,
      iot: 'essencial', // 1 gateway + 50 tags + 1 balança não-fiscal
      aiInteractions: 5000,
      aiCopilotSeats: 1,
      support: 'priority'
    }
  },
  empresarial: {
    name: 'Empresarial',
    price: 399,
    annualPrice: 299,
    features: {
      products: 10000,
      users: 'unlimited',
      iot: 'avancado', // 5 gateways + 500 tags + M2M + balança fiscal + alertas
      aiInteractions: 50000,
      aiCopilotSeats: 10,
      support: '24/7'
    }
  }
};

// Funções utilitárias
export function canUseAddOn(plan: PlanType, addOnId: string): boolean {
  const planMatrix = PLAN_MATRIX as Record<PlanType, PlanLimits>;
  return planMatrix[plan]?.[addOnId]?.available || false;
}

export function getAddOnLimit(plan: PlanType, addOnId: string): AddOnLimit | null {
  const planMatrix = PLAN_MATRIX as Record<PlanType, PlanLimits>;
  return planMatrix[plan]?.[addOnId] || null;
}

export function getUpgradeMessage(plan: PlanType, addOnId: string): string {
  const limit = getAddOnLimit(plan, addOnId);
  if (!limit || limit.available) return '';
  
  const targetPlan = limit.upgradeRequired;
  if (!targetPlan) return '';
  
  const targetPlanName = PLAN_INFO[targetPlan].name;
  return `Faça upgrade para o plano ${targetPlanName} para habilitar este recurso.`;
}

export function checkAddOnQuota(plan: PlanType, addOnId: string, currentUsage: number): {
  canAdd: boolean;
  message?: string;
  remaining?: number;
} {
  const limit = getAddOnLimit(plan, addOnId);
  
  if (!limit) {
    return { canAdd: false, message: 'Add-on não encontrado.' };
  }
  
  if (!limit.available) {
    return { 
      canAdd: false, 
      message: limit.tooltip || getUpgradeMessage(plan, addOnId)
    };
  }
  
  if (limit.maxQuantity === undefined) {
    return { canAdd: true }; // Ilimitado
  }
  
  if (currentUsage >= limit.maxQuantity) {
    return { 
      canAdd: false, 
      message: `Limite atingido para o seu plano (${limit.maxQuantity} máximo). ${getUpgradeMessage(plan, addOnId)}`
    };
  }
  
  return { 
    canAdd: true, 
    remaining: limit.maxQuantity - currentUsage 
  };
}

// Mapeamento de add-ons com informações
export const ADD_ON_INFO = {
  'pdv-extra': { name: 'PDV Extra', price: 29, category: 'operacao' },
  'kds': { name: 'KDS', price: 19, category: 'operacao' },
  'delivery-pro': { name: 'Delivery Pro', price: 39, category: 'operacao' },
  'loja-extra': { name: 'Loja Extra', price: 59, category: 'operacao' },
  
  'gateway-ble-extra': { name: 'Gateway BLE Extra', price: 39, category: 'iot' },
  'tags-ble-100': { name: '+100 Tags BLE', price: 19, category: 'iot' },
  'sensor-temp-umid': { name: 'Sensor Temp/Umid Extra', price: 10, category: 'iot' },
  'balanca-nao-fiscal': { name: 'Balança Não-Fiscal Extra', price: 15, category: 'iot' },
  'balanca-fiscal': { name: 'Balança Fiscal', price: 39, category: 'iot', setupFee: 149 },
  'rastreador-m2m': { name: 'Rastreador M2M Extra', price: 35, category: 'iot' },
  
  'canal-ia-extra': { name: 'Canal IA Extra', price: 29, category: 'ia' },
  'interacoes-ia-1000': { name: '+1.000 Interações IA', price: 49, category: 'ia' },
  'copiloto-adm-extra': { name: 'Assento Copiloto ADM Extra', price: 39, category: 'ia' },
  
  'retencao-180': { name: 'Retenção 180 dias', price: 29, category: 'dados' },
  'retencao-365': { name: 'Retenção 365 dias', price: 79, category: 'dados' },
  'api-erp-connector': { name: 'API/ERP Connector', price: 99, category: 'dados' },
  'webhooks-premium': { name: 'Webhooks Premium', price: 29, category: 'dados' },
  'backup-automatico': { name: 'Backup Automático', price: 19, category: 'dados' },
  'bi-personalizado': { name: 'BI Personalizado', price: 149, category: 'dados' },
  
  'sla-24-7': { name: 'SLA 24/7 Premium', price: 99, category: 'suporte' },
};