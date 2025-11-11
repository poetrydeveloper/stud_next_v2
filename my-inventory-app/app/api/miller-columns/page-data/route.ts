// app/api/miller-columns/page-data/route.ts
import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";

export async function GET() {
  try {
    console.log("🌳 Loading Miller Columns page data...");
    
    // Получаем полное дерево категорий с детьми
    const categories = await prisma.category.findMany({
      where: {
        parent_id: null // Только корневые категории
      },
      include: {
        children: {
          include: {
            children: {
              include: {
                spines: {
                  include: {
                    products: {
                      include: {
                        brand: true,
                        images: { where: { isMain: true }, take: 1 }
                      }
                    }
                  }
                }
              }
            },
            spines: {
              include: {
                products: {
                  include: {
                    brand: true,
                    images: { where: { isMain: true }, take: 1 }
                  }
                }
              }
            }
          }
        },
        spines: {
          include: {
            products: {
              include: {
                brand: true,
                images: { where: { isMain: true }, take: 1 }
              }
            }
          }
        }
      },
      orderBy: { name: 'asc' }
    });

    console.log(`✅ Loaded ${categories.length} root categories with full tree`);

    // Преобразуем в формат для Miller Columns
    const treeData = categories.map(category => ({
      id: category.id,
      name: category.name,
      path: category.path,
      type: 'category' as const,
      hasChildren: category.children.length > 0 || category.spines.length > 0,
      children: [
        // Подкатегории уровня 2
        ...category.children.map(subCategory => ({
          id: subCategory.id,
          name: subCategory.name,
          path: subCategory.path,
          type: 'category' as const,
          hasChildren: subCategory.children.length > 0 || subCategory.spines.length > 0,
          children: [
            // Подкатегории уровня 3
            ...subCategory.children.map(subSubCategory => ({
              id: subSubCategory.id,
              name: subSubCategory.name,
              path: subSubCategory.path,
              type: 'category' as const,
              hasChildren: subSubCategory.spines.length > 0,
              spines: subSubCategory.spines.map(spine => ({
                id: spine.id,
                name: spine.name,
                path: spine.slug, // или используем node_index
                type: 'spine' as const,
                hasProducts: spine.products.length > 0,
                products: spine.products.map(product => ({
                  id: product.id,
                  name: product.name,
                  code: product.code,
                  brand: product.brand.name,
                  type: 'product' as const,
                  path: product.node_index || product.code
                }))
              }))
            })),
            // Спайны уровня 3
            ...subCategory.spines.map(spine => ({
              id: spine.id,
              name: spine.name,
              path: spine.slug,
              type: 'spine' as const,
              hasProducts: spine.products.length > 0,
              products: spine.products.map(product => ({
                id: product.id,
                name: product.name,
                code: product.code,
                brand: product.brand.name,
                type: 'product' as const,
                path: product.node_index || product.code
              }))
            }))
          ]
        })),
        // Спайны уровня 2
        ...category.spines.map(spine => ({
          id: spine.id,
          name: spine.name,
          path: spine.slug,
          type: 'spine' as const,
          hasProducts: spine.products.length > 0,
          products: spine.products.map(product => ({
            id: product.id,
            name: product.name,
            code: product.code,
            brand: product.brand.name,
            type: 'product' as const,
            path: product.node_index || product.code
          }))
        }))
      ]
    }));

    return NextResponse.json({
      ok: true,
      data: treeData,
      stats: {
        totalCategories: categories.length,
        totalSpines: categories.reduce((sum, cat) => sum + cat.spines.length, 0),
        totalProducts: categories.reduce((sum, cat) => 
          sum + cat.spines.reduce((spineSum, spine) => spineSum + spine.products.length, 0), 0
        )
      }
    });

  } catch (error) {
    console.error("❌ Miller Columns page data error:", error);
    return NextResponse.json({ 
      ok: false, 
      error: "Failed to load catalog data" 
    }, { status: 500 });
  }
}