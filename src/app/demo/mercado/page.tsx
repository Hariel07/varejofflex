import Link from "next/link";

export const metadata = {
  title: "Demo Mercado - VarejoFlex",
  description: "Veja como funciona nossa solução para mercados com produtos fracionados, integração com balança e controle de lote/validade.",
};

export default function DemoMercado() {
  return (
    <div className="container py-5">
      <div className="row align-items-center mb-5">
        <div className="col-md-8">
          <Link href="/" className="btn btn-outline-primary mb-3">
            <i className="bi bi-arrow-left me-2"></i>
            Voltar ao Início
          </Link>
          <h1 className="display-5 fw-bold mb-3">
            Demo <span className="text-success">Mercado</span>
          </h1>
          <p className="lead text-muted">
            Experimente nossa solução completa para mercados com produtos fracionados, 
            integração com balança e controle avançado de lote/validade.
          </p>
        </div>
        <div className="col-md-4 text-center">
          <div className="bg-success text-white rounded-4 p-4">
            <i className="bi bi-basket fs-1 mb-2"></i>
            <h5 className="mb-0">SuperMercado Central</h5>
            <small>Demo Interativa</small>
          </div>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-lg-8">
          <div className="card border-0 shadow-lg">
            <div className="card-header bg-success text-white">
              <h5 className="mb-0">
                <i className="bi bi-upc-scan me-2"></i>
                Sistema PDV - SuperMercado Central
              </h5>
            </div>
            <div className="card-body">
              {/* Simulação de PDV Mercado */}
              <div className="row g-3">
                {/* Área de Produtos */}
                <div className="col-md-6">
                  <h6 className="fw-bold mb-3">🛒 Produtos Disponíveis</h6>
                  
                  <div className="card mb-3 border-success">
                    <div className="card-body p-3">
                      <div className="d-flex justify-content-between align-items-start">
                        <div>
                          <h6 className="mb-1">Pão Francês</h6>
                          <small className="text-muted">Código: 2891234567890</small>
                          <div className="mt-2">
                            <span className="badge bg-warning text-dark">Por kg</span>
                            <span className="ms-2 fw-bold text-success">R$ 17,50/kg</span>
                          </div>
                        </div>
                        <button className="btn btn-sm btn-success">
                          <i className="bi bi-plus"></i>
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="card mb-3">
                    <div className="card-body p-3">
                      <div className="d-flex justify-content-between align-items-start">
                        <div>
                          <h6 className="mb-1">Leite Integral 1L</h6>
                          <small className="text-muted">EAN: 7891234567890</small>
                          <div className="mt-2">
                            <span className="badge bg-info">Unidade</span>
                            <span className="ms-2 fw-bold text-success">R$ 5,89</span>
                          </div>
                          <div className="mt-1">
                            <small className="text-muted">Validade: 25/08/2025</small>
                          </div>
                        </div>
                        <button className="btn btn-sm btn-success">
                          <i className="bi bi-plus"></i>
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="card mb-3">
                    <div className="card-body p-3">
                      <div className="d-flex justify-content-between align-items-start">
                        <div>
                          <h6 className="mb-1">Banana Prata</h6>
                          <small className="text-muted">Código: 2891234567123</small>
                          <div className="mt-2">
                            <span className="badge bg-warning text-dark">Por kg</span>
                            <span className="ms-2 fw-bold text-success">R$ 6,90/kg</span>
                          </div>
                          <div className="mt-1">
                            <small className="text-success">🍌 Produto fresco</small>
                          </div>
                        </div>
                        <button className="btn btn-sm btn-success">
                          <i className="bi bi-plus"></i>
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="card mb-3 border-warning">
                    <div className="card-body p-3">
                      <div className="d-flex justify-content-between align-items-start">
                        <div>
                          <h6 className="mb-1">Iogurte Natural</h6>
                          <small className="text-muted">Lote: L240815</small>
                          <div className="mt-2">
                            <span className="badge bg-info">Unidade</span>
                            <span className="ms-2 fw-bold text-success">R$ 4,49</span>
                          </div>
                          <div className="mt-1">
                            <small className="text-warning">⚠️ Vence em 2 dias</small>
                          </div>
                        </div>
                        <button className="btn btn-sm btn-warning">
                          <i className="bi bi-exclamation-triangle"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Área do Carrinho/PDV */}
                <div className="col-md-6">
                  <h6 className="fw-bold mb-3">🧾 Carrinho de Compras</h6>
                  
                  <div className="card">
                    <div className="card-body">
                      <div className="mb-3 pb-3 border-bottom">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <span>Pão Francês</span>
                          <button className="btn btn-sm btn-outline-danger">
                            <i className="bi bi-trash"></i>
                          </button>
                        </div>
                        <div className="d-flex justify-content-between align-items-center">
                          <div>
                            <input type="number" className="form-control form-control-sm" style={{width: "80px"}} placeholder="0.500" step="0.001" />
                            <small className="text-muted">kg</small>
                          </div>
                          <span className="fw-bold">R$ 8,75</span>
                        </div>
                      </div>

                      <div className="mb-3 pb-3 border-bottom">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <span>Leite Integral 1L</span>
                          <button className="btn btn-sm btn-outline-danger">
                            <i className="bi bi-trash"></i>
                          </button>
                        </div>
                        <div className="d-flex justify-content-between align-items-center">
                          <div>
                            <span className="badge bg-light text-dark">2 un</span>
                          </div>
                          <span className="fw-bold">R$ 11,78</span>
                        </div>
                      </div>

                      <div className="mb-3 pb-3 border-bottom">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <span>Banana Prata</span>
                          <button className="btn btn-sm btn-outline-danger">
                            <i className="bi bi-trash"></i>
                          </button>
                        </div>
                        <div className="d-flex justify-content-between align-items-center">
                          <div>
                            <input type="number" className="form-control form-control-sm" style={{width: "80px"}} placeholder="1.200" step="0.001" />
                            <small className="text-muted">kg</small>
                          </div>
                          <span className="fw-bold">R$ 8,28</span>
                        </div>
                      </div>

                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <strong>Subtotal:</strong>
                        <strong className="text-success fs-5">R$ 28,81</strong>
                      </div>

                      <div className="d-grid gap-2">
                        <button className="btn btn-success fw-bold">
                          <i className="bi bi-credit-card me-2"></i>
                          Finalizar Venda
                        </button>
                        <button className="btn btn-outline-secondary">
                          <i className="bi bi-upc-scan me-2"></i>
                          Ler Código de Barras
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 p-3 bg-light rounded">
                <h6 className="fw-bold mb-3">⚖️ Simulação de Balança Integrada</h6>
                <div className="row">
                  <div className="col-md-4">
                    <div className="text-center p-3 border rounded">
                      <div className="fs-1 text-success">⚖️</div>
                      <div className="fw-bold">Balança Digital</div>
                      <div className="text-muted">Conectada</div>
                    </div>
                  </div>
                  <div className="col-md-8">
                    <div className="row">
                      <div className="col-6">
                        <label className="form-label small">Produto Pesado:</label>
                        <select className="form-select form-select-sm">
                          <option>Banana Prata</option>
                          <option>Pão Francês</option>
                          <option>Carne Moída</option>
                        </select>
                      </div>
                      <div className="col-6">
                        <label className="form-label small">Peso (kg):</label>
                        <input type="number" className="form-control form-control-sm" value="1.247" readOnly />
                      </div>
                      <div className="col-12 mt-2">
                        <div className="alert alert-success mb-0 py-2">
                          <small><strong>Total:</strong> 1.247kg × R$ 6,90 = <strong>R$ 8,60</strong></small>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-header bg-light">
              <h6 className="mb-0 fw-bold">🎯 Recursos para Mercados</h6>
            </div>
            <div className="card-body">
              <ul className="list-unstyled mb-0">
                <li className="mb-3">
                  <i className="bi bi-check-circle text-success me-2"></i>
                  <strong>Leitor Código de Barras:</strong> Integração completa com EAN/UPC
                </li>
                <li className="mb-3">
                  <i className="bi bi-check-circle text-success me-2"></i>
                  <strong>Balança Digital:</strong> Pesagem automática com etiquetas
                </li>
                <li className="mb-3">
                  <i className="bi bi-check-circle text-success me-2"></i>
                  <strong>Controle de Lote:</strong> Rastreabilidade e FIFO automático
                </li>
                <li className="mb-3">
                  <i className="bi bi-check-circle text-success me-2"></i>
                  <strong>Alertas de Validade:</strong> Notificações preventivas
                </li>
                <li className="mb-0">
                  <i className="bi bi-check-circle text-success me-2"></i>
                  <strong>Produtos Fracionados:</strong> Venda por peso ou unidade
                </li>
              </ul>
            </div>
          </div>

          <div className="card border-0 shadow-sm mb-4">
            <div className="card-header bg-success text-white">
              <h6 className="mb-0 fw-bold">📊 Controle Operacional</h6>
            </div>
            <div className="card-body">
              <div className="row text-center">
                <div className="col-6 mb-3">
                  <div className="fw-bold text-success fs-4">2.847</div>
                  <small className="text-muted">Produtos Ativos</small>
                </div>
                <div className="col-6 mb-3">
                  <div className="fw-bold text-warning fs-4">23</div>
                  <small className="text-muted">Vencendo</small>
                </div>
                <div className="col-6">
                  <div className="fw-bold text-info fs-4">97%</div>
                  <small className="text-muted">Disponibilidade</small>
                </div>
                <div className="col-6">
                  <div className="fw-bold text-primary fs-4">15x</div>
                  <small className="text-muted">Giro Mensal</small>
                </div>
              </div>
            </div>
          </div>

          <div className="card border-success border-2">
            <div className="card-body text-center">
              <h6 className="fw-bold mb-3">Modernize seu Mercado!</h6>
              <p className="small text-muted mb-3">
                Sistema completo para supermercados em 5 minutos!
              </p>
              <Link href="/register?segment=mercado" className="btn btn-success w-100 fw-bold">
                <i className="bi bi-rocket me-2"></i>
                Começar Agora Grátis
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}