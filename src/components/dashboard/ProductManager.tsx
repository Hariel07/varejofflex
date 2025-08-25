'use client';

import React, { useState, useEffect } from 'react';

interface Recipe {
  _id: string;
  name: string;
  costPerServing: number;
  preparationTime: number;
}

interface Product {
  _id?: string;
  name: string;
  description: string;
  category: string;
  recipeId?: string;
  recipeName?: string;
  baseCost: number;
  additionalCosts: {
    packaging: number;
    labor: number;
    overhead: number;
    other: number;
  };
  totalCost: number;
  profitMargin: number;
  salePrice: number;
  preparationTime: number;
  isActive: boolean;
  stockUnit: string;
  minStock: number;
  currentStock: number;
  tags: string[];
  images: string[];
  nutritionalInfo?: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
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
    background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
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
  costsSection: {
    background: 'rgba(51, 65, 85, 0.3)',
    borderRadius: '12px',
    padding: '20px',
    marginTop: '16px',
  },
  costItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 0',
    borderBottom: '1px solid rgba(71, 85, 105, 0.3)',
    color: '#e2e8f0',
  },
  costItemLast: {
    borderBottom: 'none',
    fontWeight: '600',
    fontSize: '1.125rem',
  },
  productsList: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))',
    gap: '20px',
  },
  productCard: {
    background: 'rgba(30, 41, 59, 0.8)',
    borderRadius: '12px',
    padding: '24px',
    border: '1px solid rgba(51, 65, 85, 0.5)',
    transition: 'all 0.2s ease',
  },
  productHeader: {
    marginBottom: '16px',
  },
  productName: {
    fontSize: '1.25rem',
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: '8px',
  },
  productCategory: {
    fontSize: '0.75rem',
    color: '#94a3b8',
    textTransform: 'uppercase' as const,
    fontWeight: '600',
  },
  productStats: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '12px',
    marginBottom: '16px',
  },
  statItem: {
    textAlign: 'center' as const,
    padding: '12px',
    background: 'rgba(51, 65, 85, 0.5)',
    borderRadius: '8px',
  },
  statValue: {
    fontSize: '1.125rem',
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: '4px',
  },
  statLabel: {
    fontSize: '0.75rem',
    color: '#94a3b8',
  },
  priceBreakdown: {
    background: 'rgba(51, 65, 85, 0.5)',
    borderRadius: '8px',
    padding: '16px',
    marginBottom: '16px',
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
    background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
    color: '#ffffff',
  },
  filterInactive: {
    background: 'rgba(71, 85, 105, 0.6)',
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
};

