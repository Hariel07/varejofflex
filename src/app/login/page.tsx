// src/app/login/page.tsx
"use client";

import { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";

function LoginInner() {
  const params = useSearchParams();
  const callbackUrl = params.get("callbackUrl") || "/admin";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    setLoading(true);
    
    console.log('[LOGIN] Attempting login for:', email);
    
    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
        callbackUrl,
      });
      
      console.log('[LOGIN] SignIn response:', res);
      
      if (res?.error) {
        console.log('[LOGIN] Error:', res.error);
        setErr("E-mail ou senha inválidos. Verifique seus dados.");
      } else if (res?.ok) {
        console.log('[LOGIN] Success, redirecting to:', callbackUrl);
        window.location.href = callbackUrl;
      } else {
        console.log('[LOGIN] Unknown error');
        setErr("Erro inesperado. Tente novamente.");
      }
    } catch (error) {
      console.error('[LOGIN] Exception:', error);
      setErr("Falha no login. Verifique sua conexão.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container py-5" style={{ maxWidth: 440 }}>
      <h1 className="h4 mb-3 text-dark">Entrar — Varejofflex</h1>
      {err && <div className="alert alert-danger py-2">{err}</div>}
      <form onSubmit={onSubmit} /* sem action/method */>
        <div className="mb-3">
          <label className="form-label text-dark fw-medium">E-mail</label>
          <input
            className="form-control"
            type="email"
            autoComplete="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="mb-2">
          <label className="form-label text-dark fw-medium">Senha</label>
          <input
            className="form-control"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="d-flex justify-content-between align-items-center mb-3">
          <a href="/forgot-password">Esqueci minha senha</a>
        </div>

        <button className="btn btn-primary w-100" disabled={loading}>
          {loading ? "Entrando..." : "Entrar"}
        </button>
      </form>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense>
      <LoginInner />
    </Suspense>
  );
}
