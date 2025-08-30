'use client';

import { useState, useEffect } from 'react';

interface Fornecedor {
  _id: string;
  name: string;
  type: 'completo' | 'simples';
  email?: string;
  phone?: string;
  cnpjCpf?: string;
  category?: string;
  isActive: boolean;
  address?: {
    city: string;
    state: string;
  };
}

export default function FornecedoresPage() {
  const [fornecedores, setFornecedores] = useState<Fornecedor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');

  useEffect(() => {
    fetchFornecedores();
  }, [selectedType]);

  const fetchFornecedores = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (selectedType !== 'all') params.set('type', selectedType);
      if (searchTerm) params.set('search', searchTerm);

      const response = await fetch(`/api/fornecedores?${params}`);
      const data = await response.json();
      
      if (data.success && Array.isArray(data.fornecedores)) {
        setFornecedores(data.fornecedores);
      } else {
        setFornecedores([]);
      }
    } catch (error) {
      console.error('Erro ao buscar fornecedores:', error);
      setFornecedores([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredFornecedores = fornecedores.filter(fornecedor =>
    fornecedor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    fornecedor.category?.toLowerCase().includes(searchTerm.toLowerCase())
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
                  <span className="me-2" style={{ fontSize: '1.5rem' }}>🏢</span>
                  Fornecedores
                </h1>
                <p className="text-muted mb-0">Gerencie seus fornecedores e parceiros</p>
              </div>
              <button className="btn btn-primary">
                <span className="me-2">➕</span>
                Novo Fornecedor
              </button>
            </div>
          </div>
        </div>

        {/* Filtros */}
        <div className="row mb-4">
          <div className="col-md-8">
            <div className="input-group">
              <span className="input-group-text">🔍</span>
              <input
                type="text"
                className="form-control"
                placeholder="Buscar fornecedores..."
                value={searchTerm}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="col-md-4">
            <div className="d-flex gap-2">
              <button
                onClick={() => setSelectedType('all')}
                className={`btn btn-sm ${
                  selectedType === 'all' ? 'btn-primary' : 'btn-outline-primary'
                }`}
              >
                Todos
              </button>
              <button
                onClick={() => setSelectedType('completo')}
                className={`btn btn-sm ${
                  selectedType === 'completo' ? 'btn-success' : 'btn-outline-success'
                }`}
              >
                Completos
              </button>
              <button
                onClick={() => setSelectedType('simples')}
                className={`btn btn-sm ${
                  selectedType === 'simples' ? 'btn-secondary' : 'btn-outline-secondary'
                }`}
              >
                Simples
              </button>
            </div>
          </div>
        </div>

        {/* Estatísticas */}
        <div className="row mb-4">
          <div className="col-md-4 mb-3">
            <div className="card h-100 shadow-sm">
              <div className="card-body text-center">
                <div className="display-4 text-primary mb-2">🏢</div>
                <h5 className="card-title" style={{ color: '#1f2937' }}>Total</h5>
                <h2 className="text-primary">{fornecedores.length}</h2>
              </div>
            </div>
          </div>
          <div className="col-md-4 mb-3">
            <div className="card h-100 shadow-sm">
              <div className="card-body text-center">
                <div className="display-4 text-success mb-2">📄</div>
                <h5 className="card-title" style={{ color: '#1f2937' }}>Completos</h5>
                <h2 className="text-success">{fornecedores.filter(f => f.type === 'completo').length}</h2>
                <small className="text-muted">Com Nota Fiscal</small>
              </div>
            </div>
          </div>
          <div className="col-md-4 mb-3">
            <div className="card h-100 shadow-sm">
              <div className="card-body text-center">
                <div className="display-4 text-warning mb-2">📝</div>
                <h5 className="card-title" style={{ color: '#1f2937' }}>Simples</h5>
                <h2 className="text-warning">{fornecedores.filter(f => f.type === 'simples').length}</h2>
                <small className="text-muted">Nota Branca</small>
              </div>
            </div>
          </div>
        </div>

        {/* Lista de Fornecedores */}
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3 text-muted">Carregando fornecedores...</p>
          </div>
        ) : filteredFornecedores.length === 0 ? (
          <div className="card shadow-sm">
            <div className="card-body text-center py-5">
              <div className="display-1 mb-3">🏢</div>
              <h5 className="card-title" style={{ color: '#1f2937' }}>
                Nenhum fornecedor encontrado
              </h5>
              <p className="text-muted mb-4">
                Comece adicionando seu primeiro fornecedor
              </p>
              <button className="btn btn-primary">
                <span className="me-2">➕</span>
                Adicionar Fornecedor
              </button>
            </div>
          </div>
        ) : (
          <div className="row">
            {filteredFornecedores.map((fornecedor) => (
              <div key={fornecedor._id} className="col-md-6 col-lg-4 mb-4">
                <div className="card h-100 shadow-sm">
                  <div className="card-header bg-white">
                    <div className="d-flex justify-content-between align-items-start">
                      <div>
                        <h6 className="card-title mb-1" style={{ color: '#1f2937', fontWeight: '600' }}>
                          {fornecedor.name}
                        </h6>
                        <div className="d-flex gap-2 flex-wrap">
                          <span className={`badge ${
                            fornecedor.type === 'completo'
                              ? 'bg-primary'
                              : 'bg-secondary'
                          }`}>
                            {fornecedor.type === 'completo' ? 'Com NF' : 'Nota Branca'}
                          </span>
                          <span className={`badge ${
                            fornecedor.isActive
                              ? 'bg-success'
                              : 'bg-danger'
                          }`}>
                            {fornecedor.isActive ? 'Ativo' : 'Inativo'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="card-body">
                    <div className="text-sm">
                      {fornecedor.category && (
                        <div className="d-flex align-items-center gap-2 mb-2 text-muted">
                          <span>🏢</span>
                          <span>{fornecedor.category}</span>
                        </div>
                      )}
                      {fornecedor.phone && (
                        <div className="d-flex align-items-center gap-2 mb-2 text-muted">
                          <span>📞</span>
                          <span>{fornecedor.phone}</span>
                        </div>
                      )}
                      {fornecedor.email && (
                        <div className="d-flex align-items-center gap-2 mb-2 text-muted">
                          <span>📧</span>
                          <span className="text-truncate">{fornecedor.email}</span>
                        </div>
                      )}
                      {fornecedor.address && (
                        <div className="d-flex align-items-center gap-2 mb-2 text-muted">
                          <span>📍</span>
                          <span>{fornecedor.address.city}, {fornecedor.address.state}</span>
                        </div>
                      )}
                      {fornecedor.cnpjCpf && (
                        <div className="small text-muted mt-2">
                          CNPJ/CPF: {fornecedor.cnpjCpf}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}