// app/api/product-units/page-data/route.ts
import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      include: {
        spines: {
          include: {
            productUnits: {
              include: {
                product: {
                  include: {
                    images: { where: { isMain: true }, take: 1 },
                    brand: true
                  }
                }
              }
            }
          }
        }
      },
      orderBy: { human_path: 'asc' }
    });

    const totalUnits = await prisma.productUnit.count();
    const candidateUnits = await prisma.productUnit.count({ 
      where: { statusCard: "CANDIDATE" } 
    });
    const totalCategories = categories.length;
    const totalSpines = categories.reduce((sum, cat) => sum + cat.spines.length, 0);

    return NextResponse.json({
      ok: true,
      categories,
      totalUnits,
      candidateUnits,
      totalCategories,
      totalSpines
    });
  } catch (error) {
    console.error("Error loading page data:", error);
    return NextResponse.json({ 
      ok: false, 
      error: "Failed to load data" 
    }, { status: 500 });
  }
}