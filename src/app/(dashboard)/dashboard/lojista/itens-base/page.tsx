"use client";

import { useState, useEffect } from 'react';
import { useAuthUser, useTenantApi } from '@/hooks/useAuth';
import { ProtectedContent } from '@/components/auth/ProtectedContent';

interface Fornecedor {
  _id: string;
  nome: string;
  tipo: 'nota_branca' | 'nota_fiscal';
}

interface ItemBase {
  _id: string;
  nome: string;
  descricao?: string;
  categoria: string;
  unidadeMedida: 'kg' | 'g' | 'l' | 'ml' | 'un' | 'cx' | 'pct' | 'dz';
  codigoBarras?: string;
  fornecedorPadrao?: Fornecedor;
  precoMedioCompra?: number;
  controleEstoque: boolean;
  estoqueMinimo?: number;
  estoqueAtual: number;
  localizacao?: string;
  observacoes?: string;
  ativo: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ItemBaseFormData {
  nome: string;
  descricao: string;
  categoria: string;
  unidadeMedida: 'kg' | 'g' | 'l' | 'ml' | 'un' | 'cx' | 'pct' | 'dz';
  codigoBarras: string;
  fornecedorPadrao: string;
  precoMedioCompra: string;
  controleEstoque: boolean;
  estoqueMinimo: string;
  localizacao: string;
  observacoes: string;
}

export default function ItensBasePage() {
  const { user } = useAuthUser();
  const { get, post, patch } = useTenantApi();
  
  const [itens, setItens] = useState<ItemBase[]>([]);
  const [fornecedores, setFornecedores] = useState<Fornecedor[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<ItemBase | null>(null);
  const [categoriaFilter, setCategoriaFilter] = useState<string>('all');
  const [categorias, setCategorias] = useState<string[]>([]);
  
  const [formData, setFormData] = useState<ItemBaseFormData>({
    nome: '',
    descricao: '',
    categoria: '',
    unidadeMedida: 'kg',
    codigoBarras: '',
    fornecedorPadrao: '',
    precoMedioCompra: '',
    controleEstoque: false,
    estoqueMinimo: '',
    localizacao: '',
    observacoes: ''
  });

  const unidadesMedida = [
    { value: 'kg', label: 'Quilogramas (kg)' },
    { value: 'g', label: 'Gramas (g)' },
    { value: 'l', label: 'Litros (l)' },
    { value: 'ml', label: 'Mililitros (ml)' },
    { value: 'un', label: 'Unidades (un)' },
    { value: 'cx', label: 'Caixas (cx)' },
    { value: 'pct', label: 'Pacotes (pct)' },
    { value: 'dz', label: 'Dúzias (dz)' }
  ];

  const categoriasComuns = [
    'Carnes',
    'Aves',
    'Peixes e Frutos do Mar',
    'Vegetais',
    'Frutas',
    'Grãos e Cereais',
    'Laticínios',
    'Pães e Massas',
    'Temperos e Condimentos',
    'Bebidas',
    'Doces e Sobremesas',
    'Óleos e Gorduras',
    'Embalagens',
    'Limpeza',
    'Outros'
  ];

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    const categoriasUnicas = [...new Set(itens.map(item => item.categoria).filter(Boolean))];
    setCategorias(categoriasUnicas);
  }, [itens]);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Carregar fornecedores
      const fornecedoresResponse = await get('/api/fornecedores');
      if (fornecedoresResponse.ok) {
        const fornecedoresData = await fornecedoresResponse.json();
        setFornecedores(fornecedoresData || []);
      }

      // Carregar itens base
      const params = categoriaFilter !== 'all' ? `?categoria=${encodeURIComponent(categoriaFilter)}` : '';
      const itensResponse = await get(`/api/itens-base${params}`);
      if (itensResponse.ok) {
        const itensData = await itensResponse.json();
        setItens(itensData || []);
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (categoriaFilter !== 'all') {
      loadData();
    }
  }, [categoriaFilter]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const payload = {
        ...formData,
        precoMedioCompra: formData.precoMedioCompra ? parseFloat(formData.precoMedioCompra) : undefined,
        estoqueMinimo: formData.estoqueMinimo ? parseInt(formData.estoqueMinimo) : undefined,
        fornecedorPadrao: formData.fornecedorPadrao || undefined
      };

