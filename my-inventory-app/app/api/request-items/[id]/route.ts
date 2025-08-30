// app/api/request-items/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";

// PATCH /api/request-items/:id - обновление товара
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const body = await request.json();
    
    const updatedItem = await prisma.requestItem.update({
      where: { id },
      data: {
        ...(body.status && { status: body.status }),
        ...(body.supplierId !== undefined && { supplierId: body.supplierId }),
        ...(body.customerId !== undefined && { customerId: body.customerId }),
        ...(body.quantity && { quantity: body.quantity }),
        ...(body.pricePerUnit && { pricePerUnit: body.pricePerUnit })
      },
      include: {
        product: {
          include: {
            images: {
              where: { isMain: true },
              take: 1
            }
          }
        },
        supplier: true,
        customer: true
      }
    });

    return NextResponse.json(updatedItem);
  } catch (error) {
    console.error('Error updating request item:', error);
    return NextResponse.json(
      { error: 'Ошибка при обновлении товара' },
      { status: 500 }
    );
  }
}

// DELETE /api/request-items/:id - удаление товара
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    
    await prisma.requestItem.delete({
      where: { id }
    });

    return NextResponse.json({ message: 'Товар удален' });
  } catch (error) {
    console.error('Error deleting request item:', error);
    return NextResponse.json(
      { error: 'Ошибка при удалении товара' },
      { status: 500 }
    );
  }
}