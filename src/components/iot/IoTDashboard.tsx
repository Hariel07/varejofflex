"use client";

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

interface IoTStats {
  gateways: {
    total: number;
    online: number;
    offline: number;
  };
  tags: {
    total: number;
    active: number;
    lowBattery: number;
  };
  events: {
    today: number;
    unresolved: number;
    critical: number;
  };
  products: {
    total: number;
    tracked: number;
  };
}

export default function IoTDashboard() {
  const { data: session } = useSession();
  const [stats, setStats] = useState<IoTStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const response = await fetch('/api/iot/health');
      const data = await response.json();
      
      if (data.success) {
        setStats(data.data);
      }
    } catch (error) {
      console.error('Erro ao carregar estatísticas IoT:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{
        padding: '40px',
        textAlign: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        minHeight: '100vh',
        color: 'white'
      }}>
        <div style={{
          fontSize: '1.2rem',
          marginBottom: '20px'
        }}>
          🔄 Carregando Dashboard IoT...
        </div>
      </div>
    );
  }

  return (
    <div style={{
      padding: '20px',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      minHeight: '100vh'
    }}>
      {/* Header */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(20px)',
        borderRadius: '20px',
        padding: '30px',
        marginBottom: '30px',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)'
      }}>
        <h1 style={{
          color: '#1E293B',
          fontSize: '2rem',
          margin: '0 0 10px 0',
          fontWeight: 'bold'
        }}>
          🏪 IoT Dashboard - Varejofflex
        </h1>
        <p style={{
          color: '#64748B',
          fontSize: '1.1rem',
          margin: 0
        }}>
          Monitoramento em tempo real da sua loja inteligente
        </p>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '20px',
          marginBottom: '30px'
        }}>
          {/* Gateways */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            borderRadius: '20px',
            padding: '25px',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '15px'
            }}>
              <span style={{ fontSize: '2rem', marginRight: '10px' }}>📡</span>
              <h3 style={{ color: '#1E293B', margin: 0 }}>Gateways</h3>
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#10B981', marginBottom: '10px' }}>
              {stats.gateways.online}/{stats.gateways.total}
            </div>
            <div style={{ color: '#64748B', fontSize: '0.9rem' }}>
              ✅ {stats.gateways.online} online • ⛔ {stats.gateways.offline} offline
            </div>
          </div>

          {/* Tags */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            borderRadius: '20px',
            padding: '25px',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '15px'
            }}>
              <span style={{ fontSize: '2rem', marginRight: '10px' }}>🏷️</span>
              <h3 style={{ color: '#1E293B', margin: 0 }}>Tags IoT</h3>
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#3B82F6', marginBottom: '10px' }}>
              {stats.tags.active}/{stats.tags.total}
            </div>
            <div style={{ color: '#64748B', fontSize: '0.9rem' }}>
              ⚠️ {stats.tags.lowBattery} bateria baixa
            </div>
          </div>

          {/* Events */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            borderRadius: '20px',
            padding: '25px',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '15px'
            }}>
              <span style={{ fontSize: '2rem', marginRight: '10px' }}>🚨</span>
              <h3 style={{ color: '#1E293B', margin: 0 }}>Eventos</h3>
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#F59E0B', marginBottom: '10px' }}>
              {stats.events.unresolved}
            </div>
            <div style={{ color: '#64748B', fontSize: '0.9rem' }}>
              🔴 {stats.events.critical} críticos • 📊 {stats.events.today} hoje
            </div>
          </div>

          {/* Products */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            borderRadius: '20px',
            padding: '25px',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '15px'
            }}>
              <span style={{ fontSize: '2rem', marginRight: '10px' }}>📦</span>
              <h3 style={{ color: '#1E293B', margin: 0 }}>Produtos</h3>
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#8B5CF6', marginBottom: '10px' }}>
              {stats.products.tracked}/{stats.products.total}
            </div>
            <div style={{ color: '#64748B', fontSize: '0.9rem' }}>
              🎯 Rastreados com IoT
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(20px)',
        borderRadius: '20px',
        padding: '30px',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)'
      }}>
        <h2 style={{
          color: '#1E293B',
          fontSize: '1.5rem',
          margin: '0 0 20px 0',
          fontWeight: 'bold'
        }}>
          🚀 Ações Rápidas
        </h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '15px'
        }}>
          <button
            onClick={() => window.location.href = '/dashboard/iot/products'}
            style={{
              background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
              color: 'white',
              border: 'none',
              padding: '15px 20px',
              borderRadius: '12px',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '1rem',
              boxShadow: '0 10px 25px rgba(16, 185, 129, 0.3)',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}
          >
            🏷️ Cadastrar Adesivos
          </button>

          <button
            onClick={() => window.location.href = '/dashboard/iot/inventory'}
            style={{
              background: 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)',
              color: 'white',
              border: 'none',
              padding: '15px 20px',
              borderRadius: '12px',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '1rem',
              boxShadow: '0 10px 25px rgba(59, 130, 246, 0.3)',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}
          >
            📱 Inventário Rápido
          </button>

          <button
            onClick={() => window.location.href = '/dashboard/iot/scale'}
            style={{
              background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
              color: 'white',
              border: 'none',
              padding: '15px 20px',
              borderRadius: '12px',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '1rem',
              boxShadow: '0 10px 25px rgba(245, 158, 11, 0.3)',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}
          >
            ⚖️ Balança
          </button>

          <button
            onClick={() => window.location.href = '/dashboard/iot/calibrate'}
            style={{
              background: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
              color: 'white',
              border: 'none',
              padding: '15px 20px',
              borderRadius: '12px',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '1rem',
              boxShadow: '0 10px 25px rgba(139, 92, 246, 0.3)',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}
          >
            🎯 Calibrar BLE
          </button>

          <button
            onClick={() => window.location.href = '/dashboard/iot/kits'}
            style={{
              background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
              color: 'white',
              border: 'none',
              padding: '15px 20px',
              borderRadius: '12px',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '1rem',
              boxShadow: '0 10px 25px rgba(239, 68, 68, 0.3)',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}
          >
            📦 Kits IoT
          </button>

          <button
            onClick={() => window.location.href = '/dashboard/iot/logs'}
            style={{
              background: 'linear-gradient(135deg, #64748B 0%, #475569 100%)',
              color: 'white',
              border: 'none',
              padding: '15px 20px',
              borderRadius: '12px',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '1rem',
              boxShadow: '0 10px 25px rgba(100, 116, 139, 0.3)',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}
          >
            📋 Histórico
          </button>
        </div>
      </div>
    </div>
  );
}