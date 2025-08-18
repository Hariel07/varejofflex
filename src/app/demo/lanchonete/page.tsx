import Link from "next/link";

export const metadata = {
  title: "Demo Lanchonete - VarejoFlex",
  description: "Veja como funciona nossa solução para lanchonetes com cardápio digital, pedidos online e PDV integrado.",
};

export default function DemoLanchonete() {
  return (
    <div className="container py-5">
      <div className="row align-items-center mb-5">
        <div className="col-md-8">
          <Link href="/" className="btn btn-outline-primary mb-3">
            <i className="bi bi-arrow-left me-2"></i>
            Voltar ao Início
          </Link>
          <h1 className="display-5 fw-bold mb-3">
            Demo <span className="text-warning">Lanchonete</span>
          </h1>
          <p className="lead text-muted">
            Experimente nossa solução completa para lanchonetes com cardápio digital, 
            gestão de pedidos e PDV integrado.
          </p>
        </div>
        <div className="col-md-4 text-center">
          <div className="bg-warning text-white rounded-4 p-4">
            <i className="bi bi-cup-hot fs-1 mb-2"></i>
            <h5 className="mb-0">Burguer House</h5>
            <small>Demo Interativa</small>
          </div>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-lg-8">
          <div className="card border-0 shadow-lg">
            <div className="card-header bg-warning text-white">
              <h5 className="mb-0">
                <i className="bi bi-phone me-2"></i>
                Cardápio Digital - Burguer House
              </h5>
            </div>
            <div className="card-body">
              <iframe 
                src="/vf-delivery-demo.html" 
                className="w-100 border-0 rounded"
                style={{height: "600px"}}
                title="Demo Lanchonete"
              ></iframe>
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-header bg-light">
              <h6 className="mb-0 fw-bold">🎯 Recursos Destacados</h6>
            </div>
            <div className="card-body">
              <ul className="list-unstyled mb-0">
                <li className="mb-3">
                  <i className="bi bi-check-circle text-success me-2"></i>
                  <strong>Cardápio Responsivo:</strong> Funciona perfeitamente em celulares, tablets e desktops
                </li>
                <li className="mb-3">
                  <i className="bi bi-check-circle text-success me-2"></i>
                  <strong>Pedidos Online:</strong> Clientes podem pedir diretamente pelo site
                </li>
                <li className="mb-3">
                  <i className="bi bi-check-circle text-success me-2"></i>
                  <strong>Gestão de Combos:</strong> Configure combos e promoções facilmente
                </li>
                <li className="mb-3">
                  <i className="bi bi-check-circle text-success me-2"></i>
                  <strong>Controle de Ingredientes:</strong> Permita personalizações nos produtos
                </li>
                <li className="mb-0">
                  <i className="bi bi-check-circle text-success me-2"></i>
                  <strong>PDV Integrado:</strong> Pedidos online e balcão em um só lugar
                </li>
              </ul>
            </div>
          </div>

          <div className="card border-0 shadow-sm mb-4">
            <div className="card-header bg-primary text-white">
              <h6 className="mb-0 fw-bold">📊 Métricas Esperadas</h6>
            </div>
            <div className="card-body">
              <div className="row text-center">
                <div className="col-6 mb-3">
                  <div className="fw-bold text-success fs-4">+45%</div>
                  <small className="text-muted">Vendas Online</small>
                </div>
                <div className="col-6 mb-3">
                  <div className="fw-bold text-success fs-4">-30%</div>
                  <small className="text-muted">Tempo de Pedido</small>
                </div>
                <div className="col-6">
                  <div className="fw-bold text-success fs-4">+25%</div>
                  <small className="text-muted">Ticket Médio</small>
                </div>
                <div className="col-6">
                  <div className="fw-bold text-success fs-4">95%</div>
                  <small className="text-muted">Satisfação</small>
                </div>
              </div>
            </div>
          </div>

          <div className="card border-warning border-2">
            <div className="card-body text-center">
              <h6 className="fw-bold mb-3">Gostou da Demo?</h6>
              <p className="small text-muted mb-3">
                Configure sua lanchonete em 5 minutos!
              </p>
              <Link href="/register?segment=lanchonete" className="btn btn-warning w-100 fw-bold">
                <i className="bi bi-rocket me-2"></i>
                Começar Agora Grátis
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-5">
        <h3 className="fw-bold mb-4 text-center">Outras Demos por Segmento</h3>
        <div className="row g-3">
          <div className="col-md-2">
            <Link href="/demo/pizzaria" className="btn btn-outline-danger w-100">
              🍕 Pizzaria
            </Link>
          </div>
          <div className="col-md-2">
            <Link href="/demo/moda" className="btn btn-outline-purple w-100">
              👗 Moda
            </Link>
          </div>
          <div className="col-md-2">
            <Link href="/demo/mercado" className="btn btn-outline-success w-100">
              🛒 Mercado
            </Link>
          </div>
          <div className="col-md-2">
            <Link href="/demo/petshop" className="btn btn-outline-info w-100">
              🐕 Petshop
            </Link>
          </div>
          <div className="col-md-2">
            <Link href="/demo/salao" className="btn btn-outline-primary w-100">
              💄 Salão
            </Link>
          </div>
          <div className="col-md-2">
            <Link href="#contact" className="btn btn-outline-secondary w-100">
              💬 Falar com Vendas
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}