"use client";
import { useState } from "react";
import { useCartStore } from "@/cart/useCartStore";

export default function CheckoutPage() {
  const { items, subtotal, total, setCoupon, discount, deliveryFee, setDeliveryFee } = useCartStore();
  const [code, setCode] = useState("");

  const aplicarCupom = async () => {
    const res = await fetch("/api/coupons/validate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tenantId: "demo", code, orderSubtotal: subtotal() }),
    }).then(r => r.json());
    if (res.valid) setCoupon(res.code, res.discount);
    else alert("Cupom inválido: " + (res.reason || "erro"));
  };

  const finalizar = async () => {
    const body = {
      tenantId: "demo",
      items: items.map(i => ({ productId: i.productId, name: i.name, qty: i.qty, unitPrice: i.unitPrice, total: i.qty * i.unitPrice })),
      customer: { name: "Cliente Demo" },
      address: { street: "Rua X", number: "123", district: "Centro", city: "Cidade", zip: "00000-000" },
      payment: { method: "cash", changeFor: 0, status: "pending" },
      couponCode: code || undefined,
      deliveryFee,
    };
    const res = await fetch("/api/orders", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) })
      .then(r => r.json());
    if (res.id) alert("Pedido criado! Total R$ " + res.total.toFixed(2));
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Checkout</h1>

      <div className="mb-4 space-y-2">
        {items.map(i => (
          <div key={i.productId} className="flex justify-between">
            <span>{i.qty}x {i.name}</span>
            <span>R$ {(i.qty * i.unitPrice).toFixed(2)}</span>
          </div>
        ))}
        <div className="flex justify-between"><span>Subtotal</span><span>R$ {subtotal().toFixed(2)}</span></div>
        <div className="flex items-center gap-2">
          <input value={code} onChange={e => setCode(e.target.value)} placeholder="Cupom" className="border rounded px-2 py-1" />
          <button onClick={aplicarCupom} className="px-3 py-1 border rounded">Aplicar</button>
          {typeof discount === "number" && discount > 0 && <span className="text-green-600">- R$ {discount.toFixed(2)}</span>}
        </div>
        <div className="flex items-center gap-2">
          <span>Taxa de entrega:</span>
          <input type="number" step="0.5" value={deliveryFee} onChange={e => setDeliveryFee(Number(e.target.value))} className="border rounded px-2 py-1 w-24" />
        </div>
        <div className="flex justify-between font-bold"><span>Total</span><span>R$ {total().toFixed(2)}</span></div>
      </div>

      <button onClick={finalizar} className="px-4 py-2 bg-black text-white rounded">Finalizar pedido</button>
    </div>
  );
}
