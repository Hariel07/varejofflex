// scripts/remove-test-user.js
require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

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

async function removeTestUser() {
  try {
    // Conecta ao MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Conectado ao MongoDB');

    // Remove o usuário de teste
    const result = await User.deleteOne({ email: 'admin@varejoflex.com' });
    
    if (result.deletedCount > 0) {
      console.log('🗑️ Usuário de teste removido: admin@varejoflex.com');
    } else {
      console.log('ℹ️ Usuário de teste não encontrado (já pode ter sido removido)');
    }

  } catch (error) {
    console.error('❌ Erro:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Desconectado do MongoDB');
  }
}

removeTestUser();