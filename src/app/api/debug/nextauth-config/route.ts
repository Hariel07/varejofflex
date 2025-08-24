// src/app/api/debug/nextauth-config/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Teste das importações
    const authImport = await import('@/lib/auth');
    const nextAuthImport = await import('next-auth');
    
    const config = {
      timestamp: new Date().toISOString(),
      environment: {
        nodeEnv: process.env.NODE_ENV,
        nextAuthSecret: !!process.env.NEXTAUTH_SECRET,
        nextAuthUrl: process.env.NEXTAUTH_URL,
      },
      imports: {
        authOptionsExists: !!authImport.authOptions,
        nextAuthExists: !!nextAuthImport.default,
      },
      authOptions: {
        hasProviders: !!authImport.authOptions.providers?.length,
        providersCount: authImport.authOptions.providers?.length || 0,
        hasSecret: !!authImport.authOptions.secret,
        hasCallbacks: !!authImport.authOptions.callbacks,
        sessionStrategy: authImport.authOptions.session?.strategy,
        debug: authImport.authOptions.debug,
        handlerCreated: false,
        handlerError: null as string | null,
      }
    };

    // Teste se consegue criar um handler NextAuth
    try {
      const handler = nextAuthImport.default(authImport.authOptions);
      config.authOptions.handlerCreated = !!handler;
    } catch (error) {
      config.authOptions.handlerError = error instanceof Error ? error.message : 'Unknown error';
    }

    return NextResponse.json(config);
  } catch (error) {
    console.error('[DEBUG] NextAuth config error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to debug NextAuth config',
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}
