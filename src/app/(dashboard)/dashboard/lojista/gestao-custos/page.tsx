"use client";

import { useState, useEffect } from 'react';
import { useAuthUser, useTenantApi } from '@/hooks/useAuth';
import { ProtectedContent } from '@/components/auth/ProtectedContent';

interface DashboardStats {
  fornecedores: {
    total: number;
    notaBranca: number;
    notaFiscal: number;
  };
  itensBase: {
    total: number;
    comControleEstoque: number;
    semEstoque: number;
    estoqueMinimo: number;
  };
  movimentacoes: {
    total: number;
    entradas: number;
    saidas: number;
    valorTotalEntradas: number;
  };
  secoes: {
    total: number;
  };
  ingredientes: {
    total: number;
  };
  receitas: {
    total: number;
  };
}

export default function GestaoCustosPage() {
  const { user } = useAuthUser();
  const { get } = useTenantApi();
  
  const [stats, setStats] = useState<DashboardStats>({
    fornecedores: { total: 0, notaBranca: 0, notaFiscal: 0 },
    itensBase: { total: 0, comControleEstoque: 0, semEstoque: 0, estoqueMinimo: 0 },
    movimentacoes: { total: 0, entradas: 0, saidas: 0, valorTotalEntradas: 0 },
    secoes: { total: 0 },
    ingredientes: { total: 0 },
    receitas: { total: 0 }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);

      // Carregar dados de todas as APIs
      const [
        fornecedoresRes,
        itensBaseRes,
        movimentacoesRes,
        secoesRes,
        ingredientesRes,
        receitasRes
      ] = await Promise.all([
        get('/api/fornecedores'),
        get('/api/itens-base'),
        get('/api/movimentacoes'),
        get('/api/secoes'),
        get('/api/ingredientes-secao'),
        get('/api/receitas-intermediarias')
      ]);

      const newStats: DashboardStats = {
        fornecedores: { total: 0, notaBranca: 0, notaFiscal: 0 },
        itensBase: { total: 0, comControleEstoque: 0, semEstoque: 0, estoqueMinimo: 0 },
        movimentacoes: { total: 0, entradas: 0, saidas: 0, valorTotalEntradas: 0 },
        secoes: { total: 0 },
        ingredientes: { total: 0 },
        receitas: { total: 0 }
      };

      // Processar fornecedores
      if (fornecedoresRes.ok) {
        const fornecedores = await fornecedoresRes.json();
        newStats.fornecedores.total = fornecedores.length;
        newStats.fornecedores.notaBranca = fornecedores.filter((f: any) => f.tipo === 'nota_branca').length;
        newStats.fornecedores.notaFiscal = fornecedores.filter((f: any) => f.tipo === 'nota_fiscal').length;
      }

      // Processar itens base
      if (itensBaseRes.ok) {
        const itens = await itensBaseRes.json();
        newStats.itensBase.total = itens.length;
        newStats.itensBase.comControleEstoque = itens.filter((i: any) => i.controleEstoque).length;
        newStats.itensBase.semEstoque = itens.filter((i: any) => i.controleEstoque && i.estoqueAtual === 0).length;
        newStats.itensBase.estoqueMinimo = itens.filter((i: any) => 
          i.controleEstoque && i.estoqueMinimo && i.estoqueAtual <= i.estoqueMinimo
        ).length;
      }

      // Processar movimentações
      if (movimentacoesRes.ok) {
        const movimentacoes = await movimentacoesRes.json();
        newStats.movimentacoes.total = movimentacoes.length;
        newStats.movimentacoes.entradas = movimentacoes.filter((m: any) => m.tipo === 'entrada').length;
        newStats.movimentacoes.saidas = movimentacoes.filter((m: any) => m.tipo === 'saida').length;
        newStats.movimentacoes.valorTotalEntradas = movimentacoes
          .filter((m: any) => m.tipo === 'entrada' && m.valorTotal)
          .reduce((total: number, m: any) => total + m.valorTotal, 0);
      }

      // Processar seções
      if (secoesRes.ok) {
        const secoes = await secoesRes.json();
        newStats.secoes.total = secoes.length;
      }

      // Processar ingredientes
      if (ingredientesRes.ok) {
        const ingredientes = await ingredientesRes.json();
        newStats.ingredientes.total = ingredientes.length;
      }

      // Processar receitas
      if (receitasRes.ok) {
        const receitas = await receitasRes.json();
        newStats.receitas.total = receitas.length;
      }

      setStats(newStats);
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    } finally {
      setLoading(false);
    }
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
            <span className="visually-hidden">Carregando dados...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <ProtectedContent permission="manage_fornecedores">
      <div className="min-vh-100" style={{ background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}>
        <div className="container-fluid py-4">
          {/* Header */}
          <div className="row mb-4">
            <div className="col">
              <h1 className="h3 mb-1">
                <i className="bi bi-graph-up-arrow me-2"></i>
                Gestão de Custos - Visão Geral
              </h1>
              <p className="text-muted mb-0">
                Sistema completo de controle de custos: da matéria-prima ao produto final
              </p>
            </div>
          </div>

          {/* Fluxo do Sistema */}
          <div className="row mb-4">
            <div className="col-12">
              <div className="card border-0 shadow-sm">
                <div className="card-header bg-primary text-white">
                  <h5 className="card-title mb-0">
                    <i className="bi bi-diagram-3 me-2"></i>
                    Fluxo de Gestão de Custos
                  </h5>
                </div>
                <div className="card-body">
                  <div className="row text-center">
                    <div className="col-md-2">
                      <div className="d-flex flex-column align-items-center">
                        <div className="bg-primary rounded-circle p-3 mb-2">
                          <i className="bi bi-truck fs-3 text-white"></i>
                        </div>
                        <h6 className="fw-bold">Fornecedores</h6>
                        <small className="text-muted">Cadastro de fornecedores</small>
                      </div>
                    </div>
                    <div className="col-md-1 d-flex align-items-center justify-content-center">
                      <i className="bi bi-arrow-right fs-3 text-muted"></i>
                    </div>
                    <div className="col-md-2">
                      <div className="d-flex flex-column align-items-center">
                        <div className="bg-warning rounded-circle p-3 mb-2">
                          <i className="bi bi-box-seam fs-3 text-white"></i>
                        </div>
                        <h6 className="fw-bold">Itens Base</h6>
                        <small className="text-muted">Matérias-primas</small>
                      </div>
                    </div>
                    <div className="col-md-1 d-flex align-items-center justify-content-center">
                      <i className="bi bi-arrow-right fs-3 text-muted"></i>
                    </div>
                    <div className="col-md-2">
                      <div className="d-flex flex-column align-items-center">
                        <div className="bg-success rounded-circle p-3 mb-2">
                          <i className="bi bi-arrow-left-right fs-3 text-white"></i>
                        </div>
                        <h6 className="fw-bold">Movimentações</h6>
                        <small className="text-muted">Entrada/Saída estoque</small>
                      </div>
                    </div>
                    <div className="col-md-1 d-flex align-items-center justify-content-center">
                      <i className="bi bi-arrow-right fs-3 text-muted"></i>
                    </div>
                    <div className="col-md-2">
                      <div className="d-flex flex-column align-items-center">
                        <div className="bg-info rounded-circle p-3 mb-2">
                          <i className="bi bi-collection fs-3 text-white"></i>
                        </div>
                        <h6 className="fw-bold">Seções</h6>
                        <small className="text-muted">Organização produtos</small>
                      </div>
                    </div>
                    <div className="col-md-1 d-flex align-items-center justify-content-center">
                      <i className="bi bi-arrow-right fs-3 text-muted"></i>
                    </div>
                  </div>
                  <div className="row text-center mt-4">
                    <div className="col-md-4">
                      <div className="d-flex flex-column align-items-center">
                        <div className="bg-secondary rounded-circle p-3 mb-2">
                          <i className="bi bi-egg-fried fs-3 text-white"></i>
                        </div>
                        <h6 className="fw-bold">Ingredientes</h6>
                        <small className="text-muted">Itens por seção</small>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="d-flex flex-column align-items-center">
                        <div className="bg-dark rounded-circle p-3 mb-2">
                          <i className="bi bi-journal-text fs-3 text-white"></i>
                        </div>
                        <h6 className="fw-bold">Receitas</h6>
                        <small className="text-muted">Receitas intermediárias</small>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="d-flex flex-column align-items-center">
                        <div className="bg-danger rounded-circle p-3 mb-2">
                          <i className="bi bi-basket fs-3 text-white"></i>
                        </div>
                        <h6 className="fw-bold">Produtos Finais</h6>
                        <small className="text-muted">Produtos para venda</small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Estatísticas Principais */}
          <div className="row mb-4">
            <div className="col-md-3">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body">
                  <div className="d-flex align-items-center mb-3">
                    <div className="flex-shrink-0">
                      <i className="bi bi-truck text-primary fs-2"></i>
                    </div>
                    <div className="flex-grow-1 ms-3">
                      <div className="fw-bold fs-3">{stats.fornecedores.total}</div>
                      <div className="text-muted">Fornecedores</div>
                    </div>
                  </div>
                  <div className="d-flex justify-content-between text-sm">
                    <span className="badge bg-warning text-dark">
                      {stats.fornecedores.notaBranca} Nota Branca
                    </span>
                    <span className="badge bg-success">
                      {stats.fornecedores.notaFiscal} Nota Fiscal
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body">
                  <div className="d-flex align-items-center mb-3">
                    <div className="flex-shrink-0">
                      <i className="bi bi-box-seam text-warning fs-2"></i>
                    </div>
                    <div className="flex-grow-1 ms-3">
                      <div className="fw-bold fs-3">{stats.itensBase.total}</div>
                      <div className="text-muted">Itens Base</div>
                    </div>
                  </div>
                  <div className="row g-2">
                    <div className="col-6">
                      <div className="text-center">
                        <div className="fw-bold text-success">{stats.itensBase.comControleEstoque}</div>
                        <small className="text-muted">Com controle</small>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="text-center">
                        <div className="fw-bold text-danger">{stats.itensBase.estoqueMinimo}</div>
                        <small className="text-muted">Estoque baixo</small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body">
                  <div className="d-flex align-items-center mb-3">
                    <div className="flex-shrink-0">
                      <i className="bi bi-arrow-left-right text-success fs-2"></i>
                    </div>
                    <div className="flex-grow-1 ms-3">
                      <div className="fw-bold fs-3">{stats.movimentacoes.total}</div>
                      <div className="text-muted">Movimentações</div>
                    </div>
                  </div>
                  <div className="row g-2">
                    <div className="col-6">
                      <div className="text-center">
                        <div className="fw-bold text-success">{stats.movimentacoes.entradas}</div>
                        <small className="text-muted">Entradas</small>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="text-center">
                        <div className="fw-bold text-danger">{stats.movimentacoes.saidas}</div>
                        <small className="text-muted">Saídas</small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body">
                  <div className="d-flex align-items-center mb-3">
                    <div className="flex-shrink-0">
                      <i className="bi bi-currency-dollar text-info fs-2"></i>
                    </div>
                    <div className="flex-grow-1 ms-3">
                      <div className="fw-bold fs-5">
                        {formatCurrency(stats.movimentacoes.valorTotalEntradas)}
                      </div>
                      <div className="text-muted">Valor Investido</div>
                    </div>
                  </div>
                  <div className="text-center">
                    <small className="text-muted">Total em compras registradas</small>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sistema de Produção */}
          <div className="row mb-4">
            <div className="col-md-4">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body text-center">
                  <i className="bi bi-collection text-info fs-1 mb-3"></i>
                  <h5 className="fw-bold">{stats.secoes.total}</h5>
                  <p className="text-muted mb-0">Seções de Produtos</p>
                  <small className="text-muted">Ex: Hambúrgueres, Pizzas, Bebidas</small>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body text-center">
                  <i className="bi bi-egg-fried text-secondary fs-1 mb-3"></i>
                  <h5 className="fw-bold">{stats.ingredientes.total}</h5>
                  <p className="text-muted mb-0">Ingredientes Organizados</p>
                  <small className="text-muted">Itens base organizados por seção</small>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body text-center">
                  <i className="bi bi-journal-text text-dark fs-1 mb-3"></i>
                  <h5 className="fw-bold">{stats.receitas.total}</h5>
                  <p className="text-muted mb-0">Receitas Intermediárias</p>
                  <small className="text-muted">Preparos que usam ingredientes</small>
                </div>
              </div>
            </div>
          </div>

          {/* Ações Rápidas */}
          <div className="row">
            <div className="col-12">
              <div className="card border-0 shadow-sm">
                <div className="card-header">
                  <h5 className="card-title mb-0">
                    <i className="bi bi-lightning me-2"></i>
                    Ações Rápidas
                  </h5>
                </div>
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-3 mb-3">
                      <button 
                        className="btn btn-primary w-100 h-100"
                        onClick={() => window.location.href = '/dashboard/lojista/fornecedores'}
                      >
                        <i className="bi bi-truck fs-3 d-block mb-2"></i>
                        <div>Gerenciar Fornecedores</div>
                        <small>Cadastrar e editar fornecedores</small>
                      </button>
                    </div>
                    <div className="col-md-3 mb-3">
                      <button 
                        className="btn btn-warning w-100 h-100"
                        onClick={() => window.location.href = '/dashboard/lojista/itens-base'}
                      >
                        <i className="bi bi-box-seam fs-3 d-block mb-2"></i>
                        <div>Gerenciar Itens Base</div>
                        <small>Matérias-primas e insumos</small>
                      </button>
                    </div>
                    <div className="col-md-3 mb-3">
                      <button 
                        className="btn btn-success w-100 h-100"
                        onClick={() => window.location.href = '/dashboard/lojista/movimentacoes'}
                      >
                        <i className="bi bi-arrow-left-right fs-3 d-block mb-2"></i>
                        <div>Controlar Estoque</div>
                        <small>Entradas e saídas</small>
                      </button>
                    </div>
                    <div className="col-md-3 mb-3">
                      <button 
                        className="btn btn-info w-100 h-100"
                        onClick={() => alert('Funcionalidade em desenvolvimento')}
                      >
                        <i className="bi bi-graph-up fs-3 d-block mb-2"></i>
                        <div>Análise de Custos</div>
                        <small>Relatórios e análises</small>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedContent>
  );
}