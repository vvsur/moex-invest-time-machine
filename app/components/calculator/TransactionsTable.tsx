"use client";

import { CalcTransaction } from "./types/CalcResult";

const formatMoney = (value: number) =>
    isNaN(value)
        ? "—"
        : value.toLocaleString("ru-RU", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }) + " ₽";

const formatDate = (iso: string) => {
    if (!iso) return "";
    const d = new Date(iso);
    return isNaN(d.getTime()) ? iso : d.toLocaleDateString("ru-RU");
};

export function TransactionsTable({ transactions }: { transactions: CalcTransaction[] }) {
    if (!transactions || transactions.length === 0) return null;

    return (
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
                        {transactions.map((t, i) => (
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
    );
}
