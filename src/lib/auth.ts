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
        const timestamp = new Date().toISOString();
        try {
          console.log(`[AUTH-${timestamp}] 🔍 Starting authorization for:`, credentials?.email);
          
          if (!credentials?.email || !credentials.password) {
            console.log(`[AUTH-${timestamp}] ❌ Missing credentials - email: ${!!credentials?.email}, password: ${!!credentials?.password}`);
            return null;
          }

          console.log(`[AUTH-${timestamp}] 🔌 Attempting database connection...`);
          await dbConnect();
          console.log(`[AUTH-${timestamp}] ✅ Database connected successfully`);

          // Busca o usuário e popula a company se existir
          console.log(`[AUTH-${timestamp}] 🔍 Searching for user: ${credentials.email.toLowerCase()}`);
          const userDoc = await User.findOne({
            email: credentials.email.toLowerCase(),
            isActive: true,
          }).populate('companyId').lean();

          const userExists = !!userDoc;
          console.log(`[AUTH-${timestamp}] 👤 User search result:`, {
            found: userExists,
            id: userExists ? (userDoc as any)?._id?.toString() : null,
            email: userExists ? (userDoc as any)?.email : null,
            role: userExists ? (userDoc as any)?.role : null,
            userType: userExists ? (userDoc as any)?.userType : null,
            isActive: userExists ? (userDoc as any)?.isActive : null,
            hasCompany: userExists ? !!(userDoc as any)?.companyId : null
          });
          
          if (!userDoc) {
            console.log(`[AUTH-${timestamp}] ❌ User not found in database or inactive`);
            return null;
          }

          console.log(`[AUTH-${timestamp}] 🔐 Comparing password hash...`);
          const passwordMatch = await bcrypt.compare(
            credentials.password,
            (userDoc as any).passwordHash
          );
          
          console.log(`[AUTH-${timestamp}] 🔐 Password comparison result:`, passwordMatch);
          if (!passwordMatch) {
            console.log(`[AUTH-${timestamp}] ❌ Password mismatch for user: ${credentials.email}`);
            return null;
          }

          console.log(`[AUTH-${timestamp}] ✅ Authentication successful, creating user object`);
          
          // Determinar userType
          const role = (userDoc as any).role;
          const userType = (userDoc as any).userType || (role === 'owner_saas' ? 'owner_saas' : 'lojista');
          
          // Retorna o objeto de usuário simples (inclui userType e companyId para o middleware via JWT)
          const authUser = {
            id: String((userDoc as any)._id),
            name: (userDoc as any).name,
            email: (userDoc as any).email,
            role: role,
            userType: userType,
            companyId: (userDoc as any).companyId?._id?.toString(),
          };
          
          console.log(`[AUTH-${timestamp}] 🎯 Returning authenticated user:`, {
            id: authUser.id,
            email: authUser.email,
            role: authUser.role,
            userType: authUser.userType,
            hasCompanyId: !!authUser.companyId
          });
          
          return authUser;
        } catch (error) {
          console.error(`[AUTH-${timestamp}] 💥 Critical authorization error:`, {
            error: error instanceof Error ? error.message : String(error),
            stack: error instanceof Error ? error.stack : undefined,
            email: credentials?.email
          });
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
      const timestamp = new Date().toISOString();
      console.log(`[JWT-${timestamp}] 🔄 Processing JWT...`);
      
      if (user) {
        const authUser = user as any;
        console.log(`[JWT-${timestamp}] 👤 User login detected:`, {
          id: authUser.id,
          role: authUser.role,
          userType: authUser.userType,
          hasCompanyId: !!authUser.companyId
        });
        
        token.role = authUser.role;
        token.id = authUser.id;
        token.userType = authUser.userType || (authUser.role === 'owner_saas' ? 'owner_saas' : 'lojista');
        if (authUser.companyId) token.companyId = authUser.companyId;
        
        console.log(`[JWT-${timestamp}] 🔑 Token enriched:`, {
          id: token.id,
          role: token.role,
          userType: token.userType,
          hasCompanyId: !!token.companyId
        });
      } else {
        console.log(`[JWT-${timestamp}] 🔄 Existing token reuse:`, {
          id: token.id,
          role: token.role,
          userType: token.userType,
          hasCompanyId: !!token.companyId
        });
      }
      return token;
    },

    async session({ session, token }) {
      const timestamp = new Date().toISOString();
      console.log(`[SESSION-${timestamp}] 🔄 Creating session...`);
      
      if (session.user && token) {
        const userId = (token as any).sub || (token as any).id;
        const role = (token as any).role as Role;
        const userType: UserType = (token as any).userType || (role === 'owner_saas' ? 'owner_saas' : 'lojista');
        
        console.log(`[SESSION-${timestamp}] 📋 Token data:`, {
          userId,
          role,
          userType,
          hasCompanyId: !!(token as any).companyId
        });
        
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
          console.log(`[SESSION-${timestamp}] 🔌 Connecting to database for full user data...`);
          await dbConnect();
          
          console.log(`[SESSION-${timestamp}] 🔍 Fetching user document: ${userId}`);
          const userDoc = await User.findById(userId).populate('companyId').lean();
          
          if (userDoc) {
            baseUser.name = (userDoc as any).name;
            baseUser.email = (userDoc as any).email;
            baseUser.companyId = (userDoc as any).companyId?._id?.toString();
            
            console.log(`[SESSION-${timestamp}] 👤 User document found:`, {
              name: baseUser.name,
              email: baseUser.email,
              hasCompanyId: !!baseUser.companyId
            });
            
            const tenantContext = createTenantContext(
              role,
              userType,
              baseUser.companyId
            );
            baseUser.tenantContext = tenantContext;
            
            console.log(`[SESSION-${timestamp}] 🏢 Tenant context created:`, {
              tenantType: tenantContext.tenantType,
              userType: tenantContext.userType,
              permissionsCount: tenantContext.permissions.length
            });
          } else {
            console.log(`[SESSION-${timestamp}] ⚠️ User document not found for ID: ${userId}`);
          }
        } catch (error) {
          console.error(`[SESSION-${timestamp}] ❌ Error creating session context:`, {
            error: error instanceof Error ? error.message : String(error),
            userId
          });
        }
        
        // Garantir tenantContext mínimo se não criado
        if (!baseUser.tenantContext) {
          console.log(`[SESSION-${timestamp}] 🔧 Creating fallback tenant context...`);
          baseUser.tenantContext = createTenantContext(role, userType, baseUser.companyId);
        }
        
        (session.user as any) = baseUser;
        
        console.log(`[SESSION-${timestamp}] ✅ Final session user:`, {
          id: baseUser.id,
          role: baseUser.role,
          userType: baseUser.userType,
          hasTenantContext: !!baseUser.tenantContext
        });
      } else {
        console.log(`[SESSION-${timestamp}] ⚠️ No session.user or token found`);
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
