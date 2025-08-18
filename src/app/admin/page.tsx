// src/app/admin/page.tsx
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";

export default async function AdminHome() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login?callbackUrl=/admin");

  const user = session.user as any;

  // Redirecionar para o dashboard apropriado
  if (user?.userType === "owner_saas") {
    redirect("/dashboard/owner");
  } else if (user?.userType === "lojista") {
    redirect("/dashboard/lojista");
  } else {
    // Fallback para roles antigas
    if (user?.role === "owner_saas") {
      redirect("/dashboard/owner");
    } else {
      redirect("/dashboard/lojista");
    }
  }
}
