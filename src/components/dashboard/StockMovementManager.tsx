'use client';

import React, { useState, useEffect } from 'react';

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  userType: string;
}

interface Ingredient {
  _id: string;
  name: string;
  unit: string;
  category: string;
  currentStock: number;
  minStock: number;
}

interface StockMovement {
  _id: string;
  ingredientId: {
    _id: string;
    name: string;
    unit: string;
    category: string;
  };
  type: 'entrada' | 'saida';
  quantity: number;
  reason: string;
  observations?: string;
  performedByName: string;
  userRole: 'owner' | 'logista';
  createdAt: string;
}

const modernStyles = {
  container: {
    padding: '20px',
  },
  header: {
    marginBottom: '32px',
  },
  title: {
    fontSize: '1.875rem',
    fontWeight: '700',
    color: '#ffffff',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '8px',
  },
  subtitle: {
    color: '#94a3b8',
    fontSize: '1.125rem',
  },
  section: {
    background: 'rgba(30, 41, 59, 0.8)',
    borderRadius: '16px',
    padding: '24px',
    border: '1px solid rgba(51, 65, 85, 0.5)',
    marginBottom: '24px',
  },
  sectionTitle: {
    fontSize: '1.125rem',
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: '16px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  form: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '16px',
    marginBottom: '20px',
  },
  formGroup: {
    marginBottom: '16px',
  },
  label: {
    display: 'block',
    fontSize: '0.875rem',
    fontWeight: '600',
    color: '#e2e8f0',
    marginBottom: '6px',
  },
  input: {
    width: '100%',
    padding: '12px 16px',
    background: 'rgba(51, 65, 85, 0.8)',
    border: '1px solid rgba(71, 85, 105, 0.5)',
    borderRadius: '8px',
    color: '#ffffff',
    fontSize: '0.875rem',
    transition: 'all 0.2s ease',
    fontFamily: 'inherit',
  },
  select: {
    width: '100%',
    padding: '12px 16px',
    background: 'rgba(51, 65, 85, 0.8)',
    border: '1px solid rgba(71, 85, 105, 0.5)',
    borderRadius: '8px',
    color: '#ffffff',
    fontSize: '0.875rem',
    transition: 'all 0.2s ease',
    fontFamily: 'inherit',
  },
  textarea: {
    width: '100%',
    padding: '12px 16px',
    background: 'rgba(51, 65, 85, 0.8)',
    border: '1px solid rgba(71, 85, 105, 0.5)',
    borderRadius: '8px',
    color: '#ffffff',
    fontSize: '0.875rem',
    transition: 'all 0.2s ease',
    fontFamily: 'inherit',
    minHeight: '80px',
    resize: 'vertical' as const,
  },
  button: {
    padding: '12px 24px',
    borderRadius: '8px',
    border: 'none',
    fontWeight: '600',
    fontSize: '0.875rem',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    fontFamily: 'inherit',
  },
  primaryButton: {
    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    color: '#ffffff',
  },
  secondaryButton: {
    background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
    color: '#ffffff',
    marginLeft: '12px',
  },
  dangerButton: {
    background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
    color: '#ffffff',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse' as const,
    background: 'rgba(51, 65, 85, 0.3)',
    borderRadius: '12px',
    overflow: 'hidden',
  },
  th: {
    padding: '16px 12px',
    background: 'rgba(71, 85, 105, 0.5)',
    color: '#ffffff',
    fontWeight: '600',
    fontSize: '0.875rem',
    textAlign: 'left' as const,
    borderBottom: '1px solid rgba(71, 85, 105, 0.5)',
  },
  td: {
    padding: '12px',
    color: '#e2e8f0',
    fontSize: '0.875rem',
    borderBottom: '1px solid rgba(71, 85, 105, 0.2)',
  },
  badge: {
    padding: '4px 8px',
    borderRadius: '6px',
    fontSize: '0.75rem',
    fontWeight: '600',
    display: 'inline-block',
  },
  entradaBadge: {
    background: 'rgba(34, 197, 94, 0.2)',
    color: '#4ade80',
    border: '1px solid rgba(34, 197, 94, 0.3)',
  },
  saidaBadge: {
    background: 'rgba(239, 68, 68, 0.2)',
    color: '#f87171',
    border: '1px solid rgba(239, 68, 68, 0.3)',
  },
  filterRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '16px',
    marginBottom: '20px',
  },
  alertCard: {
    background: 'rgba(239, 68, 68, 0.1)',
    border: '1px solid rgba(239, 68, 68, 0.3)',
    borderRadius: '12px',
    padding: '16px',
    marginBottom: '16px',
  },
  alertText: {
    color: '#f87171',
    fontSize: '0.875rem',
    marginBottom: '8px',
  },
  stockInfo: {
    background: 'rgba(59, 130, 246, 0.1)',
    border: '1px solid rgba(59, 130, 246, 0.3)',
    borderRadius: '8px',
    padding: '12px',
    marginTop: '8px',
  },
  stockText: {
    color: '#60a5fa',
    fontSize: '0.875rem',
  },
  pagination: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '12px',
    marginTop: '24px',
  },
  pageButton: {
    padding: '8px 12px',
    borderRadius: '6px',
    border: '1px solid rgba(71, 85, 105, 0.5)',
    background: 'rgba(51, 65, 85, 0.8)',
    color: '#e2e8f0',
    fontSize: '0.875rem',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  pageInfo: {
    color: '#94a3b8',
    fontSize: '0.875rem',
  },
};

