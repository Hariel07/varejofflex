// src/app/api/auth-test/route.ts
import { NextResponse } from 'next/server';
import NextAuth from "next-auth";

export async function GET() {
  try {
    console.log('[AUTH-TEST] Testing NextAuth import');
    
    const testConfig = {
      providers: [],
      secret: process.env.NEXTAUTH_SECRET,
      debug: true,
    };
    
    console.log('[AUTH-TEST] Creating test handler');
    const testHandler = NextAuth(testConfig);
    
    return NextResponse.json({
      status: 'success',
      nextAuthImported: !!NextAuth,
      secretConfigured: !!process.env.NEXTAUTH_SECRET,
      handlerCreated: !!testHandler,
    });
  } catch (error) {
    console.error('[AUTH-TEST] Error:', error);
    return NextResponse.json({
      status: 'error',
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
    }, { status: 500 });
  }
}