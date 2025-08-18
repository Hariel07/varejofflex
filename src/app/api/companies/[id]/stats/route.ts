import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Company from "@/models/Company";
import Product from "@/models/Product";
import Order from "@/models/Order";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { errorResponse } from "@/utils/errors";
import { logger } from "@/utils/logger";

export const runtime = "nodejs";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = session.user as any;
    const { id: companyId } = await params;

    // Verificar se o usuário pode acessar esta empresa
    if (user.userType === "lojista" && user.companyId !== companyId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await dbConnect();

    // Verificar se a empresa existe
    const company = await Company.findById(companyId);
    if (!company) {
      return NextResponse.json({ error: "Company not found" }, { status: 404 });
    }

    // Buscar estatísticas da empresa
    const [totalProducts, totalOrders, pendingOrders] = await Promise.all([
      Product.countDocuments({ companyId }),
      Order.countDocuments({ companyId }),
      Order.countDocuments({ companyId, status: "pending" })
    ]);

    // Calcular receita mensal (implementação básica)
    const currentMonth = new Date();
    currentMonth.setDate(1);
    currentMonth.setHours(0, 0, 0, 0);

    const monthlyRevenue = await Order.aggregate([
      {
        $match: {
          companyId: companyId,
          createdAt: { $gte: currentMonth },
          status: { $in: ["completed", "delivered"] }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$total" }
        }
      }
    ]);

    const revenue = monthlyRevenue[0]?.total || 0;

    logger.info(`Company stats requested for ${companyId} by: ${user.email}`);

    return NextResponse.json({
      totalProducts,
      totalOrders,
      pendingOrders,
      monthlyRevenue: revenue
    });

  } catch (error) {
    logger.error(`GET /api/companies/[id]/stats failed:`, error);
    return errorResponse(error);
  }
}