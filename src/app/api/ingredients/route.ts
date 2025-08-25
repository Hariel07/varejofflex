import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { dbConnect } from '@/lib/db';
import User from '@/models/User';
import Ingredient from '@/models/Ingredient';

// GET - Listar ingredientes do usuário
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
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';
    const lowStock = searchParams.get('lowStock') === 'true';
    const supplier = searchParams.get('supplier') || '';

    let query: any = { userId: user._id.toString() };
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    if (category && category !== 'all') {
      query.category = category;
    }

    if (lowStock) {
      query.$expr = { $lt: ['$currentStock', '$minStock'] };
    }

    if (supplier && supplier !== 'all') {
      query.supplier = supplier;
    }

    const ingredients = await Ingredient.find(query).sort({ name: 1 });

    return NextResponse.json({
      success: true,
      ingredients
    });

  } catch (error) {
    console.error('Erro ao buscar ingredientes:', error);
    return NextResponse.json({ 
      error: 'Erro interno do servidor' 
    }, { status: 500 });
  }
}

// POST - Criar novo ingrediente
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const body = await request.json();
    const { 
      name, 
      description,
      category,
      price, 
      quantity, 
      unit, 
      supplier,
      currentStock,
      minStock,
      maxStock,
      location,
      expiryDays,
      costPerUnit
    } = body;

    // Validações
    if (!name || !category || !price || !unit) {
      return NextResponse.json({ 
        error: 'Nome, categoria, preço e unidade são obrigatórios' 
      }, { status: 400 });
    }

    if (price <= 0) {
      return NextResponse.json({ 
        error: 'Preço deve ser maior que zero' 
      }, { status: 400 });
    }

    if (!['g', 'kg', 'ml', 'l', 'un', 'lata', 'pacote'].includes(unit)) {
      return NextResponse.json({ 
        error: 'Unidade inválida' 
      }, { status: 400 });
    }

    await dbConnect();
    
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });
    }

    // Verificar se já existe ingrediente com o mesmo nome
    const existingIngredient = await Ingredient.findOne({
      userId: user._id.toString(),
      name: { $regex: `^${name}$`, $options: 'i' }
    });

    if (existingIngredient) {
      return NextResponse.json({ 
        error: 'Já existe um ingrediente com este nome' 
      }, { status: 409 });
    }

    const ingredient = new Ingredient({
      name: name.trim(),
      description: description?.trim(),
      category,
      price: parseFloat(price),
      quantity: quantity ? parseFloat(quantity) : 0,
      unit,
      supplier: supplier?.trim(),
      currentStock: currentStock ? parseFloat(currentStock) : 0,
      minStock: minStock ? parseFloat(minStock) : 10,
      maxStock: maxStock ? parseFloat(maxStock) : 100,
      location: location?.trim(),
      expiryDays: expiryDays ? parseInt(expiryDays) : null,
      costPerUnit: costPerUnit ? parseFloat(costPerUnit) : parseFloat(price),
      userId: user._id.toString()
    });

    await ingredient.save();

    return NextResponse.json({
      success: true,
      message: 'Ingrediente criado com sucesso',
      ingredient
    });

  } catch (error) {
    console.error('Erro ao criar ingrediente:', error);
    return NextResponse.json({ 
      error: 'Erro interno do servidor' 
    }, { status: 500 });
  }
}