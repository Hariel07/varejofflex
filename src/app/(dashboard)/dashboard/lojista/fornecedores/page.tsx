"use client";

import { useState, useEffect } from 'react';
import { useAuthUser, useTenantApi } from '@/hooks/useAuth';
import { ProtectedContent } from '@/components/auth/ProtectedContent';

interface Fornecedor {
  _id: string;
  tipo: 'nota_branca' | 'nota_fiscal';
  nome: string;
  observacoes?: string;
  cnpj?: string;
  razaoSocial?: string;
  endereco?: {
    logradouro?: string;
    numero?: string;
    complemento?: string;
    bairro?: string;
    cidade?: string;
    estado?: string;
    cep?: string;
  };
  contato?: {
    telefone?: string;
    email?: string;
    responsavel?: string;
  };
  ativo: boolean;
  createdAt: string;
  updatedAt: string;
}

interface FornecedorFormData {
  tipo: 'nota_branca' | 'nota_fiscal';
  nome: string;
  observacoes: string;
  cnpj: string;
  razaoSocial: string;
  endereco: {
    logradouro: string;
    numero: string;
    complemento: string;
    bairro: string;
    cidade: string;
    estado: string;
    cep: string;
  };
  contato: {
    telefone: string;
    email: string;
    responsavel: string;
  };
}

