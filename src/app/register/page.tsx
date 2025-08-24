"use client";

import Link from "next/link";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import CouponSection from "@/components/CouponSection";
import { usePlans } from "@/hooks/usePlans";

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
    senha: ''
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
  const [showOwnerOption, setShowOwnerOption] = useState(false);
  const [loading, setLoading] = useState(true);
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [billingCycle, setBillingCycle] = useState<'weekly' | 'monthly' | 'annual'>('monthly');

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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="w-full max-w-6xl bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="grid md:grid-cols-2 gap-0">
            {/* Lado esquerdo - Informações do plano */}
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-8 text-white flex flex-col justify-center">
              <div className="text-center">
                <h2 className="text-3xl font-bold mb-4">Quase lá! 🚀</h2>
                <p className="text-blue-100 mb-8 text-lg">
                  Complete seus dados e comece a transformar seu negócio hoje mesmo.
                </p>
                
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-6">
                  <h3 className="text-xl font-semibold mb-2">Plano Selecionado</h3>
                  <div className="text-3xl font-bold">{selectedPlan.name}</div>
                  <div className="text-blue-200 mt-2">{selectedPlan.description}</div>
                  
                  <div className="mt-4 pt-4 border-t border-white/20">
                    <div className="text-2xl font-bold">
                      R$ {originalPrice?.toFixed(2) || '0,00'}
                      <span className="text-sm font-normal">/mês</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 text-left">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
                    <span>Configuração em 5 minutos</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
                    <span>Suporte técnico incluído</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
                    <span>Sem fidelidade</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Lado direito - Formulário */}
            <div className="p-8 overflow-y-auto max-h-screen">
              <div className="text-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  Finalize seu Cadastro
                </h1>
                <p className="text-gray-600">
                  Preencha os dados abaixo para criar sua conta
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Dados Pessoais */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900 border-b pb-2 flex items-center">
                    <span className="mr-2">👤</span> Dados Pessoais
                  </h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nome Completo *
                    </label>
                    <input
                      type="text"
                      value={formData.nome}
                      onChange={(e) => updateField('nome', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="Seu nome completo"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => updateField('email', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="seu@email.com"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Telefone *
                    </label>
                    <div className="flex gap-3">
                      <select 
                        value={countryCode}
                        className="px-3 py-3 border border-gray-300 rounded-xl bg-gray-50 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="+55">🇧🇷 +55</option>
                        <option value="+1">🇺🇸 +1</option>
                        <option value="+34">🇪🇸 +34</option>
                      </select>
                      <input
                        type="text"
                        value={formData.telefone}
                        onChange={(e) => updateField('telefone', e.target.value)}
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="(44) 99758-8758"
                        required
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Formato será ajustado automaticamente
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      CPF/CNPJ *
                    </label>
                    <input
                      type="text"
                      value={formData.cpfCnpj}
                      onChange={(e) => updateField('cpfCnpj', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="000.000.000-00 ou 00.000.000/0000-00"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Digite apenas números - formatação automática
                    </p>
                  </div>
                </div>

                {/* Dados da Empresa */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900 border-b pb-2 flex items-center">
                    <span className="mr-2">🏢</span> Dados da Empresa
                  </h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nome da Empresa *
                    </label>
                    <input
                      type="text"
                      value={formData.empresa}
                      onChange={(e) => updateField('empresa', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="Nome da sua empresa"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Segmento *
                    </label>
                    <select
                      value={formData.segmento}
                      onChange={(e) => updateField('segmento', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      required
                    >
                      <option value="">Selecione seu segmento</option>
                      <option value="alimentacao">🍔 Alimentação</option>
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

                {/* Endereço */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900 border-b pb-2 flex items-center">
                    <span className="mr-2">📍</span> Endereço
                  </h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      CEP *
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={formData.cep}
                        onChange={(e) => updateField('cep', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="00000-000"
                        required
                      />
                      {formLoading.cep && (
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Digite o CEP e o endereço será preenchido automaticamente
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Cidade *
                      </label>
                      <input
                        type="text"
                        value={formData.cidade}
                        onChange={(e) => updateField('cidade', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-50"
                        placeholder="Cidade"
                        required
                        readOnly
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Estado *
                      </label>
                      <input
                        type="text"
                        value={formData.estado}
                        onChange={(e) => updateField('estado', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-50"
                        placeholder="UF"
                        required
                        readOnly
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Endereço *
                    </label>
                    <input
                      type="text"
                      value={formData.endereco}
                      onChange={(e) => updateField('endereco', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="Rua, Avenida..."
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Número *
                      </label>
                      <input
                        type="text"
                        value={formData.numero}
                        onChange={(e) => updateField('numero', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="123"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Bairro *
                      </label>
                      <input
                        type="text"
                        value={formData.bairro}
                        onChange={(e) => updateField('bairro', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="Bairro"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Senha */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900 border-b pb-2 flex items-center">
                    <span className="mr-2">🔒</span> Segurança
                  </h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Senha *
                    </label>
                    <input
                      type="password"
                      value={formData.senha}
                      onChange={(e) => updateField('senha', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="Mínimo 8 caracteres"
                      required
                      minLength={8}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 px-6 rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-indigo-700 transform hover:scale-[1.02] transition-all duration-200 shadow-lg"
                >
                  🚀 Criar Conta e Iniciar {selectedPlan.trialDays} Dias Grátis
                </button>

                <div className="text-center">
                  <p className="text-gray-600">
                    Já tem uma conta?{" "}
                    <Link
                      href="/login"
                      className="text-blue-600 hover:text-blue-700 font-semibold transition-colors"
                    >
                      Faça login
                    </Link>
                  </p>
                </div>
              </form>
            </div>
          </div>

          {/* Seção de Cupom */}
          <div className="border-t bg-gray-50 p-6">
            <CouponSection selectedPlanData={selectedPlan} />
          </div>
        </div>
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