# VarejoFlex - Especificações Técnicas por Segmento

## 🏗️ Núcleo Comum (Todos os Segmentos)

### **Telas Cliente (Loja do Lojista)**
- **Catálogo/Cardápio**: Listagem de produtos por categoria
- **Detalhe do Produto**: Variações, complementos, imagens
- **Carrinho & Cupons**: Gestão de itens e promoções
- **Checkout**: Entrega/Retirada, Pagamento (PIX/Cartão/Dinheiro)
- **Rastreamento**: Status do pedido em tempo real
- **Autenticação**: Login/Cadastro de clientes
- **Conta do Cliente**: Histórico, dados pessoais, endereços

### **Telas Admin (Lojista)**
- **Produtos**: CRUD completo com variações e imagens
- **Categorias**: Organização hierárquica
- **Estoque**: Controle por produto/variação
- **Preços/Promoções/Cupons**: Gestão comercial
- **Entrega**: Área/raio/CEP e taxas
- **Horários/Feriados**: Funcionamento da loja
- **Pedidos**: Gestão completa do fluxo
- **Clientes**: Base cadastral e histórico
- **Integrações**: APIs e webhooks
- **Relatórios**: Dashboards e métricas

### **Módulos Base**
- **Catálogo/Produtos**: Variações, imagens, tags
- **Pedidos & Pagamentos**: PIX/Cartão/Dinheiro
- **Entrega/Retirada**: Tabela de frete, prazos, janelas
- **Cupons/Promoções**: Descontos e ofertas
- **Relatórios & Dashboards**: Métricas de negócio
- **KDS**: Kitchen Display System (quando houver produção)
- **Frota**: Gestão de entrega própria (opcional)

---

## 🍔 1. Lanchonetes (MVP - Prioridade 1)

### **Objetivo**
Vender lanches por delivery/retirada com complementos e combos personalizados.

### **Telas Específicas - Cliente**
- **Catálogo por Categorias**: Lanches, acompanhamentos, bebidas
- **Detalhe com Variações**: Tamanho/ponto do burger, complementos (bacon/queijo)
- **Observações**: Campo livre para customizações
- **Carrinho Inteligente**: Sugestão de combos e upsell
- **Agendamento**: Opção de pedido para horário específico

### **Telas Específicas - Admin**
- **Produto com Complementos**: Configuração de adicionais por categoria
- **Upsell/Combos**: Configuração de produtos relacionados
- **KDS Cozinha**: Tickets por etapa (preparação → finalização)
- **Tempo de Preparo**: Estimativa dinâmica baseada na fila

### **Campos Específicos**
```typescript
interface LanchoneteProduct {
  variações: {
    size: { label: string; price: number }[]
  }
  complementos: {
    category: string;
    items: { name: string; price: number }[]
  }[]
  tempo_preparo: number; // minutos base
  observações: boolean; // permite observações
  upsell_config: string[]; // IDs de produtos relacionados
}
```

### **Regras de Negócio**
- Preço final = base + variações + complementos × quantidade
- Tempo estimado dinâmico baseado na fila do KDS
- Cupons podem ser aplicados por categoria específica
- Upsell automático no carrinho (ex.: batata + refri)

### **Módulos/Submódulos**
- ✅ Catálogo com Complementos
- ✅ Checkout com Upsell
- ✅ Cupons por Categoria
- ✅ KDS Cozinha
- 🔄 Frota (opcional)
- ✅ Relatórios de Performance

### **Métricas Principais**
- **Ticket Médio**: Valor médio por pedido
- **Tempo de Preparo**: Média por produto/categoria
- **Taxa de Conversão**: Visitantes → Pedidos
- **% Uso de Cupons**: Efetividade promocional
- **Upsell Rate**: % de adicionais vendidos

---

## 🍕 2. Pizzarias (Prioridade 2)

### **Objetivo**
Montar pizzas com tamanhos e múltiplos sabores (½, ⅓, ¼), borda recheada e adicionais.

### **Telas Específicas - Cliente**
- **Seletor de Tamanho**: P/M/G/XL com preços diferenciados
- **Composição de Sabores**: Interface para meia/meia, terços, quartos
- **Configurador de Borda**: Bordas recheadas por metade
- **Adicionais por Metade**: Ingredientes específicos por porção

