import Link from "next/link";

export const metadata = {
  title: "Demo Moda & Acessórios - VarejoFlex",
  description: "Veja como funciona nossa solução para moda com catálogo visual, gestão de variações e controle de estoque por SKU.",
};

export default function DemoModa() {
  return (
    <div className="container py-5">
      <div className="row align-items-center mb-5">
        <div className="col-md-8">
          <Link href="/" className="btn btn-outline-primary mb-3">
            <i className="bi bi-arrow-left me-2"></i>
            Voltar ao Início
          </Link>
          <h1 className="display-5 fw-bold mb-3">
            Demo <span className="text-purple">Moda & Acessórios</span>
          </h1>
          <p className="lead text-muted">
            Experimente nossa solução completa para moda com catálogo visual avançado, 
            gestão de variações por cor/tamanho e controle de estoque por SKU.
          </p>
        </div>
        <div className="col-md-4 text-center">
          <div className="bg-purple text-white rounded-4 p-4">
            <i className="bi bi-bag fs-1 mb-2"></i>
            <h5 className="mb-0">Boutique Elegance</h5>
            <small>Demo Interativa</small>
          </div>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-lg-8">
          <div className="card border-0 shadow-lg">
            <div className="card-header bg-purple text-white">
              <h5 className="mb-0">
                <i className="bi bi-heart me-2"></i>
                Catálogo Visual - Boutique Elegance
              </h5>
            </div>
            <div className="card-body">
              {/* Simulação de loja de moda */}
              <div className="row g-3">
                <div className="col-md-4">
                  <div className="card border-0 shadow-sm">
                    <div className="position-relative">
                      <div className="bg-gradient-custom rounded-top" style={{height: "200px", display: "flex", alignItems: "center", justifyContent: "center"}}>
                        <i className="bi bi-image text-white" style={{fontSize: "3rem"}}></i>
                      </div>
                      <span className="position-absolute top-0 end-0 badge bg-danger m-2">-30%</span>
                    </div>
                    <div className="card-body">
                      <h6 className="fw-bold">Vestido Floral</h6>
                      <p className="text-muted small mb-2">Ref: VF2024001</p>
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <span className="text-decoration-line-through text-muted">R$ 129,90</span>
                          <span className="fw-bold text-success ms-2">R$ 89,90</span>
                        </div>
                      </div>
                      <div className="mt-2">
                        <small className="text-muted">Cores:</small>
                        <div className="d-flex gap-1 mt-1">
                          <div className="rounded-circle bg-primary" style={{width: "20px", height: "20px"}}></div>
                          <div className="rounded-circle bg-success" style={{width: "20px", height: "20px"}}></div>
                          <div className="rounded-circle bg-warning" style={{width: "20px", height: "20px"}}></div>
                        </div>
                      </div>
                      <div className="mt-2">
                        <small className="text-muted">Tamanhos: P, M, G, GG</small>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="card border-0 shadow-sm">
                    <div className="bg-secondary rounded-top" style={{height: "200px", display: "flex", alignItems: "center", justifyContent: "center"}}>
                      <i className="bi bi-bag text-white" style={{fontSize: "3rem"}}></i>
                    </div>
                    <div className="card-body">
                      <h6 className="fw-bold">Bolsa Couro Premium</h6>
                      <p className="text-muted small mb-2">Ref: BC2024002</p>
                      <div className="fw-bold text-primary">R$ 189,90</div>
                      <div className="mt-2">
                        <small className="text-muted">Cores:</small>
                        <div className="d-flex gap-1 mt-1">
                          <div className="rounded-circle bg-dark" style={{width: "20px", height: "20px"}}></div>
                          <div className="rounded-circle bg-secondary" style={{width: "20px", height: "20px"}}></div>
                        </div>
                      </div>
                      <div className="mt-2">
                        <span className="badge bg-success">Em estoque</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="card border-0 shadow-sm">
                    <div className="bg-info rounded-top" style={{height: "200px", display: "flex", alignItems: "center", justifyContent: "center"}}>
                      <i className="bi bi-gem text-white" style={{fontSize: "3rem"}}></i>
                    </div>
                    <div className="card-body">
                      <h6 className="fw-bold">Colar Minimalista</h6>
                      <p className="text-muted small mb-2">Ref: CM2024003</p>
                      <div className="fw-bold text-primary">R$ 59,90</div>
                      <div className="mt-2">
                        <small className="text-muted">Material: Prata 925</small>
                      </div>
                      <div className="mt-2">
                        <span className="badge bg-warning text-dark">Últimas unidades</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 p-3 bg-light rounded">
                <h6 className="fw-bold mb-3">🛍️ Simulação de Compra</h6>
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group mb-3">
                      <label className="form-label small">Produto Selecionado:</label>
                      <select className="form-select">
                        <option>Vestido Floral - R$ 89,90</option>
                        <option>Bolsa Couro Premium - R$ 189,90</option>
                        <option>Colar Minimalista - R$ 59,90</option>
                      </select>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="form-group mb-3">
                      <label className="form-label small">Cor:</label>
                      <select className="form-select">
                        <option>Azul</option>
                        <option>Verde</option>
                        <option>Amarelo</option>
                      </select>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="form-group mb-3">
                      <label className="form-label small">Tamanho:</label>
                      <select className="form-select">
                        <option>P</option>
                        <option>M</option>
                        <option>G</option>
                        <option>GG</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="d-flex justify-content-between align-items-center">
                  <span className="fw-bold">Total: R$ 89,90</span>
                  <button className="btn btn-purple">
                    <i className="bi bi-cart-plus me-2"></i>
                    Adicionar ao Carrinho
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-header bg-light">
              <h6 className="mb-0 fw-bold">🎯 Recursos para Moda</h6>
            </div>
            <div className="card-body">
              <ul className="list-unstyled mb-0">
                <li className="mb-3">
                  <i className="bi bi-check-circle text-success me-2"></i>
                  <strong>Catálogo Visual Avançado:</strong> Múltiplas imagens por variação de cor
                </li>
                <li className="mb-3">
                  <i className="bi bi-check-circle text-success me-2"></i>
                  <strong>Gestão de Variações:</strong> Controle completo por cor, tamanho e SKU
                </li>
                <li className="mb-3">
                  <i className="bi bi-check-circle text-success me-2"></i>
                  <strong>Estoque Inteligente:</strong> Alertas de ruptura por variação específica
                </li>
                <li className="mb-3">
                  <i className="bi bi-check-circle text-success me-2"></i>
                  <strong>Tabela de Medidas:</strong> Guia completo para cada produto
                </li>
                <li className="mb-0">
                  <i className="bi bi-check-circle text-success me-2"></i>
                  <strong>Sistema de Trocas:</strong> Processo simplificado para devoluções
                </li>
              </ul>
            </div>
          </div>

          <div className="card border-0 shadow-sm mb-4">
            <div className="card-header bg-purple text-white">
              <h6 className="mb-0 fw-bold">📊 Gestão Avançada</h6>
            </div>
            <div className="card-body">
              <div className="row text-center">
                <div className="col-6 mb-3">
                  <div className="fw-bold text-purple fs-4">156</div>
                  <small className="text-muted">SKUs Ativos</small>
                </div>
                <div className="col-6 mb-3">
                  <div className="fw-bold text-success fs-4">94%</div>
                  <small className="text-muted">Disponibilidade</small>
                </div>
                <div className="col-6">
                  <div className="fw-bold text-info fs-4">12%</div>
                  <small className="text-muted">Taxa de Troca</small>
                </div>
                <div className="col-6">
                  <div className="fw-bold text-warning fs-4">3.2x</div>
                  <small className="text-muted">Giro Médio</small>
                </div>
              </div>
            </div>
          </div>

          <div className="card border-purple border-2">
            <div className="card-body text-center">
              <h6 className="fw-bold mb-3">Transforme sua Loja!</h6>
              <p className="small text-muted mb-3">
                Gestão profissional para moda em 5 minutos!
              </p>
              <Link href="/register?segment=moda" className="btn btn-purple w-100 fw-bold">
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