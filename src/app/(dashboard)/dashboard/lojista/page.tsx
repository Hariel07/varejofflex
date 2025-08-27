"use client";

import { useAuthUser, usePermissions, useTenantApi, useCompanyAccess } from "@/hooks/useAuth";
import { ProtectedContent, LojistaOnly } from "@/components/auth/ProtectedContent";
import { useEffect, useState, Suspense } from "react";
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
  const [stats, setStats] = useState<CompanyStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [showFiscalConfig, setShowFiscalConfig] = useState(false);

  const companyId = getCurrentCompanyId();
  const segment = user?.segment || "lanchonete";
  const segmentData = segmentInfo[segment as keyof typeof segmentInfo] || segmentInfo.lanchonete;

  useEffect(() => {
    if (hasPermission("manage_products") && companyId) {
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
  }, [hasPermission, companyId]);

  const loadCompanyStats = async () => {
    try {
      const response = await get(`/api/companies/${companyId}/stats`);
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

  return (
    <LojistaOnly fallback={
      <div className="container py-5">
        <div className="alert alert-danger">
          <i className="bi bi-shield-x me-2"></i>
          Acesso negado. Esta área é restrita para lojistas.
        </div>
      </div>
    }>
      <div className="container-fluid py-4">
        {/* Header */}
        <div className="row mb-4">
          <div className="col">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h1 className="h3 mb-1">Dashboard Lojista</h1>
                <p className="text-muted mb-0">Bem-vindo, {user?.name}</p>
              </div>
              <div className={`badge bg-${segmentData.color} fs-6`}>
                <span className="me-1">{segmentData.icon}</span>
                {segmentData.name.toUpperCase()}
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
                <div className="card border-0 shadow-sm">
                  <div className="card-body">
                    <div className="d-flex align-items-center">
                      <div className="flex-shrink-0">
                        <div className="bg-primary bg-opacity-10 p-3 rounded">
                          <i className="bi bi-box text-primary fs-4"></i>
                        </div>
                      </div>
                      <div className="ms-3">
                        <h6 className="card-title mb-1">Produtos</h6>
                        <h3 className="mb-0">{stats?.totalProducts || 0}</h3>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-md-3 mb-3">
                <div className="card border-0 shadow-sm">
                  <div className="card-body">
                    <div className="d-flex align-items-center">
                      <div className="flex-shrink-0">
                        <div className="bg-success bg-opacity-10 p-3 rounded">
                          <i className="bi bi-cart-check text-success fs-4"></i>
                        </div>
                      </div>
                      <div className="ms-3">
                        <h6 className="card-title mb-1">Pedidos</h6>
                        <h3 className="mb-0">{stats?.totalOrders || 0}</h3>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-md-3 mb-3">
                <div className="card border-0 shadow-sm">
                  <div className="card-body">
                    <div className="d-flex align-items-center">
                      <div className="flex-shrink-0">
                        <div className="bg-warning bg-opacity-10 p-3 rounded">
                          <i className="bi bi-currency-dollar text-warning fs-4"></i>
                        </div>
                      </div>
                      <div className="ms-3">
                        <h6 className="card-title mb-1">Receita Mensal</h6>
                        <h3 className="mb-0">R$ {stats?.monthlyRevenue?.toLocaleString() || "0"}</h3>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-md-3 mb-3">
                <div className="card border-0 shadow-sm">
                  <div className="card-body">
                    <div className="d-flex align-items-center">
                      <div className="flex-shrink-0">
                        <div className="bg-info bg-opacity-10 p-3 rounded">
                          <i className="bi bi-clock text-info fs-4"></i>
                        </div>
                      </div>
                      <div className="ms-3">
                        <h6 className="card-title mb-1">Pendentes</h6>
                        <h3 className="mb-0">{stats?.pendingOrders || 0}</h3>
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
                    <div className="d-grid gap-2">
                      <ProtectedContent permission="manage_products">
                        <button className="btn btn-primary">
                          <i className="bi bi-plus-circle me-2"></i>
                          Novo Produto
                        </button>
                      </ProtectedContent>
                      
                      <ProtectedContent permission="view_orders">
                        <button className="btn btn-outline-primary">
                          <i className="bi bi-cart me-2"></i>
                          Ver Pedidos
                        </button>
                      </ProtectedContent>

                      <ProtectedContent permission="manage_company_settings">
                        <button className="btn btn-outline-primary">
                          <i className="bi bi-gear me-2"></i>
                          Configurações
                        </button>
                      </ProtectedContent>

                      <button className="btn btn-outline-success">
                        <i className="bi bi-share me-2"></i>
                        Compartilhar Cardápio
                      </button>
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
                          <span className={`badge bg-${segmentData.color}`}>
                            {segmentData.icon} {segmentData.name}
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
    </LojistaOnly>
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