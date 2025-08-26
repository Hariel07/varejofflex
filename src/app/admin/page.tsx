// src/app/admin/page.tsx
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import Link from "next/link";

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

  // Se é owner_saas, mostrar painel de administração
  if (user?.userType === "owner_saas" || user?.role === "owner_saas") {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Painel de Administração</h1>
          <p className="text-gray-600">Gerencie a plataforma VarejoFlex</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Gerenciar Usuários */}
          <Link href="/admin/users" className="block">
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border-l-4 border-blue-500">
              <div className="flex items-center mb-4">
                <div className="bg-blue-100 p-3 rounded-full mr-4">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Gerenciar Usuários</h3>
                  <p className="text-gray-600 text-sm">Visualizar, editar e excluir usuários</p>
                </div>
              </div>
              <div className="text-blue-600 text-sm font-medium">
                Acessar Gestão de Usuários →
              </div>
            </div>
          </Link>

          {/* Estatísticas */}
          <Link href="/admin/stats" className="block">
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border-l-4 border-green-500">
              <div className="flex items-center mb-4">
                <div className="bg-green-100 p-3 rounded-full mr-4">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Estatísticas</h3>
                  <p className="text-gray-600 text-sm">Relatórios e métricas da plataforma</p>
                </div>
              </div>
              <div className="text-green-600 text-sm font-medium">
                Ver Estatísticas →
              </div>
            </div>
          </Link>

          {/* Configurações */}
          <Link href="/admin/config" className="block">
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border-l-4 border-purple-500">
              <div className="flex items-center mb-4">
                <div className="bg-purple-100 p-3 rounded-full mr-4">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Configurações</h3>
                  <p className="text-gray-600 text-sm">Configurações gerais da plataforma</p>
                </div>
              </div>
              <div className="text-purple-600 text-sm font-medium">
                Acessar Configurações →
              </div>
            </div>
          </Link>
        </div>

        {/* Ações rápidas */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Ações Rápidas</h2>
          <div className="flex flex-wrap gap-4">
            <Link href="/dashboard/owner" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
              Dashboard Owner
            </Link>
            <Link href="/admin/init-plans" className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
              Inicializar Planos
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Determinar redirecionamento baseado no userType ou role para outros usuários
  let destination = "/dashboard";
  
  if (user?.userType === "lojista" || (user?.role && user.role !== "owner_saas")) {
    destination = "/dashboard/lojista";
    console.log('[ADMIN] Lojista detected, redirecting to:', destination);
  } else {
    console.log('[ADMIN] Fallback redirect to:', destination);
  }
  
  redirect(destination);
}
