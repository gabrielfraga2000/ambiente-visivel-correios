import Link from "next/link";

interface ShipmentRow {
  id: string;
  orderNumber: string;
  customerName: string;
  trackingCode: string;
  status: string;
  postedAt: Date;
  lastUpdate: Date;
}

function daysInTransit(postedAt: Date) {
  return Math.max(0, Math.floor((Date.now() - postedAt.getTime()) / (1000 * 60 * 60 * 24)));
}

export function ShipmentTable({ shipments }: { shipments: ShipmentRow[] }) {
  return (
    <div className="card overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="border-b text-left text-slate-600">
            <th className="p-2">Pedido</th>
            <th className="p-2">Cliente</th>
            <th className="p-2">Código de rastreio</th>
            <th className="p-2">Status</th>
            <th className="p-2">Dias em trânsito</th>
            <th className="p-2">Última atualização</th>
            <th className="p-2">Ações</th>
          </tr>
        </thead>
        <tbody>
          {shipments.map((shipment) => (
            <tr key={shipment.id} className="border-b">
              <td className="p-2">{shipment.orderNumber}</td>
              <td className="p-2">{shipment.customerName}</td>
              <td className="p-2">{shipment.trackingCode}</td>
              <td className="p-2">{shipment.status}</td>
              <td className="p-2">{daysInTransit(shipment.postedAt)}</td>
              <td className="p-2">{new Date(shipment.lastUpdate).toLocaleString("pt-BR")}</td>
              <td className="p-2">
                <Link href={`/dashboard/${shipment.id}`} className="rounded bg-slate-900 px-3 py-1 text-white">
                  Ver detalhes
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {!shipments.length && <p className="p-4 text-center text-slate-500">Nenhuma encomenda encontrada.</p>}
    </div>
  );
}
