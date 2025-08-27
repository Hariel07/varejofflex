"use client";

import Link from "next/link";
import PricingSection from "@/components/PricingSection";

export default function HomePage() {
  // Função para fechar o menu mobile
  const closeNavbar = () => {
    const navbarCollapse = document.getElementById('navbarNav');
    if (navbarCollapse && window.innerWidth < 992) {
      const isOpen = navbarCollapse.classList.contains('show');
      if (isOpen) {
        navbarCollapse.classList.remove('show');
      }
    }
  };

  return (
    <>
      {/* Header/Menu Fixo */}
      <header style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(20px)',
        zIndex: 1000,
        borderBottom: '1px solid rgba(59, 130, 246, 0.1)',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
      }}>
        <div className="container">
          <nav className="navbar navbar-expand-lg navbar-light" style={{ padding: '1rem 0' }}>
            {/* Logo */}
            <a className="navbar-brand" href="/" style={{
              fontSize: '1.5rem',
              fontWeight: 'bold',
              background: 'linear-gradient(135deg, #3B82F6 0%, #06B6D4 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              textDecoration: 'none'
            }}>
              Varejofflex
            </a>

            {/* Botão Hamburger para Mobile */}
            <button 
              className="navbar-toggler border-0" 
              type="button" 
              data-bs-toggle="collapse" 
              data-bs-target="#navbarNav" 
              aria-controls="navbarNav" 
              aria-expanded="false" 
              aria-label="Toggle navigation"
              style={{
                background: 'linear-gradient(135deg, #3B82F6 0%, #06B6D4 100%)',
                borderRadius: '8px',
                padding: '0.5rem 0.75rem'
              }}
            >
              <i className="bi bi-list text-white fs-5"></i>
            </button>

            {/* Menu de Navegação Colapsável */}
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav ms-auto align-items-center">
                <li className="nav-item">
                  <a className="nav-link" href="#demos" 
                     onClick={closeNavbar}
                     style={{
                    color: '#1E293B',
                    fontWeight: '500',
                    transition: 'color 0.3s ease',
                    margin: '0 0.5rem'
                  }}>Demos</a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="#iot" 
                     onClick={closeNavbar}
                     style={{
                    color: '#1E293B',
                    fontWeight: '500',
                    transition: 'color 0.3s ease',
                    margin: '0 0.5rem'
                  }}>IoT</a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="#pricing" 
                     onClick={closeNavbar}
                     style={{
                    color: '#1E293B',
                    fontWeight: '500',
                    transition: 'color 0.3s ease',
                    margin: '0 0.5rem'
                  }}>Planos</a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="#features" 
                     onClick={closeNavbar}
                     style={{
                    color: '#1E293B',
                    fontWeight: '500',
                    transition: 'color 0.3s ease',
                    margin: '0 0.5rem'
                  }}>Recursos</a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="#testimonials" 
                     onClick={closeNavbar}
                     style={{
                    color: '#1E293B',
                    fontWeight: '500',
                    transition: 'color 0.3s ease',
                    margin: '0 0.5rem'
                  }}>Depoimentos</a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="#faq" 
                     onClick={closeNavbar}
                     style={{
                    color: '#1E293B',
                    fontWeight: '500',
                    transition: 'color 0.3s ease',
                    margin: '0 0.5rem'
                  }}>FAQ</a>
                </li>
                
                {/* Separador visual no mobile */}
                <li className="nav-item d-lg-none" style={{ margin: '0.25rem 0' }}>
                  <hr style={{ 
                    borderColor: 'rgba(59, 130, 246, 0.2)', 
                    margin: '0.25rem 1rem',
                    opacity: 0.5
                  }} />
                </li>
                
                {/* Botões de Ação */}
                <li className="nav-item" style={{ margin: '0.25rem 0.25rem' }}>
                  <a href="/login" className="nav-link" style={{
                    color: '#3B82F6',
                    fontWeight: '600',
                    padding: '0.5rem 1.5rem',
                    borderRadius: '8px',
                    transition: 'all 0.3s ease',
                    textAlign: 'center',
                    border: '2px solid #3B82F6'
                  }}>
                    Entrar
                  </a>
                </li>
              </ul>
            </div>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #F8FAFC 0%, #E2E8F0 100%)',
        position: 'relative',
        overflow: 'hidden',
        paddingTop: '100px' // Compensar header fixo
      }} id="hero">
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'radial-gradient(circle at 30% 20%, rgba(59, 130, 246, 0.1) 0%, transparent 50%), radial-gradient(circle at 70% 80%, rgba(16, 185, 129, 0.1) 0%, transparent 50%)',
          pointerEvents: 'none'
        }}></div>
        <div className="container position-relative">
          <div className="row align-items-center min-vh-100 py-5">
            <div className="col-lg-6">
              <div style={{
                background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                color: 'white',
                padding: '8px 20px',
                borderRadius: '20px',
                display: 'inline-block',
                fontSize: '1rem',
                fontWeight: 'bold',
                marginBottom: '2rem',
                boxShadow: '0 10px 25px rgba(16, 185, 129, 0.3)'
              }}>
                🚀 Mais de 10.000 negócios transformados
              </div>
              <h1 style={{
                fontSize: '3.5rem',
                fontWeight: 'bold',
                marginBottom: '2rem',
                color: '#1E293B',
                lineHeight: '1.1'
              }}>
                Revolucione seu negócio com
                <span style={{
                  display: 'block',
                  background: 'linear-gradient(135deg, #3B82F6 0%, #06B6D4 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}>tecnologia de ponta</span>
              </h1>
              <p style={{
                fontSize: '1.25rem',
                marginBottom: '3rem',
                color: '#64748B',
                lineHeight: '1.6'
              }}>
                PDV inteligente, loja online profissional, delivery otimizado e IA integrada. 
                Tudo em uma plataforma que cresce com você.
              </p>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '1.5rem',
                marginBottom: '3rem'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  color: '#1E293B'
                }}>
                  <i className="bi bi-check-circle-fill text-success me-3 fs-5"></i>
                  <span style={{ fontWeight: '500' }}>Setup em 5 minutos</span>
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  color: '#1E293B'
                }}>
                  <i className="bi bi-check-circle-fill text-success me-3 fs-5"></i>
                  <span style={{ fontWeight: '500' }}>Suporte 24/7</span>
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  color: '#1E293B'
                }}>
                  <i className="bi bi-check-circle-fill text-success me-3 fs-5"></i>
                  <span style={{ fontWeight: '500' }}>Sem taxas ocultas</span>
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  color: '#1E293B'
                }}>
                  <i className="bi bi-check-circle-fill text-success me-3 fs-5"></i>
                  <span style={{ fontWeight: '500' }}>Cancele quando quiser</span>
                </div>
              </div>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
                marginBottom: '3rem'
              }}>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  <a href="#demos" style={{
                    background: 'linear-gradient(135deg, #F59E0B 0%, #EAB308 100%)',
                    color: 'white',
                    padding: '15px 30px',
                    borderRadius: '15px',
                    textDecoration: 'none',
                    fontWeight: 'bold',
                    fontSize: '1.1rem',
                    display: 'flex',
                    alignItems: 'center',
                    boxShadow: '0 10px 25px rgba(245, 158, 11, 0.3)',
                    transition: 'all 0.3s ease'
                  }}>
                    <i className="bi bi-play-circle me-2" />
                    Ver Demos por Segmento
                  </a>
                  <a href="#pricing" style={{
                    background: 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(20px)',
                    color: '#1E293B',
                    padding: '15px 30px',
                    borderRadius: '15px',
                    textDecoration: 'none',
                    fontWeight: 'bold',
                    fontSize: '1.1rem',
                    display: 'flex',
                    alignItems: 'center',
                    border: '1px solid rgba(59, 130, 246, 0.2)',
                    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
                    transition: 'all 0.3s ease'
                  }}>
                    <i className="bi bi-calculator me-2" />
                    Calcular Investimento
                  </a>
                </div>
              </div>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '2rem',
                textAlign: 'center',
                marginTop: '2rem'
              }}>
                <div>
                  <div style={{
                    color: '#F59E0B',
                    fontSize: '2rem',
                    fontWeight: 'bold',
                    marginBottom: '0.5rem'
                  }}>4.9/5</div>
                  <small style={{ color: '#64748B' }}>Avaliação</small>
                </div>
                <div>
                  <div style={{
                    color: '#10B981',
                    fontSize: '2rem',
                    fontWeight: 'bold',
                    marginBottom: '0.5rem'
                  }}>99.9%</div>
                  <small style={{ color: '#64748B' }}>Uptime</small>
                </div>
                <div>
                  <div style={{
                    color: '#3B82F6',
                    fontSize: '2rem',
                    fontWeight: 'bold',
                    marginBottom: '0.5rem'
                  }}>24h</div>
                  <small style={{ color: '#64748B' }}>Suporte</small>
                </div>
              </div>
            </div>
            <div className="col-lg-6 text-center">
              <div style={{ position: 'relative' }}>
                <div style={{
                  background: 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(20px)',
                  borderRadius: '25px',
                  padding: '2rem',
                  boxShadow: '0 25px 50px rgba(0, 0, 0, 0.1)',
                  border: '1px solid rgba(59, 130, 246, 0.2)',
                  display: 'inline-block',
                  maxWidth: '500px'
                }}>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr',
                    gap: '1.5rem'
                  }}>
                    <div style={{
                      background: 'linear-gradient(135deg, #3B82F6 0%, #06B6D4 100%)',
                      color: 'white',
                      borderRadius: '15px',
                      padding: '1.5rem',
                      textAlign: 'center',
                      boxShadow: '0 10px 25px rgba(59, 130, 246, 0.3)'
                    }}>
                      <i className="bi bi-graph-up-arrow fs-1 mb-2"></i>
                      <h5 style={{ margin: 0, fontWeight: 'bold' }}>Dashboard Inteligente</h5>
                    </div>
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: '1rem'
                    }}>
                      <div style={{
                        background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                        color: 'white',
                        borderRadius: '15px',
                        padding: '1.5rem',
                        textAlign: 'center',
                        boxShadow: '0 10px 25px rgba(16, 185, 129, 0.3)'
                      }}>
                        <i className="bi bi-credit-card fs-3"></i>
                        <div style={{ fontWeight: 'bold', marginTop: '0.5rem' }}>PDV</div>
                      </div>
                      <div style={{
                        background: 'linear-gradient(135deg, #F59E0B 0%, #EAB308 100%)',
                        color: 'white',
                        borderRadius: '15px',
                        padding: '1.5rem',
                        textAlign: 'center',
                        boxShadow: '0 10px 25px rgba(245, 158, 11, 0.3)'
                      }}>
                        <i className="bi bi-shop fs-3"></i>
                        <div style={{ fontWeight: 'bold', marginTop: '0.5rem' }}>Loja</div>
                      </div>
                      <div style={{
                        background: 'linear-gradient(135deg, #06B6D4 0%, #0891B2 100%)',
                        color: 'white',
                        borderRadius: '15px',
                        padding: '1.5rem',
                        textAlign: 'center',
                        boxShadow: '0 10px 25px rgba(6, 182, 212, 0.3)'
                      }}>
                        <i className="bi bi-truck fs-3"></i>
                        <div style={{ fontWeight: 'bold', marginTop: '0.5rem' }}>Delivery</div>
                      </div>
                      <div style={{
                        background: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
                        color: 'white',
                        borderRadius: '15px',
                        padding: '1.5rem',
                        textAlign: 'center',
                        boxShadow: '0 10px 25px rgba(139, 92, 246, 0.3)'
                      }}>
                        <i className="bi bi-robot fs-3"></i>
                        <div style={{ fontWeight: 'bold', marginTop: '0.5rem' }}>IA</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Demos por Segmento */}
      <section style={{
        padding: '6rem 0',
        background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.03) 0%, rgba(16, 185, 129, 0.05) 50%, rgba(147, 51, 234, 0.03) 100%)',
        position: 'relative',
        overflow: 'hidden'
      }} id="demos">
        {/* Background Pattern */}
        <div 
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: `
              radial-gradient(circle at 20% 20%, rgba(59, 130, 246, 0.08) 0%, transparent 40%),
              radial-gradient(circle at 80% 80%, rgba(16, 185, 129, 0.06) 0%, transparent 40%),
              radial-gradient(circle at 40% 60%, rgba(147, 51, 234, 0.04) 0%, transparent 40%)
            `,
            animation: 'float 8s ease-in-out infinite',
            zIndex: 1
          }}
        />

        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          {/* Header Redesigned */}
          <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '1rem',
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(20px)',
              borderRadius: '50px',
              padding: '0.8rem 2rem',
              marginBottom: '2rem',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}>
              <div style={{ fontSize: '2rem' }}>🎯</div>
              <span style={{
                background: 'linear-gradient(135deg, #3B82F6 0%, #06B6D4 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                fontWeight: '800',
                fontSize: '1.2rem'
              }}>
                EXPERIMENTE NOSSOS SEGMENTOS
              </span>
            </div>

            <h2 style={{
              fontSize: 'clamp(2.5rem, 5vw, 4rem)',
              fontWeight: '900',
              marginBottom: '1.5rem',
              color: '#1E293B',
              lineHeight: '1.1'
            }}>
              Descubra o poder do<br/>
              <span style={{
                background: 'linear-gradient(135deg, #3B82F6 0%, #8B5CF6 50%, #EC4899 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>seu negócio digital</span>
            </h2>
            
            <p style={{
              fontSize: '1.3rem',
              color: '#64748B',
              maxWidth: '800px',
              margin: '0 auto 3rem auto',
              lineHeight: '1.7',
              fontWeight: '500'
            }}>
              Plataformas personalizadas que transformam a forma como você vende.
              <br />
              <strong style={{ color: '#3B82F6' }}>Experimente agora nossa demo de delivery</strong> e veja os próximos lançamentos.
            </p>

            {/* Status Cards */}
            <div className="row g-4 justify-content-center mb-4">
              <div className="col-lg-4 col-md-6">
                <div style={{
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  borderRadius: '24px',
                  padding: '2rem',
                  color: 'white',
                  boxShadow: '0 25px 80px rgba(16, 185, 129, 0.4)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  transform: 'scale(1.05)',
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    position: 'absolute',
                    top: '-50%',
                    right: '-50%',
                    width: '200%',
                    height: '200%',
                    background: 'radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%)',
                    animation: 'spin 20s linear infinite'
                  }}></div>
                  <div style={{ position: 'relative', zIndex: 1 }}>
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🚀</div>
                    <h5 style={{ fontWeight: '900', marginBottom: '0.5rem', fontSize: '1.3rem' }}>
                      DELIVERY LIVE
                    </h5>
                    <p style={{ margin: 0, opacity: 0.9, fontSize: '1rem' }}>
                      Sistema completo e funcional
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="col-lg-4 col-md-6">
                <div style={{
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(20px)',
                  borderRadius: '24px',
                  padding: '2rem',
                  border: '2px solid rgba(251, 191, 36, 0.3)',
                  boxShadow: '0 20px 60px rgba(0, 0, 0, 0.1)'
                }}>
                  <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚡</div>
                  <h5 style={{ fontWeight: '800', marginBottom: '0.5rem', color: '#1e293b', fontSize: '1.3rem' }}>
                    EM PRODUÇÃO
                  </h5>
                  <p style={{ margin: 0, color: '#64748b', fontSize: '1rem' }}>
                    6 segmentos em desenvolvimento
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Demo Principal - Delivery */}
          <div className="row justify-content-center mb-5">
            <div className="col-lg-10">
              <div 
                style={{
                  background: 'rgba(255, 255, 255, 0.98)',
                  backdropFilter: 'blur(30px)',
                  borderRadius: '32px',
                  border: '3px solid transparent',
                  backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.98), rgba(255, 255, 255, 0.98)), linear-gradient(135deg, #10b981, #3b82f6, #8b5cf6)',
                  backgroundOrigin: 'border-box',
                  backgroundClip: 'content-box, border-box',
                  boxShadow: `
                    0 40px 120px rgba(0, 0, 0, 0.15),
                    inset 0 1px 0 rgba(255, 255, 255, 0.9)
                  `,
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                {/* Animated Background */}
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: `
                    radial-gradient(circle at 20% 20%, rgba(16, 185, 129, 0.05) 0%, transparent 50%),
                    radial-gradient(circle at 80% 80%, rgba(59, 130, 246, 0.03) 0%, transparent 50%)
                  `,
                  animation: 'pulse 4s ease-in-out infinite',
                  zIndex: 1
                }}></div>

                {/* Badge Premium */}
                <div style={{
                  position: 'absolute',
                  top: '2rem',
                  right: '2rem',
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  color: 'white',
                  padding: '12px 24px',
                  borderRadius: '25px',
                  fontSize: '0.9rem',
                  fontWeight: '800',
                  boxShadow: '0 12px 30px rgba(16, 185, 129, 0.4)',
                  zIndex: 3,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <div style={{ 
                    width: '8px', 
                    height: '8px', 
                    background: '#22c55e', 
                    borderRadius: '50%',
                    animation: 'pulse 2s infinite'
                  }}></div>
                  AO VIVO
                </div>

                <div className="row align-items-center" style={{ position: 'relative', zIndex: 2, padding: '3rem' }}>
                  {/* Left Side - Content */}
                  <div className="col-lg-6">
                    <div style={{ marginBottom: '2rem' }}>
                      <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '12px',
                        background: 'rgba(16, 185, 129, 0.1)',
                        border: '1px solid rgba(16, 185, 129, 0.3)',
                        borderRadius: '50px',
                        padding: '8px 20px',
                        marginBottom: '1.5rem'
                      }}>
                        <div style={{ fontSize: '1.5rem' }}>🚚</div>
                        <span style={{ color: '#059669', fontWeight: '700', fontSize: '0.9rem' }}>
                          PLATAFORMA DE DELIVERY
                        </span>
                      </div>

                      <h3 style={{
                        fontSize: 'clamp(2rem, 4vw, 3rem)',
                        fontWeight: '900',
                        marginBottom: '1.5rem',
                        color: '#1e293b',
                        lineHeight: '1.2'
                      }}>
                        Sistema Completo de
                        <br />
                        <span style={{
                          background: 'linear-gradient(135deg, #10b981 0%, #3b82f6 100%)',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          backgroundClip: 'text'
                        }}>
                          Delivery Inteligente
                        </span>
                      </h3>

                      <p style={{
                        fontSize: '1.2rem',
                        color: '#64748b',
                        lineHeight: '1.7',
                        marginBottom: '2rem'
                      }}>
                        A plataforma mais avançada para delivery do Brasil. 
                        <strong style={{ color: '#10b981' }}> Testada, aprovada e 100% funcional.</strong>
                      </p>

                      {/* Features Grid */}
                      <div className="row g-3 mb-4">
                        <div className="col-6">
                          <div style={{
                            background: 'rgba(16, 185, 129, 0.08)',
                            borderRadius: '16px',
                            padding: '1.2rem',
                            border: '1px solid rgba(16, 185, 129, 0.2)',
                            transition: 'all 0.3s ease'
                          }}>
                            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📍</div>
                            <h6 style={{ fontWeight: '700', color: '#1e293b', marginBottom: '0.3rem' }}>
                              Rastreamento Live
                            </h6>
                            <small style={{ color: '#64748b' }}>
                              GPS em tempo real
                            </small>
                          </div>
                        </div>
                        <div className="col-6">
                          <div style={{
                            background: 'rgba(59, 130, 246, 0.08)',
                            borderRadius: '16px',
                            padding: '1.2rem',
                            border: '1px solid rgba(59, 130, 246, 0.2)'
                          }}>
                            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>💳</div>
                            <h6 style={{ fontWeight: '700', color: '#1e293b', marginBottom: '0.3rem' }}>
                              Pagamento Smart
                            </h6>
                            <small style={{ color: '#64748b' }}>
                              PIX, cartão, dinheiro
                            </small>
                          </div>
                        </div>
                        <div className="col-6">
                          <div style={{
                            background: 'rgba(147, 51, 234, 0.08)',
                            borderRadius: '16px',
                            padding: '1.2rem',
                            border: '1px solid rgba(147, 51, 234, 0.2)'
                          }}>
                            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>⚡</div>
                            <h6 style={{ fontWeight: '700', color: '#1e293b', marginBottom: '0.3rem' }}>
                              IA Otimizada
                            </h6>
                            <small style={{ color: '#64748b' }}>
                              Rotas inteligentes
                            </small>
                          </div>
                        </div>
                        <div className="col-6">
                          <div style={{
                            background: 'rgba(251, 191, 36, 0.08)',
                            borderRadius: '16px',
                            padding: '1.2rem',
                            border: '1px solid rgba(251, 191, 36, 0.2)'
                          }}>
                            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>⭐</div>
                            <h6 style={{ fontWeight: '700', color: '#1e293b', marginBottom: '0.3rem' }}>
                              Avaliações 5★
                            </h6>
                            <small style={{ color: '#64748b' }}>
                              Sistema completo
                            </small>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Side - Demo Preview */}
                  <div className="col-lg-6">
                    <div style={{
                      background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(59, 130, 246, 0.05))',
                      borderRadius: '24px',
                      padding: '2rem',
                      border: '1px solid rgba(16, 185, 129, 0.2)',
                      position: 'relative',
                      overflow: 'hidden'
                    }}>
                      {/* Mobile Frame */}
                      <div style={{
                        background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
                        borderRadius: '24px',
                        padding: '1.5rem',
                        marginBottom: '1.5rem',
                        position: 'relative',
                        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
                      }}>
                        <div style={{
                          background: 'rgba(255, 255, 255, 0.1)',
                          borderRadius: '20px',
                          width: '60px',
                          height: '4px',
                          margin: '0 auto 1rem auto'
                        }}></div>
                        
                        <div style={{
                          background: 'white',
                          borderRadius: '16px',
                          padding: '1.5rem',
                          minHeight: '200px'
                        }}>
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            marginBottom: '1rem'
                          }}>
                            <div style={{
                              width: '40px',
                              height: '40px',
                              background: 'linear-gradient(135deg, #10b981, #059669)',
                              borderRadius: '12px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: 'white',
                              fontSize: '1.2rem'
                            }}>
                              🚚
                            </div>
                            <div>
                              <div style={{ fontWeight: '700', color: '#1e293b', fontSize: '1rem' }}>
                                VarejoFlex Delivery
                              </div>
                              <div style={{ color: '#64748b', fontSize: '0.8rem' }}>
                                Sistema profissional
                              </div>
                            </div>
                          </div>

                          <div className="row g-2">
                            <div className="col-6">
                              <div style={{
                                background: 'rgba(251, 191, 36, 0.1)',
                                border: '1px solid rgba(251, 191, 36, 0.3)',
                                borderRadius: '12px',
                                padding: '1rem',
                                textAlign: 'center'
                              }}>
                                <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>🍔</div>
                                <div style={{ fontWeight: '600', color: '#1e293b', fontSize: '0.9rem' }}>
                                  Lanchonete
                                </div>
                                <div style={{ color: '#10b981', fontSize: '0.8rem', fontWeight: '600' }}>
                                  32min
                                </div>
                              </div>
                            </div>
                            <div className="col-6">
                              <div style={{
                                background: 'rgba(239, 68, 68, 0.1)',
                                border: '1px solid rgba(239, 68, 68, 0.3)',
                                borderRadius: '12px',
                                padding: '1rem',
                                textAlign: 'center'
                              }}>
                                <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>🍕</div>
                                <div style={{ fontWeight: '600', color: '#1e293b', fontSize: '0.9rem' }}>
                                  Pizzaria
                                </div>
                                <div style={{ color: '#10b981', fontSize: '0.8rem', fontWeight: '600' }}>
                                  38min
                                </div>
                              </div>
                            </div>
                          </div>

                          <div style={{
                            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                            color: 'white',
                            borderRadius: '12px',
                            padding: '1rem',
                            textAlign: 'center',
                            marginTop: '1rem'
                          }}>
                            <div style={{ fontWeight: '700', marginBottom: '0.3rem' }}>
                              ✅ Demo 100% Operacional
                            </div>
                            <div style={{ fontSize: '0.8rem', opacity: 0.9 }}>
                              Clique e teste agora mesmo
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* CTA Button */}
                      <a 
                        href="/vf-delivery-demo.html" 
                        target="_blank"
                        style={{
                          background: 'linear-gradient(135deg, #10b981 0%, #3b82f6 100%)',
                          border: 'none',
                          borderRadius: '20px',
                          padding: '1.2rem 2.5rem',
                          color: 'white',
                          fontWeight: '800',
                          fontSize: '1.1rem',
                          textDecoration: 'none',
                          display: 'block',
                          textAlign: 'center',
                          boxShadow: '0 20px 50px rgba(16, 185, 129, 0.4)',
                          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                          position: 'relative',
                          overflow: 'hidden'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'translateY(-4px) scale(1.02)';
                          e.currentTarget.style.boxShadow = '0 25px 60px rgba(16, 185, 129, 0.6)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'translateY(0) scale(1)';
                          e.currentTarget.style.boxShadow = '0 20px 50px rgba(16, 185, 129, 0.4)';
                        }}
                      >
                        <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
                          <span style={{ fontSize: '1.3rem' }}>🚀</span>
                          Testar Demo Delivery Agora
                          <span style={{ fontSize: '1rem' }}>→</span>
                        </span>
                      </a>

                      <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                        <small style={{ color: '#64748b', fontSize: '0.9rem' }}>
                          <span style={{ color: '#10b981' }}>●</span> Demo abre em nova aba • Sem cadastro necessário
                        </small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Próximos Segmentos */}
          <div style={{ marginTop: '4rem' }}>
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '12px',
                background: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(20px)',
                borderRadius: '50px',
                padding: '0.8rem 2rem',
                marginBottom: '2rem',
                boxShadow: '0 15px 40px rgba(0, 0, 0, 0.1)',
                border: '1px solid rgba(251, 191, 36, 0.3)'
              }}>
                <div style={{ fontSize: '1.5rem' }}>⚡</div>
                <span style={{
                  background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  fontWeight: '800',
                  fontSize: '1rem'
                }}>
                  PRÓXIMOS LANÇAMENTOS
                </span>
              </div>

              <h3 style={{
                fontSize: 'clamp(1.8rem, 3vw, 2.5rem)',
                fontWeight: '800',
                color: '#1e293b',
                marginBottom: '1rem'
              }}>
                Segmentos em Desenvolvimento
              </h3>
              
              <p style={{
                fontSize: '1.1rem',
                color: '#64748b',
                maxWidth: '600px',
                margin: '0 auto',
                lineHeight: '1.6'
              }}>
                Estamos criando experiências únicas para cada tipo de negócio.
                <br />
                <strong style={{ color: '#f59e0b' }}>Em breve, demos específicas para seu segmento!</strong>
              </p>
            </div>

            {/* Grid de Segmentos */}
            <div className="row g-4">
              {/* Lanchonetes */}
              <div className="col-lg-4 col-md-6">
                <div 
                  style={{
                    background: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(20px)',
                    borderRadius: '20px',
                    border: '2px solid rgba(251, 191, 36, 0.2)',
                    boxShadow: '0 15px 40px rgba(0, 0, 0, 0.08)',
                    position: 'relative',
                    overflow: 'hidden',
                    transition: 'all 0.4s ease',
                    height: '100%'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-8px)';
                    e.currentTarget.style.boxShadow = '0 25px 60px rgba(0, 0, 0, 0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 15px 40px rgba(0, 0, 0, 0.08)';
                  }}
                >
                  {/* Progress Bar */}
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '4px',
                    background: 'linear-gradient(90deg, #f59e0b 0%, #d97706 80%, #e5e7eb 80%)',
                    borderRadius: '20px 20px 0 0'
                  }}></div>

                  {/* Status Badge */}
                  <div style={{
                    position: 'absolute',
                    top: '1rem',
                    right: '1rem',
                    background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                    color: 'white',
                    padding: '6px 12px',
                    borderRadius: '20px',
                    fontSize: '0.75rem',
                    fontWeight: '700',
                    zIndex: 2
                  }}>
                    80% concluído
                  </div>

                  <div style={{ padding: '2rem' }}>
                    {/* Icon & Title */}
                    <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                      <div style={{
                        width: '80px',
                        height: '80px',
                        background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                        borderRadius: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '2.5rem',
                        margin: '0 auto 1rem auto',
                        boxShadow: '0 15px 30px rgba(251, 191, 36, 0.3)'
                      }}>
                        🍔
                      </div>
                      <h5 style={{ fontWeight: '800', color: '#1e293b', marginBottom: '0.5rem' }}>
                        Lanchonetes
                      </h5>
                      <p style={{ color: '#64748b', fontSize: '0.9rem', margin: 0 }}>
                        Sistema especializado em fast food
                      </p>
                    </div>

                    {/* Features Preview */}
                    <div style={{ marginBottom: '1.5rem' }}>
                      <h6 style={{ fontWeight: '700', color: '#1e293b', marginBottom: '1rem', fontSize: '0.9rem' }}>
                        🎯 Recursos em desenvolvimento:
                      </h6>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div style={{ width: '6px', height: '6px', background: '#10b981', borderRadius: '50%' }}></div>
                          <small style={{ color: '#4a5568', fontWeight: '500' }}>Cardápio digital responsivo</small>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div style={{ width: '6px', height: '6px', background: '#10b981', borderRadius: '50%' }}></div>
                          <small style={{ color: '#4a5568', fontWeight: '500' }}>Gestão de combos e promoções</small>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div style={{ width: '6px', height: '6px', background: '#f59e0b', borderRadius: '50%' }}></div>
                          <small style={{ color: '#4a5568', fontWeight: '500' }}>Controle de ingredientes</small>
                        </div>
                      </div>
                    </div>

                    {/* Status */}
                    <div style={{
                      background: 'rgba(251, 191, 36, 0.1)',
                      border: '1px solid rgba(251, 191, 36, 0.3)',
                      borderRadius: '12px',
                      padding: '1rem',
                      textAlign: 'center'
                    }}>
                      <div style={{ fontWeight: '700', color: '#d97706', marginBottom: '0.3rem' }}>
                        🚧 Finalização em andamento
                      </div>
                      <small style={{ color: '#64748b' }}>
                        Previsão: próximas semanas
                      </small>
                    </div>
                  </div>
                </div>
              </div>

              {/* Pizzarias - CORRIGIDO O ÍCONE */}
              <div className="col-lg-4 col-md-6">
                <div 
                  style={{
                    background: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(20px)',
                    borderRadius: '20px',
                    border: '2px solid rgba(239, 68, 68, 0.2)',
                    boxShadow: '0 15px 40px rgba(0, 0, 0, 0.08)',
                    position: 'relative',
                    overflow: 'hidden',
                    transition: 'all 0.4s ease',
                    height: '100%'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-8px)';
                    e.currentTarget.style.boxShadow = '0 25px 60px rgba(0, 0, 0, 0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 15px 40px rgba(0, 0, 0, 0.08)';
                  }}
                >
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '4px',
                    background: 'linear-gradient(90deg, #ef4444 0%, #dc2626 75%, #e5e7eb 75%)',
                    borderRadius: '20px 20px 0 0'
                  }}></div>

                  <div style={{
                    position: 'absolute',
                    top: '1rem',
                    right: '1rem',
                    background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                    color: 'white',
                    padding: '6px 12px',
                    borderRadius: '20px',
                    fontSize: '0.75rem',
                    fontWeight: '700',
                    zIndex: 2
                  }}>
                    75% concluído
                  </div>

                  <div style={{ padding: '2rem' }}>
                    <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                      <div style={{
                        width: '80px',
                        height: '80px',
                        background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                        borderRadius: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '2.5rem',
                        margin: '0 auto 1rem auto',
                        boxShadow: '0 15px 30px rgba(239, 68, 68, 0.3)'
                      }}>
                        🍕
                      </div>
                      <h5 style={{ fontWeight: '800', color: '#1e293b', marginBottom: '0.5rem' }}>
                        Pizzarias
                      </h5>
                      <p style={{ color: '#64748b', fontSize: '0.9rem', margin: 0 }}>
                        Plataforma otimizada para delivery
                      </p>
                    </div>

                    <div style={{ marginBottom: '1.5rem' }}>
                      <h6 style={{ fontWeight: '700', color: '#1e293b', marginBottom: '1rem', fontSize: '0.9rem' }}>
                        🎯 Recursos em desenvolvimento:
                      </h6>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div style={{ width: '6px', height: '6px', background: '#10b981', borderRadius: '50%' }}></div>
                          <small style={{ color: '#4a5568', fontWeight: '500' }}>Configurador de sabores</small>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div style={{ width: '6px', height: '6px', background: '#10b981', borderRadius: '50%' }}></div>
                          <small style={{ color: '#4a5568', fontWeight: '500' }}>Tempo de preparo inteligente</small>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div style={{ width: '6px', height: '6px', background: '#f59e0b', borderRadius: '50%' }}></div>
                          <small style={{ color: '#4a5568', fontWeight: '500' }}>KDS para cozinha</small>
                        </div>
                      </div>
                    </div>

                    <div style={{
                      background: 'rgba(239, 68, 68, 0.1)',
                      border: '1px solid rgba(239, 68, 68, 0.3)',
                      borderRadius: '12px',
                      padding: '1rem',
                      textAlign: 'center'
                    }}>
                      <div style={{ fontWeight: '700', color: '#dc2626', marginBottom: '0.3rem' }}>
                        🚧 Finalização em andamento
                      </div>
                      <small style={{ color: '#64748b' }}>
                        Previsão: próximas semanas
                      </small>
                    </div>
                  </div>
                </div>
              </div>

              {/* Moda */}
              <div className="col-lg-4 col-md-6">
                <div 
                  style={{
                    background: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(20px)',
                    borderRadius: '20px',
                    border: '2px solid rgba(147, 51, 234, 0.2)',
                    boxShadow: '0 15px 40px rgba(0, 0, 0, 0.08)',
                    position: 'relative',
                    overflow: 'hidden',
                    transition: 'all 0.4s ease',
                    height: '100%'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-8px)';
                    e.currentTarget.style.boxShadow = '0 25px 60px rgba(0, 0, 0, 0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 15px 40px rgba(0, 0, 0, 0.08)';
                  }}
                >
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '4px',
                    background: 'linear-gradient(90deg, #9333ea 0%, #7c3aed 60%, #e5e7eb 60%)',
                    borderRadius: '20px 20px 0 0'
                  }}></div>

                  <div style={{
                    position: 'absolute',
                    top: '1rem',
                    right: '1rem',
                    background: 'linear-gradient(135deg, #9333ea 0%, #7c3aed 100%)',
                    color: 'white',
                    padding: '6px 12px',
                    borderRadius: '20px',
                    fontSize: '0.75rem',
                    fontWeight: '700',
                    zIndex: 2
                  }}>
                    60% concluído
                  </div>

                  <div style={{ padding: '2rem' }}>
                    <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                      <div style={{
                        width: '80px',
                        height: '80px',
                        background: 'linear-gradient(135deg, #9333ea 0%, #7c3aed 100%)',
                        borderRadius: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '2.5rem',
                        margin: '0 auto 1rem auto',
                        boxShadow: '0 15px 30px rgba(147, 51, 234, 0.3)'
                      }}>
                        👗
                      </div>
                      <h5 style={{ fontWeight: '800', color: '#1e293b', marginBottom: '0.5rem' }}>
                        Moda & Acessórios
                      </h5>
                      <p style={{ color: '#64748b', fontSize: '0.9rem', margin: 0 }}>
                        E-commerce avançado para fashion
                      </p>
                    </div>

                    <div style={{ marginBottom: '1.5rem' }}>
                      <h6 style={{ fontWeight: '700', color: '#1e293b', marginBottom: '1rem', fontSize: '0.9rem' }}>
                        🎯 Recursos em desenvolvimento:
                      </h6>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div style={{ width: '6px', height: '6px', background: '#10b981', borderRadius: '50%' }}></div>
                          <small style={{ color: '#4a5568', fontWeight: '500' }}>Catálogo visual avançado</small>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div style={{ width: '6px', height: '6px', background: '#f59e0b', borderRadius: '50%' }}></div>
                          <small style={{ color: '#4a5568', fontWeight: '500' }}>Gestão de variações</small>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div style={{ width: '6px', height: '6px', background: '#f59e0b', borderRadius: '50%' }}></div>
                          <small style={{ color: '#4a5568', fontWeight: '500' }}>Looks e combinações</small>
                        </div>
                      </div>
                    </div>

                    <div style={{
                      background: 'rgba(147, 51, 234, 0.1)',
                      border: '1px solid rgba(147, 51, 234, 0.3)',
                      borderRadius: '12px',
                      padding: '1rem',
                      textAlign: 'center'
                    }}>
                      <div style={{ fontWeight: '700', color: '#7c3aed', marginBottom: '0.3rem' }}>
                        ⚙️ Em desenvolvimento
                      </div>
                      <small style={{ color: '#64748b' }}>
                        Previsão: próximos meses
                      </small>
                    </div>
                  </div>
                </div>
              </div>

              {/* Mercados */}
              <div className="col-lg-4 col-md-6">
                <div 
                  style={{
                    background: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(20px)',
                    borderRadius: '20px',
                    border: '2px solid rgba(34, 197, 94, 0.2)',
                    boxShadow: '0 15px 40px rgba(0, 0, 0, 0.08)',
                    position: 'relative',
                    overflow: 'hidden',
                    transition: 'all 0.4s ease',
                    height: '100%'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-8px)';
                    e.currentTarget.style.boxShadow = '0 25px 60px rgba(0, 0, 0, 0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 15px 40px rgba(0, 0, 0, 0.08)';
                  }}
                >
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '4px',
                    background: 'linear-gradient(90deg, #22c55e 0%, #16a34a 50%, #e5e7eb 50%)',
                    borderRadius: '20px 20px 0 0'
                  }}></div>

                  <div style={{
                    position: 'absolute',
                    top: '1rem',
                    right: '1rem',
                    background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                    color: 'white',
                    padding: '6px 12px',
                    borderRadius: '20px',
                    fontSize: '0.75rem',
                    fontWeight: '700',
                    zIndex: 2
                  }}>
                    50% concluído
                  </div>

                  <div style={{ padding: '2rem' }}>
                    <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                      <div style={{
                        width: '80px',
                        height: '80px',
                        background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                        borderRadius: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '2.5rem',
                        margin: '0 auto 1rem auto',
                        boxShadow: '0 15px 30px rgba(34, 197, 94, 0.3)'
                      }}>
                        🛒
                      </div>
                      <h5 style={{ fontWeight: '800', color: '#1e293b', marginBottom: '0.5rem' }}>
                        Mercados
                      </h5>
                      <p style={{ color: '#64748b', fontSize: '0.9rem', margin: 0 }}>
                        Sistema completo para varejo
                      </p>
                    </div>

                    <div style={{ marginBottom: '1.5rem' }}>
                      <h6 style={{ fontWeight: '700', color: '#1e293b', marginBottom: '1rem', fontSize: '0.9rem' }}>
                        🎯 Recursos em desenvolvimento:
                      </h6>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div style={{ width: '6px', height: '6px', background: '#f59e0b', borderRadius: '50%' }}></div>
                          <small style={{ color: '#4a5568', fontWeight: '500' }}>Leitor código de barras</small>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div style={{ width: '6px', height: '6px', background: '#f59e0b', borderRadius: '50%' }}></div>
                          <small style={{ color: '#4a5568', fontWeight: '500' }}>Pesagem integrada</small>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div style={{ width: '6px', height: '6px', background: '#f59e0b', borderRadius: '50%' }}></div>
                          <small style={{ color: '#4a5568', fontWeight: '500' }}>Gestão de validade</small>
                        </div>
                      </div>
                    </div>

                    <div style={{
                      background: 'rgba(34, 197, 94, 0.1)',
                      border: '1px solid rgba(34, 197, 94, 0.3)',
                      borderRadius: '12px',
                      padding: '1rem',
                      textAlign: 'center'
                    }}>
                      <div style={{ fontWeight: '700', color: '#16a34a', marginBottom: '0.3rem' }}>
                        ⚙️ Em desenvolvimento
                      </div>
                      <small style={{ color: '#64748b' }}>
                        Previsão: próximos meses
                      </small>
                    </div>
                  </div>
                </div>
              </div>

              {/* Petshops */}
              <div className="col-lg-4 col-md-6">
                <div 
                  style={{
                    background: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(20px)',
                    borderRadius: '20px',
                    border: '2px solid rgba(14, 165, 233, 0.2)',
                    boxShadow: '0 15px 40px rgba(0, 0, 0, 0.08)',
                    position: 'relative',
                    overflow: 'hidden',
                    transition: 'all 0.4s ease',
                    height: '100%'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-8px)';
                    e.currentTarget.style.boxShadow = '0 25px 60px rgba(0, 0, 0, 0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 15px 40px rgba(0, 0, 0, 0.08)';
                  }}
                >
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '4px',
                    background: 'linear-gradient(90deg, #0ea5e9 0%, #0284c7 40%, #e5e7eb 40%)',
                    borderRadius: '20px 20px 0 0'
                  }}></div>

                  <div style={{
                    position: 'absolute',
                    top: '1rem',
                    right: '1rem',
                    background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
                    color: 'white',
                    padding: '6px 12px',
                    borderRadius: '20px',
                    fontSize: '0.75rem',
                    fontWeight: '700',
                    zIndex: 2
                  }}>
                    40% concluído
                  </div>

                  <div style={{ padding: '2rem' }}>
                    <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                      <div style={{
                        width: '80px',
                        height: '80px',
                        background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
                        borderRadius: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '2.5rem',
                        margin: '0 auto 1rem auto',
                        boxShadow: '0 15px 30px rgba(14, 165, 233, 0.3)'
                      }}>
                        🐕
                      </div>
                      <h5 style={{ fontWeight: '800', color: '#1e293b', marginBottom: '0.5rem' }}>
                        Petshops
                      </h5>
                      <p style={{ color: '#64748b', fontSize: '0.9rem', margin: 0 }}>
                        Gestão completa para pets
                      </p>
                    </div>

                    <div style={{ marginBottom: '1.5rem' }}>
                      <h6 style={{ fontWeight: '700', color: '#1e293b', marginBottom: '1rem', fontSize: '0.9rem' }}>
                        🎯 Recursos em desenvolvimento:
                      </h6>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div style={{ width: '6px', height: '6px', background: '#f59e0b', borderRadius: '50%' }}></div>
                          <small style={{ color: '#4a5568', fontWeight: '500' }}>Ficha completa dos pets</small>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div style={{ width: '6px', height: '6px', background: '#f59e0b', borderRadius: '50%' }}></div>
                          <small style={{ color: '#4a5568', fontWeight: '500' }}>Agendamento de serviços</small>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div style={{ width: '6px', height: '6px', background: '#f59e0b', borderRadius: '50%' }}></div>
                          <small style={{ color: '#4a5568', fontWeight: '500' }}>Histórico veterinário</small>
                        </div>
                      </div>
                    </div>

                    <div style={{
                      background: 'rgba(14, 165, 233, 0.1)',
                      border: '1px solid rgba(14, 165, 233, 0.3)',
                      borderRadius: '12px',
                      padding: '1rem',
                      textAlign: 'center'
                    }}>
                      <div style={{ fontWeight: '700', color: '#0284c7', marginBottom: '0.3rem' }}>
                        ⚙️ Em desenvolvimento
                      </div>
                      <small style={{ color: '#64748b' }}>
                        Previsão: próximos meses
                      </small>
                    </div>
                  </div>
                </div>
              </div>

              {/* Salões */}
              <div className="col-lg-4 col-md-6">
                <div 
                  style={{
                    background: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(20px)',
                    borderRadius: '20px',
                    border: '2px solid rgba(59, 130, 246, 0.2)',
                    boxShadow: '0 15px 40px rgba(0, 0, 0, 0.08)',
                    position: 'relative',
                    overflow: 'hidden',
                    transition: 'all 0.4s ease',
                    height: '100%'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-8px)';
                    e.currentTarget.style.boxShadow = '0 25px 60px rgba(0, 0, 0, 0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 15px 40px rgba(0, 0, 0, 0.08)';
                  }}
                >
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '4px',
                    background: 'linear-gradient(90deg, #3b82f6 0%, #2563eb 30%, #e5e7eb 30%)',
                    borderRadius: '20px 20px 0 0'
                  }}></div>

                  <div style={{
                    position: 'absolute',
                    top: '1rem',
                    right: '1rem',
                    background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                    color: 'white',
                    padding: '6px 12px',
                    borderRadius: '20px',
                    fontSize: '0.75rem',
                    fontWeight: '700',
                    zIndex: 2
                  }}>
                    30% concluído
                  </div>

                  <div style={{ padding: '2rem' }}>
                    <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                      <div style={{
                        width: '80px',
                        height: '80px',
                        background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                        borderRadius: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '2.5rem',
                        margin: '0 auto 1rem auto',
                        boxShadow: '0 15px 30px rgba(59, 130, 246, 0.3)'
                      }}>
                        💄
                      </div>
                      <h5 style={{ fontWeight: '800', color: '#1e293b', marginBottom: '0.5rem' }}>
                        Salões de Beleza
                      </h5>
                      <p style={{ color: '#64748b', fontSize: '0.9rem', margin: 0 }}>
                        Agendamento e gestão profissional
                      </p>
                    </div>

                    <div style={{ marginBottom: '1.5rem' }}>
                      <h6 style={{ fontWeight: '700', color: '#1e293b', marginBottom: '1rem', fontSize: '0.9rem' }}>
                        🎯 Recursos em desenvolvimento:
                      </h6>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div style={{ width: '6px', height: '6px', background: '#f59e0b', borderRadius: '50%' }}></div>
                          <small style={{ color: '#4a5568', fontWeight: '500' }}>Agenda online inteligente</small>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div style={{ width: '6px', height: '6px', background: '#f59e0b', borderRadius: '50%' }}></div>
                          <small style={{ color: '#4a5568', fontWeight: '500' }}>Gestão de profissionais</small>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div style={{ width: '6px', height: '6px', background: '#f59e0b', borderRadius: '50%' }}></div>
                          <small style={{ color: '#4a5568', fontWeight: '500' }}>Comissões automáticas</small>
                        </div>
                      </div>
                    </div>

                    <div style={{
                      background: 'rgba(59, 130, 246, 0.1)',
                      border: '1px solid rgba(59, 130, 246, 0.3)',
                      borderRadius: '12px',
                      padding: '1rem',
                      textAlign: 'center'
                    }}>
                      <div style={{ fontWeight: '700', color: '#2563eb', marginBottom: '0.3rem' }}>
                        ⚙️ Em desenvolvimento
                      </div>
                      <small style={{ color: '#64748b' }}>
                        Previsão: próximos meses
                      </small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-5">
            <div 
              style={{
                background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(16, 185, 129, 0.05))',
                border: '1px solid rgba(59, 130, 246, 0.2)',
                borderRadius: '24px',
                padding: '3rem 2rem',
                backdropFilter: 'blur(20px)',
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.1)'
              }}
            >
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🚀</div>
              <h4 style={{ color: '#1e293b', fontWeight: '800', marginBottom: '1rem' }}>
                Roadmap de Desenvolvimento
              </h4>
              <p style={{ color: '#4a5568', fontSize: '1.1rem', marginBottom: '2rem' }}>
                Estamos trabalhando intensamente para entregar demos específicas para cada segmento. 
                <br />
                <strong style={{ color: '#3b82f6' }}>O delivery já está disponível</strong> e outros segmentos serão lançados gradualmente.
              </p>
              
              <div className="row g-3 mb-4">
                <div className="col-md-4">
                  <div style={{
                    background: 'rgba(16, 185, 129, 0.1)',
                    border: '1px solid rgba(16, 185, 129, 0.3)',
                    borderRadius: '16px',
                    padding: '1.5rem 1rem',
                    backdropFilter: 'blur(10px)'
                  }}>
                    <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>✅</div>
                    <h6 style={{ color: '#10b981', fontWeight: '800', marginBottom: '0.5rem' }}>
                      DISPONÍVEL AGORA
                    </h6>
                    <p style={{ color: '#4a5568', margin: 0, fontSize: '0.9rem' }}>
                      Sistema de Delivery completo e funcional
                    </p>
                  </div>
                </div>
                <div className="col-md-4">
                  <div style={{
                    background: 'rgba(251, 191, 36, 0.1)',
                    border: '1px solid rgba(251, 191, 36, 0.3)',
                    borderRadius: '16px',
                    padding: '1.5rem 1rem',
                    backdropFilter: 'blur(10px)'
                  }}>
                    <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🚧</div>
                    <h6 style={{ color: '#f59e0b', fontWeight: '800', marginBottom: '0.5rem' }}>
                      EM DESENVOLVIMENTO
                    </h6>
                    <p style={{ color: '#4a5568', margin: 0, fontSize: '0.9rem' }}>
                      Lanchonetes, Pizzarias, Moda, Mercados, Petshops, Salões
                    </p>
                  </div>
                </div>
                <div className="col-md-4">
                  <div style={{
                    background: 'rgba(59, 130, 246, 0.1)',
                    border: '1px solid rgba(59, 130, 246, 0.3)',
                    borderRadius: '16px',
                    padding: '1.5rem 1rem',
                    backdropFilter: 'blur(10px)'
                  }}>
                    <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📅</div>
                    <h6 style={{ color: '#3b82f6', fontWeight: '800', marginBottom: '0.5rem' }}>
                      PRÓXIMOS MESES
                    </h6>
                    <p style={{ color: '#4a5568', margin: 0, fontSize: '0.9rem' }}>
                      Farmácias, Conveniências e outros segmentos
                    </p>
                  </div>
                </div>
              </div>

              <div className="d-flex flex-column flex-md-row gap-3 justify-content-center align-items-center">
                <a 
                  href="/vf-delivery-demo.html" 
                  target="_blank"
                  className="btn"
                  style={{
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    border: 'none',
                    borderRadius: '16px',
                    padding: '1rem 2rem',
                    color: 'white',
                    fontWeight: '700',
                    fontSize: '1.1rem',
                    textDecoration: 'none',
                    boxShadow: '0 12px 30px rgba(16, 185, 129, 0.3)'
                  }}
                >
                  <i className="bi bi-play-circle me-2"></i>
                  Testar Demo Delivery
                </a>
                
                <span style={{ color: '#6b7280', fontWeight: '500' }}>ou</span>
                
                <a 
                  href="#contact" 
                  className="btn"
                  style={{
                    background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                    border: 'none',
                    borderRadius: '16px',
                    padding: '1rem 2rem',
                    color: 'white',
                    fontWeight: '700',
                    fontSize: '1.1rem',
                    textDecoration: 'none',
                    boxShadow: '0 12px 30px rgba(59, 130, 246, 0.3)'
                  }}
                >
                  <i className="bi bi-person-lines-fill me-2"></i>
                  Falar com Especialista
                </a>
              </div>
              
              <div style={{ marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid rgba(59, 130, 246, 0.1)' }}>
                <p style={{ color: '#6b7280', margin: 0, fontSize: '0.9rem' }}>
                  <strong>💡 Dica:</strong> Mesmo com demos em desenvolvimento, você já pode se cadastrar para qualquer segmento. 
                  O sistema é adaptável e funciona perfeitamente para todos os tipos de negócio!
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Value Props */}
      <section style={{ padding: '5rem 0' }} id="value-props">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 style={{
              fontSize: '3rem',
              fontWeight: 'bold',
              color: '#1E293B',
              marginBottom: '1rem'
            }}>Por que escolher o Varejofflex?</h2>
            <p style={{
              fontSize: '1.25rem',
              color: '#64748B'
            }}>Benefícios reais para o seu negócio crescer</p>
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '2rem',
            textAlign: 'center'
          }}>
            <div style={{
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(20px)',
              borderRadius: '20px',
              padding: '2rem',
              boxShadow: '0 25px 50px rgba(0, 0, 0, 0.1)',
              border: '1px solid rgba(59, 130, 246, 0.2)'
            }}>
              <i className="bi bi-graph-up text-primary fs-1 mb-3" />
              <h5 style={{ fontWeight: 'bold', color: '#1E293B' }}>Venda Mais</h5>
              <p style={{ color: '#64748B' }}>Multiplique seus canais de venda</p>
            </div>
            <div style={{
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(20px)',
              borderRadius: '20px',
              padding: '2rem',
              boxShadow: '0 25px 50px rgba(0, 0, 0, 0.1)',
              border: '1px solid rgba(16, 185, 129, 0.2)'
            }}>
              <i className="bi bi-cash-coin text-success fs-1 mb-3" />
              <h5 style={{ fontWeight: 'bold', color: '#1E293B' }}>Pague Menos</h5>
              <p style={{ color: '#64748B' }}>Só pague pelas unidades que usar</p>
            </div>
            <div style={{
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(20px)',
              borderRadius: '20px',
              padding: '2rem',
              boxShadow: '0 25px 50px rgba(0, 0, 0, 0.1)',
              border: '1px solid rgba(245, 158, 11, 0.2)'
            }}>
              <i className="bi bi-lightning-charge text-warning fs-1 mb-3" />
              <h5 style={{ fontWeight: 'bold', color: '#1E293B' }}>Configure Rápido</h5>
              <p style={{ color: '#64748B' }}>15 minutos para sua loja no ar</p>
            </div>
            <div style={{
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(20px)',
              borderRadius: '20px',
              padding: '2rem',
              boxShadow: '0 25px 50px rgba(0, 0, 0, 0.1)',
              border: '1px solid rgba(6, 182, 212, 0.2)'
            }}>
              <i className="bi bi-headset text-info fs-1 mb-3" />
              <h5 style={{ fontWeight: 'bold', color: '#1E293B' }}>Suporte Total</h5>
              <p style={{ color: '#64748B' }}>IA + especialistas 24/7</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <PricingSection />

      {/* IoT Solutions */}
      <section style={{
        padding: '6rem 0',
        background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.03) 0%, rgba(59, 130, 246, 0.05) 50%, rgba(16, 185, 129, 0.03) 100%)',
        position: 'relative',
        overflow: 'hidden'
      }} id="iot">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '1rem',
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(20px)',
              borderRadius: '50px',
              padding: '0.8rem 2rem',
              marginBottom: '2rem',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.1)',
              border: '1px solid rgba(139, 92, 246, 0.2)'
            }}>
              <div style={{ fontSize: '2rem' }}>🔧</div>
              <span style={{
                background: 'linear-gradient(135deg, #8B5CF6 0%, #06B6D4 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                fontWeight: '800',
                fontSize: '1.2rem'
              }}>
                SOLUÇÕES IOT
              </span>
            </div>

            <h2 style={{
              fontSize: 'clamp(2.5rem, 5vw, 4rem)',
              fontWeight: '900',
              marginBottom: '1.5rem',
              color: '#1E293B',
              lineHeight: '1.1'
            }}>
              Internet das Coisas para
              <br/>
              <span style={{
                background: 'linear-gradient(135deg, #8B5CF6 0%, #3B82F6 50%, #06B6D4 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>seu negócio inteligente</span>
            </h2>
            
            <p style={{
              fontSize: '1.3rem',
              color: '#64748B',
              maxWidth: '800px',
              margin: '0 auto 3rem auto',
              lineHeight: '1.7',
              fontWeight: '500'
            }}>
              Sensores, automação e monitoramento em tempo real.
              <br />
              <strong style={{ color: '#8B5CF6' }}>Transforme dados em decisões inteligentes</strong> para seu negócio.
            </p>
          </div>

          <div className="row g-4 mb-5">
            {/* Smart Sensors */}
            <div className="col-lg-4 col-md-6">
              <div style={{
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(20px)',
                borderRadius: '24px',
                border: '2px solid rgba(139, 92, 246, 0.2)',
                boxShadow: '0 20px 50px rgba(0, 0, 0, 0.1)',
                padding: '2.5rem',
                height: '100%',
                position: 'relative',
                overflow: 'hidden',
                transition: 'all 0.4s ease'
              }}>
                <div style={{
                  position: 'absolute',
                  top: '-50%',
                  right: '-50%',
                  width: '200%',
                  height: '200%',
                  background: 'radial-gradient(circle, rgba(139, 92, 246, 0.05) 0%, transparent 70%)'
                }}></div>
                
                <div style={{ position: 'relative', zIndex: 2 }}>
                  <div style={{
                    width: '80px',
                    height: '80px',
                    background: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
                    borderRadius: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '2.5rem',
                    marginBottom: '1.5rem',
                    boxShadow: '0 15px 30px rgba(139, 92, 246, 0.3)'
                  }}>
                    📡
                  </div>
                  
                  <h4 style={{ fontWeight: '800', color: '#1E293B', marginBottom: '1rem' }}>
                    Sensores Inteligentes
                  </h4>
                  
                  <p style={{ color: '#64748B', lineHeight: '1.6', marginBottom: '1.5rem' }}>
                    Monitoramento em tempo real de temperatura, umidade, movimento e consumo de energia.
                  </p>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                      <div style={{ width: '6px', height: '6px', background: '#10B981', borderRadius: '50%' }}></div>
                      <span style={{ color: '#4A5568', fontWeight: '500', fontSize: '0.95rem' }}>Temperatura e umidade</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                      <div style={{ width: '6px', height: '6px', background: '#10B981', borderRadius: '50%' }}></div>
                      <span style={{ color: '#4A5568', fontWeight: '500', fontSize: '0.95rem' }}>Detecção de movimento</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                      <div style={{ width: '6px', height: '6px', background: '#10B981', borderRadius: '50%' }}></div>
                      <span style={{ color: '#4A5568', fontWeight: '500', fontSize: '0.95rem' }}>Monitoramento energético</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Smart Analytics */}
            <div className="col-lg-4 col-md-6">
              <div style={{
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(20px)',
                borderRadius: '24px',
                border: '2px solid rgba(59, 130, 246, 0.2)',
                boxShadow: '0 20px 50px rgba(0, 0, 0, 0.1)',
                padding: '2.5rem',
                height: '100%',
                position: 'relative',
                overflow: 'hidden',
                transition: 'all 0.4s ease'
              }}>
                <div style={{
                  position: 'absolute',
                  top: '-50%',
                  right: '-50%',
                  width: '200%',
                  height: '200%',
                  background: 'radial-gradient(circle, rgba(59, 130, 246, 0.05) 0%, transparent 70%)'
                }}></div>
                
                <div style={{ position: 'relative', zIndex: 2 }}>
                  <div style={{
                    width: '80px',
                    height: '80px',
                    background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
                    borderRadius: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '2.5rem',
                    marginBottom: '1.5rem',
                    boxShadow: '0 15px 30px rgba(59, 130, 246, 0.3)'
                  }}>
                    🧠
                  </div>
                  
                  <h4 style={{ fontWeight: '800', color: '#1E293B', marginBottom: '1rem' }}>
                    Analytics Avançado
                  </h4>
                  
                  <p style={{ color: '#64748B', lineHeight: '1.6', marginBottom: '1.5rem' }}>
                    IA processa seus dados e gera insights acionáveis para otimizar operações.
                  </p>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                      <div style={{ width: '6px', height: '6px', background: '#10B981', borderRadius: '50%' }}></div>
                      <span style={{ color: '#4A5568', fontWeight: '500', fontSize: '0.95rem' }}>Previsão de demanda</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                      <div style={{ width: '6px', height: '6px', background: '#10B981', borderRadius: '50%' }}></div>
                      <span style={{ color: '#4A5568', fontWeight: '500', fontSize: '0.95rem' }}>Otimização energética</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                      <div style={{ width: '6px', height: '6px', background: '#10B981', borderRadius: '50%' }}></div>
                      <span style={{ color: '#4A5568', fontWeight: '500', fontSize: '0.95rem' }}>Alertas inteligentes</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Smart Automation */}
            <div className="col-lg-4 col-md-6">
              <div style={{
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(20px)',
                borderRadius: '24px',
                border: '2px solid rgba(6, 182, 212, 0.2)',
                boxShadow: '0 20px 50px rgba(0, 0, 0, 0.1)',
                padding: '2.5rem',
                height: '100%',
                position: 'relative',
                overflow: 'hidden',
                transition: 'all 0.4s ease'
              }}>
                <div style={{
                  position: 'absolute',
                  top: '-50%',
                  right: '-50%',
                  width: '200%',
                  height: '200%',
                  background: 'radial-gradient(circle, rgba(6, 182, 212, 0.05) 0%, transparent 70%)'
                }}></div>
                
                <div style={{ position: 'relative', zIndex: 2 }}>
                  <div style={{
                    width: '80px',
                    height: '80px',
                    background: 'linear-gradient(135deg, #06B6D4 0%, #0891B2 100%)',
                    borderRadius: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '2.5rem',
                    marginBottom: '1.5rem',
                    boxShadow: '0 15px 30px rgba(6, 182, 212, 0.3)'
                  }}>
                    ⚡
                  </div>
                  
                  <h4 style={{ fontWeight: '800', color: '#1E293B', marginBottom: '1rem' }}>
                    Automação Total
                  </h4>
                  
                  <p style={{ color: '#64748B', lineHeight: '1.6', marginBottom: '1.5rem' }}>
                    Controle automatizado de iluminação, climatização e sistemas de segurança.
                  </p>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                      <div style={{ width: '6px', height: '6px', background: '#10B981', borderRadius: '50%' }}></div>
                      <span style={{ color: '#4A5568', fontWeight: '500', fontSize: '0.95rem' }}>Controle de iluminação</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                      <div style={{ width: '6px', height: '6px', background: '#10B981', borderRadius: '50%' }}></div>
                      <span style={{ color: '#4A5568', fontWeight: '500', fontSize: '0.95rem' }}>Climatização inteligente</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                      <div style={{ width: '6px', height: '6px', background: '#10B981', borderRadius: '50%' }}></div>
                      <span style={{ color: '#4A5568', fontWeight: '500', fontSize: '0.95rem' }}>Segurança automática</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* IoT Integration Call-to-Action */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(59, 130, 246, 0.05))',
            border: '2px solid rgba(139, 92, 246, 0.2)',
            borderRadius: '28px',
            padding: '3rem 2rem',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '300px',
              height: '300px',
              background: 'radial-gradient(circle, rgba(139, 92, 246, 0.1) 0%, transparent 70%)',
              borderRadius: '50%',
              animation: 'pulse 4s ease-in-out infinite'
            }}></div>
            
            <div style={{ position: 'relative', zIndex: 2 }}>
              <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>🏭</div>
              <h3 style={{
                fontSize: 'clamp(1.8rem, 3vw, 2.5rem)',
                fontWeight: '800',
                color: '#1E293B',
                marginBottom: '1rem'
              }}>
                IoT Disponível em Planos Avançados
              </h3>
              <p style={{
                fontSize: '1.2rem',
                color: '#64748B',
                maxWidth: '600px',
                margin: '0 auto 2rem auto',
                lineHeight: '1.6'
              }}>
                Transforme seu negócio com Internet das Coisas. Sensores inteligentes, automação e analytics em tempo real.
                <br />
                <strong style={{ color: '#8B5CF6' }}>Disponível nos planos Profissional e Empresarial.</strong>
              </p>
              
              <div className="d-flex flex-column flex-md-row gap-3 justify-content-center">
                <a 
                  href="#pricing"
                  style={{
                    background: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
                    border: 'none',
                    borderRadius: '20px',
                    padding: '1.2rem 2.5rem',
                    color: 'white',
                    fontWeight: '800',
                    fontSize: '1.1rem',
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '12px',
                    boxShadow: '0 20px 50px rgba(139, 92, 246, 0.4)',
                    transition: 'all 0.3s ease'
                  }}
                >
                  <span style={{ fontSize: '1.3rem' }}>🚀</span>
                  Ver Planos com IoT
                </a>
                
                <a 
                  href="#contact"
                  style={{
                    background: 'rgba(255, 255, 255, 0.9)',
                    border: '2px solid rgba(139, 92, 246, 0.3)',
                    borderRadius: '20px',
                    padding: '1.2rem 2.5rem',
                    color: '#1E293B',
                    fontWeight: '800',
                    fontSize: '1.1rem',
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '12px',
                    boxShadow: '0 15px 40px rgba(0, 0, 0, 0.1)',
                    transition: 'all 0.3s ease'
                  }}
                >
                  <span style={{ fontSize: '1.3rem' }}>💬</span>
                  Consultoria IoT
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: '5rem 0' }} id="features">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 style={{
              fontSize: '3rem',
              fontWeight: 'bold',
              color: '#1E293B',
              marginBottom: '1rem'
            }}>
              Tudo que você precisa em um só lugar
            </h2>
            <p style={{
              fontSize: '1.25rem',
              color: '#64748B'
            }}>Recursos completos para seu negócio crescer</p>
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
            gap: '2rem'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(20px)',
              borderRadius: '15px',
              padding: '1.5rem',
              boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
              border: '1px solid rgba(59, 130, 246, 0.2)'
            }}>
              <div style={{
                background: 'linear-gradient(135deg, #3B82F6 0%, #06B6D4 100%)',
                color: 'white',
                borderRadius: '10px',
                padding: '1rem',
                marginRight: '1rem',
                flexShrink: 0
              }}>
                <i className="bi bi-credit-card fs-4" />
              </div>
              <div>
                <h5 style={{ fontWeight: 'bold', color: '#1E293B', marginBottom: '0.5rem' }}>PDV Completo</h5>
                <p style={{ color: '#64748B', margin: 0 }}>
                  Terminal de vendas com impressora, gaveta e leitor integrados
                </p>
              </div>
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(20px)',
              borderRadius: '15px',
              padding: '1.5rem',
              boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
              border: '1px solid rgba(16, 185, 129, 0.2)'
            }}>
              <div style={{
                background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                color: 'white',
                borderRadius: '10px',
                padding: '1rem',
                marginRight: '1rem',
                flexShrink: 0
              }}>
                <i className="bi bi-robot fs-4" />
              </div>
              <div>
                <h5 style={{ fontWeight: 'bold', color: '#1E293B', marginBottom: '0.5rem' }}>IA Integrada</h5>
                <p style={{ color: '#64748B', margin: 0 }}>Assistente virtual e insights inteligentes</p>
              </div>
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(20px)',
              borderRadius: '15px',
              padding: '1.5rem',
              boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
              border: '1px solid rgba(245, 158, 11, 0.2)'
            }}>
              <div style={{
                background: 'linear-gradient(135deg, #F59E0B 0%, #EAB308 100%)',
                color: 'white',
                borderRadius: '10px',
                padding: '1rem',
                marginRight: '1rem',
                flexShrink: 0
              }}>
                <i className="bi bi-currency-exchange fs-4" />
              </div>
              <div>
                <h5 style={{ fontWeight: 'bold', color: '#1E293B', marginBottom: '0.5rem' }}>Multimoeda</h5>
                <p style={{ color: '#64748B', margin: 0 }}>Venda em diferentes moedas e idiomas</p>
              </div>
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(20px)',
              borderRadius: '15px',
              padding: '1.5rem',
              boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
              border: '1px solid rgba(6, 182, 212, 0.2)'
            }}>
              <div style={{
                background: 'linear-gradient(135deg, #06B6D4 0%, #0891B2 100%)',
                color: 'white',
                borderRadius: '10px',
                padding: '1rem',
                marginRight: '1rem',
                flexShrink: 0
              }}>
                <i className="bi bi-percent fs-4" />
              </div>
              <div>
                <h5 style={{ fontWeight: 'bold', color: '#1E293B', marginBottom: '0.5rem' }}>Cupons</h5>
                <p style={{ color: '#64748B', margin: 0 }}>
                  Sistema completo de promoções e cupons
                </p>
              </div>
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(20px)',
              borderRadius: '15px',
              padding: '1.5rem',
              boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
              border: '1px solid rgba(100, 116, 139, 0.2)'
            }}>
              <div style={{
                background: 'linear-gradient(135deg, #64748B 0%, #475569 100%)',
                color: 'white',
                borderRadius: '10px',
                padding: '1rem',
                marginRight: '1rem',
                flexShrink: 0
              }}>
                <i className="bi bi-bar-chart fs-4" />
              </div>
              <div>
                <h5 style={{ fontWeight: 'bold', color: '#1E293B', marginBottom: '0.5rem' }}>Relatórios</h5>
                <p style={{ color: '#64748B', margin: 0 }}>Dashboards com métricas em tempo real</p>
              </div>
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(20px)',
              borderRadius: '15px',
              padding: '1.5rem',
              boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
              border: '1px solid rgba(139, 92, 246, 0.2)'
            }}>
              <div style={{
                background: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
                color: 'white',
                borderRadius: '10px',
                padding: '1rem',
                marginRight: '1rem',
                flexShrink: 0
              }}>
                <i className="bi bi-puzzle fs-4" />
              </div>
              <div>
                <h5 style={{ fontWeight: 'bold', color: '#1E293B', marginBottom: '0.5rem' }}>Integrações</h5>
                <p style={{ color: '#64748B', margin: 0 }}>Conecte com pagamento, delivery e ERPs</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section style={{
        padding: '5rem 0',
        background: 'rgba(255, 255, 255, 0.5)',
        backdropFilter: 'blur(10px)'
      }} id="testimonials">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 style={{
              fontSize: '3rem',
              fontWeight: 'bold',
              color: '#1E293B'
            }}>O que nossos lojistas dizem</h2>
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '2rem'
          }}>
            <div style={{
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(20px)',
              borderRadius: '20px',
              padding: '2rem',
              boxShadow: '0 25px 50px rgba(0, 0, 0, 0.1)',
              border: '1px solid rgba(245, 158, 11, 0.2)'
            }}>
              <div style={{ marginBottom: '1rem' }}>
                <i className="bi bi-star-fill text-warning" />
                <i className="bi bi-star-fill text-warning" />
                <i className="bi bi-star-fill text-warning" />
                <i className="bi bi-star-fill text-warning" />
                <i className="bi bi-star-fill text-warning" />
              </div>
              <p style={{
                color: '#1E293B',
                fontSize: '1rem',
                lineHeight: '1.6',
                marginBottom: '1.5rem'
              }}>
                &quot;Aumentei 70% as vendas online em 3 meses. O PDV integrado facilitou
                muito a operação.&quot;
              </p>
              <h6 style={{
                color: '#1E293B',
                fontWeight: 'bold',
                marginBottom: '0.25rem'
              }}>Maria Silva</h6>
              <small style={{ color: '#64748B' }}>Pizzaria Bella Vista</small>
            </div>
            <div style={{
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(20px)',
              borderRadius: '20px',
              padding: '2rem',
              boxShadow: '0 25px 50px rgba(0, 0, 0, 0.1)',
              border: '1px solid rgba(59, 130, 246, 0.2)'
            }}>
              <div style={{ marginBottom: '1rem' }}>
                <i className="bi bi-star-fill text-warning" />
                <i className="bi bi-star-fill text-warning" />
                <i className="bi bi-star-fill text-warning" />
                <i className="bi bi-star-fill text-warning" />
                <i className="bi bi-star-fill text-warning" />
              </div>
              <p style={{
                color: '#1E293B',
                fontSize: '1rem',
                lineHeight: '1.6',
                marginBottom: '1.5rem'
              }}>
                &quot;A cobrança por unidade é perfeita. Comecei pequeno e fui crescendo
                conforme a necessidade.&quot;
              </p>
              <h6 style={{
                color: '#1E293B',
                fontWeight: 'bold',
                marginBottom: '0.25rem'
              }}>João Santos</h6>
              <small style={{ color: '#64748B' }}>Mercado do Bairro</small>
            </div>
            <div style={{
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(20px)',
              borderRadius: '20px',
              padding: '2rem',
              boxShadow: '0 25px 50px rgba(0, 0, 0, 0.1)',
              border: '1px solid rgba(16, 185, 129, 0.2)'
            }}>
              <div style={{ marginBottom: '1rem' }}>
                <i className="bi bi-star-fill text-warning" />
                <i className="bi bi-star-fill text-warning" />
                <i className="bi bi-star-fill text-warning" />
                <i className="bi bi-star-fill text-warning" />
                <i className="bi bi-star-fill text-warning" />
              </div>
              <p style={{
                color: '#1E293B',
                fontSize: '1rem',
                lineHeight: '1.6',
                marginBottom: '1.5rem'
              }}>
                &quot;Suporte excepcional! A IA me ajuda a entender meus clientes e
                aumentar as vendas.&quot;
              </p>
              <h6 style={{
                color: '#1E293B',
                fontWeight: 'bold',
                marginBottom: '0.25rem'
              }}>Ana Costa</h6>
              <small style={{ color: '#64748B' }}>Boutique Elegance</small>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ padding: '5rem 0' }} id="faq">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 style={{
              fontSize: '3rem',
              fontWeight: 'bold',
              color: '#1E293B'
            }}>Dúvidas frequentes</h2>
          </div>
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="accordion" id="faqAccordion">
                <div className="accordion-item mb-3">
                  <h2 className="accordion-header" id="headingOne">
                    <button
                      className="accordion-button"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#faq1"
                      aria-expanded="true"
                      aria-controls="faq1"
                    >
                      Como funciona a cobrança por unidade?
                    </button>
                  </h2>
                  <div
                    id="faq1"
                    className="accordion-collapse collapse show"
                    aria-labelledby="headingOne"
                    data-bs-parent="#faqAccordion"
                  >
                    <div className="accordion-body">
                      Você paga o plano base + valor por unidade adicional que usar
                      (PDV, KDS, Frota).
                    </div>
                  </div>
                </div>

                <div className="accordion-item mb-3">
                  <h2 className="accordion-header" id="headingTwo">
                    <button
                      className="accordion-button collapsed"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#faq2"
                      aria-expanded="false"
                      aria-controls="faq2"
                    >
                      Posso mudar de plano a qualquer momento?
                    </button>
                  </h2>
                  <div
                    id="faq2"
                    className="accordion-collapse collapse"
                    aria-labelledby="headingTwo"
                    data-bs-parent="#faqAccordion"
                  >
                    <div className="accordion-body">
                      Sim! Upgrade ou downgrade a qualquer momento, sem fidelidade.
                    </div>
                  </div>
                </div>

                <div className="accordion-item mb-3">
                  <h2 className="accordion-header" id="headingThree">
                    <button
                      className="accordion-button collapsed"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#faq3"
                      aria-expanded="false"
                      aria-controls="faq3"
                    >
                      O PDV funciona offline?
                    </button>
                  </h2>
                  <div
                    id="faq3"
                    className="accordion-collapse collapse"
                    aria-labelledby="headingThree"
                    data-bs-parent="#faqAccordion"
                  >
                    <div className="accordion-body">
                      Sim! O PDV sincroniza automaticamente quando a internet retorna.
                    </div>
                  </div>
                </div>

                <div className="accordion-item mb-3">
                  <h2 className="accordion-header" id="headingFour">
                    <button
                      className="accordion-button collapsed"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#faq4"
                      aria-expanded="false"
                      aria-controls="faq4"
                    >
                      Preciso comprar equipamentos para o PDV?
                    </button>
                  </h2>
                  <div
                    id="faq4"
                    className="accordion-collapse collapse"
                    aria-labelledby="headingFour"
                    data-bs-parent="#faqAccordion"
                  >
                    <div className="accordion-body">
                      Não! Funciona em qualquer tablet/smartphone. Kits opcionais
                      disponíveis.
                    </div>
                  </div>
                </div>

                <div className="accordion-item mb-3">
                  <h2 className="accordion-header" id="headingFive">
                    <button
                      className="accordion-button collapsed"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#faq5"
                      aria-expanded="false"
                      aria-controls="faq5"
                    >
                      Como funciona o cancelamento?
                    </button>
                  </h2>
                  <div
                    id="faq5"
                    className="accordion-collapse collapse"
                    aria-labelledby="headingFive"
                    data-bs-parent="#faqAccordion"
                  >
                    <div className="accordion-body">
                      Sem fidelidade! Cancele a qualquer momento e continue até o final
                      do período pago.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section style={{
        padding: '5rem 0',
        background: 'linear-gradient(135deg, #3B82F6 0%, #06B6D4 100%)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'radial-gradient(circle at 30% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 50%), radial-gradient(circle at 70% 80%, rgba(255, 255, 255, 0.1) 0%, transparent 50%)',
          pointerEvents: 'none'
        }}></div>
        <div className="container text-center position-relative">
          <h2 style={{
            fontSize: '3.5rem',
            fontWeight: 'bold',
            marginBottom: '2rem',
            color: 'white'
          }}>Comece a vender mais hoje mesmo</h2>
          <p style={{
            fontSize: '1.25rem',
            marginBottom: '3rem',
            color: 'rgba(255, 255, 255, 0.9)'
          }}>Junte-se a mais de 5.000 lojistas</p>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
              <Link href="/register" style={{
                background: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(20px)',
                color: '#1E293B',
                padding: '15px 30px',
                borderRadius: '15px',
                textDecoration: 'none',
                fontWeight: 'bold',
                fontSize: '1.1rem',
                boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
                border: '1px solid rgba(255, 255, 255, 0.3)'
              }}>
                Teste Grátis 15 dias
              </Link>
              <a href="#pricing" style={{
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(20px)',
                color: 'white',
                padding: '15px 30px',
                borderRadius: '15px',
                textDecoration: 'none',
                fontWeight: 'bold',
                fontSize: '1.1rem',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
              }}>
                Ver Planos
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        background: 'linear-gradient(135deg, #1E293B 0%, #334155 100%)',
        color: 'white',
        padding: '3rem 0 1.5rem 0'
      }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '2rem',
            marginBottom: '2rem'
          }}>
            {/* Coluna 1 - Sobre */}
            <div>
              <h5 style={{
                fontSize: '1.5rem',
                fontWeight: 'bold',
                marginBottom: '1rem',
                background: 'linear-gradient(135deg, #3B82F6 0%, #06B6D4 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                Varejofflex
              </h5>
              <p style={{
                color: 'rgba(255, 255, 255, 0.8)',
                lineHeight: '1.6',
                marginBottom: '1rem',
                fontSize: '0.9rem'
              }}>
                A plataforma completa para transformar seu negócio. PDV inteligente, 
                loja online e delivery em uma única solução.
              </p>
            </div>

            {/* Coluna 2 - Links Rápidos */}
            <div>
              <h6 style={{
                fontWeight: 'bold',
                marginBottom: '1rem',
                color: 'white'
              }}>
                Links Rápidos
              </h6>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                <li style={{ marginBottom: '0.5rem' }}>
                  <a href="#demos" style={{
                    color: 'rgba(255, 255, 255, 0.8)',
                    textDecoration: 'none',
                    transition: 'color 0.3s ease',
                    fontSize: '0.9rem'
                  }}>
                    Demos
                  </a>
                </li>
                <li style={{ marginBottom: '0.5rem' }}>
                  <a href="#pricing" style={{
                    color: 'rgba(255, 255, 255, 0.8)',
                    textDecoration: 'none',
                    transition: 'color 0.3s ease',
                    fontSize: '0.9rem'
                  }}>
                    Planos
                  </a>
                </li>
                <li style={{ marginBottom: '0.5rem' }}>
                  <a href="#features" style={{
                    color: 'rgba(255, 255, 255, 0.8)',
                    textDecoration: 'none',
                    transition: 'color 0.3s ease',
                    fontSize: '0.9rem'
                  }}>
                    Recursos
                  </a>
                </li>
              </ul>
            </div>

            {/* Coluna 3 - Contato */}
            <div>
              <h6 style={{
                fontWeight: 'bold',
                marginBottom: '1rem',
                color: 'white'
              }}>
                Contato
              </h6>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                <li style={{ marginBottom: '0.5rem' }}>
                  <a href="mailto:contato@varejofflex.com" style={{
                    color: 'rgba(255, 255, 255, 0.8)',
                    textDecoration: 'none',
                    transition: 'color 0.3s ease',
                    fontSize: '0.9rem'
                  }}>
                    contato@varejofflex.com
                  </a>
                </li>
                <li style={{ marginBottom: '0.5rem' }}>
                  <a href="tel:+5511999999999" style={{
                    color: 'rgba(255, 255, 255, 0.8)',
                    textDecoration: 'none',
                    transition: 'color 0.3s ease',
                    fontSize: '0.9rem'
                  }}>
                    (11) 99999-9999
                  </a>
                </li>
                <li style={{ marginBottom: '0.5rem' }}>
                  <span style={{
                    color: 'rgba(255, 255, 255, 0.8)',
                    fontSize: '0.9rem'
                  }}>
                    Suporte 24/7
                  </span>
                </li>
              </ul>
            </div>
          </div>

          {/* Copyright */}
          <div style={{
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            paddingTop: '1.5rem',
            textAlign: 'center'
          }}>
            <div style={{
              color: 'rgba(255, 255, 255, 0.6)',
              fontSize: '0.9rem'
            }}>
              © 2025 Varejofflex. Todos os direitos reservados.
            </div>
          </div>
        </div>
      </footer>

      {/* Modal de Teste Grátis */}
      <div className="modal fade" id="trialModal" tabIndex={-1} aria-hidden="true">
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Começar Teste Grátis - 15 dias</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Fechar" />
            </div>
            <div className="modal-body">
              <form>
                <div className="mb-3">
                  <label className="form-label">Nome Completo</label>
                  <input type="text" className="form-control" required />
                </div>
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input type="email" className="form-control" required />
                </div>
                <div className="mb-3">
                  <label className="form-label">Telefone</label>
                  <input type="tel" className="form-control" required />
                </div>
                <div className="mb-3">
                  <label className="form-label">Nome da Loja</label>
                  <input type="text" className="form-control" required />
                </div>
                <div className="mb-3">
                  <label className="form-label">Segmento</label>
                  <select className="form-select" required>
                    <option>Selecione...</option>
                    <option>Lanchonete</option>
                    <option>Pizzaria</option>
                    <option>Moda & Acessórios</option>
                    <option>Mercado</option>
                    <option>Petshop</option>
                    <option>Salão</option>
                  </select>
                </div>
                <Link href="/register" className="btn btn-primary w-100">
                  Criar Minha Loja
                </Link>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
