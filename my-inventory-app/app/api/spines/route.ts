// app/api/spines/route.ts
import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const categoryId = searchParams.get("categoryId");

  const where: any = {};
  if (categoryId) where.categoryId = Number(categoryId);

  const spines = await prisma.spine.findMany({
    where,
    include: {
      products: {
        select: { id: true, name: true, code: true, images: { where: { isMain: true }, select: { path: true }, take: 1 } },
      },
      productUnits: {
        select: { id: true, serialNumber: true, statusCard: true },
        take: 20,
      },
    },
    orderBy: { name: "asc" },
  });

  return NextResponse.json(spines);
}

export async function POST(request: Request) {
  const body = await request.json();
  // body: { name, slug?, categoryId?, imagePath? }
  if (!body.name) return NextResponse.json({ error: "name required" }, { status: 400 });

  const spine = await prisma.spine.create({
    data: {
      name: body.name,
      slug: body.slug ?? body.name.toLowerCase().replace(/\s+/g, "-"),
      categoryId: body.categoryId ?? null,
      imagePath: body.imagePath ?? "/images/spine-placeholder.png", // заглушка
    },
  });

  return NextResponse.json(spine);
}
