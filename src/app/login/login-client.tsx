"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";

export default function LoginClient() {
  const router = useRouter();
  const search = useSearchParams();
  const callbackUrl = search?.get("callbackUrl") || "/dashboard";
  const errorQuery = search?.get("error");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(
    errorQuery ? "Sessão expirada ou credenciais inválidas." : null
  );
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setLoading(true);

    console.log('[LOGIN-V2] Starting login process for:', email, 'at', new Date().toISOString());

    try {
      // Login direto com NextAuth
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      console.log('[LOGIN-V2] NextAuth signIn result:', res);

      if (res?.error) {
        console.log('[LOGIN-V2] NextAuth error:', res.error);
        setErr(`Erro de autenticação: ${res.error}`);
        setLoading(false);
        return;
      }

      if (res?.ok) {
        console.log('[LOGIN-V2] NextAuth success, determining redirect...');
        
        // Buscar informações da sessão para redirecionamento inteligente
        try {
          const sessionResponse = await fetch('/api/auth/session');
          const sessionData = await sessionResponse.json();
          console.log('[LOGIN-V2] Session data:', sessionData);
          
          let redirectTo = callbackUrl;
          
          // Determinar dashboard baseado no tipo de usuário
          if (sessionData?.user) {
            const userType = sessionData.user.userType || sessionData.user.role;
            console.log('[LOGIN-V2] User type detected:', userType);
            
            if (userType === 'owner_saas') {
              redirectTo = '/dashboard/owner';
            } else if (userType === 'lojista' || userType === 'admin_company') {
              redirectTo = '/dashboard/lojista';
            }
          }
          
          console.log('[LOGIN-V2] Final redirect to:', redirectTo);
          router.push(redirectTo);
        } catch (error) {
          console.log('[LOGIN-V2] Error getting session, using fallback redirect');
          router.push(callbackUrl);
        }
        return;
      }

      // Fallback - se não há erro nem ok, algo deu errado
      console.log('[LOGIN-V2] Unexpected NextAuth result:', res);
      setErr("Resultado inesperado do NextAuth. Verifique o console.");
    } catch (error) {
      console.error("[LOGIN-V2] Exception during login:", error);
      setErr(`Erro durante login: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="container py-4">
      <h1 className="h4 mb-3">Entrar no Varejofflex</h1>
      <small className="text-muted mb-3 d-block">Versão: 2.0 - {new Date().toLocaleString()}</small>
      <form onSubmit={onSubmit} className="col-12 col-md-6 col-lg-4">
        <div className="mb-3">
          <label className="form-label">E-mail</label>
          <input
            className="form-control"
            type="email"
            autoComplete="username"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Senha</label>
          <input
            className="form-control"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
            required
          />
        </div>
        {err && <div className="alert alert-danger py-2">{err}</div>}
        <button type="submit" className="btn btn-primary w-100" disabled={loading}>
          {loading ? "Entrando..." : "Entrar"}
        </button>
      </form>
    </main>
  );
}
