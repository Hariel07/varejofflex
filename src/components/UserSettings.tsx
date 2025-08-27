"use client";

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

interface UserData {
  _id: string;
  name: string;
  email: string;
  role: string;
  userType: string;
  isActive: boolean;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  company?: {
    name: string;
    businessType: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
  };
  createdAt: string;
  lastLogin?: string;
}

interface Notification {
  message: string;
  type: 'success' | 'error' | 'info';
}

export default function UserSettings() {
  const { data: session } = useSession();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState<Notification | null>(null);
  const [activeTab, setActiveTab] = useState('profile');
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: ''
  });
  const [companyData, setCompanyData] = useState({
    name: '',
    businessType: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: ''
  });

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const response = await fetch('/api/user/profile');
      const data = await response.json();

      if (data.success) {
        setUserData(data.user);
        setFormData({
          name: data.user.name || '',
          phone: data.user.phone || '',
          address: data.user.address || '',
          city: data.user.city || '',
          state: data.user.state || '',
          zipCode: data.user.zipCode || ''
        });
        
        if (data.user.company) {
          setCompanyData({
            name: data.user.company.name || '',
            businessType: data.user.company.businessType || '',
            phone: data.user.company.phone || '',
            address: data.user.company.address || '',
            city: data.user.company.city || '',
            state: data.user.company.state || '',
            zipCode: data.user.company.zipCode || ''
          });
        }
      } else {
        showNotification('Erro ao carregar dados do usuário', 'error');
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      showNotification('Erro ao carregar dados do usuário', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (message: string, type: 'success' | 'error' | 'info') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      
      if (data.success) {
        showNotification('Perfil atualizado com sucesso!', 'success');
        loadUserData();
      } else {
        showNotification(data.error || 'Erro ao atualizar perfil', 'error');
      }
    } catch (error) {
      console.error('Erro ao salvar:', error);
      showNotification('Erro ao atualizar perfil', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveCompany = async () => {
    setSaving(true);
    try {
      const response = await fetch('/api/user/company', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(companyData)
      });

      const data = await response.json();
      
      if (data.success) {
        showNotification('Dados da empresa atualizados com sucesso!', 'success');
        loadUserData();
      } else {
        showNotification(data.error || 'Erro ao atualizar empresa', 'error');
      }
    } catch (error) {
      console.error('Erro ao salvar:', error);
      showNotification('Erro ao atualizar dados da empresa', 'error');
    } finally {
      setSaving(false);
    }
  };

  const getRoleName = (role: string) => {
    const roles: { [key: string]: string } = {
      'owner': 'Proprietário',
      'owner_saas': 'Proprietário SaaS',
      'logista': 'Lojista',
      'cliente': 'Cliente'
    };
    return roles[role] || role;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center py-5">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Carregando...</span>
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="alert alert-danger" role="alert">
        <i className="bi bi-exclamation-triangle me-2"></i>
        Erro ao carregar dados do usuário
      </div>
    );
  }

  return (
    <div className="container-fluid py-4">
      {/* Notification */}
      {notification && (
        <div className={`alert alert-${notification.type === 'error' ? 'danger' : notification.type} alert-dismissible fade show`} role="alert">
          <i className={`bi ${notification.type === 'success' ? 'bi-check-circle' : notification.type === 'error' ? 'bi-exclamation-triangle' : 'bi-info-circle'} me-2`}></i>
          {notification.message}
          <button 
            type="button" 
            className="btn-close" 
            onClick={() => setNotification(null)}
          ></button>
        </div>
      )}

      <div className="row">
        <div className="col-12">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-transparent border-bottom-0 py-3">
              <div className="row align-items-center">
                <div className="col">
                  <h4 className="mb-0">
                    <i className="bi bi-gear me-2 text-primary"></i>
                    Configurações da Conta
                  </h4>
                  <p className="text-muted mb-0">Gerencie suas informações pessoais e da empresa</p>
                </div>
                <div className="col-auto">
                  <span className={`badge bg-${userData.isActive ? 'success' : 'danger'} px-3 py-2`}>
                    <i className={`bi ${userData.isActive ? 'bi-check-circle' : 'bi-x-circle'} me-1`}></i>
                    {userData.isActive ? 'Conta Ativa' : 'Conta Inativa'}
                  </span>
                </div>
              </div>
            </div>

            <div className="card-body p-0">
              {/* Tabs */}
              <nav className="nav nav-tabs px-4 pt-3" role="tablist">
                <button 
                  className={`nav-link ${activeTab === 'profile' ? 'active' : ''}`}
                  onClick={() => setActiveTab('profile')}
                >
                  <i className="bi bi-person me-2"></i>
                  Perfil Pessoal
                </button>
                {(userData.role === 'logista' || userData.role === 'owner' || userData.role === 'owner_saas') && (
                  <button 
                    className={`nav-link ${activeTab === 'company' ? 'active' : ''}`}
                    onClick={() => setActiveTab('company')}
                  >
                    <i className="bi bi-building me-2"></i>
                    Dados da Empresa
                  </button>
                )}
                <button 
                  className={`nav-link ${activeTab === 'security' ? 'active' : ''}`}
                  onClick={() => setActiveTab('security')}
                >
                  <i className="bi bi-shield-lock me-2"></i>
                  Segurança
                </button>
                <button 
                  className={`nav-link ${activeTab === 'info' ? 'active' : ''}`}
                  onClick={() => setActiveTab('info')}
                >
                  <i className="bi bi-info-circle me-2"></i>
                  Informações da Conta
                </button>
              </nav>

              <div className="tab-content p-4">
                {/* Tab Perfil Pessoal */}
                {activeTab === 'profile' && (
                  <div className="row">
                    <div className="col-lg-8">
                      <h5 className="mb-4">
                        <i className="bi bi-person me-2 text-primary"></i>
                        Informações Pessoais
                      </h5>
                      
                      <div className="row g-3">
                        <div className="col-md-6">
                          <label className="form-label">Nome Completo *</label>
                          <input 
                            type="text" 
                            className="form-control"
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            placeholder="Seu nome completo"
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">Email</label>
                          <input 
                            type="email" 
                            className="form-control"
                            value={userData.email}
                            disabled
                            style={{ backgroundColor: '#f8f9fa' }}
                          />
                          <small className="text-muted">Email não pode ser alterado</small>
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">Telefone</label>
                          <input 
                            type="tel" 
                            className="form-control"
                            value={formData.phone}
                            onChange={(e) => setFormData({...formData, phone: e.target.value})}
                            placeholder="(11) 99999-9999"
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">Tipo de Usuário</label>
                          <input 
                            type="text" 
                            className="form-control"
                            value={getRoleName(userData.role)}
                            disabled
                            style={{ backgroundColor: '#f8f9fa' }}
                          />
                        </div>
                        <div className="col-12">
                          <label className="form-label">Endereço</label>
                          <input 
                            type="text" 
                            className="form-control"
                            value={formData.address}
                            onChange={(e) => setFormData({...formData, address: e.target.value})}
                            placeholder="Rua, número, bairro"
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">Cidade</label>
                          <input 
                            type="text" 
                            className="form-control"
                            value={formData.city}
                            onChange={(e) => setFormData({...formData, city: e.target.value})}
                            placeholder="Sua cidade"
                          />
                        </div>
                        <div className="col-md-3">
                          <label className="form-label">Estado</label>
                          <input 
                            type="text" 
                            className="form-control"
                            value={formData.state}
                            onChange={(e) => setFormData({...formData, state: e.target.value})}
                            placeholder="SP"
                            maxLength={2}
                          />
                        </div>
                        <div className="col-md-3">
                          <label className="form-label">CEP</label>
                          <input 
                            type="text" 
                            className="form-control"
                            value={formData.zipCode}
                            onChange={(e) => setFormData({...formData, zipCode: e.target.value})}
                            placeholder="00000-000"
                          />
                        </div>
                      </div>

                      <div className="mt-4">
                        <button 
                          className="btn btn-primary"
                          onClick={handleSaveProfile}
                          disabled={saving}
                        >
                          {saving ? (
                            <>
                              <div className="spinner-border spinner-border-sm me-2" role="status">
                                <span className="visually-hidden">Salvando...</span>
                              </div>
                              Salvando...
                            </>
                          ) : (
                            <>
                              <i className="bi bi-check me-2"></i>
                              Salvar Alterações
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="col-lg-4">
                      <div className="card bg-light border-0">
                        <div className="card-body text-center">
                          <div style={{
                            width: '100px',
                            height: '100px',
                            background: 'linear-gradient(135deg, #3B82F6 0%, #06B6D4 100%)',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '3rem',
                            color: 'white',
                            margin: '0 auto 1rem auto'
                          }}>
                            <i className="bi bi-person"></i>
                          </div>
                          <h5>{userData.name}</h5>
                          <p className="text-muted mb-3">{getRoleName(userData.role)}</p>
                          <div className="badge bg-primary px-3 py-2">
                            <i className="bi bi-shield-check me-1"></i>
                            Conta Verificada
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Tab Dados da Empresa */}
                {activeTab === 'company' && (userData.role === 'logista' || userData.role === 'owner' || userData.role === 'owner_saas') && (
                  <div className="row">
                    <div className="col-lg-8">
                      <h5 className="mb-4">
                        <i className="bi bi-building me-2 text-primary"></i>
                        Informações da Empresa
                      </h5>
                      
                      <div className="row g-3">
                        <div className="col-md-6">
                          <label className="form-label">Nome da Empresa *</label>
                          <input 
                            type="text" 
                            className="form-control"
                            value={companyData.name}
                            onChange={(e) => setCompanyData({...companyData, name: e.target.value})}
                            placeholder="Nome da sua empresa"
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">Tipo de Negócio</label>
                          <select 
                            className="form-select"
                            value={companyData.businessType}
                            onChange={(e) => setCompanyData({...companyData, businessType: e.target.value})}
                          >
                            <option value="">Selecione o tipo</option>
                            <option value="Lanchonete">Lanchonete</option>
                            <option value="Pizzaria">Pizzaria</option>
                            <option value="Delivery">Delivery</option>
                            <option value="Mercado">Mercado</option>
                            <option value="Moda">Moda & Acessórios</option>
                            <option value="Petshop">Petshop</option>
                            <option value="Salão">Salão de Beleza</option>
                            <option value="Outro">Outro</option>
                          </select>
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">Telefone da Empresa</label>
                          <input 
                            type="tel" 
                            className="form-control"
                            value={companyData.phone}
                            onChange={(e) => setCompanyData({...companyData, phone: e.target.value})}
                            placeholder="(11) 3333-3333"
                          />
                        </div>
                        <div className="col-12">
                          <label className="form-label">Endereço da Empresa</label>
                          <input 
                            type="text" 
                            className="form-control"
                            value={companyData.address}
                            onChange={(e) => setCompanyData({...companyData, address: e.target.value})}
                            placeholder="Endereço completo da empresa"
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">Cidade</label>
                          <input 
                            type="text" 
                            className="form-control"
                            value={companyData.city}
                            onChange={(e) => setCompanyData({...companyData, city: e.target.value})}
                            placeholder="Cidade da empresa"
                          />
                        </div>
                        <div className="col-md-3">
                          <label className="form-label">Estado</label>
                          <input 
                            type="text" 
                            className="form-control"
                            value={companyData.state}
                            onChange={(e) => setCompanyData({...companyData, state: e.target.value})}
                            placeholder="SP"
                            maxLength={2}
                          />
                        </div>
                        <div className="col-md-3">
                          <label className="form-label">CEP</label>
                          <input 
                            type="text" 
                            className="form-control"
                            value={companyData.zipCode}
                            onChange={(e) => setCompanyData({...companyData, zipCode: e.target.value})}
                            placeholder="00000-000"
                          />
                        </div>
                      </div>

                      <div className="mt-4">
                        <button 
                          className="btn btn-success"
                          onClick={handleSaveCompany}
                          disabled={saving}
                        >
                          {saving ? (
                            <>
                              <div className="spinner-border spinner-border-sm me-2" role="status">
                                <span className="visually-hidden">Salvando...</span>
                              </div>
                              Salvando...
                            </>
                          ) : (
                            <>
                              <i className="bi bi-building-check me-2"></i>
                              Salvar Dados da Empresa
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="col-lg-4">
                      <div className="card bg-light border-0">
                        <div className="card-body">
                          <h6 className="card-title">
                            <i className="bi bi-info-circle me-2"></i>
                            Dicas Importantes
                          </h6>
                          <ul className="list-unstyled small">
                            <li className="mb-2">
                              <i className="bi bi-check-circle text-success me-2"></i>
                              Mantenha os dados atualizados para melhor atendimento
                            </li>
                            <li className="mb-2">
                              <i className="bi bi-check-circle text-success me-2"></i>
                              O tipo de negócio ajuda a personalizar funcionalidades
                            </li>
                            <li className="mb-2">
                              <i className="bi bi-check-circle text-success me-2"></i>
                              Dados corretos facilitam entregas e contato
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Tab Segurança */}
                {activeTab === 'security' && (
                  <div className="row">
                    <div className="col-lg-8">
                      <h5 className="mb-4">
                        <i className="bi bi-shield-lock me-2 text-primary"></i>
                        Segurança da Conta
                      </h5>
                      
                      <div className="card border-0 bg-light mb-4">
                        <div className="card-body">
                          <h6 className="card-title">
                            <i className="bi bi-key me-2"></i>
                            Alterar Senha
                          </h6>
                          <p className="card-text text-muted">
                            Por segurança, recomendamos alterar sua senha periodicamente.
                          </p>
                          <button className="btn btn-outline-primary">
                            <i className="bi bi-pencil me-2"></i>
                            Alterar Senha
                          </button>
                        </div>
                      </div>

                      <div className="card border-0 bg-light mb-4">
                        <div className="card-body">
                          <h6 className="card-title">
                            <i className="bi bi-device-hdd me-2"></i>
                            Sessões Ativas
                          </h6>
                          <p className="card-text text-muted">
                            Gerencie os dispositivos conectados à sua conta.
                          </p>
                          <button className="btn btn-outline-secondary">
                            <i className="bi bi-list me-2"></i>
                            Ver Sessões
                          </button>
                        </div>
                      </div>

                      <div className="card border-0 bg-light">
                        <div className="card-body">
                          <h6 className="card-title">
                            <i className="bi bi-bell me-2"></i>
                            Autenticação em Duas Etapas
                          </h6>
                          <p className="card-text text-muted">
                            Adicione uma camada extra de segurança à sua conta.
                          </p>
                          <button className="btn btn-outline-success">
                            <i className="bi bi-shield-plus me-2"></i>
                            Configurar 2FA
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="col-lg-4">
                      <div className="card bg-warning text-dark border-0">
                        <div className="card-body text-center">
                          <i className="bi bi-shield-exclamation fs-1 mb-3"></i>
                          <h6>Dicas de Segurança</h6>
                          <ul className="list-unstyled small text-start">
                            <li className="mb-2">• Use senhas fortes e únicas</li>
                            <li className="mb-2">• Ative a autenticação em duas etapas</li>
                            <li className="mb-2">• Não compartilhe suas credenciais</li>
                            <li className="mb-2">• Verifique sessões ativas regularmente</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Tab Informações da Conta */}
                {activeTab === 'info' && (
                  <div className="row">
                    <div className="col-lg-8">
                      <h5 className="mb-4">
                        <i className="bi bi-info-circle me-2 text-primary"></i>
                        Informações da Conta
                      </h5>
                      
                      <div className="row g-4">
                        <div className="col-md-6">
                          <div className="card border-0 bg-light">
                            <div className="card-body">
                              <h6 className="card-title">
                                <i className="bi bi-person-badge me-2"></i>
                                Identificação
                              </h6>
                              <p className="mb-1"><strong>ID:</strong> {userData._id}</p>
                              <p className="mb-1"><strong>Email:</strong> {userData.email}</p>
                              <p className="mb-0"><strong>Tipo:</strong> {getRoleName(userData.role)}</p>
                            </div>
                          </div>
                        </div>

                        <div className="col-md-6">
                          <div className="card border-0 bg-light">
                            <div className="card-body">
                              <h6 className="card-title">
                                <i className="bi bi-calendar me-2"></i>
                                Atividade
                              </h6>
                              <p className="mb-1"><strong>Cadastro:</strong> {formatDate(userData.createdAt)}</p>
                              <p className="mb-0">
                                <strong>Último acesso:</strong> {userData.lastLogin ? formatDate(userData.lastLogin) : 'Nunca'}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="col-12">
                          <div className="card border-0 bg-light">
                            <div className="card-body">
                              <h6 className="card-title">
                                <i className="bi bi-shield-check me-2"></i>
                                Status da Conta
                              </h6>
                              <div className="row">
                                <div className="col-md-4">
                                  <div className={`badge bg-${userData.isActive ? 'success' : 'danger'} p-2 w-100`}>
                                    <i className={`bi ${userData.isActive ? 'bi-check-circle' : 'bi-x-circle'} me-1`}></i>
                                    {userData.isActive ? 'Conta Ativa' : 'Conta Inativa'}
                                  </div>
                                </div>
                                <div className="col-md-4">
                                  <div className="badge bg-primary p-2 w-100">
                                    <i className="bi bi-shield-check me-1"></i>
                                    Email Verificado
                                  </div>
                                </div>
                                <div className="col-md-4">
                                  <div className="badge bg-info p-2 w-100">
                                    <i className="bi bi-person-check me-1"></i>
                                    Perfil Completo
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {userData.company && (
                          <div className="col-12">
                            <div className="card border-0 bg-light">
                              <div className="card-body">
                                <h6 className="card-title">
                                  <i className="bi bi-building me-2"></i>
                                  Empresa Vinculada
                                </h6>
                                <div className="row">
                                  <div className="col-md-6">
                                    <p className="mb-1"><strong>Nome:</strong> {userData.company.name}</p>
                                    <p className="mb-1"><strong>Tipo:</strong> {userData.company.businessType}</p>
                                  </div>
                                  <div className="col-md-6">
                                    <p className="mb-1"><strong>Localização:</strong> {userData.company.city}/{userData.company.state}</p>
                                    <p className="mb-0"><strong>Telefone:</strong> {userData.company.phone}</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="col-lg-4">
                      <div className="card border-0 bg-primary text-white">
                        <div className="card-body text-center">
                          <i className="bi bi-headset fs-1 mb-3"></i>
                          <h6>Precisa de Ajuda?</h6>
                          <p className="card-text">
                            Nossa equipe está pronta para ajudar você com qualquer dúvida.
                          </p>
                          <button className="btn btn-light">
                            <i className="bi bi-chat-dots me-2"></i>
                            Falar com Suporte
                          </button>
                        </div>
                      </div>
                    </div>
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