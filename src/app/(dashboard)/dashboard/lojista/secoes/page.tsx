'use client';

import { useState, useEffect } from 'react';

interface Secao {
  _id: string;
  name: string;
  description?: string;
  isActive: boolean;
  order: number;
  color?: string;
  icon?: string;
}

export default function SecoesPage() {
  const [secoes, setSecoes] = useState<Secao[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchSecoes();
  }, []);

  const fetchSecoes = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (searchTerm) params.set('search', searchTerm);

      const response = await fetch(`/api/secoes?${params}`);
      const data = await response.json();
      
      if (data.success && Array.isArray(data.secoes)) {
        // Ordenar por order
        const sortedSecoes = data.secoes.sort((a: Secao, b: Secao) => a.order - b.order);
        setSecoes(sortedSecoes);
      } else {
        setSecoes([]);
      }
    } catch (error) {
      console.error('Erro ao buscar seções:', error);
      setSecoes([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredSecoes = secoes.filter(secao =>
    secao.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    secao.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-vh-100" style={{ background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}>
      <div className="container-fluid py-4">
        {/* Header */}
        <div className="row mb-4">
          <div className="col">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h1 className="h3 mb-1" style={{ color: '#1f2937', fontWeight: '700' }}>
                  <span className="me-2" style={{ fontSize: '1.5rem' }}>📂</span>
                  Seções
                </h1>
                <p className="text-muted mb-0">Organize e gerencie as seções do seu sistema</p>
              </div>
              <button className="btn btn-primary">
                <span className="me-2">➕</span>
                Nova Seção
              </button>
            </div>
          </div>
        </div>

        {/* Filtros */}
        <div className="row mb-4">
          <div className="col-md-6">
            <div className="input-group">
              <span className="input-group-text">🔍</span>
              <input
                type="text"
                className="form-control"
                placeholder="Buscar seções..."
                value={searchTerm}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="col-md-6 text-end">
            <button 
              onClick={fetchSecoes}
              className="btn btn-outline-secondary"
            >
              🔄 Atualizar
            </button>
          </div>
        </div>

        {/* Estatísticas */}
        <div className="row mb-4">
          <div className="col-md-4 mb-3">
            <div className="card h-100 text-center shadow-sm">
              <div className="card-body">
                <div className="display-4 text-primary mb-2">📂</div>
                <h5 className="card-title" style={{ color: '#1f2937' }}>Total de Seções</h5>
                <h2 className="text-primary">{secoes.length}</h2>
              </div>
            </div>
          </div>
          <div className="col-md-4 mb-3">
            <div className="card h-100 text-center shadow-sm">
              <div className="card-body">
                <div className="display-4 text-success mb-2">✅</div>
                <h5 className="card-title" style={{ color: '#1f2937' }}>Seções Ativas</h5>
                <h2 className="text-success">
                  {secoes.filter(secao => secao.isActive).length}
                </h2>
              </div>
            </div>
          </div>
          <div className="col-md-4 mb-3">
            <div className="card h-100 text-center shadow-sm">
              <div className="card-body">
                <div className="display-4 text-danger mb-2">❌</div>
                <h5 className="card-title" style={{ color: '#1f2937' }}>Seções Inativas</h5>
                <h2 className="text-danger">
                  {secoes.filter(secao => !secao.isActive).length}
                </h2>
              </div>
            </div>
          </div>
        </div>

        {/* Lista de Seções */}
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Carregando seções...</span>
            </div>
            <p className="mt-3 text-muted">Carregando seções...</p>
          </div>
        ) : filteredSecoes.length === 0 ? (
          <div className="card shadow-sm">
            <div className="card-body text-center py-5">
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📂</div>
              <h3 className="mb-3" style={{ color: '#1f2937' }}>
                Nenhuma seção encontrada
              </h3>
              <p className="text-muted mb-4">
                Comece criando sua primeira seção para organizar o sistema
              </p>
              <button className="btn btn-primary">
                <span className="me-2">➕</span>
                Criar Primeira Seção
              </button>
            </div>
          </div>
        ) : (
          <div className="row">
            {filteredSecoes.map((secao) => (
              <div key={secao._id} className="col-md-6 col-lg-4 mb-4">
                <div 
                  className="card h-100 shadow-sm"
                  style={{ 
                    borderLeft: `4px solid ${secao.color || '#3B82F6'}`,
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
                  }}
                >
                  <div className="card-body">
                    <div className="d-flex align-items-start justify-content-between mb-3">
                      <div className="d-flex align-items-center">
                        <div 
                          className="rounded me-3 d-flex align-items-center justify-content-center text-white"
                          style={{ 
                            backgroundColor: secao.color || '#3B82F6',
                            width: '50px',
                            height: '50px',
                            fontSize: '1.2rem',
                            fontWeight: 'bold'
                          }}
                        >
                          {secao.icon || secao.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h5 className="card-title mb-1" style={{ color: '#1f2937' }}>
                            {secao.name}
                          </h5>
                          <span 
                            className={`badge ${secao.isActive ? 'bg-success' : 'bg-danger'}`}
                          >
                            {secao.isActive ? 'Ativa' : 'Inativa'}
                          </span>
                        </div>
                      </div>
                      <span className="badge bg-secondary">#{secao.order}</span>
                    </div>

                    {secao.description && (
                      <p className="card-text text-muted mb-3" style={{ fontSize: '0.9rem' }}>
                        {secao.description}
                      </p>
                    )}

                    <div className="d-flex justify-content-between align-items-center">
                      <div className="btn-group" role="group">
                        <button className="btn btn-sm btn-outline-primary">
                          ✏️ Editar
                        </button>
                        <button className="btn btn-sm btn-outline-danger">
                          🗑️ Excluir
                        </button>
                      </div>
                      <small className="text-muted">
                        📍 Ordem {secao.order}
                      </small>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Botão Flutuante para Reordenar */}
        {secoes.length > 1 && (
          <div style={{ position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 1000 }}>
            <button 
              className="btn btn-purple rounded-circle shadow-lg"
              style={{ 
                width: '60px', 
                height: '60px',
                background: '#8b5cf6',
                border: 'none',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.1)';
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(139, 92, 246, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.2)';
              }}
            >
              <span style={{ fontSize: '1.2rem' }}>🔄</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}