// app/api/spines/[id]/route.ts
import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const id = Number(params.id);
  const spine = await prisma.spine.findUnique({
    where: { id },
    include: {
      products: { take: 50, include: { images: true } },
      productUnits: true,
    },
  });
  if (!spine) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(spine);
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const id = Number(params.id);
  const body = await request.json();
  // body may include name, categoryId, imagePath
  const updated = await prisma.spine.update({
    where: { id },
    data: {
      name: body.name,
      categoryId: body.categoryId ?? undefined,
      imagePath: body.imagePath ?? undefined,
      slug: body.slug ?? undefined,
    },
  });
  return NextResponse.json(updated);
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const id = Number(params.id);
  await prisma.spine.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
