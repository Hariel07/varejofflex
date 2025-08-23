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
      background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 30%, #334155 60%, #475569 100%)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background decorativo animado */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: `
          radial-gradient(circle at 25% 25%, rgba(59, 130, 246, 0.15) 0%, transparent 50%),
          radial-gradient(circle at 75% 75%, rgba(16, 185, 129, 0.15) 0%, transparent 50%),
          radial-gradient(circle at 50% 0%, rgba(147, 51, 234, 0.1) 0%, transparent 50%)
        `,
        pointerEvents: 'none'
      }}></div>
      
      {/* Padrão geométrico sutil */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundImage: `
          linear-gradient(45deg, rgba(255, 255, 255, 0.02) 25%, transparent 25%),
          linear-gradient(-45deg, rgba(255, 255, 255, 0.02) 25%, transparent 25%),
          linear-gradient(45deg, transparent 75%, rgba(255, 255, 255, 0.02) 75%),
          linear-gradient(-45deg, transparent 75%, rgba(255, 255, 255, 0.02) 75%)
        `,
        backgroundSize: '60px 60px',
        backgroundPosition: '0 0, 0 30px, 30px -30px, -30px 0px',
        pointerEvents: 'none'
      }}></div>

      <div className="container-fluid">
        <div className="row min-vh-100 align-items-center justify-content-center">
          <div className="col-11 col-sm-10 col-md-8 col-lg-6 col-xl-5 col-xxl-4">
            <div style={{
              background: 'rgba(255, 255, 255, 0.98)',
              backdropFilter: 'blur(25px)',
              borderRadius: '28px',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              boxShadow: `
                0 25px 80px rgba(0, 0, 0, 0.3),
                0 0 0 1px rgba(255, 255, 255, 0.1),
                inset 0 1px 0 rgba(255, 255, 255, 0.4)
              `,
              padding: '0',
              overflow: 'hidden',
              position: 'relative',
              transform: 'translateY(0)',
              transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-8px)';
              e.currentTarget.style.boxShadow = `
                0 35px 100px rgba(0, 0, 0, 0.4),
                0 0 0 1px rgba(255, 255, 255, 0.2),
                inset 0 1px 0 rgba(255, 255, 255, 0.5)
              `;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = `
                0 25px 80px rgba(0, 0, 0, 0.3),
                0 0 0 1px rgba(255, 255, 255, 0.1),
                inset 0 1px 0 rgba(255, 255, 255, 0.4)
              `;
            }}
            >
              {/* Header do Card */}
              <div style={{
                background: 'linear-gradient(135deg, #1E293B 0%, #334155 50%, #475569 100%)',
                color: 'white',
                textAlign: 'center',
                padding: '2.5rem 2rem 2rem 2rem',
                position: 'relative',
                overflow: 'hidden'
              }}>
                {/* Padrão decorativo */}
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  background: 'radial-gradient(circle at 20% 30%, rgba(59, 130, 246, 0.2) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(16, 185, 129, 0.2) 0%, transparent 50%)',
                  pointerEvents: 'none'
                }}></div>
                
                <div style={{ position: 'relative', zIndex: 1 }}>
                  <div style={{ 
                    fontSize: '2.5rem', 
                    marginBottom: '1.2rem',
                    filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2))'
                  }}>
                    �
                  </div>
                  <h1 style={{
                    fontSize: '1.8rem',
                    fontWeight: '800',
                    marginBottom: '0.8rem',
                    textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
                  }}>
                    Acesse sua conta
                  </h1>
                  <p style={{
                    fontSize: '1.05rem',
                    opacity: 0.95,
                    marginBottom: 0,
                    fontWeight: '400'
                  }}>
                    Faça login ou cadastre-se no VarejoFlex
                  </p>
                </div>
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
                      color: '#475569',
                      textDecoration: 'none',
                      fontSize: '0.95rem',
                      fontWeight: '600',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      padding: '0.75rem 1.25rem',
                      borderRadius: '14px',
                      border: '1px solid rgba(71, 85, 105, 0.2)',
                      background: 'rgba(248, 250, 252, 0.6)',
                      backdropFilter: 'blur(10px)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(30, 41, 59, 0.05)';
                      e.currentTarget.style.color = '#1E293B';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 6px 20px rgba(71, 85, 105, 0.15)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(248, 250, 252, 0.6)';
                      e.currentTarget.style.color = '#475569';
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
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
                        padding: '1rem 1.25rem',
                        border: '2px solid rgba(30, 41, 59, 0.15)',
                        borderRadius: '16px',
                        fontSize: '1rem',
                        backgroundColor: 'rgba(248, 250, 252, 0.8)',
                        backdropFilter: 'blur(10px)',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        outline: 'none',
                        boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.05)'
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#1E293B';
                        e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
                        e.target.style.boxShadow = '0 0 0 0.25rem rgba(30, 41, 59, 0.15), inset 0 2px 4px rgba(0, 0, 0, 0.05)';
                        e.target.style.transform = 'translateY(-1px)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = 'rgba(30, 41, 59, 0.15)';
                        e.target.style.backgroundColor = 'rgba(248, 250, 252, 0.8)';
                        e.target.style.boxShadow = 'inset 0 2px 4px rgba(0, 0, 0, 0.05)';
                        e.target.style.transform = 'translateY(0)';
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
                        padding: '1rem 1.25rem',
                        border: '2px solid rgba(30, 41, 59, 0.15)',
                        borderRadius: '16px',
                        fontSize: '1rem',
                        backgroundColor: 'rgba(248, 250, 252, 0.8)',
                        backdropFilter: 'blur(10px)',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        outline: 'none',
                        boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.05)'
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#1E293B';
                        e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
                        e.target.style.boxShadow = '0 0 0 0.25rem rgba(30, 41, 59, 0.15), inset 0 2px 4px rgba(0, 0, 0, 0.05)';
                        e.target.style.transform = 'translateY(-1px)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = 'rgba(30, 41, 59, 0.15)';
                        e.target.style.backgroundColor = 'rgba(248, 250, 252, 0.8)';
                        e.target.style.boxShadow = 'inset 0 2px 4px rgba(0, 0, 0, 0.05)';
                        e.target.style.transform = 'translateY(0)';
                      }}
                    />
                  </div>
                  
                  <button 
                    type="submit" 
                    disabled={loading}
                    style={{
                      width: '100%',
                      background: loading ? 
                        'linear-gradient(135deg, #9CA3AF 0%, #6B7280 100%)' : 
                        'linear-gradient(135deg, #1E293B 0%, #334155 50%, #475569 100%)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '18px',
                      padding: '1rem 1.5rem',
                      fontSize: '1.1rem',
                      fontWeight: '700',
                      cursor: loading ? 'not-allowed' : 'pointer',
                      boxShadow: loading ? 
                        'none' : 
                        '0 12px 30px rgba(30, 41, 59, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                      marginBottom: '1.5rem',
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                    onMouseEnter={(e) => {
                      if (!loading) {
                        e.currentTarget.style.transform = 'translateY(-3px)';
                        e.currentTarget.style.boxShadow = '0 16px 40px rgba(30, 41, 59, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.15)';
                        e.currentTarget.style.background = 'linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #334155 100%)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!loading) {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 12px 30px rgba(30, 41, 59, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)';
                        e.currentTarget.style.background = 'linear-gradient(135deg, #1E293B 0%, #334155 50%, #475569 100%)';
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
                      color: '#1E293B',
                      textDecoration: 'none',
                      fontWeight: '700',
                      fontSize: '1rem',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      padding: '0.75rem 1.5rem',
                      borderRadius: '12px',
                      background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.08) 0%, rgba(51, 65, 85, 0.05) 100%)',
                      border: '1px solid rgba(30, 41, 59, 0.15)',
                      display: 'inline-block'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'linear-gradient(135deg, rgba(30, 41, 59, 0.15) 0%, rgba(51, 65, 85, 0.1) 100%)';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 8px 20px rgba(30, 41, 59, 0.2)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'linear-gradient(135deg, rgba(30, 41, 59, 0.08) 0%, rgba(51, 65, 85, 0.05) 100%)';
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    ✨ Criar conta gratuita
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
