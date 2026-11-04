import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Plus, LayoutGrid, List, ArrowUpDown, Filter } from "lucide-react";
import { AppShell, StatusBadge } from "@/components/app-shell";
import { LOB_META, PRODUCTS, STATUS_META, STATUS_TOTALS, type LineOfBusiness, type Status } from "@/lib/mock-data";

export const Route = createFileRoute("/products")({
  head: () => ({
    meta: [
      { title: "Продукты — Фабрика продуктов" },
      { name: "description", content: "Каталог страховых продуктов с фильтрами по статусу и линии бизнеса" },
      { property: "og:title", content: "Продукты — Фабрика продуктов" },
      { property: "og:description", content: "Каталог страховых продуктов с фильтрами по статусу и линии бизнеса" },
    ],
  }),
  component: ProductsPage,
});

const STATUS_ORDER: Status[] = ["draft", "review", "sale", "support", "closed"];

function ProductsPage() {
  const nav = useNavigate();
  const [status, setStatus] = useState<Status | "all">("all");
  const [lob, setLob] = useState<LineOfBusiness | "all">("all");
  const [view, setView] = useState<"table" | "grid">("table");
  const [mine, setMine] = useState(false);

  const rows = useMemo(
    () => PRODUCTS.filter((p) => (status === "all" || p.status === status) && (lob === "all" || p.lob === lob) && (!mine || p.owner === "И. Блудов")),
    [status, lob, mine],
  );
  const total = Object.values(STATUS_TOTALS).reduce((a, b) => a + b, 0);

  return (
    <AppShell crumbs={[{ label: "Продукты" }]}>
      <div className="mb-5 flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Продукты</h1>
          <p className="mt-1 text-sm text-muted-foreground">{total} продуктов · 12 черновиков ждут заполнения</p>
        </div>
        <button className="inline-flex h-10 items-center gap-2 rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-sm hover:opacity-90">
          <Plus className="size-4" /> Новый продукт
        </button>
      </div>

      {/* Status segmented tabs replace accordions */}
      <div className="mb-4 flex flex-wrap items-center gap-2 border-b">
        {(["all", ...STATUS_ORDER] as const).map((s) => {
          const active = status === s;
          const label = s === "all" ? "Все" : STATUS_META[s].label;
          const count = s === "all" ? total : STATUS_TOTALS[s];
          return (
            <button key={s} onClick={() => setStatus(s)} className={`-mb-px flex items-center gap-2 border-b-2 px-3 pb-2.5 pt-1 text-sm font-semibold transition-colors ${active ? "border-primary text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"}`}>
              {s !== "all" && <span className={`size-2 rounded-full ${STATUS_META[s].dot}`} />}
              {label}
              <span className={`rounded-full px-1.5 text-xs ${active ? "bg-primary-soft text-primary" : "bg-muted"}`}>{count}</span>
            </button>
          );
        })}
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <div className="flex rounded-md border bg-card p-0.5">
          {(["all", "ИСЖ", "НСЖ", "ДСЖ"] as const).map((l) => (
            <button key={l} title={l === "all" ? "Все линии бизнеса" : LOB_META[l]} onClick={() => setLob(l)} className={`rounded px-3 py-1 text-sm font-medium ${lob === l ? "bg-primary-soft text-primary" : "text-muted-foreground hover:text-foreground"}`}>
              {l === "all" ? "Все линии" : l}
            </button>
          ))}
        </div>
        <button onClick={() => setMine(!mine)} className={`rounded-md border px-3 py-1.5 text-sm font-medium ${mine ? "border-primary bg-primary-soft text-primary" : "bg-card text-muted-foreground"}`}>Мои продукты</button>
        <button className="inline-flex items-center gap-1.5 rounded-md border bg-card px-3 py-1.5 text-sm text-muted-foreground"><Filter className="size-3.5" />Ещё фильтры</button>
        <div className="ml-auto flex items-center gap-2 text-sm text-muted-foreground">
          <span>Показано {rows.length}</span>
          <div className="flex rounded-md border bg-card p-0.5">
            <button aria-label="Таблица" onClick={() => setView("table")} className={`rounded p-1.5 ${view === "table" ? "bg-muted text-foreground" : ""}`}><List className="size-4" /></button>
            <button aria-label="Плитка" onClick={() => setView("grid")} className={`rounded p-1.5 ${view === "grid" ? "bg-muted text-foreground" : ""}`}><LayoutGrid className="size-4" /></button>
          </div>
        </div>
      </div>

      {view === "table" ? (
        <div className="overflow-hidden rounded-xl border bg-card">
          <table className="w-full text-sm">
            <thead className="bg-muted/60 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-5 py-3">Наименование <ArrowUpDown className="inline size-3" /></th>
                <th className="px-3 py-3">Линия</th>
                <th className="px-3 py-3">Статус</th>
                <th className="px-3 py-3">Версия</th>
                <th className="px-3 py-3">Программ</th>
                <th className="px-3 py-3">Заполненность</th>
                <th className="px-3 py-3">Ответственный</th>
                <th className="px-5 py-3 text-right">Изменён</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((p) => (
                <tr key={p.id} onClick={() => nav({ to: "/products/$productId", params: { productId: p.id } })} className="cursor-pointer border-t transition-colors hover:bg-accent">
                  <td className="px-5 py-3">
                    <Link to="/products/$productId" params={{ productId: p.id }} className="font-semibold hover:text-primary">{p.name}</Link>
                    <div className="font-mono text-xs text-muted-foreground">{p.code}</div>
                  </td>
                  <td className="px-3 py-3"><span title={LOB_META[p.lob]} className="rounded bg-secondary px-1.5 py-0.5 text-xs font-semibold">{p.lob}</span></td>
                  <td className="px-3 py-3"><StatusBadge {...STATUS_META[p.status]} /></td>
                  <td className="px-3 py-3 tabular-nums">v{p.version}</td>
                  <td className="px-3 py-3 tabular-nums">{p.programs}</td>
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-20 overflow-hidden rounded-full bg-muted"><div className={`h-full ${p.completeness === 100 ? "bg-success" : "bg-primary"}`} style={{ width: `${p.completeness}%` }} /></div>
                      <span className="text-xs tabular-nums text-muted-foreground">{p.completeness}%</span>
                    </div>
                  </td>
                  <td className="px-3 py-3 text-muted-foreground">{p.owner}</td>
                  <td className="px-5 py-3 text-right tabular-nums text-muted-foreground">{p.updatedAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {rows.length === 0 && <div className="p-10 text-center text-sm text-muted-foreground">Нет продуктов под выбранные фильтры. <button className="font-semibold text-primary" onClick={() => { setStatus("all"); setLob("all"); setMine(false); }}>Сбросить фильтры</button></div>}
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-3">
          {rows.map((p) => (
            <Link key={p.id} to="/products/$productId" params={{ productId: p.id }} className="flex flex-col gap-3 rounded-xl border bg-card p-4 transition-shadow hover:shadow-md">
              <div className="flex items-center justify-between"><span className="rounded bg-secondary px-1.5 py-0.5 text-xs font-semibold">{p.lob}</span><StatusBadge {...STATUS_META[p.status]} /></div>
              <div className="font-semibold leading-snug">{p.name}</div>
              <div className="mt-auto flex justify-between text-xs text-muted-foreground"><span>v{p.version} · {p.programs} прогр.</span><span>{p.updatedAt}</span></div>
            </Link>
          ))}
        </div>
      )}
    </AppShell>
  );
}
