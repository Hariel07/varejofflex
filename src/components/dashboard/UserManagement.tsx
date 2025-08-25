'use client';

import React, { useState, useEffect } from 'react';

interface User {
  _id: string;
  name: string;
  email: string;
  role: 'owner' | 'logista' | 'cliente';
  isActive: boolean;
  createdAt: string;
  lastLogin?: string;
  company?: {
    name: string;
    businessType: string;
    city: string;
    state: string;
    plan?: string;
  };
}

interface UserStats {
  totalUsers: number;
  activeUsers: number;
  logistas: number;
  clientes: number;
  newUsersThisMonth: number;
}

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    role: '',
    status: '',
    page: 1
  });
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    loadUsers();
  }, [filters]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      
      if (filters.search) params.append('search', filters.search);
      if (filters.role) params.append('role', filters.role);
      if (filters.status) params.append('status', filters.status);
      params.append('page', filters.page.toString());
      params.append('limit', '10');

      const response = await fetch(`/api/admin/users?${params}`);
      const data = await response.json();

      if (data.success) {
        setUsers(data.users);
        setStats(data.stats);
      } else {
        console.error('Erro ao carregar usuários:', data.error);
      }
    } catch (error) {
      console.error('Erro ao carregar usuários:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleUserStatus = async (userId: string) => {
    try {
      const response = await fetch('/api/admin/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          action: 'toggle-status'
        })
      });

      const data = await response.json();
      
      if (data.success) {
        loadUsers(); // Recarregar lista
        showNotification('Status do usuário atualizado!', 'success');
      } else {
        showNotification(data.error, 'error');
      }
    } catch (error) {
      showNotification('Erro ao atualizar usuário', 'error');
    }
  };

  const showNotification = (message: string, type: 'success' | 'error') => {
    // Implementação simples de notificação
    console.log(`${type.toUpperCase()}: ${message}`);
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'owner': return 'bg-purple-100 text-purple-800';
      case 'logista': return 'bg-blue-100 text-blue-800';
      case 'cliente': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleName = (role: string) => {
    switch (role) {
      case 'owner': return 'Owner';
      case 'logista': return 'Logista';
      case 'cliente': return 'Cliente';
      default: return role;
    }
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

  if (loading && users.length === 0) {
    return (
      <div className="d-flex justify-content-center py-5">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Carregando...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="row g-4">
      {/* Estatísticas */}
      {stats && (
        <div className="col-12">
          <div className="row g-3">
            <div className="col-xl-2 col-md-4 col-6">
              <div className="card border-0 bg-primary text-white h-100">
                <div className="card-body p-3 text-center">
                  <i className="bi bi-people fs-2 mb-2"></i>
                  <h3 className="mb-1">{stats.totalUsers}</h3>
                  <small>Total de Usuários</small>
                </div>
              </div>
            </div>
            <div className="col-xl-2 col-md-4 col-6">
              <div className="card border-0 bg-success text-white h-100">
                <div className="card-body p-3 text-center">
                  <i className="bi bi-person-check fs-2 mb-2"></i>
                  <h3 className="mb-1">{stats.activeUsers}</h3>
                  <small>Usuários Ativos</small>
                </div>
              </div>
            </div>
            <div className="col-xl-2 col-md-4 col-6">
              <div className="card border-0 bg-info text-white h-100">
                <div className="card-body p-3 text-center">
                  <i className="bi bi-shop fs-2 mb-2"></i>
                  <h3 className="mb-1">{stats.logistas}</h3>
                  <small>Logistas</small>
                </div>
              </div>
            </div>
            <div className="col-xl-2 col-md-4 col-6">
              <div className="card border-0 bg-warning text-white h-100">
                <div className="card-body p-3 text-center">
                  <i className="bi bi-person-hearts fs-2 mb-2"></i>
                  <h3 className="mb-1">{stats.clientes}</h3>
                  <small>Clientes</small>
                </div>
              </div>
            </div>
            <div className="col-xl-2 col-md-4 col-6">
              <div className="card border-0 bg-dark text-white h-100">
                <div className="card-body p-3 text-center">
                  <i className="bi bi-person-plus fs-2 mb-2"></i>
                  <h3 className="mb-1">{stats.newUsersThisMonth}</h3>
                  <small>Novos Este Mês</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filtros */}
      <div className="col-12">
        <div className="card border-0 shadow-sm">
          <div className="card-body">
            <div className="row g-3 align-items-end">
              <div className="col-md-4">
                <label className="form-label">Buscar usuário</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Nome ou email..."
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })}
                />
              </div>
              <div className="col-md-2">
                <label className="form-label">Tipo</label>
                <select
                  className="form-select"
                  value={filters.role}
                  onChange={(e) => setFilters({ ...filters, role: e.target.value, page: 1 })}
                >
                  <option value="">Todos</option>
                  <option value="logista">Logistas</option>
                  <option value="cliente">Clientes</option>
                </select>
              </div>
              <div className="col-md-2">
                <label className="form-label">Status</label>
                <select
                  className="form-select"
                  value={filters.status}
                  onChange={(e) => setFilters({ ...filters, status: e.target.value, page: 1 })}
                >
                  <option value="">Todos</option>
                  <option value="active">Ativos</option>
                  <option value="inactive">Inativos</option>
                </select>
              </div>
              <div className="col-md-2">
                <button
                  className="btn btn-outline-secondary w-100"
                  onClick={() => setFilters({ search: '', role: '', status: '', page: 1 })}
                >
                  <i className="bi bi-arrow-clockwise me-1"></i>
                  Limpar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lista de usuários */}
      <div className="col-12">
        <div className="card border-0 shadow-sm">
          <div className="card-header bg-white">
            <h5 className="mb-0">
              <i className="bi bi-people me-2"></i>
              Usuários Cadastrados
            </h5>
          </div>
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Usuário</th>
                    <th>Empresa</th>
                    <th>Tipo</th>
                    <th>Status</th>
                    <th>Cadastro</th>
                    <th>Último Acesso</th>
                    <th className="text-center">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user._id}>
                      <td>
                        <div>
                          <div className="fw-bold">{user.name}</div>
                          <small className="text-muted">{user.email}</small>
                        </div>
                      </td>
                      <td>
                        {user.company ? (
                          <div>
                            <div className="fw-bold">{user.company.name}</div>
                            <small className="text-muted">
                              {user.company.businessType} • {user.company.city}/{user.company.state}
                            </small>
                          </div>
                        ) : (
                          <span className="text-muted">-</span>
                        )}
                      </td>
                      <td>
                        <span className={`badge ${getRoleColor(user.role)}`}>
                          {getRoleName(user.role)}
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${user.isActive ? 'bg-success' : 'bg-danger'}`}>
                          {user.isActive ? 'Ativo' : 'Inativo'}
                        </span>
                      </td>
                      <td>
                        <small>{formatDate(user.createdAt)}</small>
                      </td>
                      <td>
                        <small>
                          {user.lastLogin ? formatDate(user.lastLogin) : 'Nunca'}
                        </small>
                      </td>
                      <td className="text-center">
                        <div className="btn-group btn-group-sm">
                          <button
                            className="btn btn-outline-primary"
                            onClick={() => {
                              setSelectedUser(user);
                              setShowModal(true);
                            }}
                            title="Ver detalhes"
                          >
                            <i className="bi bi-eye"></i>
                          </button>
                          <button
                            className={`btn ${user.isActive ? 'btn-outline-danger' : 'btn-outline-success'}`}
                            onClick={() => toggleUserStatus(user._id)}
                            title={user.isActive ? 'Desativar' : 'Ativar'}
                          >
                            <i className={`bi ${user.isActive ? 'bi-toggle-on' : 'bi-toggle-off'}`}></i>
                          </button>
                          {user.role === 'logista' && (
                            <button
                              className="btn btn-outline-info"
                              onClick={() => window.open(`/dashboard/logista?userId=${user._id}`, '_blank')}
                              title="Acessar dashboard do logista"
                            >
                              <i className="bi bi-box-arrow-up-right"></i>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {users.length === 0 && (
              <div className="text-center py-5">
                <i className="bi bi-people fs-1 text-muted"></i>
                <p className="text-muted mt-2">Nenhum usuário encontrado</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal de detalhes do usuário */}
      {showModal && selectedUser && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <i className="bi bi-person-circle me-2"></i>
                  Detalhes do Usuário
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="row g-3">
                  <div className="col-md-6">
                    <strong>Nome:</strong> {selectedUser.name}
                  </div>
                  <div className="col-md-6">
                    <strong>Email:</strong> {selectedUser.email}
                  </div>
                  <div className="col-md-6">
                    <strong>Tipo:</strong> 
                    <span className={`badge ms-2 ${getRoleColor(selectedUser.role)}`}>
                      {getRoleName(selectedUser.role)}
                    </span>
                  </div>
                  <div className="col-md-6">
                    <strong>Status:</strong> 
                    <span className={`badge ms-2 ${selectedUser.isActive ? 'bg-success' : 'bg-danger'}`}>
                      {selectedUser.isActive ? 'Ativo' : 'Inativo'}
                    </span>
                  </div>
                  <div className="col-md-6">
                    <strong>Cadastro:</strong> {formatDate(selectedUser.createdAt)}
                  </div>
                  <div className="col-md-6">
                    <strong>Último Acesso:</strong> {selectedUser.lastLogin ? formatDate(selectedUser.lastLogin) : 'Nunca'}
                  </div>
                  
                  {selectedUser.company && (
                    <>
                      <div className="col-12"><hr /></div>
                      <div className="col-12">
                        <h6><i className="bi bi-building me-2"></i>Dados da Empresa</h6>
                      </div>
                      <div className="col-md-6">
                        <strong>Nome:</strong> {selectedUser.company.name}
                      </div>
                      <div className="col-md-6">
                        <strong>Tipo:</strong> {selectedUser.company.businessType}
                      </div>
                      <div className="col-md-6">
                        <strong>Localização:</strong> {selectedUser.company.city}/{selectedUser.company.state}
                      </div>
                      {selectedUser.company.plan && (
                        <div className="col-md-6">
                          <strong>Plano:</strong> {selectedUser.company.plan}
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
              <div className="modal-footer">
                {selectedUser.role === 'logista' && (
                  <button
                    className="btn btn-primary"
                    onClick={() => window.open(`/dashboard/logista?userId=${selectedUser._id}`, '_blank')}
                  >
                    <i className="bi bi-box-arrow-up-right me-2"></i>
                    Acessar Dashboard
                  </button>
                )}
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}