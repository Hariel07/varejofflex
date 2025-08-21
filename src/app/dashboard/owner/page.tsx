"use client";

import { useAuthUser } from "@/hooks/useAuth";
import { useEffect, useState } from "react";

export default function OwnerDashboardSimple() {
  const { user, isLoading, isOwnerSaas } = useAuthUser();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="container mt-4">
        <div className="d-flex justify-content-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Carregando...</span>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mt-4">
        <div className="d-flex justify-content-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Carregando usuário...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mt-4">
        <div className="alert alert-warning">
          <h5>Usuário não encontrado</h5>
          <p>Não foi possível carregar as informações do usuário.</p>
          <a href="/login" className="btn btn-primary">Fazer Login</a>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4">
      <div className="row mb-4">
        <div className="col">
          <h1 className="h3 mb-3">🎉 Dashboard Owner - FUNCIONANDO!</h1>
          <div className="alert alert-success">
            <h5>✅ Acesso autorizado!</h5>
            <p className="mb-0">Bem-vindo ao dashboard Owner SaaS, <strong>{user.name}</strong>!</p>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h5>Informações do Usuário</h5>
            </div>
            <div className="card-body">
              <table className="table table-sm">
                <tbody>
                  <tr>
                    <td><strong>Nome:</strong></td>
                    <td>{user.name}</td>
                  </tr>
                  <tr>
                    <td><strong>Email:</strong></td>
                    <td>{user.email}</td>
                  </tr>
                  <tr>
                    <td><strong>Role:</strong></td>
                    <td><span className="badge bg-primary">{user.role}</span></td>
                  </tr>
                  <tr>
                    <td><strong>Tipo de Usuário:</strong></td>
                    <td><span className="badge bg-success">{user.userType || 'Não definido'}</span></td>
                  </tr>
                  <tr>
                    <td><strong>É Owner SaaS:</strong></td>
                    <td><span className={`badge ${isOwnerSaas ? 'bg-success' : 'bg-danger'}`}>{isOwnerSaas ? 'SIM' : 'NÃO'}</span></td>
                  </tr>
                  <tr>
                    <td><strong>Company ID:</strong></td>
                    <td>{user.companyId || 'N/A'}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h5>Contexto do Tenant</h5>
            </div>
            <div className="card-body">
              {user.tenantContext ? (
                <table className="table table-sm">
                  <tbody>
                    <tr>
                      <td><strong>Tipo do Tenant:</strong></td>
                      <td><span className="badge bg-info">{user.tenantContext.tenantType}</span></td>
                    </tr>
                    <tr>
                      <td><strong>Tenant ID:</strong></td>
                      <td>{user.tenantContext.tenantId || 'Global'}</td>
                    </tr>
                    <tr>
                      <td><strong>User Type:</strong></td>
                      <td><span className="badge bg-warning">{user.tenantContext.userType}</span></td>
                    </tr>
                    <tr>
                      <td><strong>Permissões:</strong></td>
                      <td>
                        <div>
                          {user.tenantContext.permissions.slice(0, 5).map((perm, index) => (
                            <span key={index} className="badge bg-secondary me-1 mb-1">{perm}</span>
                          ))}
                          {user.tenantContext.permissions.length > 5 && (
                            <span className="badge bg-dark">+{user.tenantContext.permissions.length - 5} mais</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              ) : (
                <div className="alert alert-warning">
                  <i className="bi bi-exclamation-triangle me-2"></i>
                  Contexto do tenant não carregado
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="row mt-4">
        <div className="col">
          <div className="card">
            <div className="card-header">
              <h5>Ações Disponíveis</h5>
            </div>
            <div className="card-body">
              <div className="d-grid gap-2 d-md-flex">
                <a href="/api/debug/user-session" className="btn btn-outline-info" target="_blank">
                  <i className="bi bi-bug me-2"></i>
                  Ver Sessão Completa
                </a>
                <a href="/api/debug/users" className="btn btn-outline-secondary" target="_blank">
                  <i className="bi bi-people me-2"></i>
                  Ver Todos os Usuários
                </a>
                <a href="/admin" className="btn btn-outline-primary">
                  <i className="bi bi-gear me-2"></i>
                  Ir para Admin Original
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}