'use client';

import React, { useState } from 'react';
import PurchaseManager from './dashboard/PurchaseManager';
import IngredientManager from './dashboard/IngredientManager';
import RecipeManager from './dashboard/RecipeManager';
import ProductManager from './dashboard/ProductManager';
import CostAnalysisComponent from './dashboard/CostAnalysisComponent';
import InventoryDashboard from './dashboard/InventoryDashboard';
import StockMovementManager from './dashboard/StockMovementManager';

interface TabConfig {
  id: string;
  label: string;
  icon: string;
  component: React.ComponentType;
  description: string;
}

const modernStyles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
    color: '#ffffff',
    padding: '24px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Noto Sans", Ubuntu, Cantarell, "Helvetica Neue", sans-serif',
  },
  header: {
    marginBottom: '32px',
  },
  title: {
    fontSize: '2.25rem',
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: '8px',
    background: 'linear-gradient(135deg, #3b82f6 0%, #f97316 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },
  subtitle: {
    fontSize: '1.125rem',
    color: '#94a3b8',
    fontWeight: '400',
  },
  tabsContainer: {
    marginBottom: '24px',
  },
  tabsWrapper: {
    background: 'rgba(30, 41, 59, 0.8)',
    backdropFilter: 'blur(20px)',
    borderRadius: '16px',
    padding: '8px',
    border: '1px solid rgba(51, 65, 85, 0.5)',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  },
  tabsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '8px',
  },
  tab: {
    padding: '16px',
    borderRadius: '12px',
    textAlign: 'center' as const,
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    border: 'none',
    background: 'transparent',
    color: '#94a3b8',
    fontFamily: 'inherit',
  },
  tabActive: {
    background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
    color: '#ffffff',
    transform: 'scale(1.02)',
    boxShadow: '0 10px 25px -5px rgba(249, 115, 22, 0.4)',
  },
  tabIcon: {
    fontSize: '2rem',
    marginBottom: '8px',
    display: 'block',
  },
  tabLabel: {
    fontWeight: '600',
    fontSize: '0.875rem',
    display: 'block',
  },
  descriptionContainer: {
    marginTop: '16px',
    background: 'rgba(30, 41, 59, 0.6)',
    borderRadius: '12px',
    padding: '16px',
    border: '1px solid rgba(51, 65, 85, 0.3)',
  },
  descriptionHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  descriptionIcon: {
    fontSize: '1.5rem',
  },
  descriptionTitle: {
    fontSize: '1.25rem',
    fontWeight: '600',
    color: '#ffffff',
  },
  descriptionText: {
    color: '#94a3b8',
    marginTop: '4px',
  },
  contentContainer: {
    background: 'rgba(30, 41, 59, 0.6)',
    borderRadius: '16px',
    padding: '24px',
    border: '1px solid rgba(51, 65, 85, 0.3)',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    backdropFilter: 'blur(20px)',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '24px',
    marginTop: '32px',
  },
  statCard: {
    background: 'rgba(30, 41, 59, 0.8)',
    borderRadius: '12px',
    padding: '24px',
    textAlign: 'center' as const,
    border: '1px solid rgba(51, 65, 85, 0.5)',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
  },
  statIcon: {
    fontSize: '3rem',
    marginBottom: '8px',
    display: 'block',
  },
  statValue: {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: '4px',
  },
  statLabel: {
    color: '#94a3b8',
    fontSize: '0.875rem',
  },
  footer: {
    marginTop: '32px',
    textAlign: 'center' as const,
    color: '#64748b',
    fontSize: '0.875rem',
  },
};

