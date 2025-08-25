"use client";

import { useState, useEffect } from 'react';

interface PrinterStatus {
  enabled: boolean;
  autoprint: boolean;
  printer: {
    online: boolean;
    paper: boolean;
    error?: string;
  };
}

export default function FiscalPrinterWidget() {
  const [status, setStatus] = useState<PrinterStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkStatus();
    // Verificar status a cada 30 segundos
    const interval = setInterval(checkStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  const checkStatus = async () => {
    try {
      const response = await fetch('/api/fiscal/print');
      const data = await response.json();
      
      if (data.success) {
        setStatus(data.status);
      }
    } catch (error) {
      console.error('Erro ao verificar status da impressora:', error);
    }
    setLoading(false);
  };

  const getStatusColor = () => {
    if (!status?.enabled) return '#6b7280'; // Cinza - desabilitado
    if (status.printer.online && status.printer.paper) return '#10b981'; // Verde - OK
    if (status.printer.online && !status.printer.paper) return '#f59e0b'; // Amarelo - sem papel
    return '#ef4444'; // Vermelho - erro
  };

  const getStatusText = () => {
    if (!status?.enabled) return 'Desabilitada';
    if (!status.printer.online) return 'Offline';
    if (!status.printer.paper) return 'Sem Papel';
    if (status.printer.error) return 'Com Erro';
    return 'Online';
  };

  const getStatusIcon = () => {
    if (!status?.enabled) return '🚫';
    if (!status.printer.online) return '🔴';
    if (!status.printer.paper) return '📜';
    if (status.printer.error) return '⚠️';
    return '🟢';
  };

  if (loading) {
    return (
      <div style={{
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(20px)',
        borderRadius: '16px',
        padding: '1.5rem',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
      }}>
        <div className="d-flex align-items-center">
          <div className="spinner-border spinner-border-sm me-3" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <span>Verificando impressora...</span>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(20px)',
      borderRadius: '16px',
      padding: '1.5rem',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
    }}>
      <div className="d-flex align-items-center justify-content-between mb-3">
        <div className="d-flex align-items-center">
          <div style={{ fontSize: '1.5rem', marginRight: '0.75rem' }}>🖨️</div>
          <div>
            <h6 style={{ margin: 0, fontWeight: '700', color: '#1e293b' }}>
              Impressora Fiscal
            </h6>
            <small style={{ color: '#64748b' }}>Status da impressora</small>
          </div>
        </div>
        
        <div 
          className="badge"
          style={{
            backgroundColor: getStatusColor(),
            color: 'white',
            padding: '0.5rem 1rem',
            borderRadius: '50px',
            fontSize: '0.85rem',
            fontWeight: '600'
          }}
        >
          {getStatusIcon()} {getStatusText()}
        </div>
      </div>

      {status && (
        <div className="row g-2">
          <div className="col-6">
            <div style={{
              background: status.enabled ? 'rgba(16, 185, 129, 0.1)' : 'rgba(156, 163, 175, 0.1)',
              border: `1px solid ${status.enabled ? '#10b981' : '#9ca3af'}`,
              borderRadius: '8px',
              padding: '0.75rem',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '1.2rem', marginBottom: '0.25rem' }}>
                {status.enabled ? '✅' : '❌'}
              </div>
              <small style={{ fontWeight: '600', color: status.enabled ? '#059669' : '#6b7280' }}>
                {status.enabled ? 'Ativada' : 'Desativada'}
              </small>
            </div>
          </div>
          
          <div className="col-6">
            <div style={{
              background: status.autoprint ? 'rgba(59, 130, 246, 0.1)' : 'rgba(156, 163, 175, 0.1)',
              border: `1px solid ${status.autoprint ? '#3b82f6' : '#9ca3af'}`,
              borderRadius: '8px',
              padding: '0.75rem',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '1.2rem', marginBottom: '0.25rem' }}>
                {status.autoprint ? '🔄' : '✋'}
              </div>
              <small style={{ fontWeight: '600', color: status.autoprint ? '#2563eb' : '#6b7280' }}>
                {status.autoprint ? 'Auto Print' : 'Manual'}
              </small>
            </div>
          </div>
        </div>
      )}

      {status?.printer.error && (
        <div 
          className="alert alert-warning mt-3 mb-0"
          style={{ 
            fontSize: '0.85rem',
            padding: '0.5rem 0.75rem',
            borderRadius: '8px'
          }}
        >
          <strong>⚠️ Atenção:</strong> {status.printer.error}
        </div>
      )}

      {!status?.enabled && (
        <div 
          className="text-center mt-3"
          style={{ color: '#6b7280', fontSize: '0.85rem' }}
        >
          Configure a impressora fiscal nas configurações
        </div>
      )}
    </div>
  );
}