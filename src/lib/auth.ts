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
      async authorize(credentials) {
        try {
          console.log('[AUTH] Starting authorization for:', credentials?.email);
          
          if (!credentials?.email || !credentials.password) {
            console.log('[AUTH] Missing credentials');
            return null;
          }

          await dbConnect();
          console.log('[AUTH] Connected to database');

          // Busca o usuário e popula a company se existir
          const userDoc = await User.findOne({
            email: credentials.email.toLowerCase(),
            isActive: true,
          }).populate('companyId').lean();

          console.log('[AUTH] User search result:', !!userDoc, userDoc ? { 
            id: (userDoc as any)?._id?.toString(), 
            email: (userDoc as any)?.email, 
            role: (userDoc as any)?.role 
          } : null);
          
          if (!userDoc) {
            console.log('[AUTH] User not found in database');
            return null;
          }

          const ok = await bcrypt.compare(
            credentials.password,
            (userDoc as any).passwordHash
          );
          
          console.log('[AUTH] Password comparison result:', ok);
          if (!ok) {
            console.log('[AUTH] Password mismatch');
            return null;
          }

          console.log('[AUTH] Authentication successful, creating user object');
          
          // Retorna o objeto de usuário simples (inclui userType e companyId para o middleware via JWT)
          const authUser = {
            id: String((userDoc as any)._id),
            name: (userDoc as any).name,
            email: (userDoc as any).email,
            role: (userDoc as any).role,
            userType: (userDoc as any).userType || ((userDoc as any).role === 'owner_saas' ? 'owner_saas' : 'lojista'),
            companyId: (userDoc as any).companyId?._id?.toString(),
          };
          
          console.log('[AUTH] Returning user:', authUser);
          return authUser;
        } catch (error) {
          console.error("[AUTH] Authorization error:", error);
          return null;
        }
      },
    }),
  ],

  session: { 
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 horas
  },

  pages: { 
    signIn: "/login",
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const authUser = user as any;
        token.role = authUser.role;
        token.id = authUser.id;
        token.userType = authUser.userType || (authUser.role === 'owner_saas' ? 'owner_saas' : 'lojista');
        if (authUser.companyId) token.companyId = authUser.companyId;
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user && token) {
        const userId = (token as any).sub || (token as any).id;
        const role = (token as any).role as Role;
        const userType: UserType = (token as any).userType || (role === 'owner_saas' ? 'owner_saas' : 'lojista');
        const baseUser: any = {
          id: userId,
          role,
          userType,
        };
  // Define campos mínimos imediatamente para evitar condições de corrida no cliente
  (session.user as any).id = userId;
  (session.user as any).role = role;
  (session.user as any).userType = userType;
        try {
          await dbConnect();
          const userDoc = await User.findById(userId).populate('companyId').lean();
          if (userDoc) {
            baseUser.name = (userDoc as any).name;
            baseUser.email = (userDoc as any).email;
            baseUser.companyId = (userDoc as any).companyId?._id?.toString();
            const tenantContext = createTenantContext(
              role,
              userType,
              baseUser.companyId
            );
            baseUser.tenantContext = tenantContext;
            console.log('[AUTH] Session created with userType:', userType, 'role:', role);
          }
        } catch (error) {
          console.error('[AUTH] Error creating session context:', error);
        }
        // Garantir tenantContext mínimo se não criado
        if (!baseUser.tenantContext) {
          baseUser.tenantContext = createTenantContext(role, userType, baseUser.companyId);
        }
        (session.user as any) = baseUser;
      }
      return session;
    },
  },
  
  secret: process.env.NEXTAUTH_SECRET || 'fallback-secret-for-development-only',
  
  debug: true, // Ativar debug para ver logs
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
