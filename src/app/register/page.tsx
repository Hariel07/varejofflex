"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function RegisterPage() {
  const [showOwnerOption, setShowOwnerOption] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar se ainda é possível cadastrar Owner
    fetch('/api/platform/owner-status')
      .then(res => res.json())
      .then(data => {
        setShowOwnerOption(data.available);
        setLoading(false);
      })
      .catch(() => {
        setShowOwnerOption(false);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div 
        className="min-vh-100 d-flex align-items-center justify-content-center"
        style={{ 
          background: 'linear-gradient(135deg, #F8FAFC 0%, #E2E8F0 100%)',
          position: 'relative'
        }}
      >
        <div className="text-center">
          <div 
            className="spinner-border mb-3" 
            role="status"
            style={{ 
              color: '#3b82f6', 
              width: '3rem', 
              height: '3rem'
            }}
          >
            <span className="visually-hidden">Carregando...</span>
          </div>
          <p style={{ 
            color: '#64748b',
            fontSize: '1.1rem'
          }}>
            Verificando opções de cadastro...
          </p>
        </div>
      </div>
    );
  }
  return (
    <div className="min-vh-100" style={{ 
      background: 'linear-gradient(135deg, #F8FAFC 0%, #E2E8F0 100%)',
      position: 'relative'
    }}>
      {/* Background Pattern */}
      <div 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `
            radial-gradient(circle at 25% 25%, rgba(59, 130, 246, 0.05) 0%, transparent 50%),
            radial-gradient(circle at 75% 75%, rgba(16, 185, 129, 0.05) 0%, transparent 50%),
            radial-gradient(circle at 50% 50%, rgba(147, 51, 234, 0.03) 0%, transparent 50%)
          `,
          zIndex: 1
        }}
      />
      
      <div className="container py-5" style={{ position: 'relative', zIndex: 2 }}>
        <div className="row justify-content-center">
          <div className="col-lg-10">
            {/* Header */}
            <div className="text-center mb-5">
              <Link 
                href="/" 
                className="btn mb-4"
                style={{
                  background: 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(59, 130, 246, 0.2)',
                  color: '#3b82f6',
                  borderRadius: '50px',
                  padding: '12px 24px',
                  fontWeight: '500',
                  transition: 'all 0.3s ease',
                  textDecoration: 'none',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
                }}
              >
                <i className="bi bi-arrow-left me-2"></i>
                Voltar ao Início
              </Link>
              
              <div 
                className="mb-4"
                style={{
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(20px)',
                  borderRadius: '24px',
                  padding: '3rem 2rem',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  boxShadow: '0 20px 60px rgba(0, 0, 0, 0.1)'
                }}
              >
                <div style={{ 
                  fontSize: '3.5rem', 
                  marginBottom: '1.5rem',
                  filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1))'
                }}>
                  🚀
                </div>
                <h1 
                  className="display-5 fw-bold mb-3"
                  style={{
                    background: 'linear-gradient(135deg, #1e293b 0%, #3b82f6 50%, #8b5cf6 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    fontSize: '2.5rem',
                    fontWeight: '800',
                    marginBottom: '1rem'
                  }}
                >
                  Escolha seu Perfil
                </h1>
                <p className="lead" style={{ 
                  color: '#64748b', 
                  fontSize: '1.3rem',
                  fontWeight: '400',
                  marginBottom: 0
                }}>
                  Selecione a opção que melhor se adequa ao seu negócio
                </p>
              </div>
            </div>

            {/* Cards de Opção */}
            <div className="row g-5 justify-content-center">
              {/* Cadastro Lojista */}
              <div className={`col-md-6 ${!showOwnerOption ? 'col-lg-10' : 'col-lg-6'}`}>
                <div 
                  style={{
                    background: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(30px)',
                    borderRadius: '32px',
                    border: '2px solid transparent',
                    backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.95)), linear-gradient(145deg, rgba(16, 185, 129, 0.4), rgba(6, 182, 212, 0.2))',
                    backgroundOrigin: 'border-box',
                    backgroundClip: 'content-box, border-box',
                    boxShadow: `
                      0 32px 100px rgba(0, 0, 0, 0.15),
                      inset 0 1px 0 rgba(255, 255, 255, 0.8),
                      0 0 0 1px rgba(16, 185, 129, 0.1)
                    `,
                    padding: '0',
                    overflow: 'hidden',
                    transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                    minHeight: '800px',
                    position: 'relative'
                  }}
                  className="h-100"
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-12px) scale(1.02)';
                    e.currentTarget.style.boxShadow = `
                      0 40px 120px rgba(0, 0, 0, 0.2),
                      inset 0 1px 0 rgba(255, 255, 255, 0.9),
                      0 0 0 2px rgba(16, 185, 129, 0.3),
                      0 0 50px rgba(16, 185, 129, 0.3)
                    `;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0) scale(1)';
                    e.currentTarget.style.boxShadow = `
                      0 32px 100px rgba(0, 0, 0, 0.15),
                      inset 0 1px 0 rgba(255, 255, 255, 0.8),
                      0 0 0 1px rgba(16, 185, 129, 0.1)
                    `;
                  }}
                >
                  {/* Efeito de partículas no background */}
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    background: `
                      radial-gradient(circle at 20% 20%, rgba(16, 185, 129, 0.05) 0%, transparent 30%),
                      radial-gradient(circle at 80% 40%, rgba(6, 182, 212, 0.03) 0%, transparent 30%),
                      radial-gradient(circle at 40% 80%, rgba(16, 185, 129, 0.02) 0%, transparent 30%)
                    `,
                    animation: 'float 6s ease-in-out infinite',
                    pointerEvents: 'none'
                  }}></div>

                  <div 
                    style={{
                      background: 'linear-gradient(135deg, #10b981 0%, #16a085 50%, #059669 100%)',
                      color: 'white',
                      textAlign: 'center',
                      padding: '3rem 2rem 2rem 2rem',
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                  >
                    {/* Efeito ondulado no header */}
                    <div style={{
                      position: 'absolute',
                      bottom: '-2px',
                      left: 0,
                      width: '100%',
                      height: '20px',
                      background: 'rgba(255, 255, 255, 0.1)',
                      clipPath: 'polygon(0 0, 100% 0, 100% 50%, 0 100%)'
                    }}></div>
                    
                    <div style={{ position: 'relative', zIndex: 1 }}>
                      <div style={{ 
                        fontSize: '4rem', 
                        marginBottom: '1.2rem',
                        filter: 'drop-shadow(0 6px 12px rgba(0, 0, 0, 0.4))',
                        animation: 'bounce 2s ease-in-out infinite'
                      }}>
                        🏪
                      </div>
                      <h3 style={{ 
                        fontWeight: '900',
                        fontSize: '1.8rem',
                        textShadow: '0 3px 6px rgba(0, 0, 0, 0.4)',
                        marginBottom: '0.5rem'
                      }}>
                        Sou Lojista
                      </h3>
                      <div style={{
                        width: '60px',
                        height: '4px',
                        background: 'linear-gradient(90deg, rgba(255, 255, 255, 0.8), transparent)',
                        margin: '0 auto',
                        borderRadius: '2px'
                      }}></div>
                    </div>
                  </div>
                  <div style={{ 
                    padding: '3rem 2.5rem',
                    background: 'rgba(255, 255, 255, 0.98)',
                    position: 'relative',
                    minHeight: '500px'
                  }}>
                    {/* Badge de destaque */}
                    <div style={{
                      position: 'absolute',
                      top: '-12px',
                      right: '2rem',
                      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                      color: 'white',
                      padding: '8px 16px',
                      borderRadius: '20px',
                      fontSize: '0.8rem',
                      fontWeight: '700',
                      boxShadow: '0 8px 20px rgba(16, 185, 129, 0.4)',
                      border: '2px solid rgba(255, 255, 255, 0.2)'
                    }}>
                      💎 MAIS POPULAR
                    </div>

                    <p style={{ 
                      color: '#2d3748', 
                      marginBottom: '2rem', 
                      fontSize: '1.2rem',
                      fontWeight: '600',
                      lineHeight: '1.7',
                      textAlign: 'center'
                    }}>
                      Transforme seu negócio com nossa plataforma completa de vendas
                    </p>
                    
                    <div className="mb-4">
                      <h6 style={{ 
                        color: '#1a1a1a', 
                        fontWeight: '800', 
                        marginBottom: '1.5rem',
                        fontSize: '1.2rem',
                        textAlign: 'center'
                      }}>
                        ✨ Recursos Premium Inclusos
                      </h6>
                      <div className="row g-3">
                        <div className="col-12">
                          <div style={{
                            background: 'rgba(16, 185, 129, 0.08)',
                            border: '1px solid rgba(16, 185, 129, 0.2)',
                            borderRadius: '16px',
                            padding: '1rem',
                            backdropFilter: 'blur(10px)',
                            transition: 'all 0.3s ease'
                          }}>
                            <div className="d-flex align-items-center">
                              <div style={{
                                width: '48px',
                                height: '48px',
                                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                borderRadius: '12px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginRight: '1rem',
                                fontSize: '1.5rem'
                              }}>
                                💻
                              </div>
                              <div>
                                <h6 style={{ color: '#1a1a1a', fontWeight: '700', marginBottom: '2px' }}>Sistema PDV Avançado</h6>
                                <small style={{ color: '#4a5568' }}>Vendas rápidas e seguras</small>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-12">
                          <div style={{
                            background: 'rgba(6, 182, 212, 0.08)',
                            border: '1px solid rgba(6, 182, 212, 0.2)',
                            borderRadius: '16px',
                            padding: '1rem',
                            backdropFilter: 'blur(10px)'
                          }}>
                            <div className="d-flex align-items-center">
                              <div style={{
                                width: '48px',
                                height: '48px',
                                background: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
                                borderRadius: '12px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginRight: '1rem',
                                fontSize: '1.5rem'
                              }}>
                                📊
                              </div>
                              <div>
                                <h6 style={{ color: '#1a1a1a', fontWeight: '700', marginBottom: '2px' }}>Analytics em Tempo Real</h6>
                                <small style={{ color: '#4a5568' }}>Dashboards inteligentes</small>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-12">
                          <div style={{
                            background: 'rgba(147, 51, 234, 0.08)',
                            border: '1px solid rgba(147, 51, 234, 0.2)',
                            borderRadius: '16px',
                            padding: '1rem',
                            backdropFilter: 'blur(10px)'
                          }}>
                            <div className="d-flex align-items-center">
                              <div style={{
                                width: '48px',
                                height: '48px',
                                background: 'linear-gradient(135deg, #9333ea 0%, #7c3aed 100%)',
                                borderRadius: '12px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginRight: '1rem',
                                fontSize: '1.5rem'
                              }}>
                                🚚
                              </div>
                              <div>
                                <h6 style={{ color: '#1a1a1a', fontWeight: '700', marginBottom: '2px' }}>Delivery Integrado</h6>
                                <small style={{ color: '#4a5568' }}>Entrega automática</small>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mb-4">
                      <h6 style={{ 
                        color: '#1a1a1a', 
                        fontWeight: '800', 
                        marginBottom: '1.5rem',
                        fontSize: '1.2rem',
                        textAlign: 'center'
                      }}>
                        🎯 Segmentos Especializados
                      </h6>
                      <div className="d-flex flex-wrap gap-2 justify-content-center">
                        {[
                          { icon: '🍔', label: 'Lanchonetes', color: '#f59e0b' },
                          { icon: '🍕', label: 'Pizzarias', color: '#ef4444' },
                          { icon: '👗', label: 'Moda', color: '#3b82f6' },
                          { icon: '🛒', label: 'Mercados', color: '#10b981' },
                          { icon: '🐕', label: 'Petshops', color: '#f59e0b' },
                          { icon: '💅', label: 'Salões', color: '#ef4444' },
                          { icon: '💊', label: 'Farmácias', color: '#0ea5e9' },
                          { icon: '🏪', label: 'Conveniência', color: '#6b7280' }
                        ].map((segment, index) => (
                          <span 
                            key={index}
                            style={{
                              background: `linear-gradient(135deg, ${segment.color}15, ${segment.color}08)`,
                              color: segment.color,
                              border: `1px solid ${segment.color}30`,
                              borderRadius: '20px',
                              padding: '8px 16px',
                              fontSize: '0.85rem',
                              fontWeight: '700',
                              backdropFilter: 'blur(10px)',
                              transition: 'all 0.3s ease',
                              cursor: 'default',
                              boxShadow: `0 4px 12px ${segment.color}15`
                            }}
                          >
                            {segment.icon} {segment.label}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <div 
                        style={{
                          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(6, 182, 212, 0.05))',
                          border: '1px solid rgba(16, 185, 129, 0.2)',
                          borderRadius: '20px',
                          padding: '1.5rem',
                          marginBottom: '2rem',
                          backdropFilter: 'blur(15px)',
                          textAlign: 'center'
                        }}
                      >
                        <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🎁</div>
                        <h6 style={{ color: '#1a1a1a', fontWeight: '800', marginBottom: '0.5rem' }}>
                          OFERTA ESPECIAL
                        </h6>
                        <p style={{ color: '#4a5568', margin: 0, fontWeight: '600' }}>
                          <strong style={{ color: '#10b981' }}>14 dias grátis</strong> + Setup gratuito + Suporte premium
                        </p>
                      </div>
                      
                      <div className="d-grid">
                        <Link 
                          href="/register/lojista" 
                          style={{
                            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                            border: 'none',
                            borderRadius: '20px',
                            padding: '1.2rem 2rem',
                            color: 'white',
                            fontWeight: '800',
                            fontSize: '1.2rem',
                            textDecoration: 'none',
                            display: 'block',
                            textAlign: 'center',
                            boxShadow: '0 16px 40px rgba(16, 185, 129, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
                            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                            position: 'relative',
                            overflow: 'hidden'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-4px) scale(1.02)';
                            e.currentTarget.style.boxShadow = '0 20px 50px rgba(16, 185, 129, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.3)';
                            e.currentTarget.style.background = 'linear-gradient(135deg, #059669 0%, #047857 100%)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0) scale(1)';
                            e.currentTarget.style.boxShadow = '0 16px 40px rgba(16, 185, 129, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)';
                            e.currentTarget.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
                          }}
                        >
                          <i className="bi bi-rocket-takeoff me-2"></i>
                          Começar Agora - É Grátis!
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Cadastro Owner SaaS - Só mostra se disponível */}
              {showOwnerOption && (
              <div className="col-md-6">
                <div 
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    backdropFilter: 'blur(25px)',
                    borderRadius: '28px',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    boxShadow: `
                      0 25px 80px rgba(0, 0, 0, 0.3),
                      0 0 0 1px rgba(239, 68, 68, 0.1),
                      inset 0 1px 0 rgba(255, 255, 255, 0.1)
                    `,
                    padding: '0',
                    overflow: 'hidden',
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    height: '100%'
                  }}
                  className="h-100"
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-8px)';
                    e.currentTarget.style.boxShadow = `
                      0 35px 100px rgba(0, 0, 0, 0.4),
                      0 0 0 1px rgba(239, 68, 68, 0.2),
                      inset 0 1px 0 rgba(255, 255, 255, 0.15)
                    `;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = `
                      0 25px 80px rgba(0, 0, 0, 0.3),
                      0 0 0 1px rgba(239, 68, 68, 0.1),
                      inset 0 1px 0 rgba(255, 255, 255, 0.1)
                    `;
                  }}
                >
                  <div 
                    style={{
                      background: 'linear-gradient(135deg, #1E293B 0%, #ef4444 50%, #dc2626 100%)',
                      color: 'white',
                      textAlign: 'center',
                      padding: '2.5rem 2rem',
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                  >
                    {/* Padrão decorativo */}
                    <div style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      background: 'radial-gradient(circle at 20% 30%, rgba(255, 255, 255, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(255, 255, 255, 0.05) 0%, transparent 50%)',
                      pointerEvents: 'none'
                    }}></div>
                    
                    <div style={{ position: 'relative', zIndex: 1 }}>
                      <div style={{ 
                        fontSize: '3.5rem', 
                        marginBottom: '1rem',
                        filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3))'
                      }}>
                        🔐
                      </div>
                      <h4 className="mb-0" style={{ 
                        fontWeight: '800',
                        fontSize: '1.6rem',
                        textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
                      }}>
                        Owner SaaS
                      </h4>
                    </div>
                  </div>
                  <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', minHeight: 'calc(100% - 140px)' }}>
                    <p style={{ 
                      color: 'rgba(255, 255, 255, 0.9)', 
                      marginBottom: '1.5rem', 
                      fontSize: '1.1rem',
                      fontWeight: '500',
                      lineHeight: '1.6'
                    }}>
                      Acesso administrativo completo à plataforma VarejoFlex
                    </p>
                    
                    <div className="mb-4">
                      <h6 style={{ 
                        color: 'white', 
                        fontWeight: '700', 
                        marginBottom: '1rem',
                        fontSize: '1.1rem'
                      }}>
                        ⚡ Permissões Especiais:
                      </h6>
                      <ul className="list-unstyled">
                        <li className="mb-2">
                          <i className="bi bi-check-circle me-2" style={{ color: '#ef4444', fontSize: '1.1rem' }}></i>
                          <span style={{ color: 'rgba(255, 255, 255, 0.8)', fontWeight: '500' }}>Dashboard administrativo global</span>
                        </li>
                        <li className="mb-2">
                          <i className="bi bi-check-circle me-2" style={{ color: '#ef4444', fontSize: '1.1rem' }}></i>
                          <span style={{ color: 'rgba(255, 255, 255, 0.8)', fontWeight: '500' }}>Gestão de todos os lojistas</span>
                        </li>
                        <li className="mb-2">
                          <i className="bi bi-check-circle me-2" style={{ color: '#ef4444', fontSize: '1.1rem' }}></i>
                          <span style={{ color: 'rgba(255, 255, 255, 0.8)', fontWeight: '500' }}>Controle de planos e faturamento</span>
                        </li>
                        <li className="mb-2">
                          <i className="bi bi-check-circle me-2" style={{ color: '#ef4444', fontSize: '1.1rem' }}></i>
                          <span style={{ color: 'rgba(255, 255, 255, 0.8)', fontWeight: '500' }}>Métricas da plataforma</span>
                        </li>
                        <li className="mb-2">
                          <i className="bi bi-check-circle me-2" style={{ color: '#ef4444', fontSize: '1.1rem' }}></i>
                          <span style={{ color: 'rgba(255, 255, 255, 0.8)', fontWeight: '500' }}>Configurações avançadas</span>
                        </li>
                      </ul>
                    </div>

                    <div 
                      style={{
                        background: 'rgba(251, 191, 36, 0.15)',
                        border: '1px solid rgba(251, 191, 36, 0.3)',
                        borderRadius: '16px',
                        padding: '1rem',
                        marginBottom: '1.5rem',
                        backdropFilter: 'blur(10px)'
                      }}
                    >
                      <div className="d-flex">
                        <i className="bi bi-shield-exclamation me-2" style={{ color: '#fbbf24', fontSize: '1.2rem' }}></i>
                        <div>
                          <h6 style={{ color: 'white', fontWeight: '700', marginBottom: '4px', fontSize: '1rem' }}>⚠️ Acesso Restrito</h6>
                          <small style={{ color: 'rgba(255, 255, 255, 0.8)', fontWeight: '500' }}>
                            Este cadastro é exclusivo para o proprietário da plataforma.
                            É necessária uma chave secreta válida.
                          </small>
                        </div>
                      </div>
                    </div>

                    <div style={{ marginTop: 'auto' }}>
                      <div className="d-grid">
                        <Link 
                          href="/register/owner" 
                          style={{
                            background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                            border: 'none',
                            borderRadius: '18px',
                            padding: '1rem 1.5rem',
                            color: 'white',
                            fontWeight: '700',
                            fontSize: '1.1rem',
                            textDecoration: 'none',
                            display: 'block',
                            textAlign: 'center',
                            boxShadow: '0 12px 30px rgba(239, 68, 68, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-3px)';
                            e.currentTarget.style.boxShadow = '0 16px 40px rgba(239, 68, 68, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.15)';
                            e.currentTarget.style.background = 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = '0 12px 30px rgba(239, 68, 68, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)';
                            e.currentTarget.style.background = 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)';
                          }}
                        >
                          <i className="bi bi-shield-lock me-2"></i>
                          Acesso Owner SaaS
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              )}
            </div>

            {/* Footer Info */}
            <div className="text-center mt-5">
              <div 
                style={{
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(25px)',
                  borderRadius: '24px',
                  border: '1px solid rgba(16, 185, 129, 0.1)',
                  boxShadow: '0 25px 80px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.8)',
                  padding: '2.5rem'
                }}
              >
                <p style={{ 
                  color: '#4a5568', 
                  marginBottom: '1.5rem',
                  fontSize: '1.1rem',
                  fontWeight: '500'
                }}>
                  Já possui uma conta? 
                  <Link 
                    href="/login" 
                    style={{ 
                      textDecoration: 'none', 
                      marginLeft: '8px', 
                      fontWeight: '700',
                      color: '#10b981',
                      transition: 'color 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = '#059669';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = '#10b981';
                    }}
                  >
                    Fazer Login
                  </Link>
                </p>
                
                <div 
                  style={{
                    marginTop: '1.5rem',
                    paddingTop: '1.5rem',
                    borderTop: '1px solid rgba(16, 185, 129, 0.1)'
                  }}
                >
                  <small style={{ 
                    color: '#4a5568',
                    fontSize: '0.95rem',
                    fontWeight: '500'
                  }}>
                    <span style={{ color: '#10b981', marginRight: '8px' }}>🔒</span>
                    Seus dados estão seguros e protegidos com criptografia avançada
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-10px) rotate(1deg); }
          66% { transform: translateY(5px) rotate(-1deg); }
        }
        
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 20px rgba(16, 185, 129, 0.3); }
          50% { box-shadow: 0 0 30px rgba(16, 185, 129, 0.6); }
        }
      `}</style>
    </div>
  );
}
