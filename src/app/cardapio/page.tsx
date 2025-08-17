"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useCartStore } from "@/cart/useCartStore";

type Product = {
  _id: string;
  name: string;
  description?: string;
  price: number;
  category?: string;
  image?: string;
};

const fmtBRL = (v: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v);

export default function CardapioPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const add = useCartStore((s) => s.add);

  useEffect(() => {
    fetch("/api/products")
      .then((r) => r.json())
      .then(setProducts)
      .catch((e) => console.error("Falha ao carregar produtos:", e));
  }, []);

  return (
    <main className="max-w-5xl mx-auto p-6">
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Cardápio</h1>
          <p className="text-gray-600">Escolha seus itens e adicione ao carrinho.</p>
        </div>
        <Link href="/checkout" className="px-4 py-2 rounded bg-black text-white">
          Ir para o Checkout
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((p) => (
          <div key={p._id} className="rounded border bg-white p-4 shadow-sm">
            {p.image && (
              // imagem opcional (se você salvar URL no produto)
              <img
                src={p.image}
                alt={p.name}
                className="mb-3 h-40 w-full rounded object-cover"
              />
            )}
            <h3 className="font-semibold text-lg">{p.name}</h3>
            {p.description && (
              <p className="text-sm text-gray-600 mt-1 line-clamp-2">{p.description}</p>
            )}
            <div className="mt-3 flex items-center justify-between">
              <span className="font-bold">{fmtBRL(p.price)}</span>
              <button
                className="px-3 py-2 rounded bg-black text-white"
                onClick={() =>
                  add({ productId: p._id, name: p.name, unitPrice: p.price, qty: 1 })
                }
              >
                Adicionar
              </button>
            </div>
          </div>
        ))}
      </div>

      {products.length === 0 && (
        <div className="mt-8 rounded border p-6 text-center text-gray-600">
          Nenhum produto encontrado.
        </div>
      )}
    </main>
  );
}
