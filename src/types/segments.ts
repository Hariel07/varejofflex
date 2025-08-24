// Types para o Sistema VarejoFlex
// Baseado nas especificações por segmento

// ============= NÚCLEO COMUM =============

export interface BaseProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  category_id: string;
  images: string[];
  active: boolean;
  created_at: Date;
  updated_at: Date;
  
  // Campos opcionais baseados no segmento
  segment_data?: LanchoneteProduct | PizzaProduct | ModaProduct | MercadoProduct | PetshopProduct | SalaoProduct;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  parent_id?: string;
  sort_order: number;
  active: boolean;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  cpf?: string;
  addresses: Address[];
  created_at: Date;
}

export interface Address {
  id: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipcode: string;
  latitude?: number;
  longitude?: number;
  is_default: boolean;
}

export interface Order {
  id: string;
  customer_id: string;
  status: OrderStatus;
  items: OrderItem[];
  subtotal: number;
  delivery_fee: number;
  discount: number;
  total: number;
  payment_method: PaymentMethod;
  delivery_type: 'delivery' | 'pickup';
  delivery_address?: Address;
  estimated_time: number;
  created_at: Date;
  updated_at: Date;
  
  // Rastreamento
  tracking: TrackingEvent[];
  
  // Campos específicos por segmento
  segment_data?: any;
}

export interface OrderItem {
  id: string;
  product_id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  variations?: Record<string, any>;
  complements?: Complement[];
  observations?: string;
}

export interface Complement {
  id: string;
  name: string;
  price: number;
  category?: string;
}

export type OrderStatus = 
  | 'pending'
  | 'confirmed'
  | 'preparing'
  | 'ready'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled';

export type PaymentMethod = 'pix' | 'credit_card' | 'debit_card' | 'cash';

export interface TrackingEvent {
  status: OrderStatus;
  timestamp: Date;
  description: string;
  location?: string;
}

export interface Coupon {
  id: string;
  code: string;
  type: 'percentage' | 'fixed' | 'free_delivery';
  value: number;
  min_order_value?: number;
  max_discount?: number;
  valid_from: Date;
  valid_until: Date;
  usage_limit?: number;
  used_count: number;
  categories?: string[];
  active: boolean;
}

// ============= SEGMENTOS ESPECÍFICOS =============

// 1. LANCHONETES
export interface LanchoneteProduct {
  variações: {
    size?: {
      options: { value: string; label: string; price: number }[];
      required: boolean;
    };
  };
  complementos: {
    category: string;
    items: { id: string; name: string; price: number }[];
    max_selections?: number;
  }[];
  tempo_preparo: number; // minutos base
  permite_observações: boolean;
  upsell_products: string[]; // IDs de produtos relacionados
}

// 2. PIZZARIAS
export interface PizzaProduct {
  tamanhos: {
    [key: string]: {
      label: string;
      max_sabores: number;
      preco_base: number;
    };
  };
  categoria_sabor: 'tradicional' | 'especial' | 'premium';
  regra_preco: 'maior_valor' | 'média_ponderada';
  bordas_disponíveis: {
    id: string;
    nome: string;
    preco: number;
  }[];
  adicionais: {
    id: string;
    nome: string;
    preco: number;
    por_metade: boolean;
  }[];
}

export interface PizzaOrderItem extends OrderItem {
  tamanho: string;
  sabores: {
    produto_id: string;
    nome: string;
    porção: number; // 0.5 para metade, 0.33 para terço
    categoria: string;
  }[];
  borda?: {
    id: string;
    nome: string;
    porções: number[]; // quais metades têm borda
  };
  adicionais_por_metade: {
    porção: number;
    ingredientes: { id: string; nome: string }[];
  }[];
}

// 3. MODA & ACESSÓRIOS
export interface ModaProduct {
  variações: {
    cor: string;
    tamanho: string;
    sku: string;
    ean?: string;
    estoque: number;
    preco_diferenciado?: number;
    imagens: string[];
  }[];
  tabela_medidas: {
    tamanho: string;
    medidas: Record<string, string>; // busto, cintura, quadril, etc.
  }[];
  marca?: string;
  material?: string;
  categoria_detalhada: string;
  permite_troca: boolean;
  prazo_troca: number; // dias
}

export interface TrocaDevolucao {
  id: string;
  order_id: string;
  order_item_id: string;
  tipo: 'troca' | 'devolução';
  motivo: string;
  status: 'solicitada' | 'aprovada' | 'recusada' | 'concluída';
  data_solicitacao: Date;
  data_conclusao?: Date;
  observações?: string;
}

