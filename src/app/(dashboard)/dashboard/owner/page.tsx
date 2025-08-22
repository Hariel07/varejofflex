"use client";

import { useAuthUser } from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import OwnerSidebar from "@/components/dashboard/OwnerSidebar";
import { 
  StatsCard, 
  ChartCard, 
  SimpleBarChart, 
  SimpleLineChart, 
  RecentActivity 
} from "@/components/dashboard/DashboardComponents";

export default function OwnerDashboard() {
  const { user, isLoading } = useAuthUser();
  const [mounted, setMounted] = useState(false);
  const [dashboardData, setDashboardData] = useState({
    totalUsers: 0,
    totalCompanies: 0,
    monthlyRevenue: 0,
    activeSubscriptions: 0
  });

  useEffect(() => {
    setMounted(true);
    // Simulate loading dashboard data
    setTimeout(() => {
      setDashboardData({
        totalUsers: 2847,
        totalCompanies: 1205,
        monthlyRevenue: 45850,
        activeSubscriptions: 892
      });
    }, 1000);
  }, []);

  if (!mounted) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Carregando...</span>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Carregando usuário...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="alert alert-warning">
          <h5>Usuário não encontrado</h5>
          <p>Não foi possível carregar as informações do usuário.</p>
          <a href="/login" className="btn btn-primary">Fazer Login</a>
        </div>
      </div>
    );
  }

  return (
    <div className="d-flex min-vh-100 bg-light">
      {/* Sidebar */}
      <OwnerSidebar />
      
      {/* Main Content */}
      <div className="flex-grow-1 dashboard-main" style={{ marginLeft: '280px' }}>
        {/* Top Bar */}
        <div className="bg-white shadow-sm p-3 mb-4 sticky-top">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h4 className="mb-0">Dashboard Owner</h4>
              <small className="text-muted">Bem-vindo, {user.name}!</small>
            </div>
            <div className="d-flex align-items-center">
              <span className="badge bg-success me-3">
                <i className="bi bi-circle-fill me-1"></i>
                Online
              </span>
              <span className="text-muted">
                {new Date().toLocaleDateString('pt-BR', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </span>
            </div>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="p-4">
          {/* Stats Cards */}
          <div className="row g-4 mb-4">
            <div className="col-xl-3 col-md-6">
              <StatsCard
                title="Total de Usuários"
                value={dashboardData.totalUsers.toLocaleString()}
                icon="bi-people"
                color="bg-primary"
                change="+12.5%"
                changeType="positive"
              />
            </div>
            <div className="col-xl-3 col-md-6">
              <StatsCard
                title="Empresas Ativas"
                value={dashboardData.totalCompanies.toLocaleString()}
                icon="bi-building"
                color="bg-success"
                change="+8.2%"
                changeType="positive"
              />
            </div>
            <div className="col-xl-3 col-md-6">
              <StatsCard
                title="Receita Mensal"
                value={`R$ ${dashboardData.monthlyRevenue.toLocaleString()}`}
                icon="bi-currency-dollar"
                color="bg-info"
                change="+15.3%"
                changeType="positive"
              />
            </div>
            <div className="col-xl-3 col-md-6">
              <StatsCard
                title="Assinaturas Ativas"
                value={dashboardData.activeSubscriptions.toLocaleString()}
                icon="bi-star"
                color="bg-warning"
                change="-2.1%"
                changeType="negative"
              />
            </div>
          </div>

          {/* Charts Row */}
          <div className="row g-4 mb-4">
            <div className="col-xl-8">
              <ChartCard title="Novos Usuários por Mês">
                <SimpleBarChart />
              </ChartCard>
            </div>
            <div className="col-xl-4">
              <ChartCard title="Receita da Semana">
                <SimpleLineChart />
              </ChartCard>
            </div>
          </div>

          {/* Bottom Row */}
          <div className="row g-4">
            <div className="col-xl-8">
              {/* Quick Actions */}
              <div className="card shadow-sm border-0 mb-4">
                <div className="card-header bg-white border-0">
                  <h6 className="card-title mb-0 fw-bold">Ações Rápidas</h6>
                </div>
                <div className="card-body">
                  <div className="row g-3">
                    <div className="col-md-3">
                      <button className="btn btn-outline-primary w-100 h-100 d-flex flex-column align-items-center justify-content-center py-3">
                        <i className="bi bi-person-plus fs-4 mb-2"></i>
                        <span>Criar Usuário</span>
                      </button>
                    </div>
                    <div className="col-md-3">
                      <button className="btn btn-outline-success w-100 h-100 d-flex flex-column align-items-center justify-content-center py-3">
                        <i className="bi bi-building-add fs-4 mb-2"></i>
                        <span>Nova Empresa</span>
                      </button>
                    </div>
                    <div className="col-md-3">
                      <button className="btn btn-outline-info w-100 h-100 d-flex flex-column align-items-center justify-content-center py-3">
                        <i className="bi bi-file-earmark-text fs-4 mb-2"></i>
                        <span>Relatórios</span>
                      </button>
                    </div>
                    <div className="col-md-3">
                      <button className="btn btn-outline-warning w-100 h-100 d-flex flex-column align-items-center justify-content-center py-3">
                        <i className="bi bi-gear fs-4 mb-2"></i>
                        <span>Configurações</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* System Status */}
              <div className="card shadow-sm border-0">
                <div className="card-header bg-white border-0">
                  <h6 className="card-title mb-0 fw-bold">Status do Sistema</h6>
                </div>
                <div className="card-body">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <div className="d-flex align-items-center justify-content-between p-3 bg-light rounded">
                        <div>
                          <h6 className="mb-1">API Gateway</h6>
                          <small className="text-muted">Tempo de resposta: 45ms</small>
                        </div>
                        <span className="badge bg-success">Online</span>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="d-flex align-items-center justify-content-between p-3 bg-light rounded">
                        <div>
                          <h6 className="mb-1">Banco de Dados</h6>
                          <small className="text-muted">Conexões ativas: 156</small>
                        </div>
                        <span className="badge bg-success">Online</span>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="d-flex align-items-center justify-content-between p-3 bg-light rounded">
                        <div>
                          <h6 className="mb-1">Sistema de Pagamento</h6>
                          <small className="text-muted">Última transação: 2min</small>
                        </div>
                        <span className="badge bg-success">Online</span>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="d-flex align-items-center justify-content-between p-3 bg-light rounded">
                        <div>
                          <h6 className="mb-1">CDN</h6>
                          <small className="text-muted">Cache hit rate: 94%</small>
                        </div>
                        <span className="badge bg-warning">Degradado</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-xl-4">
              <div className="card shadow-sm border-0 h-100">
                <div className="card-header bg-white border-0">
                  <h6 className="card-title mb-0 fw-bold">Atividade Recente</h6>
                </div>
                <div className="card-body p-0">
                  <RecentActivity />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}