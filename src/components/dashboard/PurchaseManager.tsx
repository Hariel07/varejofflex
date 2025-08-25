'use client';

import React, { useState, useEffect } from 'react';

interface Ingredient {
  _id: string;
  name: string;
  unit: string;
  price: number;
  quantity: number;
  supplier?: string;
}

interface PurchaseItem {
  ingredientId: string;
  ingredientName: string;
  quantity: number;
  unit: string;
  unitCost: number;
  totalCost: number;
  batch?: string;
  expirationDate?: string;
}

interface Purchase {
  _id: string;
  purchaseNumber: string;
  supplier?: string;
  purchaseDate: string;
  items: PurchaseItem[];
  totalAmount: number;
  status: 'pending' | 'received' | 'cancelled';
  notes?: string;
  invoice?: string;
}

export default function PurchaseManager() {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingPurchase, setEditingPurchase] = useState<Purchase | null>(null);
  const [filter, setFilter] = useState('all');

  // Formulário
  const [formData, setFormData] = useState({
    purchaseNumber: '',
    supplier: '',
    purchaseDate: new Date().toISOString().split('T')[0],
    notes: '',
    invoice: '',
    autoReceive: false
  });

  const [purchaseItems, setPurchaseItems] = useState<PurchaseItem[]>([]);

  useEffect(() => {
    loadPurchases();
    loadIngredients();
  }, []);

  const loadPurchases = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/purchases');
      const data = await response.json();
      
      if (data.success) {
        setPurchases(data.purchases);
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error('Erro ao carregar compras:', error);
      showToast('Erro', 'Erro ao carregar compras', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const loadIngredients = async () => {
    try {
      const response = await fetch('/api/ingredients');
      const data = await response.json();
      
      if (data.success) {
        setIngredients(data.ingredients);
      }
    } catch (error) {
      console.error('Erro ao carregar ingredientes:', error);
    }
  };

  const addPurchaseItem = () => {
    setPurchaseItems([...purchaseItems, {
      ingredientId: '',
      ingredientName: '',
      quantity: 0,
      unit: 'kg',
      unitCost: 0,
      totalCost: 0,
      batch: '',
      expirationDate: ''
    }]);
  };

  const updatePurchaseItem = (index: number, field: keyof PurchaseItem, value: any) => {
    const newItems = [...purchaseItems];
    newItems[index] = { ...newItems[index], [field]: value };
    
    // Auto-calcular total se quantidade ou custo mudou
    if (field === 'quantity' || field === 'unitCost') {
      newItems[index].totalCost = newItems[index].quantity * newItems[index].unitCost;
    }
    
    // Atualizar nome do ingrediente se ingrediente mudou
    if (field === 'ingredientId') {
      const ingredient = ingredients.find(ing => ing._id === value);
      if (ingredient) {
        newItems[index].ingredientName = ingredient.name;
        newItems[index].unit = ingredient.unit;
        newItems[index].unitCost = ingredient.price; // Usar preço atual como base
      }
    }
    
    setPurchaseItems(newItems);
  };

  const removePurchaseItem = (index: number) => {
    setPurchaseItems(purchaseItems.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (purchaseItems.length === 0) {
      showToast('Erro', 'Adicione pelo menos um item à compra', 'error');
      return;
    }

    // Validar itens
    for (const item of purchaseItems) {
      if (!item.ingredientId || item.quantity <= 0 || item.unitCost <= 0) {
        showToast('Erro', 'Todos os itens devem ter ingrediente, quantidade e custo válidos', 'error');
        return;
      }
    }

    try {
      setIsLoading(true);
      
      const purchaseData = {
        ...formData,
        items: purchaseItems
      };

      const response = await fetch('/api/purchases', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(purchaseData)
      });

      const data = await response.json();
      
      if (data.success) {
        showToast('Sucesso', data.message, 'success');
        resetForm();
        loadPurchases();
      } else {
        throw new Error(data.error);
      }
    } catch (error: any) {
      showToast('Erro', error.message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const receivePurchase = async (purchaseId: string) => {
    if (!confirm('Confirma o recebimento desta compra? O estoque será atualizado automaticamente.')) {
      return;
    }

    try {
      setIsLoading(true);
      
      const response = await fetch(`/api/purchases/${purchaseId}/receive`, {
        method: 'PUT'
      });

      const data = await response.json();
      
      if (data.success) {
        showToast('Sucesso', data.message, 'success');
        loadPurchases();
      } else {
        throw new Error(data.error);
      }
    } catch (error: any) {
      showToast('Erro', error.message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const cancelPurchase = async (purchaseId: string) => {
    if (!confirm('Confirma o cancelamento desta compra?')) {
      return;
    }

    try {
      setIsLoading(true);
      
      const response = await fetch(`/api/purchases/${purchaseId}/receive`, {
        method: 'DELETE'
      });

      const data = await response.json();
      
      if (data.success) {
        showToast('Sucesso', data.message, 'success');
        loadPurchases();
      } else {
        throw new Error(data.error);
      }
    } catch (error: any) {
      showToast('Erro', error.message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      purchaseNumber: '',
      supplier: '',
      purchaseDate: new Date().toISOString().split('T')[0],
      notes: '',
      invoice: '',
      autoReceive: false
    });
    setPurchaseItems([]);
    setShowForm(false);
    setEditingPurchase(null);
  };

  const showToast = (title: string, message: string, type: 'success' | 'error' | 'warning') => {
    // Implementação de toast (pode usar a mesma do CostManagementDashboard)
    console.log(`${type.toUpperCase()}: ${title} - ${message}`);
  };

  const filteredPurchases = purchases.filter(purchase => {
    if (filter === 'all') return true;
    return purchase.status === filter;
  });

  const totalAmount = purchaseItems.reduce((sum, item) => sum + item.totalCost, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center">
            🛒 Gestão de Compras
          </h2>
          <p className="text-gray-400 mt-1">
            Controle de compras e entrada de estoque
          </p>
        </div>
        
        <button
          onClick={() => setShowForm(true)}
          className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
        >
          ➕ Nova Compra
        </button>
      </div>

      {/* Filtros */}
      <div className="bg-gray-800 rounded-lg p-4">
        <div className="flex space-x-4">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded transition-colors ${
              filter === 'all' ? 'bg-orange-500 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Todas
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-4 py-2 rounded transition-colors ${
              filter === 'pending' ? 'bg-orange-500 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Pendentes
          </button>
          <button
            onClick={() => setFilter('received')}
            className={`px-4 py-2 rounded transition-colors ${
              filter === 'received' ? 'bg-orange-500 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Recebidas
          </button>
          <button
            onClick={() => setFilter('cancelled')}
            className={`px-4 py-2 rounded transition-colors ${
              filter === 'cancelled' ? 'bg-orange-500 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Canceladas
          </button>
        </div>
      </div>

      {/* Formulário de Nova Compra */}
      {showForm && (
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-white">Nova Compra</h3>
            <button
              onClick={resetForm}
              className="text-gray-400 hover:text-white"
            >
              ❌
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Dados da Compra */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Número da Compra *
                </label>
                <input
                  type="text"
                  value={formData.purchaseNumber}
                  onChange={(e) => setFormData({ ...formData, purchaseNumber: e.target.value })}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                  placeholder="Ex: COMP-001"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Fornecedor
                </label>
                <input
                  type="text"
                  value={formData.supplier}
                  onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                  placeholder="Nome do fornecedor"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Data da Compra
                </label>
                <input
                  type="date"
                  value={formData.purchaseDate}
                  onChange={(e) => setFormData({ ...formData, purchaseDate: e.target.value })}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                />
              </div>
            </div>

            {/* Itens da Compra */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-lg font-medium text-white">Itens da Compra</h4>
                <button
                  type="button"
                  onClick={addPurchaseItem}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm flex items-center"
                >
                  ➕ Adicionar Item
                </button>
              </div>

              <div className="space-y-3">
                {purchaseItems.map((item, index) => (
                  <div key={index} className="bg-gray-700 rounded-lg p-4">
                    <div className="grid grid-cols-1 md:grid-cols-7 gap-3 items-end">
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                          Ingrediente *
                        </label>
                        <select
                          value={item.ingredientId}
                          onChange={(e) => updatePurchaseItem(index, 'ingredientId', e.target.value)}
                          className="w-full bg-gray-600 border border-gray-500 rounded px-3 py-2 text-white"
                          required
                        >
                          <option value="">Selecione...</option>
                          {ingredients.map((ingredient) => (
                            <option key={ingredient._id} value={ingredient._id}>
                              {ingredient.name} ({ingredient.unit})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                          Quantidade *
                        </label>
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => updatePurchaseItem(index, 'quantity', parseFloat(e.target.value) || 0)}
                          className="w-full bg-gray-600 border border-gray-500 rounded px-3 py-2 text-white"
                          step="0.01"
                          min="0"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                          Custo Unit. *
                        </label>
                        <input
                          type="number"
                          value={item.unitCost}
                          onChange={(e) => updatePurchaseItem(index, 'unitCost', parseFloat(e.target.value) || 0)}
                          className="w-full bg-gray-600 border border-gray-500 rounded px-3 py-2 text-white"
                          step="0.01"
                          min="0"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                          Total
                        </label>
                        <input
                          type="text"
                          value={`R$ ${item.totalCost.toFixed(2)}`}
                          className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-gray-300"
                          readOnly
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                          Lote
                        </label>
                        <input
                          type="text"
                          value={item.batch}
                          onChange={(e) => updatePurchaseItem(index, 'batch', e.target.value)}
                          className="w-full bg-gray-600 border border-gray-500 rounded px-3 py-2 text-white"
                          placeholder="Opcional"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                          Validade
                        </label>
                        <input
                          type="date"
                          value={item.expirationDate}
                          onChange={(e) => updatePurchaseItem(index, 'expirationDate', e.target.value)}
                          className="w-full bg-gray-600 border border-gray-500 rounded px-3 py-2 text-white"
                        />
                      </div>

                      <div>
                        <button
                          type="button"
                          onClick={() => removePurchaseItem(index)}
                          className="w-full bg-red-600 hover:bg-red-700 text-white p-2 rounded"
                        >
                          ❌
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {purchaseItems.length > 0 && (
                <div className="bg-gray-700 rounded-lg p-4 mt-4">
                  <div className="text-right">
                    <span className="text-lg font-semibold text-white">
                      Total da Compra: R$ {totalAmount.toFixed(2)}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Campos Adicionais */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Nota Fiscal
                </label>
                <input
                  type="text"
                  value={formData.invoice}
                  onChange={(e) => setFormData({ ...formData, invoice: e.target.value })}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                  placeholder="Número da nota fiscal"
                />
              </div>

              <div className="flex items-center">
                <label className="flex items-center text-gray-300">
                  <input
                    type="checkbox"
                    checked={formData.autoReceive}
                    onChange={(e) => setFormData({ ...formData, autoReceive: e.target.checked })}
                    className="mr-2"
                  />
                  Dar entrada automática no estoque
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Observações
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                rows={3}
                placeholder="Observações sobre a compra"
              />
            </div>

            {/* Botões */}
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isLoading || purchaseItems.length === 0}
                className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors disabled:opacity-50"
              >
                {isLoading ? 'Salvando...' : 'Salvar Compra'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Lista de Compras */}
      <div className="bg-gray-800 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Compra
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Fornecedor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Data
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Valor Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {filteredPurchases.map((purchase) => (
                <tr key={purchase._id} className="hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-white">
                        {purchase.purchaseNumber}
                      </div>
                      {purchase.invoice && (
                        <div className="text-sm text-gray-400">
                          NF: {purchase.invoice}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {purchase.supplier || 'Não informado'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {new Date(purchase.purchaseDate).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                    R$ {purchase.totalAmount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      purchase.status === 'received' 
                        ? 'bg-green-100 text-green-800'
                        : purchase.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {purchase.status === 'received' ? 'Recebida' : 
                       purchase.status === 'pending' ? 'Pendente' : 'Cancelada'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button
                      className="text-blue-400 hover:text-blue-300"
                      title="Ver detalhes"
                    >
                      👁️
                    </button>
                    
                    {purchase.status === 'pending' && (
                      <>
                        <button
                          onClick={() => receivePurchase(purchase._id)}
                          className="text-green-400 hover:text-green-300"
                          title="Receber compra"
                        >
                          ✅
                        </button>
                        <button
                          onClick={() => cancelPurchase(purchase._id)}
                          className="text-red-400 hover:text-red-300"
                          title="Cancelar compra"
                        >
                          ❌
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredPurchases.length === 0 && (
          <div className="text-center py-8 text-gray-400">
            Nenhuma compra encontrada
          </div>
        )}
      </div>
    </div>
  );
}