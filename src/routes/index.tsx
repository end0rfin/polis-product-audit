import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { AppShell } from "@/components/app-shell";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "UX/UI-аудит — Фабрика страховых продуктов" },
      { name: "description", content: "Аудит четырёх экранов фабрики продуктов по эвристикам Нильсена и концепция улучшенного интерфейса" },
      { property: "og:title", content: "UX/UI-аудит — Фабрика страховых продуктов" },
      { property: "og:description", content: "Аудит четырёх экранов и концепция улучшенного интерфейса" },
    ],
  }),
  component: Audit,
});

type Sev = "Критично" | "Высоко" | "Средне";
const sevTone: Record<Sev, string> = { Критично: "bg-destructive-soft text-destructive", Высоко: "bg-warning-soft text-warning", Средне: "bg-info-soft text-info" };

const screens = [
  {
    n: "01", title: "Список продуктов", to: "/products" as const,
    job: "Найти нужный продукт по названию/статусу/линии бизнеса или начать новый.",
    primary: "Открыть продукт · «Новый продукт»",
    secondary: "Фильтр по линии бизнеса (ИСЖ/НСЖ/ДСЖ), смена статуса-группы, поиск.",
    friction: [
      "Статусы как аккордеоны: чтобы сравнить «В работе» и «В продаже», нужно раскрыть оба и скроллить; открытый «Завершено» выталкивает актуальное вниз.",
      "Карточки показывают только линию, название и версию — нет статуса, кода, даты, ответственного. Для 232 продуктов плитка без сортировки — поиск глазами.",
      "Левая панель с 4 пунктами занимает 17% ширины ради одного фильтра; «ИСЖ/НСЖ/ДСЖ» без расшифровки.",
      "Пользовательское меню смешивает навигацию (Продукты, Справочники) и «Выйти» — разделы спрятаны.",
      "«Показать ещё» внутри аккордеона — нет общего счётчика «показано N из M».",
    ],
    fix: "Табы статусов со счётчиками + сегмент линии бизнеса + таблица (код, статус, версия, заполненность, ответственный, дата) с переключением на плитку. Навигация вынесена в верхнюю панель.",
  },
  {
    n: "02", title: "Карточка продукта", to: "/products/$productId" as const,
    job: "Понять состояние продукта и довести черновик до согласования.",
    primary: "Отправить на согласование",
    secondary: "Редактировать сведения, добавить программу/характеристику, скачать реестр, удалить.",
    friction: [
      "«Отправить на согласование» стоит в шапке сайта, отдельно от продукта — непонятно, к чему относится; доступна без проверки полноты.",
      "Основная информация в блоке с внутренним скроллом — 5 полей из N, остальное скрыто.",
      "Иконка корзины рядом с версией в заголовке — удаление продукта в один клик без подтверждения.",
      "Три кнопки «Добавить» одинакового веса + по 2 иконки на каждую строку: 10+ одинаково ярких элементов, нет фокуса.",
      "Программы показаны без рисков/серий — нельзя увидеть, какая программа не готова, не заходя в неё.",
      "«Шаблон реестра» — целая колонка ради одной цифры 370/374.",
    ],
    fix: "Шапка продукта со статусом, кодом (копируется) и единственной primary-кнопкой, заблокированной до готовности. Справа — чек-лист готовности, реестр, история. Программы — список с метриками и предупреждениями; действия по hover.",
  },
  {
    n: "03", title: "Программа: основные сведения", to: "/programs/$programId" as const,
    job: "Проверить и заполнить параметры программы.",
    primary: "Изменить сведения",
    secondary: "Переход к рискам, сериям, характеристикам.",
    friction: [
      "Нумерованный список 1–4 выглядит как мастер (wizard), но это разделы — ложная модель «шагов».",
      "«Пусто», «-» и «0» используются для отсутствия значения — нельзя отличить «не заполнено» от «ноль».",
      "9 полей в сетке 3×3 без группировки: МСФО-параметры смешаны с параметрами договора.",
      "Заголовок «Программа продукта1» дублируется в шапке и в карточке; единица «(дни)» живёт в подписи, а не в значении.",
      "«Отправить на согласование» на уровне программы — неясно, отправляется программа или продукт.",
    ],
    fix: "Табы вместо псевдо-шагов, хлебные крошки Продукты → Продукт → Программа, группы полей, единый маркер «Не заполнено» и баннер с количеством пустых обязательных полей.",
  },
  {
    n: "04", title: "Характеристики программы", to: "/programs/$programId" as const,
    job: "Задать значения характеристик программы.",
    primary: "Добавить / указать значение",
    secondary: "Изменить, удалить.",
    friction: [
      "Колонка «Значение» пустая у обеих строк — нет индикации, что это проблема.",
      "Редактирование через иконку-карандаш открывает отдельную форму ради одного поля.",
      "Иконки действий стоят слева, перед названием — взгляд сначала натыкается на «удалить».",
      "Корзина без подтверждения и без отмены.",
    ],
    fix: "Inline-редактирование значения кликом по ячейке (Enter — сохранить, Esc — отменить), «Не заполнено» подсвечено, действия справа и только при наведении.",
  },
];

