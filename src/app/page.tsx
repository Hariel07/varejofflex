import Link from "next/link";

export const metadata = {
  title: "Varejofflex — Sua loja online e PDV em uma única plataforma",
  description:
    "Venda mais pagando só o que usar. Plataforma completa para varejo com loja online, PDV e delivery. Teste grátis por 15 dias.",
};

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="hero-section" id="hero">
        <div className="container">
          <div className="row align-items-center text-center text-lg-start">
            <div className="col-lg-6">
              <h1 className="display-4 fw-bold mb-4">
                Sua loja online e PDV em uma única plataforma
              </h1>
              <p className="lead mb-4">
                Venda mais pagando só o que usar. Configure sua loja em 15
                minutos.
              </p>
              <div className="d-flex flex-column flex-sm-row gap-3 mb-4 justify-content-center justify-content-lg-start">
                <a href="#pricing" className="btn btn-light btn-lg px-4">
                  <i className="bi bi-graph-up-arrow me-2" />
                  Ver Planos
                </a>
                <Link href="/demo" className="btn btn-outline-light btn-lg px-4">
                  <i className="bi bi-play-circle me-2" />
                  Experimentar Demo
                </Link>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="bg-white rounded-4 p-4 shadow-lg d-inline-block">
                <i className="bi bi-laptop text-primary" style={{ fontSize: 120 }} />
                <p className="text-dark mt-2 mb-0">Dashboard Preview</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-5 bg-light-subtle" id="social-proof">
        <div className="container text-center">
          <div className="row">
            <div className="col-md-4 mb-4">
              <div className="h1 fw-bold text-primary">5.000+</div>
              <p className="text-muted">Lojas Ativas</p>
            </div>
            <div className="col-md-4 mb-4">
              <div className="h1 fw-bold text-primary">R$ 50M+</div>
              <p className="text-muted">Vendas Processadas</p>
            </div>
            <div className="col-md-4 mb-4">
              <div className="h1 fw-bold text-primary">12+</div>
              <p className="text-muted">Segmentos</p>
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
      <section className="py-5 bg-light-subtle" id="pricing">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="display-5 fw-bold">
              Planos transparentes. Pague só o que usar.
            </h2>
            <p className="lead text-muted">
              Escolha seu plano base e adicione só as unidades que precisar
            </p>
          </div>

          <div className="row g-4 justify-content-center">
            {/* Starter */}
            <div className="col-lg-4">
              <div className="pricing-card h-100 p-4">
                <h4 className="fw-bold text-center">Starter</h4>
                <div className="text-center my-4">
                  <span className="h2 fw-bold text-primary">R$ 97</span>
                  <span className="text-muted">/mês</span>
                </div>
                <ul className="list-unstyled">
                  <li>
                    <i className="bi bi-check-circle-fill text-success me-2" />
                    Até 1.000 produtos
                  </li>
                  <li>
                    <i className="bi bi-check-circle-fill text-success me-2" />
                    Até 5.000 pedidos/mês
                  </li>
                  <li>
                    <i className="bi bi-check-circle-fill text-success me-2" />
                    15 temas + personalização
                  </li>
                  <li>
                    <i className="bi bi-check-circle-fill text-success me-2" />
                    25 integrações
                  </li>
                  <li>
                    <i className="bi bi-check-circle-fill text-success me-2" />
                    Domínio próprio
                  </li>
                </ul>
                <Link href="/register" className="btn btn-outline-primary w-100 mt-3">
                  Começar Teste Grátis
                </Link>
              </div>
            </div>

            {/* Pro */}
            <div className="col-lg-4">
              <div className="pricing-card featured h-100 p-4">
                <div className="featured-badge">Recomendado</div>
                <h4 className="fw-bold text-center">Pro</h4>
                <div className="text-center my-4">
                  <span className="h2 fw-bold text-primary">R$ 197</span>
                  <span className="text-muted">/mês</span>
                </div>
                <ul className="list-unstyled">
                  <li>
                    <i className="bi bi-check-circle-fill text-success me-2" />
                    Tudo do Starter
                  </li>
                  <li>
                    <i className="bi bi-check-circle-fill text-success me-2" />
                    Produtos ilimitados
                  </li>
                  <li>
                    <i className="bi bi-check-circle-fill text-success me-2" />
                    Integrações ilimitadas
                  </li>
                  <li>
                    <i className="bi bi-check-circle-fill text-success me-2" />
                    IA Insights
                  </li>
                  <li>
                    <i className="bi bi-check-circle-fill text-success me-2" />
                    Suporte prioritário
                  </li>
                </ul>
                <Link href="/register" className="btn btn-primary w-100 mt-3">
                  Começar Teste Grátis
                </Link>
              </div>
            </div>

            {/* Scale */}
            <div className="col-lg-4">
              <div className="pricing-card h-100 p-4">
                <h4 className="fw-bold text-center">Scale</h4>
                <div className="text-center my-4">
                  <span className="h2 fw-bold text-primary">R$ 397</span>
                  <span className="text-muted">/mês</span>
                </div>
                <ul className="list-unstyled">
                  <li>
                    <i className="bi bi-check-circle-fill text-success me-2" />
                    Tudo do Pro
                  </li>
                  <li>
                    <i className="bi bi-check-circle-fill text-success me-2" />
                    Produtos ilimitados
                  </li>
                  <li>
                    <i className="bi bi-check-circle-fill text-success me-2" />
                    Suporte dedicado
                  </li>
                  <li>
                    <i className="bi bi-check-circle-fill text-success me-2" />
                    Relatórios avançados
                  </li>
                </ul>
                <Link href="/register" className="btn btn-outline-primary w-100 mt-3">
                  Começar Teste Grátis
                </Link>
              </div>
            </div>
          </div>

          {/* Unidades adicionais */}
          <div className="row mt-5">
            <div className="col-12">
              <div className="bg-white rounded-4 p-4 shadow-sm">
                <h5 className="fw-bold text-center mb-4">
                  Unidades Adicionais (preço por mês)
                </h5>
                <div className="row text-center">
                  <div className="col-md-3 col-6 mb-3">
                    <div className="border rounded p-3">
                      <i className="bi bi-shop fs-3 text-primary" />
                      <h6 className="mt-2">Loja Extra</h6>
                      <p className="text-primary fw-bold mb-1">R$ 47/mês</p>
                    </div>
                  </div>
                  <div className="col-md-3 col-6 mb-3">
                    <div className="border rounded p-3">
                      <i className="bi bi-credit-card fs-3 text-success" />
                      <h6 className="mt-2">PDV</h6>
                      <p className="text-success fw-bold mb-1">R$ 27/mês</p>
                    </div>
                  </div>
                  <div className="col-md-3 col-6 mb-3">
                    <div className="border rounded p-3">
                      <i className="bi bi-display fs-3 text-warning" />
                      <h6 className="mt-2">KDS</h6>
                      <p className="text-warning fw-bold mb-1">R$ 17/mês</p>
                    </div>
                  </div>
                  <div className="col-md-3 col-6 mb-3">
                    <div className="border rounded p-3">
                      <i className="bi bi-truck fs-3 text-info" />
                      <h6 className="mt-2">Frota</h6>
                      <p className="text-info fw-bold mb-1">R$ 37/mês</p>
                    </div>
                  </div>
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
