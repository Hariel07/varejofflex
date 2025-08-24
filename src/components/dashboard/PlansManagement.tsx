"use client";

import React, { useState } from 'react';
import { usePlansManager } from '@/hooks/usePlans';
import { IPlan } from '@/models/Plan';

export default function PlansManagement() {
  const { 
    plans, 
    loading, 
    error, 
    savePlan, 
    deletePlan, 
    initializePlans, 
    saving 
  } = usePlansManager();

  const [editingPlan, setEditingPlan] = useState<IPlan | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<Partial<IPlan>>({});

  const handleEdit = (plan: IPlan) => {
    setEditingPlan(plan);
    setFormData({ ...plan });
    setShowForm(true);
  };

  const handleNew = () => {
    setEditingPlan(null);
    setFormData({
      planId: '',
      name: '',
      description: '',
      features: [''],
      pricing: {
        weekly: { price: 0, enabled: true, discount: 0 },
        monthly: { price: 0, enabled: true, discount: 0 },
        annual: { price: 0, enabled: true, discount: 17 }
      },
      color: '#0d6efd',
      popular: false,
      enabled: true,
      trialDays: 14,
      order: 0
    });
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!formData.planId || !formData.name) {
      alert('Preencha os campos obrigatórios');
      return;
    }

    const success = await savePlan(formData);
    if (success) {
      setShowForm(false);
      setEditingPlan(null);
      setFormData({});
    } else {
      alert('Erro ao salvar plano');
    }
  };

  const handleDelete = async (planId: string) => {
    if (confirm('Tem certeza que deseja desabilitar este plano?')) {
      const success = await deletePlan(planId);
      if (!success) {
        alert('Erro ao desabilitar plano');
      }
    }
  };

  const handleInitialize = async () => {
    if (confirm('Isso criará os planos padrão. Continuar?')) {
      const success = await initializePlans(false);
      if (!success) {
        alert('Erro ao inicializar planos');
      }
    }
  };

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const updatePricing = (cycle: 'weekly' | 'monthly' | 'annual', field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      pricing: {
        weekly: prev.pricing?.weekly || { price: 0, enabled: true, discount: 0 },
        monthly: prev.pricing?.monthly || { price: 0, enabled: true, discount: 0 },
        annual: prev.pricing?.annual || { price: 0, enabled: true, discount: 0 },
        ...prev.pricing,
        [cycle]: {
          ...(prev.pricing?.[cycle] || { price: 0, enabled: true, discount: 0 }),
          [field]: value
        }
      }
    }));
  };

  const addFeature = () => {
    setFormData(prev => ({
      ...prev,
      features: [...(prev.features || []), '']
    }));
  };

  const updateFeature = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features?.map((feature, i) => i === index ? value : feature) || []
    }));
  };

  const removeFeature = (index: number) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features?.filter((_, i) => i !== index) || []
    }));
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

  return (
    <div className="container-fluid py-4">
      <div className="row mb-4">
        <div className="col-md-6">
          <h2 className="h4 mb-0">Gerenciamento de Planos</h2>
          <p className="text-muted">Configure preços e recursos dos planos</p>
        </div>
        <div className="col-md-6 text-end">
          <button 
            className="btn btn-outline-primary me-2" 
            onClick={handleInitialize}
            disabled={saving}
          >
            <i className="bi bi-bootstrap-reboot me-1"></i>
            Inicializar Planos Padrão
          </button>
          <button 
            className="btn btn-primary" 
            onClick={handleNew}
            disabled={saving}
          >
            <i className="bi bi-plus-lg me-1"></i>
            Novo Plano
          </button>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          <i className="bi bi-exclamation-triangle me-2"></i>
          {error}
        </div>
      )}

      {/* Lista de Planos */}
      <div className="row g-4 mb-4">
        {plans.map((plan) => (
          <div key={plan.planId} className="col-lg-4">
            <div className={`card h-100 ${plan.enabled ? '' : 'opacity-50'}`}>
              <div className="card-header d-flex justify-content-between align-items-center">
                <div>
                  <h5 className="mb-0" style={{ color: plan.color }}>
                    {plan.name}
                    {plan.popular && (
                      <span className="badge bg-warning text-dark ms-2">Popular</span>
                    )}
                  </h5>
                  <small className="text-muted">ID: {plan.planId}</small>
                </div>
                <div className="btn-group btn-group-sm">
                  <button 
                    className="btn btn-outline-primary" 
                    onClick={() => handleEdit(plan)}
                    disabled={saving}
                  >
                    <i className="bi bi-pencil"></i>
                  </button>
                  <button 
                    className="btn btn-outline-danger" 
                    onClick={() => handleDelete(plan.planId)}
                    disabled={saving}
                  >
                    <i className="bi bi-trash"></i>
                  </button>
                </div>
              </div>
              <div className="card-body">
                <p className="text-muted small">{plan.description}</p>
                
                <div className="mb-3">
                  <h6 className="fw-bold">Preços:</h6>
                  <div className="row g-2 text-center">
                    {plan.pricing.weekly.enabled && (
                      <div className="col-4">
                        <div className="border rounded p-2">
                          <small className="text-muted d-block">Semanal</small>
                          <strong>R$ {plan.pricing.weekly.price}</strong>
                        </div>
                      </div>
                    )}
                    {plan.pricing.monthly.enabled && (
                      <div className="col-4">
                        <div className="border rounded p-2">
                          <small className="text-muted d-block">Mensal</small>
                          <strong>R$ {plan.pricing.monthly.price}</strong>
                        </div>
                      </div>
                    )}
                    {plan.pricing.annual.enabled && (
                      <div className="col-4">
                        <div className="border rounded p-2">
                          <small className="text-muted d-block">Anual</small>
                          <strong>R$ {plan.pricing.annual.price}</strong>
                          {plan.pricing.annual.discount && plan.pricing.annual.discount > 0 && (
                            <small className="text-success d-block">-{plan.pricing.annual.discount}%</small>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mb-3">
                  <h6 className="fw-bold">Recursos:</h6>
                  <ul className="list-unstyled small">
                    {plan.features.slice(0, 3).map((feature, index) => (
                      <li key={index}>
                        <i className="bi bi-check text-success me-1"></i>
                        {feature}
                      </li>
                    ))}
                    {plan.features.length > 3 && (
                      <li>
                        <small className="text-muted">+{plan.features.length - 3} recursos...</small>
                      </li>
                    )}
                  </ul>
                </div>

                <div className="d-flex justify-content-between align-items-center">
                  <small className="text-muted">
                    Teste: {plan.trialDays} dias
                  </small>
                  <div className={`badge ${plan.enabled ? 'bg-success' : 'bg-secondary'}`}>
                    {plan.enabled ? 'Ativo' : 'Inativo'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal de Edição */}
      {showForm && (
        <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg modal-dialog-scrollable">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {editingPlan ? 'Editar Plano' : 'Novo Plano'}
                </h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setShowForm(false)}
                ></button>
              </div>
              <div className="modal-body">
                <form>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label">ID do Plano *</label>
                      <input 
                        type="text" 
                        className="form-control"
                        value={formData.planId || ''}
                        onChange={(e) => updateFormData('planId', e.target.value)}
                        disabled={!!editingPlan}
                        placeholder="basico, profissional, empresarial"
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Nome *</label>
                      <input 
                        type="text" 
                        className="form-control"
                        value={formData.name || ''}
                        onChange={(e) => updateFormData('name', e.target.value)}
                        placeholder="Nome do plano"
                      />
                    </div>
                    <div className="col-12">
                      <label className="form-label">Descrição</label>
                      <textarea 
                        className="form-control"
                        rows={2}
                        value={formData.description || ''}
                        onChange={(e) => updateFormData('description', e.target.value)}
                        placeholder="Descrição do plano"
                      />
                    </div>

                    {/* Preços */}
                    <div className="col-12">
                      <h6>Preços</h6>
                      <div className="row g-3">
                        <div className="col-md-4">
                          <label className="form-label">Semanal</label>
                          <div className="input-group">
                            <span className="input-group-text">R$</span>
                            <input 
                              type="number" 
                              className="form-control"
                              value={formData.pricing?.weekly?.price || 0}
                              onChange={(e) => updatePricing('weekly', 'price', parseFloat(e.target.value))}
                            />
                          </div>
                          <div className="form-check mt-1">
                            <input 
                              className="form-check-input" 
                              type="checkbox"
                              checked={formData.pricing?.weekly?.enabled || false}
                              onChange={(e) => updatePricing('weekly', 'enabled', e.target.checked)}
                            />
                            <label className="form-check-label">Habilitado</label>
                          </div>
                        </div>
                        <div className="col-md-4">
                          <label className="form-label">Mensal</label>
                          <div className="input-group">
                            <span className="input-group-text">R$</span>
                            <input 
                              type="number" 
                              className="form-control"
                              value={formData.pricing?.monthly?.price || 0}
                              onChange={(e) => updatePricing('monthly', 'price', parseFloat(e.target.value))}
                            />
                          </div>
                          <div className="form-check mt-1">
                            <input 
                              className="form-check-input" 
                              type="checkbox"
                              checked={formData.pricing?.monthly?.enabled || false}
                              onChange={(e) => updatePricing('monthly', 'enabled', e.target.checked)}
                            />
                            <label className="form-check-label">Habilitado</label>
                          </div>
                        </div>
                        <div className="col-md-4">
                          <label className="form-label">Anual</label>
                          <div className="input-group">
                            <span className="input-group-text">R$</span>
                            <input 
                              type="number" 
                              className="form-control"
                              value={formData.pricing?.annual?.price || 0}
                              onChange={(e) => updatePricing('annual', 'price', parseFloat(e.target.value))}
                            />
                          </div>
                          <div className="row g-2 mt-1">
                            <div className="col-6">
                              <div className="form-check">
                                <input 
                                  className="form-check-input" 
                                  type="checkbox"
                                  checked={formData.pricing?.annual?.enabled || false}
                                  onChange={(e) => updatePricing('annual', 'enabled', e.target.checked)}
                                />
                                <label className="form-check-label">Habilitado</label>
                              </div>
                            </div>
                            <div className="col-6">
                              <div className="input-group input-group-sm">
                                <input 
                                  type="number" 
                                  className="form-control"
                                  placeholder="Desconto %"
                                  value={formData.pricing?.annual?.discount || 0}
                                  onChange={(e) => updatePricing('annual', 'discount', parseFloat(e.target.value))}
                                />
                                <span className="input-group-text">%</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Recursos */}
                    <div className="col-12">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <h6>Recursos</h6>
                        <button 
                          type="button" 
                          className="btn btn-sm btn-outline-primary"
                          onClick={addFeature}
                        >
                          <i className="bi bi-plus"></i> Adicionar
                        </button>
                      </div>
                      {formData.features?.map((feature, index) => (
                        <div key={index} className="input-group mb-2">
                          <input 
                            type="text" 
                            className="form-control"
                            value={feature}
                            onChange={(e) => updateFeature(index, e.target.value)}
                            placeholder="Recurso do plano"
                          />
                          <button 
                            type="button" 
                            className="btn btn-outline-danger"
                            onClick={() => removeFeature(index)}
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        </div>
                      ))}
                    </div>

                    {/* Configurações */}
                    <div className="col-md-6">
                      <label className="form-label">Cor</label>
                      <input 
                        type="color" 
                        className="form-control form-control-color"
                        value={formData.color || '#0d6efd'}
                        onChange={(e) => updateFormData('color', e.target.value)}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Dias de Teste</label>
                      <input 
                        type="number" 
                        className="form-control"
                        value={formData.trialDays || 14}
                        onChange={(e) => updateFormData('trialDays', parseInt(e.target.value))}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Ordem</label>
                      <input 
                        type="number" 
                        className="form-control"
                        value={formData.order || 0}
                        onChange={(e) => updateFormData('order', parseInt(e.target.value))}
                      />
                    </div>
                    <div className="col-md-6">
                      <div className="mt-4">
                        <div className="form-check">
                          <input 
                            className="form-check-input" 
                            type="checkbox"
                            checked={formData.popular || false}
                            onChange={(e) => updateFormData('popular', e.target.checked)}
                          />
                          <label className="form-check-label">Plano Popular</label>
                        </div>
                        <div className="form-check">
                          <input 
                            className="form-check-input" 
                            type="checkbox"
                            checked={formData.enabled !== false}
                            onChange={(e) => updateFormData('enabled', e.target.checked)}
                          />
                          <label className="form-check-label">Plano Ativo</label>
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => setShowForm(false)}
                  disabled={saving}
                >
                  Cancelar
                </button>
                <button 
                  type="button" 
                  className="btn btn-primary" 
                  onClick={handleSave}
                  disabled={saving}
                >
                  {saving ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                      Salvando...
                    </>
                  ) : (
                    'Salvar'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}