"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RegisterOwnerSaas() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    secretKey: "", // Chave secreta para validar que é realmente o owner
  });
  const [errors, setErrors] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = (): boolean => {
    setErrors(null);
    
    if (!formData.name || !formData.email || !formData.password || !formData.secretKey) {
      setErrors("Todos os campos são obrigatórios");
      return false;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setErrors("As senhas não coincidem");
      return false;
    }
    
    if (formData.password.length < 8) {
      setErrors("A senha deve ter pelo menos 8 caracteres");
      return false;
    }
    
    // Validação da chave secreta (você pode definir uma chave específica)
    if (formData.secretKey !== "VAREJOFLEX_OWNER_2025") {
      setErrors("Chave secreta inválida. Acesso negado.");
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    setErrors(null);
    
    try {
      const payload = {
        mode: "owner_saas",
        user: {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          userType: "owner_saas",
          role: "owner_saas"
        },
        secretKey: formData.secretKey
      };

      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (!res.ok) {
        setErrors(data?.error?.message || "Erro ao criar conta Owner SaaS");
      } else {
        // Redireciona para login com sucesso
        router.push("/login?success=owner_created");
      }
    } catch (error) {
      setErrors("Erro de rede. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 bg-gradient-primary d-flex align-items-center" 
         style={{
           background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
         }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-6 col-md-8">
            <div className="card border-0 shadow-lg">
              <div className="card-header bg-danger text-white text-center py-4">
                <h3 className="mb-0">
                  <i className="bi bi-shield-lock me-2"></i>
                  Cadastro Owner SaaS
                </h3>
                <p className="mb-0 mt-2 opacity-75">
                  Acesso Restrito - Administrador da Plataforma
                </p>
              </div>
              
              <div className="card-body p-5">
                <div className="alert alert-warning border-warning">
                  <div className="d-flex">
                    <i className="bi bi-exclamation-triangle me-3 fs-4"></i>
                    <div>
                      <h6 className="alert-heading">⚠️ Área Restrita</h6>
                      <p className="mb-0">
                        Este cadastro é exclusivo para o administrador da plataforma VarejoFlex.
                        É necessária uma chave secreta válida para prosseguir.
                      </p>
                    </div>
                  </div>
                </div>

                <form onSubmit={handleSubmit}>
                  <div className="row g-3">
                    <div className="col-12">
                      <label className="form-label fw-bold">
                        <i className="bi bi-person me-2"></i>
                        Nome Completo
                      </label>
                      <input 
                        type="text" 
                        className="form-control form-control-lg" 
                        value={formData.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        placeholder="Seu nome completo"
                        required
                      />
                    </div>

                    <div className="col-12">
                      <label className="form-label fw-bold">
                        <i className="bi bi-envelope me-2"></i>
                        E-mail
                      </label>
                      <input 
                        type="email" 
                        className="form-control form-control-lg" 
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        placeholder="seu@email.com"
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-bold">
                        <i className="bi bi-lock me-2"></i>
                        Senha
                      </label>
                      <input 
                        type="password" 
                        className="form-control form-control-lg" 
                        value={formData.password}
                        onChange={(e) => handleInputChange("password", e.target.value)}
                        placeholder="Mínimo 8 caracteres"
                        minLength={8}
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-bold">
                        <i className="bi bi-lock-fill me-2"></i>
                        Confirmar Senha
                      </label>
                      <input 
                        type="password" 
                        className="form-control form-control-lg" 
                        value={formData.confirmPassword}
                        onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                        placeholder="Digite novamente"
                        required
                      />
                    </div>

                    <div className="col-12">
                      <hr className="my-4" />
                      <label className="form-label fw-bold text-danger">
                        <i className="bi bi-key me-2"></i>
                        Chave Secreta Owner
                      </label>
                      <input 
                        type="password" 
                        className="form-control form-control-lg border-danger" 
                        value={formData.secretKey}
                        onChange={(e) => handleInputChange("secretKey", e.target.value)}
                        placeholder="Chave secreta do Owner SaaS"
                        required
                      />
                      <div className="form-text text-danger">
                        <i className="bi bi-info-circle me-1"></i>
                        Apenas o proprietário da plataforma possui esta chave
                      </div>
                    </div>

                    {errors && (
                      <div className="col-12">
                        <div className="alert alert-danger">
                          <i className="bi bi-exclamation-circle me-2"></i>
                          {errors}
                        </div>
                      </div>
                    )}

                    <div className="col-12">
                      <div className="d-grid gap-2">
                        <button 
                          type="submit" 
                          className="btn btn-danger btn-lg fw-bold"
                          disabled={loading}
                        >
                          {loading ? (
                            <>
                              <span className="spinner-border spinner-border-sm me-2"></span>
                              Criando Conta Owner...
                            </>
                          ) : (
                            <>
                              <i className="bi bi-shield-check me-2"></i>
                              Criar Conta Owner SaaS
                            </>
                          )}
                        </button>
                        
                        <Link href="/" className="btn btn-outline-secondary">
                          <i className="bi bi-arrow-left me-2"></i>
                          Voltar ao Início
                        </Link>
                      </div>
                    </div>
                  </div>
                </form>

                <div className="mt-4 pt-4 border-top">
                  <div className="alert alert-info mb-0">
                    <h6 className="alert-heading">
                      <i className="bi bi-info-circle me-2"></i>
                      Sobre a Conta Owner SaaS
                    </h6>
                    <ul className="mb-0 small">
                      <li>Acesso total à plataforma VarejoFlex</li>
                      <li>Gestão de todos os lojistas e companies</li>
                      <li>Dashboard administrativo global</li>
                      <li>Controle de planos e faturamento</li>
                      <li>Métricas e relatórios completos</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}