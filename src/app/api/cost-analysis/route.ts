import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { dbConnect } from '@/lib/db';
import User from '@/models/User';
import ProductPrice from '@/models/ProductPrice';
import Product from '@/models/Product';
import Ingredient from '@/models/Ingredient';
import Recipe from '@/models/Recipe';
import Purchase from '@/models/Purchase';
import AdditionalCost from '@/models/AdditionalCost';
import { CostCalculator } from '@/lib/cost-calculator';

// GET - Análise completa de custos
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    await dbConnect();
    
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });
    }

    const { searchParams } = new URL(request.url);
    const period = parseInt(searchParams.get('period') || '30');
    const category = searchParams.get('category') || 'all';

    const userId = user._id.toString();
    
    // Data de início baseada no período
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - period);

    // Análise de Ingredientes
    let ingredientsQuery: any = { userId };
    if (category !== 'all') {
      ingredientsQuery.category = category;
    }

    const ingredients = await Ingredient.find(ingredientsQuery);
    
    const ingredientsAnalysis = {
      totalValue: ingredients.reduce((total, ing) => total + (ing.currentStock || 0) * (ing.costPerUnit || ing.price || 0), 0),
      lowStockItems: ingredients.filter(ing => (ing.currentStock || 0) < (ing.minStock || 0)).length,
      categories: await getIngredientCategories(userId, category)
    };

    // Análise de Receitas
    let recipesQuery: any = { userId };
    if (category !== 'all') {
      recipesQuery.category = category;
    }

    const recipes = await Recipe.find(recipesQuery);
    
    const recipesAnalysis = {
      totalRecipes: recipes.length,
      avgCostPerServing: recipes.length > 0 ? 
        recipes.reduce((total, recipe) => total + (recipe.costPerServing || 0), 0) / recipes.length : 0,
      mostExpensive: recipes
        .sort((a, b) => (b.costPerServing || 0) - (a.costPerServing || 0))
        .slice(0, 3)
        .map(recipe => ({
          name: recipe.name,
          cost: recipe.costPerServing || 0
        })),
      cheapest: recipes
        .sort((a, b) => (a.costPerServing || 0) - (b.costPerServing || 0))
        .slice(0, 3)
        .map(recipe => ({
          name: recipe.name,
          cost: recipe.costPerServing || 0
        }))
    };

    // Análise de Produtos
    let productsQuery: any = { userId };
    if (category !== 'all') {
      productsQuery.category = category;
    }

    const products = await Product.find(productsQuery);
    
    const productsAnalysis = {
      totalProducts: products.length,
      avgProfitMargin: products.length > 0 ? 
        products.reduce((total, product) => total + (product.margin || 0), 0) / products.length : 0,
      totalRevenuePotential: products.reduce((total, product) => 
        total + (product.currentStock || 0) * (product.sellingPrice || 0), 0),
      bestMargins: products
        .sort((a, b) => (b.margin || 0) - (a.margin || 0))
        .slice(0, 3)
        .map(product => ({
          name: product.name,
          margin: product.margin || 0
        }))
    };

    // Análise de Compras
    const purchasesQuery = {
      userId,
      createdAt: { $gte: startDate }
    };

    const purchases = await Purchase.find(purchasesQuery);
    
    const monthlySpending = purchases
      .filter(purchase => {
        const purchaseDate = new Date(purchase.createdAt);
        const currentMonth = new Date();
        return purchaseDate.getMonth() === currentMonth.getMonth() && 
               purchaseDate.getFullYear() === currentMonth.getFullYear();
      })
      .reduce((total, purchase) => total + (purchase.totalCost || 0), 0);

    const supplierSpending = purchases.reduce((acc: any, purchase) => {
      const supplier = purchase.supplier || 'Não informado';
      acc[supplier] = (acc[supplier] || 0) + (purchase.totalCost || 0);
      return acc;
    }, {});

    const purchasesAnalysis = {
      totalPurchases: purchases.length,
      monthlySpending,
      topSuppliers: Object.entries(supplierSpending)
        .sort(([,a], [,b]) => (b as number) - (a as number))
        .slice(0, 3)
        .map(([name, amount]) => ({
          name,
          amount: amount as number
        }))
    };

    const analysis = {
      ingredients: ingredientsAnalysis,
      recipes: recipesAnalysis,
      products: productsAnalysis,
      purchases: purchasesAnalysis
    };

    return NextResponse.json(analysis);

  } catch (error) {
    console.error('Erro na análise de custos:', error);
    return NextResponse.json({ 
      error: 'Erro interno do servidor' 
    }, { status: 500 });
  }
}