export default function CostManagementDashboard() {
  const [activeTab, setActiveTab] = useState('purchases');

  const tabs: TabConfig[] = [
    {
      id: 'purchases',
      label: 'Compras',
      icon: '🛒',
      component: PurchaseManager,
      description: 'Gestão de compras e entrada de estoque'
    },
    {
      id: 'movements',
      label: 'Movimentações',
      icon: '📦',
      component: StockMovementManager,
      description: 'Entrada e saída simplificada de estoque'
    },
    {
      id: 'inventory',
      label: 'Relatórios',
      icon: '�',
      component: InventoryDashboard,
      description: 'Relatórios e controle de estoque'
    },
    {
      id: 'ingredients',
      label: 'Ingredientes',
      icon: '🥬',
      component: IngredientManager,
      description: 'Cadastro e gestão de ingredientes'
    },
    {
      id: 'recipes',
      label: 'Receitas',
      icon: '📝',
      component: RecipeManager,
      description: 'Criação e custeio de receitas'
    },
    {
      id: 'products',
      label: 'Produtos',
      icon: '🍔',
      component: ProductManager,
      description: 'Produtos finais e precificação'
    },
    {
      id: 'analysis',
      label: 'Análise',
      icon: '�',
      component: CostAnalysisComponent,
      description: 'Relatórios e análises de custos'
    }
  ];

  const activeTabConfig = tabs.find(tab => tab.id === activeTab);
  const ActiveComponent = activeTabConfig?.component || (() => <div>Componente não encontrado</div>);

  return (
    <div style={modernStyles.container}>
      {/* Header Principal */}
      <div style={modernStyles.header}>
        <h1 style={modernStyles.title}>
          💰 Sistema de Gestão de Custos
        </h1>
        <p style={modernStyles.subtitle}>
          Controle completo de custos, ingredientes, receitas e produtos
        </p>
      </div>

      {/* Navegação por Tabs */}
      <div style={modernStyles.tabsContainer}>
        <div style={modernStyles.tabsWrapper}>
          <div style={modernStyles.tabsGrid}>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  ...modernStyles.tab,
                  ...(activeTab === tab.id ? modernStyles.tabActive : {}),
                }}
                onMouseEnter={(e) => {
                  if (activeTab !== tab.id) {
                    e.currentTarget.style.background = 'rgba(51, 65, 85, 0.5)';
                    e.currentTarget.style.color = '#ffffff';
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeTab !== tab.id) {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = '#94a3b8';
                  }
                }}
              >
                <span style={modernStyles.tabIcon}>{tab.icon}</span>
                <span style={modernStyles.tabLabel}>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Descrição da Tab Ativa */}
        {activeTabConfig && (
          <div style={modernStyles.descriptionContainer}>
            <div style={modernStyles.descriptionHeader}>
              <span style={modernStyles.descriptionIcon}>{activeTabConfig.icon}</span>
              <div>
                <h2 style={modernStyles.descriptionTitle}>
                  {activeTabConfig.label}
                </h2>
                <p style={modernStyles.descriptionText}>
                  {activeTabConfig.description}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Conteúdo da Tab Ativa */}
      <div style={modernStyles.contentContainer}>
        <ActiveComponent />
      </div>

      {/* Estatísticas Rápidas */}
      <div style={modernStyles.statsGrid}>
        <div 
          style={modernStyles.statCard}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-4px)';
            e.currentTarget.style.background = 'rgba(59, 130, 246, 0.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.background = 'rgba(30, 41, 59, 0.8)';
          }}
        >
          <span style={modernStyles.statIcon}>📈</span>
          <div style={modernStyles.statValue}>R$ 0,00</div>
          <div style={modernStyles.statLabel}>Valor Total do Estoque</div>
        </div>

        <div 
          style={modernStyles.statCard}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-4px)';
            e.currentTarget.style.background = 'rgba(245, 158, 11, 0.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.background = 'rgba(30, 41, 59, 0.8)';
          }}
        >
          <span style={modernStyles.statIcon}>⚠️</span>
          <div style={{...modernStyles.statValue, color: '#fbbf24'}}>0</div>
          <div style={modernStyles.statLabel}>Itens com Estoque Baixo</div>
        </div>

        <div 
          style={modernStyles.statCard}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-4px)';
            e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.background = 'rgba(30, 41, 59, 0.8)';
          }}
        >
          <span style={modernStyles.statIcon}>📅</span>
          <div style={{...modernStyles.statValue, color: '#f87171'}}>0</div>
          <div style={modernStyles.statLabel}>Itens Vencendo</div>
        </div>

        <div 
          style={modernStyles.statCard}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-4px)';
            e.currentTarget.style.background = 'rgba(59, 130, 246, 0.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.background = 'rgba(30, 41, 59, 0.8)';
          }}
        >
          <span style={modernStyles.statIcon}>🛒</span>
          <div style={{...modernStyles.statValue, color: '#60a5fa'}}>0</div>
          <div style={modernStyles.statLabel}>Compras Pendentes</div>
        </div>
      </div>

      {/* Rodapé */}
      <div style={modernStyles.footer}>
        <p>VarejoFlex - Sistema de Gestão de Custos v1.0</p>
        <p>Desenvolvido para otimizar o controle de custos do seu negócio</p>
      </div>
    </div>
  );
}