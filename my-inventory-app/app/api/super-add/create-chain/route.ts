import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import { ProductUnitCardStatus } from "@prisma/client";
import { generateSlug } from "@/app/lib/translit";
import { generateSerialNumber, copyProductDataToUnit, updateSpineBrandData } from "@/app/api/product-units/helpers";
import { nodeIndexService } from "@/app/lib/node-index/NodeIndexService";

export async function POST(req: Request) {
  console.log("=== SUPER_ADD: CREATE CHAIN ===");
  
  try {
    const body = await req.json();
    const { 
      category, 
      spine, 
      product, 
      unitOptions, 
      requestOptions 
    } = body;

    console.log("📥 SUPER_ADD данные:", { 
      category: !!category, 
      spine: !!spine, 
      product: !!product,
      unitOptions,
      requestOptions 
    });

    // === ИСПРАВЛЕННАЯ ВАЛИДАЦИЯ ===
    // Product обязателен ТОЛЬКО если создается товар
    if (product) {
      if (!product.name || !product.code) {
        return NextResponse.json({ 
          ok: false, 
          error: "Product name and code are required when creating product" 
        }, { status: 400 });
      }
    }

    // Должна быть хотя бы одна сущность для создания
    if (!category && !spine && !product) {
      return NextResponse.json({ 
        ok: false, 
        error: "At least one entity (category, spine, or product) is required" 
      }, { status: 400 });
    }

    // Транзакция для всей цепочки
    const result = await prisma.$transaction(async (tx) => {
      let categoryId: number | null = null;
      let spineId: number | null = null;
      let productId: number | null = null;
      let createdUnit: any = null;
      let createdRequest: any = null;

      let parentCategory: any = null;

      // === 1. СОЗДАНИЕ КАТЕГОРИИ (если нужно) ===
      if (category && category.name) {
        console.log("🔄 Создание категории:", category.name);
        
        const categorySlug = await generateUniqueSlug(tx.category, category.name);
        const categoryPath = `/${categorySlug}`;

        // Генерируем node_index и human_path
        const categoryIndexes = await nodeIndexService.generateCategoryIndex(null, category.name);

        const newCategory = await tx.category.create({
          data: {
            name: category.name.trim(),
            slug: categorySlug,
            path: categoryPath,
            node_index: categoryIndexes.node_index,
            human_path: categoryIndexes.human_path,
            parent_id: null,
          },
        });
        categoryId = newCategory.id;
        parentCategory = newCategory;
        console.log("✅ Категория создана:", { 
          id: newCategory.id, 
          node_index: newCategory.node_index,
          human_path: newCategory.human_path 
        });
      }

      // === 2. СОЗДАНИЕ SPINE (если нужно) ===
      if (spine && spine.name) {
        console.log("🔄 Создание spine:", spine.name);
        
        // Если categoryId не указан, но есть selectedNode (из фронтенда)
        if (!categoryId && selectedNode?.categoryId) {
          categoryId = selectedNode.categoryId;
        }
        
        if (!categoryId) {
          throw new Error("Category ID required for spine creation");
        }

        const spineSlug = await generateUniqueSlug(tx.spine, spine.name);
        
        // Получаем категорию для генерации индексов
        const spineCategory = parentCategory || await tx.category.findUnique({
          where: { id: categoryId }
        });

        if (!spineCategory) {
          throw new Error("Category not found for spine creation");
        }

        // Генерируем node_index и human_path для spine
        const spineIndexes = await nodeIndexService.generateSpineIndex(
          spineCategory, 
          spineSlug, 
          spine.name
        );

        const newSpine = await tx.spine.create({
          data: {
            name: spine.name.trim(),
            slug: spineSlug,
            categoryId: categoryId,
            node_index: spineIndexes.node_index,
            human_path: spineIndexes.human_path,
          },
        });
        spineId = newSpine.id;
        console.log("✅ Spine создан:", { 
          id: newSpine.id,
          node_index: newSpine.node_index,
          human_path: newSpine.human_path 
        });
      }

      // === 3. СОЗДАНИЕ PRODUCT (если нужно) ===
      if (product && product.name && product.code) {
        console.log("🔄 Создание продукта:", product.name);
        
        // Находим spine для продукта
        let productSpine = null;
        if (spineId) {
          productSpine = await tx.spine.findUnique({
            where: { id: spineId },
            include: { category: true }
          });
        }

        if (!productSpine && spine && spine.name) {
          throw new Error("Spine not found for product creation");
        }

        // Генерируем node_index и human_path для продукта
        let productNodeIndex = null;
        let productHumanPath = null;

        if (productSpine) {
          const productIndexes = await nodeIndexService.generateProductIndex(
            productSpine,
            product.code,
            product.name
          );
          productNodeIndex = productIndexes.node_index;
          productHumanPath = productIndexes.human_path;
        }

        const productData: any = {
          name: product.name.trim(),
          code: product.code.trim(),
          description: product.description || "",
          brandId: product.brandId || null,
          node_index: productNodeIndex,
          human_path: productHumanPath,
        };

        // Привязываем к категории и spine если созданы
        if (categoryId) productData.categoryId = categoryId;
        if (spineId) productData.spineId = spineId;

        const newProduct = await tx.product.create({
          data: productData,
          include: {
            category: true,
            brand: true,
            spine: true,
            images: true
          }
        });
        productId = newProduct.id;
        console.log("✅ Продукт создан:", { 
          id: newProduct.id,
          node_index: newProduct.node_index,
          human_path: newProduct.human_path 
        });

        // === 4. СОЗДАНИЕ PRODUCT UNIT (если нужно) ===
        if (unitOptions && unitOptions.createUnit && productId) {
          console.log("🔄 Создание Product Unit");
          
          const serialNumber = await generateSerialNumber(tx, productId, undefined);

          const unitData = {
            productId: newProduct.id,
            spineId: newProduct.spineId,
            supplierId: unitOptions.supplierId || null,
            ...copyProductDataToUnit(newProduct),
            serialNumber,
            statusCard: unitOptions.makeCandidate ? ProductUnitCardStatus.CANDIDATE : ProductUnitCardStatus.CLEAR,
            requestPricePerUnit: unitOptions.requestPricePerUnit || null,
            logs: {
              create: {
                type: "SYSTEM",
                message: `Unit создан через SUPER_ADD${unitOptions.makeCandidate ? ' (кандидат)' : ''}`,
                meta: { 
                  source: "SUPER_ADD",
                  node_index: newProduct.node_index,
                  human_path: newProduct.human_path
                }
              },
            },
          };

          // Если делаем кандидатом - добавляем данные кандидата
          if (unitOptions.makeCandidate) {
            unitData.quantityInCandidate = 1;
            unitData.createdAtCandidate = new Date();
          }

          createdUnit = await tx.productUnit.create({
            data: unitData,
            include: { 
              logs: true,
              product: {
                include: {
                  brand: true,
                  images: true
                }
              }
            },
          });
          console.log("✅ Product Unit создан:", createdUnit.id);

          // Обновляем Spine brand data
          if (newProduct.spineId) {
            await updateSpineBrandData(tx, newProduct.spineId, {
              brandName: newProduct.brand?.name || "Без бренда",
              displayName: newProduct.name,
              imagePath: newProduct.images?.[0]?.path || null,
              productCode: newProduct.code
            });
          }

          // === 5. СОЗДАНИЕ ЗАЯВКИ (если нужно) ===
          if (requestOptions && unitOptions.makeCandidate) {
            console.log("🔄 Создание заявки");
            
            // Обновляем unit для заявки
            createdUnit = await tx.productUnit.update({
              where: { id: createdUnit.id },
              data: {
                statusCard: ProductUnitCardStatus.IN_REQUEST,
                quantityInRequest: requestOptions.quantity || 1,
                requestPricePerUnit: requestOptions.pricePerUnit || unitOptions.requestPricePerUnit,
                createdAtRequest: new Date(),
                logs: {
                  create: {
                    type: "REQUEST_CREATED",
                    message: `Заявка создана через SUPER_ADD (${requestOptions.quantity} шт. по ${requestOptions.pricePerUnit} руб.)`,
                    meta: {
                      quantity: requestOptions.quantity,
                      pricePerUnit: requestOptions.pricePerUnit,
                      source: "SUPER_ADD",
                      node_index: newProduct.node_index
                    }
                  }
                }
              },
              include: {
                logs: {
                  orderBy: { createdAt: 'desc' }
                }
              }
            });
            
            createdRequest = {
              quantity: requestOptions.quantity,
              pricePerUnit: requestOptions.pricePerUnit,
              total: requestOptions.quantity * requestOptions.pricePerUnit
            };
            console.log("✅ Заявка создана");
          }
        }
      }

      return {
        category: categoryId ? { 
          id: categoryId, 
          name: category?.name,
          node_index: parentCategory?.node_index 
        } : null,
        spine: spineId ? { 
          id: spineId, 
          name: spine?.name,
          node_index: (await tx.spine.findUnique({ where: { id: spineId } }))?.node_index 
        } : null,
        product: productId ? {
          ...(await tx.product.findUnique({ 
            where: { id: productId },
            include: { brand: true, category: true, spine: true }
          })),
          node_index: productNodeIndex,
          human_path: productHumanPath
        } : null,
        unit: createdUnit,
        request: createdRequest
      };
    });

    console.log("🎉 SUPER_ADD цепочка создана успешно!");
    
    return NextResponse.json({ 
      ok: true, 
      data: result,
      message: "Цепочка создана успешно с Node Index системой"
    });

  } catch (err: any) {
    console.error("💥 SUPER_ADD ошибка:", err);
    
    if (err.code === "P2002") {
      return NextResponse.json(
        { ok: false, error: "Конфликт уникальных данных (slug, code или node_index уже существует)" },
        { status: 400 }
      );
    }
    
    return NextResponse.json({ 
      ok: false, 
      error: err.message || "Internal server error" 
    }, { status: 500 });
  }
}

// Хелпер для генерации уникального slug
async function generateUniqueSlug(model: any, name: string): Promise<string> {
  let slug = generateSlug(name.trim());
  const originalSlug = slug;
  let counter = 1;

  while (await model.findUnique({ where: { slug } })) {
    slug = `${originalSlug}-${counter}`;
    counter++;
  }

  return slug;
}