import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import VerificationCode from "@/models/VerificationCode";

export async function POST(req: NextRequest) {
  try {
    const { verificationId, emailCode, whatsappCode } = await req.json();

    if (!verificationId || (!emailCode && !whatsappCode)) {
      return NextResponse.json({
        success: false,
        error: "ID de verificação e pelo menos um código são obrigatórios"
      }, { status: 400 });
    }

    await dbConnect();

    const verification = await VerificationCode.findById(verificationId);

    if (!verification) {
      return NextResponse.json({
        success: false,
        error: "Verificação não encontrada"
      }, { status: 404 });
    }

    // Verificar se não expirou
    if (verification.expiresAt < new Date()) {
      verification.status = "expired";
      await verification.save();
      
      return NextResponse.json({
        success: false,
        error: "Códigos de verificação expiraram"
      }, { status: 400 });
    }

    // Verificar se não foi bloqueado por muitas tentativas
    if (verification.attempts >= verification.maxAttempts) {
      verification.status = "blocked";
      await verification.save();
      
      return NextResponse.json({
        success: false,
        error: "Muitas tentativas incorretas. Solicite novos códigos."
      }, { status: 400 });
    }

    let emailValid = false;
    let whatsappValid = false;

    // Verificar código do email
    if (emailCode) {
      emailValid = emailCode === verification.emailCode;
      if (emailValid) {
        verification.emailVerified = true;
      }
    }

    // Verificar código do WhatsApp
    if (whatsappCode) {
      whatsappValid = whatsappCode === verification.whatsappCode;
      if (whatsappValid) {
        verification.whatsappVerified = true;
      }
    }

    // Se pelo menos um código foi verificado incorretamente, incrementar tentativas
    if ((emailCode && !emailValid) || (whatsappCode && !whatsappValid)) {
      verification.attempts += 1;
      await verification.save();
      
      return NextResponse.json({
        success: false,
        error: `Código(s) incorreto(s). Tentativas restantes: ${verification.maxAttempts - verification.attempts}`,
        attemptsLeft: verification.maxAttempts - verification.attempts
      }, { status: 400 });
    }

    // Verificar se ambos os códigos foram verificados
    const allVerified = verification.emailVerified && verification.whatsappVerified;
    
    if (allVerified) {
      verification.status = "verified";
    }

    await verification.save();

    return NextResponse.json({
      success: true,
      message: allVerified ? "Verificação completa!" : "Códigos parcialmente verificados",
      emailVerified: verification.emailVerified,
      whatsappVerified: verification.whatsappVerified,
      allVerified,
      userData: verification.userData
    });

  } catch (error: any) {
    console.error("Erro ao verificar códigos:", error);
    return NextResponse.json({
      success: false,
      error: "Erro interno do servidor"
    }, { status: 500 });
  }
}