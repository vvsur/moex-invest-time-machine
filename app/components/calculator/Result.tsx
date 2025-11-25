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
          <span className="font-medium text-gray-900">{data.buyDate}</span>
        </div>

        <div className="flex flex-col">
          <span className="text-gray-600 text-sm">Дата продажи</span>
          <span className="font-medium text-gray-900">{data.sellDate}</span>
        </div>

        <div className="flex flex-col">
          <span className="text-gray-600 text-sm">Цена покупки</span>
          <span className="font-medium text-gray-900">
            {data.buyPrice.toFixed(2)} ₽
          </span>
        </div>

        <div className="flex flex-col">
          <span className="text-gray-600 text-sm">Цена продажи</span>
          <span className="font-medium text-gray-900">
            {data.sellPrice.toFixed(2)} ₽
          </span>
        </div>

        <div className="flex flex-col">
          <span className="text-gray-600 text-sm">Доходность</span>
          <span
            className={
              "font-semibold " + (isProfit ? "text-green-600" : "text-red-600")
            }
          >
            {data.profitPercent.toFixed(2)} %
          </span>
        </div>

        <div className="flex flex-col">
          <span className="text-gray-600 text-sm">Доход</span>
          <span
            className={
              "font-semibold " + (isProfit ? "text-green-600" : "text-red-600")
            }
          >
            {data.profit.toFixed(2)} ₽
          </span>
        </div>

        <div className="flex flex-col md:col-span-2">
          <span className="text-gray-600 text-sm">Итоговая сумма</span>
          <span className="font-semibold text-gray-900 text-lg">
            {data.finalAmount.toFixed(2)} ₽
          </span>
        </div>
      </div>
    </div>
  );
}
