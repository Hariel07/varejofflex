'use client';

import React, { useState, useEffect } from 'react';

interface CostAnalysis {
  ingredients: {
    totalValue: number;
    lowStockItems: number;
    categories: Array<{
      name: string;
      value: number;
      percentage: number;
    }>;
  };
  recipes: {
    totalRecipes: number;
    avgCostPerServing: number;
    mostExpensive: Array<{
      name: string;
      cost: number;
    }>;
    cheapest: Array<{
      name: string;
      cost: number;
    }>;
  };
  products: {
    totalProducts: number;
    avgProfitMargin: number;
    totalRevenuePotential: number;
    bestMargins: Array<{
      name: string;
      margin: number;
    }>;
  };
  purchases: {
    totalPurchases: number;
    monthlySpending: number;
    topSuppliers: Array<{
      name: string;
      amount: number;
    }>;
  };
}

const modernStyles = {
  container: {
    padding: '20px',
  },
  header: {
    marginBottom: '32px',
  },
  title: {
    fontSize: '1.875rem',
    fontWeight: '700',
    color: '#ffffff',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '8px',
  },
  subtitle: {
    color: '#94a3b8',
    fontSize: '1.125rem',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '24px',
    marginBottom: '32px',
  },
  card: {
    background: 'rgba(30, 41, 59, 0.8)',
    borderRadius: '16px',
    padding: '24px',
    border: '1px solid rgba(51, 65, 85, 0.5)',
    transition: 'all 0.2s ease',
  },
  cardTitle: {
    fontSize: '1.125rem',
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: '16px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  statItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 0',
    borderBottom: '1px solid rgba(71, 85, 105, 0.3)',
  },
  statItemLast: {
    borderBottom: 'none',
  },
  statLabel: {
    color: '#94a3b8',
    fontSize: '0.875rem',
  },
  statValue: {
    color: '#ffffff',
    fontWeight: '600',
  },
  bigStat: {
    textAlign: 'center' as const,
    padding: '20px',
    background: 'rgba(51, 65, 85, 0.5)',
    borderRadius: '12px',
    marginBottom: '16px',
  },
  bigStatValue: {
    fontSize: '2rem',
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: '4px',
  },
  bigStatLabel: {
    color: '#94a3b8',
    fontSize: '0.875rem',
  },
  progressBar: {
    width: '100%',
    height: '8px',
    background: 'rgba(71, 85, 105, 0.5)',
    borderRadius: '4px',
    overflow: 'hidden',
    marginTop: '8px',
  },
  progressFill: {
    height: '100%',
    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    borderRadius: '4px',
    transition: 'width 0.3s ease',
  },
  listItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '8px 0',
    borderBottom: '1px solid rgba(71, 85, 105, 0.2)',
  },
  listItemLast: {
    borderBottom: 'none',
  },
  listName: {
    color: '#e2e8f0',
    fontSize: '0.875rem',
  },
  listValue: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: '0.875rem',
  },
  filterSection: {
    background: 'rgba(30, 41, 59, 0.8)',
    borderRadius: '16px',
    padding: '24px',
    border: '1px solid rgba(51, 65, 85, 0.5)',
    marginBottom: '24px',
  },
  filterTitle: {
    fontSize: '1.125rem',
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: '16px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  filterRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '16px',
  },
  filterGroup: {
    marginBottom: '16px',
  },
  label: {
    display: 'block',
    fontSize: '0.875rem',
    fontWeight: '600',
    color: '#e2e8f0',
    marginBottom: '6px',
  },
  select: {
    width: '100%',
    padding: '12px 16px',
    background: 'rgba(51, 65, 85, 0.8)',
    border: '1px solid rgba(71, 85, 105, 0.5)',
    borderRadius: '8px',
    color: '#ffffff',
    fontSize: '0.875rem',
    transition: 'all 0.2s ease',
    fontFamily: 'inherit',
  },
  button: {
    padding: '12px 24px',
    borderRadius: '8px',
    border: 'none',
    fontWeight: '600',
    fontSize: '0.875rem',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    fontFamily: 'inherit',
    background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
    color: '#ffffff',
  },
  alertCard: {
    background: 'rgba(239, 68, 68, 0.1)',
    border: '1px solid rgba(239, 68, 68, 0.3)',
    borderRadius: '12px',
    padding: '20px',
    marginBottom: '24px',
  },
  alertTitle: {
    color: '#f87171',
    fontWeight: '600',
    marginBottom: '12px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  alertList: {
    color: '#fca5a5',
    fontSize: '0.875rem',
  },
  successCard: {
    background: 'rgba(34, 197, 94, 0.1)',
    border: '1px solid rgba(34, 197, 94, 0.3)',
    borderRadius: '12px',
    padding: '20px',
    marginBottom: '24px',
  },
  successTitle: {
    color: '#4ade80',
    fontWeight: '600',
    marginBottom: '12px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  warningCard: {
    background: 'rgba(245, 158, 11, 0.1)',
    border: '1px solid rgba(245, 158, 11, 0.3)',
    borderRadius: '12px',
    padding: '20px',
    marginBottom: '24px',
  },
  warningTitle: {
    color: '#fbbf24',
    fontWeight: '600',
    marginBottom: '12px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
};

