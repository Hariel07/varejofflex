import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import VerificationCode from "@/models/VerificationCode";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await dbConnect();
    
    const verification = await VerificationCode.findById(params.id);

    if (!verification) {
      return NextResponse.json({
        success: false,
        error: "Verificação não encontrada"
      }, { status: 404 });
    }

    // Verificar se a verificação está completa e não expirou
    if (verification.status !== 'verified') {
      return NextResponse.json({
        success: false,
        error: "Verificação não completada ou expirada"
      }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      verification: {
        _id: verification._id,
        email: verification.email,
        phone: verification.phone,
        status: verification.status,
        userData: verification.userData,
        emailVerified: verification.emailVerified,
        whatsappVerified: verification.whatsappVerified
      }
    });

  } catch (error: any) {
    console.error("Erro ao buscar verificação:", error);
    return NextResponse.json({
      success: false,
      error: "Erro interno do servidor"
    }, { status: 500 });
  }
}