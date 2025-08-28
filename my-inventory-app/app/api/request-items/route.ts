import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";

// POST /api/request-items
// body: { productId: number, quantity?: number, pricePerUnit?: string|number, supplier?: string, customer?: string }
export async function POST(req: Request) {
  try {
    const { productId, quantity = 1, pricePerUnit = "0", supplier, customer } = await req.json();

    // проверим, что товар существует
    const product = await prisma.product.findUnique({ where: { id: Number(productId) } });
    if (!product) return NextResponse.json({ error: "Продукт не найден" }, { status: 404 });

    const item = await prisma.requestItem.create({
      data: {
        productId: product.id,
        quantity: Number(quantity) || 1,
        pricePerUnit: pricePerUnit?.toString() ?? "0",
        supplier: supplier || "неизвестный поставщик",
        customer: customer || "покупатель",
        status: "CANDIDATE",
        requestId: null, // в начале всегда null
      },
      include: { product: true },
    });

    return NextResponse.json(item, { status: 201 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Не удалось создать кандидата" }, { status: 500 });
  }
}

// GET /api/request-items?status=candidate|in_request|extra
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const statusParam = (searchParams.get("status") || "candidate").toUpperCase();

    const allowed = ["CANDIDATE", "IN_REQUEST", "EXTRA"];
    const status = allowed.includes(statusParam) ? (statusParam as any) : "CANDIDATE";

    const items = await prisma.requestItem.findMany({
      where: { status },
      include: {
        product: {
          include: { images: true, category: true },
        },
        request: true,
      },
      orderBy: { id: "desc" },
    });

    // добавляем вычисляемые поля
    const withComputed = items.map((it) => ({
      ...it,
      totalCost: (Number(it.pricePerUnit) * it.quantity).toString(), // строкой (Decimal)
      remainingQuantity: Math.max(0, it.quantity - it.deliveredQuantity),
      deliveryProgress: `${it.deliveredQuantity}/${it.quantity}`,
    }));

    return NextResponse.json(withComputed);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Не удалось получить позиции" }, { status: 500 });
  }
}
