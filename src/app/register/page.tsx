"use client";

import Link from "next/link";

export default function RegisterPage() {
  return (
    <div className="min-vh-100 bg-light d-flex align-items-center">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            {/* Header */}
            <div className="text-center mb-5">
              <Link href="/" className="btn btn-outline-primary mb-4">
                <i className="bi bi-arrow-left me-2"></i>
                Voltar ao Início
              </Link>
              <h1 className="display-5 fw-bold mb-3">Escolha seu Tipo de Cadastro</h1>
              <p className="lead text-muted">
                Selecione a opção que melhor se adequa ao seu perfil
              </p>
            </div>

            {/* Cards de Opção */}
            <div className="row g-4">
              {/* Cadastro Lojista */}
              <div className="col-md-6">
                <div className="card h-100 border-success border-2 shadow-lg">
                  <div className="card-header bg-success text-white text-center py-4">
                    <div className="fs-1 mb-2">🏪</div>
                    <h4 className="mb-0">Sou Lojista</h4>
                  </div>
                  <div className="card-body d-flex flex-column">
                    <p className="text-muted mb-4">
                      Quero vender meus produtos online e gerenciar minha loja
                    </p>
                    
                    <div className="mb-4">
                      <h6 className="fw-bold mb-3">✨ O que você ganha:</h6>
                      <ul className="list-unstyled">
                        <li className="mb-2">
                          <i className="bi bi-check-circle text-success me-2"></i>
                          Sistema PDV completo
                        </li>
                        <li className="mb-2">
                          <i className="bi bi-check-circle text-success me-2"></i>
                          Gestão de produtos e estoque
                        </li>
                        <li className="mb-2">
                          <i className="bi bi-check-circle text-success me-2"></i>
                          Relatórios e métricas
                        </li>
                        <li className="mb-2">
                          <i className="bi bi-check-circle text-success me-2"></i>
                          Integração com delivery
                        </li>
                        <li className="mb-2">
                          <i className="bi bi-check-circle text-success me-2"></i>
                          Suporte especializado
                        </li>
                      </ul>
                    </div>

                    <div className="mb-4">
                      <h6 className="fw-bold mb-3">🎯 Segmentos Disponíveis:</h6>
                      <div className="row g-2">
                        <div className="col-6">
                          <span className="badge bg-warning text-dark w-100">🍔 Lanchonetes</span>
                        </div>
                        <div className="col-6">
                          <span className="badge bg-danger w-100">🍕 Pizzarias</span>
                        </div>
                        <div className="col-6">
                          <span className="badge bg-primary w-100">👗 Moda</span>
                        </div>
                        <div className="col-6">
                          <span className="badge bg-success w-100">🛒 Mercados</span>
                        </div>
                        <div className="col-6">
                          <span className="badge bg-warning w-100">🐕 Petshops</span>
                        </div>
                        <div className="col-6">
                          <span className="badge bg-danger w-100">💅 Salões</span>
                        </div>
                        <div className="col-6">
                          <span className="badge bg-info w-100">💊 Farmácias</span>
                        </div>
                        <div className="col-6">
                          <span className="badge bg-secondary w-100">🏪 Conveniência</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-auto">
                      <div className="alert alert-success border-success mb-3">
                        <small>
                          <i className="bi bi-gift me-2"></i>
                          <strong>7 dias grátis</strong> para testar todas as funcionalidades!
                        </small>
                      </div>
                      
                      <div className="d-grid">
                        <Link href="/register/lojista" className="btn btn-success btn-lg fw-bold">
                          <i className="bi bi-shop me-2"></i>
                          Cadastrar como Lojista
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Cadastro Owner SaaS */}
              <div className="col-md-6">
                <div className="card h-100 border-danger border-2 shadow-lg">
                  <div className="card-header bg-danger text-white text-center py-4">
                    <div className="fs-1 mb-2">🔐</div>
                    <h4 className="mb-0">Owner SaaS</h4>
                  </div>
                  <div className="card-body d-flex flex-column">
                    <p className="text-muted mb-4">
                      Acesso administrativo completo à plataforma VarejoFlex
                    </p>
                    
                    <div className="mb-4">
                      <h6 className="fw-bold mb-3">⚡ Permissões Especiais:</h6>
                      <ul className="list-unstyled">
                        <li className="mb-2">
                          <i className="bi bi-check-circle text-danger me-2"></i>
                          Dashboard administrativo global
                        </li>
                        <li className="mb-2">
                          <i className="bi bi-check-circle text-danger me-2"></i>
                          Gestão de todos os lojistas
                        </li>
                        <li className="mb-2">
                          <i className="bi bi-check-circle text-danger me-2"></i>
                          Controle de planos e faturamento
                        </li>
                        <li className="mb-2">
                          <i className="bi bi-check-circle text-danger me-2"></i>
                          Métricas da plataforma
                        </li>
                        <li className="mb-2">
                          <i className="bi bi-check-circle text-danger me-2"></i>
                          Configurações avançadas
                        </li>
                      </ul>
                    </div>

                    <div className="alert alert-warning border-warning mb-4">
                      <div className="d-flex">
                        <i className="bi bi-shield-exclamation me-2"></i>
                        <div>
                          <h6 className="alert-heading mb-1">⚠️ Acesso Restrito</h6>
                          <small>
                            Este cadastro é exclusivo para o proprietário da plataforma.
                            É necessária uma chave secreta válida.
                          </small>
                        </div>
                      </div>
                    </div>

                    <div className="mt-auto">
                      <div className="d-grid">
                        <Link href="/register/owner" className="btn btn-danger btn-lg fw-bold">
                          <i className="bi bi-shield-lock me-2"></i>
                          Acesso Owner SaaS
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Info */}
            <div className="text-center mt-5">
              <p className="text-muted">
                Já possui uma conta? 
                <Link href="/login" className="text-decoration-none ms-2 fw-bold">
                  Fazer Login
                </Link>
              </p>
              
              <div className="mt-4 pt-4 border-top">
                <small className="text-muted">
                  <i className="bi bi-shield-check me-2"></i>
                  Seus dados estão seguros e protegidos
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
