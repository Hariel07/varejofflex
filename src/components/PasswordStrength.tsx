'use client';

import React, { useState } from 'react';

interface PasswordStrengthProps {
  password: string;
  confirmPassword: string;
  onPasswordChange: (password: string) => void;
  onConfirmPasswordChange: (confirmPassword: string) => void;
}

export default function PasswordStrength({ 
  password, 
  confirmPassword, 
  onPasswordChange, 
  onConfirmPasswordChange 
}: PasswordStrengthProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Validações de força da senha
  const hasMinLength = password.length >= 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  
  const validations = [
    { label: 'Mínimo 8 caracteres', valid: hasMinLength },
    { label: 'Uma letra maiúscula', valid: hasUpperCase },
    { label: 'Uma letra minúscula', valid: hasLowerCase },
    { label: 'Um número', valid: hasNumber },
    { label: 'Um caractere especial (!@#$%^&*)', valid: hasSpecialChar }
  ];

  const validCount = validations.filter(v => v.valid).length;
  const passwordsMatch = password && confirmPassword && password === confirmPassword;
  const isPasswordComplete = validCount === 5;

  // Calcular força da senha
  const getPasswordStrength = () => {
    if (validCount === 0) return { level: 0, text: '', color: '#e5e7eb' };
    if (validCount <= 2) return { level: 1, text: 'Fraca', color: '#ef4444' };
    if (validCount <= 3) return { level: 2, text: 'Razoável', color: '#f59e0b' };
    if (validCount === 4) return { level: 3, text: 'Boa', color: '#10b981' };
    return { level: 4, text: 'Muito Forte', color: '#059669' };
  };

  const strength = getPasswordStrength();

  return (
    <div className="row g-4">
      {/* Campo de Senha */}
      <div className="col-md-6">
        <label className="form-label" style={{ fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
          Escolha uma senha *
        </label>
        <div className="position-relative">
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => onPasswordChange(e.target.value)}
            className="form-control form-control-lg"
            style={{
              border: '2px solid #e5e7eb',
              borderRadius: '12px',
              padding: '1rem 3rem 1rem 1rem',
              fontSize: '1rem',
              borderColor: password ? (isPasswordComplete ? '#10b981' : '#f59e0b') : '#e5e7eb'
            }}
            placeholder="Mínimo 8 caracteres"
            required
          />
          <button
            type="button"
            className="btn position-absolute top-50 end-0 translate-middle-y me-2"
            style={{ 
              border: 'none', 
              background: 'transparent',
              color: '#6b7280',
              zIndex: 10
            }}
            onClick={() => setShowPassword(!showPassword)}
          >
            <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
          </button>
        </div>
        
        {/* Indicador de força da senha */}
        {password && (
          <div className="mt-2">
            <div className="d-flex justify-content-between align-items-center mb-1">
              <small style={{ fontWeight: '600', color: strength.color }}>
                Força: {strength.text}
              </small>
              <small style={{ color: '#6b7280' }}>
                {validCount}/5
              </small>
            </div>
            <div 
              className="progress" 
              style={{ 
                height: '4px', 
                backgroundColor: '#e5e7eb',
                borderRadius: '2px'
              }}
            >
              <div
                className="progress-bar"
                style={{
                  width: `${(validCount / 5) * 100}%`,
                  backgroundColor: strength.color,
                  transition: 'all 0.3s ease'
                }}
              ></div>
            </div>
          </div>
        )}
      </div>

      {/* Campo de Confirmação */}
      <div className="col-md-6">
        <label className="form-label" style={{ fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
          Confirme a senha *
        </label>
        <div className="position-relative">
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            value={confirmPassword}
            onChange={(e) => onConfirmPasswordChange(e.target.value)}
            className="form-control form-control-lg"
            style={{
              border: '2px solid #e5e7eb',
              borderRadius: '12px',
              padding: '1rem 3rem 1rem 1rem',
              fontSize: '1rem',
              borderColor: confirmPassword ? (passwordsMatch ? '#10b981' : '#ef4444') : '#e5e7eb'
            }}
            placeholder="Digite a senha novamente"
            required
          />
          <button
            type="button"
            className="btn position-absolute top-50 end-0 translate-middle-y me-2"
            style={{ 
              border: 'none', 
              background: 'transparent',
              color: '#6b7280',
              zIndex: 10
            }}
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            <i className={`bi ${showConfirmPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
          </button>
        </div>
        
        {/* Indicador de confirmação */}
        {confirmPassword && (
          <div className="mt-2">
            {passwordsMatch ? (
              <small style={{ color: '#10b981', fontWeight: '600' }}>
                <i className="bi bi-check-circle me-1"></i>
                Senhas coincidem
              </small>
            ) : (
              <small style={{ color: '#ef4444', fontWeight: '600' }}>
                <i className="bi bi-x-circle me-1"></i>
                Senhas não coincidem
              </small>
            )}
          </div>
        )}
      </div>

      {/* Lista de requisitos */}
      {password && (
        <div className="col-12">
          <div 
            className="p-3"
            style={{
              background: '#f8fafc',
              borderRadius: '12px',
              border: '1px solid #e5e7eb'
            }}
          >
            <small style={{ fontWeight: '600', color: '#374151', marginBottom: '8px', display: 'block' }}>
              Requisitos da senha:
            </small>
            <div className="row g-2">
              {validations.map((validation, index) => (
                <div key={index} className="col-md-6">
                  <small 
                    className="d-flex align-items-center"
                    style={{ 
                      color: validation.valid ? '#10b981' : '#6b7280',
                      fontWeight: validation.valid ? '600' : '400'
                    }}
                  >
                    <i 
                      className={`bi ${validation.valid ? 'bi-check-circle-fill' : 'bi-circle'} me-2`}
                      style={{ fontSize: '0.75rem' }}
                    ></i>
                    {validation.label}
                  </small>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}