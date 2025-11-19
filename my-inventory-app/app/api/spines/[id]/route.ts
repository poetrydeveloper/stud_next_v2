// app/api/spines/[id]/route.ts
import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";

export async function GET(
  request: Request, 
  { params }: { params: Promise<{ id: string }> } // ← Добавляем Promise
) {
  try {
    const { id } = await params; // ← await params
    const spineId = Number(id);
    
    if (isNaN(spineId)) {
      return NextResponse.json({ error: "Invalid spine ID" }, { status: 400 });
    }

    const spine = await prisma.spine.findUnique({
      where: { id: spineId },
      include: {
        products: { 
          take: 50, 
          include: { 
            images: true 
          } 
        },
        productUnits: true,
      },
    });
    
    if (!spine) {
      return NextResponse.json({ error: "Spine not found" }, { status: 404 });
    }
    
    return NextResponse.json(spine);
  } catch (error) {
    console.error("Error fetching spine:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(
  request: Request, 
  { params }: { params: Promise<{ id: string }> } // ← Добавляем Promise
) {
  try {
    const { id } = await params; // ← await params
    const spineId = Number(id);
    const body = await request.json();
    
    if (isNaN(spineId)) {
      return NextResponse.json({ error: "Invalid spine ID" }, { status: 400 });
    }

    const updated = await prisma.spine.update({
      where: { id: spineId },
      data: {
        name: body.name,
        categoryId: body.categoryId ?? undefined,
        imagePath: body.imagePath ?? undefined,
        slug: body.slug ?? undefined,
      },
    });
    
    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error updating spine:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request, 
  { params }: { params: Promise<{ id: string }> } // ← Добавляем Promise
) {
  try {
    const { id } = await params; // ← await params
    const spineId = Number(id);
    
    if (isNaN(spineId)) {
      return NextResponse.json({ error: "Invalid spine ID" }, { status: 400 });
    }

    await prisma.spine.delete({ where: { id: spineId } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Error deleting spine:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}