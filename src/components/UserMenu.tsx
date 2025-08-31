'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuthUser } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';

interface UserMenuProps {
  className?: string;
}

interface UserProfile {
  name: string;
  lastName: string;
  email: string;
  phone: string;
  location: string;
  avatar?: string;
  companyName: string;
  segment: string;
}

interface PaymentInfo {
  method: string;
  plan: string;
  nextPayment: string;
  amount: number;
  status: string;
}

interface Plan {
  id: string;
  name: string;
  price: number;
  features: string[];
  status: 'active' | 'canceled' | 'pending';
  startDate: string;
  nextBilling: string;
}

interface Receipt {
  id: string;
  date: string;
  amount: number;
  status: 'paid' | 'pending' | 'failed';
  description: string;
  downloadUrl?: string;
}

export default function UserMenu({ className = '' }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo | null>(null);
  const [planInfo, setPlanInfo] = useState<Plan | null>(null);
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [loading, setLoading] = useState(true);
  
  const { user } = useAuthUser();
  const router = useRouter();
  const menuRef = useRef<HTMLDivElement>(null);

  // Fechar menu ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Carregar dados do usuário
  useEffect(() => {
    if (user && isOpen) {
      loadUserData();
    }
  }, [user, isOpen]);

  const loadUserData = async () => {
    try {
      setLoading(true);
      
      // Dados do perfil (simulando - em produção viria da API)
      setUserProfile({
        name: user?.name || '',
        lastName: '', // Não disponível no AuthUser
        email: user?.email || '',
        phone: 'Não informado', // Não disponível no AuthUser
        location: 'Não informado', // Não disponível no AuthUser
        avatar: '', // Não disponível no AuthUser
        companyName: user?.companyName || 'Empresa não informada',
        segment: user?.segment || 'lanchonete'
      });

      // Informações de pagamento (simulando)
      setPaymentInfo({
        method: 'Cartão de Crédito **** 4532',
        plan: 'Plano Premium',
        nextPayment: '15/09/2025',
        amount: 49.90,
        status: 'active'
      });

      // Informações do plano
      setPlanInfo({
        id: '1',
        name: 'Plano Premium',
        price: 49.90,
        features: [
          'Produtos ilimitados',
          'Relatórios avançados',
          'Suporte prioritário',
          'Integrações avançadas',
          'Backup automático'
        ],
        status: 'active',
        startDate: '15/07/2025',
        nextBilling: '15/09/2025'
      });

      // Recibos (simulando)
      setReceipts([
        {
          id: '1',
          date: '15/08/2025',
          amount: 49.90,
          status: 'paid',
          description: 'Plano Premium - Agosto 2025',
          downloadUrl: '#'
        },
        {
          id: '2',
          date: '15/07/2025',
          amount: 49.90,
          status: 'paid',
          description: 'Plano Premium - Julho 2025',
          downloadUrl: '#'
        },
        {
          id: '3',
          date: '15/06/2025',
          amount: 49.90,
          status: 'paid',
          description: 'Plano Premium - Junho 2025',
          downloadUrl: '#'
        }
      ]);

    } catch (error) {
      console.error('Erro ao carregar dados do usuário:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut({ 
        callbackUrl: '/login',
        redirect: true 
      });
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  const getSegmentInfo = (segment: string) => {
    const segments: { [key: string]: { name: string; icon: string; color: string } } = {
      lanchonete: { name: "Lanchonete", icon: "🍔", color: "success" },
      pizzaria: { name: "Pizzaria", icon: "🍕", color: "danger" },
      moda: { name: "Moda", icon: "👕", color: "primary" },
      mercado: { name: "Mercado", icon: "🛒", color: "warning" },
      petshop: { name: "Pet Shop", icon: "🐕", color: "info" },
      salao: { name: "Salão", icon: "💇", color: "secondary" },
      farmacia: { name: "Farmácia", icon: "💊", color: "success" },
      conveniencia: { name: "Conveniência", icon: "🏪", color: "dark" }
    };
    return segments[segment] || segments.lanchonete;
  };

  const segmentData = getSegmentInfo(userProfile?.segment || 'lanchonete');

  if (!user) return null;

  return (
    <div className={`position-relative ${className}`} ref={menuRef}>
      {/* Avatar/Trigger Button */}
      <button
        className="btn btn-link p-0 border-0 d-flex align-items-center"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          background: 'none',
          textDecoration: 'none'
        }}
      >
        <div className="d-flex align-items-center">
          <div
            className="rounded-circle me-2 d-flex align-items-center justify-content-center text-white"
            style={{
              width: '40px',
              height: '40px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              fontSize: '1.2rem',
              fontWeight: 'bold'
            }}
          >
            {user.name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="text-start d-none d-md-block">
            <div className="text-dark fw-semibold" style={{ fontSize: '0.9rem' }}>
              {user.name}
            </div>
            <div className="text-muted small">
              {user.email}
            </div>
          </div>
          <i className={`bi bi-chevron-${isOpen ? 'up' : 'down'} ms-2 text-muted`}></i>
        </div>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className="position-absolute top-100 end-0 mt-2 bg-white border-0 shadow-lg"
          style={{
            width: '420px',
            maxHeight: '600px',
            overflowY: 'auto',
            borderRadius: '16px',
            zIndex: 1050,
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)'
          }}
        >
          {/* Header */}
          <div
            className="p-4 text-white"
            style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: '16px 16px 0 0'
            }}
          >
            <div className="d-flex align-items-center justify-content-between">
              <div className="d-flex align-items-center">
                <div
                  className="rounded-circle me-3 d-flex align-items-center justify-content-center"
                  style={{
                    width: '50px',
                    height: '50px',
                    background: 'rgba(255, 255, 255, 0.2)',
                    fontSize: '1.5rem',
                    fontWeight: 'bold'
                  }}
                >
                  {user.name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div>
                  <h6 className="mb-0 text-white">{user.name}</h6>
                  <small className="text-white-50">{user.email}</small>
                </div>
              </div>
              <button
                className="btn btn-link text-white p-0"
                onClick={() => setIsOpen(false)}
                style={{ fontSize: '1.2rem' }}
              >
                ✕
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="p-3 border-bottom">
            <nav className="nav nav-pills nav-justified">
              <button
                className={`nav-link btn btn-sm ${activeTab === 'profile' ? 'active' : ''}`}
                onClick={() => setActiveTab('profile')}
                style={{ fontSize: '0.85rem' }}
              >
                👤 Perfil
              </button>
              <button
                className={`nav-link btn btn-sm ${activeTab === 'payment' ? 'active' : ''}`}
                onClick={() => setActiveTab('payment')}
                style={{ fontSize: '0.85rem' }}
              >
                💳 Pagamento
              </button>
              <button
                className={`nav-link btn btn-sm ${activeTab === 'plan' ? 'active' : ''}`}
                onClick={() => setActiveTab('plan')}
                style={{ fontSize: '0.85rem' }}
              >
                📋 Plano
              </button>
              <button
                className={`nav-link btn btn-sm ${activeTab === 'receipts' ? 'active' : ''}`}
                onClick={() => setActiveTab('receipts')}
                style={{ fontSize: '0.85rem' }}
              >
                🧾 Recibos
              </button>
            </nav>
          </div>

          {/* Content */}
          <div className="p-4" style={{ maxHeight: '400px', overflowY: 'auto' }}>
            {loading ? (
              <div className="text-center py-4">
                <div className="spinner-border spinner-border-sm text-primary" role="status">
                  <span className="visually-hidden">Carregando...</span>
                </div>
                <p className="mt-2 text-muted small">Carregando informações...</p>
              </div>
            ) : (
              <>
                {/* Aba Perfil */}
                {activeTab === 'profile' && userProfile && (
                  <div className="space-y-3">
                    <div className="mb-3">
                      <label className="form-label small text-muted fw-bold">INFORMAÇÕES PESSOAIS</label>
                      <div className="row g-2">
                        <div className="col-6">
                          <div className="form-floating">
                            <input
                              type="text"
                              className="form-control form-control-sm"
                              value={userProfile.name}
                              readOnly
                            />
                            <label className="small">Nome</label>
                          </div>
                        </div>
                        <div className="col-6">
                          <div className="form-floating">
                            <input
                              type="text"
                              className="form-control form-control-sm"
                              value={userProfile.lastName}
                              readOnly
                            />
                            <label className="small">Sobrenome</label>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mb-3">
                      <div className="form-floating">
                        <input
                          type="email"
                          className="form-control form-control-sm"
                          value={userProfile.email}
                          readOnly
                        />
                        <label className="small">📧 Email</label>
                      </div>
                    </div>

                    <div className="mb-3">
                      <div className="form-floating">
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          value={userProfile.phone}
                          readOnly
                        />
                        <label className="small">📱 Celular</label>
                      </div>
                    </div>

                    <div className="mb-3">
                      <div className="form-floating">
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          value={userProfile.location}
                          readOnly
                        />
                        <label className="small">📍 Localização</label>
                      </div>
                    </div>

                    <div className="mb-3">
                      <label className="form-label small text-muted fw-bold">EMPRESA</label>
                      <div className="form-floating">
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          value={userProfile.companyName}
                          readOnly
                        />
                        <label className="small">🏢 Nome da Empresa</label>
                      </div>
                    </div>

                    <div className="mb-3">
                      <label className="form-label small text-muted fw-bold">SEGMENTO</label>
                      <div 
                        className={`p-3 rounded text-center bg-${segmentData.color} bg-opacity-10 border border-${segmentData.color} border-opacity-25`}
                      >
                        <div style={{ fontSize: '2rem' }}>{segmentData.icon}</div>
                        <div className={`fw-bold text-${segmentData.color}`}>{segmentData.name}</div>
                      </div>
                    </div>

                    <div className="d-grid">
                      <button className="btn btn-outline-primary btn-sm">
                        ✏️ Editar Perfil
                      </button>
                    </div>
                  </div>
                )}

                {/* Aba Pagamento */}
                {activeTab === 'payment' && paymentInfo && (
                  <div>
                    <div className="mb-4">
                      <label className="form-label small text-muted fw-bold">MÉTODO DE PAGAMENTO</label>
                      <div className="card border-0 bg-light">
                        <div className="card-body p-3">
                          <div className="d-flex align-items-center justify-content-between">
                            <div className="d-flex align-items-center">
                              <div className="me-3" style={{ fontSize: '1.5rem' }}>💳</div>
                              <div>
                                <div className="fw-semibold">{paymentInfo.method}</div>
                                <small className="text-muted">Método principal</small>
                              </div>
                            </div>
                            <button className="btn btn-outline-primary btn-sm">
                              Alterar
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mb-4">
                      <label className="form-label small text-muted fw-bold">PRÓXIMO PAGAMENTO</label>
                      <div className="card border-0 bg-warning bg-opacity-10 border-warning border-opacity-25">
                        <div className="card-body p-3">
                          <div className="d-flex align-items-center justify-content-between">
                            <div>
                              <div className="fw-bold text-warning">R$ {paymentInfo.amount.toFixed(2)}</div>
                              <small className="text-muted">Vencimento: {paymentInfo.nextPayment}</small>
                            </div>
                            <div className="text-warning" style={{ fontSize: '1.5rem' }}>📅</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mb-3">
                      <label className="form-label small text-muted fw-bold">CONFIGURAÇÕES DE RECEBIMENTO</label>
                      <div className="list-group list-group-flush">
                        <div className="list-group-item d-flex justify-content-between align-items-center px-0">
                          <div>
                            <div className="fw-semibold small">💰 Dinheiro</div>
                            <small className="text-muted">Aceitar pagamento em espécie</small>
                          </div>
                          <div className="form-check form-switch">
                            <input className="form-check-input" type="checkbox" defaultChecked />
                          </div>
                        </div>
                        <div className="list-group-item d-flex justify-content-between align-items-center px-0">
                          <div>
                            <div className="fw-semibold small">💳 Cartão</div>
                            <small className="text-muted">Débito e crédito</small>
                          </div>
                          <div className="form-check form-switch">
                            <input className="form-check-input" type="checkbox" defaultChecked />
                          </div>
                        </div>
                        <div className="list-group-item d-flex justify-content-between align-items-center px-0">
                          <div>
                            <div className="fw-semibold small">📱 PIX</div>
                            <small className="text-muted">Pagamento instantâneo</small>
                          </div>
                          <div className="form-check form-switch">
                            <input className="form-check-input" type="checkbox" defaultChecked />
                          </div>
                        </div>
                        <div className="list-group-item d-flex justify-content-between align-items-center px-0">
                          <div>
                            <div className="fw-semibold small">🏦 Transferência</div>
                            <small className="text-muted">TED/DOC</small>
                          </div>
                          <div className="form-check form-switch">
                            <input className="form-check-input" type="checkbox" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Aba Plano */}
                {activeTab === 'plan' && planInfo && (
                  <div>
                    <div className="mb-4">
                      <div className="card border-0 bg-primary bg-opacity-10 border-primary border-opacity-25">
                        <div className="card-body p-3">
                          <div className="d-flex align-items-center justify-content-between mb-3">
                            <div>
                              <h6 className="mb-0 text-primary fw-bold">{planInfo.name}</h6>
                              <small className="text-muted">Plano atual</small>
                            </div>
                            <div className="text-primary">
                              <span className="h5 mb-0">R$ {planInfo.price.toFixed(2)}</span>
                              <small>/mês</small>
                            </div>
                          </div>
                          <div className="row g-2 mb-3">
                            <div className="col-6">
                              <small className="text-muted">Início:</small>
                              <div className="fw-semibold small">{planInfo.startDate}</div>
                            </div>
                            <div className="col-6">
                              <small className="text-muted">Próxima cobrança:</small>
                              <div className="fw-semibold small">{planInfo.nextBilling}</div>
                            </div>
                          </div>
                          <div className="d-flex align-items-center">
                            <span className={`badge bg-${planInfo.status === 'active' ? 'success' : 'warning'} me-2`}>
                              {planInfo.status === 'active' ? '✅ Ativo' : '⏳ Pendente'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mb-4">
                      <label className="form-label small text-muted fw-bold">RECURSOS INCLUSOS</label>
                      <div className="list-group list-group-flush">
                        {planInfo.features.map((feature, index) => (
                          <div key={index} className="list-group-item d-flex align-items-center px-0 py-2">
                            <span className="text-success me-2">✅</span>
                            <span className="small">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="d-grid gap-2">
                      <button className="btn btn-primary btn-sm">
                        🚀 Upgrade de Plano
                      </button>
                      <button className="btn btn-outline-danger btn-sm">
                        ❌ Cancelar Plano
                      </button>
                    </div>
                  </div>
                )}

                {/* Aba Recibos */}
                {activeTab === 'receipts' && (
                  <div>
                    <div className="mb-3">
                      <label className="form-label small text-muted fw-bold">HISTÓRICO DE PAGAMENTOS</label>
                    </div>
                    
                    <div className="list-group list-group-flush">
                      {receipts.map((receipt) => (
                        <div key={receipt.id} className="list-group-item px-0 py-3">
                          <div className="d-flex align-items-center justify-content-between">
                            <div className="flex-grow-1">
                              <div className="d-flex align-items-center mb-1">
                                <span className="fw-semibold small me-2">{receipt.description}</span>
                                <span className={`badge bg-${receipt.status === 'paid' ? 'success' : receipt.status === 'pending' ? 'warning' : 'danger'}`}>
                                  {receipt.status === 'paid' ? '✅ Pago' : receipt.status === 'pending' ? '⏳ Pendente' : '❌ Falhou'}
                                </span>
                              </div>
                              <div className="small text-muted">{receipt.date}</div>
                            </div>
                            <div className="text-end">
                              <div className="fw-bold text-success">R$ {receipt.amount.toFixed(2)}</div>
                              {receipt.downloadUrl && (
                                <button className="btn btn-link btn-sm p-0 text-decoration-none">
                                  📥 Baixar
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="d-grid mt-3">
                      <button className="btn btn-outline-primary btn-sm">
                        📋 Ver Todos os Recibos
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Footer */}
          <div className="p-3 border-top">
            <div className="d-grid">
              <button
                className="btn btn-danger btn-sm"
                onClick={handleLogout}
              >
                🚪 Sair da Conta
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}