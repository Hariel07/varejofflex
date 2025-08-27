import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { dbConnect } from '@/lib/db';
import User from '@/models/User';

export async function POST() {
  try {
    await dbConnect();

    const email = 'hariel1996.hs@gmail.com';
    const password = 'minhasenha123';

    // Verificar se já existe
    let user = await User.findOne({ email });
    
    if (user) {
      return NextResponse.json({
        success: true,
        message: 'Usuário já existe',
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          userType: user.userType
        }
      });
    }

    // Criar usuário
    const passwordHash = await bcrypt.hash(password, 12);
    user = await User.create({
      name: 'Hariel Soares Maran',
      email,
      passwordHash,
      role: 'owner_saas',
      userType: 'owner_saas',
      isActive: true,
      permissions: ['*'],
      createdAt: new Date(),
    });

    // Testar se o hash funcionou
    const testMatch = await bcrypt.compare(password, user.passwordHash);

    return NextResponse.json({
      success: true,
      message: 'Usuário owner criado com sucesso!',
      testMatch,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        userType: user.userType
      },
      credentials: {
        email,
        password
      }
    });

  } catch (error) {
    console.error('[CREATE-OWNER] Error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido'
    }, { status: 500 });
  }
}