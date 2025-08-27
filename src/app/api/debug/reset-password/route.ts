import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { dbConnect } from '@/lib/db';
import User from '@/models/User';

export async function POST(request: NextRequest) {
  try {
    const { email, newPassword } = await request.json();
    
    if (!email || !newPassword) {
      return NextResponse.json({
        success: false,
        error: 'Email e nova senha são obrigatórios'
      }, { status: 400 });
    }

    await dbConnect();

    // Buscar usuário
    const user = await User.findOne({ email: email.toLowerCase() });
    
    if (!user) {
      return NextResponse.json({
        success: false,
        error: 'Usuário não encontrado'
      });
    }

    // Gerar novo hash
    const newPasswordHash = await bcrypt.hash(newPassword, 12);
    
    // Atualizar usuário
    await User.findByIdAndUpdate(user._id, {
      passwordHash: newPasswordHash
    });

    // Testar novo hash
    const testMatch = await bcrypt.compare(newPassword, newPasswordHash);

    return NextResponse.json({
      success: true,
      message: 'Senha atualizada com sucesso',
      testMatch,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        userType: user.userType
      }
    });

  } catch (error) {
    console.error('[RESET-PASSWORD] Error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido'
    }, { status: 500 });
  }
}