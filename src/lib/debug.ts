// src/lib/debug.ts
export function logEnvironmentVariables() {
  const envVars = [
    'MONGODB_URI',
    'NEXTAUTH_URL', 
    'NEXTAUTH_SECRET',
    'NEXT_PUBLIC_APP_URL',
    'NODE_ENV'
  ];

  console.log('\n=== 🔍 ENVIRONMENT VARIABLES DEBUG ===');
  envVars.forEach(varName => {
    const value = process.env[varName];
    if (value) {
      // Mascarar partes sensíveis
      let masked = value;
      if (varName.includes('SECRET') || varName.includes('URI')) {
        masked = value.substring(0, 10) + '***' + value.substring(value.length - 10);
      }
      console.log(`✅ ${varName}: ${masked}`);
    } else {
      console.log(`❌ ${varName}: MISSING`);
    }
  });
  console.log('======================================\n');
}

export function validateMongoUri(uri?: string): boolean {
  if (!uri) {
    console.error('❌ MongoDB URI is missing');
    return false;
  }

  // Verificar se é uma URI válida do MongoDB (local ou Atlas)
  const isValidLocal = uri.startsWith('mongodb://localhost:') || uri.startsWith('mongodb://127.0.0.1:');
  const isValidAtlas = uri.startsWith('mongodb+srv://') && uri.includes('.mongodb.net');
  
  if (!uri.startsWith('mongodb://') && !uri.startsWith('mongodb+srv://')) {
    console.error('❌ MongoDB URI has invalid format. Expected format:');
    console.error('   Local: mongodb://localhost:27017/database');
    console.error('   Atlas: mongodb+srv://username:password@cluster.mongodb.net/database');
    return false;
  }

  const dbType = isValidLocal ? 'LOCAL' : (isValidAtlas ? 'ATLAS' : 'UNKNOWN');
  console.log(`✅ MongoDB URI format is valid (${dbType})`);
  return true;
}
