// src/app/api/auth/create-test-user/route.ts
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { dbConnect } from '@/lib/db';
import User from '@/models/User';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    // Se não houver body, criar usuário admin padrão
    let userData;
    try {
      userData = await request.json();
    } catch {
      userData = null;
    }

    if (userData) {
      // Criar usuário personalizado com dados do body
      const { name, email, role, password } = userData;

      // Verificar se já existe
      const existing = await User.findOne({ email });
      if (existing) {
        return NextResponse.json({
          error: `Usuário com email ${email} já existe`
        }, { status: 400 });
      }

      // Hash da senha
      const passwordHash = await bcrypt.hash(password, 12);

      // Criar usuário
      const newUser = await User.create({
        name,
        email,
        passwordHash,
        role,
        userType: role === 'owner_saas' ? 'owner_saas' : (role === 'logista' ? 'lojista' : 'cliente'),
        isActive: true,
        createdAt: new Date(),
      });

      console.log('[CREATE-TEST-USER] Created custom user:', newUser._id);

      return NextResponse.json({
        success: true,
        message: 'Usuário de teste criado com sucesso',
        user: {
          id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
          userType: newUser.userType
        }
      });
    } else {
      // Criar usuário admin padrão
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
        userType: 'owner_saas', // Adicionar userType obrigatório
        isActive: true,
        createdAt: new Date(),
      });

      console.log('[CREATE-TEST-USER] Created default admin:', testUser._id);

      return NextResponse.json({
        message: 'Test user created successfully',
        userId: testUser._id,
        email: testEmail,
        password: testPassword,
        role: 'owner_saas'
      });
    }

  } catch (error) {
    console.error('[CREATE-TEST-USER] Error:', error);
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
