// src/app/api/auth/test-signin/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { signIn } from 'next-auth/react';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('[TEST-SIGNIN] Received:', body);
    
    const { email, password } = body;
    
    // Teste direto da função authorize
    const { authOptions } = await import('@/lib/auth');
    const credentialsProvider = authOptions.providers?.[0] as any;
    
    if (credentialsProvider?.authorize) {
      const result = await credentialsProvider.authorize({
        email,
        password
      });
      
      console.log('[TEST-SIGNIN] Authorize result:', !!result);
      
      return NextResponse.json({
        success: !!result,
        user: result ? { id: result.id, email: result.email, role: result.role } : null
      });
    }
    
    return NextResponse.json({ error: 'No credentials provider found' }, { status: 400 });
  } catch (error) {
    console.error('[TEST-SIGNIN] Error:', error);
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}