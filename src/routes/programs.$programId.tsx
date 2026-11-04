import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Pencil, Trash2, Plus, Info, Check, X } from "lucide-react";
import { AppShell, Panel, Empty, StatusBadge } from "@/components/app-shell";
import { PROGRAMS, PRODUCTS, STATUS_META } from "@/lib/mock-data";

type Tab = "info" | "risks" | "series" | "chars";

export const Route = createFileRoute("/programs/$programId")({
  validateSearch: (s: Record<string, unknown>): { tab?: Tab | undefined } => ({
    tab: ["info", "risks", "series", "chars"].includes(s["tab"] as string) ? (s["tab"] as Tab) : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Программа продукта — Фабрика продуктов" },
      { name: "description", content: "Сведения, риски, серии и характеристики программы страхования" },
      { property: "og:title", content: "Программа продукта — Фабрика продуктов" },
      { property: "og:description", content: "Сведения, риски, серии и характеристики программы страхования" },
    ],
  }),
  component: ProgramPage,
});

function ProgramPage() {
  const { programId } = Route.useParams();
  const { tab = "info" } = Route.useSearch();
  const pr = PROGRAMS.find((x) => x.id === programId) ?? PROGRAMS[0]!;
  const product = PRODUCTS[0]!;
  const [chars, setChars] = useState(pr.characteristics);
  const [editing, setEditing] = useState<string | null>(null);
  const [draft, setDraft] = useState("");

  const tabs: { id: Tab; label: string; count?: number }[] = [
    { id: "info", label: "Основные сведения" },
    { id: "risks", label: "Риски", count: pr.risks },
    { id: "series", label: "Серии", count: pr.series },
    { id: "chars", label: "Характеристики", count: chars.length },
  ];
  const fields = pr.fields.length ? pr.fields : PROGRAMS[0]!.fields;
  const empty = fields.filter((f) => !f.value).length;

  return (
    <AppShell crumbs={[{ label: "Продукты", to: "/products" }, { label: product.name, to: "/products/$productId", params: { productId: product.id } }, { label: pr.name }]}>
      <div className="mb-5 flex items-end justify-between rounded-xl border bg-card px-6 pt-5">
        <div>
          <div className="mb-1.5 flex items-center gap-2 text-xs text-muted-foreground">
            <span className="font-semibold uppercase tracking-wide">Программа</span>·<StatusBadge {...STATUS_META[product.status]} />
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight">{pr.name}</h1>
          <div className="font-mono text-xs text-muted-foreground">{pr.code}</div>
          <nav className="mt-4 flex gap-1">
            {tabs.map((t) => (
              <Link key={t.id} to="/programs/$programId" params={{ programId: pr.id }} search={{ tab: t.id }} className={`-mb-px flex items-center gap-2 border-b-2 px-3 pb-3 text-sm font-semibold ${tab === t.id ? "border-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}>
                {t.label}
                {t.count !== undefined && <span className={`rounded-full px-1.5 text-xs ${t.count === 0 ? "bg-warning-soft text-warning" : "bg-muted"}`}>{t.count}</span>}
              </Link>
            ))}
          </nav>
        </div>
        <div className="mb-5 flex gap-2">
          <Link to="/products/$productId" params={{ productId: product.id }} className="rounded-md border px-3 py-2 text-sm font-medium hover:bg-muted">К продукту</Link>
        </div>
      </div>

      {tab === "info" && (
        <Panel title="Основные сведения" action={<button className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary"><Pencil className="size-3.5" />Изменить</button>}>
          {empty > 0 && <div className="mx-5 mt-4 flex items-center gap-2 rounded-md bg-warning-soft px-3 py-2 text-sm text-warning"><Info className="size-4" />Не заполнено полей: {empty}. Они обязательны для согласования.</div>}
          <div className="grid grid-cols-2 gap-x-10 p-5">
            {[{ t: "Идентификация", f: fields.slice(0, 3) }, { t: "Учёт и МСФО 17", f: fields.slice(3, 6) }, { t: "Параметры договора", f: fields.slice(6) }].map((g) => (
              <div key={g.t} className="mb-6">
                <h3 className="mb-2 text-xs font-bold uppercase tracking-wide text-muted-foreground">{g.t}</h3>
                <dl className="divide-y rounded-lg border">
                  {g.f.map((f) => (
                    <div key={f.label} className="grid grid-cols-[1fr_1fr] gap-4 px-4 py-2.5 text-sm">
                      <dt className="text-muted-foreground">{f.label}{f.hint && <div className="text-xs opacity-75">{f.hint}</div>}</dt>
                      <dd className="font-semibold">{f.value ?? <span className="font-medium text-warning">Не заполнено</span>}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            ))}
          </div>
        </Panel>
      )}

      {(tab === "risks" || tab === "series") && (
        <Panel title={tab === "risks" ? "Риски" : "Серии"} count={tab === "risks" ? pr.risks : pr.series} action={<button className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-sm font-semibold text-primary hover:bg-primary-soft"><Plus className="size-4" />Добавить</button>}>
          <Empty text="Раздел оформляется по тому же паттерну таблицы, что и характеристики." />
        </Panel>
      )}

      {tab === "chars" && (
        <Panel title="Характеристики программы" count={chars.length} action={
          <button onClick={() => { const id = crypto.randomUUID(); setChars([...chars, { id, name: "Новая характеристика", value: null }]); setEditing(id); setDraft(""); }} className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-sm font-semibold text-primary hover:bg-primary-soft"><Plus className="size-4" />Добавить</button>
        }>
          {chars.length === 0 ? <Empty text="У программы нет характеристик." /> : (
            <table className="w-full text-sm">
              <thead className="text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                <tr><th className="px-5 py-2.5">Наименование</th><th className="px-3 py-2.5">Значение</th><th className="w-24" /></tr>
              </thead>
              <tbody>
                {chars.map((c) => (
                  <tr key={c.id} className="group border-t hover:bg-accent">
                    <td className="px-5 py-3 font-medium">{c.name}</td>
                    <td className="px-3 py-2">
                      {editing === c.id ? (
                        <form className="flex items-center gap-1" onSubmit={(e) => { e.preventDefault(); setChars(chars.map((x) => x.id === c.id ? { ...x, value: draft || null } : x)); setEditing(null); }}>
                          <input autoFocus value={draft} onChange={(e) => setDraft(e.target.value)} onKeyDown={(e) => e.key === "Escape" && setEditing(null)} className="h-8 flex-1 rounded-md border bg-background px-2 outline-none focus:ring-2 focus:ring-ring" placeholder="Введите значение" />
                          <button aria-label="Сохранить" className="grid size-8 place-items-center rounded-md text-success hover:bg-success-soft"><Check className="size-4" /></button>
                          <button type="button" aria-label="Отмена" onClick={() => setEditing(null)} className="grid size-8 place-items-center rounded-md text-muted-foreground hover:bg-muted"><X className="size-4" /></button>
                        </form>
                      ) : (
                        <button onClick={() => { setEditing(c.id); setDraft(c.value ?? ""); }} className="w-full rounded px-1 py-1 text-left hover:bg-card">{c.value ?? <span className="text-warning">Не заполнено — нажмите, чтобы указать</span>}</button>
                      )}
                    </td>
                    <td className="px-3 text-right">
                      <div className="flex justify-end opacity-0 group-hover:opacity-100">
                        <button aria-label="Удалить" onClick={() => setChars(chars.filter((x) => x.id !== c.id))} className="grid size-8 place-items-center rounded-md text-muted-foreground hover:bg-muted hover:text-destructive"><Trash2 className="size-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Panel>
      )}
    </AppShell>
  );
}
