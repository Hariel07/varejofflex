"use client";

import { useAuthUser, usePermissions, useTenantApi } from "@/hooks/useAuth";
import { ProtectedContent } from "@/components/auth/ProtectedContent";
import { useEffect, useState } from "react";

interface DashboardStats {
  totalCompanies: number;
  activeCompanies: number;
  totalUsers: number;
  revenue: number;
  segmentDistribution: { [key: string]: number };
}

export default function OwnerDashboard() {
  const { user } = useAuthUser();
  const { hasPermission } = usePermissions();
  const { get } = useTenantApi();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (hasPermission("manage_platform")) {
      loadDashboardStats();
    }
  }, [hasPermission]);

  const loadDashboardStats = async () => {
    try {
      const response = await get("/api/admin/stats");
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error("Error loading stats:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedContent ownerSaasOnly fallback={
      <div className="container py-5">
        <div className="alert alert-danger">
          <i className="bi bi-shield-x me-2"></i>
          Acesso negado. Esta área é restrita para Owner SaaS.
        </div>
      </div>
    }>
      <div className="container-fluid py-4">
        {/* Header */}
        <div className="row mb-4">
          <div className="col">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h1 className="h3 mb-1">Dashboard Owner SaaS</h1>
                <p className="text-muted mb-0">Bem-vindo, {user?.name}</p>
              </div>
              <div className="badge bg-danger fs-6">
                <i className="bi bi-shield-lock me-1"></i>
                OWNER SAAS
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
                          <i className="bi bi-building text-primary fs-4"></i>
                        </div>
                      </div>
                      <div className="ms-3">
                        <h6 className="card-title mb-1">Total de Empresas</h6>
                        <h3 className="mb-0">{stats?.totalCompanies || 0}</h3>
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
                          <i className="bi bi-check-circle text-success fs-4"></i>
                        </div>
                      </div>
                      <div className="ms-3">
                        <h6 className="card-title mb-1">Empresas Ativas</h6>
                        <h3 className="mb-0">{stats?.activeCompanies || 0}</h3>
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
                          <i className="bi bi-people text-info fs-4"></i>
                        </div>
                      </div>
                      <div className="ms-3">
                        <h6 className="card-title mb-1">Total de Usuários</h6>
                        <h3 className="mb-0">{stats?.totalUsers || 0}</h3>
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
                        <h6 className="card-title mb-1">Receita (MRR)</h6>
                        <h3 className="mb-0">R$ {stats?.revenue?.toLocaleString() || "0"}</h3>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Segment Distribution */}
            <div className="row mb-4">
              <div className="col-md-8">
                <div className="card border-0 shadow-sm">
                  <div className="card-header bg-transparent">
                    <h5 className="card-title mb-0">Distribuição por Segmento</h5>
                  </div>
                  <div className="card-body">
                    <div className="row">
                      {Object.entries(stats?.segmentDistribution || {}).map(([segment, count]) => (
                        <div key={segment} className="col-md-6 mb-3">
                          <div className="d-flex justify-content-between align-items-center p-3 bg-light rounded">
                            <div>
                              <i className="bi bi-shop me-2"></i>
                              <span className="fw-medium">{segment.charAt(0).toUpperCase() + segment.slice(1)}</span>
                            </div>
                            <span className="badge bg-primary">{count}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-md-4">
                <div className="card border-0 shadow-sm">
                  <div className="card-header bg-transparent">
                    <h5 className="card-title mb-0">Ações Rápidas</h5>
                  </div>
                  <div className="card-body">
                    <div className="d-grid gap-2">
                      <button className="btn btn-primary">
                        <i className="bi bi-building-add me-2"></i>
                        Gerenciar Empresas
                      </button>
                      <button className="btn btn-outline-primary">
                        <i className="bi bi-people me-2"></i>
                        Gerenciar Usuários
                      </button>
                      <button className="btn btn-outline-primary">
                        <i className="bi bi-graph-up me-2"></i>
                        Relatórios
                      </button>
                      <button className="btn btn-outline-primary">
                        <i className="bi bi-gear me-2"></i>
                        Configurações
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="row">
              <div className="col">
                <div className="card border-0 shadow-sm">
                  <div className="card-header bg-transparent">
                    <h5 className="card-title mb-0">Atividade Recente</h5>
                  </div>
                  <div className="card-body">
                    <div className="text-center py-4 text-muted">
                      <i className="bi bi-clock-history fs-1 mb-3"></i>
                      <p>Nenhuma atividade recente</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </ProtectedContent>
  );
}