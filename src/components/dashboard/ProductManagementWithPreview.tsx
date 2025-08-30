"use client";

import { useState, useEffect } from 'react';
import { useAuthUser, useTenantApi } from '@/hooks/useAuth';

interface Product {
  _id: string;
  name: string;
  description?: string;
  price: number;
  category?: string;
  image?: string;
  status: 'draft' | 'published' | 'archived';
  createdAt: string;
  updatedAt: string;
}

interface ProductFormData {
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
}

export default function ProductManagement() {
  const { user } = useAuthUser();
  const { get, post, patch } = useTenantApi();
  
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [previewProduct, setPreviewProduct] = useState<Product | null>(null);
  const [statusFilter, setStatusFilter] = useState<'all' | 'draft' | 'published' | 'archived'>('all');
  
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    description: '',
    price: 0,
    category: 'Hambúrgueres',
    image: ''
  });

  const categories = [
    'Hambúrgueres',
    'Acompanhamentos', 
    'Bebidas',
    'Sobremesas',
    'Pizzas',
    'Lanches',
    'Pratos Principais'
  ];

  useEffect(() => {
    loadProducts();
  }, [statusFilter]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const response = await get('/api/products?preview=true');
      if (response.ok) {
        const data = await response.json();
        let filteredProducts = data.products || data;
        
        if (statusFilter !== 'all') {
          filteredProducts = filteredProducts.filter((p: Product) => p.status === statusFilter);
        }
        
        setProducts(filteredProducts);
      }
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent, action: 'draft' | 'publish') => {
    e.preventDefault();
    
    try {
      const productData = {
        ...formData,
        price: Number(formData.price),
        status: action === 'draft' ? 'draft' : 'published'
      };

      let response;
      if (editingProduct) {
        response = await patch(`/api/products/${editingProduct._id}`, productData);
      } else {
        response = await post('/api/products', productData);
      }

      if (response.ok) {
        await loadProducts();
        resetForm();
        
        const actionText = action === 'draft' ? 'salvo como rascunho' : 'publicado';
        alert(`Produto ${actionText} com sucesso!`);
      } else {
        const error = await response.json();
        alert(error.message || 'Erro ao salvar produto');
      }
    } catch (error) {
      console.error('Erro ao salvar produto:', error);
      alert('Erro ao salvar produto');
    }
  };

  const handleStatusChange = async (productId: string, action: string) => {
    try {
      const response = await patch(`/api/products/${productId}/status`, { action });
      
      if (response.ok) {
        await loadProducts();
        const data = await response.json();
        alert(data.message);
      } else {
        const error = await response.json();
        alert(error.error || 'Erro ao atualizar status');
      }
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      alert('Erro ao atualizar status');
    }
  };

  const openPreview = (product: Product) => {
    setPreviewProduct(product);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: 0,
      category: 'Hambúrgueres',
      image: ''
    });
    setEditingProduct(null);
    setShowForm(false);
  };

  const editProduct = (product: Product) => {
    setFormData({
      name: product.name,
      description: product.description || '',
      price: product.price,
      category: product.category || 'Hambúrgueres',
      image: product.image || ''
    });
    setEditingProduct(product);
    setShowForm(true);
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      draft: 'bg-warning text-dark',
      published: 'bg-success text-white',
      archived: 'bg-secondary text-white'
    };
    
    const labels = {
      draft: 'Rascunho',
      published: 'Publicado',
      archived: 'Arquivado'
    };
    
    return (
      <span className={`badge ${badges[status as keyof typeof badges]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Carregando produtos...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4">
      {/* Header */}
      <div className="row mb-4">
        <div className="col">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h1 className="h3 mb-1" style={{ color: '#1f2937', fontWeight: '700' }}>
                <i className="bi bi-box me-2" aria-hidden="true" style={{ color: '#3b82f6' }}>📦</i>
                Gestão de Produtos
              </h1>
              <p className="text-muted mb-0">Crie, edite e gerencie seus produtos</p>
            </div>
            <button 
              className="btn btn-primary"
              onClick={() => setShowForm(!showForm)}
            >
              <i className="bi bi-plus-circle me-2"></i>
              {showForm ? 'Cancelar' : 'Novo Produto'}
            </button>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="row mb-4">
        <div className="col-md-6">
          <div className="d-flex gap-2">
            <button 
              className={`btn btn-sm ${statusFilter === 'all' ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={() => setStatusFilter('all')}
            >
              Todos
            </button>
            <button 
              className={`btn btn-sm ${statusFilter === 'draft' ? 'btn-warning' : 'btn-outline-warning'}`}
              onClick={() => setStatusFilter('draft')}
            >
              Rascunhos
            </button>
            <button 
              className={`btn btn-sm ${statusFilter === 'published' ? 'btn-success' : 'btn-outline-success'}`}
              onClick={() => setStatusFilter('published')}
            >
              Publicados
            </button>
            <button 
              className={`btn btn-sm ${statusFilter === 'archived' ? 'btn-secondary' : 'btn-outline-secondary'}`}
              onClick={() => setStatusFilter('archived')}
            >
              Arquivados
            </button>
          </div>
        </div>
      </div>

      {/* Formulário de Produto */}
      {showForm && (
        <div className="row mb-4">
          <div className="col-12">
            <div className="card">
              <div className="card-header">
                <h5 className="card-title mb-0">
                  {editingProduct ? 'Editar Produto' : 'Novo Produto'}
                </h5>
              </div>
              <div className="card-body">
                <form>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Nome do Produto *</label>
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
                      <label className="form-label">Preço (R$) *</label>
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
                      <label className="form-label">URL da Imagem</label>
                      <input
                        type="url"
                        className="form-control"
                        value={formData.image}
                        onChange={(e) => setFormData({...formData, image: e.target.value})}
                        placeholder="https://exemplo.com/imagem.jpg"
                      />
                    </div>
                    <div className="col-12 mb-3">
                      <label className="form-label">Descrição</label>
                      <textarea
                        className="form-control"
                        rows={3}
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                        placeholder="Descreva os ingredientes e características do produto..."
                      />
                    </div>
                  </div>
                  
                  <div className="d-flex gap-2">
                    <button
                      type="button"
                      className="btn btn-warning"
                      onClick={(e) => handleSubmit(e, 'draft')}
                      disabled={!formData.name || formData.price <= 0}
                    >
                      <i className="bi bi-save me-2"></i>
                      Salvar como Rascunho
                    </button>
                    
                    <button
                      type="button"
                      className="btn btn-success"
                      onClick={(e) => handleSubmit(e, 'publish')}
                      disabled={!formData.name || formData.price <= 0}
                    >
                      <i className="bi bi-check-circle me-2"></i>
                      Salvar e Publicar
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

      {/* Lista de Produtos */}
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title mb-0">
                Produtos ({products.length})
              </h5>
            </div>
            <div className="card-body">
              {products.length === 0 ? (
                <div className="text-center py-4">
                  <i className="bi bi-box fs-1 text-muted mb-3"></i>
                  <p className="text-muted">
                    {statusFilter === 'all' 
                      ? 'Nenhum produto cadastrado ainda.' 
                      : `Nenhum produto ${statusFilter === 'draft' ? 'em rascunho' : statusFilter === 'published' ? 'publicado' : 'arquivado'} encontrado.`
                    }
                  </p>
                  <button 
                    className="btn btn-primary"
                    onClick={() => setShowForm(true)}
                  >
                    Criar Primeiro Produto
                  </button>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>Produto</th>
                        <th>Categoria</th>
                        <th>Preço</th>
                        <th>Status</th>
                        <th>Atualizado</th>
                        <th>Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map(product => (
                        <tr key={product._id}>
                          <td>
                            <div className="d-flex align-items-center">
                              {product.image && (
                                <img 
                                  src={product.image} 
                                  alt={product.name}
                                  className="rounded me-3"
                                  style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                                />
                              )}
                              <div>
                                <div className="fw-bold">{product.name}</div>
                                {product.description && (
                                  <small className="text-muted">
                                    {product.description.length > 50 
                                      ? product.description.substring(0, 50) + '...' 
                                      : product.description}
                                  </small>
                                )}
                              </div>
                            </div>
                          </td>
                          <td>{product.category}</td>
                          <td>R$ {product.price.toFixed(2)}</td>
                          <td>{getStatusBadge(product.status)}</td>
                          <td>{new Date(product.updatedAt).toLocaleDateString('pt-BR')}</td>
                          <td>
                            <div className="btn-group btn-group-sm">
                              <button
                                className="btn btn-outline-primary"
                                onClick={() => editProduct(product)}
                                title="Editar"
                              >
                                <i className="bi bi-pencil"></i>
                              </button>
                              
                              <button
                                className="btn btn-outline-info"
                                onClick={() => openPreview(product)}
                                title="Visualizar Preview"
                              >
                                <i className="bi bi-eye"></i>
                              </button>
                              
                              {product.status === 'draft' && (
                                <button
                                  className="btn btn-outline-success"
                                  onClick={() => handleStatusChange(product._id, 'publish')}
                                  title="Publicar"
                                >
                                  <i className="bi bi-check-circle"></i>
                                </button>
                              )}
                              
                              {product.status === 'published' && (
                                <button
                                  className="btn btn-outline-warning"
                                  onClick={() => handleStatusChange(product._id, 'unpublish')}
                                  title="Despublicar"
                                >
                                  <i className="bi bi-pause-circle"></i>
                                </button>
                              )}
                              
                              {product.status !== 'archived' && (
                                <button
                                  className="btn btn-outline-secondary"
                                  onClick={() => handleStatusChange(product._id, 'archive')}
                                  title="Arquivar"
                                >
                                  <i className="bi bi-archive"></i>
                                </button>
                              )}
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

      {/* Modal de Preview */}
      {previewProduct && (
        <div className="modal show d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <i className="bi bi-eye me-2"></i>
                  Preview do Produto - Como o Cliente Verá
                </h5>
                <button 
                  type="button" 
                  className="btn-close"
                  onClick={() => setPreviewProduct(null)}
                ></button>
              </div>
              <div className="modal-body">
                {/* Simulação da visualização do cliente */}
                <div className="border rounded p-4" style={{ backgroundColor: '#f8f9fa' }}>
                  <div className="text-center mb-3">
                    <small className="text-muted">👆 Visualização do Cardápio</small>
                  </div>
                  
                  <div className="card shadow-sm">
                    {previewProduct.image && (
                      <img 
                        src={previewProduct.image} 
                        alt={previewProduct.name}
                        className="card-img-top"
                        style={{ height: '200px', objectFit: 'cover' }}
                      />
                    )}
                    <div className="card-body">
                      <h5 className="card-title">{previewProduct.name}</h5>
                      {previewProduct.description && (
                        <p className="card-text text-muted">{previewProduct.description}</p>
                      )}
                      <div className="d-flex justify-content-between align-items-center">
                        <span className="h5 mb-0 text-success">R$ {previewProduct.price.toFixed(2)}</span>
                        <button className="btn btn-primary">
                          <i className="bi bi-cart-plus me-2"></i>
                          Adicionar
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-center mt-3">
                    <small className="text-muted">👆 Como aparecerá no cardápio online</small>
                  </div>
                </div>
                
                {previewProduct.status === 'draft' && (
                  <div className="alert alert-warning mt-3">
                    <i className="bi bi-exclamation-triangle me-2"></i>
                    <strong>Atenção:</strong> Este produto está em rascunho e não é visível para os clientes.
                    Para torná-lo visível, clique em "Publicar" na lista de produtos.
                  </div>
                )}
              </div>
              <div className="modal-footer">
                {previewProduct.status === 'draft' && (
                  <button
                    className="btn btn-success"
                    onClick={() => {
                      handleStatusChange(previewProduct._id, 'publish');
                      setPreviewProduct(null);
                    }}
                  >
                    <i className="bi bi-check-circle me-2"></i>
                    Publicar Agora
                  </button>
                )}
                
                <button
                  className="btn btn-outline-primary"
                  onClick={() => {
                    editProduct(previewProduct);
                    setPreviewProduct(null);
                  }}
                >
                  <i className="bi bi-pencil me-2"></i>
                  Editar Produto
                </button>
                
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => setPreviewProduct(null)}
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}