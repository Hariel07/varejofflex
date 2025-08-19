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

    console.log('[LOGIN] Starting login process for:', email);

    try {
      console.log('[LOGIN] Testing direct authentication first...');
      
      // Primeiro, teste direto da API
      const testResponse = await fetch('/api/auth/test-signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      const testResult = await testResponse.json();
      console.log('[LOGIN] Direct test result:', testResult);
      
      if (!testResult.success) {
        console.log('[LOGIN] Direct test failed:', testResult);
        setErr("E-mail ou senha inválidos.");
        setLoading(false);
        return;
      }

      console.log('[LOGIN] Direct test successful, trying NextAuth...');

      // Agora tenta com NextAuth
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      console.log('[LOGIN] NextAuth signIn result:', res);

      if (res?.error) {
        console.log('[LOGIN] NextAuth error:', res.error);
        setErr(`Erro NextAuth: ${res.error}`);
        setLoading(false);
        return;
      }

      if (res?.ok) {
        console.log('[LOGIN] NextAuth success, determining redirect...');
        
        // Buscar informações da sessão para redirecionamento inteligente
        try {
          const sessionResponse = await fetch('/api/auth/session');
          const sessionData = await sessionResponse.json();
          console.log('[LOGIN] Session data:', sessionData);
          
          let redirectTo = callbackUrl;
          
          // Determinar dashboard baseado no tipo de usuário
          if (sessionData?.user) {
            const userType = sessionData.user.userType || sessionData.user.role;
            if (userType === 'owner_saas') {
              redirectTo = '/dashboard/owner';
            } else if (userType === 'lojista' || userType === 'admin_company') {
              redirectTo = '/dashboard/lojista';
            }
          }
          
          console.log('[LOGIN] Redirecting to:', redirectTo);
          router.push(redirectTo);
        } catch (error) {
          console.log('[LOGIN] Error getting session, using fallback redirect');
          router.push(callbackUrl);
        }
        return;
      }

      // Fallback - se não há erro nem ok, algo deu errado
      console.log('[LOGIN] Unexpected NextAuth result:', res);
      setErr("Resultado inesperado do NextAuth. Verifique o console.");
    } catch (error) {
      console.error("[LOGIN] Exception during login:", error);
      setErr(`Erro durante login: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="container py-4">
      <h1 className="h4 mb-3">Entrar no Varejofflex</h1>
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
