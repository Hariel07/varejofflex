import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import User from '@/models/User';
import Company from '@/models/Company';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    // Hash da senha padrão para usuários de teste
    const defaultPassword = await bcrypt.hash('123456', 12);

    // Dados das empresas de teste
    const testCompanies = [
      {
        name: "Hamburguelandia Maran",
        businessType: "Lanchonete",
        segment: "lanchonete",
        city: "Rurópolis",
        state: "Pará",
        plan: "Empresarial",
        phone: "+55 93 91711-4403",
        address: "Rua das Palmeiras, 123",
        zip: "68165-000",
        cnpj: "12.345.678/0001-90"
      },
      {
        name: "Pizzaria Bella Vista",
        businessType: "Pizzaria", 
        segment: "pizzaria",
        city: "São Paulo",
        state: "São Paulo",
        plan: "Avançado",
        phone: "+55 11 98765-4321",
        address: "Avenida Italia, 456",
        zip: "01310-100",
        cnpj: "98.765.432/0001-10"
      },
      {
        name: "Café & Cia",
        businessType: "Cafeteria",
        segment: "lanchonete", 
        city: "Rio de Janeiro",
        state: "Rio de Janeiro",
        plan: "Básico",
        phone: "+55 21 91234-5678",
        address: "Rua do Café, 789",
        zip: "22071-900",
        cnpj: "11.222.333/0001-44"
      },
      {
        name: "Moda Elegante",
        businessType: "Loja de Roupas",
        segment: "moda",
        city: "Belo Horizonte", 
        state: "Minas Gerais",
        plan: "Avançado",
        phone: "+55 31 92345-6789",
        address: "Rua da Moda, 321",
        zip: "30112-000",
        cnpj: "22.333.444/0001-55"
      },
      {
        name: "Supermercado Preço Bom",
        businessType: "Supermercado",
        segment: "mercado",
        city: "Salvador",
        state: "Bahia", 
        plan: "Empresarial",
        phone: "+55 71 93456-7890",
        address: "Avenida do Comércio, 654",
        zip: "40070-110",
        cnpj: "33.444.555/0001-66"
      }
    ];

    // Dados dos usuários de teste
    const testUsers = [
      {
        name: "Hariel Soares Maran",
        email: "hariel.maran@gmail.com",
        cpf: "090.703.499-30",
        companyIndex: 0 // Hamburguelandia
      },
      {
        name: "Maria Silva Santos",
        email: "maria.bellavista@gmail.com", 
        cpf: "123.456.789-01",
        companyIndex: 1 // Pizzaria
      },
      {
        name: "João Pedro Oliveira",
        email: "joao.cafeecia@gmail.com",
        cpf: "987.654.321-09", 
        companyIndex: 2 // Café
      },
      {
        name: "Ana Carolina Souza",
        email: "ana.modaelegante@gmail.com",
        cpf: "456.789.123-45",
        companyIndex: 3 // Moda
      },
      {
        name: "Carlos Roberto Silva",
        email: "carlos.supermercado@gmail.com", 
        cpf: "789.123.456-78",
        companyIndex: 4 // Supermercado
      }
    ];

    // Alguns clientes de teste
    const testClients = [
      { name: "Pedro Santos", email: "pedro.cliente@gmail.com" },
      { name: "Ana Costa", email: "ana.cliente@gmail.com" },
      { name: "João Silva", email: "joao.cliente@gmail.com" },
      { name: "Maria Oliveira", email: "maria.cliente@gmail.com" },
      { name: "Carlos Souza", email: "carlos.cliente@gmail.com" },
      { name: "Lucia Ferreira", email: "lucia.cliente@gmail.com" },
      { name: "Roberto Lima", email: "roberto.cliente@gmail.com" },
      { name: "Patricia Rocha", email: "patricia.cliente@gmail.com" }
    ];

    const createdCompanies = [];
    const createdUsers = [];

    // Criar empresas
    for (const companyData of testCompanies) {
      const company = new Company(companyData);
      await company.save();
      createdCompanies.push(company);
    }

    // Criar usuários logistas
    for (let i = 0; i < testUsers.length; i++) {
      const userData = testUsers[i];
      const company = createdCompanies[userData.companyIndex];
      
      const user = new User({
        name: userData.name,
        email: userData.email,
        passwordHash: defaultPassword,
        role: 'logista',
        userType: 'lojista',
        companyId: company._id,
        isActive: true,
        segment: company.segment,
        lastLogin: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000), // Último login nos últimos 7 dias
        permissions: ['manage_products', 'manage_orders', 'view_reports']
      });
      
      await user.save();
      createdUsers.push(user);

      // Atualizar empresa com userId
      company.userId = user._id;
      await company.save();
    }

    // Criar clientes de teste
    for (let i = 0; i < testClients.length; i++) {
      const clientData = testClients[i];
      
      const client = new User({
        name: clientData.name,
        email: clientData.email,
        passwordHash: defaultPassword,
        role: 'cliente',
        userType: 'lojista', // Mesmo sendo cliente, pertence ao sistema de lojistas
        isActive: true,
        lastLogin: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000), // Último login nos últimos 30 dias
        permissions: ['place_orders', 'view_profile']
      });
      
      await client.save();
      createdUsers.push(client);
    }

    return NextResponse.json({
      success: true,
      message: 'Dados de teste criados com sucesso!',
      data: {
        companies: createdCompanies.length,
        logistas: testUsers.length,
        clients: testClients.length,
        totalUsers: createdUsers.length
      }
    });

  } catch (error: any) {
    console.error('Erro ao criar dados de teste:', error);
    
    // Se for erro de duplicata, informar
    if (error.code === 11000) {
      return NextResponse.json({
        success: false,
        error: 'Alguns usuários já existem no sistema',
        details: error.message
      }, { status: 400 });
    }

    return NextResponse.json({
      success: false,
      error: 'Erro interno do servidor',
      details: error.message
    }, { status: 500 });
  }
}