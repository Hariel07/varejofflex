'use client';

import React, { useState, useEffect } from 'react';

interface Tab {
  id: string;
  name: string;
  icon: string;
  component: React.ComponentType;
}

// Componentes temporários enquanto não são criados
const IngredientManager = () => <div className="text-white">🥬 Gestão de Ingredientes - Em desenvolvimento</div>;
const RecipeManager = () => <div className="text-white">📝 Gestão de Receitas - Em desenvolvimento</div>;
const ProductManager = () => <div className="text-white">🍔 Gestão de Produtos - Em desenvolvimento</div>;
const CategoryManager = () => <div className="text-white">🏷️ Gestão de Categorias - Em desenvolvimento</div>;
const CostAnalysisDashboard = () => <div className="text-white">📊 Análise de Custos - Em desenvolvimento</div>;

const tabs: Tab[] = [
  {
    id: 'analysis',
    name: 'Análise de Custos',
    icon: '📊',
    component: CostAnalysisDashboard
  },
  {
    id: 'ingredients',
    name: 'Ingredientes',
    icon: '🥬',
    component: IngredientManager
  },
  {
    id: 'recipes',
    name: 'Receitas',
    icon: '📝',
    component: RecipeManager
  },
  {
    id: 'products',
    name: 'Produtos',
    icon: '🍔',
    component: ProductManager
  },
  {
    id: 'categories',
    name: 'Categorias',
    icon: '🏷️',
    component: CategoryManager
  }
];

export default function CostManagementDashboard() {
  const [activeTab, setActiveTab] = useState('analysis');
  const [isLoading, setIsLoading] = useState(false);

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component || CostAnalysisDashboard;

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 border-b-4 border-orange-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <span className="text-3xl mr-3">🍔</span>
              <h1 className="text-3xl font-bold text-white">
                Gestão de Custos - Lanchonete
              </h1>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-center space-x-2 py-4 px-3 text-sm font-medium whitespace-nowrap
                  border-b-2 transition-colors duration-200
                  ${activeTab === tab.id
                    ? 'border-orange-500 text-orange-500'
                    : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
                  }
                `}
              >
                <span className="text-lg">{tab.icon}</span>
                <span>{tab.name}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
          </div>
        ) : (
          <ActiveComponent />
        )}
      </main>

      {/* Toast Notifications Container */}
      <div id="toast-container" className="fixed bottom-4 right-4 z-50 space-y-2">
        {/* Toasts serão inseridos aqui dinamicamente */}
      </div>
    </div>
  );
}

// Hook para exibir notificações
export function useToast() {
  const showToast = (title: string, message: string, type: 'success' | 'error' | 'warning' = 'success') => {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toastId = `toast-${Date.now()}`;
    const bgColor = {
      success: 'bg-green-600',
      error: 'bg-red-600',
      warning: 'bg-yellow-600'
    }[type];

    const toastHtml = `
      <div id="${toastId}" class="toast ${bgColor} text-white p-4 rounded-lg shadow-lg max-w-sm transform translate-x-full transition-transform duration-300">
        <div class="flex justify-between items-start">
          <div>
            <h4 class="font-bold">${title}</h4>
            <p class="text-sm">${message}</p>
          </div>
          <button onclick="document.getElementById('${toastId}').remove()" class="ml-4 text-white hover:text-gray-200">
            ×
          </button>
        </div>
      </div>
    `;

    container.insertAdjacentHTML('beforeend', toastHtml);
    
    // Animação de entrada
    setTimeout(() => {
      const toast = document.getElementById(toastId);
      if (toast) {
        toast.classList.remove('translate-x-full');
      }
    }, 100);

    // Auto-remover após 5 segundos
    setTimeout(() => {
      const toast = document.getElementById(toastId);
      if (toast) {
        toast.classList.add('translate-x-full');
        setTimeout(() => toast.remove(), 300);
      }
    }, 5000);
  };

  return { showToast };
}

// Função utilitária para formatação de moeda
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value || 0);
}

// Função utilitária para chamadas API
export async function apiCall(endpoint: string, options: RequestInit = {}) {
  try {
    const response = await fetch(`/api/${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Erro na requisição');
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}