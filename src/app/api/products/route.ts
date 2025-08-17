import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Product from "@/models/Product";

export async function GET() {
  await dbConnect();
  const tenantId = "demo";
  const count = await Product.countDocuments({ tenantId });
  if (count === 0) {
    await Product.insertMany([
      { tenantId, name: "X-Burger", description: "Pão, carne, queijo", price: 18.9, category: "Hambúrgueres" },
      { tenantId, name: "X-Salada", description: "Pão, carne, queijo, salada", price: 22.9, category: "Hambúrgueres" },
      { tenantId, name: "Batata média", description: "Crocante", price: 12.0, category: "Acompanhamentos" },
      { tenantId, name: "Refrigerante lata", description: "350ml", price: 7.0, category: "Bebidas" },
    ]);
  }
  const items = await Product.find({ tenantId, active: true }).sort({ category: 1, name: 1 }).lean();
  return NextResponse.json(items);
}
