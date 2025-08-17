// src/lib/db.ts
import mongoose from "mongoose";

declare global {
  // eslint-disable-next-line no-var
  var _mongoose: { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null } | undefined;
}

if (!global._mongoose) {
  global._mongoose = { conn: null, promise: null };
}

export async function dbConnect() {
  const uri = process.env.MONGODB_URI; // não lance erro no topo do módulo
  if (!uri) {
    // log claro e erro somente quando a função for chamada
    console.error("[DB] MONGODB_URI ausente. Configure na Vercel (Production/Preview) ou .env.local no dev.");
    throw new Error("MONGODB_URI ausente");
  }

  if (global._mongoose!.conn) return global._mongoose!.conn;

  if (!global._mongoose!.promise) {
    global._mongoose!.promise = mongoose.connect(uri, {
      // opções se necessário
      // serverSelectionTimeoutMS: 15000,
    }).then((m) => m);
  }

  global._mongoose!.conn = await global._mongoose!.promise;
  return global._mongoose!.conn;
}
