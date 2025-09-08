// app/api/customers/route.ts
// import { NextResponse } from "next/server";
// import prisma from "@/app/lib/prisma";

// export async function GET() {
//   const customers = await prisma.customer.findMany({
//     orderBy: { name: 'asc' }
//   });
//   return NextResponse.json(customers);
// }

// export async function POST(request: Request) {
//   const body = await request.json();
//   const customer = await prisma.customer.create({
//     data: {
//       name: body.name,
//       phone: body.phone,
//       email: body.email,
//       notes: body.notes
//     }
//   });
//   return NextResponse.json(customer, { status: 201 });
// }
// app/api/customers/route.ts
import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";

// Получить всех покупателей
export async function GET() {
  try {
    const customers = await prisma.customer.findMany({
      orderBy: { name: "asc" },
    });
    return NextResponse.json(customers);
  } catch (error) {
    console.error("Ошибка при получении покупателей:", error);
    return NextResponse.json(
      { error: "Ошибка при получении покупателей" },
      { status: 500 }
    );
  }
}
