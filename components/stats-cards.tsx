interface Stats {
  total: number;
  inTransit: number;
  delivered: number;
  delayed: number;
}

export function StatsCards({ stats }: { stats: Stats }) {
  const cards = [
    { title: "Total em trânsito", value: stats.inTransit },
    { title: "Entregues", value: stats.delivered },
    { title: "Atrasadas", value: stats.delayed },
    { title: "Total geral", value: stats.total },
  ];

  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <div key={card.title} className="card">
          <p className="text-sm text-slate-500">{card.title}</p>
          <p className="text-3xl font-semibold text-brand-700">{card.value}</p>
        </div>
      ))}
    </section>
  );
}
