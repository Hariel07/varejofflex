import mongoose from "mongoose";
import { logger } from "@/utils/logger";

const uri = process.env.MONGODB_URI!;
if (!uri) {
  throw new Error("MONGODB_URI não configurado em .env.local");
}

// Cache de conexão entre reloads no dev
type MongooseCache = { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null };
declare global { // evita duplicidade em hot-reload
  // eslint-disable-next-line no-var
  var __mongooseCache: MongooseCache | undefined;
}
const globalWithMongoose = global as any;
const cache: MongooseCache = globalWithMongoose.__mongooseCache ?? { conn: null, promise: null };
globalWithMongoose.__mongooseCache = cache;

export async function dbConnect() {
  try {
    if (cache.conn) return cache.conn;
    if (!cache.promise) {
      cache.promise = mongoose.connect(uri, {
        dbName: uri.split("/").pop() || "varejoflex",
        maxPoolSize: 10,
      }).then((m) => {
        logger.info("Mongo conectado");
        return m;
      }).catch((err) => {
        logger.error("Falha ao conectar Mongo:", err);
        cache.promise = null;
        throw err;
      });
    }
    cache.conn = await cache.promise;
    return cache.conn;
  } catch (err) {
    logger.error("dbConnect error:", err);
    throw err;
  }
}
