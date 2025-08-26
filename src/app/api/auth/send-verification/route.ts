import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import VerificationCode from "@/models/VerificationCode";

// Função para gerar código de 6 dígitos
function generateCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Função para enviar email (simulado por enquanto)
async function sendEmailCode(email: string, code: string, name: string) {
  // Por enquanto vou apenas logar o código
  // Mais tarde implementaremos o envio real via SMTP
  console.log(`📧 Código de verificação por email para ${email}: ${code}`);
  
  // Simular envio bem-sucedido
  return { success: true, message: "Email enviado com sucesso" };
}

// Função para enviar WhatsApp (simulado por enquanto)
async function sendWhatsAppCode(phone: string, code: string, name: string) {
  // Por enquanto vou apenas logar o código
  // Mais tarde implementaremos via API do WhatsApp Business
  console.log(`📱 Código de verificação por WhatsApp para ${phone}: ${code}`);
  
  // Simular envio bem-sucedido
  return { success: true, message: "WhatsApp enviado com sucesso" };
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const {
      email,
      phone,
      nome,
      empresa,
      cpfCnpj,
      endereco,
      cidade,
      estado,
      planId,
      billingCycle,
      tenantId = "varejoflex"
    } = data;

    // Validações básicas
    if (!email || !phone || !nome) {
      return NextResponse.json({
        success: false,
        error: "Email, telefone e nome são obrigatórios"
      }, { status: 400 });
    }

    await dbConnect();

    // Verificar se já existe uma verificação pendente
    const existingVerification = await VerificationCode.findOne({
      email,
      tenantId,
      status: "pending",
      expiresAt: { $gt: new Date() }
    });

    if (existingVerification) {
      return NextResponse.json({
        success: false,
        error: "Já existe uma verificação pendente. Aguarde antes de solicitar nova."
      }, { status: 400 });
    }

    // Gerar códigos
    const emailCode = generateCode();
    const whatsappCode = generateCode();

    // Criar nova verificação
    const verification = new VerificationCode({
      tenantId,
      email,
      phone,
      emailCode,
      whatsappCode,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutos
      userData: {
        nome,
        empresa,
        cpfCnpj,
        endereco,
        cidade,
        estado,
        planId,
        billingCycle
      }
    });

    await verification.save();

    // Enviar códigos
    const emailResult = await sendEmailCode(email, emailCode, nome);
    const whatsappResult = await sendWhatsAppCode(phone, whatsappCode, nome);

    return NextResponse.json({
      success: true,
      message: "Códigos de verificação enviados",
      verificationId: verification._id,
      emailSent: emailResult.success,
      whatsappSent: whatsappResult.success
    });

  } catch (error: any) {
    console.error("Erro ao enviar códigos de verificação:", error);
    return NextResponse.json({
      success: false,
      error: "Erro interno do servidor"
    }, { status: 500 });
  }
}