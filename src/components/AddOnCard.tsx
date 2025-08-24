"use client";

import React from 'react';
import { PlanType, getAddOnLimit, checkAddOnQuota, ADD_ON_INFO, PLAN_INFO } from '@/lib/planMatrix';
import { useUserPlan, useAddOnUsage } from '@/hooks/usePlan';

interface AddOnCardProps {
  addOnId: string;
  icon: string;
  title: string;
  description: string;
  price: number;
  setupFee?: number;
  category: string;
  onSubscribe?: () => void;
  onUpgrade?: () => void;
}

export default function AddOnCard({ 
  addOnId, 
  icon, 
  title, 
  description, 
  price, 
  setupFee,
  category,
  onSubscribe,
  onUpgrade 
}: AddOnCardProps) {
  const { currentPlan, loading: planLoading } = useUserPlan();
  const { usage, loading: usageLoading } = useAddOnUsage(addOnId);

  if (planLoading || usageLoading) {
    return (
      <div className="card text-center h-100 border-0 shadow-sm">
        <div className="card-body p-3">
          <div className="placeholder-glow">
            <div className="placeholder col-6 bg-secondary mb-2" style={{ height: '40px' }}></div>
            <div className="placeholder col-8 bg-secondary mb-2"></div>
            <div className="placeholder col-12 bg-secondary mb-2"></div>
            <div className="placeholder col-4 bg-secondary"></div>
          </div>
        </div>
      </div>
    );
  }

  const limit = getAddOnLimit(currentPlan, addOnId);
  const quotaCheck = checkAddOnQuota(currentPlan, addOnId, usage);

  const getStatusBadge = () => {
    if (!limit?.available) {
      return (
        <div className="position-relative">
          <span 
            className="badge bg-secondary mb-2"
            data-bs-toggle="tooltip" 
            data-bs-placement="top"
            title={limit?.tooltip || 'Não disponível no seu plano'}
          >
            Exclusivo {limit?.upgradeRequired ? PLAN_INFO[limit.upgradeRequired].name : 'plano superior'}
          </span>
        </div>
      );
    }

    if (limit.maxQuantity !== undefined) {
      const remaining = limit.maxQuantity - usage;
      if (remaining <= 0) {
        return (
          <span 
            className="badge bg-warning mb-2"
            data-bs-toggle="tooltip" 
            data-bs-placement="top"
            title={`Limite atingido (${usage}/${limit.maxQuantity})`}
          >
            Limite atingido
          </span>
        );
      }
      return (
        <span 
          className="badge bg-info mb-2"
          data-bs-toggle="tooltip" 
          data-bs-placement="top"
          title={`Usando ${usage} de ${limit.maxQuantity} disponíveis`}
        >
          {usage}/{limit.maxQuantity} usado
        </span>
      );
    }

    if (usage > 0) {
      return (
        <span className="badge bg-success mb-2">
          {usage} contratado{usage > 1 ? 's' : ''}
        </span>
      );
    }

    return (
      <span className="badge bg-primary mb-2">
        Disponível no seu plano
      </span>
    );
  };

  const getActionButton = () => {
    if (!limit?.available) {
      return (
        <button 
          className="btn btn-outline-secondary w-100 btn-sm"
          onClick={onUpgrade}
          disabled={!onUpgrade}
        >
          <i className="bi bi-arrow-up-circle me-1"></i>
          Fazer Upgrade
        </button>
      );
    }

    if (!quotaCheck.canAdd) {
      if (limit.maxQuantity !== undefined && usage >= limit.maxQuantity) {
        return (
          <button 
            className="btn btn-outline-warning w-100 btn-sm"
            onClick={onUpgrade}
            disabled={!onUpgrade}
          >
            <i className="bi bi-arrow-up-circle me-1"></i>
            Expandir Limite
          </button>
        );
      }
      return (
        <button className="btn btn-outline-secondary w-100 btn-sm" disabled>
          Não Disponível
        </button>
      );
    }

    return (
      <button 
        className="btn btn-primary w-100 btn-sm"
        onClick={onSubscribe}
        disabled={!onSubscribe}
      >
        <i className="bi bi-plus-circle me-1"></i>
        Contratar
      </button>
    );
  };

  return (
    <div className="card text-center h-100 border-0 shadow-sm">
      <div className="card-body p-3">
        <i className={`${icon} fs-3 mb-2`} style={{ 
          color: limit?.available ? '#0d6efd' : '#6c757d' 
        }}></i>
        
        <h6 className="fw-bold mb-2 small">{title}</h6>
        
        {getStatusBadge()}
        
        <p className="small text-muted mb-2" style={{ fontSize: '0.8rem' }}>
          {description}
        </p>
        
        <div className="mb-2">
          <span className={`badge ${limit?.available ? 'bg-primary' : 'bg-secondary'} mb-1`}>
            R$ {price}/mês
          </span>
          {setupFee && (
            <div className="text-muted small">+ setup R$ {setupFee}</div>
          )}
        </div>

        {!quotaCheck.canAdd && quotaCheck.message && (
          <div className="alert alert-warning p-2 mb-2" style={{ fontSize: '0.75rem' }}>
            {quotaCheck.message}
          </div>
        )}

        {getActionButton()}
      </div>
    </div>
  );
}

// Componente para modal de upgrade
interface UpgradeModalProps {
  show: boolean;
  onHide: () => void;
  targetPlan: PlanType;
  addOnName: string;
}

export function UpgradeModal({ show, onHide, targetPlan, addOnName }: UpgradeModalProps) {
  const targetPlanInfo = PLAN_INFO[targetPlan];

  return (
    <div className={`modal fade ${show ? 'show d-block' : ''}`} tabIndex={-1} style={{ backgroundColor: show ? 'rgba(0,0,0,0.5)' : 'transparent' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              <i className="bi bi-arrow-up-circle text-primary me-2"></i>
              Upgrade Necessário
            </h5>
            <button type="button" className="btn-close" onClick={onHide}></button>
          </div>
          <div className="modal-body text-center">
            <div className="mb-3">
              <i className="bi bi-lock-fill text-warning fs-1 mb-3"></i>
              <h6>O add-on <strong>{addOnName}</strong> não está disponível no seu plano atual.</h6>
              <p className="text-muted">
                Faça upgrade para o plano <strong>{targetPlanInfo.name}</strong> para habilitar este recurso.
              </p>
            </div>
            
            <div className="card bg-light">
              <div className="card-body">
                <h5 className="text-primary">Plano {targetPlanInfo.name}</h5>
                <div className="h4 mb-2">
                  R$ {targetPlanInfo.price}<small className="text-muted">/mês</small>
                </div>
                <div className="text-success small mb-2">
                  ou R$ {targetPlanInfo.annualPrice}/mês anual (25% off)
                </div>
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onHide}>
              Fechar
            </button>
            <button type="button" className="btn btn-outline-primary">
              Ver Todos os Planos
            </button>
            <button type="button" className="btn btn-primary">
              Fazer Upgrade
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}