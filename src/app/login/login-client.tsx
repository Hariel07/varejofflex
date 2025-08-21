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

    console.log('[LOGIN-V4] Iniciando login para:', email);

    try {
      // Usar o fluxo padrão do NextAuth com redirect para /admin
      const result = await signIn("credentials", {
        email: email.toLowerCase().trim(),
        password,
        callbackUrl: "/admin", // Admin agora força o redirecionamento correto
        redirect: true, // Deixa o NextAuth controlar o redirecionamento
      });

      // Se chegou aqui, algo deu errado (não deveria com redirect: true)
      console.log('[LOGIN-V4] Resultado inesperado:', result);
      
      if (result?.error) {
        setErr(`Erro de autenticação: ${result.error}`);
        setLoading(false);
        return;
      }

    } catch (error) {
      console.error("[LOGIN-V4] Erro durante login:", error);
      setErr(`Erro durante login: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
      setLoading(false);
    }
  }

  return (
    <main className="container py-4">
      <h1 className="h4 mb-3">Entrar no VarejoFlex</h1>
      <small className="text-muted mb-3 d-block">Versão: 4.0 - Fluxo Radical - {new Date().toLocaleString()}</small>
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
