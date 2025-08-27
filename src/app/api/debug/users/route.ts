import { NextRequest, NextResponse } from "next/server";
import bcrypt from 'bcryptjs';
import { dbConnect } from "@/lib/db";
import User from "@/models/User";

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    // Buscar todos os usuários de teste
    const users = await User.find({
      $or: [
        { email: { $regex: '@teste.com$' } },
        { email: { $regex: '@varejoflex.com$' } },
        { email: 'hariel.developer@gmail.com' }
      ]
    }).select('name email role userType isActive companyId').lean();

    const userList = users.map(user => ({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      userType: user.userType,
      isActive: user.isActive,
      hasCompany: !!user.companyId
    }));

    return NextResponse.json({
      success: true,
      users: userList,
      total: userList.length,
      testCredentials: {
        'hariel.developer@gmail.com': 'minhasenha123',
        'joao.teste@varejoflex.com': 'senha123',
        'maria.teste@varejoflex.com': 'senha123',
        'carlos.teste@varejoflex.com': 'senha123',
        'cliente1.lanchonete@teste.com': 'cliente123'
      }
    });

  } catch (error) {
    console.error('[DEBUG-USERS] Error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();
    
    if (!email || !password) {
      return NextResponse.json({
        success: false,
        error: 'Email e senha são obrigatórios'
      }, { status: 400 });
    }

    await dbConnect();

    // Buscar usuário
    const user = await User.findOne({ email: email.toLowerCase() });
    
    if (!user) {
      return NextResponse.json({
        success: false,
        error: 'Usuário não encontrado',
        details: `Email ${email} não existe no banco`
      });
    }

    // Testar senha
    const passwordMatch = await bcrypt.compare(password, user.passwordHash);
    
    return NextResponse.json({
      success: true,
      passwordMatch,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        userType: user.userType,
        isActive: user.isActive,
        hasCompany: !!user.companyId
      }
    });

  } catch (error) {
    console.error('[DEBUG-USERS-POST] Error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido'
    }, { status: 500 });
  }
}
