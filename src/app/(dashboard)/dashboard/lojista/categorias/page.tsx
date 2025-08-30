'use client';

import { useState, useEffect } from 'react';

interface Category {
  _id: string;
  name: string;
  description?: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export default function CategoriasPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/categories');
      const data = await response.json();
      
      if (data.success && Array.isArray(data.categories)) {
        setCategories(data.categories);
      } else {
        setCategories([]);
      }
    } catch (error) {
      console.error('Erro ao buscar categorias:', error);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const url = editingCategory 
        ? `/api/categories/${editingCategory._id}`
        : '/api/categories';
      
      const method = editingCategory ? 'PATCH' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        await fetchCategories();
        resetForm();
        alert(editingCategory ? 'Categoria atualizada com sucesso!' : 'Categoria criada com sucesso!');
      } else {
        alert('Erro: ' + result.error);
      }
    } catch (error) {
      console.error('Erro ao salvar categoria:', error);
      alert('Erro ao salvar categoria');
    }
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (categoryId: string) => {
    if (!confirm('Tem certeza que deseja excluir esta categoria?')) {
      return;
    }

    try {
      const response = await fetch(`/api/categories/${categoryId}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (result.success) {
        await fetchCategories();
        alert('Categoria excluída com sucesso!');
      } else {
        alert('Erro: ' + result.error);
      }
    } catch (error) {
      console.error('Erro ao excluir categoria:', error);
      alert('Erro ao excluir categoria');
    }
  };

  const resetForm = () => {
    setFormData({ name: '', description: '' });
    setEditingCategory(null);
    setShowForm(false);
  };

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-vh-100" style={{ background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}>
      <div className="container-fluid py-4">
        {/* Header */}
        <div className="row mb-4">
          <div className="col">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h1 className="h3 mb-1" style={{ color: '#1f2937', fontWeight: '700' }}>
                  <span className="me-2" style={{ fontSize: '1.5rem' }}>🏷️</span>
                  Gestão de Categorias
                </h1>
                <p className="text-muted mb-0">Organize seus produtos em categorias</p>
              </div>
              <button 
                className="btn btn-primary"
                onClick={() => setShowForm(!showForm)}
              >
                <span className="me-2">➕</span>
                {showForm ? 'Cancelar' : 'Nova Categoria'}
              </button>
            </div>
          </div>
        </div>

        {/* Busca */}
        <div className="row mb-4">
          <div className="col-md-6">
            <div className="input-group">
              <span className="input-group-text">🔍</span>
              <input
                type="text"
                className="form-control"
                placeholder="Buscar categorias..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Formulário */}
        {showForm && (
          <div className="row mb-4">
            <div className="col-md-8 col-lg-6">
              <div className="card shadow-sm">
                <div className="card-header bg-primary text-white">
                  <h5 className="card-title mb-0">
                    {editingCategory ? 'Editar Categoria' : 'Nova Categoria'}
                  </h5>
                </div>
                <div className="card-body">
                  <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                      <label htmlFor="name" className="form-label">Nome da Categoria *</label>
                      <input
                        type="text"
                        className="form-control"
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        required
                        placeholder="Ex: Hambúrgueres, Bebidas, Sobremesas..."
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="description" className="form-label">Descrição</label>
                      <textarea
                        className="form-control"
                        id="description"
                        rows={3}
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                        placeholder="Descrição opcional da categoria..."
                      />
                    </div>
                    <div className="d-flex gap-2">
                      <button type="submit" className="btn btn-success">
                        <span className="me-2">💾</span>
                        {editingCategory ? 'Atualizar' : 'Criar'}
                      </button>
                      <button type="button" className="btn btn-secondary" onClick={resetForm}>
                        Cancelar
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Estatísticas */}
        <div className="row mb-4">
          <div className="col-md-4">
            <div className="card text-center h-100 shadow-sm">
              <div className="card-body">
                <div className="display-4 text-primary mb-2">📊</div>
                <h5 className="card-title">Total de Categorias</h5>
                <h2 className="text-primary">{categories.length}</h2>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card text-center h-100 shadow-sm">
              <div className="card-body">
                <div className="display-4 text-success mb-2">✅</div>
                <h5 className="card-title">Categorias Ativas</h5>
                <h2 className="text-success">{categories.length}</h2>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card text-center h-100 shadow-sm">
              <div className="card-body">
                <div className="display-4 text-info mb-2">🔍</div>
                <h5 className="card-title">Resultados da Busca</h5>
                <h2 className="text-info">{filteredCategories.length}</h2>
              </div>
            </div>
          </div>
        </div>

        {/* Lista de Categorias */}
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Carregando categorias...</span>
            </div>
          </div>
        ) : filteredCategories.length === 0 ? (
          <div className="card shadow-sm">
            <div className="card-body text-center py-5">
              <div className="display-1 mb-3">🏷️</div>
              <h3 className="text-muted mb-3">
                {searchTerm ? 'Nenhuma categoria encontrada' : 'Nenhuma categoria criada'}
              </h3>
              <p className="text-muted mb-4">
                {searchTerm 
                  ? 'Tente alterar os termos da busca'
                  : 'Comece criando sua primeira categoria para organizar seus produtos'
                }
              </p>
              {!searchTerm && (
                <button 
                  className="btn btn-primary"
                  onClick={() => setShowForm(true)}
                >
                  <span className="me-2">➕</span>
                  Criar Primeira Categoria
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="row">
            {filteredCategories.map((category) => (
              <div key={category._id} className="col-md-6 col-lg-4 mb-4">
                <div className="card h-100 shadow-sm">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <div className="flex-grow-1">
                        <h5 className="card-title mb-1" style={{ color: '#1f2937' }}>
                          🏷️ {category.name}
                        </h5>
                        {category.description && (
                          <p className="card-text text-muted small">
                            {category.description}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <div className="row text-center mb-3">
                      <div className="col">
                        <small className="text-muted">Criada em</small>
                        <div className="fw-medium">
                          {new Date(category.createdAt).toLocaleDateString('pt-BR')}
                        </div>
                      </div>
                    </div>

                    <div className="d-flex gap-2">
                      <button
                        className="btn btn-outline-primary btn-sm flex-fill"
                        onClick={() => handleEdit(category)}
                      >
                        ✏️ Editar
                      </button>
                      <button
                        className="btn btn-outline-danger btn-sm flex-fill"
                        onClick={() => handleDelete(category._id)}
                      >
                        🗑️ Excluir
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
  );
}