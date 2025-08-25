"use client";

import { useState } from "react";

interface CouponSectionProps {
  selectedPlan: string;
  selectedPlanData?: any; // Dados do plano do banco
  onCouponApplied: (couponData: any) => void;
  billingCycle: 'weekly' | 'monthly' | 'annual';
  onBillingCycleChange: (cycle: 'weekly' | 'monthly' | 'annual') => void;
}

interface PlanPrices {
  [key: string]: {
    monthly: number;
    annual: number;
    weekly: number;
  };
}

export default function CouponSection({ selectedPlan, selectedPlanData, onCouponApplied, billingCycle, onBillingCycleChange }: CouponSectionProps) {
  const [couponCode, setCouponCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [error, setError] = useState("");

  // Usar dados do banco quando disponíveis, senão usar fallback
  const getPlanPrice = (cycle: string) => {
    if (selectedPlanData?.pricing?.[cycle]) {
      return selectedPlanData.pricing[cycle].price;
    }
    
    // Fallback para valores padrão (caso não tenha dados do banco)
    const fallbackPrices: PlanPrices = {
      basico: { monthly: 89, annual: 890, weekly: 22 },
      profissional: { monthly: 189, annual: 1890, weekly: 47 },
      empresarial: { monthly: 389, annual: 3890, weekly: 97 }
    };
    
    return fallbackPrices[selectedPlan]?.[cycle as keyof typeof fallbackPrices.basico] || 0;
  };

  const planNames: { [key: string]: string } = {
    basico: "basic",
    profissional: "pro", 
    empresarial: "ultra"
  };

  const applyCoupon = async () => {
    if (!couponCode.trim()) {
      setError("Digite um código de cupom");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code: couponCode,
          category: "subscription",
          subscriptionPlan: planNames[selectedPlan],
          subscriptionType: billingCycle,
          userEmail: "temp@example.com" // Será substituído pelo email real do formulário
        }),
      });

      const data = await response.json();

      if (data.success && data.valid) {
        setAppliedCoupon(data);
        onCouponApplied(data);
        setError("");
      } else {
        setError(data.error || "Cupom inválido");
        setAppliedCoupon(null);
        onCouponApplied(null);
      }
    } catch (error) {
      setError("Erro ao validar cupom");
      console.error("Erro:", error);
    }

    setLoading(false);
  };

  const removeCoupon = () => {
    setCouponCode("");
    setAppliedCoupon(null);
    setError("");
    onCouponApplied(null);
  };

  const currentPrice = getPlanPrice(billingCycle);

  return (
    <div style={{ marginBottom: '2rem' }}>
      {/* Seletor de Ciclo de Cobrança */}
      <div style={{ marginBottom: '1.5rem' }}>
        <label className="form-label" style={{ fontWeight: '600', color: '#374151', marginBottom: '1rem' }}>
          💳 Ciclo de Cobrança
        </label>
        <div className="row g-2">
          <div className="col-4">
            <button
              type="button"
              onClick={() => onBillingCycleChange("weekly")}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: billingCycle === "weekly" ? '2px solid #3b82f6' : '2px solid #e5e7eb',
                borderRadius: '12px',
                background: billingCycle === "weekly" ? 'rgba(59, 130, 246, 0.1)' : 'white',
                color: billingCycle === "weekly" ? '#3b82f6' : '#6b7280',
                fontWeight: billingCycle === "weekly" ? '700' : '500',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              <div style={{ fontSize: '1.2rem', marginBottom: '0.25rem' }}>📅</div>
              <div style={{ fontSize: '0.9rem' }}>Semanal</div>
              <div style={{ fontSize: '1.1rem', fontWeight: '800' }}>
                R$ {getPlanPrice('weekly')}
              </div>
            </button>
          </div>
          <div className="col-4">
            <button
              type="button"
              onClick={() => onBillingCycleChange("monthly")}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: billingCycle === "monthly" ? '2px solid #3b82f6' : '2px solid #e5e7eb',
                borderRadius: '12px',
                background: billingCycle === "monthly" ? 'rgba(59, 130, 246, 0.1)' : 'white',
                color: billingCycle === "monthly" ? '#3b82f6' : '#6b7280',
                fontWeight: billingCycle === "monthly" ? '700' : '500',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                position: 'relative'
              }}
            >
              <div style={{
                position: 'absolute',
                top: '-8px',
                right: '-8px',
                background: '#10b981',
                color: 'white',
                fontSize: '0.7rem',
                padding: '2px 6px',
                borderRadius: '8px',
                fontWeight: '700'
              }}>
                POPULAR
              </div>
              <div style={{ fontSize: '1.2rem', marginBottom: '0.25rem' }}>🗓️</div>
              <div style={{ fontSize: '0.9rem' }}>Mensal</div>
              <div style={{ fontSize: '1.1rem', fontWeight: '800' }}>
                R$ {getPlanPrice('monthly')}
              </div>
            </button>
          </div>
          <div className="col-4">
            <button
              type="button"
              onClick={() => onBillingCycleChange("annual")}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: billingCycle === "annual" ? '2px solid #3b82f6' : '2px solid #e5e7eb',
                borderRadius: '12px',
                background: billingCycle === "annual" ? 'rgba(59, 130, 246, 0.1)' : 'white',
                color: billingCycle === "annual" ? '#3b82f6' : '#6b7280',
                fontWeight: billingCycle === "annual" ? '700' : '500',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                position: 'relative'
              }}
            >
              <div style={{
                position: 'absolute',
                top: '-8px',
                right: '-8px',
                background: '#f59e0b',
                color: 'white',
                fontSize: '0.7rem',
                padding: '2px 6px',
                borderRadius: '8px',
                fontWeight: '700'
              }}>
                -17%
              </div>
              <div style={{ fontSize: '1.2rem', marginBottom: '0.25rem' }}>📆</div>
              <div style={{ fontSize: '0.9rem' }}>Anual</div>
              <div style={{ fontSize: '1.1rem', fontWeight: '800' }}>
                R$ {getPlanPrice('annual')}
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Seção de Cupom */}
      <div 
        style={{
          background: 'rgba(59, 130, 246, 0.05)',
          border: '1px solid rgba(59, 130, 246, 0.2)',
          borderRadius: '16px',
          padding: '1.5rem'
        }}
      >
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          marginBottom: '1rem'
        }}>
          <span style={{ fontSize: '1.5rem' }}>🎟️</span>
          <h6 style={{ 
            color: '#1e293b', 
            fontWeight: '700', 
            margin: 0,
            fontSize: '1.1rem'
          }}>
            Tem um cupom de desconto?
          </h6>
        </div>

        {!appliedCoupon ? (
          <div>
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
              <div style={{ flex: 1 }}>
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  placeholder="Digite o código do cupom"
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    border: '2px solid #e5e7eb',
                    borderRadius: '12px',
                    fontSize: '1rem',
                    fontWeight: '600',
                    letterSpacing: '1px',
                    textTransform: 'uppercase'
                  }}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      applyCoupon();
                    }
                  }}
                />
              </div>
              <button
                type="button"
                onClick={applyCoupon}
                disabled={loading || !couponCode.trim()}
                style={{
                  background: loading || !couponCode.trim()
                    ? 'rgba(100, 116, 139, 0.5)'
                    : 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '0.75rem 1.5rem',
                  fontWeight: '700',
                  cursor: loading || !couponCode.trim() ? 'not-allowed' : 'pointer',
                  minWidth: '120px',
                  boxShadow: loading || !couponCode.trim() 
                    ? 'none' 
                    : '0 4px 15px rgba(59, 130, 246, 0.3)'
                }}
              >
                {loading ? 'Validando...' : 'Aplicar'}
              </button>
            </div>

            {error && (
              <div style={{
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: '8px',
                padding: '0.75rem',
                color: '#dc2626',
                fontSize: '0.9rem',
                fontWeight: '600'
              }}>
                ❌ {error}
              </div>
            )}

            <div style={{
              background: 'rgba(16, 185, 129, 0.1)',
              border: '1px solid rgba(16, 185, 129, 0.2)',
              borderRadius: '8px',
              padding: '1rem',
              marginTop: '1rem'
            }}>
              <div style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>💡</div>
              <h6 style={{ color: '#065f46', fontWeight: '700', marginBottom: '0.5rem' }}>
                Tipos de cupons disponíveis:
              </h6>
              <ul style={{ 
                color: '#047857', 
                fontSize: '0.9rem',
                margin: 0,
                paddingLeft: '1.2rem'
              }}>
                <li>🎁 <strong>Trial Gratuito</strong> - Período adicional grátis</li>
                <li>💰 <strong>Desconto Fixo</strong> - Valor em reais de desconto</li>
                <li>📊 <strong>Desconto Percentual</strong> - Porcentagem de desconto</li>
                <li>🔄 <strong>Desconto Recorrente</strong> - Desconto por alguns meses</li>
              </ul>
            </div>
          </div>
        ) : (
          <div>
            {/* Cupom Aplicado */}
            <div style={{
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              color: 'white',
              borderRadius: '12px',
              padding: '1.5rem',
              marginBottom: '1rem'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '1.5rem' }}>✅</span>
                    <h6 style={{ margin: 0, fontWeight: '800' }}>
                      Cupom Aplicado: {appliedCoupon.coupon.code}
                    </h6>
                  </div>
                  <p style={{ margin: 0, opacity: 0.9, fontSize: '0.9rem' }}>
                    {appliedCoupon.coupon.title}
                  </p>
                  <p style={{ margin: 0, opacity: 0.8, fontSize: '0.85rem', marginTop: '0.25rem' }}>
                    {appliedCoupon.coupon.description}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={removeCoupon}
                  style={{
                    background: 'rgba(255, 255, 255, 0.2)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    borderRadius: '8px',
                    color: 'white',
                    padding: '0.5rem',
                    cursor: 'pointer',
                    fontSize: '0.8rem'
                  }}
                >
                  ❌ Remover
                </button>
              </div>
            </div>

            {/* Resumo do Desconto */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.8)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              borderRadius: '12px',
              padding: '1rem'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ color: '#6b7280' }}>Preço original:</span>
                <span style={{ 
                  textDecoration: 'line-through', 
                  color: '#6b7280',
                  fontWeight: '600'
                }}>
                  R$ {appliedCoupon.originalPrice.toFixed(2)}
                </span>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ color: '#10b981', fontWeight: '600' }}>Desconto:</span>
                <span style={{ color: '#10b981', fontWeight: '700' }}>
                  - R$ {appliedCoupon.discount.toFixed(2)}
                </span>
              </div>

              {appliedCoupon.trialDays > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ color: '#3b82f6', fontWeight: '600' }}>Trial gratuito:</span>
                  <span style={{ color: '#3b82f6', fontWeight: '700' }}>
                    {appliedCoupon.trialDays} dias
                  </span>
                </div>
              )}

              <div style={{
                borderTop: '2px solid rgba(16, 185, 129, 0.2)',
                paddingTop: '0.5rem',
                display: 'flex',
                justifyContent: 'space-between'
              }}>
                <span style={{ color: '#1e293b', fontWeight: '700', fontSize: '1.1rem' }}>
                  Total:
                </span>
                <span style={{ 
                  color: '#10b981', 
                  fontWeight: '800', 
                  fontSize: '1.3rem'
                }}>
                  {appliedCoupon.finalPrice === 0 ? 'GRATUITO' : `R$ ${appliedCoupon.finalPrice.toFixed(2)}`}
                </span>
              </div>

              {appliedCoupon.coupon.discountDuration > 1 && (
                <div style={{
                  background: 'rgba(59, 130, 246, 0.1)',
                  border: '1px solid rgba(59, 130, 246, 0.2)',
                  borderRadius: '8px',
                  padding: '0.75rem',
                  marginTop: '1rem',
                  fontSize: '0.9rem'
                }}>
                  <strong style={{ color: '#3b82f6' }}>ℹ️ Importante:</strong>
                  <span style={{ color: '#1e293b', marginLeft: '0.5rem' }}>
                    Este desconto será aplicado por {appliedCoupon.coupon.discountDuration} meses.
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}