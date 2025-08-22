// src/app/(dashboard)/layout.tsx
import type { Metadata } from "next";
import React from "react";

// CSS base (ordem importa)
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "../../globals.css";

// Carrega o JS do Bootstrap no cliente (modal, collapse, etc.)
import BootstrapClient from "../../bootstrap-client";

// Providers (NextAuth SessionProvider)
import Providers from "../../providers";

export const metadata: Metadata = {
  title: "Dashboard Owner - VarejoFlex",
  description: "Dashboard administrativo do VarejoFlex para gestão completa da plataforma SaaS",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function DashboardGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Providers>
      <div className="dashboard-container dashboard-body">
        {children}
      </div>
      <BootstrapClient />
    </Providers>
  );
}