"use client";

import { useState } from "react";

export default function RegisterPage() {
  const [mode, setMode] = useState<"owner_saas"|"admin_company">("admin_company");
  const [errors, setErrors] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErrors(null); setOk(null); setLoading(true);
    const fd = new FormData(e.target as HTMLFormElement);

    const payload:any = {
      mode,
      user: {
        name: String(fd.get("user_name") || ""),
        email: String(fd.get("user_email") || ""),
        password: String(fd.get("user_password") || ""),
      }
    };

    if (mode === "admin_company") {
      payload.company = {
        name: String(fd.get("company_name") || ""),
        documentType: String(fd.get("document_type") || "CNPJ"),
        documentNumber: String(fd.get("document_number") || ""),
        email: String(fd.get("company_email") || ""),
        phone: String(fd.get("company_phone") || ""),
        address: {
          zip: String(fd.get("zip") || ""),
          street: String(fd.get("street") || ""),
          number: String(fd.get("number") || ""),
          district: String(fd.get("district") || ""),
          city: String(fd.get("city") || ""),
          state: String(fd.get("state") || ""),
          complement: String(fd.get("complement") || ""),
        }
      };
    }

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok) {
        setErrors(data?.error?.message || "Erro ao registrar");
      } else {
        setOk("Cadastro efetuado com sucesso!");
      }
    } catch {
      setErrors("Falha de rede ao registrar");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="container py-4">
      <h1 className="h4 mb-3">Cadastro — Varejofflex</h1>

      <div className="mb-3">
        <label className="form-label me-3">Tipo de cadastro:</label>
        <div className="btn-group">
          <button type="button" className={`btn ${mode==="admin_company"?"btn-primary":"btn-outline-primary"}`} onClick={()=>setMode("admin_company")}>Admin Lojista</button>
          <button type="button" className={`btn ${mode==="owner_saas"?"btn-danger":"btn-outline-danger"}`} onClick={()=>setMode("owner_saas")}>Owner SaaS (único)</button>
        </div>
      </div>

      <form onSubmit={submit} className="row g-3">
        {mode === "admin_company" && (
          <>
            <div className="col-12"><h5>Empresa</h5></div>
            <div className="col-md-6">
              <label className="form-label">Nome da empresa</label>
              <input name="company_name" className="form-control" required />
            </div>
            <div className="col-md-3">
              <label className="form-label">Documento</label>
              <select name="document_type" className="form-select">
                <option value="CNPJ">CNPJ</option>
                <option value="CPF">CPF</option>
              </select>
            </div>
            <div className="col-md-3">
              <label className="form-label">Número</label>
              <input name="document_number" className="form-control" required />
            </div>
            <div className="col-md-4">
              <label className="form-label">E-mail</label>
              <input name="company_email" type="email" className="form-control" />
            </div>
            <div className="col-md-4">
              <label className="form-label">Telefone/WhatsApp</label>
              <input name="company_phone" className="form-control" />
            </div>
            <div className="col-12"><small className="text-muted">Endereço (opcional)</small></div>
            <div className="col-md-2"><input name="zip" placeholder="CEP" className="form-control" /></div>
            <div className="col-md-4"><input name="street" placeholder="Rua" className="form-control" /></div>
            <div className="col-md-2"><input name="number" placeholder="Número" className="form-control" /></div>
            <div className="col-md-4"><input name="district" placeholder="Bairro" className="form-control" /></div>
            <div className="col-md-4"><input name="city" placeholder="Cidade" className="form-control" /></div>
            <div className="col-md-2"><input name="state" placeholder="UF" className="form-control" /></div>
            <div className="col-md-6"><input name="complement" placeholder="Complemento" className="form-control" /></div>
            <hr className="mt-3" />
          </>
        )}

        <div className="col-12"><h5>Usuário</h5></div>
        <div className="col-md-4">
          <label className="form-label">Nome</label>
          <input name="user_name" className="form-control" required />
        </div>
        <div className="col-md-4">
          <label className="form-label">E-mail</label>
          <input name="user_email" type="email" className="form-control" required />
        </div>
        <div className="col-md-4">
          <label className="form-label">Senha</label>
          <input name="user_password" type="password" minLength={6} className="form-control" required />
        </div>

        {errors && <div className="col-12"><div className="alert alert-danger">{errors}</div></div>}
        {ok && <div className="col-12"><div className="alert alert-success">{ok}</div></div>}

        <div className="col-12">
          <button className="btn btn-success" disabled={loading}>
            {loading ? "Salvando..." : "Cadastrar"}
          </button>
        </div>
      </form>
    </main>
  );
}