### **Telas Específicas - Admin**
- **Matriz de Sabores**: Faixas de preço por tamanho
- **Regras de Composição**: Quantos sabores permitidos por tamanho
- **KDS Setorizado**: Montagem → Forno → Expedição
- **Áreas de Entrega**: Configuração por bairro/CEP

### **Campos Específicos**
```typescript
interface PizzaProduct {
  tamanho: 'P' | 'M' | 'G' | 'XL';
  sabores: {
    id: string;
    porção: number; // 0.5 para metade, 0.33 para terço
    preço_categoria: 'tradicional' | 'especial' | 'premium';
  }[];
  regra_preço: 'maior_valor' | 'média_ponderada';
  borda?: {
    tipo: string;
    porções: number[]; // quais metades têm borda
  };
  adicionais_por_metade: {
    porção: number;
    ingredientes: string[];
  }[];
}
```

### **Regras de Negócio**
- Preço calculado por regra_preço e quantidade de sabores
- Itens "metade" replicam adicionais por porção específica
- Tempo de forno calculado automaticamente por tamanho
- Entrega com faixas de preço por distância/bairro

### **Módulos/Submódulos**
- 🔄 Compositor de Pizza
- 🔄 KDS por Setor (Montagem/Forno/Expedição)
- 🔄 Entrega Avançada (Faixas por CEP)
- 🔄 Cálculo de Tempo por Etapa

### **Métricas Principais**
- **Tempo por Etapa**: Montagem/Forno/Expedição
- **% Combos Pizza+Refri**: Vendas casadas
- **Sabores Mais Vendidos**: Ranking de preferência
- **Eficiência do Forno**: Pizzas/hora

---

## 👗 3. Moda & Acessórios (Prioridade 3)

### **Objetivo**
Vender produtos com grade/variações (cor/tamanho), fotos por variação e estoque por SKU.

### **Telas Específicas - Cliente**
- **Filtros Avançados**: Tamanho/cor/marca/preço
- **Galeria por Variação**: Imagens específicas para cada SKU
- **Tabela de Medidas**: Guia de tamanhos
- **Área de Trocas**: Solicitação e acompanhamento

### **Telas Específicas - Admin**
- **Grade de Variações**: Matriz cor × tamanho
- **Gestão de SKUs**: EAN, estoque por variação
- **Impressão de Etiquetas**: Integração com PDV
- **Controle de Trocas**: Motivos e reentrada de estoque

### **Campos Específicos**
```typescript
interface ModaProduct {
  variações: {
    cor: string;
    tamanho: string;
    sku: string;
    ean?: string;
    estoque: number;
    preço?: number; // preço diferenciado por variação
    imagens: string[];
  }[];
  tabela_medidas: {
    tamanho: string;
    medidas: Record<string, string>; // busto, cintura, etc.
  }[];
  marca?: string;
  categoria_detalhada: string; // vestidos, camisetas, etc.
}
```

### **Regras de Negócio**
- Bloqueio automático de venda sem estoque do SKU
- Devolução/troca com controle de motivo e reentrada
- Preços diferenciados por variação (quando aplicável)
- Alertas de ruptura por SKU

### **Módulos/Submódulos**
- 🔄 Grade de Variações
- 🔄 Estoque por SKU
- 🔄 Etiquetas PDV
- 🔄 Sistema de Trocas/Devoluções
- 🔄 Gestão de Marcas

### **Métricas Principais**
- **Giro por SKU**: Velocidade de venda por variação
- **Taxa de Troca**: % de devoluções
- **% Ruptura**: Produtos sem estoque
- **Margem por Categoria**: Lucratividade

---

## 🛒 4. Mercados/Supermercados (Prioridade 6)

### **Objetivo**
Vender itens fracionados (kg/l) e pesáveis, integrar com balança e lidar com lote/validade.

### **Telas Específicas - Cliente**
- **Produtos Fracionados**: Exibição de preço/kg
- **Substituição Sugerida**: Itens equivalentes em falta
- **Calculadora de Peso**: Para produtos pesáveis

### **Telas Específicas - Admin**
- **Integração Balança**: EAN de balança e etiquetas
- **Controle Lote/Validade**: Alertas e bloqueios
- **PDV com Leitor**: Código de barras e TEF
- **Promoções por Mix**: Leve 3 pague 2

