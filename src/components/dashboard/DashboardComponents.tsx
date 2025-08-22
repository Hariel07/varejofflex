"use client";

import { useEffect, useState } from "react";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: string;
  color: string;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
}

export function StatsCard({ title, value, icon, color, change, changeType = 'neutral' }: StatsCardProps) {
  const getChangeColor = () => {
    switch (changeType) {
      case 'positive': return 'text-success';
      case 'negative': return 'text-danger';
      default: return 'text-muted';
    }
  };

  return (
    <div className="card h-100 shadow-sm border-0">
      <div className="card-body">
        <div className="d-flex align-items-center justify-content-between">
          <div>
            <h6 className="card-title text-muted mb-2">{title}</h6>
            <h3 className="mb-0 fw-bold">{value}</h3>
            {change && (
              <small className={getChangeColor()}>
                <i className={`bi ${changeType === 'positive' ? 'bi-arrow-up' : changeType === 'negative' ? 'bi-arrow-down' : 'bi-dash'}`}></i>
                {change}
              </small>
            )}
          </div>
          <div className={`rounded-circle d-flex align-items-center justify-content-center ${color}`} style={{ width: '60px', height: '60px' }}>
            <i className={`${icon} fs-4 text-white`}></i>
          </div>
        </div>
      </div>
    </div>
  );
}

interface ChartCardProps {
  title: string;
  children: React.ReactNode;
}

export function ChartCard({ title, children }: ChartCardProps) {
  return (
    <div className="card h-100 shadow-sm border-0">
      <div className="card-header bg-white border-0">
        <h6 className="card-title mb-0 fw-bold">{title}</h6>
      </div>
      <div className="card-body">
        {children}
      </div>
    </div>
  );
}

export function SimpleBarChart() {
  const [data] = useState([
    { month: 'Jan', users: 45 },
    { month: 'Fev', users: 52 },
    { month: 'Mar', users: 48 },
    { month: 'Abr', users: 61 },
    { month: 'Mai', users: 55 },
    { month: 'Jun', users: 67 }
  ]);

  const maxValue = Math.max(...data.map(d => d.users));

  return (
    <div className="d-flex align-items-end justify-content-between" style={{ height: '200px' }}>
      {data.map((item, index) => (
        <div key={index} className="d-flex flex-column align-items-center">
          <div 
            className="bg-primary rounded-top mb-2"
            style={{ 
              width: '30px', 
              height: `${(item.users / maxValue) * 150}px`,
              transition: 'height 0.3s ease'
            }}
          ></div>
          <small className="text-muted">{item.month}</small>
          <small className="fw-bold">{item.users}</small>
        </div>
      ))}
    </div>
  );
}

export function SimpleLineChart() {
  const [data] = useState([
    { day: 'Seg', revenue: 1200 },
    { day: 'Ter', revenue: 1900 },
    { day: 'Qua', revenue: 3000 },
    { day: 'Qui', revenue: 5000 },
    { day: 'Sex', revenue: 2000 },
    { day: 'Sab', revenue: 3000 },
    { day: 'Dom', revenue: 4000 }
  ]);

  return (
    <div className="position-relative" style={{ height: '200px' }}>
      {/* Simple line representation */}
      <div className="d-flex justify-content-between align-items-end h-100">
        {data.map((item, index) => (
          <div key={index} className="d-flex flex-column align-items-center">
            <div className="mb-2">
              <div 
                className="bg-success rounded-circle"
                style={{ width: '8px', height: '8px' }}
              ></div>
            </div>
            <small className="text-muted">{item.day}</small>
            <small className="fw-bold">R$ {item.revenue}</small>
          </div>
        ))}
      </div>
      
      {/* Grid lines */}
      <div className="position-absolute top-0 start-0 w-100 h-100" style={{ zIndex: -1 }}>
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="border-top border-light" style={{ marginTop: `${i * 25}%` }}></div>
        ))}
      </div>
    </div>
  );
}

export function RecentActivity() {
  const [activities] = useState([
    {
      icon: 'bi-person-plus',
      title: 'Novo usuário cadastrado',
      description: 'João Silva se registrou na plataforma',
      time: '5 min atrás',
      color: 'text-success'
    },
    {
      icon: 'bi-building',
      title: 'Nova empresa criada',
      description: 'Loja do João foi criada',
      time: '15 min atrás',
      color: 'text-primary'
    },
    {
      icon: 'bi-cash',
      title: 'Pagamento recebido',
      description: 'R$ 99,90 - Plano Premium',
      time: '1 hora atrás',
      color: 'text-success'
    },
    {
      icon: 'bi-exclamation-triangle',
      title: 'Problema reportado',
      description: 'Sistema de pagamento offline',
      time: '2 horas atrás',
      color: 'text-warning'
    }
  ]);

  return (
    <div className="list-group list-group-flush">
      {activities.map((activity, index) => (
        <div key={index} className="list-group-item border-0 px-0">
          <div className="d-flex align-items-start">
            <div className={`me-3 ${activity.color}`}>
              <i className={activity.icon}></i>
            </div>
            <div className="flex-grow-1">
              <h6 className="mb-1">{activity.title}</h6>
              <p className="mb-1 text-muted small">{activity.description}</p>
              <small className="text-muted">{activity.time}</small>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}