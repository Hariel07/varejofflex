// Script para verificar usuários no MongoDB local
require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

// Schema simples do usuário
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  passwordHash: String,
  role: String,
  userType: String,
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

async function checkUsers() {
  try {
    const MONGODB_URI = process.env.MONGODB_URI;
    console.log('🔗 Conectando ao MongoDB:', MONGODB_URI);
    
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Conectado ao MongoDB local');

    // Verificar quantos usuários existem
    const userCount = await User.countDocuments();
    console.log(`📊 Total de usuários no banco: ${userCount}`);

    if (userCount === 0) {
      console.log('❌ Nenhum usuário encontrado no banco local');
      console.log('💡 Precisa criar o usuário owner');
    } else {
      console.log('👥 Usuários encontrados:');
      const users = await User.find({}, 'name email role userType createdAt');
      users.forEach((user, index) => {
        console.log(`${index + 1}. Nome: ${user.name}`);
        console.log(`   Email: ${user.email}`);
        console.log(`   Role: ${user.role}`);
        console.log(`   Tipo: ${user.userType}`);
        console.log(`   Criado: ${user.createdAt}`);
        console.log('   ---');
      });
    }

  } catch (error) {
    console.error('❌ Erro ao conectar:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Desconectado do MongoDB');
  }
}

checkUsers();