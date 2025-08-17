// src/app/api/auth/reset/route.ts
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { Types } from "mongoose";
import { dbConnect } from "@/lib/db";
import User from "@/models/User";
import PasswordResetToken from "@/models/PasswordResetToken";

export const runtime = "nodejs";

type LeanResetToken = {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  token: string;
  expiresAt: Date;
  usedAt?: Date;
};

export async function POST(req: NextRequest) {
  try {
    const { token, password } = await req.json();
    if (!token || !password) {
      return NextResponse.json(
        { ok: false, error: "E_VALIDATION", message: "Token e nova senha são obrigatórios." },
        { status: 400 }
      );
    }

    await dbConnect();

    // Tipagem explícita elimina o union (array|doc) que causava o erro
    const rec = await PasswordResetToken.findOne({ token }).lean<LeanResetToken | null>();

    if (!rec || rec.usedAt || new Date(rec.expiresAt) < new Date()) {
      return NextResponse.json({ ok: false, error: "E_TOKEN" }, { status: 400 });
    }

    const hash = await bcrypt.hash(password, 10);

    await User.updateOne(
      { _id: rec.userId },
      { $set: { passwordHash: hash, passwordUpdatedAt: new Date() } }
    );

    await PasswordResetToken.updateOne(
      { _id: rec._id },
      { $set: { usedAt: new Date() } }
    );

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("reset error", e);
    return NextResponse.json({ ok: false, error: "E_INTERNAL" }, { status: 500 });
  }
}
