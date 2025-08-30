"use client";

import { useState, useEffect } from 'react';
import { useAuthUser, useTenantApi } from '@/hooks/useAuth';
import { ProtectedContent } from '@/components/auth/ProtectedContent';

interface Ingredient {
  _id: string;
  name: string;
  description?: string;
  price: number;
  quantity: number;
  unit: 'g' | 'kg' | 'ml' | 'l' | 'un' | 'lata' | 'pacote';
  supplier?: string;
  currentStock?: number;
  minStock?: number;
  category?: string;
  createdAt: string;
  updatedAt: string;
}

interface IngredientFormData {
  name: string;
  description: string;
  category: string;
  price: number;
  quantity: number;
  unit: 'g' | 'kg' | 'ml' | 'l' | 'un' | 'lata' | 'pacote';
  supplier: string;
  currentStock: number;
  minStock: number;
}

export default function IngredientesPage() {
  const { user } = useAuthUser();
  const { get, post, patch } = useTenantApi();
  
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingIngredient, setEditingIngredient] = useState<Ingredient | null>(null);
  
  const [formData, setFormData] = useState<IngredientFormData>({
    name: '',
    description: '',
    category: 'Carnes',
    price: 0,
    quantity: 0,
    unit: 'kg',
    supplier: '',
    currentStock: 0,
    minStock: 10
  });

  const categories = [
    'Carnes',
    'Vegetais',
    'Temperos',
    'Massas',
    'Laticínios',
    'Bebidas',
    'Condimentos',
    'Outros'
  ];

  const units = [
    { value: 'g', label: 'Gramas (g)' },
    { value: 'kg', label: 'Quilogramas (kg)' },
    { value: 'ml', label: 'Mililitros (ml)' },
    { value: 'l', label: 'Litros (l)' },
    { value: 'un', label: 'Unidades' },
    { value: 'lata', label: 'Latas' },
    { value: 'pacote', label: 'Pacotes' }
  ];

  useEffect(() => {
    loadIngredients();
  }, []);

  const loadIngredients = async () => {
    try {
      setLoading(true);
      const response = await get('/api/ingredients');
      if (response.ok) {
        const data = await response.json();
        setIngredients(data.ingredients || []);
      }
    } catch (error) {
      console.error('Erro ao carregar ingredientes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const ingredientData = {
        ...formData,
        price: Number(formData.price),
        quantity: Number(formData.quantity),
        currentStock: Number(formData.currentStock),
        minStock: Number(formData.minStock)
      };

      let response;
      if (editingIngredient) {
        response = await patch(`/api/ingredients/${editingIngredient._id}`, ingredientData);
      } else {
        response = await post('/api/ingredients', ingredientData);
      }

      if (response.ok) {
        await loadIngredients();
        resetForm();
        alert('Ingrediente salvo com sucesso!');
      } else {
        const error = await response.json();
        alert(error.error || 'Erro ao salvar ingrediente');
      }
    } catch (error) {
      console.error('Erro ao salvar ingrediente:', error);
      alert('Erro ao salvar ingrediente');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      category: 'Carnes',
      price: 0,
      quantity: 0,
      unit: 'kg',
      supplier: '',
      currentStock: 0,
      minStock: 10
    });
    setEditingIngredient(null);
    setShowForm(false);
  };

  const editIngredient = (ingredient: Ingredient) => {
    setFormData({
      name: ingredient.name,
      description: ingredient.description || '',
      category: ingredient.category || 'Carnes',
      price: ingredient.price,
      quantity: ingredient.quantity,
      unit: ingredient.unit,
      supplier: ingredient.supplier || '',
      currentStock: ingredient.currentStock || 0,
      minStock: ingredient.minStock || 10
    });
    setEditingIngredient(ingredient);
    setShowForm(true);
  };

  const getStockStatus = (current: number, min: number) => {
    if (current <= min) {
      return <span className="badge bg-danger">Estoque Baixo</span>;
    }
    if (current <= min * 1.5) {
      return <span className="badge bg-warning text-dark">Atenção</span>;
    }
    return <span className="badge bg-success">OK</span>;
  };

  if (loading) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Carregando ingredientes...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <ProtectedContent permission="manage_ingredients">
      <div className="min-vh-100" style={{ background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}>
        <div className="container-fluid py-4">
          {/* Header */}
          <div className="row mb-4">
            <div className="col">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h1 className="h3 mb-1">
                    <i className="bi bi-egg me-2"></i>
                    Gestão de Ingredientes
                  </h1>
                  <p className="text-muted mb-0">Controle o estoque e custos dos seus ingredientes</p>
                </div>
                <button 
                  className="btn btn-success"
                  onClick={() => setShowForm(!showForm)}
                >
                  <i className="bi bi-plus-circle me-2"></i>
                  {showForm ? 'Cancelar' : 'Novo Ingrediente'}
                </button>
              </div>
            </div>
          </div>

          {/* Formulário de Ingrediente */}
          {showForm && (
            <div className="row mb-4">
              <div className="col-12">
                <div className="card">
                  <div className="card-header">
                    <h5 className="card-title mb-0">
                      {editingIngredient ? 'Editar Ingrediente' : 'Novo Ingrediente'}
                    </h5>
                  </div>
                  <div className="card-body">
                    <form onSubmit={handleSubmit}>
                      <div className="row">
                        <div className="col-md-6 mb-3">
                          <label className="form-label">Nome do Ingrediente *</label>
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
                        <div className="col-md-6 mb-3">
                          <label className="form-label">Preço por Unidade (R$) *</label>
                          <input
                            type="number"
                            step="0.01"
                            className="form-control"
                            value={formData.price}
                            onChange={(e) => setFormData({...formData, price: Number(e.target.value)})}
                            required
                          />
                        </div>
                        <div className="col-md-6 mb-3">
                          <label className="form-label">Unidade</label>
                          <select
                            className="form-select"
                            value={formData.unit}
                            onChange={(e) => setFormData({...formData, unit: e.target.value as any})}
                          >
                            {units.map(unit => (
                              <option key={unit.value} value={unit.value}>{unit.label}</option>
                            ))}
                          </select>
                        </div>
                        <div className="col-md-6 mb-3">
                          <label className="form-label">Estoque Atual</label>
                          <input
                            type="number"
                            step="0.01"
                            className="form-control"
                            value={formData.currentStock}
                            onChange={(e) => setFormData({...formData, currentStock: Number(e.target.value)})}
                          />
                        </div>
                        <div className="col-md-6 mb-3">
                          <label className="form-label">Estoque Mínimo</label>
                          <input
                            type="number"
                            step="0.01"
                            className="form-control"
                            value={formData.minStock}
                            onChange={(e) => setFormData({...formData, minStock: Number(e.target.value)})}
                          />
                        </div>
                        <div className="col-md-6 mb-3">
                          <label className="form-label">Fornecedor</label>
                          <input
                            type="text"
                            className="form-control"
                            value={formData.supplier}
                            onChange={(e) => setFormData({...formData, supplier: e.target.value})}
                            placeholder="Nome do fornecedor"
                          />
                        </div>
                        <div className="col-12 mb-3">
                          <label className="form-label">Descrição</label>
                          <textarea
                            className="form-control"
                            rows={3}
                            value={formData.description}
                            onChange={(e) => setFormData({...formData, description: e.target.value})}
                            placeholder="Descrição adicional do ingrediente..."
                          />
                        </div>
                      </div>
                      
                      <div className="d-flex gap-2">
                        <button
                          type="submit"
                          className="btn btn-success"
                          disabled={!formData.name || formData.price <= 0}
                        >
                          <i className="bi bi-save me-2"></i>
                          {editingIngredient ? 'Atualizar' : 'Salvar'} Ingrediente
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

          {/* Lista de Ingredientes */}
          <div className="row">
            <div className="col-12">
              <div className="card">
                <div className="card-header">
                  <h5 className="card-title mb-0">
                    Ingredientes ({ingredients.length})
                  </h5>
                </div>
                <div className="card-body">
                  {ingredients.length === 0 ? (
                    <div className="text-center py-4">
                      <i className="bi bi-egg fs-1 text-muted mb-3"></i>
                      <p className="text-muted">Nenhum ingrediente cadastrado ainda.</p>
                      <button 
                        className="btn btn-success"
                        onClick={() => setShowForm(true)}
                      >
                        Cadastrar Primeiro Ingrediente
                      </button>
                    </div>
                  ) : (
                    <div className="table-responsive">
                      <table className="table table-hover">
                        <thead>
                          <tr>
                            <th>Ingrediente</th>
                            <th>Categoria</th>
                            <th>Preço/Un.</th>
                            <th>Estoque</th>
                            <th>Unidade</th>
                            <th>Status</th>
                            <th>Fornecedor</th>
                            <th>Ações</th>
                          </tr>
                        </thead>
                        <tbody>
                          {ingredients.map(ingredient => (
                            <tr key={ingredient._id}>
                              <td>
                                <div>
                                  <div className="fw-bold">{ingredient.name}</div>
                                  {ingredient.description && (
                                    <small className="text-muted">
                                      {ingredient.description.length > 30 
                                        ? ingredient.description.substring(0, 30) + '...' 
                                        : ingredient.description}
                                    </small>
                                  )}
                                </div>
                              </td>
                              <td>{ingredient.category}</td>
                              <td>R$ {ingredient.price.toFixed(2)}</td>
                              <td>{ingredient.currentStock || 0}</td>
                              <td>{ingredient.unit}</td>
                              <td>
                                {getStockStatus(ingredient.currentStock || 0, ingredient.minStock || 10)}
                              </td>
                              <td>{ingredient.supplier || '-'}</td>
                              <td>
                                <div className="btn-group btn-group-sm">
                                  <button
                                    className="btn btn-outline-primary"
                                    onClick={() => editIngredient(ingredient)}
                                    title="Editar"
                                  >
                                    <i className="bi bi-pencil"></i>
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedContent>
  );
}