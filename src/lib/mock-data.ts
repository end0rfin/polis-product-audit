export type Status = "draft" | "review" | "sale" | "support" | "closed";
export type LineOfBusiness = "ИСЖ" | "НСЖ" | "ДСЖ";

export const STATUS_META: Record<Status, { label: string; tone: string; dot: string }> = {
  draft: { label: "Черновик", tone: "bg-neutral-soft text-muted-foreground", dot: "bg-muted-foreground" },
  review: { label: "На согласовании", tone: "bg-warning-soft text-warning", dot: "bg-warning" },
  sale: { label: "В продаже", tone: "bg-success-soft text-success", dot: "bg-success" },
  support: { label: "На сопровождении", tone: "bg-info-soft text-info", dot: "bg-info" },
  closed: { label: "Обслуживание завершено", tone: "bg-neutral-soft text-muted-foreground", dot: "bg-border" },
};

export const LOB_META: Record<LineOfBusiness, string> = {
  ИСЖ: "Инвестиционное страхование жизни",
  НСЖ: "Накопительное страхование жизни",
  ДСЖ: "Добровольное страхование жизни",
};

export interface Product {
  id: string;
  code: string;
  name: string;
  lob: LineOfBusiness;
  version: string;
  status: Status;
  updatedAt: string;
  owner: string;
  programs: number;
  completeness: number;
}

const names: [string, LineOfBusiness][] = [
  ["Сам, придумал сам и в тесте", "ДСЖ"],
  ["Закрытый капитал", "ИСЖ"],
  ["ДСЖ ПУ Выгодный процент 5", "ДСЖ"],
  ["Мотивация 2.0", "НСЖ"],
  ["Жизнь под защитой", "ДСЖ"],
  ["Нужная страховка Здоровье + Работа", "ДСЖ"],
  ["ДСЖ ПК Конструктор (Агентский) Здоровье", "ДСЖ"],
  ["ДСЖ ПК Конструктор (Агентский) НПР", "ДСЖ"],
  ["Смарт Полис Детям", "НСЖ"],
  ["Капитал Плюс", "ИСЖ"],
  ["Семейный актив", "НСЖ"],
  ["Стратегия на пять", "ИСЖ"],
  ["Надёжное будущее", "НСЖ"],
  ["Индекс Технологий", "ИСЖ"],
  ["Забота о близких", "ДСЖ"],
  ["Доходный курс 3.0", "ИСЖ"],
];
const statuses: Status[] = ["draft", "review", "sale", "sale", "support", "closed"];
const owners = ["И. Блудов", "А. Смирнова", "Д. Ковалёв", "Е. Орлова"];

export const PRODUCTS: Product[] = names.map(([name, lob], i) => ({
  id: `p${i + 1}`,
  code: i === 0 ? "NEXT_TIME_DSJ" : `PRD_${(1000 + i * 37).toString()}`,
  name,
  lob,
  version: i % 3 === 0 ? "1.0" : i % 3 === 1 ? "2.1" : "3.0",
  status: i === 0 ? "draft" : statuses[i % statuses.length],
  updatedAt: `${String(((i * 3) % 27) + 1).padStart(2, "0")}.10.2026`,
  owner: owners[i % owners.length],
  programs: (i % 4) + 1,
  completeness: i === 0 ? 72 : 60 + ((i * 13) % 41),
}));

export const STATUS_TOTALS: Record<Status, number> = {
  draft: 12,
  review: 19,
  sale: 73,
  support: 55,
  closed: 73,
};

export interface Characteristic {
  id: string;
  name: string;
  value: string | null;
}

export interface Program {
  id: string;
  code: string;
  name: string;
  risks: number;
  series: number;
  characteristics: Characteristic[];
  fields: { label: string; value: string | null; hint?: string }[];
}

export const PROGRAMS: Program[] = [
  {
    id: "pr1",
    code: "SP_PROGRAMMA_PRODUKTA",
    name: "Программа продукта 1",
    risks: 1,
    series: 1,
    characteristics: [
      { id: "c1", name: "ТМ", value: null },
      { id: "c2", name: "Полис учтён на стороне банка?", value: "Да" },
    ],
    fields: [
      { label: "Наименование программы", value: "Программа продукта 1" },
      { label: "Код программы", value: "SP_PROGRAMMA_PRODUKTA" },
      { label: "Учётная группа", value: null },
      { label: "Тип страхового риска по МСФО 17", value: null },
      { label: "Обременительность", value: "0" },
      { label: "Источник данных по графику платежей", value: "ОИС" },
      { label: "Период охлаждения", value: "0 дней" },
      { label: "Франшиза", value: "0 дней", hint: "Количество дней для недобровольной потери работы" },
      { label: "Ввод покрытий и выкупных сумм в опциях", value: "Расчёт в ОИС", hint: "Для инвестиционных продуктов" },
    ],
  },
  {
    id: "pr2",
    code: "SP_VYYDU_NOCHYU_NA_KUKHNYU_S_KOTOM",
    name: "Выйду ночью на кухню с котом",
    risks: 3,
    series: 2,
    characteristics: [{ id: "c3", name: "Полис учтён на стороне банка?", value: "Нет" }],
    fields: [],
  },
  {
    id: "pr3",
    code: "NEW_TIME_PROGRAM",
    name: "Время новой программы",
    risks: 0,
    series: 0,
    characteristics: [],
    fields: [],
  },
];

export const PRODUCT_FIELDS = [
  { label: "Код", value: "NEXT_TIME_DSJ", mono: true },
  { label: "Версия", value: "1.0" },
  { label: "Наименование", value: "Сам, придумал сам и в тесте" },
  { label: "Линия бизнеса", value: "ДСЖ" },
  { label: "Дата создания", value: "22.10.2026" },
  { label: "Групповой полис", value: "Нет" },
  { label: "Валюта", value: "RUB" },
  { label: "Канал продаж", value: null },
  { label: "Срок страхования", value: "1–5 лет" },
];
