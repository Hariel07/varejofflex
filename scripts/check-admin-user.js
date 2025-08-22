// scripts/check-admin-user.js
require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// MongoDB URI - lê das variáveis de ambiente
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI não encontrada nas variáveis de ambiente');
  process.exit(1);
}

// Schema simples do usuário
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  passwordHash: String,
  role: String,
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

async function checkAndCreateAdminUser() {
  try {
    // Conecta ao MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Conectado ao MongoDB');

    const adminEmail = 'hariel1996.hs@gmail.com';
    const adminPassword = 'Thmpv1996@';

    // Verifica se já existe
    const existing = await User.findOne({ email: adminEmail });
    if (existing) {
      console.log('✅ Usuário admin já existe:', adminEmail);
      console.log('📧 Email:', existing.email);
      console.log('👤 Nome:', existing.name);
      console.log('🔑 Role:', existing.role);
      console.log('📅 Criado em:', existing.createdAt);
      console.log('🟢 Ativo:', existing.isActive);
      
      // Verifica se a senha está correta
      const passwordMatch = await bcrypt.compare(adminPassword, existing.passwordHash);
      if (passwordMatch) {
        console.log('✅ Senha confere!');
      } else {
        console.log('⚠️ Senha não confere. Deseja atualizar a senha? (Execute o script de reset)');
      }
      
      return;
    }

    // Se não existe, cria o usuário admin
    console.log('👤 Usuário admin não encontrado. Criando...');
    
    // Cria hash da senha
    const passwordHash = await bcrypt.hash(adminPassword, 12);
    console.log('🔒 Hash da senha criado');

    // Cria usuário admin
    const adminUser = await User.create({
      name: 'Hariel Admin',
      email: adminEmail,
      passwordHash,
      role: 'owner_saas',
      isActive: true,
    });

    console.log('✅ Usuário admin criado com sucesso!');
    console.log('📧 Email:', adminEmail);
    console.log('🔑 Senha:', adminPassword);
    console.log('🆔 ID:', adminUser._id);
    console.log('👤 Role:', adminUser.role);

    // Remove o usuário de teste se existir
    const testUser = await User.findOne({ email: 'admin@varejoflex.com' });
    if (testUser) {
      await User.deleteOne({ email: 'admin@varejoflex.com' });
      console.log('🗑️ Usuário de teste removido: admin@varejoflex.com');
    }

  } catch (error) {
    console.error('❌ Erro:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Desconectado do MongoDB');
  }
}

checkAndCreateAdminUser();