import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import User from "@/models/User";

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    
    if (!email) {
      return NextResponse.json({ error: 'Email required' }, { status: 400 });
    }
    
    const user = await User.findOne({
      email: email.toLowerCase()
    }).select('name email role userType isActive lastLoginAt createdAt').lean();
    
    if (!user) {
      return NextResponse.json({ 
        found: false,
        message: 'User not found'
      });
    }
    
    return NextResponse.json({
      found: true,
      user: {
        name: (user as any).name,
        email: (user as any).email,
        role: (user as any).role,
        userType: (user as any).userType,
        isActive: (user as any).isActive,
        lastLoginAt: (user as any).lastLoginAt,
        createdAt: (user as any).createdAt
      }
    });
  } catch (error) {
    console.error('[USER_DEBUG] Error:', error);
    return NextResponse.json({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