const heuristics: { h: string; issue: string; sol: string; sev: Sev }[] = [
  { h: "1. Видимость статуса", issue: "Статус «Черновик» — только текст; нет индикатора готовности; после действий нет обратной связи.", sol: "Цветной бейдж статуса во всех списках, чек-лист готовности, toast после сохранения/удаления.", sev: "Высоко" },
  { h: "2. Язык пользователя", issue: "Аббревиатуры ИСЖ/НСЖ/ДСЖ без расшифровки; «Количество полей выбрано/всего».", sol: "Tooltip с полным названием линии бизнеса, формулировка «370 из 374 полей выбрано».", sev: "Средне" },
  { h: "3. Контроль и свобода", issue: "Удаление в один клик; нет хлебных крошек — только стрелка «назад».", sol: "Диалог подтверждения + undo 10 с; крошки Продукты → Продукт → Программа.", sev: "Критично" },
  { h: "4. Консистентность", issue: "«Добавить» в шапке блока vs иконки в строке; редактирование то иконкой, то кнопкой; 3 варианта пустого значения.", sol: "Единый паттерн Panel (заголовок + счётчик + ghost-кнопка), единый маркер «Не заполнено».", sev: "Высоко" },
  { h: "5. Предотвращение ошибок", issue: "Отправка на согласование доступна для неполного продукта.", sol: "Кнопка заблокирована с подсказкой, что именно не заполнено.", sev: "Критично" },
  { h: "6. Узнавание", issue: "Чтобы понять, готова ли программа, нужно в неё зайти.", sol: "Метрики риски/серии/хар-ки прямо в списке программ, предупреждение при нуле.", sev: "Высоко" },
  { h: "7. Гибкость", issue: "Нет сортировки, «моих продуктов», горячих клавиш.", sol: "Сортировка в таблице, фильтр «Мои», ⌘K-поиск по коду и названию.", sev: "Средне" },
  { h: "8. Минимализм", issue: "Серые «подложки» вокруг каждой карточки, крупные иконки-кнопки, огромные отступы.", sol: "Белые карточки с тонкой границей на светлом фоне, вторичные действия по hover.", sev: "Средне" },
];

