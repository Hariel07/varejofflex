"use client";

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import PlansManagement from '@/components/dashboard/PlansManagement';

export default function OwnerDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('plans');

  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session) {
      router.push('/login');
      return;
    }

    // Verificar se o usuário é owner
    fetch('/api/platform/owner-status')
      .then(res => res.json())
      .then(data => {
        if (!data.isOwner) {
          router.push('/dashboard');
          return;
        }
        setLoading(false);
      })
      .catch(() => {
        router.push('/dashboard');
      });
  }, [session, status, router]);

  if (status === 'loading' || loading) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Carregando...</span>
          </div>
          <p className="mt-3 text-muted">Verificando permissões...</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'plans', name: 'Planos', icon: 'bi-layers' },
    { id: 'stats', name: 'Estatísticas', icon: 'bi-graph-up' },
    { id: 'users', name: 'Usuários', icon: 'bi-people' },
    { id: 'settings', name: 'Configurações', icon: 'bi-gear' }
  ];

  return (
    <div className="min-vh-100" style={{ background: '#f8f9fa' }}>
      {/* Header */}
      <div className="bg-white border-bottom shadow-sm">
        <div className="container-fluid">
          <div className="row align-items-center py-3">
            <div className="col-md-6">
              <h1 className="h3 mb-0 text-dark">
                <i className="bi bi-shield-check text-primary me-2"></i>
                Dashboard Owner
              </h1>
              <p className="text-muted mb-0">Painel de administração da plataforma</p>
            </div>
            <div className="col-md-6 text-end">
              <span className="badge bg-success px-3 py-2">
                <i className="bi bi-person-check me-1"></i>
                Owner Logado: {session?.user?.email}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-bottom">
        <div className="container-fluid">
          <ul className="nav nav-tabs border-0">
            {tabs.map((tab) => (
              <li key={tab.id} className="nav-item">
                <button
                  className={`nav-link px-4 py-3 ${activeTab === tab.id ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    border: 'none',
                    borderBottom: activeTab === tab.id ? '3px solid #0d6efd' : '3px solid transparent',
                    background: 'transparent',
                    color: activeTab === tab.id ? '#0d6efd' : '#6c757d',
                    fontWeight: activeTab === tab.id ? '600' : '500'
                  }}
                >
                  <i className={`${tab.icon} me-2`}></i>
                  {tab.name}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Content */}
      <div className="container-fluid py-4">
        {activeTab === 'plans' && <PlansManagement />}
        
        {activeTab === 'stats' && (
          <div className="row">
            <div className="col-12">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">
                    <i className="bi bi-graph-up me-2"></i>
                    Estatísticas da Plataforma
                  </h5>
                  <p className="text-muted">Em desenvolvimento...</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="row">
            <div className="col-12">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">
                    <i className="bi bi-people me-2"></i>
                    Gerenciamento de Usuários
                  </h5>
                  <p className="text-muted">Em desenvolvimento...</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="row">
            <div className="col-12">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">
                    <i className="bi bi-gear me-2"></i>
                    Configurações da Plataforma
                  </h5>
                  <p className="text-muted">Em desenvolvimento...</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}