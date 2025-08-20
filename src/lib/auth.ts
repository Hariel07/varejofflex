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
            id: userDoc._id, 
            email: userDoc.email, 
            role: userDoc.role 
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
          
          // Retorna o objeto de usuário simples
          const authUser = {
            id: String((userDoc as any)._id),
            name: (userDoc as any).name,
            email: (userDoc as any).email,
            role: (userDoc as any).role,
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
        // Garantir que user tem a propriedade role
        const authUser = user as any;
        token.role = authUser.role;
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.sub;
        (session.user as any).role = token.role;
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