      let response;
      if (editingItem) {
        response = await patch(`/api/itens-base/${editingItem._id}`, payload);
      } else {
        response = await post('/api/itens-base', payload);
      }

      if (response.ok) {
        await loadData();
        resetForm();
        alert('Item salvo com sucesso!');
      } else {
        const error = await response.json();
        alert(error.message || 'Erro ao salvar item');
      }
    } catch (error) {
      console.error('Erro ao salvar item:', error);
      alert('Erro ao salvar item');
    }
  };

  const resetForm = () => {
    setFormData({
      nome: '',
      descricao: '',
      categoria: '',
      unidadeMedida: 'kg',
      codigoBarras: '',
      fornecedorPadrao: '',
      precoMedioCompra: '',
      controleEstoque: false,
      estoqueMinimo: '',
      localizacao: '',
      observacoes: ''
    });
    setEditingItem(null);
    setShowForm(false);
  };

  const editItem = (item: ItemBase) => {
    setFormData({
      nome: item.nome,
      descricao: item.descricao || '',
      categoria: item.categoria,
      unidadeMedida: item.unidadeMedida,
      codigoBarras: item.codigoBarras || '',
      fornecedorPadrao: item.fornecedorPadrao?._id || '',
      precoMedioCompra: item.precoMedioCompra?.toString() || '',
      controleEstoque: item.controleEstoque,
      estoqueMinimo: item.estoqueMinimo?.toString() || '',
      localizacao: item.localizacao || '',
      observacoes: item.observacoes || ''
    });
    setEditingItem(item);
    setShowForm(true);
  };

  const getStatusEstoque = (item: ItemBase) => {
    if (!item.controleEstoque) {
      return <span className="badge bg-secondary">Sem controle</span>;
    }
    
    if (item.estoqueMinimo && item.estoqueAtual <= item.estoqueMinimo) {
      return <span className="badge bg-danger">Estoque baixo</span>;
    }
    
    if (item.estoqueAtual === 0) {
      return <span className="badge bg-warning text-dark">Em falta</span>;
    }
    
    return <span className="badge bg-success">Disponível</span>;
  };

  const formatUnidade = (unidade: string) => {
    const unidadeObj = unidadesMedida.find(u => u.value === unidade);
    return unidadeObj?.label || unidade;
  };

  if (loading) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Carregando itens...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <ProtectedContent permission="manage_itens_base">
      <div className="min-vh-100" style={{ background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}>
        <div className="container-fluid py-4">
          {/* Header */}
          <div className="row mb-4">
            <div className="col">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h1 className="h3 mb-1">
                    <i className="bi bi-box-seam me-2"></i>
                    Itens Base
                  </h1>
                  <p className="text-muted mb-0">Gerencie itens que podem ser comprados de fornecedores</p>
                </div>
                <button 
                  className="btn btn-success"
                  onClick={() => setShowForm(!showForm)}
                >
                  <i className="bi bi-plus-circle me-2"></i>
                  {showForm ? 'Cancelar' : 'Novo Item'}
                </button>
              </div>
            </div>
          </div>

          {/* Filtros */}
          <div className="row mb-4">
            <div className="col-md-6">
              <select 
                className="form-select"
                value={categoriaFilter}
                onChange={(e) => setCategoriaFilter(e.target.value)}
              >
                <option value="all">Todas as categorias</option>
                {categorias.map(categoria => (
                  <option key={categoria} value={categoria}>{categoria}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Formulário */}
          {showForm && (
            <div className="row mb-4">
              <div className="col-12">
                <div className="card">
                  <div className="card-header">
                    <h5 className="card-title mb-0">
                      {editingItem ? 'Editar Item' : 'Novo Item Base'}
                    </h5>
                  </div>
                  <div className="card-body">
                    <form onSubmit={handleSubmit}>
                      {/* Informações Básicas */}
                      <div className="row">
                        <div className="col-md-6 mb-3">
                          <label className="form-label">Nome do Item *</label>
                          <input
                            type="text"
                            className="form-control"
                            value={formData.nome}
                            onChange={(e) => setFormData({...formData, nome: e.target.value})}
                            required
                          />
                        </div>
                        <div className="col-md-6 mb-3">
                          <label className="form-label">Categoria *</label>
                          <div className="d-flex">
                            <select
                              className="form-select me-2"
                              value={formData.categoria}
                              onChange={(e) => setFormData({...formData, categoria: e.target.value})}
                              required
                            >
                              <option value="">Selecione ou digite nova</option>
                              {categoriasComuns.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                              ))}
                            </select>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Nova categoria"
                              value={formData.categoria}
                              onChange={(e) => setFormData({...formData, categoria: e.target.value})}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="row">
                        <div className="col-12 mb-3">
                          <label className="form-label">Descrição</label>
                          <textarea
                            className="form-control"
                            rows={2}
                            value={formData.descricao}
                            onChange={(e) => setFormData({...formData, descricao: e.target.value})}
                            placeholder="Descrição detalhada do item..."
                          />
                        </div>
                      </div>

                      <div className="row">
                        <div className="col-md-4 mb-3">
                          <label className="form-label">Unidade de Medida *</label>
                          <select
                            className="form-select"
                            value={formData.unidadeMedida}
                            onChange={(e) => setFormData({...formData, unidadeMedida: e.target.value as any})}
                            required
                          >
                            {unidadesMedida.map(unidade => (
                              <option key={unidade.value} value={unidade.value}>
                                {unidade.label}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="col-md-4 mb-3">
                          <label className="form-label">Código de Barras</label>
                          <input
                            type="text"
                            className="form-control"
                            value={formData.codigoBarras}
                            onChange={(e) => setFormData({...formData, codigoBarras: e.target.value})}
                          />
                        </div>
                        <div className="col-md-4 mb-3">
                          <label className="form-label">Localização</label>
                          <input
                            type="text"
                            className="form-control"
                            value={formData.localizacao}
                            onChange={(e) => setFormData({...formData, localizacao: e.target.value})}
                            placeholder="Ex: Geladeira, Freezer, Estoque"
                          />
                        </div>
                      </div>

                      {/* Fornecedor e Preço */}
                      <div className="row">
                        <div className="col-md-6 mb-3">
                          <label className="form-label">Fornecedor Padrão</label>
                          <select
                            className="form-select"
                            value={formData.fornecedorPadrao}
                            onChange={(e) => setFormData({...formData, fornecedorPadrao: e.target.value})}
                          >
                            <option value="">Selecione um fornecedor</option>
                            {fornecedores.map(fornecedor => (
                              <option key={fornecedor._id} value={fornecedor._id}>
                                {fornecedor.nome} 
                                <span className="text-muted">
                                  ({fornecedor.tipo === 'nota_branca' ? 'Nota Branca' : 'Nota Fiscal'})
                                </span>
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="col-md-6 mb-3">
                          <label className="form-label">Preço Médio de Compra</label>
                          <div className="input-group">
                            <span className="input-group-text">R$</span>
                            <input
                              type="number"
                              step="0.01"
                              className="form-control"
                              value={formData.precoMedioCompra}
                              onChange={(e) => setFormData({...formData, precoMedioCompra: e.target.value})}
                              placeholder="0,00"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Controle de Estoque */}
                      <div className="row">
                        <div className="col-12 mb-3">
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              id="controleEstoque"
                              checked={formData.controleEstoque}
                              onChange={(e) => setFormData({...formData, controleEstoque: e.target.checked})}
                            />
                            <label className="form-check-label" htmlFor="controleEstoque">
                              Controlar estoque deste item
                            </label>
                          </div>
                        </div>
                      </div>

                      {formData.controleEstoque && (
                        <div className="row">
                          <div className="col-md-6 mb-3">
                            <label className="form-label">Estoque Mínimo</label>
                            <input
                              type="number"
                              className="form-control"
                              value={formData.estoqueMinimo}
                              onChange={(e) => setFormData({...formData, estoqueMinimo: e.target.value})}
                              placeholder="Quantidade mínima para alerta"
                            />
                          </div>
                        </div>
                      )}

                      <div className="row">
                        <div className="col-12 mb-3">
                          <label className="form-label">Observações</label>
                          <textarea
                            className="form-control"
                            rows={3}
                            value={formData.observacoes}
                            onChange={(e) => setFormData({...formData, observacoes: e.target.value})}
                            placeholder="Observações sobre o item..."
                          />
                        </div>
                      </div>
                      
                      <div className="d-flex gap-2 mt-4">
                        <button
                          type="submit"
                          className="btn btn-success"
                          disabled={!formData.nome || !formData.categoria}
                        >
                          <i className="bi bi-save me-2"></i>
                          {editingItem ? 'Atualizar' : 'Salvar'} Item
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

          {/* Lista de Itens */}
          <div className="row">
            <div className="col-12">
              <div className="card">
                <div className="card-header">
                  <h5 className="card-title mb-0">
                    Itens Base ({itens.length})
                  </h5>
                </div>
                <div className="card-body">
                  {itens.length === 0 ? (
                    <div className="text-center py-4">
                      <i className="bi bi-box-seam fs-1 text-muted mb-3"></i>
                      <p className="text-muted">Nenhum item base cadastrado ainda.</p>
                      <button 
                        className="btn btn-success"
                        onClick={() => setShowForm(true)}
                      >
                        Cadastrar Primeiro Item
                      </button>
                    </div>
                  ) : (
                    <div className="table-responsive">
                      <table className="table table-hover">
                        <thead>
                          <tr>
                            <th>Item</th>
                            <th>Categoria</th>
                            <th>Unidade</th>
                            <th>Estoque</th>
                            <th>Fornecedor</th>
                            <th>Preço Médio</th>
                            <th>Ações</th>
                          </tr>
                        </thead>
                        <tbody>
                          {itens.map(item => (
                            <tr key={item._id}>
                              <td>
                                <div>
                                  <div className="fw-bold">{item.nome}</div>
                                  {item.descricao && (
                                    <small className="text-muted">
                                      {item.descricao.length > 50 
                                        ? item.descricao.substring(0, 50) + '...' 
                                        : item.descricao}
                                    </small>
                                  )}
                                  {item.codigoBarras && (
                                    <small className="text-muted d-block">
                                      <i className="bi bi-upc-scan"></i> {item.codigoBarras}
                                    </small>
                                  )}
                                </div>
                              </td>
                              <td>
                                <span className="badge bg-light text-dark">{item.categoria}</span>
                              </td>
                              <td>{formatUnidade(item.unidadeMedida)}</td>
                              <td>
                                <div>
                                  {getStatusEstoque(item)}
                                  {item.controleEstoque && (
                                    <div className="small text-muted">
                                      Atual: {item.estoqueAtual} {item.unidadeMedida}
                                      {item.estoqueMinimo && (
                                        <span> | Mín: {item.estoqueMinimo}</span>
                                      )}
                                    </div>
                                  )}
                                </div>
                              </td>
                              <td>
                                {item.fornecedorPadrao ? (
                                  <div className="small">
                                    <div>{item.fornecedorPadrao.nome}</div>
                                    <span className={`badge badge-sm ${
                                      item.fornecedorPadrao.tipo === 'nota_branca' 
                                        ? 'bg-warning text-dark' 
                                        : 'bg-success'
                                    }`}>
                                      {item.fornecedorPadrao.tipo === 'nota_branca' 
                                        ? 'Nota Branca' 
                                        : 'Nota Fiscal'}
                                    </span>
                                  </div>
                                ) : (
                                  <span className="text-muted">-</span>
                                )}
                              </td>
                              <td>
                                {item.precoMedioCompra 
                                  ? `R$ ${item.precoMedioCompra.toFixed(2)}`
                                  : '-'}
                              </td>
                              <td>
                                <div className="btn-group btn-group-sm">
                                  <button
                                    className="btn btn-outline-primary"
                                    onClick={() => editItem(item)}
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