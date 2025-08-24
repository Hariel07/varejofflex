// src/app/api/debug/user-session/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    return NextResponse.json({
      success: true,
      session: session,
      user: session?.user || null,
      hasUserType: !!(session?.user as any)?.userType,
      hasTenantContext: !!(session?.user as any)?.tenantContext,
      userType: (session?.user as any)?.userType,
      role: (session?.user as any)?.role,
      tenantContext: (session?.user as any)?.tenantContext,
    });
  } catch (error) {
    console.error("[DEBUG] Error getting session:", error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
