import Link from "next/link";

export const metadata = {
  title: "Demo Farmácia - VarejoFlex",
  description: "Veja como funciona nossa solução para farmácias com controle de medicamentos, receitas e muito mais.",
};

export default function DemoFarmacia() {
  return (
    <div className="container py-5">
      <div className="row align-items-center mb-5">
        <div className="col-md-8">
          <Link href="/" className="btn btn-outline-primary mb-3">
            <i className="bi bi-arrow-left me-2"></i>
            Voltar ao Início
          </Link>
          <h1 className="display-5 fw-bold mb-3">
            Demo <span className="text-info">Farmácia</span>
          </h1>
          <p className="lead text-muted">
            Experimente nossa solução completa para farmácias com controle de medicamentos, 
            receitas, lote/validade e gestão farmacêutica.
          </p>
        </div>
        <div className="col-md-4 text-center">
          <div className="bg-info text-white rounded-4 p-4">
            <i className="bi bi-heart-pulse fs-1 mb-2"></i>
            <h5 className="mb-0">Farmácia São Paulo</h5>
            <small>Demo Interativa</small>
          </div>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-lg-8">
          <div className="card border-0 shadow-lg">
            <div className="card-header bg-info text-white">
              <h5 className="mb-0">
                <i className="bi bi-capsule me-2"></i>
                Sistema Farmácia - Farmácia São Paulo
              </h5>
            </div>
            <div className="card-body">
              {/* Simulação de Sistema Farmácia */}
              <div className="row g-3">
                {/* Área de Medicamentos */}
                <div className="col-md-6">
                  <h6 className="fw-bold mb-3">💊 Medicamentos</h6>
                  
                  <div className="card mb-3 border-danger">
                    <div className="card-body p-3">
                      <div className="d-flex justify-content-between align-items-start">
                        <div>
                          <h6 className="mb-1">🟥 Dipirona 500mg</h6>
                          <small className="text-muted">EAN: 7891234567890</small>
                          <div className="mt-2">
                            <span className="badge bg-danger">Receita Obrigatória</span>
                            <span className="ms-1 fw-bold text-info">R$ 12,90</span>
                          </div>
                          <div className="mt-1">
                            <small className="text-danger">Lote: L240815 - Validade: 12/2025</small>
                          </div>
                        </div>
                        <div className="text-end">
                          <div className="fw-bold text-muted">Estoque: 45</div>
                          <button className="btn btn-sm btn-danger mt-1">
                            <i className="bi bi-file-medical"></i> Receita
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="card mb-3 border-success">
                    <div className="card-body p-3">
                      <div className="d-flex justify-content-between align-items-start">
                        <div>
                          <h6 className="mb-1">🟢 Vitamina C 1g</h6>
                          <small className="text-muted">EAN: 7891234567123</small>
                          <div className="mt-2">
                            <span className="badge bg-success">Venda Livre</span>
                            <span className="ms-1 fw-bold text-info">R$ 24,50</span>
                          </div>
                          <div className="mt-1">
                            <small className="text-success">Lote: L240820 - Validade: 08/2026</small>
                          </div>
                        </div>
                        <div className="text-end">
                          <div className="fw-bold text-muted">Estoque: 28</div>
                          <button className="btn btn-sm btn-success mt-1">
                            <i className="bi bi-plus"></i> Adicionar
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="card mb-3 border-warning">
                    <div className="card-body p-3">
                      <div className="d-flex justify-content-between align-items-start">
                        <div>
                          <h6 className="mb-1">🟡 Omeprazol 20mg</h6>
                          <small className="text-muted">EAN: 7891234567456</small>
                          <div className="mt-2">
                            <span className="badge bg-warning text-dark">Genérico</span>
                            <span className="ms-1 fw-bold text-info">R$ 8,90</span>
                          </div>
                          <div className="mt-1">
                            <small className="text-warning">⚠️ Lote: L240810 - Vence em 3 meses</small>
                          </div>
                        </div>
                        <div className="text-end">
                          <div className="fw-bold text-warning">Estoque: 12</div>
                          <button className="btn btn-sm btn-warning mt-1">
                            <i className="bi bi-exclamation-triangle"></i> Baixo
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="card mb-3">
                    <div className="card-body p-3">
                      <div className="d-flex justify-content-between align-items-start">
                        <div>
                          <h6 className="mb-1">⚫ Protetor Solar FPS 60</h6>
                          <small className="text-muted">EAN: 7891234567789</small>
                          <div className="mt-2">
                            <span className="badge bg-info">Cosmético</span>
                            <span className="ms-1 fw-bold text-info">R$ 45,90</span>
                          </div>
                          <div className="mt-1">
                            <small className="text-success">Lote: L240825 - Validade: 10/2026</small>
                          </div>
                        </div>
                        <div className="text-end">
                          <div className="fw-bold text-muted">Estoque: 35</div>
                          <button className="btn btn-sm btn-info mt-1">
                            <i className="bi bi-plus"></i> Adicionar
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Área de Vendas/Receitas */}
                <div className="col-md-6">
                  <h6 className="fw-bold mb-3">🧾 Venda Atual</h6>
                  
                  <div className="card">
                    <div className="card-body">
                      <div className="mb-3">
                        <input type="text" className="form-control" placeholder="🔍 Buscar por nome ou código..." />
                      </div>

                      <div className="mb-3 pb-3 border-bottom">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <div>
                            <strong>Vitamina C 1g</strong>
                            <br />
                            <small className="text-muted">20 comprimidos</small>
                          </div>
                          <button className="btn btn-sm btn-outline-danger">
                            <i className="bi bi-trash"></i>
                          </button>
                        </div>
                        <div className="d-flex justify-content-between align-items-center">
                          <div>
                            <span className="badge bg-light text-dark">Qtd: 2</span>
                          </div>
                          <span className="fw-bold text-info">R$ 49,00</span>
                        </div>
                      </div>

                      <div className="mb-3 pb-3 border-bottom">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <div>
                            <strong>Protetor Solar FPS 60</strong>
                            <br />
                            <small className="text-muted">120ml</small>
                          </div>
                          <button className="btn btn-sm btn-outline-danger">
                            <i className="bi bi-trash"></i>
                          </button>
                        </div>
                        <div className="d-flex justify-content-between align-items-center">
                          <div>
                            <span className="badge bg-light text-dark">Qtd: 1</span>
                          </div>
                          <span className="fw-bold text-info">R$ 45,90</span>
                        </div>
                      </div>

                      <div className="alert alert-warning border-warning mb-3">
                        <h6 className="alert-heading mb-2">📋 Receita Pendente</h6>
                        <div className="row">
                          <div className="col-8">
                            <small>
                              <strong>Dipirona 500mg</strong><br />
                              Dr. Carlos Silva - CRM 12345<br />
                              Paciente: Maria Santos
                            </small>
                          </div>
                          <div className="col-4 text-end">
                            <button className="btn btn-sm btn-warning">
                              Validar
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <strong>Subtotal:</strong>
                        <strong className="text-info fs-5">R$ 94,90</strong>
                      </div>

                      <div className="d-grid gap-2">
                        <button className="btn btn-info fw-bold">
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
                <h6 className="fw-bold mb-3">📋 Controle Farmacêutico</h6>
                <div className="row">
                  <div className="col-md-4">
                    <div className="text-center p-3 border rounded bg-white">
                      <div className="fs-1 text-info">👨‍⚕️</div>
                      <div className="fw-bold">Dr. José Silva</div>
                      <div className="text-muted">CRF: 45678</div>
                      <span className="badge bg-success mt-2">Responsável Técnico</span>
                    </div>
                  </div>
                  <div className="col-md-8">
                    <div className="row">
                      <div className="col-6 mb-2">
                        <small className="text-muted">Receitas Validadas:</small>
                        <div className="fw-bold text-success">47 hoje</div>
                      </div>
                      <div className="col-6 mb-2">
                        <small className="text-muted">Medicamentos Controlados:</small>
                        <div className="fw-bold text-danger">23 vendidos</div>
                      </div>
                      <div className="col-6 mb-2">
                        <small className="text-muted">Alertas de Validade:</small>
                        <div className="fw-bold text-warning">8 próximos</div>
                      </div>
                      <div className="col-6 mb-2">
                        <small className="text-muted">Estoque Crítico:</small>
                        <div className="fw-bold text-warning">5 itens</div>
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
              <h6 className="mb-0 fw-bold">🎯 Recursos para Farmácias</h6>
            </div>
            <div className="card-body">
              <ul className="list-unstyled mb-0">
                <li className="mb-3">
                  <i className="bi bi-check-circle text-info me-2"></i>
                  <strong>Controle de Receitas:</strong> Validação automática
                </li>
                <li className="mb-3">
                  <i className="bi bi-check-circle text-info me-2"></i>
                  <strong>Medicamentos Controlados:</strong> Rastreabilidade total
                </li>
                <li className="mb-3">
                  <i className="bi bi-check-circle text-info me-2"></i>
                  <strong>Gestão de Lotes:</strong> FIFO e alertas de validade
                </li>
                <li className="mb-3">
                  <i className="bi bi-check-circle text-info me-2"></i>
                  <strong>Relatórios ANVISA:</strong> Compliance automático
                </li>
                <li className="mb-0">
                  <i className="bi bi-check-circle text-info me-2"></i>
                  <strong>Farmacêutico Online:</strong> Atendimento especializado
                </li>
              </ul>
            </div>
          </div>

          <div className="card border-0 shadow-sm mb-4">
            <div className="card-header bg-info text-white">
              <h6 className="mb-0 fw-bold">📊 Dashboard Farmacêutico</h6>
            </div>
            <div className="card-body">
              <div className="row text-center">
                <div className="col-6 mb-3">
                  <div className="fw-bold text-success fs-4">156</div>
                  <small className="text-muted">Vendas Hoje</small>
                </div>
                <div className="col-6 mb-3">
                  <div className="fw-bold text-danger fs-4">47</div>
                  <small className="text-muted">Receitas Validadas</small>
                </div>
                <div className="col-6">
                  <div className="fw-bold text-warning fs-4">R$ 4.780</div>
                  <small className="text-muted">Faturamento</small>
                </div>
                <div className="col-6">
                  <div className="fw-bold text-info fs-4">8</div>
                  <small className="text-muted">Alertas Validade</small>
                </div>
              </div>
            </div>
          </div>

          <div className="card border-0 shadow-sm mb-4">
            <div className="card-header bg-light">
              <h6 className="mb-0 fw-bold">⚠️ Alertas Importantes</h6>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <strong className="text-warning">Omeprazol 20mg</strong>
                    <br />
                    <small className="text-muted">Vence em 3 meses</small>
                  </div>
                  <span className="badge bg-warning">12 un</span>
                </div>
              </div>
              <div className="mb-3">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <strong className="text-danger">Insulina NPH</strong>
                    <br />
                    <small className="text-muted">Estoque crítico</small>
                  </div>
                  <span className="badge bg-danger">3 un</span>
                </div>
              </div>
              <div>
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <strong className="text-info">Receita Especial</strong>
                    <br />
                    <small className="text-muted">Aguarda validação</small>
                  </div>
                  <span className="badge bg-info">Nova</span>
                </div>
              </div>
            </div>
          </div>

          <div className="card border-info border-2">
            <div className="card-body text-center">
              <h6 className="fw-bold mb-3">Modernize sua Farmácia!</h6>
              <p className="small text-muted mb-3">
                100% compliance com ANVISA!
              </p>
              <Link href="/register?segment=farmacia" className="btn btn-info w-100 fw-bold">
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