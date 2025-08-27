import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { dbConnect } from '@/lib/db';
import User from '@/models/User';

// GET e POST fazem a mesma coisa para facilitar acesso via navegador
async function createOrUpdateOwner() {
  try {
    await dbConnect();

    const email = 'hariel1996.hs@gmail.com';
    const password = 'Thmpv1996@'; // Sua senha real

    console.log(`[CREATE-OWNER] Conectado ao banco. Procurando usuário: ${email}`);

    // Verificar se já existe
    let user = await User.findOne({ email });
    
    if (user) {
      console.log(`[CREATE-OWNER] Usuário encontrado. Atualizando senha...`);
      // Se existe, atualizar a senha para garantir que esteja correta
      const passwordHash = await bcrypt.hash(password, 12);
      await User.findByIdAndUpdate(user._id, { passwordHash });
      
      // Recarregar usuário atualizado
      user = await User.findById(user._id);
      
      // Testar a nova senha
      const testMatch = await bcrypt.compare(password, user.passwordHash);
      
      console.log(`[CREATE-OWNER] Senha atualizada. Teste: ${testMatch}`);
      
      return NextResponse.json({
        success: true,
        message: 'Usuário existe - senha atualizada!',
        testMatch,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          userType: user.userType,
          isActive: user.isActive
        },
        credentials: { email, password }
      });
    }

    console.log(`[CREATE-OWNER] Usuário não encontrado. Criando novo...`);

    // Criar usuário novo
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

    console.log(`[CREATE-OWNER] Usuário criado. ID: ${user._id}`);

    // Testar se o hash funcionou
    const testMatch = await bcrypt.compare(password, user.passwordHash);

    console.log(`[CREATE-OWNER] Teste de senha: ${testMatch}`);

    return NextResponse.json({
      success: true,
      message: 'Usuário owner criado com sucesso!',
      testMatch,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        userType: user.userType,
        isActive: user.isActive
      },
      credentials: { email, password }
    });

  } catch (error) {
    console.error('[CREATE-OWNER] Error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
}

export async function GET() {
  return createOrUpdateOwner();
}

export async function POST() {
  return createOrUpdateOwner();
}