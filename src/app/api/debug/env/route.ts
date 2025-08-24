// Debug page to check environment variables
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const mongoUri = process.env.MONGODB_URI;
  const nextAuthSecret = process.env.NEXTAUTH_SECRET;
  const nextAuthUrl = process.env.NEXTAUTH_URL;
  const publicAppUrl = process.env.NEXT_PUBLIC_APP_URL;
  
  return NextResponse.json({
    hasMongoUri: !!mongoUri,
    mongoUriLength: mongoUri?.length || 0,
    mongoUriStart: mongoUri?.substring(0, 20) || 'N/A',
    mongoUriEnd: mongoUri?.substring(mongoUri.length - 20) || 'N/A',
    startsWithMongodb: mongoUri?.startsWith('mongodb://') || false,
    startsWithMongodbSrv: mongoUri?.startsWith('mongodb+srv://') || false,
    
    // NextAuth variables
    hasNextAuthSecret: !!nextAuthSecret,
    nextAuthSecretLength: nextAuthSecret?.length || 0,
    nextAuthUrl: nextAuthUrl || 'N/A',
    publicAppUrl: publicAppUrl || 'N/A',
    
    nodeEnv: process.env.NODE_ENV,
    allEnvKeys: Object.keys(process.env).filter(key => 
      key.includes('MONGO') || key.includes('NEXT') || key.includes('AUTH')
    ).sort()
  });
}
