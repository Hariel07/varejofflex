import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { dbConnect } from "@/lib/db";
import ItemBase from "@/models/ItemBase";
import { 
  withTenantApi, 
  createApiResponse, 
  buildTenantFilter,
  addTenantContext
} from "@/lib/api-utils";
import { PERMISSIONS } from "@/lib/permissions";

/**
 * GET /api/itens-base - Lista itens base
 */
export const GET = withTenantApi(async (user, request) => {
  try {
    await dbConnect();
    
    const url = new URL(request.url);
    const categoria = url.searchParams.get('categoria') || '';
    const search = url.searchParams.get('search') || '';
    const controlaEstoque = url.searchParams.get('controlaEstoque');
    
    const filter = buildTenantFilter(user.tenantContext);
    let query: any = { ...filter, ativo: true };
    
    if (categoria && categoria !== 'all') {
      query.categoria = categoria;
    }
    
    if (controlaEstoque !== null) {
      query.controlaEstoque = controlaEstoque === 'true';
    }
    
    if (search) {
      query.$or = [
        { nome: { $regex: search, $options: 'i' } },
        { descricao: { $regex: search, $options: 'i' } },
        { codigo: { $regex: search, $options: 'i' } }
      ];
    }
    
    const itens = await ItemBase.find(query)
      .sort({ categoria: 1, nome: 1 })
      .lean();
    
    return createApiResponse(itens, {
      message: `Found ${itens.length} itens`,
    });
  } catch (error) {
    console.error("GET /api/itens-base error:", error);
    return createApiResponse(null, {
      status: 500,
      error: "FETCH_ERROR",
      message: "Failed to fetch itens",
    });
  }
});

/**
 * POST /api/itens-base - Cria novo item base
 */
export const POST = withTenantApi(async (user, request) => {
  try {
    await dbConnect();
    
    const { hasPermission } = await import("@/lib/permissions");
    if (!hasPermission(user.tenantContext, PERMISSIONS.MANAGE_INVENTORY)) {
      return createApiResponse(null, {
        status: 403,
        error: "PERMISSION_DENIED",
        message: "No permission to create itens",
      });
    }

    const body = await request.json();
    
    // Validações básicas
    if (!body.nome || !body.unidade || !body.categoria) {
      return createApiResponse(null, {
        status: 400,
        error: "VALIDATION_ERROR",
        message: "Nome, unidade e categoria são obrigatórios",
      });
    }

    // Verificar se já existe item com o mesmo nome
    const filter = buildTenantFilter(user.tenantContext);
    const existingItem = await ItemBase.findOne({
      ...filter,
      nome: { $regex: `^${body.nome}$`, $options: 'i' },
      ativo: true
    });
    
    if (existingItem) {
      return createApiResponse(null, {
        status: 409,
        error: "DUPLICATE_NAME",
        message: "Já existe um item com este nome",
      });
    }

    // Verificar código se fornecido
    if (body.codigo) {
      const existingCode = await ItemBase.findOne({
        ...filter,
        codigo: body.codigo,
        ativo: true
      });
      
      if (existingCode) {
        return createApiResponse(null, {
          status: 409,
          error: "DUPLICATE_CODE",
          message: "Já existe um item com este código",
        });
      }
    }
    
    // Adiciona contexto do tenant aos dados
    const itemData = addTenantContext(body, user.tenantContext);
    
    // Cria o item
    const item = await ItemBase.create(itemData);
    
    return createApiResponse(item, {
      status: 201,
      message: "Item criado com sucesso",
    });
  } catch (error) {
    console.error("POST /api/itens-base error:", error);
    return createApiResponse(null, {
      status: 500,
      error: "CREATE_ERROR",
      message: "Failed to create item",
    });
  }
});