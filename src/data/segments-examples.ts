// Dados de exemplo para demonstrar a implementação dos segmentos
import { BaseProduct, LanchoneteProduct, PizzaProduct, Category, Coupon } from '@/types/segments';

// ============= CATEGORIAS BASE =============

export const baseCategorias: Category[] = [
  {
    id: 'cat-lanches',
    name: 'Lanches',
    description: 'Hambúrgueres e sanduíches artesanais',
    sort_order: 1,
    active: true
  },
  {
    id: 'cat-acompanhamentos',
    name: 'Acompanhamentos',
    description: 'Batatas, onion rings e porções',
    sort_order: 2,
    active: true
  },
  {
    id: 'cat-bebidas',
    name: 'Bebidas',
    description: 'Refrigerantes, sucos e águas',
    sort_order: 3,
    active: true
  },
  {
    id: 'cat-sobremesas',
    name: 'Sobremesas',
    description: 'Doces e sobremesas especiais',
    sort_order: 4,
    active: true
  }
];

// ============= PRODUTOS LANCHONETE =============

export const lanchoneteProducts: (BaseProduct & { segment_data: LanchoneteProduct })[] = [
  {
    id: 'prod-xbacon',
    name: 'X-Bacon',
    description: 'Hambúrguer artesanal 180g, bacon crocante, queijo, alface, tomate e molho especial',
    price: 28.90,
    category_id: 'cat-lanches',
    images: [
      'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400',
      'https://images.unsplash.com/photo-1550547660-d9450f859349?w=400'
    ],
    active: true,
    created_at: new Date(),
    updated_at: new Date(),
    segment_data: {
      variações: {
        size: {
          options: [
            { value: 'normal', label: 'Normal', price: 0 },
            { value: 'duplo', label: 'Duplo (+1 hambúrguer)', price: 8.00 }
          ],
          required: false
        }
      },
      complementos: [
        {
          category: 'Queijos',
          items: [
            { id: 'comp-cheddar', name: 'Cheddar Extra', price: 3.00 },
            { id: 'comp-suico', name: 'Queijo Suíço', price: 4.00 }
          ],
          max_selections: 2
        },
        {
          category: 'Adicionais',
          items: [
            { id: 'comp-bacon', name: 'Bacon Extra', price: 5.00 },
            { id: 'comp-ovo', name: 'Ovo', price: 2.50 },
            { id: 'comp-calabresa', name: 'Calabresa', price: 4.00 }
          ]
        }
      ],
      tempo_preparo: 15,
      permite_observações: true,
      upsell_products: ['prod-batata-g', 'prod-refri-lata']
    }
  },
  {
    id: 'prod-chicken',
    name: 'Chicken Crispy',
    description: 'Peito de frango empanado, queijo, alface, tomate e molho ranch',
    price: 24.90,
    category_id: 'cat-lanches',
    images: [
      'https://images.unsplash.com/photo-1513185158878-8d064c2de279?w=400'
    ],
    active: true,
    created_at: new Date(),
    updated_at: new Date(),
    segment_data: {
      variações: {
        size: {
          options: [
            { value: 'normal', label: 'Normal', price: 0 },
            { value: 'duplo', label: 'Duplo (+1 filé)', price: 8.00 }
          ],
          required: false
        }
      },
      complementos: [
        {
          category: 'Molhos Especiais',
          items: [
            { id: 'comp-ranch', name: 'Molho Ranch Extra', price: 1.50 },
            { id: 'comp-barbecue', name: 'Molho Barbecue', price: 1.50 }
          ]
        }
      ],
      tempo_preparo: 12,
      permite_observações: true,
      upsell_products: ['prod-batata-p', 'prod-suco']
    }
  },
  {
    id: 'prod-batata-g',
    name: 'Batata Frita Grande',
    description: 'Batatas cortadas na hora, temperadas com sal especial',
    price: 12.90,
    category_id: 'cat-acompanhamentos',
    images: [
      'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400'
    ],
    active: true,
    created_at: new Date(),
    updated_at: new Date(),
    segment_data: {
      variações: {},
      complementos: [
        {
          category: 'Molhos',
          items: [
            { id: 'comp-ketchup', name: 'Ketchup', price: 0 },
            { id: 'comp-maionese', name: 'Maionese', price: 0 },
            { id: 'comp-barbecue', name: 'Barbecue', price: 1.00 }
          ]
        },
        {
          category: 'Adicionais',
          items: [
            { id: 'comp-bacon-bits', name: 'Bacon em Cubos', price: 4.00 },
            { id: 'comp-cheddar-molho', name: 'Cheddar Derretido', price: 3.50 }
          ]
        }
      ],
      tempo_preparo: 8,
      permite_observações: false,
      upsell_products: ['prod-refri-lata']
    }
  },
  {
    id: 'prod-refri-lata',
    name: 'Refrigerante Lata',
    description: 'Coca-Cola, Guaraná ou Fanta - 350ml gelado',
    price: 5.90,
    category_id: 'cat-bebidas',
    images: [
      'https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?w=400'
    ],
    active: true,
    created_at: new Date(),
    updated_at: new Date(),
    segment_data: {
      variações: {
        size: {
          options: [
            { value: 'lata', label: 'Lata 350ml', price: 0 },
            { value: 'garrafa', label: 'Garrafa 600ml', price: 2.00 }
          ],
          required: true
        }
      },
      complementos: [],
      tempo_preparo: 1,
      permite_observações: false,
      upsell_products: []
    }
  }
];

