import { NextRequest } from "next/server";
import { dbConnect } from "@/lib/db";
import Product from "@/models/Product";
import { 
  withTenantApi, 
  createApiResponse, 
  buildTenantFilter,
  addTenantContext
} from "@/lib/api-utils";
import { PERMISSIONS } from "@/lib/permissions";

/**
 * GET /api/products - Lista produtos do tenant
 */
export const GET = withTenantApi(async (user) => {
  try {
    await dbConnect();
    
    // Filtra produtos baseado no contexto do tenant
    const filter = buildTenantFilter(user.tenantContext);
    
    // Owner SaaS pode ver produtos de todas as companies com query param
    let query = { ...filter, active: true };
    
    const products = await Product.find(query)
      .sort({ category: 1, name: 1 })
      .lean();
    
    return createApiResponse(products, {
      message: `Found ${products.length} products`,
    });
  } catch (error) {
    console.error("GET /api/products error:", error);
    return createApiResponse(null, {
      status: 500,
      error: "FETCH_ERROR",
      message: "Failed to fetch products",
    });
  }
});

/**
 * POST /api/products - Cria novo produto
 */
export const POST = withTenantApi(async (user, request: NextRequest) => {
  try {
    // Verifica permissão para criar produtos
    const { hasPermission } = await import("@/lib/permissions");
    if (!hasPermission(user.tenantContext, PERMISSIONS.PRODUCTS_CREATE)) {
      return createApiResponse(null, {
        status: 403,
        error: "PERMISSION_DENIED",
        message: "No permission to create products",
      });
    }

    await dbConnect();
    
    const body = await request.json();
    
    // Adiciona contexto do tenant aos dados
    const productData = addTenantContext(body, user.tenantContext);
    
    // Cria o produto
    const product = await Product.create(productData);
    
    return createApiResponse(product, {
      status: 201,
      message: "Product created successfully",
    });
  } catch (error) {
    console.error("POST /api/products error:", error);
    return createApiResponse(null, {
      status: 500,
      error: "CREATE_ERROR",
      message: "Failed to create product",
    });
  }
});

// Seed inicial para demo (mantido para compatibilidade)
async function ensureDemoProducts() {
  const tenantId = "demo";
  const count = await Product.countDocuments({ tenantId });
  
  if (count === 0) {
    await Product.insertMany([
      { tenantId, name: "X-Burger", description: "Pão, carne, queijo", price: 18.9, category: "Hambúrgueres", active: true },
      { tenantId, name: "X-Salada", description: "Pão, carne, queijo, salada", price: 22.9, category: "Hambúrgueres", active: true },
      { tenantId, name: "Batata média", description: "Crocante", price: 12.0, category: "Acompanhamentos", active: true },
      { tenantId, name: "Refrigerante lata", description: "350ml", price: 7.0, category: "Bebidas", active: true },
    ]);
  }
}
