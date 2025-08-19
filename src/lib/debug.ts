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

  if (!uri.startsWith('mongodb://') && !uri.startsWith('mongodb+srv://')) {
    console.error('❌ MongoDB URI has invalid format:', uri.substring(0, 30) + '...');
    return false;
  }

  console.log('✅ MongoDB URI format is valid');
  return true;
}