'use client';

import { useState, useEffect } from 'react';

interface Fornecedor {
  _id: string;
  name: string;
  type: 'completo' | 'simples';
  email?: string;
  phone?: string;
  cnpjCpf?: string;
  category?: string;
  isActive: boolean;
  address?: {
    city: string;
    state: string;
  };
}

export default function FornecedoresPage() {
  const [fornecedores, setFornecedores] = useState<Fornecedor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');

  useEffect(() => {
    fetchFornecedores();
  }, [selectedType]);

  const fetchFornecedores = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (selectedType !== 'all') params.set('type', selectedType);
      if (searchTerm) params.set('search', searchTerm);

      const response = await fetch(`/api/fornecedores?${params}`);
      const data = await response.json();
      
      if (data.success && Array.isArray(data.fornecedores)) {
        setFornecedores(data.fornecedores);
      } else {
        setFornecedores([]);
      }
    } catch (error) {
      console.error('Erro ao buscar fornecedores:', error);
      setFornecedores([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredFornecedores = fornecedores.filter(fornecedor =>
    fornecedor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    fornecedor.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Fornecedores</h1>
          <p className="text-gray-600 mt-1">Gerencie seus fornecedores e parceiros</p>
        </div>
        <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
          + Novo Fornecedor
        </button>
      </div>

      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Buscar fornecedores..."
            value={searchTerm}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">🔍</span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setSelectedType('all')}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedType === 'all'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Todos
          </button>
          <button
            onClick={() => setSelectedType('completo')}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedType === 'completo'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Completos
          </button>
          <button
            onClick={() => setSelectedType('simples')}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedType === 'simples'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Simples
          </button>
        </div>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total</p>
              <p className="text-2xl font-bold">{fornecedores.length}</p>
            </div>
            <span className="text-3xl">🏢</span>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Completos</p>
              <p className="text-2xl font-bold">
                {fornecedores.filter(f => f.type === 'completo').length}
              </p>
            </div>
            <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">NF</span>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Simples</p>
              <p className="text-2xl font-bold">
                {fornecedores.filter(f => f.type === 'simples').length}
              </p>
            </div>
            <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">Nota Branca</span>
          </div>
        </div>
      </div>

      {/* Lista de Fornecedores */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-2 text-gray-600">Carregando fornecedores...</p>
        </div>
      ) : filteredFornecedores.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <span className="text-6xl">🏢</span>
          <h3 className="text-lg font-medium text-gray-900 mb-2 mt-4">
            Nenhum fornecedor encontrado
          </h3>
          <p className="text-gray-600 mb-4">
            Comece adicionando seu primeiro fornecedor
          </p>
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors">
            + Adicionar Fornecedor
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredFornecedores.map((fornecedor) => (
            <div key={fornecedor._id} className="bg-white rounded-lg border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="p-4 border-b border-gray-100">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">{fornecedor.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        fornecedor.type === 'completo'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {fornecedor.type === 'completo' ? 'Com NF' : 'Nota Branca'}
                      </span>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        fornecedor.isActive
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {fornecedor.isActive ? 'Ativo' : 'Inativo'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-4">
                <div className="space-y-2 text-sm">
                  {fornecedor.category && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <span>🏢</span>
                      <span>{fornecedor.category}</span>
                    </div>
                  )}
                  {fornecedor.phone && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <span>📞</span>
                      <span>{fornecedor.phone}</span>
                    </div>
                  )}
                  {fornecedor.email && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <span>📧</span>
                      <span className="truncate">{fornecedor.email}</span>
                    </div>
                  )}
                  {fornecedor.address && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <span>📍</span>
                      <span>{fornecedor.address.city}, {fornecedor.address.state}</span>
                    </div>
                  )}
                  {fornecedor.cnpjCpf && (
                    <div className="text-xs text-gray-500 mt-2">
                      CNPJ/CPF: {fornecedor.cnpjCpf}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}