import { createFileRoute } from "@tanstack/react-router";
import { AppShell, Empty } from "@/components/app-shell";

export const Route = createFileRoute("/dictionaries")({
  head: () => ({
    meta: [
      { title: "Справочники — Фабрика продуктов" },
      { name: "description", content: "Справочники фабрики страховых продуктов" },
      { property: "og:title", content: "Справочники — Фабрика продуктов" },
      { property: "og:description", content: "Справочники фабрики страховых продуктов" },
    ],
  }),
  component: () => (
    <AppShell crumbs={[{ label: "Справочники" }]}>
      <h1 className="mb-4 text-2xl font-extrabold">Справочники</h1>
      <div className="rounded-xl border bg-card"><Empty text="Раздел вне рамок этого аудита." /></div>
    </AppShell>
  ),
});
