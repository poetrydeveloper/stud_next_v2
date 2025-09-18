// app/api/request-items/route.ts
import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import { Prisma } from "@prisma/client";

// ==========================
// КЭШ ДЛЯ БЫСТРОГО ДОСТУПА
// ==========================

// В кэше будем хранить позиции и время последнего обновления
let requestItemsCache: any[] | null = null;
let lastCacheUpdate: number | null = null;

// Время жизни кэша (3 минуты)
const CACHE_TTL = 3 * 60 * 1000; // 3 минуты в миллисекундах

// Проверка, устарел ли кэш
function isCacheExpired() {
  if (!lastCacheUpdate) return true;
  return Date.now() - lastCacheUpdate > CACHE_TTL;
}

// Обновление кэша из БД
async function updateCacheFromDB() {
  const items = await prisma.requestItem.findMany({
    include: {
      product: {
        include: {
          images: true,
          category: true,
        },
      },
      request: true,
      supplier: true,
      customer: true,
    },
    orderBy: { id: "desc" },
  });

  // Добавляем вычисляемые поля
  requestItemsCache = items.map((it) => ({
    ...it,
    totalCost: (Number(it.pricePerUnit) * it.quantity).toString(),
    remainingQuantity: Math.max(0, it.quantity - (it.deliveredQuantity || 0)),
    deliveryProgress: `${it.deliveredQuantity || 0}/${it.quantity}`,
    supplierName: it.supplier?.name || null,
    customerName: it.customer?.name || null,
  }));

  lastCacheUpdate = Date.now();
  return requestItemsCache;
}

// ========================================
// POST /api/request-items — Добавление/обновление позиции
// ========================================
export async function POST(req: Request) {
  try {
    const {
      productId,
      status = "CANDIDATE",
      quantity = 1,
      pricePerUnit = "0",
      supplierId,
      customerId
    } = await req.json();

    // Валидация quantity
    const quantityNumber = Number(quantity);
    if (quantityNumber <= 0) {
      return NextResponse.json(
        { error: "Количество должно быть больше 0" },
        { status: 400 }
      );
    }

    // Валидация pricePerUnit
    const priceNumber = Number(pricePerUnit);
    if (priceNumber < 0) {
      return NextResponse.json(
        { error: "Цена не может быть отрицательной" },
        { status: 400 }
      );
    }

    // Проверим, что товар существует
    const product = await prisma.product.findUnique({
      where: { id: Number(productId) }
    });
    if (!product) {
      return NextResponse.json(
        { error: "Продукт не найден" },
        { status: 404 }
      );
    }

    // Если поставщик не указан, создаем или находим "Неизвестный поставщик"
    let finalSupplierId = supplierId;
    if (!finalSupplierId) {
      let defaultSupplier = await prisma.supplier.findFirst({
        where: { name: "Неизвестный поставщик" }
      });

      if (!defaultSupplier) {
        defaultSupplier = await prisma.supplier.create({
          data: {
            name: "Неизвестный поставщик",
            contactPerson: "Не указано",
            phone: "Не указано",
          },
        });
      }

      finalSupplierId = defaultSupplier.id;
    }

    // Проверим, есть ли уже RequestItem с этим продуктом и активным статусом
    const existingItem = await prisma.requestItem.findFirst({
      where: {
        productId: Number(productId),
        status: { in: ["CANDIDATE", "IN_REQUEST", "EXTRA"] },
      },
    });

    let item;

    if (existingItem) {
      // Обновляем существующий
      item = await prisma.requestItem.update({
        where: { id: existingItem.id },
        data: {
          status: status.toUpperCase(),
          quantity: quantityNumber,
          pricePerUnit: new Prisma.Decimal(priceNumber).toString(),
          supplierId: finalSupplierId,
          customerId: customerId || null,
        },
        include: {
          product: true,
          supplier: true,
          customer: true,
        },
      });
    } else {
      // Создаем новый
      item = await prisma.requestItem.create({
        data: {
          productId: product.id,
          status: status.toUpperCase(),
          quantity: quantityNumber,
          pricePerUnit: new Prisma.Decimal(priceNumber).toString(),
          supplierId: finalSupplierId,
          customerId: customerId || null,
          requestId: null,
        },
        include: {
          product: true,
          supplier: true,
          customer: true,
        },
      });
    }

    // После изменения — обновляем кэш, чтобы не ждать 3 минуты
    await updateCacheFromDB();

    return NextResponse.json(item, { status: 201 });
  } catch (e) {
    console.error("Ошибка в POST /api/request-items:", e);
    return NextResponse.json(
      { error: "Не удалось обновить позицию" },
      { status: 500 }
    );
  }
}

// ========================================
// GET /api/request-items?status=candidate|in_request|extra
// ========================================
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const statusParam = (searchParams.get("status") || "candidate").toUpperCase();

    const allowed = ["CANDIDATE", "IN_REQUEST", "EXTRA"];
    const status = allowed.includes(statusParam) ? statusParam : "CANDIDATE";

    // Если кэш пустой или устарел — обновляем его
    if (!requestItemsCache || isCacheExpired()) {
      await updateCacheFromDB();
    }

    // Возвращаем данные только с нужным статусом
    const filteredItems = requestItemsCache.filter(item => item.status === status);

    return NextResponse.json(filteredItems);
  } catch (e) {
    console.error("Ошибка в GET /api/request-items:", e);
    return NextResponse.json(
      { error: "Не удалось получить позиции" },
      { status: 500 }
    );
  }
}
