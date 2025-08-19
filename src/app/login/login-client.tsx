"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";

export default function LoginClient() {
  const router = useRouter();
  const search = useSearchParams();
  const callbackUrl = search?.get("callbackUrl") || "/admin";
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

    try {
      console.log('[LOGIN] Attempting login with NextAuth signIn');
      
      // Primeiro, teste direto da API
      const testResponse = await fetch('/api/auth/test-signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      const testResult = await testResponse.json();
      console.log('[LOGIN] Test signin result:', testResult);
      
      if (!testResult.success) {
        setErr("E-mail ou senha inválidos.");
        setLoading(false);
        return;
      }

      // Agora tenta com NextAuth
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      console.log('[LOGIN] NextAuth result:', res);

      if (res?.error) {
        setErr("E-mail ou senha inválidos.");
        setLoading(false);
        return;
      }

      if (res?.ok) {
        // Login bem-sucedido, redireciona manualmente
        router.push(callbackUrl);
        return;
      }

      // Fallback - se não há erro nem ok, algo deu errado
      setErr("Erro inesperado durante login.");
    } catch (error) {
      console.error("Login error:", error);
      setErr("Falha ao autenticar. Tente novamente.");
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
