// src/app/api/debug/nextauth/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const debug = {
      timestamp: new Date().toISOString(),
      nextauth: {
        secret: !!process.env.NEXTAUTH_SECRET,
        secretLength: process.env.NEXTAUTH_SECRET?.length || 0,
        url: process.env.NEXTAUTH_URL,
        nodeEnv: process.env.NODE_ENV,
      },
      imports: {
        nextAuthAvailable: false,
        authOptionsAvailable: false,
      }
    };

    // Teste de importação do NextAuth
    try {
      const NextAuth = await import('next-auth');
      debug.imports.nextAuthAvailable = true;
    } catch (error) {
      console.error('[DEBUG] NextAuth import error:', error);
    }

    // Teste de importação das authOptions
    try {
      const { authOptions } = await import('@/lib/auth');
      debug.imports.authOptionsAvailable = !!authOptions;
    } catch (error) {
      console.error('[DEBUG] authOptions import error:', error);
    }

    return NextResponse.json(debug);
  } catch (error) {
    console.error('[DEBUG] NextAuth debug error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to debug NextAuth',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}