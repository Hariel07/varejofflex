"use client";

import Link from "next/link";
import React, { useState } from 'react';
import AddOnCard, { UpgradeModal } from './AddOnCard';
import { PlanType, PLAN_INFO } from '@/lib/planMatrix';
import { usePlans } from '@/hooks/usePlans';

export default function PricingSection() {
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [selectedUpgradePlan, setSelectedUpgradePlan] = useState<PlanType>('profissional');
  const [selectedAddOnName, setSelectedAddOnName] = useState('');
  const [billingCycle, setBillingCycle] = useState<'weekly' | 'monthly' | 'annual'>('monthly');

  const { plans, loading, error } = usePlans();

  const handleUpgrade = (targetPlan: PlanType, addOnName: string) => {
    setSelectedUpgradePlan(targetPlan);
    setSelectedAddOnName(addOnName);
    setShowUpgradeModal(true);
  };

  const handleSubscribe = (addOnId: string) => {
    // Implementar lógica de contratação
    console.log('Contratando add-on:', addOnId);
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

  if (loading) {
    return (
      <section className="py-5 bg-light" id="pricing">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8 text-center">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Carregando planos...</span>
              </div>
              <p className="mt-3 text-muted">Carregando planos disponíveis...</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-5 bg-light" id="pricing">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8 text-center">
              <div className="alert alert-warning" role="alert">
                <i className="bi bi-exclamation-triangle me-2"></i>
                Erro ao carregar planos: {error}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-5 bg-light" id="pricing">
      <div className="container">
        <div className="row justify-content-center mb-5">
          <div className="col-lg-8 text-center">
            <h2 className="display-4 fw-bold mb-3 text-dark">Escolha seu Plano</h2>
            <p className="lead text-muted">
              Soluções completas para diferentes tamanhos de negócio
            </p>
            
            {/* Seletor de Ciclo de Cobrança */}
            <div className="d-inline-flex bg-white rounded-pill p-2 shadow-lg mb-4 border" style={{ gap: '8px' }}>
              <button
                className={`btn ${billingCycle === 'weekly' ? 'btn-primary' : 'btn-outline-secondary'} rounded-pill px-4 py-2`}
                onClick={() => setBillingCycle('weekly')}
                style={{
                  fontWeight: '600',
                  border: billingCycle === 'weekly' ? '2px solid #0d6efd' : '2px solid #dee2e6',
                  color: billingCycle === 'weekly' ? 'white' : '#495057'
                }}
              >
                📅 Semanal
              </button>
              <button
                className={`btn ${billingCycle === 'monthly' ? 'btn-primary' : 'btn-outline-secondary'} rounded-pill px-4 py-2 position-relative`}
                onClick={() => setBillingCycle('monthly')}
                style={{
                  fontWeight: '600',
                  border: billingCycle === 'monthly' ? '2px solid #0d6efd' : '2px solid #dee2e6',
                  color: billingCycle === 'monthly' ? 'white' : '#495057'
                }}
              >
                🗓️ Mensal
                <span className="badge bg-warning text-dark position-absolute" style={{
                  top: '-8px',
                  right: '-8px',
                  fontSize: '0.7rem',
                  fontWeight: '700'
                }}>
                  POPULAR
                </span>
              </button>
              <button
                className={`btn ${billingCycle === 'annual' ? 'btn-primary' : 'btn-outline-secondary'} rounded-pill px-4 py-2 position-relative`}
                onClick={() => setBillingCycle('annual')}
                style={{
                  fontWeight: '600',
                  border: billingCycle === 'annual' ? '2px solid #0d6efd' : '2px solid #dee2e6',
                  color: billingCycle === 'annual' ? 'white' : '#495057'
                }}
              >
                📆 Anual
                <span className="badge bg-success text-white position-absolute" style={{
                  top: '-8px',
                  right: '-8px',
                  fontSize: '0.7rem',
                  fontWeight: '700'
                }}>
                  -17%
                </span>
              </button>
            </div>
          </div>
        </div>

        <div className="row justify-content-center align-items-stretch">
          {plans.map((plan) => {
            const pricing = plan.pricing[billingCycle];
            if (!pricing.enabled) return null;

            const originalPrice = pricing.price;
            const discountedPrice = calculateDiscountedPrice(originalPrice, pricing.discount);
            const hasDiscount = pricing.discount && pricing.discount > 0;

            return (
              <div key={plan.planId} className="col-lg-4 col-md-6 mb-4 d-flex">
                <div 
                  className="card shadow-lg border-0 pricing-card w-100"
                  style={{
                    background: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                    minHeight: '750px',
                    display: 'flex',
                    flexDirection: 'column'
                  }}
                >
                  <div className="card-header border-0 bg-transparent text-center pt-4">
                    <h3 style={{ color: plan.color, fontWeight: '800' }}>{plan.name}</h3>
                    <div className="mb-3">
                      {hasDiscount ? (
                        <div>
                          <div style={{ 
                            fontSize: '1.2rem', 
                            textDecoration: 'line-through', 
                            color: '#999'
                          }}>
                            {formatPrice(originalPrice)}
                          </div>
                          <span className="h2 fw-bold text-dark">
                            {formatPrice(discountedPrice)}
                          </span>
                          <div style={{ color: '#28a745', fontSize: '0.9rem', fontWeight: '600' }}>
                            -{pricing.discount}% de desconto
                          </div>
                        </div>
                      ) : (
                        <span className="h2 fw-bold text-dark">
                          {formatPrice(originalPrice)}
                        </span>
                      )}
                      <div style={{ color: '#6c757d', fontSize: '1rem' }}>
                        /{billingCycle === 'weekly' ? 'semana' : billingCycle === 'monthly' ? 'mês' : 'ano'}
                      </div>
                      {billingCycle === 'annual' && (
                        <div style={{ color: '#28a745', fontSize: '0.9rem', fontWeight: '600' }}>
                          ou {formatPrice(discountedPrice / 12)}/mês
                        </div>
                      )}
                    </div>
                    <p className="text-muted">{plan.description}</p>
                  </div>
                  
                  <div className="card-body flex-grow-1 d-flex flex-column">
                    <ul className="list-unstyled flex-grow-1">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="mb-3 d-flex align-items-start">
                          <i className="bi bi-check-circle-fill me-3 mt-1" style={{ color: plan.color }}></i>
                          <span style={{ color: '#495057', fontWeight: '500' }}>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    
                    {/* Seção IoT */}
                    {plan.iotEnabled && plan.iotFeatures && plan.iotFeatures.length > 0 && (
                      <div className="mt-4 p-3 rounded-3" style={{ 
                        background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%)',
                        border: '1px solid rgba(139, 92, 246, 0.2)'
                      }}>
                        <h6 className="fw-bold mb-3" style={{ color: '#8B5CF6' }}>
                          <i className="bi bi-cpu me-2"></i>
                          Recursos IoT Incluídos
                        </h6>
                        <ul className="list-unstyled mb-0">
                          {plan.iotFeatures.map((iotFeature, index) => (
                            <li key={index} className="mb-2 d-flex align-items-start">
                              <i className="bi bi-lightning-charge-fill me-2 mt-1" style={{ color: '#8B5CF6', fontSize: '0.9rem' }}></i>
                              <small style={{ color: '#495057', fontWeight: '500' }}>{iotFeature}</small>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {/* Plano sem IoT - incentivo para upgrade */}
                    {!plan.iotEnabled && (
                      <div className="mt-4 p-3 rounded-3" style={{ 
                        background: 'rgba(108, 117, 125, 0.1)',
                        border: '1px solid rgba(108, 117, 125, 0.2)'
                      }}>
                        <h6 className="fw-bold mb-2 text-muted">
                          <i className="bi bi-cpu me-2"></i>
                          IoT não disponível
                        </h6>
                        <small className="text-muted">
                          Upgrade para o plano Profissional ou superior para acessar recursos de Internet das Coisas.
                        </small>
                      </div>
                    )}
                    
                    <div className="mt-auto pt-3">
                      <Link 
                        href={`/register?plan=${plan.planId}&billing=${billingCycle}`} 
                        className={`btn w-100 btn-lg ${plan.planId === 'empresarial' ? 'btn-success' : 'btn-primary'}`}
                        style={{
                          borderRadius: '12px',
                          fontWeight: '700',
                          padding: '1rem',
                          background: plan.planId === 'empresarial' ? 
                            'linear-gradient(135deg, #28a745 0%, #20c997 100%)' : 
                            'linear-gradient(135deg, #007bff 0%, #0056b3 100%)',
                          border: 'none',
                          boxShadow: '0 4px 15px rgba(0, 123, 255, 0.3)',
                          transition: 'all 0.3s ease'
                        }}
                      >
                        Escolher {plan.name}
                      </Link>
                      <div className="text-center mt-3">
                        <small className="text-muted">
                          <i className="bi bi-shield-check me-1"></i>
                          {plan.trialDays} dias grátis • Cancele quando quiser
                        </small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Garantias e Benefícios */}
        <div className="row justify-content-center mt-5">
          <div className="col-lg-10">
            <div 
              className="card border-0 shadow-lg"
              style={{
                background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
                borderRadius: '24px'
              }}
            >
              <div className="card-body p-5">
                <div className="text-center mb-4">
                  <h3 className="h2 fw-bold text-dark mb-3">
                    <i className="bi bi-shield-check me-2 text-success"></i>
                    Garantias e Benefícios
                  </h3>
                </div>
                
                <div className="row g-4">
                  <div className="col-lg-3 col-md-6 text-center">
                    <div className="mb-3">
                      <i className="bi bi-clock-history" style={{ fontSize: '3rem', color: '#007bff' }}></i>
                    </div>
                    <h5 className="fw-bold text-dark">14 Dias Grátis</h5>
                    <p className="text-muted mb-0">
                      Teste todas as funcionalidades sem compromisso
                    </p>
                  </div>
                  
                  <div className="col-lg-3 col-md-6 text-center">
                    <div className="mb-3">
                      <i className="bi bi-arrow-repeat" style={{ fontSize: '3rem', color: '#28a745' }}></i>
                    </div>
                    <h5 className="fw-bold text-dark">Cancele Quando Quiser</h5>
                    <p className="text-muted mb-0">
                      Sem fidelidade, sem multas, sem complicação
                    </p>
                  </div>
                  
                  <div className="col-lg-3 col-md-6 text-center">
                    <div className="mb-3">
                      <i className="bi bi-headset" style={{ fontSize: '3rem', color: '#ffc107' }}></i>
                    </div>
                    <h5 className="fw-bold text-dark">Suporte Especializado</h5>
                    <p className="text-muted mb-0">
                      Equipe dedicada para ajudar seu negócio crescer
                    </p>
                  </div>
                  
                  <div className="col-lg-3 col-md-6 text-center">
                    <div className="mb-3">
                      <i className="bi bi-cloud-arrow-up" style={{ fontSize: '3rem', color: '#6f42c1' }}></i>
                    </div>
                    <h5 className="fw-bold text-dark">Dados Seguros</h5>
                    <p className="text-muted mb-0">
                      Backup automático e segurança de ponta
                    </p>
                  </div>
                </div>

                <hr className="my-5" />

                <div className="text-center">
                  <h4 className="fw-bold text-dark mb-3">
                    <i className="bi bi-info-circle me-2 text-primary"></i>
                    Informações Importantes
                  </h4>
                  <div className="row g-3">
                    <div className="col-md-4">
                      <div className="alert alert-info mb-0" role="alert">
                        <strong>🔧 Setup Único:</strong> Integração Balança Fiscal cobra R$ 149 apenas uma vez<br/>
                        <small>Necessário apenas para estabelecimentos que usam balança fiscal</small>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="alert alert-success mb-0" role="alert">
                        <strong>📱 Apps Grátis:</strong> Apps mobile inclusos em todos os planos<br/>
                        <small>Para Android e iOS, sem custos adicionais</small>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="alert alert-warning mb-0" role="alert">
                        <strong>🚀 Migration Grátis:</strong> Migração dos seus dados sem custo<br/>
                        <small>Nossa equipe faz toda a importação para você</small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Upgrade */}
      <UpgradeModal
        show={showUpgradeModal}
        onHide={() => setShowUpgradeModal(false)}
        targetPlan={selectedUpgradePlan}
        addOnName={selectedAddOnName}
      />
    </section>
  );
}