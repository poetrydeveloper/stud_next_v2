// app/api/product-units/[id]/sprout/route.ts
import prisma from "@/app/lib/prisma";
import { NextResponse } from "next/server";
import { copyParentUnitData, generateSerialNumber } from "@/app/api/product-units/helpers";
import { ProductUnitCardStatus } from "@prisma/client";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  console.log("=== API: CREATE SPROUTED REQUEST ===");
  
  const id = Number(params.id);
  console.log("📥 Sprout для unit ID:", id);

  try {
    const body = await req.json();
    const { requests } = body;

    console.log("📥 Полученные requests:", requests);

    if (!requests || !Array.isArray(requests) || requests.length === 0) {
      console.error("❌ Неверный формат requests");
      return NextResponse.json({ 
        ok: false, 
        error: "requests array required with at least one item" 
      }, { status: 400 });
    }

    // Валидация каждого request
    for (const r of requests) {
      if (!r.quantity || r.quantity < 1) {
        console.error("❌ Неверное quantity в request:", r);
        return NextResponse.json({ 
          ok: false, 
          error: "Each request must have quantity >= 1" 
        }, { status: 400 });
      }
      if (!r.pricePerUnit || r.pricePerUnit <= 0) {
        console.error("❌ Неверная pricePerUnit в request:", r);
        return NextResponse.json({ 
          ok: false, 
          error: "Each request must have pricePerUnit > 0" 
        }, { status: 400 });
      }
    }

    console.log("✅ Валидация requests пройдена");

    return await prisma.$transaction(async (tx) => {
      console.log("🔄 Начало транзакции...");

      // Получаем родительский unit
      const parent = await tx.productUnit.findUnique({ 
        where: { id },
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
        console.error("❌ Родительский unit не найден:", id);
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

      // Обновляем родителя в SPROUTED
      console.log("🔄 Обновляем родителя в SPROUTED...");
      const updatedParent = await tx.productUnit.update({
        where: { id },
        data: { 
          statusCard: "SPROUTED",
          logs: {
            create: {
              type: "SPROUTED",
              message: `Unit преобразован в SPROUTED для создания ${requests.length} дочерних заявок`,
              meta: {
                childrenCount: requests.length,
                totalQuantity: requests.reduce((sum, r) => sum + r.quantity, 0)
              }
            }
          }
        },
      });

      console.log("✅ Родитель обновлен в SPROUTED");

      const createdChildren = [];
      let totalQuantity = 0;

      // Создаем дочерние units
      console.log(`🔄 Создаем ${requests.length} дочерних units...`);
      
      for (const r of requests) {
        totalQuantity += r.quantity;
        
        console.log(`🔄 Создаем дочерний unit ${r.quantity} шт. по цене ${r.pricePerUnit}...`);

        const childData = copyParentUnitData(parent, {
          quantityInRequest: r.quantity,
          requestPricePerUnit: r.pricePerUnit,
          serialNumber: await generateSerialNumber(prisma, parent.productId, parent.id),
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
            message: `Дочерний unit создан из родителя ${parent.serialNumber}, количество: ${r.quantity}, цена: ${r.pricePerUnit}`,
            meta: {
              parentUnitId: parent.id,
              parentSerialNumber: parent.serialNumber,
              quantity: r.quantity,
              pricePerUnit: r.pricePerUnit
            }
          },
        });
      }

      // Логируем операцию sprout у родителя
      await tx.productUnitLog.create({
        data: {
          productUnitId: id,
          type: "SPROUT_COMPLETED",
          message: `Разветвление завершено: создано ${requests.length} дочерних заявок, общее количество: ${totalQuantity}`,
          meta: {
            childrenCount: requests.length,
            totalQuantity: totalQuantity,
            children: createdChildren.map(c => ({
              id: c.id,
              serialNumber: c.serialNumber,
              quantity: requests.find(r => r.quantity === c.quantityInRequest)?.quantity
            }))
          }
        },
      });

      console.log("✅ Транзакция завершена успешно");

      return NextResponse.json({ 
        ok: true, 
        data: {
          parent: updatedParent,
          children: createdChildren,
          childrenCount: requests.length,
          totalQuantity: totalQuantity
        },
        message: `Создано ${requests.length} дочерних заявок на общее количество ${totalQuantity} единиц`
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