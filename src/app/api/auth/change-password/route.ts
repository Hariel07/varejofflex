// src/app/api/auth/change-password/route.ts
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { dbConnect } from "@/lib/db";
import User from "@/models/User";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email)
      return NextResponse.json({ ok: false, error: "E_AUTH" }, { status: 401 });

    const { currentPassword, newPassword } = await req.json();
    if (!currentPassword || !newPassword)
      return NextResponse.json({ ok: false, error: "E_VALIDATION" }, { status: 400 });

    await dbConnect();
    const user = await User.findOne({ email: session.user.email });
    if (!user) return NextResponse.json({ ok: false, error: "E_NOT_FOUND" }, { status: 404 });

    const ok = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!ok) return NextResponse.json({ ok: false, error: "E_BAD_CREDENTIALS" }, { status: 400 });

    user.passwordHash = await bcrypt.hash(newPassword, 10);
    user.passwordUpdatedAt = new Date();
    await user.save();

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("change-password error", e);
    return NextResponse.json({ ok: false, error: "E_INTERNAL" }, { status: 500 });
  }
}
