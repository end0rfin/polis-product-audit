import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Pencil, Trash2, Plus, Download, Copy, MoreHorizontal, CheckCircle2, Circle, AlertTriangle, ChevronRight, Send } from "lucide-react";
import { AppShell, Panel, StatusBadge, Empty } from "@/components/app-shell";
import { PRODUCTS, PRODUCT_FIELDS, PROGRAMS, STATUS_META } from "@/lib/mock-data";

export const Route = createFileRoute("/products_/$productId")({
  head: () => ({
    meta: [
      { title: "Карточка продукта — Фабрика продуктов" },
      { name: "description", content: "Основные сведения, программы, характеристики и реестр продукта" },
      { property: "og:title", content: "Карточка продукта — Фабрика продуктов" },
      { property: "og:description", content: "Основные сведения, программы, характеристики и реестр продукта" },
    ],
  }),
  component: ProductPage,
});

function ProductPage() {
  const { productId } = Route.useParams();
  const p = PRODUCTS.find((x) => x.id === productId) ?? PRODUCTS[0];
  const [chars, setChars] = useState([{ id: "pc1", name: "Полис учтён на стороне банка?", value: "Да" }]);
  const [confirm, setConfirm] = useState<string | null>(null);

  const checklist = [
    { label: "Основные сведения", done: true },
    { label: "Программы и риски", done: true, note: "1 программа без рисков" },
    { label: "Характеристики продукта", done: chars.length > 0 },
    { label: "Шаблон реестра", done: false, note: "4 обязательных поля не выбраны" },
  ];
  const ready = checklist.filter((c) => c.done).length;

  return (
    <AppShell crumbs={[{ label: "Продукты", to: "/products" }, { label: p.name }]}>
      {/* Sticky header with single primary action */}
      <div className="mb-5 flex items-start justify-between gap-6 rounded-xl border bg-card px-6 py-5">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <StatusBadge {...STATUS_META[p.status]} />
            <span className="rounded bg-secondary px-1.5 py-0.5 text-xs font-semibold">{p.lob}</span>
            <span className="text-xs text-muted-foreground">v{p.version} · изменён {p.updatedAt} · {p.owner}</span>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight">{p.name}</h1>
          <button className="mt-1 inline-flex items-center gap-1.5 font-mono text-xs text-muted-foreground hover:text-foreground" onClick={() => navigator.clipboard?.writeText(p.code)}>{p.code}<Copy className="size-3" /></button>
        </div>
        <div className="flex items-center gap-2">
          <button className="inline-flex h-10 items-center gap-2 rounded-md border bg-card px-3 text-sm font-medium hover:bg-muted"><Copy className="size-4" />Новая версия</button>
          <button aria-label="Ещё" className="grid size-10 place-items-center rounded-md border hover:bg-muted"><MoreHorizontal className="size-4" /></button>
          <button disabled={ready < checklist.length} title={ready < checklist.length ? "Заполните все разделы" : undefined} className="inline-flex h-10 items-center gap-2 rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground disabled:cursor-not-allowed disabled:opacity-50">
            <Send className="size-4" />Отправить на согласование
          </button>
        </div>
      </div>

      <div className="grid grid-cols-[1fr_340px] gap-5">
        <div className="space-y-5">
          <Panel title="Программы" count={PROGRAMS.length} action={<AddBtn label="Программа" />}>
            <ul>
              {PROGRAMS.map((pr) => (
                <li key={pr.id} className="group flex items-center gap-4 border-t px-5 py-3 first:border-t-0 hover:bg-accent">
                  <Link to="/programs/$programId" params={{ programId: pr.id }} className="flex-1">
                    <div className="font-semibold">{pr.name}</div>
                    <div className="font-mono text-xs text-muted-foreground">{pr.code}</div>
                  </Link>
                  <div className="flex gap-4 text-xs text-muted-foreground">
                    <span className={pr.risks === 0 ? "font-semibold text-warning" : ""}>{pr.risks === 0 && <AlertTriangle className="mr-1 inline size-3" />}Риски: {pr.risks}</span>
                    <span>Серии: {pr.series}</span>
                    <span>Хар-ки: {pr.characteristics.length}</span>
                  </div>
                  <div className="flex opacity-0 transition-opacity group-hover:opacity-100">
                    <IconBtn label="Удалить" danger onClick={() => setConfirm(pr.name)}><Trash2 className="size-4" /></IconBtn>
                  </div>
                  <ChevronRight className="size-4 text-muted-foreground" />
                </li>
              ))}
            </ul>
          </Panel>

          <Panel title="Характеристики продукта" count={chars.length} action={<AddBtn label="Характеристика" onClick={() => setChars([...chars, { id: crypto.randomUUID(), name: "Новая характеристика", value: "" }])} />}>
            {chars.length === 0 ? (
              <Empty text="Характеристики ещё не добавлены." />
            ) : (
              <table className="w-full text-sm">
                <thead className="text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  <tr><th className="px-5 py-2.5">Наименование</th><th className="px-3 py-2.5">Значение</th><th className="w-24" /></tr>
                </thead>
                <tbody>
                  {chars.map((c) => (
                    <tr key={c.id} className="group border-t hover:bg-accent">
                      <td className="px-5 py-3 font-medium">{c.name}</td>
                      <td className="px-3 py-3">{c.value || <span className="text-warning">Не заполнено</span>}</td>
                      <td className="px-3 py-2 text-right">
                        <div className="flex justify-end opacity-0 group-hover:opacity-100">
                          <IconBtn label="Изменить"><Pencil className="size-4" /></IconBtn>
                          <IconBtn label="Удалить" danger onClick={() => setChars(chars.filter((x) => x.id !== c.id))}><Trash2 className="size-4" /></IconBtn>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </Panel>

          <Panel title="Основные сведения" action={<button className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary"><Pencil className="size-3.5" />Изменить</button>}>
            <dl className="grid grid-cols-3 gap-x-6 gap-y-4 p-5">
              {PRODUCT_FIELDS.map((f) => (
                <div key={f.label}>
                  <dt className="text-xs text-muted-foreground">{f.label}</dt>
                  <dd className={`mt-0.5 text-sm font-semibold ${f.mono ? "font-mono" : ""}`}>{f.value ?? <span className="font-medium text-muted-foreground">—</span>}</dd>
                </div>
              ))}
            </dl>
          </Panel>
        </div>

        <aside className="space-y-5">
          <section className="rounded-xl border bg-card p-5">
            <div className="mb-1 flex items-center justify-between"><h2 className="text-[15px] font-bold">Готовность к согласованию</h2><span className="text-sm font-bold tabular-nums">{ready}/{checklist.length}</span></div>
            <div className="mb-4 h-1.5 overflow-hidden rounded-full bg-muted"><div className="h-full bg-primary" style={{ width: `${(ready / checklist.length) * 100}%` }} /></div>
            <ul className="space-y-3">
              {checklist.map((c) => (
                <li key={c.label} className="flex gap-2.5 text-sm">
                  {c.done ? <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-success" /> : <Circle className="mt-0.5 size-4 shrink-0 text-muted-foreground" />}
                  <div><div className="font-medium">{c.label}</div>{c.note && <div className="text-xs text-warning">{c.note}</div>}</div>
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-xl border bg-card p-5">
            <div className="mb-3 flex items-center justify-between"><h2 className="text-[15px] font-bold">Шаблон реестра</h2><IconBtn label="Скачать"><Download className="size-4" /></IconBtn></div>
            <div className="text-3xl font-extrabold tabular-nums">370<span className="text-lg text-muted-foreground">/374</span></div>
            <div className="text-xs text-muted-foreground">полей выбрано</div>
            <button className="mt-4 w-full rounded-md border py-2 text-sm font-semibold hover:bg-muted">Настроить поля</button>
          </section>

          <section className="rounded-xl border bg-card p-5 text-sm">
            <h2 className="mb-3 text-[15px] font-bold">История</h2>
            <ul className="space-y-2 text-muted-foreground">
              <li><b className="text-foreground">И. Блудов</b> добавил программу · 2 ч назад</li>
              <li><b className="text-foreground">И. Блудов</b> создал черновик · 22.10.2026</li>
            </ul>
          </section>
        </aside>
      </div>

      {confirm && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-foreground/30" onClick={() => setConfirm(null)}>
          <div className="w-[420px] rounded-xl bg-card p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold">Удалить программу?</h3>
            <p className="mt-2 text-sm text-muted-foreground">«{confirm}» будет удалена вместе с рисками, сериями и характеристиками. Действие можно отменить в течение 10 секунд.</p>
            <div className="mt-5 flex justify-end gap-2">
              <button onClick={() => setConfirm(null)} className="rounded-md border px-4 py-2 text-sm font-semibold">Отмена</button>
              <button onClick={() => setConfirm(null)} className="rounded-md bg-destructive px-4 py-2 text-sm font-semibold text-destructive-foreground">Удалить</button>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}

export function AddBtn({ label, onClick }: { label: string; onClick?: () => void }) {
  return (
    <button onClick={onClick} className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-sm font-semibold text-primary hover:bg-primary-soft">
      <Plus className="size-4" />{label}
    </button>
  );
}

export function IconBtn({ label, danger, onClick, children }: { label: string; danger?: boolean; onClick?: () => void; children: React.ReactNode }) {
  return (
    <button aria-label={label} title={label} onClick={(e) => { e.preventDefault(); onClick?.(); }} className={`grid size-8 place-items-center rounded-md text-muted-foreground hover:bg-muted ${danger ? "hover:text-destructive" : "hover:text-foreground"}`}>
      {children}
    </button>
  );
}
