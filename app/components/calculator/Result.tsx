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

        {/* Иконка "i" */}
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
              <b>Дата покупки и реализации</b> корректируются до ближайшего
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
              <b>IRR (XIRR)</b> — внутренняя норма доходности, учитывает даты и
              суммы всех взносов.
            </li>
            <li>
              <b>CAGR</b> — среднегодовой темп роста, если период ≥ 6 мес.
            </li>
            <li>
              <b>Стоимость портфеля</b> считается ежедневно:
              <br />
              <i>кол-во акций × цена закрытия</i>.
            </li>
          </ul>

          {/* -------- Новый раздел ------- */}
          <h3 className="font-semibold mt-4 mb-2">
            Как учитывается доходность с регулярными взносами
          </h3>

          <div className="space-y-2">
            <p>
              Расчёт строится по принципу <b>DCA</b> — каждая покупка считается
              отдельной партией по своей цене.
            </p>

            <p>
              <b>1) Начальная покупка:</b>
              <br />
              <i>количество = сумма / цена</i>
            </p>

            <p>
              <b>2) Регулярные взносы</b> (ежемесячно / ежеквартально / ежегодно)
              покупают новые партии акций по цене на дату взноса.
            </p>

            <p>
              <b>3) Итоговая стоимость:</b>
              <br />
              <i>сумма = все акции × цена реализации</i>
            </p>

            <p>
              <b>4) Доход:</b>
              <br />
              <i>финальная сумма − все вложения</i>
            </p>

            <p>
              <b>5) Доходность:</b>
              <br />
              <i>(доход / вложения) × 100%</i>
            </p>
          </div>

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
        <Info label="Дата реализации" value={formatDate(data.sellDate)} />

        <Info label="Цена первой покупки" value={formatMoney(data.buyPrice)} />
        <Info label="Цена реализации" value={formatMoney(data.sellPrice)} />

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

        <Info
          label="IRR (внутр. норма доходности)"
          value={formatPercent(data.irr)}
          full
        />

        <Info
          label="CAGR (среднегодовая доходность)"
          value={formatPercent(data.cagr)}
          full
        />
      </div>

      {/* === Таблица транзакций === */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-3">Транзакции</h3>

        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200 text-sm">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="p-2 text-left">Дата</th>
                <th className="p-2 text-right">Сумма</th>
                <th className="p-2 text-right">Цена</th>
                <th className="p-2 text-right">Обьем</th>
              </tr>
            </thead>

            <tbody>
              {data.transactions?.map((t, i) => (
                <tr key={i} className="border-b">
                  <td className="p-2">{formatDate(t.date)}</td>
                  <td className="p-2 text-right">{formatMoney(t.amount)}</td>
                  <td className="p-2 text-right">{formatMoney(t.price)}</td>
                  <td className="p-2 text-right">
                    {t.shares.toLocaleString("ru-RU", {
                      minimumFractionDigits: 4,
                      maximumFractionDigits: 4,
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
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
