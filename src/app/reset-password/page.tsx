// src/app/reset-password/page.tsx
"use client";
import { useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";

function ResetInner() {
  const params = useSearchParams();
  const token = params.get("token") || "";
  const [password, setPassword] = useState("");
  const [ok, setOk] = useState(false);
  const [err, setErr] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    const res = await fetch("/api/auth/reset", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password }),
    });
    const j = await res.json();
    if (!res.ok) setErr(j?.error || "Erro");
    else setOk(true);
  }

  if (!token) return <div className="container py-5">Token ausente.</div>;

  return (
    <div className="container py-5" style={{ maxWidth: 440 }}>
      <h1 className="h4 mb-3">Definir nova senha</h1>
      {ok ? (
        <div className="alert alert-success">
          Senha alterada! <a href="/login">Entrar</a>
        </div>
      ) : (
        <>
          {err && <div className="alert alert-danger py-2">{String(err)}</div>}
          <form onSubmit={onSubmit}>
            <div className="mb-3">
              <label className="form-label">Nova senha</label>
              <input
                className="form-control"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={6}
                required
              />
            </div>
            <button className="btn btn-primary w-100">Salvar nova senha</button>
          </form>
        </>
      )}
    </div>
  );
}
export default function Page() {
  return (
    <Suspense>
      <ResetInner />
    </Suspense>
  );
}
