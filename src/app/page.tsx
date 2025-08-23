import Link from "next/link";
import PricingToggle from "@/components/PricingToggle";

export const metadata = {
  title: "Varejofflex — A revolução do varejo digital",
  description:
    "Transforme seu negócio com nossa plataforma all-in-one. PDV inteligente, loja online, delivery e muito mais. Comece gratuitamente!",
};

export default function HomePage() {
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
          <nav style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '1rem 0'
          }}>
            {/* Logo */}
            <div style={{
              fontSize: '1.5rem',
              fontWeight: 'bold',
              background: 'linear-gradient(135deg, #3B82F6 0%, #06B6D4 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              Varejofflex
            </div>

            {/* Menu de Navegação */}
            <div style={{
              display: 'flex',
              gap: '2rem',
              alignItems: 'center'
            }}>
              <a href="#demos" style={{
                color: '#1E293B',
                textDecoration: 'none',
                fontWeight: '500',
                transition: 'color 0.3s ease'
              }}>Demos</a>
              <a href="#pricing" style={{
                color: '#1E293B',
                textDecoration: 'none',
                fontWeight: '500',
                transition: 'color 0.3s ease'
              }}>Planos</a>
              <a href="#features" style={{
                color: '#1E293B',
                textDecoration: 'none',
                fontWeight: '500',
                transition: 'color 0.3s ease'
              }}>Recursos</a>
              <a href="#testimonials" style={{
                color: '#1E293B',
                textDecoration: 'none',
                fontWeight: '500',
                transition: 'color 0.3s ease'
              }}>Depoimentos</a>
              <a href="#faq" style={{
                color: '#1E293B',
                textDecoration: 'none',
                fontWeight: '500',
                transition: 'color 0.3s ease'
              }}>FAQ</a>
              
              {/* Botões de Ação */}
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <a href="/login" style={{
                  color: '#3B82F6',
                  textDecoration: 'none',
                  fontWeight: '600',
                  padding: '0.5rem 1rem',
                  borderRadius: '8px',
                  transition: 'all 0.3s ease'
                }}>
                  Entrar
                </a>
                <a href="/register" style={{
                  background: 'linear-gradient(135deg, #3B82F6 0%, #06B6D4 100%)',
                  color: 'white',
                  textDecoration: 'none',
                  fontWeight: '600',
                  padding: '0.5rem 1.5rem',
                  borderRadius: '8px',
                  boxShadow: '0 4px 15px rgba(59, 130, 246, 0.3)',
                  transition: 'all 0.3s ease'
                }}>
                  Teste Grátis
                </a>
              </div>
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
        padding: '5rem 0',
        background: 'rgba(255, 255, 255, 0.5)',
        backdropFilter: 'blur(10px)'
      }} id="demos">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 style={{
              fontSize: '3rem',
              fontWeight: 'bold',
              marginBottom: '1.5rem',
              color: '#1E293B'
            }}>
              Veja como funciona no <span style={{
                background: 'linear-gradient(135deg, #3B82F6 0%, #06B6D4 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>seu segmento</span>
            </h2>
            <p style={{
              fontSize: '1.25rem',
              color: '#64748B',
              maxWidth: '600px',
              margin: '0 auto'
            }}>
              Demos interativas personalizadas para cada tipo de negócio
            </p>
          </div>

          <div className="row g-4">
            {/* Lanchonetes */}
            <div className="col-lg-4 col-md-6">
              <div className="card border-0 shadow-sm h-100 demo-card">
                <div className="card-header bg-warning text-white text-center py-3">
                  <i className="bi bi-cup-hot fs-1 mb-2"></i>
                  <h5 className="mb-0 fw-bold">Lanchonetes</h5>
                </div>
                <div className="card-body p-4">
                  <div className="mb-3">
                    <h6 className="fw-bold text-primary">✨ Recursos Exclusivos:</h6>
                    <ul className="list-unstyled mb-0">
                      <li><i className="bi bi-check-circle text-success me-2"></i>Cardápio digital responsivo</li>
                      <li><i className="bi bi-check-circle text-success me-2"></i>Pedidos online + balcão</li>
                      <li><i className="bi bi-check-circle text-success me-2"></i>Gestão de combos</li>
                      <li><i className="bi bi-check-circle text-success me-2"></i>Controle de ingredientes</li>
                    </ul>
                  </div>
                  <div className="demo-preview bg-light rounded-3 p-3 mb-3">
                    <div className="d-flex align-items-center mb-2">
                      <div className="bg-warning rounded-circle p-2 me-2">
                        <i className="bi bi-phone text-white"></i>
                      </div>
                      <span className="fw-bold">Demo Lanchonete</span>
                    </div>
                    <div className="small text-muted mb-2">📱 Cardápio Burguer House</div>
                    <div className="row g-2">
                      <div className="col-6">
                        <div className="bg-white rounded p-2 text-center small">
                          🍔 X-Bacon<br/>
                          <span className="text-success fw-bold">R$ 28,90</span>
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="bg-white rounded p-2 text-center small">
                          🍟 Batata G<br/>
                          <span className="text-success fw-bold">R$ 12,90</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="card-footer bg-transparent border-0 p-4 pt-0">
                  <a href="/demo/lanchonete" className="btn btn-warning w-100 fw-bold">
                    <i className="bi bi-play-circle me-2"></i>
                    Testar Demo Lanchonete
                  </a>
                </div>
              </div>
            </div>

            {/* Pizzarias */}
            <div className="col-lg-4 col-md-6">
              <div className="card border-0 shadow-sm h-100 demo-card">
                <div className="card-header bg-danger text-white text-center py-3">
                  <i className="bi bi-pizza fs-1 mb-2"></i>
                  <h5 className="mb-0 fw-bold">Pizzarias</h5>
                </div>
                <div className="card-body p-4">
                  <div className="mb-3">
                    <h6 className="fw-bold text-primary">✨ Recursos Exclusivos:</h6>
                    <ul className="list-unstyled mb-0">
                      <li><i className="bi bi-check-circle text-success me-2"></i>Delivery com rastreamento</li>
                      <li><i className="bi bi-check-circle text-success me-2"></i>Configurador de sabores</li>
                      <li><i className="bi bi-check-circle text-success me-2"></i>Tempo de preparo inteligente</li>
                      <li><i className="bi bi-check-circle text-success me-2"></i>KDS para cozinha</li>
                    </ul>
                  </div>
                  <div className="demo-preview bg-light rounded-3 p-3 mb-3">
                    <div className="d-flex align-items-center mb-2">
                      <div className="bg-danger rounded-circle p-2 me-2">
                        <i className="bi bi-truck text-white"></i>
                      </div>
                      <span className="fw-bold">Demo Pizzaria</span>
                    </div>
                    <div className="small text-muted mb-2">🍕 Delivery Nonna Mia</div>
                    <div className="bg-white rounded p-2 mb-2">
                      <div className="d-flex justify-content-between align-items-center">
                        <span className="small">Pizza Margherita G</span>
                        <span className="text-success fw-bold small">R$ 42,90</span>
                      </div>
                    </div>
                    <div className="bg-success text-white rounded p-2 text-center small">
                      🚚 Entregue em 35min
                    </div>
                  </div>
                </div>
                <div className="card-footer bg-transparent border-0 p-4 pt-0">
                  <a href="/demo/pizzaria" className="btn btn-danger w-100 fw-bold">
                    <i className="bi bi-play-circle me-2"></i>
                    Testar Demo Pizzaria
                  </a>
                </div>
              </div>
            </div>

            {/* Moda & Acessórios */}
            <div className="col-lg-4 col-md-6">
              <div className="card border-0 shadow-sm h-100 demo-card">
                <div className="card-header bg-purple text-white text-center py-3">
                  <i className="bi bi-bag fs-1 mb-2"></i>
                  <h5 className="mb-0 fw-bold">Moda & Acessórios</h5>
                </div>
                <div className="card-body p-4">
                  <div className="mb-3">
                    <h6 className="fw-bold text-primary">✨ Recursos Exclusivos:</h6>
                    <ul className="list-unstyled mb-0">
                      <li><i className="bi bi-check-circle text-success me-2"></i>Catálogo visual avançado</li>
                      <li><i className="bi bi-check-circle text-success me-2"></i>Gestão de variações</li>
                      <li><i className="bi bi-check-circle text-success me-2"></i>Controle de estoque por cor/tamanho</li>
                      <li><i className="bi bi-check-circle text-success me-2"></i>Looks e combinações</li>
                    </ul>
                  </div>
                  <div className="demo-preview bg-light rounded-3 p-3 mb-3">
                    <div className="d-flex align-items-center mb-2">
                      <div className="bg-purple rounded-circle p-2 me-2">
                        <i className="bi bi-heart text-white"></i>
                      </div>
                      <span className="fw-bold">Demo Moda</span>
                    </div>
                    <div className="small text-muted mb-2">👗 Boutique Elegance</div>
                    <div className="row g-1">
                      <div className="col-4">
                        <div className="bg-white rounded p-1 text-center">
                          <div className="bg-secondary rounded" style={{height: "30px"}}></div>
                          <div className="small">Vestido</div>
                        </div>
                      </div>
                      <div className="col-4">
                        <div className="bg-white rounded p-1 text-center">
                          <div className="bg-primary rounded" style={{height: "30px"}}></div>
                          <div className="small">Blusa</div>
                        </div>
                      </div>
                      <div className="col-4">
                        <div className="bg-white rounded p-1 text-center">
                          <div className="bg-warning rounded" style={{height: "30px"}}></div>
                          <div className="small">Acessório</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="card-footer bg-transparent border-0 p-4 pt-0">
                  <a href="/demo/moda" className="btn btn-purple w-100 fw-bold">
                    <i className="bi bi-play-circle me-2"></i>
                    Testar Demo Moda
                  </a>
                </div>
              </div>
            </div>

            {/* Mercados */}
            <div className="col-lg-4 col-md-6">
              <div className="card border-0 shadow-sm h-100 demo-card">
                <div className="card-header bg-success text-white text-center py-3">
                  <i className="bi bi-basket fs-1 mb-2"></i>
                  <h5 className="mb-0 fw-bold">Mercados</h5>
                </div>
                <div className="card-body p-4">
                  <div className="mb-3">
                    <h6 className="fw-bold text-primary">✨ Recursos Exclusivos:</h6>
                    <ul className="list-unstyled mb-0">
                      <li><i className="bi bi-check-circle text-success me-2"></i>Leitor código de barras</li>
                      <li><i className="bi bi-check-circle text-success me-2"></i>Pesagem integrada</li>
                      <li><i className="bi bi-check-circle text-success me-2"></i>Gestão de validade</li>
                      <li><i className="bi bi-check-circle text-success me-2"></i>Promoções automáticas</li>
                    </ul>
                  </div>
                  <div className="demo-preview bg-light rounded-3 p-3 mb-3">
                    <div className="d-flex align-items-center mb-2">
                      <div className="bg-success rounded-circle p-2 me-2">
                        <i className="bi bi-upc-scan text-white"></i>
                      </div>
                      <span className="fw-bold">Demo Mercado</span>
                    </div>
                    <div className="small text-muted mb-2">🛒 SuperMercado Central</div>
                    <div className="bg-white rounded p-2">
                      <div className="small mb-1">🥖 Pão Francês - 500g</div>
                      <div className="d-flex justify-content-between">
                        <span className="small text-muted">Código: 7891234567</span>
                        <span className="text-success fw-bold small">R$ 8,50</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="card-footer bg-transparent border-0 p-4 pt-0">
                  <a href="/demo/mercado" className="btn btn-success w-100 fw-bold">
                    <i className="bi bi-play-circle me-2"></i>
                    Testar Demo Mercado
                  </a>
                </div>
              </div>
            </div>

            {/* Petshops */}
            <div className="col-lg-4 col-md-6">
              <div className="card border-0 shadow-sm h-100 demo-card">
                <div className="card-header bg-info text-white text-center py-3">
                  <i className="bi bi-heart fs-1 mb-2"></i>
                  <h5 className="mb-0 fw-bold">Petshops</h5>
                </div>
                <div className="card-body p-4">
                  <div className="mb-3">
                    <h6 className="fw-bold text-primary">✨ Recursos Exclusivos:</h6>
                    <ul className="list-unstyled mb-0">
                      <li><i className="bi bi-check-circle text-success me-2"></i>Ficha completa dos pets</li>
                      <li><i className="bi bi-check-circle text-success me-2"></i>Agendamento de serviços</li>
                      <li><i className="bi bi-check-circle text-success me-2"></i>Histórico veterinário</li>
                      <li><i className="bi bi-check-circle text-success me-2"></i>Lembrete de vacinas</li>
                    </ul>
                  </div>
                  <div className="demo-preview bg-light rounded-3 p-3 mb-3">
                    <div className="d-flex align-items-center mb-2">
                      <div className="bg-info rounded-circle p-2 me-2">
                        <i className="bi bi-calendar text-white"></i>
                      </div>
                      <span className="fw-bold">Demo Petshop</span>
                    </div>
                    <div className="small text-muted mb-2">🐕 PetCare Premium</div>
                    <div className="bg-white rounded p-2">
                      <div className="d-flex align-items-center">
                        <div className="bg-warning rounded-circle me-2" style={{width: "20px", height: "20px"}}></div>
                        <div>
                          <div className="small fw-bold">Rex - Golden Retriever</div>
                          <div className="small text-muted">Banho e Tosa - 14:30</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="card-footer bg-transparent border-0 p-4 pt-0">
                  <a href="/demo/petshop" className="btn btn-info w-100 fw-bold">
                    <i className="bi bi-play-circle me-2"></i>
                    Testar Demo Petshop
                  </a>
                </div>
              </div>
            </div>

            {/* Salões */}
            <div className="col-lg-4 col-md-6">
              <div className="card border-0 shadow-sm h-100 demo-card">
                <div className="card-header bg-primary text-white text-center py-3">
                  <i className="bi bi-scissors fs-1 mb-2"></i>
                  <h5 className="mb-0 fw-bold">Salões de Beleza</h5>
                </div>
                <div className="card-body p-4">
                  <div className="mb-3">
                    <h6 className="fw-bold text-primary">✨ Recursos Exclusivos:</h6>
                    <ul className="list-unstyled mb-0">
                      <li><i className="bi bi-check-circle text-success me-2"></i>Agenda online inteligente</li>
                      <li><i className="bi bi-check-circle text-success me-2"></i>Gestão de profissionais</li>
                      <li><i className="bi bi-check-circle text-success me-2"></i>Histórico de procedimentos</li>
                      <li><i className="bi bi-check-circle text-success me-2"></i>Comissões automáticas</li>
                    </ul>
                  </div>
                  <div className="demo-preview bg-light rounded-3 p-3 mb-3">
                    <div className="d-flex align-items-center mb-2">
                      <div className="bg-primary rounded-circle p-2 me-2">
                        <i className="bi bi-person text-white"></i>
                      </div>
                      <span className="fw-bold">Demo Salão</span>
                    </div>
                    <div className="small text-muted mb-2">💄 Beleza & Estilo</div>
                    <div className="bg-white rounded p-2">
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <div className="small fw-bold">Corte + Escova</div>
                          <div className="small text-muted">Ana Silva - 15:00</div>
                        </div>
                        <span className="text-success fw-bold small">R$ 85,00</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="card-footer bg-transparent border-0 p-4 pt-0">
                  <a href="/demo/salao" className="btn btn-primary w-100 fw-bold">
                    <i className="bi bi-play-circle me-2"></i>
                    Testar Demo Salão
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-5">
            <div className="bg-primary text-white rounded-4 p-4 d-inline-block">
              <h5 className="mb-2">🎯 Não encontrou seu segmento?</h5>
              <p className="mb-3">Nossa plataforma se adapta a qualquer tipo de negócio!</p>
              <a href="#contact" className="btn btn-warning">
                Falar com Especialista
              </a>
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
      <section style={{
        padding: '5rem 0',
        background: 'linear-gradient(135deg, #F8FAFC 0%, #E2E8F0 100%)',
        position: 'relative'
      }} id="pricing">
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'radial-gradient(circle at 20% 30%, rgba(59, 130, 246, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(245, 158, 11, 0.1) 0%, transparent 50%)',
          pointerEvents: 'none'
        }}></div>
        <div className="container position-relative">
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <div style={{
              background: 'linear-gradient(135deg, #F59E0B 0%, #EAB308 100%)',
              color: 'white',
              padding: '8px 20px',
              borderRadius: '20px',
              display: 'inline-block',
              fontSize: '1rem',
              fontWeight: 'bold',
              marginBottom: '2rem',
              boxShadow: '0 10px 25px rgba(245, 158, 11, 0.3)'
            }}>
              💸 Economize até 70% comparado à concorrência
            </div>
            <h2 style={{
              fontSize: '3.5rem',
              fontWeight: 'bold',
              marginBottom: '1.5rem',
              color: '#1E293B'
            }}>
              Preços que cabem no seu <span style={{
                background: 'linear-gradient(135deg, #F59E0B 0%, #EAB308 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>bolso</span>
            </h2>
            <p style={{
              fontSize: '1.25rem',
              color: '#64748B',
              marginBottom: '2rem'
            }}>
              Sem pegadinhas, sem taxas ocultas. Pague só pelo que usar!
            </p>
            
            {/* Toggle Mensal/Anual */}
            <PricingToggle />
          </div>

          <div className="row g-4 justify-content-center mb-5">
            {/* Starter */}
            <div className="col-xl-3 col-lg-4 col-md-6">
              <div className="card bg-white text-dark h-100 border-0 shadow-lg">
                <div className="card-header bg-light border-0 text-center py-3">
                  <div className="bg-primary text-white rounded-circle mx-auto mb-3" style={{width: "60px", height: "60px", lineHeight: "60px"}}>
                    <i className="bi bi-rocket fs-4"></i>
                  </div>
                  <h4 className="fw-bold mb-0">Starter</h4>
                  <p className="text-muted mb-0">Para começar</p>
                </div>
                <div className="card-body text-center p-4">
                  <div className="mb-4">
                    <div className="h2 fw-bold text-primary mb-0">
                      <span className="monthly-price">R$ 97</span>
                      <span className="annual-price d-none">R$ 78</span>
                    </div>
                    <div className="text-muted">
                      /mês <small className="annual-only d-none">(pago anualmente)</small>
                    </div>
                  </div>
                  <ul className="list-unstyled text-start mb-4">
                    <li className="mb-2"><i className="bi bi-check-lg text-success me-2"></i>Até 1.000 produtos</li>
                    <li className="mb-2"><i className="bi bi-check-lg text-success me-2"></i>1 loja online</li>
                    <li className="mb-2"><i className="bi bi-check-lg text-success me-2"></i>1 PDV incluído</li>
                    <li className="mb-2"><i className="bi bi-check-lg text-success me-2"></i>Domínio personalizado</li>
                    <li className="mb-2"><i className="bi bi-check-lg text-success me-2"></i>Suporte por email</li>
                    <li className="mb-2"><i className="bi bi-check-lg text-success me-2"></i>15 templates</li>
                  </ul>
                  <div className="bg-light rounded-3 p-3 mb-4">
                    <small className="text-muted d-block">Transações:</small>
                    <strong className="text-success">2,9% + R$ 0,30 por venda</strong>
                  </div>
                </div>
                <div className="card-footer bg-transparent border-0 p-4">
                  <Link href="/register?plan=starter" className="btn btn-outline-primary w-100 fw-bold py-3">
                    Começar Grátis 30 Dias
                  </Link>
                </div>
              </div>
            </div>

            {/* Pro - Mais Popular */}
            <div className="col-xl-3 col-lg-4 col-md-6">
              <div className="card bg-primary text-white h-100 border-0 shadow-lg position-relative" style={{transform: "scale(1.05)"}}>
                <div className="position-absolute top-0 start-50 translate-middle">
                  <span className="badge bg-warning text-dark px-3 py-2 fw-bold">⭐ MAIS POPULAR</span>
                </div>
                <div className="card-header bg-primary border-0 text-center py-4 mt-3">
                  <div className="bg-warning text-dark rounded-circle mx-auto mb-3" style={{width: "60px", height: "60px", lineHeight: "60px"}}>
                    <i className="bi bi-star fs-4"></i>
                  </div>
                  <h4 className="fw-bold mb-0">Pro</h4>
                  <p className="text-white-50 mb-0">Para crescer</p>
                </div>
                <div className="card-body text-center p-4">
                  <div className="mb-4">
                    <div className="h2 fw-bold text-warning mb-0">
                      <span className="monthly-price">R$ 197</span>
                      <span className="annual-price d-none">R$ 158</span>
                    </div>
                    <div className="text-white-50">
                      /mês <small className="annual-only d-none">(pago anualmente)</small>
                    </div>
                  </div>
                  <ul className="list-unstyled text-start mb-4">
                    <li className="mb-2"><i className="bi bi-check-lg text-warning me-2"></i>Produtos ilimitados</li>
                    <li className="mb-2"><i className="bi bi-check-lg text-warning me-2"></i>Até 3 lojas</li>
                    <li className="mb-2"><i className="bi bi-check-lg text-warning me-2"></i>2 PDVs incluídos</li>
                    <li className="mb-2"><i className="bi bi-check-lg text-warning me-2"></i>IA para vendas</li>
                    <li className="mb-2"><i className="bi bi-check-lg text-warning me-2"></i>Suporte prioritário</li>
                    <li className="mb-2"><i className="bi bi-check-lg text-warning me-2"></i>App mobile</li>
                    <li className="mb-2"><i className="bi bi-check-lg text-warning me-2"></i>Relatórios avançados</li>
                  </ul>
                  <div className="bg-dark rounded-3 p-3 mb-4">
                    <small className="text-white-50 d-block">Transações:</small>
                    <strong className="text-warning">2,4% + R$ 0,25 por venda</strong>
                  </div>
                </div>
                <div className="card-footer bg-transparent border-0 p-4">
                  <Link href="/register?plan=pro" className="btn btn-warning w-100 fw-bold py-3 text-dark">
                    Começar Grátis 30 Dias
                  </Link>
                </div>
              </div>
            </div>

            {/* Enterprise */}
            <div className="col-xl-3 col-lg-4 col-md-6">
              <div className="card bg-white text-dark h-100 border-0 shadow-lg">
                <div className="card-header bg-light border-0 text-center py-3">
                  <div className="bg-success text-white rounded-circle mx-auto mb-3" style={{width: "60px", height: "60px", lineHeight: "60px"}}>
                    <i className="bi bi-building fs-4"></i>
                  </div>
                  <h4 className="fw-bold mb-0">Enterprise</h4>
                  <p className="text-muted mb-0">Para escalar</p>
                </div>
                <div className="card-body text-center p-4">
                  <div className="mb-4">
                    <div className="h2 fw-bold text-success mb-0">
                      <span className="monthly-price">R$ 397</span>
                      <span className="annual-price d-none">R$ 318</span>
                    </div>
                    <div className="text-muted">
                      /mês <small className="annual-only d-none">(pago anualmente)</small>
                    </div>
                  </div>
                  <ul className="list-unstyled text-start mb-4">
                    <li className="mb-2"><i className="bi bi-check-lg text-success me-2"></i>Tudo do Pro</li>
                    <li className="mb-2"><i className="bi bi-check-lg text-success me-2"></i>Lojas ilimitadas</li>
                    <li className="mb-2"><i className="bi bi-check-lg text-success me-2"></i>5 PDVs incluídos</li>
                    <li className="mb-2"><i className="bi bi-check-lg text-success me-2"></i>API completa</li>
                    <li className="mb-2"><i className="bi bi-check-lg text-success me-2"></i>Gerente dedicado</li>
                    <li className="mb-2"><i className="bi bi-check-lg text-success me-2"></i>White label</li>
                  </ul>
                  <div className="bg-light rounded-3 p-3 mb-4">
                    <small className="text-muted d-block">Transações:</small>
                    <strong className="text-success">1,9% + R$ 0,20 por venda</strong>
                  </div>
                </div>
                <div className="card-footer bg-transparent border-0 p-4">
                  <Link href="/register?plan=enterprise" className="btn btn-outline-success w-100 fw-bold py-3">
                    Começar Grátis 30 Dias
                  </Link>
                </div>
              </div>
            </div>

            {/* Custom */}
            <div className="col-xl-3 col-lg-4 col-md-6">
              <div className="card bg-gradient-custom text-white h-100 border-0 shadow-lg">
                <div className="card-header bg-transparent border-0 text-center py-3">
                  <div className="bg-white text-dark rounded-circle mx-auto mb-3" style={{width: "60px", height: "60px", lineHeight: "60px"}}>
                    <i className="bi bi-gear fs-4"></i>
                  </div>
                  <h4 className="fw-bold mb-0">Custom</h4>
                  <p className="text-white-50 mb-0">Sob medida</p>
                </div>
                <div className="card-body text-center p-4">
                  <div className="mb-4">
                    <div className="h2 fw-bold mb-0">Sob</div>
                    <div className="h2 fw-bold mb-0">Consulta</div>
                  </div>
                  <ul className="list-unstyled text-start mb-4">
                    <li className="mb-2"><i className="bi bi-check-lg text-white me-2"></i>Solução personalizada</li>
                    <li className="mb-2"><i className="bi bi-check-lg text-white me-2"></i>Integrações customizadas</li>
                    <li className="mb-2"><i className="bi bi-check-lg text-white me-2"></i>Infraestrutura dedicada</li>
                    <li className="mb-2"><i className="bi bi-check-lg text-white me-2"></i>SLA garantido</li>
                    <li className="mb-2"><i className="bi bi-check-lg text-white me-2"></i>Consultoria especializada</li>
                  </ul>
                  <div className="bg-white bg-opacity-20 rounded-3 p-3 mb-4">
                    <small className="text-white-50 d-block">Transações:</small>
                    <strong className="text-white">Negociáveis</strong>
                  </div>
                </div>
                <div className="card-footer bg-transparent border-0 p-4">
                  <a href="#contact" className="btn btn-light w-100 fw-bold py-3">
                    Falar com Vendas
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Addon Services */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(20px)',
            borderRadius: '25px',
            padding: '3rem',
            color: '#1E293B',
            boxShadow: '0 25px 50px rgba(0, 0, 0, 0.1)',
            border: '1px solid rgba(59, 130, 246, 0.2)'
          }}>
            <h3 style={{
              textAlign: 'center',
              fontWeight: 'bold',
              marginBottom: '3rem',
              fontSize: '2rem'
            }}>🧩 Serviços Adicionais</h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '2rem',
              textAlign: 'center'
            }}>
              <div style={{
                border: '1px solid rgba(59, 130, 246, 0.2)',
                borderRadius: '15px',
                padding: '2rem',
                background: 'rgba(255, 255, 255, 0.5)',
                backdropFilter: 'blur(10px)'
              }}>
                <i className="bi bi-credit-card-2-front text-primary fs-2 mb-3"></i>
                <h5 style={{ fontWeight: 'bold' }}>PDV Extra</h5>
                <div style={{
                  color: '#3B82F6',
                  fontWeight: 'bold',
                  fontSize: '1.5rem'
                }}>R$ 27</div>
                <small style={{ color: '#64748B' }}>/mês por unidade</small>
              </div>
              <div style={{
                border: '1px solid rgba(16, 185, 129, 0.2)',
                borderRadius: '15px',
                padding: '2rem',
                background: 'rgba(255, 255, 255, 0.5)',
                backdropFilter: 'blur(10px)'
              }}>
                <i className="bi bi-display text-success fs-2 mb-3"></i>
                <h5 style={{ fontWeight: 'bold' }}>KDS Cozinha</h5>
                <div style={{
                  color: '#10B981',
                  fontWeight: 'bold',
                  fontSize: '1.5rem'
                }}>R$ 17</div>
                <small style={{ color: '#64748B' }}>/mês por tela</small>
              </div>
              <div style={{
                border: '1px solid rgba(245, 158, 11, 0.2)',
                borderRadius: '15px',
                padding: '2rem',
                background: 'rgba(255, 255, 255, 0.5)',
                backdropFilter: 'blur(10px)'
              }}>
                <i className="bi bi-truck text-warning fs-2 mb-3"></i>
                <h5 style={{ fontWeight: 'bold' }}>Gestão Frota</h5>
                <div style={{
                  color: '#F59E0B',
                  fontWeight: 'bold',
                  fontSize: '1.5rem'
                }}>R$ 37</div>
                <small style={{ color: '#64748B' }}>/mês por veículo</small>
              </div>
              <div style={{
                border: '1px solid rgba(6, 182, 212, 0.2)',
                borderRadius: '15px',
                padding: '2rem',
                background: 'rgba(255, 255, 255, 0.5)',
                backdropFilter: 'blur(10px)'
              }}>
                <i className="bi bi-shop text-info fs-2 mb-3"></i>
                <h5 style={{ fontWeight: 'bold' }}>Loja Extra</h5>
                <div style={{
                  color: '#06B6D4',
                  fontWeight: 'bold',
                  fontSize: '1.5rem'
                }}>R$ 47</div>
                <small style={{ color: '#64748B' }}>/mês por loja</small>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Demo */}
      <section style={{
        padding: '5rem 0',
        background: 'rgba(255, 255, 255, 0.5)',
        backdropFilter: 'blur(10px)'
      }} id="demo">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <h2 style={{
                fontSize: '3rem',
                fontWeight: 'bold',
                marginBottom: '2rem',
                color: '#1E293B'
              }}>
                Veja como seus clientes vão comprar
              </h2>
              <p style={{
                fontSize: '1.25rem',
                color: '#64748B',
                marginBottom: '2rem',
                lineHeight: '1.6'
              }}>
                Experimente na prática como funciona o delivery e a experiência de
                compra.
              </p>
              <Link href="/demo" style={{
                background: 'linear-gradient(135deg, #3B82F6 0%, #06B6D4 100%)',
                color: 'white',
                padding: '15px 30px',
                borderRadius: '15px',
                textDecoration: 'none',
                fontWeight: 'bold',
                fontSize: '1.1rem',
                display: 'inline-flex',
                alignItems: 'center',
                boxShadow: '0 10px 25px rgba(59, 130, 246, 0.3)',
                transition: 'all 0.3s ease'
              }}>
                <i className="bi bi-play-circle me-2" />
                Experimentar Demo Agora
              </Link>
            </div>
            <div className="col-lg-6 text-center">
              <div style={{
                background: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(20px)',
                borderRadius: '25px',
                padding: '2rem',
                boxShadow: '0 25px 50px rgba(0, 0, 0, 0.1)',
                border: '1px solid rgba(59, 130, 246, 0.2)',
                display: 'inline-block'
              }}>
                <i style={{
                  fontSize: '4rem',
                  marginBottom: '1.5rem',
                  color: '#3B82F6'
                }} className="bi bi-phone" />
                <h6 style={{
                  color: '#1E293B',
                  fontWeight: 'bold',
                  marginBottom: '1.5rem'
                }}>Preview do Cardápio Mobile</h6>
                <div style={{ marginTop: '1.5rem' }}>
                  <div style={{
                    background: '#F8FAFC',
                    color: '#1E293B',
                    borderRadius: '10px',
                    padding: '0.75rem',
                    marginBottom: '0.75rem',
                    border: '1px solid rgba(59, 130, 246, 0.1)'
                  }}>
                    🍕 Pizza Margherita - R$ 32,90
                  </div>
                  <div style={{
                    background: '#F8FAFC',
                    color: '#1E293B',
                    borderRadius: '10px',
                    padding: '0.75rem',
                    marginBottom: '0.75rem',
                    border: '1px solid rgba(16, 185, 129, 0.1)'
                  }}>
                    🍔 X-Burger - R$ 28,90
                  </div>
                  <div style={{
                    background: '#F8FAFC',
                    color: '#1E293B',
                    borderRadius: '10px',
                    padding: '0.75rem',
                    border: '1px solid rgba(245, 158, 11, 0.1)'
                  }}>🥤 Refrigerante 2L - R$ 8,90</div>
                </div>
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
        padding: '4rem 0 2rem 0'
      }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '3rem',
            marginBottom: '3rem'
          }}>
            {/* Coluna 1 - Sobre */}
            <div>
              <h5 style={{
                fontSize: '1.5rem',
                fontWeight: 'bold',
                marginBottom: '1.5rem',
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
                marginBottom: '1.5rem'
              }}>
                A plataforma completa para transformar seu negócio. PDV inteligente, 
                loja online e delivery em uma única solução.
              </p>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <a href="#" style={{
                  color: 'rgba(255, 255, 255, 0.8)',
                  fontSize: '1.5rem',
                  transition: 'color 0.3s ease'
                }}>
                  <i className="bi bi-facebook"></i>
                </a>
                <a href="#" style={{
                  color: 'rgba(255, 255, 255, 0.8)',
                  fontSize: '1.5rem',
                  transition: 'color 0.3s ease'
                }}>
                  <i className="bi bi-instagram"></i>
                </a>
                <a href="#" style={{
                  color: 'rgba(255, 255, 255, 0.8)',
                  fontSize: '1.5rem',
                  transition: 'color 0.3s ease'
                }}>
                  <i className="bi bi-linkedin"></i>
                </a>
                <a href="#" style={{
                  color: 'rgba(255, 255, 255, 0.8)',
                  fontSize: '1.5rem',
                  transition: 'color 0.3s ease'
                }}>
                  <i className="bi bi-youtube"></i>
                </a>
              </div>
            </div>

            {/* Coluna 2 - Produtos */}
            <div>
              <h6 style={{
                fontWeight: 'bold',
                marginBottom: '1.5rem',
                color: 'white'
              }}>
                Produtos
              </h6>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                <li style={{ marginBottom: '0.75rem' }}>
                  <a href="#demos" style={{
                    color: 'rgba(255, 255, 255, 0.8)',
                    textDecoration: 'none',
                    transition: 'color 0.3s ease'
                  }}>
                    PDV Inteligente
                  </a>
                </li>
                <li style={{ marginBottom: '0.75rem' }}>
                  <a href="#demos" style={{
                    color: 'rgba(255, 255, 255, 0.8)',
                    textDecoration: 'none',
                    transition: 'color 0.3s ease'
                  }}>
                    Loja Online
                  </a>
                </li>
                <li style={{ marginBottom: '0.75rem' }}>
                  <a href="#demos" style={{
                    color: 'rgba(255, 255, 255, 0.8)',
                    textDecoration: 'none',
                    transition: 'color 0.3s ease'
                  }}>
                    Sistema Delivery
                  </a>
                </li>
                <li style={{ marginBottom: '0.75rem' }}>
                  <a href="#features" style={{
                    color: 'rgba(255, 255, 255, 0.8)',
                    textDecoration: 'none',
                    transition: 'color 0.3s ease'
                  }}>
                    IA Integrada
                  </a>
                </li>
              </ul>
            </div>

            {/* Coluna 3 - Segmentos */}
            <div>
              <h6 style={{
                fontWeight: 'bold',
                marginBottom: '1.5rem',
                color: 'white'
              }}>
                Segmentos
              </h6>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                <li style={{ marginBottom: '0.75rem' }}>
                  <a href="/demo/lanchonete" style={{
                    color: 'rgba(255, 255, 255, 0.8)',
                    textDecoration: 'none',
                    transition: 'color 0.3s ease'
                  }}>
                    Lanchonetes
                  </a>
                </li>
                <li style={{ marginBottom: '0.75rem' }}>
                  <a href="/demo/pizzaria" style={{
                    color: 'rgba(255, 255, 255, 0.8)',
                    textDecoration: 'none',
                    transition: 'color 0.3s ease'
                  }}>
                    Pizzarias
                  </a>
                </li>
                <li style={{ marginBottom: '0.75rem' }}>
                  <a href="/demo/moda" style={{
                    color: 'rgba(255, 255, 255, 0.8)',
                    textDecoration: 'none',
                    transition: 'color 0.3s ease'
                  }}>
                    Moda & Acessórios
                  </a>
                </li>
                <li style={{ marginBottom: '0.75rem' }}>
                  <a href="/demo/mercado" style={{
                    color: 'rgba(255, 255, 255, 0.8)',
                    textDecoration: 'none',
                    transition: 'color 0.3s ease'
                  }}>
                    Mercados
                  </a>
                </li>
              </ul>
            </div>

            {/* Coluna 4 - Suporte */}
            <div>
              <h6 style={{
                fontWeight: 'bold',
                marginBottom: '1.5rem',
                color: 'white'
              }}>
                Suporte
              </h6>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                <li style={{ marginBottom: '0.75rem' }}>
                  <a href="#faq" style={{
                    color: 'rgba(255, 255, 255, 0.8)',
                    textDecoration: 'none',
                    transition: 'color 0.3s ease'
                  }}>
                    Central de Ajuda
                  </a>
                </li>
                <li style={{ marginBottom: '0.75rem' }}>
                  <a href="mailto:contato@varejofflex.com" style={{
                    color: 'rgba(255, 255, 255, 0.8)',
                    textDecoration: 'none',
                    transition: 'color 0.3s ease'
                  }}>
                    Contato
                  </a>
                </li>
                <li style={{ marginBottom: '0.75rem' }}>
                  <a href="tel:+5511999999999" style={{
                    color: 'rgba(255, 255, 255, 0.8)',
                    textDecoration: 'none',
                    transition: 'color 0.3s ease'
                  }}>
                    (11) 99999-9999
                  </a>
                </li>
                <li style={{ marginBottom: '0.75rem' }}>
                  <span style={{
                    color: 'rgba(255, 255, 255, 0.8)'
                  }}>
                    Suporte 24/7
                  </span>
                </li>
              </ul>
            </div>
          </div>

          {/* Linha de Separação */}
          <div style={{
            height: '1px',
            background: 'rgba(255, 255, 255, 0.1)',
            marginBottom: '2rem'
          }}></div>

          {/* Copyright e Links Legais */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem'
          }}>
            <div style={{
              color: 'rgba(255, 255, 255, 0.6)',
              fontSize: '0.9rem'
            }}>
              © 2025 Varejofflex. Todos os direitos reservados.
            </div>
            <div style={{
              display: 'flex',
              gap: '2rem',
              flexWrap: 'wrap'
            }}>
              <a href="/privacy" style={{
                color: 'rgba(255, 255, 255, 0.6)',
                textDecoration: 'none',
                fontSize: '0.9rem',
                transition: 'color 0.3s ease'
              }}>
                Política de Privacidade
              </a>
              <a href="/terms" style={{
                color: 'rgba(255, 255, 255, 0.6)',
                textDecoration: 'none',
                fontSize: '0.9rem',
                transition: 'color 0.3s ease'
              }}>
                Termos de Uso
              </a>
              <a href="/cookies" style={{
                color: 'rgba(255, 255, 255, 0.6)',
                textDecoration: 'none',
                fontSize: '0.9rem',
                transition: 'color 0.3s ease'
              }}>
                Cookies
              </a>
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
