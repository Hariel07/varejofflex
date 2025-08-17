import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Company from "@/models/Company";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { ApiError, assert, errorResponse } from "@/utils/errors";
import { onlyDigits, isValidCPF, isValidCNPJ, isValidEmail } from "@/utils/validators";
import { logger } from "@/utils/logger";

// Tipos de cadastro suportados
type RegisterMode = "owner_saas" | "admin_company";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const body = await req.json();

    const mode: RegisterMode = body?.mode;
    assert(mode === "owner_saas" || mode === "admin_company", "Modo inválido");

    // Validar usuário
    const user = body?.user;
    assert(user?.name && typeof user.name === "string", "Nome do usuário é obrigatório");
    assert(isValidEmail(user?.email), "E-mail inválido");
    assert(user?.password && user.password.length >= 6, "Senha deve ter pelo menos 6 caracteres");

    // OWNER DO SAAS (único)
    if (mode === "owner_saas") {
      const existsOwner = await User.exists({ role: "owner_saas" });
      if (existsOwner) {
        throw new ApiError("E_CONFLICT", "Já existe um Owner do SaaS cadastrado", 409);
      }
      const existsEmail = await User.exists({ email: user.email.toLowerCase() });
      if (existsEmail) throw new ApiError("E_CONFLICT", "E-mail já cadastrado", 409);

      const passwordHash = await bcrypt.hash(user.password, 10);
      const created = await User.create({
        name: user.name,
        email: user.email.toLowerCase(),
        passwordHash,
        role: "owner_saas",
      });

      return NextResponse.json({ ok: true, userId: String(created._id), role: "owner_saas" }, { status: 201 });
    }

    // ADMIN DE EMPRESA (lojista)
    if (mode === "admin_company") {
      const company = body?.company;
      assert(company?.name, "Nome da empresa é obrigatório");
      assert(company?.documentType === "CPF" || company?.documentType === "CNPJ", "Tipo de documento inválido");

      const doc = onlyDigits(company?.documentNumber || "");
      assert(doc, "Documento é obrigatório");

      if (company.documentType === "CPF") {
        assert(isValidCPF(doc), "CPF inválido");
      } else {
        assert(isValidCNPJ(doc), "CNPJ inválido");
      }

      // Conflitos
      const existingCompany = await Company.findOne({ documentNumber: doc }).lean();
      if (existingCompany) throw new ApiError("E_CONFLICT", "Documento já cadastrado", 409);

      const existsEmail = await User.exists({ email: user.email.toLowerCase() });
      if (existsEmail) throw new ApiError("E_CONFLICT", "E-mail já cadastrado", 409);

      // Criação transacional (simples)
      const createdCompany = await Company.create({
        name: company.name,
        personType: company.documentType === "CPF" ? "PF" : "PJ",
        documentType: company.documentType,
        documentNumber: doc,
        email: company?.email,
        phone: company?.phone,
        address: company?.address ?? {},
      });

      const passwordHash = await bcrypt.hash(user.password, 10);
      const createdUser = await User.create({
        name: user.name,
        email: user.email.toLowerCase(),
        passwordHash,
        role: "admin_company",
        companyId: createdCompany._id,
      });

      return NextResponse.json(
        { ok: true, tenantId: String(createdCompany._id), userId: String(createdUser._id), role: "admin_company" },
        { status: 201 }
      );
    }

    throw new ApiError("E_VALIDATION", "Modo não suportado", 422);
  } catch (err) {
    // log completo no server
    logger.error("POST /api/auth/register failed:", err);
    return errorResponse(err);
  }
}
