'use client';

import React, { useState, useEffect } from 'react';

interface PurchaseItem {
  _id?: string;
  productName: string;
  quantity: number;
  unitCost: number;
  totalCost: number;
  supplier: string;
  batchNumber: string;
  expiryDate: string;
  category: string;
  notes: string;
}

interface Purchase {
  _id?: string;
  supplier: string;
  totalAmount: number;
  purchaseDate: string;
  status: 'pending' | 'approved' | 'received' | 'cancelled';
  notes: string;
  items: PurchaseItem[];
  createdAt?: string;
  updatedAt?: string;
}

const modernStyles = {
  container: {
    padding: '20px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '32px',
    flexWrap: 'wrap' as const,
    gap: '16px',
  },
  title: {
    fontSize: '1.875rem',
    fontWeight: '700',
    color: '#ffffff',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  form: {
    background: 'rgba(30, 41, 59, 0.8)',
    borderRadius: '16px',
    padding: '24px',
    border: '1px solid rgba(51, 65, 85, 0.5)',
    marginBottom: '24px',
  },
  formTitle: {
    fontSize: '1.25rem',
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: '20px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  formRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '16px',
    marginBottom: '16px',
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
    minHeight: '100px',
    resize: 'vertical' as const,
    fontFamily: 'inherit',
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
  buttonPrimary: {
    background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
    color: '#ffffff',
  },
  buttonSecondary: {
    background: 'rgba(71, 85, 105, 0.8)',
    color: '#e2e8f0',
  },
  buttonDanger: {
    background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
    color: '#ffffff',
  },
  buttonSuccess: {
    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    color: '#ffffff',
  },
  itemsContainer: {
    background: 'rgba(51, 65, 85, 0.3)',
    borderRadius: '12px',
    padding: '16px',
    marginTop: '16px',
  },
  itemsList: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '12px',
  },
  item: {
    background: 'rgba(30, 41, 59, 0.8)',
    borderRadius: '8px',
    padding: '16px',
    border: '1px solid rgba(71, 85, 105, 0.3)',
  },
  itemHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px',
  },
  itemTitle: {
    fontWeight: '600',
    color: '#ffffff',
  },
  itemDetails: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
    gap: '8px',
    fontSize: '0.75rem',
    color: '#94a3b8',
  },
  purchasesList: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '16px',
  },
  purchaseCard: {
    background: 'rgba(30, 41, 59, 0.8)',
    borderRadius: '12px',
    padding: '20px',
    border: '1px solid rgba(51, 65, 85, 0.5)',
    transition: 'all 0.2s ease',
  },
  purchaseHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
    flexWrap: 'wrap' as const,
    gap: '12px',
  },
  statusBadge: {
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '0.75rem',
    fontWeight: '600',
    textTransform: 'uppercase' as const,
  },
  statusPending: {
    background: 'rgba(245, 158, 11, 0.2)',
    color: '#fbbf24',
    border: '1px solid rgba(245, 158, 11, 0.3)',
  },
  statusApproved: {
    background: 'rgba(34, 197, 94, 0.2)',
    color: '#4ade80',
    border: '1px solid rgba(34, 197, 94, 0.3)',
  },
  statusReceived: {
    background: 'rgba(59, 130, 246, 0.2)',
    color: '#60a5fa',
    border: '1px solid rgba(59, 130, 246, 0.3)',
  },
  statusCancelled: {
    background: 'rgba(239, 68, 68, 0.2)',
    color: '#f87171',
    border: '1px solid rgba(239, 68, 68, 0.3)',
  },
  loadingSpinner: {
    width: '20px',
    height: '20px',
    border: '2px solid rgba(255, 255, 255, 0.3)',
    borderTop: '2px solid #ffffff',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  emptyState: {
    textAlign: 'center' as const,
    padding: '60px 20px',
    color: '#94a3b8',
  },
  emptyStateIcon: {
    fontSize: '4rem',
    marginBottom: '16px',
  },
  error: {
    background: 'rgba(239, 68, 68, 0.1)',
    border: '1px solid rgba(239, 68, 68, 0.3)',
    borderRadius: '8px',
    padding: '12px 16px',
    color: '#f87171',
    marginBottom: '16px',
  },
  success: {
    background: 'rgba(34, 197, 94, 0.1)',
    border: '1px solid rgba(34, 197, 94, 0.3)',
    borderRadius: '8px',
    padding: '12px 16px',
    color: '#4ade80',
    marginBottom: '16px',
  },
};

