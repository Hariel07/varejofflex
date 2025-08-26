"use client";

import Link from "next/link";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import CouponSection from "@/components/CouponSection";
import { usePlans } from "@/hooks/usePlans";
import PasswordStrength from "@/components/PasswordStrength";

// Função para validar força da senha
function validatePasswordStrength(password: string): { isValid: boolean; message: string } {
  if (password.length < 8) {
    return { isValid: false, message: 'A senha deve ter pelo menos 8 caracteres' };
  }
  if (!/[A-Z]/.test(password)) {
    return { isValid: false, message: 'A senha deve conter pelo menos uma letra maiúscula' };
  }
  if (!/[a-z]/.test(password)) {
    return { isValid: false, message: 'A senha deve conter pelo menos uma letra minúscula' };
  }
  if (!/\d/.test(password)) {
    return { isValid: false, message: 'A senha deve conter pelo menos um número' };
  }
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    return { isValid: false, message: 'A senha deve conter pelo menos um caractere especial' };
  }
  return { isValid: true, message: 'Senha forte' };
}

// Hook para formatação e validação automática
function useSmartForm() {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    cpfCnpj: '',
    empresa: '',
    cep: '',
    cidade: '',
    estado: '',
    endereco: '',
    numero: '',
    bairro: '',
    segmento: '',
    senha: '',
    confirmSenha: ''
  });

  const [loading, setLoading] = useState({
    cep: false
  });

  const [countryCode, setCountryCode] = useState('+55');

  // Auto-detectar país baseado na localização
  useEffect(() => {
    // Detectar timezone para definir país
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (timezone.includes('Brazil') || timezone.includes('Sao_Paulo')) {
      setCountryCode('+55');
    }
    // Adicionar mais países conforme necessário
  }, []);

  // Formatação automática de telefone
  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    
    if (numbers.length <= 2) {
      return numbers;
    } else if (numbers.length <= 6) {
      return `(${numbers.slice(0, 3)}) ${numbers.slice(3)}`;
    } else if (numbers.length <= 10) {
      return `(${numbers.slice(0, 3)}) ${numbers.slice(3, 7)}-${numbers.slice(7)}`;
    } else {
      return `(${numbers.slice(0, 3)}) ${numbers.slice(3, 8)}-${numbers.slice(8, 12)}`;
    }
  };

  // Formatação automática de CPF/CNPJ
  const formatCpfCnpj = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    
    if (numbers.length <= 11) {
      // CPF: 000.000.000-00
      if (numbers.length <= 3) return numbers;
      if (numbers.length <= 6) return `${numbers.slice(0, 3)}.${numbers.slice(3)}`;
      if (numbers.length <= 9) return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6)}`;
      return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6, 9)}-${numbers.slice(9, 11)}`;
    } else {
      // CNPJ: 00.000.000/0000-00
      if (numbers.length <= 2) return numbers;
      if (numbers.length <= 5) return `${numbers.slice(0, 2)}.${numbers.slice(2)}`;
      if (numbers.length <= 8) return `${numbers.slice(0, 2)}.${numbers.slice(2, 5)}.${numbers.slice(5)}`;
      if (numbers.length <= 12) return `${numbers.slice(0, 2)}.${numbers.slice(2, 5)}.${numbers.slice(5, 8)}/${numbers.slice(8)}`;
      return `${numbers.slice(0, 2)}.${numbers.slice(2, 5)}.${numbers.slice(5, 8)}/${numbers.slice(8, 12)}-${numbers.slice(12, 14)}`;
    }
  };

  // Formatação automática de CEP
  const formatCep = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 5) return numbers;
    return `${numbers.slice(0, 5)}-${numbers.slice(5, 8)}`;
  };

  // Buscar endereço por CEP
  const fetchAddressByCep = async (cep: string) => {
    const cleanCep = cep.replace(/\D/g, '');
    if (cleanCep.length !== 8) return;

    setLoading(prev => ({ ...prev, cep: true }));
    
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
      const data = await response.json();
      
      if (!data.erro) {
        setFormData(prev => ({
          ...prev,
          cidade: data.localidade || '',
          estado: data.uf || '',
          endereco: data.logradouro || '',
          bairro: data.bairro || ''
        }));
      }
    } catch (error) {
      console.error('Erro ao buscar CEP:', error);
    } finally {
      setLoading(prev => ({ ...prev, cep: false }));
    }
  };

  const updateField = (field: string, value: string) => {
    let formattedValue = value;

    switch (field) {
      case 'telefone':
        formattedValue = formatPhone(value);
        break;
      case 'cpfCnpj':
        formattedValue = formatCpfCnpj(value);
        break;
      case 'cep':
        formattedValue = formatCep(value);
        if (value.replace(/\D/g, '').length === 8) {
          fetchAddressByCep(formattedValue);
        }
        break;
    }

    setFormData(prev => ({
      ...prev,
      [field]: formattedValue
    }));
  };

  return {
    formData,
    loading,
    countryCode,
    updateField
  };
}

