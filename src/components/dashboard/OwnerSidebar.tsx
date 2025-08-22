"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import { useAuthUser } from "@/hooks/useAuth";

export default function OwnerSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { user } = useAuthUser();

  const handleLogout = async () => {
    await signOut({ 
      callbackUrl: "/login",
      redirect: true 
    });
  };

  const menuItems = [
    {
      icon: "bi-speedometer2",
      label: "Dashboard",
      href: "/dashboard/owner",
      active: true
    },
    {
      icon: "bi-people",
      label: "Usuários",
      href: "/dashboard/owner/users",
      active: false
    },
    {
      icon: "bi-building",
      label: "Empresas",
      href: "/dashboard/owner/companies",
      active: false
    },
    {
      icon: "bi-graph-up",
      label: "Analytics",
      href: "/dashboard/owner/analytics",
      active: false
    },
    {
      icon: "bi-cash-stack",
      label: "Financeiro",
      href: "/dashboard/owner/billing",
      active: false
    },
    {
      icon: "bi-gear",
      label: "Configurações",
      href: "/dashboard/owner/settings",
      active: false
    }
  ];

  return (
    <div 
      className={`bg-dark text-white position-fixed h-100 shadow-lg transition-all ${
        isCollapsed ? 'sidebar-collapsed' : 'sidebar-expanded'
      }`}
      style={{
        top: 0,
        left: 0,
        zIndex: 1000,
      }}
    >
      {/* Header */}
      <div className="p-3 border-bottom border-secondary">
        <div className="d-flex align-items-center justify-content-between">
          {!isCollapsed && (
            <div>
              <h5 className="mb-0 text-primary">VarejoFlex</h5>
              <small className="text-muted">Owner SaaS</small>
            </div>
          )}
          <button 
            className="btn btn-outline-light btn-sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            <i className={`bi ${isCollapsed ? 'bi-chevron-right' : 'bi-chevron-left'}`}></i>
          </button>
        </div>
      </div>

      {/* User Info */}
      {!isCollapsed && (
        <div className="p-3 border-bottom border-secondary">
          <div className="d-flex align-items-center">
            <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: '40px', height: '40px' }}>
              <i className="bi bi-person-fill text-white"></i>
            </div>
            <div>
              <div className="fw-bold">{user?.name || 'Usuário'}</div>
              <small className="text-muted">{user?.email}</small>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-grow-1">
        <ul className="nav flex-column p-0">
          {menuItems.map((item, index) => (
            <li key={index} className="nav-item">
              <a 
                href={item.href}
                className={`nav-link text-white d-flex align-items-center px-3 py-3 ${item.active ? 'bg-primary' : 'hover-bg-secondary'}`}
              >
                <i className={`${item.icon} fs-5`}></i>
                {!isCollapsed && (
                  <span className="ms-3">{item.label}</span>
                )}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* Logout Button */}
      <div className="p-3 border-top border-secondary">
        <button 
          onClick={handleLogout}
          className="btn btn-outline-danger w-100 d-flex align-items-center justify-content-center"
        >
          <i className="bi bi-box-arrow-right"></i>
          {!isCollapsed && <span className="ms-2">Sair</span>}
        </button>
      </div>
    </div>
  );
}