// src/app/admin/page.tsx
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";

export default async function AdminHome() {
  console.log('[ADMIN] Page accessed, checking session...');
  
  const session = await getServerSession(authOptions);
  console.log('[ADMIN] Session found:', !!session);
  
  if (!session) {
    console.log('[ADMIN] No session, redirecting to login');
    redirect("/login?callbackUrl=/admin");
  }

  const user = session.user as any;
  console.log('[ADMIN] User data:', {
    id: user?.id,
    role: user?.role,
    userType: user?.userType,
    email: user?.email
  });

  // Determinar redirecionamento baseado no userType ou role
  let destination = "/dashboard";
  
  if (user?.userType === "owner_saas" || user?.role === "owner_saas") {
    destination = "/dashboard/owner";
    console.log('[ADMIN] Owner detected, redirecting to:', destination);
  } else if (user?.userType === "lojista" || (user?.role && user.role !== "owner_saas")) {
    destination = "/dashboard/lojista";
    console.log('[ADMIN] Lojista detected, redirecting to:', destination);
  } else {
    console.log('[ADMIN] Fallback redirect to:', destination);
  }
  
  redirect(destination);
}
