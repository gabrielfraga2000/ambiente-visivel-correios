"use client";

import { useState } from "react";

export function ManualSyncButton() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function runSync() {
    setLoading(true);
    setMessage(null);
    try {
      const response = await fetch("/api/sync", { method: "POST" });
      const data = await response.json();
      setMessage(`Atualização concluída: ${data.processed ?? 0} pedidos processados.`);
    } catch {
      setMessage("Não foi possível atualizar no momento.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-2">
      <button onClick={runSync} disabled={loading} className="rounded bg-brand-500 px-3 py-2 text-white disabled:opacity-70">
        {loading ? "Atualizando..." : "Atualizar manualmente"}
      </button>
      {message && <p className="text-sm text-slate-600">{message}</p>}
    </div>
  );
}
