"use client";

interface ResultProps {
  data: {
    buyDate: string;
    sellDate: string;
    buyPrice: number;
    sellPrice: number;
    profit: number;
    profitPercent: number;
    finalAmount: number;
  };
}

// Формат ₽: 123456 → "123 456 ₽"
const formatMoney = (value: number) =>
  value.toLocaleString("ru-RU", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }) + " ₽";

// Формат %: 12.5 → "12.50 %"
const formatPercent = (value: number) =>
  value.toLocaleString("ru-RU", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }) + " %";

// Формат даты ISO → dd.mm.yyyy
const formatDate = (iso: string) => {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso; // fallback если странный формат
  return d.toLocaleDateString("ru-RU"); // dd.mm.yyyy
};

export function Result({ data }: ResultProps) {
  const isProfit = data.profit >= 0;

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-900">
        Результат расчёта
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        <div className="flex flex-col">
          <span className="text-gray-600 text-sm">Дата покупки</span>
          <span className="font-medium text-gray-900">
            {formatDate(data.buyDate)}
          </span>
        </div>

        <div className="flex flex-col">
          <span className="text-gray-600 text-sm">Дата продажи</span>
          <span className="font-medium text-gray-900">
            {formatDate(data.sellDate)}
          </span>
        </div>

        <div className="flex flex-col">
          <span className="text-gray-600 text-sm">Цена покупки</span>
          <span className="font-medium text-gray-900">
            {formatMoney(data.buyPrice)}
          </span>
        </div>

        <div className="flex flex-col">
          <span className="text-gray-600 text-sm">Цена продажи</span>
          <span className="font-medium text-gray-900">
            {formatMoney(data.sellPrice)}
          </span>
        </div>

        <div className="flex flex-col">
          <span className="text-gray-600 text-sm">Доходность</span>
          <span
            className={
              "font-semibold " + (isProfit ? "text-green-600" : "text-red-600")
            }
          >
            {formatPercent(data.profitPercent)}
          </span>
        </div>

        <div className="flex flex-col">
          <span className="text-gray-600 text-sm">Доход</span>
          <span
            className={
              "font-semibold " + (isProfit ? "text-green-600" : "text-red-600")
            }
          >
            {formatMoney(data.profit)}
          </span>
        </div>

        <div className="flex flex-col md:col-span-2">
          <span className="text-gray-600 text-sm">Итоговая сумма</span>
          <span className="font-semibold text-gray-900 text-lg">
            {formatMoney(data.finalAmount)}
          </span>
        </div>

      </div>
    </div>
  );
}
