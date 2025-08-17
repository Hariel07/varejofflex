// src/app/api/auth/forgot/route.ts
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { Types } from "mongoose";
import { dbConnect } from "@/lib/db";
import User from "@/models/User";
import PasswordResetToken from "@/models/PasswordResetToken";

export const runtime = "nodejs";

type LeanUser = {
  _id: Types.ObjectId;
  email: string;
  name?: string;
};

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email) {
      return NextResponse.json(
        { ok: false, error: "E_VALIDATION", message: "E-mail é obrigatório." },
        { status: 400 }
      );
    }

    await dbConnect();

    // TIPAGEM EXPLÍCITA no lean() para evitar o union (array|doc)
    const user = await User.findOne({ email: email.toLowerCase() })
      .select("_id email name")
      .lean<LeanUser | null>();

    // Não vazar existência do e-mail
    if (!user) {
      return NextResponse.json({ ok: true });
    }

    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000); // 30 min

    await PasswordResetToken.create({
      userId: user._id,
      token,
      expiresAt,
    });

    const base = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const resetUrl = `${base}/reset-password?token=${token}`;

    // Em desenvolvimento, mostramos o link no console do servidor
    console.log("[DEV] Link de reset:", resetUrl);

    // TODO: enviar e-mail real com o link
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("forgot error", e);
    return NextResponse.json({ ok: false, error: "E_INTERNAL" }, { status: 500 });
  }
}
