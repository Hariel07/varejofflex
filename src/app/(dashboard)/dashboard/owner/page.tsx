"use client";

import { useAuthUser } from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import CouponsManagement from "@/components/dashboard/CouponsManagement";

export default function OwnerDashboard() {
  const { user, isLoading } = useAuthUser();
  const [mounted, setMounted] = useState(false);
  const [dashboardData, setDashboardData] = useState({
    totalStores: 0,
    totalCustomers: 0,
    monthlyRevenue: 0,
    activeStoreowners: 0
  });

  const [pricingData, setPricingData] = useState({
    basic: { price: 49, promotion: null },
    pro: { price: 149, promotion: { discount: 20, until: "2025-09-30" } },
    ultra: { price: 299, promotion: null }
  });

  useEffect(() => {
    setMounted(true);
    // Simulate loading dashboard data
    setTimeout(() => {
      setDashboardData({
        totalStores: 1247,
        totalCustomers: 15832,
        monthlyRevenue: 387500,
        activeStoreowners: 892
      });
    }, 1000);
  }, []);

  if (!mounted || isLoading) {
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: 'linear-gradient(135deg, #F8FAFC 0%, #E2E8F0 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#1E293B'
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '20px'
        }}>
          <div style={{
            width: '60px',
            height: '60px',
            border: '3px solid #3B82F6',
            borderTop: '3px solid transparent',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}></div>
          <p style={{ fontSize: '1.1rem', color: '#64748B' }}>
            Inicializando sistema futurístico...
          </p>
        </div>
        <style jsx>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (!user) {
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: 'linear-gradient(135deg, #F8FAFC 0%, #E2E8F0 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          background: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(20px)',
          padding: '40px',
          borderRadius: '20px',
          border: '1px solid rgba(59, 130, 246, 0.2)',
          boxShadow: '0 25px 50px rgba(0, 0, 0, 0.1)',
          textAlign: 'center',
          color: '#1E293B'
        }}>
          <h3 style={{ color: '#3B82F6', marginBottom: '20px' }}>⚠️ Acesso Negado</h3>
          <p style={{ color: '#64748B', marginBottom: '20px' }}>
            Credenciais não encontradas no sistema.
          </p>
          <a 
            href="/login" 
            style={{
              background: 'linear-gradient(135deg, #3B82F6 0%, #06B6D4 100%)',
              color: 'white',
              padding: '12px 24px',
              border: 'none',
              borderRadius: '12px',
              textDecoration: 'none',
              display: 'inline-block',
              fontWeight: 'bold',
              boxShadow: '0 10px 25px rgba(59, 130, 246, 0.3)'
            }}
          >
            🔐 Fazer Login
          </a>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: 'linear-gradient(135deg, #F8FAFC 0%, #E2E8F0 100%)',
      overflow: 'auto',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* Header */}
      <header style={{
        background: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(59, 130, 246, 0.2)',
        padding: '20px 40px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <h1 style={{
              color: '#1E293B',
              fontSize: '2rem',
              fontWeight: 'bold',
              margin: 0,
              background: 'linear-gradient(135deg, #3B82F6 0%, #06B6D4 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              � VarejoFlex Command Center
            </h1>
            <p style={{
              color: '#64748B',
              margin: '5px 0 0 0',
              fontSize: '1rem'
            }}>
              Bem-vindo de volta, {user.name} | Sistema Operacional
            </p>
          </div>
          
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '20px'
          }}>
            <div style={{
              background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
              color: 'white',
              padding: '8px 16px',
              borderRadius: '25px',
              fontSize: '0.9rem',
              fontWeight: 'bold',
              boxShadow: '0 10px 25px rgba(16, 185, 129, 0.3)'
            }}>
              🟢 Sistema Online
            </div>
            
            <button
              onClick={() => window.location.href = '/login'}
              style={{
                background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '12px',
                cursor: 'pointer',
                fontWeight: 'bold',
                boxShadow: '0 10px 25px rgba(239, 68, 68, 0.3)'
              }}
            >
              🚪 Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ padding: '40px' }}>
        {/* KPIs Section */}
        <section style={{ marginBottom: '40px' }}>
          <h2 style={{
            color: '#1E293B',
            fontSize: '1.5rem',
            marginBottom: '25px',
            fontWeight: 'bold'
          }}>
            📊 Métricas do Sistema
          </h2>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '25px'
          }}>
            {/* KPI Card 1 */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(59, 130, 246, 0.2)',
              borderRadius: '20px',
              padding: '25px',
              boxShadow: '0 25px 50px rgba(0, 0, 0, 0.1)',
              transition: 'all 0.3s ease'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '15px'
              }}>
                <h3 style={{
                  color: '#3B82F6',
                  fontSize: '1rem',
                  margin: 0,
                  fontWeight: 'bold'
                }}>
                  🏪 Lojistas Ativos
                </h3>
                <span style={{
                  background: 'linear-gradient(135deg, #3B82F6 0%, #06B6D4 100%)',
                  color: 'white',
                  padding: '4px 12px',
                  borderRadius: '15px',
                  fontSize: '0.8rem',
                  fontWeight: 'bold'
                }}>
                  +12% ↗
                </span>
              </div>
              <p style={{
                color: '#1E293B',
                fontSize: '2.5rem',
                fontWeight: 'bold',
                margin: 0,
                background: 'linear-gradient(135deg, #3B82F6 0%, #06B6D4 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                {dashboardData.activeStoreowners.toLocaleString()}
              </p>
            </div>

            {/* KPI Card 2 */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(16, 185, 129, 0.2)',
              borderRadius: '20px',
              padding: '25px',
              boxShadow: '0 25px 50px rgba(0, 0, 0, 0.1)'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '15px'
              }}>
                <h3 style={{
                  color: '#10B981',
                  fontSize: '1rem',
                  margin: 0,
                  fontWeight: 'bold'
                }}>
                  🛍️ Lojas Totais
                </h3>
                <span style={{
                  background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                  color: 'white',
                  padding: '4px 12px',
                  borderRadius: '15px',
                  fontSize: '0.8rem',
                  fontWeight: 'bold'
                }}>
                  +8% ↗
                </span>
              </div>
              <p style={{
                color: '#1E293B',
                fontSize: '2.5rem',
                fontWeight: 'bold',
                margin: 0,
                background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                {dashboardData.totalStores.toLocaleString()}
              </p>
            </div>

            {/* KPI Card 3 */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(245, 158, 11, 0.2)',
              borderRadius: '20px',
              padding: '25px',
              boxShadow: '0 25px 50px rgba(0, 0, 0, 0.1)'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '15px'
              }}>
                <h3 style={{
                  color: '#F59E0B',
                  fontSize: '1rem',
                  margin: 0,
                  fontWeight: 'bold'
                }}>
                  👥 Clientes Totais
                </h3>
                <span style={{
                  background: 'linear-gradient(135deg, #F59E0B 0%, #EAB308 100%)',
                  color: 'white',
                  padding: '4px 12px',
                  borderRadius: '15px',
                  fontSize: '0.8rem',
                  fontWeight: 'bold'
                }}>
                  +24% ↗
                </span>
              </div>
              <p style={{
                color: '#1E293B',
                fontSize: '2.5rem',
                fontWeight: 'bold',
                margin: 0,
                background: 'linear-gradient(135deg, #F59E0B 0%, #EAB308 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                {dashboardData.totalCustomers.toLocaleString()}
              </p>
            </div>

            {/* KPI Card 4 */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(139, 92, 246, 0.2)',
              borderRadius: '20px',
              padding: '25px',
              boxShadow: '0 25px 50px rgba(0, 0, 0, 0.1)'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '15px'
              }}>
                <h3 style={{
                  color: '#8B5CF6',
                  fontSize: '1rem',
                  margin: 0,
                  fontWeight: 'bold'
                }}>
                  💰 Receita MRR
                </h3>
                <span style={{
                  background: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
                  color: 'white',
                  padding: '4px 12px',
                  borderRadius: '15px',
                  fontSize: '0.8rem',
                  fontWeight: 'bold'
                }}>
                  +15% ↗
                </span>
              </div>
              <p style={{
                color: '#1E293B',
                fontSize: '2.5rem',
                fontWeight: 'bold',
                margin: 0,
                background: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                R$ {dashboardData.monthlyRevenue.toLocaleString()}
              </p>
            </div>
          </div>
        </section>

        {/* Pricing Control Section */}
        <section style={{ marginBottom: '40px' }}>
          <h2 style={{
            color: '#1E293B',
            fontSize: '1.5rem',
            marginBottom: '25px',
            fontWeight: 'bold'
          }}>
            🎯 Controle de Preços - Landing Page
          </h2>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '25px'
          }}>
            {/* Basic Plan */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(100, 116, 139, 0.2)',
              borderRadius: '20px',
              padding: '25px',
              boxShadow: '0 25px 50px rgba(0, 0, 0, 0.1)'
            }}>
              <div style={{
                textAlign: 'center',
                marginBottom: '20px'
              }}>
                <h3 style={{
                  color: '#64748B',
                  fontSize: '1.3rem',
                  margin: '0 0 10px 0',
                  fontWeight: 'bold'
                }}>
                  📱 BÁSICO
                </h3>
                <div style={{
                  color: '#1E293B',
                  fontSize: '2.5rem',
                  fontWeight: 'bold',
                  marginBottom: '10px'
                }}>
                  R$ {pricingData.basic.price}
                  <span style={{
                    fontSize: '1rem',
                    color: '#64748B',
                    fontWeight: 'normal'
                  }}>
                    /mês
                  </span>
                </div>
                
                <button style={{
                  background: 'linear-gradient(135deg, #3B82F6 0%, #06B6D4 100%)',
                  color: 'white',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  width: '100%',
                  marginBottom: '15px',
                  boxShadow: '0 10px 25px rgba(59, 130, 246, 0.3)'
                }}>
                  ✏️ Editar Preço
                </button>
                
                <button style={{
                  background: 'linear-gradient(135deg, #F59E0B 0%, #EAB308 100%)',
                  color: 'white',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  width: '100%',
                  fontSize: '0.9rem',
                  boxShadow: '0 10px 25px rgba(245, 158, 11, 0.3)'
                }}>
                  🎯 Criar Promoção
                </button>
              </div>
            </div>

            {/* Pro Plan */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(59, 130, 246, 0.3)',
              borderRadius: '20px',
              padding: '25px',
              boxShadow: '0 25px 50px rgba(59, 130, 246, 0.2)',
              position: 'relative'
            }}>
              <div style={{
                position: 'absolute',
                top: '-10px',
                left: '50%',
                transform: 'translateX(-50%)',
                background: 'linear-gradient(135deg, #3B82F6 0%, #06B6D4 100%)',
                color: 'white',
                padding: '6px 20px',
                borderRadius: '20px',
                fontSize: '0.8rem',
                fontWeight: 'bold',
                boxShadow: '0 10px 25px rgba(59, 130, 246, 0.4)'
              }}>
                ⭐ POPULAR
              </div>
              
              <div style={{
                textAlign: 'center',
                marginBottom: '20px',
                marginTop: '10px'
              }}>
                <h3 style={{
                  color: '#3B82F6',
                  fontSize: '1.3rem',
                  margin: '0 0 10px 0',
                  fontWeight: 'bold'
                }}>
                  🚀 PROFISSIONAL
                </h3>
                <div style={{
                  color: '#1E293B',
                  fontSize: '2.5rem',
                  fontWeight: 'bold',
                  marginBottom: '5px'
                }}>
                  <span style={{
                    textDecoration: 'line-through',
                    color: '#64748B',
                    fontSize: '1.5rem'
                  }}>
                    R$ {pricingData.pro.price}
                  </span>
                  {' '}
                  R$ {Math.round(pricingData.pro.price * (1 - pricingData.pro.promotion.discount / 100))}
                  <span style={{
                    fontSize: '1rem',
                    color: '#64748B',
                    fontWeight: 'normal'
                  }}>
                    /mês
                  </span>
                </div>
                <div style={{
                  background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
                  color: 'white',
                  padding: '4px 12px',
                  borderRadius: '15px',
                  fontSize: '0.8rem',
                  fontWeight: 'bold',
                  marginBottom: '15px',
                  display: 'inline-block'
                }}>
                  🔥 {pricingData.pro.promotion.discount}% OFF até {new Date(pricingData.pro.promotion.until).toLocaleDateString()}
                </div>
                
                <button style={{
                  background: 'linear-gradient(135deg, #3B82F6 0%, #06B6D4 100%)',
                  color: 'white',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  width: '100%',
                  marginBottom: '10px',
                  boxShadow: '0 10px 25px rgba(59, 130, 246, 0.3)'
                }}>
                  ✏️ Editar Preço
                </button>
                
                <button style={{
                  background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
                  color: 'white',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  width: '100%',
                  fontSize: '0.9rem',
                  boxShadow: '0 10px 25px rgba(239, 68, 68, 0.3)'
                }}>
                  🚫 Remover Promoção
                </button>
              </div>
            </div>

            {/* Ultra Plan */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(139, 92, 246, 0.2)',
              borderRadius: '20px',
              padding: '25px',
              boxShadow: '0 25px 50px rgba(139, 92, 246, 0.1)'
            }}>
              <div style={{
                textAlign: 'center',
                marginBottom: '20px'
              }}>
                <h3 style={{
                  color: '#8B5CF6',
                  fontSize: '1.3rem',
                  margin: '0 0 10px 0',
                  fontWeight: 'bold'
                }}>
                  ⚡ ULTRA
                </h3>
                <div style={{
                  color: '#1E293B',
                  fontSize: '2.5rem',
                  fontWeight: 'bold',
                  marginBottom: '10px'
                }}>
                  R$ {pricingData.ultra.price}
                  <span style={{
                    fontSize: '1rem',
                    color: '#64748B',
                    fontWeight: 'normal'
                  }}>
                    /mês
                  </span>
                </div>
                
                <button style={{
                  background: 'linear-gradient(135deg, #3B82F6 0%, #06B6D4 100%)',
                  color: 'white',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  width: '100%',
                  marginBottom: '15px',
                  boxShadow: '0 10px 25px rgba(59, 130, 246, 0.3)'
                }}>
                  ✏️ Editar Preço
                </button>
                
                <button style={{
                  background: 'linear-gradient(135deg, #F59E0B 0%, #EAB308 100%)',
                  color: 'white',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  width: '100%',
                  fontSize: '0.9rem',
                  boxShadow: '0 10px 25px rgba(245, 158, 11, 0.3)'
                }}>
                  🎯 Criar Promoção
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Coupons Management Section */}
        <CouponsManagement />
      </main>
    </div>
  );
}