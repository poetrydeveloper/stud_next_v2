// app/api/suppliers/route.ts
import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";

export async function GET() {
  const suppliers = await prisma.supplier.findMany({
    orderBy: { name: 'asc' }
  });
  return NextResponse.json(suppliers);
}

export async function POST(request: Request) {
  const body = await request.json();
  const supplier = await prisma.supplier.create({
    data: {
      name: body.name,
      contactPerson: body.contactPerson,
      phone: body.phone,
      notes: body.notes
    }
  });
  return NextResponse.json(supplier, { status: 201 });
}