// 4. MERCADOS/SUPERMERCADOS
export interface MercadoProduct {
  unidade_medida: 'kg' | 'g' | 'l' | 'ml' | 'un';
  preco_por_peso?: number;
  ean_balança?: string;
  fracionável: boolean;
  categoria_fiscal: string;
  lotes: {
    código: string;
    validade: Date;
    estoque: number;
    fornecedor?: string;
  }[];
  produtos_similares: string[]; // IDs para substituição
}

// 5. PETSHOPS
export interface PetshopProduct {
  tipo: 'produto' | 'serviço';
  categoria_pet?: 'cão' | 'gato' | 'pássaro' | 'todos';
  requer_agendamento?: boolean;
  duração?: number; // para serviços
  profissionais_habilitados?: string[];
  faixa_peso?: {
    min: number;
    max: number;
    preco_adicional?: number;
  };
}

export interface Pet {
  id: string;
  customer_id: string;
  nome: string;
  espécie: string;
  raça: string;
  sexo: 'M' | 'F';
  peso: number;
  data_nascimento?: Date;
  alergias: string[];
  observações?: string;
  vacinas: {
    tipo: string;
    data: Date;
    próxima_dose?: Date;
    veterinário?: string;
  }[];
  histórico_serviços: {
    data: Date;
    serviço: string;
    observações?: string;
    próximo_agendamento?: Date;
  }[];
}

export interface PetshopService {
  id: string;
  nome: string;
  categoria: 'banho' | 'tosa' | 'veterinário' | 'estética';
  duração: number; // minutos
  preco: number;
  requer_agendamento: boolean;
  profissionais_habilitados: string[];
  recursos_necessários: string[]; // boxes, equipamentos
}

export interface AgendamentoPet {
  id: string;
  pet_id: string;
  service_id: string;
  profissional_id: string;
  recurso_id: string;
  data_hora: Date;
  status: 'agendado' | 'em_andamento' | 'concluído' | 'cancelado';
  observações?: string;
  valor: number;
}

// 6. SALÕES DE BELEZA
export interface SalaoProduct {
  categoria: 'cabelo' | 'manicure' | 'pedicure' | 'estética' | 'depilação';
  duração: number;
  requer_agendamento: boolean;
  comissão: {
    tipo: 'fixa' | 'percentual';
    valor: number;
  };
  profissionais_habilitados: string[];
  recursos_necessários: string[]; // cadeiras, equipamentos
  permite_pacote: boolean;
}

export interface SalaoService {
  id: string;
  categoria: 'cabelo' | 'manicure' | 'pedicure' | 'estética' | 'depilação';
  nome: string;
  duração: number;
  preco: number;
  comissão: {
    tipo: 'fixa' | 'percentual';
    valor: number;
  };
  profissionais_habilitados: string[];
  recursos_necessários: string[]; // cadeiras, equipamentos
}

export interface Profissional {
  id: string;
  nome: string;
  especialidades: string[];
  telefone: string;
  email?: string;
  ativo: boolean;
  agenda: {
    dia_semana: number; // 0-6
    horario_inicio: string;
    horario_fim: string;
    intervalo_inicio?: string;
    intervalo_fim?: string;
  }[];
  metas: {
    tipo: 'mensal' | 'semanal';
    valor_objetivo: number;
    comissão_extra: number;
  };
  bloqueios: {
    data_inicio: Date;
    data_fim: Date;
    motivo: string;
  }[];
}

export interface AgendamentoSalao {
  id: string;
  customer_id: string;
  service_id: string;
  profissional_id: string;
  data_hora: Date;
  status: 'agendado' | 'em_andamento' | 'concluído' | 'no_show' | 'cancelado';
  valor: number;
  observações?: string;
  avaliação?: {
    nota: number;
    comentário?: string;
  };
}

// 7. FARMÁCIAS
export interface FarmaciaProduct {
  principio_ativo?: string;
  concentração?: string;
  forma_farmacêutica: string;
  laboratorio: string;
  registro_anvisa: string;
  prescricao: {
    obrigatória: boolean;
    controlado: boolean;
    psicotrópico: boolean;
  };
  lote: string;
  validade: Date;
  temperatura_armazenamento?: string;
  produtos_similares: string[]; // genéricos/similares
}

export interface Prescricao {
  id: string;
  customer_id: string;
  arquivo_upload: string;
  crm_medico?: string;
  nome_medico?: string;
  data_emissao: Date;
  data_validade: Date;
  status: 'pendente' | 'validada' | 'rejeitada';
  farmacêutico_validador?: string;
  observações?: string;
  produtos_prescritos: {
    nome: string;
    quantidade: string;
    posologia: string;
  }[];
}

// ============= MÓDULO FROTA =============

