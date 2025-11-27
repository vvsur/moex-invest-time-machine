"use client";

import { useState } from "react";
import { CalcResult } from "./types/CalcResult";

interface ResultProps {
  data: CalcResult;
}

// Формат ₽
const formatMoney = (value: number) =>
  isNaN(value)
    ? "—"
    : value.toLocaleString("ru-RU", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }) + " ₽";

// Формат %
const formatPercent = (value: number | null) =>
  value === null || isNaN(value)
    ? "—"
    : value.toLocaleString("ru-RU", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }) + " %";

// ISO → dd.mm.yyyy
const formatDate = (iso: string) => {
  if (!iso) return "";
  const d = new Date(iso);
  return isNaN(d.getTime()) ? iso : d.toLocaleDateString("ru-RU");
};

/* -------------------------------------------------------
   📌 Компонент — Заключение об инвестиции
-------------------------------------------------------- */
function InvestmentSummary({ data }: { data: CalcResult }) {
  const { irr, cagr } = data;

  // Выбираем годовую доходность:
  // если есть IRR → он важнее, если нет → CAGR
  const annual =
    irr !== null && !isNaN(irr)
      ? irr
      : cagr !== null && !isNaN(cagr)
        ? cagr
        : null;

  // Если нет ни IRR, ни CAGR
  if (annual === null) {
    return (
      <div className="mt-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
        <h3 className="font-semibold text-gray-900 mb-2 text-lg">
          Что говорят цифры
        </h3>
        <p className="text-gray-700 leading-relaxed">
          Недостаточно данных для объективной оценки доходности.
        </p>
      </div>
    );
  }

  // Набор правил — строго по приоритетам
  const rules = [
    {
      condition: irr !== null && irr < 0,
      text: "Отрицательный IRR показывает, что регулярные вложения работали в минус. Это означает длительный неблагоприятный тренд или неудачный момент входа.",
    },
    {
      condition: irr === null && cagr !== null && cagr < 0,
      text: "Отрицательный CAGR означает, что актив снижался на всём горизонте. Это признак слабого тренда рынка или бумаги.",
    },
    {
      condition: annual > 20,
      text: "Вы показали выдающуюся годовую доходность — значительно выше рынка. Инвестиция однозначно успешная.",
    },
    {
      condition: annual > 10,
      text: "Инвестиция заметно обогнала рынок. Это сильный результат и правильный момент входа.",
    },
    {
      condition: annual > 5,
      text: "Инвестиция принесла уверенную доходность выше инфляции и большинства консервативных инструментов. Хороший сбалансированный результат.",
    },
    {
      condition: annual > 0,
      text: "Небольшая, но положительная годовая доходность. Результат нейтрально-позитивный: капитал вырос и сохранился.",
    },
    {
      condition: annual > -5,
      text: "Лёгкая просадка. Часто такое бывает на коррекциях рынка — серьёзной ошибки в моменте входа нет.",
    },
    {
      condition: annual > -15,
      text: "Умеренный убыток. Просадка ощутима, но находится в пределах обычной волатильности рынка.",
    },
    {
      condition: annual <= -15,
      text: "Инвестиция оказалась неудачной: доходность сильно отрицательная. Чаще всего это происходит на падающем рынке или при ошибке в тайминге входа.",
    },
  ];

  const conclusion =
    rules.find((r) => r.condition)?.text ||
    "Инвестиция имеет нейтральный результат. Показатели не дают однозначной оценки.";

  return (
    <div className="mt-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
      <h3 className="font-semibold text-gray-900 mb-2 text-lg">
        Что говорят цифры
      </h3>
      <p className="text-gray-700 leading-relaxed">ПРИМЕР: {conclusion}</p>
    </div>
  );
}

/* =======================================================
   Основной компонент Result
======================================================= */
export function Result({ data }: ResultProps) {
  const isProfit = data.profit >= 0;
  const [open, setOpen] = useState(false);

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 relative">
      {/* ---------- Заголовок + иконка подсказки ---------- */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900">
          Результат расчёта
        </h2>

        <button
          onClick={() => setOpen(!open)}
          className="w-6 h-6 flex items-center justify-center rounded-full 
             bg-[#E31E24] text-white hover:bg-red-700 
             transition text-sm cursor-pointer"
        >
          i
        </button>
      </div>

      {/* ---------- Popup-подсказка ---------- */}
      {open && (
        <div className="absolute right-4 top-12 z-30 w-80 p-4 bg-white border border-gray-300 rounded-lg shadow-xl text-sm leading-relaxed animate-fade-in">
          <h3 className="font-semibold mb-2">Как считается результат</h3>

          <ul className="list-disc pl-4 space-y-1">
            <li>
              <b>Дата покупки и продажи</b> корректируется до ближайшего
              торгового дня.
            </li>
            <li>
              <b>ROI</b> = (конечная сумма − вложения) / вложения × 100%.
            </li>
            <li>
              <b>IRR</b> — годовая доходность с учётом всех взносов.
            </li>
            <li>
              <b>CAGR</b> — среднегодовой темп роста (без взносов).
            </li>
            <li>
              <b>Стоимость портфеля</b> = кол-во акций × цена закрытия.
            </li>
          </ul>

          <button
            className="mt-3 w-full py-1.5 text-center bg-gray-100 rounded-md hover:bg-gray-200"
            onClick={() => setOpen(false)}
          >
            Понятно
          </button>
        </div>
      )}

      {/* === Основные показатели === */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Info label="Дата покупки" value={formatDate(data.buyDate)} />
        <Info label="Дата продажи" value={formatDate(data.sellDate)} />

        <Info label="Цена первой покупки" value={formatMoney(data.buyPrice)} />
        <Info label="Цена продажи" value={formatMoney(data.sellPrice)} />

        <Info
          label="Доходность (ROI)"
          value={formatPercent(data.profitPercent)}
          color={isProfit ? "text-green-600" : "text-red-600"}
        />

        <Info
          label="Доход"
          value={formatMoney(data.profit)}
          color={isProfit ? "text-green-600" : "text-red-600"}
        />

        <Info
          label="Итоговая сумма"
          value={formatMoney(data.finalAmount)}
          big
          full
        />

        <Info
          label="Общий объём инвестиций"
          value={formatMoney(data.totalInvested)}
          full
        />

        <Info label="IRR" value={formatPercent(data.irr)} full />
        <Info label="CAGR" value={formatPercent(data.cagr)} full />
      </div>

      {/* --------- Новый аналитический блок --------- */}
      <InvestmentSummary data={data} />
    </div>
  );
}

/* ------- UI helper ------- */
function Info({
  label,
  value,
  color,
  big,
  full,
}: {
  label: string;
  value: string;
  color?: string;
  big?: boolean;
  full?: boolean;
}) {
  return (
    <div className={full ? "col-span-2 flex flex-col" : "flex flex-col"}>
      <span className="text-gray-600 text-sm">{label}</span>
      <span
        className={`font-semibold text-gray-900 ${big ? "text-lg" : ""
          } ${color ?? ""}`}
      >
        {value}
      </span>
    </div>
  );
}
