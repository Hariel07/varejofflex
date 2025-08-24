// src/app/api/platform/owner-status/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { dbConnect } from "@/lib/db";
import User from "@/models/User";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ 
        isOwner: false, 
        error: "Não autorizado" 
      }, { status: 401 });
    }

    await dbConnect();
    
    // Verificar se o usuário logado é owner
    const user = await User.findOne({ email: session.user.email });
    
    if (!user) {
      return NextResponse.json({ 
        isOwner: false, 
        error: "Usuário não encontrado" 
      }, { status: 404 });
    }

    const isOwner = user.role === 'owner' || user.role === 'owner_saas';
    
    return NextResponse.json({ 
      isOwner,
      userRole: user.role,
      email: user.email
    });
  } catch (e) {
    console.error('Erro ao verificar status de owner:', e);
    return NextResponse.json({ 
      isOwner: false, 
      error: "Erro interno" 
    }, { status: 500 });
  }
}
