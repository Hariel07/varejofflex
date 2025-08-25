"use client";

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

// Importação dinâmica do sistema de gestão de custos
const CostManagementDashboard = dynamic(() => import('@/components/CostManagementDashboard'), {
  ssr: false,
  loading: () => (
    <div className="d-flex justify-content-center py-5">
      <div className="spinner-border" role="status">
        <span className="visually-hidden">Carregando...</span>
      </div>
    </div>
  )
});

export default function LogistaDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('[LOGISTA-PAGE] useEffect triggered, status:', status, 'session:', !!session);
    
    if (status === 'loading') {
      console.log('[LOGISTA-PAGE] Session loading...');
      return;
    }
    
    if (!session) {
      console.log('[LOGISTA-PAGE] No session, redirecting to login');
      router.push('/login');
      return;
    }

    console.log('[LOGISTA-PAGE] Session found:', session);
    setLoading(false);
  }, [status, session, router]);

  const handleLogout = async () => {
    try {
      await signOut({ 
        callbackUrl: '/login',
        redirect: true 
      });
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  if (loading || status === 'loading') {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="text-center">
          <div className="spinner-border text-primary" style={{ width: '3rem', height: '3rem' }} role="status">
            <span className="visually-hidden">Carregando...</span>
          </div>
          <p className="mt-3 text-muted">Carregando dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-fluid py-5">
        <div className="row justify-content-center">
          <div className="col-md-6 text-center">
            <div className="alert alert-danger">
              <h4>Erro</h4>
              <p>{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'dashboard', name: 'Visão Geral', icon: 'bi-speedometer2', color: '#667eea' },
    { id: 'cost-management', name: 'Gestão de Custos', icon: 'bi-calculator', color: '#f093fb' },
    { id: 'orders', name: 'Pedidos', icon: 'bi-receipt', color: '#4facfe' },
    { id: 'menu', name: 'Cardápio', icon: 'bi-menu-button', color: '#43e97b' },
    { id: 'clients', name: 'Clientes', icon: 'bi-people', color: '#38ef7d' },
    { id: 'settings', name: 'Configurações', icon: 'bi-gear', color: '#fd79a8' }
  ];

  const quickStats = [
    { title: 'Estoque Total', value: 'R$ 12.450', change: '+5%', icon: 'bi-box', color: '#667eea' },
    { title: 'Pedidos Hoje', value: '47', change: '+18%', icon: 'bi-receipt', color: '#f093fb' },
    { title: 'Itens em Falta', value: '3', change: '-2', icon: 'bi-exclamation-circle', color: '#fd79a8' },
    { title: 'Receita Diária', value: 'R$ 2.890', change: '+12%', icon: 'bi-cash-stack', color: '#43e97b' }
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
                <i className="bi bi-shop me-3" style={{ fontSize: '2rem' }}></i>
                Dashboard Logista
              </h1>
              <p className="text-white-50 mb-0" style={{ fontSize: '1.1rem' }}>
                Gestão completa do seu negócio
              </p>
            </div>
            <div className="col-md-6 text-end">
              <div className="d-flex align-items-center justify-content-end gap-3">
                <div className="text-white-50 d-none d-md-block">
                  <div style={{ fontSize: '0.9rem' }}>Bem-vindo,</div>
                  <div style={{ fontWeight: '600' }}>{session?.user?.name || 'Logista'}</div>
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
                        'none',
                      transform: activeTab === tab.id ? 'translateY(-2px)' : 'none'
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

      {/* Main Content */}
      <div className="container-fluid py-4">
        {/* Dashboard Content */}
        {activeTab === 'dashboard' && (
          <div className="row g-4">
            {/* Quick Stats */}
            <div className="col-12">
              <div className="row g-4">
                {quickStats.map((stat, index) => (
                  <div key={index} className="col-xl-3 col-md-6">
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
                      onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                    >
                      <div className="card-body p-4">
                        <div className="d-flex align-items-center">
                          <div 
                            className="rounded-circle p-3 me-3"
                            style={{
                              background: `linear-gradient(135deg, ${stat.color} 0%, ${stat.color}CC 100%)`,
                              width: '60px',
                              height: '60px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                          >
                            <i className={`${stat.icon} text-white`} style={{ fontSize: '1.5rem' }}></i>
                          </div>
                          <div className="flex-grow-1">
                            <div className="fw-bold text-muted small">{stat.title}</div>
                            <div className="h4 mb-1" style={{ fontWeight: '800', color: '#2d3748' }}>
                              {stat.value}
                            </div>
                            <div className="small text-success">
                              <i className="bi bi-arrow-up"></i> {stat.change}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
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
                  <h5 className="mb-4" style={{ fontWeight: '700', color: '#2d3748' }}>
                    <i className="bi bi-lightning me-2" style={{ color: '#f093fb' }}></i>
                    Ações Rápidas
                  </h5>
                  <div className="row g-3">
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
                        onClick={() => setActiveTab('cost-management')}
                      >
                        <i className="bi bi-calculator me-3"></i>
                        Gestão de Custos
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
                        onClick={() => setActiveTab('orders')}
                      >
                        <i className="bi bi-receipt me-3"></i>
                        Ver Pedidos
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
                        onClick={() => setActiveTab('menu')}
                      >
                        <i className="bi bi-menu-button me-3"></i>
                        Editar Cardápio
                      </button>
                    </div>
                    <div className="col-md-6">
                      <button 
                        className="btn w-100 p-3 text-start"
                        style={{
                          background: 'linear-gradient(135deg, #38ef7d 0%, #11998e 100%)',
                          color: 'white',
                          border: 'none',
                          borderRadius: '15px',
                          fontWeight: '600'
                        }}
                        onClick={() => setActiveTab('clients')}
                      >
                        <i className="bi bi-people me-3"></i>
                        Ver Clientes
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Cost Management Tab */}
        {activeTab === 'cost-management' && <CostManagementDashboard />}

        {/* Other Tabs - Placeholder */}
        {activeTab === 'orders' && (
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
                    <i className="bi bi-receipt" style={{ fontSize: '4rem', color: '#4facfe' }}></i>
                    <h4 className="mt-3 mb-3" style={{ fontWeight: '700', color: '#2d3748' }}>
                      Gestão de Pedidos
                    </h4>
                    <p className="text-muted mb-4" style={{ fontSize: '1.1rem' }}>
                      Funcionalidade em desenvolvimento. Aqui você poderá visualizar e gerenciar todos os pedidos.
                    </p>
                    <div className="badge bg-info text-white px-4 py-2 rounded-pill">
                      <i className="bi bi-gear me-2"></i>
                      Em desenvolvimento
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'menu' && (
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
                    <i className="bi bi-menu-button" style={{ fontSize: '4rem', color: '#43e97b' }}></i>
                    <h4 className="mt-3 mb-3" style={{ fontWeight: '700', color: '#2d3748' }}>
                      Editor de Cardápio
                    </h4>
                    <p className="text-muted mb-4" style={{ fontSize: '1.1rem' }}>
                      Funcionalidade em desenvolvimento. Aqui você poderá editar seu cardápio digital.
                    </p>
                    <div className="badge bg-info text-white px-4 py-2 rounded-pill">
                      <i className="bi bi-gear me-2"></i>
                      Em desenvolvimento
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'clients' && (
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
                    <i className="bi bi-people" style={{ fontSize: '4rem', color: '#38ef7d' }}></i>
                    <h4 className="mt-3 mb-3" style={{ fontWeight: '700', color: '#2d3748' }}>
                      Gestão de Clientes
                    </h4>
                    <p className="text-muted mb-4" style={{ fontSize: '1.1rem' }}>
                      Funcionalidade em desenvolvimento. Aqui você poderá visualizar e gerenciar seus clientes.
                    </p>
                    <div className="badge bg-info text-white px-4 py-2 rounded-pill">
                      <i className="bi bi-gear me-2"></i>
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
                    <i className="bi bi-gear" style={{ fontSize: '4rem', color: '#fd79a8' }}></i>
                    <h4 className="mt-3 mb-3" style={{ fontWeight: '700', color: '#2d3748' }}>
                      Configurações
                    </h4>
                    <p className="text-muted mb-4" style={{ fontSize: '1.1rem' }}>
                      Funcionalidade em desenvolvimento. Aqui você poderá configurar seu estabelecimento.
                    </p>
                    <div className="badge bg-info text-white px-4 py-2 rounded-pill">
                      <i className="bi bi-gear me-2"></i>
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