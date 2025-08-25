'use client';

import React, { useState, useEffect } from 'react';

interface InventoryReport {
  currentStock: any[];
  lowStock: any[];
  expiringItems: any[];
  batchTracking: any[];
}

export default function InventoryDashboard() {
  const [reports, setReports] = useState<InventoryReport>({
    currentStock: [],
    lowStock: [],
    expiringItems: [],
    batchTracking: []
  });
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('current');

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/inventory/reports');
      const data = await response.json();
      
      if (data.success) {
        setReports(data.reports);
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error('Erro ao carregar relatórios:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const tabs = [
    { id: 'current', label: 'Estoque Atual', icon: '📦' },
    { id: 'low', label: 'Estoque Baixo', icon: '⚠️' },
    { id: 'expiring', label: 'Vencendo', icon: '📅' },
    { id: 'batches', label: 'Lotes', icon: '🏷️' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white flex items-center">
          📊 Relatórios de Estoque
        </h2>
        <p className="text-gray-400 mt-1">
          Acompanhe o status do seu estoque
        </p>
      </div>

      {/* Tabs */}
      <div className="bg-gray-800 rounded-lg p-4">
        <div className="flex space-x-2 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Conteúdo dos Relatórios */}
      <div className="bg-gray-800 rounded-lg p-6">
        {isLoading ? (
          <div className="text-center py-8 text-gray-400">
            Carregando relatórios...
          </div>
        ) : (
          <>
            {/* Estoque Atual */}
            {activeTab === 'current' && (
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Estoque Atual</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-700">
                      <tr>
                        <th className="px-4 py-2 text-left text-gray-300">Ingrediente</th>
                        <th className="px-4 py-2 text-left text-gray-300">Quantidade</th>
                        <th className="px-4 py-2 text-left text-gray-300">Unidade</th>
                        <th className="px-4 py-2 text-left text-gray-300">Valor Médio</th>
                        <th className="px-4 py-2 text-left text-gray-300">Valor Total</th>
                        <th className="px-4 py-2 text-left text-gray-300">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                      {reports.currentStock.map((item, index) => (
                        <tr key={index} className="hover:bg-gray-700">
                          <td className="px-4 py-2 text-white">{item.name}</td>
                          <td className="px-4 py-2 text-gray-300">{item.quantity.toFixed(2)}</td>
                          <td className="px-4 py-2 text-gray-300">{item.unit}</td>
                          <td className="px-4 py-2 text-gray-300">R$ {item.averagePrice.toFixed(2)}</td>
                          <td className="px-4 py-2 text-gray-300">R$ {item.totalValue.toFixed(2)}</td>
                          <td className="px-4 py-2">
                            <span className={`px-2 py-1 rounded text-xs ${
                              item.quantity <= item.minimumStock
                                ? 'bg-red-100 text-red-800'
                                : item.quantity <= item.minimumStock * 1.5
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-green-100 text-green-800'
                            }`}>
                              {item.quantity <= item.minimumStock
                                ? 'Baixo'
                                : item.quantity <= item.minimumStock * 1.5
                                ? 'Atenção'
                                : 'OK'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {reports.currentStock.length === 0 && (
                  <div className="text-center py-8 text-gray-400">
                    Nenhum item no estoque
                  </div>
                )}
              </div>
            )}

            {/* Estoque Baixo */}
            {activeTab === 'low' && (
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Itens com Estoque Baixo</h3>
                <div className="space-y-4">
                  {reports.lowStock.map((item, index) => (
                    <div key={index} className="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-medium text-white">{item.name}</h4>
                          <p className="text-gray-400 text-sm">
                            Estoque atual: {item.quantity.toFixed(2)} {item.unit}
                          </p>
                          <p className="text-gray-400 text-sm">
                            Estoque mínimo: {item.minimumStock.toFixed(2)} {item.unit}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="text-red-400 font-semibold">
                            ⚠️ CRÍTICO
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {reports.lowStock.length === 0 && (
                  <div className="text-center py-8 text-green-400">
                    ✅ Todos os itens estão com estoque adequado
                  </div>
                )}
              </div>
            )}

            {/* Itens Vencendo */}
            {activeTab === 'expiring' && (
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Itens Próximos ao Vencimento</h3>
                <div className="space-y-4">
                  {reports.expiringItems.map((item, index) => (
                    <div key={index} className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-medium text-white">{item.ingredientName}</h4>
                          <p className="text-gray-400 text-sm">
                            Lote: {item.batch || 'Não informado'}
                          </p>
                          <p className="text-gray-400 text-sm">
                            Quantidade: {item.quantity.toFixed(2)} {item.unit}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-yellow-400 font-semibold">
                            📅 {new Date(item.expirationDate).toLocaleDateString('pt-BR')}
                          </div>
                          <div className="text-sm text-gray-400">
                            {Math.ceil((new Date(item.expirationDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} dias
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {reports.expiringItems.length === 0 && (
                  <div className="text-center py-8 text-green-400">
                    ✅ Nenhum item próximo ao vencimento
                  </div>
                )}
              </div>
            )}

            {/* Rastreamento de Lotes */}
            {activeTab === 'batches' && (
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Rastreamento de Lotes</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-700">
                      <tr>
                        <th className="px-4 py-2 text-left text-gray-300">Ingrediente</th>
                        <th className="px-4 py-2 text-left text-gray-300">Lote</th>
                        <th className="px-4 py-2 text-left text-gray-300">Quantidade</th>
                        <th className="px-4 py-2 text-left text-gray-300">Validade</th>
                        <th className="px-4 py-2 text-left text-gray-300">Entrada</th>
                        <th className="px-4 py-2 text-left text-gray-300">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                      {reports.batchTracking.map((batch, index) => {
                        const daysToExpire = batch.expirationDate 
                          ? Math.ceil((new Date(batch.expirationDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
                          : null;

                        return (
                          <tr key={index} className="hover:bg-gray-700">
                            <td className="px-4 py-2 text-white">{batch.ingredientName}</td>
                            <td className="px-4 py-2 text-gray-300">{batch.batch || 'S/N'}</td>
                            <td className="px-4 py-2 text-gray-300">
                              {batch.quantity.toFixed(2)} {batch.unit}
                            </td>
                            <td className="px-4 py-2 text-gray-300">
                              {batch.expirationDate 
                                ? new Date(batch.expirationDate).toLocaleDateString('pt-BR')
                                : 'Não informado'
                              }
                            </td>
                            <td className="px-4 py-2 text-gray-300">
                              {new Date(batch.receivedDate).toLocaleDateString('pt-BR')}
                            </td>
                            <td className="px-4 py-2">
                              <span className={`px-2 py-1 rounded text-xs ${
                                !daysToExpire || daysToExpire > 30
                                  ? 'bg-green-100 text-green-800'
                                  : daysToExpire > 7
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {!daysToExpire 
                                  ? 'OK'
                                  : daysToExpire > 30
                                  ? 'OK'
                                  : daysToExpire > 7
                                  ? `${daysToExpire} dias`
                                  : 'Vencendo'
                                }
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                {reports.batchTracking.length === 0 && (
                  <div className="text-center py-8 text-gray-400">
                    Nenhum lote cadastrado
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>

      {/* Botão de Atualizar */}
      <div className="text-center">
        <button
          onClick={loadReports}
          disabled={isLoading}
          className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg transition-colors disabled:opacity-50"
        >
          {isLoading ? 'Atualizando...' : '🔄 Atualizar Relatórios'}
        </button>
      </div>
    </div>
  );
}