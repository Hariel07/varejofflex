"use client";

import { useAuthUser } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardRouter() {
  const { user, isLoading } = useAuthUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    if (!user) {
      router.push("/login?callbackUrl=/dashboard");
      return;
    }

    // Redirecionar baseado no tipo de usuário
    if (user.userType === "owner_saas") {
      router.push("/dashboard/owner");
    } else if (user.userType === "lojista") {
      router.push("/dashboard/lojista");
    } else {
      // Fallback para roles antigas
      if (user.role === "owner_saas") {
        router.push("/dashboard/owner");
      } else {
        router.push("/dashboard/lojista");
      }
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Carregando...</span>
          </div>
          <p className="mt-3 text-muted">Redirecionando para seu dashboard...</p>
        </div>
      </div>
    );
  }

  return null;
}