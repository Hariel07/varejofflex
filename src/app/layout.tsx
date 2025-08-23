// src/app/layout.tsx
import type { Metadata, Viewport } from "next";
import React from "react";

// CSS base (ordem importa)
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./globals.css"; // se não existir, pode remover esta linha

// Carrega o JS do Bootstrap no cliente (modal, collapse, etc.)
import BootstrapClient from "./bootstrap-client";

// Providers (NextAuth SessionProvider)
import Providers from "./providers";

export const metadata: Metadata = {
  title: "Varejofflex - Sua loja online e PDV em uma única plataforma",
  description:
    "Venda mais pagando só o que usar. Plataforma completa para varejo com loja online, PDV e delivery. Teste grátis por 15 dias.",
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "Varejofflex",
    description:
      "Sua loja online e PDV em uma única plataforma. Teste grátis por 15 dias.",
    url: "https://varejofflex.com", // ajuste se necessário
    siteName: "Varejofflex",
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Varejofflex",
    description:
      "Sua loja online e PDV em uma única plataforma. Teste grátis por 15 dias.",
  },
};

export const viewport: Viewport = {
  themeColor: "#2563eb",
};

// Componente para conteúdo principal
function LayoutContent({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* Conteúdo das páginas */}
      <main id="content" className="flex-fill">
        {children}
      </main>
    </>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className="bg-white d-flex flex-column min-vh-100">
        <Providers>
          <LayoutContent>{children}</LayoutContent>
          {/* Bootstrap JS (modals, collapse, etc.) */}
          <BootstrapClient />
        </Providers>
      </body>
    </html>
  );
}
