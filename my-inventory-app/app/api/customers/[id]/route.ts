//app/api/customers/[id]/route.ts
import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";

interface Params {
  params: { id: string };
}

// GET - получить одного покупателя по ID
export async function GET(request: Request, { params }: Params) {
  try {
    const customer = await prisma.customer.findUnique({
      where: { id: parseInt(params.id) },
    });

    if (!customer) {
      return NextResponse.json(
        { error: "Покупатель не найден" },
        { status: 404 }
      );
    }

    return NextResponse.json(customer);
  } catch (error) {
    console.error("Ошибка при получении покупателя:", error);
    return NextResponse.json(
      { error: "Ошибка при получении покупателя" },
      { status: 500 }
    );
  }
}

// PUT - обновить покупателя
export async function PUT(request: Request, { params }: Params) {
  try {
    const body = await request.json();

    // Проверка существования покупателя
    const existingCustomer = await prisma.customer.findUnique({
      where: { id: parseInt(params.id) },
    });

    if (!existingCustomer) {
      return NextResponse.json(
        { error: "Покупатель не найден" },
        { status: 404 }
      );
    }

    // Проверка на уникальность телефона (исключая текущего покупателя)
    if (body.phone && body.phone !== existingCustomer.phone) {
      const phoneExists = await prisma.customer.findFirst({
        where: {
          phone: body.phone.trim(),
          id: { not: parseInt(params.id) }
        },
      });

      if (phoneExists) {
        return NextResponse.json(
          { error: "Покупатель с таким телефоном уже существует" },
          { status: 409 }
        );
      }
    }

    // Обновление покупателя
    const customer = await prisma.customer.update({
      where: { id: parseInt(params.id) },
      data: {
        name: body.name?.trim() || existingCustomer.name,
        phone: body.phone?.trim() || existingCustomer.phone,
        email: body.email?.trim() || null,
        notes: body.notes?.trim() || null,
      },
    });

    return NextResponse.json({
      message: "Покупатель успешно обновлен",
      customer: customer,
    });
  } catch (error) {
    console.error("Ошибка при обновлении покупателя:", error);
    return NextResponse.json(
      { error: "Внутренняя ошибка сервера" },
      { status: 500 }
    );
  }
}

// DELETE - удалить покупателя
export async function DELETE(request: Request, { params }: Params) {
  try {
    // Проверка существования покупателя
    const existingCustomer = await prisma.customer.findUnique({
      where: { id: parseInt(params.id) },
    });

    if (!existingCustomer) {
      return NextResponse.json(
        { error: "Покупатель не найден" },
        { status: 404 }
      );
    }

    // Удаление покупателя
    await prisma.customer.delete({
      where: { id: parseInt(params.id) },
    });

    return NextResponse.json(
      { message: "Покупатель успешно удален" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Ошибка при удалении покупателя:", error);
    return NextResponse.json(
      { error: "Внутренняя ошибка сервера" },
      { status: 500 }
    );
  }
}