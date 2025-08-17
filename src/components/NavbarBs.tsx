import Link from "next/link";

export default function NavbarBs() {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white sticky-top border-bottom" id="header">
      <div className="container">
        <Link className="navbar-brand fw-bold text-primary fs-3" href="/">
          <i className="bi bi-shop me-2" />
          Varejofflex
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Alternar navegação"
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto me-4">
            <li className="nav-item">
              <a className="nav-link fw-semibold" href="#pricing">
                Planos
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link fw-semibold" href="#features">
                Recursos
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link fw-semibold" href="#segments">
                Segmentos
              </a>
            </li>
            <li className="nav-item">
              <Link className="nav-link fw-semibold" href="/demo">
                Demo
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link fw-semibold" href="/login">
                Login
              </Link>
            </li>
          </ul>

          <Link href="/register" className="btn btn-primary">
            Começar Teste Grátis
          </Link>
        </div>
      </div>
    </nav>
  );
}