### **Campos Específicos**
```typescript
interface MercadoProduct {
  uom: 'kg' | 'g' | 'l' | 'ml' | 'un';
  preço_por_unidade?: number;
  preço_por_peso?: number;
  ean_balança?: string;
  fracionável: boolean;
  lotes: {
    código: string;
    validade: Date;
    estoque: number;
  }[];
  categoria_fiscal: string;
}
```

### **Regras de Negócio**
- Cálculo automático por peso (entrada no checkout/PDV)
- Alertas de validade próxima e bloqueio automático
- FIFO (First In, First Out) para produtos com lote
- Integração com balanças para produtos pesáveis

### **Módulos/Submódulos**
- 🔄 Balança/ETI (Etiqueta)
- 🔄 Produtos Fracionados
- 🔄 Controle Lote/Validade
- 🔄 Sistema de Substituição
- 🔄 PDV com Leitor de Código

### **Métricas Principais**
- **% Ruptura**: Produtos em falta
- **Vencimento Iminente**: Alertas por categoria
- **Margem por Categoria**: Lucratividade
- **Giro de Estoque**: Tempo médio de venda

---

## 🐕 5. Petshops (Prioridade 5)

### **Objetivo**
Vender produtos e serviços (banho/tosa) com agenda e ficha do pet.

### **Telas Específicas - Cliente**
- **Ficha do Pet**: Dados, alergias, histórico
- **Agendamento de Serviços**: Escolha de horário/profissional
- **Assinatura de Ração**: Entrega recorrente
- **Lembretes de Vacinação**: Notificações automáticas

### **Telas Específicas - Admin**
- **Agenda por Profissional**: Visualização por recurso/box
- **Ficha Veterinária**: Histórico completo do pet
- **Comissionamento**: Cálculo por profissional/serviço
- **Gestão de Recursos**: Boxes, equipamentos

### **Campos Específicos**
```typescript
interface PetshopService {
  pet: {
    nome: string;
    espécie: string;
    raça: string;
    peso: number;
    alergias: string[];
    vacinas: {
      tipo: string;
      data: Date;
      próxima?: Date;
    }[];
  };
  serviço: {
    tipo: string;
    duração: number; // minutos
    preço: number;
    profissional_id?: string;
    recurso_id?: string; // box, mesa, etc.
  };
  agenda: {
    data: Date;
    profissional: string;
    recurso: string;
    status: 'agendado' | 'em_andamento' | 'concluído';
  };
}
```

### **Regras de Negócio**
- Bloqueio de overbooking por recurso (box/equipamento)
- Pacotes de serviços com múltiplos créditos
- Comissão diferenciada por tipo de serviço
- Lembretes automáticos de vacinação

### **Módulos/Submódulos**
- 🔄 Sistema de Agenda
- 🔄 Ficha do Pet
- 🔄 Assinaturas (Recorrência)
- 🔄 Comissionamento
- 🔄 Gestão de Recursos

### **Métricas Principais**
- **Taxa de Retorno**: Clientes recorrentes
- **LTV por Tutor**: Valor vitalício
- **Ocupação de Agenda**: % utilização
- **Efetividade de Lembretes**: Taxa de agendamento

---

## 💄 6. Salões de Beleza (Prioridade 5)

### **Objetivo**
Agendamento por profissional/cadeira, serviços com duração e comissionamento.

### **Telas Específicas - Cliente**
- **Self-booking**: Escolha de profissional e horário
- **Catálogo de Serviços**: Cabelo, manicure, estética
- **Pacotes de Serviços**: Ex: 5 escovas com desconto
- **Histórico de Atendimentos**: Procedimentos realizados

### **Telas Específicas - Admin**
- **Agenda Profissional**: Visualização diária/semanal
- **Controle de No-show**: Taxas e advertências
- **Comissão por Meta**: Cálculo automático
- **Estoque de Cosméticos**: Venda + consumo interno

### **Campos Específicos**
```typescript
interface SalaoService {
  serviço: {
    categoria: 'cabelo' | 'manicure' | 'estética';
    nome: string;
    duração: number;
    preço: number;
    comissão: {
      tipo: 'fixa' | 'percentual';
      valor: number;
    };
  };
  profissional: {
    id: string;
    especialidades: string[];
    agenda: {
      disponibilidade: Record<string, string[]>; // dia: horários
      bloqueios: { inicio: Date; fim: Date; motivo: string }[];
    };
    metas: {
      período: 'mensal' | 'semanal';
      valor_objetivo: number;
      comissão_extra: number;
    };
  };
}
```

