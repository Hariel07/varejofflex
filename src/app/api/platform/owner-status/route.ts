// src/app/api/platform/owner-status/route.ts
import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import User from "@/models/User";

export async function GET() {
  try {
    await dbConnect();
    const count = await User.countDocuments({ role: "owner_saas" });
    return NextResponse.json({ available: count === 0 });
  } catch (e) {
    return NextResponse.json({ available: false, error: "E_INTERNAL" }, { status: 500 });
  }
}
