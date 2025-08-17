// src/lib/auth.ts
import type { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { dbConnect } from "@/lib/db";
import User from "@/models/User";

/**
 * Configuração do NextAuth (v4) com provider de credenciais.
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
       * Autenticação via e-mail/senha no MongoDB.
       * Retorne `null` para falha, ou um objeto com id/name/email/role/companyId para sucesso.
       */
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials.password) return null;

          await dbConnect();

          const doc = await User.findOne({
            email: credentials.email.toLowerCase(),
          }).lean();

          if (!doc) return null;

          const ok = await bcrypt.compare(
            credentials.password,
            (doc as any).passwordHash
          );
          if (!ok) return null;

          return {
            id: String((doc as any)._id),
            name: (doc as any).name,
            email: (doc as any).email,
            role: (doc as any).role,
            companyId: (doc as any).companyId
              ? String((doc as any).companyId)
              : undefined,
          } as any;
        } catch {
          // Nunca vaze detalhes de erro na authorize
          return null;
        }
      },
    }),
  ],

  // JWT para sessões (App Router)
  session: { strategy: "jwt" },

  // Página de login customizada
  pages: { signIn: "/login" },

  callbacks: {
    /**
     * Injeta role e companyId no token JWT quando o usuário faz login.
     */
    async jwt({ token, user }) {
      if (user) {
        (token as any).role = (user as any).role;
        (token as any).companyId = (user as any).companyId;
      }
      return token;
    },

    /**
     * Disponibiliza role e companyId no objeto session no client/server.
     */
    async session({ session, token }) {
      (session.user as any).role = (token as any).role;
      (session.user as any).companyId = (token as any).companyId;
      return session;
    },
  },
};
