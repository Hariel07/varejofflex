"use client";

import { useState } from 'react';
import { useSession } from 'next-auth/react';

export default function InitPlansPage() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const initializePlans = async (force = false) => {
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/plans/initialize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ force }),
      });

      const data = await response.json();
      
      if (data.success) {
        setResult(`✅ Sucesso: ${data.message}`);
      } else {
        setResult(`❌ Erro: ${data.error}`);
      }
    } catch (error) {
      setResult(`❌ Erro: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    } finally {
      setLoading(false);
    }
  };

  const checkPlans = async () => {
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/plans', {
        method: 'GET',
      });

      const data = await response.json();
      
      if (data.success) {
        setResult(`📊 Planos encontrados: ${data.plans?.length || 0}`);
      } else {
        setResult(`❌ Erro ao consultar planos: ${data.error}`);
      }
    } catch (error) {
      setResult(`❌ Erro: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    } finally {
      setLoading(false);
    }
  };

  if (!session) {
    return (
      <div className="container mt-5">
        <div className="alert alert-warning">
          <h4>Acesso Restrito</h4>
          <p>Você precisa estar logado para acessar esta página.</p>
          <a href="/login" className="btn btn-primary">Fazer Login</a>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card">
            <div className="card-header">
              <h2 className="mb-0">
                <i className="bi bi-gear me-2"></i>
                Inicializar Planos do Sistema
              </h2>
            </div>
            <div className="card-body">
              <div className="alert alert-info">
                <h5><i className="bi bi-info-circle me-2"></i>Informações</h5>
                <p><strong>Usuário logado:</strong> {session.user?.email}</p>
                <p><strong>Status:</strong> Esta página permite inicializar os planos padrão do sistema.</p>
              </div>

              <div className="d-grid gap-3">
                <button
                  className="btn btn-primary btn-lg"
                  onClick={checkPlans}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span>
                      Verificando...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-search me-2"></i>
                      Verificar Planos Existentes
                    </>
                  )}
                </button>

                <button
                  className="btn btn-success btn-lg"
                  onClick={() => initializePlans(false)}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span>
                      Inicializando...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-plus-circle me-2"></i>
                      Inicializar Planos (Criar se não existir)
                    </>
                  )}
                </button>

                <button
                  className="btn btn-warning btn-lg"
                  onClick={() => initializePlans(true)}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span>
                      Recriando...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-arrow-clockwise me-2"></i>
                      Recriar Planos (Force - Apaga existentes)
                    </>
                  )}
                </button>
              </div>

              {result && (
                <div className="mt-4">
                  <div className={`alert ${result.includes('✅') ? 'alert-success' : result.includes('📊') ? 'alert-info' : 'alert-danger'}`}>
                    <pre style={{ whiteSpace: 'pre-wrap', margin: 0 }}>{result}</pre>
                  </div>
                </div>
              )}

              <hr className="my-4" />

              <div className="text-center">
                <a href="/dashboard/owner" className="btn btn-outline-primary me-2">
                  <i className="bi bi-arrow-left me-2"></i>
                  Voltar ao Dashboard Owner
                </a>
                <a href="/" className="btn btn-outline-secondary">
                  <i className="bi bi-house me-2"></i>
                  Ir para Homepage
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}