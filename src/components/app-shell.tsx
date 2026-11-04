import { Link, useRouterState } from "@tanstack/react-router";
import { Search, ChevronRight, Bell, Command } from "lucide-react";
import type { ReactNode } from "react";

export type Crumb = { label: string; to?: string; params?: Record<string, string> };

export function AppShell({ crumbs, children }: { crumbs?: Crumb[]; children: ReactNode }) {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const nav = [
    { to: "/products", label: "Продукты" },
    { to: "/dictionaries", label: "Справочники" },
    { to: "/", label: "Аудит" },
  ] as const;
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-30 border-b bg-card/90 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-[1440px] items-center gap-6 px-6">
          <Link to="/products" className="flex items-center gap-2">
            <span className="grid size-7 place-items-center rounded-md bg-primary text-xs font-extrabold text-primary-foreground">СЖ</span>
            <span className="text-sm font-bold leading-tight">Фабрика продуктов</span>
          </Link>
          <nav className="flex items-center gap-1">
            {nav.map((n) => {
              const active = n.to === "/" ? path === "/" : path.startsWith(n.to) || (n.to === "/products" && path.startsWith("/programs"));
              return (
                <Link key={n.to} to={n.to} className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${active ? "bg-primary-soft text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}>
                  {n.label}
                </Link>
              );
            })}
          </nav>
          <div className="ml-auto flex items-center gap-3">
            <label className="flex h-9 w-80 items-center gap-2 rounded-md border bg-background px-3 text-sm text-muted-foreground focus-within:ring-2 focus-within:ring-ring">
              <Search className="size-4" />
              <input className="flex-1 bg-transparent outline-none placeholder:text-muted-foreground" placeholder="Продукт, программа или код" />
              <kbd className="flex items-center gap-0.5 rounded border bg-card px-1.5 text-[10px]"><Command className="size-3" />K</kbd>
            </label>
            <button aria-label="Уведомления" className="grid size-9 place-items-center rounded-md text-muted-foreground hover:bg-muted"><Bell className="size-4" /></button>
            <div className="flex items-center gap-2">
              <span className="grid size-8 place-items-center rounded-full bg-secondary text-xs font-bold">ИБ</span>
              <div className="text-xs leading-tight"><div className="font-semibold">Игорь Блудов</div><div className="text-muted-foreground">Менеджер продуктов</div></div>
            </div>
          </div>
        </div>
      </header>
      {crumbs && (
        <div className="mx-auto flex max-w-[1440px] items-center gap-1 px-6 pt-5 text-sm text-muted-foreground">
          {crumbs.map((c, i) => (
            <span key={i} className="flex items-center gap-1">
              {i > 0 && <ChevronRight className="size-3.5" />}
              {c.to ? <Link to={c.to} params={c.params as never} className="hover:text-foreground">{c.label}</Link> : <span className="text-foreground">{c.label}</span>}
            </span>
          ))}
        </div>
      )}
      <main className="mx-auto max-w-[1440px] px-6 pb-16 pt-4">{children}</main>
    </div>
  );
}

export function StatusBadge({ label, tone, dot }: { label: string; tone: string; dot: string }) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ${tone}`}>
      <span className={`size-1.5 rounded-full ${dot}`} />
      {label}
    </span>
  );
}

export function Panel({ title, count, action, children, className = "" }: { title: string; count?: number; action?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <section className={`rounded-xl border bg-card ${className}`}>
      <div className="flex items-center justify-between border-b px-5 py-3.5">
        <h2 className="text-[15px] font-bold">{title}{count !== undefined && <span className="ml-2 font-medium text-muted-foreground">{count}</span>}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}

export function Empty({ text, action }: { text: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-3 px-6 py-10 text-center text-sm text-muted-foreground">
      <p>{text}</p>
      {action}
    </div>
  );
}
