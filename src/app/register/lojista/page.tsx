"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

const SEGMENTS = [
  {
    id: "lanchonete",
    name: "Lanchonete",
    icon: "🍔",
    color: "warning",
    description: "Hamburgueria, sanduícheria, pastelaria",
    features: ["PDV rápido", "Controle de ingredientes", "Delivery integrado"]
  },
  {
    id: "pizzaria",
    name: "Pizzaria",
    icon: "🍕",
    color: "danger",
    description: "Pizzas, massas, pratos italianos",
    features: ["Sabores por tamanho", "Tempo de preparo", "Forno integrado"]
  },
  {
    id: "moda",
    name: "Moda",
    icon: "👗",
    color: "primary",
    description: "Roupas, calçados, acessórios",
    features: ["Grades por cor/tamanho", "Estoque visual", "Coleções"]
  },
  {
    id: "mercado",
    name: "Mercado",
    icon: "🛒",
    color: "success",
    description: "Supermercado, mercearia, hortifrúti",
    features: ["Balança integrada", "Controle de lote", "Produtos fracionados"]
  },
  {
    id: "petshop",
    name: "Petshop",
    icon: "🐕",
    color: "warning",
    description: "Produtos pet, banho e tosa",
    features: ["Agendamentos", "Ficha do pet", "Lembretes automáticos"]
  },
  {
    id: "salao",
    name: "Salão",
    icon: "💅",
    color: "danger",
    description: "Cabeleireiro, manicure, estética",
    features: ["Agenda profissionais", "Comissões", "Avaliações"]
  },
  {
    id: "farmacia",
    name: "Farmácia",
    icon: "💊",
    color: "info",
    description: "Medicamentos, cosméticos",
    features: ["Receitas controladas", "Compliance ANVISA", "Alertas validade"]
  },
  {
    id: "conveniencia",
    name: "Conveniência",
    icon: "🏪",
    color: "secondary",
    description: "Loja 24h, produtos diversos",
    features: ["PDV express", "Controle de idade", "Operação 24h"]
  }
];

function RegisterLojistaForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedSegment, setSelectedSegment] = useState(searchParams?.get("segment") || "");
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
  const [errors, setErrors] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

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
    if (field.includes(".")) {
      const [parent, child] = field.split(".");
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof typeof prev] as object || {}),
          [child]: value
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
        setCurrentStep(4); // Sucesso
      }
    } catch (error) {
      setErrors("Erro de rede. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const selectedSegmentData = SEGMENTS.find(s => s.id === selectedSegment);

  return (
    <div className="min-vh-100 bg-light">
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            {/* Header */}
            <div className="text-center mb-5">
              <Link href="/" className="btn btn-outline-primary mb-3">
                <i className="bi bi-arrow-left me-2"></i>
                Voltar ao Início
              </Link>
              <h1 className="display-6 fw-bold mb-2">Cadastro de Lojista</h1>
              <p className="lead text-muted">
                Crie sua conta e comece a vender em poucos minutos
              </p>
            </div>

            {/* Progress */}
            <div className="card mb-4">
              <div className="card-body">
                <div className="row text-center">
                  <div className="col-3">
                    <div className={`rounded-circle d-inline-flex align-items-center justify-content-center ${currentStep >= 1 ? 'bg-primary text-white' : 'bg-light text-muted'}`} 
                         style={{width: "40px", height: "40px"}}>
                      {currentStep > 1 ? <i className="bi bi-check"></i> : "1"}
                    </div>
                    <div className="mt-2 small fw-bold">Segmento</div>
                  </div>
                  <div className="col-3">
                    <div className={`rounded-circle d-inline-flex align-items-center justify-content-center ${currentStep >= 2 ? 'bg-primary text-white' : 'bg-light text-muted'}`} 
                         style={{width: "40px", height: "40px"}}>
                      {currentStep > 2 ? <i className="bi bi-check"></i> : "2"}
                    </div>
                    <div className="mt-2 small fw-bold">Empresa</div>
                  </div>
                  <div className="col-3">
                    <div className={`rounded-circle d-inline-flex align-items-center justify-content-center ${currentStep >= 3 ? 'bg-primary text-white' : 'bg-light text-muted'}`} 
                         style={{width: "40px", height: "40px"}}>
                      {currentStep > 3 ? <i className="bi bi-check"></i> : "3"}
                    </div>
                    <div className="mt-2 small fw-bold">Usuário</div>
                  </div>
                  <div className="col-3">
                    <div className={`rounded-circle d-inline-flex align-items-center justify-content-center ${currentStep >= 4 ? 'bg-success text-white' : 'bg-light text-muted'}`} 
                         style={{width: "40px", height: "40px"}}>
                      {currentStep >= 4 ? <i className="bi bi-check"></i> : "4"}
                    </div>
                    <div className="mt-2 small fw-bold">Pronto</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Step Content */}
            <div className="card">
              <div className="card-body p-4">
                {/* Step 1: Segmento */}
                {currentStep === 1 && (
                  <div>
                    <h4 className="card-title mb-4">
                      <i className="bi bi-shop me-2"></i>
                      Escolha seu Segmento
                    </h4>
                    <p className="text-muted mb-4">
                      Selecione o tipo de negócio que você possui. Isso nos ajudará a configurar 
                      o sistema com as funcionalidades ideais para sua loja.
                    </p>
                    
                    <div className="row g-3">
                      {SEGMENTS.map(segment => (
                        <div key={segment.id} className="col-md-6">
                          <div 
                            className={`card h-100 cursor-pointer border-2 ${selectedSegment === segment.id ? `border-${segment.color}` : 'border-light'}`}
                            onClick={() => handleSegmentSelect(segment.id)}
                            style={{ cursor: "pointer" }}
                          >
                            <div className="card-body">
                              <div className="d-flex align-items-center mb-3">
                                <div className="fs-1 me-3">{segment.icon}</div>
                                <div>
                                  <h6 className="mb-1">{segment.name}</h6>
                                  <small className="text-muted">{segment.description}</small>
                                </div>
                              </div>
                              <ul className="list-unstyled mb-0">
                                {segment.features.map((feature, idx) => (
                                  <li key={idx} className="mb-1">
                                    <i className={`bi bi-check-circle text-${segment.color} me-2`}></i>
                                    <small>{feature}</small>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Step 2: Dados da Empresa */}
                {currentStep === 2 && (
                  <div>
                    <h4 className="card-title mb-4">
                      <i className="bi bi-building me-2"></i>
                      Dados da Empresa
                      {selectedSegmentData && (
                        <span className={`badge bg-${selectedSegmentData.color} ms-2`}>
                          {selectedSegmentData.icon} {selectedSegmentData.name}
                        </span>
                      )}
                    </h4>
                    
                    <div className="row g-3">
                      <div className="col-md-8">
                        <label className="form-label">Nome da Empresa *</label>
                        <input 
                          type="text" 
                          className="form-control" 
                          value={formData.company.name}
                          onChange={(e) => handleCompanyDataChange("name", e.target.value)}
                          placeholder="Ex: Lanchonete do João"
                        />
                      </div>
                      <div className="col-md-4">
                        <label className="form-label">Tipo de Pessoa</label>
                        <select 
                          className="form-select"
                          value={formData.company.personType}
                          onChange={(e) => {
                            const personType = e.target.value as "PF" | "PJ";
                            handleCompanyDataChange("personType", personType);
                            handleCompanyDataChange("documentType", personType === "PF" ? "CPF" : "CNPJ");
                          }}
                        >
                          <option value="PJ">Pessoa Jurídica</option>
                          <option value="PF">Pessoa Física</option>
                        </select>
                      </div>
                      <div className="col-md-4">
                        <label className="form-label">{formData.company.documentType} *</label>
                        <input 
                          type="text" 
                          className="form-control" 
                          value={formData.company.documentNumber}
                          onChange={(e) => handleCompanyDataChange("documentNumber", e.target.value)}
                          placeholder={formData.company.documentType === "CPF" ? "000.000.000-00" : "00.000.000/0001-00"}
                        />
                      </div>
                      <div className="col-md-4">
                        <label className="form-label">E-mail *</label>
                        <input 
                          type="email" 
                          className="form-control" 
                          value={formData.company.email}
                          onChange={(e) => handleCompanyDataChange("email", e.target.value)}
                          placeholder="contato@empresa.com"
                        />
                      </div>
                      <div className="col-md-4">
                        <label className="form-label">Telefone/WhatsApp *</label>
                        <input 
                          type="tel" 
                          className="form-control" 
                          value={formData.company.phone}
                          onChange={(e) => handleCompanyDataChange("phone", e.target.value)}
                          placeholder="(11) 99999-9999"
                        />
                      </div>
                      
                      <div className="col-12">
                        <hr />
                        <h6>Endereço (opcional)</h6>
                      </div>
                      
                      <div className="col-md-3">
                        <label className="form-label">CEP</label>
                        <input 
                          type="text" 
                          className="form-control" 
                          value={formData.company.address.zip}
                          onChange={(e) => handleCompanyDataChange("address.zip", e.target.value)}
                          placeholder="00000-000"
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Rua</label>
                        <input 
                          type="text" 
                          className="form-control" 
                          value={formData.company.address.street}
                          onChange={(e) => handleCompanyDataChange("address.street", e.target.value)}
                        />
                      </div>
                      <div className="col-md-3">
                        <label className="form-label">Número</label>
                        <input 
                          type="text" 
                          className="form-control" 
                          value={formData.company.address.number}
                          onChange={(e) => handleCompanyDataChange("address.number", e.target.value)}
                        />
                      </div>
                      <div className="col-md-4">
                        <label className="form-label">Bairro</label>
                        <input 
                          type="text" 
                          className="form-control" 
                          value={formData.company.address.district}
                          onChange={(e) => handleCompanyDataChange("address.district", e.target.value)}
                        />
                      </div>
                      <div className="col-md-4">
                        <label className="form-label">Cidade</label>
                        <input 
                          type="text" 
                          className="form-control" 
                          value={formData.company.address.city}
                          onChange={(e) => handleCompanyDataChange("address.city", e.target.value)}
                        />
                      </div>
                      <div className="col-md-2">
                        <label className="form-label">UF</label>
                        <input 
                          type="text" 
                          className="form-control" 
                          value={formData.company.address.state}
                          onChange={(e) => handleCompanyDataChange("address.state", e.target.value)}
                          maxLength={2}
                        />
                      </div>
                      <div className="col-md-2">
                        <label className="form-label">Complemento</label>
                        <input 
                          type="text" 
                          className="form-control" 
                          value={formData.company.address.complement}
                          onChange={(e) => handleCompanyDataChange("address.complement", e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 3: Dados do Usuário */}
                {currentStep === 3 && (
                  <div>
                    <h4 className="card-title mb-4">
                      <i className="bi bi-person me-2"></i>
                      Seus Dados de Acesso
                    </h4>
                    <p className="text-muted mb-4">
                      Estes serão seus dados para acessar o sistema.
                    </p>
                    
                    <div className="row g-3">
                      <div className="col-md-6">
                        <label className="form-label">Nome Completo *</label>
                        <input 
                          type="text" 
                          className="form-control" 
                          value={formData.user.name}
                          onChange={(e) => handleUserDataChange("name", e.target.value)}
                          placeholder="Seu nome completo"
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">E-mail *</label>
                        <input 
                          type="email" 
                          className="form-control" 
                          value={formData.user.email}
                          onChange={(e) => handleUserDataChange("email", e.target.value)}
                          placeholder="seu@email.com"
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Senha *</label>
                        <input 
                          type="password" 
                          className="form-control" 
                          value={formData.user.password}
                          onChange={(e) => handleUserDataChange("password", e.target.value)}
                          placeholder="Mínimo 6 caracteres"
                          minLength={6}
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Confirmar Senha *</label>
                        <input 
                          type="password" 
                          className="form-control" 
                          value={formData.user.confirmPassword}
                          onChange={(e) => handleUserDataChange("confirmPassword", e.target.value)}
                          placeholder="Digite a senha novamente"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 4: Sucesso */}
                {currentStep === 4 && (
                  <div className="text-center">
                    <div className="mb-4">
                      <i className="bi bi-check-circle text-success" style={{fontSize: "4rem"}}></i>
                    </div>
                    <h4 className="text-success mb-3">Conta Criada com Sucesso!</h4>
                    <p className="text-muted mb-4">
                      Sua conta foi criada e você já pode começar a usar o VarejoFlex.
                      Faça login para acessar seu dashboard.
                    </p>
                    <div className="d-grid gap-2 col-md-6 mx-auto">
                      <Link href="/login" className="btn btn-success btn-lg">
                        <i className="bi bi-box-arrow-in-right me-2"></i>
                        Fazer Login
                      </Link>
                    </div>
                  </div>
                )}

                {/* Errors */}
                {errors && (
                  <div className="alert alert-danger mt-3">
                    <i className="bi bi-exclamation-triangle me-2"></i>
                    {errors}
                  </div>
                )}

                {/* Navigation */}
                {currentStep < 4 && (
                  <div className="d-flex justify-content-between mt-4">
                    <button 
                      type="button" 
                      className="btn btn-outline-secondary"
                      onClick={prevStep}
                      disabled={currentStep === 1}
                    >
                      <i className="bi bi-arrow-left me-2"></i>
                      Anterior
                    </button>
                    
                    {currentStep < 3 ? (
                      <button 
                        type="button" 
                        className="btn btn-primary"
                        onClick={nextStep}
                      >
                        Próximo
                        <i className="bi bi-arrow-right ms-2"></i>
                      </button>
                    ) : (
                      <button 
                        type="button" 
                        className="btn btn-success"
                        onClick={handleSubmit}
                        disabled={loading}
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
    </div>
  );
}

export default function RegisterLojista() {
  return (
    <Suspense fallback={
      <div className="container py-5">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Carregando...</span>
          </div>
          <p className="mt-3 text-muted">Carregando formulário de registro...</p>
        </div>
      </div>
    }>
      <RegisterLojistaForm />
    </Suspense>
  );
}