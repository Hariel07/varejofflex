// src/app/admin/page.tsx
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";

export default async function AdminHome() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login?callbackUrl=/admin");

  return (
    <main className="container py-4">
      <h1 className="h4">Admin — Varejofflex</h1>
      <p className="text-muted">Bem-vindo, {session.user?.name}</p>
      {/* cards/atalhos do painel */}
    </main>
  );
}
