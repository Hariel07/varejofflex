"use client";

import { useAuthUser, usePermissions, useTenantApi, useCompanyAccess } from "@/hooks/useAuth";
import { ProtectedContent, LojistaOnly } from "@/components/auth/ProtectedContent";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import FiscalPrinterWidget from "@/components/dashboard/FiscalPrinterWidget";
import FiscalPrinterConfig from "@/components/dashboard/FiscalPrinterConfig";

// Força renderização do lado do cliente
export const dynamic = 'force-dynamic';

interface CompanyStats {
  totalProducts: number;
  totalOrders: number;
  monthlyRevenue: number;
  pendingOrders: number;
}

const segmentInfo = {
  lanchonete: { name: "Lanchonete", icon: "🍔", color: "success" },
  pizzaria: { name: "Pizzaria", icon: "🍕", color: "danger" },
  moda: { name: "Moda", icon: "👕", color: "primary" },
  mercado: { name: "Mercado", icon: "🛒", color: "warning" },
  petshop: { name: "Pet Shop", icon: "🐕", color: "info" },
  salao: { name: "Salão", icon: "💇", color: "secondary" },
  farmacia: { name: "Farmácia", icon: "💊", color: "success" },
  conveniencia: { name: "Conveniência", icon: "🏪", color: "dark" }
};

