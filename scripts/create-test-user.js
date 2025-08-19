// scripts/create-test-user.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// MongoDB URI - substitua pela sua
const MONGODB_URI = 'mongodb+srv://hariel1996hs2009:rqgw9BbCLYDKNdHO@varejoflex.y4txl.mongodb.net/varejoflex?retryWrites=true&w=majority&appName=VarejoFlex';

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

async function createTestUser() {
  try {
    // Conecta ao MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Conectado ao MongoDB');

    const testEmail = 'admin@varejoflex.com';
    const testPassword = '123456';

    // Verifica se já existe
    const existing = await User.findOne({ email: testEmail });
    if (existing) {
      console.log('⚠️ Usuário já existe:', testEmail);
      console.log('📧 Email:', testEmail);
      console.log('🔑 Senha:', testPassword);
      process.exit(0);
    }

    // Cria hash da senha
    const passwordHash = await bcrypt.hash(testPassword, 12);
    console.log('🔒 Hash da senha criado');

    // Cria usuário de teste
    const testUser = await User.create({
      name: 'Admin Teste',
      email: testEmail,
      passwordHash,
      role: 'owner_saas',
      isActive: true,
    });

    console.log('✅ Usuário criado com sucesso!');
    console.log('📧 Email:', testEmail);
    console.log('🔑 Senha:', testPassword);
    console.log('🆔 ID:', testUser._id);
    console.log('👤 Role:', testUser.role);

  } catch (error) {
    console.error('❌ Erro:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Desconectado do MongoDB');
  }
}

createTestUser();