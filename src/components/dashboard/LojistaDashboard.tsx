"use client";

import { useAuthUser, usePermissions, useTenantApi, useCompanyAccess } from "@/hooks/useAuth";
import { ProtectedContent, LojistaOnly } from "@/components/auth/ProtectedContent";
import { useEffect, useState } from "react";

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
  farmacia: { name: "Farmácia", icon: "💊", color: "secondary" },
  conveniencia: { name: "Conveniência", icon: "🏪", color: "dark" },
  salao: { name: "Salão", icon: "💄", color: "light" },
};

export default function LojistaDashboard() {
  const { user } = useAuthUser();
  const { hasPermission } = usePermissions();
  const { get } = useTenantApi();
  const { canAccessCompany } = useCompanyAccess();
  const [stats, setStats] = useState<CompanyStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Determinar o segmento da empresa
  const companySegment = user?.companyId ? "lanchonete" : "mercado"; // Fallback
  const currentSegment = segmentInfo[companySegment as keyof typeof segmentInfo] || segmentInfo.mercado;

  useEffect(() => {
    if (!user?.companyId) {
      setLoading(false);
      return;
    }

    const loadStats = async () => {
      try {
        const response = await get(`/api/companies/${user.companyId}/stats`);
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        } else {
          setError("Erro ao carregar estatísticas");
        }
      } catch (err) {
        setError("Erro ao conectar com o servidor");
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, [user?.companyId, get]);

  if (!user) {
    return (
      <div className="container mt-4">
        <div className="d-flex justify-content-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Carregando...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <ProtectedContent>
      <LojistaOnly>
        <div className={`min-vh-100 bg-${currentSegment.color} bg-opacity-10`}>
          {/* Header com tema do segmento */}
          <div className={`bg-${currentSegment.color} text-white py-4 mb-4`}>
            <div className="container">
              <div className="row align-items-center">
                <div className="col-md-8">
                  <h1 className="mb-1">
                    <span className="me-2">{currentSegment.icon}</span>
                    Dashboard {currentSegment.name}
                  </h1>
                  <p className="mb-0 opacity-75">
                    Bem-vindo(a), {user.name}! Gerencie seu negócio aqui.
                  </p>
                </div>
                <div className="col-md-4 text-end">
                  <button className="btn btn-light btn-sm me-2">
                    <i className="bi bi-gear"></i> Configurações
                  </button>
                  <button className="btn btn-outline-light btn-sm">
                    <i className="bi bi-question-circle"></i> Ajuda
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="container">
            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Carregando estatísticas...</span>
                </div>
                <p className="mt-3 text-muted">Carregando dados do seu negócio...</p>
              </div>
            ) : error ? (
              <div className="alert alert-warning" role="alert">
                <i className="bi bi-exclamation-triangle"></i> {error}
              </div>
            ) : (
              <>
                {/* Cards de estatísticas */}
                <div className="row mb-4">
                  <div className="col-md-3 mb-3">
                    <div className="card border-0 shadow-sm">
                      <div className="card-body text-center">
                        <div className={`text-${currentSegment.color} mb-2`}>
                          <i className="bi bi-box-seam fs-1"></i>
                        </div>
                        <h3 className="mb-1">{stats?.totalProducts || 0}</h3>
                        <p className="text-muted small mb-0">Produtos Cadastrados</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-3 mb-3">
                    <div className="card border-0 shadow-sm">
                      <div className="card-body text-center">
                        <div className={`text-${currentSegment.color} mb-2`}>
                          <i className="bi bi-cart-check fs-1"></i>
                        </div>
                        <h3 className="mb-1">{stats?.totalOrders || 0}</h3>
                        <p className="text-muted small mb-0">Pedidos Total</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-3 mb-3">
                    <div className="card border-0 shadow-sm">
                      <div className="card-body text-center">
                        <div className={`text-${currentSegment.color} mb-2`}>
                          <i className="bi bi-currency-dollar fs-1"></i>
                        </div>
                        <h3 className="mb-1">R$ {stats?.monthlyRevenue?.toFixed(2) || "0,00"}</h3>
                        <p className="text-muted small mb-0">Faturamento Mensal</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-3 mb-3">
                    <div className="card border-0 shadow-sm">
                      <div className="card-body text-center">
                        <div className={`text-${currentSegment.color} mb-2`}>
                          <i className="bi bi-clock-history fs-1"></i>
                        </div>
                        <h3 className="mb-1">{stats?.pendingOrders || 0}</h3>
                        <p className="text-muted small mb-0">Pedidos Pendentes</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Ações rápidas */}
                <div className="row mb-4">
                  <div className="col-12">
                    <div className="card border-0 shadow-sm">
                      <div className="card-header bg-white border-0">
                        <h5 className="mb-0">
                          <i className="bi bi-lightning-charge me-2"></i>
                          Ações Rápidas
                        </h5>
                      </div>
                      <div className="card-body">
                        <div className="row">
                          <div className="col-md-3 mb-3">
                            <button className={`btn btn-${currentSegment.color} w-100 py-3`}>
                              <i className="bi bi-plus-circle fs-4 d-block mb-2"></i>
                              Novo Produto
                            </button>
                          </div>
                          <div className="col-md-3 mb-3">
                            <button className={`btn btn-outline-${currentSegment.color} w-100 py-3`}>
                              <i className="bi bi-list-ul fs-4 d-block mb-2"></i>
                              Ver Pedidos
                            </button>
                          </div>
                          <div className="col-md-3 mb-3">
                            <button className={`btn btn-outline-${currentSegment.color} w-100 py-3`}>
                              <i className="bi bi-graph-up fs-4 d-block mb-2"></i>
                              Relatórios
                            </button>
                          </div>
                          <div className="col-md-3 mb-3">
                            <button className={`btn btn-outline-${currentSegment.color} w-100 py-3`}>
                              <i className="bi bi-megaphone fs-4 d-block mb-2"></i>
                              Promoções
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Onboarding/Getting Started */}
                <div className="row mb-4">
                  <div className="col-md-6">
                    <div className="card border-0 shadow-sm">
                      <div className="card-header bg-white border-0">
                        <h6 className="mb-0">
                          <i className="bi bi-rocket-takeoff me-2"></i>
                          Primeiros Passos
                        </h6>
                      </div>
                      <div className="card-body">
                        <div className="list-group list-group-flush">
                          <div className="list-group-item d-flex align-items-center">
                            <i className={`bi bi-check-circle-fill text-${currentSegment.color} me-3`}></i>
                            <span>Perfil da empresa configurado</span>
                          </div>
                          <div className="list-group-item d-flex align-items-center text-muted">
                            <i className="bi bi-circle me-3"></i>
                            <span>Adicionar primeiro produto</span>
                          </div>
                          <div className="list-group-item d-flex align-items-center text-muted">
                            <i className="bi bi-circle me-3"></i>
                            <span>Configurar formas de pagamento</span>
                          </div>
                          <div className="list-group-item d-flex align-items-center text-muted">
                            <i className="bi bi-circle me-3"></i>
                            <span>Personalizar cardápio</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="card border-0 shadow-sm">
                      <div className="card-header bg-white border-0">
                        <h6 className="mb-0">
                          <i className="bi bi-bell me-2"></i>
                          Notificações Recentes
                        </h6>
                      </div>
                      <div className="card-body">
                        <div className="text-center text-muted py-4">
                          <i className="bi bi-bell-slash fs-2 d-block mb-2"></i>
                          <small>Nenhuma notificação nova</small>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Performance do segmento */}
                <div className="row mb-4">
                  <div className="col-12">
                    <div className="card border-0 shadow-sm">
                      <div className="card-header bg-white border-0">
                        <h6 className="mb-0">
                          <i className="bi bi-graph-up-arrow me-2"></i>
                          Performance do Segmento: {currentSegment.name}
                        </h6>
                      </div>
                      <div className="card-body">
                        <div className="row text-center">
                          <div className="col-md-4">
                            <div className={`text-${currentSegment.color} mb-2`}>
                              <i className="bi bi-trophy fs-3"></i>
                            </div>
                            <h6>Posição no Ranking</h6>
                            <p className="text-muted">#1 na região</p>
                          </div>
                          <div className="col-md-4">
                            <div className={`text-${currentSegment.color} mb-2`}>
                              <i className="bi bi-star-fill fs-3"></i>
                            </div>
                            <h6>Avaliação Média</h6>
                            <p className="text-muted">4.8 ⭐ (127 avaliações)</p>
                          </div>
                          <div className="col-md-4">
                            <div className={`text-${currentSegment.color} mb-2`}>
                              <i className="bi bi-arrow-up-circle fs-3"></i>
                            </div>
                            <h6>Crescimento</h6>
                            <p className="text-muted">+15% este mês</p>
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
      </LojistaOnly>
    </ProtectedContent>
  );
}