export interface Veiculo {
  id: string;
  placa: string;
  tipo: 'moto' | 'carro' | 'van' | 'bicicleta';
  marca: string;
  modelo: string;
  ano: number;
  combustível: 'gasolina' | 'álcool' | 'flex' | 'diesel' | 'elétrico';
  odômetro: number;
  status: 'disponível' | 'em_rota' | 'manutenção' | 'inativo';
  condutor_atual?: string;
  última_manutenção?: Date;
  próxima_manutenção?: Date;
}

export interface Condutor {
  id: string;
  nome: string;
  cpf: string;
  cnh: string;
  categoria_cnh: string;
  validade_cnh: Date;
  telefone: string;
  status: 'ativo' | 'inativo' | 'em_rota';
  veículos_habilitados: string[];
  avaliação_média: number;
}

export interface Entrega {
  id: string;
  order_id: string;
  veiculo_id: string;
  condutor_id: string;
  endereco_origem: Address;
  endereco_destino: Address;
  distância: number; // km
  tempo_estimado: number; // minutos
  tempo_real?: number;
  status: 'atribuída' | 'coletada' | 'em_trânsito' | 'entregue' | 'problema';
  tracking_points: {
    latitude: number;
    longitude: number;
    timestamp: Date;
  }[];
  custo_combustível?: number;
  avaliação_cliente?: number;
}

// ============= KDS (KITCHEN DISPLAY SYSTEM) =============

export interface KDSItem {
  id: string;
  order_id: string;
  order_item_id: string;
  produto_nome: string;
  quantidade: number;
  observações?: string;
  status: 'pendente' | 'preparando' | 'pronto';
  setor: string; // 'grill', 'montagem', 'forno', 'expedição'
  tempo_inicio?: Date;
  tempo_conclusao?: Date;
  profissional_responsável?: string;
  prioridade: 'normal' | 'urgente';
}

export interface KDSConfig {
  id: string;
  store_id: string;
  setores: {
    nome: string;
    ordem: number;
    cor: string;
    produtos_atendidos: string[]; // categorias ou produtos específicos
    tempo_médio: number; // minutos
  }[];
  auto_advance: boolean; // avança automaticamente entre setores
  sound_alerts: boolean;
  tempo_alerta: number; // minutos para destacar itens atrasados
}

// ============= RELATÓRIOS =============

export interface MetricasBase {
  período: {
    data_início: Date;
    data_fim: Date;
  };
  vendas: {
    total: number;
    quantidade_pedidos: number;
    ticket_médio: number;
    crescimento_período_anterior: number;
  };
  produtos: {
    mais_vendidos: {
      produto_id: string;
      nome: string;
      quantidade: number;
      receita: number;
    }[];
    categorias_performance: {
      categoria: string;
      vendas: number;
      margem: number;
    }[];
  };
  clientes: {
    novos: number;
    recorrentes: number;
    ltv_médio: number;
  };
}

export interface MetricasLanchonete extends MetricasBase {
  tempo_preparo_médio: number;
  uso_cupons: {
    total_cupons_usados: number;
    desconto_médio: number;
    categoria_mais_cupons: string;
  };
  upsell: {
    taxa_conversão: number;
    produtos_mais_sugeridos: string[];
    receita_adicional: number;
  };
}

export interface MetricasPizzaria extends MetricasBase {
  tempo_por_etapa: {
    montagem: number;
    forno: number;
    expedição: number;
  };
  sabores_populares: {
    sabor: string;
    quantidade: number;
  }[];
  tamanhos_vendidos: {
    tamanho: string;
    quantidade: number;
    receita: number;
  }[];
  entrega: {
    tempo_médio: number;
    taxa_pontualidade: number;
  };
}

// ============= CONFIGURAÇÕES DA LOJA =============

export interface LojaConfig {
  id: string;
  nome: string;
  cnpj?: string;
  segmento: 'lanchonete' | 'pizzaria' | 'moda' | 'mercado' | 'petshop' | 'salao' | 'farmacia' | 'conveniencia';
  endereço: Address;
  contato: {
    telefone: string;
    email: string;
    whatsapp?: string;
  };
  horário_funcionamento: {
    dia_semana: number;
    abertura: string;
    fechamento: string;
    ativo: boolean;
  }[];
  feriados: {
    data: Date;
    nome: string;
    funciona: boolean;
    horário_especial?: {
      abertura: string;
      fechamento: string;
    };
  }[];
  entrega: {
    própria: boolean;
    raio_max: number; // km
    taxa_padrão: number;
    tempo_preparo_base: number; // minutos
    valor_mínimo?: number;
    zonas: {
      nome: string;
      bairros: string[];
      taxa: number;
      tempo_adicional: number;
    }[];
  };
  pagamento: {
    pix: boolean;
    cartão_crédito: boolean;
    cartão_débito: boolean;
    dinheiro: boolean;
    aceita_troco: boolean;
  };
  configurações_segmento: any; // específico para cada tipo de negócio
}

export default {};
