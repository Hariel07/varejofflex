'use client';

import { useState, useEffect } from 'react';

interface Secao {
  _id: string;
  name: string;
  description?: string;
  isActive: boolean;
  order: number;
  color?: string;
  icon?: string;
}

export default function SecoesPage() {
  const [secoes, setSecoes] = useState<Secao[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchSecoes();
  }, []);

  const fetchSecoes = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (searchTerm) params.set('search', searchTerm);

      const response = await fetch(`/api/secoes?${params}`);
      const data = await response.json();
      
      if (data.success && Array.isArray(data.secoes)) {
        // Ordenar por order
        const sortedSecoes = data.secoes.sort((a: Secao, b: Secao) => a.order - b.order);
        setSecoes(sortedSecoes);
      } else {
        setSecoes([]);
      }
    } catch (error) {
      console.error('Erro ao buscar seções:', error);
      setSecoes([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredSecoes = secoes.filter(secao =>
    secao.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    secao.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Seções</h1>
          <p className="text-gray-600 mt-1">Organize e gerencie as seções do seu sistema</p>
        </div>
        <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
          + Nova Seção
        </button>
      </div>

      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Buscar seções..."
            value={searchTerm}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">🔍</span>
        </div>
        <button 
          onClick={fetchSecoes}
          className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors"
        >
          🔄 Atualizar
        </button>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total de Seções</p>
              <p className="text-2xl font-bold">{secoes.length}</p>
            </div>
            <span className="text-3xl">📂</span>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Seções Ativas</p>
              <p className="text-2xl font-bold text-green-600">
                {secoes.filter(secao => secao.isActive).length}
              </p>
            </div>
            <span className="text-3xl">✅</span>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Seções Inativas</p>
              <p className="text-2xl font-bold text-red-600">
                {secoes.filter(secao => !secao.isActive).length}
              </p>
            </div>
            <span className="text-3xl">❌</span>
          </div>
        </div>
      </div>

      {/* Lista de Seções */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-2 text-gray-600">Carregando seções...</p>
        </div>
      ) : filteredSecoes.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <span className="text-6xl">📂</span>
          <h3 className="text-lg font-medium text-gray-900 mb-2 mt-4">
            Nenhuma seção encontrada
          </h3>
          <p className="text-gray-600 mb-4">
            Comece criando sua primeira seção para organizar o sistema
          </p>
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors">
            + Criar Primeira Seção
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSecoes.map((secao) => (
            <div 
              key={secao._id} 
              className="bg-white rounded-lg border border-gray-200 hover:shadow-lg transition-shadow relative"
              style={{ 
                borderLeftColor: secao.color || '#3B82F6', 
                borderLeftWidth: '4px' 
              }}
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-10 h-10 rounded-lg flex items-center justify-center text-white text-lg font-bold"
                      style={{ backgroundColor: secao.color || '#3B82F6' }}
                    >
                      {secao.icon || secao.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{secao.name}</h3>
                      <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                        secao.isActive 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {secao.isActive ? 'Ativa' : 'Inativa'}
                      </span>
                    </div>
                  </div>
                  <div className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs font-medium">
                    #{secao.order}
                  </div>
                </div>

                {secao.description && (
                  <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                    {secao.description}
                  </p>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    <button className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors">
                      ✏️ Editar
                    </button>
                    <button className="text-red-600 hover:text-red-800 text-sm font-medium transition-colors">
                      🗑️ Excluir
                    </button>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    📍 Ordem {secao.order}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Botão Flutuante para Reordenar */}
      {secoes.length > 1 && (
        <div className="fixed bottom-6 right-6">
          <button className="bg-purple-500 hover:bg-purple-600 text-white p-3 rounded-full shadow-lg transition-colors">
            <span className="text-lg">🔄</span>
          </button>
        </div>
      )}
    </div>
  );
}