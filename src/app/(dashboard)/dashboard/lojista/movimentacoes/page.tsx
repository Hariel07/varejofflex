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
  unidadeMedida: string;
  categoria: string;
}

interface MovimentacaoItem {
  item: ItemBase;
  quantidade: number;
  valorUnitario?: number;
  valorTotal?: number;
  observacoes?: string;
}

interface Movimentacao {
  _id: string;
  tipo: 'entrada' | 'saida';
  dataMovimentacao: string;
  fornecedor?: Fornecedor;
  itens: MovimentacaoItem[];
  valorTotal?: number;
  tipoDocumento?: 'nota_branca' | 'nota_fiscal';
  numeroDocumento?: string;
  observacoes?: string;
  createdAt: string;
}

export default function MovimentacoesPage() {
  const { user } = useAuthUser();
  const { get, post } = useTenantApi();
  
  const [movimentacoes, setMovimentacoes] = useState<Movimentacao[]>([]);
  const [fornecedores, setFornecedores] = useState<Fornecedor[]>([]);
  const [itensBase, setItensBase] = useState<ItemBase[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [tipoFilter, setTipoFilter] = useState<'all' | 'entrada' | 'saida'>('all');

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (tipoFilter !== 'all') {
      loadMovimentacoes();
    }
  }, [tipoFilter]);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Carregar dados em paralelo
      const [movimentacoesRes, fornecedoresRes, itensRes] = await Promise.all([
        get('/api/movimentacoes'),
        get('/api/fornecedores'),
        get('/api/itens-base')
      ]);

      if (movimentacoesRes.ok) {
        const data = await movimentacoesRes.json();
        setMovimentacoes(data || []);
      }

      if (fornecedoresRes.ok) {
        const data = await fornecedoresRes.json();
        setFornecedores(data || []);
      }

      if (itensRes.ok) {
        const data = await itensRes.json();
        setItensBase(data || []);
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMovimentacoes = async () => {
    try {
      const params = tipoFilter !== 'all' ? `?tipo=${tipoFilter}` : '';
      const response = await get(`/api/movimentacoes${params}`);
      if (response.ok) {
        const data = await response.json();
        setMovimentacoes(data || []);
      }
    } catch (error) {
      console.error('Erro ao carregar movimentações:', error);
    }
  };

  const getTipoBadge = (tipo: string) => {
    return tipo === 'entrada' 
      ? <span className="badge bg-success">Entrada</span>
      : <span className="badge bg-danger">Saída</span>;
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('pt-BR');
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  if (loading) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Carregando movimentações...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <ProtectedContent permission="manage_movimentacoes">
      <div className="min-vh-100" style={{ background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}>
        <div className="container-fluid py-4">
          {/* Header */}
          <div className="row mb-4">
            <div className="col">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h1 className="h3 mb-1">
                    <i className="bi bi-arrow-left-right me-2"></i>
                    Movimentações de Estoque
                  </h1>
                  <p className="text-muted mb-0">Controle entradas e saídas de estoque</p>
                </div>
                <button 
                  className="btn btn-success"
                  onClick={() => setShowForm(!showForm)}
                >
                  <i className="bi bi-plus-circle me-2"></i>
                  {showForm ? 'Cancelar' : 'Nova Movimentação'}
                </button>
              </div>
            </div>
          </div>

          {/* Resumo */}
          <div className="row mb-4">
            <div className="col-md-3">
              <div className="card border-0 shadow-sm">
                <div className="card-body">
                  <div className="d-flex align-items-center">
                    <div className="flex-shrink-0">
                      <i className="bi bi-arrow-down-circle-fill text-success fs-2"></i>
                    </div>
                    <div className="flex-grow-1 ms-3">
                      <div className="fw-bold fs-4">
                        {movimentacoes.filter(m => m.tipo === 'entrada').length}
                      </div>
                      <div className="text-muted small">Entradas</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card border-0 shadow-sm">
                <div className="card-body">
                  <div className="d-flex align-items-center">
                    <div className="flex-shrink-0">
                      <i className="bi bi-arrow-up-circle-fill text-danger fs-2"></i>
                    </div>
                    <div className="flex-grow-1 ms-3">
                      <div className="fw-bold fs-4">
                        {movimentacoes.filter(m => m.tipo === 'saida').length}
                      </div>
                      <div className="text-muted small">Saídas</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card border-0 shadow-sm">
                <div className="card-body">
                  <div className="d-flex align-items-center">
                    <div className="flex-shrink-0">
                      <i className="bi bi-truck text-primary fs-2"></i>
                    </div>
                    <div className="flex-grow-1 ms-3">
                      <div className="fw-bold fs-4">{fornecedores.length}</div>
                      <div className="text-muted small">Fornecedores</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card border-0 shadow-sm">
                <div className="card-body">
                  <div className="d-flex align-items-center">
                    <div className="flex-shrink-0">
                      <i className="bi bi-box-seam text-warning fs-2"></i>
                    </div>
                    <div className="flex-grow-1 ms-3">
                      <div className="fw-bold fs-4">{itensBase.length}</div>
                      <div className="text-muted small">Itens Base</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Filtros */}
          <div className="row mb-4">
            <div className="col-md-6">
              <div className="d-flex gap-2">
                <button 
                  className={`btn btn-sm ${tipoFilter === 'all' ? 'btn-primary' : 'btn-outline-primary'}`}
                  onClick={() => setTipoFilter('all')}
                >
                  Todas
                </button>
                <button 
                  className={`btn btn-sm ${tipoFilter === 'entrada' ? 'btn-success' : 'btn-outline-success'}`}
                  onClick={() => setTipoFilter('entrada')}
                >
                  Entradas
                </button>
                <button 
                  className={`btn btn-sm ${tipoFilter === 'saida' ? 'btn-danger' : 'btn-outline-danger'}`}
                  onClick={() => setTipoFilter('saida')}
                >
                  Saídas
                </button>
              </div>
            </div>
          </div>

          {/* Lista de Movimentações */}
          <div className="row">
            <div className="col-12">
              <div className="card">
                <div className="card-header">
                  <h5 className="card-title mb-0">
                    Movimentações ({movimentacoes.length})
                  </h5>
                </div>
                <div className="card-body">
                  {movimentacoes.length === 0 ? (
                    <div className="text-center py-5">
                      <i className="bi bi-arrow-left-right fs-1 text-muted mb-3"></i>
                      <h5 className="text-muted mb-3">Nenhuma movimentação registrada</h5>
                      <p className="text-muted mb-4">
                        Para começar a controlar seu estoque, você precisa:
                      </p>
                      <div className="row justify-content-center">
                        <div className="col-md-8">
                          <div className="row text-start">
                            <div className="col-md-6 mb-3">
                              <div className="card border-0 bg-light">
                                <div className="card-body py-3">
                                  <div className="d-flex">
                                    <i className="bi bi-truck text-primary me-3 fs-4"></i>
                                    <div>
                                      <h6 className="mb-1">1. Cadastrar Fornecedores</h6>
                                      <small className="text-muted">
                                        Registre seus fornecedores de matéria-prima
                                      </small>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-6 mb-3">
                              <div className="card border-0 bg-light">
                                <div className="card-body py-3">
                                  <div className="d-flex">
                                    <i className="bi bi-box-seam text-warning me-3 fs-4"></i>
                                    <div>
                                      <h6 className="mb-1">2. Cadastrar Itens Base</h6>
                                      <small className="text-muted">
                                        Defina os produtos que você compra
                                      </small>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-6 mb-3">
                              <div className="card border-0 bg-light">
                                <div className="card-body py-3">
                                  <div className="d-flex">
                                    <i className="bi bi-arrow-down-circle text-success me-3 fs-4"></i>
                                    <div>
                                      <h6 className="mb-1">3. Registrar Entradas</h6>
                                      <small className="text-muted">
                                        Registre compras de matéria-prima
                                      </small>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-6 mb-3">
                              <div className="card border-0 bg-light">
                                <div className="card-body py-3">
                                  <div className="d-flex">
                                    <i className="bi bi-arrow-up-circle text-danger me-3 fs-4"></i>
                                    <div>
                                      <h6 className="mb-1">4. Controlar Saídas</h6>
                                      <small className="text-muted">
                                        Registre consumo na produção
                                      </small>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="mt-4">
                        <button 
                          className="btn btn-success me-3"
                          onClick={() => window.location.href = '/dashboard/lojista/fornecedores'}
                        >
                          <i className="bi bi-truck me-2"></i>
                          Cadastrar Fornecedores
                        </button>
                        <button 
                          className="btn btn-warning"
                          onClick={() => window.location.href = '/dashboard/lojista/itens-base'}
                        >
                          <i className="bi bi-box-seam me-2"></i>
                          Cadastrar Itens Base
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="table-responsive">
                      <table className="table table-hover">
                        <thead>
                          <tr>
                            <th>Data</th>
                            <th>Tipo</th>
                            <th>Fornecedor</th>
                            <th>Itens</th>
                            <th>Valor Total</th>
                            <th>Documento</th>
                          </tr>
                        </thead>
                        <tbody>
                          {movimentacoes.map(mov => (
                            <tr key={mov._id}>
                              <td>
                                <div>
                                  <div className="fw-bold">
                                    {formatDate(mov.dataMovimentacao)}
                                  </div>
                                  <small className="text-muted">
                                    {formatDate(mov.createdAt)}
                                  </small>
                                </div>
                              </td>
                              <td>{getTipoBadge(mov.tipo)}</td>
                              <td>
                                {mov.fornecedor ? (
                                  <div>
                                    <div>{mov.fornecedor.nome}</div>
                                    <span className={`badge badge-sm ${
                                      mov.fornecedor.tipo === 'nota_branca' 
                                        ? 'bg-warning text-dark' 
                                        : 'bg-success'
                                    }`}>
                                      {mov.fornecedor.tipo === 'nota_branca' 
                                        ? 'Nota Branca' 
                                        : 'Nota Fiscal'}
                                    </span>
                                  </div>
                                ) : (
                                  <span className="text-muted">-</span>
                                )}
                              </td>
                              <td>
                                <div>
                                  <div className="fw-bold">
                                    {mov.itens.length} {mov.itens.length === 1 ? 'item' : 'itens'}
                                  </div>
                                  {mov.itens.slice(0, 2).map((item, idx) => (
                                    <small key={idx} className="text-muted d-block">
                                      {item.quantidade} {item.item.unidadeMedida} - {item.item.nome}
                                    </small>
                                  ))}
                                  {mov.itens.length > 2 && (
                                    <small className="text-muted">
                                      +{mov.itens.length - 2} outros
                                    </small>
                                  )}
                                </div>
                              </td>
                              <td>
                                {mov.valorTotal ? formatCurrency(mov.valorTotal) : '-'}
                              </td>
                              <td>
                                {mov.numeroDocumento ? (
                                  <div>
                                    <div className="fw-bold">{mov.numeroDocumento}</div>
                                    <span className={`badge badge-sm ${
                                      mov.tipoDocumento === 'nota_branca' 
                                        ? 'bg-warning text-dark' 
                                        : 'bg-success'
                                    }`}>
                                      {mov.tipoDocumento === 'nota_branca' 
                                        ? 'Nota Branca' 
                                        : 'Nota Fiscal'}
                                    </span>
                                  </div>
                                ) : (
                                  <span className="text-muted">-</span>
                                )}
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