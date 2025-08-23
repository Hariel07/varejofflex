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
        style={{ background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)' }}
      >
        <div className="text-center">
          <div 
            className="spinner-border mb-3" 
            role="status"
            style={{ color: '#3b82f6', width: '3rem', height: '3rem' }}
          >
            <span className="visually-hidden">Carregando...</span>
          </div>
          <p style={{ color: '#64748b' }}>Verificando opções de cadastro...</p>
        </div>
      </div>
    );
  }
  return (
    <div className="min-vh-100" style={{ 
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
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
            radial-gradient(circle at 75% 75%, rgba(147, 51, 234, 0.05) 0%, transparent 50%),
            radial-gradient(circle at 50% 50%, rgba(236, 72, 153, 0.03) 0%, transparent 50%)
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
                  padding: '40px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  boxShadow: '0 20px 60px rgba(0, 0, 0, 0.1)'
                }}
              >
                <h1 
                  className="display-5 fw-bold mb-3"
                  style={{
                    background: 'linear-gradient(135deg, #1e293b 0%, #3b82f6 50%, #8b5cf6 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}
                >
                  Escolha seu Tipo de Cadastro
                </h1>
                <p className="lead" style={{ color: '#64748b', fontSize: '1.2rem' }}>
                  Selecione a opção que melhor se adequa ao seu perfil
                </p>
              </div>
            </div>

            {/* Cards de Opção */}
            <div className="row g-4 justify-content-center">
              {/* Cadastro Lojista */}
              <div className={`col-md-6 ${!showOwnerOption ? 'col-lg-8' : ''}`}>
                <div 
                  style={{
                    background: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(20px)',
                    borderRadius: '24px',
                    border: '2px solid rgba(16, 185, 129, 0.3)',
                    boxShadow: '0 20px 60px rgba(16, 185, 129, 0.15)',
                    padding: '0',
                    overflow: 'hidden',
                    transition: 'all 0.3s ease',
                    height: '100%'
                  }}
                  className="h-100"
                >
                  <div 
                    style={{
                      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                      color: 'white',
                      textAlign: 'center',
                      padding: '32px'
                    }}
                  >
                    <div style={{ fontSize: '4rem', marginBottom: '16px' }}>🏪</div>
                    <h4 className="mb-0" style={{ fontWeight: '700' }}>Sou Lojista</h4>
                  </div>
                  <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', minHeight: 'calc(100% - 140px)' }}>
                    <p style={{ color: '#64748b', marginBottom: '24px', fontSize: '1.1rem' }}>
                      Quero vender meus produtos online e gerenciar minha loja
                    </p>
                    
                    <div className="mb-4">
                      <h6 style={{ color: '#1e293b', fontWeight: '700', marginBottom: '16px' }}>✨ O que você ganha:</h6>
                      <ul className="list-unstyled">
                        <li className="mb-2">
                          <i className="bi bi-check-circle me-2" style={{ color: '#10b981' }}></i>
                          <span style={{ color: '#64748b' }}>Sistema PDV completo</span>
                        </li>
                        <li className="mb-2">
                          <i className="bi bi-check-circle me-2" style={{ color: '#10b981' }}></i>
                          <span style={{ color: '#64748b' }}>Gestão de produtos e estoque</span>
                        </li>
                        <li className="mb-2">
                          <i className="bi bi-check-circle me-2" style={{ color: '#10b981' }}></i>
                          <span style={{ color: '#64748b' }}>Relatórios e métricas</span>
                        </li>
                        <li className="mb-2">
                          <i className="bi bi-check-circle me-2" style={{ color: '#10b981' }}></i>
                          <span style={{ color: '#64748b' }}>Integração com delivery</span>
                        </li>
                        <li className="mb-2">
                          <i className="bi bi-check-circle me-2" style={{ color: '#10b981' }}></i>
                          <span style={{ color: '#64748b' }}>Suporte especializado</span>
                        </li>
                      </ul>
                    </div>

                    <div className="mb-4">
                      <h6 style={{ color: '#1e293b', fontWeight: '700', marginBottom: '16px' }}>🎯 Segmentos Disponíveis:</h6>
                      <div className="row g-2">
                        <div className="col-6">
                          <span 
                            style={{
                              background: 'rgba(251, 191, 36, 0.1)',
                              color: '#d97706',
                              border: '1px solid rgba(251, 191, 36, 0.3)',
                              borderRadius: '20px',
                              padding: '6px 12px',
                              fontSize: '0.85rem',
                              fontWeight: '500',
                              display: 'block',
                              textAlign: 'center'
                            }}
                          >
                            🍔 Lanchonetes
                          </span>
                        </div>
                        <div className="col-6">
                          <span 
                            style={{
                              background: 'rgba(239, 68, 68, 0.1)',
                              color: '#dc2626',
                              border: '1px solid rgba(239, 68, 68, 0.3)',
                              borderRadius: '20px',
                              padding: '6px 12px',
                              fontSize: '0.85rem',
                              fontWeight: '500',
                              display: 'block',
                              textAlign: 'center'
                            }}
                          >
                            🍕 Pizzarias
                          </span>
                        </div>
                        <div className="col-6">
                          <span 
                            style={{
                              background: 'rgba(59, 130, 246, 0.1)',
                              color: '#2563eb',
                              border: '1px solid rgba(59, 130, 246, 0.3)',
                              borderRadius: '20px',
                              padding: '6px 12px',
                              fontSize: '0.85rem',
                              fontWeight: '500',
                              display: 'block',
                              textAlign: 'center'
                            }}
                          >
                            👗 Moda
                          </span>
                        </div>
                        <div className="col-6">
                          <span 
                            style={{
                              background: 'rgba(16, 185, 129, 0.1)',
                              color: '#059669',
                              border: '1px solid rgba(16, 185, 129, 0.3)',
                              borderRadius: '20px',
                              padding: '6px 12px',
                              fontSize: '0.85rem',
                              fontWeight: '500',
                              display: 'block',
                              textAlign: 'center'
                            }}
                          >
                            🛒 Mercados
                          </span>
                        </div>
                        <div className="col-6">
                          <span 
                            style={{
                              background: 'rgba(251, 191, 36, 0.1)',
                              color: '#d97706',
                              border: '1px solid rgba(251, 191, 36, 0.3)',
                              borderRadius: '20px',
                              padding: '6px 12px',
                              fontSize: '0.85rem',
                              fontWeight: '500',
                              display: 'block',
                              textAlign: 'center'
                            }}
                          >
                            🐕 Petshops
                          </span>
                        </div>
                        <div className="col-6">
                          <span 
                            style={{
                              background: 'rgba(239, 68, 68, 0.1)',
                              color: '#dc2626',
                              border: '1px solid rgba(239, 68, 68, 0.3)',
                              borderRadius: '20px',
                              padding: '6px 12px',
                              fontSize: '0.85rem',
                              fontWeight: '500',
                              display: 'block',
                              textAlign: 'center'
                            }}
                          >
                            💅 Salões
                          </span>
                        </div>
                        <div className="col-6">
                          <span 
                            style={{
                              background: 'rgba(14, 165, 233, 0.1)',
                              color: '#0284c7',
                              border: '1px solid rgba(14, 165, 233, 0.3)',
                              borderRadius: '20px',
                              padding: '6px 12px',
                              fontSize: '0.85rem',
                              fontWeight: '500',
                              display: 'block',
                              textAlign: 'center'
                            }}
                          >
                            💊 Farmácias
                          </span>
                        </div>
                        <div className="col-6">
                          <span 
                            style={{
                              background: 'rgba(107, 114, 128, 0.1)',
                              color: '#4b5563',
                              border: '1px solid rgba(107, 114, 128, 0.3)',
                              borderRadius: '20px',
                              padding: '6px 12px',
                              fontSize: '0.85rem',
                              fontWeight: '500',
                              display: 'block',
                              textAlign: 'center'
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
                          background: 'rgba(16, 185, 129, 0.1)',
                          border: '1px solid rgba(16, 185, 129, 0.2)',
                          borderRadius: '12px',
                          padding: '16px',
                          marginBottom: '20px'
                        }}
                      >
                        <small style={{ color: '#1e293b' }}>
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
                            borderRadius: '50px',
                            padding: '16px 24px',
                            color: 'white',
                            fontWeight: '700',
                            fontSize: '1.1rem',
                            textDecoration: 'none',
                            display: 'block',
                            textAlign: 'center',
                            boxShadow: '0 8px 25px rgba(16, 185, 129, 0.3)',
                            transition: 'all 0.3s ease'
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
                    background: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(20px)',
                    borderRadius: '24px',
                    border: '2px solid rgba(239, 68, 68, 0.3)',
                    boxShadow: '0 20px 60px rgba(239, 68, 68, 0.15)',
                    padding: '0',
                    overflow: 'hidden',
                    transition: 'all 0.3s ease',
                    height: '100%'
                  }}
                  className="h-100"
                >
                  <div 
                    style={{
                      background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                      color: 'white',
                      textAlign: 'center',
                      padding: '32px'
                    }}
                  >
                    <div style={{ fontSize: '4rem', marginBottom: '16px' }}>🔐</div>
                    <h4 className="mb-0" style={{ fontWeight: '700' }}>Owner SaaS</h4>
                  </div>
                  <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', minHeight: 'calc(100% - 140px)' }}>
                    <p style={{ color: '#64748b', marginBottom: '24px', fontSize: '1.1rem' }}>
                      Acesso administrativo completo à plataforma VarejoFlex
                    </p>
                    
                    <div className="mb-4">
                      <h6 style={{ color: '#1e293b', fontWeight: '700', marginBottom: '16px' }}>⚡ Permissões Especiais:</h6>
                      <ul className="list-unstyled">
                        <li className="mb-2">
                          <i className="bi bi-check-circle me-2" style={{ color: '#ef4444' }}></i>
                          <span style={{ color: '#64748b' }}>Dashboard administrativo global</span>
                        </li>
                        <li className="mb-2">
                          <i className="bi bi-check-circle me-2" style={{ color: '#ef4444' }}></i>
                          <span style={{ color: '#64748b' }}>Gestão de todos os lojistas</span>
                        </li>
                        <li className="mb-2">
                          <i className="bi bi-check-circle me-2" style={{ color: '#ef4444' }}></i>
                          <span style={{ color: '#64748b' }}>Controle de planos e faturamento</span>
                        </li>
                        <li className="mb-2">
                          <i className="bi bi-check-circle me-2" style={{ color: '#ef4444' }}></i>
                          <span style={{ color: '#64748b' }}>Métricas da plataforma</span>
                        </li>
                        <li className="mb-2">
                          <i className="bi bi-check-circle me-2" style={{ color: '#ef4444' }}></i>
                          <span style={{ color: '#64748b' }}>Configurações avançadas</span>
                        </li>
                      </ul>
                    </div>

                    <div 
                      style={{
                        background: 'rgba(251, 191, 36, 0.1)',
                        border: '1px solid rgba(251, 191, 36, 0.3)',
                        borderRadius: '12px',
                        padding: '16px',
                        marginBottom: '24px'
                      }}
                    >
                      <div className="d-flex">
                        <i className="bi bi-shield-exclamation me-2" style={{ color: '#d97706', fontSize: '1.2rem' }}></i>
                        <div>
                          <h6 style={{ color: '#1e293b', fontWeight: '700', marginBottom: '4px' }}>⚠️ Acesso Restrito</h6>
                          <small style={{ color: '#64748b' }}>
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
                            borderRadius: '50px',
                            padding: '16px 24px',
                            color: 'white',
                            fontWeight: '700',
                            fontSize: '1.1rem',
                            textDecoration: 'none',
                            display: 'block',
                            textAlign: 'center',
                            boxShadow: '0 8px 25px rgba(239, 68, 68, 0.3)',
                            transition: 'all 0.3s ease'
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
                  background: 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(20px)',
                  borderRadius: '20px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  boxShadow: '0 20px 60px rgba(0, 0, 0, 0.08)',
                  padding: '32px'
                }}
              >
                <p style={{ color: '#64748b', marginBottom: '24px' }}>
                  Já possui uma conta? 
                  <Link 
                    href="/login" 
                    style={{ 
                      textDecoration: 'none', 
                      marginLeft: '8px', 
                      fontWeight: '600',
                      color: '#3b82f6'
                    }}
                  >
                    Fazer Login
                  </Link>
                </p>
                
                <div 
                  style={{
                    marginTop: '24px',
                    paddingTop: '24px',
                    borderTop: '1px solid rgba(203, 213, 225, 0.3)'
                  }}
                >
                  <small style={{ color: '#64748b' }}>
                    <i className="bi bi-shield-check me-2" style={{ color: '#10b981' }}></i>
                    Seus dados estão seguros e protegidos
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
