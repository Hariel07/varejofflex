// src/app/api/auth/test-signin/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { signIn } from 'next-auth/react';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('[TEST-SIGNIN] Received request for:', body.email);
    
    const { email, password } = body;
    
    if (!email || !password) {
      console.log('[TEST-SIGNIN] Missing email or password');
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 });
    }
    
    // Teste direto da função authorize
    console.log('[TEST-SIGNIN] Loading authOptions...');
    const { authOptions } = await import('@/lib/auth');
    const credentialsProvider = authOptions.providers?.[0] as any;
    
    if (!credentialsProvider?.authorize) {
      console.log('[TEST-SIGNIN] No authorize function found');
      return NextResponse.json({ error: 'No credentials provider found' }, { status: 400 });
    }
    
    console.log('[TEST-SIGNIN] Calling authorize function...');
    const result = await credentialsProvider.authorize({
      email,
      password
    });
    
    console.log('[TEST-SIGNIN] Authorize function result:', !!result, result ? { id: result.id, email: result.email } : null);
    
    return NextResponse.json({
      success: !!result,
      user: result ? { 
        id: result.id, 
        email: result.email, 
        role: result.role,
        name: result.name 
      } : null,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('[TEST-SIGNIN] Error:', error);
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
}
