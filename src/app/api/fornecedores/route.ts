import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { dbConnect } from '@/lib/db';
import User from '@/models/User';
import Fornecedor from '@/models/Fornecedor';

// GET - Listar fornecedores do usuário
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
    const type = searchParams.get('type') || '';
    const category = searchParams.get('category') || '';
    const isActive = searchParams.get('isActive');

    let query: any = { userId: user._id.toString() };
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { razaoSocial: { $regex: search, $options: 'i' } },
        { cnpjCpf: { $regex: search, $options: 'i' } }
      ];
    }

    if (type && type !== 'all') {
      query.type = type;
    }

    if (category && category !== 'all') {
      query.category = category;
    }

    if (isActive !== null && isActive !== undefined) {
      query.isActive = isActive === 'true';
    }

    const fornecedores = await Fornecedor.find(query)
      .sort({ name: 1 })
      .lean();

    return NextResponse.json({
      success: true,
      fornecedores
    });

  } catch (error) {
    console.error('Erro ao buscar fornecedores:', error);
    return NextResponse.json({ 
      error: 'Erro interno do servidor' 
    }, { status: 500 });
  }
}

// POST - Criar novo fornecedor
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const body = await request.json();
    const { 
      name, 
      type,
      email,
      phone,
      cnpjCpf,
      razaoSocial,
      inscricaoEstadual,
      inscricaoMunicipal,
      address,
      bankInfo,
      category,
      observations
    } = body;

    // Validações básicas
    if (!name || !type) {
      return NextResponse.json({ 
        error: 'Nome e tipo são obrigatórios' 
      }, { status: 400 });
    }

    if (!['completo', 'simples'].includes(type)) {
      return NextResponse.json({ 
        error: 'Tipo deve ser "completo" ou "simples"' 
      }, { status: 400 });
    }

    // Validações específicas para fornecedor completo
    if (type === 'completo') {
      if (!cnpjCpf || cnpjCpf.length < 11) {
        return NextResponse.json({ 
          error: 'CNPJ/CPF é obrigatório para fornecedores completos' 
        }, { status: 400 });
      }

      if (!address || !address.street || !address.city) {
        return NextResponse.json({ 
          error: 'Endereço completo é obrigatório para fornecedores completos' 
        }, { status: 400 });
      }
    }

    await dbConnect();
    
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });
    }

    // Verificar se já existe fornecedor com o mesmo nome
    const existingByName = await Fornecedor.findOne({
      userId: user._id.toString(),
      name: { $regex: `^${name}$`, $options: 'i' }
    });

    if (existingByName) {
      return NextResponse.json({ 
        error: 'Já existe um fornecedor com este nome' 
      }, { status: 409 });
    }

    // Verificar CNPJ/CPF duplicado (apenas para fornecedores completos)
    if (type === 'completo' && cnpjCpf) {
      const existingByCnpj = await Fornecedor.findOne({
        userId: user._id.toString(),
        cnpjCpf: cnpjCpf.replace(/\D/g, '') // Remove formatação
      });

      if (existingByCnpj) {
        return NextResponse.json({ 
          error: 'Já existe um fornecedor com este CNPJ/CPF' 
        }, { status: 409 });
      }
    }

    // Preparar dados do fornecedor
    const fornecedorData: any = {
      name: name.trim(),
      type,
      email: email?.trim(),
      phone: phone?.trim(),
      category: category?.trim() || 'Geral',
      observations: observations?.trim(),
      userId: user._id.toString()
    };

    // Adicionar dados específicos para fornecedor completo
    if (type === 'completo') {
      fornecedorData.cnpjCpf = cnpjCpf.replace(/\D/g, ''); // Remove formatação
      fornecedorData.razaoSocial = razaoSocial?.trim();
      fornecedorData.inscricaoEstadual = inscricaoEstadual?.trim();
      fornecedorData.inscricaoMunicipal = inscricaoMunicipal?.trim();
      
      if (address) {
        fornecedorData.address = {
          street: address.street?.trim(),
          number: address.number?.trim(),
          complement: address.complement?.trim(),
          neighborhood: address.neighborhood?.trim(),
          city: address.city?.trim(),
          state: address.state?.trim().toUpperCase(),
          zipCode: address.zipCode?.replace(/\D/g, '') // Remove formatação
        };
      }

      if (bankInfo && bankInfo.bank) {
        fornecedorData.bankInfo = {
          bank: bankInfo.bank?.trim(),
          agency: bankInfo.agency?.trim(),
          account: bankInfo.account?.trim(),
          accountType: bankInfo.accountType,
          pix: bankInfo.pix?.trim()
        };
      }
    }

    // Adicionar companyId se o usuário tiver
    if ((user as any).companyId) {
      fornecedorData.companyId = (user as any).companyId.toString();
    }

    const fornecedor = new Fornecedor(fornecedorData);
    await fornecedor.save();

    return NextResponse.json({
      success: true,
      message: 'Fornecedor criado com sucesso',
      fornecedor
    });

  } catch (error) {
    console.error('Erro ao criar fornecedor:', error);
    
    // Verificar se é erro de índice único (CNPJ duplicado)
    if ((error as any).code === 11000) {
      return NextResponse.json({ 
        error: 'CNPJ/CPF já cadastrado para outro fornecedor' 
      }, { status: 409 });
    }

    return NextResponse.json({ 
      error: 'Erro interno do servidor' 
    }, { status: 500 });
  }
}