export default function StockMovementManager() {
  const [movements, setMovements] = useState<StockMovement[]>([]);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    ingredientId: '',
    type: 'entrada' as 'entrada' | 'saida',
    quantity: '',
    reason: '',
    observations: ''
  });

  // Filters
  const [filters, setFilters] = useState({
    type: 'all',
    ingredientId: 'all',
    performedBy: 'all',
    startDate: '',
    endDate: '',
    page: 1
  });

  // Pagination
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0
  });

  const [selectedIngredient, setSelectedIngredient] = useState<Ingredient | null>(null);

  useEffect(() => {
    loadCurrentUser();
    loadIngredients();
    loadMovements();
  }, [filters]);

  const loadCurrentUser = async () => {
    try {
      const response = await fetch('/api/auth/me');
      if (response.ok) {
        const userData = await response.json();
        setCurrentUser(userData);
        
        // Se é owner, carregar lista de usuários
        if (userData.role === 'owner_saas' || userData.userType === 'owner_saas') {
          loadUsers();
        }
      }
    } catch (error) {
      console.error('Erro ao carregar usuário:', error);
    }
  };

  const loadUsers = async () => {
    try {
      const response = await fetch('/api/users');
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users || []);
      }
    } catch (error) {
      console.error('Erro ao carregar usuários:', error);
    }
  };

  const loadIngredients = async () => {
    try {
      const response = await fetch('/api/ingredients');
      if (response.ok) {
        const data = await response.json();
        setIngredients(data.ingredients || data || []);
      }
    } catch (error) {
      console.error('Erro ao carregar ingredientes:', error);
    }
  };

  const loadMovements = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      
      if (filters.type !== 'all') params.append('type', filters.type);
      if (filters.ingredientId !== 'all') params.append('ingredientId', filters.ingredientId);
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);
      params.append('page', filters.page.toString());

      const response = await fetch(`/api/stock-movements?${params.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setMovements(data.movements || []);
        setPagination(data.pagination || { page: 1, limit: 20, total: 0, pages: 0 });
      }
    } catch (error) {
      console.error('Erro ao carregar movimentações:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.ingredientId || !formData.quantity || !formData.reason) {
      alert('Preencha todos os campos obrigatórios');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch('/api/stock-movements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        alert('Movimentação registrada com sucesso!');
        setFormData({
          ingredientId: '',
          type: 'entrada',
          quantity: '',
          reason: '',
          observations: ''
        });
        setSelectedIngredient(null);
        setShowForm(false);
        loadMovements();
        loadIngredients(); // Recarregar para atualizar estoque
      } else {
        const error = await response.json();
        alert(error.error || 'Erro ao registrar movimentação');
      }
    } catch (error) {
      console.error('Erro ao registrar movimentação:', error);
      alert('Erro ao registrar movimentação');
    } finally {
      setLoading(false);
    }
  };

  const handleIngredientChange = (ingredientId: string) => {
    setFormData({ ...formData, ingredientId });
    const ingredient = ingredients.find(ing => ing._id === ingredientId);
    setSelectedIngredient(ingredient || null);
  };

  const handleFilterChange = (key: string, value: string | number) => {
    setFilters({ ...filters, [key]: value, page: 1 });
  };

  const changePage = (newPage: number) => {
    setFilters({ ...filters, page: newPage });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR');
  };

  const reasons = {
    entrada: [
      'Ajuste de inventário',
      'Devolução de cliente',
      'Transferência entre setores',
      'Correção de erro',
      'Produto encontrado',
      'Outros'
    ],
    saida: [
      'Venda',
      'Perda/Quebra',
      'Vencimento',
      'Transferência entre setores',
      'Uso interno',
      'Amostra grátis',
      'Outros'
    ]
  };

  return (
    <div style={modernStyles.container}>
      {/* Header */}
      <div style={modernStyles.header}>
        <h1 style={modernStyles.title}>
          📦 Movimentação de Estoque
        </h1>
        <p style={modernStyles.subtitle}>
          Sistema simplificado para entrada e saída de ingredientes
        </p>
      </div>

      {/* Botão Nova Movimentação */}
      <div style={modernStyles.section}>
        <button
          style={{...modernStyles.button, ...modernStyles.primaryButton}}
          onClick={() => setShowForm(!showForm)}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
          {showForm ? '❌ Cancelar' : '➕ Nova Movimentação'}
        </button>
      </div>

      {/* Formulário de Nova Movimentação */}
      {showForm && (
        <div style={modernStyles.section}>
          <h2 style={modernStyles.sectionTitle}>
            📝 Registrar Movimentação
          </h2>
          
          <form onSubmit={handleSubmit}>
            <div style={modernStyles.form}>
              <div style={modernStyles.formGroup}>
                <label style={modernStyles.label}>Ingrediente *</label>
                <select
                  style={modernStyles.select}
                  value={formData.ingredientId}
                  onChange={(e) => handleIngredientChange(e.target.value)}
                  required
                  onFocus={(e) => e.target.style.borderColor = '#10b981'}
                  onBlur={(e) => e.target.style.borderColor = 'rgba(71, 85, 105, 0.5)'}
                >
                  <option value="">Selecione um ingrediente</option>
                  {ingredients.map(ingredient => (
                    <option key={ingredient._id} value={ingredient._id}>
                      {ingredient.name} ({ingredient.category})
                    </option>
                  ))}
                </select>
              </div>

              <div style={modernStyles.formGroup}>
                <label style={modernStyles.label}>Tipo *</label>
                <select
                  style={modernStyles.select}
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as 'entrada' | 'saida' })}
                  required
                  onFocus={(e) => e.target.style.borderColor = '#10b981'}
                  onBlur={(e) => e.target.style.borderColor = 'rgba(71, 85, 105, 0.5)'}
                >
                  <option value="entrada">📈 Entrada</option>
                  <option value="saida">📉 Saída</option>
                </select>
              </div>

              <div style={modernStyles.formGroup}>
                <label style={modernStyles.label}>
                  Quantidade * {selectedIngredient && `(${selectedIngredient.unit})`}
                </label>
                <input
                  style={modernStyles.input}
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  placeholder="0.00"
                  required
                  onFocus={(e) => e.target.style.borderColor = '#10b981'}
                  onBlur={(e) => e.target.style.borderColor = 'rgba(71, 85, 105, 0.5)'}
                />
              </div>

              <div style={modernStyles.formGroup}>
                <label style={modernStyles.label}>Motivo *</label>
                <select
                  style={modernStyles.select}
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  required
                  onFocus={(e) => e.target.style.borderColor = '#10b981'}
                  onBlur={(e) => e.target.style.borderColor = 'rgba(71, 85, 105, 0.5)'}
                >
                  <option value="">Selecione o motivo</option>
                  {reasons[formData.type].map(reason => (
                    <option key={reason} value={reason}>{reason}</option>
                  ))}
                </select>
              </div>
            </div>

            <div style={modernStyles.formGroup}>
              <label style={modernStyles.label}>Observações</label>
              <textarea
                style={modernStyles.textarea}
                value={formData.observations}
                onChange={(e) => setFormData({ ...formData, observations: e.target.value })}
                placeholder="Informações adicionais (opcional)"
                onFocus={(e) => e.target.style.borderColor = '#10b981'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(71, 85, 105, 0.5)'}
              />
            </div>

            {/* Informações do Estoque Atual */}
            {selectedIngredient && (
              <div style={modernStyles.stockInfo}>
                <div style={modernStyles.stockText}>
                  <strong>Estoque Atual:</strong> {selectedIngredient.currentStock.toFixed(2)} {selectedIngredient.unit}
                  {selectedIngredient.currentStock <= selectedIngredient.minStock && (
                    <span style={{color: '#f87171', marginLeft: '8px'}}>⚠️ Estoque baixo!</span>
                  )}
                </div>
                {formData.type === 'saida' && parseFloat(formData.quantity) > selectedIngredient.currentStock && (
                  <div style={modernStyles.alertCard}>
                    <div style={modernStyles.alertText}>
                      ⚠️ Quantidade de saída maior que o estoque disponível!
                    </div>
                  </div>
                )}
              </div>
            )}

            <div style={{display: 'flex', gap: '12px', marginTop: '20px'}}>
              <button
                type="submit"
                style={{...modernStyles.button, ...modernStyles.primaryButton}}
                disabled={loading}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                {loading ? '⏳ Salvando...' : '💾 Registrar Movimentação'}
              </button>

              <button
                type="button"
                style={{...modernStyles.button, ...modernStyles.secondaryButton}}
                onClick={() => setShowForm(false)}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                ❌ Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filtros */}
      <div style={modernStyles.section}>
        <h2 style={modernStyles.sectionTitle}>
          🔍 Filtrar Movimentações
        </h2>
        
        <div style={modernStyles.filterRow}>
          <div style={modernStyles.formGroup}>
            <label style={modernStyles.label}>Tipo</label>
            <select
              style={modernStyles.select}
              value={filters.type}
              onChange={(e) => handleFilterChange('type', e.target.value)}
              onFocus={(e) => e.target.style.borderColor = '#6366f1'}
              onBlur={(e) => e.target.style.borderColor = 'rgba(71, 85, 105, 0.5)'}
            >
              <option value="all">Todos</option>
              <option value="entrada">📈 Entradas</option>
              <option value="saida">📉 Saídas</option>
            </select>
          </div>

          <div style={modernStyles.formGroup}>
            <label style={modernStyles.label}>Ingrediente</label>
            <select
              style={modernStyles.select}
              value={filters.ingredientId}
              onChange={(e) => handleFilterChange('ingredientId', e.target.value)}
              onFocus={(e) => e.target.style.borderColor = '#6366f1'}
              onBlur={(e) => e.target.style.borderColor = 'rgba(71, 85, 105, 0.5)'}
            >
              <option value="all">Todos</option>
              {ingredients.map(ingredient => (
                <option key={ingredient._id} value={ingredient._id}>
                  {ingredient.name}
                </option>
              ))}
            </select>
          </div>

          {/* Filtro por usuário - apenas para owners */}
          {(currentUser?.role === 'owner_saas' || currentUser?.userType === 'owner_saas') && (
            <div style={modernStyles.formGroup}>
              <label style={modernStyles.label}>Realizada por</label>
              <select
                style={modernStyles.select}
                value={filters.performedBy}
                onChange={(e) => handleFilterChange('performedBy', e.target.value)}
                onFocus={(e) => e.target.style.borderColor = '#6366f1'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(71, 85, 105, 0.5)'}
              >
                <option value="all">Todos os usuários</option>
                {users.map(user => (
                  <option key={user._id} value={user._id}>
                    {user.name} ({user.role})
                  </option>
                ))}
              </select>
            </div>
          )}

          <div style={modernStyles.formGroup}>
            <label style={modernStyles.label}>Data Inicial</label>
            <input
              style={modernStyles.input}
              type="date"
              value={filters.startDate}
              onChange={(e) => handleFilterChange('startDate', e.target.value)}
              onFocus={(e) => e.target.style.borderColor = '#6366f1'}
              onBlur={(e) => e.target.style.borderColor = 'rgba(71, 85, 105, 0.5)'}
            />
          </div>

          <div style={modernStyles.formGroup}>
            <label style={modernStyles.label}>Data Final</label>
            <input
              style={modernStyles.input}
              type="date"
              value={filters.endDate}
              onChange={(e) => handleFilterChange('endDate', e.target.value)}
              onFocus={(e) => e.target.style.borderColor = '#6366f1'}
              onBlur={(e) => e.target.style.borderColor = 'rgba(71, 85, 105, 0.5)'}
            />
          </div>
        </div>
      </div>

      {/* Lista de Movimentações */}
      <div style={modernStyles.section}>
        <h2 style={modernStyles.sectionTitle}>
          📋 Histórico de Movimentações
        </h2>

        {loading ? (
          <div style={{textAlign: 'center', padding: '40px', color: '#94a3b8'}}>
            ⏳ Carregando movimentações...
          </div>
        ) : movements.length === 0 ? (
          <div style={{textAlign: 'center', padding: '40px', color: '#94a3b8'}}>
            📦 Nenhuma movimentação encontrada
          </div>
        ) : (
          <>
            <div style={{overflowX: 'auto'}}>
              <table style={modernStyles.table}>
                <thead>
                  <tr>
                    <th style={modernStyles.th}>Data/Hora</th>
                    <th style={modernStyles.th}>Ingrediente</th>
                    <th style={modernStyles.th}>Tipo</th>
                    <th style={modernStyles.th}>Quantidade</th>
                    <th style={modernStyles.th}>Motivo</th>
                    <th style={modernStyles.th}>Realizada por</th>
                    <th style={modernStyles.th}>Observações</th>
                  </tr>
                </thead>
                <tbody>
                  {movements.map((movement) => (
                    <tr key={movement._id}>
                      <td style={modernStyles.td}>
                        {formatDate(movement.createdAt)}
                      </td>
                      <td style={modernStyles.td}>
                        <div>
                          <div style={{fontWeight: '600'}}>{movement.ingredientId.name}</div>
                          <div style={{fontSize: '0.75rem', color: '#94a3b8'}}>
                            {movement.ingredientId.category}
                          </div>
                        </div>
                      </td>
                      <td style={modernStyles.td}>
                        <span 
                          style={{
                            ...modernStyles.badge,
                            ...(movement.type === 'entrada' ? modernStyles.entradaBadge : modernStyles.saidaBadge)
                          }}
                        >
                          {movement.type === 'entrada' ? '📈 Entrada' : '📉 Saída'}
                        </span>
                      </td>
                      <td style={modernStyles.td}>
                        <span style={{fontWeight: '600'}}>
                          {movement.quantity.toFixed(2)} {movement.ingredientId.unit}
                        </span>
                      </td>
                      <td style={modernStyles.td}>
                        {movement.reason}
                      </td>
                      <td style={modernStyles.td}>
                        <div>
                          <div>{movement.performedByName}</div>
                          <div style={{
                            fontSize: '0.75rem', 
                            color: movement.userRole === 'owner' ? '#4ade80' : '#60a5fa'
                          }}>
                            {movement.userRole === 'owner' ? '👑 Owner' : '📦 Logista'}
                          </div>
                        </div>
                      </td>
                      <td style={modernStyles.td}>
                        {movement.observations || '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Paginação */}
            {pagination.pages > 1 && (
              <div style={modernStyles.pagination}>
                <button
                  style={modernStyles.pageButton}
                  onClick={() => changePage(filters.page - 1)}
                  disabled={filters.page <= 1}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(71, 85, 105, 0.8)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(51, 65, 85, 0.8)'}
                >
                  ← Anterior
                </button>
                
                <span style={modernStyles.pageInfo}>
                  Página {pagination.page} de {pagination.pages} 
                  ({pagination.total} movimentações)
                </span>
                
                <button
                  style={modernStyles.pageButton}
                  onClick={() => changePage(filters.page + 1)}
                  disabled={filters.page >= pagination.pages}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(71, 85, 105, 0.8)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(51, 65, 85, 0.8)'}
                >
                  Próxima →
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}