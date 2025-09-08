// app/api/customers/new/route.ts
import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Валидация обязательных полей
    if (!body.name || body.name.trim() === "") {
      return NextResponse.json(
        { error: "Имя покупателя обязательно" },
        { status: 400 }
      );
    }

    if (!body.phone || body.phone.trim() === "") {
      return NextResponse.json(
        { error: "Телефон покупателя обязателен" },
        { status: 400 }
      );
    }

    // Проверка на уникальность по телефону
    const existingCustomer = await prisma.customer.findFirst({
      where: { phone: body.phone.trim() },
    });

    if (existingCustomer) {
      return NextResponse.json(
        { error: "Покупатель с таким телефоном уже существует" },
        { status: 409 }
      );
    }

    // Создание покупателя
    const customer = await prisma.customer.create({
      data: {
        name: body.name.trim(),
        phone: body.phone.trim(),
        email: body.email?.trim() || null,
        notes: body.notes?.trim() || null,
      },
    });

    return NextResponse.json(
      {
        message: "Покупатель успешно создан",
        customer: customer,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Ошибка при создании покупателя:", error);
    return NextResponse.json(
      { error: "Внутренняя ошибка сервера" },
      { status: 500 }
    );
  }
}
