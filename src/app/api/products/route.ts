import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { dbConnect } from "@/lib/db";
import User from '@/models/User';
import Product from "@/models/Product";
import Recipe from '@/models/Recipe';
import { 
  withTenantApi, 
  createApiResponse, 
  buildTenantFilter,
  addTenantContext
} from "@/lib/api-utils";
import { PERMISSIONS } from "@/lib/permissions";

/**
 * GET /api/products - Lista produtos do tenant ou usuário
 */
export const GET = withTenantApi(async (user, request) => {
  try {
    await dbConnect();
    
    // Verifica se tem sessão de usuário individual
    const session = await getServerSession(authOptions);
    
    if (session?.user?.email) {
      // Modo usuário individual
      const userDoc = await User.findOne({ email: session.user.email });
      if (!userDoc) {
        return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });
      }

      const url = new URL(request.url);
      const search = url.searchParams.get('search') || '';
      const category = url.searchParams.get('category') || '';
      const status = url.searchParams.get('status') || '';

      let query: any = { userId: userDoc._id.toString() };

      if (search) {
        query.$or = [
          { name: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } }
        ];
      }

      if (category && category !== 'all') {
        query.category = category;
      }

      if (status && status !== 'all') {
        query.status = status;
      }

      const products = await Product.find(query)
        .populate('recipeId', 'name totalCost costPerServing')
        .sort({ name: 1 });

      return NextResponse.json({
        success: true,
        products
      });
    }
    
    // Modo tenant (sistema original)
    const filter = buildTenantFilter(user.tenantContext);
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
export const POST = withTenantApi(async (user, request) => {
  try {
    await dbConnect();
    
    // Verifica se tem sessão de usuário individual
    const session = await getServerSession(authOptions);
    
    if (session?.user?.email) {
      // Modo usuário individual
      const userDoc = await User.findOne({ email: session.user.email });
      if (!userDoc) {
        return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });
      }

      const body = await request.json();
      const { 
        name, 
        description,
        category,
        recipeId,
        sellingPrice,
        costPrice,
        margin,
        currentStock,
        minStock,
        maxStock,
        barcode,
        images,
        tags,
        status
      } = body;

      // Validações
      if (!name || !category || !sellingPrice) {
        return NextResponse.json({ 
          error: 'Nome, categoria e preço de venda são obrigatórios' 
        }, { status: 400 });
      }

      if (sellingPrice <= 0) {
        return NextResponse.json({ 
          error: 'Preço de venda deve ser maior que zero' 
        }, { status: 400 });
      }

      // Verificar se já existe produto com o mesmo nome
      const existingProduct = await Product.findOne({
        userId: userDoc._id.toString(),
        name: { $regex: `^${name}$`, $options: 'i' }
      });

      if (existingProduct) {
        return NextResponse.json({ 
          error: 'Já existe um produto com este nome' 
        }, { status: 409 });
      }

      let finalCostPrice = costPrice;
      let finalMargin = margin;

      // Se tem receita associada, calcular custo baseado na receita
      if (recipeId) {
        const recipe = await Recipe.findOne({
          _id: recipeId,
          userId: userDoc._id.toString()
        });

        if (!recipe) {
          return NextResponse.json({ 
            error: 'Receita não encontrada' 
          }, { status: 404 });
        }

        finalCostPrice = recipe.costPerServing || 0;
      }

      // Calcular margem se não foi fornecida
      if (!finalMargin && finalCostPrice) {
        finalMargin = ((sellingPrice - finalCostPrice) / sellingPrice) * 100;
      }

      const product = new Product({
        name: name.trim(),
        description: description?.trim(),
        category,
        recipeId: recipeId || null,
        sellingPrice: parseFloat(sellingPrice),
        costPrice: finalCostPrice ? parseFloat(finalCostPrice) : 0,
        margin: finalMargin || 0,
        currentStock: currentStock ? parseFloat(currentStock) : 0,
        minStock: minStock ? parseFloat(minStock) : 10,
        maxStock: maxStock ? parseFloat(maxStock) : 100,
        barcode: barcode?.trim(),
        images: images || [],
        tags: tags || [],
        status: status || 'ativo',
        userId: userDoc._id.toString()
      });

      await product.save();

      // Popular com dados da receita para retorno
      if (recipeId) {
        await product.populate('recipeId', 'name totalCost costPerServing');
      }

      return NextResponse.json({
        success: true,
        message: 'Produto criado com sucesso',
        product
      });
    }
    
    // Modo tenant (sistema original)
    // Verifica permissão para criar produtos
    const { hasPermission } = await import("@/lib/permissions");
    if (!hasPermission(user.tenantContext, PERMISSIONS.PRODUCTS_CREATE)) {
      return createApiResponse(null, {
        status: 403,
        error: "PERMISSION_DENIED",
        message: "No permission to create products",
      });
    }

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
