import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { dbConnect } from '@/lib/db';
import User from '@/models/User';
import Company from '@/models/Company'; // Importar o modelo Company

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();
    
    if (!email || !password) {
      return NextResponse.json({ 
        error: 'Email and password required' 
      }, { status: 400 });
    }

    console.log(`[TEST-LOGIN] Testing login for: ${email}`);
    
    await dbConnect();
    console.log(`[TEST-LOGIN] Database connected`);

    // Busca o usuário
    const userDoc = await User.findOne({
      email: email.toLowerCase(),
      isActive: true,
    }).populate('companyId').lean();

    if (!userDoc) {
      console.log(`[TEST-LOGIN] User not found or inactive`);
      return NextResponse.json({
        success: false,
        error: 'User not found or inactive',
        step: 'user_search'
      });
    }

    console.log(`[TEST-LOGIN] User found:`, {
      id: (userDoc as any)._id?.toString(),
      email: (userDoc as any).email,
      role: (userDoc as any).role,
      userType: (userDoc as any).userType,
      isActive: (userDoc as any).isActive,
      hasCompany: !!(userDoc as any).companyId
    });

    // Testa a senha
    console.log(`[TEST-LOGIN] Testing password...`);
    console.log(`[TEST-LOGIN] Input password:`, JSON.stringify(password));
    console.log(`[TEST-LOGIN] Stored hash:`, JSON.stringify((userDoc as any).passwordHash));
    
    const passwordMatch = await bcrypt.compare(
      password,
      (userDoc as any).passwordHash
    );
    
    console.log(`[TEST-LOGIN] Password match result:`, passwordMatch);

    if (!passwordMatch) {
      return NextResponse.json({
        success: false,
        error: 'Invalid password',
        step: 'password_validation',
        details: {
          inputPasswordLength: password.length,
          hashLength: (userDoc as any).passwordHash.length
        }
      });
    }

    // Simula o objeto que seria retornado pelo NextAuth
    const role = (userDoc as any).role;
    const userType = (userDoc as any).userType || (role === 'owner_saas' ? 'owner_saas' : 'lojista');
    
    const authUser = {
      id: String((userDoc as any)._id),
      name: String((userDoc as any).name),
      email: String((userDoc as any).email),
      role: String(role),
      userType: String(userType),
      companyId: (userDoc as any).companyId?._id ? String((userDoc as any).companyId._id) : null,
    };

    console.log(`[TEST-LOGIN] Authentication successful, user object:`, authUser);

    return NextResponse.json({
      success: true,
      message: 'Login test successful',
      user: authUser
    });

  } catch (error) {
    console.error(`[TEST-LOGIN] Error:`, {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    });
    
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}