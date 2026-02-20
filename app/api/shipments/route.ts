import { NextRequest, NextResponse } from "next/server";
import { listShipments } from "@/services/shipment.service";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const result = await listShipments({
    status: searchParams.get("status") ?? undefined,
    customer: searchParams.get("customer") ?? undefined,
    code: searchParams.get("code") ?? undefined,
    startDate: searchParams.get("startDate") ?? undefined,
    endDate: searchParams.get("endDate") ?? undefined,
  });

  return NextResponse.json(result);
}
