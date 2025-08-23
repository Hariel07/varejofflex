"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

const SEGMENTS = [
  {
    id: "lanchonete",
    name: "Lanchonete",
    icon: "🍔",
    color: "#f59e0b",
    description: "Hamburgueria, sanduícheria, pastelaria",
    features: ["PDV rápido", "Controle de ingredientes", "Delivery integrado"]
  },
  {
    id: "pizzaria",
    name: "Pizzaria",
    icon: "🍕",
    color: "#ef4444",
    description: "Pizzas, massas, pratos italianos",
    features: ["Sabores por tamanho", "Tempo de preparo", "Forno integrado"]
  },
  {
    id: "moda",
    name: "Moda",
    icon: "👗",
    color: "#3b82f6",
    description: "Roupas, calçados, acessórios",
    features: ["Grades por cor/tamanho", "Estoque visual", "Coleções"]
  },
  {
    id: "mercado",
    name: "Mercado",
    icon: "🛒",
    color: "#10b981",
    description: "Supermercado, mercearia, hortifrúti",
    features: ["Balança integrada", "Controle de lote", "Produtos fracionados"]
  },
  {
    id: "petshop",
    name: "Petshop",
    icon: "🐕",
    color: "#f59e0b",
    description: "Produtos pet, banho e tosa",
    features: ["Agendamentos", "Ficha do pet", "Lembretes automáticos"]
  },
  {
    id: "salao",
    name: "Salão",
    icon: "💅",
    color: "#ef4444",
    description: "Cabeleireiro, manicure, estética",
    features: ["Agenda profissionais", "Comissões", "Avaliações"]
  },
  {
    id: "farmacia",
    name: "Farmácia",
    icon: "💊",
    color: "#0ea5e9",
    description: "Medicamentos, cosméticos",
    features: ["Receitas controladas", "Compliance ANVISA", "Alertas validade"]
  },
  {
    id: "conveniencia",
    name: "Conveniência",
    icon: "🏪",
    color: "#6b7280",
    description: "Loja 24h, produtos diversos",
    features: ["PDV express", "Controle de idade", "Operação 24h"]
  }
];

function RegisterLojistaForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedSegment, setSelectedSegment] = useState(searchParams?.get("segment") || "");
  const [errors, setErrors] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    segment: "",
    company: {
      name: "",
      personType: "PJ" as "PF" | "PJ",
      documentType: "CNPJ" as "CPF" | "CNPJ",
      documentNumber: "",
      email: "",
      phone: "",
      address: {
        zip: "",
        street: "",
        number: "",
        district: "",
        city: "",
        state: "",
        complement: ""
      }
    },
    user: {
      name: "",
      email: "",
      password: "",
      confirmPassword: ""
    }
  });

  useEffect(() => {
    const segment = searchParams?.get("segment");
    if (segment && SEGMENTS.find(s => s.id === segment)) {
      setSelectedSegment(segment);
      setFormData(prev => ({ ...prev, segment }));
      setCurrentStep(2);
    }
  }, [searchParams]);

  const handleSegmentSelect = (segmentId: string) => {
    setSelectedSegment(segmentId);
    setFormData(prev => ({ ...prev, segment: segmentId }));
    setCurrentStep(2);
  };

  const handleCompanyDataChange = (field: string, value: any) => {
    if (field.includes("address.")) {
      const addressField = field.split(".")[1];
      setFormData(prev => ({
        ...prev,
        company: {
          ...prev.company,
          address: {
            ...prev.company.address,
            [addressField]: value
          }
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        company: {
          ...prev.company,
          [field]: value
        }
      }));
    }
  };

  const handleUserDataChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      user: {
        ...prev.user,
        [field]: value
      }
    }));
  };

  const validateStep = (step: number): boolean => {
    setErrors(null);
    
    if (step === 1 && !selectedSegment) {
      setErrors("Selecione um segmento para continuar");
      return false;
    }
    
    if (step === 2) {
      const { company } = formData;
      if (!company.name || !company.documentNumber || !company.email || !company.phone) {
        setErrors("Preencha todos os campos obrigatórios da empresa");
        return false;
      }
    }
    
    if (step === 3) {
      const { user } = formData;
      if (!user.name || !user.email || !user.password) {
        setErrors("Preencha todos os campos obrigatórios do usuário");
        return false;
      }
      if (user.password !== user.confirmPassword) {
        setErrors("As senhas não coincidem");
        return false;
      }
      if (user.password.length < 6) {
        setErrors("A senha deve ter pelo menos 6 caracteres");
        return false;
      }
    }
    
    return true;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = async () => {
    if (!validateStep(3)) return;
    
    setLoading(true);
    setErrors(null);
    
    try {
      const payload = {
        mode: "lojista",
        segment: formData.segment,
        company: {
          ...formData.company,
          segment: formData.segment
        },
        user: {
          name: formData.user.name,
          email: formData.user.email,
          password: formData.user.password,
          userType: "lojista",
          segment: formData.segment
        }
      };

      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (!res.ok) {
        setErrors(data?.error?.message || "Erro ao criar conta");
      } else {
        setCurrentStep(4);
      }
    } catch (error) {
      setErrors("Erro de rede. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const selectedSegmentData = SEGMENTS.find(s => s.id === selectedSegment);

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
          <div className="col-lg-8">
            <div className="text-center mb-5">
              <Link 
                href="/register" 
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
                Voltar
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
                  Cadastro de Lojista
                </h1>
                <p className="lead" style={{ color: '#64748b', fontSize: '1.2rem' }}>
                  Crie sua conta e comece a vender em poucos minutos
                </p>
              </div>
            </div>

            {/* Progress Steps */}
            <div 
              className="mb-5"
              style={{
                background: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(20px)',
                borderRadius: '20px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.08)',
                padding: '24px'
              }}
            >
              <div className="row text-center">
                <div className="col-3">
                  <div 
                    className="rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                    style={{
                      width: "60px", 
                      height: "60px",
                      background: currentStep >= 1 
                        ? 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)' 
                        : 'rgba(148, 163, 184, 0.2)',
                      color: currentStep >= 1 ? 'white' : '#94a3b8',
                      fontSize: '1.2rem',
                      fontWeight: '600',
                      border: currentStep >= 1 ? 'none' : '2px solid rgba(148, 163, 184, 0.3)',
                      boxShadow: currentStep >= 1 ? '0 8px 25px rgba(59, 130, 246, 0.3)' : 'none',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    {currentStep > 1 ? <i className="bi bi-check"></i> : "1"}
                  </div>
                  <div style={{ color: '#1e293b', fontWeight: '600', fontSize: '0.9rem' }}>Segmento</div>
                </div>
                <div className="col-3">
                  <div 
                    className="rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                    style={{
                      width: "60px", 
                      height: "60px",
                      background: currentStep >= 2 
                        ? 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)' 
                        : 'rgba(148, 163, 184, 0.2)',
                      color: currentStep >= 2 ? 'white' : '#94a3b8',
                      fontSize: '1.2rem',
                      fontWeight: '600',
                      border: currentStep >= 2 ? 'none' : '2px solid rgba(148, 163, 184, 0.3)',
                      boxShadow: currentStep >= 2 ? '0 8px 25px rgba(59, 130, 246, 0.3)' : 'none',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    {currentStep > 2 ? <i className="bi bi-check"></i> : "2"}
                  </div>
                  <div style={{ color: '#1e293b', fontWeight: '600', fontSize: '0.9rem' }}>Empresa</div>
                </div>
                <div className="col-3">
                  <div 
                    className="rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                    style={{
                      width: "60px", 
                      height: "60px",
                      background: currentStep >= 3 
                        ? 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)' 
                        : 'rgba(148, 163, 184, 0.2)',
                      color: currentStep >= 3 ? 'white' : '#94a3b8',
                      fontSize: '1.2rem',
                      fontWeight: '600',
                      border: currentStep >= 3 ? 'none' : '2px solid rgba(148, 163, 184, 0.3)',
                      boxShadow: currentStep >= 3 ? '0 8px 25px rgba(59, 130, 246, 0.3)' : 'none',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    {currentStep > 3 ? <i className="bi bi-check"></i> : "3"}
                  </div>
                  <div style={{ color: '#1e293b', fontWeight: '600', fontSize: '0.9rem' }}>Usuário</div>
                </div>
                <div className="col-3">
                  <div 
                    className="rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                    style={{
                      width: "60px", 
                      height: "60px",
                      background: currentStep >= 4 
                        ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' 
                        : 'rgba(148, 163, 184, 0.2)',
                      color: currentStep >= 4 ? 'white' : '#94a3b8',
                      fontSize: '1.2rem',
                      fontWeight: '600',
                      border: currentStep >= 4 ? 'none' : '2px solid rgba(148, 163, 184, 0.3)',
                      boxShadow: currentStep >= 4 ? '0 8px 25px rgba(16, 185, 129, 0.3)' : 'none',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    {currentStep >= 4 ? <i className="bi bi-check"></i> : "4"}
                  </div>
                  <div style={{ color: '#1e293b', fontWeight: '600', fontSize: '0.9rem' }}>Pronto</div>
                </div>
              </div>
            </div>

            {/* Main Form Container */}
            <div 
              style={{
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(20px)',
                borderRadius: '24px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.1)',
                padding: '40px'
              }}
            >
              {/* Step 1: Segment Selection */}
              {currentStep === 1 && (
                <div>
                  <h4 style={{ color: '#1e293b', fontWeight: '700', fontSize: '1.5rem' }} className="mb-4">
                    <i className="bi bi-shop me-3" style={{ color: '#3b82f6' }}></i>
                    Escolha seu Segmento
                  </h4>
                  <p style={{ color: '#64748b', fontSize: '1.1rem', lineHeight: '1.6' }} className="mb-5">
                    Selecione o tipo de negócio que você possui para personalizar sua experiência.
                  </p>
                  
                  <div className="row g-4">
                    {SEGMENTS.map(segment => (
                      <div key={segment.id} className="col-md-6">
                        <div 
                          onClick={() => handleSegmentSelect(segment.id)}
                          style={{ 
                            cursor: "pointer",
                            background: selectedSegment === segment.id ? 'rgba(59, 130, 246, 0.1)' : 'rgba(255, 255, 255, 0.7)',
                            backdropFilter: 'blur(20px)',
                            borderRadius: '16px',
                            border: selectedSegment === segment.id ? '2px solid #3b82f6' : '1px solid rgba(255, 255, 255, 0.3)',
                            padding: '20px',
                            transition: 'all 0.3s ease',
                            boxShadow: selectedSegment === segment.id ? '0 12px 40px rgba(59, 130, 246, 0.15)' : '0 8px 32px rgba(0, 0, 0, 0.08)'
                          }}
                        >
                          <div className="d-flex align-items-center mb-3">
                            <div className="fs-1 me-3">{segment.icon}</div>
                            <div>
                              <h6 className="mb-1" style={{ color: '#1e293b', fontWeight: '600' }}>
                                {segment.name}
                              </h6>
                              <small style={{ color: '#64748b' }}>{segment.description}</small>
                            </div>
                          </div>
                          <ul className="list-unstyled mb-0">
                            {segment.features.map((feature, idx) => (
                              <li key={idx} className="mb-2">
                                <i className="bi bi-check-circle me-2" style={{ color: '#10b981' }}></i>
                                <small style={{ color: '#64748b' }}>{feature}</small>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 2: Company Data */}
              {currentStep === 2 && (
                <div>
                  <h4 style={{ color: '#1e293b', fontWeight: '700', fontSize: '1.5rem' }} className="mb-4">
                    <i className="bi bi-building me-3" style={{ color: '#3b82f6' }}></i>
                    Dados da Empresa
                    {selectedSegmentData && (
                      <span 
                        className="ms-3 badge"
                        style={{
                          background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                          color: 'white',
                          fontSize: '0.9rem',
                          fontWeight: '500'
                        }}
                      >
                        {selectedSegmentData.icon} {selectedSegmentData.name}
                      </span>
                    )}
                  </h4>
                  
                  <div className="row g-4">
                    <div className="col-md-8">
                      <label className="form-label" style={{ color: '#1e293b', fontWeight: '600' }}>
                        Nome da Empresa *
                      </label>
                      <input 
                        type="text" 
                        className="form-control" 
                        value={formData.company.name}
                        onChange={(e) => handleCompanyDataChange("name", e.target.value)}
                        placeholder="Ex: Lanchonete do João"
                        style={{
                          background: 'rgba(255, 255, 255, 0.9)',
                          border: '1px solid rgba(203, 213, 225, 0.5)',
                          borderRadius: '12px',
                          padding: '12px 16px',
                          fontSize: '1rem'
                        }}
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label" style={{ color: '#1e293b', fontWeight: '600' }}>
                        Tipo de Pessoa
                      </label>
                      <select 
                        className="form-select"
                        value={formData.company.personType}
                        onChange={(e) => {
                          const personType = e.target.value as "PF" | "PJ";
                          handleCompanyDataChange("personType", personType);
                          handleCompanyDataChange("documentType", personType === "PF" ? "CPF" : "CNPJ");
                        }}
                        style={{
                          background: 'rgba(255, 255, 255, 0.9)',
                          border: '1px solid rgba(203, 213, 225, 0.5)',
                          borderRadius: '12px',
                          padding: '12px 16px',
                          fontSize: '1rem'
                        }}
                      >
                        <option value="PJ">Pessoa Jurídica</option>
                        <option value="PF">Pessoa Física</option>
                      </select>
                    </div>
                  </div>

                  <div className="row g-4 mt-3">
                    <div className="col-md-6">
                      <label className="form-label" style={{ color: '#1e293b', fontWeight: '600' }}>
                        {formData.company.documentType} *
                      </label>
                      <input 
                        type="text" 
                        className="form-control" 
                        value={formData.company.documentNumber}
                        onChange={(e) => handleCompanyDataChange("documentNumber", e.target.value)}
                        placeholder={formData.company.documentType === "CPF" ? "000.000.000-00" : "00.000.000/0000-00"}
                        style={{
                          background: 'rgba(255, 255, 255, 0.9)',
                          border: '1px solid rgba(203, 213, 225, 0.5)',
                          borderRadius: '12px',
                          padding: '12px 16px',
                          fontSize: '1rem'
                        }}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label" style={{ color: '#1e293b', fontWeight: '600' }}>
                        Telefone *
                      </label>
                      <input 
                        type="tel" 
                        className="form-control" 
                        value={formData.company.phone}
                        onChange={(e) => handleCompanyDataChange("phone", e.target.value)}
                        placeholder="(11) 99999-9999"
                        style={{
                          background: 'rgba(255, 255, 255, 0.9)',
                          border: '1px solid rgba(203, 213, 225, 0.5)',
                          borderRadius: '12px',
                          padding: '12px 16px',
                          fontSize: '1rem'
                        }}
                      />
                    </div>
                  </div>

                  <div className="row g-4 mt-3">
                    <div className="col-12">
                      <label className="form-label" style={{ color: '#1e293b', fontWeight: '600' }}>
                        E-mail da Empresa *
                      </label>
                      <input 
                        type="email" 
                        className="form-control" 
                        value={formData.company.email}
                        onChange={(e) => handleCompanyDataChange("email", e.target.value)}
                        placeholder="contato@empresa.com"
                        style={{
                          background: 'rgba(255, 255, 255, 0.9)',
                          border: '1px solid rgba(203, 213, 225, 0.5)',
                          borderRadius: '12px',
                          padding: '12px 16px',
                          fontSize: '1rem'
                        }}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: User Data */}
              {currentStep === 3 && (
                <div>
                  <h4 style={{ color: '#1e293b', fontWeight: '700', fontSize: '1.5rem' }} className="mb-4">
                    <i className="bi bi-person me-3" style={{ color: '#3b82f6' }}></i>
                    Seus Dados de Acesso
                  </h4>
                  
                  <div className="row g-4">
                    <div className="col-md-6">
                      <label className="form-label" style={{ color: '#1e293b', fontWeight: '600' }}>
                        Nome Completo *
                      </label>
                      <input 
                        type="text" 
                        className="form-control" 
                        value={formData.user.name}
                        onChange={(e) => handleUserDataChange("name", e.target.value)}
                        placeholder="Seu nome completo"
                        style={{
                          background: 'rgba(255, 255, 255, 0.9)',
                          border: '1px solid rgba(203, 213, 225, 0.5)',
                          borderRadius: '12px',
                          padding: '12px 16px',
                          fontSize: '1rem'
                        }}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label" style={{ color: '#1e293b', fontWeight: '600' }}>
                        E-mail *
                      </label>
                      <input 
                        type="email" 
                        className="form-control" 
                        value={formData.user.email}
                        onChange={(e) => handleUserDataChange("email", e.target.value)}
                        placeholder="seu@email.com"
                        style={{
                          background: 'rgba(255, 255, 255, 0.9)',
                          border: '1px solid rgba(203, 213, 225, 0.5)',
                          borderRadius: '12px',
                          padding: '12px 16px',
                          fontSize: '1rem'
                        }}
                      />
                    </div>
                  </div>

                  <div className="row g-4 mt-3">
                    <div className="col-md-6">
                      <label className="form-label" style={{ color: '#1e293b', fontWeight: '600' }}>
                        Senha *
                      </label>
                      <input 
                        type="password" 
                        className="form-control" 
                        value={formData.user.password}
                        onChange={(e) => handleUserDataChange("password", e.target.value)}
                        placeholder="Mínimo 6 caracteres"
                        style={{
                          background: 'rgba(255, 255, 255, 0.9)',
                          border: '1px solid rgba(203, 213, 225, 0.5)',
                          borderRadius: '12px',
                          padding: '12px 16px',
                          fontSize: '1rem'
                        }}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label" style={{ color: '#1e293b', fontWeight: '600' }}>
                        Confirmar Senha *
                      </label>
                      <input 
                        type="password" 
                        className="form-control" 
                        value={formData.user.confirmPassword}
                        onChange={(e) => handleUserDataChange("confirmPassword", e.target.value)}
                        placeholder="Digite a senha novamente"
                        style={{
                          background: 'rgba(255, 255, 255, 0.9)',
                          border: '1px solid rgba(203, 213, 225, 0.5)',
                          borderRadius: '12px',
                          padding: '12px 16px',
                          fontSize: '1rem'
                        }}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Success */}
              {currentStep === 4 && (
                <div className="text-center">
                  <div className="mb-5">
                    <div 
                      style={{
                        width: '120px',
                        height: '120px',
                        margin: '0 auto 24px',
                        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 20px 60px rgba(16, 185, 129, 0.3)'
                      }}
                    >
                      <i className="bi bi-check-circle" style={{fontSize: "3rem", color: 'white'}}></i>
                    </div>
                  </div>
                  <h4 style={{ color: '#10b981', fontWeight: '700', fontSize: '2rem' }} className="mb-4">
                    Conta Criada com Sucesso!
                  </h4>
                  <p style={{ color: '#64748b', fontSize: '1.2rem', lineHeight: '1.6' }} className="mb-5">
                    Sua conta foi criada. Faça login para acessar seu dashboard.
                  </p>
                  <Link 
                    href="/login" 
                    className="btn btn-lg"
                    style={{
                      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                      border: 'none',
                      borderRadius: '50px',
                      padding: '16px 32px',
                      color: 'white',
                      fontWeight: '600',
                      fontSize: '1.1rem',
                      textDecoration: 'none',
                      boxShadow: '0 8px 25px rgba(16, 185, 129, 0.3)'
                    }}
                  >
                    <i className="bi bi-box-arrow-in-right me-2"></i>
                    Fazer Login
                  </Link>
                </div>
              )}

              {/* Error Display */}
              {errors && (
                <div 
                  className="mt-4"
                  style={{
                    background: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid rgba(239, 68, 68, 0.2)',
                    borderRadius: '12px',
                    padding: '16px',
                    color: '#dc2626'
                  }}
                >
                  <i className="bi bi-exclamation-triangle me-2"></i>
                  {errors}
                </div>
              )}

              {/* Navigation Buttons */}
              {currentStep < 4 && (
                <div className="d-flex justify-content-between mt-5">
                  <button 
                    type="button" 
                    onClick={prevStep}
                    disabled={currentStep === 1}
                    style={{
                      background: currentStep === 1 ? 'rgba(148, 163, 184, 0.2)' : 'rgba(255, 255, 255, 0.9)',
                      border: '1px solid rgba(203, 213, 225, 0.5)',
                      borderRadius: '50px',
                      padding: '12px 24px',
                      color: currentStep === 1 ? '#94a3b8' : '#64748b',
                      fontWeight: '500',
                      cursor: currentStep === 1 ? 'not-allowed' : 'pointer'
                    }}
                  >
                    <i className="bi bi-arrow-left me-2"></i>
                    Anterior
                  </button>
                  
                  {currentStep < 3 ? (
                    <button 
                      type="button" 
                      onClick={nextStep}
                      style={{
                        background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                        border: 'none',
                        borderRadius: '50px',
                        padding: '12px 24px',
                        color: 'white',
                        fontWeight: '600',
                        boxShadow: '0 8px 25px rgba(59, 130, 246, 0.3)'
                      }}
                    >
                      Próximo
                      <i className="bi bi-arrow-right ms-2"></i>
                    </button>
                  ) : (
                    <button 
                      type="button" 
                      onClick={handleSubmit}
                      disabled={loading}
                      style={{
                        background: loading ? 'rgba(148, 163, 184, 0.5)' : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                        border: 'none',
                        borderRadius: '50px',
                        padding: '12px 24px',
                        color: 'white',
                        fontWeight: '600',
                        boxShadow: loading ? 'none' : '0 8px 25px rgba(16, 185, 129, 0.3)',
                        cursor: loading ? 'not-allowed' : 'pointer'
                      }}
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2"></span>
                          Criando Conta...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-check-circle me-2"></i>
                          Criar Conta
                        </>
                      )}
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RegisterLojista() {
  return (
    <Suspense fallback={
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
          <p style={{ color: '#64748b' }}>Carregando formulário...</p>
        </div>
      </div>
    }>
      <RegisterLojistaForm />
    </Suspense>
  );
}