function RegisterContent() {
  const searchParams = useSearchParams();
  const selectedPlanId = searchParams.get('plan');
  const billingParam = searchParams.get('billing');
  const [showOwnerOption, setShowOwnerOption] = useState(false);
  const [loading, setLoading] = useState(true);
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [billingCycle, setBillingCycle] = useState<'weekly' | 'monthly' | 'annual'>(() => {
    // Define o ciclo inicial baseado no parâmetro da URL
    if (billingParam === 'weekly') return 'weekly';
    if (billingParam === 'annual') return 'annual';
    return 'monthly'; // padrão
  });

  const { plans, loading: plansLoading, error: plansError } = usePlans();
  const selectedPlan = plans.find(plan => plan.planId === selectedPlanId);
  const { formData, loading: formLoading, countryCode, updateField } = useSmartForm();

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar força da senha
    const passwordValidation = validatePasswordStrength(formData.senha);
    if (!passwordValidation.isValid) {
      alert(passwordValidation.message);
      return;
    }

    // Validar confirmação de senha
    if (formData.senha !== formData.confirmSenha) {
      alert('As senhas não coincidem');
      return;
    }
    
    // Aqui você implementaria a lógica de cadastro
    console.log('Dados do formulário:', {
      ...formData,
      telefone: `${countryCode} ${formData.telefone}`,
      plano: selectedPlanId
    });
  };

  if (loading || plansLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando planos...</p>
        </div>
      </div>
    );
  }

  if (plansError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
            <p className="text-yellow-800">Erro ao carregar informações dos planos: {plansError}</p>
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
      <div 
        className="min-vh-100"
        style={{ 
          background: 'linear-gradient(135deg, #F8FAFC 0%, #E2E8F0 100%)',
          position: 'relative'
        }}
      >
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

              {/* Layout Principal - Formulário + Resumo */}
              <div className="row g-5">
                {/* Resumo do Plano - Lado Esquerdo */}
                <div className="col-lg-4">
                  <div 
                    style={{
                      background: 'rgba(255, 255, 255, 0.95)',
                      backdropFilter: 'blur(30px)',
                      borderRadius: '24px',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      boxShadow: '0 20px 60px rgba(0, 0, 0, 0.1)',
                      padding: '2rem',
                      position: 'sticky',
                      top: '2rem'
                    }}
                  >
                    <div className="text-center mb-4">
                      <div style={{ 
                        fontSize: '3rem', 
                        marginBottom: '1rem',
                        filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1))'
                      }}>
                        🚀
                      </div>
                      <h3 style={{ color: '#1e293b', fontWeight: '800', marginBottom: '1rem' }}>
                        Plano Selecionado
                      </h3>
                      <div 
                        className="badge mb-3"
                        style={{
                          background: selectedPlan.color,
                          color: 'white',
                          fontSize: '1.1rem',
                          padding: '0.75rem 1.5rem',
                          borderRadius: '50px',
                          fontWeight: '600'
                        }}
                      >
                        {selectedPlan.name}
                      </div>
                      <p style={{ color: '#6b7280', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
                        {selectedPlan.description}
                      </p>
                      
                      <div 
                        style={{
                          background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
                          borderRadius: '16px',
                          padding: '1.5rem',
                          marginBottom: '1.5rem'
                        }}
                      >
                        <div style={{ 
                          fontSize: '2.5rem', 
                          fontWeight: '800',
                          color: selectedPlan.color,
                          marginBottom: '0.5rem'
                        }}>
                          R$ {originalPrice?.toFixed(2) || '0,00'}
                        </div>
                        <div style={{ color: '#6b7280', fontSize: '0.9rem' }}>
                          por {billingCycle === 'weekly' ? 'semana' : billingCycle === 'monthly' ? 'mês' : 'ano'}
                        </div>
                      </div>
                    </div>

                    <div className="mb-4">
                      <h5 style={{ color: '#374151', fontWeight: '700', marginBottom: '1rem' }}>
                        ✨ Incluído no plano:
                      </h5>
                      <div className="d-flex align-items-center mb-2">
                        <div 
                          style={{ 
                            width: '8px', 
                            height: '8px', 
                            backgroundColor: '#10b981', 
                            borderRadius: '50%', 
                            marginRight: '12px' 
                          }}
                        ></div>
                        <span style={{ color: '#374151', fontSize: '0.9rem' }}>
                          {selectedPlan.trialDays} dias grátis
                        </span>
                      </div>
                      <div className="d-flex align-items-center mb-2">
                        <div 
                          style={{ 
                            width: '8px', 
                            height: '8px', 
                            backgroundColor: '#10b981', 
                            borderRadius: '50%', 
                            marginRight: '12px' 
                          }}
                        ></div>
                        <span style={{ color: '#374151', fontSize: '0.9rem' }}>
                          Configuração em 5 minutos
                        </span>
                      </div>
                      <div className="d-flex align-items-center mb-2">
                        <div 
                          style={{ 
                            width: '8px', 
                            height: '8px', 
                            backgroundColor: '#10b981', 
                            borderRadius: '50%', 
                            marginRight: '12px' 
                          }}
                        ></div>
                        <span style={{ color: '#374151', fontSize: '0.9rem' }}>
                          Suporte técnico incluído
                        </span>
                      </div>
                      <div className="d-flex align-items-center">
                        <div 
                          style={{ 
                            width: '8px', 
                            height: '8px', 
                            backgroundColor: '#10b981', 
                            borderRadius: '50%', 
                            marginRight: '12px' 
                          }}
                        ></div>
                        <span style={{ color: '#374151', fontSize: '0.9rem' }}>
                          Sem fidelidade
                        </span>
                      </div>
                    </div>

                    <div 
                      className="text-center p-3"
                      style={{
                        background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)',
                        borderRadius: '12px',
                        border: '1px solid rgba(59, 130, 246, 0.2)'
                      }}
                    >
                      <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>🔒</div>
                      <small style={{ color: '#1e40af', fontWeight: '600' }}>
                        Dados protegidos com SSL
                      </small>
                    </div>
                  </div>
                </div>

                {/* Formulário - Lado Direito */}
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
                    <form onSubmit={handleSubmit}>
                      {/* Dados Pessoais */}
                      <div className="mb-5">
                        <h4 
                          style={{ 
                            color: '#1e293b', 
                            fontWeight: '800', 
                            marginBottom: '2rem',
                            borderBottom: '3px solid #e5e7eb',
                            paddingBottom: '0.75rem',
                            display: 'flex',
                            alignItems: 'center'
                          }}
                        >
                          <span style={{ marginRight: '12px', fontSize: '1.5rem' }}>👤</span>
                          Dados Pessoais
                        </h4>
                        
                        <div className="row g-4">
                          <div className="col-md-6">
                            <label className="form-label" style={{ fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                              Nome Completo *
                            </label>
                            <input
                              type="text"
                              value={formData.nome}
                              onChange={(e) => updateField('nome', e.target.value)}
                              className="form-control form-control-lg"
                              style={{
                                border: '2px solid #e5e7eb',
                                borderRadius: '12px',
                                padding: '1rem',
                                fontSize: '1rem',
                                transition: 'all 0.3s ease'
                              }}
                              placeholder="Seu nome completo"
                              required
                            />
                          </div>
                          
                          <div className="col-md-6">
                            <label className="form-label" style={{ fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                              Email *
                            </label>
                            <input
                              type="email"
                              value={formData.email}
                              onChange={(e) => updateField('email', e.target.value)}
                              className="form-control form-control-lg"
                              style={{
                                border: '2px solid #e5e7eb',
                                borderRadius: '12px',
                                padding: '1rem',
                                fontSize: '1rem',
                                transition: 'all 0.3s ease'
                              }}
                              placeholder="seu@email.com"
                              required
                            />
                          </div>
                          
                          <div className="col-md-6">
                            <label className="form-label" style={{ fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                              Telefone *
                            </label>
                            <div className="input-group">
                              <select 
                                value={countryCode}
                                className="form-select"
                                style={{
                                  border: '2px solid #e5e7eb',
                                  borderRadius: '12px 0 0 12px',
                                  width: '120px',
                                  minWidth: '120px',
                                  maxWidth: '120px',
                                  background: '#f8fafc',
                                  fontSize: '0.9rem',
                                  flexShrink: 0
                                }}
                              >
                                <option value="+55">🇧🇷 +55</option>
                                <option value="+1">🇺🇸 +1</option>
                                <option value="+34">🇪🇸 +34</option>
                              </select>
                              <input
                                type="text"
                                value={formData.telefone}
                                onChange={(e) => updateField('telefone', e.target.value)}
                                className="form-control form-control-lg"
                                style={{
                                  border: '2px solid #e5e7eb',
                                  borderLeft: 'none',
                                  borderRadius: '0 12px 12px 0',
                                  padding: '1rem',
                                  fontSize: '1rem',
                                  flex: '1 1 auto'
                                }}
                                placeholder="(44) 99758-8758"
                                required
                              />
                            </div>
                            <small className="text-muted mt-1" style={{ fontSize: '0.8rem' }}>
                              Formato será ajustado automaticamente
                            </small>
                          </div>
                          
                          <div className="col-md-6">
                            <label className="form-label" style={{ fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                              CPF/CNPJ *
                            </label>
                            <input
                              type="text"
                              value={formData.cpfCnpj}
                              onChange={(e) => updateField('cpfCnpj', e.target.value)}
                              className="form-control form-control-lg"
                              style={{
                                border: '2px solid #e5e7eb',
                                borderRadius: '12px',
                                padding: '1rem',
                                fontSize: '1rem'
                              }}
                              placeholder="000.000.000-00 ou 00.000.000/0000-00"
                              required
                            />
                            <small className="text-muted mt-1" style={{ fontSize: '0.8rem' }}>
                              Digite apenas números - formatação automática
                            </small>
                          </div>
                        </div>
                      </div>

                      {/* Dados da Empresa */}
                      <div className="mb-5">
                        <h4 
                          style={{ 
                            color: '#1e293b', 
                            fontWeight: '800', 
                            marginBottom: '2rem',
                            borderBottom: '3px solid #e5e7eb',
                            paddingBottom: '0.75rem',
                            display: 'flex',
                            alignItems: 'center'
                          }}
                        >
                          <span style={{ marginRight: '12px', fontSize: '1.5rem' }}>🏢</span>
                          Dados da Empresa
                        </h4>
                        
                        <div className="row g-4">
                          <div className="col-12">
                            <label className="form-label" style={{ fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                              Nome da Empresa *
                            </label>
                            <input
                              type="text"
                              value={formData.empresa}
                              onChange={(e) => updateField('empresa', e.target.value)}
                              className="form-control form-control-lg"
                              style={{
                                border: '2px solid #e5e7eb',
                                borderRadius: '12px',
                                padding: '1rem',
                                fontSize: '1rem'
                              }}
                              placeholder="Nome da sua empresa"
                              required
                            />
                          </div>
                          
                          <div className="col-12">
                            <label className="form-label" style={{ fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                              Segmento *
                            </label>
                            <select
                              value={formData.segmento}
                              onChange={(e) => updateField('segmento', e.target.value)}
                              className="form-select form-select-lg"
                              style={{
                                border: '2px solid #e5e7eb',
                                borderRadius: '12px',
                                padding: '1rem',
                                fontSize: '1rem'
                              }}
                              required
                            >
                              <option value="">Selecione seu segmento</option>
                              <option value="alimentacao">🍔 Alimentação</option>
                              <option value="lanchonete">🌭 Lanchonete/Delivery</option>
                              <option value="pizzaria">🍕 Pizzaria</option>
                              <option value="moda">👗 Moda e Vestuário</option>
                              <option value="beleza">💄 Beleza e Estética</option>
                              <option value="saude">💊 Saúde e Farmácia</option>
                              <option value="pet">🐕 Pet Shop</option>
                              <option value="casa">🏠 Casa e Decoração</option>
                              <option value="tecnologia">💻 Tecnologia</option>
                              <option value="servicos">🔧 Serviços</option>
                              <option value="outros">📦 Outros</option>
                            </select>
                          </div>
                        </div>
                      </div>

                      {/* Endereço */}
                      <div className="mb-5">
                        <h4 
                          style={{ 
                            color: '#1e293b', 
                            fontWeight: '800', 
                            marginBottom: '2rem',
                            borderBottom: '3px solid #e5e7eb',
                            paddingBottom: '0.75rem',
                            display: 'flex',
                            alignItems: 'center'
                          }}
                        >
                          <span style={{ marginRight: '12px', fontSize: '1.5rem' }}>📍</span>
                          Endereço
                        </h4>
                        
                        <div className="row g-4">
                          <div className="col-md-4">
                            <label className="form-label" style={{ fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                              CEP *
                            </label>
                            <div className="position-relative">
                              <input
                                type="text"
                                value={formData.cep}
                                onChange={(e) => updateField('cep', e.target.value)}
                                className="form-control form-control-lg"
                                style={{
                                  border: '2px solid #e5e7eb',
                                  borderRadius: '12px',
                                  padding: '1rem',
                                  fontSize: '1rem'
                                }}
                                placeholder="00000-000"
                                required
                              />
                              {formLoading.cep && (
                                <div 
                                  className="position-absolute top-50 end-0 translate-middle-y me-3"
                                  style={{ zIndex: 10 }}
                                >
                                  <div className="spinner-border spinner-border-sm text-primary" role="status">
                                    <span className="visually-hidden">Buscando...</span>
                                  </div>
                                </div>
                              )}
                            </div>
                            <small className="text-muted mt-1" style={{ fontSize: '0.8rem' }}>
                              Digite o CEP e o endereço será preenchido automaticamente
                            </small>
                          </div>
                          
                          <div className="col-md-4">
                            <label className="form-label" style={{ fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                              Cidade *
                            </label>
                            <input
                              type="text"
                              value={formData.cidade}
                              onChange={(e) => updateField('cidade', e.target.value)}
                              className="form-control form-control-lg"
                              style={{
                                border: '2px solid #e5e7eb',
                                borderRadius: '12px',
                                padding: '1rem',
                                fontSize: '1rem',
                                backgroundColor: '#f8fafc'
                              }}
                              placeholder="Cidade"
                              required
                              readOnly
                            />
                          </div>
                          
                          <div className="col-md-4">
                            <label className="form-label" style={{ fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                              Estado *
                            </label>
                            <input
                              type="text"
                              value={formData.estado}
                              onChange={(e) => updateField('estado', e.target.value)}
                              className="form-control form-control-lg"
                              style={{
                                border: '2px solid #e5e7eb',
                                borderRadius: '12px',
                                padding: '1rem',
                                fontSize: '1rem',
                                backgroundColor: '#f8fafc'
                              }}
                              placeholder="UF"
                              required
                              readOnly
                            />
                          </div>
                          
                          <div className="col-md-8">
                            <label className="form-label" style={{ fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                              Endereço *
                            </label>
                            <input
                              type="text"
                              value={formData.endereco}
                              onChange={(e) => updateField('endereco', e.target.value)}
                              className="form-control form-control-lg"
                              style={{
                                border: '2px solid #e5e7eb',
                                borderRadius: '12px',
                                padding: '1rem',
                                fontSize: '1rem'
                              }}
                              placeholder="Rua, Avenida..."
                              required
                            />
                          </div>
                          
                          <div className="col-md-4">
                            <label className="form-label" style={{ fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                              Número *
                            </label>
                            <input
                              type="text"
                              value={formData.numero}
                              onChange={(e) => updateField('numero', e.target.value)}
                              className="form-control form-control-lg"
                              style={{
                                border: '2px solid #e5e7eb',
                                borderRadius: '12px',
                                padding: '1rem',
                                fontSize: '1rem'
                              }}
                              placeholder="123"
                              required
                            />
                          </div>
                          
                          <div className="col-12">
                            <label className="form-label" style={{ fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                              Bairro *
                            </label>
                            <input
                              type="text"
                              value={formData.bairro}
                              onChange={(e) => updateField('bairro', e.target.value)}
                              className="form-control form-control-lg"
                              style={{
                                border: '2px solid #e5e7eb',
                                borderRadius: '12px',
                                padding: '1rem',
                                fontSize: '1rem'
                              }}
                              placeholder="Bairro"
                              required
                            />
                          </div>
                        </div>
                      </div>

                      {/* Senha */}
                      <div className="mb-5">
                        <h4 
                          style={{ 
                            color: '#1e293b', 
                            fontWeight: '800', 
                            marginBottom: '2rem',
                            borderBottom: '3px solid #e5e7eb',
                            paddingBottom: '0.75rem',
                            display: 'flex',
                            alignItems: 'center'
                          }}
                        >
                          <span style={{ marginRight: '12px', fontSize: '1.5rem' }}>🔒</span>
                          Segurança
                        </h4>
                        
                        <PasswordStrength
                          password={formData.senha}
                          confirmPassword={formData.confirmSenha}
                          onPasswordChange={(senha) => updateField('senha', senha)}
                          onConfirmPasswordChange={(confirmSenha) => updateField('confirmSenha', confirmSenha)}
                        />
                      </div>

                      {/* Botão de Submit */}
                      <div className="d-grid mb-4">
                        <button
                          type="submit"
                          className="btn btn-lg"
                          style={{
                            background: `linear-gradient(135deg, ${selectedPlan.color} 0%, ${selectedPlan.color}dd 100%)`,
                            border: 'none',
                            borderRadius: '16px',
                            padding: '1.25rem 2rem',
                            color: 'white',
                            fontWeight: '800',
                            fontSize: '1.2rem',
                            boxShadow: `0 12px 35px ${selectedPlan.color}40`,
                            transition: 'all 0.3s ease',
                            textTransform: 'none'
                          }}
                        >
                          🚀 Criar Conta e Iniciar {selectedPlan.trialDays} Dias Grátis
                        </button>
                      </div>

                      {/* Seção de Cupom - agora dentro do card principal */}
                      <div className="mb-4">
                        <CouponSection 
                          selectedPlan={selectedPlanId}
                          selectedPlanData={selectedPlan}
                          onCouponApplied={handleCouponApplied}
                          billingCycle={billingCycle}
                          onBillingCycleChange={setBillingCycle}
                        />
                      </div>

                      <div className="text-center">
                        <p style={{ color: '#6b7280', marginBottom: 0 }}>
                          Já tem uma conta?{" "}
                          <Link
                            href="/login"
                            style={{ 
                              color: selectedPlan.color, 
                              textDecoration: 'none',
                              fontWeight: '600'
                            }}
                          >
                            Faça login
                          </Link>
                        </p>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Seção de Cupom removida daqui, agora está dentro do card principal */}
      </div>
    );
  }

  // Se nenhum plano foi selecionado, mostrar seleção de planos ou Owner
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Selecione um Plano</h1>
        <p className="text-gray-600 mb-8">
          Para se cadastrar, primeiro selecione um plano na nossa página de preços.
        </p>
        <Link
          href="/#pricing"
          className="bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
        >
          Ver Planos Disponíveis
        </Link>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando página de registro...</p>
        </div>
      </div>
    }>
      <RegisterContent />
    </Suspense>
  );
}