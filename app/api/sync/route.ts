import { NextRequest, NextResponse } from "next/server";
import { syncActiveShipments, syncShipments } from "@/services/shipment.service";

function isCronAuthorized(request: NextRequest) {
  const auth = request.headers.get("authorization");
  const bearer = auth?.replace("Bearer ", "");
  return bearer && bearer === process.env.CRON_SECRET;
}

export async function POST(request: NextRequest) {
  try {
    const fromCron = request.headers.get("x-vercel-cron") === "1";

    if (fromCron && !isCronAuthorized(request)) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const result = fromCron ? await syncActiveShipments() : await syncShipments();
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      {
        error: "Falha ao sincronizar encomendas",
        details: String(error),
      },
      { status: 500 }
    );
  }
}
