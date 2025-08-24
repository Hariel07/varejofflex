import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const token = await getToken({ 
      req: request,
      secret: process.env.NEXTAUTH_SECRET 
    });
    
    return NextResponse.json({
      success: true,
      hasToken: !!token,
      token: token ? {
        sub: token.sub,
        id: (token as any).id,
        role: (token as any).role,
        userType: (token as any).userType,
        companyId: (token as any).companyId,
        exp: token.exp,
        iat: token.iat,
        email: (token as any).email
      } : null,
      url: request.url,
      fullUrl: request.nextUrl.toString(),
      cookies: request.cookies.getAll().map(c => ({ name: c.name, value: c.value.substring(0, 20) + '...' })),
      headers: {
        'user-agent': request.headers.get('user-agent')?.substring(0, 50) + '...',
        'referer': request.headers.get('referer'),
        'host': request.headers.get('host')
      }
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: String(error),
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
}
