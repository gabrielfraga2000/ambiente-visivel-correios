"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FormEvent } from "react";

export function DashboardFilters() {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const next = new URLSearchParams(params.toString());

    ["status", "customer", "code", "startDate", "endDate"].forEach((key) => {
      const value = String(formData.get(key) ?? "").trim();
      if (value) next.set(key, value);
      else next.delete(key);
    });

    router.push(`${pathname}?${next.toString()}`);
  }

  return (
    <form className="card grid gap-3 md:grid-cols-5" onSubmit={handleSubmit}>
      <select name="status" defaultValue={params.get("status") ?? ""} className="rounded border p-2">
        <option value="">Todos os status</option>
        <option value="EM_TRANSITO">Em trânsito</option>
        <option value="ENTREGUE">Entregue</option>
        <option value="PENDENTE">Pendente</option>
      </select>
      <input name="customer" placeholder="Buscar por cliente" defaultValue={params.get("customer") ?? ""} className="rounded border p-2" />
      <input name="code" placeholder="Código de rastreio" defaultValue={params.get("code") ?? ""} className="rounded border p-2" />
      <input type="date" name="startDate" defaultValue={params.get("startDate") ?? ""} className="rounded border p-2" />
      <div className="flex gap-2">
        <input type="date" name="endDate" defaultValue={params.get("endDate") ?? ""} className="w-full rounded border p-2" />
        <button className="rounded bg-brand-500 px-4 py-2 font-medium text-white">Filtrar</button>
      </div>
    </form>
  );
}
