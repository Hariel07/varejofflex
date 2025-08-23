"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";

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
  const [mounted, setMounted] = useState(false);

  // Fix hydration error
  useEffect(() => {
    setMounted(true);
  }, []);

  const addLog = (step: string, status: LogEntry['status'], message: string, data?: any) => {
    const logEntry: LogEntry = {
      timestamp: new Date().toLocaleTimeString(),
      step,
      status,
      message,
      data
    };
    // Manter apenas logs no console para debug
    console.log(`[LOGIN-${status.toUpperCase()}] ${step}: ${message}`, data || '');
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

    addLog('LOGIN-START', 'info', `Iniciando processo de login para: ${email}`);

    try {
      // Passo 1: Testar conexão com banco
      addLog('STEP-1', 'info', 'Verificando conectividade...');
      const dbConnected = await testDatabaseConnection();
      
      if (!dbConnected) {
        setErr('Falha na conexão com banco de dados. Verifique o console para mais detalhes.');
        setLoading(false);
        return;
      }

      // Passo 2: Validar se usuário existe
      addLog('STEP-2', 'info', 'Validando credenciais...');
      const user = await validateUserCredentials(email, password);
      
      if (!user) {
        setErr('Email ou senha incorretos.');
        setLoading(false);
        return;
      }

      // Passo 3: Tentar login com NextAuth
      addLog('STEP-3', 'info', 'Tentando autenticação com NextAuth...');
      
      const result = await signIn("credentials", {
        email: email.toLowerCase().trim(),
        password,
        redirect: false,
      });

      addLog('NEXTAUTH-RESULT', 'info', 'Resposta do NextAuth recebida', result);

      if (result?.error) {
        addLog('NEXTAUTH-ERROR', 'error', `Erro do NextAuth: ${result.error}`);
        setErr(`Falha na autenticação: ${result.error}`);
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
              
              // Fallback: forçar redirecionamento se router falhar
              setTimeout(() => {
                window.location.href = destination;
              }, 2000);
            }, 1000);
            
          } else {
            addLog('SESSION-ERROR', 'error', 'Sessão não foi criada corretamente');
            setErr('Sessão não foi estabelecida. Tente novamente.');
            setLoading(false);
          }
          
        } catch (sessionError) {
          addLog('SESSION-ERROR', 'error', `Erro ao verificar sessão: ${sessionError}`);
          setErr('Erro ao verificar sessão. Tente novamente.');
          setLoading(false);
        }
        
      } else {
        addLog('NEXTAUTH-UNKNOWN', 'warning', 'Resposta inesperada do NextAuth');
        setErr('Resposta inesperada do sistema de autenticação.');
        setLoading(false);
      }

    } catch (error) {
      addLog('CRITICAL-ERROR', 'error', `Erro crítico: ${error}`);
      setErr(`Erro crítico durante login: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
      setLoading(false);
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #F8FAFC 0%, #E2E8F0 100%)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background decorativo */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'radial-gradient(circle at 30% 20%, rgba(59, 130, 246, 0.1) 0%, transparent 50%), radial-gradient(circle at 70% 80%, rgba(16, 185, 129, 0.1) 0%, transparent 50%)',
        pointerEvents: 'none'
      }}></div>

      <div className="container-fluid">
        <div className="row min-vh-100 align-items-center justify-content-center">
          <div className="col-11 col-sm-10 col-md-8 col-lg-6 col-xl-5 col-xxl-4">
            <div style={{
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(20px)',
              borderRadius: '24px',
              border: '2px solid rgba(59, 130, 246, 0.3)',
              boxShadow: '0 20px 60px rgba(59, 130, 246, 0.15)',
              padding: '0',
              overflow: 'hidden',
              position: 'relative'
            }}>
              {/* Header do Card */}
              <div style={{
                background: 'linear-gradient(135deg, #3B82F6 0%, #06B6D4 100%)',
                color: 'white',
                textAlign: 'center',
                padding: '2rem 2rem 1.5rem 2rem'
              }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔐</div>
                <h1 style={{
                  fontSize: '1.75rem',
                  fontWeight: '700',
                  marginBottom: '0.5rem'
                }}>
                  Bem-vindo de volta!
                </h1>
                <p style={{
                  fontSize: '1rem',
                  opacity: 0.9,
                  marginBottom: 0
                }}>
                  Entre na sua conta VarejoFlex
                </p>
              </div>

              {/* Conteúdo do Card */}
              <div style={{ padding: '2rem' }}>
                {/* Botão Voltar */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <Link 
                    href="/"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      color: '#64748B',
                      textDecoration: 'none',
                      fontSize: '0.9rem',
                      fontWeight: '500',
                      transition: 'all 0.3s ease',
                      padding: '0.5rem 1rem',
                      borderRadius: '10px',
                      border: '1px solid rgba(100, 116, 139, 0.2)',
                      background: 'rgba(100, 116, 139, 0.05)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(59, 130, 246, 0.1)';
                      e.currentTarget.style.color = '#3B82F6';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(100, 116, 139, 0.05)';
                      e.currentTarget.style.color = '#64748B';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    <i className="bi bi-arrow-left me-2"></i>
                    Voltar à página inicial
                  </Link>
                </div>

                {err && (
                  <div style={{
                    background: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    borderRadius: '12px',
                    padding: '1rem',
                    marginBottom: '1.5rem',
                    color: '#DC2626'
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      marginBottom: '0.5rem'
                    }}>
                      <i className="bi bi-exclamation-triangle me-2"></i>
                      <strong>Erro no Login</strong>
                    </div>
                    {err}
                  </div>
                )}
                
                <form onSubmit={onSubmit}>
                  <div style={{ marginBottom: '1.5rem' }}>
                    <label 
                      htmlFor="email-field" 
                      style={{
                        display: 'block',
                        marginBottom: '0.5rem',
                        color: '#1E293B',
                        fontWeight: '600',
                        fontSize: '0.95rem'
                      }}
                    >
                      E-mail
                    </label>
                    <input
                      id="email-field"
                      name="email"
                      type="email"
                      autoComplete="username"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={loading}
                      style={{
                        width: '100%',
                        padding: '0.875rem 1rem',
                        border: '2px solid rgba(59, 130, 246, 0.2)',
                        borderRadius: '12px',
                        fontSize: '1rem',
                        backgroundColor: 'rgba(255, 255, 255, 0.8)',
                        backdropFilter: 'blur(10px)',
                        transition: 'all 0.3s ease',
                        outline: 'none'
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#3B82F6';
                        e.target.style.boxShadow = '0 0 0 0.25rem rgba(59, 130, 246, 0.25)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = 'rgba(59, 130, 246, 0.2)';
                        e.target.style.boxShadow = 'none';
                      }}
                    />
                  </div>

                  <div style={{ marginBottom: '2rem' }}>
                    <label 
                      htmlFor="password-field" 
                      style={{
                        display: 'block',
                        marginBottom: '0.5rem',
                        color: '#1E293B',
                        fontWeight: '600',
                        fontSize: '0.95rem'
                      }}
                    >
                      Senha
                    </label>
                    <input
                      id="password-field"
                      name="password"
                      type="password"
                      autoComplete="current-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      disabled={loading}
                      style={{
                        width: '100%',
                        padding: '0.875rem 1rem',
                        border: '2px solid rgba(59, 130, 246, 0.2)',
                        borderRadius: '12px',
                        fontSize: '1rem',
                        backgroundColor: 'rgba(255, 255, 255, 0.8)',
                        backdropFilter: 'blur(10px)',
                        transition: 'all 0.3s ease',
                        outline: 'none'
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#3B82F6';
                        e.target.style.boxShadow = '0 0 0 0.25rem rgba(59, 130, 246, 0.25)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = 'rgba(59, 130, 246, 0.2)';
                        e.target.style.boxShadow = 'none';
                      }}
                    />
                  </div>
                  
                  <button 
                    type="submit" 
                    disabled={loading}
                    style={{
                      width: '100%',
                      background: loading ? '#9CA3AF' : 'linear-gradient(135deg, #3B82F6 0%, #06B6D4 100%)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '15px',
                      padding: '0.875rem 1.5rem',
                      fontSize: '1.1rem',
                      fontWeight: '700',
                      cursor: loading ? 'not-allowed' : 'pointer',
                      boxShadow: loading ? 'none' : '0 8px 25px rgba(59, 130, 246, 0.3)',
                      transition: 'all 0.3s ease',
                      marginBottom: '1.5rem'
                    }}
                    onMouseEnter={(e) => {
                      if (!loading) {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 12px 30px rgba(59, 130, 246, 0.4)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!loading) {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 8px 25px rgba(59, 130, 246, 0.3)';
                      }
                    }}
                  >
                    {loading ? (
                      <>
                        <span style={{
                          display: 'inline-block',
                          width: '1rem',
                          height: '1rem',
                          border: '2px solid rgba(255, 255, 255, 0.3)',
                          borderTop: '2px solid white',
                          borderRadius: '50%',
                          animation: 'spin 1s linear infinite',
                          marginRight: '0.5rem'
                        }}></span>
                        Entrando...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-box-arrow-in-right me-2"></i>
                        Entrar
                      </>
                    )}
                  </button>
                </form>
                
                <div style={{
                  textAlign: 'center',
                  padding: '1rem 0',
                  borderTop: '1px solid rgba(203, 213, 225, 0.3)',
                  marginTop: '1rem'
                }}>
                  <p style={{
                    color: '#64748B',
                    marginBottom: '1rem',
                    fontSize: '0.95rem'
                  }}>
                    Ainda não tem uma conta?
                  </p>
                  <Link 
                    href="/register"
                    style={{
                      color: '#3B82F6',
                      textDecoration: 'none',
                      fontWeight: '600',
                      fontSize: '1rem',
                      transition: 'color 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = '#06B6D4';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = '#3B82F6';
                    }}
                  >
                    Criar conta gratuita →
                  </Link>
                  
                  <div style={{ marginTop: '1rem' }}>
                    <Link 
                      href="/forgot-password"
                      style={{
                        color: '#64748B',
                        textDecoration: 'none',
                        fontSize: '0.9rem',
                        transition: 'color 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = '#3B82F6';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = '#64748B';
                      }}
                    >
                      Esqueceu sua senha?
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Info de Debug */}
            <div style={{
              textAlign: 'center',
              marginTop: '1.5rem',
              fontSize: '0.8rem',
              color: '#64748B'
            }}>
              <i className="bi bi-info-circle me-1"></i>
              Logs de debug disponíveis no console do navegador (F12)
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @media (max-width: 576px) {
          .container-fluid .row .col-11 {
            padding-left: 1rem;
            padding-right: 1rem;
          }
        }
      `}</style>
    </div>
  );
}
