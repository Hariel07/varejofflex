import { IIngredient } from '@/models/Ingredient';
import { IRecipe } from '@/models/Recipe';
import { IProductPrice } from '@/models/ProductPrice';
import { IAdditionalCost } from '@/models/AdditionalCost';

export interface ICostCalculation {
  baseCost: number;
  additionalCosts: number;
  totalCost: number;
  unitCost?: number;
  breakdown: ICostBreakdown[];
}

export interface ICostBreakdown {
  type: 'ingredient' | 'recipe' | 'additionalCost' | 'tax';
  id: string;
  name: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  totalPrice: number;
}

export class CostCalculator {
  private ingredients: Map<string, IIngredient>;
  private recipes: Map<string, IRecipe>;
  private additionalCosts: Map<string, IAdditionalCost>;

  constructor(
    ingredients: IIngredient[],
    recipes: IRecipe[],
    additionalCosts: IAdditionalCost[]
  ) {
    this.ingredients = new Map(ingredients.map(ing => [ing._id!.toString(), ing]));
    this.recipes = new Map(recipes.map(rec => [rec._id!.toString(), rec]));
    this.additionalCosts = new Map(additionalCosts.map(cost => [cost._id!.toString(), cost]));
  }

  /**
   * Calcula o custo base de um ingrediente por unidade
   */
  getIngredientUnitCost(ingredientId: string): { cost: number; unit: string } {
    const ingredient = this.ingredients.get(ingredientId);
    if (!ingredient || !ingredient.price || ingredient.quantity <= 0) {
      return { cost: 0, unit: 'g' };
    }

    let cost = 0;
    let unit = '';

    switch (ingredient.unit) {
      case 'g':
        cost = ingredient.price / ingredient.quantity;
        unit = 'g';
        break;
      case 'kg':
        cost = ingredient.price / (ingredient.quantity * 1000);
        unit = 'g';
        break;
      case 'ml':
        cost = ingredient.price / ingredient.quantity;
        unit = 'ml';
        break;
      case 'l':
        cost = ingredient.price / (ingredient.quantity * 1000);
        unit = 'ml';
        break;
      case 'un':
        cost = ingredient.price / ingredient.quantity;
        unit = 'un';
        break;
    }

    return { cost, unit };
  }

  /**
   * Calcula o custo total de uma receita
   */
  calculateRecipeCost(recipeId: string): number {
    const recipe = this.recipes.get(recipeId);
    if (!recipe) return 0;

    return recipe.ingredients.reduce((total, recipeIngredient) => {
      const { cost } = this.getIngredientUnitCost(recipeIngredient.ingredientId);
      return total + (cost * recipeIngredient.quantity);
    }, 0);
  }

  /**
   * Calcula o custo por unidade de uma receita
   */
  calculateRecipeUnitCost(recipeId: string): number {
    const recipe = this.recipes.get(recipeId);
    if (!recipe || !recipe.yield || recipe.yield <= 0) return 0;

    const totalCost = this.calculateRecipeCost(recipeId);
    return totalCost / recipe.yield;
  }

  /**
   * Calcula o custo base de um produto (sem taxas)
   */
  calculateProductBaseCost(product: IProductPrice): ICostCalculation {
    const breakdown: ICostBreakdown[] = [];
    let baseCost = 0;

    for (const component of product.components) {
      let componentCost = 0;
      let componentName = '';
      let unitPrice = 0;

      if (component.type === 'ingredient') {
        const ingredient = this.ingredients.get(component.id);
        if (ingredient) {
          const { cost } = this.getIngredientUnitCost(component.id);
          componentCost = cost * component.quantity;
          componentName = ingredient.name;
          unitPrice = cost;
        }
      } else if (component.type === 'recipe') {
        const recipe = this.recipes.get(component.id);
        if (recipe) {
          unitPrice = this.calculateRecipeUnitCost(component.id);
          componentCost = unitPrice * component.quantity;
          componentName = `(Receita) ${recipe.name}`;
        }
      } else if (component.type === 'additionalCost') {
        const additionalCost = this.additionalCosts.get(component.id);
        if (additionalCost && additionalCost.price && additionalCost.quantity && additionalCost.quantity > 0) {
          unitPrice = additionalCost.price / additionalCost.quantity;
          componentCost = unitPrice * component.quantity;
          componentName = `(Custo) ${additionalCost.name}`;
        }
      }

      if (componentCost > 0) {
        baseCost += componentCost;
        breakdown.push({
          type: component.type,
          id: component.id,
          name: componentName,
          quantity: component.quantity,
          unit: component.unit,
          unitPrice,
          totalPrice: componentCost
        });
      }
    }

    return {
      baseCost,
      additionalCosts: 0,
      totalCost: baseCost,
      breakdown
    };
  }

