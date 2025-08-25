'use client';

import React, { useState, useEffect } from 'react';

interface Ingredient {
  _id: string;
  name: string;
  unit: string;
  avgCost: number;
}

interface RecipeIngredient {
  ingredientId: string;
  ingredientName: string;
  quantity: number;
  unit: string;
  cost: number;
}

interface Recipe {
  _id?: string;
  name: string;
  description: string;
  category: string;
  preparationTime: number; // minutos
  servings: number;
  difficulty: 'fácil' | 'médio' | 'difícil';
  instructions: string[];
  ingredients: RecipeIngredient[];
  totalCost: number;
  costPerServing: number;
  profitMargin: number;
  suggestedPrice: number;
  isActive: boolean;
  tags: string[];
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
    background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
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
  buttonSuccess: {
    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    color: '#ffffff',
  },
  ingredientsSection: {
    background: 'rgba(51, 65, 85, 0.3)',
    borderRadius: '12px',
    padding: '20px',
    marginTop: '16px',
  },
  ingredientItem: {
    background: 'rgba(30, 41, 59, 0.8)',
    borderRadius: '8px',
    padding: '16px',
    marginBottom: '12px',
    border: '1px solid rgba(71, 85, 105, 0.3)',
  },
  ingredientHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px',
  },
  ingredientName: {
    fontWeight: '600',
    color: '#ffffff',
  },
  ingredientDetails: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
    gap: '8px',
    fontSize: '0.75rem',
    color: '#94a3b8',
  },
  instructionsSection: {
    background: 'rgba(51, 65, 85, 0.3)',
    borderRadius: '12px',
    padding: '20px',
    marginTop: '16px',
  },
  instruction: {
    background: 'rgba(30, 41, 59, 0.8)',
    borderRadius: '8px',
    padding: '16px',
    marginBottom: '12px',
    border: '1px solid rgba(71, 85, 105, 0.3)',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  instructionNumber: {
    background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
    color: '#ffffff',
    borderRadius: '50%',
    width: '32px',
    height: '32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '600',
    fontSize: '0.875rem',
    flexShrink: 0,
  },
  recipesList: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))',
    gap: '20px',
  },
  recipeCard: {
    background: 'rgba(30, 41, 59, 0.8)',
    borderRadius: '12px',
    padding: '24px',
    border: '1px solid rgba(51, 65, 85, 0.5)',
    transition: 'all 0.2s ease',
  },
  recipeHeader: {
    marginBottom: '16px',
  },
  recipeName: {
    fontSize: '1.25rem',
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: '8px',
  },
  recipeCategory: {
    fontSize: '0.75rem',
    color: '#94a3b8',
    textTransform: 'uppercase' as const,
    fontWeight: '600',
  },
  recipeStats: {
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
  costBreakdown: {
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
  tagsList: {
    display: 'flex',
    flexWrap: 'wrap' as const,
    gap: '8px',
    marginTop: '12px',
  },
  tag: {
    background: 'rgba(139, 92, 246, 0.2)',
    color: '#a78bfa',
    padding: '4px 8px',
    borderRadius: '12px',
    fontSize: '0.75rem',
    fontWeight: '600',
  },
};

export default function RecipeManager() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState<Recipe>({
    name: '',
    description: '',
    category: '',
    preparationTime: 30,
    servings: 1,
    difficulty: 'fácil',
    instructions: [''],
    ingredients: [],
    totalCost: 0,
    costPerServing: 0,
    profitMargin: 100,
    suggestedPrice: 0,
    isActive: true,
    tags: [],
  });

  const [currentIngredient, setCurrentIngredient] = useState({
    ingredientId: '',
    quantity: 0,
  });

  const categories = [
    'Lanches', 'Bebidas', 'Sobremesas', 'Pratos Principais', 'Aperitivos',
    'Saladas', 'Sopas', 'Massas', 'Grelhados', 'Fritos', 'Especiais'
  ];

  useEffect(() => {
    loadRecipes();
    loadIngredients();
  }, []);

  useEffect(() => {
    calculateCosts();
  }, [formData.ingredients, formData.servings, formData.profitMargin]);

  const loadRecipes = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/recipes');
      if (response.ok) {
        const data = await response.json();
        setRecipes(data);
      }
    } catch (error) {
      console.error('Erro ao carregar receitas:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadIngredients = async () => {
    try {
      const response = await fetch('/api/ingredients');
      if (response.ok) {
        const data = await response.json();
        setIngredients(data);
      }
    } catch (error) {
      console.error('Erro ao carregar ingredientes:', error);
    }
  };

  const calculateCosts = () => {
    const totalCost = formData.ingredients.reduce((sum, ing) => sum + ing.cost, 0);
    const costPerServing = formData.servings > 0 ? totalCost / formData.servings : 0;
    const suggestedPrice = costPerServing * (1 + formData.profitMargin / 100);

    setFormData(prev => ({
      ...prev,
      totalCost,
      costPerServing,
      suggestedPrice
    }));
  };

  const addIngredient = () => {
    const ingredient = ingredients.find(ing => ing._id === currentIngredient.ingredientId);
    if (!ingredient || currentIngredient.quantity <= 0) {
      setError('Selecione um ingrediente e quantidade válida');
      return;
    }

    const cost = ingredient.avgCost * currentIngredient.quantity;
    const newIngredient: RecipeIngredient = {
      ingredientId: ingredient._id,
      ingredientName: ingredient.name,
      quantity: currentIngredient.quantity,
      unit: ingredient.unit,
      cost
    };

    setFormData(prev => ({
      ...prev,
      ingredients: [...prev.ingredients, newIngredient]
    }));

    setCurrentIngredient({ ingredientId: '', quantity: 0 });
    setSuccess('Ingrediente adicionado à receita');
    setTimeout(() => setSuccess(''), 3000);
  };

  const removeIngredient = (index: number) => {
    setFormData(prev => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== index)
    }));
  };

  const addInstruction = () => {
    setFormData(prev => ({
      ...prev,
      instructions: [...prev.instructions, '']
    }));
  };

  const updateInstruction = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      instructions: prev.instructions.map((inst, i) => i === index ? value : inst)
    }));
  };

  const removeInstruction = (index: number) => {
    setFormData(prev => ({
      ...prev,
      instructions: prev.instructions.filter((_, i) => i !== index)
    }));
  };

  const saveRecipe = async () => {
    try {
      if (!formData.name || !formData.category || formData.ingredients.length === 0) {
        setError('Preencha todos os campos obrigatórios e adicione pelo menos um ingrediente');
        return;
      }

      setLoading(true);
      const url = isEditing ? `/api/recipes/${editingId}` : '/api/recipes';
      const method = isEditing ? 'PUT' : 'POST';

      // Filtrar instruções vazias
      const cleanInstructions = formData.instructions.filter(inst => inst.trim() !== '');

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          instructions: cleanInstructions
        })
      });

      if (response.ok) {
        setSuccess(isEditing ? 'Receita atualizada!' : 'Receita criada!');
        resetForm();
        loadRecipes();
      } else {
        setError('Erro ao salvar receita');
      }
    } catch (error) {
      console.error('Erro:', error);
      setError('Erro ao salvar receita');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      category: '',
      preparationTime: 30,
      servings: 1,
      difficulty: 'fácil',
      instructions: [''],
      ingredients: [],
      totalCost: 0,
      costPerServing: 0,
      profitMargin: 100,
      suggestedPrice: 0,
      isActive: true,
      tags: [],
    });
    setCurrentIngredient({ ingredientId: '', quantity: 0 });
    setShowForm(false);
    setIsEditing(false);
    setEditingId(null);
  };

  const editRecipe = (recipe: Recipe) => {
    setFormData(recipe);
    setIsEditing(true);
    setEditingId(recipe._id || null);
    setShowForm(true);
  };

  const deleteRecipe = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta receita?')) return;

    try {
      const response = await fetch(`/api/recipes/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setSuccess('Receita excluída com sucesso');
        loadRecipes();
      } else {
        setError('Erro ao excluir receita');
      }
    } catch (error) {
      console.error('Erro:', error);
      setError('Erro ao excluir receita');
    }
  };

  return (
    <div style={modernStyles.container}>
      {/* Header */}
      <div style={modernStyles.header}>
        <h1 style={modernStyles.title}>
          📝 Gestão de Receitas
        </h1>
        <button
          style={{...modernStyles.button, ...modernStyles.buttonPrimary}}
          onClick={() => setShowForm(!showForm)}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
          {showForm ? '❌ Cancelar' : '➕ Nova Receita'}
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
            {isEditing ? '✏️ Editar Receita' : '➕ Nova Receita'}
          </h2>

          {/* Informações Básicas */}
          <div style={modernStyles.formRow}>
            <div style={modernStyles.formGroup}>
              <label style={modernStyles.label}>Nome da Receita *</label>
              <input
                type="text"
                style={modernStyles.input}
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Ex: X-Burger Especial"
                onFocus={(e) => e.target.style.borderColor = '#8b5cf6'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(71, 85, 105, 0.5)'}
              />
            </div>

            <div style={modernStyles.formGroup}>
              <label style={modernStyles.label}>Categoria *</label>
              <select
                style={modernStyles.select}
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                onFocus={(e) => e.target.style.borderColor = '#8b5cf6'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(71, 85, 105, 0.5)'}
              >
                <option value="">Selecione uma categoria</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div style={modernStyles.formGroup}>
              <label style={modernStyles.label}>Dificuldade</label>
              <select
                style={modernStyles.select}
                value={formData.difficulty}
                onChange={(e) => setFormData(prev => ({ ...prev, difficulty: e.target.value as any }))}
                onFocus={(e) => e.target.style.borderColor = '#8b5cf6'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(71, 85, 105, 0.5)'}
              >
                <option value="fácil">Fácil</option>
                <option value="médio">Médio</option>
                <option value="difícil">Difícil</option>
              </select>
            </div>
          </div>

          <div style={modernStyles.formRow}>
            <div style={modernStyles.formGroup}>
              <label style={modernStyles.label}>Tempo de Preparo (min)</label>
              <input
                type="number"
                style={modernStyles.input}
                value={formData.preparationTime || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, preparationTime: Number(e.target.value) }))}
                placeholder="30"
                min="1"
                onFocus={(e) => e.target.style.borderColor = '#8b5cf6'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(71, 85, 105, 0.5)'}
              />
            </div>

            <div style={modernStyles.formGroup}>
              <label style={modernStyles.label}>Porções</label>
              <input
                type="number"
                style={modernStyles.input}
                value={formData.servings || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, servings: Number(e.target.value) }))}
                placeholder="1"
                min="1"
                onFocus={(e) => e.target.style.borderColor = '#8b5cf6'}
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
                onFocus={(e) => e.target.style.borderColor = '#8b5cf6'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(71, 85, 105, 0.5)'}
              />
            </div>
          </div>

          <div style={modernStyles.formGroup}>
            <label style={modernStyles.label}>Descrição</label>
            <textarea
              style={modernStyles.textarea}
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Descrição da receita..."
              onFocus={(e) => e.target.style.borderColor = '#8b5cf6'}
              onBlur={(e) => e.target.style.borderColor = 'rgba(71, 85, 105, 0.5)'}
            />
          </div>

          {/* Ingredientes */}
          <div style={modernStyles.ingredientsSection}>
            <h3 style={{...modernStyles.formTitle, marginBottom: '16px'}}>
              🥬 Ingredientes
            </h3>

            <div style={modernStyles.formRow}>
              <div style={modernStyles.formGroup}>
                <label style={modernStyles.label}>Ingrediente</label>
                <select
                  style={modernStyles.select}
                  value={currentIngredient.ingredientId}
                  onChange={(e) => setCurrentIngredient(prev => ({ ...prev, ingredientId: e.target.value }))}
                  onFocus={(e) => e.target.style.borderColor = '#8b5cf6'}
                  onBlur={(e) => e.target.style.borderColor = 'rgba(71, 85, 105, 0.5)'}
                >
                  <option value="">Selecione um ingrediente</option>
                  {ingredients.map(ingredient => (
                    <option key={ingredient._id} value={ingredient._id}>
                      {ingredient.name} ({ingredient.unit})
                    </option>
                  ))}
                </select>
              </div>

              <div style={modernStyles.formGroup}>
                <label style={modernStyles.label}>Quantidade</label>
                <input
                  type="number"
                  style={modernStyles.input}
                  value={currentIngredient.quantity || ''}
                  onChange={(e) => setCurrentIngredient(prev => ({ ...prev, quantity: Number(e.target.value) }))}
                  placeholder="0"
                  min="0"
                  step="0.01"
                  onFocus={(e) => e.target.style.borderColor = '#8b5cf6'}
                  onBlur={(e) => e.target.style.borderColor = 'rgba(71, 85, 105, 0.5)'}
                />
              </div>

              <div style={{display: 'flex', alignItems: 'end'}}>
                <button
                  style={{...modernStyles.button, ...modernStyles.buttonSuccess}}
                  onClick={addIngredient}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  ➕ Adicionar
                </button>
              </div>
            </div>

            {/* Lista de Ingredientes */}
            {formData.ingredients.length > 0 && (
              <div style={{marginTop: '16px'}}>
                <h4 style={{color: '#ffffff', marginBottom: '12px'}}>
                  Ingredientes da Receita ({formData.ingredients.length})
                </h4>
                {formData.ingredients.map((ingredient, index) => (
                  <div key={index} style={modernStyles.ingredientItem}>
                    <div style={modernStyles.ingredientHeader}>
                      <h5 style={modernStyles.ingredientName}>{ingredient.ingredientName}</h5>
                      <button
                        style={{...modernStyles.button, ...modernStyles.buttonDanger, padding: '6px 12px'}}
                        onClick={() => removeIngredient(index)}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                      >
                        🗑️
                      </button>
                    </div>
                    <div style={modernStyles.ingredientDetails}>
                      <span>Qtd: {ingredient.quantity} {ingredient.unit}</span>
                      <span>Custo: R$ {ingredient.cost.toFixed(2)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Instruções */}
          <div style={modernStyles.instructionsSection}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px'}}>
              <h3 style={modernStyles.formTitle}>
                📋 Modo de Preparo
              </h3>
              <button
                style={{...modernStyles.button, ...modernStyles.buttonSuccess}}
                onClick={addInstruction}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                ➕ Adicionar Passo
              </button>
            </div>

            {formData.instructions.map((instruction, index) => (
              <div key={index} style={modernStyles.instruction}>
                <div style={modernStyles.instructionNumber}>
                  {index + 1}
                </div>
                <input
                  type="text"
                  style={{...modernStyles.input, margin: 0}}
                  value={instruction}
                  onChange={(e) => updateInstruction(index, e.target.value)}
                  placeholder={`Passo ${index + 1}...`}
                  onFocus={(e) => e.target.style.borderColor = '#8b5cf6'}
                  onBlur={(e) => e.target.style.borderColor = 'rgba(71, 85, 105, 0.5)'}
                />
                {formData.instructions.length > 1 && (
                  <button
                    style={{...modernStyles.button, ...modernStyles.buttonDanger, padding: '8px'}}
                    onClick={() => removeInstruction(index)}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                  >
                    🗑️
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Análise de Custos */}
          {formData.ingredients.length > 0 && (
            <div style={modernStyles.costBreakdown}>
              <h3 style={{color: '#ffffff', marginBottom: '16px'}}>💰 Análise de Custos</h3>
              <div style={modernStyles.formRow}>
                <div style={modernStyles.statItem}>
                  <div style={modernStyles.statValue}>R$ {formData.totalCost.toFixed(2)}</div>
                  <div style={modernStyles.statLabel}>Custo Total</div>
                </div>
                <div style={modernStyles.statItem}>
                  <div style={modernStyles.statValue}>R$ {formData.costPerServing.toFixed(2)}</div>
                  <div style={modernStyles.statLabel}>Custo por Porção</div>
                </div>
                <div style={modernStyles.statItem}>
                  <div style={modernStyles.statValue}>{formData.profitMargin}%</div>
                  <div style={modernStyles.statLabel}>Margem de Lucro</div>
                </div>
                <div style={modernStyles.statItem}>
                  <div style={{...modernStyles.statValue, color: '#4ade80'}}>R$ {formData.suggestedPrice.toFixed(2)}</div>
                  <div style={modernStyles.statLabel}>Preço Sugerido</div>
                </div>
              </div>
            </div>
          )}

          {/* Botões de Ação */}
          <div style={{display: 'flex', gap: '12px', marginTop: '24px'}}>
            <button
              style={{...modernStyles.button, ...modernStyles.buttonPrimary}}
              onClick={saveRecipe}
              disabled={loading}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              💾 {isEditing ? 'Atualizar' : 'Salvar'} Receita
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

      {/* Lista de Receitas */}
      <div style={modernStyles.form}>
        <h2 style={modernStyles.formTitle}>
          📋 Receitas Cadastradas ({recipes.length})
        </h2>

        {loading ? (
          <div style={{textAlign: 'center', padding: '40px', color: '#94a3b8'}}>
            Carregando receitas...
          </div>
        ) : recipes.length === 0 ? (
          <div style={{textAlign: 'center', padding: '40px', color: '#94a3b8'}}>
            <div style={{fontSize: '4rem', marginBottom: '16px'}}>📝</div>
            <h3 style={{color: '#ffffff', marginBottom: '8px'}}>Nenhuma receita cadastrada</h3>
            <p>Crie sua primeira receita usando o botão "Nova Receita".</p>
          </div>
        ) : (
          <div style={modernStyles.recipesList}>
            {recipes.map((recipe) => (
              <div
                key={recipe._id}
                style={modernStyles.recipeCard}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 10px 25px -5px rgba(0, 0, 0, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div style={modernStyles.recipeHeader}>
                  <h3 style={modernStyles.recipeName}>{recipe.name}</h3>
                  <p style={modernStyles.recipeCategory}>{recipe.category}</p>
                </div>

                <div style={modernStyles.recipeStats}>
                  <div style={modernStyles.statItem}>
                    <div style={modernStyles.statValue}>{recipe.preparationTime} min</div>
                    <div style={modernStyles.statLabel}>Preparo</div>
                  </div>
                  <div style={modernStyles.statItem}>
                    <div style={modernStyles.statValue}>{recipe.servings}</div>
                    <div style={modernStyles.statLabel}>Porções</div>
                  </div>
                  <div style={modernStyles.statItem}>
                    <div style={modernStyles.statValue}>R$ {recipe.costPerServing.toFixed(2)}</div>
                    <div style={modernStyles.statLabel}>Custo</div>
                  </div>
                  <div style={modernStyles.statItem}>
                    <div style={{...modernStyles.statValue, color: '#4ade80'}}>R$ {recipe.suggestedPrice.toFixed(2)}</div>
                    <div style={modernStyles.statLabel}>Preço</div>
                  </div>
                </div>

                {recipe.description && (
                  <p style={{color: '#94a3b8', fontSize: '0.875rem', marginBottom: '16px'}}>
                    {recipe.description}
                  </p>
                )}

                <div style={{marginBottom: '16px', color: '#94a3b8', fontSize: '0.875rem'}}>
                  📦 {recipe.ingredients.length} ingredientes • 
                  📋 {recipe.instructions.length} passos • 
                  🎯 {recipe.difficulty}
                </div>

                <div style={{display: 'flex', gap: '8px'}}>
                  <button
                    style={{...modernStyles.button, ...modernStyles.buttonEdit, padding: '8px 16px'}}
                    onClick={() => editRecipe(recipe)}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                  >
                    ✏️ Editar
                  </button>
                  <button
                    style={{...modernStyles.button, ...modernStyles.buttonDanger, padding: '8px 16px'}}
                    onClick={() => recipe._id && deleteRecipe(recipe._id)}
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