function LojistaDashboardContent() {
  const { user } = useAuthUser();
  const { hasPermission } = usePermissions();
  const { getCurrentCompanyId } = useCompanyAccess();
  const { get } = useTenantApi();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [stats, setStats] = useState<CompanyStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [showFiscalConfig, setShowFiscalConfig] = useState(false);

  // Verifica se é um owner acessando administrativamente
  const userIdParam = searchParams.get('userId');
  const isOwnerAccessing = user?.userType === 'owner_saas' && userIdParam;

  // Debug logs
  useEffect(() => {
    console.log('🔍 [LOJISTA DEBUG] userType:', user?.userType);
    console.log('🔍 [LOJISTA DEBUG] userIdParam:', userIdParam);
    console.log('🔍 [LOJISTA DEBUG] isOwnerAccessing:', isOwnerAccessing);
  }, [user?.userType, userIdParam, isOwnerAccessing]);

  const companyId = getCurrentCompanyId();
  const segment = user?.segment || "lanchonete";
  const segmentData = segmentInfo[segment as keyof typeof segmentInfo] || segmentInfo.lanchonete;

  // Estado para armazenar dados do lojista quando owner está acessando
  const [targetLojistaData, setTargetLojistaData] = useState<any>(null);
  const [targetCompanyId, setTargetCompanyId] = useState<string | null>(null);

  // Buscar dados do lojista específico quando owner está acessando
  useEffect(() => {
    if (isOwnerAccessing && userIdParam) {
      const fetchLojistaData = async () => {
        try {
          console.log('🔍 [OWNER ACCESS] Fetching data for userId:', userIdParam);
          const response = await get(`/api/users/${userIdParam}`);
          if (response.ok) {
            const result = await response.json();
            const lojistaData = result.user;
            console.log('🔍 [OWNER ACCESS] Lojista data:', lojistaData);
            setTargetLojistaData(lojistaData);
            setTargetCompanyId(lojistaData.companyId);
          }
        } catch (error) {
          console.error("Error fetching lojista data:", error);
        }
      };
      fetchLojistaData();
    }
  }, [isOwnerAccessing, userIdParam, get]);

  // Usar companyId do lojista alvo quando owner está acessando, senão usar o normal
  const effectiveCompanyId = isOwnerAccessing && targetCompanyId ? targetCompanyId : companyId;
  const effectiveSegment = isOwnerAccessing && targetLojistaData?.segment ? targetLojistaData.segment : segment;
  const effectiveSegmentData = segmentInfo[effectiveSegment as keyof typeof segmentInfo] || segmentInfo.lanchonete;

  useEffect(() => {
    if (hasPermission("manage_products") && effectiveCompanyId) {
      loadCompanyStats();
    } else {
      // Se não há companyId, definir stats vazias e parar loading
      setStats({
        totalProducts: 0,
        totalOrders: 0,
        monthlyRevenue: 0,
        pendingOrders: 0
      });
      setLoading(false);
    }
  }, [hasPermission, effectiveCompanyId]);

  const loadCompanyStats = async () => {
    try {
      const response = await get(`/api/companies/${effectiveCompanyId}/stats`);
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error("Error loading company stats:", error);
    } finally {
      setLoading(false);
    }
  };

  // Verifica acesso: lojista ou owner com userId param  
  if (!isOwnerAccessing && user?.userType !== 'lojista') {
    return (
      <div className="container py-5">
        <div className="alert alert-danger">
          <i className="bi bi-shield-x me-2"></i>
          Acesso negado. Esta área é restrita para lojistas.
        </div>
      </div>
    );
  }

  return (
    <div className="min-vh-100" style={{ background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}>
      
      {/* Botão de retorno para Owner */}
      {isOwnerAccessing && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          zIndex: 1050
        }}>
          <button 
            className="btn btn-dark btn-sm rounded-pill px-4"
            onClick={() => {
              console.log('🔄 [BUTTON CLICK] Navigating to owner dashboard');
              window.location.href = '/dashboard/owner?tab=users';
            }}
            style={{
              boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
              fontWeight: '600'
            }}
          >
            <i className="bi bi-arrow-left me-2"></i>
            Voltar ao Gerenciamento
          </button>
        </div>
      )}
      
      {/* Header Premium */}
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        boxShadow: '0 10px 30px rgba(102, 126, 234, 0.3)'
      }}>
        <div className="container-fluid">
          <div className="row align-items-center py-4">
            <div className="col-md-8">
              <h1 className="h2 mb-1 text-white" style={{ fontWeight: '800' }}>
                <i className="bi bi-shop me-3" style={{ fontSize: '2rem' }}></i>
                Dashboard Lojista 
                {isOwnerAccessing && <span className="badge bg-warning text-dark ms-2">Modo Admin</span>}
              </h1>
              <p className="text-white-50 mb-0" style={{ fontSize: '1.1rem' }}>
                {isOwnerAccessing ? 
                  `Visualizando dashboard de ${targetLojistaData?.name || 'Lojista'} (${targetLojistaData?.email || userIdParam})` : 
                  `Bem-vindo, ${user?.name} • Gestão completa do seu negócio`
                }
              </p>
            </div>
            <div className="col-md-4 text-end">
              <div className={`badge bg-${effectiveSegmentData.color} px-4 py-3 rounded-pill`} style={{ fontSize: '1rem' }}>
                <span className="me-2" style={{ fontSize: '1.2rem' }}>{effectiveSegmentData.icon}</span>
                {effectiveSegmentData.name.toUpperCase()}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container-fluid py-4">
        {/* Header */}
        <div className="row mb-4">
          <div className="col">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h1 className="h3 mb-1">Dashboard Lojista</h1>
                <p className="text-muted mb-0">Bem-vindo, {user?.name}</p>
              </div>
              <div className={`badge bg-${effectiveSegmentData.color} fs-6`}>
                <span className="me-1">{effectiveSegmentData.icon}</span>
                {effectiveSegmentData.name.toUpperCase()}
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Carregando estatísticas...</span>
            </div>
          </div>
        ) : (
          <>
            {/* Stats Cards */}
            <div className="row mb-4">
              <div className="col-md-3 mb-3">
                <div 
                  className="card border-0 h-100"
                  style={{
                    background: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(20px)',
                    borderRadius: '20px',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-8px)';
                    e.currentTarget.style.boxShadow = '0 20px 40px rgba(59, 130, 246, 0.2)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.1)';
                  }}
                >
                  <div className="card-body p-4">
                    <div className="d-flex align-items-start justify-content-between mb-3">
                      <div 
                        className="rounded-circle p-3"
                        style={{
                          background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                          width: '60px',
                          height: '60px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: '0 8px 20px rgba(59, 130, 246, 0.3)'
                        }}
                      >
                        <i className="bi bi-box text-white" style={{ fontSize: '1.4rem' }}></i>
                      </div>
                    </div>
                    <div>
                      <div className="fw-bold text-muted small mb-1">Produtos Cadastrados</div>
                      <div className="h4 mb-1" style={{ fontWeight: '800', color: '#2d3748' }}>
                        {stats?.totalProducts || 0}
                      </div>
                      <div className="small text-muted">
                        Itens no cardápio
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-md-3 mb-3">
                <div 
                  className="card border-0 h-100"
                  style={{
                    background: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(20px)',
                    borderRadius: '20px',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-8px)';
                    e.currentTarget.style.boxShadow = '0 20px 40px rgba(16, 185, 129, 0.2)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.1)';
                  }}
                >
                  <div className="card-body p-4">
                    <div className="d-flex align-items-start justify-content-between mb-3">
                      <div 
                        className="rounded-circle p-3"
                        style={{
                          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                          width: '60px',
                          height: '60px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: '0 8px 20px rgba(16, 185, 129, 0.3)'
                        }}
                      >
                        <i className="bi bi-cart-check text-white" style={{ fontSize: '1.4rem' }}></i>
                      </div>
                    </div>
                    <div>
                      <div className="fw-bold text-muted small mb-1">Total de Pedidos</div>
                      <div className="h4 mb-1" style={{ fontWeight: '800', color: '#2d3748' }}>
                        {stats?.totalOrders || 0}
                      </div>
                      <div className="small text-muted">
                        Pedidos realizados
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-md-3 mb-3">
                <div 
                  className="card border-0 h-100"
                  style={{
                    background: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(20px)',
                    borderRadius: '20px',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-8px)';
                    e.currentTarget.style.boxShadow = '0 20px 40px rgba(251, 146, 60, 0.2)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.1)';
                  }}
                >
                  <div className="card-body p-4">
                    <div className="d-flex align-items-start justify-content-between mb-3">
                      <div 
                        className="rounded-circle p-3"
                        style={{
                          background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                          width: '60px',
                          height: '60px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: '0 8px 20px rgba(245, 158, 11, 0.3)'
                        }}
                      >
                        <i className="bi bi-currency-dollar text-white" style={{ fontSize: '1.4rem' }}></i>
                      </div>
                    </div>
                    <div>
                      <div className="fw-bold text-muted small mb-1">Receita Mensal</div>
                      <div className="h4 mb-1" style={{ fontWeight: '800', color: '#2d3748' }}>
                        R$ {stats?.monthlyRevenue?.toLocaleString() || "0"}
                      </div>
                      <div className="small text-muted">
                        Faturamento do mês
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-md-3 mb-3">
                <div 
                  className="card border-0 h-100"
                  style={{
                    background: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(20px)',
                    borderRadius: '20px',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-8px)';
                    e.currentTarget.style.boxShadow = '0 20px 40px rgba(6, 182, 212, 0.2)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.1)';
                  }}
                >
                  <div className="card-body p-4">
                    <div className="d-flex align-items-start justify-content-between mb-3">
                      <div 
                        className="rounded-circle p-3"
                        style={{
                          background: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
                          width: '60px',
                          height: '60px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: '0 8px 20px rgba(6, 182, 212, 0.3)'
                        }}
                      >
                        <i className="bi bi-clock text-white" style={{ fontSize: '1.4rem' }}></i>
                      </div>
                    </div>
                    <div>
                      <div className="fw-bold text-muted small mb-1">Pedidos Pendentes</div>
                      <div className="h4 mb-1" style={{ fontWeight: '800', color: '#2d3748' }}>
                        {stats?.pendingOrders || 0}
                      </div>
                      <div className="small text-muted">
                        Aguardando atenção
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Fiscal Printer & System Tools */}
            <div className="row mb-4">
              <div className="col-md-4">
                <FiscalPrinterWidget />
              </div>
              
              <div className="col-md-4">
                <div style={{
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(20px)',
                  borderRadius: '16px',
                  padding: '1.5rem',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
                }}>
                  <div className="d-flex align-items-center justify-content-between mb-3">
                    <div className="d-flex align-items-center">
                      <div style={{ fontSize: '1.5rem', marginRight: '0.75rem' }}>⚙️</div>
                      <div>
                        <h6 style={{ margin: 0, fontWeight: '700', color: '#1e293b' }}>
                          Configurações
                        </h6>
                        <small style={{ color: '#64748b' }}>Sistema e impressora</small>
                      </div>
                    </div>
                  </div>
                  
                  <div className="d-grid gap-2">
                    <button 
                      className="btn btn-outline-primary btn-sm"
                      onClick={() => setShowFiscalConfig(!showFiscalConfig)}
                    >
                      <i className="bi bi-printer me-2"></i>
                      {showFiscalConfig ? 'Ocultar' : 'Configurar'} Impressora Fiscal
                    </button>
                    
                    <button className="btn btn-outline-secondary btn-sm">
                      <i className="bi bi-gear me-2"></i>
                      Configurações Gerais
                    </button>
                    
                    <button className="btn btn-outline-info btn-sm">
                      <i className="bi bi-question-circle me-2"></i>
                      Ajuda & Suporte
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="col-md-4">
                <div style={{
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(20px)',
                  borderRadius: '16px',
                  padding: '1.5rem',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
                }}>
                  <div className="d-flex align-items-center mb-3">
                    <div style={{ fontSize: '1.5rem', marginRight: '0.75rem' }}>📊</div>
                    <div>
                      <h6 style={{ margin: 0, fontWeight: '700', color: '#1e293b' }}>
                        Status do Sistema
                      </h6>
                      <small style={{ color: '#64748b' }}>Tudo funcionando</small>
                    </div>
                  </div>
                  
                  <div className="row g-2">
                    <div className="col-6">
                      <div style={{
                        background: 'rgba(16, 185, 129, 0.1)',
                        border: '1px solid #10b981',
                        borderRadius: '8px',
                        padding: '0.5rem',
                        textAlign: 'center'
                      }}>
                        <div style={{ fontSize: '1rem', marginBottom: '0.25rem' }}>🟢</div>
                        <small style={{ fontWeight: '600', color: '#059669' }}>Online</small>
                      </div>
                    </div>
                    <div className="col-6">
                      <div style={{
                        background: 'rgba(59, 130, 246, 0.1)',
                        border: '1px solid #3b82f6',
                        borderRadius: '8px',
                        padding: '0.5rem',
                        textAlign: 'center'
                      }}>
                        <div style={{ fontSize: '1rem', marginBottom: '0.25rem' }}>⚡</div>
                        <small style={{ fontWeight: '600', color: '#2563eb' }}>Rápido</small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Configuração da Impressora Fiscal (Modal/Expansível) */}
            {showFiscalConfig && (
              <div className="row mb-4">
                <div className="col-12">
                  <FiscalPrinterConfig />
                </div>
              </div>
            )}

            {/* Main Content */}
            <div className="row mb-4">
              {/* Quick Actions */}
              <div className="col-md-4">
                <div className="card border-0 shadow-sm">
                  <div className="card-header bg-transparent">
                    <h5 className="card-title mb-0">Ações Rápidas</h5>
                  </div>
                  <div className="card-body">
                    <div className="d-grid gap-3">
                      {/* Seção: Gestão de Produtos */}
                      <div className="border-bottom pb-3 mb-3">
                        <h6 className="text-muted mb-2">📦 GESTÃO DE PRODUTOS</h6>
                        <div className="row g-2">
                          <div className="col-6">
                            <ProtectedContent permission="manage_products">
                              <a 
                                href="/dashboard/lojista/produtos"
                                className="btn btn-primary btn-sm w-100 text-decoration-none"
                              >
                                <i className="bi bi-box me-1"></i>
                                Produtos Finais
                              </a>
                            </ProtectedContent>
                          </div>
                          <div className="col-6">
                            <ProtectedContent permission="manage_secoes">
                              <a 
                                href="/dashboard/lojista/secoes"
                                className="btn btn-outline-primary btn-sm w-100 text-decoration-none"
                              >
                                <i className="bi bi-grid me-1"></i>
                                Seções
                              </a>
                            </ProtectedContent>
                          </div>
                        </div>
                      </div>

                      {/* Seção: Estoque e Compras */}
                      <div className="border-bottom pb-3 mb-3">
                        <h6 className="text-muted mb-2">📋 ESTOQUE & COMPRAS</h6>
                        <div className="row g-2">
                          <div className="col-12 mb-2">
                            <ProtectedContent permission="manage_fornecedores">
                              <a 
                                href="/dashboard/lojista/gestao-custos"
                                className="btn btn-primary btn-sm w-100 text-decoration-none"
                              >
                                <i className="bi bi-graph-up-arrow me-1"></i>
                                Gestão de Custos - Visão Geral
                              </a>
                            </ProtectedContent>
                          </div>
                          <div className="col-6">
                            <ProtectedContent permission="manage_fornecedores">
                              <a 
                                href="/dashboard/lojista/fornecedores"
                                className="btn btn-success btn-sm w-100 text-decoration-none"
                              >
                                <i className="bi bi-truck me-1"></i>
                                Fornecedores
                              </a>
                            </ProtectedContent>
                          </div>
                          <div className="col-6">
                            <ProtectedContent permission="manage_itens_base">
                              <a 
                                href="/dashboard/lojista/itens-base"
                                className="btn btn-outline-success btn-sm w-100 text-decoration-none"
                              >
                                <i className="bi bi-archive me-1"></i>
                                Itens Base
                              </a>
                            </ProtectedContent>
                          </div>
                          <div className="col-12">
                            <ProtectedContent permission="manage_movimentacoes">
                              <a 
                                href="/dashboard/lojista/movimentacoes"
                                className="btn btn-outline-success btn-sm w-100 text-decoration-none"
                              >
                                <i className="bi bi-arrow-left-right me-1"></i>
                                Movimentações (Entrada/Saída)
                              </a>
                            </ProtectedContent>
                          </div>
                        </div>
                      </div>

                      {/* Seção: Produção */}
                      <div className="border-bottom pb-3 mb-3">
                        <h6 className="text-muted mb-2">👨‍🍳 PRODUÇÃO</h6>
                        <div className="row g-2">
                          <div className="col-6">
                            <ProtectedContent permission="manage_ingredients">
                              <a 
                                href="/dashboard/lojista/ingredientes"
                                className="btn btn-warning btn-sm w-100 text-decoration-none"
                              >
                                <i className="bi bi-egg me-1"></i>
                                Ingredientes
                              </a>
                            </ProtectedContent>
                          </div>
                          <div className="col-6">
                            <ProtectedContent permission="manage_recipes">
                              <a 
                                href="/dashboard/lojista/receitas"
                                className="btn btn-outline-warning btn-sm w-100 text-decoration-none"
                              >
                                <i className="bi bi-book me-1"></i>
                                Receitas
                              </a>
                            </ProtectedContent>
                          </div>
                        </div>
                      </div>

                      {/* Seção: Análises */}
                      <div className="border-bottom pb-3 mb-3">
                        <h6 className="text-muted mb-2">📊 ANÁLISES</h6>
                        <div className="row g-2">
                          <div className="col-12">
                            <ProtectedContent permission="manage_costs">
                              <a 
                                href="/dashboard/lojista/custos"
                                className="btn btn-info btn-sm w-100 text-decoration-none"
                              >
                                <i className="bi bi-calculator me-1"></i>
                                Gestão de Custos
                              </a>
                            </ProtectedContent>
                          </div>
                        </div>
                      </div>

                      {/* Seção: Vendas */}
                      <div className="mb-3">
                        <h6 className="text-muted mb-2">💰 VENDAS</h6>
                        <div className="row g-2">
                          <div className="col-6">
                            <ProtectedContent permission="view_orders">
                              <button className="btn btn-outline-primary btn-sm w-100">
                                <i className="bi bi-cart me-1"></i>
                                Pedidos
                              </button>
                            </ProtectedContent>
                          </div>
                          <div className="col-6">
                            <button className="btn btn-outline-success btn-sm w-100">
                              <i className="bi bi-share me-1"></i>
                              Cardápio
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Orders */}
              <div className="col-md-8">
                <div className="card border-0 shadow-sm">
                  <div className="card-header bg-transparent d-flex justify-content-between align-items-center">
                    <h5 className="card-title mb-0">Pedidos Recentes</h5>
                    <ProtectedContent permission="view_orders">
                      <a href="/dashboard/orders" className="btn btn-sm btn-outline-primary">
                        Ver Todos
                      </a>
                    </ProtectedContent>
                  </div>
                  <div className="card-body">
                    <div className="text-center py-4 text-muted">
                      <i className="bi bi-cart-x fs-1 mb-3"></i>
                      <p>Nenhum pedido recente</p>
                      <small>Os pedidos aparecerão aqui quando chegarem</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Company Info & Plan Status */}
            <div className="row">
              <div className="col-md-6">
                <div className="card border-0 shadow-sm">
                  <div className="card-header bg-transparent">
                    <h5 className="card-title mb-0">Informações da Empresa</h5>
                  </div>
                  <div className="card-body">
                    <div className="row">
                      <div className="col-6">
                        <small className="text-muted">Empresa:</small>
                        <div className="fw-bold">{user?.companyName || "N/A"}</div>
                      </div>
                      <div className="col-6">
                        <small className="text-muted">Segmento:</small>
                        <div>
                          <span className={`badge bg-${effectiveSegmentData.color}`}>
                            {effectiveSegmentData.icon} {effectiveSegmentData.name}
                          </span>
                        </div>
                      </div>
                      <div className="col-6 mt-3">
                        <small className="text-muted">Status:</small>
                        <div>
                          <span className="badge bg-success">
                            <i className="bi bi-check-circle me-1"></i>
                            Ativo
                          </span>
                        </div>
                      </div>
                      <div className="col-6 mt-3">
                        <small className="text-muted">Plano:</small>
                        <div>
                          <span className="badge bg-secondary">
                            <i className="bi bi-star me-1"></i>
                            FREE
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-md-6">
                <div className="card border-0 shadow-sm">
                  <div className="card-header bg-transparent">
                    <h5 className="card-title mb-0">Próximos Passos</h5>
                  </div>
                  <div className="card-body">
                    <div className="list-group list-group-flush">
                      <div className="list-group-item d-flex align-items-center">
                        <i className="bi bi-circle text-success me-3"></i>
                        <div>
                          <div className="fw-medium">Conta criada</div>
                          <small className="text-muted">Sua conta foi configurada com sucesso</small>
                        </div>
                      </div>
                      <div className="list-group-item d-flex align-items-center">
                        <i className="bi bi-circle text-warning me-3"></i>
                        <div>
                          <div className="fw-medium">Adicionar produtos</div>
                          <small className="text-muted">Configure seu cardápio de produtos</small>
                        </div>
                      </div>
                      <div className="list-group-item d-flex align-items-center">
                        <i className="bi bi-circle text-muted me-3"></i>
                        <div>
                          <div className="fw-medium">Personalizar loja</div>
                          <small className="text-muted">Configure cores e layout</small>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
        </div>
      </div>
  );
}

// Export default com renderização client-side only
export default function LojistaDashboard() {
  return (
    <Suspense fallback={
      <div className="container py-5">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Carregando dashboard...</span>
          </div>
          <p className="mt-3 text-muted">Carregando seu dashboard...</p>
        </div>
      </div>
    }>
      <LojistaDashboardContent />
    </Suspense>
  );
}