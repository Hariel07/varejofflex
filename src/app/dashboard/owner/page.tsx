"use client";

import { useSession, signOut } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import dynamic from 'next/dynamic';

// Importação dinâmica para evitar problemas de SSR
const PlansManagement = dynamic(() => import('@/components/dashboard/PlansManagement'), {
  ssr: false,
  loading: () => (
    <div className="d-flex justify-content-center py-5">
      <div className="spinner-border" role="status">
        <span className="visually-hidden">Carregando...</span>
      </div>
    </div>
  )
});

const PlanCouponsManagement = dynamic(() => import('@/components/dashboard/PlanCouponsManagement'), {
  ssr: false,
  loading: () => (
    <div className="d-flex justify-content-center py-5">
      <div className="spinner-border" role="status">
        <span className="visually-hidden">Carregando...</span>
      </div>
    </div>
  )
});

const UserManagement = dynamic(() => import('@/components/dashboard/UserManagement'), {
  ssr: false,
  loading: () => (
    <div className="d-flex justify-content-center py-5">
      <div className="spinner-border" role="status">
        <span className="visually-hidden">Carregando...</span>
      </div>
    </div>
  )
});

export default function OwnerDashboard() {
  return (
    <Suspense fallback={
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Carregando...</span>
        </div>
      </div>
    }>
      <OwnerDashboardContent />
    </Suspense>
  );
}

