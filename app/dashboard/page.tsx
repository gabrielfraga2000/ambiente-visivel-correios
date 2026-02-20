import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { listShipments } from "@/services/shipment.service";
import { DashboardFilters } from "@/components/dashboard-filters";
import { StatsCards } from "@/components/stats-cards";
import { ShipmentTable } from "@/components/shipment-table";
import { LogoutButton } from "@/components/logout-button";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const { shipments, stats } = await listShipments({
    status: typeof searchParams.status === "string" ? searchParams.status : undefined,
    customer: typeof searchParams.customer === "string" ? searchParams.customer : undefined,
    code: typeof searchParams.code === "string" ? searchParams.code : undefined,
    startDate: typeof searchParams.startDate === "string" ? searchParams.startDate : undefined,
    endDate: typeof searchParams.endDate === "string" ? searchParams.endDate : undefined,
  });

  return (
    <main className="mx-auto max-w-7xl space-y-4 p-4">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Dashboard de Encomendas</h1>
        <LogoutButton />
      </header>
      <StatsCards stats={stats} />
      <DashboardFilters />
      <ShipmentTable shipments={shipments} />
    </main>
  );
}
