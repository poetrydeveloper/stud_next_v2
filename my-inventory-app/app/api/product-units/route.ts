// app/api/product-units/route.ts

import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import { ProductUnitCardStatus } from "@prisma/client";
import { generateSerialNumber, recalcProductUnitStats, appendLog } from "./helpers";

/**
 * GET /api/product-units?productId=
 */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const productId = url.searchParams.get("productId");

  const where: any = {};
  if (productId) where.productId = Number(productId);

  const units = await prisma.productUnit.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: 200,
    include: { product: true },
  });

  return NextResponse.json({ ok: true, data: units });
}

/**
 * POST /api/product-units
 * Создание единиц продукта как кандидатов или превращение их в заявку
 * body: { productId, parentProductUnitId?, quantity?, requestPricePerUnit?, createRequest? }
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { productId, parentProductUnitId, quantity = 1, requestPricePerUnit, createRequest } = body;

    if (!productId) return NextResponse.json({ ok: false, error: "productId required" }, { status: 400 });

    const product = await prisma.product.findUnique({ where: { id: productId }, include: { category: true } });
    if (!product) return NextResponse.json({ ok: false, error: "Product not found" }, { status: 404 });

    const createdUnits = [];

    if (createRequest && parentProductUnitId) {
      // превращаем кандидата в заявку
      const parentUnit = await prisma.productUnit.findUnique({ where: { id: parentProductUnitId } });
      if (!parentUnit) return NextResponse.json({ ok: false, error: "Parent candidate not found" }, { status: 404 });

      if (quantity === 1) {
        // обновляем существующую единицу
        const updated = await prisma.productUnit.update({
          where: { id: parentProductUnitId },
          data: {
            quantityInRequest: 1,
            createdAtRequest: new Date(),
            requestPricePerUnit,
            statusCard: ProductUnitCardStatus.IN_REQUEST,
            logs: appendLog(parentUnit.logs || [], {
              event: "CANDIDATE_TO_REQUEST",
              at: new Date().toISOString(),
              parentId: null,
              quantity: 1,
            }),
          },
        });
        createdUnits.push(updated);
      } else {
        // quantity > 1 → создаём дочерние единицы
        await prisma.productUnit.update({
          where: { id: parentProductUnitId },
          data: { statusCard: ProductUnitCardStatus.SPROUTED, logs: appendLog(parentUnit.logs || [], { event: "SPROUTED", at: new Date().toISOString() }) },
        });

        for (let i = 0; i < quantity; i++) {
          const serialNumber = await generateSerialNumber(prisma, productId, parentProductUnitId);

          const unit = await prisma.productUnit.create({
            data: {
              productId,
              parentProductUnitId,
              productCode: product.code,
              productName: product.name,
              productDescription: product.description,
              productCategoryId: product.categoryId,
              productCategoryName: product.category?.name,
              serialNumber,
              statusCard: ProductUnitCardStatus.IN_REQUEST,
              quantityInRequest: 1,
              createdAtRequest: new Date(),
              requestPricePerUnit,
              logs: appendLog([], { event: "CHILD_CREATED_FOR_REQUEST", at: new Date().toISOString(), parentId: parentProductUnitId, index: i + 1, total: quantity }),
            },
          });
          createdUnits.push(unit);
        }
      }
    } else {
      // обычное создание кандидатов
      for (let i = 0; i < quantity; i++) {
        const serialNumber = await generateSerialNumber(prisma, productId, parentProductUnitId);

        const unit = await prisma.productUnit.create({
          data: {
            productId,
            parentProductUnitId: parentProductUnitId || null,
            productCode: product.code,
            productName: product.name,
            productDescription: product.description,
            productCategoryId: product.categoryId,
            productCategoryName: product.category?.name,
            serialNumber,
            statusCard: ProductUnitCardStatus.CLEAR,
            quantityInCandidate: 0,
            createdAtCandidate: null,
            requestPricePerUnit,
            logs: appendLog([], { event: "UNIT_CREATED", at: new Date().toISOString(), source: parentProductUnitId ? "child" : "manual", parentId: parentProductUnitId ?? null, index: i + 1, total: quantity }),
          },
        });

        createdUnits.push(unit);
      }
    }

    await recalcProductUnitStats(productId);
    return NextResponse.json({ ok: true, data: createdUnits });
  } catch (err: any) {
    console.error("POST /api/product-units error:", err);
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}


export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { unitId, quantity = 1 } = body;

    if (!unitId) {
      return NextResponse.json({ ok: false, error: "unitId required" }, { status: 400 });
    }

    // Найти карточку
    const unit = await prisma.productUnit.findUnique({ where: { id: unitId } });
    if (!unit) {
      return NextResponse.json({ ok: false, error: "ProductUnit not found" }, { status: 404 });
    }

    // Обновляем статус и количество кандидата
    const updatedUnit = await prisma.productUnit.update({
      where: { id: unitId },
      data: {
        statusCard: ProductUnitCardStatus.CANDIDATE,
        quantityInCandidate: quantity,
        createdAtCandidate: new Date(),
        logs: appendLog(unit.logs || [], {
          event: "ADDED_TO_CANDIDATE",
          at: new Date().toISOString(),
          quantity,
          parentId: unit.parentProductUnitId ?? null,
        }),
      },
    });

    // Пересчитать статистику продукта
    await recalcProductUnitStats(unit.productId);

    return NextResponse.json({ ok: true, data: updatedUnit });
  } catch (err: any) {
    console.error("PATCH /api/product-units/patch-add-candidate error:", err);
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}