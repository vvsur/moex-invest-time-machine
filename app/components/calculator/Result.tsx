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
   📌 Новый компонент — "Заключение об инвестиции"
-------------------------------------------------------- */
function InvestmentSummary({ data }: { data: CalcResult }) {
  const profit = data.profit;
  const roi = data.profitPercent;
  const irr = data.irr;
  const cagr = data.cagr;

  const days =
    (new Date(data.sellDate).getTime() -
      new Date(data.buyDate).getTime()) /
    (1000 * 3600 * 24);

  const annual = irr !== null ? irr : (cagr ?? null);

  const conclusions = [
    {
      condition: irr !== null && irr < 0,
      priority: 1,
      text: "Отрицательный IRR означает, что регулярные вложения работали в минус. Это указывает на неблагоприятную рыночную динамику на протяжении всего периода.",
    },
    {
      condition: irr === null && cagr !== null && cagr < 0,
      priority: 1,
      text: "Отрицательный CAGR говорит о том, что актив терял стоимость на всём горизонте. Это классический сигнал неблагоприятного тренда.",
    },
    {
      condition: annual !== null && annual > 20,
      priority: 2,
      text: "Вы показали выдающуюся годовую доходность — значительно выше рынка. Инвестиция однозначно успешная.",
    },
    {
      condition: annual !== null && annual > 10,
      priority: 2,
      text: "Инвестиция существенно обогнала рынок. Это сильный результат и хорошее решение по таймингу.",
    },
    {
      condition: annual !== null && annual > 5,
      priority: 2,
      text: "Инвестиция показала устойчивый рост выше инфляции и консервативных инструментов. Хороший, сбалансированный результат.",
    },
    {
      condition: annual !== null && annual > 0,
      priority: 3,
      text: "Небольшая, но положительная доходность — результат нейтрально-позитивный. Капитал вырос, и это хорошо.",
    },
    {
      condition: annual !== null && annual > -5,
      priority: 3,
      text: "Лёгкая просадка. Такое часто бывает при коррекциях рынка, и обычно не считается серьёзной ошибкой.",
    },
    {
      condition: annual !== null && annual > -15,
      priority: 4,
      text: "Инвестиция показала слабый результат. Просадка ощутима, но находится в рамках стандартной волатильности рынка.",
    },
    {
      condition: annual !== null && annual <= -15,
      priority: 4,
      text: "Сильная отрицательная доходность — инвестиция оказалась неудачной. Стоит пересмотреть стратегию или тайминг входа.",
    },
    {
      condition: annual === 0,
      priority: 5,
      text: "Инвестиция вышла примерно в ноль — это означает, что вы вошли по близкой к справедливой цене.",
    },
  ];



  // выбираем первое подходящее заключение
  const conclusion =
    conclusions.find((c) => c.condition)?.text ??
    "Инвестиция имеет нейтральный результат. Показатели не дают ярко выраженной оценки.";

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
              <b>Дата покупки и продажи</b> корректируются до ближайшего
              торгового дня.
            </li>
            <li>
              <b>ROI</b> — доходность на всём периоде:
              <br /> <i>(конечная сумма − вложения) / вложения × 100%</i>
            </li>
            <li>
              <b>Регулярные взносы</b> покупают акции по цене на дату взноса.
            </li>
            <li>
              <b>IRR (XIRR)</b> — внутренняя норма доходности.
            </li>
            <li>
              <b>CAGR</b> — среднегодовой темп роста.
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
          label="Общий объем инвестиций"
          value={formatMoney(data.totalInvested)}
          full
        />

        <Info label="IRR" value={formatPercent(data.irr)} full />
        <Info label="CAGR" value={formatPercent(data.cagr)} full />
      </div>

      {/* --------- Новый блок "мнение" --------- */}
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
