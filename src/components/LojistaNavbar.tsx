'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import UserMenu from './UserMenu';

interface NavItem {
  name: string;
  href: string;
  icon: string;
  badge?: string;
  submenu?: NavItem[];
}

const navItems: NavItem[] = [
  {
    name: 'Dashboard',
    href: '/dashboard/lojista',
    icon: 'house'
  },
  {
    name: 'Produtos',
    href: '/dashboard/lojista/produtos',
    icon: 'box',
    submenu: [
      { name: 'Categorias', href: '/dashboard/lojista/categorias', icon: 'tag' },
      { name: 'Produtos', href: '/dashboard/lojista/produtos', icon: 'box' }
    ]
  },
  {
    name: 'Estoque',
    href: '/dashboard/lojista/estoque',
    icon: 'boxes',
    submenu: [
      { name: 'Ingredientes', href: '/dashboard/lojista/ingredientes', icon: 'egg' },
      { name: 'Receitas', href: '/dashboard/lojista/receitas', icon: 'book' },
      { name: 'Fornecedores', href: '/dashboard/lojista/fornecedores', icon: 'truck' },
      { name: 'Movimentações', href: '/dashboard/lojista/movimentacoes', icon: 'arrow-left-right' },
      { name: 'Seções', href: '/dashboard/lojista/secoes', icon: 'folder' }
    ]
  },
  {
    name: 'Pedidos',
    href: '/dashboard/lojista/pedidos',
    icon: 'cart-check',
    badge: '3'
  },
  {
    name: 'Custos',
    href: '/dashboard/lojista/custos',
    icon: 'calculator'
  },
  {
    name: 'Relatórios',
    href: '/dashboard/lojista/relatorios',
    icon: 'graph-up'
  }
];

export default function LojistaNavbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  const pathname = usePathname();

  // Fechar menu mobile ao mudar de rota
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setOpenSubmenu(null);
  }, [pathname]);

  const isActiveRoute = (href: string) => {
    if (href === '/dashboard/lojista') {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  const hasActiveSubmenu = (submenu?: NavItem[]) => {
    if (!submenu) return false;
    return submenu.some(item => isActiveRoute(item.href));
  };

  return (
    <nav 
      className="navbar navbar-expand-lg navbar-dark shadow-sm"
      style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
      }}
    >
      <div className="container-fluid">
        {/* Brand */}
        <Link href="/dashboard/lojista" className="navbar-brand d-flex align-items-center">
          <span className="me-2" style={{ fontSize: '1.5rem' }}>🏪</span>
          <span className="fw-bold">VarejoFlex</span>
          <span className="badge bg-white text-primary ms-2 small">Lojista</span>
        </Link>

        {/* Mobile menu button */}
        <button
          className="navbar-toggler border-0"
          type="button"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          style={{ 
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '8px'
          }}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Menu Items */}
        <div className={`collapse navbar-collapse ${isMobileMenuOpen ? 'show' : ''}`}>
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            {navItems.map((item) => (
              <li key={item.name} className="nav-item dropdown">
                {item.submenu ? (
                  <>
                    <button
                      className={`nav-link dropdown-toggle btn btn-link border-0 text-start ${
                        hasActiveSubmenu(item.submenu) ? 'active' : ''
                      }`}
                      onClick={() => setOpenSubmenu(openSubmenu === item.name ? null : item.name)}
                      style={{
                        background: hasActiveSubmenu(item.submenu) 
                          ? 'rgba(255, 255, 255, 0.15)' 
                          : 'transparent',
                        borderRadius: '8px',
                        color: 'white',
                        textDecoration: 'none'
                      }}
                    >
                      <i className={`bi bi-${item.icon} me-2`}></i>
                      {item.name}
                      {item.badge && (
                        <span className="badge bg-danger ms-2 small">{item.badge}</span>
                      )}
                    </button>
                    <ul className={`dropdown-menu ${openSubmenu === item.name ? 'show' : ''}`}>
                      {item.submenu.map((subItem) => (
                        <li key={subItem.name}>
                          <Link
                            href={subItem.href}
                            className={`dropdown-item ${isActiveRoute(subItem.href) ? 'active' : ''}`}
                          >
                            <i className={`bi bi-${subItem.icon} me-2`}></i>
                            {subItem.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </>
                ) : (
                  <Link
                    href={item.href}
                    className={`nav-link ${isActiveRoute(item.href) ? 'active' : ''}`}
                    style={{
                      background: isActiveRoute(item.href) 
                        ? 'rgba(255, 255, 255, 0.15)' 
                        : 'transparent',
                      borderRadius: '8px',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      if (!isActiveRoute(item.href)) {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActiveRoute(item.href)) {
                        e.currentTarget.style.background = 'transparent';
                      }
                    }}
                  >
                    <i className={`bi bi-${item.icon} me-2`}></i>
                    {item.name}
                    {item.badge && (
                      <span className="badge bg-danger ms-2 small">{item.badge}</span>
                    )}
                  </Link>
                )}
              </li>
            ))}
          </ul>

          {/* User Menu */}
          <div className="navbar-nav">
            <UserMenu />
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 d-lg-none"
          style={{ zIndex: 1040 }}
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </nav>
  );
}