export default function PurchaseManager() {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Purchase>({
    supplier: '',
    totalAmount: 0,
    purchaseDate: new Date().toISOString().split('T')[0],
    status: 'pending',
    notes: '',
    items: []
  });
  const [currentItem, setCurrentItem] = useState<PurchaseItem>({
    productName: '',
    quantity: 0,
    unitCost: 0,
    totalCost: 0,
    supplier: '',
    batchNumber: '',
    expiryDate: '',
    category: '',
    notes: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Carregar compras existentes
  useEffect(() => {
    loadPurchases();
  }, []);

  const loadPurchases = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/purchases');
      if (response.ok) {
        const data = await response.json();
        setPurchases(data);
      }
    } catch (error) {
      console.error('Erro ao carregar compras:', error);
      setError('Erro ao carregar compras');
    } finally {
      setLoading(false);
    }
  };

  const addItem = () => {
    if (!currentItem.productName || currentItem.quantity <= 0) {
      setError('Preencha todos os campos obrigatórios do item');
      return;
    }

    const totalCost = currentItem.quantity * currentItem.unitCost;
    const newItem: PurchaseItem = {
      ...currentItem,
      totalCost
    };

    setFormData(prev => ({
      ...prev,
      items: [...prev.items, newItem],
      totalAmount: prev.totalAmount + totalCost
    }));

    // Limpar formulário do item
    setCurrentItem({
      productName: '',
      quantity: 0,
      unitCost: 0,
      totalCost: 0,
      supplier: formData.supplier,
      batchNumber: '',
      expiryDate: '',
      category: '',
      notes: ''
    });

    setSuccess('Item adicionado com sucesso');
    setTimeout(() => setSuccess(''), 3000);
  };

  const removeItem = (index: number) => {
    const item = formData.items[index];
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
      totalAmount: prev.totalAmount - item.totalCost
    }));
  };

  const savePurchase = async () => {
    try {
      if (!formData.supplier || formData.items.length === 0) {
        setError('Preencha o fornecedor e adicione pelo menos um item');
        return;
      }

      setLoading(true);
      const url = isEditing ? `/api/purchases/${editingId}` : '/api/purchases';
      const method = isEditing ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setSuccess(isEditing ? 'Compra atualizada!' : 'Compra salva!');
        resetForm();
        loadPurchases();
      } else {
        setError('Erro ao salvar compra');
      }
    } catch (error) {
      console.error('Erro:', error);
      setError('Erro ao salvar compra');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      supplier: '',
      totalAmount: 0,
      purchaseDate: new Date().toISOString().split('T')[0],
      status: 'pending',
      notes: '',
      items: []
    });
    setCurrentItem({
      productName: '',
      quantity: 0,
      unitCost: 0,
      totalCost: 0,
      supplier: '',
      batchNumber: '',
      expiryDate: '',
      category: '',
      notes: ''
    });
    setIsEditing(false);
    setEditingId(null);
  };

  const editPurchase = (purchase: Purchase) => {
    setFormData(purchase);
    setIsEditing(true);
    setEditingId(purchase._id || null);
  };

  const deletePurchase = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta compra?')) return;

    try {
      const response = await fetch(`/api/purchases/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setSuccess('Compra excluída com sucesso');
        loadPurchases();
      } else {
        setError('Erro ao excluir compra');
      }
    } catch (error) {
      console.error('Erro:', error);
      setError('Erro ao excluir compra');
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'pending': return modernStyles.statusPending;
      case 'approved': return modernStyles.statusApproved;
      case 'received': return modernStyles.statusReceived;
      case 'cancelled': return modernStyles.statusCancelled;
      default: return modernStyles.statusPending;
    }
  };

  return (
    <div style={modernStyles.container}>
      {/* Header */}
      <div style={modernStyles.header}>
        <h1 style={modernStyles.title}>
          🛒 Gestão de Compras
        </h1>
      </div>

      {/* Mensagens */}
      {error && (
        <div style={modernStyles.error}>
          ❌ {error}
        </div>
      )}
      
      {success && (
        <div style={modernStyles.success}>
          ✅ {success}
        </div>
      )}

      {/* Formulário */}
      <div style={modernStyles.form}>
        <h2 style={modernStyles.formTitle}>
          {isEditing ? '✏️ Editar Compra' : '➕ Nova Compra'}
        </h2>

        <div style={modernStyles.formRow}>
          <div style={modernStyles.formGroup}>
            <label style={modernStyles.label}>Fornecedor *</label>
            <input
              type="text"
              style={modernStyles.input}
              value={formData.supplier}
              onChange={(e) => setFormData(prev => ({ ...prev, supplier: e.target.value }))}
              placeholder="Nome do fornecedor"
              onFocus={(e) => e.target.style.borderColor = '#f97316'}
              onBlur={(e) => e.target.style.borderColor = 'rgba(71, 85, 105, 0.5)'}
            />
          </div>

          <div style={modernStyles.formGroup}>
            <label style={modernStyles.label}>Data da Compra</label>
            <input
              type="date"
              style={modernStyles.input}
              value={formData.purchaseDate}
              onChange={(e) => setFormData(prev => ({ ...prev, purchaseDate: e.target.value }))}
              onFocus={(e) => e.target.style.borderColor = '#f97316'}
              onBlur={(e) => e.target.style.borderColor = 'rgba(71, 85, 105, 0.5)'}
            />
          </div>

          <div style={modernStyles.formGroup}>
            <label style={modernStyles.label}>Status</label>
            <select
              style={modernStyles.select}
              value={formData.status}
              onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as any }))}
              onFocus={(e) => e.target.style.borderColor = '#f97316'}
              onBlur={(e) => e.target.style.borderColor = 'rgba(71, 85, 105, 0.5)'}
            >
              <option value="pending">Pendente</option>
              <option value="approved">Aprovado</option>
              <option value="received">Recebido</option>
              <option value="cancelled">Cancelado</option>
            </select>
          </div>
        </div>

        <div style={modernStyles.formGroup}>
          <label style={modernStyles.label}>Observações</label>
          <textarea
            style={modernStyles.textarea}
            value={formData.notes}
            onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
            placeholder="Observações sobre a compra..."
            onFocus={(e) => e.target.style.borderColor = '#f97316'}
            onBlur={(e) => e.target.style.borderColor = 'rgba(71, 85, 105, 0.5)'}
          />
        </div>

        {/* Formulário de Itens */}
        <div style={modernStyles.itemsContainer}>
          <h3 style={{...modernStyles.formTitle, marginBottom: '16px'}}>
            📦 Adicionar Item
          </h3>

          <div style={modernStyles.formRow}>
            <div style={modernStyles.formGroup}>
              <label style={modernStyles.label}>Produto *</label>
              <input
                type="text"
                style={modernStyles.input}
                value={currentItem.productName}
                onChange={(e) => setCurrentItem(prev => ({ ...prev, productName: e.target.value }))}
                placeholder="Nome do produto"
                onFocus={(e) => e.target.style.borderColor = '#f97316'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(71, 85, 105, 0.5)'}
              />
            </div>

            <div style={modernStyles.formGroup}>
              <label style={modernStyles.label}>Quantidade *</label>
              <input
                type="number"
                style={modernStyles.input}
                value={currentItem.quantity || ''}
                onChange={(e) => setCurrentItem(prev => ({ ...prev, quantity: Number(e.target.value) }))}
                placeholder="0"
                min="0"
                step="0.01"
                onFocus={(e) => e.target.style.borderColor = '#f97316'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(71, 85, 105, 0.5)'}
              />
            </div>

            <div style={modernStyles.formGroup}>
              <label style={modernStyles.label}>Custo Unitário</label>
              <input
                type="number"
                style={modernStyles.input}
                value={currentItem.unitCost || ''}
                onChange={(e) => setCurrentItem(prev => ({ ...prev, unitCost: Number(e.target.value) }))}
                placeholder="0.00"
                min="0"
                step="0.01"
                onFocus={(e) => e.target.style.borderColor = '#f97316'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(71, 85, 105, 0.5)'}
              />
            </div>

            <div style={modernStyles.formGroup}>
              <label style={modernStyles.label}>Categoria</label>
              <input
                type="text"
                style={modernStyles.input}
                value={currentItem.category}
                onChange={(e) => setCurrentItem(prev => ({ ...prev, category: e.target.value }))}
                placeholder="Categoria do produto"
                onFocus={(e) => e.target.style.borderColor = '#f97316'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(71, 85, 105, 0.5)'}
              />
            </div>

            <div style={modernStyles.formGroup}>
              <label style={modernStyles.label}>Nº do Lote</label>
              <input
                type="text"
                style={modernStyles.input}
                value={currentItem.batchNumber}
                onChange={(e) => setCurrentItem(prev => ({ ...prev, batchNumber: e.target.value }))}
                placeholder="Número do lote"
                onFocus={(e) => e.target.style.borderColor = '#f97316'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(71, 85, 105, 0.5)'}
              />
            </div>

            <div style={modernStyles.formGroup}>
              <label style={modernStyles.label}>Data de Validade</label>
              <input
                type="date"
                style={modernStyles.input}
                value={currentItem.expiryDate}
                onChange={(e) => setCurrentItem(prev => ({ ...prev, expiryDate: e.target.value }))}
                onFocus={(e) => e.target.style.borderColor = '#f97316'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(71, 85, 105, 0.5)'}
              />
            </div>
          </div>

          <button
            style={{...modernStyles.button, ...modernStyles.buttonPrimary}}
            onClick={addItem}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            ➕ Adicionar Item
          </button>
        </div>

        {/* Lista de Itens */}
        {formData.items.length > 0 && (
          <div style={{...modernStyles.itemsContainer, marginTop: '16px'}}>
            <h3 style={{...modernStyles.formTitle, marginBottom: '16px'}}>
              📋 Itens da Compra ({formData.items.length})
            </h3>

            <div style={modernStyles.itemsList}>
              {formData.items.map((item, index) => (
                <div key={index} style={modernStyles.item}>
                  <div style={modernStyles.itemHeader}>
                    <h4 style={modernStyles.itemTitle}>{item.productName}</h4>
                    <button
                      style={{...modernStyles.button, ...modernStyles.buttonDanger, padding: '8px 12px'}}
                      onClick={() => removeItem(index)}
                      onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                      onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                    >
                      🗑️
                    </button>
                  </div>
                  <div style={modernStyles.itemDetails}>
                    <span>Qtd: {item.quantity}</span>
                    <span>Unit.: R$ {item.unitCost.toFixed(2)}</span>
                    <span>Total: R$ {item.totalCost.toFixed(2)}</span>
                    <span>Categoria: {item.category}</span>
                    <span>Lote: {item.batchNumber}</span>
                    <span>Validade: {item.expiryDate ? new Date(item.expiryDate).toLocaleDateString() : 'N/A'}</span>
                  </div>
                </div>
              ))}
            </div>

            <div style={{marginTop: '16px', padding: '16px', background: 'rgba(51, 65, 85, 0.5)', borderRadius: '8px'}}>
              <h4 style={{color: '#ffffff', fontSize: '1.125rem', fontWeight: '600'}}>
                💰 Total da Compra: R$ {formData.totalAmount.toFixed(2)}
              </h4>
            </div>
          </div>
        )}

        {/* Botões de Ação */}
        <div style={{display: 'flex', gap: '12px', marginTop: '24px', flexWrap: 'wrap'}}>
          <button
            style={{...modernStyles.button, ...modernStyles.buttonSuccess}}
            onClick={savePurchase}
            disabled={loading}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            {loading ? (
              <div style={modernStyles.loadingSpinner}></div>
            ) : (
              `💾 ${isEditing ? 'Atualizar' : 'Salvar'} Compra`
            )}
          </button>

          <button
            style={{...modernStyles.button, ...modernStyles.buttonSecondary}}
            onClick={resetForm}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            🔄 Limpar Formulário
          </button>
        </div>
      </div>

      {/* Lista de Compras */}
      <div style={modernStyles.form}>
        <h2 style={modernStyles.formTitle}>
          📋 Compras Registradas
        </h2>

        {loading ? (
          <div style={{textAlign: 'center', padding: '40px'}}>
            <div style={modernStyles.loadingSpinner}></div>
            <p style={{color: '#94a3b8', marginTop: '16px'}}>Carregando compras...</p>
          </div>
        ) : purchases.length === 0 ? (
          <div style={modernStyles.emptyState}>
            <div style={modernStyles.emptyStateIcon}>📦</div>
            <h3 style={{color: '#ffffff', marginBottom: '8px'}}>Nenhuma compra registrada</h3>
            <p>Adicione sua primeira compra usando o formulário acima.</p>
          </div>
        ) : (
          <div style={modernStyles.purchasesList}>
            {purchases.map((purchase) => (
              <div
                key={purchase._id}
                style={modernStyles.purchaseCard}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 10px 25px -5px rgba(0, 0, 0, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div style={modernStyles.purchaseHeader}>
                  <div>
                    <h3 style={{color: '#ffffff', fontSize: '1.125rem', fontWeight: '600', marginBottom: '4px'}}>
                      🏪 {purchase.supplier}
                    </h3>
                    <p style={{color: '#94a3b8', fontSize: '0.875rem'}}>
                      📅 {new Date(purchase.purchaseDate).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  <div style={{textAlign: 'right'}}>
                    <div style={{...modernStyles.statusBadge, ...getStatusStyle(purchase.status)}}>
                      {purchase.status}
                    </div>
                    <p style={{color: '#ffffff', fontSize: '1.25rem', fontWeight: '700', marginTop: '8px'}}>
                      R$ {purchase.totalAmount.toFixed(2)}
                    </p>
                  </div>
                </div>

                <div style={{marginBottom: '16px'}}>
                  <p style={{color: '#94a3b8', fontSize: '0.875rem'}}>
                    📦 {purchase.items.length} {purchase.items.length === 1 ? 'item' : 'itens'}
                  </p>
                  {purchase.notes && (
                    <p style={{color: '#e2e8f0', fontSize: '0.875rem', marginTop: '4px'}}>
                      📝 {purchase.notes}
                    </p>
                  )}
                </div>

                <div style={{display: 'flex', gap: '8px', flexWrap: 'wrap'}}>
                  <button
                    style={{...modernStyles.button, ...modernStyles.buttonSecondary, padding: '8px 16px'}}
                    onClick={() => editPurchase(purchase)}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                  >
                    ✏️ Editar
                  </button>
                  <button
                    style={{...modernStyles.button, ...modernStyles.buttonDanger, padding: '8px 16px'}}
                    onClick={() => purchase._id && deletePurchase(purchase._id)}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                  >
                    🗑️ Excluir
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}