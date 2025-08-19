// src/lib/auth.ts
import type { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { dbConnect } from "@/lib/db";
import User from "@/models/User";
import Company from "@/models/Company";
import { createTenantContext } from "@/lib/permissions";
import type { AuthUser, UserType, Role } from "@/types/auth";

/**
 * Configuração do NextAuth (v4) com provider de credenciais e multi-tenancy.
 * Exportamos como *named export* para uso com getServerSession(authOptions).
 */
export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "E-mail", type: "text" },
        password: { label: "Senha", type: "password" },
      },
      /**
       * Autenticação via e-mail/senha no MongoDB com contexto multi-tenant.
       * Retorne `null` para falha, ou um objeto AuthUser para sucesso.
       */
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials.password) {
            console.log('[AUTH] Missing credentials');
            return null;
          }

          await dbConnect();

          // Busca o usuário e popula a company se existir
          const userDoc = await User.findOne({
            email: credentials.email.toLowerCase(),
            isActive: true, // Apenas usuários ativos
          }).populate('companyId').lean();

          console.log('[AUTH] User found:', !!userDoc);
          if (!userDoc) return null;

          const ok = await bcrypt.compare(
            credentials.password,
            (userDoc as any).passwordHash
          );
          
          console.log('[AUTH] Password match:', ok);
          if (!ok) return null;

          // Atualiza último login
          await User.updateOne(
            { _id: (userDoc as any)._id },
            { lastLoginAt: new Date() }
          );

          // Determina o tipo de usuário baseado no role
          const userType: UserType = (userDoc as any).role === "owner_saas" ? "owner_saas" : "lojista";
          
          // Cria o contexto de tenant
          const tenantContext = createTenantContext(
            (userDoc as any).role,
            userType,
            (userDoc as any).companyId ? String((userDoc as any).companyId._id || (userDoc as any).companyId) : undefined
          );

          // Verifica se a company está ativa (para lojistas)
          if (userType === "lojista" && (userDoc as any).companyId) {
            const company = (userDoc as any).companyId;
            if (company && !company.isActive) {
              return null; // Company inativa
            }
          }

          const authUser: AuthUser = {
            id: String((userDoc as any)._id),
            name: (userDoc as any).name,
            email: (userDoc as any).email,
            role: (userDoc as any).role,
            userType,
            companyId: (userDoc as any).companyId 
              ? String((userDoc as any).companyId._id || (userDoc as any).companyId)
              : undefined,
            tenantContext,
          };

          return authUser as any;
        } catch (error) {
          console.error("Auth error:", error);
          // Nunca vaze detalhes de erro na authorize
          return null;
        }
      },
    }),
  ],

  // Configurações importantes para produção
  session: { 
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 horas
  },

  // Páginas customizadas
  pages: { 
    signIn: "/login",
    error: "/login",
  },

  callbacks: {
    /**
     * Injeta dados completos do usuário no token JWT quando faz login.
     */
    async jwt({ token, user }) {
      if (user) {
        const authUser = user as AuthUser;
        (token as any).role = authUser.role;
        (token as any).userType = authUser.userType;
        (token as any).companyId = authUser.companyId;
        (token as any).tenantContext = authUser.tenantContext;
      }
      return token;
    },

    /**
     * Disponibiliza dados completos do usuário no objeto session.
     */
    async session({ session, token }) {
      const authSession = session as any;
      authSession.user.role = (token as any).role;
      authSession.user.userType = (token as any).userType;
      authSession.user.companyId = (token as any).companyId;
      authSession.user.tenantContext = (token as any).tenantContext;
      return authSession;
    },
  },
  
  secret: process.env.NEXTAUTH_SECRET || 'fallback-secret-for-development-only',
  
  debug: process.env.NODE_ENV === 'development',
};

/**
 * Utilitário para obter a sessão tipada
 */
export async function getAuthSession() {
  const { getServerSession } = await import("next-auth");
  return getServerSession(authOptions) as Promise<{
    user: AuthUser;
  } | null>;
}

/**
 * Hook para verificar permissões no servidor
 */
export async function requireAuth() {
  const session = await getAuthSession();
  if (!session?.user) {
    throw new Error("Authentication required");
  }
  return session.user;
}

/**
 * Hook para verificar permissões específicas
 */
export async function requirePermission(permission: string) {
  const user = await requireAuth();
  const { hasPermission } = await import("@/lib/permissions");
  
  if (!hasPermission(user.tenantContext, permission)) {
    throw new Error(`Permission denied: ${permission}`);
  }
  
  return user;
}

/**
 * Hook para verificar acesso à company
 */
export async function requireCompanyAccess(companyId: string) {
  const user = await requireAuth();
  const { canAccessCompany } = await import("@/lib/permissions");
  
  if (!canAccessCompany(user.tenantContext, companyId)) {
    throw new Error(`Access denied to company: ${companyId}`);
  }
  
  return user;
}
