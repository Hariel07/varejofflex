import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Company from "@/models/Company";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { ApiError, assert, errorResponse } from "@/utils/errors";
import { onlyDigits, isValidCPF, isValidCNPJ, isValidEmail } from "@/utils/validators";
import { logger } from "@/utils/logger";
import { createTenantContext, ROLE_PERMISSIONS } from "@/lib/permissions";

// Tipos de cadastro suportados
type RegisterMode = "owner_saas" | "admin_company" | "lojista";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const body = await req.json();

    const mode: RegisterMode = body?.mode;
    assert(mode === "owner_saas" || mode === "admin_company" || mode === "lojista", "Modo inválido");

    // Validar usuário
    const user = body?.user;
    assert(user?.name && typeof user.name === "string", "Nome do usuário é obrigatório");
    assert(isValidEmail(user?.email), "E-mail inválido");
    assert(user?.password && user.password.length >= 6, "Senha deve ter pelo menos 6 caracteres");

    // OWNER DO SAAS (único)
    if (mode === "owner_saas") {
      // Validar chave secreta
      const secretKey = body?.secretKey;
      if (secretKey !== "VAREJOFLEX_OWNER_2025") {
        throw new ApiError("E_FORBIDDEN", "Chave secreta inválida", 403);
      }

      const existsOwner = await User.exists({ role: "owner_saas" });
      if (existsOwner) {
        throw new ApiError("E_CONFLICT", "Já existe um Owner do SaaS cadastrado", 409);
      }
      const existsEmail = await User.exists({ email: user.email.toLowerCase() });
      if (existsEmail) throw new ApiError("E_CONFLICT", "E-mail já cadastrado", 409);

      const passwordHash = await bcrypt.hash(user.password, 10);
      const permissions = ROLE_PERMISSIONS["owner_saas"];
      
      const created = await User.create({
        name: user.name,
        email: user.email.toLowerCase(),
        passwordHash,
        role: "owner_saas",
        userType: "owner_saas",
        permissions,
        isActive: true,
      });

      logger.info(`Owner SaaS created: ${user.email}`);
      return NextResponse.json({ 
        ok: true, 
        userId: String(created._id), 
        role: "owner_saas",
        userType: "owner_saas"
      }, { status: 201 });
    }

    // LOJISTA (novo fluxo)
    if (mode === "lojista") {
      const company = body?.company;
      const segment = body?.segment;
      
      assert(segment, "Segmento é obrigatório");
      assert(["lanchonete", "pizzaria", "moda", "mercado", "petshop", "salao", "farmacia", "conveniencia"].includes(segment), "Segmento inválido");
      assert(company?.name, "Nome da empresa é obrigatório");
      assert(company?.documentType === "CPF" || company?.documentType === "CNPJ", "Tipo de documento inválido");
      assert(company?.email && isValidEmail(company.email), "E-mail da empresa é obrigatório");
      assert(company?.phone, "Telefone da empresa é obrigatório");

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

      // Criação da empresa
      const createdCompany = await Company.create({
        name: company.name,
        personType: company.documentType === "CPF" ? "PF" : "PJ",
        documentType: company.documentType,
        documentNumber: doc,
        email: company.email,
        phone: company.phone,
        address: company?.address ?? {},
        segment: segment,
        isActive: true,
        planType: "free",
        settings: {},
      });

      // Criação do usuário lojista
      const passwordHash = await bcrypt.hash(user.password, 10);
      const permissions = ROLE_PERMISSIONS["admin_company"];
      
      const createdUser = await User.create({
        name: user.name,
        email: user.email.toLowerCase(),
        passwordHash,
        role: "admin_company",
        userType: "lojista",
        companyId: createdCompany._id,
        permissions,
        segment: segment,
        isActive: true,
      });

      logger.info(`Lojista created: ${user.email} - Segment: ${segment} - Company: ${company.name}`);
      return NextResponse.json({
        ok: true,
        tenantId: String(createdCompany._id),
        userId: String(createdUser._id),
        role: "admin_company",
        userType: "lojista",
        segment: segment,
        companyName: company.name
      }, { status: 201 });
    }

    // ADMIN DE EMPRESA (fluxo legado mantido para compatibilidade)
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

      // Criação da empresa (sem segmento definido)
      const createdCompany = await Company.create({
        name: company.name,
        personType: company.documentType === "CPF" ? "PF" : "PJ",
        documentType: company.documentType,
        documentNumber: doc,
        email: company?.email,
        phone: company?.phone,
        address: company?.address ?? {},
        segment: "lanchonete", // Padrão para compatibilidade
        isActive: true,
        planType: "free",
      });

      const passwordHash = await bcrypt.hash(user.password, 10);
      const permissions = ROLE_PERMISSIONS["admin_company"];
      
      const createdUser = await User.create({
        name: user.name,
        email: user.email.toLowerCase(),
        passwordHash,
        role: "admin_company",
        userType: "lojista",
        companyId: createdCompany._id,
        permissions,
        isActive: true,
      });

      logger.info(`Admin company created (legacy): ${user.email}`);
      return NextResponse.json(
        { 
          ok: true, 
          tenantId: String(createdCompany._id), 
          userId: String(createdUser._id), 
          role: "admin_company",
          userType: "lojista"
        },
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
