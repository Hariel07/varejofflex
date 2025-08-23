export default function PricingSection() {
  return (
    <section className="py-5 bg-light" id="pricing">
      <div className="container">
        <div className="row justify-content-center mb-5">
          <div className="col-lg-8 text-center">
            <h2 className="display-4 fw-bold mb-3">Escolha seu Plano</h2>
            <p className="lead text-muted">
              Soluções completas para diferentes tamanhos de negócio
            </p>
          </div>
        </div>

        <div className="row justify-content-center">
          {/* Plano Básico */}
          <div className="col-lg-4 col-md-6 mb-4">
            <div 
              className="card h-100 shadow-lg border-0 pricing-card"
              style={{
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
              }}
            >
              <div className="card-header text-center border-0 bg-transparent pt-4">
                <h4 className="fw-bold text-primary">Básico</h4>
                <div className="price-display">
                  <span className="h2 fw-bold text-dark">R$ 89</span>
                  <small className="text-muted">/mês</small>
                </div>
                <div className="text-success small">
                  <strong>R$ 70/mês anual</strong> (20% desconto)
                </div>
              </div>
              <div className="card-body">
                <ul className="list-unstyled">
                  <li className="mb-2"><i className="bi bi-check-circle-fill text-success me-2"></i>Até 100 produtos</li>
                  <li className="mb-2"><i className="bi bi-check-circle-fill text-success me-2"></i>1 usuário</li>
                  <li className="mb-2"><i className="bi bi-check-circle-fill text-success me-2"></i>PDV básico</li>
                  <li className="mb-2"><i className="bi bi-check-circle-fill text-success me-2"></i>Relatórios essenciais</li>
                  <li className="mb-2"><i className="bi bi-check-circle-fill text-success me-2"></i>Suporte por email</li>
                  <li className="mb-2"><i className="bi bi-check-circle-fill text-success me-2"></i>14 dias grátis</li>
                </ul>
                <div className="mt-3 p-3 bg-light rounded">
                  <small className="text-muted">
                    <strong>Taxa por transação:</strong> 3.2%<br/>
                    <strong>Ideal para:</strong> Pequenos negócios
                  </small>
                </div>
              </div>
              <div className="card-footer border-0 bg-transparent">
                <button className="btn btn-outline-primary w-100 btn-lg">
                  Começar Agora
                </button>
              </div>
            </div>
          </div>

          {/* Plano Profissional */}
          <div className="col-lg-4 col-md-6 mb-4">
            <div 
              className="card h-100 shadow-lg border-0 pricing-card position-relative"
              style={{
                background: 'linear-gradient(135deg, rgba(13, 110, 253, 0.1) 0%, rgba(255, 255, 255, 0.95) 100%)',
                backdropFilter: 'blur(15px)',
                border: '2px solid rgba(13, 110, 253, 0.3)',
                transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
              }}
            >
              <div className="position-absolute top-0 start-50 translate-middle">
                <span className="badge bg-primary px-3 py-2 rounded-pill">
                  <i className="bi bi-star-fill me-1"></i>Mais Popular
                </span>
              </div>
              <div className="card-header text-center border-0 bg-transparent pt-5">
                <h4 className="fw-bold text-primary">Profissional</h4>
                <div className="price-display">
                  <span className="h2 fw-bold text-dark">R$ 179</span>
                  <small className="text-muted">/mês</small>
                </div>
                <div className="text-success small">
                  <strong>R$ 134/mês anual</strong> (25% desconto)
                </div>
              </div>
              <div className="card-body">
                <ul className="list-unstyled">
                  <li className="mb-2"><i className="bi bi-check-circle-fill text-success me-2"></i>Até 1.000 produtos</li>
                  <li className="mb-2"><i className="bi bi-check-circle-fill text-success me-2"></i>5 usuários</li>
                  <li className="mb-2"><i className="bi bi-check-circle-fill text-success me-2"></i>PDV completo</li>
                  <li className="mb-2"><i className="bi bi-check-circle-fill text-success me-2"></i>Relatórios avançados</li>
                  <li className="mb-2"><i className="bi bi-check-circle-fill text-success me-2"></i>Gestão de estoque</li>
                  <li className="mb-2"><i className="bi bi-check-circle-fill text-success me-2"></i>Suporte prioritário</li>
                  <li className="mb-2"><i className="bi bi-check-circle-fill text-success me-2"></i>30 dias grátis</li>
                </ul>
                <div className="mt-3 p-3 bg-light rounded">
                  <small className="text-muted">
                    <strong>Taxa por transação:</strong> 2.8%<br/>
                    <strong>Ideal para:</strong> Empresas em crescimento
                  </small>
                </div>
              </div>
              <div className="card-footer border-0 bg-transparent">
                <button className="btn btn-primary w-100 btn-lg">
                  Começar Agora
                </button>
              </div>
            </div>
          </div>

          {/* Plano Empresarial */}
          <div className="col-lg-4 col-md-6 mb-4">
            <div 
              className="card h-100 shadow-lg border-0 pricing-card"
              style={{
                background: 'linear-gradient(135deg, rgba(25, 135, 84, 0.1) 0%, rgba(255, 255, 255, 0.95) 100%)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(25, 135, 84, 0.2)',
                transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
              }}
            >
              <div className="card-header text-center border-0 bg-transparent pt-4">
                <h4 className="fw-bold text-success">Empresarial</h4>
                <div className="price-display">
                  <span className="h2 fw-bold text-dark">R$ 349</span>
                  <small className="text-muted">/mês</small>
                </div>
                <div className="text-success small">
                  <strong>R$ 244/mês anual</strong> (30% desconto)
                </div>
              </div>
              <div className="card-body">
                <ul className="list-unstyled">
                  <li className="mb-2"><i className="bi bi-check-circle-fill text-success me-2"></i>Produtos ilimitados</li>
                  <li className="mb-2"><i className="bi bi-check-circle-fill text-success me-2"></i>Usuários ilimitados</li>
                  <li className="mb-2"><i className="bi bi-check-circle-fill text-success me-2"></i>Multi-loja</li>
                  <li className="mb-2"><i className="bi bi-check-circle-fill text-success me-2"></i>BI e Analytics</li>
                  <li className="mb-2"><i className="bi bi-check-circle-fill text-success me-2"></i>API completa</li>
                  <li className="mb-2"><i className="bi bi-check-circle-fill text-success me-2"></i>Suporte 24/7</li>
                  <li className="mb-2"><i className="bi bi-check-circle-fill text-success me-2"></i>45 dias grátis</li>
                </ul>
                <div className="mt-3 p-3 bg-light rounded">
                  <small className="text-muted">
                    <strong>Taxa por transação:</strong> 2.4%<br/>
                    <strong>Ideal para:</strong> Grandes empresas
                  </small>
                </div>
              </div>
              <div className="card-footer border-0 bg-transparent">
                <button className="btn btn-success w-100 btn-lg">
                  Começar Agora
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Addons Section */}
        <div className="row justify-content-center mt-5">
          <div className="col-lg-10">
            <div className="text-center mb-4">
              <h3 className="fw-bold">Serviços Adicionais</h3>
              <p className="text-muted">Expanda suas funcionalidades com nossos addons premium</p>
            </div>
            <div className="row">
              <div className="col-md-3 col-6 mb-3">
                <div className="card text-center h-100 border-0 shadow-sm">
                  <div className="card-body">
                    <i className="bi bi-cash-register fs-1 text-primary mb-3"></i>
                    <h6 className="fw-bold">PDV Extra</h6>
                    <p className="small text-muted mb-2">Terminal adicional</p>
                    <span className="badge bg-primary">R$ 25/mês</span>
                  </div>
                </div>
              </div>
              <div className="col-md-3 col-6 mb-3">
                <div className="card text-center h-100 border-0 shadow-sm">
                  <div className="card-body">
                    <i className="bi bi-display fs-1 text-info mb-3"></i>
                    <h6 className="fw-bold">KDS</h6>
                    <p className="small text-muted mb-2">Display de cozinha</p>
                    <span className="badge bg-info">R$ 19/mês</span>
                  </div>
                </div>
              </div>
              <div className="col-md-3 col-6 mb-3">
                <div className="card text-center h-100 border-0 shadow-sm">
                  <div className="card-body">
                    <i className="bi bi-truck fs-1 text-warning mb-3"></i>
                    <h6 className="fw-bold">Delivery Pro</h6>
                    <p className="small text-muted mb-2">Gestão de entregas</p>
                    <span className="badge bg-warning">R$ 39/mês</span>
                  </div>
                </div>
              </div>
              <div className="col-md-3 col-6 mb-3">
                <div className="card text-center h-100 border-0 shadow-sm">
                  <div className="card-body">
                    <i className="bi bi-shop fs-1 text-success mb-3"></i>
                    <h6 className="fw-bold">Loja Extra</h6>
                    <p className="small text-muted mb-2">Filial adicional</p>
                    <span className="badge bg-success">R$ 45/mês</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}