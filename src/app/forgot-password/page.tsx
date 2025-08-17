// src/app/forgot-password/page.tsx
"use client";
import { useState } from "react";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [err, setErr] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    const res = await fetch("/api/auth/forgot", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    if (!res.ok) setErr("Falha ao enviar instruções.");
    else setSent(true);
  }

  return (
    <div className="container py-5" style={{ maxWidth: 440 }}>
      <h1 className="h4 mb-3">Esqueci minha senha</h1>
      {sent ? (
        <div className="alert alert-success">
          Se existir uma conta com esse e-mail, enviaremos instruções. Em dev, veja o **console do servidor** para o link.
        </div>
      ) : (
        <>
          {err && <div className="alert alert-danger py-2">{err}</div>}
          <form onSubmit={onSubmit}>
            <div className="mb-3">
              <label className="form-label">E-mail</label>
              <input
                className="form-control"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <button className="btn btn-primary w-100">Enviar</button>
          </form>
        </>
      )}
    </div>
  );
}
