"use client";
import { useEffect, useState } from "react";
import { useCartStore } from "@/cart/useCartStore";

type Product = { _id: string; name: string; description?: string; price: number; category?: string };

export default function CardapioPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const add = useCartStore(s => s.add);

  useEffect(() => {
    fetch("/api/products").then(r => r.json()).then(setProducts);
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Cardápio</h1>
      <div className="grid md:grid-cols-3 gap-4">
        {products.map(p => (
          <div key={p._id} className="border rounded p-3">
            <h3 className="font-semibold">{p.name}</h3>
            <p className="text-sm text-gray-500">{p.description}</p>
            <p className="mt-2 font-bold">R$ {p.price.toFixed(2)}</p>
            <button
              className="mt-3 px-3 py-2 bg-black text-white rounded"
              onClick={() => add({ productId: p._id, name: p.name, unitPrice: p.price, qty: 1 })}
            >
              Adicionar
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