export default function CostAnalysisComponent() {
  const [analysis, setAnalysis] = useState<CostAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [period, setPeriod] = useState('30');
  const [category, setCategory] = useState('all');

  useEffect(() => {
    loadAnalysis();
  }, [period, category]);

  const loadAnalysis = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/cost-analysis?period=${period}&category=${category}`);
      if (response.ok) {
        const data = await response.json();
        setAnalysis(data);
      }
    } catch (error) {
      console.error('Erro ao carregar análise:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateReport = async () => {
    // Implementar geração de relatório em PDF
    alert('Funcionalidade de relatório em desenvolvimento');
  };

  if (loading) {
    return (
      <div style={{...modernStyles.container, textAlign: 'center', padding: '80px 20px'}}>
        <div style={{fontSize: '4rem', marginBottom: '16px'}}>⏳</div>
        <h3 style={{color: '#ffffff', marginBottom: '8px'}}>Carregando Análise</h3>
        <p style={{color: '#94a3b8'}}>Processando dados de custos...</p>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div style={{...modernStyles.container, textAlign: 'center', padding: '80px 20px'}}>
        <div style={{fontSize: '4rem', marginBottom: '16px'}}>📊</div>
        <h3 style={{color: '#ffffff', marginBottom: '8px'}}>Sem Dados Suficientes</h3>
        <p style={{color: '#94a3b8'}}>Cadastre ingredientes, receitas e produtos para ver a análise de custos.</p>
      </div>
    );
  }

  return (
    <div style={modernStyles.container}>
      {/* Header */}
      <div style={modernStyles.header}>
        <h1 style={modernStyles.title}>
          📊 Análise de Custos
        </h1>
        <p style={modernStyles.subtitle}>
          Análise completa de custos, margens e oportunidades de otimização
        </p>
      </div>

      {/* Filtros */}
      <div style={modernStyles.filterSection}>
        <h2 style={modernStyles.filterTitle}>
          🔍 Filtros de Análise
        </h2>
        <div style={modernStyles.filterRow}>
          <div style={modernStyles.filterGroup}>
            <label style={modernStyles.label}>Período</label>
            <select
              style={modernStyles.select}
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              onFocus={(e) => e.target.style.borderColor = '#6366f1'}
              onBlur={(e) => e.target.style.borderColor = 'rgba(71, 85, 105, 0.5)'}
            >
              <option value="7">Últimos 7 dias</option>
              <option value="30">Últimos 30 dias</option>
              <option value="90">Últimos 3 meses</option>
              <option value="365">Último ano</option>
            </select>
          </div>

          <div style={modernStyles.filterGroup}>
            <label style={modernStyles.label}>Categoria</label>
            <select
              style={modernStyles.select}
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              onFocus={(e) => e.target.style.borderColor = '#6366f1'}
              onBlur={(e) => e.target.style.borderColor = 'rgba(71, 85, 105, 0.5)'}
            >
              <option value="all">Todas as categorias</option>
              <option value="carnes">Carnes</option>
              <option value="vegetais">Vegetais</option>
              <option value="laticinios">Laticínios</option>
              <option value="temperos">Temperos</option>
            </select>
          </div>

          <div style={{display: 'flex', alignItems: 'end'}}>
            <button
              style={modernStyles.button}
              onClick={generateReport}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              📄 Gerar Relatório
            </button>
          </div>
        </div>
      </div>

      {/* Alertas e Recomendações */}
      {analysis.ingredients.lowStockItems > 0 && (
        <div style={modernStyles.alertCard}>
          <h3 style={modernStyles.alertTitle}>
            🚨 Atenção Necessária
          </h3>
          <div style={modernStyles.alertList}>
            <p>• {analysis.ingredients.lowStockItems} ingredientes com estoque baixo</p>
            <p>• Recomenda-se reabastecer para evitar interrupções na produção</p>
          </div>
        </div>
      )}

      {analysis.products.avgProfitMargin > 80 && (
        <div style={modernStyles.successCard}>
          <h3 style={modernStyles.successTitle}>
            ✅ Ótima Performance
          </h3>
          <p style={{color: '#86efac', fontSize: '0.875rem'}}>
            Margem de lucro média de {analysis.products.avgProfitMargin.toFixed(1)}% está excelente!
          </p>
        </div>
      )}

      {analysis.recipes.avgCostPerServing > 15 && (
        <div style={modernStyles.warningCard}>
          <h3 style={modernStyles.warningTitle}>
            ⚠️ Oportunidade de Otimização
          </h3>
          <p style={{color: '#fcd34d', fontSize: '0.875rem'}}>
            Custo médio por porção está alto (R$ {analysis.recipes.avgCostPerServing.toFixed(2)}). 
            Considere revisar fornecedores ou receitas.
          </p>
        </div>
      )}

      {/* Dashboard Principal */}
      <div style={modernStyles.grid}>
        {/* Resumo Geral */}
        <div style={modernStyles.card}>
          <h2 style={modernStyles.cardTitle}>
            💰 Resumo Financeiro
          </h2>
          <div style={modernStyles.bigStat}>
            <div style={{...modernStyles.bigStatValue, color: '#10b981'}}>
              R$ {analysis.ingredients.totalValue.toFixed(2)}
            </div>
            <div style={modernStyles.bigStatLabel}>Valor Total em Estoque</div>
          </div>
          <div style={modernStyles.statItem}>
            <span style={modernStyles.statLabel}>Potencial de Receita</span>
            <span style={{...modernStyles.statValue, color: '#4ade80'}}>
              R$ {analysis.products.totalRevenuePotential.toFixed(2)}
            </span>
          </div>
          <div style={{...modernStyles.statItem, ...modernStyles.statItemLast}}>
            <span style={modernStyles.statLabel}>Gasto Mensal</span>
            <span style={modernStyles.statValue}>
              R$ {analysis.purchases.monthlySpending.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Análise de Ingredientes */}
        <div style={modernStyles.card}>
          <h2 style={modernStyles.cardTitle}>
            🥬 Análise de Ingredientes
          </h2>
          <div style={modernStyles.statItem}>
            <span style={modernStyles.statLabel}>Valor Total</span>
            <span style={modernStyles.statValue}>
              R$ {analysis.ingredients.totalValue.toFixed(2)}
            </span>
          </div>
          <div style={modernStyles.statItem}>
            <span style={modernStyles.statLabel}>Estoque Baixo</span>
            <span style={{...modernStyles.statValue, color: analysis.ingredients.lowStockItems > 0 ? '#f59e0b' : '#4ade80'}}>
              {analysis.ingredients.lowStockItems} itens
            </span>
          </div>
          <div style={{...modernStyles.statItem, ...modernStyles.statItemLast}}>
            <span style={modernStyles.statLabel}>Categorias</span>
            <span style={modernStyles.statValue}>
              {analysis.ingredients.categories.length}
            </span>
          </div>

          <h4 style={{color: '#ffffff', fontSize: '0.875rem', marginTop: '16px', marginBottom: '8px'}}>
            Distribuição por Categoria
          </h4>
          {analysis.ingredients.categories.map((cat, index) => (
            <div key={index} style={{marginBottom: '8px'}}>
              <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '4px'}}>
                <span style={{...modernStyles.listName, fontSize: '0.75rem'}}>{cat.name}</span>
                <span style={{...modernStyles.listValue, fontSize: '0.75rem'}}>
                  R$ {cat.value.toFixed(2)} ({cat.percentage.toFixed(1)}%)
                </span>
              </div>
              <div style={modernStyles.progressBar}>
                <div 
                  style={{...modernStyles.progressFill, width: `${cat.percentage}%`}}
                ></div>
              </div>
            </div>
          ))}
        </div>

        {/* Análise de Receitas */}
        <div style={modernStyles.card}>
          <h2 style={modernStyles.cardTitle}>
            📝 Análise de Receitas
          </h2>
          <div style={modernStyles.bigStat}>
            <div style={modernStyles.bigStatValue}>
              {analysis.recipes.totalRecipes}
            </div>
            <div style={modernStyles.bigStatLabel}>Receitas Cadastradas</div>
          </div>
          <div style={modernStyles.statItem}>
            <span style={modernStyles.statLabel}>Custo Médio/Porção</span>
            <span style={modernStyles.statValue}>
              R$ {analysis.recipes.avgCostPerServing.toFixed(2)}
            </span>
          </div>

          <h4 style={{color: '#ffffff', fontSize: '0.875rem', marginTop: '16px', marginBottom: '8px'}}>
            Receitas Mais Caras
          </h4>
          {analysis.recipes.mostExpensive.map((recipe, index) => (
            <div key={index} style={index === analysis.recipes.mostExpensive.length - 1 ? modernStyles.listItemLast : modernStyles.listItem}>
              <span style={modernStyles.listName}>{recipe.name}</span>
              <span style={{...modernStyles.listValue, color: '#f59e0b'}}>
                R$ {recipe.cost.toFixed(2)}
              </span>
            </div>
          ))}

          <h4 style={{color: '#ffffff', fontSize: '0.875rem', marginTop: '16px', marginBottom: '8px'}}>
            Receitas Mais Econômicas
          </h4>
          {analysis.recipes.cheapest.map((recipe, index) => (
            <div key={index} style={index === analysis.recipes.cheapest.length - 1 ? modernStyles.listItemLast : modernStyles.listItem}>
              <span style={modernStyles.listName}>{recipe.name}</span>
              <span style={{...modernStyles.listValue, color: '#4ade80'}}>
                R$ {recipe.cost.toFixed(2)}
              </span>
            </div>
          ))}
        </div>

        {/* Análise de Produtos */}
        <div style={modernStyles.card}>
          <h2 style={modernStyles.cardTitle}>
            🍔 Análise de Produtos
          </h2>
          <div style={modernStyles.bigStat}>
            <div style={{...modernStyles.bigStatValue, color: '#f59e0b'}}>
              {analysis.products.avgProfitMargin.toFixed(1)}%
            </div>
            <div style={modernStyles.bigStatLabel}>Margem Média de Lucro</div>
          </div>
          <div style={modernStyles.statItem}>
            <span style={modernStyles.statLabel}>Total de Produtos</span>
            <span style={modernStyles.statValue}>
              {analysis.products.totalProducts}
            </span>
          </div>
          <div style={{...modernStyles.statItem, ...modernStyles.statItemLast}}>
            <span style={modernStyles.statLabel}>Receita Potencial</span>
            <span style={{...modernStyles.statValue, color: '#4ade80'}}>
              R$ {analysis.products.totalRevenuePotential.toFixed(2)}
            </span>
          </div>

          <h4 style={{color: '#ffffff', fontSize: '0.875rem', marginTop: '16px', marginBottom: '8px'}}>
            Melhores Margens
          </h4>
          {analysis.products.bestMargins.map((product, index) => (
            <div key={index} style={index === analysis.products.bestMargins.length - 1 ? modernStyles.listItemLast : modernStyles.listItem}>
              <span style={modernStyles.listName}>{product.name}</span>
              <span style={{...modernStyles.listValue, color: '#4ade80'}}>
                {product.margin.toFixed(1)}%
              </span>
            </div>
          ))}
        </div>

        {/* Análise de Compras */}
        <div style={modernStyles.card}>
          <h2 style={modernStyles.cardTitle}>
            🛒 Análise de Compras
          </h2>
          <div style={modernStyles.bigStat}>
            <div style={modernStyles.bigStatValue}>
              {analysis.purchases.totalPurchases}
            </div>
            <div style={modernStyles.bigStatLabel}>Compras no Período</div>
          </div>
          <div style={{...modernStyles.statItem, ...modernStyles.statItemLast}}>
            <span style={modernStyles.statLabel}>Gasto Mensal</span>
            <span style={modernStyles.statValue}>
              R$ {analysis.purchases.monthlySpending.toFixed(2)}
            </span>
          </div>

          <h4 style={{color: '#ffffff', fontSize: '0.875rem', marginTop: '16px', marginBottom: '8px'}}>
            Principais Fornecedores
          </h4>
          {analysis.purchases.topSuppliers.map((supplier, index) => (
            <div key={index} style={index === analysis.purchases.topSuppliers.length - 1 ? modernStyles.listItemLast : modernStyles.listItem}>
              <span style={modernStyles.listName}>{supplier.name}</span>
              <span style={modernStyles.listValue}>
                R$ {supplier.amount.toFixed(2)}
              </span>
            </div>
          ))}
        </div>

        {/* Recomendações */}
        <div style={modernStyles.card}>
          <h2 style={modernStyles.cardTitle}>
            💡 Recomendações
          </h2>
          <div style={{color: '#e2e8f0', fontSize: '0.875rem', lineHeight: '1.6'}}>
            <div style={{marginBottom: '12px'}}>
              <strong style={{color: '#4ade80'}}>✅ Pontos Fortes:</strong>
              <ul style={{marginTop: '4px', paddingLeft: '16px'}}>
                <li>Boa diversidade de ingredientes</li>
                <li>Margem de lucro saudável</li>
                <li>Controle de custos eficiente</li>
              </ul>
            </div>
            
            <div style={{marginBottom: '12px'}}>
              <strong style={{color: '#f59e0b'}}>⚠️ Atenção:</strong>
              <ul style={{marginTop: '4px', paddingLeft: '16px'}}>
                <li>Monitorar estoque baixo</li>
                <li>Revisar fornecedores caros</li>
                <li>Otimizar receitas de alto custo</li>
              </ul>
            </div>

            <div>
              <strong style={{color: '#60a5fa'}}>🚀 Oportunidades:</strong>
              <ul style={{marginTop: '4px', paddingLeft: '16px'}}>
                <li>Aumentar margem em produtos populares</li>
                <li>Negociar melhores preços</li>
                <li>Criar combos rentáveis</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}