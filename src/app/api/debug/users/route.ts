import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import User from "@/models/User";

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    const users = await User.find({})
      .select('name email role userType isActive createdAt')
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();
    
    return NextResponse.json({
      count: users.length,
      users: users.map((user: any) => ({
        name: user.name,
        email: user.email,
        role: user.role,
        userType: user.userType,
        isActive: user.isActive,
        createdAt: user.createdAt
      }))
    });
  } catch (error) {
    console.error('[USERS_DEBUG] Error:', error);
    return NextResponse.json({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
