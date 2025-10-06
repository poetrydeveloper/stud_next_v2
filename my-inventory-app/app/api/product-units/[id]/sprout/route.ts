// app/api/product-units/[id]/sprout/route.ts
import prisma from "@/app/lib/prisma";
import { NextResponse } from "next/server";
import { copyParentUnitData, generateSerialNumber, copyProductDataToUnit } from "@/app/api/product-units/helpers";
import { ProductUnitCardStatus } from "@prisma/client";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  console.log("=== API: CREATE SPROUTED REQUEST ===");
  
  const { id } = await params;
  const unitId = Number(id);
  console.log("📥 Sprout для unit ID:", unitId);

  try {
    const body = await req.json();
    const { requests } = body;

    console.log("📥 Полученные requests:", requests);
    console.log("📥 Полученные requests ДЕТАЛЬНО:", JSON.stringify(requests, null, 2));

    if (!requests || !Array.isArray(requests) || requests.length === 0) {
      console.error("❌ Неверный формат requests");
      return NextResponse.json({ 
        ok: false, 
        error: "requests array required with at least one item" 
      }, { status: 400 });
    }

    // Валидация каждого request - ИСПРАВЛЕННАЯ
    for (const r of requests) {
      if (!r.quantity || r.quantity < 1) {
        console.error("❌ Неверное quantity в request:", r);
        return NextResponse.json({ 
          ok: false, 
          error: "Each request must have quantity >= 1" 
        }, { status: 400 });
      }
      
      // ИСПРАВЛЕННАЯ ВАЛИДАЦИЯ ЦЕНЫ
      if (r.pricePerUnit === undefined || r.pricePerUnit === null || r.pricePerUnit <= 0) {
        console.error("❌ Неверная pricePerUnit в request:", r);
        return NextResponse.json({ 
          ok: false, 
          error: `Each request must have pricePerUnit > 0 (received: ${r.pricePerUnit})` 
        }, { status: 400 });
      }
    }

    console.log("✅ Валидация requests пройдена");

    return await prisma.$transaction(async (tx) => {
      console.log("🔄 Начало транзакции...");

      // Получаем родительский unit
      const parent = await tx.productUnit.findUnique({ 
        where: { id: unitId },
        include: {
          product: {
            include: {
              brand: true,
              images: true,
              category: true
            }
          }
        }
      });
      
      if (!parent) {
        console.error("❌ Родительский unit не найден:", unitId);
        return NextResponse.json({ 
          ok: false, 
          error: "Parent unit not found" 
        }, { status: 404 });
      }

      console.log("✅ Родительский unit найден:", parent.serialNumber);

      // Проверяем что родитель в правильном статусе
      if (parent.statusCard !== ProductUnitCardStatus.CANDIDATE) {
        console.error("❌ Родитель не в статусе CANDIDATE:", parent.statusCard);
        return NextResponse.json({ 
          ok: false, 
          error: "Parent unit must be in CANDIDATE status" 
        }, { status: 400 });
      }

      // Создаем CLEAR replacement unit (ДОБАВЛЕНО)
      console.log("🔄 Создаем CLEAR replacement unit...");
      const clearReplacement = await tx.productUnit.create({
        data: {
          productId: parent.productId,
          spineId: parent.spineId,
          supplierId: parent.supplierId,
          ...copyProductDataToUnit(parent.product),
          serialNumber: await generateSerialNumber(prisma, parent.productId, undefined),
          statusCard: ProductUnitCardStatus.CLEAR,
          statusProduct: null,
          requestPricePerUnit: parent.requestPricePerUnit,
          logs: {
            create: {
              type: "CLEAR_REPLACEMENT",
              message: `CLEAR unit создана как замена для SPROUTED родителя`,
              meta: {
                parentUnitId: parent.id,
                parentSerialNumber: parent.serialNumber,
                purpose: "replacement_for_sprouted"
              }
            }
          }
        }
      });
      console.log("✅ CLEAR replacement создан:", clearReplacement.serialNumber);

      // Обновляем родителя в SPROUTED
      console.log("🔄 Обновляем родителя в SPROUTED...");
      const updatedParent = await tx.productUnit.update({
        where: { id: unitId },
        data: { 
          statusCard: "SPROUTED",
          logs: {
            create: {
              type: "SPROUTED",
              message: `Unit преобразован в SPROUTED для создания дочерних заявок`,
              meta: {
                requestsCount: requests.length,
                totalQuantity: requests.reduce((sum, r) => sum + r.quantity, 0),
                prices: requests.map(r => r.pricePerUnit),
                clearReplacementUnitId: clearReplacement.id // ДОБАВЛЕНО
              }
            }
          }
        },
      });

      console.log("✅ Родитель обновлен в SPROUTED");

      const createdChildren = [];
      let totalQuantity = 0;
      let childSequence = 0;

      // Создаем дочерние units
      console.log(`🔄 Создаем дочерние units...`);
      
      for (const r of requests) {
        console.log(`🔄 Обрабатываем request: ${r.quantity} шт. по цене ${r.pricePerUnit}...`);
        
        // Создаем отдельный unit для каждой единицы товара
        for (let i = 0; i < r.quantity; i++) {
          childSequence++;
          totalQuantity++;
          
          console.log(`🔄 Создаем дочерний unit ${childSequence}/${totalQuantity}...`);

          const childData = copyParentUnitData(parent, {
            quantityInRequest: 1, // ✅ КАЖДЫЙ unit = 1 штука
            requestPricePerUnit: r.pricePerUnit, // ✅ Цена передается правильно
            serialNumber: `${parent.serialNumber}/child-${childSequence}`, // ✅ Уникальный номер
            parentProductUnitId: parent.id,
            statusCard: "IN_REQUEST",
            createdAtRequest: new Date(),
          });

          const childUnit = await tx.productUnit.create({
            data: childData,
          });

          console.log(`✅ Дочерний unit создан: ${childUnit.serialNumber}`);

          createdChildren.push(childUnit);

          // Логируем создание каждого ребенка
          await tx.productUnitLog.create({
            data: {
              productUnitId: childUnit.id,
              type: "CHILD_CREATED",
              message: `Дочерний unit создан из родителя ${parent.serialNumber}, цена: ${r.pricePerUnit} ₽`,
              meta: {
                parentUnitId: parent.id,
                parentSerialNumber: parent.serialNumber,
                sequence: childSequence,
                totalQuantity: totalQuantity,
                pricePerUnit: r.pricePerUnit,
                requestIndex: requests.indexOf(r) + 1
              }
            },
          });
        }
      }

      // Логируем операцию sprout у родителя
      await tx.productUnitLog.create({
        data: {
          productUnitId: unitId,
          type: "SPROUT_COMPLETED",
          message: `Разветвление завершено: создано ${createdChildren.length} дочерних заявок и CLEAR замена`,
          meta: {
            childrenCount: createdChildren.length,
            totalQuantity: totalQuantity,
            clearReplacementUnitId: clearReplacement.id, // ДОБАВЛЕНО
            clearReplacementSerialNumber: clearReplacement.serialNumber, // ДОБАВЛЕНО
            requests: requests.map(r => ({
              quantity: r.quantity,
              pricePerUnit: r.pricePerUnit
            })),
            children: createdChildren.map(c => ({
              id: c.id,
              serialNumber: c.serialNumber,
              pricePerUnit: c.requestPricePerUnit
            }))
          }
        },
      });

      console.log("✅ Транзакция завершена успешно");
      console.log(`✅ Создано ${createdChildren.length} дочерних units и 1 CLEAR replacement`);

      return NextResponse.json({ 
        ok: true, 
        data: {
          parent: updatedParent,
          children: createdChildren,
          clearReplacementUnit: clearReplacement, // ДОБАВЛЕНО
          childrenCount: createdChildren.length,
          totalQuantity: totalQuantity,
          requests: requests
        },
        message: `Создано ${createdChildren.length} дочерних заявок и CLEAR замена`
      });
    });

  } catch (err: any) {
    console.error("💥 Ошибка в sprout endpoint:", err);
    return NextResponse.json({ 
      ok: false, 
      error: err.message 
    }, { status: 500 });
  }
}