"use client";

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import CouponSection from '@/components/CouponSection';
import { usePlans } from '@/hooks/usePlans';

function PaymentContent() {
  const searchParams = useSearchParams();
  const verificationId = searchParams.get('verification');
  
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'credit_card' | 'debit_card'>('pix');
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [billingCycle, setBillingCycle] = useState<'weekly' | 'monthly' | 'annual'>('monthly');

  const { plans } = usePlans();

  // Dados do cartão
  const [cardData, setCardData] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: ''
  });

  useEffect(() => {
    if (verificationId) {
      fetchVerificationData();
    }
  }, [verificationId]);

  const fetchVerificationData = async () => {
    try {
      const response = await fetch(`/api/auth/verification/${verificationId}`);
      const data = await response.json();
      
      if (data.success && data.verification.status === 'verified') {
        setUserData(data.verification.userData);
        setBillingCycle(data.verification.userData.billingCycle);
      } else {
        // Redirecionar para registro se verificação inválida
        window.location.href = '/register';
      }
    } catch (error) {
      console.error('Erro ao buscar dados de verificação:', error);
      window.location.href = '/register';
    } finally {
      setLoading(false);
    }
  };

  const selectedPlan = plans.find(plan => plan.planId === userData?.planId);
  
  const getPlanPrice = () => {
    if (!selectedPlan) return 0;
    return selectedPlan.pricing[billingCycle]?.price || 0;
  };

  const calculateFinalPrice = () => {
    const originalPrice = getPlanPrice();
    const discount = appliedCoupon?.discount || 0;
    return Math.max(0, originalPrice - discount);
  };

  const handleCouponApplied = (couponData: any) => {
    setAppliedCoupon(couponData);
  };

  const handlePayment = async () => {
    if (!userData) return;

    const finalAmount = calculateFinalPrice();
    
    try {
      const response = await fetch('/api/payments/process', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          verificationId,
          paymentMethod,
          amount: getPlanPrice(),
          finalAmount,
          couponCode: appliedCoupon?.coupon?.code,
          couponDiscount: appliedCoupon?.discount || 0,
          cardData: paymentMethod !== 'pix' ? cardData : undefined
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        if (paymentMethod === 'pix') {
          // Mostrar QR Code do PIX
          showPixPayment(result.pixData);
        } else {
          // Processar cartão
          if (result.status === 'success') {
            // Redirecionar para sucesso
            window.location.href = '/payment/success';
          } else {
            alert('Erro no pagamento: ' + result.error);
          }
        }
      } else {
        alert('Erro: ' + result.error);
      }
    } catch (error) {
      console.error('Erro ao processar pagamento:', error);
      alert('Erro ao processar pagamento');
    }
  };

  const showPixPayment = (pixData: any) => {
    // Implementar modal com QR Code do PIX
    alert('PIX gerado! QR Code: ' + pixData.qrCode);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando dados de pagamento...</p>
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">Acesso Negado</h1>
          <p className="text-gray-600 mt-2">Verificação não encontrada ou inválida</p>
          <Link href="/register" className="btn btn-primary mt-4">
            Voltar ao Registro
          </Link>
        </div>
      </div>
    );
  }

  const finalPrice = calculateFinalPrice();
  const originalPrice = getPlanPrice();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="card shadow-lg border-0">
              <div className="card-header bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                <h2 className="mb-0">
                  <i className="fas fa-credit-card me-2"></i>
                  Finalizar Pagamento
                </h2>
              </div>
              
              <div className="card-body p-4">
                {/* Resumo do Plano */}
                <div className="row mb-4">
                  <div className="col-md-6">
                    <h5>Resumo do Pedido</h5>
                    <div className="bg-light p-3 rounded">
                      <p><strong>Plano:</strong> {selectedPlan?.name}</p>
                      <p><strong>Cliente:</strong> {userData.nome}</p>
                      <p><strong>Email:</strong> {userData.email}</p>
                      <p><strong>Empresa:</strong> {userData.empresa}</p>
                      <p><strong>Ciclo:</strong> {billingCycle === 'monthly' ? 'Mensal' : billingCycle === 'annual' ? 'Anual' : 'Semanal'}</p>
                      
                      <hr />
                      
                      <div className="d-flex justify-content-between">
                        <span>Valor Original:</span>
                        <span>R$ {originalPrice.toFixed(2)}</span>
                      </div>
                      
                      {appliedCoupon && (
                        <div className="d-flex justify-content-between text-success">
                          <span>Desconto ({appliedCoupon.coupon.code}):</span>
                          <span>- R$ {appliedCoupon.discount.toFixed(2)}</span>
                        </div>
                      )}
                      
                      <hr />
                      
                      <div className="d-flex justify-content-between fw-bold">
                        <span>Total a Pagar:</span>
                        <span className="text-primary">R$ {finalPrice.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="col-md-6">
                    {/* Seção de Cupom */}
                    <CouponSection
                      selectedPlan={userData.planId}
                      selectedPlanData={selectedPlan}
                      onCouponApplied={handleCouponApplied}
                      billingCycle={billingCycle}
                      onBillingCycleChange={setBillingCycle}
                    />
                  </div>
                </div>

                {/* Métodos de Pagamento */}
                {finalPrice > 0 ? (
                  <>
                    <h5 className="mb-3">Método de Pagamento</h5>
                    
                    <div className="row mb-4">
                      <div className="col-md-4">
                        <div className={`card payment-method ${paymentMethod === 'pix' ? 'border-primary' : ''}`} 
                             onClick={() => setPaymentMethod('pix')}>
                          <div className="card-body text-center">
                            <i className="fas fa-qrcode fa-2x mb-2"></i>
                            <h6>PIX</h6>
                            <small>Aprovação imediata</small>
                          </div>
                        </div>
                      </div>
                      
                      <div className="col-md-4">
                        <div className={`card payment-method ${paymentMethod === 'credit_card' ? 'border-primary' : ''}`}
                             onClick={() => setPaymentMethod('credit_card')}>
                          <div className="card-body text-center">
                            <i className="fas fa-credit-card fa-2x mb-2"></i>
                            <h6>Cartão de Crédito</h6>
                            <small>Parcelamento em até 12x</small>
                          </div>
                        </div>
                      </div>
                      
                      <div className="col-md-4">
                        <div className={`card payment-method ${paymentMethod === 'debit_card' ? 'border-primary' : ''}`}
                             onClick={() => setPaymentMethod('debit_card')}>
                          <div className="card-body text-center">
                            <i className="fas fa-credit-card fa-2x mb-2"></i>
                            <h6>Cartão de Débito</h6>
                            <small>Desconto à vista</small>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Formulário de Cartão */}
                    {paymentMethod !== 'pix' && (
                      <div className="card">
                        <div className="card-body">
                          <h6>Dados do Cartão</h6>
                          
                          <div className="row">
                            <div className="col-md-6 mb-3">
                              <label className="form-label">Número do Cartão</label>
                              <input
                                type="text"
                                className="form-control"
                                placeholder="0000 0000 0000 0000"
                                value={cardData.number}
                                onChange={(e) => setCardData({...cardData, number: e.target.value})}
                                maxLength={19}
                              />
                            </div>
                            
                            <div className="col-md-6 mb-3">
                              <label className="form-label">Nome no Cartão</label>
                              <input
                                type="text"
                                className="form-control"
                                placeholder="Nome como está no cartão"
                                value={cardData.name}
                                onChange={(e) => setCardData({...cardData, name: e.target.value})}
                              />
                            </div>
                            
                            <div className="col-md-6 mb-3">
                              <label className="form-label">Validade</label>
                              <input
                                type="text"
                                className="form-control"
                                placeholder="MM/AA"
                                value={cardData.expiry}
                                onChange={(e) => setCardData({...cardData, expiry: e.target.value})}
                                maxLength={5}
                              />
                            </div>
                            
                            <div className="col-md-6 mb-3">
                              <label className="form-label">CVV</label>
                              <input
                                type="text"
                                className="form-control"
                                placeholder="000"
                                value={cardData.cvv}
                                onChange={(e) => setCardData({...cardData, cvv: e.target.value})}
                                maxLength={4}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="alert alert-success">
                    <h5><i className="fas fa-gift me-2"></i>Plano Gratuito!</h5>
                    <p>Seu cupom de desconto cobriu 100% do valor. Clique em "Ativar Plano" para começar a usar.</p>
                  </div>
                )}

                {/* Botão de Pagamento */}
                <div className="d-grid mt-4">
                  <button
                    className="btn btn-primary btn-lg"
                    onClick={handlePayment}
                  >
                    {finalPrice > 0 
                      ? `Pagar R$ ${finalPrice.toFixed(2)}`
                      : 'Ativar Plano Gratuito'
                    }
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        .payment-method {
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .payment-method:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
        }
        
        .payment-method.border-primary {
          border: 2px solid #007bff !important;
          background-color: #f8f9ff;
        }
      `}</style>
    </div>
  );
}

export default function PaymentPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando...</p>
        </div>
      </div>
    }>
      <PaymentContent />
    </Suspense>
  );
}