const ui = [
  ["Иерархия", "Заголовок страницы (40px), заголовки блоков (24px) и статус (24px) конкурируют. Новая шкала: 24 / 15 / 14 / 12, вес вместо размера."],
  ["Цвет", "Фиолетовый CTA не связан с брендом «Сбер» (зелёный) и одинаков для primary и «Добавить». Primary — зелёный бренд, «Добавить» — ghost. Статусы получают семантические цвета."],
  ["Сетка", "Отступы 16–32px смешаны, двойные подложки съедают ~20% площади. Контейнер 1440px, шаг 4px, gap 20px."],
  ["Компоненты", "Иконки-кнопки 48×48 с тенью на каждой строке. Заменены на 32×32 ghost, видимые при наведении."],
  ["Пустые состояния", "Пустые ячейки без текста. Добавлены «Не заполнено» и пустые состояния с действием."],
  ["Данные", "Коды в обычном шрифте, нельзя скопировать. Моноширинный шрифт + копирование в один клик."],
];

const flows = [
  ["Найти продукт", "Было: раскрыть аккордеон → «Показать ещё» × N → глазами. Стало: ⌘K или таб статуса + сортировка → 1–2 действия."],
  ["Довести черновик до согласования", "Было: обойти все программы и разделы вручную, отправить вслепую. Стало: чек-лист справа ведёт к незаполненному, кнопка активируется сама."],
  ["Заполнить характеристику", "Было: карандаш → форма → сохранить → назад. Стало: клик по ячейке → ввод → Enter."],
];

