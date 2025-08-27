"use client";

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import UserSettings from '@/components/UserSettings';

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
    { title: 'Vendas de Hoje', value: 'R$ 2.890', change: '+12%', icon: 'bi-cash-stack', color: '#667eea', description: 'Comparado com ontem' },
    { title: 'Pedidos Ativos', value: '24', change: '+8%', icon: 'bi-clock-history', color: '#f093fb', description: 'Aguardando preparo' },
    { title: 'Produtos Cadastrados', value: '156', change: '+3', icon: 'bi-box-seam', color: '#4facfe', description: 'Itens no cardápio' },
    { title: 'Taxa de Conversão', value: '73%', change: '+5%', icon: 'bi-graph-up-arrow', color: '#43e97b', description: 'Vendas vs visitas' },
    { title: 'Estoque Baixo', value: '8', change: '-2', icon: 'bi-exclamation-triangle', color: '#fd79a8', description: 'Itens para repor' },
    { title: 'Receita Mensal', value: 'R$ 45.230', change: '+18%', icon: 'bi-currency-dollar', color: '#38ef7d', description: 'Meta: R$ 50.000' }
  ];

  const recentOrders = [
    { id: '#1234', customer: 'João Silva', items: '2x Pizza Margherita', value: 'R$ 45,90', status: 'Preparando', time: '5 min' },
    { id: '#1235', customer: 'Maria Santos', items: '1x Hambúrguer Artesanal', value: 'R$ 28,50', status: 'Pronto', time: '2 min' },
    { id: '#1236', customer: 'Carlos Lima', items: '3x Açaí 500ml', value: 'R$ 36,00', status: 'Entregue', time: '15 min' },
    { id: '#1237', customer: 'Ana Costa', items: '1x Salada Caesar', value: 'R$ 22,90', status: 'Preparando', time: '8 min' }
  ];

  const topProducts = [
    { name: 'Pizza Margherita', sales: 45, revenue: 'R$ 1.350', trend: '+15%', color: '#667eea' },
    { name: 'Hambúrguer Artesanal', sales: 32, revenue: 'R$ 912', trend: '+8%', color: '#f093fb' },
    { name: 'Açaí 500ml', sales: 28, revenue: 'R$ 336', trend: '+22%', color: '#4facfe' },
    { name: 'Salada Caesar', sales: 19, revenue: 'R$ 435', trend: '-3%', color: '#43e97b' }
  ];

  return (
    <div className="logista-dashboard">
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
                  <div key={index} className="col-xl-2 col-lg-4 col-md-6 fade-in-up">
                    <div 
                      className="card border-0 h-100 stat-card glass-card"
                      style={{
                        borderRadius: '20px',
                        transition: 'all 0.3s ease',
                        cursor: 'pointer'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-8px)';
                        e.currentTarget.style.boxShadow = `0 20px 40px ${stat.color}20`;
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
                              background: `linear-gradient(135deg, ${stat.color} 0%, ${stat.color}CC 100%)`,
                              width: '60px',
                              height: '60px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              boxShadow: `0 8px 20px ${stat.color}30`
                            }}
                          >
                            <i className={`${stat.icon} text-white`} style={{ fontSize: '1.4rem' }}></i>
                          </div>
                          <div className={`badge px-2 py-1 rounded-pill ${stat.change.includes('+') ? 'bg-success' : 'bg-danger'}`}>
                            <i className={`bi bi-arrow-${stat.change.includes('+') ? 'up' : 'down'} me-1`}></i>
                            {stat.change}
                          </div>
                        </div>
                        <div>
                          <div className="fw-bold text-muted small mb-1">{stat.title}</div>
                          <div className="h4 mb-1" style={{ fontWeight: '800', color: '#2d3748' }}>
                            {stat.value}
                          </div>
                          <div className="small text-muted">
                            {stat.description}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Orders & Top Products */}
            <div className="col-lg-8 fade-in-up">
              <div className="card border-0 h-100 glass-card"
                style={{
                  borderRadius: '20px'
                }}
              >
                <div className="card-body p-4">
                  <div className="d-flex align-items-center justify-content-between mb-4">
                    <h5 className="mb-0" style={{ fontWeight: '700', color: '#2d3748' }}>
                      <i className="bi bi-clock-history me-2" style={{ color: '#667eea' }}></i>
                      Pedidos Recentes
                    </h5>
                    <button className="btn btn-outline-primary btn-sm rounded-pill">
                      <i className="bi bi-arrow-right me-1"></i>
                      Ver Todos
                    </button>
                  </div>
                  <div className="table-responsive">
                    <table className="table table-hover">
                      <thead>
                        <tr style={{ borderBottom: '2px solid #f8f9fa' }}>
                          <th className="border-0 text-muted fw-600 small">PEDIDO</th>
                          <th className="border-0 text-muted fw-600 small">CLIENTE</th>
                          <th className="border-0 text-muted fw-600 small">ITENS</th>
                          <th className="border-0 text-muted fw-600 small">VALOR</th>
                          <th className="border-0 text-muted fw-600 small">STATUS</th>
                          <th className="border-0 text-muted fw-600 small">TEMPO</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentOrders.map((order, index) => (
                          <tr key={index} style={{ borderBottom: '1px solid #f8f9fa' }}>
                            <td className="border-0 py-3">
                              <span className="fw-bold" style={{ color: '#667eea' }}>{order.id}</span>
                            </td>
                            <td className="border-0 py-3">
                              <div className="fw-600">{order.customer}</div>
                            </td>
                            <td className="border-0 py-3">
                              <div className="text-muted small">{order.items}</div>
                            </td>
                            <td className="border-0 py-3">
                              <div className="fw-bold" style={{ color: '#43e97b' }}>{order.value}</div>
                            </td>
                            <td className="border-0 py-3">
                              <span className={`badge px-3 py-2 rounded-pill ${
                                order.status === 'Pronto' ? 'bg-success' :
                                order.status === 'Preparando' ? 'bg-warning text-dark' :
                                'bg-secondary'
                              }`}>
                                {order.status}
                              </span>
                            </td>
                            <td className="border-0 py-3">
                              <div className="small text-muted">{order.time}</div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-4 fade-in-up">
              <div className="card border-0 h-100 glass-card"
                style={{
                  borderRadius: '20px'
                }}
              >
                <div className="card-body p-4">
                  <h5 className="mb-4" style={{ fontWeight: '700', color: '#2d3748' }}>
                    <i className="bi bi-star me-2" style={{ color: '#f093fb' }}></i>
                    Top Produtos
                  </h5>
                  <div className="space-y-4">
                    {topProducts.map((product, index) => (
                      <div key={index} className="d-flex align-items-center mb-4">
                        <div 
                          className="rounded-circle me-3 d-flex align-items-center justify-content-center"
                          style={{
                            width: '50px',
                            height: '50px',
                            background: `linear-gradient(135deg, ${product.color} 0%, ${product.color}CC 100%)`,
                            color: 'white',
                            fontWeight: '700'
                          }}
                        >
                          #{index + 1}
                        </div>
                        <div className="flex-grow-1">
                          <div className="fw-bold mb-1" style={{ color: '#2d3748' }}>
                            {product.name}
                          </div>
                          <div className="d-flex align-items-center justify-content-between">
                            <div className="small text-muted">
                              {product.sales} vendas • {product.revenue}
                            </div>
                            <div className={`small fw-bold ${product.trend.includes('+') ? 'text-success' : 'text-danger'}`}>
                              {product.trend}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="col-12 fade-in-up">
              <div className="card border-0 glass-card"
                style={{
                  borderRadius: '20px'
                }}
              >
                <div className="card-body p-5">
                  <h5 className="mb-4" style={{ fontWeight: '700', color: '#2d3748' }}>
                    <i className="bi bi-lightning me-2" style={{ color: '#f093fb' }}></i>
                    Ações Rápidas
                  </h5>
                  <div className="row g-4">
                    <div className="col-lg-3 col-md-6 fade-in-up">
                      <div 
                        className="p-4 rounded-3 text-center position-relative overflow-hidden action-card"
                        style={{
                          background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                          color: 'white',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease'
                        }}
                        onClick={() => setActiveTab('cost-management')}
                      >
                        <div className="position-absolute top-0 end-0 p-2">
                          <i className="bi bi-arrow-right" style={{ fontSize: '1.2rem', opacity: 0.7 }}></i>
                        </div>
                        <i className="bi bi-calculator mb-3" style={{ fontSize: '2.5rem' }}></i>
                        <h6 className="fw-bold mb-2">Gestão de Custos</h6>
                        <p className="small mb-0 opacity-75">Controle seus custos e margem de lucro</p>
                      </div>
                    </div>
                    <div className="col-lg-3 col-md-6">
                      <div 
                        className="p-4 rounded-3 text-center position-relative overflow-hidden"
                        style={{
                          background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                          color: 'white',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease'
                        }}
                        onClick={() => setActiveTab('orders')}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                      >
                        <div className="position-absolute top-0 end-0 p-2">
                          <i className="bi bi-arrow-right" style={{ fontSize: '1.2rem', opacity: 0.7 }}></i>
                        </div>
                        <i className="bi bi-receipt mb-3" style={{ fontSize: '2.5rem' }}></i>
                        <h6 className="fw-bold mb-2">Gerenciar Pedidos</h6>
                        <p className="small mb-0 opacity-75">Visualize e gerencie todos os pedidos</p>
                      </div>
                    </div>
                    <div className="col-lg-3 col-md-6">
                      <div 
                        className="p-4 rounded-3 text-center position-relative overflow-hidden"
                        style={{
                          background: 'linear-gradient(135deg, #43e97b 0%, #38ef7d 100%)',
                          color: 'white',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease'
                        }}
                        onClick={() => setActiveTab('menu')}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                      >
                        <div className="position-absolute top-0 end-0 p-2">
                          <i className="bi bi-arrow-right" style={{ fontSize: '1.2rem', opacity: 0.7 }}></i>
                        </div>
                        <i className="bi bi-menu-button mb-3" style={{ fontSize: '2.5rem' }}></i>
                        <h6 className="fw-bold mb-2">Editar Cardápio</h6>
                        <p className="small mb-0 opacity-75">Atualize produtos e preços</p>
                      </div>
                    </div>
                    <div className="col-lg-3 col-md-6">
                      <div 
                        className="p-4 rounded-3 text-center position-relative overflow-hidden"
                        style={{
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          color: 'white',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease'
                        }}
                        onClick={() => setActiveTab('clients')}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                      >
                        <div className="position-absolute top-0 end-0 p-2">
                          <i className="bi bi-arrow-right" style={{ fontSize: '1.2rem', opacity: 0.7 }}></i>
                        </div>
                        <i className="bi bi-people mb-3" style={{ fontSize: '2.5rem' }}></i>
                        <h6 className="fw-bold mb-2">Base de Clientes</h6>
                        <p className="small mb-0 opacity-75">Gerencie seus clientes e histórico</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Cost Management Tab */}
        {activeTab === 'cost-management' && <CostManagementDashboard />}

        {/* Other Tabs - Enhanced Placeholders */}
        {activeTab === 'orders' && (
          <div className="row g-4">
            <div className="col-12">
              <div 
                className="card border-0"
                style={{
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(20px)',
                  borderRadius: '20px',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
                }}
              >
                <div className="card-body p-5">
                  <div className="text-center">
                    <div 
                      className="rounded-circle d-inline-flex align-items-center justify-content-center mb-4"
                      style={{
                        width: '120px',
                        height: '120px',
                        background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                        boxShadow: '0 20px 40px rgba(79, 172, 254, 0.3)'
                      }}
                    >
                      <i className="bi bi-receipt text-white" style={{ fontSize: '4rem' }}></i>
                    </div>
                    <h3 className="mb-3" style={{ fontWeight: '700', color: '#2d3748' }}>
                      Sistema de Pedidos
                    </h3>
                    <p className="text-muted mb-4" style={{ fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
                      Aqui você terá acesso completo ao sistema de gestão de pedidos, incluindo:
                    </p>
                    <div className="row g-3 mt-4">
                      <div className="col-md-4">
                        <div className="p-3 rounded-3 bg-light">
                          <i className="bi bi-clock-history mb-2" style={{ fontSize: '2rem', color: '#4facfe' }}></i>
                          <h6 className="fw-bold">Pedidos em Tempo Real</h6>
                          <p className="small text-muted mb-0">Visualize e gerencie pedidos conforme chegam</p>
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="p-3 rounded-3 bg-light">
                          <i className="bi bi-graph-up mb-2" style={{ fontSize: '2rem', color: '#43e97b' }}></i>
                          <h6 className="fw-bold">Relatórios Detalhados</h6>
                          <p className="small text-muted mb-0">Análise completa de vendas e performance</p>
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="p-3 rounded-3 bg-light">
                          <i className="bi bi-bell mb-2" style={{ fontSize: '2rem', color: '#f093fb' }}></i>
                          <h6 className="fw-bold">Notificações</h6>
                          <p className="small text-muted mb-0">Alertas instantâneos para novos pedidos</p>
                        </div>
                      </div>
                    </div>
                    <div className="mt-5">
                      <div className="badge bg-info text-white px-4 py-3 rounded-pill" style={{ fontSize: '1rem' }}>
                        <i className="bi bi-gear-fill me-2"></i>
                        Funcionalidade sendo desenvolvida
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'menu' && (
          <div className="row g-4">
            <div className="col-12">
              <div 
                className="card border-0"
                style={{
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(20px)',
                  borderRadius: '20px',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
                }}
              >
                <div className="card-body p-5">
                  <div className="text-center">
                    <div 
                      className="rounded-circle d-inline-flex align-items-center justify-content-center mb-4"
                      style={{
                        width: '120px',
                        height: '120px',
                        background: 'linear-gradient(135deg, #43e97b 0%, #38ef7d 100%)',
                        boxShadow: '0 20px 40px rgba(67, 233, 123, 0.3)'
                      }}
                    >
                      <i className="bi bi-menu-button text-white" style={{ fontSize: '4rem' }}></i>
                    </div>
                    <h3 className="mb-3" style={{ fontWeight: '700', color: '#2d3748' }}>
                      Editor de Cardápio Digital
                    </h3>
                    <p className="text-muted mb-4" style={{ fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
                      Gerencie completamente seu cardápio digital com ferramentas profissionais:
                    </p>
                    <div className="row g-3 mt-4">
                      <div className="col-md-4">
                        <div className="p-3 rounded-3 bg-light">
                          <i className="bi bi-plus-circle mb-2" style={{ fontSize: '2rem', color: '#43e97b' }}></i>
                          <h6 className="fw-bold">Adicionar Produtos</h6>
                          <p className="small text-muted mb-0">Cadastre novos itens com fotos e descrições</p>
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="p-3 rounded-3 bg-light">
                          <i className="bi bi-tags mb-2" style={{ fontSize: '2rem', color: '#f093fb' }}></i>
                          <h6 className="fw-bold">Gestão de Preços</h6>
                          <p className="small text-muted mb-0">Controle preços e promoções facilmente</p>
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="p-3 rounded-3 bg-light">
                          <i className="bi bi-grid mb-2" style={{ fontSize: '2rem', color: '#4facfe' }}></i>
                          <h6 className="fw-bold">Categorias</h6>
                          <p className="small text-muted mb-0">Organize produtos por categorias</p>
                        </div>
                      </div>
                    </div>
                    <div className="mt-5">
                      <div className="badge bg-info text-white px-4 py-3 rounded-pill" style={{ fontSize: '1rem' }}>
                        <i className="bi bi-gear-fill me-2"></i>
                        Funcionalidade sendo desenvolvida
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'clients' && (
          <div className="row g-4">
            <div className="col-12">
              <div 
                className="card border-0"
                style={{
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(20px)',
                  borderRadius: '20px',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
                }}
              >
                <div className="card-body p-5">
                  <div className="text-center">
                    <div 
                      className="rounded-circle d-inline-flex align-items-center justify-content-center mb-4"
                      style={{
                        width: '120px',
                        height: '120px',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        boxShadow: '0 20px 40px rgba(102, 126, 234, 0.3)'
                      }}
                    >
                      <i className="bi bi-people text-white" style={{ fontSize: '4rem' }}></i>
                    </div>
                    <h3 className="mb-3" style={{ fontWeight: '700', color: '#2d3748' }}>
                      Base de Clientes
                    </h3>
                    <p className="text-muted mb-4" style={{ fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
                      Sistema completo de CRM para gerir relacionamento com clientes:
                    </p>
                    <div className="row g-3 mt-4">
                      <div className="col-md-4">
                        <div className="p-3 rounded-3 bg-light">
                          <i className="bi bi-person-plus mb-2" style={{ fontSize: '2rem', color: '#667eea' }}></i>
                          <h6 className="fw-bold">Cadastro de Clientes</h6>
                          <p className="small text-muted mb-0">Gerencie informações e contatos</p>
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="p-3 rounded-3 bg-light">
                          <i className="bi bi-clock-history mb-2" style={{ fontSize: '2rem', color: '#43e97b' }}></i>
                          <h6 className="fw-bold">Histórico de Pedidos</h6>
                          <p className="small text-muted mb-0">Acompanhe preferências e frequência</p>
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="p-3 rounded-3 bg-light">
                          <i className="bi bi-heart mb-2" style={{ fontSize: '2rem', color: '#f093fb' }}></i>
                          <h6 className="fw-bold">Programa Fidelidade</h6>
                          <p className="small text-muted mb-0">Recompense clientes fiéis</p>
                        </div>
                      </div>
                    </div>
                    <div className="mt-5">
                      <div className="badge bg-info text-white px-4 py-3 rounded-pill" style={{ fontSize: '1rem' }}>
                        <i className="bi bi-gear-fill me-2"></i>
                        Funcionalidade sendo desenvolvida
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <UserSettings />
        )}
      </div>
    </div>
  );
}