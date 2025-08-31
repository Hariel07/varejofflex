// src/lib/db.ts
import mongoose from "mongoose";
import { logEnvironmentVariables, validateMongoUri } from "./debug";

declare global {
  // eslint-disable-next-line no-var
  var _mongoose: { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null } | undefined;
}

if (!global._mongoose) {
  global._mongoose = { conn: null, promise: null };
}

export async function dbConnect() {
  // Debug em desenvolvimento
  if (process.env.NODE_ENV === 'development') {
    logEnvironmentVariables();
  }

  const uri = process.env.MONGODB_URI;
  
  if (!validateMongoUri(uri)) {
    throw new Error("MONGODB_URI está ausente ou tem formato inválido. Verifique as variáveis de ambiente.");
  }

  if (global._mongoose!.conn) {
    console.log('🔄 Reusing existing MongoDB connection');
    return global._mongoose!.conn;
  }

  if (!global._mongoose!.promise) {
    const isLocal = uri!.includes('localhost') || uri!.includes('127.0.0.1');
    
    console.log(`🔗 Creating new MongoDB connection to ${isLocal ? 'LOCAL' : 'ATLAS'}...`);
    console.log(`🎯 Connection URI: ${uri!.replace(/\/\/.*@/, '//***:***@')}`); // Oculta credenciais no log
    
    // Configurações diferentes para local vs Atlas
    const connectionOptions = isLocal ? {
      // Configurações para MongoDB local
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 10000,
      socketTimeoutMS: 0,
      maxPoolSize: 5
    } : {
      // Configurações para MongoDB Atlas
      serverSelectionTimeoutMS: 30000,
      connectTimeoutMS: 30000,
      socketTimeoutMS: 30000,
      maxPoolSize: 10,
      retryWrites: true,
      retryReads: true,
    };

    global._mongoose!.promise = mongoose.connect(uri!, connectionOptions).then((m) => {
      console.log(`✅ MongoDB connected successfully to ${isLocal ? 'LOCAL DATABASE' : 'ATLAS CLUSTER'}`);
      return m;
    }).catch((error) => {
      console.error(`❌ MongoDB connection failed to ${isLocal ? 'LOCAL' : 'ATLAS'}:`, error.message);
      
      if (isLocal) {
        console.log('💡 Dicas para MongoDB local:');
        console.log('   - Verifique se o MongoDB está rodando: mongod');
        console.log('   - Verifique se a porta 27017 está livre');
        console.log('   - Teste a conexão: mongosh mongodb://localhost:27017/varejoflex');
      }
      
      global._mongoose!.promise = null; // Reset para permitir nova tentativa
      throw error;
    });
  }

  global._mongoose!.conn = await global._mongoose!.promise;
  return global._mongoose!.conn;
}
