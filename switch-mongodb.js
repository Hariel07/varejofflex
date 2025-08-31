#!/usr/bin/env node
// Script para alternar entre MongoDB Local e Atlas
require('dotenv').config({ path: '.env.local' });
const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '.env.local');

function toggleMongoDB(target) {
  try {
    let envContent = fs.readFileSync(envPath, 'utf8');
    
    const localUri = 'mongodb://localhost:27017/varejoflex';
    const atlasUri = 'mongodb+srv://Hariel07:Thmpv1996%40@cluster0.ivrgf0m.mongodb.net/varejoflex?retryWrites=true&w=majority&appName=Cluster0&connectTimeoutMS=30000&socketTimeoutMS=30000&serverSelectionTimeoutMS=30000&maxPoolSize=10';
    
    if (target === 'local') {
      envContent = envContent.replace(
        /MONGODB_URI="[^"]*"/,
        `MONGODB_URI="${localUri}"`
      );
      console.log('🏠 Configurado para MongoDB LOCAL');
      console.log('💡 Use para desenvolvimento rápido');
      console.log('⚠️  AVISO: Vercel não funcionará com esta configuração');
    } else if (target === 'atlas') {
      envContent = envContent.replace(
        /MONGODB_URI="[^"]*"/,
        `MONGODB_URI="${atlasUri}"`
      );
      console.log('☁️  Configurado para MongoDB ATLAS');
      console.log('💡 Use para deploy no Vercel');
      console.log('💰 AVISO: Consumirá recursos do Atlas');
    } else {
      console.log('❌ Uso: node switch-mongodb.js [local|atlas]');
      return;
    }
    
    fs.writeFileSync(envPath, envContent);
    console.log('✅ Configuração atualizada com sucesso!');
    
    if (target === 'atlas') {
      console.log('\n🚀 Próximos passos para deploy:');
      console.log('1. git add .');
      console.log('2. git commit -m "switch to Atlas for deploy"');
      console.log('3. git push origin main');
      console.log('4. Aguardar deploy automático no Vercel');
    }
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
  }
}

const target = process.argv[2];
toggleMongoDB(target);