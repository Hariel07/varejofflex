"use client";

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import UserSettings from '@/components/UserSettings';

export default function ClienteDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('[CLIENTE-PAGE] useEffect triggered, status:', status, 'session:', !!session);
    
    if (status === 'loading') {
      console.log('[CLIENTE-PAGE] Session loading...');
      return;
    }
    
    if (!session) {
      console.log('[CLIENTE-PAGE] No session, redirecting to login');
      router.push('/login');
      return;
    }

    console.log('[CLIENTE-PAGE] Session found:', session);
    setLoading(false);
  }, [status, session, router]);

  const handleLogout = async () => {
    try {
      await signOut({ 
        callbackUrl: '/login',
        redirect: true 
      });
    } catch (error) {
      console.error('[CLIENTE-PAGE] Logout error:', error);
    }
  };

  const tabs = [
    { id: 'dashboard', name: 'Dashboard', icon: 'bi-speedometer2', color: '#4facfe' },
    { id: 'orders', name: 'Meus Pedidos', icon: 'bi-bag', color: '#43e97b' },
    { id: 'favorites', name: 'Favoritos', icon: 'bi-heart', color: '#f093fb' },
    { id: 'settings', name: 'Configurações', icon: 'bi-gear', color: '#fd79a8' }
  ];

  const quickStats = [
    { title: 'Pedidos Realizados', value: '12', change: '+2 este mês', icon: 'bi-bag-check', color: '#43e97b' },
    { title: 'Valor Total Gasto', value: 'R$ 287', change: '+15% este mês', icon: 'bi-currency-dollar', color: '#4facfe' },
    { title: 'Lojas Favoritas', value: '3', change: '+1 nova', icon: 'bi-heart-fill', color: '#f093fb' },
    { title: 'Pontos de Fidelidade', value: '156', change: '+23 pontos', icon: 'bi-star-fill', color: '#fd79a8' }
  ];

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Carregando...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger" role="alert">
          <i className="bi bi-exclamation-triangle me-2"></i>
          {error}
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      {/* Header Premium */}
      <div className="container-fluid">
        <div className="row">
          <div className="col-12">
            <div className="d-flex justify-content-between align-items-center py-4 px-4">
              <div className="d-flex align-items-center">
                <div 
                  className="rounded-circle me-3 d-flex align-items-center justify-content-center"
                  style={{
                    width: '60px',
                    height: '60px',
                    background: 'rgba(255,255,255,0.2)',
                    backdropFilter: 'blur(10px)',
                    border: '2px solid rgba(255,255,255,0.3)'
                  }}
                >
                  <i className="bi bi-person text-white" style={{ fontSize: '1.8rem' }}></i>
                </div>
                <div className="text-white">
                  <h4 className="mb-1" style={{ fontWeight: '700' }}>
                    Área do Cliente
                  </h4>
                  <p className="mb-0 opacity-75">
                    Gerencie seus pedidos e preferências
                  </p>
                </div>
              </div>
              <div className="d-flex align-items-center">
                <div className="text-white-50 d-none d-md-block">
                  <div style={{ fontSize: '0.9rem' }}>Bem-vindo,</div>
                  <div style={{ fontWeight: '600' }}>{session?.user?.name || 'Cliente'}</div>
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
                          background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                          color: 'white',
                          border: 'none',
                          borderRadius: '15px',
                          fontWeight: '600'
                        }}
                        onClick={() => setActiveTab('orders')}
                      >
                        <i className="bi bi-bag me-3"></i>
                        Ver Meus Pedidos
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
                        onClick={() => setActiveTab('favorites')}
                      >
                        <i className="bi bi-heart me-3"></i>
                        Lojas Favoritas
                      </button>
                    </div>
                    <div className="col-md-6">
                      <a 
                        href="/cardapio"
                        className="btn w-100 p-3 text-start text-decoration-none"
                        style={{
                          background: 'linear-gradient(135deg, #43e97b 0%, #38ef7d 100%)',
                          color: 'white',
                          border: 'none',
                          borderRadius: '15px',
                          fontWeight: '600'
                        }}
                      >
                        <i className="bi bi-shop me-3"></i>
                        Explorar Lojas
                      </a>
                    </div>
                    <div className="col-md-6">
                      <button 
                        className="btn w-100 p-3 text-start"
                        style={{
                          background: 'linear-gradient(135deg, #fd79a8 0%, #fdbb2d 100%)',
                          color: 'white',
                          border: 'none',
                          borderRadius: '15px',
                          fontWeight: '600'
                        }}
                        onClick={() => setActiveTab('settings')}
                      >
                        <i className="bi bi-gear me-3"></i>
                        Configurações
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Meus Pedidos */}
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
                    <i className="bi bi-bag-check" style={{ fontSize: '4rem', color: '#4facfe' }}></i>
                    <h4 className="mt-3 mb-3" style={{ fontWeight: '700', color: '#2d3748' }}>
                      Meus Pedidos
                    </h4>
                    <p className="text-muted mb-4" style={{ fontSize: '1.1rem' }}>
                      Funcionalidade em desenvolvimento. Aqui você poderá visualizar todos os seus pedidos.
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

        {/* Favoritos */}
        {activeTab === 'favorites' && (
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
                    <i className="bi bi-heart-fill" style={{ fontSize: '4rem', color: '#f093fb' }}></i>
                    <h4 className="mt-3 mb-3" style={{ fontWeight: '700', color: '#2d3748' }}>
                      Lojas Favoritas
                    </h4>
                    <p className="text-muted mb-4" style={{ fontSize: '1.1rem' }}>
                      Funcionalidade em desenvolvimento. Aqui você poderá gerenciar suas lojas favoritas.
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

        {/* Configurações */}
        {activeTab === 'settings' && (
          <UserSettings />
        )}
      </div>
    </div>
  );
}