"use client";

import Link from "next/link";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import CouponSection from "@/components/CouponSection";
import { usePlans } from "@/hooks/usePlans";

function RegisterContent() {
  const searchParams = useSearchParams();
  const selectedPlanId = searchParams.get('plan');
  const [showOwnerOption, setShowOwnerOption] = useState(false);
  const [loading, setLoading] = useState(true);
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [billingCycle, setBillingCycle] = useState<'weekly' | 'monthly' | 'annual'>('monthly');

  const { plans, loading: plansLoading, error: plansError } = usePlans();
  const selectedPlan = plans.find(plan => plan.planId === selectedPlanId);

  const handleCouponApplied = (couponData: any) => {
    setAppliedCoupon(couponData);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price).replace('R$', 'R$');
  };

  const calculateDiscountedPrice = (originalPrice: number, discount?: number) => {
    if (!discount || discount <= 0) return originalPrice;
    return originalPrice * (1 - discount / 100);
  };

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

  if (loading || plansLoading) {
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

  if (plansError) {
    return (
      <div 
        className="min-vh-100 d-flex align-items-center justify-content-center"
        style={{ 
          background: 'linear-gradient(135deg, #F8FAFC 0%, #E2E8F0 100%)',
          position: 'relative'
        }}
      >
        <div className="text-center">
          <div className="alert alert-warning" role="alert">
            <i className="bi bi-exclamation-triangle me-2"></i>
            Erro ao carregar informações dos planos: {plansError}
          </div>
          <Link href="/#pricing" className="btn btn-primary">
            Voltar aos Planos
          </Link>
        </div>
      </div>
    );
  }

  // Se um plano foi selecionado, mostrar página de checkout/cadastro
  if (selectedPlanId && selectedPlan) {
    const pricing = selectedPlan.pricing[billingCycle];
    const originalPrice = pricing.price;
    const discountedPrice = calculateDiscountedPrice(originalPrice, pricing.discount);
    const hasDiscount = pricing.discount && pricing.discount > 0;
    
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
                  href="/#pricing" 
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
                  Voltar aos Planos
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
                    🎯
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
                    Finalize seu Cadastro
                  </h1>
                  <p className="lead" style={{ 
                    color: '#64748b', 
                    fontSize: '1.3rem',
                    fontWeight: '400',
                    marginBottom: 0
                  }}>
                    Plano <strong style={{ color: selectedPlan.color }}>{selectedPlan.name}</strong> selecionado - {selectedPlan.trialDays} dias grátis garantidos!
                  </p>
                </div>
              </div>

              {/* Resumo do Plano + Formulário */}
              <div className="row g-5">
                {/* Resumo do Plano */}
                <div className="col-lg-4">
                  <div 
                    style={{
                      background: 'rgba(255, 255, 255, 0.95)',
                      backdropFilter: 'blur(30px)',
                      borderRadius: '24px',
                      border: `2px solid ${selectedPlan.color}30`,
                      boxShadow: '0 20px 60px rgba(0, 0, 0, 0.1)',
                      padding: '2rem',
                      position: 'sticky',
                      top: '2rem'
                    }}
                  >
                    {selectedPlan.popular && (
                      <div className="text-center mb-3">
                        <span 
                          className="badge px-3 py-2 rounded-pill"
                          style={{
                            background: selectedPlan.color,
                            color: 'white',
                            fontSize: '0.9rem',
                            fontWeight: '700'
                          }}
                        >
                          <i className="bi bi-star-fill me-1"></i>Mais Popular
                        </span>
                      </div>
                    )}
                    
                    <div className="text-center mb-4">
                      <h3 style={{ color: selectedPlan.color, fontWeight: '800', marginBottom: '1rem' }}>
                        Plano {selectedPlan.name}
                      </h3>
                      <div style={{ fontSize: '2.5rem', fontWeight: '800', color: '#1e293b', marginBottom: '0.5rem' }}>
                        {appliedCoupon && appliedCoupon.finalPrice !== undefined ? (
                          <div>
                            {appliedCoupon.discount > 0 && (
                              <div style={{ 
                                fontSize: '1.5rem', 
                                textDecoration: 'line-through', 
                                color: '#9ca3af',
                                marginBottom: '0.25rem'
                              }}>
                                {formatPrice(appliedCoupon.originalPrice)}
                              </div>
                            )}
                            <div style={{ color: appliedCoupon.finalPrice === 0 ? '#10b981' : '#1e293b' }}>
                              {appliedCoupon.finalPrice === 0 ? 'GRATUITO' : formatPrice(appliedCoupon.finalPrice)}
                              {appliedCoupon.finalPrice > 0 && (
                                <small style={{ fontSize: '1rem', color: '#64748b', fontWeight: '500' }}>
                                  /{billingCycle === 'weekly' ? 'sem' : billingCycle === 'monthly' ? 'mês' : 'ano'}
                                </small>
                              )}
                            </div>
                          </div>
                        ) : (
                          <div>
                            {hasDiscount ? (
                              <div>
                                <div style={{ 
                                  fontSize: '1.5rem', 
                                  textDecoration: 'line-through', 
                                  color: '#9ca3af',
                                  marginBottom: '0.25rem'
                                }}>
                                  {formatPrice(originalPrice)}
                                </div>
                                <div>
                                  {formatPrice(discountedPrice)}
                                  <small style={{ fontSize: '1rem', color: '#64748b', fontWeight: '500' }}>
                                    /{billingCycle === 'weekly' ? 'sem' : billingCycle === 'monthly' ? 'mês' : 'ano'}
                                  </small>
                                </div>
                                <div style={{ color: '#28a745', fontSize: '0.9rem', fontWeight: '600' }}>
                                  -{pricing.discount}% de desconto
                                </div>
                              </div>
                            ) : (
                              <div>
                                {formatPrice(originalPrice)}
                                <small style={{ fontSize: '1rem', color: '#64748b', fontWeight: '500' }}>
                                  /{billingCycle === 'weekly' ? 'sem' : billingCycle === 'monthly' ? 'mês' : 'ano'}
                                </small>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                      
                      {appliedCoupon && appliedCoupon.discount > 0 ? (
                        <div 
                          style={{
                            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                            color: 'white',
                            padding: '0.75rem 1rem',
                            borderRadius: '12px',
                            fontWeight: '700',
                            fontSize: '0.9rem',
                            marginBottom: '1rem'
                          }}
                        >
                          🎉 Cupom {appliedCoupon.coupon.code} aplicado!
                          <br />
                          <small style={{ opacity: 0.9 }}>
                            Economia de {formatPrice(appliedCoupon.discount)}
                            {appliedCoupon.trialDays > 0 && ` + ${appliedCoupon.trialDays} dias grátis`}
                          </small>
                        </div>
                      ) : (
                        <div 
                          style={{
                            background: `${selectedPlan.color}15`,
                            color: selectedPlan.color,
                            padding: '0.75rem 1rem',
                            borderRadius: '12px',
                            fontWeight: '700',
                            fontSize: '0.9rem'
                          }}
                        >
                          🎁 {selectedPlan.trialDays} dias completamente grátis
                        </div>
                      )}
                    </div>

                    <div className="mb-4">
                      <h6 style={{ color: '#1e293b', fontWeight: '700', marginBottom: '1rem' }}>
                        ✨ Recursos inclusos:
                      </h6>
                      <ul className="list-unstyled">
                        {selectedPlan.features.map((feature, index) => (
                          <li key={index} className="mb-2 d-flex align-items-start">
                            <i className="bi bi-check-circle-fill me-2 mt-1" style={{ color: selectedPlan.color }}></i>
                            <span style={{ color: '#4a5568', fontWeight: '500' }}>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div 
                      style={{
                        background: `${selectedPlan.color}10`,
                        border: `1px solid ${selectedPlan.color}30`,
                        borderRadius: '16px',
                        padding: '1.5rem',
                        textAlign: 'center'
                      }}
                    >
                      <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>🔒</div>
                      <h6 style={{ color: '#1e293b', fontWeight: '700', marginBottom: '0.5rem' }}>
                        Garantia Total
                      </h6>
                      <small style={{ color: '#4a5568', fontWeight: '500' }}>
                        Cancele a qualquer momento durante o período grátis. 
                        Sem taxas ou compromisso.
                      </small>
                    </div>
                  </div>
                </div>

                {/* Formulário de Cadastro */}
                <div className="col-lg-8">
                  <div 
                    style={{
                      background: 'rgba(255, 255, 255, 0.95)',
                      backdropFilter: 'blur(30px)',
                      borderRadius: '24px',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      boxShadow: '0 20px 60px rgba(0, 0, 0, 0.1)',
                      padding: '3rem'
                    }}
                  >
                    <h3 style={{ color: '#1e293b', fontWeight: '800', marginBottom: '2rem' }}>
                      Dados da sua empresa
                    </h3>
                    
                    <form>
                      <div className="row g-3">
                        <div className="col-md-6">
                          <label className="form-label" style={{ fontWeight: '600', color: '#374151' }}>
                            Nome Completo *
                          </label>
                          <input 
                            type="text" 
                            className="form-control form-control-lg"
                            style={{
                              border: '2px solid #e5e7eb',
                              borderRadius: '12px',
                              padding: '0.75rem 1rem',
                              fontSize: '1rem'
                            }}
                            required 
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label" style={{ fontWeight: '600', color: '#374151' }}>
                            Email *
                          </label>
                          <input 
                            type="email" 
                            className="form-control form-control-lg"
                            style={{
                              border: '2px solid #e5e7eb',
                              borderRadius: '12px',
                              padding: '0.75rem 1rem',
                              fontSize: '1rem'
                            }}
                            required 
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label" style={{ fontWeight: '600', color: '#374151' }}>
                            Telefone *
                          </label>
                          <input 
                            type="tel" 
                            className="form-control form-control-lg"
                            style={{
                              border: '2px solid #e5e7eb',
                              borderRadius: '12px',
                              padding: '0.75rem 1rem',
                              fontSize: '1rem'
                            }}
                            required 
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label" style={{ fontWeight: '600', color: '#374151' }}>
                            CPF/CNPJ *
                          </label>
                          <input 
                            type="text" 
                            className="form-control form-control-lg"
                            placeholder="000.000.000-00 ou 00.000.000/0000-00"
                            style={{
                              border: '2px solid #e5e7eb',
                              borderRadius: '12px',
                              padding: '0.75rem 1rem',
                              fontSize: '1rem'
                            }}
                            required
                          />
                        </div>
                        <div className="col-12">
                          <label className="form-label" style={{ fontWeight: '600', color: '#374151' }}>
                            Nome da Empresa/Loja *
                          </label>
                          <input 
                            type="text" 
                            className="form-control form-control-lg"
                            style={{
                              border: '2px solid #e5e7eb',
                              borderRadius: '12px',
                              padding: '0.75rem 1rem',
                              fontSize: '1rem'
                            }}
                            required 
                          />
                        </div>
                        
                        <div className="col-md-6">
                          <label className="form-label" style={{ fontWeight: '600', color: '#374151' }}>
                            CEP *
                          </label>
                          <input 
                            type="text" 
                            className="form-control form-control-lg"
                            placeholder="00000-000"
                            style={{
                              border: '2px solid #e5e7eb',
                              borderRadius: '12px',
                              padding: '0.75rem 1rem',
                              fontSize: '1rem'
                            }}
                            required 
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label" style={{ fontWeight: '600', color: '#374151' }}>
                            Cidade *
                          </label>
                          <input 
                            type="text" 
                            className="form-control form-control-lg"
                            style={{
                              border: '2px solid #e5e7eb',
                              borderRadius: '12px',
                              padding: '0.75rem 1rem',
                              fontSize: '1rem'
                            }}
                            required 
                          />
                        </div>
                        <div className="col-md-8">
                          <label className="form-label" style={{ fontWeight: '600', color: '#374151' }}>
                            Endereço *
                          </label>
                          <input 
                            type="text" 
                            className="form-control form-control-lg"
                            style={{
                              border: '2px solid #e5e7eb',
                              borderRadius: '12px',
                              padding: '0.75rem 1rem',
                              fontSize: '1rem'
                            }}
                            required 
                          />
                        </div>
                        <div className="col-md-4">
                          <label className="form-label" style={{ fontWeight: '600', color: '#374151' }}>
                            Número *
                          </label>
                          <input 
                            type="text" 
                            className="form-control form-control-lg"
                            style={{
                              border: '2px solid #e5e7eb',
                              borderRadius: '12px',
                              padding: '0.75rem 1rem',
                              fontSize: '1rem'
                            }}
                            required 
                          />
                        </div>
                        
                        <div className="col-md-6">
                          <label className="form-label" style={{ fontWeight: '600', color: '#374151' }}>
                            Segmento *
                          </label>
                          <select 
                            className="form-select form-select-lg"
                            style={{
                              border: '2px solid #e5e7eb',
                              borderRadius: '12px',
                              padding: '0.75rem 1rem',
                              fontSize: '1rem'
                            }}
                            required
                          >
                            <option value="">Selecione seu segmento...</option>
                            <option value="lanchonete">🍔 Lanchonete</option>
                            <option value="pizzaria">🍕 Pizzaria</option>
                            <option value="moda">👗 Moda & Acessórios</option>
                            <option value="mercado">🛒 Mercado/Supermercado</option>
                            <option value="petshop">🐕 Petshop</option>
                            <option value="salao">💅 Salão de Beleza</option>
                            <option value="farmacia">💊 Farmácia</option>
                            <option value="conveniencia">🏪 Conveniência</option>
                            <option value="outros">🏢 Outros</option>
                          </select>
                        </div>
                        <div className="col-md-6">
                          <label className="form-label" style={{ fontWeight: '600', color: '#374151' }}>
                            Senha *
                          </label>
                          <input 
                            type="password" 
                            className="form-control form-control-lg"
                            placeholder="Mínimo 8 caracteres"
                            style={{
                              border: '2px solid #e5e7eb',
                              borderRadius: '12px',
                              padding: '0.75rem 1rem',
                              fontSize: '1rem'
                            }}
                            required 
                          />
                        </div>
                      </div>

                      {/* Seção de Cupom */}
                      <div style={{ marginTop: '2rem', marginBottom: '2rem' }}>
                        <CouponSection 
                          selectedPlan={selectedPlanId} 
                          selectedPlanData={selectedPlan}
                          onCouponApplied={handleCouponApplied}
                        />
                      </div>

                      <div className="row g-3">
                        <div className="col-12">
                          <div 
                            style={{
                              background: `${selectedPlan.color}08`,
                              border: `1px solid ${selectedPlan.color}30`,
                              borderRadius: '12px',
                              padding: '1rem'
                            }}
                          >
                            <h6 style={{ color: '#1e293b', fontWeight: '700', marginBottom: '0.5rem' }}>
                              🎁 Período de Teste Gratuito
                            </h6>
                            <p style={{ color: '#4a5568', fontSize: '0.9rem', margin: 0 }}>
                              {appliedCoupon && appliedCoupon.trialDays > 0 ? (
                                <>
                                  Você terá <strong>{appliedCoupon.trialDays} dias adicionais gratuitos</strong> através do seu cupom, 
                                  além dos <strong>{selectedPlan.trialDays} dias padrão</strong> para testar todos os recursos do plano {selectedPlan.name}.
                                </>
                              ) : (
                                <>
                                  Você terá <strong>{selectedPlan.trialDays} dias completamente grátis</strong> para testar todos os recursos do plano {selectedPlan.name}.
                                </>
                              )}
                              {' '}Após o período, será cobrado <strong>
                                {appliedCoupon && appliedCoupon.finalPrice !== undefined ? 
                                  (appliedCoupon.finalPrice === 0 ? 'gratuito' : `${formatPrice(appliedCoupon.finalPrice)}/${billingCycle === 'weekly' ? 'sem' : billingCycle === 'monthly' ? 'mês' : 'ano'}`) :
                                  `${formatPrice(hasDiscount ? discountedPrice : originalPrice)}/${billingCycle === 'weekly' ? 'sem' : billingCycle === 'monthly' ? 'mês' : 'ano'}`
                                }
                              </strong>. Cancele a qualquer momento sem compromisso.
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4">
                        <div className="form-check">
                          <input className="form-check-input" type="checkbox" id="terms" required />
                          <label className="form-check-label" htmlFor="terms" style={{ color: '#4a5568' }}>
                            Aceito os <a href="#" style={{ color: selectedPlan.color }}>Termos de Uso</a> e 
                            <a href="#" style={{ color: selectedPlan.color }}> Política de Privacidade</a>
                          </label>
                        </div>
                        <div className="form-check">
                          <input className="form-check-input" type="checkbox" id="newsletter" />
                          <label className="form-check-label" htmlFor="newsletter" style={{ color: '#4a5568' }}>
                            Desejo receber dicas e novidades por email
                          </label>
                        </div>
                      </div>

                      <div className="mt-4">
                        <button 
                          type="submit"
                          className="btn btn-lg w-100"
                          style={{
                            background: `linear-gradient(135deg, ${selectedPlan.color} 0%, ${selectedPlan.color}dd 100%)`,
                            border: 'none',
                            borderRadius: '16px',
                            padding: '1rem 2rem',
                            color: 'white',
                            fontWeight: '800',
                            fontSize: '1.1rem',
                            boxShadow: `0 8px 25px ${selectedPlan.color}40`,
                            transition: 'all 0.3s ease'
                          }}
                        >
                          {appliedCoupon && appliedCoupon.finalPrice === 0 ? 
                            '🎉 Criar Conta GRATUITA com Cupom' :
                            appliedCoupon && appliedCoupon.discount > 0 ?
                            `🎯 Criar Conta com Desconto (${formatPrice(appliedCoupon.finalPrice)})` :
                            `🚀 Criar Conta e Iniciar ${selectedPlan.trialDays} Dias Grátis`
                          }
                        </button>
                        <div className="text-center mt-3">
                          <small style={{ color: '#6b7280' }}>
                            <i className="bi bi-shield-check me-1"></i>
                            Seus dados estão protegidos com criptografia SSL
                          </small>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Se nenhum plano foi selecionado, redirecionar para escolha de planos
  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center" style={{ 
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
      
      <div className="container" style={{ position: 'relative', zIndex: 2 }}>
        <div className="row justify-content-center">
          <div className="col-lg-8 text-center">
            <div 
              style={{
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(30px)',
                borderRadius: '32px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                boxShadow: '0 32px 100px rgba(0, 0, 0, 0.15)',
                padding: '4rem 3rem'
              }}
            >
              <div style={{ 
                fontSize: '5rem', 
                marginBottom: '2rem',
                filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1))'
              }}>
                🎯
              </div>
              
              <h1 
                style={{
                  background: 'linear-gradient(135deg, #1e293b 0%, #3b82f6 50%, #8b5cf6 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  fontSize: '3rem',
                  fontWeight: '900',
                  marginBottom: '1.5rem'
                }}
              >
                Escolha seu Plano
              </h1>
              
              <p style={{ 
                color: '#64748b', 
                fontSize: '1.3rem',
                fontWeight: '500',
                marginBottom: '3rem',
                lineHeight: '1.6'
              }}>
                Para criar sua conta, primeiro você precisa escolher o plano ideal para seu negócio. 
                <br />
                <strong style={{ color: '#3b82f6' }}>Todos os planos incluem período de teste grátis!</strong>
              </p>

              <Link 
                href="/#pricing"
                style={{
                  background: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)',
                  border: 'none',
                  borderRadius: '20px',
                  padding: '1.2rem 3rem',
                  color: 'white',
                  fontWeight: '800',
                  fontSize: '1.2rem',
                  textDecoration: 'none',
                  display: 'inline-block',
                  boxShadow: '0 16px 40px rgba(59, 130, 246, 0.4)',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  marginBottom: '2rem'
                }}
              >
                🚀 Ver Planos e Preços
              </Link>

              <div style={{ marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid rgba(59, 130, 246, 0.1)' }}>
                <p style={{ color: '#6b7280', margin: 0 }}>
                  Já tem uma conta? 
                  <Link 
                    href="/login" 
                    style={{ 
                      color: '#3b82f6', 
                      textDecoration: 'none', 
                      fontWeight: '600', 
                      marginLeft: '8px' 
                    }}
                  >
                    Fazer Login
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={
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
            Carregando página de registro...
          </p>
        </div>
      </div>
    }>
      <RegisterContent />
    </Suspense>
  );
}