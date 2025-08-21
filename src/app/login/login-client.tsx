"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";

interface LogEntry {
  timestamp: string;
  step: string;
  status: 'info' | 'success' | 'error' | 'warning';
  message: string;
  data?: any;
}

export default function LoginClient() {
  const router = useRouter();
  const search = useSearchParams();
  const callbackUrl = search?.get("callbackUrl") || "/admin";
  const errorQuery = search?.get("error");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(
    errorQuery ? "Sessão expirada ou credenciais inválidas." : null
  );
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [showDiagnostics, setShowDiagnostics] = useState(false);

  const addLog = (step: string, status: LogEntry['status'], message: string, data?: any) => {
    const logEntry: LogEntry = {
      timestamp: new Date().toLocaleTimeString(),
      step,
      status,
      message,
      data
    };
    setLogs(prev => [...prev, logEntry]);
    console.log(`[LOGIN-DIAG] ${step}: ${message}`, data || '');
  };

  const testDatabaseConnection = async () => {
    try {
      addLog('DB-TEST', 'info', 'Testando conexão com banco de dados...');
      const response = await fetch('/api/debug/users');
      const data = await response.json();
      
      if (response.ok) {
        addLog('DB-TEST', 'success', `Banco conectado! ${data.users?.length || 0} usuários encontrados`);
        return true;
      } else {
        addLog('DB-TEST', 'error', `Falha na conexão: ${data.error}`);
        return false;
      }
    } catch (error) {
      addLog('DB-TEST', 'error', `Erro ao testar banco: ${error}`);
      return false;
    }
  };

  const validateUserCredentials = async (email: string, password: string) => {
    try {
      addLog('USER-VALIDATION', 'info', `Validando usuário: ${email}`);
      
      // Primeiro verificar se o usuário existe
      const usersResponse = await fetch('/api/debug/users');
      const usersData = await usersResponse.json();
      
      if (usersData.users) {
        const user = usersData.users.find((u: any) => u.email.toLowerCase() === email.toLowerCase());
        
        if (user) {
          addLog('USER-VALIDATION', 'success', `Usuário encontrado`, {
            id: user._id,
            role: user.role,
            userType: user.userType,
            isActive: user.isActive
          });
          
          if (!user.isActive) {
            addLog('USER-VALIDATION', 'error', 'Usuário está inativo');
            return false;
          }
          
          return user;
        } else {
          addLog('USER-VALIDATION', 'error', 'Usuário não encontrado no banco de dados');
          return false;
        }
      }
      
      return false;
    } catch (error) {
      addLog('USER-VALIDATION', 'error', `Erro na validação: ${error}`);
      return false;
    }
  };

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    setLogs([]);
    setShowDiagnostics(true);

    addLog('LOGIN-START', 'info', `Iniciando processo de login para: ${email}`);

    try {
      // Passo 1: Testar conexão com banco
      addLog('STEP-1', 'info', 'Verificando conectividade...');
      const dbConnected = await testDatabaseConnection();
      
      if (!dbConnected) {
        setErr('❌ Falha na conexão com banco de dados. Verifique os logs abaixo.');
        setLoading(false);
        return;
      }

      // Passo 2: Validar se usuário existe
      addLog('STEP-2', 'info', 'Validando credenciais...');
      const user = await validateUserCredentials(email, password);
      
      if (!user) {
        setErr('❌ Credenciais inválidas ou usuário não encontrado. Verifique os logs abaixo.');
        setLoading(false);
        return;
      }

      // Passo 3: Tentar login com NextAuth
      addLog('STEP-3', 'info', 'Tentando autenticação com NextAuth...');
      
      const result = await signIn("credentials", {
        email: email.toLowerCase().trim(),
        password,
        redirect: false, // Mudando para false para controlar o fluxo
      });

      addLog('NEXTAUTH-RESULT', 'info', 'Resposta do NextAuth recebida', result);

      if (result?.error) {
        addLog('NEXTAUTH-ERROR', 'error', `Erro do NextAuth: ${result.error}`);
        setErr(`❌ Falha na autenticação: ${result.error}`);
        setLoading(false);
        return;
      }

      if (result?.ok) {
        addLog('NEXTAUTH-SUCCESS', 'success', 'Autenticação bem-sucedida!');
        
        // Passo 4: Verificar sessão criada
        addLog('STEP-4', 'info', 'Verificando sessão criada...');
        
        // Aguardar um pouco para a sessão ser estabelecida
        await new Promise(resolve => setTimeout(resolve, 500));
        
        try {
          const sessionResponse = await fetch('/api/auth/session');
          const sessionData = await sessionResponse.json();
          
          addLog('SESSION-CHECK', 'info', 'Dados da sessão', sessionData);
          
          if (sessionData?.user) {
            const userType = sessionData.user.userType || sessionData.user.role;
            addLog('USER-TYPE', 'success', `Tipo de usuário: ${userType}`);
            
            // Decidir redirecionamento
            let destination = '/dashboard';
            if (userType === 'owner_saas') {
              destination = '/dashboard/owner';
            } else if (userType === 'lojista') {
              destination = '/dashboard/lojista';
            }
            
            addLog('REDIRECT', 'success', `Redirecionando para: ${destination}`);
            
            // Aguardar um pouco mais e redirecionar
            setTimeout(() => {
              router.push(destination);
            }, 1000);
            
          } else {
            addLog('SESSION-ERROR', 'error', 'Sessão não foi criada corretamente');
            setErr('❌ Sessão não foi estabelecida. Tente novamente.');
            setLoading(false);
          }
          
        } catch (sessionError) {
          addLog('SESSION-ERROR', 'error', `Erro ao verificar sessão: ${sessionError}`);
          setErr('❌ Erro ao verificar sessão. Tente novamente.');
          setLoading(false);
        }
        
      } else {
        addLog('NEXTAUTH-UNKNOWN', 'warning', 'Resposta inesperada do NextAuth');
        setErr('❌ Resposta inesperada do sistema de autenticação.');
        setLoading(false);
      }

    } catch (error) {
      addLog('CRITICAL-ERROR', 'error', `Erro crítico: ${error}`);
      setErr(`❌ Erro crítico durante login: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
      setLoading(false);
    }
  }

  const getStatusColor = (status: LogEntry['status']) => {
    switch (status) {
      case 'success': return 'text-success';
      case 'error': return 'text-danger';
      case 'warning': return 'text-warning';
      default: return 'text-info';
    }
  };

  const getStatusIcon = (status: LogEntry['status']) => {
    switch (status) {
      case 'success': return '✅';
      case 'error': return '❌';
      case 'warning': return '⚠️';
      default: return 'ℹ️';
    }
  };

  return (
    <main className="container py-4">
      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-6">
          <div className="card shadow">
            <div className="card-body">
              <h1 className="h4 mb-3 text-center">Entrar no VarejoFlex</h1>
              <small className="text-muted mb-3 d-block text-center">
                Versão: 5.0 - Diagnóstico Completo - {new Date().toLocaleString()}
              </small>
              
              {err && (
                <div className="alert alert-danger">
                  <h6>❌ Erro no Login</h6>
                  {err}
                </div>
              )}
              
              <form onSubmit={onSubmit}>
                <div className="mb-3">
                  <label className="form-label">E-mail</label>
                  <input
                    className="form-control"
                    type="email"
                    autoComplete="username"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Senha</label>
                  <input
                    className="form-control"
                    type="password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>
                
                <button 
                  type="submit" 
                  className="btn btn-primary w-100 mb-3" 
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                      Processando Login...
                    </>
                  ) : (
                    "🔐 Entrar com Diagnóstico"
                  )}
                </button>
              </form>
              
              {/* Área de Diagnósticos */}
              {showDiagnostics && (
                <div className="mt-4">
                  <div className="card bg-light">
                    <div className="card-header">
                      <h6 className="mb-0">📊 Diagnóstico do Login em Tempo Real</h6>
                    </div>
                    <div className="card-body">
                      {logs.length === 0 ? (
                        <p className="text-muted mb-0">Aguardando logs...</p>
                      ) : (
                        <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                          {logs.map((log, index) => (
                            <div key={index} className="mb-2 p-2 border-bottom">
                              <div className="d-flex justify-content-between align-items-start">
                                <div className="flex-grow-1">
                                  <span className={`fw-bold ${getStatusColor(log.status)}`}>
                                    {getStatusIcon(log.status)} [{log.step}]
                                  </span>
                                  <small className="text-muted ms-2">{log.timestamp}</small>
                                  <div className="mt-1">{log.message}</div>
                                  {log.data && (
                                    <details className="mt-1">
                                      <summary className="text-muted" style={{ fontSize: '0.8rem', cursor: 'pointer' }}>
                                        Ver dados técnicos
                                      </summary>
                                      <pre className="mt-1 p-2 bg-white rounded" style={{ fontSize: '0.7rem', maxHeight: '100px', overflow: 'auto' }}>
                                        {JSON.stringify(log.data, null, 2)}
                                      </pre>
                                    </details>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
              
              <div className="mt-3 text-center">
                <small className="text-muted">
                  Problemas? <a href="/register">Registre-se</a> | 
                  <a href="/api/debug/users" target="_blank" className="ms-2">Ver usuários</a> |
                  <a href="/api/debug/env" target="_blank" className="ms-2">Ver config</a>
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
