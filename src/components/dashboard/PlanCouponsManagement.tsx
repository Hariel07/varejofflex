"use client";

import { useState, useEffect } from 'react';
import { ICoupon } from '@/models/PlanCoupon';

interface PlanCouponsManagementProps {}

export default function PlanCouponsManagement({}: PlanCouponsManagementProps) {
  const [coupons, setCoupons] = useState<ICoupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<ICoupon | null>(null);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    code: '',
    name: '',
    description: '',
    discountType: 'percentage' as 'percentage' | 'fixed',
    discountValue: 0,
    minAmount: 0,
    maxDiscount: 0,
    applicablePlans: ['*'],
    usageLimit: 0,
    validFrom: '',
    validUntil: '',
    isActive: true
  });

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/coupons?category=subscription');
      const data = await response.json();
      
      if (data.success) {
        setCoupons(data.coupons || []);
      }
    } catch (error) {
      console.error('Erro ao carregar cupons:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const method = editingCoupon ? 'PUT' : 'POST';
      const payload = editingCoupon 
        ? { ...formData, id: editingCoupon._id }
        : formData;

      const response = await fetch('/api/plan-coupons', {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (data.success) {
        await fetchCoupons();
        handleCloseModal();
        alert(data.message);
      } else {
        alert('Erro: ' + data.error);
      }
    } catch (error) {
      alert('Erro ao salvar cupom: ' + error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (couponId: string) => {
    if (!confirm('Tem certeza que deseja desabilitar este cupom?')) return;

    try {
      const response = await fetch(`/api/plan-coupons?id=${couponId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        await fetchCoupons();
        alert(data.message);
      } else {
        alert('Erro: ' + data.error);
      }
    } catch (error) {
      alert('Erro ao deletar cupom: ' + error);
    }
  };

  const handleEdit = (coupon: ICoupon) => {
    setEditingCoupon(coupon);
    setFormData({
      code: coupon.code,
      name: coupon.name,
      description: coupon.description || '',
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      minAmount: coupon.minAmount || 0,
      maxDiscount: coupon.maxDiscount || 0,
      applicablePlans: coupon.applicablePlans,
      usageLimit: coupon.usageLimit || 0,
      validFrom: new Date(coupon.validFrom).toISOString().split('T')[0],
      validUntil: new Date(coupon.validUntil).toISOString().split('T')[0],
      isActive: coupon.isActive
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingCoupon(null);
    setFormData({
      code: '',
      name: '',
      description: '',
      discountType: 'percentage',
      discountValue: 0,
      minAmount: 0,
      maxDiscount: 0,
      applicablePlans: ['*'],
      usageLimit: 0,
      validFrom: '',
      validUntil: '',
      isActive: true
    });
  };

  const formatDiscount = (coupon: ICoupon) => {
    if (coupon.discountType === 'percentage') {
      return `${coupon.discountValue}%`;
    } else {
      return `R$ ${coupon.discountValue.toFixed(2)}`;
    }
  };

  const getStatusBadge = (coupon: ICoupon) => {
    const now = new Date();
    const validFrom = new Date(coupon.validFrom);
    const validUntil = new Date(coupon.validUntil);

    if (!coupon.isActive) {
      return <span className="badge bg-secondary">Desabilitado</span>;
    }
    
    if (now < validFrom) {
      return <span className="badge bg-warning text-dark">Agendado</span>;
    }
    
    if (now > validUntil) {
      return <span className="badge bg-danger">Expirado</span>;
    }
    
    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      return <span className="badge bg-danger">Esgotado</span>;
    }
    
    return <span className="badge bg-success">Ativo</span>;
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center py-5">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Carregando cupons...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="row">
      <div className="col-12">
        <div 
          className="card border-0"
          style={{
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(20px)',
            borderRadius: '20px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
          }}
        >
          <div className="card-body p-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h4 className="mb-0" style={{ fontWeight: '700', color: '#2d3748' }}>
                <i className="bi bi-ticket-perforated me-2" style={{ color: '#f093fb' }}></i>
                Cupons de Desconto
              </h4>
              <button
                className="btn rounded-pill px-4"
                style={{
                  background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                  color: 'white',
                  border: 'none',
                  fontWeight: '600'
                }}
                onClick={() => setShowModal(true)}
              >
                <i className="bi bi-plus-circle me-2"></i>
                Novo Cupom
              </button>
            </div>

            {coupons.length === 0 ? (
              <div className="text-center py-5">
                <i className="bi bi-ticket-perforated" style={{ fontSize: '4rem', color: '#f093fb' }}></i>
                <h5 className="mt-3 text-muted">Nenhum cupom encontrado</h5>
                <p className="text-muted">Crie seu primeiro cupom de desconto para os planos</p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr style={{ background: 'linear-gradient(135deg, #f093fb10 0%, #f5576c10 100%)' }}>
                      <th style={{ fontWeight: '700', color: '#2d3748' }}>Código</th>
                      <th style={{ fontWeight: '700', color: '#2d3748' }}>Nome</th>
                      <th style={{ fontWeight: '700', color: '#2d3748' }}>Desconto</th>
                      <th style={{ fontWeight: '700', color: '#2d3748' }}>Planos</th>
                      <th style={{ fontWeight: '700', color: '#2d3748' }}>Uso</th>
                      <th style={{ fontWeight: '700', color: '#2d3748' }}>Validade</th>
                      <th style={{ fontWeight: '700', color: '#2d3748' }}>Status</th>
                      <th style={{ fontWeight: '700', color: '#2d3748' }}>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {coupons.map((coupon) => (
                      <tr key={coupon._id}>
                        <td>
                          <span className="badge bg-primary rounded-pill" style={{ fontFamily: 'monospace' }}>
                            {coupon.code}
                          </span>
                        </td>
                        <td style={{ fontWeight: '600' }}>{coupon.name}</td>
                        <td>
                          <span className="badge bg-success rounded-pill">
                            {formatDiscount(coupon)}
                          </span>
                        </td>
                        <td>
                          {coupon.applicablePlans.includes('*') ? (
                            <span className="badge bg-info rounded-pill">Todos os planos</span>
                          ) : (
                            <span className="badge bg-secondary rounded-pill">
                              {coupon.applicablePlans.length} plano(s)
                            </span>
                          )}
                        </td>
                        <td>
                          {coupon.usageLimit ? (
                            <span style={{ fontSize: '0.9rem' }}>
                              {coupon.usedCount} / {coupon.usageLimit}
                            </span>
                          ) : (
                            <span className="text-muted">Ilimitado</span>
                          )}
                        </td>
                        <td style={{ fontSize: '0.9rem' }}>
                          {new Date(coupon.validFrom).toLocaleDateString()} até <br />
                          {new Date(coupon.validUntil).toLocaleDateString()}
                        </td>
                        <td>{getStatusBadge(coupon)}</td>
                        <td>
                          <div className="btn-group btn-group-sm">
                            <button
                              className="btn btn-outline-primary"
                              onClick={() => handleEdit(coupon)}
                            >
                              <i className="bi bi-pencil"></i>
                            </button>
                            <button
                              className="btn btn-outline-danger"
                              onClick={() => handleDelete(coupon._id)}
                            >
                              <i className="bi bi-trash"></i>
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

      {/* Modal */}
      {showModal && (
        <div className="modal show d-block" style={{ background: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content" style={{ borderRadius: '20px', border: 'none' }}>
              <div className="modal-header" style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: 'white', borderRadius: '20px 20px 0 0' }}>
                <h5 className="modal-title" style={{ fontWeight: '700' }}>
                  <i className="bi bi-ticket-perforated me-2"></i>
                  {editingCoupon ? 'Editar Cupom' : 'Novo Cupom'}
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={handleCloseModal}
                ></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body p-4">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label" style={{ fontWeight: '600' }}>Código do Cupom</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.code}
                        onChange={(e) => setFormData({...formData, code: e.target.value.toUpperCase()})}
                        required
                        disabled={!!editingCoupon}
                        placeholder="Ex: DESCONTO20"
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label" style={{ fontWeight: '600' }}>Nome do Cupom</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        required
                        placeholder="Ex: Desconto de Lançamento"
                      />
                    </div>
                    <div className="col-12">
                      <label className="form-label" style={{ fontWeight: '600' }}>Descrição</label>
                      <textarea
                        className="form-control"
                        rows={2}
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                        placeholder="Descrição opcional do cupom"
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label" style={{ fontWeight: '600' }}>Tipo de Desconto</label>
                      <select
                        className="form-select"
                        value={formData.discountType}
                        onChange={(e) => setFormData({...formData, discountType: e.target.value as 'percentage' | 'fixed'})}
                      >
                        <option value="percentage">Percentual (%)</option>
                        <option value="fixed">Valor Fixo (R$)</option>
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label" style={{ fontWeight: '600' }}>
                        Valor do Desconto {formData.discountType === 'percentage' ? '(%)' : '(R$)'}
                      </label>
                      <input
                        type="number"
                        className="form-control"
                        value={formData.discountValue}
                        onChange={(e) => setFormData({...formData, discountValue: Number(e.target.value)})}
                        required
                        min="0"
                        max={formData.discountType === 'percentage' ? "100" : undefined}
                        step={formData.discountType === 'percentage' ? "1" : "0.01"}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label" style={{ fontWeight: '600' }}>Data de Início</label>
                      <input
                        type="date"
                        className="form-control"
                        value={formData.validFrom}
                        onChange={(e) => setFormData({...formData, validFrom: e.target.value})}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label" style={{ fontWeight: '600' }}>Data de Fim</label>
                      <input
                        type="date"
                        className="form-control"
                        value={formData.validUntil}
                        onChange={(e) => setFormData({...formData, validUntil: e.target.value})}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label" style={{ fontWeight: '600' }}>Limite de Uso</label>
                      <input
                        type="number"
                        className="form-control"
                        value={formData.usageLimit}
                        onChange={(e) => setFormData({...formData, usageLimit: Number(e.target.value)})}
                        min="0"
                        placeholder="0 = Ilimitado"
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label" style={{ fontWeight: '600' }}>Status</label>
                      <select
                        className="form-select"
                        value={formData.isActive ? 'true' : 'false'}
                        onChange={(e) => setFormData({...formData, isActive: e.target.value === 'true'})}
                      >
                        <option value="true">Ativo</option>
                        <option value="false">Desabilitado</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="modal-footer" style={{ borderTop: 'none', padding: '1rem 2rem 2rem 2rem' }}>
                  <button
                    type="button"
                    className="btn btn-outline-secondary rounded-pill px-4"
                    onClick={handleCloseModal}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="btn rounded-pill px-4"
                    style={{
                      background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                      color: 'white',
                      border: 'none',
                      fontWeight: '600'
                    }}
                    disabled={saving}
                  >
                    {saving ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        Salvando...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-check-circle me-2"></i>
                        {editingCoupon ? 'Atualizar' : 'Criar'} Cupom
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}