### **Regras de Negócio**
- No-show rate com taxa ou advertência automática
- Comissão por serviço individual + bônus por meta
- Bloqueio automático de horários já ocupados
- Pacotes com validade e controle de créditos

### **Módulos/Submódulos**
- 🔄 Sistema de Agenda Avançado
- 🔄 Comissionamento por Meta
- 🔄 Pacotes de Serviços
- 🔄 Estoque com Consumo Interno
- 🔄 Controle de No-show

### **Métricas Principais**
- **No-show Rate**: % de faltas
- **Ocupação por Cadeira**: Utilização do espaço
- **Receita por Profissional**: Performance individual
- **Taxa de Pacotes**: Vendas casadas

---

## 💊 7. Farmácias & Drogarias (Roadmap)

### **Objetivo**
Vender OTC e produtos regulados com validação de prescrição.

### **Campos Específicos**
```typescript
interface FarmaciaProduct {
  prescrição: {
    obrigatória: boolean;
    arquivo?: string;
    crm_validador?: string;
    data_validação?: Date;
  };
  lote: string;
  validade: Date;
  regulação: {
    anvisa: string;
    controlado: boolean;
    psicotrópico: boolean;
  };
  similaridade: string[]; // produtos equivalentes
}
```

### **Módulos/Submódulos**
- 🔄 Validação Manual de Prescrição (MVP)
- 🔄 Controle Lote/Validade
- 🔄 PDV com Leitor especializado
- 🔄 Sistema de Rastreabilidade

---

## 🏪 8. Conveniência (Roadmap)

### **Objetivo**
Catálogo misto alimentos/bebidas, combos e delivery rápido.

### **Campos Específicos**
```typescript
interface ConvenienciaProduct {
  janela_horária: {
    inicio: string;
    fim: string;
    disponível: boolean;
  }[];
  combo: {
    componentes: string[];
    preço_combo: number;
    economia: number;
  };
  ocasião: 'madrugada' | 'viagem' | 'trabalho';
}
```

---

## 🚛 Módulo Frota (Transversal Opcional)

### **Objetivo**
Cadastrar veículos, condutores e rastrear entregas próprias.

### **Campos Específicos**
```typescript
interface Frota {
  veículo: {
    placa: string;
    renavam?: string;
    tipo: 'moto' | 'carro' | 'van';
    combustível: 'gasolina' | 'álcool' | 'flex' | 'elétrico';
    odômetro: number;
    status: 'disponível' | 'em_rota' | 'manutenção';
  };
  condutor: {
    nome: string;
    cnh: string;
    validade_cnh: Date;
    veículos_habilitados: string[];
  };
  manutenção: {
    tipo: 'preventiva' | 'corretiva';
    data: Date;
    custo: number;
    próxima?: Date;
  };
}
```

### **Métricas**
- **Custo/km**: Análise de eficiência
- **Disponibilidade**: % tempo ativo
- **SLA de Entrega**: Tempo médio porta-a-porta

---

## 🏗️ Roadmap de Implementação

### **Fase 1 - MVP Lanchonetes** ✅
- Núcleo comum completo
- Especialização para lanchonetes
- KDS básico
- Relatórios essenciais

### **Fase 2 - Pizzarias** 🔄
- Compositor de pizza
- KDS setorizado
- Entrega por zona

### **Fase 3 - Moda & Acessórios** 📋
- Grade de variações
- Estoque por SKU
- Sistema de trocas

### **Fase 4 - Petshops & Salões** 📋
- Sistema de agenda
- Ficha de clientes/pets
- Comissionamento

### **Fase 5 - Mercados** 📋
- Produtos fracionados
- Integração balança
- Controle de lote

### **Fase 6 - Farmácias & Conveniência** 📋
- Validação de prescrição
- Produtos por horário
- Regulamentações

### **Módulo Frota** (Paralelo)
- Integração com qualquer segmento que tenha entrega própria

---

## 🔐 Sistema de Permissões

- **owner_saas**: Acesso total ao sistema
- **admin_store**: Gestão completa da loja
- **staff**: Operação diária (PDV, KDS)
- **gerente_rh**: Módulo RH (futuro)

Esta arquitetura garante **máximo reuso** do núcleo comum enquanto permite **especialização** profunda para cada segmento de negócio.