export default function FornecedoresPage() {
  const { user } = useAuthUser();
  const { get, post, patch } = useTenantApi();
  
  const [fornecedores, setFornecedores] = useState<Fornecedor[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingFornecedor, setEditingFornecedor] = useState<Fornecedor | null>(null);
  const [tipoFilter, setTipoFilter] = useState<'all' | 'nota_branca' | 'nota_fiscal'>('all');
  
  const [formData, setFormData] = useState<FornecedorFormData>({
    tipo: 'nota_branca',
    nome: '',
    observacoes: '',
    cnpj: '',
    razaoSocial: '',
    endereco: {
      logradouro: '',
      numero: '',
      complemento: '',
      bairro: '',
      cidade: '',
      estado: '',
      cep: ''
    },
    contato: {
      telefone: '',
      email: '',
      responsavel: ''
    }
  });

  const estados = [
    'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 
    'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 
    'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
  ];

  useEffect(() => {
    loadFornecedores();
  }, [tipoFilter]);

  const loadFornecedores = async () => {
    try {
      setLoading(true);
      const params = tipoFilter !== 'all' ? `?tipo=${tipoFilter}` : '';
      const response = await get(`/api/fornecedores${params}`);
      if (response.ok) {
        const data = await response.json();
        setFornecedores(data || []);
      }
    } catch (error) {
      console.error('Erro ao carregar fornecedores:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      let response;
      if (editingFornecedor) {
        response = await patch(`/api/fornecedores/${editingFornecedor._id}`, formData);
      } else {
        response = await post('/api/fornecedores', formData);
      }

      if (response.ok) {
        await loadFornecedores();
        resetForm();
        alert('Fornecedor salvo com sucesso!');
      } else {
        const error = await response.json();
        alert(error.message || 'Erro ao salvar fornecedor');
      }
    } catch (error) {
      console.error('Erro ao salvar fornecedor:', error);
      alert('Erro ao salvar fornecedor');
    }
  };

  const resetForm = () => {
    setFormData({
      tipo: 'nota_branca',
      nome: '',
      observacoes: '',
      cnpj: '',
      razaoSocial: '',
      endereco: {
        logradouro: '',
        numero: '',
        complemento: '',
        bairro: '',
        cidade: '',
        estado: '',
        cep: ''
      },
      contato: {
        telefone: '',
        email: '',
        responsavel: ''
      }
    });
    setEditingFornecedor(null);
    setShowForm(false);
  };

  const editFornecedor = (fornecedor: Fornecedor) => {
    setFormData({
      tipo: fornecedor.tipo,
      nome: fornecedor.nome,
      observacoes: fornecedor.observacoes || '',
      cnpj: fornecedor.cnpj || '',
      razaoSocial: fornecedor.razaoSocial || '',
      endereco: {
        logradouro: fornecedor.endereco?.logradouro || '',
        numero: fornecedor.endereco?.numero || '',
        complemento: fornecedor.endereco?.complemento || '',
        bairro: fornecedor.endereco?.bairro || '',
        cidade: fornecedor.endereco?.cidade || '',
        estado: fornecedor.endereco?.estado || '',
        cep: fornecedor.endereco?.cep || ''
      },
      contato: {
        telefone: fornecedor.contato?.telefone || '',
        email: fornecedor.contato?.email || '',
        responsavel: fornecedor.contato?.responsavel || ''
      }
    });
    setEditingFornecedor(fornecedor);
    setShowForm(true);
  };

  const getTipoBadge = (tipo: string) => {
    return tipo === 'nota_branca' 
      ? <span className="badge bg-warning text-dark">Nota Branca</span>
      : <span className="badge bg-success">Nota Fiscal</span>;
  };

  const formatCNPJ = (cnpj: string) => {
    return cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
  };

  if (loading) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Carregando fornecedores...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <ProtectedContent permission="manage_fornecedores">
      <div className="min-vh-100" style={{ background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}>
        <div className="container-fluid py-4">
          {/* Header */}
          <div className="row mb-4">
            <div className="col">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h1 className="h3 mb-1">
                    <i className="bi bi-truck me-2"></i>
                    Gestão de Fornecedores
                  </h1>
                  <p className="text-muted mb-0">Gerencie fornecedores com nota branca ou nota fiscal</p>
                </div>
                <button 
                  className="btn btn-success"
                  onClick={() => setShowForm(!showForm)}
                >
                  <i className="bi bi-plus-circle me-2"></i>
                  {showForm ? 'Cancelar' : 'Novo Fornecedor'}
                </button>
              </div>
            </div>
          </div>

          {/* Filtros */}
          <div className="row mb-4">
            <div className="col-md-6">
              <div className="d-flex gap-2">
                <button 
                  className={`btn btn-sm ${tipoFilter === 'all' ? 'btn-primary' : 'btn-outline-primary'}`}
                  onClick={() => setTipoFilter('all')}
                >
                  Todos
                </button>
                <button 
                  className={`btn btn-sm ${tipoFilter === 'nota_branca' ? 'btn-warning' : 'btn-outline-warning'}`}
                  onClick={() => setTipoFilter('nota_branca')}
                >
                  Nota Branca
                </button>
                <button 
                  className={`btn btn-sm ${tipoFilter === 'nota_fiscal' ? 'btn-success' : 'btn-outline-success'}`}
                  onClick={() => setTipoFilter('nota_fiscal')}
                >
                  Nota Fiscal
                </button>
              </div>
            </div>
          </div>

          {/* Formulário */}
          {showForm && (
            <div className="row mb-4">
              <div className="col-12">
                <div className="card">
                  <div className="card-header">
                    <h5 className="card-title mb-0">
                      {editingFornecedor ? 'Editar Fornecedor' : 'Novo Fornecedor'}
                    </h5>
                  </div>
                  <div className="card-body">
                    <form onSubmit={handleSubmit}>
                      {/* Tipo de Fornecedor */}
                      <div className="row mb-4">
                        <div className="col-12">
                          <label className="form-label">Tipo de Fornecedor *</label>
                          <div className="d-flex gap-3">
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="radio"
                                name="tipo"
                                id="nota_branca"
                                value="nota_branca"
                                checked={formData.tipo === 'nota_branca'}
                                onChange={(e) => setFormData({...formData, tipo: e.target.value as any})}
                              />
                              <label className="form-check-label" htmlFor="nota_branca">
                                <span className="badge bg-warning text-dark me-2">Nota Branca</span>
                                Fornecedor simples (apenas nome e observações)
                              </label>
                            </div>
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="radio"
                                name="tipo"
                                id="nota_fiscal"
                                value="nota_fiscal"
                                checked={formData.tipo === 'nota_fiscal'}
                                onChange={(e) => setFormData({...formData, tipo: e.target.value as any})}
                              />
                              <label className="form-check-label" htmlFor="nota_fiscal">
                                <span className="badge bg-success me-2">Nota Fiscal</span>
                                Fornecedor completo (com CNPJ, endereço, etc.)
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Dados Básicos */}
                      <div className="row">
                        <div className="col-md-8 mb-3">
                          <label className="form-label">Nome do Fornecedor *</label>
                          <input
                            type="text"
                            className="form-control"
                            value={formData.nome}
                            onChange={(e) => setFormData({...formData, nome: e.target.value})}
                            required
                          />
                        </div>
                        <div className="col-12 mb-3">
                          <label className="form-label">Observações</label>
                          <textarea
                            className="form-control"
                            rows={3}
                            value={formData.observacoes}
                            onChange={(e) => setFormData({...formData, observacoes: e.target.value})}
                            placeholder="Observações sobre o fornecedor..."
                          />
                        </div>
                      </div>

                      {/* Dados Completos (apenas para Nota Fiscal) */}
                      {formData.tipo === 'nota_fiscal' && (
                        <>
                          <div className="row">
                            <div className="col-md-6 mb-3">
                              <label className="form-label">CNPJ *</label>
                              <input
                                type="text"
                                className="form-control"
                                value={formData.cnpj}
                                onChange={(e) => setFormData({...formData, cnpj: e.target.value})}
                                placeholder="00.000.000/0000-00"
                                required={formData.tipo === 'nota_fiscal'}
                              />
                            </div>
                            <div className="col-md-6 mb-3">
                              <label className="form-label">Razão Social *</label>
                              <input
                                type="text"
                                className="form-control"
                                value={formData.razaoSocial}
                                onChange={(e) => setFormData({...formData, razaoSocial: e.target.value})}
                                required={formData.tipo === 'nota_fiscal'}
                              />
                            </div>
                          </div>

                          {/* Endereço */}
                          <h6 className="mt-4 mb-3">Endereço</h6>
                          <div className="row">
                            <div className="col-md-8 mb-3">
                              <label className="form-label">Logradouro</label>
                              <input
                                type="text"
                                className="form-control"
                                value={formData.endereco.logradouro}
                                onChange={(e) => setFormData({
                                  ...formData, 
                                  endereco: {...formData.endereco, logradouro: e.target.value}
                                })}
                              />
                            </div>
                            <div className="col-md-4 mb-3">
                              <label className="form-label">Número</label>
                              <input
                                type="text"
                                className="form-control"
                                value={formData.endereco.numero}
                                onChange={(e) => setFormData({
                                  ...formData, 
                                  endereco: {...formData.endereco, numero: e.target.value}
                                })}
                              />
                            </div>
                            <div className="col-md-4 mb-3">
                              <label className="form-label">Bairro</label>
                              <input
                                type="text"
                                className="form-control"
                                value={formData.endereco.bairro}
                                onChange={(e) => setFormData({
                                  ...formData, 
                                  endereco: {...formData.endereco, bairro: e.target.value}
                                })}
                              />
                            </div>
                            <div className="col-md-4 mb-3">
                              <label className="form-label">Cidade</label>
                              <input
                                type="text"
                                className="form-control"
                                value={formData.endereco.cidade}
                                onChange={(e) => setFormData({
                                  ...formData, 
                                  endereco: {...formData.endereco, cidade: e.target.value}
                                })}
                              />
                            </div>
                            <div className="col-md-4 mb-3">
                              <label className="form-label">Estado</label>
                              <select
                                className="form-select"
                                value={formData.endereco.estado}
                                onChange={(e) => setFormData({
                                  ...formData, 
                                  endereco: {...formData.endereco, estado: e.target.value}
                                })}
                              >
                                <option value="">Selecione</option>
                                {estados.map(estado => (
                                  <option key={estado} value={estado}>{estado}</option>
                                ))}
                              </select>
                            </div>
                          </div>

                          {/* Contato */}
                          <h6 className="mt-4 mb-3">Contato</h6>
                          <div className="row">
                            <div className="col-md-4 mb-3">
                              <label className="form-label">Telefone</label>
                              <input
                                type="text"
                                className="form-control"
                                value={formData.contato.telefone}
                                onChange={(e) => setFormData({
                                  ...formData, 
                                  contato: {...formData.contato, telefone: e.target.value}
                                })}
                                placeholder="(00) 0000-0000"
                              />
                            </div>
                            <div className="col-md-4 mb-3">
                              <label className="form-label">E-mail</label>
                              <input
                                type="email"
                                className="form-control"
                                value={formData.contato.email}
                                onChange={(e) => setFormData({
                                  ...formData, 
                                  contato: {...formData.contato, email: e.target.value}
                                })}
                              />
                            </div>
                            <div className="col-md-4 mb-3">
                              <label className="form-label">Responsável</label>
                              <input
                                type="text"
                                className="form-control"
                                value={formData.contato.responsavel}
                                onChange={(e) => setFormData({
                                  ...formData, 
                                  contato: {...formData.contato, responsavel: e.target.value}
                                })}
                              />
                            </div>
                          </div>
                        </>
                      )}
                      
                      <div className="d-flex gap-2 mt-4">
                        <button
                          type="submit"
                          className="btn btn-success"
                          disabled={!formData.nome}
                        >
                          <i className="bi bi-save me-2"></i>
                          {editingFornecedor ? 'Atualizar' : 'Salvar'} Fornecedor
                        </button>
                        
                        <button
                          type="button"
                          className="btn btn-secondary"
                          onClick={resetForm}
                        >
                          Cancelar
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Lista de Fornecedores */}
          <div className="row">
            <div className="col-12">
              <div className="card">
                <div className="card-header">
                  <h5 className="card-title mb-0">
                    Fornecedores ({fornecedores.length})
                  </h5>
                </div>
                <div className="card-body">
                  {fornecedores.length === 0 ? (
                    <div className="text-center py-4">
                      <i className="bi bi-truck fs-1 text-muted mb-3"></i>
                      <p className="text-muted">Nenhum fornecedor cadastrado ainda.</p>
                      <button 
                        className="btn btn-success"
                        onClick={() => setShowForm(true)}
                      >
                        Cadastrar Primeiro Fornecedor
                      </button>
                    </div>
                  ) : (
                    <div className="table-responsive">
                      <table className="table table-hover">
                        <thead>
                          <tr>
                            <th>Fornecedor</th>
                            <th>Tipo</th>
                            <th>CNPJ</th>
                            <th>Contato</th>
                            <th>Ações</th>
                          </tr>
                        </thead>
                        <tbody>
                          {fornecedores.map(fornecedor => (
                            <tr key={fornecedor._id}>
                              <td>
                                <div>
                                  <div className="fw-bold">{fornecedor.nome}</div>
                                  {fornecedor.razaoSocial && (
                                    <small className="text-muted">{fornecedor.razaoSocial}</small>
                                  )}
                                  {fornecedor.observacoes && (
                                    <small className="text-muted d-block">
                                      {fornecedor.observacoes.length > 50 
                                        ? fornecedor.observacoes.substring(0, 50) + '...' 
                                        : fornecedor.observacoes}
                                    </small>
                                  )}
                                </div>
                              </td>
                              <td>{getTipoBadge(fornecedor.tipo)}</td>
                              <td>
                                {fornecedor.cnpj ? formatCNPJ(fornecedor.cnpj) : '-'}
                              </td>
                              <td>
                                <div className="small">
                                  {fornecedor.contato?.telefone && (
                                    <div><i className="bi bi-telephone"></i> {fornecedor.contato.telefone}</div>
                                  )}
                                  {fornecedor.contato?.email && (
                                    <div><i className="bi bi-envelope"></i> {fornecedor.contato.email}</div>
                                  )}
                                  {!fornecedor.contato?.telefone && !fornecedor.contato?.email && '-'}
                                </div>
                              </td>
                              <td>
                                <div className="btn-group btn-group-sm">
                                  <button
                                    className="btn btn-outline-primary"
                                    onClick={() => editFornecedor(fornecedor)}
                                    title="Editar"
                                  >
                                    <i className="bi bi-pencil"></i>
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedContent>
  );
}