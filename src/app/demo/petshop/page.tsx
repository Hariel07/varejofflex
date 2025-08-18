import Link from "next/link";

export const metadata = {
  title: "Demo Petshop - VarejoFlex",
  description: "Veja como funciona nossa solução para petshops com agendamentos, serviços, produtos para pets e muito mais.",
};

export default function DemoPetshop() {
  return (
    <div className="container py-5">
      <div className="row align-items-center mb-5">
        <div className="col-md-8">
          <Link href="/" className="btn btn-outline-primary mb-3">
            <i className="bi bi-arrow-left me-2"></i>
            Voltar ao Início
          </Link>
          <h1 className="display-5 fw-bold mb-3">
            Demo <span className="text-warning">Petshop</span>
          </h1>
          <p className="lead text-muted">
            Experimente nossa solução completa para petshops com agendamentos, 
            controle de banho/tosa, produtos pet e gestão de clientes.
          </p>
        </div>
        <div className="col-md-4 text-center">
          <div className="bg-warning text-dark rounded-4 p-4">
            <i className="bi bi-heart fs-1 mb-2"></i>
            <h5 className="mb-0">Pet Care Center</h5>
            <small>Demo Interativa</small>
          </div>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-lg-8">
          <div className="card border-0 shadow-lg">
            <div className="card-header bg-warning text-dark">
              <h5 className="mb-0">
                <i className="bi bi-calendar-check me-2"></i>
                Sistema Petshop - Pet Care Center
              </h5>
            </div>
            <div className="card-body">
              {/* Simulação de Sistema Petshop */}
              <div className="row g-3">
                {/* Área de Agendamentos */}
                <div className="col-md-6">
                  <h6 className="fw-bold mb-3">📅 Agendamentos do Dia</h6>
                  
                  <div className="card mb-3 border-success">
                    <div className="card-body p-3">
                      <div className="d-flex justify-content-between align-items-start">
                        <div>
                          <h6 className="mb-1">🐕 Max - Golden Retriever</h6>
                          <small className="text-muted">Cliente: Maria Silva</small>
                          <div className="mt-2">
                            <span className="badge bg-success">9:00 - Banho e Tosa</span>
                          </div>
                          <div className="mt-1">
                            <small className="text-success">✅ Em andamento</small>
                          </div>
                        </div>
                        <div className="text-end">
                          <div className="fw-bold text-success">R$ 80,00</div>
                          <button className="btn btn-sm btn-success mt-1">
                            Finalizar
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="card mb-3 border-primary">
                    <div className="card-body p-3">
                      <div className="d-flex justify-content-between align-items-start">
                        <div>
                          <h6 className="mb-1">🐱 Luna - Persa</h6>
                          <small className="text-muted">Cliente: João Santos</small>
                          <div className="mt-2">
                            <span className="badge bg-primary">10:30 - Tosa Higiênica</span>
                          </div>
                          <div className="mt-1">
                            <small className="text-primary">⏰ Próximo</small>
                          </div>
                        </div>
                        <div className="text-end">
                          <div className="fw-bold text-primary">R$ 45,00</div>
                          <button className="btn btn-sm btn-primary mt-1">
                            Iniciar
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="card mb-3">
                    <div className="card-body p-3">
                      <div className="d-flex justify-content-between align-items-start">
                        <div>
                          <h6 className="mb-1">🐕 Buddy - Labrador</h6>
                          <small className="text-muted">Cliente: Ana Costa</small>
                          <div className="mt-2">
                            <span className="badge bg-info">14:00 - Banho Completo</span>
                          </div>
                          <div className="mt-1">
                            <small className="text-muted">⏳ Agendado</small>
                          </div>
                        </div>
                        <div className="text-end">
                          <div className="fw-bold text-info">R$ 60,00</div>
                          <button className="btn btn-sm btn-outline-info mt-1">
                            Aguardando
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="card mb-3 border-warning">
                    <div className="card-body p-3">
                      <div className="d-flex justify-content-between align-items-start">
                        <div>
                          <h6 className="mb-1">🐕 Rex - Pastor Alemão</h6>
                          <small className="text-muted">Cliente: Carlos Lima</small>
                          <div className="mt-2">
                            <span className="badge bg-danger">15:30 - Consulta Veterinária</span>
                          </div>
                          <div className="mt-1">
                            <small className="text-danger">⚠️ Prioritário</small>
                          </div>
                        </div>
                        <div className="text-end">
                          <div className="fw-bold text-danger">R$ 120,00</div>
                          <button className="btn btn-sm btn-warning mt-1">
                            Urgente
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Área de Produtos/Vendas */}
                <div className="col-md-6">
                  <h6 className="fw-bold mb-3">🛍️ Produtos Pet</h6>
                  
                  <div className="card">
                    <div className="card-body">
                      <div className="mb-3">
                        <input type="text" className="form-control" placeholder="🔍 Buscar produtos..." />
                      </div>

                      <div className="mb-3 pb-3 border-bottom">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <div>
                            <strong>Ração Premium Cães</strong>
                            <br />
                            <small className="text-muted">Royal Canin - 15kg</small>
                          </div>
                          <button className="btn btn-sm btn-warning">
                            <i className="bi bi-plus"></i>
                          </button>
                        </div>
                        <div className="d-flex justify-content-between align-items-center">
                          <span className="badge bg-light text-dark">Estoque: 12 un</span>
                          <span className="fw-bold text-warning">R$ 189,90</span>
                        </div>
                      </div>

                      <div className="mb-3 pb-3 border-bottom">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <div>
                            <strong>Shampoo Pet</strong>
                            <br />
                            <small className="text-muted">Pelos Longos - 500ml</small>
                          </div>
                          <button className="btn btn-sm btn-warning">
                            <i className="bi bi-plus"></i>
                          </button>
                        </div>
                        <div className="d-flex justify-content-between align-items-center">
                          <span className="badge bg-light text-dark">Estoque: 8 un</span>
                          <span className="fw-bold text-warning">R$ 24,90</span>
                        </div>
                      </div>

                      <div className="mb-3 pb-3 border-bottom">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <div>
                            <strong>Brinquedo Corda</strong>
                            <br />
                            <small className="text-muted">Resistente - Médio</small>
                          </div>
                          <button className="btn btn-sm btn-warning">
                            <i className="bi bi-plus"></i>
                          </button>
                        </div>
                        <div className="d-flex justify-content-between align-items-center">
                          <span className="badge bg-light text-dark">Estoque: 15 un</span>
                          <span className="fw-bold text-warning">R$ 18,50</span>
                        </div>
                      </div>

                      <div className="alert alert-warning border-warning">
                        <h6 className="alert-heading mb-2">🛒 Carrinho Atual</h6>
                        <small>
                          1x Shampoo Pet - R$ 24,90<br />
                          1x Brinquedo Corda - R$ 18,50<br />
                          <strong>Total: R$ 43,40</strong>
                        </small>
                      </div>

                      <div className="d-grid gap-2">
                        <button className="btn btn-warning fw-bold">
                          <i className="bi bi-credit-card me-2"></i>
                          Finalizar Venda
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 p-3 bg-light rounded">
                <h6 className="fw-bold mb-3">📋 Ficha do Pet - Max</h6>
                <div className="row">
                  <div className="col-md-4">
                    <div className="text-center p-3 border rounded bg-white">
                      <div className="fs-1">🐕</div>
                      <div className="fw-bold">Max</div>
                      <div className="text-muted">Golden Retriever</div>
                    </div>
                  </div>
                  <div className="col-md-8">
                    <div className="row">
                      <div className="col-6 mb-2">
                        <small className="text-muted">Idade:</small>
                        <div className="fw-bold">3 anos</div>
                      </div>
                      <div className="col-6 mb-2">
                        <small className="text-muted">Peso:</small>
                        <div className="fw-bold">32 kg</div>
                      </div>
                      <div className="col-6 mb-2">
                        <small className="text-muted">Último Banho:</small>
                        <div className="fw-bold">15/07/2025</div>
                      </div>
                      <div className="col-6 mb-2">
                        <small className="text-muted">Vacinas:</small>
                        <div className="fw-bold text-success">✅ Em dia</div>
                      </div>
                      <div className="col-12">
                        <small className="text-muted">Observações:</small>
                        <div className="fw-bold">Muito dócil, gosta de água morna</div>
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
              <h6 className="mb-0 fw-bold">🎯 Recursos para Petshops</h6>
            </div>
            <div className="card-body">
              <ul className="list-unstyled mb-0">
                <li className="mb-3">
                  <i className="bi bi-check-circle text-warning me-2"></i>
                  <strong>Agendamento Online:</strong> Clientes agendam pelo app
                </li>
                <li className="mb-3">
                  <i className="bi bi-check-circle text-warning me-2"></i>
                  <strong>Ficha do Pet:</strong> Histórico completo e detalhado
                </li>
                <li className="mb-3">
                  <i className="bi bi-check-circle text-warning me-2"></i>
                  <strong>Controle de Estoque:</strong> Produtos e medicamentos
                </li>
                <li className="mb-3">
                  <i className="bi bi-check-circle text-warning me-2"></i>
                  <strong>Lembretes:</strong> Vacinas, banho e consultas
                </li>
                <li className="mb-0">
                  <i className="bi bi-check-circle text-warning me-2"></i>
                  <strong>Fidelidade:</strong> Programa de pontos automático
                </li>
              </ul>
            </div>
          </div>

          <div className="card border-0 shadow-sm mb-4">
            <div className="card-header bg-warning text-dark">
              <h6 className="mb-0 fw-bold">📊 Dashboard Hoje</h6>
            </div>
            <div className="card-body">
              <div className="row text-center">
                <div className="col-6 mb-3">
                  <div className="fw-bold text-success fs-4">12</div>
                  <small className="text-muted">Serviços Agendados</small>
                </div>
                <div className="col-6 mb-3">
                  <div className="fw-bold text-primary fs-4">8</div>
                  <small className="text-muted">Já Finalizados</small>
                </div>
                <div className="col-6">
                  <div className="fw-bold text-warning fs-4">R$ 980</div>
                  <small className="text-muted">Faturamento</small>
                </div>
                <div className="col-6">
                  <div className="fw-bold text-info fs-4">15</div>
                  <small className="text-muted">Produtos Vendidos</small>
                </div>
              </div>
            </div>
          </div>

          <div className="card border-0 shadow-sm mb-4">
            <div className="card-header bg-light">
              <h6 className="mb-0 fw-bold">⭐ Avaliações Recentes</h6>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <div className="d-flex justify-content-between">
                  <strong>Maria Silva</strong>
                  <div>⭐⭐⭐⭐⭐</div>
                </div>
                <small className="text-muted">"Max ficou lindo! Equipe muito cuidadosa."</small>
              </div>
              <div className="mb-3">
                <div className="d-flex justify-content-between">
                  <strong>Ana Costa</strong>
                  <div>⭐⭐⭐⭐⭐</div>
                </div>
                <small className="text-muted">"Agendamento fácil, serviço excelente!"</small>
              </div>
              <div>
                <div className="d-flex justify-content-between">
                  <strong>João Santos</strong>
                  <div>⭐⭐⭐⭐⭐</div>
                </div>
                <small className="text-muted">"Luna sempre volta linda daqui!"</small>
              </div>
            </div>
          </div>

          <div className="card border-warning border-2">
            <div className="card-body text-center">
              <h6 className="fw-bold mb-3">Modernize seu Petshop!</h6>
              <p className="small text-muted mb-3">
                Mais agendamentos, menos stress!
              </p>
              <Link href="/register?segment=petshop" className="btn btn-warning w-100 fw-bold">
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