// Função auxiliar para análise de categorias de ingredientes
async function getIngredientCategories(userId: string, filterCategory: string) {
  try {
    let matchStage: any = { userId };
    if (filterCategory !== 'all') {
      matchStage.category = filterCategory;
    }

    const categoriesData = await Ingredient.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: '$category',
          totalValue: {
            $sum: {
              $multiply: [
                { $ifNull: ['$currentStock', 0] },
                { $ifNull: [{ $ifNull: ['$costPerUnit', '$price'] }, 0] }
              ]
            }
          }
        }
      },
      { $sort: { totalValue: -1 } }
    ]);

    const totalValue = categoriesData.reduce((sum, cat) => sum + cat.totalValue, 0);

    return categoriesData.map(cat => ({
      name: cat._id || 'Sem categoria',
      value: cat.totalValue,
      percentage: totalValue > 0 ? (cat.totalValue / totalValue) * 100 : 0
    }));
  } catch (error) {
    console.error('Erro ao obter categorias de ingredientes:', error);
    return [];
  }
}

// POST - Calcular custo de um produto específico
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const body = await request.json();
    const { productId, components, salePrice } = body;

    await dbConnect();
    
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });
    }

    const userId = user._id.toString();

    // Buscar dados necessários
    const [ingredients, recipes, additionalCosts] = await Promise.all([
      Ingredient.find({ userId }),
      Recipe.find({ userId }),
      AdditionalCost.find({ userId })
    ]);

    const calculator = new CostCalculator(ingredients, recipes, additionalCosts);

    let product;
    
    if (productId) {
      // Produto existente
      product = await ProductPrice.findOne({
        _id: productId,
        userId
      });
      
      if (!product) {
        return NextResponse.json({ error: 'Produto não encontrado' }, { status: 404 });
      }
    } else if (components) {
      // Produto simulado (para preview antes de salvar)
      product = {
        _id: 'preview',
        name: 'Preview',
        categoryId: '',
        components,
        salePrice: salePrice || 0,
        userId
      } as any;
    } else {
      return NextResponse.json({ 
        error: 'ID do produto ou componentes são necessários' 
      }, { status: 400 });
    }

    // Calcular custos
    const costAnalysis = calculator.calculateProductCMV(product);
    const profitAnalysis = calculator.calculateProfitMargin(product);

    // Sugestões de preço
    const pricesuggestions = [10, 20, 30, 40, 50].map(margin => ({
      margin,
      suggestedPrice: calculator.suggestSalePrice(product, margin)
    }));

    return NextResponse.json({
      success: true,
      data: {
        cost: costAnalysis,
        profit: profitAnalysis,
        suggestions: {
          prices: pricesuggestions,
          recommendations: {
            minimumPrice: costAnalysis.totalCost * 1.1, // 10% acima do custo
            recommendedPrice: costAnalysis.totalCost * 1.3, // 30% de margem
            premiumPrice: costAnalysis.totalCost * 1.5 // 50% de margem
          }
        }
      }
    });

  } catch (error) {
    console.error('Erro ao calcular custo do produto:', error);
    return NextResponse.json({ 
      error: 'Erro interno do servidor' 
    }, { status: 500 });
  }
}