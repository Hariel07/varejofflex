"use client";

import { Suspense } from 'react';
import ProductManagementWithPreview from '@/components/dashboard/ProductManagementWithPreview';
import { ProtectedContent } from '@/components/auth/ProtectedContent';

export default function ProdutosPage() {
  return (
    <div className="min-vh-100" style={{ background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}>
      <div className="container-fluid py-4">
        <Suspense fallback={
          <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Carregando...</span>
            </div>
          </div>
        }>
          <ProtectedContent permission="manage_products">
            <ProductManagementWithPreview />
          </ProtectedContent>
        </Suspense>
      </div>
    </div>
  );
}