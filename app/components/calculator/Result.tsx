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

  // 10 вариантов заключения
  const conclusions = [
    {
      condition: roi > 20,
      text:
        "Отличная инвестиция! Высокая общая доходность говорит о том, что вы удачно выбрали точку входа. Такой результат редко бывает случайным — рынок действительно рос, а инвестиция себя оправдала.",
    },
    {
      condition: irr !== null && irr > 15,
      text:
        "Инвестиция получилась очень сильной — высокая внутренняя норма доходности говорит, что деньги работали эффективно всё время владения.",
    },
    {
      condition: roi > 5 && roi <= 20,
      text:
        "Хорошая инвестиция. Доходность уверенно выше депозита, а результат на горизонте выглядит стабильным. Такие вложения обычно считаются удачными.",
    },
    {
      condition: cagr !== null && cagr > 5,
      text:
        "Инвестиция развивалась лучше рынка: CAGR показывает устойчивый рост. Это признак качественной точки входа и хорошей динамики бумаги.",
    },
    {
      condition: roi > 0 && roi <= 5,
      text:
        "Инвестиция дала небольшой, но положительный результат. Скромная доходность, но капитал не потерян и даже немного вырос.",
    },
    {
      condition: roi === 0,
      text:
        "Инвестиция вышла в ноль — и это уже хорошо. Вы купили актив по цене, которая оказалась рынку близка к справедливой.",
    },
    {
      condition: roi < 0 && roi > -5,
      text:
        "Небольшой минус. Такое бывает при боковом рынке или относительно нейтральном периоде. Сильной ошибки в выборе точки входа не было.",
    },
    {
      condition: roi <= -5 && roi > -15,
      text:
        "Инвестиция спорная: просадка ощутима, но не критична. Часто такое случается при временной слабости рынка или высокой волатильности.",
    },
    {
      condition: roi <= -15,
      text:
        "Инвестиция оказалась неудачной — существенный убыток. Такое бывает на падающем рынке или при неудачной точке входа. Хороший повод пересмотреть стратегию.",
    },
    {
      condition: irr !== null && irr < 0,
      text:
        "Отрицательный IRR означает, что вложенные деньги работали хуже нуля. Это классический сигнал, что период владения был неудачным.",
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
