import Link from "next/link";

export const metadata = {
  title: "Demo Salão - VarejoFlex",
  description: "Veja como funciona nossa solução para salões de beleza com agendamentos, serviços, produtos e muito mais.",
};

export default function DemoSalao() {
  return (
    <div className="container py-5">
      <div className="row align-items-center mb-5">
        <div className="col-md-8">
          <Link href="/" className="btn btn-outline-primary mb-3">
            <i className="bi bi-arrow-left me-2"></i>
            Voltar ao Início
          </Link>
          <h1 className="display-5 fw-bold mb-3">
            Demo <span className="text-danger">Salão de Beleza</span>
          </h1>
          <p className="lead text-muted">
            Experimente nossa solução completa para salões com agendamentos, 
            controle de profissionais, comissões e gestão de clientes.
          </p>
        </div>
        <div className="col-md-4 text-center">
          <div className="bg-danger text-white rounded-4 p-4">
            <i className="bi bi-scissors fs-1 mb-2"></i>
            <h5 className="mb-0">Bella Vista Salon</h5>
            <small>Demo Interativa</small>
          </div>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-lg-8">
          <div className="card border-0 shadow-lg">
            <div className="card-header bg-danger text-white">
              <h5 className="mb-0">
                <i className="bi bi-calendar-heart me-2"></i>
                Sistema Salão - Bella Vista Salon
              </h5>
            </div>
            <div className="card-body">
              {/* Simulação de Sistema Salão */}
              <div className="row g-3">
                {/* Área de Agendamentos */}
                <div className="col-md-6">
                  <h6 className="fw-bold mb-3">💅 Agendamentos do Dia</h6>
                  
                  <div className="card mb-3 border-success">
                    <div className="card-body p-3">
                      <div className="d-flex justify-content-between align-items-start">
                        <div>
                          <h6 className="mb-1">✨ Ana Carolina</h6>
                          <small className="text-muted">Profissional: Fernanda</small>
                          <div className="mt-2">
                            <span className="badge bg-success">9:00 - Corte + Escova</span>
                          </div>
                          <div className="mt-1">
                            <small className="text-success">✅ Em andamento</small>
                          </div>
                        </div>
                        <div className="text-end">
                          <div className="fw-bold text-success">R$ 85,00</div>
                          <small className="text-muted">Comissão: 40%</small>
                          <button className="btn btn-sm btn-success mt-1 d-block">
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
                          <h6 className="mb-1">💇‍♀️ Mariana Silva</h6>
                          <small className="text-muted">Profissional: Carla</small>
                          <div className="mt-2">
                            <span className="badge bg-primary">10:30 - Hidratação</span>
                          </div>
                          <div className="mt-1">
                            <small className="text-primary">⏰ Próxima</small>
                          </div>
                        </div>
                        <div className="text-end">
                          <div className="fw-bold text-primary">R$ 120,00</div>
                          <small className="text-muted">Comissão: 35%</small>
                          <button className="btn btn-sm btn-primary mt-1 d-block">
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
                          <h6 className="mb-1">💄 Beatriz Santos</h6>
                          <small className="text-muted">Profissional: Fernanda</small>
                          <div className="mt-2">
                            <span className="badge bg-warning text-dark">14:00 - Manicure + Pedicure</span>
                          </div>
                          <div className="mt-1">
                            <small className="text-muted">⏳ Agendada</small>
                          </div>
                        </div>
                        <div className="text-end">
                          <div className="fw-bold text-warning">R$ 65,00</div>
                          <small className="text-muted">Comissão: 50%</small>
                          <button className="btn btn-sm btn-outline-warning mt-1 d-block">
                            Aguardando
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="card mb-3 border-info">
                    <div className="card-body p-3">
                      <div className="d-flex justify-content-between align-items-start">
                        <div>
                          <h6 className="mb-1">🌈 Juliana Costa</h6>
                          <small className="text-muted">Profissional: Carla</small>
                          <div className="mt-2">
                            <span className="badge bg-info">15:30 - Coloração + Corte</span>
                          </div>
                          <div className="mt-1">
                            <small className="text-info">💰 Serviço Premium</small>
                          </div>
                        </div>
                        <div className="text-end">
                          <div className="fw-bold text-info">R$ 280,00</div>
                          <small className="text-muted">Comissão: 30%</small>
                          <button className="btn btn-sm btn-info mt-1 d-block">
                            Premium
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Área de Profissionais/Comissões */}
                <div className="col-md-6">
                  <h6 className="fw-bold mb-3">👩‍💼 Profissionais Hoje</h6>
                  
                  <div className="card">
                    <div className="card-body">
                      <div className="mb-3 pb-3 border-bottom">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <div>
                            <strong>👩‍🦰 Fernanda Silva</strong>
                            <br />
                            <small className="text-muted">Cabeleireira Senior</small>
                          </div>
                          <span className="badge bg-success">Ativa</span>
                        </div>
                        <div className="row mt-2">
                          <div className="col-6">
                            <small className="text-muted">Agendamentos:</small>
                            <div className="fw-bold">3 hoje</div>
                          </div>
                          <div className="col-6">
                            <small className="text-muted">Comissão:</small>
                            <div className="fw-bold text-success">R$ 89,50</div>
                          </div>
                        </div>
                      </div>

                      <div className="mb-3 pb-3 border-bottom">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <div>
                            <strong>👩‍🦱 Carla Mendes</strong>
                            <br />
                            <small className="text-muted">Especialista em Cor</small>
                          </div>
                          <span className="badge bg-success">Ativa</span>
                        </div>
                        <div className="row mt-2">
                          <div className="col-6">
                            <small className="text-muted">Agendamentos:</small>
                            <div className="fw-bold">2 hoje</div>
                          </div>
                          <div className="col-6">
                            <small className="text-muted">Comissão:</small>
                            <div className="fw-bold text-success">R$ 126,00</div>
                          </div>
                        </div>
                      </div>

                      <div className="mb-3">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <div>
                            <strong>👩‍💼 Patrícia Lima</strong>
                            <br />
                            <small className="text-muted">Manicure/Pedicure</small>
                          </div>
                          <span className="badge bg-warning text-dark">Folga</span>
                        </div>
                        <div className="row mt-2">
                          <div className="col-6">
                            <small className="text-muted">Agendamentos:</small>
                            <div className="fw-bold">0 hoje</div>
                          </div>
                          <div className="col-6">
                            <small className="text-muted">Última comissão:</small>
                            <div className="fw-bold text-muted">R$ 95,00</div>
                          </div>
                        </div>
                      </div>

                      <div className="alert alert-danger border-danger">
                        <h6 className="alert-heading mb-2">💰 Resumo de Comissões</h6>
                        <div className="row">
                          <div className="col-6">
                            <small>Fernanda:</small>
                            <div className="fw-bold">R$ 89,50</div>
                          </div>
                          <div className="col-6">
                            <small>Carla:</small>
                            <div className="fw-bold">R$ 126,00</div>
                          </div>
                        </div>
                        <hr className="my-2" />
                        <div className="text-center">
                          <strong>Total do Dia: R$ 215,50</strong>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 p-3 bg-light rounded">
                <h6 className="fw-bold mb-3">📋 Produtos de Beleza</h6>
                <div className="row">
                  <div className="col-md-3">
                    <div className="text-center p-2 border rounded bg-white">
                      <div className="fw-bold text-danger">🧴</div>
                      <small>Shampoo Premium</small>
                      <div className="text-success">R$ 45,90</div>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="text-center p-2 border rounded bg-white">
                      <div className="fw-bold text-danger">💅</div>
                      <small>Esmalte Importado</small>
                      <div className="text-success">R$ 28,50</div>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="text-center p-2 border rounded bg-white">
                      <div className="fw-bold text-danger">🎨</div>
                      <small>Tinta Coloração</small>
                      <div className="text-success">R$ 67,90</div>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="text-center p-2 border rounded bg-white">
                      <div className="fw-bold text-danger">✨</div>
                      <small>Máscara Hidratante</small>
                      <div className="text-success">R$ 89,90</div>
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
              <h6 className="mb-0 fw-bold">🎯 Recursos para Salões</h6>
            </div>
            <div className="card-body">
              <ul className="list-unstyled mb-0">
                <li className="mb-3">
                  <i className="bi bi-check-circle text-danger me-2"></i>
                  <strong>Agendamento Online:</strong> Clientes escolhem profissional
                </li>
                <li className="mb-3">
                  <i className="bi bi-check-circle text-danger me-2"></i>
                  <strong>Controle de Comissões:</strong> Automático por profissional
                </li>
                <li className="mb-3">
                  <i className="bi bi-check-circle text-danger me-2"></i>
                  <strong>Catálogo de Serviços:</strong> Preços e durações
                </li>
                <li className="mb-3">
                  <i className="bi bi-check-circle text-danger me-2"></i>
                  <strong>Histórico do Cliente:</strong> Preferências e alergias
                </li>
                <li className="mb-0">
                  <i className="bi bi-check-circle text-danger me-2"></i>
                  <strong>Lembretes Automáticos:</strong> WhatsApp e SMS
                </li>
              </ul>
            </div>
          </div>

          <div className="card border-0 shadow-sm mb-4">
            <div className="card-header bg-danger text-white">
              <h6 className="mb-0 fw-bold">📊 Performance Hoje</h6>
            </div>
            <div className="card-body">
              <div className="row text-center">
                <div className="col-6 mb-3">
                  <div className="fw-bold text-success fs-4">8</div>
                  <small className="text-muted">Serviços Realizados</small>
                </div>
                <div className="col-6 mb-3">
                  <div className="fw-bold text-danger fs-4">R$ 760</div>
                  <small className="text-muted">Faturamento</small>
                </div>
                <div className="col-6">
                  <div className="fw-bold text-warning fs-4">4</div>
                  <small className="text-muted">Agendamentos Restantes</small>
                </div>
                <div className="col-6">
                  <div className="fw-bold text-info fs-4">95%</div>
                  <small className="text-muted">Taxa Ocupação</small>
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
                  <strong>Ana Carolina</strong>
                  <div>⭐⭐⭐⭐⭐</div>
                </div>
                <small className="text-muted">"Fernanda é incrível! Cabelo perfeito!"</small>
              </div>
              <div className="mb-3">
                <div className="d-flex justify-content-between">
                  <strong>Mariana Silva</strong>
                  <div>⭐⭐⭐⭐⭐</div>
                </div>
                <small className="text-muted">"Hidratação maravilhosa, recomendo!"</small>
              </div>
              <div>
                <div className="d-flex justify-content-between">
                  <strong>Juliana Costa</strong>
                  <div>⭐⭐⭐⭐⭐</div>
                </div>
                <small className="text-muted">"Cor ficou exatamente como queria!"</small>
              </div>
            </div>
          </div>

          <div className="card border-danger border-2">
            <div className="card-body text-center">
              <h6 className="fw-bold mb-3">Modernize seu Salão!</h6>
              <p className="small text-muted mb-3">
                Mais agendamentos, melhor gestão!
              </p>
              <Link href="/register?segment=salao" className="btn btn-danger w-100 fw-bold">
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