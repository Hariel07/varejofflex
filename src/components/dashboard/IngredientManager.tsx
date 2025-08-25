'use client';

import React, { useState, useEffect } from 'react';

interface Ingredient {
  _id?: string;
  name: string;
  category: string;
  unit: string;
  currentStock: number;
  minStock: number;
  maxStock: number;
  avgCost: number;
  supplier: string;
  shelfLife: number; // dias
  storageCondition: string;
  notes: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

const modernStyles = {
  container: {
    padding: '20px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '32px',
    flexWrap: 'wrap' as const,
    gap: '16px',
  },
  title: {
    fontSize: '1.875rem',
    fontWeight: '700',
    color: '#ffffff',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  form: {
    background: 'rgba(30, 41, 59, 0.8)',
    borderRadius: '16px',
    padding: '24px',
    border: '1px solid rgba(51, 65, 85, 0.5)',
    marginBottom: '24px',
  },
  formTitle: {
    fontSize: '1.25rem',
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: '20px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  formRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '16px',
    marginBottom: '16px',
  },
  formGroup: {
    marginBottom: '16px',
  },
  label: {
    display: 'block',
    fontSize: '0.875rem',
    fontWeight: '600',
    color: '#e2e8f0',
    marginBottom: '6px',
  },
  input: {
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
  textarea: {
    width: '100%',
    padding: '12px 16px',
    background: 'rgba(51, 65, 85, 0.8)',
    border: '1px solid rgba(71, 85, 105, 0.5)',
    borderRadius: '8px',
    color: '#ffffff',
    fontSize: '0.875rem',
    minHeight: '100px',
    resize: 'vertical' as const,
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
  },
  buttonPrimary: {
    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    color: '#ffffff',
  },
  buttonSecondary: {
    background: 'rgba(71, 85, 105, 0.8)',
    color: '#e2e8f0',
  },
  buttonDanger: {
    background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
    color: '#ffffff',
  },
  buttonEdit: {
    background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
    color: '#ffffff',
  },
  ingredientsList: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
    gap: '16px',
  },
  ingredientCard: {
    background: 'rgba(30, 41, 59, 0.8)',
    borderRadius: '12px',
    padding: '20px',
    border: '1px solid rgba(51, 65, 85, 0.5)',
    transition: 'all 0.2s ease',
  },
  ingredientHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '16px',
  },
  ingredientName: {
    fontSize: '1.125rem',
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: '4px',
  },
  ingredientCategory: {
    fontSize: '0.75rem',
    color: '#94a3b8',
    textTransform: 'uppercase' as const,
    fontWeight: '600',
  },
  stockInfo: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '12px',
    marginBottom: '16px',
  },
  stockItem: {
    textAlign: 'center' as const,
    padding: '12px',
    background: 'rgba(51, 65, 85, 0.5)',
    borderRadius: '8px',
  },
  stockValue: {
    fontSize: '1.25rem',
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: '4px',
  },
  stockLabel: {
    fontSize: '0.75rem',
    color: '#94a3b8',
  },
  statusBadge: {
    padding: '4px 8px',
    borderRadius: '12px',
    fontSize: '0.75rem',
    fontWeight: '600',
    textTransform: 'uppercase' as const,
  },
  statusActive: {
    background: 'rgba(34, 197, 94, 0.2)',
    color: '#4ade80',
    border: '1px solid rgba(34, 197, 94, 0.3)',
  },
  statusInactive: {
    background: 'rgba(107, 114, 128, 0.2)',
    color: '#9ca3af',
    border: '1px solid rgba(107, 114, 128, 0.3)',
  },
  stockLow: {
    color: '#f59e0b',
  },
  stockCritical: {
    color: '#ef4444',
  },
  error: {
    background: 'rgba(239, 68, 68, 0.1)',
    border: '1px solid rgba(239, 68, 68, 0.3)',
    borderRadius: '8px',
    padding: '12px 16px',
    color: '#f87171',
    marginBottom: '16px',
  },
  success: {
    background: 'rgba(34, 197, 94, 0.1)',
    border: '1px solid rgba(34, 197, 94, 0.3)',
    borderRadius: '8px',
    padding: '12px 16px',
    color: '#4ade80',
    marginBottom: '16px',
  },
  filterBar: {
    display: 'flex',
    gap: '12px',
    marginBottom: '24px',
    flexWrap: 'wrap' as const,
  },
  filterButton: {
    padding: '8px 16px',
    borderRadius: '20px',
    border: 'none',
    fontSize: '0.875rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    fontFamily: 'inherit',
  },
  filterActive: {
    background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
    color: '#ffffff',
  },
  filterInactive: {
    background: 'rgba(71, 85, 105, 0.6)',
    color: '#94a3b8',
  },
};

