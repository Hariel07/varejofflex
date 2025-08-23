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
          background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 30%, #334155 60%, #475569 100%)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Background decorativo */}
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
        
        <div className="text-center" style={{ position: 'relative', zIndex: 2 }}>
          <div 
            className="spinner-border mb-3" 
            role="status"
            style={{ 
              color: 'rgba(255, 255, 255, 0.8)', 
              width: '3rem', 
              height: '3rem',
              borderWidth: '3px'
            }}
          >
            <span className="visually-hidden">Carregando...</span>
          </div>
          <p style={{ 
            color: 'rgba(255, 255, 255, 0.7)',
            fontSize: '1.1rem',
            fontWeight: '500'
          }}>
            Verificando opções de cadastro...
          </p>
        </div>
      </div>
    );
  }
  return (
    <div className="min-vh-100" style={{ 
      background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 30%, #334155 60%, #475569 100%)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background decorativo animado */}
      <div 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            radial-gradient(circle at 25% 25%, rgba(59, 130, 246, 0.15) 0%, transparent 50%),
            radial-gradient(circle at 75% 75%, rgba(16, 185, 129, 0.15) 0%, transparent 50%),
            radial-gradient(circle at 50% 0%, rgba(147, 51, 234, 0.1) 0%, transparent 50%)
          `,
          zIndex: 1
        }}
      />
      
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
      
      <div className="container py-5" style={{ position: 'relative', zIndex: 2 }}>
        <div className="row justify-content-center">
          <div className="col-lg-10">
            {/* Header */}
            <div className="text-center mb-5">
              <Link 
                href="/" 
                className="btn mb-4"
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  color: 'rgba(255, 255, 255, 0.9)',
                  borderRadius: '16px',
                  padding: '12px 24px',
                  fontWeight: '600',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  textDecoration: 'none',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                  display: 'inline-flex',
                  alignItems: 'center'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 12px 40px rgba(0, 0, 0, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.3)';
                }}
              >
                <i className="bi bi-arrow-left me-2"></i>
                Voltar ao Início
              </Link>
              
              <div 
                className="mb-4"
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(25px)',
                  borderRadius: '28px',
                  padding: '3rem 2rem',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  boxShadow: '0 25px 80px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                }}
              >
                <div style={{ 
                  fontSize: '3.5rem', 
                  marginBottom: '1.5rem',
                  filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3))'
                }}>
                  🚀
                </div>
                <h1 
                  className="display-5 fw-bold mb-3"
                  style={{
                    color: 'white',
                    fontSize: '2.5rem',
                    fontWeight: '800',
                    textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)',
                    marginBottom: '1rem'
                  }}
                >
                  Escolha seu Perfil
                </h1>
                <p className="lead" style={{ 
                  color: 'rgba(255, 255, 255, 0.8)', 
                  fontSize: '1.3rem',
                  fontWeight: '400',
                  marginBottom: 0
                }}>
                  Selecione a opção que melhor se adequa ao seu negócio
                </p>
              </div>
            </div>

            {/* Cards de Opção */}
            <div className="row g-4 justify-content-center">
              {/* Cadastro Lojista */}
              <div className={`col-md-6 ${!showOwnerOption ? 'col-lg-8' : ''}`}>
                <div 
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    backdropFilter: 'blur(25px)',
                    borderRadius: '28px',
                    border: '1px solid rgba(16, 185, 129, 0.3)',
                    boxShadow: `
                      0 25px 80px rgba(0, 0, 0, 0.3),
                      0 0 0 1px rgba(16, 185, 129, 0.1),
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
                      0 0 0 1px rgba(16, 185, 129, 0.2),
                      inset 0 1px 0 rgba(255, 255, 255, 0.15)
                    `;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = `
                      0 25px 80px rgba(0, 0, 0, 0.3),
                      0 0 0 1px rgba(16, 185, 129, 0.1),
                      inset 0 1px 0 rgba(255, 255, 255, 0.1)
                    `;
                  }}
                >
                  <div 
                    style={{
                      background: 'linear-gradient(135deg, #1E293B 0%, #10b981 50%, #059669 100%)',
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
                        🏪
                      </div>
                      <h4 className="mb-0" style={{ 
                        fontWeight: '800',
                        fontSize: '1.6rem',
                        textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
                      }}>
                        Sou Lojista
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
                      Quero vender meus produtos online e gerenciar minha loja
                    </p>
                    
                    <div className="mb-4">
                      <h6 style={{ 
                        color: 'white', 
                        fontWeight: '700', 
                        marginBottom: '1rem',
                        fontSize: '1.1rem'
                      }}>
                        ✨ O que você ganha:
                      </h6>
                      <ul className="list-unstyled">
                        <li className="mb-2">
                          <i className="bi bi-check-circle me-2" style={{ color: '#10b981', fontSize: '1.1rem' }}></i>
                          <span style={{ color: 'rgba(255, 255, 255, 0.8)', fontWeight: '500' }}>Sistema PDV completo</span>
                        </li>
                        <li className="mb-2">
                          <i className="bi bi-check-circle me-2" style={{ color: '#10b981', fontSize: '1.1rem' }}></i>
                          <span style={{ color: 'rgba(255, 255, 255, 0.8)', fontWeight: '500' }}>Gestão de produtos e estoque</span>
                        </li>
                        <li className="mb-2">
                          <i className="bi bi-check-circle me-2" style={{ color: '#10b981', fontSize: '1.1rem' }}></i>
                          <span style={{ color: 'rgba(255, 255, 255, 0.8)', fontWeight: '500' }}>Relatórios e métricas</span>
                        </li>
                        <li className="mb-2">
                          <i className="bi bi-check-circle me-2" style={{ color: '#10b981', fontSize: '1.1rem' }}></i>
                          <span style={{ color: 'rgba(255, 255, 255, 0.8)', fontWeight: '500' }}>Integração com delivery</span>
                        </li>
                        <li className="mb-2">
                          <i className="bi bi-check-circle me-2" style={{ color: '#10b981', fontSize: '1.1rem' }}></i>
                          <span style={{ color: 'rgba(255, 255, 255, 0.8)', fontWeight: '500' }}>Suporte especializado</span>
                        </li>
                      </ul>
                    </div>

                    <div className="mb-4">
                      <h6 style={{ 
                        color: 'white', 
                        fontWeight: '700', 
                        marginBottom: '1rem',
                        fontSize: '1.1rem'
                      }}>
                        🎯 Segmentos Disponíveis:
                      </h6>
                      <div className="row g-2">
                        <div className="col-6">
                          <span 
                            style={{
                              background: 'rgba(251, 191, 36, 0.2)',
                              color: '#fbbf24',
                              border: '1px solid rgba(251, 191, 36, 0.3)',
                              borderRadius: '12px',
                              padding: '6px 12px',
                              fontSize: '0.85rem',
                              fontWeight: '600',
                              display: 'block',
                              textAlign: 'center',
                              backdropFilter: 'blur(10px)'
                            }}
                          >
                            🍔 Lanchonetes
                          </span>
                        </div>
                        <div className="col-6">
                          <span 
                            style={{
                              background: 'rgba(239, 68, 68, 0.2)',
                              color: '#f87171',
                              border: '1px solid rgba(239, 68, 68, 0.3)',
                              borderRadius: '12px',
                              padding: '6px 12px',
                              fontSize: '0.85rem',
                              fontWeight: '600',
                              display: 'block',
                              textAlign: 'center',
                              backdropFilter: 'blur(10px)'
                            }}
                          >
                            🍕 Pizzarias
                          </span>
                        </div>
                        <div className="col-6">
                          <span 
                            style={{
                              background: 'rgba(59, 130, 246, 0.2)',
                              color: '#60a5fa',
                              border: '1px solid rgba(59, 130, 246, 0.3)',
                              borderRadius: '12px',
                              padding: '6px 12px',
                              fontSize: '0.85rem',
                              fontWeight: '600',
                              display: 'block',
                              textAlign: 'center',
                              backdropFilter: 'blur(10px)'
                            }}
                          >
                            👗 Moda
                          </span>
                        </div>
                        <div className="col-6">
                          <span 
                            style={{
                              background: 'rgba(16, 185, 129, 0.2)',
                              color: '#34d399',
                              border: '1px solid rgba(16, 185, 129, 0.3)',
                              borderRadius: '12px',
                              padding: '6px 12px',
                              fontSize: '0.85rem',
                              fontWeight: '600',
                              display: 'block',
                              textAlign: 'center',
                              backdropFilter: 'blur(10px)'
                            }}
                          >
                            🛒 Mercados
                          </span>
                        </div>
                        <div className="col-6">
                          <span 
                            style={{
                              background: 'rgba(251, 191, 36, 0.2)',
                              color: '#fbbf24',
                              border: '1px solid rgba(251, 191, 36, 0.3)',
                              borderRadius: '12px',
                              padding: '6px 12px',
                              fontSize: '0.85rem',
                              fontWeight: '600',
                              display: 'block',
                              textAlign: 'center',
                              backdropFilter: 'blur(10px)'
                            }}
                          >
                            🐕 Petshops
                          </span>
                        </div>
                        <div className="col-6">
                          <span 
                            style={{
                              background: 'rgba(239, 68, 68, 0.2)',
                              color: '#f87171',
                              border: '1px solid rgba(239, 68, 68, 0.3)',
                              borderRadius: '12px',
                              padding: '6px 12px',
                              fontSize: '0.85rem',
                              fontWeight: '600',
                              display: 'block',
                              textAlign: 'center',
                              backdropFilter: 'blur(10px)'
                            }}
                          >
                            💅 Salões
                          </span>
                        </div>
                        <div className="col-6">
                          <span 
                            style={{
                              background: 'rgba(14, 165, 233, 0.2)',
                              color: '#38bdf8',
                              border: '1px solid rgba(14, 165, 233, 0.3)',
                              borderRadius: '12px',
                              padding: '6px 12px',
                              fontSize: '0.85rem',
                              fontWeight: '600',
                              display: 'block',
                              textAlign: 'center',
                              backdropFilter: 'blur(10px)'
                            }}
                          >
                            💊 Farmácias
                          </span>
                        </div>
                        <div className="col-6">
                          <span 
                            style={{
                              background: 'rgba(107, 114, 128, 0.2)',
                              color: '#9ca3af',
                              border: '1px solid rgba(107, 114, 128, 0.3)',
                              borderRadius: '12px',
                              padding: '6px 12px',
                              fontSize: '0.85rem',
                              fontWeight: '600',
                              display: 'block',
                              textAlign: 'center',
                              backdropFilter: 'blur(10px)'
                            }}
                          >
                            🏪 Conveniência
                          </span>
                        </div>
                      </div>
                    </div>

                    <div style={{ marginTop: 'auto' }}>
                      <div 
                        style={{
                          background: 'rgba(16, 185, 129, 0.15)',
                          border: '1px solid rgba(16, 185, 129, 0.3)',
                          borderRadius: '16px',
                          padding: '1rem',
                          marginBottom: '1.5rem',
                          backdropFilter: 'blur(10px)'
                        }}
                      >
                        <small style={{ color: 'white', fontWeight: '500' }}>
                          <i className="bi bi-gift me-2" style={{ color: '#10b981' }}></i>
                          <strong>7 dias grátis</strong> para testar todas as funcionalidades!
                        </small>
                      </div>
                      
                      <div className="d-grid">
                        <Link 
                          href="/register/lojista" 
                          style={{
                            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                            border: 'none',
                            borderRadius: '18px',
                            padding: '1rem 1.5rem',
                            color: 'white',
                            fontWeight: '700',
                            fontSize: '1.1rem',
                            textDecoration: 'none',
                            display: 'block',
                            textAlign: 'center',
                            boxShadow: '0 12px 30px rgba(16, 185, 129, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-3px)';
                            e.currentTarget.style.boxShadow = '0 16px 40px rgba(16, 185, 129, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.15)';
                            e.currentTarget.style.background = 'linear-gradient(135deg, #059669 0%, #047857 100%)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = '0 12px 30px rgba(16, 185, 129, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)';
                            e.currentTarget.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
                          }}
                        >
                          <i className="bi bi-shop me-2"></i>
                          Cadastrar como Lojista
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
                  background: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(25px)',
                  borderRadius: '24px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  boxShadow: '0 25px 80px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                  padding: '2rem'
                }}
              >
                <p style={{ 
                  color: 'rgba(255, 255, 255, 0.8)', 
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
                      color: '#60a5fa',
                      transition: 'color 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = '#93c5fd';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = '#60a5fa';
                    }}
                  >
                    Fazer Login
                  </Link>
                </p>
                
                <div 
                  style={{
                    marginTop: '1.5rem',
                    paddingTop: '1.5rem',
                    borderTop: '1px solid rgba(255, 255, 255, 0.1)'
                  }}
                >
                  <small style={{ 
                    color: 'rgba(255, 255, 255, 0.7)',
                    fontSize: '0.95rem',
                    fontWeight: '500'
                  }}>
                    <i className="bi bi-shield-check me-2" style={{ color: '#10b981' }}></i>
                    Seus dados estão seguros e protegidos com criptografia avançada
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
