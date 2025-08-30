'use client';

import { useState, useEffect } from 'react';

interface Movimentacao {
  _id: string;
  type: 'entrada' | 'saida' | 'transferencia' | 'ajuste';
  description: string;
  value: number;
  date: string;
  category: string;
  reference?: string;
  isProcessed: boolean;
}

export default function MovimentacoesPage() {
  const [movimentacoes, setMovimentacoes] = useState<Movimentacao[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    fetchMovimentacoes();
  }, [selectedType, selectedCategory]);

  const fetchMovimentacoes = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (selectedType !== 'all') params.set('type', selectedType);
      if (selectedCategory !== 'all') params.set('category', selectedCategory);
      if (searchTerm) params.set('search', searchTerm);

      const response = await fetch(`/api/movimentacoes?${params}`);
      const data = await response.json();
      
      if (data.success && Array.isArray(data.movimentacoes)) {
        setMovimentacoes(data.movimentacoes);
      } else {
        setMovimentacoes([]);
      }
    } catch (error) {
      console.error('Erro ao buscar movimentações:', error);
      setMovimentacoes([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredMovimentacoes = movimentacoes.filter(mov =>
    mov.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    mov.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    mov.reference?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const types = ['all', 'entrada', 'saida', 'transferencia', 'ajuste'];
  const categories = ['all', ...Array.from(new Set(movimentacoes.map(mov => mov.category)))];

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'entrada': return 'bg-green-100 text-green-700';
      case 'saida': return 'bg-red-100 text-red-700';
      case 'transferencia': return 'bg-blue-100 text-blue-700';
      case 'ajuste': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'entrada': return '⬆️';
      case 'saida': return '⬇️';
      case 'transferencia': return '↔️';
      case 'ajuste': return '⚖️';
      default: return '📝';
    }
  };

  const totalEntradas = movimentacoes
    .filter(mov => mov.type === 'entrada')
    .reduce((acc, mov) => acc + mov.value, 0);

  const totalSaidas = movimentacoes
    .filter(mov => mov.type === 'saida')
    .reduce((acc, mov) => acc + mov.value, 0);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Movimentações</h1>
          <p className="text-gray-600 mt-1">Gerencie todas as movimentações do sistema</p>
        </div>
        <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
          + Nova Movimentação
        </button>
      </div>

      {/* Filtros */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Buscar movimentações..."
            value={searchTerm}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">🔍</span>
        </div>
        <div className="flex gap-2 flex-wrap">
          {types.map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedType === type
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {type === 'all' ? 'Todos' : type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>
        <div className="flex gap-2 flex-wrap">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedCategory === category
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category === 'all' ? 'Todas Categorias' : category}
            </button>
          ))}
        </div>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Movimentações</p>
              <p className="text-2xl font-bold">{movimentacoes.length}</p>
            </div>
            <span className="text-3xl">📊</span>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Entradas</p>
              <p className="text-2xl font-bold text-green-600">
                R$ {totalEntradas.toFixed(2)}
              </p>
            </div>
            <span className="text-3xl">⬆️</span>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Saídas</p>
              <p className="text-2xl font-bold text-red-600">
                R$ {totalSaidas.toFixed(2)}
              </p>
            </div>
            <span className="text-3xl">⬇️</span>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Saldo</p>
              <p className={`text-2xl font-bold ${
                totalEntradas - totalSaidas >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                R$ {(totalEntradas - totalSaidas).toFixed(2)}
              </p>
            </div>
            <span className="text-3xl">💰</span>
          </div>
        </div>
      </div>

      {/* Lista de Movimentações */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-2 text-gray-600">Carregando movimentações...</p>
        </div>
      ) : filteredMovimentacoes.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <span className="text-6xl">📊</span>
          <h3 className="text-lg font-medium text-gray-900 mb-2 mt-4">
            Nenhuma movimentação encontrada
          </h3>
          <p className="text-gray-600 mb-4">
            Comece registrando sua primeira movimentação
          </p>
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors">
            + Adicionar Movimentação
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tipo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Descrição
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Categoria
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Valor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Data
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredMovimentacoes.map((mov) => (
                  <tr key={mov._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{getTypeIcon(mov.type)}</span>
                        <span className={`px-2 py-1 text-xs rounded-full ${getTypeColor(mov.type)}`}>
                          {mov.type.charAt(0).toUpperCase() + mov.type.slice(1)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {mov.description}
                        </div>
                        {mov.reference && (
                          <div className="text-sm text-gray-500">
                            Ref: {mov.reference}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                        {mov.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`text-sm font-bold ${
                        mov.type === 'entrada' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {mov.type === 'entrada' ? '+' : '-'} R$ {mov.value.toFixed(2)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(mov.date).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        mov.isProcessed 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {mov.isProcessed ? 'Processado' : 'Pendente'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}