// ============= CUPONS DE EXEMPLO =============

export const exampleCoupons: Coupon[] = [
  {
    id: 'cupom-primeira-compra',
    code: 'BEMVINDO20',
    type: 'percentage',
    value: 20,
    min_order_value: 25.00,
    max_discount: 15.00,
    valid_from: new Date(),
    valid_until: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 dias
    usage_limit: 1,
    used_count: 0,
    categories: undefined, // Todas as categorias
    active: true
  },
  {
    id: 'cupom-frete-gratis',
    code: 'ENTREGAGRATIS',
    type: 'free_delivery',
    value: 0,
    min_order_value: 40.00,
    valid_from: new Date(),
    valid_until: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 dias
    usage_limit: 100,
    used_count: 23,
    active: true
  },
  {
    id: 'cupom-lanches',
    code: 'LANCHE10',
    type: 'fixed',
    value: 10.00,
    min_order_value: 30.00,
    valid_from: new Date(),
    valid_until: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 dias
    categories: ['cat-lanches'],
    active: true,
    usage_limit: undefined,
    used_count: 156
  }
];

// ============= DADOS PIZZARIA (EXEMPLO) =============

export const pizzaCategorias: Category[] = [
  {
    id: 'cat-pizzas-tradicionais',
    name: 'Pizzas Tradicionais',
    description: 'Sabores clássicos que todo mundo ama',
    sort_order: 1,
    active: true
  },
  {
    id: 'cat-pizzas-especiais',
    name: 'Pizzas Especiais',
    description: 'Combinações exclusivas da casa',
    sort_order: 2,
    active: true
  },
  {
    id: 'cat-pizzas-doces',
    name: 'Pizzas Doces',
    description: 'Para quem quer terminar com um docinho',
    sort_order: 3,
    active: true
  }
];

export const pizzaProducts: (BaseProduct & { segment_data: PizzaProduct })[] = [
  {
    id: 'pizza-margherita',
    name: 'Margherita',
    description: 'Molho de tomate, mussarela, tomate cereja, manjericão e azeite',
    price: 32.90, // Preço base P
    category_id: 'cat-pizzas-tradicionais',
    images: [
      'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400',
      'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400'
    ],
    active: true,
    created_at: new Date(),
    updated_at: new Date(),
    segment_data: {
      tamanhos: {
        'P': {
          label: 'Pequena (6 fatias)',
          max_sabores: 1,
          preco_base: 32.90
        },
        'M': {
          label: 'Média (8 fatias)',
          max_sabores: 2,
          preco_base: 42.90
        },
        'G': {
          label: 'Grande (10 fatias)',
          max_sabores: 3,
          preco_base: 52.90
        },
        'XL': {
          label: 'Extra Grande (12 fatias)',
          max_sabores: 4,
          preco_base: 62.90
        }
      },
      categoria_sabor: 'tradicional',
      regra_preco: 'maior_valor',
      bordas_disponíveis: [
        { id: 'borda-catupiry', nome: 'Catupiry', preco: 8.00 },
        { id: 'borda-cheddar', nome: 'Cheddar', preco: 8.00 },
        { id: 'borda-chocolate', nome: 'Chocolate', preco: 10.00 }
      ],
      adicionais: [
        { id: 'add-azeitona', nome: 'Azeitona', preco: 3.00, por_metade: true },
        { id: 'add-oregano', nome: 'Orégano Extra', preco: 1.00, por_metade: false },
        { id: 'add-queijo', nome: 'Queijo Extra', preco: 5.00, por_metade: true }
      ]
    }
  },
  {
    id: 'pizza-calabresa',
    name: 'Calabresa',
    description: 'Molho de tomate, mussarela, calabresa fatiada e cebola',
    price: 35.90,
    category_id: 'cat-pizzas-tradicionais',
    images: [
      'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400'
    ],
    active: true,
    created_at: new Date(),
    updated_at: new Date(),
    segment_data: {
      tamanhos: {
        'P': { label: 'Pequena (6 fatias)', max_sabores: 1, preco_base: 35.90 },
        'M': { label: 'Média (8 fatias)', max_sabores: 2, preco_base: 45.90 },
        'G': { label: 'Grande (10 fatias)', max_sabores: 3, preco_base: 55.90 },
        'XL': { label: 'Extra Grande (12 fatias)', max_sabores: 4, preco_base: 65.90 }
      },
      categoria_sabor: 'tradicional',
      regra_preco: 'maior_valor',
      bordas_disponíveis: [
        { id: 'borda-catupiry', nome: 'Catupiry', preco: 8.00 },
        { id: 'borda-cheddar', nome: 'Cheddar', preco: 8.00 }
      ],
      adicionais: [
        { id: 'add-cebola-extra', nome: 'Cebola Extra', preco: 2.00, por_metade: true },
        { id: 'add-pimentao', nome: 'Pimentão', preco: 3.00, por_metade: true }
      ]
    }
  }
];

