import Link from "next/link";

export const metadata = {
  title: "Demo Conveniência - VarejoFlex",
  description: "Veja como funciona nossa solução para lojas de conveniência com PDV rápido, produtos diversos e muito mais.",
};

export default function DemoConveniencia() {
  return (
    <div className="container py-5">
      <div className="row align-items-center mb-5">
        <div className="col-md-8">
          <Link href="/" className="btn btn-outline-primary mb-3">
            <i className="bi bi-arrow-left me-2"></i>
            Voltar ao Início
          </Link>
          <h1 className="display-5 fw-bold mb-3">
            Demo <span className="text-secondary">Conveniência</span>
          </h1>
          <p className="lead text-muted">
            Experimente nossa solução completa para lojas de conveniência com PDV rápido, 
            produtos diversos, bebidas e gestão de horário estendido.
          </p>
        </div>
        <div className="col-md-4 text-center">
          <div className="bg-secondary text-white rounded-4 p-4">
            <i className="bi bi-shop fs-1 mb-2"></i>
            <h5 className="mb-0">Quick Stop 24h</h5>
            <small>Demo Interativa</small>
          </div>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-lg-8">
          <div className="card border-0 shadow-lg">
            <div className="card-header bg-secondary text-white">
              <h5 className="mb-0">
                <i className="bi bi-lightning me-2"></i>
                Sistema Conveniência - Quick Stop 24h
              </h5>
            </div>
            <div className="card-body">
              {/* Simulação de Sistema Conveniência */}
              <div className="row g-3">
                {/* Área de Produtos Rápidos */}
                <div className="col-md-6">
                  <h6 className="fw-bold mb-3">⚡ Produtos Populares</h6>
                  
                  <div className="card mb-3 border-success">
                    <div className="card-body p-3">
                      <div className="d-flex justify-content-between align-items-start">
                        <div>
                          <h6 className="mb-1">🥤 Coca-Cola 350ml</h6>
                          <small className="text-muted">EAN: 7891234567890</small>
                          <div className="mt-2">
                            <span className="badge bg-success">Gelada</span>
                            <span className="ms-1 fw-bold text-secondary">R$ 4,50</span>
                          </div>
                          <div className="mt-1">
                            <small className="text-success">🧊 Geladeira A3 - Prateleira 2</small>
                          </div>
                        </div>
                        <div className="text-end">
                          <div className="fw-bold text-muted">Est: 48</div>
                          <button className="btn btn-sm btn-success mt-1">
                            <i className="bi bi-plus"></i> F1
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="card mb-3 border-warning">
                    <div className="card-body p-3">
                      <div className="d-flex justify-content-between align-items-start">
                        <div>
                          <h6 className="mb-1">🚬 Marlboro Red</h6>
                          <small className="text-muted">EAN: 7891234567123</small>
                          <div className="mt-2">
                            <span className="badge bg-warning text-dark">+18 anos</span>
                            <span className="ms-1 fw-bold text-secondary">R$ 12,00</span>
                          </div>
                          <div className="mt-1">
                            <small className="text-warning">🔒 Armário 1 - Chave A</small>
                          </div>
                        </div>
                        <div className="text-end">
                          <div className="fw-bold text-muted">Est: 25</div>
                          <button className="btn btn-sm btn-warning mt-1">
                            <i className="bi bi-person-check"></i> F2
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="card mb-3">
                    <div className="card-body p-3">
                      <div className="d-flex justify-content-between align-items-start">
                        <div>
                          <h6 className="mb-1">🍫 Chocolate Bis 126g</h6>
                          <small className="text-muted">EAN: 7891234567456</small>
                          <div className="mt-2">
                            <span className="badge bg-info">Doce</span>
                            <span className="ms-1 fw-bold text-secondary">R$ 8,90</span>
                          </div>
                          <div className="mt-1">
                            <small className="text-muted">📦 Gôndola 3 - Altura média</small>
                          </div>
                        </div>
                        <div className="text-end">
                          <div className="fw-bold text-muted">Est: 32</div>
                          <button className="btn btn-sm btn-secondary mt-1">
                            <i className="bi bi-plus"></i> F3
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="card mb-3 border-danger">
                    <div className="card-body p-3">
                      <div className="d-flex justify-content-between align-items-start">
                        <div>
                          <h6 className="mb-1">🍺 Skol Lata 350ml</h6>
                          <small className="text-muted">EAN: 7891234567789</small>
                          <div className="mt-2">
                            <span className="badge bg-danger">Alcóolica +18</span>
                            <span className="ms-1 fw-bold text-secondary">R$ 3,80</span>
                          </div>
                          <div className="mt-1">
                            <small className="text-danger">🧊 Geladeira B1 - Cerveja</small>
                          </div>
                        </div>
                        <div className="text-end">
                          <div className="fw-bold text-muted">Est: 72</div>
                          <button className="btn btn-sm btn-danger mt-1">
                            <i className="bi bi-person-check"></i> F4
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Área do PDV Express */}
                <div className="col-md-6">
                  <h6 className="fw-bold mb-3">💰 PDV Express</h6>
                  
                  <div className="card">
                    <div className="card-body">
                      <div className="mb-3">
                        <div className="input-group">
                          <input type="text" className="form-control" placeholder="🔍 Código ou F1-F12..." />
                          <button className="btn btn-outline-secondary">
                            <i className="bi bi-upc-scan"></i>
                          </button>
                        </div>
                      </div>

                      <div className="mb-3 pb-3 border-bottom">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <div>
                            <strong>Coca-Cola 350ml</strong>
                            <br />
                            <small className="text-muted">F1 - Gelada</small>
                          </div>
                          <button className="btn btn-sm btn-outline-danger">
                            <i className="bi bi-trash"></i>
                          </button>
                        </div>
                        <div className="d-flex justify-content-between align-items-center">
                          <div>
                            <span className="badge bg-light text-dark">3 un</span>
                          </div>
                          <span className="fw-bold text-secondary">R$ 13,50</span>
                        </div>
                      </div>

                      <div className="mb-3 pb-3 border-bottom">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <div>
                            <strong>Chocolate Bis 126g</strong>
                            <br />
                            <small className="text-muted">F3 - Doce</small>
                          </div>
                          <button className="btn btn-sm btn-outline-danger">
                            <i className="bi bi-trash"></i>
                          </button>
                        </div>
                        <div className="d-flex justify-content-between align-items-center">
                          <div>
                            <span className="badge bg-light text-dark">1 un</span>
                          </div>
                          <span className="fw-bold text-secondary">R$ 8,90</span>
                        </div>
                      </div>

                      <div className="alert alert-warning border-warning mb-3">
                        <h6 className="alert-heading mb-2">🔞 Verificação de Idade</h6>
                        <div className="row">
                          <div className="col-8">
                            <small>
                              <strong>Skol Lata 350ml</strong><br />
                              Cliente possui +18 anos?
                            </small>
                          </div>
                          <div className="col-4 text-end">
                            <button className="btn btn-sm btn-success mb-1 d-block w-100">
                              ✅ Sim
                            </button>
                            <button className="btn btn-sm btn-danger d-block w-100">
                              ❌ Não
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <strong>Total:</strong>
                        <strong className="text-secondary fs-4">R$ 26,20</strong>
                      </div>

                      <div className="row g-2 mb-3">
                        <div className="col-6">
                          <button className="btn btn-success w-100">
                            💳 Cartão
                          </button>
                        </div>
                        <div className="col-6">
                          <button className="btn btn-warning w-100">
                            💰 Dinheiro
                          </button>
                        </div>
                        <div className="col-6">
                          <button className="btn btn-info w-100">
                            📱 Pix
                          </button>
                        </div>
                        <div className="col-6">
                          <button className="btn btn-secondary w-100">
                            🎁 Vale
                          </button>
                        </div>
                      </div>

                      <button className="btn btn-secondary w-100 fw-bold">
                        <i className="bi bi-printer me-2"></i>
                        Finalizar Venda
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 p-3 bg-light rounded">
                <h6 className="fw-bold mb-3">⏰ Operação 24 Horas</h6>
                <div className="row">
                  <div className="col-md-3">
                    <div className="text-center p-3 border rounded bg-white">
                      <div className="fs-4 text-success">🌅</div>
                      <small>Manhã</small>
                      <div className="fw-bold">06:00-12:00</div>
                      <span className="badge bg-success">João</span>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="text-center p-3 border rounded bg-white">
                      <div className="fs-4 text-warning">☀️</div>
                      <small>Tarde</small>
                      <div className="fw-bold">12:00-18:00</div>
                      <span className="badge bg-warning text-dark">Maria</span>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="text-center p-3 border rounded bg-white">
                      <div className="fs-4 text-danger">🌆</div>
                      <small>Noite</small>
                      <div className="fw-bold">18:00-00:00</div>
                      <span className="badge bg-danger">Carlos</span>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="text-center p-3 border rounded bg-white">
                      <div className="fs-4 text-secondary">🌙</div>
                      <small>Madrugada</small>
                      <div className="fw-bold">00:00-06:00</div>
                      <span className="badge bg-secondary">Ana</span>
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
              <h6 className="mb-0 fw-bold">🎯 Recursos para Conveniência</h6>
            </div>
            <div className="card-body">
              <ul className="list-unstyled mb-0">
                <li className="mb-3">
                  <i className="bi bi-check-circle text-secondary me-2"></i>
                  <strong>PDV Express:</strong> Teclas de atalho F1-F12
                </li>
                <li className="mb-3">
                  <i className="bi bi-check-circle text-secondary me-2"></i>
                  <strong>Controle de Idade:</strong> Produtos +18 automático
                </li>
                <li className="mb-3">
                  <i className="bi bi-check-circle text-secondary me-2"></i>
                  <strong>Múltiplos Pagamentos:</strong> PIX, cartão, dinheiro
                </li>
                <li className="mb-3">
                  <i className="bi bi-check-circle text-secondary me-2"></i>
                  <strong>Operação 24h:</strong> Controle por turnos
                </li>
                <li className="mb-0">
                  <i className="bi bi-check-circle text-secondary me-2"></i>
                  <strong>Localização Produtos:</strong> Mapa da loja
                </li>
              </ul>
            </div>
          </div>

          <div className="card border-0 shadow-sm mb-4">
            <div className="card-header bg-secondary text-white">
              <h6 className="mb-0 fw-bold">📊 Turno Atual - Tarde</h6>
            </div>
            <div className="card-body">
              <div className="row text-center">
                <div className="col-6 mb-3">
                  <div className="fw-bold text-success fs-4">89</div>
                  <small className="text-muted">Vendas no Turno</small>
                </div>
                <div className="col-6 mb-3">
                  <div className="fw-bold text-secondary fs-4">R$ 587</div>
                  <small className="text-muted">Faturamento</small>
                </div>
                <div className="col-6">
                  <div className="fw-bold text-warning fs-4">2:15</div>
                  <small className="text-muted">Tempo Médio</small>
                </div>
                <div className="col-6">
                  <div className="fw-bold text-info fs-4">67%</div>
                  <small className="text-muted">PIX/Cartão</small>
                </div>
              </div>
            </div>
          </div>

          <div className="card border-0 shadow-sm mb-4">
            <div className="card-header bg-light">
              <h6 className="mb-0 fw-bold">🔥 Mais Vendidos Hoje</h6>
            </div>
            <div className="card-body">
              <div className="mb-2">
                <div className="d-flex justify-content-between">
                  <span>🥤 Coca-Cola 350ml</span>
                  <strong>67 un</strong>
                </div>
                <div className="progress mt-1" style={{height: "4px"}}>
                  <div className="progress-bar bg-success" style={{width: "100%"}}></div>
                </div>
              </div>
              <div className="mb-2">
                <div className="d-flex justify-content-between">
                  <span>🍺 Skol Lata 350ml</span>
                  <strong>45 un</strong>
                </div>
                <div className="progress mt-1" style={{height: "4px"}}>
                  <div className="progress-bar bg-danger" style={{width: "67%"}}></div>
                </div>
              </div>
              <div className="mb-2">
                <div className="d-flex justify-content-between">
                  <span>🍫 Chocolate Bis</span>
                  <strong>28 un</strong>
                </div>
                <div className="progress mt-1" style={{height: "4px"}}>
                  <div className="progress-bar bg-info" style={{width: "42%"}}></div>
                </div>
              </div>
              <div>
                <div className="d-flex justify-content-between">
                  <span>🚬 Marlboro Red</span>
                  <strong>23 un</strong>
                </div>
                <div className="progress mt-1" style={{height: "4px"}}>
                  <div className="progress-bar bg-warning" style={{width: "34%"}}></div>
                </div>
              </div>
            </div>
          </div>

          <div className="card border-secondary border-2">
            <div className="card-body text-center">
              <h6 className="fw-bold mb-3">Modernize sua Conveniência!</h6>
              <p className="small text-muted mb-3">
                Venda mais rápido, 24 horas por dia!
              </p>
              <Link href="/register?segment=conveniencia" className="btn btn-secondary w-100 fw-bold">
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