"use client";

import { useState, useEffect } from 'react';

interface FiscalSettings {
  cnpj: string;
  razaoSocial: string;
  nomeFantasia?: string;
  endereco: string;
  telefone?: string;
  email?: string;
  printerType: 'SAT' | 'ECF' | 'NFCE' | 'ESC_POS';
  printerPort?: string;
  printerModel?: string;
  satCertificate?: string;
  autoprint: boolean;
  enabled: boolean;
}

export default function FiscalPrinterConfig() {
  const [settings, setSettings] = useState<FiscalSettings>({
    cnpj: '',
    razaoSocial: '',
    nomeFantasia: '',
    endereco: '',
    telefone: '',
    email: '',
    printerType: 'ESC_POS',
    printerPort: '',
    printerModel: '',
    satCertificate: '',
    autoprint: false,
    enabled: false
  });

  const [loading, setLoading] = useState(false);
  const [testing, setTesting] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error' | ''>('');

  // Carregar configurações existentes
  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const response = await fetch('/api/fiscal/config');
      const data = await response.json();
      
      if (data.success && data.settings) {
        setSettings({ ...settings, ...data.settings });
      }
    } catch (error) {
      console.error('Erro ao carregar configurações:', error);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/fiscal/config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(settings)
      });

      const data = await response.json();

      if (data.success) {
        setMessage('Configurações salvas com sucesso!');
        setMessageType('success');
      } else {
        setMessage(data.error || 'Erro ao salvar configurações');
        setMessageType('error');
      }
    } catch (error) {
      setMessage('Erro ao salvar configurações');
      setMessageType('error');
    }

    setLoading(false);
  };

  const handleTest = async () => {
    setTesting(true);
    setMessage('');

    try {
      const response = await fetch('/api/fiscal/config', {
        method: 'PUT'
      });

      const data = await response.json();

      if (data.success) {
        setMessage('Teste de impressão realizado com sucesso!');
        setMessageType('success');
      } else {
        setMessage(data.error || 'Falha no teste de impressão');
        setMessageType('error');
      }
    } catch (error) {
      setMessage('Erro ao testar impressora');
      setMessageType('error');
    }

    setTesting(false);
  };

  const formatCNPJ = (value: string) => {
    const cleaned = value.replace(/[^\d]/g, '');
    return cleaned.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
  };

  const handleCNPJChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCNPJ(e.target.value);
    setSettings({ ...settings, cnpj: formatted });
  };

  return (
    <div style={{
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(20px)',
      borderRadius: '20px',
      padding: '2rem',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      boxShadow: '0 20px 60px rgba(0, 0, 0, 0.1)'
    }}>
      <div className="d-flex align-items-center mb-4">
        <div style={{ fontSize: '2rem', marginRight: '1rem' }}>🖨️</div>
        <div>
          <h3 style={{ margin: 0, color: '#1e293b', fontWeight: '800' }}>
            Configuração da Impressora Fiscal
          </h3>
          <p style={{ margin: 0, color: '#64748b' }}>
            Configure sua impressora para emissão automática de cupons fiscais
          </p>
        </div>
      </div>

      {message && (
        <div 
          className={`alert ${messageType === 'success' ? 'alert-success' : 'alert-danger'} mb-4`}
          role="alert"
        >
          {messageType === 'success' ? '✅' : '❌'} {message}
        </div>
      )}

      <div className="row g-4">
        {/* Ativar Impressora Fiscal */}
        <div className="col-12">
          <div 
            style={{
              background: settings.enabled ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
              border: `2px solid ${settings.enabled ? '#10b981' : '#ef4444'}`,
              borderRadius: '12px',
              padding: '1rem'
            }}
          >
            <div className="form-check form-switch">
              <input
                className="form-check-input"
                type="checkbox"
                checked={settings.enabled}
                onChange={(e) => setSettings({ ...settings, enabled: e.target.checked })}
                style={{ fontSize: '1.2rem' }}
              />
              <label className="form-check-label" style={{ fontWeight: '600', marginLeft: '0.5rem' }}>
                {settings.enabled ? '🟢 Impressora Fiscal Ativada' : '🔴 Impressora Fiscal Desativada'}
              </label>
            </div>
            <small className="text-muted">
              {settings.enabled ? 
                'Os pedidos serão impressos automaticamente na impressora fiscal configurada' :
                'Ative para habilitar a impressão automática de cupons fiscais'
              }
            </small>
          </div>
        </div>

        {/* Dados da Empresa */}
        <div className="col-12">
          <h5 style={{ color: '#374151', fontWeight: '700', marginBottom: '1rem' }}>
            🏢 Dados da Empresa
          </h5>
        </div>

        <div className="col-md-6">
          <label className="form-label" style={{ fontWeight: '600' }}>CNPJ *</label>
          <input
            type="text"
            className="form-control"
            value={settings.cnpj}
            onChange={handleCNPJChange}
            placeholder="00.000.000/0000-00"
            maxLength={18}
            style={{
              border: '2px solid #e5e7eb',
              borderRadius: '8px',
              padding: '0.75rem'
            }}
          />
        </div>

        <div className="col-md-6">
          <label className="form-label" style={{ fontWeight: '600' }}>Razão Social *</label>
          <input
            type="text"
            className="form-control"
            value={settings.razaoSocial}
            onChange={(e) => setSettings({ ...settings, razaoSocial: e.target.value })}
            placeholder="Nome da empresa"
            style={{
              border: '2px solid #e5e7eb',
              borderRadius: '8px',
              padding: '0.75rem'
            }}
          />
        </div>

        <div className="col-md-6">
          <label className="form-label" style={{ fontWeight: '600' }}>Nome Fantasia</label>
          <input
            type="text"
            className="form-control"
            value={settings.nomeFantasia}
            onChange={(e) => setSettings({ ...settings, nomeFantasia: e.target.value })}
            placeholder="Nome fantasia (opcional)"
            style={{
              border: '2px solid #e5e7eb',
              borderRadius: '8px',
              padding: '0.75rem'
            }}
          />
        </div>

        <div className="col-md-6">
          <label className="form-label" style={{ fontWeight: '600' }}>Telefone</label>
          <input
            type="text"
            className="form-control"
            value={settings.telefone}
            onChange={(e) => setSettings({ ...settings, telefone: e.target.value })}
            placeholder="(00) 0000-0000"
            style={{
              border: '2px solid #e5e7eb',
              borderRadius: '8px',
              padding: '0.75rem'
            }}
          />
        </div>

        <div className="col-12">
          <label className="form-label" style={{ fontWeight: '600' }}>Endereço *</label>
          <input
            type="text"
            className="form-control"
            value={settings.endereco}
            onChange={(e) => setSettings({ ...settings, endereco: e.target.value })}
            placeholder="Endereço completo da empresa"
            style={{
              border: '2px solid #e5e7eb',
              borderRadius: '8px',
              padding: '0.75rem'
            }}
          />
        </div>

        {/* Configurações da Impressora */}
        <div className="col-12">
          <h5 style={{ color: '#374151', fontWeight: '700', marginBottom: '1rem', marginTop: '1rem' }}>
            🖨️ Configurações da Impressora
          </h5>
        </div>

        <div className="col-md-6">
          <label className="form-label" style={{ fontWeight: '600' }}>Tipo de Impressora</label>
          <select
            className="form-select"
            value={settings.printerType}
            onChange={(e) => setSettings({ ...settings, printerType: e.target.value as any })}
            style={{
              border: '2px solid #e5e7eb',
              borderRadius: '8px',
              padding: '0.75rem'
            }}
          >
            <option value="ESC_POS">🧾 ESC/POS (Não Fiscal)</option>
            <option value="SAT">📄 SAT Fiscal</option>
            <option value="ECF">🖨️ ECF Fiscal</option>
            <option value="NFCE">📱 NFC-e</option>
          </select>
          <small className="text-muted">
            ESC/POS para cupons não fiscais, SAT/ECF/NFC-e para fiscais
          </small>
        </div>

        <div className="col-md-6">
          <label className="form-label" style={{ fontWeight: '600' }}>Porta/Conexão</label>
          <input
            type="text"
            className="form-control"
            value={settings.printerPort}
            onChange={(e) => setSettings({ ...settings, printerPort: e.target.value })}
            placeholder="COM1, USB, 192.168.1.100"
            style={{
              border: '2px solid #e5e7eb',
              borderRadius: '8px',
              padding: '0.75rem'
            }}
          />
          <small className="text-muted">
            Ex: COM1, USB, IP da impressora
          </small>
        </div>

        <div className="col-md-6">
          <label className="form-label" style={{ fontWeight: '600' }}>Modelo da Impressora</label>
          <input
            type="text"
            className="form-control"
            value={settings.printerModel}
            onChange={(e) => setSettings({ ...settings, printerModel: e.target.value })}
            placeholder="Modelo da impressora"
            style={{
              border: '2px solid #e5e7eb',
              borderRadius: '8px',
              padding: '0.75rem'
            }}
          />
        </div>

        <div className="col-md-6">
          <div className="form-check form-switch" style={{ paddingTop: '2rem' }}>
            <input
              className="form-check-input"
              type="checkbox"
              checked={settings.autoprint}
              onChange={(e) => setSettings({ ...settings, autoprint: e.target.checked })}
            />
            <label className="form-check-label" style={{ fontWeight: '600' }}>
              Impressão Automática
            </label>
            <div>
              <small className="text-muted">
                Imprime automaticamente quando um pedido for criado
              </small>
            </div>
          </div>
        </div>

        {/* Configurações SAT (se selecionado) */}
        {settings.printerType === 'SAT' && (
          <div className="col-12">
            <label className="form-label" style={{ fontWeight: '600' }}>Certificado SAT</label>
            <textarea
              className="form-control"
              value={settings.satCertificate}
              onChange={(e) => setSettings({ ...settings, satCertificate: e.target.value })}
              placeholder="Cole aqui o certificado SAT"
              rows={4}
              style={{
                border: '2px solid #e5e7eb',
                borderRadius: '8px',
                padding: '0.75rem'
              }}
            />
          </div>
        )}

        {/* Botões de Ação */}
        <div className="col-12" style={{ marginTop: '2rem' }}>
          <div className="d-flex gap-3">
            <button
              onClick={handleSave}
              disabled={loading}
              className="btn btn-primary btn-lg"
              style={{
                background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                border: 'none',
                borderRadius: '12px',
                padding: '0.75rem 2rem',
                fontWeight: '700'
              }}
            >
              {loading ? '⏳ Salvando...' : '💾 Salvar Configurações'}
            </button>

            <button
              onClick={handleTest}
              disabled={testing || !settings.enabled}
              className="btn btn-outline-primary btn-lg"
              style={{
                borderRadius: '12px',
                padding: '0.75rem 2rem',
                fontWeight: '700',
                border: '2px solid #3b82f6'
              }}
            >
              {testing ? '⏳ Testando...' : '🧪 Testar Impressão'}
            </button>
          </div>
        </div>
      </div>

      <div 
        style={{
          background: 'rgba(59, 130, 246, 0.1)',
          border: '1px solid rgba(59, 130, 246, 0.2)',
          borderRadius: '12px',
          padding: '1rem',
          marginTop: '2rem'
        }}
      >
        <h6 style={{ color: '#1e40af', fontWeight: '700', marginBottom: '0.5rem' }}>
          ℹ️ Informações Importantes
        </h6>
        <ul style={{ color: '#1e40af', fontSize: '0.9rem', marginBottom: 0 }}>
          <li><strong>ESC/POS:</strong> Para cupons não fiscais (mais comum em lanchonetes)</li>
          <li><strong>SAT:</strong> Sistema de Autenticação e Transmissão Fiscal</li>
          <li><strong>ECF:</strong> Emissor de Cupom Fiscal tradicional</li>
          <li><strong>NFC-e:</strong> Nota Fiscal de Consumidor Eletrônica</li>
          <li>Configure corretamente os dados da sua empresa para emissão fiscal</li>
          <li>Teste sempre a impressão antes de ativar o modo automático</li>
        </ul>
      </div>
    </div>
  );
}