// ============= FUNÇÕES UTILITÁRIAS =============

export function calcularPrecoPizza(
  produto: BaseProduct & { segment_data: PizzaProduct },
  tamanho: string,
  sabores: string[],
  borda?: string,
  adicionais?: string[]
): number {
  const configTamanho = produto.segment_data.tamanhos[tamanho];
  if (!configTamanho) return 0;

  let precoFinal = configTamanho.preco_base;

  // Calcular preço dos sabores (regra do maior valor para múltiplos sabores)
  if (sabores.length > 1 && produto.segment_data.regra_preco === 'maior_valor') {
    // Implementar lógica de maior valor
    // Por simplicidade, mantém o preço base
  }

  // Adicionar preço da borda
  if (borda) {
    const bordaConfig = produto.segment_data.bordas_disponíveis.find(b => b.id === borda);
    if (bordaConfig) {
      precoFinal += bordaConfig.preco;
    }
  }

  // Adicionar preço dos adicionais
  if (adicionais) {
    adicionais.forEach(adicionalId => {
      const adicional = produto.segment_data.adicionais.find(a => a.id === adicionalId);
      if (adicional) {
        precoFinal += adicional.preco;
      }
    });
  }

  return precoFinal;
}

export function calcularPrecoLanche(
  produto: BaseProduct & { segment_data: LanchoneteProduct },
  variação?: string,
  complementos?: string[]
): number {
  let precoFinal = produto.price;

  // Adicionar preço da variação de tamanho
  if (variação && produto.segment_data.variações.size) {
    const opcaoSize = produto.segment_data.variações.size.options.find(o => o.value === variação);
    if (opcaoSize) {
      precoFinal += opcaoSize.price;
    }
  }

  // Adicionar preço dos complementos
  if (complementos) {
    complementos.forEach(complementoId => {
      produto.segment_data.complementos.forEach(categoria => {
        const comp = categoria.items.find(item => item.id === complementoId);
        if (comp) {
          precoFinal += comp.price;
        }
      });
    });
  }

  return precoFinal;
}

// ============= CONFIGURAÇÕES DE EXEMPLO =============

export const lanchoneteConfig = {
  nome: 'Burguer House',
  segmento: 'lanchonete' as const,
  tempo_preparo_base: 20, // minutos
  valor_minimo_entrega: 25.00,
  taxa_entrega_padrao: 5.00,
  aceita_agendamento: true,
  upsell_ativo: true,
  kds_ativo: true,
  setores_kds: [
    { nome: 'Grill', ordem: 1, cor: '#ff6b6b' },
    { nome: 'Montagem', ordem: 2, cor: '#4ecdc4' },
    { nome: 'Expedição', ordem: 3, cor: '#45b7d1' }
  ]
};

export const pizzariaConfig = {
  nome: 'Nonna Mia',
  segmento: 'pizzaria' as const,
  tempo_preparo_base: 30, // minutos
  valor_minimo_entrega: 35.00,
  taxa_entrega_padrao: 7.00,
  aceita_agendamento: true,
  pizza_meio_a_meio: true,
  setores_kds: [
    { nome: 'Montagem', ordem: 1, cor: '#ff6b6b' },
    { nome: 'Forno', ordem: 2, cor: '#ffa726' },
    { nome: 'Corte', ordem: 3, cor: '#4ecdc4' },
    { nome: 'Expedição', ordem: 4, cor: '#45b7d1' }
  ]
};