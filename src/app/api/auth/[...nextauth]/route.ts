// src/app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

console.log('[NEXTAUTH] Initializing NextAuth handler');

const handler = NextAuth(authOptions);

console.log('[NEXTAUTH] Handler created successfully');

export { handler as GET, handler as POST };