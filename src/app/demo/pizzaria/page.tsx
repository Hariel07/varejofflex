import Link from "next/link";

export const metadata = {
  title: "Demo Pizzaria - VarejoFlex",
  description: "Veja como funciona nossa solução para pizzarias com delivery otimizado e rastreamento em tempo real.",
};

export default function DemoPizzaria() {
  return (
    <div className="container py-5">
      <div className="row align-items-center mb-5">
        <div className="col-md-8">
          <Link href="/" className="btn btn-outline-primary mb-3">
            <i className="bi bi-arrow-left me-2"></i>
            Voltar ao Início
          </Link>
          <h1 className="display-5 fw-bold mb-3">
            Demo <span className="text-danger">Pizzaria</span>
          </h1>
          <p className="lead text-muted">
            Experimente nossa solução completa para pizzarias com delivery otimizado, 
            KDS para cozinha e rastreamento em tempo real.
          </p>
        </div>
        <div className="col-md-4 text-center">
          <div className="bg-danger text-white rounded-4 p-4">
            <i className="bi bi-pizza fs-1 mb-2"></i>
            <h5 className="mb-0">Nonna Mia</h5>
            <small>Demo Interativa</small>
          </div>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-lg-8">
          <div className="card border-0 shadow-lg">
            <div className="card-header bg-danger text-white">
              <h5 className="mb-0">
                <i className="bi bi-truck me-2"></i>
                Delivery Otimizado - Nonna Mia
              </h5>
            </div>
            <div className="card-body">
              <iframe 
                src="/vf-delivery-demo.html" 
                className="w-100 border-0 rounded"
                style={{height: "600px"}}
                title="Demo Pizzaria"
              ></iframe>
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-header bg-light">
              <h6 className="mb-0 fw-bold">🎯 Recursos Específicos para Pizzarias</h6>
            </div>
            <div className="card-body">
              <ul className="list-unstyled mb-0">
                <li className="mb-3">
                  <i className="bi bi-check-circle text-success me-2"></i>
                  <strong>Configurador de Sabores:</strong> Meio a meio e combinações personalizadas
                </li>
                <li className="mb-3">
                  <i className="bi bi-check-circle text-success me-2"></i>
                  <strong>Tempo de Preparo Inteligente:</strong> Cálculo automático baseado no movimento
                </li>
                <li className="mb-3">
                  <i className="bi bi-check-circle text-success me-2"></i>
                  <strong>KDS para Cozinha:</strong> Tela dedicada para organizar a produção
                </li>
                <li className="mb-3">
                  <i className="bi bi-check-circle text-success me-2"></i>
                  <strong>Rastreamento Real:</strong> Cliente acompanha o pedido em tempo real
                </li>
                <li className="mb-0">
                  <i className="bi bi-check-circle text-success me-2"></i>
                  <strong>Gestão de Entregadores:</strong> Otimização de rotas e controle de frota
                </li>
              </ul>
            </div>
          </div>

          <div className="card border-0 shadow-sm mb-4">
            <div className="card-header bg-danger text-white">
              <h6 className="mb-0 fw-bold">📊 Resultados Reais</h6>
            </div>
            <div className="card-body">
              <div className="row text-center">
                <div className="col-6 mb-3">
                  <div className="fw-bold text-success fs-4">-15min</div>
                  <small className="text-muted">Tempo Entrega</small>
                </div>
                <div className="col-6 mb-3">
                  <div className="fw-bold text-success fs-4">+60%</div>
                  <small className="text-muted">Pedidos Online</small>
                </div>
                <div className="col-6">
                  <div className="fw-bold text-success fs-4">-25%</div>
                  <small className="text-muted">Erros Pedidos</small>
                </div>
                <div className="col-6">
                  <div className="fw-bold text-success fs-4">4.8★</div>
                  <small className="text-muted">Avaliação</small>
                </div>
              </div>
            </div>
          </div>

          <div className="card border-danger border-2">
            <div className="card-body text-center">
              <h6 className="fw-bold mb-3">Pronto para Revolucionar?</h6>
              <p className="small text-muted mb-3">
                Sua pizzaria online em 5 minutos!
              </p>
              <Link href="/register?segment=pizzaria" className="btn btn-danger w-100 fw-bold">
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