"use client";

import Link from "next/link";

export default function PricingSection() {
  return (
    <section className="py-5 bg-light" id="pricing">
      <div className="container">
        <div className="row justify-content-center mb-5">
          <div className="col-lg-8 text-center">
            <h2 className="display-4 fw-bold mb-3 text-dark">Escolha seu Plano</h2>
            <p className="lead text-muted">
              Soluções completas para diferentes tamanhos de negócio
            </p>
          </div>
        </div>

        <div className="row justify-content-center align-items-stretch">
          {/* Plano Básico */}
          <div className="col-lg-4 col-md-6 mb-4 d-flex">
            <div 
              className="card shadow-lg border-0 pricing-card w-100"
              style={{
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                minHeight: '600px',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <div className="text-center pt-3" style={{ visibility: 'hidden' }}>
                <span className="badge bg-primary px-3 py-2 rounded-pill shadow">
                  placeholder
                </span>
              </div>
              <div className="card-header text-center border-0 bg-transparent pt-3 pb-3">
                <h4 className="fw-bold text-primary mb-3">Básico</h4>
                <div className="price-display mb-2">
                  <span className="h2 fw-bold text-dark">R$ 89</span>
                  <small className="text-muted">/mês</small>
                </div>
                <div className="text-success small">
                  <strong>R$ 70/mês anual</strong> (20% desconto)
                </div>
              </div>
              <div className="card-body d-flex flex-column flex-grow-1">
                <ul className="list-unstyled mb-4">
                  <li className="mb-2"><i className="bi bi-check-circle-fill text-success me-2"></i>Até 100 produtos</li>
                  <li className="mb-2"><i className="bi bi-check-circle-fill text-success me-2"></i>1 usuário</li>
                  <li className="mb-2"><i className="bi bi-check-circle-fill text-success me-2"></i>PDV básico</li>
                  <li className="mb-2"><i className="bi bi-check-circle-fill text-success me-2"></i>Relatórios essenciais</li>
                  <li className="mb-2"><i className="bi bi-check-circle-fill text-success me-2"></i>Suporte por email</li>
                  <li className="mb-2"><i className="bi bi-check-circle-fill text-success me-2"></i><strong>14 dias grátis</strong></li>
                </ul>
                <div className="mt-auto p-3 bg-light rounded">
                  <small className="text-muted">
                    <strong>Taxa:</strong> 3.2%<br/>
                    <strong>Ideal para:</strong> Pequenos negócios
                  </small>
                </div>
              </div>
              <div className="card-footer border-0 bg-transparent pb-4">
                <Link href="/register?plan=basico" className="btn btn-outline-primary w-100 btn-lg">
                  Começar 14 Dias Grátis
                </Link>
              </div>
            </div>
          </div>

          {/* Plano Profissional */}
          <div className="col-lg-4 col-md-6 mb-4 d-flex">
            <div 
              className="card shadow-lg border-0 pricing-card w-100"
              style={{
                background: 'linear-gradient(135deg, rgba(13, 110, 253, 0.1) 0%, rgba(255, 255, 255, 0.95) 100%)',
                backdropFilter: 'blur(15px)',
                border: '2px solid rgba(13, 110, 253, 0.3)',
                transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                minHeight: '600px',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <div className="text-center pt-3">
                <span className="badge bg-primary px-3 py-2 rounded-pill shadow">
                  <i className="bi bi-star-fill me-1"></i>Mais Popular
                </span>
              </div>
              <div className="card-header text-center border-0 bg-transparent pt-3 pb-3">
                <h4 className="fw-bold text-primary mb-3">Profissional</h4>
                <div className="price-display mb-2">
                  <span className="h2 fw-bold text-dark">R$ 179</span>
                  <small className="text-muted">/mês</small>
                </div>
                <div className="text-success small">
                  <strong>R$ 134/mês anual</strong> (25% desconto)
                </div>
              </div>
              <div className="card-body d-flex flex-column flex-grow-1">
                <ul className="list-unstyled mb-4">
                  <li className="mb-2"><i className="bi bi-check-circle-fill text-success me-2"></i>Até 1.000 produtos</li>
                  <li className="mb-2"><i className="bi bi-check-circle-fill text-success me-2"></i>5 usuários</li>
                  <li className="mb-2"><i className="bi bi-check-circle-fill text-success me-2"></i>PDV completo</li>
                  <li className="mb-2"><i className="bi bi-check-circle-fill text-success me-2"></i>Relatórios avançados</li>
                  <li className="mb-2"><i className="bi bi-check-circle-fill text-success me-2"></i>Gestão de estoque</li>
                  <li className="mb-2"><i className="bi bi-check-circle-fill text-success me-2"></i>Suporte prioritário</li>
                  <li className="mb-2"><i className="bi bi-check-circle-fill text-success me-2"></i><strong>14 dias grátis</strong></li>
                </ul>
                <div className="mt-auto p-3 bg-light rounded">
                  <small className="text-muted">
                    <strong>Taxa:</strong> 2.8%<br/>
                    <strong>Ideal para:</strong> Empresas em crescimento
                  </small>
                </div>
              </div>
              <div className="card-footer border-0 bg-transparent pb-4">
                <Link href="/register?plan=profissional" className="btn btn-primary w-100 btn-lg">
                  Começar 14 Dias Grátis
                </Link>
              </div>
            </div>
          </div>

          {/* Plano Empresarial */}
          <div className="col-lg-4 col-md-6 mb-4 d-flex">
            <div 
              className="card shadow-lg border-0 pricing-card w-100"
              style={{
                background: 'linear-gradient(135deg, rgba(25, 135, 84, 0.1) 0%, rgba(255, 255, 255, 0.95) 100%)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(25, 135, 84, 0.2)',
                transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                minHeight: '600px',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <div className="text-center pt-3" style={{ visibility: 'hidden' }}>
                <span className="badge bg-primary px-3 py-2 rounded-pill shadow">
                  placeholder
                </span>
              </div>
              <div className="card-header text-center border-0 bg-transparent pt-3 pb-3">
                <h4 className="fw-bold text-success mb-3">Empresarial</h4>
                <div className="price-display mb-2">
                  <span className="h2 fw-bold text-dark">R$ 349</span>
                  <small className="text-muted">/mês</small>
                </div>
                <div className="text-success small">
                  <strong>R$ 244/mês anual</strong> (30% desconto)
                </div>
              </div>
              <div className="card-body d-flex flex-column flex-grow-1">
                <ul className="list-unstyled mb-4">
                  <li className="mb-2"><i className="bi bi-check-circle-fill text-success me-2"></i>Produtos ilimitados</li>
                  <li className="mb-2"><i className="bi bi-check-circle-fill text-success me-2"></i>Usuários ilimitados</li>
                  <li className="mb-2"><i className="bi bi-check-circle-fill text-success me-2"></i>Multi-loja</li>
                  <li className="mb-2"><i className="bi bi-check-circle-fill text-success me-2"></i>BI e Analytics</li>
                  <li className="mb-2"><i className="bi bi-check-circle-fill text-success me-2"></i>API completa</li>
                  <li className="mb-2"><i className="bi bi-check-circle-fill text-success me-2"></i>Suporte 24/7</li>
                  <li className="mb-2"><i className="bi bi-check-circle-fill text-success me-2"></i><strong>14 dias grátis</strong></li>
                </ul>
                <div className="mt-auto p-3 bg-light rounded">
                  <small className="text-muted">
                    <strong>Taxa:</strong> 2.4%<br/>
                    <strong>Ideal para:</strong> Grandes empresas
                  </small>
                </div>
              </div>
              <div className="card-footer border-0 bg-transparent pb-4">
                <Link href="/register?plan=empresarial" className="btn btn-success w-100 btn-lg">
                  Começar 14 Dias Grátis
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Addons Section */}
        <div className="row justify-content-center mt-5">
          <div className="col-lg-10">
            <div className="text-center mb-4">
              <h3 className="fw-bold text-dark">Serviços Adicionais</h3>
              <p className="text-muted">Expanda suas funcionalidades com nossos addons premium</p>
            </div>
            <div className="row g-3">
              <div className="col-lg-3 col-md-6">
                <div className="card text-center h-100 border-0 shadow-sm">
                  <div className="card-body p-3">
                    <i className="bi bi-cash-stack fs-2 text-primary mb-2"></i>
                    <h6 className="fw-bold mb-1">PDV Extra</h6>
                    <p className="small text-muted mb-2">Terminal adicional</p>
                    <span className="badge bg-primary">R$ 25/mês</span>
                  </div>
                </div>
              </div>
              <div className="col-lg-3 col-md-6">
                <div className="card text-center h-100 border-0 shadow-sm">
                  <div className="card-body p-3">
                    <i className="bi bi-display fs-2 text-info mb-2"></i>
                    <h6 className="fw-bold mb-1">KDS</h6>
                    <p className="small text-muted mb-2">Display de cozinha</p>
                    <span className="badge bg-info">R$ 19/mês</span>
                  </div>
                </div>
              </div>
              <div className="col-lg-3 col-md-6">
                <div className="card text-center h-100 border-0 shadow-sm">
                  <div className="card-body p-3">
                    <i className="bi bi-truck fs-2 text-warning mb-2"></i>
                    <h6 className="fw-bold mb-1">Delivery Pro</h6>
                    <p className="small text-muted mb-2">Gestão de entregas</p>
                    <span className="badge bg-warning">R$ 39/mês</span>
                  </div>
                </div>
              </div>
              <div className="col-lg-3 col-md-6">
                <div className="card text-center h-100 border-0 shadow-sm">
                  <div className="card-body p-3">
                    <i className="bi bi-shop fs-2 text-success mb-2"></i>
                    <h6 className="fw-bold mb-1">Loja Extra</h6>
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