"use client";
import Link from "next/link";

export default function FooterBs() {
  return (
    <footer className="bg-dark py-5 mt-5" style={{ color: "#f8f9fa" }}>
      <div className="container">
        <div className="row g-4">
          <div className="col-lg-4">
            <h5 className="fw-bold text-primary mb-3">
              <i className="bi bi-shop me-2"></i>Varejofflex
            </h5>
            <p className="mb-0">
              A plataforma completa para seu varejo crescer.
            </p>
          </div>

          <div className="col-lg-2 col-md-6">
            <h6 className="fw-bold mb-3">Produto</h6>
            <ul className="list-unstyled mb-0">
              <li>
                <a className="link-light text-decoration-none" href="#pricing">
                  Planos
                </a>
              </li>
              <li>
                <a className="link-light text-decoration-none" href="#features">
                  Recursos
                </a>
              </li>
              <li>
                <a className="link-light text-decoration-none" href="#segments">
                  Segmentos
                </a>
              </li>
            </ul>
          </div>

          <div className="col-lg-2 col-md-6">
            <h6 className="fw-bold mb-3">Suporte</h6>
            <ul className="list-unstyled mb-0">
              <li>
                <Link
                  href="/suporte"
                  className="link-light text-decoration-none"
                >
                  Central de Ajuda
                </Link>
              </li>
              <li>
                <Link
                  href="/contato"
                  className="link-light text-decoration-none"
                >
                  Contato
                </Link>
              </li>
            </ul>
          </div>

          <div className="col-lg-2 col-md-6">
            <h6 className="fw-bold mb-3">Legal</h6>
            <ul className="list-unstyled mb-0">
              <li>
                <Link
                  href="/termos"
                  className="link-light text-decoration-none"
                >
                  Termos
                </Link>
              </li>
              <li>
                <Link
                  href="/privacidade"
                  className="link-light text-decoration-none"
                >
                  Privacidade
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <hr className="my-4 border-secondary" />
        <div className="row align-items-center">
          <div className="col-md-6">
            <p className="mb-0">© 2025 Varejofflex. Todos os direitos reservados.</p>
          </div>
          <div className="col-md-6 text-md-end">
            <p className="mb-0">
              <a
                className="link-light text-decoration-none"
                href="mailto:contato@varejofflex.com"
              >
                contato@varejofflex.com
              </a>{" "}
              | (11) 99999-9999
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
