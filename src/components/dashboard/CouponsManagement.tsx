"use client";

import { useState, useEffect } from "react";

interface Coupon {
  id: string;
  code: string;
  title: string;
  description: string;
  type: "percent" | "amount" | "free_trial" | "subscription_discount";
  category: "order" | "subscription";
  value: number;
  subscriptionPlan?: "basic" | "pro" | "ultra";
  discountDuration: number;
  freeTrialDays: number;
  startsAt: string;
  endsAt: string;
  maxUses: number;
  usedCount: number;
  active: boolean;
  createdAt: string;
}

export default function CouponsManagement() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [activeTab, setActiveTab] = useState<"order" | "subscription">("subscription");

  const [formData, setFormData] = useState({
    code: "",
    title: "",
    description: "",
    type: "percent",
    category: "subscription",
    value: "",
    subscriptionPlan: "basic",
    discountDuration: "1",
    freeTrialDays: "",
    startsAt: "",
    endsAt: "",
    maxUses: "0",
    minOrderTotal: "0"
  });

  // Carregar cupons
  const loadCoupons = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/coupons?category=${activeTab}`);
      const data = await response.json();
      if (data.success) {
        setCoupons(data.coupons);
      }
    } catch (error) {
      console.error("Erro ao carregar cupons:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadCoupons();
  }, [activeTab]);

  // Criar cupom
  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/coupons", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          value: parseFloat(formData.value),
          discountDuration: parseInt(formData.discountDuration),
          freeTrialDays: formData.freeTrialDays ? parseInt(formData.freeTrialDays) : 0,
          maxUses: parseInt(formData.maxUses),
          minOrderTotal: parseFloat(formData.minOrderTotal || "0"),
          createdBy: "owner-user-id" // TODO: pegar do contexto de auth
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        alert("Cupom criado com sucesso!");
        setShowCreateForm(false);
        setFormData({
          code: "",
          title: "",
          description: "",
          type: "percent",
          category: "subscription",
          value: "",
          subscriptionPlan: "basic",
          discountDuration: "1",
          freeTrialDays: "",
          startsAt: "",
          endsAt: "",
          maxUses: "0",
          minOrderTotal: "0"
        });
        loadCoupons();
      } else {
        alert("Erro ao criar cupom: " + data.error);
      }
    } catch (error) {
      alert("Erro ao criar cupom");
      console.error(error);
    }
    setLoading(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR");
  };

  const getTypeLabel = (type: string) => {
    const labels = {
      percent: "Porcentagem",
      amount: "Valor Fixo",
      free_trial: "Trial Gratuito",
      subscription_discount: "Desconto Assinatura"
    };
    return labels[type as keyof typeof labels] || type;
  };

  const getPlanLabel = (plan?: string) => {
    const labels = {
      basic: "Básico",
      pro: "Profissional",
      ultra: "Ultra"
    };
    return plan ? labels[plan as keyof typeof labels] || plan : "Todos";
  };

  return (
    <section style={{ marginBottom: '40px' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '25px'
      }}>
        <h2 style={{
          color: '#1E293B',
          fontSize: '1.5rem',
          margin: 0,
          fontWeight: 'bold'
        }}>
          🎟️ Gerenciador de Cupons Promocionais
        </h2>
        
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          style={{
            background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
            color: 'white',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '12px',
            cursor: 'pointer',
            fontWeight: 'bold',
            boxShadow: '0 10px 25px rgba(16, 185, 129, 0.3)'
          }}
        >
          {showCreateForm ? '❌ Cancelar' : '➕ Criar Novo Cupom'}
        </button>
      </div>

      {/* Tabs */}
      <div style={{
        display: 'flex',
        gap: '10px',
        marginBottom: '25px'
      }}>
        <button
          onClick={() => setActiveTab("subscription")}
          style={{
            background: activeTab === "subscription" 
              ? 'linear-gradient(135deg, #3B82F6 0%, #06B6D4 100%)' 
              : 'rgba(255, 255, 255, 0.9)',
            color: activeTab === "subscription" ? 'white' : '#64748B',
            border: '1px solid rgba(59, 130, 246, 0.2)',
            padding: '12px 24px',
            borderRadius: '12px',
            cursor: 'pointer',
            fontWeight: 'bold',
            backdropFilter: 'blur(20px)',
            boxShadow: activeTab === "subscription" 
              ? '0 10px 25px rgba(59, 130, 246, 0.3)' 
              : '0 5px 15px rgba(0, 0, 0, 0.1)'
          }}
        >
          💳 Cupons de Assinatura
        </button>
        
        <button
          onClick={() => setActiveTab("order")}
          style={{
            background: activeTab === "order" 
              ? 'linear-gradient(135deg, #F59E0B 0%, #EAB308 100%)' 
              : 'rgba(255, 255, 255, 0.9)',
            color: activeTab === "order" ? 'white' : '#64748B',
            border: '1px solid rgba(245, 158, 11, 0.2)',
            padding: '12px 24px',
            borderRadius: '12px',
            cursor: 'pointer',
            fontWeight: 'bold',
            backdropFilter: 'blur(20px)',
            boxShadow: activeTab === "order" 
              ? '0 10px 25px rgba(245, 158, 11, 0.3)' 
              : '0 5px 15px rgba(0, 0, 0, 0.1)'
          }}
        >
          🛍️ Cupons de Pedidos
        </button>
      </div>

      {/* Formulário de Criação */}
      {showCreateForm && (
        <div style={{
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          borderRadius: '20px',
          padding: '30px',
          marginBottom: '30px',
          boxShadow: '0 25px 50px rgba(16, 185, 129, 0.1)'
        }}>
          <h3 style={{
            color: '#10B981',
            fontSize: '1.3rem',
            marginBottom: '25px',
            fontWeight: 'bold'
          }}>
            ✨ Criar Novo Cupom Promocional
          </h3>

          <form onSubmit={handleCreateCoupon}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '20px',
              marginBottom: '25px'
            }}>
              {/* Código do Cupom */}
              <div>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  fontWeight: 'bold', 
                  color: '#1E293B' 
                }}>
                  🎫 Código do Cupom
                </label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) => setFormData({...formData, code: e.target.value.toUpperCase()})}
                  placeholder="Ex: DESCONTO50"
                  required
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid rgba(16, 185, 129, 0.3)',
                    borderRadius: '12px',
                    fontSize: '1rem',
                    background: 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(10px)'
                  }}
                />
              </div>

              {/* Título */}
              <div>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  fontWeight: 'bold', 
                  color: '#1E293B' 
                }}>
                  📝 Título da Promoção
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="Ex: Desconto de Lançamento"
                  required
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid rgba(16, 185, 129, 0.3)',
                    borderRadius: '12px',
                    fontSize: '1rem',
                    background: 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(10px)'
                  }}
                />
              </div>

              {/* Categoria */}
              <div>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  fontWeight: 'bold', 
                  color: '#1E293B' 
                }}>
                  📂 Categoria
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid rgba(16, 185, 129, 0.3)',
                    borderRadius: '12px',
                    fontSize: '1rem',
                    background: 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(10px)'
                  }}
                >
                  <option value="subscription">💳 Assinatura</option>
                  <option value="order">🛍️ Pedidos</option>
                </select>
              </div>

              {/* Tipo */}
              <div>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  fontWeight: 'bold', 
                  color: '#1E293B' 
                }}>
                  🎯 Tipo de Desconto
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid rgba(16, 185, 129, 0.3)',
                    borderRadius: '12px',
                    fontSize: '1rem',
                    background: 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(10px)'
                  }}
                >
                  <option value="percent">📊 Porcentagem</option>
                  <option value="amount">💰 Valor Fixo</option>
                  {formData.category === "subscription" && (
                    <>
                      <option value="free_trial">🆓 Trial Gratuito</option>
                      <option value="subscription_discount">🎟️ Desconto Recorrente</option>
                    </>
                  )}
                </select>
              </div>

              {/* Valor */}
              <div>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  fontWeight: 'bold', 
                  color: '#1E293B' 
                }}>
                  💵 Valor {formData.type === "percent" ? "(%)": "(R$)"}
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.value}
                  onChange={(e) => setFormData({...formData, value: e.target.value})}
                  placeholder={formData.type === "percent" ? "Ex: 50" : "Ex: 25.00"}
                  required
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid rgba(16, 185, 129, 0.3)',
                    borderRadius: '12px',
                    fontSize: '1rem',
                    background: 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(10px)'
                  }}
                />
              </div>

              {/* Plano (só para assinatura) */}
              {formData.category === "subscription" && (
                <div>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '8px', 
                    fontWeight: 'bold', 
                    color: '#1E293B' 
                  }}>
                    📋 Plano de Assinatura
                  </label>
                  <select
                    value={formData.subscriptionPlan}
                    onChange={(e) => setFormData({...formData, subscriptionPlan: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid rgba(16, 185, 129, 0.3)',
                      borderRadius: '12px',
                      fontSize: '1rem',
                      background: 'rgba(255, 255, 255, 0.9)',
                      backdropFilter: 'blur(10px)'
                    }}
                  >
                    <option value="basic">📱 Básico</option>
                    <option value="pro">🚀 Profissional</option>
                    <option value="ultra">⚡ Ultra</option>
                  </select>
                </div>
              )}

              {/* Data de Início */}
              <div>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  fontWeight: 'bold', 
                  color: '#1E293B' 
                }}>
                  📅 Data de Início
                </label>
                <input
                  type="datetime-local"
                  value={formData.startsAt}
                  onChange={(e) => setFormData({...formData, startsAt: e.target.value})}
                  required
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid rgba(16, 185, 129, 0.3)',
                    borderRadius: '12px',
                    fontSize: '1rem',
                    background: 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(10px)'
                  }}
                />
              </div>

              {/* Data de Fim */}
              <div>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  fontWeight: 'bold', 
                  color: '#1E293B' 
                }}>
                  🏁 Data de Fim
                </label>
                <input
                  type="datetime-local"
                  value={formData.endsAt}
                  onChange={(e) => setFormData({...formData, endsAt: e.target.value})}
                  required
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid rgba(16, 185, 129, 0.3)',
                    borderRadius: '12px',
                    fontSize: '1rem',
                    background: 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(10px)'
                  }}
                />
              </div>

              {/* Limite de Usos */}
              <div>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  fontWeight: 'bold', 
                  color: '#1E293B' 
                }}>
                  🔢 Limite de Usos (0 = ilimitado)
                </label>
                <input
                  type="number"
                  value={formData.maxUses}
                  onChange={(e) => setFormData({...formData, maxUses: e.target.value})}
                  placeholder="0"
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid rgba(16, 185, 129, 0.3)',
                    borderRadius: '12px',
                    fontSize: '1rem',
                    background: 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(10px)'
                  }}
                />
              </div>

              {/* Trial Days (só para free_trial) */}
              {formData.type === "free_trial" && (
                <div>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '8px', 
                    fontWeight: 'bold', 
                    color: '#1E293B' 
                  }}>
                    🎁 Dias de Trial Gratuito
                  </label>
                  <input
                    type="number"
                    value={formData.freeTrialDays}
                    onChange={(e) => setFormData({...formData, freeTrialDays: e.target.value})}
                    placeholder="Ex: 30"
                    required
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid rgba(16, 185, 129, 0.3)',
                      borderRadius: '12px',
                      fontSize: '1rem',
                      background: 'rgba(255, 255, 255, 0.9)',
                      backdropFilter: 'blur(10px)'
                    }}
                  />
                </div>
              )}
            </div>

            {/* Descrição */}
            <div style={{ marginBottom: '25px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '8px', 
                fontWeight: 'bold', 
                color: '#1E293B' 
              }}>
                📄 Descrição da Promoção
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Descreva os detalhes desta promoção..."
                required
                rows={3}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  borderRadius: '12px',
                  fontSize: '1rem',
                  background: 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(10px)',
                  resize: 'vertical'
                }}
              />
            </div>

            {/* Botões */}
            <div style={{
              display: 'flex',
              gap: '15px',
              justifyContent: 'flex-end'
            }}>
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                style={{
                  background: 'rgba(239, 68, 68, 0.1)',
                  color: '#DC2626',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  padding: '12px 24px',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
              >
                ❌ Cancelar
              </button>
              
              <button
                type="submit"
                disabled={loading}
                style={{
                  background: loading 
                    ? 'rgba(100, 116, 139, 0.5)' 
                    : 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                  color: 'white',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '12px',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  fontWeight: 'bold',
                  boxShadow: loading 
                    ? 'none' 
                    : '0 10px 25px rgba(16, 185, 129, 0.3)'
                }}
              >
                {loading ? '⏳ Criando...' : '✅ Criar Cupom'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Lista de Cupons */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(59, 130, 246, 0.2)',
        borderRadius: '20px',
        padding: '25px',
        boxShadow: '0 25px 50px rgba(0, 0, 0, 0.1)'
      }}>
        <h3 style={{
          color: '#1E293B',
          fontSize: '1.2rem',
          marginBottom: '20px',
          fontWeight: 'bold'
        }}>
          📋 Cupons {activeTab === "subscription" ? "de Assinatura" : "de Pedidos"}
        </h3>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#64748B' }}>
            ⏳ Carregando cupons...
          </div>
        ) : coupons.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#64748B' }}>
            🎫 Nenhum cupom encontrado. Crie seu primeiro cupom!
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
            gap: '20px'
          }}>
            {coupons.map((coupon) => (
              <div
                key={coupon.id}
                style={{
                  background: 'rgba(255, 255, 255, 0.8)',
                  border: `2px solid ${coupon.active ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
                  borderRadius: '16px',
                  padding: '20px',
                  position: 'relative',
                  boxShadow: '0 10px 25px rgba(0, 0, 0, 0.05)'
                }}
              >
                {/* Status Badge */}
                <div style={{
                  position: 'absolute',
                  top: '15px',
                  right: '15px',
                  background: coupon.active 
                    ? 'linear-gradient(135deg, #10B981 0%, #059669 100%)' 
                    : 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
                  color: 'white',
                  padding: '4px 12px',
                  borderRadius: '12px',
                  fontSize: '0.75rem',
                  fontWeight: 'bold'
                }}>
                  {coupon.active ? '✅ Ativo' : '❌ Inativo'}
                </div>

                {/* Código */}
                <div style={{
                  background: 'linear-gradient(135deg, #3B82F6 0%, #06B6D4 100%)',
                  color: 'white',
                  padding: '8px 16px',
                  borderRadius: '12px',
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  marginBottom: '15px',
                  textAlign: 'center',
                  letterSpacing: '2px'
                }}>
                  {coupon.code}
                </div>

                {/* Título */}
                <h4 style={{
                  color: '#1E293B',
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  marginBottom: '8px'
                }}>
                  {coupon.title}
                </h4>

                {/* Descrição */}
                <p style={{
                  color: '#64748B',
                  fontSize: '0.9rem',
                  marginBottom: '15px',
                  lineHeight: '1.4'
                }}>
                  {coupon.description}
                </p>

                {/* Detalhes */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '10px',
                  marginBottom: '15px',
                  fontSize: '0.85rem'
                }}>
                  <div>
                    <strong style={{ color: '#1E293B' }}>Tipo:</strong>
                    <br />
                    <span style={{ color: '#64748B' }}>{getTypeLabel(coupon.type)}</span>
                  </div>
                  
                  <div>
                    <strong style={{ color: '#1E293B' }}>Valor:</strong>
                    <br />
                    <span style={{ color: '#10B981', fontWeight: 'bold' }}>
                      {coupon.type === "percent" ? `${coupon.value}%` : `R$ ${coupon.value}`}
                    </span>
                  </div>

                  {coupon.subscriptionPlan && (
                    <div>
                      <strong style={{ color: '#1E293B' }}>Plano:</strong>
                      <br />
                      <span style={{ color: '#64748B' }}>{getPlanLabel(coupon.subscriptionPlan)}</span>
                    </div>
                  )}

                  <div>
                    <strong style={{ color: '#1E293B' }}>Usos:</strong>
                    <br />
                    <span style={{ color: '#64748B' }}>
                      {coupon.usedCount} / {coupon.maxUses === 0 ? '∞' : coupon.maxUses}
                    </span>
                  </div>
                </div>

                {/* Datas */}
                <div style={{
                  background: 'rgba(59, 130, 246, 0.1)',
                  border: '1px solid rgba(59, 130, 246, 0.2)',
                  borderRadius: '8px',
                  padding: '10px',
                  fontSize: '0.8rem'
                }}>
                  <div style={{ marginBottom: '5px' }}>
                    <strong>📅 Início:</strong> {formatDate(coupon.startsAt)}
                  </div>
                  <div>
                    <strong>🏁 Fim:</strong> {formatDate(coupon.endsAt)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}