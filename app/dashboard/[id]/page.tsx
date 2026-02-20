import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { authOptions } from "@/lib/auth";
import { getShipmentDetails } from "@/services/shipment.service";
import { ManualSyncButton } from "@/components/manual-sync-button";

export default async function ShipmentDetailsPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const shipment = await getShipmentDetails(params.id);
  if (!shipment) notFound();

  return (
    <main className="mx-auto max-w-3xl space-y-4 p-4">
      <Link href="/dashboard" className="text-sm text-slate-600 underline">
        ← Voltar ao dashboard
      </Link>
      <section className="card space-y-2">
        <h1 className="text-2xl font-semibold">Pedido {shipment.orderNumber}</h1>
        <p><strong>Cliente:</strong> {shipment.customerName}</p>
        <p><strong>Código de rastreio:</strong> {shipment.trackingCode}</p>
        <p><strong>Transportadora:</strong> {shipment.carrier}</p>
        <p><strong>Status atual:</strong> {shipment.status}</p>
        <p><strong>Data de postagem:</strong> {new Date(shipment.postedAt).toLocaleDateString("pt-BR")}</p>
        <p><strong>Última atualização:</strong> {new Date(shipment.lastUpdate).toLocaleString("pt-BR")}</p>
      </section>
      <section className="card">
        <h2 className="mb-2 text-lg font-medium">Linha do tempo</h2>
        <ol className="list-inside list-disc text-sm text-slate-700">
          <li>Postado em {new Date(shipment.postedAt).toLocaleString("pt-BR")}</li>
          <li>Status: {shipment.status}</li>
          <li>Última atualização em {new Date(shipment.lastUpdate).toLocaleString("pt-BR")}</li>
        </ol>
      </section>
      <ManualSyncButton />
    </main>
  );
}