function Audit() {
  return (
    <AppShell>
      <section className="mb-10 grid grid-cols-[1.4fr_1fr] gap-8 pt-6">
        <div>
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-primary">UX/UI-аудит · 4 экрана</p>
          <h1 className="text-4xl font-extrabold leading-tight tracking-tight">Фабрика страховых продуктов: от «посмотреть» к «довести до согласования»</h1>
          <p className="mt-4 max-w-2xl text-muted-foreground">Главная проблема текущего интерфейса — он показывает данные, но не помогает менеджеру понять, что осталось сделать. Концепция строится вокруг статуса и готовности продукта.</p>
          <div className="mt-6 flex gap-2">
            <Link to="/products" className="inline-flex h-10 items-center gap-2 rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground">Открыть прототип <ArrowRight className="size-4" /></Link>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 self-end">
          {[["2", "критичных риска потери данных"], ["−60%", "кликов до нужного продукта"], ["1", "primary-действие на экран"], ["0", "скрытых полей во вложенных скроллах"]].map(([v, l]) => (
            <div key={l} className="rounded-xl border bg-card p-4"><div className="text-2xl font-extrabold text-primary">{v}</div><div className="text-xs text-muted-foreground">{l}</div></div>
          ))}
        </div>
      </section>

      <div className="mb-6 rounded-xl border bg-card p-5 text-sm">
        <b>Допущения и вопросы.</b> <span className="text-muted-foreground">Считаем, что согласование отправляется по продукту целиком (а не по программе) — подтвердите. Нужен ли отдельный статус «На согласовании» в списке? Сколько обязательных полей у программы и кто их определяет? Есть ли роль «только просмотр» у руководителя проекта?</span>
      </div>

      <H>1. Первичная оценка экранов</H>
      <div className="mb-12 space-y-4">
        {screens.map((s) => (
          <article key={s.n} className="grid grid-cols-[240px_1fr_1fr] gap-6 rounded-xl border bg-card p-6">
            <div>
              <div className="font-mono text-xs text-muted-foreground">{s.n}</div>
              <h3 className="text-lg font-bold">{s.title}</h3>
              <dl className="mt-3 space-y-2 text-sm">
                <div><dt className="text-xs text-muted-foreground">Задача</dt><dd>{s.job}</dd></div>
                <div><dt className="text-xs text-muted-foreground">Primary</dt><dd className="font-semibold">{s.primary}</dd></div>
                <div><dt className="text-xs text-muted-foreground">Вторичные</dt><dd>{s.secondary}</dd></div>
              </dl>
            </div>
            <div>
              <h4 className="mb-2 text-xs font-bold uppercase tracking-wide text-destructive">Точки трения</h4>
              <ul className="list-disc space-y-1.5 pl-4 text-sm">{s.friction.map((f) => <li key={f}>{f}</li>)}</ul>
            </div>
            <div className="flex flex-col">
              <h4 className="mb-2 text-xs font-bold uppercase tracking-wide text-primary">Решение</h4>
              <p className="text-sm">{s.fix}</p>
              <Link to={s.to} params={{ productId: "p1", programId: "pr1" } as never} search={(s.n === "04" ? { tab: "chars" } : {}) as never} className="mt-auto inline-flex items-center gap-1 pt-4 text-sm font-semibold text-primary">Смотреть концепцию <ArrowRight className="size-4" /></Link>
            </div>
          </article>
        ))}
      </div>

      <H>2. Эвристики Нильсена</H>
      <div className="mb-12 overflow-hidden rounded-xl border bg-card">
        <table className="w-full text-sm">
          <thead className="bg-muted/60 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground"><tr><th className="px-5 py-3 w-52">Эвристика</th><th className="px-3 py-3">Проблема</th><th className="px-3 py-3">Решение</th><th className="px-5 py-3 w-32">Важность</th></tr></thead>
          <tbody>{heuristics.map((r) => (
            <tr key={r.h} className="border-t align-top"><td className="px-5 py-3 font-semibold">{r.h}</td><td className="px-3 py-3">{r.issue}</td><td className="px-3 py-3">{r.sol}</td><td className="px-5 py-3"><span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${sevTone[r.sev]}`}>{r.sev}</span></td></tr>
          ))}</tbody>
        </table>
      </div>

      <H>3. UI-аудит</H>
      <div className="mb-12 grid grid-cols-3 gap-4">
        {ui.map(([t, d]) => <div key={t} className="rounded-xl border bg-card p-5"><h3 className="mb-1.5 font-bold">{t}</h3><p className="text-sm text-muted-foreground">{d}</p></div>)}
      </div>

      <H>4. Информационная архитектура</H>
      <div className="mb-12 grid grid-cols-[1fr_1.4fr] gap-4">
        <div className="rounded-xl border bg-card p-5 font-mono text-sm leading-7">
          <div className="mb-2 font-sans text-xs font-bold uppercase tracking-wide text-muted-foreground">Новая структура</div>
          Верхняя панель: Продукты · Справочники · ⌘K<br />
          └ Продукты (табы статусов, фильтры)<br />
          &nbsp;&nbsp;└ Продукт (сведения, программы, хар-ки, реестр)<br />
          &nbsp;&nbsp;&nbsp;&nbsp;└ Программа<br />
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;├ Основные сведения<br />
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;├ Риски · Серии<br />
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;└ Характеристики
        </div>
        <div className="space-y-3">
          {flows.map(([t, d]) => <div key={t} className="rounded-xl border bg-card p-5"><h3 className="font-bold">{t}</h3><p className="mt-1 text-sm text-muted-foreground">{d}</p></div>)}
          <div className="rounded-xl border bg-card p-5 text-sm"><b>Убрано дублирование:</b> <span className="text-muted-foreground">навигация из меню профиля; «Отправить на согласование» с экранов программы; повтор названия программы в шапке и карточке.</span></div>
        </div>
      </div>

      <H>5. Концепция</H>
      <div className="grid grid-cols-4 gap-4">
        {screens.map((s) => (
          <Link key={s.n} to={s.to} params={{ productId: "p1", programId: "pr1" } as never} search={(s.n === "04" ? { tab: "chars" } : {}) as never} className="group rounded-xl border bg-card p-5 hover:border-primary">
            <div className="font-mono text-xs text-muted-foreground">{s.n}</div>
            <div className="mt-1 font-bold group-hover:text-primary">{s.title}</div>
            <div className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-primary">Открыть <ArrowRight className="size-4" /></div>
          </Link>
        ))}
      </div>
    </AppShell>
  );
}

function H({ children }: { children: React.ReactNode }) {
  return <h2 className="mb-4 text-xl font-extrabold tracking-tight">{children}</h2>;
}
