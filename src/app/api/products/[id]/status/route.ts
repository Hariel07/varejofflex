import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { dbConnect } from "@/lib/db";
import Product from "@/models/Product";
import { 
  withTenantApi, 
  createApiResponse
} from "@/lib/api-utils";
import { PERMISSIONS } from "@/lib/permissions";

/**
 * PATCH /api/products/[id]/status - Atualiza status do produto (draft/published/archived)
 */
export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const params = await context.params;
    const { id } = params;
    const body = await request.json();
    const { status, action } = body;

    // Validar status
    const validStatuses = ['draft', 'published', 'archived'];
    if (status && !validStatuses.includes(status)) {
      return NextResponse.json({ 
        error: 'Status inválido. Use: draft, published ou archived' 
      }, { status: 400 });
    }

    // Buscar o produto
    const product = await Product.findById(id);
    if (!product) {
      return NextResponse.json({ error: 'Produto não encontrado' }, { status: 404 });
    }

    // Verificar permissões (se é owner ou se é o produto da company do usuário)
    if ((session.user as any).userType !== 'owner_saas' && 
        product.companyId?.toString() !== (session.user as any).companyId) {
      return NextResponse.json({ 
        error: 'Acesso negado a este produto' 
      }, { status: 403 });
    }

    // Processar ação específica ou status direto
    let newStatus = status;
    
    if (action) {
      switch (action) {
        case 'save_draft':
          newStatus = 'draft';
          break;
        case 'publish':
          newStatus = 'published';
          break;
        case 'unpublish':
          newStatus = 'draft';
          break;
        case 'archive':
          newStatus = 'archived';
          break;
        default:
          return NextResponse.json({ 
            error: 'Ação inválida' 
          }, { status: 400 });
      }
    }

    // Atualizar o produto
    product.status = newStatus;
    await product.save();

    return NextResponse.json({
      success: true,
      message: `Produto ${getStatusMessage(newStatus)} com sucesso`,
      product: {
        _id: product._id,
        name: product.name,
        status: product.status,
        updatedAt: product.updatedAt
      }
    });

  } catch (error) {
    console.error("PATCH /api/products/[id]/status error:", error);
    return NextResponse.json({ 
      error: 'Erro interno do servidor' 
    }, { status: 500 });
  }
}

function getStatusMessage(status: string): string {
  switch (status) {
    case 'draft':
      return 'salvo como rascunho';
    case 'published':
      return 'publicado';
    case 'archived':
      return 'arquivado';
    default:
      return 'atualizado';
  }
}