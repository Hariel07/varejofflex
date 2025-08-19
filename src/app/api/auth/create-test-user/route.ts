// src/app/api/auth/create-test-user/route.ts
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { dbConnect } from '@/lib/db';
import User from '@/models/User';

export async function POST() {
  try {
    await dbConnect();

    const testEmail = 'admin@varejoflex.com';
    const testPassword = '123456';

    // Verifica se já existe
    const existing = await User.findOne({ email: testEmail });
    if (existing) {
      return NextResponse.json({
        message: 'Test user already exists',
        email: testEmail,
        password: testPassword
      });
    }

    // Cria hash da senha
    const passwordHash = await bcrypt.hash(testPassword, 12);

    // Cria usuário de teste
    const testUser = await User.create({
      name: 'Admin Teste',
      email: testEmail,
      passwordHash,
      role: 'owner_saas',
      isActive: true,
      createdAt: new Date(),
    });

    console.log('[CREATE-TEST-USER] Created:', testUser._id);

    return NextResponse.json({
      message: 'Test user created successfully',
      userId: testUser._id,
      email: testEmail,
      password: testPassword,
      role: 'owner_saas'
    });

  } catch (error) {
    console.error('[CREATE-TEST-USER] Error:', error);
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}