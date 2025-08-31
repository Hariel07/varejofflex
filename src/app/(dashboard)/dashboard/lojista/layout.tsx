import React from 'react';
import LojistaNavbar from '@/components/LojistaNavbar';

export default function LojistaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-vh-100" style={{ background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}>
      <LojistaNavbar />
      <main>
        {children}
      </main>
    </div>
  );
}