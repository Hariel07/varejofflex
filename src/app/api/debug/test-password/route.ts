// src/app/api/debug/test-password/route.ts
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

export async function GET() {
  try {
    const password = 'Thmpv1996@';
    const hash = '$2b$10$fzDPzgE834qpWtKoB7tbHewhIFi/RYdYEuxF2nu54OcS08lsasOme';
    
    console.log('[PASSWORD-TEST] Testing password:', password);
    console.log('[PASSWORD-TEST] Against hash:', hash);
    
    const isMatch = await bcrypt.compare(password, hash);
    
    console.log('[PASSWORD-TEST] Result:', isMatch);
    
    // Teste adicional: criar novo hash da mesma senha
    const newHash = await bcrypt.hash(password, 10);
    console.log('[PASSWORD-TEST] New hash for same password:', newHash);
    
    const newHashMatch = await bcrypt.compare(password, newHash);
    console.log('[PASSWORD-TEST] New hash matches:', newHashMatch);
    
    return NextResponse.json({
      password,
      originalHash: hash,
      matches: isMatch,
      newHash,
      newHashMatches: newHashMatch
    });
    
  } catch (error) {
    console.error('[PASSWORD-TEST] Error:', error);
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}