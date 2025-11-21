// app/api/product-units/create/route.ts
import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import { ProductUnitCardStatus } from "@prisma/client";
import { 
  generateSerialNumber, 
  copyProductDataToUnit,
  updateSpineBrandData
} from "@/app/api/product-units/helpers";
import { UnitCloneHelper } from "@/app/lib/helper_product_units/unitCloneHelper"; 

export async function POST(req: Request) {
  console.log("=== API: CREATE PRODUCT UNIT ===");
  
  try {
    const body = await req.json();
    const { productId, supplierId, requestPricePerUnit, cloneFromUnitId } = body;

    console.log("📥 Полученные данные:", { productId, supplierId, requestPricePerUnit, cloneFromUnitId });

    // ✅ ВАРИАНТ 1: Клонирование из существующего Unit
    if (cloneFromUnitId) {
      console.log("🔄 Режим клонирования из unit:", cloneFromUnitId);
      
      const newUnit = await UnitCloneHelper.createClearClone(cloneFromUnitId);
      
      return NextResponse.json({ 
        ok: true, 
        data: newUnit,
        mode: "clone"
      });
    }

    // ✅ ВАРИАНТ 2: Создание из Product (существующая логика)
    if (!productId) {
      return NextResponse.json({ 
        ok: false, 
        error: "productId или cloneFromUnitId required" 
      }, { status: 400 });
    }

    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: { category: true, spine: true, images: true, brand: true },
    });

    if (!product) {
      return NextResponse.json({ ok: false, error: "Product not found" }, { status: 404 });
    }

    if (!product.spineId) {
      return NextResponse.json({
        ok: false,
        error: "У продукта отсутствует Spine. Пересоздайте продукт.",
      }, { status: 400 });
    }

    const serialNumber = await generateSerialNumber(prisma, productId, undefined);

    // 🎯 ИЗМЕНЕНИЕ: УЛУЧШЕННОЕ ЛОГИРОВАНИЕ ПРИ СОЗДАНИИ
    const unitData = {
      productId: product.id,
      spineId: product.spineId,
      supplierId: supplierId || null,
      ...copyProductDataToUnit(product),
      serialNumber,
      statusCard: ProductUnitCardStatus.CLEAR,
      requestPricePerUnit: requestPricePerUnit || null,
      logs: {
        create: {
          type: "UNIT_CREATED",
          message: `Unit создан со статусом CLEAR${supplierId ? ' от поставщика' : ''}${requestPricePerUnit ? `, цена: ${requestPricePerUnit} ₽` : ''}`,
          meta: {
            initialStatus: "CLEAR",
            supplierId: supplierId,
            requestPricePerUnit: requestPricePerUnit,
            source: "product_creation",
            productId: product.id,
            productCode: product.code,
            productName: product.name,
            spineId: product.spineId
          }
        },
      },
    };

    const newUnit = await prisma.productUnit.create({
      data: unitData,
      include: { 
        logs: true, 
        supplier: true, 
        spine: true,
        product: {
          include: {
            brand: true,
            images: true
          }
        }
      },
    });

    // ✅ ОБНОВЛЯЕМ SPINE BRAND DATA
    console.log("🔄 Обновляем Spine.brandData...");
    await updateSpineBrandData(product.spineId, {
      brandName: product.brand?.name || "Без бренда",
      displayName: product.name,
      imagePath: product.images?.[0]?.path || null,
      productCode: product.code
    });
    console.log("✅ Spine.brandData обновлен");

    return NextResponse.json({ 
      ok: true, 
      data: newUnit,
      mode: "create_from_product"
    });

  } catch (err: any) {
    console.error("💥 Ошибка в API:", err);
    
    if (err.code === "P2002") {
      return NextResponse.json(
        { ok: false, error: "Product unit with this serial number already exists" },
        { status: 400 }
      );
    }
    
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}