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
    console.log('🔗 Creating new MongoDB connection...');
    global._mongoose!.promise = mongoose.connect(uri!, {
      serverSelectionTimeoutMS: 30000,
      connectTimeoutMS: 30000,
      socketTimeoutMS: 30000,
      maxPoolSize: 10,
      retryWrites: true,
      retryReads: true,
    }).then((m) => {
      console.log('✅ MongoDB connected successfully');
      return m;
    }).catch((error) => {
      console.error('❌ MongoDB connection failed:', error.message);
      global._mongoose!.promise = null; // Reset para permitir nova tentativa
      throw error;
    });
  }

  global._mongoose!.conn = await global._mongoose!.promise;
  return global._mongoose!.conn;
}
