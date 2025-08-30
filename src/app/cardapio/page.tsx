"use client";

import { useEffect, useState, Suspense } from "react";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useCartStore } from "@/cart/useCartStore";

type Product = {
  _id: string;
  name: string;
  description?: string;
  price: number;
  category?: string;
  image?: string;
  status: 'draft' | 'published' | 'archived';
  createdAt?: string;
  updatedAt?: string;
};

const fmtBRL = (v: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v);

function CardapioContent() {
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const add = useCartStore((s) => s.add);

  // Verifica se está em modo preview (apenas para lojistas)
  const isPreviewMode = searchParams.get('preview') === 'true';
  const isLojista = session?.user && (session.user as any).userType === 'lojista';
  const canSeePreview = isLojista && isPreviewMode;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const url = canSeePreview ? "/api/products?preview=true" : "/api/products";
        const response = await fetch(url);
        const data = await response.json();
        
        if (response.ok) {
          // Se não está em modo preview, mostra apenas produtos publicados
          let filteredProducts = data.products || data;
          if (!canSeePreview) {
            filteredProducts = filteredProducts.filter((p: Product) => p.status === 'published');
          }
          setProducts(filteredProducts);
        } else {
          console.error("Erro ao carregar produtos:", data);
        }
      } catch (error) {
        console.error("Falha ao carregar produtos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [canSeePreview]);

  const getStatusBadge = (status: string) => {
    if (status === 'draft') {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 ml-2">
          Rascunho
        </span>
      );
    }
    if (status === 'archived') {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 ml-2">
          Arquivado
        </span>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <main className="max-w-5xl mx-auto p-6">
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          <p className="mt-2 text-gray-600">Carregando cardápio...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-5xl mx-auto p-6">
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">
            Cardápio
            {canSeePreview && (
              <span className="ml-3 px-3 py-1 bg-yellow-100 text-yellow-800 text-sm rounded-full">
                Modo Preview
              </span>
            )}
          </h1>
          <p className="text-gray-600">
            {canSeePreview 
              ? "Visualização completa incluindo rascunhos (visível apenas para você)" 
              : "Escolha seus itens e adicione ao carrinho."
            }
          </p>
          
          {canSeePreview && (
            <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>🔍 Modo Lojista:</strong> Você está vendo todos os produtos, incluindo rascunhos.
                Clientes só veem produtos publicados.
                <Link 
                  href="/dashboard/lojista/produtos" 
                  className="ml-2 text-blue-600 hover:text-blue-800 underline"
                >
                  Gerenciar produtos →
                </Link>
              </p>
            </div>
          )}
        </div>
        <Link href="/checkout" className="px-4 py-2 rounded bg-black text-white hover:bg-gray-800 transition-colors">
          Ir para o Checkout
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🍽️</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            {canSeePreview ? "Nenhum produto cadastrado" : "Cardápio em preparação"}
          </h3>
          <p className="text-gray-500 mb-4">
            {canSeePreview 
              ? "Comece criando seus primeiros produtos." 
              : "Em breve teremos deliciosos itens disponíveis."
            }
          </p>
          {canSeePreview && (
            <Link 
              href="/dashboard/lojista/produtos" 
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Criar Primeiro Produto
            </Link>
          )}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => (
            <div key={p._id} className="rounded border bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
              {p.image && (
                <img
                  src={p.image}
                  alt={p.name}
                  className="mb-3 h-40 w-full rounded object-cover"
                />
              )}
              <h3 className="font-semibold text-lg flex items-center">
                {p.name}
                {canSeePreview && getStatusBadge(p.status)}
              </h3>
              {p.description && (
                <p className="text-sm text-gray-600 mt-1 line-clamp-2">{p.description}</p>
              )}
              <div className="mt-3 flex items-center justify-between">
                <span className="font-bold text-lg">{fmtBRL(p.price)}</span>
                
                {/* Botão de adicionar - desabilitado para produtos não publicados em modo preview */}
                {canSeePreview && p.status !== 'published' ? (
                  <button
                    className="px-3 py-2 rounded bg-gray-300 text-gray-500 cursor-not-allowed"
                    disabled
                    title="Produto não está publicado"
                  >
                    Não Disponível
                  </button>
                ) : (
                  <button
                    className="px-3 py-2 rounded bg-black text-white hover:bg-gray-800 transition-colors"
                    onClick={() =>
                      add({ productId: p._id, name: p.name, unitPrice: p.price, qty: 1 })
                    }
                  >
                    Adicionar
                  </button>
                )}
              </div>
              
              {canSeePreview && (
                <div className="mt-2 text-xs text-gray-500">
                  {p.category && <span className="mr-3">📂 {p.category}</span>}
                  <span>🕒 {new Date(p.updatedAt || '').toLocaleDateString('pt-BR')}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </main>
  );
}

export default function CardapioPage() {
  return (
    <Suspense fallback={
      <main className="max-w-5xl mx-auto p-6">
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          <p className="mt-2 text-gray-600">Carregando cardápio...</p>
        </div>
      </main>
    }>
      <CardapioContent />
    </Suspense>
  );
}