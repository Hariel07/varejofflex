import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function GET(req: NextRequest) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    return NextResponse.json({
      success: true,
      token,
      hasUserType: !!(token as any)?.userType,
      debugKeys: token ? Object.keys(token) : [],
    });
  } catch (e:any) {
    return NextResponse.json({ success:false, error: e.message });
  }
}
