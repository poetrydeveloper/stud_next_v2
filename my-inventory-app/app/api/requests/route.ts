// app/api/requests/route.ts
import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";

// POST /api/requests
export async function POST() {
  const request = await prisma.request.create({
    data: {},
  });

  return NextResponse.json(request, { status: 201 });
}

export async function GET() {
  const requests = await prisma.request.findMany({
    include: {
      items: {
        include: { product: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(requests);
}