export default function IngredientManager() {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [filter, setFilter] = useState('all');

  const [formData, setFormData] = useState<Ingredient>({
    name: '',
    category: '',
    unit: 'kg',
    currentStock: 0,
    minStock: 0,
    maxStock: 0,
    avgCost: 0,
    supplier: '',
    shelfLife: 30,
    storageCondition: 'ambiente',
    notes: '',
    isActive: true,
  });

  const categories = [
    'Carnes', 'Frango', 'Peixes', 'Vegetais', 'Frutas', 'Laticínios',
    'Grãos', 'Temperos', 'Molhos', 'Bebidas', 'Pães', 'Massas',
    'Óleos', 'Açúcares', 'Conservas', 'Congelados', 'Outros'
  ];

  const units = ['kg', 'g', 'L', 'mL', 'un', 'pct', 'cx', 'dz'];

  const storageConditions = [
    'ambiente', 'refrigerado', 'congelado', 'seco', 'fresco'
  ];

  useEffect(() => {
    loadIngredients();
  }, []);

  const loadIngredients = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/ingredients');
      if (response.ok) {
        const data = await response.json();
        setIngredients(data);
      }
    } catch (error) {
      console.error('Erro ao carregar ingredientes:', error);
      setError('Erro ao carregar ingredientes');
    } finally {
      setLoading(false);
    }
  };

  const saveIngredient = async () => {
    try {
      if (!formData.name || !formData.category) {
        setError('Preencha todos os campos obrigatórios');
        return;
      }

      setLoading(true);
      const url = isEditing ? `/api/ingredients/${editingId}` : '/api/ingredients';
      const method = isEditing ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setSuccess(isEditing ? 'Ingrediente atualizado!' : 'Ingrediente criado!');
        resetForm();
        loadIngredients();
      } else {
        setError('Erro ao salvar ingrediente');
      }
    } catch (error) {
      console.error('Erro:', error);
      setError('Erro ao salvar ingrediente');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      category: '',
      unit: 'kg',
      currentStock: 0,
      minStock: 0,
      maxStock: 0,
      avgCost: 0,
      supplier: '',
      shelfLife: 30,
      storageCondition: 'ambiente',
      notes: '',
      isActive: true,
    });
    setShowForm(false);
    setIsEditing(false);
    setEditingId(null);
  };

  const editIngredient = (ingredient: Ingredient) => {
    setFormData(ingredient);
    setIsEditing(true);
    setEditingId(ingredient._id || null);
    setShowForm(true);
  };

  const deleteIngredient = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este ingrediente?')) return;

    try {
      const response = await fetch(`/api/ingredients/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setSuccess('Ingrediente excluído com sucesso');
        loadIngredients();
      } else {
        setError('Erro ao excluir ingrediente');
      }
    } catch (error) {
      console.error('Erro:', error);
      setError('Erro ao excluir ingrediente');
    }
  };

  const getStockStatus = (ingredient: Ingredient) => {
    if (ingredient.currentStock <= ingredient.minStock * 0.5) {
      return { status: 'critical', color: modernStyles.stockCritical.color };
    } else if (ingredient.currentStock <= ingredient.minStock) {
      return { status: 'low', color: modernStyles.stockLow.color };
    }
    return { status: 'ok', color: '#4ade80' };
  };

  const filteredIngredients = ingredients.filter(ingredient => {
    switch (filter) {
      case 'active': return ingredient.isActive;
      case 'inactive': return !ingredient.isActive;
      case 'low-stock': return ingredient.currentStock <= ingredient.minStock;
      case 'critical': return ingredient.currentStock <= ingredient.minStock * 0.5;
      default: return true;
    }
  });

  return (
    <div style={modernStyles.container}>
      {/* Header */}
      <div style={modernStyles.header}>
        <h1 style={modernStyles.title}>
          🥬 Gestão de Ingredientes
        </h1>
        <button
          style={{...modernStyles.button, ...modernStyles.buttonPrimary}}
          onClick={() => setShowForm(!showForm)}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
          {showForm ? '❌ Cancelar' : '➕ Novo Ingrediente'}
        </button>
      </div>

      {/* Mensagens */}
      {error && (
        <div style={modernStyles.error}>
          ❌ {error}
        </div>
      )}
      
      {success && (
        <div style={modernStyles.success}>
          ✅ {success}
        </div>
      )}

      {/* Formulário */}
      {showForm && (
        <div style={modernStyles.form}>
          <h2 style={modernStyles.formTitle}>
            {isEditing ? '✏️ Editar Ingrediente' : '➕ Novo Ingrediente'}
          </h2>

          <div style={modernStyles.formRow}>
            <div style={modernStyles.formGroup}>
              <label style={modernStyles.label}>Nome do Ingrediente *</label>
              <input
                type="text"
                style={modernStyles.input}
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Ex: Carne de hambúrguer"
                onFocus={(e) => e.target.style.borderColor = '#10b981'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(71, 85, 105, 0.5)'}
              />
            </div>

            <div style={modernStyles.formGroup}>
              <label style={modernStyles.label}>Categoria *</label>
              <select
                style={modernStyles.select}
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                onFocus={(e) => e.target.style.borderColor = '#10b981'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(71, 85, 105, 0.5)'}
              >
                <option value="">Selecione uma categoria</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div style={modernStyles.formGroup}>
              <label style={modernStyles.label}>Unidade de Medida</label>
              <select
                style={modernStyles.select}
                value={formData.unit}
                onChange={(e) => setFormData(prev => ({ ...prev, unit: e.target.value }))}
                onFocus={(e) => e.target.style.borderColor = '#10b981'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(71, 85, 105, 0.5)'}
              >
                {units.map(unit => (
                  <option key={unit} value={unit}>{unit}</option>
                ))}
              </select>
            </div>
          </div>

          <div style={modernStyles.formRow}>
            <div style={modernStyles.formGroup}>
              <label style={modernStyles.label}>Estoque Atual</label>
              <input
                type="number"
                style={modernStyles.input}
                value={formData.currentStock || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, currentStock: Number(e.target.value) }))}
                placeholder="0"
                min="0"
                step="0.01"
                onFocus={(e) => e.target.style.borderColor = '#10b981'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(71, 85, 105, 0.5)'}
              />
            </div>

            <div style={modernStyles.formGroup}>
              <label style={modernStyles.label}>Estoque Mínimo</label>
              <input
                type="number"
                style={modernStyles.input}
                value={formData.minStock || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, minStock: Number(e.target.value) }))}
                placeholder="0"
                min="0"
                step="0.01"
                onFocus={(e) => e.target.style.borderColor = '#10b981'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(71, 85, 105, 0.5)'}
              />
            </div>

            <div style={modernStyles.formGroup}>
              <label style={modernStyles.label}>Estoque Máximo</label>
              <input
                type="number"
                style={modernStyles.input}
                value={formData.maxStock || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, maxStock: Number(e.target.value) }))}
                placeholder="0"
                min="0"
                step="0.01"
                onFocus={(e) => e.target.style.borderColor = '#10b981'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(71, 85, 105, 0.5)'}
              />
            </div>
          </div>

          <div style={modernStyles.formRow}>
            <div style={modernStyles.formGroup}>
              <label style={modernStyles.label}>Custo Médio (R$)</label>
              <input
                type="number"
                style={modernStyles.input}
                value={formData.avgCost || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, avgCost: Number(e.target.value) }))}
                placeholder="0.00"
                min="0"
                step="0.01"
                onFocus={(e) => e.target.style.borderColor = '#10b981'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(71, 85, 105, 0.5)'}
              />
            </div>

            <div style={modernStyles.formGroup}>
              <label style={modernStyles.label}>Fornecedor Principal</label>
              <input
                type="text"
                style={modernStyles.input}
                value={formData.supplier}
                onChange={(e) => setFormData(prev => ({ ...prev, supplier: e.target.value }))}
                placeholder="Nome do fornecedor"
                onFocus={(e) => e.target.style.borderColor = '#10b981'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(71, 85, 105, 0.5)'}
              />
            </div>

            <div style={modernStyles.formGroup}>
              <label style={modernStyles.label}>Vida Útil (dias)</label>
              <input
                type="number"
                style={modernStyles.input}
                value={formData.shelfLife || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, shelfLife: Number(e.target.value) }))}
                placeholder="30"
                min="1"
                onFocus={(e) => e.target.style.borderColor = '#10b981'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(71, 85, 105, 0.5)'}
              />
            </div>
          </div>

          <div style={modernStyles.formRow}>
            <div style={modernStyles.formGroup}>
              <label style={modernStyles.label}>Condição de Armazenamento</label>
              <select
                style={modernStyles.select}
                value={formData.storageCondition}
                onChange={(e) => setFormData(prev => ({ ...prev, storageCondition: e.target.value }))}
                onFocus={(e) => e.target.style.borderColor = '#10b981'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(71, 85, 105, 0.5)'}
              >
                {storageConditions.map(condition => (
                  <option key={condition} value={condition}>
                    {condition.charAt(0).toUpperCase() + condition.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div style={modernStyles.formGroup}>
              <label style={modernStyles.label}>Status</label>
              <select
                style={modernStyles.select}
                value={formData.isActive ? 'active' : 'inactive'}
                onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.value === 'active' }))}
                onFocus={(e) => e.target.style.borderColor = '#10b981'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(71, 85, 105, 0.5)'}
              >
                <option value="active">Ativo</option>
                <option value="inactive">Inativo</option>
              </select>
            </div>
          </div>

          <div style={modernStyles.formGroup}>
            <label style={modernStyles.label}>Observações</label>
            <textarea
              style={modernStyles.textarea}
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Observações sobre o ingrediente..."
              onFocus={(e) => e.target.style.borderColor = '#10b981'}
              onBlur={(e) => e.target.style.borderColor = 'rgba(71, 85, 105, 0.5)'}
            />
          </div>

          <div style={{display: 'flex', gap: '12px', marginTop: '24px'}}>
            <button
              style={{...modernStyles.button, ...modernStyles.buttonPrimary}}
              onClick={saveIngredient}
              disabled={loading}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              💾 {isEditing ? 'Atualizar' : 'Salvar'} Ingrediente
            </button>

            <button
              style={{...modernStyles.button, ...modernStyles.buttonSecondary}}
              onClick={resetForm}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              🔄 Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Filtros */}
      <div style={modernStyles.filterBar}>
        {[
          { key: 'all', label: 'Todos', icon: '📋' },
          { key: 'active', label: 'Ativos', icon: '✅' },
          { key: 'inactive', label: 'Inativos', icon: '❌' },
          { key: 'low-stock', label: 'Estoque Baixo', icon: '⚠️' },
          { key: 'critical', label: 'Crítico', icon: '🚨' },
        ].map(filterOption => (
          <button
            key={filterOption.key}
            style={{
              ...modernStyles.filterButton,
              ...(filter === filterOption.key ? modernStyles.filterActive : modernStyles.filterInactive)
            }}
            onClick={() => setFilter(filterOption.key)}
            onMouseEnter={(e) => {
              if (filter !== filterOption.key) {
                e.currentTarget.style.background = 'rgba(71, 85, 105, 0.8)';
              }
            }}
            onMouseLeave={(e) => {
              if (filter !== filterOption.key) {
                e.currentTarget.style.background = 'rgba(71, 85, 105, 0.6)';
              }
            }}
          >
            {filterOption.icon} {filterOption.label}
          </button>
        ))}
      </div>

      {/* Lista de Ingredientes */}
      <div style={modernStyles.form}>
        <h2 style={modernStyles.formTitle}>
          📋 Ingredientes Cadastrados ({filteredIngredients.length})
        </h2>

        {loading ? (
          <div style={{textAlign: 'center', padding: '40px', color: '#94a3b8'}}>
            Carregando ingredientes...
          </div>
        ) : filteredIngredients.length === 0 ? (
          <div style={{textAlign: 'center', padding: '40px', color: '#94a3b8'}}>
            <div style={{fontSize: '4rem', marginBottom: '16px'}}>🥬</div>
            <h3 style={{color: '#ffffff', marginBottom: '8px'}}>
              {filter === 'all' ? 'Nenhum ingrediente cadastrado' : 'Nenhum ingrediente encontrado'}
            </h3>
            <p>
              {filter === 'all' 
                ? 'Adicione seu primeiro ingrediente usando o botão "Novo Ingrediente".'
                : 'Altere o filtro para ver outros ingredientes.'
              }
            </p>
          </div>
        ) : (
          <div style={modernStyles.ingredientsList}>
            {filteredIngredients.map((ingredient) => {
              const stockStatus = getStockStatus(ingredient);
              return (
                <div
                  key={ingredient._id}
                  style={modernStyles.ingredientCard}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 10px 25px -5px rgba(0, 0, 0, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div style={modernStyles.ingredientHeader}>
                    <div>
                      <h3 style={modernStyles.ingredientName}>{ingredient.name}</h3>
                      <p style={modernStyles.ingredientCategory}>{ingredient.category}</p>
                    </div>
                    <div style={{
                      ...modernStyles.statusBadge,
                      ...(ingredient.isActive ? modernStyles.statusActive : modernStyles.statusInactive)
                    }}>
                      {ingredient.isActive ? 'Ativo' : 'Inativo'}
                    </div>
                  </div>

                  <div style={modernStyles.stockInfo}>
                    <div style={modernStyles.stockItem}>
                      <div style={{...modernStyles.stockValue, color: stockStatus.color}}>
                        {ingredient.currentStock} {ingredient.unit}
                      </div>
                      <div style={modernStyles.stockLabel}>Estoque Atual</div>
                    </div>
                    <div style={modernStyles.stockItem}>
                      <div style={modernStyles.stockValue}>
                        R$ {ingredient.avgCost.toFixed(2)}
                      </div>
                      <div style={modernStyles.stockLabel}>Custo Médio</div>
                    </div>
                    <div style={modernStyles.stockItem}>
                      <div style={modernStyles.stockValue}>
                        {ingredient.minStock} {ingredient.unit}
                      </div>
                      <div style={modernStyles.stockLabel}>Mín. Estoque</div>
                    </div>
                    <div style={modernStyles.stockItem}>
                      <div style={modernStyles.stockValue}>
                        {ingredient.shelfLife} dias
                      </div>
                      <div style={modernStyles.stockLabel}>Vida Útil</div>
                    </div>
                  </div>

                  {ingredient.supplier && (
                    <div style={{marginBottom: '16px', color: '#94a3b8', fontSize: '0.875rem'}}>
                      🏪 Fornecedor: {ingredient.supplier}
                    </div>
                  )}

                  <div style={{display: 'flex', gap: '8px'}}>
                    <button
                      style={{...modernStyles.button, ...modernStyles.buttonEdit, padding: '8px 16px'}}
                      onClick={() => editIngredient(ingredient)}
                      onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                      onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                    >
                      ✏️ Editar
                    </button>
                    <button
                      style={{...modernStyles.button, ...modernStyles.buttonDanger, padding: '8px 16px'}}
                      onClick={() => ingredient._id && deleteIngredient(ingredient._id)}
                      onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                      onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                    >
                      🗑️ Excluir
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}