function OwnerDashboardContent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [error, setError] = useState<string | null>(null);

  // Lê o parâmetro tab da URL
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  useEffect(() => {
    console.log('[OWNER-PAGE] useEffect triggered, status:', status, 'session:', !!session);
    
    if (status === 'loading') {
      console.log('[OWNER-PAGE] Session loading...');
      return;
    }
    
    if (!session) {
      console.log('[OWNER-PAGE] No session, redirecting to login');
      router.push('/login');
      return;
    }

    console.log('[OWNER-PAGE] Session found, setting as owner dashboard');
    setLoading(false);
  }, [session, status, router]);

  const handleLogout = async () => {
    await signOut({ 
      callbackUrl: '/',
      redirect: true 
    });
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center" 
           style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <div className="text-center">
          <div className="spinner-border text-white mb-3" role="status" style={{ width: '3rem', height: '3rem' }}>
            <span className="visually-hidden">Carregando...</span>
          </div>
          <h4 className="text-white">Carregando Dashboard Owner</h4>
          <p className="text-white-50">Preparando sua área administrativa...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center" 
           style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <div className="text-center">
          <div className="alert alert-danger" role="alert">
            <h4 className="alert-heading">Erro de Acesso</h4>
            <p>{error}</p>
          </div>
          <button className="btn btn-light" onClick={() => router.push('/dashboard')}>
            Voltar ao Dashboard
          </button>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'dashboard', name: 'Visão Geral', icon: 'bi-speedometer2', color: '#667eea' },
    { id: 'plans', name: 'Gerenciar Planos', icon: 'bi-layers', color: '#667eea' },
    { id: 'coupons', name: 'Cupons de Desconto', icon: 'bi-ticket-perforated', color: '#f093fb' },
    { id: 'users', name: 'Usuários', icon: 'bi-people', color: '#4facfe' },
    { id: 'analytics', name: 'Analytics', icon: 'bi-graph-up', color: '#43e97b' },
    { id: 'settings', name: 'Configurações', icon: 'bi-gear', color: '#38ef7d' }
  ];

  const quickStats = [
    { title: 'Usuários Ativos', value: '1,247', change: '+12%', icon: 'bi-people', color: '#667eea' },
    { title: 'Receita Mensal', value: 'R$ 45.890', change: '+8%', icon: 'bi-cash-stack', color: '#f093fb' },
    { title: 'Lanchonetes', value: '125', change: '+15%', icon: 'bi-shop', color: '#4facfe' },
    { title: 'Transações', value: '2.845', change: '+22%', icon: 'bi-receipt', color: '#43e97b' }
  ];

  return (
    <div className="min-vh-100" style={{ background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}>
      {/* Header Premium */}
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        boxShadow: '0 10px 30px rgba(102, 126, 234, 0.3)'
      }}>
        <div className="container-fluid">
          <div className="row align-items-center py-4">
            <div className="col-md-6">
              <h1 className="h2 mb-1 text-white" style={{ fontWeight: '800' }}>
                <i className="bi bi-shield-check me-3" style={{ fontSize: '2rem' }}></i>
                Dashboard Owner
              </h1>
              <p className="text-white-50 mb-0" style={{ fontSize: '1.1rem' }}>
                Painel de Administração da Plataforma VarejoFlex
              </p>
            </div>
            <div className="col-md-6 text-end">
              <div className="d-flex align-items-center justify-content-end gap-3">
                <div className="text-end">
                  <div className="text-white" style={{ fontWeight: '600' }}>
                    {session?.user?.email}
                  </div>
                  <small className="text-white-50">Administrador Master</small>
                </div>
                <div className="dropdown">
                  <button 
                    className="btn btn-light btn-sm dropdown-toggle rounded-pill px-3"
                    type="button" 
                    data-bs-toggle="dropdown"
                    style={{ fontWeight: '600' }}
                  >
                    <i className="bi bi-person-circle me-2"></i>
                    Conta
                  </button>
                  <ul className="dropdown-menu dropdown-menu-end">
                    <li><hr className="dropdown-divider" /></li>
                    <li>
                      <button 
                        className="dropdown-item text-danger"
                        onClick={handleLogout}
                      >
                        <i className="bi bi-box-arrow-right me-2"></i>
                        Sair da Conta
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs Premium */}
      <div className="bg-white border-bottom" style={{ boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
        <div className="container-fluid">
          <div className="row">
            <div className="col-12">
              <nav className="nav nav-pills py-3" style={{ gap: '1rem' }}>
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    className={`nav-link px-4 py-3 rounded-pill ${activeTab === tab.id ? 'active' : ''}`}
                    onClick={() => setActiveTab(tab.id)}
                    style={{
                      background: activeTab === tab.id ? 
                        `linear-gradient(135deg, ${tab.color} 0%, ${tab.color}CC 100%)` : 
                        'transparent',
                      color: activeTab === tab.id ? 'white' : '#6c757d',
                      border: activeTab === tab.id ? 'none' : '2px solid #e9ecef',
                      fontWeight: '600',
                      transition: 'all 0.3s ease',
                      boxShadow: activeTab === tab.id ? 
                        `0 5px 15px ${tab.color}40` : 
                        'none'
                    }}
                  >
                    <i className={`${tab.icon} me-2`}></i>
                    {tab.name}
                  </button>
                ))}
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container-fluid py-4">
        {/* Dashboard Overview */}
        {activeTab === 'dashboard' && (
          <div className="row g-4">
            {/* Quick Stats */}
            <div className="col-12">
              <div className="row g-4">
                {quickStats.map((stat, index) => (
                  <div key={index} className="col-lg-3 col-md-6">
                    <div 
                      className="card border-0 h-100"
                      style={{
                        background: 'rgba(255, 255, 255, 0.9)',
                        backdropFilter: 'blur(20px)',
                        borderRadius: '20px',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                        transition: 'transform 0.3s ease'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                      onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0px)'}
                    >
                      <div className="card-body p-4">
                        <div className="d-flex align-items-center justify-content-between">
                          <div>
                            <h6 className="text-muted mb-2" style={{ fontWeight: '600' }}>
                              {stat.title}
                            </h6>
                            <h3 className="mb-1" style={{ fontWeight: '800', color: '#2d3748' }}>
                              {stat.value}
                            </h3>
                            <small style={{ color: stat.change.includes('+') ? '#10b981' : '#ef4444', fontWeight: '600' }}>
                              {stat.change} vs mês anterior
                            </small>
                          </div>
                          <div 
                            className="d-flex align-items-center justify-content-center"
                            style={{
                              width: '60px',
                              height: '60px',
                              background: `linear-gradient(135deg, ${stat.color} 0%, ${stat.color}CC 100%)`,
                              borderRadius: '15px',
                              color: 'white',
                              fontSize: '1.5rem'
                            }}
                          >
                            <i className={stat.icon}></i>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="col-lg-8">
              <div 
                className="card border-0"
                style={{
                  background: 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(20px)',
                  borderRadius: '20px',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
                }}
              >
                <div className="card-body p-4">
                  <h5 className="card-title mb-4" style={{ fontWeight: '700', color: '#2d3748' }}>
                    <i className="bi bi-lightning-charge me-2" style={{ color: '#667eea' }}></i>
                    Ações Rápidas
                  </h5>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <button 
                        className="btn w-100 p-3 text-start"
                        style={{
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          color: 'white',
                          border: 'none',
                          borderRadius: '15px',
                          fontWeight: '600'
                        }}
                        onClick={() => setActiveTab('plans')}
                      >
                        <i className="bi bi-layers me-3"></i>
                        Gerenciar Planos
                      </button>
                    </div>
                    <div className="col-md-6">
                      <button 
                        className="btn w-100 p-3 text-start"
                        style={{
                          background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                          color: 'white',
                          border: 'none',
                          borderRadius: '15px',
                          fontWeight: '600'
                        }}
                        onClick={() => setActiveTab('coupons')}
                      >
                        <i className="bi bi-ticket-perforated me-3"></i>
                        Criar Cupons
                      </button>
                    </div>
                    <div className="col-md-6">
                      <button 
                        className="btn w-100 p-3 text-start"
                        style={{
                          background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                          color: 'white',
                          border: 'none',
                          borderRadius: '15px',
                          fontWeight: '600'
                        }}
                        onClick={() => setActiveTab('users')}
                      >
                        <i className="bi bi-people me-3"></i>
                        Ver Usuários
                      </button>
                    </div>
                    <div className="col-md-6">
                      <button 
                        className="btn w-100 p-3 text-start"
                        style={{
                          background: 'linear-gradient(135deg, #43e97b 0%, #38ef7d 100%)',
                          color: 'white',
                          border: 'none',
                          borderRadius: '15px',
                          fontWeight: '600'
                        }}
                        onClick={() => setActiveTab('analytics')}
                      >
                        <i className="bi bi-graph-up me-3"></i>
                        Ver Analytics
                      </button>
                    </div>
                  </div>
                  
                  {/* Seção de desenvolvimento */}
                  <hr className="my-4" />
                  <h6 className="mb-3" style={{ fontWeight: '600', color: '#6c757d' }}>
                    <i className="bi bi-tools me-2"></i>
                    Ferramentas de Desenvolvimento
                  </h6>
                  <div className="row g-2">
                    <div className="col-12">
                      <button 
                        className="btn btn-outline-info w-100"
                        onClick={async () => {
                          if (confirm('Isso criará dados de teste completos (sua conta profissional, empresas, planos e usuários). Continuar?')) {
                            try {
                              const response = await fetch('/api/admin/seed-test-data', { method: 'POST' });
                              const data = await response.json();
                              if (data.success) {
                                alert(`✅ Dados completos criados!\n\n🏢 Empresas: ${data.data.companies}\n👥 Logistas: ${data.data.logistas}\n🛒 Clientes: ${data.data.clients}\n🎫 Cupons: ${data.data.coupons}\n💳 Planos: ${data.data.plans}`);
                              } else {
                                alert('Erro: ' + data.error);
                              }
                            } catch (error) {
                              alert('Erro ao criar dados de teste');
                            }
                          }
                        }}
                      >
                        <i className="bi bi-database-add me-2"></i>
                        Popular Dados de Teste Completos
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* System Status */}
            <div className="col-lg-4">
              <div 
                className="card border-0"
                style={{
                  background: 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(20px)',
                  borderRadius: '20px',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
                }}
              >
                <div className="card-body p-4">
                  <h5 className="card-title mb-4" style={{ fontWeight: '700', color: '#2d3748' }}>
                    <i className="bi bi-shield-check me-2" style={{ color: '#10b981' }}></i>
                    Status do Sistema
                  </h5>
                  <div className="d-flex align-items-center justify-content-between mb-3">
                    <span style={{ fontWeight: '600' }}>Servidor</span>
                    <span className="badge bg-success rounded-pill">
                      <i className="bi bi-check-circle me-1"></i>Online
                    </span>
                  </div>
                  <div className="d-flex align-items-center justify-content-between mb-3">
                    <span style={{ fontWeight: '600' }}>Banco de Dados</span>
                    <span className="badge bg-success rounded-pill">
                      <i className="bi bi-check-circle me-1"></i>Conectado
                    </span>
                  </div>
                  <div className="d-flex align-items-center justify-content-between mb-3">
                    <span style={{ fontWeight: '600' }}>API Externa</span>
                    <span className="badge bg-success rounded-pill">
                      <i className="bi bi-check-circle me-1"></i>Ativa
                    </span>
                  </div>
                  <div className="d-flex align-items-center justify-content-between">
                    <span style={{ fontWeight: '600' }}>Última Atualização</span>
                    <small className="text-muted">Agora</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'plans' && <PlansManagement />}
        
        {activeTab === 'coupons' && <PlanCouponsManagement />}

        {activeTab === 'users' && <UserManagement />}

        {activeTab === 'analytics' && (
          <div className="row">
            <div className="col-12">
              <div 
                className="card border-0"
                style={{
                  background: 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(20px)',
                  borderRadius: '20px',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
                }}
              >
                <div className="card-body p-5">
                  <div className="text-center">
                    <i className="bi bi-graph-up" style={{ fontSize: '4rem', color: '#43e97b' }}></i>
                    <h4 className="mt-3 mb-3" style={{ fontWeight: '700', color: '#2d3748' }}>
                      Analytics Avançado
                    </h4>
                    <p className="text-muted mb-4" style={{ fontSize: '1.1rem' }}>
                      Dashboards detalhados com métricas de performance, receita e crescimento da plataforma.
                    </p>
                    <div className="badge bg-primary text-white px-4 py-2 rounded-pill">
                      <i className="bi bi-graph-up me-2"></i>
                      Em desenvolvimento
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="row">
            <div className="col-12">
              <div 
                className="card border-0"
                style={{
                  background: 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(20px)',
                  borderRadius: '20px',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
                }}
              >
                <div className="card-body p-5">
                  <div className="text-center">
                    <i className="bi bi-gear" style={{ fontSize: '4rem', color: '#38ef7d' }}></i>
                    <h4 className="mt-3 mb-3" style={{ fontWeight: '700', color: '#2d3748' }}>
                      Configurações da Plataforma
                    </h4>
                    <p className="text-muted mb-4" style={{ fontSize: '1.1rem' }}>
                      Configurações globais do sistema, integrações e parâmetros avançados.
                    </p>
                    <div className="badge bg-secondary text-white px-4 py-2 rounded-pill">
                      <i className="bi bi-tools me-2"></i>
                      Em desenvolvimento
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}