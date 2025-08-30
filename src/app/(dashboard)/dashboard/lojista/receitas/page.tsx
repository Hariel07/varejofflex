"use client";

import { useState, useEffect } from 'react';
import { useAuthUser, useTenantApi } from '@/hooks/useAuth';
import { ProtectedContent } from '@/components/auth/ProtectedContent';

interface Ingredient {
  _id: string;
  name: string;
  unit: string;
  price: number;
}

interface RecipeIngredient {
  ingredientId: string;
  quantity: number;
  unit: string;
  notes?: string;
  _ingredient?: Ingredient;
}

interface Recipe {
  _id: string;
  name: string;
  description?: string;
  category?: string;
  difficulty?: string;
  prepTime?: number;
  cookTime?: number;
  servings: number;
  ingredients: RecipeIngredient[];
  instructions: string[];
  totalCost?: number;
  costPerServing?: number;
  createdAt: string;
  updatedAt: string;
}

interface RecipeFormData {
  name: string;
  description: string;
  category: string;
  difficulty: string;
  prepTime: number;
  cookTime: number;
  servings: number;
  ingredients: RecipeIngredient[];
  instructions: string[];
}

export default function ReceitasPage() {
  const { user } = useAuthUser();
  const { get, post, patch } = useTenantApi();
  
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  
  const [formData, setFormData] = useState<RecipeFormData>({
    name: '',
    description: '',
    category: 'Pratos Principais',
    difficulty: 'facil',
    prepTime: 0,
    cookTime: 0,
    servings: 1,
    ingredients: [],
    instructions: ['']
  });

  const categories = [
    'Pratos Principais',
    'Entradas',
    'Sobremesas',
    'Bebidas',
    'Molhos',
    'Massas',
    'Hambúrgueres',
    'Pizzas',
    'Outros'
  ];

  const difficulties = [
    { value: 'facil', label: 'Fácil' },
    { value: 'medio', label: 'Médio' },
    { value: 'dificil', label: 'Difícil' }
  ];

  useEffect(() => {
    loadRecipes();
    loadIngredients();
  }, []);

  const loadRecipes = async () => {
    try {
      setLoading(true);
      const response = await get('/api/recipes');
      if (response.ok) {
        const data = await response.json();
        setRecipes(data.recipes || []);
      }
    } catch (error) {
      console.error('Erro ao carregar receitas:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadIngredients = async () => {
    try {
      const response = await get('/api/ingredients');
      if (response.ok) {
        const data = await response.json();
        setIngredients(data.ingredients || []);
      }
    } catch (error) {
      console.error('Erro ao carregar ingredientes:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const recipeData = {
        ...formData,
        prepTime: Number(formData.prepTime),
        cookTime: Number(formData.cookTime),
        servings: Number(formData.servings),
        instructions: formData.instructions.filter(inst => inst.trim() !== '')
      };

      let response;
      if (editingRecipe) {
        response = await patch(`/api/recipes/${editingRecipe._id}`, recipeData);
      } else {
        response = await post('/api/recipes', recipeData);
      }

      if (response.ok) {
        await loadRecipes();
        resetForm();
        alert('Receita salva com sucesso!');
      } else {
        const error = await response.json();
        alert(error.error || 'Erro ao salvar receita');
      }
    } catch (error) {
      console.error('Erro ao salvar receita:', error);
      alert('Erro ao salvar receita');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      category: 'Pratos Principais',
      difficulty: 'facil',
      prepTime: 0,
      cookTime: 0,
      servings: 1,
      ingredients: [],
      instructions: ['']
    });
    setEditingRecipe(null);
    setShowForm(false);
  };

  const editRecipe = (recipe: Recipe) => {
    setFormData({
      name: recipe.name,
      description: recipe.description || '',
      category: recipe.category || 'Pratos Principais',
      difficulty: recipe.difficulty || 'facil',
      prepTime: recipe.prepTime || 0,
      cookTime: recipe.cookTime || 0,
      servings: recipe.servings,
      ingredients: recipe.ingredients,
      instructions: recipe.instructions.length > 0 ? recipe.instructions : ['']
    });
    setEditingRecipe(recipe);
    setShowForm(true);
  };

  const addIngredient = () => {
    setFormData({
      ...formData,
      ingredients: [
        ...formData.ingredients,
        { ingredientId: '', quantity: 0, unit: 'un' }
      ]
    });
  };

  const removeIngredient = (index: number) => {
    const newIngredients = formData.ingredients.filter((_, i) => i !== index);
    setFormData({ ...formData, ingredients: newIngredients });
  };

  const updateIngredient = (index: number, field: string, value: any) => {
    const newIngredients = [...formData.ingredients];
    newIngredients[index] = { ...newIngredients[index], [field]: value };
    setFormData({ ...formData, ingredients: newIngredients });
  };

  const addInstruction = () => {
    setFormData({
      ...formData,
      instructions: [...formData.instructions, '']
    });
  };

  const removeInstruction = (index: number) => {
    const newInstructions = formData.instructions.filter((_, i) => i !== index);
    setFormData({ ...formData, instructions: newInstructions });
  };

  const updateInstruction = (index: number, value: string) => {
    const newInstructions = [...formData.instructions];
    newInstructions[index] = value;
    setFormData({ ...formData, instructions: newInstructions });
  };

  const getDifficultyBadge = (difficulty: string) => {
    const badges = {
      facil: 'bg-success',
      medio: 'bg-warning text-dark',
      dificil: 'bg-danger'
    };
    
    const labels = {
      facil: 'Fácil',
      medio: 'Médio',
      dificil: 'Difícil'
    };
    
    return (
      <span className={`badge ${badges[difficulty as keyof typeof badges] || 'bg-secondary'}`}>
        {labels[difficulty as keyof typeof labels] || difficulty}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Carregando receitas...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <ProtectedContent permission="manage_recipes">
      <div className="min-vh-100" style={{ background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}>
        <div className="container-fluid py-4">
          {/* Header */}
          <div className="row mb-4">
            <div className="col">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h1 className="h3 mb-1">
                    <i className="bi bi-book me-2"></i>
                    Gestão de Receitas
                  </h1>
                  <p className="text-muted mb-0">Crie e gerencie suas receitas com cálculo automático de custos</p>
                </div>
                <button 
                  className="btn btn-warning"
                  onClick={() => setShowForm(!showForm)}
                >
                  <i className="bi bi-plus-circle me-2"></i>
                  {showForm ? 'Cancelar' : 'Nova Receita'}
                </button>
              </div>
            </div>
          </div>

          {/* Formulário de Receita */}
          {showForm && (
            <div className="row mb-4">
              <div className="col-12">
                <div className="card">
                  <div className="card-header">
                    <h5 className="card-title mb-0">
                      {editingRecipe ? 'Editar Receita' : 'Nova Receita'}
                    </h5>
                  </div>
                  <div className="card-body">
                    <form onSubmit={handleSubmit}>
                      {/* Informações Básicas */}
                      <div className="row">
                        <div className="col-md-6 mb-3">
                          <label className="form-label">Nome da Receita *</label>
                          <input
                            type="text"
                            className="form-control"
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            required
                          />
                        </div>
                        <div className="col-md-6 mb-3">
                          <label className="form-label">Categoria</label>
                          <select
                            className="form-select"
                            value={formData.category}
                            onChange={(e) => setFormData({...formData, category: e.target.value})}
                          >
                            {categories.map(cat => (
                              <option key={cat} value={cat}>{cat}</option>
                            ))}
                          </select>
                        </div>
                        <div className="col-md-4 mb-3">
                          <label className="form-label">Dificuldade</label>
                          <select
                            className="form-select"
                            value={formData.difficulty}
                            onChange={(e) => setFormData({...formData, difficulty: e.target.value})}
                          >
                            {difficulties.map(diff => (
                              <option key={diff.value} value={diff.value}>{diff.label}</option>
                            ))}
                          </select>
                        </div>
                        <div className="col-md-4 mb-3">
                          <label className="form-label">Tempo Preparo (min)</label>
                          <input
                            type="number"
                            className="form-control"
                            value={formData.prepTime}
                            onChange={(e) => setFormData({...formData, prepTime: Number(e.target.value)})}
                          />
                        </div>
                        <div className="col-md-4 mb-3">
                          <label className="form-label">Porções</label>
                          <input
                            type="number"
                            className="form-control"
                            value={formData.servings}
                            onChange={(e) => setFormData({...formData, servings: Number(e.target.value)})}
                            min="1"
                            required
                          />
                        </div>
                        <div className="col-12 mb-3">
                          <label className="form-label">Descrição</label>
                          <textarea
                            className="form-control"
                            rows={3}
                            value={formData.description}
                            onChange={(e) => setFormData({...formData, description: e.target.value})}
                            placeholder="Descreva sua receita..."
                          />
                        </div>
                      </div>

                      {/* Ingredientes */}
                      <div className="mb-4">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                          <h6>Ingredientes</h6>
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-success"
                            onClick={addIngredient}
                          >
                            <i className="bi bi-plus"></i> Adicionar Ingrediente
                          </button>
                        </div>
                        
                        {formData.ingredients.map((ingredient, index) => (
                          <div key={index} className="row align-items-end mb-2">
                            <div className="col-md-5">
                              <select
                                className="form-select"
                                value={ingredient.ingredientId}
                                onChange={(e) => updateIngredient(index, 'ingredientId', e.target.value)}
                                required
                              >
                                <option value="">Selecione um ingrediente</option>
                                {ingredients.map(ing => (
                                  <option key={ing._id} value={ing._id}>
                                    {ing.name} ({ing.unit})
                                  </option>
                                ))}
                              </select>
                            </div>
                            <div className="col-md-3">
                              <input
                                type="number"
                                step="0.01"
                                className="form-control"
                                placeholder="Quantidade"
                                value={ingredient.quantity}
                                onChange={(e) => updateIngredient(index, 'quantity', Number(e.target.value))}
                                required
                              />
                            </div>
                            <div className="col-md-2">
                              <select
                                className="form-select"
                                value={ingredient.unit}
                                onChange={(e) => updateIngredient(index, 'unit', e.target.value)}
                              >
                                <option value="g">g</option>
                                <option value="kg">kg</option>
                                <option value="ml">ml</option>
                                <option value="l">l</option>
                                <option value="un">un</option>
                              </select>
                            </div>
                            <div className="col-md-2">
                              <button
                                type="button"
                                className="btn btn-outline-danger"
                                onClick={() => removeIngredient(index)}
                              >
                                <i className="bi bi-trash"></i>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Instruções */}
                      <div className="mb-4">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                          <h6>Modo de Preparo</h6>
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-primary"
                            onClick={addInstruction}
                          >
                            <i className="bi bi-plus"></i> Adicionar Passo
                          </button>
                        </div>
                        
                        {formData.instructions.map((instruction, index) => (
                          <div key={index} className="row align-items-center mb-2">
                            <div className="col-md-1">
                              <span className="badge bg-secondary">{index + 1}</span>
                            </div>
                            <div className="col-md-10">
                              <textarea
                                className="form-control"
                                rows={2}
                                placeholder={`Passo ${index + 1}...`}
                                value={instruction}
                                onChange={(e) => updateInstruction(index, e.target.value)}
                              />
                            </div>
                            <div className="col-md-1">
                              {formData.instructions.length > 1 && (
                                <button
                                  type="button"
                                  className="btn btn-outline-danger"
                                  onClick={() => removeInstruction(index)}
                                >
                                  <i className="bi bi-trash"></i>
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <div className="d-flex gap-2">
                        <button
                          type="submit"
                          className="btn btn-warning"
                          disabled={!formData.name || formData.ingredients.length === 0}
                        >
                          <i className="bi bi-save me-2"></i>
                          {editingRecipe ? 'Atualizar' : 'Salvar'} Receita
                        </button>
                        
                        <button
                          type="button"
                          className="btn btn-secondary"
                          onClick={resetForm}
                        >
                          Cancelar
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Lista de Receitas */}
          <div className="row">
            <div className="col-12">
              <div className="card">
                <div className="card-header">
                  <h5 className="card-title mb-0">
                    Receitas ({recipes.length})
                  </h5>
                </div>
                <div className="card-body">
                  {recipes.length === 0 ? (
                    <div className="text-center py-4">
                      <i className="bi bi-book fs-1 text-muted mb-3"></i>
                      <p className="text-muted">Nenhuma receita cadastrada ainda.</p>
                      <button 
                        className="btn btn-warning"
                        onClick={() => setShowForm(true)}
                      >
                        Criar Primeira Receita
                      </button>
                    </div>
                  ) : (
                    <div className="row">
                      {recipes.map(recipe => (
                        <div key={recipe._id} className="col-md-6 col-lg-4 mb-4">
                          <div className="card h-100 shadow-sm">
                            <div className="card-body">
                              <h6 className="card-title">{recipe.name}</h6>
                              {recipe.description && (
                                <p className="card-text text-muted small">
                                  {recipe.description.length > 80 
                                    ? recipe.description.substring(0, 80) + '...' 
                                    : recipe.description}
                                </p>
                              )}
                              
                              <div className="mb-2">
                                <span className="badge bg-primary me-1">{recipe.category}</span>
                                {getDifficultyBadge(recipe.difficulty || 'facil')}
                              </div>
                              
                              <div className="small text-muted mb-3">
                                <div><i className="bi bi-clock me-1"></i> {recipe.prepTime || 0} min</div>
                                <div><i className="bi bi-people me-1"></i> {recipe.servings} porções</div>
                                {recipe.costPerServing && (
                                  <div><i className="bi bi-calculator me-1"></i> R$ {recipe.costPerServing.toFixed(2)}/porção</div>
                                )}
                              </div>
                            </div>
                            
                            <div className="card-footer bg-transparent">
                              <div className="d-flex gap-2">
                                <button
                                  className="btn btn-sm btn-outline-primary flex-fill"
                                  onClick={() => editRecipe(recipe)}
                                >
                                  <i className="bi bi-pencil me-1"></i> Editar
                                </button>
                                <button
                                  className="btn btn-sm btn-outline-info flex-fill"
                                  onClick={() => setSelectedRecipe(recipe)}
                                >
                                  <i className="bi bi-eye me-1"></i> Ver
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Modal de Visualização */}
          {selectedRecipe && (
            <div className="modal show d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
              <div className="modal-dialog modal-lg">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">{selectedRecipe.name}</h5>
                    <button 
                      type="button" 
                      className="btn-close"
                      onClick={() => setSelectedRecipe(null)}
                    ></button>
                  </div>
                  <div className="modal-body">
                    {selectedRecipe.description && (
                      <p className="text-muted">{selectedRecipe.description}</p>
                    )}
                    
                    <div className="row mb-3">
                      <div className="col-md-6">
                        <small className="text-muted">Categoria:</small>
                        <div>{selectedRecipe.category}</div>
                      </div>
                      <div className="col-md-6">
                        <small className="text-muted">Dificuldade:</small>
                        <div>{getDifficultyBadge(selectedRecipe.difficulty || 'facil')}</div>
                      </div>
                    </div>
                    
                    <h6>Ingredientes:</h6>
                    <ul className="list-group mb-3">
                      {selectedRecipe.ingredients.map((ing, index) => (
                        <li key={index} className="list-group-item d-flex justify-content-between">
                          <span>{ing._ingredient?.name || 'Ingrediente não encontrado'}</span>
                          <span>{ing.quantity} {ing.unit}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <h6>Modo de Preparo:</h6>
                    <ol>
                      {selectedRecipe.instructions.map((instruction, index) => (
                        <li key={index} className="mb-2">{instruction}</li>
                      ))}
                    </ol>
                    
                    {selectedRecipe.costPerServing && (
                      <div className="alert alert-info">
                        <strong>Custo por porção:</strong> R$ {selectedRecipe.costPerServing.toFixed(2)}
                      </div>
                    )}
                  </div>
                  <div className="modal-footer">
                    <button 
                      type="button" 
                      className="btn btn-secondary"
                      onClick={() => setSelectedRecipe(null)}
                    >
                      Fechar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </ProtectedContent>
  );
}