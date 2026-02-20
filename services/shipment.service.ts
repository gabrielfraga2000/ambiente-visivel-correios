import { prisma } from "@/lib/prisma";
import { fetchOrdersWithTracking } from "@/services/bling.service";
import { ShipmentFilters } from "@/types/shipment";

export async function syncShipments() {
  const orders = await fetchOrdersWithTracking();

  const upserts = orders.map((order) => {
    const status = normalizeStatus(order.rastreamento.situacao);

    return prisma.shipment.upsert({
      where: { trackingCode: order.rastreamento.codigo },
      create: {
        orderNumber: order.numero,
        customerName: order.cliente.nome,
        trackingCode: order.rastreamento.codigo,
        carrier: order.rastreamento.transportadora,
        status,
        postedAt: new Date(order.rastreamento.dataPostagem),
        lastUpdate: new Date(order.rastreamento.ultimaAtualizacao),
      },
      update: {
        orderNumber: order.numero,
        customerName: order.cliente.nome,
        carrier: order.rastreamento.transportadora,
        status,
        postedAt: new Date(order.rastreamento.dataPostagem),
        lastUpdate: new Date(order.rastreamento.ultimaAtualizacao),
      },
    });
  });

  await prisma.$transaction(upserts);

  return { processed: upserts.length };
}

function normalizeStatus(status: string) {
  const upper = status.toUpperCase();
  if (upper.includes("ENTREG")) return "ENTREGUE";
  if (upper.includes("TRANSIT")) return "EM_TRANSITO";
  return upper || "PENDENTE";
}

export async function listShipments(filters: ShipmentFilters) {
  const where = {
    ...(filters.status ? { status: filters.status } : {}),
    ...(filters.customer
      ? { customerName: { contains: filters.customer, mode: "insensitive" as const } }
      : {}),
    ...(filters.code
      ? { trackingCode: { contains: filters.code, mode: "insensitive" as const } }
      : {}),
    ...(filters.startDate || filters.endDate
      ? {
          postedAt: {
            ...(filters.startDate ? { gte: new Date(filters.startDate) } : {}),
            ...(filters.endDate ? { lte: new Date(filters.endDate) } : {}),
          },
        }
      : {}),
  };

  const shipments = await prisma.shipment.findMany({
    where,
    orderBy: { lastUpdate: "desc" },
  });

  const now = Date.now();

  const stats = {
    total: shipments.length,
    inTransit: shipments.filter((shipment) => shipment.status === "EM_TRANSITO").length,
    delivered: shipments.filter((shipment) => shipment.status === "ENTREGUE").length,
    delayed: shipments.filter(
      (shipment) =>
        shipment.status !== "ENTREGUE" && (now - shipment.lastUpdate.getTime()) / (1000 * 60 * 60 * 24) > 5
    ).length,
  };

  return { shipments, stats };
}

export async function getShipmentDetails(id: string) {
  return prisma.shipment.findUnique({ where: { id } });
}

export async function syncActiveShipments() {
  const active = await prisma.shipment.findMany({
    where: { status: { not: "ENTREGUE" } },
  });

  if (!active.length) return { processed: 0 };

  return syncShipments();
}