  /**
   * Calcula o CMV completo de um produto (incluindo taxas)
   */
  calculateProductCMV(product: IProductPrice): ICostCalculation {
    const baseCostCalc = this.calculateProductBaseCost(product);
    let additionalCosts = 0;
    const breakdown = [...baseCostCalc.breakdown];

    // Calcular taxas aplicáveis
    for (const [costId, cost] of this.additionalCosts) {
      const isTax = cost.application === 'individual';
      const appliesToProduct = isTax && cost.productIds?.includes(product._id!.toString());

      if (appliesToProduct && cost.type && cost.value !== undefined) {
        let taxAmount = 0;
        
        if (cost.type === 'fixo') {
          taxAmount = cost.value;
        } else if (cost.type === 'percentual') {
          taxAmount = baseCostCalc.baseCost * (cost.value / 100);
        }

        if (taxAmount > 0) {
          additionalCosts += taxAmount;
          breakdown.push({
            type: 'tax',
            id: costId,
            name: `(Taxa) ${cost.name}`,
            quantity: 1,
            unit: cost.type === 'fixo' ? 'R$' : '%',
            unitPrice: cost.value,
            totalPrice: taxAmount
          });
        }
      }
    }

    return {
      baseCost: baseCostCalc.baseCost,
      additionalCosts,
      totalCost: baseCostCalc.baseCost + additionalCosts,
      breakdown
    };
  }

  /**
   * Calcula lucro e margem de um produto
   */
  calculateProfitMargin(product: IProductPrice): {
    cost: number;
    salePrice: number;
    profit: number;
    marginPercent: number;
  } {
    const { totalCost } = this.calculateProductCMV(product);
    const salePrice = product.salePrice || 0;
    const profit = salePrice - totalCost;
    const marginPercent = salePrice > 0 ? (profit / salePrice) * 100 : 0;

    return {
      cost: totalCost,
      salePrice,
      profit,
      marginPercent
    };
  }

  /**
   * Sugere preço de venda baseado na margem desejada
   */
  suggestSalePrice(product: IProductPrice, desiredMarginPercent: number): number {
    const { totalCost } = this.calculateProductCMV(product);
    
    if (desiredMarginPercent >= 100 || desiredMarginPercent < 0) {
      throw new Error('Margem deve ser entre 0% e 99%');
    }

    // Preço = Custo / (1 - Margem/100)
    return totalCost / (1 - desiredMarginPercent / 100);
  }

  /**
   * Analisa todos os produtos e retorna relatório de custos
   */
  generateCostReport(products: IProductPrice[]): {
    totalProducts: number;
    averageCost: number;
    averageMargin: number;
    productsWithLowMargin: IProductPrice[];
    productsWithHighCost: IProductPrice[];
  } {
    if (products.length === 0) {
      return {
        totalProducts: 0,
        averageCost: 0,
        averageMargin: 0,
        productsWithLowMargin: [],
        productsWithHighCost: []
      };
    }

    let totalCost = 0;
    let totalMargin = 0;
    const productAnalysis = products.map(product => {
      const analysis = this.calculateProfitMargin(product);
      totalCost += analysis.cost;
      totalMargin += analysis.marginPercent;
      return { product, analysis };
    });

    const averageCost = totalCost / products.length;
    const averageMargin = totalMargin / products.length;

    // Produtos com margem baixa (< 20%)
    const productsWithLowMargin = productAnalysis
      .filter(p => p.analysis.marginPercent < 20)
      .map(p => p.product);

    // Produtos com custo alto (acima da média + 50%)
    const highCostThreshold = averageCost * 1.5;
    const productsWithHighCost = productAnalysis
      .filter(p => p.analysis.cost > highCostThreshold)
      .map(p => p.product);

    return {
      totalProducts: products.length,
      averageCost,
      averageMargin,
      productsWithLowMargin,
      productsWithHighCost
    };
  }
}