export default function ProductManager() {
  const [products, setProducts] = useState<Product[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [filter, setFilter] = useState('all');

  const [formData, setFormData] = useState<Product>({
    name: '',
    description: '',
    category: '',
    recipeId: '',
    baseCost: 0,
    additionalCosts: {
      packaging: 0,
      labor: 0,
      overhead: 0,
      other: 0,
    },
    totalCost: 0,
    profitMargin: 100,
    salePrice: 0,
    preparationTime: 15,
    isActive: true,
    stockUnit: 'un',
    minStock: 10,
    currentStock: 0,
    tags: [],
    images: [],
  });

  const categories = [
    'Hamburgueres', 'Sanduíches', 'Porções', 'Bebidas', 'Sobremesas',
    'Pratos Executivos', 'Saladas', 'Petiscos', 'Combos', 'Especiais'
  ];

  const stockUnits = ['un', 'kg', 'L', 'porção', 'fatia', 'copo'];

  useEffect(() => {
    loadProducts();
    loadRecipes();
  }, []);

  useEffect(() => {
    calculateTotalCostAndPrice();
  }, [formData.baseCost, formData.additionalCosts, formData.profitMargin]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/products');
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      }
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadRecipes = async () => {
    try {
      const response = await fetch('/api/recipes');
      if (response.ok) {
        const data = await response.json();
        setRecipes(data);
      }
    } catch (error) {
      console.error('Erro ao carregar receitas:', error);
    }
  };

  const calculateTotalCostAndPrice = () => {
    const { packaging, labor, overhead, other } = formData.additionalCosts;
    const totalCost = formData.baseCost + packaging + labor + overhead + other;
    const salePrice = totalCost * (1 + formData.profitMargin / 100);

    setFormData(prev => ({
      ...prev,
      totalCost,
      salePrice
    }));
  };

  const handleRecipeChange = (recipeId: string) => {
    const recipe = recipes.find(r => r._id === recipeId);
    if (recipe) {
      setFormData(prev => ({
        ...prev,
        recipeId,
        recipeName: recipe.name,
        baseCost: recipe.costPerServing,
        preparationTime: recipe.preparationTime
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        recipeId: '',
        recipeName: '',
        baseCost: 0,
        preparationTime: 15
      }));
    }
  };

  const saveProduct = async () => {
    try {
      if (!formData.name || !formData.category) {
        setError('Preencha todos os campos obrigatórios');
        return;
      }

      setLoading(true);
      const url = isEditing ? `/api/products/${editingId}` : '/api/products';
      const method = isEditing ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setSuccess(isEditing ? 'Produto atualizado!' : 'Produto criado!');
        resetForm();
        loadProducts();
      } else {
        setError('Erro ao salvar produto');
      }
    } catch (error) {
      console.error('Erro:', error);
      setError('Erro ao salvar produto');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      category: '',
      recipeId: '',
      baseCost: 0,
      additionalCosts: {
        packaging: 0,
        labor: 0,
        overhead: 0,
        other: 0,
      },
      totalCost: 0,
      profitMargin: 100,
      salePrice: 0,
      preparationTime: 15,
      isActive: true,
      stockUnit: 'un',
      minStock: 10,
      currentStock: 0,
      tags: [],
      images: [],
    });
    setShowForm(false);
    setIsEditing(false);
    setEditingId(null);
  };

  const editProduct = (product: Product) => {
    setFormData(product);
    setIsEditing(true);
    setEditingId(product._id || null);
    setShowForm(true);
  };

  const deleteProduct = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este produto?')) return;

    try {
      const response = await fetch(`/api/products/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setSuccess('Produto excluído com sucesso');
        loadProducts();
      } else {
        setError('Erro ao excluir produto');
      }
    } catch (error) {
      console.error('Erro:', error);
      setError('Erro ao excluir produto');
    }
  };

  const filteredProducts = products.filter(product => {
    switch (filter) {
      case 'active': return product.isActive;
      case 'inactive': return !product.isActive;
      case 'low-stock': return product.currentStock <= product.minStock;
      case 'with-recipe': return !!product.recipeId;
      case 'without-recipe': return !product.recipeId;
      default: return true;
    }
  });

  return (
    <div style={modernStyles.container}>
      {/* Header */}
      <div style={modernStyles.header}>
        <h1 style={modernStyles.title}>
          🍔 Gestão de Produtos
        </h1>
        <button
          style={{...modernStyles.button, ...modernStyles.buttonPrimary}}
          onClick={() => setShowForm(!showForm)}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
          {showForm ? '❌ Cancelar' : '➕ Novo Produto'}
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
            {isEditing ? '✏️ Editar Produto' : '➕ Novo Produto'}
          </h2>

          {/* Informações Básicas */}
          <div style={modernStyles.formRow}>
            <div style={modernStyles.formGroup}>
              <label style={modernStyles.label}>Nome do Produto *</label>
              <input
                type="text"
                style={modernStyles.input}
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Ex: X-Burger Especial"
                onFocus={(e) => e.target.style.borderColor = '#f59e0b'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(71, 85, 105, 0.5)'}
              />
            </div>

            <div style={modernStyles.formGroup}>
              <label style={modernStyles.label}>Categoria *</label>
              <select
                style={modernStyles.select}
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                onFocus={(e) => e.target.style.borderColor = '#f59e0b'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(71, 85, 105, 0.5)'}
              >
                <option value="">Selecione uma categoria</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div style={modernStyles.formGroup}>
              <label style={modernStyles.label}>Receita Base</label>
              <select
                style={modernStyles.select}
                value={formData.recipeId || ''}
                onChange={(e) => handleRecipeChange(e.target.value)}
                onFocus={(e) => e.target.style.borderColor = '#f59e0b'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(71, 85, 105, 0.5)'}
              >
                <option value="">Sem receita (custo manual)</option>
                {recipes.map(recipe => (
                  <option key={recipe._id} value={recipe._id}>
                    {recipe.name} (R$ {recipe.costPerServing.toFixed(2)})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div style={modernStyles.formGroup}>
            <label style={modernStyles.label}>Descrição</label>
            <textarea
              style={modernStyles.textarea}
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Descrição do produto..."
              onFocus={(e) => e.target.style.borderColor = '#f59e0b'}
              onBlur={(e) => e.target.style.borderColor = 'rgba(71, 85, 105, 0.5)'}
            />
          </div>

          {/* Custos */}
          <div style={modernStyles.costsSection}>
            <h3 style={{...modernStyles.formTitle, marginBottom: '16px'}}>
              💰 Análise de Custos
            </h3>

            <div style={modernStyles.formRow}>
              <div style={modernStyles.formGroup}>
                <label style={modernStyles.label}>
                  {formData.recipeId ? 'Custo da Receita (Automático)' : 'Custo Base *'}
                </label>
                <input
                  type="number"
                  style={modernStyles.input}
                  value={formData.baseCost || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, baseCost: Number(e.target.value) }))}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  disabled={!!formData.recipeId}
                  onFocus={(e) => e.target.style.borderColor = '#f59e0b'}
                  onBlur={(e) => e.target.style.borderColor = 'rgba(71, 85, 105, 0.5)'}
                />
              </div>

              <div style={modernStyles.formGroup}>
                <label style={modernStyles.label}>Embalagem</label>
                <input
                  type="number"
                  style={modernStyles.input}
                  value={formData.additionalCosts.packaging || ''}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    additionalCosts: { ...prev.additionalCosts, packaging: Number(e.target.value) }
                  }))}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  onFocus={(e) => e.target.style.borderColor = '#f59e0b'}
                  onBlur={(e) => e.target.style.borderColor = 'rgba(71, 85, 105, 0.5)'}
                />
              </div>

              <div style={modernStyles.formGroup}>
                <label style={modernStyles.label}>Mão de Obra</label>
                <input
                  type="number"
                  style={modernStyles.input}
                  value={formData.additionalCosts.labor || ''}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    additionalCosts: { ...prev.additionalCosts, labor: Number(e.target.value) }
                  }))}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  onFocus={(e) => e.target.style.borderColor = '#f59e0b'}
                  onBlur={(e) => e.target.style.borderColor = 'rgba(71, 85, 105, 0.5)'}
                />
              </div>
            </div>

            <div style={modernStyles.formRow}>
              <div style={modernStyles.formGroup}>
                <label style={modernStyles.label}>Custos Fixos</label>
                <input
                  type="number"
                  style={modernStyles.input}
                  value={formData.additionalCosts.overhead || ''}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    additionalCosts: { ...prev.additionalCosts, overhead: Number(e.target.value) }
                  }))}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  onFocus={(e) => e.target.style.borderColor = '#f59e0b'}
                  onBlur={(e) => e.target.style.borderColor = 'rgba(71, 85, 105, 0.5)'}
                />
              </div>

              <div style={modernStyles.formGroup}>
                <label style={modernStyles.label}>Outros Custos</label>
                <input
                  type="number"
                  style={modernStyles.input}
                  value={formData.additionalCosts.other || ''}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    additionalCosts: { ...prev.additionalCosts, other: Number(e.target.value) }
                  }))}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  onFocus={(e) => e.target.style.borderColor = '#f59e0b'}
                  onBlur={(e) => e.target.style.borderColor = 'rgba(71, 85, 105, 0.5)'}
                />
              </div>

              <div style={modernStyles.formGroup}>
                <label style={modernStyles.label}>Margem de Lucro (%)</label>
                <input
                  type="number"
                  style={modernStyles.input}
                  value={formData.profitMargin || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, profitMargin: Number(e.target.value) }))}
                  placeholder="100"
                  min="0"
                  onFocus={(e) => e.target.style.borderColor = '#f59e0b'}
                  onBlur={(e) => e.target.style.borderColor = 'rgba(71, 85, 105, 0.5)'}
                />
              </div>
            </div>

            {/* Resumo de Custos */}
            <div style={{marginTop: '20px', padding: '16px', background: 'rgba(51, 65, 85, 0.5)', borderRadius: '8px'}}>
              <div style={modernStyles.costItem}>
                <span>Custo Base:</span>
                <span>R$ {formData.baseCost.toFixed(2)}</span>
              </div>
              <div style={modernStyles.costItem}>
                <span>Embalagem:</span>
                <span>R$ {formData.additionalCosts.packaging.toFixed(2)}</span>
              </div>
              <div style={modernStyles.costItem}>
                <span>Mão de Obra:</span>
                <span>R$ {formData.additionalCosts.labor.toFixed(2)}</span>
              </div>
              <div style={modernStyles.costItem}>
                <span>Custos Fixos:</span>
                <span>R$ {formData.additionalCosts.overhead.toFixed(2)}</span>
              </div>
              <div style={modernStyles.costItem}>
                <span>Outros:</span>
                <span>R$ {formData.additionalCosts.other.toFixed(2)}</span>
              </div>
              <div style={{...modernStyles.costItem, ...modernStyles.costItemLast}}>
                <span>Custo Total:</span>
                <span>R$ {formData.totalCost.toFixed(2)}</span>
              </div>
              <div style={{...modernStyles.costItem, ...modernStyles.costItemLast, color: '#4ade80'}}>
                <span>Preço de Venda:</span>
                <span>R$ {formData.salePrice.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Informações Adicionais */}
          <div style={modernStyles.formRow}>
            <div style={modernStyles.formGroup}>
              <label style={modernStyles.label}>Tempo de Preparo (min)</label>
              <input
                type="number"
                style={modernStyles.input}
                value={formData.preparationTime || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, preparationTime: Number(e.target.value) }))}
                placeholder="15"
                min="1"
                onFocus={(e) => e.target.style.borderColor = '#f59e0b'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(71, 85, 105, 0.5)'}
              />
            </div>

            <div style={modernStyles.formGroup}>
              <label style={modernStyles.label}>Unidade de Estoque</label>
              <select
                style={modernStyles.select}
                value={formData.stockUnit}
                onChange={(e) => setFormData(prev => ({ ...prev, stockUnit: e.target.value }))}
                onFocus={(e) => e.target.style.borderColor = '#f59e0b'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(71, 85, 105, 0.5)'}
              >
                {stockUnits.map(unit => (
                  <option key={unit} value={unit}>{unit}</option>
                ))}
              </select>
            </div>

            <div style={modernStyles.formGroup}>
              <label style={modernStyles.label}>Estoque Mínimo</label>
              <input
                type="number"
                style={modernStyles.input}
                value={formData.minStock || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, minStock: Number(e.target.value) }))}
                placeholder="10"
                min="0"
                onFocus={(e) => e.target.style.borderColor = '#f59e0b'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(71, 85, 105, 0.5)'}
              />
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
                onFocus={(e) => e.target.style.borderColor = '#f59e0b'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(71, 85, 105, 0.5)'}
              />
            </div>

            <div style={modernStyles.formGroup}>
              <label style={modernStyles.label}>Status</label>
              <select
                style={modernStyles.select}
                value={formData.isActive ? 'active' : 'inactive'}
                onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.value === 'active' }))}
                onFocus={(e) => e.target.style.borderColor = '#f59e0b'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(71, 85, 105, 0.5)'}
              >
                <option value="active">Ativo</option>
                <option value="inactive">Inativo</option>
              </select>
            </div>
          </div>

          {/* Botões de Ação */}
          <div style={{display: 'flex', gap: '12px', marginTop: '24px'}}>
            <button
              style={{...modernStyles.button, ...modernStyles.buttonPrimary}}
              onClick={saveProduct}
              disabled={loading}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              💾 {isEditing ? 'Atualizar' : 'Salvar'} Produto
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
          { key: 'with-recipe', label: 'Com Receita', icon: '📝' },
          { key: 'without-recipe', label: 'Sem Receita', icon: '📄' },
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

      {/* Lista de Produtos */}
      <div style={modernStyles.form}>
        <h2 style={modernStyles.formTitle}>
          📋 Produtos Cadastrados ({filteredProducts.length})
        </h2>

        {loading ? (
          <div style={{textAlign: 'center', padding: '40px', color: '#94a3b8'}}>
            Carregando produtos...
          </div>
        ) : filteredProducts.length === 0 ? (
          <div style={{textAlign: 'center', padding: '40px', color: '#94a3b8'}}>
            <div style={{fontSize: '4rem', marginBottom: '16px'}}>🍔</div>
            <h3 style={{color: '#ffffff', marginBottom: '8px'}}>
              {filter === 'all' ? 'Nenhum produto cadastrado' : 'Nenhum produto encontrado'}
            </h3>
            <p>
              {filter === 'all' 
                ? 'Crie seu primeiro produto usando o botão "Novo Produto".'
                : 'Altere o filtro para ver outros produtos.'
              }
            </p>
          </div>
        ) : (
          <div style={modernStyles.productsList}>
            {filteredProducts.map((product) => (
              <div
                key={product._id}
                style={modernStyles.productCard}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 10px 25px -5px rgba(0, 0, 0, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div style={modernStyles.productHeader}>
                  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
                    <div>
                      <h3 style={modernStyles.productName}>{product.name}</h3>
                      <p style={modernStyles.productCategory}>{product.category}</p>
                    </div>
                    <div style={{
                      ...modernStyles.statusBadge,
                      ...(product.isActive ? modernStyles.statusActive : modernStyles.statusInactive)
                    }}>
                      {product.isActive ? 'Ativo' : 'Inativo'}
                    </div>
                  </div>
                </div>

                <div style={modernStyles.productStats}>
                  <div style={modernStyles.statItem}>
                    <div style={modernStyles.statValue}>R$ {product.totalCost.toFixed(2)}</div>
                    <div style={modernStyles.statLabel}>Custo Total</div>
                  </div>
                  <div style={modernStyles.statItem}>
                    <div style={{...modernStyles.statValue, color: '#4ade80'}}>R$ {product.salePrice.toFixed(2)}</div>
                    <div style={modernStyles.statLabel}>Preço Venda</div>
                  </div>
                  <div style={modernStyles.statItem}>
                    <div style={modernStyles.statValue}>{product.profitMargin}%</div>
                    <div style={modernStyles.statLabel}>Margem</div>
                  </div>
                  <div style={modernStyles.statItem}>
                    <div style={modernStyles.statValue}>
                      {product.currentStock} {product.stockUnit}
                    </div>
                    <div style={modernStyles.statLabel}>Estoque</div>
                  </div>
                </div>

                {product.description && (
                  <p style={{color: '#94a3b8', fontSize: '0.875rem', marginBottom: '16px'}}>
                    {product.description}
                  </p>
                )}

                <div style={{marginBottom: '16px', color: '#94a3b8', fontSize: '0.875rem'}}>
                  ⏱️ {product.preparationTime} min • 
                  {product.recipeName ? (
                    <span> 📝 {product.recipeName}</span>
                  ) : (
                    <span> 📄 Custo manual</span>
                  )}
                  {product.currentStock <= product.minStock && (
                    <span style={{color: '#f59e0b'}}> • ⚠️ Estoque baixo</span>
                  )}
                </div>

                <div style={{display: 'flex', gap: '8px'}}>
                  <button
                    style={{...modernStyles.button, ...modernStyles.buttonEdit, padding: '8px 16px'}}
                    onClick={() => editProduct(product)}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                  >
                    ✏️ Editar
                  </button>
                  <button
                    style={{...modernStyles.button, ...modernStyles.buttonDanger, padding: '8px 16px'}}
                    onClick={() => product._id && deleteProduct(product._id)}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                  >
                    🗑️ Excluir
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}