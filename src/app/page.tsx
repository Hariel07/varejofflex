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
      {/* Hero */}
      <section className="hero-section position-relative overflow-hidden" id="hero">
        <div className="position-absolute top-0 start-0 w-100 h-100">
          <div className="bg-gradient-primary opacity-10"></div>
        </div>
        <div className="container position-relative">
          <div className="row align-items-center min-vh-100 py-5">
            <div className="col-lg-6">
              <div className="badge bg-success mb-4 px-3 py-2 fs-6">
                🚀 Mais de 10.000 negócios transformados
              </div>
              <h1 className="display-3 fw-bold mb-4 text-white">
                Revolucione seu negócio com
                <span className="text-warning d-block">tecnologia de ponta</span>
              </h1>
              <p className="lead mb-5 text-white-50">
                PDV inteligente, loja online profissional, delivery otimizado e IA integrada. 
                Tudo em uma plataforma que cresce com você.
              </p>
              <div className="row g-3 mb-5">
                <div className="col-sm-6">
                  <div className="d-flex align-items-center text-white">
                    <i className="bi bi-check-circle-fill text-success me-3 fs-5"></i>
                    <span>Setup em 5 minutos</span>
                  </div>
                </div>
                <div className="col-sm-6">
                  <div className="d-flex align-items-center text-white">
                    <i className="bi bi-check-circle-fill text-success me-3 fs-5"></i>
                    <span>Suporte 24/7</span>
                  </div>
                </div>
                <div className="col-sm-6">
                  <div className="d-flex align-items-center text-white">
                    <i className="bi bi-check-circle-fill text-success me-3 fs-5"></i>
                    <span>Sem taxas ocultas</span>
                  </div>
                </div>
                <div className="col-sm-6">
                  <div className="d-flex align-items-center text-white">
                    <i className="bi bi-check-circle-fill text-success me-3 fs-5"></i>
                    <span>Cancele quando quiser</span>
                  </div>
                </div>
              </div>
              <div className="d-flex flex-column flex-sm-row gap-3 mb-4">
                <a href="#demos" className="btn btn-warning btn-lg px-5 py-3 fw-bold">
                  <i className="bi bi-play-circle me-2" />
                  Ver Demos por Segmento
                </a>
                <a href="#pricing" className="btn btn-outline-light btn-lg px-5 py-3">
                  <i className="bi bi-calculator me-2" />
                  Calcular Investimento
                </a>
              </div>
              <div className="row text-center mt-4">
                <div className="col-4">
                  <div className="text-warning fw-bold fs-4">4.9/5</div>
                  <small className="text-white-50">Avaliação</small>
                </div>
                <div className="col-4">
                  <div className="text-warning fw-bold fs-4">99.9%</div>
                  <small className="text-white-50">Uptime</small>
                </div>
                <div className="col-4">
                  <div className="text-warning fw-bold fs-4">24h</div>
                  <small className="text-white-50">Suporte</small>
                </div>
              </div>
            </div>
            <div className="col-lg-6 text-center">
              <div className="position-relative">
                <div className="bg-white rounded-4 p-4 shadow-lg d-inline-block">
                  <div className="row g-3">
                    <div className="col-12">
                      <div className="bg-primary text-white rounded-3 p-3 text-center">
                        <i className="bi bi-graph-up-arrow fs-1 mb-2"></i>
                        <h5 className="mb-0">Dashboard Inteligente</h5>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="bg-success text-white rounded-3 p-3 text-center">
                        <i className="bi bi-credit-card fs-3"></i>
                        <div className="fw-bold">PDV</div>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="bg-warning text-white rounded-3 p-3 text-center">
                        <i className="bi bi-shop fs-3"></i>
                        <div className="fw-bold">Loja</div>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="bg-info text-white rounded-3 p-3 text-center">
                        <i className="bi bi-truck fs-3"></i>
                        <div className="fw-bold">Delivery</div>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="bg-danger text-white rounded-3 p-3 text-center">
                        <i className="bi bi-robot fs-3"></i>
                        <div className="fw-bold">IA</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="position-absolute top-0 start-0 w-100 h-100 bg-gradient-radial opacity-20 pointer-events-none"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Demos por Segmento */}
      <section className="py-5 bg-light" id="demos">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="display-5 fw-bold mb-3">
              Veja como funciona no <span className="text-primary">seu segmento</span>
            </h2>
            <p className="lead text-muted">
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
      <section className="py-5" id="value-props">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="display-5 fw-bold">Por que escolher o Varejofflex?</h2>
            <p className="lead text-muted">Benefícios reais para o seu negócio crescer</p>
          </div>
          <div className="row g-4 text-center">
            <div className="col-md-3">
              <i className="bi bi-graph-up text-primary fs-1 mb-3" />
              <h5 className="fw-bold">Venda Mais</h5>
              <p className="text-muted">Multiplique seus canais de venda</p>
            </div>
            <div className="col-md-3">
              <i className="bi bi-cash-coin text-success fs-1 mb-3" />
              <h5 className="fw-bold">Pague Menos</h5>
              <p className="text-muted">Só pague pelas unidades que usar</p>
            </div>
            <div className="col-md-3">
              <i className="bi bi-lightning-charge text-warning fs-1 mb-3" />
              <h5 className="fw-bold">Configure Rápido</h5>
              <p className="text-muted">15 minutos para sua loja no ar</p>
            </div>
            <div className="col-md-3">
              <i className="bi bi-headset text-info fs-1 mb-3" />
              <h5 className="fw-bold">Suporte Total</h5>
              <p className="text-muted">IA + especialistas 24/7</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-5 bg-dark text-white" id="pricing">
        <div className="container">
          <div className="text-center mb-5">
            <div className="badge bg-warning text-dark px-3 py-2 mb-3">
              💸 Economize até 70% comparado à concorrência
            </div>
            <h2 className="display-4 fw-bold mb-3">
              Preços que cabem no seu <span className="text-warning">bolso</span>
            </h2>
            <p className="lead text-white-50 mb-4">
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
          <div className="bg-white rounded-4 p-5 text-dark">
            <h3 className="text-center fw-bold mb-4">🧩 Serviços Adicionais</h3>
            <div className="row g-4 text-center">
              <div className="col-lg-3 col-md-6">
                <div className="border rounded-3 p-4 h-100">
                  <i className="bi bi-credit-card-2-front text-primary fs-2 mb-3"></i>
                  <h5 className="fw-bold">PDV Extra</h5>
                  <div className="text-primary fw-bold fs-4">R$ 27</div>
                  <small className="text-muted">/mês por unidade</small>
                </div>
              </div>
              <div className="col-lg-3 col-md-6">
                <div className="border rounded-3 p-4 h-100">
                  <i className="bi bi-display text-success fs-2 mb-3"></i>
                  <h5 className="fw-bold">KDS Cozinha</h5>
                  <div className="text-success fw-bold fs-4">R$ 17</div>
                  <small className="text-muted">/mês por tela</small>
                </div>
              </div>
              <div className="col-lg-3 col-md-6">
                <div className="border rounded-3 p-4 h-100">
                  <i className="bi bi-truck text-warning fs-2 mb-3"></i>
                  <h5 className="fw-bold">Gestão Frota</h5>
                  <div className="text-warning fw-bold fs-4">R$ 37</div>
                  <small className="text-muted">/mês por veículo</small>
                </div>
              </div>
              <div className="col-lg-3 col-md-6">
                <div className="border rounded-3 p-4 h-100">
                  <i className="bi bi-shop text-info fs-2 mb-3"></i>
                  <h5 className="fw-bold">Loja Extra</h5>
                  <div className="text-info fw-bold fs-4">R$ 47</div>
                  <small className="text-muted">/mês por loja</small>
                </div>
              </div>
            </div>
          </div>

          {/* Comparação com Concorrentes */}
          <div className="mt-5 text-center">
            <h3 className="fw-bold mb-4">💰 Compare e Economize</h3>
            <div className="row justify-content-center">
              <div className="col-lg-8">
                <div className="table-responsive">
                  <table className="table table-dark table-striped">
                    <thead>
                      <tr>
                        <th>Recurso</th>
                        <th className="text-warning">Varejofflex</th>
                        <th>Concorrente A</th>
                        <th>Concorrente B</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Taxa por transação</td>
                        <td className="text-warning fw-bold">2,4%</td>
                        <td>4,9%</td>
                        <td>3,8%</td>
                      </tr>
                      <tr>
                        <td>Setup grátis</td>
                        <td><i className="bi bi-check-lg text-success"></i></td>
                        <td><i className="bi bi-x-lg text-danger"></i></td>
                        <td><i className="bi bi-x-lg text-danger"></i></td>
                      </tr>
                      <tr>
                        <td>IA integrada</td>
                        <td><i className="bi bi-check-lg text-success"></i></td>
                        <td><i className="bi bi-x-lg text-danger"></i></td>
                        <td><i className="bi bi-dash text-warning"></i></td>
                      </tr>
                      <tr>
                        <td>Suporte 24/7</td>
                        <td><i className="bi bi-check-lg text-success"></i></td>
                        <td><i className="bi bi-dash text-warning"></i></td>
                        <td><i className="bi bi-x-lg text-danger"></i></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Segmentos */}
      <section className="py-5" id="segments">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="display-5 fw-bold">Para todos os tipos de negócio</h2>
            <p className="lead text-muted">Soluções especializadas para cada segmento</p>
          </div>
          <div className="row g-4">
            <div className="col-md-4 col-sm-6">
              <div className="segment-card">
                <i className="bi bi-cup-hot fs-1 text-primary mb-3" />
                <h5>Lanchonetes</h5>
                <p className="text-muted">
                  Cardápio digital, pedidos online e PDV integrado
                </p>
              </div>
            </div>
            <div className="col-md-4 col-sm-6">
              <div className="segment-card">
                <i className="bi bi-pizza fs-1 text-primary mb-3" />
                <h5>Pizzarias</h5>
                <p className="text-muted">
                  Delivery otimizado com rastreamento em tempo real
                </p>
              </div>
            </div>
            <div className="col-md-4 col-sm-6">
              <div className="segment-card">
                <i className="bi bi-bag fs-1 text-primary mb-3" />
                <h5>Moda & Acessórios</h5>
                <p className="text-muted">
                  Catálogo visual e gestão de estoque por variação
                </p>
              </div>
            </div>
            <div className="col-md-4 col-sm-6">
              <div className="segment-card">
                <i className="bi bi-basket fs-1 text-primary mb-3" />
                <h5>Mercados</h5>
                <p className="text-muted">
                  Integração com balanças e código de barras
                </p>
              </div>
            </div>
            <div className="col-md-4 col-sm-6">
              <div className="segment-card">
                <i className="bi bi-heart fs-1 text-primary mb-3" />
                <h5>Petshops</h5>
                <p className="text-muted">Agendamentos e ficha completa dos pets</p>
              </div>
            </div>
            <div className="col-md-4 col-sm-6">
              <div className="segment-card">
                <i className="bi bi-scissors fs-1 text-primary mb-3" />
                <h5>Salões</h5>
                <p className="text-muted">Agenda online e gestão de profissionais</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Demo */}
      <section className="py-5 bg-light-subtle" id="demo">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <h2 className="display-5 fw-bold mb-4">
                Veja como seus clientes vão comprar
              </h2>
              <p className="lead text-muted mb-4">
                Experimente na prática como funciona o delivery e a experiência de
                compra.
              </p>
              <Link href="/demo" className="btn btn-primary btn-lg">
                <i className="bi bi-play-circle me-2" />
                Experimentar Demo Agora
              </Link>
            </div>
            <div className="col-lg-6 text-center">
              <div className="demo-preview">
                <i className="bi bi-phone fs-1 mb-3" />
                <h6>Preview do Cardápio Mobile</h6>
                <div className="mt-3">
                  <div className="bg-white text-dark rounded p-2 mb-2">
                    🍕 Pizza Margherita - R$ 32,90
                  </div>
                  <div className="bg-white text-dark rounded p-2 mb-2">
                    🍔 X-Burger - R$ 28,90
                  </div>
                  <div className="bg-white text-dark rounded p-2">🥤 Refrigerante 2L - R$ 8,90</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-5" id="features">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="display-5 fw-bold">
              Tudo que você precisa em um só lugar
            </h2>
            <p className="lead text-muted">Recursos completos para seu negócio crescer</p>
          </div>
          <div className="row g-4">
            <div className="col-md-6 col-lg-4">
              <div className="d-flex">
                <div className="bg-primary text-white rounded p-3 me-3">
                  <i className="bi bi-credit-card fs-4" />
                </div>
                <div>
                  <h5 className="fw-bold">PDV Completo</h5>
                  <p className="text-muted">
                    Terminal de vendas com impressora, gaveta e leitor integrados
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-lg-4">
              <div className="d-flex">
                <div className="bg-success text-white rounded p-3 me-3">
                  <i className="bi bi-robot fs-4" />
                </div>
                <div>
                  <h5 className="fw-bold">IA Integrada</h5>
                  <p className="text-muted">Assistente virtual e insights inteligentes</p>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-lg-4">
              <div className="d-flex">
                <div className="bg-warning text-white rounded p-3 me-3">
                  <i className="bi bi-currency-exchange fs-4" />
                </div>
                <div>
                  <h5 className="fw-bold">Multimoeda</h5>
                  <p className="text-muted">Venda em diferentes moedas e idiomas</p>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-lg-4">
              <div className="d-flex">
                <div className="bg-info text-white rounded p-3 me-3">
                  <i className="bi bi-percent fs-4" />
                </div>
                <div>
                  <h5 className="fw-bold">Cupons</h5>
                  <p className="text-muted">
                    Sistema completo de promoções e cupons
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-lg-4">
              <div className="d-flex">
                <div className="bg-secondary text-white rounded p-3 me-3">
                  <i className="bi bi-bar-chart fs-4" />
                </div>
                <div>
                  <h5 className="fw-bold">Relatórios</h5>
                  <p className="text-muted">Dashboards com métricas em tempo real</p>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-lg-4">
              <div className="d-flex">
                <div className="bg-danger text-white rounded p-3 me-3">
                  <i className="bi bi-puzzle fs-4" />
                </div>
                <div>
                  <h5 className="fw-bold">Integrações</h5>
                  <p className="text-muted">Conecte com pagamento, delivery e ERPs</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-5 bg-light-subtle" id="testimonials">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="display-5 fw-bold">O que nossos lojistas dizem</h2>
          </div>
          <div className="row g-4">
            <div className="col-lg-4">
              <div className="bg-white rounded-4 p-4 shadow">
                <div className="mb-2">
                  <i className="bi bi-star-fill text-warning" />
                  <i className="bi bi-star-fill text-warning" />
                  <i className="bi bi-star-fill text-warning" />
                  <i className="bi bi-star-fill text-warning" />
                  <i className="bi bi-star-fill text-warning" />
                </div>
                <p>
                  &quot;Aumentei 70% as vendas online em 3 meses. O PDV integrado facilitou
                  muito a operação.&quot;
                </p>
                <h6 className="mb-0">Maria Silva</h6>
                <small className="text-muted">Pizzaria Bella Vista</small>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="bg-white rounded-4 p-4 shadow">
                <div className="mb-2">
                  <i className="bi bi-star-fill text-warning" />
                  <i className="bi bi-star-fill text-warning" />
                  <i className="bi bi-star-fill text-warning" />
                  <i className="bi bi-star-fill text-warning" />
                  <i className="bi bi-star-fill text-warning" />
                </div>
                <p>
                  &quot;A cobrança por unidade é perfeita. Comecei pequeno e fui crescendo
                  conforme a necessidade.&quot;
                </p>
                <h6 className="mb-0">João Santos</h6>
                <small className="text-muted">Mercado do Bairro</small>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="bg-white rounded-4 p-4 shadow">
                <div className="mb-2">
                  <i className="bi bi-star-fill text-warning" />
                  <i className="bi bi-star-fill text-warning" />
                  <i className="bi bi-star-fill text-warning" />
                  <i className="bi bi-star-fill text-warning" />
                  <i className="bi bi-star-fill text-warning" />
                </div>
                <p>
                  &quot;Suporte excepcional! A IA me ajuda a entender meus clientes e
                  aumentar as vendas.&quot;
                </p>
                <h6 className="mb-0">Ana Costa</h6>
                <small className="text-muted">Boutique Elegance</small>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-5" id="faq">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="display-5 fw-bold">Dúvidas frequentes</h2>
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
      <section className="py-5 bg-primary text-white">
        <div className="container text-center">
          <h2 className="display-5 fw-bold mb-4">Comece a vender mais hoje mesmo</h2>
          <p className="lead mb-4">Junte-se a mais de 5.000 lojistas</p>
          <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center">
            <Link href="/register" className="btn btn-light btn-lg">
              Teste Grátis 15 dias
            </Link>
            <a href="#pricing" className="btn btn-outline-light btn-lg">
              Ver Planos
            </a>
          </div>
        </div>
      </section>

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
