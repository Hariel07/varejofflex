"use client";

import { useState } from "react";
import Link from "next/link";
import { useCartStore } from "@/cart/useCartStore";

const fmtBRL = (v: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v);

export default function CheckoutPage() {
  const {
    items,
    subtotal,
    total,
    discount,
    deliveryFee,
    setDeliveryFee,
    setCoupon,
    clear,
  } = useCartStore();
  const [code, setCode] = useState("");

  const aplicarCupom = async () => {
    try {
      const res = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tenantId: "demo", code, orderSubtotal: subtotal() }),
      }).then((r) => r.json());

      if (res.valid) {
        setCoupon(res.code, res.discount);
        alert(`Cupom aplicado: ${res.code} (- ${fmtBRL(res.discount)})`);
      } else {
        const motivo =
          res.reason === "not_found"
            ? "Cupom não encontrado"
            : res.reason === "expired"
            ? "Cupom expirado ou fora do período"
            : res.reason === "limit_reached"
            ? "Limite de usos atingido"
            : res.reason === "min_total"
            ? "Subtotal abaixo do mínimo para este cupom"
            : "Cupom inválido";
        alert(motivo);
      }
    } catch (e: any) {
      alert("Erro ao validar cupom: " + e.message);
    }
  };

  const finalizar = async () => {
    try {
      const body = {
        tenantId: "demo",
        items: items.map((i) => ({
          productId: i.productId,
          name: i.name,
          qty: i.qty,
          unitPrice: i.unitPrice,
          total: i.qty * i.unitPrice,
        })),
        customer: { name: "Cliente Demo", email: "", phone: "", cpf: "" },
        address: {
          street: "Rua X",
          number: "123",
          district: "Centro",
          city: "Cidade",
          zip: "00000-000",
          complement: "",
        },
        payment: { method: "cash", changeFor: 0, status: "pending" }, // simples p/ MVP
        couponCode: code || undefined,
        deliveryFee,
      };

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }).then((r) => r.json());

      if (res.id) {
        alert(`Pedido criado! Total ${fmtBRL(res.total)}`);
        clear();
      } else {
        alert("Falha ao criar pedido.");
      }
    } catch (e: any) {
      alert("Erro ao finalizar pedido: " + e.message);
    }
  };

  return (
    <main className="max-w-4xl mx-auto p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl md:text-3xl font-bold">Checkout</h1>
        <Link href="/cardapio" className="px-4 py-2 rounded border">
          Voltar ao Cardápio
        </Link>
      </div>

      <div className="rounded border bg-white p-4">
        {items.length === 0 ? (
          <p className="text-gray-600">Seu carrinho está vazio.</p>
        ) : (
          <>
            <div className="space-y-2">
              {items.map((i) => (
                <div key={i.productId} className="flex justify-between text-sm">
                  <span>
                    {i.qty}× {i.name}
                  </span>
                  <span>{fmtBRL(i.qty * i.unitPrice)}</span>
                </div>
              ))}
            </div>

            <hr className="my-4" />

            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-medium">{fmtBRL(subtotal())}</span>
            </div>

            <div className="mt-3 flex items-center gap-2">
              <input
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Cupom (ex.: TESTE10)"
                className="w-48 border rounded px-2 py-1"
              />
              <button onClick={aplicarCupom} className="px-3 py-1 rounded border">
                Aplicar
              </button>
              {typeof discount === "number" && discount > 0 && (
                <span className="text-green-600 text-sm">
                  Desconto: − {fmtBRL(discount)}
                </span>
              )}
            </div>

            <div className="mt-3 flex items-center gap-2">
              <span>Taxa de entrega:</span>
              <input
                type="number"
                step="0.5"
                value={deliveryFee}
                onChange={(e) => setDeliveryFee(Number(e.target.value))}
                className="w-24 border rounded px-2 py-1"
              />
            </div>

            <div className="mt-4 flex justify-between text-lg font-semibold">
              <span>Total</span>
              <span>{fmtBRL(total())}</span>
            </div>

            <button
              onClick={finalizar}
              className="mt-4 w-full px-4 py-2 rounded bg-black text-white"
            >
              Finalizar pedido
            </button>
          </>
        )}
      </div>
    </main>
  );
}
