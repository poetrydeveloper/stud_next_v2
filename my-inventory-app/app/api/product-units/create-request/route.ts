import { NextResponse } from "next/server";
import { RequestService } from "@/app/lib/requestService";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { unitId, quantity } = body;

    if (!unitId || !quantity) {
      return NextResponse.json({ ok: false, error: "unitId and quantity required" }, { status: 400 });
    }

    const result = await RequestService.createRequest(unitId, quantity);

    if (result.success) {
      return NextResponse.json({ ok: true, data: result.data });
    } else {
      return NextResponse.json({ ok: false, error: result.error }, { status: 400 });
    }
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}
