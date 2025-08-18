import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Company from "@/models/Company";
import User from "@/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { errorResponse } from "@/utils/errors";
import { logger } from "@/utils/logger";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = session.user as any;
    
    // Apenas Owner SaaS pode acessar estas estatísticas
    if (user.userType !== "owner_saas") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await dbConnect();

    // Buscar estatísticas gerais
    const [totalCompanies, activeCompanies, totalUsers] = await Promise.all([
      Company.countDocuments(),
      Company.countDocuments({ isActive: true }),
      User.countDocuments({ role: { $ne: "owner_saas" } })
    ]);

    // Distribuição por segmento
    const segmentDistribution = await Company.aggregate([
      {
        $group: {
          _id: "$segment",
          count: { $sum: 1 }
        }
      }
    ]);

    const segmentData = segmentDistribution.reduce((acc, item) => {
      acc[item._id] = item.count;
      return acc;
    }, {} as { [key: string]: number });

    // Receita fictícia (implementar lógica real futuramente)
    const revenue = activeCompanies * 97; // R$ 97 por empresa ativa (plano básico)

    logger.info(`Owner dashboard stats requested by: ${user.email}`);

    return NextResponse.json({
      totalCompanies,
      activeCompanies,
      totalUsers,
      revenue,
      segmentDistribution: segmentData
    });

  } catch (error) {
    logger.error("GET /api/admin/stats failed:", error);
    return errorResponse(error);
  }
}