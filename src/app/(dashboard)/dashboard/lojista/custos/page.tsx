"use client";

import { Suspense } from 'react';
import { ProtectedContent } from '@/components/auth/ProtectedContent';
import CostManagementDashboard from '@/components/CostManagementDashboard';

export default function CustosPage() {
  return (
    <ProtectedContent permission="manage_costs">
      <div className="min-vh-100">
        <Suspense fallback={
          <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Carregando gestão de custos...</span>
            </div>
          </div>
        }>
          <CostManagementDashboard />
        </Suspense>
      </div>
    </ProtectedContent>
  );
}